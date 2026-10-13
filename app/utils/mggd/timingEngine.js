/**
 * Timing & Easing Engine for Deterministic Time-Based Motion
 * Requirements 6-8, 11: Pure time math, no accumulated state, independent of FPS.
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
    if (t >= 1) return 1;
    const c4 = (2 * Math.PI) / 3;
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  }
};

export function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function frameToTime(frame, fps = 30) {
  return frame / fps;
}

export function timeToFrame(time, fps = 30) {
  return Math.floor(time * fps);
}

export function getTotalFrames(duration, fps = 30) {
  return Math.max(1, Math.round(duration * fps));
}

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
