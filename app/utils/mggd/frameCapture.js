/**
 * Frame Capture Engine for Real PNG Export
 * Adheres to Requirement 31: Uses shared deterministic renderer, preserves alpha, supports 1x/2x scale.
 */

import { renderFrame, RESOLUTION_PRESETS } from './deterministicRenderer.js';

export async function captureFrameAsBlob(generator, timestamp, resolutionKey, scaleMultiplier = 1.0) {
  const res = RESOLUTION_PRESETS[resolutionKey] || RESOLUTION_PRESETS['1920x1080'];
  const offscreen = document.createElement('canvas');
  offscreen.width = res.width * scaleMultiplier;
  offscreen.height = res.height * scaleMultiplier;

  renderFrame(offscreen, generator, timestamp, resolutionKey, { scaleMultiplier });

  return new Promise((resolve) => {
    offscreen.toBlob((blob) => {
      resolve(blob);
    }, 'image/png');
  });
}

export async function captureFrameAsDataUrl(generator, timestamp, resolutionKey, scaleMultiplier = 1.0) {
  const res = RESOLUTION_PRESETS[resolutionKey] || RESOLUTION_PRESETS['1920x1080'];
  const offscreen = document.createElement('canvas');
  offscreen.width = res.width * scaleMultiplier;
  offscreen.height = res.height * scaleMultiplier;

  renderFrame(offscreen, generator, timestamp, resolutionKey, { scaleMultiplier });
  return offscreen.toDataURL('image/png');
}
