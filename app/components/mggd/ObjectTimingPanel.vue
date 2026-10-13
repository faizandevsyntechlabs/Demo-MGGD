<template>
  <div style="display: flex; flex-direction: column; gap: 10px;">
    <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">
      Animated Objects & Triggers ({{ objects.length }})
    </div>

    <div
      v-for="obj in objects"
      :key="obj.id"
      style="padding: 10px; border-radius: var(--radius-md); background: var(--bg-app); border: 1px solid var(--border-medium); display: flex; flex-direction: column; gap: 8px;"
    >
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-weight: 600; font-size: 12px; color: var(--text-main);">
          {{ obj.name }} ({{ obj.type }})
        </span>
        <span class="badge badge-violet" style="font-size: 9px;">
          t = {{ (obj.delay || 0).toFixed(1) }}s – {{ ((obj.delay || 0) + (obj.duration || 1.0)).toFixed(1) }}s
        </span>
      </div>

      <!-- Trigger Selector (3 Automatic Triggers - Requirement 22) -->
      <div class="form-group">
        <span class="form-label">Trigger Type (Requirement 22)</span>
        <select
          class="form-select"
          :value="obj.trigger || 'Auto - Once - Stay'"
          @change="$emit('update-object', scene.id, obj.id, { trigger: $event.target.value })"
        >
          <option v-for="trig in VALID_TRIGGERS" :key="trig" :value="trig">
            {{ trig }}
          </option>
        </select>
      </div>

      <!-- Timing Sliders -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
        <div class="form-group">
          <span class="form-label">Delay: {{ (obj.delay || 0).toFixed(1) }}s</span>
          <input
            type="range"
            :min="obj.minDelay || 0"
            :max="obj.maxDelay || 3"
            step="0.1"
            :value="obj.delay || 0"
            @input="$emit('update-object', scene.id, obj.id, { delay: Number($event.target.value) })"
            style="width: 100%; accent-color: var(--accent-primary);"
          />
        </div>

        <div class="form-group">
          <span class="form-label">Duration: {{ (obj.duration || 1.0).toFixed(1) }}s</span>
          <input
            type="range"
            :min="obj.minDuration || 0.5"
            :max="obj.maxDuration || 6"
            step="0.1"
            :value="obj.duration || 1.0"
            @input="$emit('update-object', scene.id, obj.id, { duration: Number($event.target.value) })"
            style="width: 100%; accent-color: var(--accent-primary);"
          />
        </div>
      </div>

      <!-- Auto-Grow Notice -->
      <div
        v-if="(obj.delay || 0) + (obj.duration || 1.0) > (scene.currentDuration || 3.0)"
        style="display: flex; align-items: center; gap: 6px; font-size: 10px; color: var(--status-warning);"
      >
        <AlertCircle :size="12" />
        <span>Timing exceeds scene duration; timeline will auto-grow up to max ({{ scene.maxDuration }}s).</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { AlertCircle } from 'lucide-vue-next';
import { VALID_TRIGGERS } from '~/composables/useMggdValidation.js';

const props = defineProps({
  scene: { type: Object, default: () => ({ objects: [] }) }
});

defineEmits(['update-object']);

const objects = computed(() => props.scene?.objects || []);
</script>
