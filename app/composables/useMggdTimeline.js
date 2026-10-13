/**
 * useMggdTimeline Composable
 * Real-time animation loop, timecode progression, and frame stepping
 * Adheres to Requirements 6-8, 11
 */

import { ref, watch, onUnmounted } from 'vue';

export function useMggdTimeline(totalDurationRef, initialFps = 30, isLoopingRef) {
  const isPlaying = ref(false);
  const currentTime = ref(0);
  const fps = ref(initialFps);
  const zoom = ref(1.0);

  let requestRef = null;
  let lastWallTime = null;

  function seekTo(timestamp) {
    const total = totalDurationRef.value || 5.0;
    const clamped = Math.max(0, Math.min(total, timestamp));
    currentTime.value = clamped;
  }

  function stepFrame(direction = 1) {
    isPlaying.value = false;
    const frameDur = 1 / fps.value;
    const total = totalDurationRef.value || 5.0;
    const nextTime = Math.max(0, Math.min(total, currentTime.value + direction * frameDur));
    seekTo(nextTime);
  }

  function togglePlay() {
    const total = totalDurationRef.value || 5.0;
    if (!isPlaying.value && currentTime.value >= total) {
      seekTo(0);
    }
    isPlaying.value = !isPlaying.value;
  }

  function loopAnimation(now) {
    if (!isPlaying.value) {
      lastWallTime = null;
      return;
    }

    if (lastWallTime === null) {
      lastWallTime = now;
    }

    const deltaSeconds = (now - lastWallTime) / 1000;
    lastWallTime = now;

    const total = totalDurationRef.value || 5.0;
    let nextTime = currentTime.value + deltaSeconds;

    if (nextTime >= total) {
      if (isLoopingRef?.value) {
        nextTime = nextTime % Math.max(0.1, total);
      } else {
        nextTime = total;
        isPlaying.value = false;
      }
    }

    currentTime.value = nextTime;

    if (isPlaying.value) {
      requestRef = requestAnimationFrame(loopAnimation);
    }
  }

  watch(isPlaying, (playing) => {
    if (playing) {
      lastWallTime = null;
      requestRef = requestAnimationFrame(loopAnimation);
    } else {
      if (requestRef) cancelAnimationFrame(requestRef);
      lastWallTime = null;
    }
  });

  onUnmounted(() => {
    if (requestRef) cancelAnimationFrame(requestRef);
  });

  return {
    isPlaying,
    currentTime,
    fps,
    zoom,
    seekTo,
    stepFrame,
    togglePlay
  };
}
