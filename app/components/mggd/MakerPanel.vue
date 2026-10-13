<template>
  <div style="display: flex; flex-direction: column; gap: 12px;">
    <!-- Maker Sub-tabs -->
    <div class="sidebar-tabs">
      <button
        class="sidebar-tab"
        :class="{ active: currentTab === 'scenes' }"
        @click="currentTab = 'scenes'"
      >
        Scenes
      </button>
      <button
        class="sidebar-tab"
        :class="{ active: currentTab === 'timing' }"
        @click="currentTab = 'timing'"
      >
        Timing
      </button>
      <button
        class="sidebar-tab"
        :class="{ active: currentTab === 'layout' }"
        @click="currentTab = 'layout'"
      >
        Layouts
      </button>
      <button
        class="sidebar-tab"
        :class="{ active: currentTab === 'policy' }"
        @click="currentTab = 'policy'"
      >
        Policy
      </button>
    </div>

    <!-- 1. Scenes Tab -->
    <div v-if="currentTab === 'scenes'">
      <SceneManager
        :scenes="activeGenerator.scenes || []"
        :selected-scene-id="selectedSceneId"
        @select-scene="$emit('select-scene', $event)"
        @add-scene="$emit('add-scene')"
        @delete-scene="$emit('delete-scene', $event)"
        @update-scene="(id, updates) => $emit('update-scene', id, updates)"
      />
    </div>

    <!-- 2. Timing Tab -->
    <div v-else-if="currentTab === 'timing'">
      <ObjectTimingPanel
        :scene="selectedScene"
        @update-object="(sId, oId, updates) => $emit('update-object', sId, oId, updates)"
      />
    </div>

    <!-- 3. Layouts Tab -->
    <div v-else-if="currentTab === 'layout'" style="display: flex; flex-direction: column; gap: 10px;">
      <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">
        Per-Size Layout Overrides (No Stretching)
      </div>

      <div style="display: flex; gap: 4px; flex-wrap: wrap;">
        <button
          v-for="(item, key) in RESOLUTION_PRESETS"
          :key="key"
          class="btn btn-sm"
          :class="selectedResKey === key ? 'btn-primary' : 'btn-secondary'"
          style="font-size: 10px; padding: 3px 6px;"
          @click="selectedResKey = key"
        >
          {{ item.aspect }} ({{ key }})
        </button>
      </div>

      <div style="font-size: 10px; color: var(--text-secondary);">
        Position coordinates for <strong>{{ currentResMeta.label }}</strong>:
      </div>

      <div
        v-for="obj in (selectedScene?.objects || [])"
        :key="obj.id"
        style="padding: 10px; border-radius: var(--radius-md); background: var(--bg-app); border: 1px solid var(--border-medium); display: flex; flex-direction: column; gap: 6px;"
      >
        <div style="font-weight: 600; font-size: 11px; color: var(--text-main);">
          {{ obj.name }} ({{ obj.type }})
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
          <div class="form-group">
            <span class="form-label">Position X (px)</span>
            <input
              type="number"
              class="form-input"
              :value="Math.round(getObjLayout(obj).x)"
              @input="updateLayoutField(obj, 'x', Number($event.target.value))"
            />
          </div>
          <div class="form-group">
            <span class="form-label">Position Y (px)</span>
            <input
              type="number"
              class="form-input"
              :value="Math.round(getObjLayout(obj).y)"
              @input="updateLayoutField(obj, 'y', Number($event.target.value))"
            />
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
          <div class="form-group">
            <span class="form-label">Scale Factor</span>
            <input
              type="number"
              step="0.05"
              min="0.1"
              max="3.0"
              class="form-input"
              :value="getObjLayout(obj).scale || 1.0"
              @input="updateLayoutField(obj, 'scale', Number($event.target.value))"
            />
          </div>
          <div v-if="obj.type === 'text'" class="form-group">
            <span class="form-label">Font Size (px)</span>
            <input
              type="number"
              min="12"
              max="140"
              class="form-input"
              :value="getObjLayout(obj).fontSize || 32"
              @input="updateLayoutField(obj, 'fontSize', Number($event.target.value))"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 4. Policy Tab -->
    <div v-else style="display: flex; flex-direction: column; gap: 12px;">
      <!-- Transparency Policy -->
      <div style="padding: 10px; background: var(--bg-app); border-radius: var(--radius-md); border: 1px solid var(--border-medium);">
        <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px;">
          Transparency Policy (Requirement 12)
        </div>
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div>
            <div style="font-weight: 600; font-size: 11px; color: var(--text-main);">Default Alpha Transparency</div>
            <div style="font-size: 10px; color: var(--text-muted);">Buyer cannot alter maker transparency policy</div>
          </div>
          <input
            type="checkbox"
            :checked="Boolean(activeGenerator.transparency)"
            @change="$emit('update-generator', { transparency: $event.target.checked, transparentType: $event.target.checked ? 'overlay' : 'page-layout' })"
            style="width: 16px; height: 16px; accent-color: var(--accent-primary); cursor: pointer;"
          />
        </div>
      </div>

      <!-- Library Policy -->
      <div style="padding: 10px; background: var(--bg-app); border-radius: var(--radius-md); border: 1px solid var(--border-medium);">
        <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px;">
          Library Policy & Declarations (Requirement 32)
        </div>

        <div
          v-for="(lib, idx) in (activeGenerator.libraries || [])"
          :key="idx"
          style="padding: 8px; background: var(--bg-card); border-radius: var(--radius-sm); margin-bottom: 6px; border: 1px solid var(--border-subtle);"
        >
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <span style="font-weight: 600; font-size: 11px; color: var(--text-main);">{{ lib.name }}</span>
            <div style="display: flex; align-items: center; gap: 4px;">
              <span style="font-size: 10px; color: var(--text-muted);">Keep?</span>
              <input
                type="checkbox"
                :checked="Boolean(lib.keep)"
                @change="toggleLibrary(idx, $event.target.checked)"
              />
            </div>
          </div>
          <div class="form-group" style="margin-bottom: 4px;">
            <span class="form-label" style="font-size: 10px;">License Value</span>
            <input
              type="text"
              class="form-input"
              style="font-size: 11px; padding: 3px 6px;"
              :value="lib.license || ''"
              @input="updateLibraryLicense(idx, $event.target.value)"
            />
          </div>
          <div style="font-size: 9px; color: var(--text-muted);">{{ lib.description }}</div>
        </div>
      </div>

      <!-- Asset Licenses -->
      <div style="padding: 10px; background: var(--bg-app); border-radius: var(--radius-md); border: 1px solid var(--border-medium);">
        <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px;">
          Default Maker Asset Licenses (Requirement 33)
        </div>

        <div
          v-for="(asset, idx) in (activeGenerator.defaultAssets || [])"
          :key="asset.id"
          style="padding: 8px; background: var(--bg-card); border-radius: var(--radius-sm); margin-bottom: 6px; border: 1px solid var(--border-subtle);"
        >
          <div style="font-weight: 600; font-size: 11px; color: var(--text-main); margin-bottom: 4px;">
            {{ asset.name }}
          </div>
          <div class="form-group" style="margin-bottom: 0;">
            <span class="form-label" style="font-size: 10px;">License String</span>
            <input
              type="text"
              class="form-input"
              style="font-size: 11px; padding: 3px 6px;"
              :value="asset.license || ''"
              @input="updateAssetLicense(idx, $event.target.value)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import SceneManager from './SceneManager.vue';
import ObjectTimingPanel from './ObjectTimingPanel.vue';
import { RESOLUTION_PRESETS } from '~/utils/mggd/deterministicRenderer.js';

const props = defineProps({
  activeGenerator: { type: Object, required: true },
  selectedSceneId: { type: String, default: null }
});

const emit = defineEmits([
  'select-scene',
  'add-scene',
  'delete-scene',
  'update-scene',
  'update-object',
  'update-generator'
]);

const currentTab = ref('scenes');
const selectedResKey = ref('1920x1080');

const selectedScene = computed(() => {
  return (props.activeGenerator.scenes || []).find((s) => s.id === props.selectedSceneId) || props.activeGenerator.scenes?.[0];
});

const currentResMeta = computed(() => {
  return RESOLUTION_PRESETS[selectedResKey.value] || RESOLUTION_PRESETS['1920x1080'];
});

function getObjLayout(obj) {
  const meta = currentResMeta.value;
  return (obj.layout && obj.layout[selectedResKey.value]) || {
    x: meta.width * 0.5,
    y: meta.height * 0.5,
    scale: 1.0,
    fontSize: 32,
    align: 'center'
  };
}

function updateLayoutField(obj, field, value) {
  const currentLayout = getObjLayout(obj);
  const updatedLayoutMap = {
    ...(obj.layout || {}),
    [selectedResKey.value]: {
      ...currentLayout,
      [field]: value
    }
  };
  emit('update-object', selectedScene.value.id, obj.id, { layout: updatedLayoutMap });
}

function toggleLibrary(idx, keepVal) {
  const libs = [...(props.activeGenerator.libraries || [])];
  libs[idx] = { ...libs[idx], keep: keepVal };
  emit('update-generator', { libraries: libs });
}

function updateLibraryLicense(idx, license) {
  const libs = [...(props.activeGenerator.libraries || [])];
  libs[idx] = { ...libs[idx], license };
  emit('update-generator', { libraries: libs });
}

function updateAssetLicense(idx, license) {
  const assets = [...(props.activeGenerator.defaultAssets || [])];
  assets[idx] = { ...assets[idx], license };
  emit('update-generator', { defaultAssets: assets });
}
</script>
