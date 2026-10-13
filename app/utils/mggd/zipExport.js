/**
 * Real ZIP Archive Generator for PNG Sequences
 * Requirement 31: JSZip packaging, numbered frames, transparency preservation, progress reporting.
 */

import JSZip from 'jszip';
import { captureFrameAsBlob } from './frameCapture.js';

export async function exportPngSequenceZip({
  generator,
  resolutionKey,
  fps = 30,
  startTime = 0,
  endTime = 3.0,
  scaleMultiplier = 1.0,
  prefix = 'frame_',
  onProgress = () => {},
  abortSignal = null
}) {
  const zip = new JSZip();
  const folder = zip.folder('png_sequence');

  const totalFrames = Math.max(1, Math.round((endTime - startTime) * fps));

  for (let i = 0; i < totalFrames; i++) {
    if (abortSignal && abortSignal.aborted) {
      throw new Error('Export cancelled by user.');
    }

    const t = startTime + i / fps;
    const blob = await captureFrameAsBlob(generator, t, resolutionKey, scaleMultiplier);

    const frameNumber = String(i + 1).padStart(4, '0');
    const filename = `${prefix}${frameNumber}.png`;

    folder.file(filename, blob);

    const progress = (i + 1) / totalFrames;
    onProgress({
      frame: i + 1,
      totalFrames,
      progress: Math.min(1.0, progress),
      currentTimestamp: t
    });

    if (i % 5 === 0) {
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }

  const zipBlob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });

  return {
    blob: zipBlob,
    filename: `${generator.generatorId}_${resolutionKey}_${fps}fps.zip`,
    totalFrames,
    sizeBytes: zipBlob.size
  };
}

export function triggerFileDownload(blob, filename) {
  if (typeof window === 'undefined') return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
