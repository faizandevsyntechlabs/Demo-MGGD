<template>
  <div v-if="isOpen" class="drawer-backdrop" @click="$emit('close')">
    <div class="drawer-panel" @click.stop>
      <div class="modal-header">
        <div style="display: flex; align-items: center; gap: 8px;">
          <Film :size="16" color="var(--accent-primary)" />
          <div>
            <div style="font-weight: 700; font-size: 13px;">Video Export</div>
            <div style="font-size: 11px; color: var(--text-muted);">Requirements 6, 12, 31: Real deterministic video encoding</div>
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

        <!-- Format Selection -->
        <div class="form-group">
          <span class="form-label">Container Format & Codec</span>
          <div style="display: flex; gap: 4px;">
            <button
              class="btn btn-sm"
              :class="selectedFormat === 'webm' ? 'btn-primary' : 'btn-secondary'"
              style="flex: 1; font-size: 11px;"
              @click="selectedFormat = 'webm'"
            >
              WebM (VP9)
            </button>
            <button
              class="btn btn-sm"
              :class="selectedFormat === 'mp4' ? 'btn-primary' : 'btn-secondary'"
              style="flex: 1; font-size: 11px;"
              @click="selectedFormat = 'mp4'"
            >
              MP4 {{ codecInfo.canRecordMp4 ? '(H.264)' : '(Browser N/A)' }}
            </button>
            <button
              class="btn btn-sm"
              :class="selectedFormat === 'mov' ? 'btn-primary' : 'btn-secondary'"
              style="flex: 1; font-size: 11px;"
              @click="selectedFormat = 'mov'"
            >
              MOV (ProRes)
            </button>
          </div>

          <div v-if="selectedFormat === 'mp4'" style="font-size: 10px; color: var(--text-secondary); margin-top: 4px; background: var(--bg-app); padding: 6px; border-radius: var(--radius-sm);">
            <strong>Codec Notice (Req 12):</strong> MP4 format does not support an alpha transparency channel. Transparent backgrounds will render against black.
          </div>
          <div v-if="selectedFormat === 'mov'" style="font-size: 10px; color: var(--status-warning); margin-top: 4px; background: rgba(245, 158, 11, 0.1); padding: 6px; border-radius: var(--radius-sm);">
            <strong>Unsupported in Browser:</strong> QuickTime MOV ProRes encoding requires native desktop muxing. Please select WebM or PNG sequence.
          </div>
        </div>

        <!-- Range Selection -->
        <div>
          <span class="form-label" style="margin-bottom: 6px;">Export Range</span>
          <div style="display: flex; gap: 4px;">
            <button
              class="btn btn-sm"
              :class="rangeMode === 'full' ? 'btn-primary' : 'btn-secondary'"
              style="flex: 1; font-size: 11px;"
              @click="rangeMode = 'full'"
            >
              Full ({{ totalDuration.toFixed(1) }}s)
            </button>
            <button
              class="btn btn-sm"
              :class="rangeMode === 'playhead_end' ? 'btn-primary' : 'btn-secondary'"
              style="flex: 1; font-size: 11px;"
              @click="rangeMode = 'playhead_end'"
            >
              Playhead to End
            </button>
          </div>
        </div>

        <!-- Frame Rate -->
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

        <!-- Resolution & Scale -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <div class="form-group">
            <span class="form-label">Resolution</span>
            <select class="form-select" v-model="resolutionKey">
              <option v-for="(item, key) in RESOLUTION_PRESETS" :key="key" :value="key">
                {{ item.label }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <span class="form-label">Scale Multiplier</span>
            <select class="form-select" v-model.number="scaleMultiplier">
              <option :value="1.0">1× Standard</option>
              <option :value="2.0">2× High-Res / 4K</option>
            </select>
          </div>
        </div>

        <!-- Encoding Summary -->
        <div style="padding: 10px; background: var(--bg-app); border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); font-size: 11px; display: flex; flex-direction: column; gap: 4px;">
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-muted);">Target Dimensions:</span>
            <span style="font-family: var(--font-mono);">{{ targetW }} × {{ targetH }} px</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-muted);">Frames to Encode:</span>
            <span style="font-family: var(--font-mono);">{{ totalFrames }} frames</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-muted);">Audio Track:</span>
            <span style="color: var(--text-secondary);">Silent (MGGD Standard)</span>
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

        <!-- Download Ready Card -->
        <div v-if="downloadReady" style="padding: 10px; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: var(--radius-sm); display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; align-items: center; gap: 6px; color: #34d399; font-weight: 600;">
            <CheckCircle :size="14" />
            <span>Video Encoded Successfully!</span>
          </div>
          <div style="font-size: 10px; color: var(--text-muted);">
            File Size: {{ (downloadReady.sizeBytes / (1024 * 1024)).toFixed(2) }} MB ({{ downloadReady.framesCount }} frames)
          </div>
          <button class="btn btn-success btn-sm" @click="handleDownload" style="width: 100%;">
            <Download :size="13" />
            <span>Download {{ downloadReady.filename }}</span>
          </button>
        </div>
      </div>

      <div class="modal-footer">
        <button v-if="isExporting" class="btn btn-secondary btn-sm" @click="handleCancel">
          Cancel Encoding
        </button>
        <button
          v-else
          class="btn btn-primary btn-sm"
          :disabled="isBuyerBlocked || selectedFormat === 'mov'"
          @click="startExport"
        >
          <Film :size="13" />
          <span>Start Video Export</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { X, Film, Download, AlertTriangle, CheckCircle } from 'lucide-vue-next';
import { RESOLUTION_PRESETS } from '~/utils/mggd/deterministicRenderer.js';
import { getSupportedVideoFormats, encodeVideoFromGenerator } from '~/utils/mggd/videoEncoder.js';
import { triggerFileDownload } from '~/utils/mggd/zipExport.js';

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  generator: { type: Object, required: true },
  currentTime: { type: Number, required: true },
  totalDuration: { type: Number, required: true },
  mode: { type: String, default: 'maker' }
});

defineEmits(['close']);

const rangeMode = ref('full');
const fps = ref(30);
const resolutionKey = ref(props.generator?.defaultSize || '1920x1080');
const scaleMultiplier = ref(1.0);
const selectedFormat = ref('webm');

const codecInfo = ref({ formats: [] });
const isExporting = ref(false);
const exportProgress = ref(0);
const currentFrameInfo = ref('');
const downloadReady = ref(null);
const errorMessage = ref(null);
let abortController = null;

onMounted(() => {
  codecInfo.value = getSupportedVideoFormats();
});

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

  let targetMime = 'video/webm;codecs=vp9';
  if (selectedFormat.value === 'mp4') {
    if (!codecInfo.value.canRecordMp4) {
      isExporting.value = false;
      errorMessage.value = 'MP4 recording is unsupported in your current browser MediaRecorder engine. Please select WebM.';
      return;
    }
    targetMime = 'video/mp4';
  } else if (selectedFormat.value === 'mov') {
    isExporting.value = false;
    errorMessage.value = 'MOV recording requires native desktop muxing. Please select WebM.';
    return;
  }

  const { start, end } = exportTimeRange.value;

  try {
    const result = await encodeVideoFromGenerator({
      generator: props.generator,
      resolutionKey: resolutionKey.value,
      fps: fps.value,
      startTime: start,
      endTime: end,
      scaleMultiplier: scaleMultiplier.value,
      mimeType: targetMime,
      onProgress: (p) => {
        exportProgress.value = Math.round(p.progress * 100);
        currentFrameInfo.value = `Encoding frame ${p.frame} of ${p.totalFrames}...`;
      },
      abortSignal: abortController.signal
    });

    downloadReady.value = {
      blob: result.blob,
      filename: `${props.generator.generatorId}_${resolutionKey.value}_${fps.value}fps.${result.extension}`,
      sizeBytes: result.sizeBytes,
      framesCount: result.framesCount
    };
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
