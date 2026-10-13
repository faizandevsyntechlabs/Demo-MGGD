<template>
  <div style="display: flex; flex-direction: column; gap: 12px;">
    <!-- Buyer Sub-tabs -->
    <div class="sidebar-tabs">
      <button
        class="sidebar-tab"
        :class="{ active: currentTab === 'design' }"
        @click="currentTab = 'design'"
      >
        Design & Copy
      </button>
      <button
        class="sidebar-tab"
        :class="{ active: currentTab === 'scenes' }"
        @click="currentTab = 'scenes'"
      >
        Scenes & Trim
      </button>
      <button
        class="sidebar-tab"
        :class="{ active: currentTab === 'themes' }"
        @click="currentTab = 'themes'"
      >
        Themes
      </button>
    </div>

    <!-- 1. Design & Copy Tab -->
    <div v-if="currentTab === 'design'" style="display: flex; flex-direction: column; gap: 12px;">
      <!-- Text Editing -->
      <div style="border-bottom: 1px solid var(--border-subtle); padding-bottom: 10px;">
        <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
          <Type :size="13" />
          <span>Copy & Typography</span>
        </div>

        <div class="form-group">
          <span class="form-label">Primary Headline</span>
          <input
            type="text"
            class="form-input"
            :value="properties.headline || ''"
            @input="$emit('update-properties', { headline: $event.target.value })"
          />
        </div>

        <div class="form-group">
          <span class="form-label">Subline / Tagline</span>
          <input
            type="text"
            class="form-input"
            :value="properties.subline || ''"
            @input="$emit('update-properties', { subline: $event.target.value })"
          />
        </div>

        <div class="form-group">
          <span class="form-label">Badge Tag / Price</span>
          <input
            type="text"
            class="form-input"
            :value="properties.tag || ''"
            @input="$emit('update-properties', { tag: $event.target.value })"
          />
        </div>

        <!-- 20 Configured Google Fonts (Requirement 26) -->
        <div class="form-group">
          <span class="form-label">Font Family (20 Google Fonts)</span>
          <select
            class="form-select"
            :value="properties.fontFamily || 'Inter'"
            @change="$emit('update-properties', { fontFamily: $event.target.value })"
            :style="{ fontFamily: properties.fontFamily || 'sans-serif' }"
          >
            <option v-for="f in GOOGLE_FONT_FAMILIES" :key="f.name" :value="f.name" :style="{ fontFamily: f.name }">
              {{ f.name }} — ({{ f.category }})
            </option>
          </select>
        </div>
      </div>

      <!-- Color Palette -->
      <div style="border-bottom: 1px solid var(--border-subtle); padding-bottom: 10px;">
        <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
          <Palette :size="13" />
          <span>Color Palette</span>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <div class="form-group">
            <span class="form-label">Primary Accent</span>
            <div class="color-picker-row">
              <input
                type="color"
                class="color-input-preview"
                :value="properties.colors?.primary || '#8b5cf6'"
                @input="handleColorChange('primary', $event.target.value)"
              />
              <input
                type="text"
                class="form-input"
                style="font-size: 11px; font-family: var(--font-mono);"
                :value="properties.colors?.primary || '#8b5cf6'"
                @input="handleColorChange('primary', $event.target.value)"
              />
            </div>
          </div>

          <div class="form-group">
            <span class="form-label">Secondary Color</span>
            <div class="color-picker-row">
              <input
                type="color"
                class="color-input-preview"
                :value="properties.colors?.secondary || '#06b6d4'"
                @input="handleColorChange('secondary', $event.target.value)"
              />
              <input
                type="text"
                class="form-input"
                style="font-size: 11px; font-family: var(--font-mono);"
                :value="properties.colors?.secondary || '#06b6d4'"
                @input="handleColorChange('secondary', $event.target.value)"
              />
            </div>
          </div>

          <div class="form-group">
            <span class="form-label">Highlight Accent</span>
            <div class="color-picker-row">
              <input
                type="color"
                class="color-input-preview"
                :value="properties.colors?.accent || '#facc15'"
                @input="handleColorChange('accent', $event.target.value)"
              />
              <input
                type="text"
                class="form-input"
                style="font-size: 11px; font-family: var(--font-mono);"
                :value="properties.colors?.accent || '#facc15'"
                @input="handleColorChange('accent', $event.target.value)"
              />
            </div>
          </div>

          <div class="form-group">
            <span class="form-label">Text Color</span>
            <div class="color-picker-row">
              <input
                type="color"
                class="color-input-preview"
                :value="properties.colors?.text || '#ffffff'"
                @input="handleColorChange('text', $event.target.value)"
              />
              <input
                type="text"
                class="form-input"
                style="font-size: 11px; font-family: var(--font-mono);"
                :value="properties.colors?.text || '#ffffff'"
                @input="handleColorChange('text', $event.target.value)"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Image Replacement -->
      <div>
        <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
          <ImageIcon :size="13" />
          <span>Brand Image / Logo Asset</span>
        </div>

        <div style="display: flex; align-items: center; gap: 10px;">
          <div
            v-if="properties.imageUrl"
            style="width: 48px; height: 48px; border-radius: var(--radius-sm); background: #1e293b; border: 1px solid var(--border-medium); overflow: hidden; display: flex; align-items: center; justify-content: center;"
          >
            <img :src="properties.imageUrl" alt="Asset" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
          </div>

          <label class="btn btn-secondary btn-sm" style="flex: 1; cursor: pointer;">
            <Upload :size="12" />
            <span>Upload New Image</span>
            <input type="file" accept="image/*" @change="handleImageUpload" style="display: none;" />
          </label>
        </div>
      </div>
    </div>

    <!-- 2. Scenes & Trim Tab -->
    <div v-else-if="currentTab === 'scenes'" style="display: flex; flex-direction: column; gap: 8px;">
      <div style="font-size: 11px; color: var(--text-muted);">
        Reorder or trim scenes within permitted maker limits:
      </div>

      <div
        v-for="(scene, idx) in scenes"
        :key="scene.id"
        @click="$emit('select-scene', scene.id)"
        :style="{
          padding: '10px',
          borderRadius: 'var(--radius-md)',
          background: scene.id === selectedSceneId ? 'var(--bg-surface)' : 'var(--bg-card)',
          border: `1px solid ${scene.id === selectedSceneId ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }"
      >
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <Lock v-if="scene.required" :size="12" color="var(--accent-secondary)" title="Required scene: Protected" />
            <span v-else class="badge" style="font-size: 9px; background: rgba(255,255,255,0.06);">Optional</span>
            <span style="font-weight: 600; font-size: 12px; color: var(--text-main);">{{ scene.name }}</span>
          </div>

          <div style="display: flex; align-items: center; gap: 2px;">
            <button
              class="btn btn-ghost btn-sm btn-icon-only"
              :disabled="idx === 0"
              @click.stop="$emit('reorder-scenes', idx, idx - 1)"
              title="Move scene up"
            >
              <ArrowUp :size="12" />
            </button>
            <button
              class="btn btn-ghost btn-sm btn-icon-only"
              :disabled="idx === scenes.length - 1"
              @click.stop="$emit('reorder-scenes', idx, idx + 1)"
              title="Move scene down"
            >
              <ArrowDown :size="12" />
            </button>
            <button
              v-if="!scene.required && scenes.length > 1"
              class="btn btn-ghost btn-sm btn-icon-only"
              @click.stop="$emit('remove-scene', scene.id)"
              style="color: var(--status-error);"
              title="Remove optional scene"
            >
              <Trash2 :size="12" />
            </button>
          </div>
        </div>

        <!-- Duration Slider -->
        <div style="margin-top: 2px;">
          <div style="display: flex; justify-content: space-between; font-size: 10px; color: var(--text-secondary); margin-bottom: 3px;">
            <span>Length: {{ Number(scene.currentDuration).toFixed(1) }}s</span>
            <span style="font-family: var(--font-mono);">
              [{{ scene.minDuration }}s – {{ scene.maxDuration }}s limit]
            </span>
          </div>
          <input
            type="range"
            :min="scene.minDuration"
            :max="scene.maxDuration"
            step="0.1"
            :value="scene.currentDuration"
            @input="$emit('set-scene-duration', scene.id, Number($event.target.value))"
            style="width: 100%; accent-color: var(--accent-primary); cursor: pointer;"
          />
        </div>
      </div>
    </div>

    <!-- 3. Themes Tab -->
    <div v-else style="display: flex; flex-direction: column; gap: 10px;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 11px; color: var(--text-muted);">
          Curated Palettes & Presets:
        </span>
        <button
          class="btn btn-secondary btn-sm"
          @click="handleRandomize"
          title="Deterministic PRNG Randomize"
        >
          <Dices :size="12" color="var(--accent-secondary)" />
          <span>Randomize</span>
        </button>
      </div>

      <div style="display: flex; flex-direction: column; gap: 6px;">
        <div
          v-for="theme in THEMES"
          :key="theme.id"
          @click="$emit('apply-theme', theme)"
          style="padding: 8px 10px; border-radius: var(--radius-md); background: var(--bg-card); border: 1px solid var(--border-subtle); cursor: pointer; display: flex; flex-direction: column; gap: 6px;"
        >
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 600; font-size: 12px; color: var(--text-main);">{{ theme.name }}</span>
            <span style="font-size: 10px; color: var(--text-muted);">{{ theme.fontFamily }}</span>
          </div>

          <div style="display: flex; gap: 6px; align-items: center;">
            <div :style="{ width: '18px', height: '18px', borderRadius: '3px', background: theme.colors.primary, border: '1px solid rgba(255,255,255,0.2)' }" />
            <div :style="{ width: '18px', height: '18px', borderRadius: '3px', background: theme.colors.secondary, border: '1px solid rgba(255,255,255,0.2)' }" />
            <div :style="{ width: '18px', height: '18px', borderRadius: '3px', background: theme.colors.accent, border: '1px solid rgba(255,255,255,0.2)' }" />
            <div :style="{ width: '18px', height: '18px', borderRadius: '3px', background: theme.colors.background, border: '1px solid rgba(255,255,255,0.2)' }" />
            <span style="font-size: 10px; color: var(--text-muted); margin-left: 4px;">{{ theme.description }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Type, Palette, Image as ImageIcon, Upload, ArrowUp, ArrowDown, Trash2, Lock, Dices } from 'lucide-vue-next';
import { GOOGLE_FONT_FAMILIES } from '~/data/fontFamilies.js';
import { THEMES, getDeterministicRandomTheme } from '~/data/themes.js';

const props = defineProps({
  properties: { type: Object, default: () => ({}) },
  scenes: { type: Array, default: () => [] },
  selectedSceneId: { type: String, default: null }
});

const emit = defineEmits([
  'update-properties',
  'select-scene',
  'reorder-scenes',
  'remove-scene',
  'set-scene-duration',
  'apply-theme'
]);

const currentTab = ref('design');

function handleColorChange(key, val) {
  emit('update-properties', {
    colors: {
      ...(props.properties.colors || {}),
      [key]: val
    }
  });
}

function handleImageUpload(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    emit('update-properties', { imageUrl: event.target.result });
  };
  reader.readAsDataURL(file);
}

function handleRandomize() {
  const randomTheme = getDeterministicRandomTheme(Date.now());
  emit('apply-theme', randomTheme);
}
</script>
