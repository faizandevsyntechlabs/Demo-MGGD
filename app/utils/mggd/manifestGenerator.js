/**
 * Manifest Generator for Live Scene Manifest & motion-manifest.json
 * Adheres to MGGD Requirements 19 & 25
 */

import { computeSceneTimeline } from './sceneScheduler.js';

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
