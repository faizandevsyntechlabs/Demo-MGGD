<template>
  <div class="bottom-timeline">
    <!-- Controls Header -->
    <div class="timeline-controls-bar">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 11px; fontWeight: 700; color: var(--text-muted); text-transform: uppercase;">
          Timeline Tracks
        </span>
        <span class="badge badge-violet" style="font-size: 10px;">
          {{ scenes.length }} Scenes · {{ totalDuration.toFixed(1) }}s Total
        </span>
      </div>

      <div style="display: flex; align-items: center; gap: 10px;">
        <!-- Zoom Controls -->
        <div style="display: flex; align-items: center; gap: 4px;">
          <button
            class="btn btn-ghost btn-sm btn-icon-only"
            @click="zoomLevel = Math.max(0.8, zoomLevel - 0.2)"
            title="Zoom Out Timeline"
          >
            <ZoomOut :size="12" />
          </button>
          <span style="font-size: 10px; color: var(--text-muted); min-width: 35px; text-align: center;">
            {{ Math.round(zoomLevel * 100) }}%
          </span>
          <button
            class="btn btn-ghost btn-sm btn-icon-only"
            @click="zoomLevel = Math.min(2.0, zoomLevel + 0.2)"
            title="Zoom In Timeline"
          >
            <ZoomIn :size="12" />
          </button>
        </div>

        <div style="font-size: 11px; font-family: var(--font-mono); color: var(--accent-secondary);">
          Playhead: {{ currentTime.toFixed(3) }}s
        </div>
      </div>
    </div>

    <!-- Timeline Interactive Body -->
    <div class="timeline-body" style="min-width: 100%;">
      <!-- Ruler Track -->
      <div
        ref="rulerRef"
        class="timeline-ruler"
        :style="{ width: `${zoomLevel * 100}%`, minWidth: '100%', cursor: 'pointer' }"
        @mousedown="handleMouseDown"
      >
        <div
          v-for="sec in numSeconds + 1"
          :key="sec - 1"
          class="ruler-tick"
          :style="{ left: `${((sec - 1) / totalDuration) * 100}%` }"
        >
          <template v-if="((sec - 1) / totalDuration) * 100 <= 100">
            {{ sec - 1 }}s
          </template>
        </div>

        <!-- Draggable Playhead Line -->
        <div
          class="timeline-playhead-line"
          :style="{ left: `${playheadPercent}%` }"
        >
          <div class="timeline-playhead-head" />
        </div>
      </div>

      <!-- Scene Blocks Track -->
      <div
        class="timeline-tracks-container"
        :style="{ width: `${zoomLevel * 100}%`, minWidth: '100%' }"
      >
        <div class="timeline-scenes-row">
          <div
            v-for="(scene, idx) in scenes"
            :key="scene.id"
            class="timeline-scene-block"
            :class="{ selected: scene.id === selectedSceneId }"
            :style="{
              left: `${(scene.startTime / totalDuration) * 100}%`,
              width: `calc(${(scene.duration / totalDuration) * 100}% - 4px)`
            }"
            @click="$emit('select-scene', scene.id)"
            :title="`${scene.name} (${scene.duration}s)`"
          >
            <div style="display: flex; align-items: center; gap: 6px; overflow: hidden;">
              <span v-if="scene.required" title="Required scene: Protected from removal">
                <Lock :size="10" color="var(--accent-secondary)" />
              </span>
              <span style="font-size: 11px; font-weight: 600; color: var(--text-main); white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">
                S{{ idx + 1 }}: {{ scene.name }}
              </span>
            </div>

            <span style="font-size: 10px; font-family: var(--font-mono); color: var(--text-muted);">
              {{ scene.duration.toFixed(1) }}s
            </span>
          </div>
        </div>

        <!-- Subtrack: Animated Objects in Selected Scene -->
        <template v-for="scene in scenes" :key="`sub-${scene.id}`">
          <div
            v-if="scene.id === selectedSceneId"
            style="margin: 0 8px; display: flex; flex-direction: column; gap: 4px;"
          >
            <div
              v-for="obj in (scene.objects || [])"
              :key="obj.id"
              style="position: relative; height: 22px; background: rgba(255,255,255,0.02); border-radius: 3px;"
            >
              <div
                :style="{
                  position: 'absolute',
                  left: `${((scene.startTime + (obj.delay || 0)) / totalDuration) * 100}%`,
                  width: `${Math.max(2, ((obj.duration || 1.0) / totalDuration) * 100)}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, rgba(139, 92, 246, 0.4), rgba(6, 182, 212, 0.4))',
                  border: '1px solid var(--accent-primary)',
                  borderRadius: '3px',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 6px',
                  fontSize: '10px',
                  color: '#ffffff',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap'
                }"
              >
                {{ obj.name }} ({{ obj.trigger }})
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { ZoomIn, ZoomOut, Lock } from 'lucide-vue-next';

const props = defineProps({
  timeline: { type: Object, required: true },
  currentTime: { type: Number, required: true },
  totalDuration: { type: Number, required: true },
  selectedSceneId: { type: String, default: null },
  mode: { type: String, default: 'maker' },
  fps: { type: Number, default: 30 }
});

const emit = defineEmits(['seek', 'select-scene']);

const rulerRef = ref(null);
const zoomLevel = ref(1.0);
const isDragging = ref(false);

const scenes = computed(() => props.timeline?.scenes || []);

const numSeconds = computed(() => Math.ceil(props.totalDuration || 5));

const playheadPercent = computed(() => {
  return ((props.currentTime / Math.max(0.01, props.totalDuration)) * 100);
});

function handleSeekFromEvent(e) {
  if (!rulerRef.value) return;
  const rect = rulerRef.value.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const ratio = Math.max(0, Math.min(1, clickX / rect.width));
  emit('seek', ratio * props.totalDuration);
}

function handleMouseDown(e) {
  isDragging.value = true;
  handleSeekFromEvent(e);
}

function handleMouseMove(e) {
  if (!isDragging.value) return;
  handleSeekFromEvent(e);
}

function handleMouseUp() {
  isDragging.value = false;
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseup', handleMouseUp);
});

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('mouseup', handleMouseUp);
});
</script>
