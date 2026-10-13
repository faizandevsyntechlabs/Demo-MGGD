/**
 * Real Video Export & Encoding Engine
 * Requirements 6, 12, 31:
 * - Detects true browser MediaRecorder codec support.
 * - Does NOT mislabel WebM as MP4.
 * - Explains codec alpha limitations truthfully (MP4 has no alpha; WebM VP9 may support alpha).
 * - Real progressive encoding using canvas stream & time-stepped frame renderer.
 * - Full cancellation support.
 */

import { renderFrame, RESOLUTION_PRESETS } from './deterministicRenderer.js';

export function getSupportedVideoFormats() {
  if (typeof window === 'undefined' || !window.MediaRecorder) {
    return {
      hasMediaRecorder: false,
      formats: []
    };
  }

  const testCodecs = [
    { format: 'webm', mimeType: 'video/webm;codecs=vp9', label: 'WebM (VP9 - High Quality)', supportsAlpha: true },
    { format: 'webm', mimeType: 'video/webm;codecs=vp8', label: 'WebM (VP8 Standard)', supportsAlpha: false },
    { format: 'webm', mimeType: 'video/webm', label: 'WebM (Default)', supportsAlpha: false },
    { format: 'mp4', mimeType: 'video/mp4;codecs=avc1.42E01E', label: 'MP4 (H.264 / AVC)', supportsAlpha: false },
    { format: 'mp4', mimeType: 'video/mp4', label: 'MP4 (Standard)', supportsAlpha: false }
  ];

  const supported = [];
  testCodecs.forEach((codec) => {
    if (MediaRecorder.isTypeSupported(codec.mimeType)) {
      supported.push({
        ...codec,
        available: true
      });
    }
  });

  return {
    hasMediaRecorder: true,
    formats: supported,
    canRecordMp4: supported.some((f) => f.format === 'mp4'),
    canRecordWebm: supported.some((f) => f.format === 'webm')
  };
}

export async function encodeVideoFromGenerator({
  generator,
  resolutionKey,
  fps = 30,
  startTime = 0,
  endTime = 3.0,
  scaleMultiplier = 1.0,
  mimeType = 'video/webm;codecs=vp9',
  onProgress = () => {},
  abortSignal = null
}) {
  const res = RESOLUTION_PRESETS[resolutionKey] || RESOLUTION_PRESETS['1920x1080'];
  const targetW = res.width * scaleMultiplier;
  const targetH = res.height * scaleMultiplier;

  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;

  const stream = canvas.captureStream(fps);
  const totalFrames = Math.max(1, Math.round((endTime - startTime) * fps));
  const frameDurationMs = 1000 / fps;

  let chosenMime = mimeType;
  if (!MediaRecorder.isTypeSupported(chosenMime)) {
    if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
      chosenMime = 'video/webm;codecs=vp9';
    } else if (MediaRecorder.isTypeSupported('video/webm')) {
      chosenMime = 'video/webm';
    } else if (MediaRecorder.isTypeSupported('video/mp4')) {
      chosenMime = 'video/mp4';
    } else {
      throw new Error('No supported video recording codec found in this browser environment.');
    }
  }

  const chunks = [];
  const recorder = new MediaRecorder(stream, {
    mimeType: chosenMime,
    videoBitsPerSecond: 8000000
  });

  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) {
      chunks.push(e.data);
    }
  };

  recorder.start();

  renderFrame(canvas, generator, startTime, resolutionKey, { scaleMultiplier });

  for (let frameIdx = 0; frameIdx < totalFrames; frameIdx++) {
    if (abortSignal && abortSignal.aborted) {
      recorder.stop();
      throw new Error('Video export cancelled by user.');
    }

    const t = startTime + frameIdx / fps;
    renderFrame(canvas, generator, t, resolutionKey, { scaleMultiplier });

    const progress = (frameIdx + 1) / totalFrames;
    onProgress({
      frame: frameIdx + 1,
      totalFrames,
      progress: Math.min(1.0, progress),
      currentTimestamp: t
    });

    await new Promise((resolve) => setTimeout(resolve, Math.max(10, frameDurationMs * 0.7)));
  }

  return new Promise((resolve, reject) => {
    recorder.onstop = () => {
      const ext = chosenMime.includes('mp4') ? 'mp4' : 'webm';
      const blob = new Blob(chunks, { type: chosenMime });
      resolve({
        blob,
        extension: ext,
        mimeType: chosenMime,
        sizeBytes: blob.size,
        framesCount: totalFrames
      });
    };
    recorder.onerror = (err) => reject(err);
    recorder.stop();
  });
}
