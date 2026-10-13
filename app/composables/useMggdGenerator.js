/**
 * useMggdGenerator Composable
 * Central generator state & permissions manager using Vue 3 Composition API
 * Adheres to Requirements 1-4, 10, 12, 19, 20-28
 * NO RUNTIME AI GENERATION: Strictly predefined configurable components.
 */

import { ref, computed, watch, onMounted } from 'vue';
import { DEMO_GENERATORS, createGeneratorFromType } from '../data/demoComponents.js';
import { assetLoader } from '../utils/mggd/assetLoader.js';

const STORAGE_KEY = 'mggd_nuxt_generators_store_v1';
const ACTIVE_GEN_KEY = 'mggd_nuxt_active_gen_id_v1';

export function useMggdGenerator() {
  const generators = ref(DEMO_GENERATORS);
  const activeGeneratorId = ref(DEMO_GENERATORS[0].generatorId);
  const mode = ref('maker'); // 'maker' | 'buyer'
  const currentResolution = ref('1920x1080');
  const selectedSceneId = ref(null);

  // Initialize from LocalStorage client-side
  onMounted(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          generators.value = parsed;
        }
      }
      const savedId = localStorage.getItem(ACTIVE_GEN_KEY);
      if (savedId && generators.value.some((g) => g.generatorId === savedId)) {
        activeGeneratorId.value = savedId;
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  });

  const activeGenerator = computed(() => {
    const found = generators.value.find((g) => g.generatorId === activeGeneratorId.value);
    return found || generators.value[0] || DEMO_GENERATORS[0];
  });

  // Watch active generator changes to sync resolution, selected scene, and assets
  watch(
    () => activeGenerator.value.generatorId,
    () => {
      const gen = activeGenerator.value;
      if (gen.currentSize) {
        currentResolution.value = gen.currentSize;
      } else if (gen.defaultSize) {
        currentResolution.value = gen.defaultSize;
      }
      if (gen.scenes && gen.scenes.length > 0) {
        selectedSceneId.value = gen.scenes[0].id;
      }
      if (typeof window !== 'undefined') {
        assetLoader.prepareGeneratorAssets(gen);
      }
    },
    { immediate: true }
  );

  function persistGenerators(list) {
    generators.value = list;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      } catch (e) {}
    }
  }

  function updateActiveGenerator(updater) {
    const idx = generators.value.findIndex((g) => g.generatorId === activeGeneratorId.value);
    if (idx === -1) return;

    const currentGen = generators.value[idx];
    const updated = typeof updater === 'function' ? updater(currentGen) : { ...currentGen, ...updater };

    const newList = [...generators.value];
    newList[idx] = updated;
    persistGenerators(newList);
  }

  function selectGenerator(id) {
    activeGeneratorId.value = id;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(ACTIVE_GEN_KEY, id);
      } catch (e) {}
    }
    const gen = generators.value.find((g) => g.generatorId === id);
    if (gen && gen.scenes && gen.scenes.length > 0) {
      selectedSceneId.value = gen.scenes[0].id;
    }
  }

  function loadFromCatalogType(typeDef) {
    const newGen = createGeneratorFromType(typeDef);
    const updated = [newGen, ...generators.value];
    persistGenerators(updated);
    activeGeneratorId.value = newGen.generatorId;
    selectedSceneId.value = newGen.scenes[0].id;
  }

  function createNewRevision() {
    const current = activeGenerator.value;
    const revNum = Date.now().toString(36).slice(-4);
    const newId = `${current.generatorId.split('-rev-')[0]}-rev-${revNum}`;
    const newGen = {
      ...current,
      generatorId: newId,
      name: `${current.name} (Rev ${revNum.toUpperCase()})`,
      validationStatus: 'Unverified'
    };

    const updated = [newGen, ...generators.value];
    persistGenerators(updated);
    activeGeneratorId.value = newId;
    return newGen;
  }

  // Buyer actions
  function updateBuyerProperties(propUpdates) {
    updateActiveGenerator((gen) => ({
      ...gen,
      properties: {
        ...gen.properties,
        ...propUpdates,
        colors: {
          ...gen.properties.colors,
          ...(propUpdates.colors || {})
        }
      }
    }));
  }

  function applyTheme(theme) {
    updateActiveGenerator((gen) => ({
      ...gen,
      properties: {
        ...gen.properties,
        colors: {
          ...gen.properties.colors,
          ...theme.colors
        },
        fontFamily: theme.fontFamily || gen.properties.fontFamily
      }
    }));
  }

  // Maker actions
  function addMakerScene() {
    updateActiveGenerator((gen) => {
      const scenes = gen.scenes || [];
      if (scenes.length >= 8) {
        alert('Maximum of 8 scenes reached per MGGD specification.');
        return gen;
      }
      const newIndex = scenes.length + 1;
      const newSceneId = `scene-${gen.generatorId}-${Date.now().toString(36)}`;
      const newScene = {
        id: newSceneId,
        name: `Scene ${newIndex} - Accent Motion`,
        order: newIndex,
        defaultDuration: 3.0,
        minDuration: 1.5,
        maxDuration: 6.0,
        currentDuration: 3.0,
        required: false,
        background: gen.transparency ? 'transparent' : (gen.properties?.colors?.background || '#090a10'),
        entrance: 'fade',
        exit: 'fade',
        objects: [
          {
            id: `obj-${newSceneId}-txt`,
            name: 'Scene Accent Text',
            type: 'text',
            delay: 0.2,
            minDelay: 0.0,
            maxDelay: 1.0,
            duration: 2.6,
            minDuration: 1.0,
            maxDuration: 5.0,
            trigger: 'Auto - Once - Stay',
            entranceAnimation: 'glow-pop',
            exitAnimation: 'fade-out',
            layout: {
              '1920x1080': { x: 960, y: 540, scale: 1.0, fontSize: 36, align: 'center' },
              '1080x1920': { x: 540, y: 960, scale: 1.0, fontSize: 34, align: 'center' },
              '1080x1080': { x: 540, y: 540, scale: 1.0, fontSize: 32, align: 'center' },
              '1080x1350': { x: 540, y: 675, scale: 1.0, fontSize: 34, align: 'center' },
              '2560x1080': { x: 1280, y: 540, scale: 1.0, fontSize: 38, align: 'center' }
            }
          }
        ]
      };
      selectedSceneId.value = newSceneId;
      return { ...gen, scenes: [...scenes, newScene] };
    });
  }

  function deleteMakerScene(sceneId) {
    updateActiveGenerator((gen) => {
      const scenes = gen.scenes || [];
      if (scenes.length <= 1) {
        alert('Generator must contain at least 1 scene.');
        return gen;
      }
      const filtered = scenes.filter((s) => s.id !== sceneId);
      const reindexed = filtered.map((s, idx) => ({ ...s, order: idx + 1 }));
      if (selectedSceneId.value === sceneId && reindexed.length > 0) {
        selectedSceneId.value = reindexed[0].id;
      }
      return { ...gen, scenes: reindexed };
    });
  }

  function updateMakerScene(sceneId, sceneUpdates) {
    updateActiveGenerator((gen) => {
      const scenes = (gen.scenes || []).map((s) => {
        if (s.id !== sceneId) return s;
        return { ...s, ...sceneUpdates };
      });
      return { ...gen, scenes };
    });
  }

  function updateMakerObject(sceneId, objectId, objectUpdates) {
    updateActiveGenerator((gen) => {
      const scenes = (gen.scenes || []).map((s) => {
        if (s.id !== sceneId) return s;
        const objects = (s.objects || []).map((o) => {
          if (o.id !== objectId) return o;
          return { ...o, ...objectUpdates };
        });
        return { ...s, objects };
      });
      return { ...gen, scenes };
    });
  }

  return {
    mode,
    generators,
    activeGenerator,
    activeGeneratorId,
    currentResolution,
    selectedSceneId,
    selectGenerator,
    loadFromCatalogType,
    createNewRevision,
    updateActiveGenerator,
    updateBuyerProperties,
    applyTheme,
    addMakerScene,
    deleteMakerScene,
    updateMakerScene,
    updateMakerObject
  };
}
