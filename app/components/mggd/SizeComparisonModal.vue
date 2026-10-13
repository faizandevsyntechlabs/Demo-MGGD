<template>
  <div v-if="isOpen" class="modal-backdrop" @click="$emit('close')">
    <div class="modal-card" style="max-width: 1100px; max-height: 90vh;" @click.stop>
      <div class="modal-header">
        <div style="display: flex; align-items: center; gap: 8px;">
          <Maximize2 :size="18" color="var(--accent-primary)" />
          <div>
            <div style="font-weight: 700; font-size: 14px;">Multi-Size Comparison Matrix (5 MGGD Dimensions)</div>
            <div style="font-size: 11px; color: var(--text-muted);">
              Requirements 9-10: Individual layout configurations per size without anamorphic stretching
            </div>
          </div>
        </div>
        <button class="btn btn-ghost btn-sm btn-icon-only" @click="$emit('close')">
          <X :size="16" />
        </button>
      </div>

      <div class="modal-body" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
        <div
          v-for="(meta, resKey) in RESOLUTION_PRESETS"
          :key="resKey"
          style="background: var(--bg-app); border: 1px solid var(--border-medium); border-radius: var(--radius-md); padding: 12px; display: flex; flex-direction: column; gap: 8px; align-items: center;"
        >
          <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
            <div>
              <span style="font-weight: 600; font-size: 12px; color: var(--text-main);">{{ meta.label }}</span>
              <div style="font-size: 10px; color: var(--text-muted);">{{ resKey }}</div>
            </div>
            <button
              class="btn btn-secondary btn-sm"
              style="font-size: 10px; padding: 2px 8px;"
              @click="$emit('select-resolution', resKey)"
            >
              Select
            </button>
          </div>

          <div style="width: 100%; height: 180px; display: flex; align-items: center; justify-content: center; background: #090a10; border-radius: var(--radius-sm); overflow: hidden; border: 1px solid var(--border-subtle);">
            <canvas
              :ref="(el) => setCanvasRef(resKey, el)"
              :width="meta.width"
              :height="meta.height"
              style="max-width: 100%; max-height: 100%; object-fit: contain;"
            />
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-primary btn-sm" @click="$emit('close')">
          Done
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';
import { X, Maximize2 } from 'lucide-vue-next';
import { renderFrame, RESOLUTION_PRESETS } from '~/utils/mggd/deterministicRenderer.js';

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  generator: { type: Object, required: true },
  currentTime: { type: Number, required: true }
});

defineEmits(['close', 'select-resolution']);

const canvasRefs = {};

function setCanvasRef(key, el) {
  if (el) canvasRefs[key] = el;
}

function renderAllCards() {
  nextTick(() => {
    Object.entries(RESOLUTION_PRESETS).forEach(([key, meta]) => {
      const canvas = canvasRefs[key];
      if (canvas) {
        renderFrame(canvas, props.generator, props.currentTime, key, {
          scaleMultiplier: 240 / meta.width,
          showSafeArea: false
        });
      }
    });
  });
}

watch([() => props.isOpen, () => props.generator, () => props.currentTime], () => {
  if (props.isOpen) {
    renderAllCards();
  }
});
</script>
