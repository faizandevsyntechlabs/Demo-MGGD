/**
 * Timing & Easing Engine for Deterministic Time-Based Motion
 * Requirement 6-8, 11: Absolute time math, no accumulated state, independent of FPS.
 */

export const EASING = {
  linear: (t) => t,
  easeInQuad: (t) => t * t,
  easeOutQuad: (t) => t * (2 - t),
  easeInOutQuad: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeOutCubic: (t) => (--t) * t * t + 1,
  easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeOutBack: (t) => {
    const s = 1.70158;
    return --t * t * ((s + 1) * t + s) + 1;
  },
  spring: (t) => {
    // Underdamped spring oscillation settled at 1.0
    if (t >= 1) return 1;
    const c4 = (2 * Math.PI) / 3;
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  }
};

/**
 * Clamps value between min and max
 */
export function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

/**
 * Linear interpolation
 */
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Converts frame index and FPS to absolute timestamp in seconds
 */
export function frameToTime(frame, fps = 30) {
  return frame / fps;
}

/**
 * Converts absolute timestamp in seconds to closest frame index
 */
export function timeToFrame(time, fps = 30) {
  return Math.floor(time * fps);
}

/**
 * Computes total frames for a duration at a given FPS
 */
export function getTotalFrames(duration, fps = 30) {
  return Math.max(1, Math.round(duration * fps));
}

/**
 * Formats seconds into SMPTE timecode (HH:MM:SS:FF)
 */
export function formatTimecode(seconds, fps = 30) {
  const safeSeconds = Math.max(0, seconds);
  const totalFrames = Math.floor(safeSeconds * fps);
  const frames = totalFrames % fps;
  const totalSecs = Math.floor(safeSeconds);
  const secs = totalSecs % 60;
  const mins = Math.floor(totalSecs / 60) % 60;
  const hrs = Math.floor(totalSecs / 3600);

  const pad = (n, len = 2) => String(n).padStart(len, '0');
  return `${pad(hrs)}:${pad(mins)}:${pad(secs)}:${pad(frames)}`;
}
