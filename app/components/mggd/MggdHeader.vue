<template>
  <header class="top-header">
    <!-- Brand & Mode Switcher -->
    <div class="header-left">
      <div class="brand-badge">
        <div class="brand-icon">
          <Clapperboard :size="16" />
        </div>
        <span>MGGD Motion Studio</span>
        <span class="brand-tag">M1.0</span>
      </div>

      <!-- Maker / Buyer Toggle (Requirement 3) -->
      <div class="mode-toggle">
        <button
          class="mode-btn"
          :class="{ active: mode === 'maker', maker: mode === 'maker' }"
          @click="$emit('update:mode', 'maker')"
          title="Maker Mode: Configure architecture, scenes, limits, trigger types, layouts"
        >
          Maker Mode
        </button>
        <button
          class="mode-btn"
          :class="{ active: mode === 'buyer', buyer: mode === 'buyer' }"
          @click="$emit('update:mode', 'buyer')"
          title="Buyer Mode: Customize text, colors, fonts, images, reorder scenes, export"
        >
          Buyer Mode
        </button>
      </div>

      <!-- Status Pill -->
      <div
        class="status-pill"
        :class="isVerified ? 'verified' : 'unverified'"
        :title="isVerified ? 'Passed all MGGD compliance checks' : 'Unverified generator: Buyer exports are gated'"
      >
        <CheckCircle v-if="isVerified" :size="12" />
        <AlertCircle v-else :size="12" />
        <span>{{ isVerified ? 'Verified' : 'Unverified' }}</span>
      </div>
    </div>

    <!-- Center Resolution & Inspectors -->
    <div class="header-center">
      <div style="display: flex; align-items: center; gap: 6px;">
        <span style="font-size: 11px; color: var(--text-muted);">Resolution:</span>
        <select
          class="form-select"
          style="padding: 3px 8px; font-size: 11px; min-width: 130px;"
          :value="currentResolution"
          @change="$emit('update:currentResolution', $event.target.value)"
        >
          <option v-for="(item, key) in RESOLUTION_PRESETS" :key="key" :value="key">
            {{ item.label }} ({{ key }})
          </option>
        </select>
      </div>

      <button
        class="btn btn-ghost btn-sm"
        @click="$emit('open-size-comparison')"
        title="Compare all 5 layouts side-by-side"
      >
        <Maximize2 :size="13" />
        <span>Sizes</span>
      </button>

      <button
        class="btn btn-ghost btn-sm"
        @click="$emit('open-manifest')"
        title="Inspect live scene manifest & motion-manifest.json"
      >
        <Layers :size="13" />
        <span>Manifest</span>
      </button>

      <button
        class="btn btn-ghost btn-sm"
        @click="$emit('open-vgr')"
        title="Inspect Motion VGR M1.0 Document & Catalog"
      >
        <FileJson :size="13" />
        <span>VGR M1.0</span>
      </button>
    </div>

    <!-- Right Action Buttons -->
    <div class="header-right">
      <button
        class="btn btn-secondary btn-sm"
        @click="$emit('open-checker')"
        title="Run MGGD compliance checker"
      >
        <CheckSquare :size="13" color="var(--accent-primary)" />
        <span>Validate Generator</span>
      </button>

      <!-- Requirement 31: PNG Sequence Button IMMEDIATELY left of Export Video -->
      <button
        class="btn btn-secondary btn-sm"
        @click="$emit('open-png-export')"
        title="Export PNG frame sequence in ZIP"
      >
        <Image :size="13" />
        <span>PNG Sequence</span>
      </button>

      <button
        class="btn btn-accent btn-sm"
        @click="$emit('open-video-export')"
        title="Export rendered video"
      >
        <Film :size="13" />
        <span>Export Video</span>
      </button>

      <button
        class="btn btn-ghost btn-sm"
        @click="$emit('open-requirements')"
        title="View all 35 MGGD specification requirements"
      >
        <Sparkles :size="13" color="var(--accent-secondary)" />
        <span>Requirements (35)</span>
      </button>

      <button
        class="btn btn-sm"
        :class="showWalkthrough ? 'btn-primary' : 'btn-ghost'"
        @click="$emit('toggle-walkthrough')"
        title="Toggle interactive walkthrough guide"
      >
        <HelpCircle :size="13" />
        <span>Guide</span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { 
  Clapperboard, 
  CheckCircle, 
  AlertCircle, 
  Layers, 
  FileJson, 
  Film, 
  Image, 
  Sparkles, 
  CheckSquare, 
  HelpCircle, 
  Maximize2 
} from 'lucide-vue-next';
import { RESOLUTION_PRESETS } from '~/utils/mggd/deterministicRenderer.js';

const props = defineProps({
  mode: { type: String, required: true },
  activeGenerator: { type: Object, required: true },
  currentResolution: { type: String, required: true },
  showWalkthrough: { type: Boolean, default: true }
});

defineEmits([
  'update:mode',
  'update:currentResolution',
  'open-size-comparison',
  'open-manifest',
  'open-vgr',
  'open-checker',
  'open-png-export',
  'open-video-export',
  'open-requirements',
  'toggle-walkthrough'
]);

const isVerified = computed(() => {
  return props.activeGenerator?.validationStatus === 'Verified';
});
</script>
