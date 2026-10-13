/**
 * useGenerator Hook
 * Central state and workflow manager for Maker & Buyer modes
 * Adheres to Requirements 1-4, 10, 12, 19, 20-28
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { DEMO_GENERATORS, createGeneratorFromType } from '../data/demoGenerators.js';
import { GENERATOR_TYPES } from '../data/generatorTypes.js';
import { computeSceneTimeline, checkObjectTimingFit } from '../engine/sceneScheduler.js';
import { assetLoader } from '../engine/assetLoader.js';

const STORAGE_KEY = 'mggd_generators_store_v1';
const ACTIVE_GEN_KEY = 'mggd_active_gen_id_v1';

export function useGenerator() {
  const [generators, setGenerators] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('LocalStorage load error', e);
    }
    return DEMO_GENERATORS;
  });

  const [activeGeneratorId, setActiveGeneratorId] = useState(() => {
    try {
      const savedId = localStorage.getItem(ACTIVE_GEN_KEY);
      if (savedId) return savedId;
    } catch (e) {}
    return DEMO_GENERATORS[0].generatorId;
  });

  // Current active mode: 'maker' or 'buyer'
  const [mode, setMode] = useState('maker');

  // Selected scene ID for focused editing / preview
  const [selectedSceneId, setSelectedSceneId] = useState(null);

  // Active resolution size
  const [currentResolution, setCurrentResolution] = useState('1920x1080');

  // Find active generator object
  const activeGenerator = useMemo(() => {
    const found = generators.find((g) => g.generatorId === activeGeneratorId);
    return found || generators[0] || DEMO_GENERATORS[0];
  }, [generators, activeGeneratorId]);

  // Sync resolution with generator default if needed
  useEffect(() => {
    if (activeGenerator) {
      if (activeGenerator.currentSize) {
        setCurrentResolution(activeGenerator.currentSize);
      } else if (activeGenerator.defaultSize) {
        setCurrentResolution(activeGenerator.defaultSize);
      }
      if (activeGenerator.scenes && activeGenerator.scenes.length > 0 && !selectedSceneId) {
        setSelectedSceneId(activeGenerator.scenes[0].id);
      }
      // Prepare assets
      assetLoader.prepareGeneratorAssets(activeGenerator);
    }
  }, [activeGenerator?.generatorId]);

  // Persist generators to localStorage
  const persistGenerators = useCallback((updatedList) => {
    setGenerators(updatedList);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  }, []);

  // Update active generator document
  const updateActiveGenerator = useCallback((updater) => {
    setGenerators((prevList) => {
      const idx = prevList.findIndex((g) => g.generatorId === activeGeneratorId);
      if (idx === -1) return prevList;

      const currentGen = prevList[idx];
      const updated = typeof updater === 'function' ? updater(currentGen) : { ...currentGen, ...updater };
      
      const newList = [...prevList];
      newList[idx] = updated;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
      } catch (e) {}
      return newList;
    });
  }, [activeGeneratorId]);

  // Switch active generator
  const selectGenerator = useCallback((id) => {
    setActiveGeneratorId(id);
    try {
      localStorage.setItem(ACTIVE_GEN_KEY, id);
    } catch (e) {}
    const gen = generators.find((g) => g.generatorId === id);
    if (gen && gen.scenes && gen.scenes.length > 0) {
      setSelectedSceneId(gen.scenes[0].id);
    }
  }, [generators]);

  // Load a new generator from catalog type
  const loadFromCatalogType = useCallback((typeDef) => {
    const newGen = createGeneratorFromType(typeDef);
    setGenerators((prev) => {
      const updated = [newGen, ...prev];
      persistGenerators(updated);
      return updated;
    });
    setActiveGeneratorId(newGen.generatorId);
    setSelectedSceneId(newGen.scenes[0].id);
  }, [persistGenerators]);

  // Create a new Generator Revision (Requirement 4: Immutable once published, creates new ID)
  const createNewRevision = useCallback(() => {
    const current = activeGenerator;
    const revNum = Date.now().toString(36).slice(-4);
    const newId = `${current.generatorId.split('-rev-')[0]}-rev-${revNum}`;
    const newGen = {
      ...current,
      generatorId: newId,
      name: `${current.name} (Rev ${revNum.toUpperCase()})`,
      validationStatus: 'Unverified' // Needs new verification
    };

    setGenerators((prev) => {
      const updated = [newGen, ...prev];
      persistGenerators(updated);
      return updated;
    });
    setActiveGeneratorId(newId);
    return newGen;
  }, [activeGenerator, persistGenerators]);

  // ==========================================
  // BUYER ACTIONS (Strictly permissions-gated)
  // ==========================================

  // Edit customizable properties (Text, Colors, Font, Image)
  const updateBuyerProperties = useCallback((propUpdates) => {
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
  }, [updateActiveGenerator]);

  // Change scene duration within maker limits
  const setBuyerSceneDuration = useCallback((sceneId, newDuration) => {
    updateActiveGenerator((gen) => {
      const updatedScenes = (gen.scenes || []).map((s) => {
        if (s.id !== sceneId) return s;
        // Clamp strictly within Maker minDuration and maxDuration
        const clamped = Math.max(s.minDuration || 1.0, Math.min(s.maxDuration || 6.0, Number(newDuration)));
        return {
          ...s,
          currentDuration: clamped
        };
      });
      return { ...gen, scenes: updatedScenes };
    });
  }, [updateActiveGenerator]);

  // Reorder scenes (Buyer permission)
  const reorderScenes = useCallback((fromIndex, toIndex) => {
    updateActiveGenerator((gen) => {
      const scenes = [...(gen.scenes || [])];
      if (fromIndex < 0 || fromIndex >= scenes.length || toIndex < 0 || toIndex >= scenes.length) {
        return gen;
      }
      const [moved] = scenes.splice(fromIndex, 1);
      scenes.splice(toIndex, 0, moved);
      const reindexed = scenes.map((s, idx) => ({ ...s, order: idx + 1 }));
      return { ...gen, scenes: reindexed };
    });
  }, [updateActiveGenerator]);

  // Remove scene (Buyer permission: only optional scenes, at least 1 must remain)
  const removeBuyerScene = useCallback((sceneId) => {
    updateActiveGenerator((gen) => {
      if ((gen.scenes || []).length <= 1) {
        return gen; // At least one scene must remain
      }
      const targetScene = gen.scenes.find((s) => s.id === sceneId);
      if (targetScene && targetScene.required) {
        return gen; // Cannot remove required scene
      }
      const filtered = gen.scenes.filter((s) => s.id !== sceneId);
      const reindexed = filtered.map((s, idx) => ({ ...s, order: idx + 1 }));
      return { ...gen, scenes: reindexed };
    });
  }, [updateActiveGenerator]);

  // Update object timing (Buyer permission: within maker min/max bounds)
  const updateBuyerObjectTiming = useCallback((sceneId, objectId, timingUpdates) => {
    updateActiveGenerator((gen) => {
      let candidateDuration = null;
      const updatedScenes = (gen.scenes || []).map((scene) => {
        if (scene.id !== sceneId) return scene;
        const updatedObjects = (scene.objects || []).map((obj) => {
          if (obj.id !== objectId) return obj;
          const newDelay = timingUpdates.delay !== undefined
            ? Math.max(obj.minDelay || 0, Math.min(obj.maxDelay || 3, Number(timingUpdates.delay)))
            : obj.delay;
          const newDur = timingUpdates.duration !== undefined
            ? Math.max(obj.minDuration || 0.5, Math.min(obj.maxDuration || 6, Number(timingUpdates.duration)))
            : obj.duration;

          const updatedObj = { ...obj, delay: newDelay, duration: newDur };
          const fit = checkObjectTimingFit(scene, updatedObj);
          if (fit.canFit && fit.recommendedSceneDuration > scene.currentDuration) {
            candidateDuration = fit.recommendedSceneDuration;
          }
          return updatedObj;
        });

        return {
          ...scene,
          currentDuration: candidateDuration || scene.currentDuration,
          objects: updatedObjects
        };
      });

      return { ...gen, scenes: updatedScenes };
    });
  }, [updateActiveGenerator]);

  // Apply theme (modifies colors, fonts, images, text — never scene structure/durations)
  const applyTheme = useCallback((theme) => {
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
  }, [updateActiveGenerator]);

  // ==========================================
  // MAKER ACTIONS (Full architectural authority)
  // ==========================================

  // Add scene (Maker only: up to 8 scenes limit)
  const addMakerScene = useCallback(() => {
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
      setSelectedSceneId(newSceneId);
      return { ...gen, scenes: [...scenes, newScene] };
    });
  }, [updateActiveGenerator]);

  // Delete scene (Maker authority)
  const deleteMakerScene = useCallback((sceneId) => {
    updateActiveGenerator((gen) => {
      const scenes = gen.scenes || [];
      if (scenes.length <= 1) {
        alert('Generator must contain at least 1 scene.');
        return gen;
      }
      const filtered = scenes.filter((s) => s.id !== sceneId);
      const reindexed = filtered.map((s, idx) => ({ ...s, order: idx + 1 }));
      if (selectedSceneId === sceneId && reindexed.length > 0) {
        setSelectedSceneId(reindexed[0].id);
      }
      return { ...gen, scenes: reindexed };
    });
  }, [updateActiveGenerator, selectedSceneId]);

  // Update Maker scene architectural bounds
  const updateMakerScene = useCallback((sceneId, sceneUpdates) => {
    updateActiveGenerator((gen) => {
      const scenes = (gen.scenes || []).map((s) => {
        if (s.id !== sceneId) return s;
        return { ...s, ...sceneUpdates };
      });
      return { ...gen, scenes };
    });
  }, [updateActiveGenerator]);

  // Update Maker object definitions
  const updateMakerObject = useCallback((sceneId, objectId, objectUpdates) => {
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
  }, [updateActiveGenerator]);

  // Computed timeline
  const timeline = useMemo(() => {
    return computeSceneTimeline(activeGenerator.scenes || []);
  }, [activeGenerator.scenes]);

  return {
    mode,
    setMode,
    generators,
    activeGenerator,
    selectGenerator,
    loadFromCatalogType,
    createNewRevision,
    selectedSceneId,
    setSelectedSceneId,
    currentResolution,
    setCurrentResolution,
    timeline,
    // Buyer
    updateBuyerProperties,
    setBuyerSceneDuration,
    reorderScenes,
    removeBuyerScene,
    updateBuyerObjectTiming,
    applyTheme,
    // Maker
    addMakerScene,
    deleteMakerScene,
    updateMakerScene,
    updateMakerObject,
    updateActiveGenerator
  };
}
