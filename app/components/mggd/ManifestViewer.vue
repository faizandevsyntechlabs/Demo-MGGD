<template>
  <div v-if="isOpen" class="modal-backdrop" @click="$emit('close')">
    <div class="modal-card" style="max-width: 800px; max-height: 85vh;" @click.stop>
      <div class="modal-header">
        <div style="display: flex; align-items: center; gap: 8px;">
          <Layers :size="18" color="var(--accent-primary)" />
          <div>
            <div style="font-weight: 700; font-size: 14px;">MGGD Manifest Inspector</div>
            <div style="font-size: 11px; color: var(--text-muted);">
              Requirements 19 & 25: Live scene manifest & motion-manifest.json
            </div>
          </div>
        </div>
        <button class="btn btn-ghost btn-sm btn-icon-only" @click="$emit('close')">
          <X :size="16" />
        </button>
      </div>

      <div style="padding: 8px 18px; background: var(--bg-app); border-bottom: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; gap: 6px;">
          <button
            class="btn btn-sm"
            :class="activeTab === 'live' ? 'btn-primary' : 'btn-secondary'"
            @click="activeTab = 'live'"
          >
            Live Scene Manifest ({{ liveManifest.sceneCount }} Scenes)
          </button>
          <button
            class="btn btn-sm"
            :class="activeTab === 'motion_json' ? 'btn-primary' : 'btn-secondary'"
            @click="activeTab = 'motion_json'"
          >
            motion-manifest.json
          </button>
        </div>

        <button class="btn btn-secondary btn-sm" @click="handleCopy">
          <Check v-if="copied" :size="13" color="var(--status-success)" />
          <Copy v-else :size="13" />
          <span>{{ copied ? 'Copied JSON' : 'Copy JSON' }}</span>
        </button>
      </div>

      <div class="modal-body" style="padding: 0; background: #0a0d14;">
        <pre style="margin: 0; padding: 16px; font-family: var(--font-mono); font-size: 11px; color: #a78bfa; line-height: 1.6; overflow-x: auto; max-height: 60vh;">{{ displayedJson }}</pre>
      </div>

      <div class="modal-footer">
        <span style="font-size: 11px; color: var(--text-muted); margin-right: auto;">
          ✓ Synchronizes automatically on all buyer/maker scene duration updates
        </span>
        <button class="btn btn-secondary btn-sm" @click="$emit('close')">
          Close Inspector
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { X, Layers, Copy, Check } from 'lucide-vue-next';
import { generateLiveSceneManifest, generateMotionManifestJson } from '~/utils/mggd/manifestGenerator.js';

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  generator: { type: Object, required: true }
});

defineEmits(['close']);

const activeTab = ref('live');
const copied = ref(false);

const liveManifest = computed(() => generateLiveSceneManifest(props.generator));
const motionManifestJson = computed(() => generateMotionManifestJson(props.generator));

const displayedJson = computed(() => {
  return activeTab.value === 'live'
    ? JSON.stringify(liveManifest.value, null, 2)
    : JSON.stringify(motionManifestJson.value, null, 2);
});

function handleCopy() {
  if (typeof navigator !== 'undefined') {
    navigator.clipboard.writeText(displayedJson.value);
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 2000);
  }
}
</script>
