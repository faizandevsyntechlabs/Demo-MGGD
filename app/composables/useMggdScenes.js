/**
 * useMggdScenes Composable
 * Scene duration limits, reordering, and timing constraint management
 */

import { computed } from 'vue';
import { computeSceneTimeline, checkObjectTimingFit } from '../utils/mggd/sceneScheduler.js';

export function useMggdScenes(activeGeneratorRef, updateActiveGeneratorFn) {
  const timeline = computed(() => {
    return computeSceneTimeline(activeGeneratorRef.value?.scenes || []);
  });

  const totalDuration = computed(() => {
    return timeline.value.totalDuration;
  });

  function setSceneDuration(sceneId, newDuration) {
    updateActiveGeneratorFn((gen) => {
      const updatedScenes = (gen.scenes || []).map((s) => {
        if (s.id !== sceneId) return s;
        const clamped = Math.max(s.minDuration || 1.0, Math.min(s.maxDuration || 6.0, Number(newDuration)));
        return {
          ...s,
          currentDuration: clamped
        };
      });
      return { ...gen, scenes: updatedScenes };
    });
  }

  function reorderScenes(fromIndex, toIndex) {
    updateActiveGeneratorFn((gen) => {
      const scenes = [...(gen.scenes || [])];
      if (fromIndex < 0 || fromIndex >= scenes.length || toIndex < 0 || toIndex >= scenes.length) {
        return gen;
      }
      const [moved] = scenes.splice(fromIndex, 1);
      scenes.splice(toIndex, 0, moved);
      const reindexed = scenes.map((s, idx) => ({ ...s, order: idx + 1 }));
      return { ...gen, scenes: reindexed };
    });
  }

  function removeScene(sceneId) {
    updateActiveGeneratorFn((gen) => {
      if ((gen.scenes || []).length <= 1) return gen;
      const targetScene = gen.scenes.find((s) => s.id === sceneId);
      if (targetScene && targetScene.required) return gen;
      const filtered = gen.scenes.filter((s) => s.id !== sceneId);
      const reindexed = filtered.map((s, idx) => ({ ...s, order: idx + 1 }));
      return { ...gen, scenes: reindexed };
    });
  }

  return {
    timeline,
    totalDuration,
    setSceneDuration,
    reorderScenes,
    removeScene
  };
}
