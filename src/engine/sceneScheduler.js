/**
 * Scene Scheduler & Timing Allocator
 * Adheres to MGGD Requirements 13-19, 20-24
 */

/**
 * Computes scheduled scene timeline intervals from an array of scenes
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

/**
 * Finds active scene and scene-local time for a given global timestamp t
 */
export function getActiveSceneAtTime(timeline, timestamp) {
  const { scenes, totalDuration } = timeline;
  if (!scenes || scenes.length === 0) return null;

  // Clamp time within [0, totalDuration]
  const clampedT = Math.max(0, Math.min(timestamp, totalDuration));

  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    // Active if within [startTime, endTime) or if last scene and at exact end
    if (clampedT >= scene.startTime && (clampedT < scene.endTime || i === scenes.length - 1)) {
      return {
        scene,
        sceneIndex: i,
        localTime: clampedT - scene.startTime,
        progress: (clampedT - scene.startTime) / scene.duration
      };
    }
  }

  // Fallback to first scene
  return {
    scene: scenes[0],
    sceneIndex: 0,
    localTime: 0,
    progress: 0
  };
}

/**
 * Generates live scene manifest data required by Requirement 19
 */
export function generateLiveSceneManifest(generator) {
  const timeline = computeSceneTimeline(generator.scenes || []);
  return {
    generatorId: generator.generatorId,
    generatorTypeId: generator.generatorTypeId,
    totalDuration: timeline.totalDuration,
    sceneCount: timeline.scenes.length,
    scenes: timeline.scenes.map(s => ({
      sceneId: s.id,
      sceneName: s.name,
      order: s.order,
      startTime: Number(s.startTime.toFixed(3)),
      currentLength: Number(s.duration.toFixed(3)),
      required: Boolean(s.required)
    }))
  };
}

/**
 * Generates official motion-manifest.json schema containing default, min, max & total durations
 */
export function generateMotionManifestJson(generator) {
  const timeline = computeSceneTimeline(generator.scenes || []);
  const minPossibleDuration = (generator.scenes || []).reduce((acc, s) => acc + (s.minDuration || 1.0), 0);
  const maxPossibleDuration = (generator.scenes || []).reduce((acc, s) => acc + (s.maxDuration || 6.0), 0);

  return {
    $schema: 'https://mggd.spec.motion/schema/v1/motion-manifest.json',
    generatorId: generator.generatorId,
    generatorTypeId: generator.generatorTypeId,
    panelVersion: generator.panelVersion || 'M1.0',
    specification: 'MGGD-Motion-v1',
    executionBranch: 'Motion',
    timing: {
      currentTotalDuration: Number(timeline.totalDuration.toFixed(3)),
      minPossibleDuration: Number(minPossibleDuration.toFixed(3)),
      maxPossibleDuration: Number(maxPossibleDuration.toFixed(3)),
      looping: Boolean(generator.loop)
    },
    supportedSizes: generator.supportedSizes,
    defaultSize: generator.defaultSize,
    transparency: {
      defaultEnabled: Boolean(generator.transparency),
      type: generator.transparentType || 'page-layout'
    },
    scenes: timeline.scenes.map(s => ({
      id: s.id,
      name: s.name,
      startTime: Number(s.startTime.toFixed(3)),
      duration: Number(s.duration.toFixed(3)),
      minDuration: Number((s.minDuration || 1.0).toFixed(3)),
      maxDuration: Number((s.maxDuration || 6.0).toFixed(3)),
      required: Boolean(s.required)
    })),
    libraries: generator.libraries || []
  };
}

/**
 * Checks if extending an object's timing requires auto-growing its scene
 * Requirement 24: If buyer timing extends beyond scene duration, auto-grow up to max.
 */
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
