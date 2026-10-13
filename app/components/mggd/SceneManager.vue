<template>
  <div style="display: flex; flex-direction: column; gap: 12px;">
    <!-- Scene List Bar -->
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <span style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">
          Scene Architecture ({{ scenes.length }}/8)
        </span>
        <button
          class="btn btn-secondary btn-sm"
          @click="$emit('add-scene')"
          :disabled="scenes.length >= 8"
          title="Add new scene (max 8 scenes)"
        >
          <Plus :size="12" />
          <span>Add Scene</span>
        </button>
      </div>

      <div style="display: flex; gap: 4px; flex-wrap: wrap;">
        <button
          v-for="(s, idx) in scenes"
          :key="s.id"
          class="btn btn-sm"
          :class="s.id === selectedScene?.id ? 'btn-primary' : 'btn-secondary'"
          @click="$emit('select-scene', s.id)"
          style="font-size: 11px;"
        >
          <Lock v-if="s.required" :size="10" style="margin-right: 3px;" />
          Scene {{ idx + 1 }}
        </button>
      </div>
    </div>

    <!-- Selected Scene Details -->
    <div
      v-if="selectedScene"
      style="padding: 12px; background: var(--bg-app); border-radius: var(--radius-md); border: 1px solid var(--border-medium); display: flex; flex-direction: column; gap: 10px;"
    >
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-weight: 700; color: var(--text-main); font-size: 12px;">
          Configure Scene #{{ selectedScene.order || 1 }}
        </span>
        <button
          v-if="scenes.length > 1"
          class="btn btn-ghost btn-sm"
          @click="$emit('delete-scene', selectedScene.id)"
          style="color: var(--status-error); padding: 2px 6px;"
          title="Delete this scene"
        >
          <Trash2 :size="12" />
          <span>Delete</span>
        </button>
      </div>

      <div class="form-group">
        <span class="form-label">Scene Label / Name</span>
        <input
          type="text"
          class="form-input"
          :value="selectedScene.name"
          @input="$emit('update-scene', selectedScene.id, { name: $event.target.value })"
        />
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px;">
        <div class="form-group">
          <span class="form-label">Default (s)</span>
          <input
            type="number"
            step="0.1"
            :min="selectedScene.minDuration"
            :max="selectedScene.maxDuration"
            class="form-input"
            :value="selectedScene.defaultDuration"
            @input="$emit('update-scene', selectedScene.id, { defaultDuration: Number($event.target.value), currentDuration: Number($event.target.value) })"
          />
        </div>
        <div class="form-group">
          <span class="form-label">Min Limit</span>
          <input
            type="number"
            step="0.1"
            min="0.5"
            :max="selectedScene.defaultDuration"
            class="form-input"
            :value="selectedScene.minDuration"
            @input="$emit('update-scene', selectedScene.id, { minDuration: Number($event.target.value) })"
          />
        </div>
        <div class="form-group">
          <span class="form-label">Max Limit</span>
          <input
            type="number"
            step="0.1"
            :min="selectedScene.defaultDuration"
            max="60"
            class="form-input"
            :value="selectedScene.maxDuration"
            @input="$emit('update-scene', selectedScene.id, { maxDuration: Number($event.target.value) })"
          />
        </div>
      </div>

      <!-- Required Scene Toggle -->
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 8px; background: var(--bg-card); border-radius: var(--radius-sm);">
        <div>
          <div style="font-weight: 600; font-size: 11px; color: var(--text-main);">Required Scene</div>
          <div style="font-size: 10px; color: var(--text-muted);">Buyer cannot delete or bypass this scene</div>
        </div>
        <input
          type="checkbox"
          :checked="Boolean(selectedScene.required)"
          @change="$emit('update-scene', selectedScene.id, { required: $event.target.checked })"
          style="width: 16px; height: 16px; accent-color: var(--accent-primary); cursor: pointer;"
        />
      </div>

      <!-- Transitions -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
        <div class="form-group">
          <span class="form-label">Entrance</span>
          <select
            class="form-select"
            :value="selectedScene.entrance || 'fade'"
            @change="$emit('update-scene', selectedScene.id, { entrance: $event.target.value })"
          >
            <option value="fade">Fade In</option>
            <option value="zoom-in">Zoom In</option>
            <option value="slide-in-left">Slide Left</option>
            <option value="strobe">Strobe Cut</option>
            <option value="wipe">Wipe</option>
          </select>
        </div>

        <div class="form-group">
          <span class="form-label">Exit</span>
          <select
            class="form-select"
            :value="selectedScene.exit || 'fade'"
            @change="$emit('update-scene', selectedScene.id, { exit: $event.target.value })"
          >
            <option value="fade">Fade Out</option>
            <option value="slide-out-right">Slide Right</option>
            <option value="shrink">Shrink Out</option>
            <option value="wipe">Wipe</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Plus, Trash2, Lock } from 'lucide-vue-next';

const props = defineProps({
  scenes: { type: Array, required: true },
  selectedSceneId: { type: String, default: null }
});

defineEmits(['select-scene', 'add-scene', 'delete-scene', 'update-scene']);

const selectedScene = computed(() => {
  return props.scenes.find((s) => s.id === props.selectedSceneId) || props.scenes[0];
});
</script>
