<template>
  <div class="center-viewport">
    <!-- Viewport Toolbar -->
    <div class="viewport-toolbar">
      <div class="playback-controls">
        <button
          class="btn btn-secondary btn-sm btn-icon-only"
          @click="$emit('step-frame', -1)"
          title="Step 1 frame backward"
        >
          <SkipBack :size="13" />
        </button>

        <button
          class="btn btn-sm"
          :class="isPlaying ? 'btn-secondary' : 'btn-primary'"
          @click="$emit('toggle-play')"
          :title="isPlaying ? 'Pause playback' : 'Play animation'"
        >
          <Pause v-if="isPlaying" :size="13" />
          <Play v-else :size="13" />
          <span>{{ isPlaying ? 'Pause' : 'Play' }}</span>
        </button>

        <button
          class="btn btn-secondary btn-sm btn-icon-only"
          @click="$emit('step-frame', 1)"
          title="Step 1 frame forward"
        >
          <SkipForward :size="13" />
        </button>

        <!-- Timecode -->
        <div class="timecode-badge" title="SMPTE Timecode (HH:MM:SS:FF)">
          {{ formattedCurrentTime }}
        </div>
        <span style="font-size: 11px; color: var(--text-muted);">
          / {{ formattedTotalDuration }} ({{ fps }} FPS)
        </span>
      </div>

      <!-- Tools -->
      <div style="display: flex; align-items: center; gap: 6px;">
        <button
          class="btn btn-sm"
          :class="showSafeArea ? 'btn-secondary' : 'btn-ghost'"
          @click="showSafeArea = !showSafeArea"
          :style="{ color: showSafeArea ? 'var(--status-error)' : 'var(--text-secondary)' }"
          title="Toggle 5% Safe Area Guide (Requirement 11)"
        >
          <ShieldAlert :size="13" />
          <span>5% Safe Area</span>
        </button>

        <button
          class="btn btn-sm"
          :class="showCheckerboard ? 'btn-secondary' : 'btn-ghost'"
          @click="showCheckerboard = !showCheckerboard"
          title="Toggle Transparency Checkerboard"
        >
          <Grid :size="13" />
          <span>Alpha Grid</span>
        </button>

        <select
          class="form-select"
          style="padding: 2px 6px; font-size: 11px;"
          v-model="zoomMode"
        >
          <option value="fit">Fit View</option>
          <option value="50%">50%</option>
          <option value="100%">100%</option>
        </select>

        <button
          class="btn btn-sm"
          :class="showDebug ? 'btn-primary' : 'btn-ghost'"
          @click="showDebug = !showDebug"
          title="Toggle Seek Protocol & Determinism Debug Console"
        >
          <Terminal :size="13" />
          <span>Debug</span>
        </button>
      </div>
    </div>

    <!-- Canvas Stage -->
    <div
      class="canvas-container"
      :class="{ checkerboard: isTransparent && showCheckerboard }"
    >
      <div
        class="canvas-frame"
        :style="canvasFrameStyle"
        :data-ready="isReady ? 'true' : 'false'"
      >
        <canvas
          ref="canvasRef"
          class="render-canvas"
          :width="resolutionMeta.width"
          :height="resolutionMeta.height"
        />

        <div v-if="showSafeArea" class="safe-area-guide">
          <div class="safe-area-label">5% SAFE AREA MARGIN</div>
        </div>
      </div>
    </div>

    <!-- Safe Area Warning Banner -->
    <div
      v-if="violations.length > 0 && showSafeArea"
      style="position: absolute; bottom: 8px; left: 12px; right: 12px; background: rgba(239, 68, 68, 0.9); color: #fff; padding: 6px 12px; border-radius: var(--radius-sm); font-size: 11px; display: flex; align-items: center; gap: 8px; z-index: 25;"
    >
      <AlertTriangle :size="14" />
      <span><strong>Safe Area Warning (Requirement 11):</strong> {{ violations[0].reason }}</span>
    </div>

    <!-- Debug Console Drawer -->
    <div
      v-if="showDebug"
      style="position: absolute; top: 46px; right: 12px; width: 340px; background: rgba(17, 24, 39, 0.95); backdrop-filter: blur(8px); border: 1px solid var(--border-medium); border-radius: var(--radius-md); padding: 12px; z-index: 35; box-shadow: var(--shadow-lg); font-size: 11px; display: flex; flex-direction: column; gap: 8px;"
    >
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-subtle); padding-bottom: 6px;">
        <div style="font-weight: 700; display: flex; align-items: center; gap: 6px; color: var(--accent-secondary);">
          <Terminal :size="13" />
          <span>Seek Protocol & Readiness Debug</span>
        </div>
        <button class="btn btn-ghost btn-sm" style="padding: 0 4px;" @click="showDebug = false">✕</button>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
        <div>
          <span style="color: var(--text-muted);">Timestamp:</span>
          <div style="font-family: var(--font-mono); font-weight: 600;">{{ currentTime.toFixed(3) }}s</div>
        </div>
        <div>
          <span style="color: var(--text-muted);">Frame #:</span>
          <div style="font-family: var(--font-mono); font-weight: 600;">{{ Math.floor(currentTime * fps) }}</div>
        </div>
        <div>
          <span style="color: var(--text-muted);">Surface Ready:</span>
          <div :style="{ color: isReady ? 'var(--status-success)' : 'var(--status-error)', fontWeight: 600 }">
            {{ isReady ? 'READY (data-ready=true)' : 'WAITING ASSETS' }}
          </div>
        </div>
        <div>
          <span style="color: var(--text-muted);">Failed Assets:</span>
          <div style="font-family: var(--font-mono);">{{ failedAssetsCount }}</div>
        </div>
      </div>

      <div style="background: var(--bg-app); padding: 6px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
        <span style="color: var(--text-muted); font-size: 10px;">Last vincta:seek Event Ack:</span>
        <div style="font-family: var(--font-mono); font-size: 10px; color: var(--text-main); margin-top: 2px;">
          {{ lastAck ? `Ack t=${lastAck.timestamp.toFixed(3)}s (msgId: ${lastAck.messageId})` : 'Listening on window message bus...' }}
        </div>
      </div>

      <button
        class="btn btn-secondary btn-sm"
        @click="runRandomSeekTest"
        style="width: 100%; margin-top: 4px;"
      >
        <Activity :size="12" color="var(--accent-primary)" />
        <span>Test Random Seek Order (Pixel Test)</span>
      </button>

      <div
        v-if="determinismTestReport"
        :style="{
          background: determinismTestReport.passed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          border: `1px solid ${determinismTestReport.passed ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
          padding: '6px 8px',
          borderRadius: 'var(--radius-sm)',
          fontSize: '10px'
        }"
      >
        <div :style="{ fontWeight: 700, color: determinismTestReport.passed ? 'var(--status-success)' : 'var(--status-error)' }">
          {{ determinismTestReport.passed ? '✓ Pixel Determinism 100% Match' : '✗ Determinism Discrepancy' }}
        </div>
        <div style="color: var(--text-secondary); margin-top: 2px;">
          {{ determinismTestReport.message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  ShieldAlert, 
  Grid, 
  Terminal, 
  Activity, 
  AlertTriangle 
} from 'lucide-vue-next';
import { renderFrame, RESOLUTION_PRESETS } from '~/utils/mggd/deterministicRenderer.js';
import { formatTimecode } from '~/utils/mggd/timingEngine.js';
import { assetLoader } from '~/utils/mggd/assetLoader.js';

const props = defineProps({
  activeGenerator: { type: Object, required: true },
  currentResolution: { type: String, required: true },
  currentTime: { type: Number, required: true },
  totalDuration: { type: Number, required: true },
  isPlaying: { type: Boolean, required: true },
  fps: { type: Number, default: 30 },
  lastAck: { type: Object, default: null }
});

const emit = defineEmits(['toggle-play', 'step-frame', 'seek']);

const canvasRef = ref(null);
const zoomMode = ref('fit');
const showSafeArea = ref(true);
const showCheckerboard = ref(true);
const showDebug = ref(false);
const violations = ref([]);
const isReady = ref(true);
const failedAssetsCount = ref(0);
const determinismTestReport = ref(null);

const resolutionMeta = computed(() => {
  return RESOLUTION_PRESETS[props.currentResolution] || RESOLUTION_PRESETS['1920x1080'];
});

const isTransparent = computed(() => {
  return Boolean(props.activeGenerator.transparency);
});

const formattedCurrentTime = computed(() => {
  return formatTimecode(props.currentTime, props.fps);
});

const formattedTotalDuration = computed(() => {
  return formatTimecode(props.totalDuration, props.fps);
});

const canvasFrameStyle = computed(() => {
  const res = resolutionMeta.value;
  if (zoomMode.value === '100%') {
    return { width: `${res.width}px`, height: `${res.height}px` };
  }
  if (zoomMode.value === '50%') {
    return { width: `${res.width * 0.5}px`, height: `${res.height * 0.5}px` };
  }
  const aspect = res.width / res.height;
  if (aspect >= 1) {
    return { width: 'min(92%, 820px)', height: 'auto', aspectRatio: `${res.width} / ${res.height}` };
  } else {
    return { height: 'min(78vh, 520px)', width: 'auto', aspectRatio: `${res.width} / ${res.height}` };
  }
});

function drawActiveFrame() {
  if (!canvasRef.value) return;
  const result = renderFrame(canvasRef.value, props.activeGenerator, props.currentTime, props.currentResolution, {
    showSafeArea: showSafeArea.value,
    scaleMultiplier: 1.0
  });
  if (result && result.violations) {
    violations.value = result.violations;
  }
}

watch(
  [() => props.activeGenerator, () => props.currentTime, () => props.currentResolution, showSafeArea],
  () => {
    drawActiveFrame();
  }
);

onMounted(() => {
  drawActiveFrame();
  const report = assetLoader.getReadinessReport();
  isReady.value = report.status === 'READY';
  failedAssetsCount.value = assetLoader.failedAssets.length;
});

async function runRandomSeekTest() {
  if (!canvasRef.value) return;
  const testCanvas = document.createElement('canvas');
  testCanvas.width = 320;
  testCanvas.height = 180;

  const timestamps = [0.5, 2.2, 0.0, 1.4, 0.5];
  const snapshots = [];

  for (const t of timestamps) {
    renderFrame(testCanvas, props.activeGenerator, t, props.currentResolution, { scaleMultiplier: 320 / 1920 });
    const ctx = testCanvas.getContext('2d', { willReadFrequently: true });
    const imgData = ctx.getImageData(0, 0, testCanvas.width, testCanvas.height);
    snapshots.push({ time: t, data: new Uint8ClampedArray(imgData.data) });
  }

  const firstRun = snapshots[0].data;
  const secondRun = snapshots[4].data;

  let diffCount = 0;
  for (let i = 0; i < firstRun.length; i++) {
    if (firstRun[i] !== secondRun[i]) diffCount++;
  }

  const passed = diffCount === 0;
  determinismTestReport.value = {
    passed,
    testedSequence: timestamps,
    diffPixels: diffCount,
    message: passed
      ? 'Determinism Verified: Random out-of-order seeks produced 100% identical pixel buffers.'
      : `Determinism Discrepancy: ${diffCount} byte differences detected.`
  };
}
</script>
