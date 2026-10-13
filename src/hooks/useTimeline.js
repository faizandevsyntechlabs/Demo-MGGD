/**
 * useTimeline Hook
 * Playback management, FPS selection, scrub seeking, frame stepping
 * Adheres to Requirement 6-8, 11
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { seekController } from '../engine/seekController.js';

export function useTimeline(totalDuration = 5.0, initialFps = 30, isLooping = true) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [fps, setFps] = useState(initialFps);
  const [zoom, setZoom] = useState(1.0);

  const requestRef = useRef(null);
  const lastWallTimeRef = useRef(null);
  const currentTimeRef = useRef(currentTime);
  currentTimeRef.current = currentTime;

  // Sync seekController
  const seekTo = useCallback((timestamp) => {
    const clamped = Math.max(0, Math.min(totalDuration, timestamp));
    setCurrentTime(clamped);
    seekController.seek(clamped);
  }, [totalDuration]);

  // Frame step forward/backward (Requirement 5)
  const stepFrame = useCallback((direction = 1) => {
    setIsPlaying(false);
    const frameDuration = 1 / fps;
    const nextTime = Math.max(0, Math.min(totalDuration, currentTimeRef.current + direction * frameDuration));
    seekTo(nextTime);
  }, [fps, totalDuration, seekTo]);

  // Play / Pause toggle
  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => {
      const next = !prev;
      if (next && currentTimeRef.current >= totalDuration) {
        seekTo(0);
      }
      return next;
    });
  }, [totalDuration, seekTo]);

  // Animation frame loop
  useEffect(() => {
    if (!isPlaying) {
      lastWallTimeRef.current = null;
      return;
    }

    const animate = (now) => {
      if (lastWallTimeRef.current === null) {
        lastWallTimeRef.current = now;
      }
      const deltaSeconds = (now - lastWallTimeRef.current) / 1000;
      lastWallTimeRef.current = now;

      let nextTime = currentTimeRef.current + deltaSeconds;

      if (nextTime >= totalDuration) {
        if (isLooping) {
          nextTime = nextTime % Math.max(0.1, totalDuration);
        } else {
          nextTime = totalDuration;
          setIsPlaying(false);
        }
      }

      setCurrentTime(nextTime);
      seekController.seek(nextTime);

      if (isPlaying) {
        requestRef.current = requestAnimationFrame(animate);
      }
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, totalDuration, isLooping]);

  return {
    isPlaying,
    setIsPlaying,
    togglePlay,
    currentTime,
    seekTo,
    stepFrame,
    fps,
    setFps,
    zoom,
    setZoom
  };
}
