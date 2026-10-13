/**
 * Scene Scheduler & Timing Allocator
 * Adheres to MGGD Requirements 13-19, 20-24
 */

export function computeSceneTimeline(scenes = []) {
  let accumulatedTime = 0;
  const scheduledScenes = scenes.map((scene, idx) => {
    const duration = Math.max(1.0, Number(scene.currentDuration || scene.defaultDuration || 3.0));
    const startTime = accumulatedTime;
    const endTime = startTime + duration;
    accumulatedTime = endTime;

    return {
      ...scene,
      index: idx,
      startTime,
      duration,
      endTime
    };
  });

  return {
    scenes: scheduledScenes,
    totalDuration: Math.max(1.0, accumulatedTime)
  };
}

export function getActiveSceneAtTime(timeline, timestamp) {
  const { scenes, totalDuration } = timeline;
  if (!scenes || scenes.length === 0) return null;

  const clampedT = Math.max(0, Math.min(timestamp, totalDuration));

  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    if (clampedT >= scene.startTime && (clampedT < scene.endTime || i === scenes.length - 1)) {
      return {
        scene,
        sceneIndex: i,
        localTime: clampedT - scene.startTime,
        progress: (clampedT - scene.startTime) / scene.duration
      };
    }
  }

  return {
    scene: scenes[0],
    sceneIndex: 0,
    localTime: 0,
    progress: 0
  };
}

export function checkObjectTimingFit(scene, object) {
  const requiredTime = (object.delay || 0) + (object.duration || 1.0);
  if (requiredTime > scene.currentDuration) {
    if (requiredTime <= scene.maxDuration) {
      return {
        canFit: true,
        recommendedSceneDuration: Math.min(scene.maxDuration, Number((requiredTime + 0.2).toFixed(1))),
        error: null
      };
    } else {
      return {
        canFit: false,
        recommendedSceneDuration: scene.maxDuration,
        error: `Object timing (${requiredTime.toFixed(1)}s) exceeds scene maximum duration limit (${scene.maxDuration}s).`
      };
    }
  }
  return { canFit: true, recommendedSceneDuration: scene.currentDuration, error: null };
}
