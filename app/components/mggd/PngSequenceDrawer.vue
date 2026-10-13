<template>
  <div v-if="isOpen" class="drawer-backdrop" @click="$emit('close')">
    <div class="drawer-panel" @click.stop>
      <div class="modal-header">
        <div style="display: flex; align-items: center; gap: 8px;">
          <Image :size="16" color="var(--accent-primary)" />
          <div>
            <div style="font-weight: 700; font-size: 13px;">PNG Sequence Export</div>
            <div style="font-size: 11px; color: var(--text-muted);">Requirement 31: ZIP archive packaging with numbered frames</div>
          </div>
        </div>
        <button class="btn btn-ghost btn-sm btn-icon-only" @click="$emit('close')">
          <X :size="15" />
        </button>
      </div>

      <div class="modal-body" style="display: flex; flex-direction: column; gap: 14px;">
        <!-- Buyer Blocked Warning -->
        <div
          v-if="isBuyerBlocked"
          style="padding: 10px; background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: var(--radius-sm); color: #fbbf24; font-size: 11px; display: flex; gap: 8px;"
        >
          <AlertTriangle :size="16" />
          <div>
            <strong>Buyer Export Gated (Requirement 35):</strong> This generator is unverified. Run Checker and verify in Maker Mode before buyer export is permitted.
          </div>
        </div>

        <div
          v-if="mode === 'maker' && !isVerified"
          style="padding: 8px; background: rgba(59, 130, 246, 0.15); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: var(--radius-sm); color: #93c5fd; font-size: 11px;"
        >
          <strong>Maker Test Render:</strong> Available for preview and diagnostic verification while unverified.
        </div>

        <!-- Export Range -->
        <div>
          <span class="form-label" style="margin-bottom: 6px;">Export Timeline Range</span>
          <div style="display: flex; gap: 4px;">
            <button
              class="btn btn-sm"
              :class="rangeMode === 'full' ? 'btn-primary' : 'btn-secondary'"
              style="flex: 1; font-size: 11px;"
              @click="rangeMode = 'full'"
            >
              Full (0.0s – {{ totalDuration.toFixed(1) }}s)
            </button>
            <button
              class="btn btn-sm"
              :class="rangeMode === 'playhead_end' ? 'btn-primary' : 'btn-secondary'"
              style="flex: 1; font-size: 11px;"
              @click="rangeMode = 'playhead_end'"
            >
              Playhead to End
            </button>
            <button
              class="btn btn-sm"
              :class="rangeMode === 'custom' ? 'btn-primary' : 'btn-secondary'"
              style="flex: 1; font-size: 11px;"
              @click="rangeMode = 'custom'"
            >
              Custom
            </button>
          </div>

          <div v-if="rangeMode === 'custom'" style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-top: 8px;">
            <div class="form-group">
              <span class="form-label">Start Time (s)</span>
              <input type="number" step="0.1" min="0" :max="totalDuration" class="form-input" v-model.number="customStart" />
            </div>
            <div class="form-group">
              <span class="form-label">End Time (s)</span>
              <input type="number" step="0.1" min="0.1" :max="totalDuration" class="form-input" v-model.number="customEnd" />
            </div>
          </div>
        </div>

        <!-- Frame Rate Selection -->
        <div class="form-group">
          <span class="form-label">Frame Rate (FPS)</span>
          <div style="display: flex; gap: 4px;">
            <button
              v-for="f in [24, 25, 30, 50, 60]"
              :key="f"
              class="btn btn-sm"
              :class="fps === f ? 'btn-primary' : 'btn-secondary'"
              style="flex: 1; font-size: 11px;"
              @click="fps = f"
            >
              {{ f }} FPS
            </button>
          </div>
        </div>

        <!-- Resolution & 2x Scale -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <div class="form-group">
            <span class="form-label">Output Resolution</span>
            <select class="form-select" v-model="resolutionKey">
              <option v-for="(item, key) in RESOLUTION_PRESETS" :key="key" :value="key">
                {{ item.label }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <span class="form-label">Scale Multiplier (Req 14)</span>
            <select class="form-select" v-model.number="scaleMultiplier">
              <option :value="1.0">1× Standard</option>
              <option :value="2.0">2× High-Res / 4K</option>
            </select>
          </div>
        </div>

        <!-- File Prefix -->
        <div class="form-group">
          <span class="form-label">File Naming Prefix</span>
          <input type="text" class="form-input" v-model="filePrefix" placeholder="frame_" />
        </div>

        <!-- Summary -->
        <div style="padding: 10px; background: var(--bg-app); border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); font-size: 11px; display: flex; flex-direction: column; gap: 4px;">
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-muted);">Target Dimensions:</span>
            <span style="font-family: var(--font-mono);">{{ targetW }} × {{ targetH }} px</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-muted);">Total Frames:</span>
            <span style="font-family: var(--font-mono);">{{ totalFrames }} frames</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-muted);">Alpha Transparency:</span>
            <span :style="{ color: generator.transparency ? 'var(--status-success)' : 'var(--text-secondary)' }">
              {{ generator.transparency ? 'Preserved (RGBA 32-bit)' : 'Solid Background' }}
            </span>
          </div>
        </div>

        <!-- Progress -->
        <div v-if="isExporting" style="display: flex; flex-direction: column; gap: 6px;">
          <div style="display: flex; justify-content: space-between; font-size: 11px;">
            <span style="color: var(--text-secondary);">{{ currentFrameInfo }}</span>
            <span style="font-weight: 700; color: var(--accent-primary);">{{ exportProgress }}%</span>
          </div>
          <div style="width: 100%; height: 6px; background: var(--bg-app); border-radius: 3px; overflow: hidden;">
            <div :style="{ width: `${exportProgress}%`, height: '100%', background: 'linear-gradient(90deg, #8b5cf6, #06b6d4)', transition: 'width 0.1s linear' }" />
          </div>
        </div>

        <!-- Error -->
        <div v-if="errorMessage" style="padding: 8px; background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3); color: #f87171; border-radius: var(--radius-sm); font-size: 11px;">
          {{ errorMessage }}
        </div>

        <!-- Download Card -->
        <div v-if="downloadReady" style="padding: 10px; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: var(--radius-sm); display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; align-items: center; gap: 6px; color: #34d399; font-weight: 600;">
            <CheckCircle :size="14" />
            <span>ZIP Archive Ready: {{ downloadReady.totalFrames }} frames encoded.</span>
          </div>
          <button class="btn btn-success btn-sm" @click="handleDownload" style="width: 100%;">
            <Download :size="13" />
            <span>Download {{ downloadReady.filename }}</span>
          </button>
        </div>
      </div>

      <div class="modal-footer">
        <button v-if="isExporting" class="btn btn-secondary btn-sm" @click="handleCancel">
          Cancel Export
        </button>
        <button
          v-else
          class="btn btn-primary btn-sm"
          :disabled="isBuyerBlocked"
          @click="startExport"
        >
          <Image :size="13" />
          <span>Start PNG Export</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { X, Image, Download, AlertTriangle, CheckCircle } from 'lucide-vue-next';
import { RESOLUTION_PRESETS } from '~/utils/mggd/deterministicRenderer.js';
import { exportPngSequenceZip, triggerFileDownload } from '~/utils/mggd/zipExport.js';

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  generator: { type: Object, required: true },
  currentTime: { type: Number, required: true },
  totalDuration: { type: Number, required: true },
  mode: { type: String, default: 'maker' }
});

defineEmits(['close']);

const rangeMode = ref('full');
const customStart = ref(0);
const customEnd = ref(props.totalDuration);
const fps = ref(30);
const resolutionKey = ref(props.generator?.defaultSize || '1920x1080');
const scaleMultiplier = ref(1.0);
const filePrefix = ref('frame_');

const isExporting = ref(false);
const exportProgress = ref(0);
const currentFrameInfo = ref('');
const downloadReady = ref(null);
const errorMessage = ref(null);
let abortController = null;

const isVerified = computed(() => props.generator?.validationStatus === 'Verified');
const isBuyerBlocked = computed(() => props.mode === 'buyer' && !isVerified.value);

const resMeta = computed(() => RESOLUTION_PRESETS[resolutionKey.value] || RESOLUTION_PRESETS['1920x1080']);
const targetW = computed(() => resMeta.value.width * scaleMultiplier.value);
const targetH = computed(() => resMeta.value.height * scaleMultiplier.value);

const exportTimeRange = computed(() => {
  let start = 0;
  let end = props.totalDuration;
  if (rangeMode.value === 'playhead_end') {
    start = props.currentTime;
    end = props.totalDuration;
  } else if (rangeMode.value === 'custom') {
    start = Math.max(0, Math.min(props.totalDuration, customStart.value));
    end = Math.max(start + 0.1, Math.min(props.totalDuration, customEnd.value));
  }
  return { start, end };
});

const totalFrames = computed(() => {
  const { start, end } = exportTimeRange.value;
  return Math.max(1, Math.round((end - start) * fps.value));
});

async function startExport() {
  isExporting.value = true;
  exportProgress.value = 0;
  downloadReady.value = null;
  errorMessage.value = null;
  abortController = new AbortController();

  const { start, end } = exportTimeRange.value;

  try {
    const result = await exportPngSequenceZip({
      generator: props.generator,
      resolutionKey: resolutionKey.value,
      fps: fps.value,
      startTime: start,
      endTime: end,
      scaleMultiplier: scaleMultiplier.value,
      prefix: filePrefix.value,
      onProgress: (p) => {
        exportProgress.value = Math.round(p.progress * 100);
        currentFrameInfo.value = `Rendering frame ${p.frame} of ${p.totalFrames}...`;
      },
      abortSignal: abortController.signal
    });
    downloadReady.value = result;
    isExporting.value = false;
  } catch (err) {
    isExporting.value = false;
    errorMessage.value = err.message;
  }
}

function handleCancel() {
  if (abortController) abortController.abort();
  isExporting.value = false;
}

function handleDownload() {
  if (downloadReady.value) {
    triggerFileDownload(downloadReady.value.blob, downloadReady.value.filename);
  }
}
</script>
