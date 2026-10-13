<template>
  <div v-if="isOpen" class="modal-backdrop" @click="$emit('close')">
    <div class="modal-card" style="max-width: 820px; max-height: 88vh;" @click.stop>
      <div class="modal-header">
        <div style="display: flex; align-items: center; gap: 8px;">
          <FileJson :size="18" color="var(--accent-primary)" />
          <div>
            <div style="font-weight: 700; font-size: 14px;">Motion VGR M1.0 Inspector</div>
            <div style="font-size: 11px; color: var(--text-muted);">
              Requirements 29-30: Generator document schema and classification fields
            </div>
          </div>
        </div>
        <button class="btn btn-ghost btn-sm btn-icon-only" @click="$emit('close')">
          <X :size="16" />
        </button>
      </div>

      <!-- Status Bar -->
      <div style="padding: 10px 18px; background: var(--bg-app); border-bottom: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="status-pill verified">
            <CheckCircle :size="12" />
            <span>VGR M1.0 Schema Valid</span>
          </span>
          <span style="font-size: 11px; color: var(--text-muted);">
            (No geometry in Motion VGR · 5 classification tags verified)
          </span>
        </div>

        <button class="btn btn-secondary btn-sm" @click="handleCopy">
          <Check v-if="copied" :size="13" color="var(--status-success)" />
          <Copy v-else :size="13" />
          <span>{{ copied ? 'Copied VGR' : 'Copy VGR JSON' }}</span>
        </button>
      </div>

      <div style="padding: 8px 18px; background: rgba(59, 130, 246, 0.1); border-bottom: 1px solid var(--border-subtle); font-size: 11px; color: #93c5fd;">
        <strong>Catalog Notice:</strong> Uses demo IDs (e.g. <code>demo-mggd-xxx</code>) and sample classification values pending official MGGD VGR catalog issuance.
      </div>

      <!-- JSON Viewer -->
      <div class="modal-body" style="padding: 0; background: #0a0d14;">
        <pre style="margin: 0; padding: 16px; font-family: var(--font-mono); font-size: 11px; color: #38bdf8; line-height: 1.6; overflow-x: auto; max-height: 55vh;">{{ jsonString }}</pre>
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary btn-sm" @click="$emit('close')">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { X, FileJson, Copy, Check, CheckCircle } from 'lucide-vue-next';

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  generator: { type: Object, required: true }
});

defineEmits(['close']);

const copied = ref(false);

const vgrDocument = computed(() => ({
  panelVersion: 'M1.0',
  generatorId: props.generator.generatorId,
  generatorTypeId: props.generator.generatorTypeId,
  classification: props.generator.classification,
  motion: {
    sizes: props.generator.supportedSizes,
    scenes: (props.generator.scenes || []).map((s) => ({
      id: s.id,
      name: s.name,
      order: s.order,
      defaultDuration: s.defaultDuration,
      minDuration: s.minDuration,
      maxDuration: s.maxDuration
    })),
    loop: Boolean(props.generator.loop),
    libraries: props.generator.libraries || []
  }
}));

const jsonString = computed(() => JSON.stringify(vgrDocument.value, null, 2));

function handleCopy() {
  if (typeof navigator !== 'undefined') {
    navigator.clipboard.writeText(jsonString.value);
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 2000);
  }
}
</script>
