<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="sidebar-title">
        <Layers :size="13" />
        <span>Generators & Catalog</span>
      </div>
      <button
        v-if="mode === 'maker'"
        class="btn btn-ghost btn-sm btn-icon-only"
        @click="$emit('create-revision')"
        title="Create New Generator Revision (Requirement 4)"
      >
        <RefreshCw :size="12" />
      </button>
    </div>

    <!-- Tabs -->
    <div class="sidebar-tabs">
      <button
        class="sidebar-tab"
        :class="{ active: activeTab === 'library' }"
        @click="activeTab = 'library'"
      >
        My Library ({{ generators.length }})
      </button>
      <button
        class="sidebar-tab"
        :class="{ active: activeTab === 'catalog' }"
        @click="activeTab = 'catalog'"
      >
        Catalog (23)
      </button>
      <button
        class="sidebar-tab"
        :class="{ active: activeTab === 'info' }"
        @click="activeTab = 'info'"
      >
        Metadata
      </button>
    </div>

    <!-- Tab Content -->
    <div class="sidebar-content">
      <!-- Library Tab -->
      <div v-if="activeTab === 'library'" style="display: flex; flex-direction: column; gap: 8px;">
        <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 4px;">
          Select an existing animated component to configure or render:
        </div>

        <div
          v-for="gen in generators"
          :key="gen.generatorId"
          @click="$emit('select-generator', gen.generatorId)"
          :style="{
            padding: '8px 10px',
            borderRadius: 'var(--radius-md)',
            background: gen.generatorId === activeGenerator.generatorId ? 'var(--bg-surface)' : 'var(--bg-card)',
            border: `1px solid ${gen.generatorId === activeGenerator.generatorId ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
            cursor: 'pointer',
            transition: 'all 0.15s'
          }"
        >
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 3px;">
            <div style="font-weight: 600; color: var(--text-main); font-size: 12px;">
              {{ gen.name }}
            </div>
            <span v-if="gen.generatorId === activeGenerator.generatorId" class="badge badge-violet">Active</span>
          </div>
          <div style="font-size: 10px; color: var(--text-muted); font-family: var(--font-mono);">
            {{ gen.generatorId }}
          </div>
          <div style="display: flex; gap: 4px; margin-top: 6px;">
            <span class="badge" style="background: rgba(255,255,255,0.06);">
              {{ gen.scenes?.length || 1 }} scenes
            </span>
            <span class="badge" style="background: rgba(255,255,255,0.06);">
              {{ gen.classification?.category || 'Motion' }}
            </span>
          </div>
        </div>

        <!-- Package Operations -->
        <div style="border-top: 1px solid var(--border-subtle); padding-top: 10px; margin-top: 6px;">
          <div style="font-size: 11px; font-weight: 600; color: var(--text-secondary); margin-bottom: 6px;">
            Generator Package Operations
          </div>
          <div style="display: flex; gap: 6px; flex-direction: column;">
            <button
              v-if="mode === 'maker'"
              class="btn btn-secondary btn-sm"
              @click="$emit('create-revision')"
              style="width: 100%;"
            >
              <RefreshCw :size="12" />
              <span>Create New Revision (New ID)</span>
            </button>

            <div style="display: flex; gap: 6px;">
              <label class="btn btn-secondary btn-sm" style="flex: 1; cursor: pointer;">
                <Upload :size="12" />
                <span>Import JSON</span>
                <input type="file" accept=".json" @change="handleFileUpload" style="display: none;" />
              </label>
              <button class="btn btn-secondary btn-sm" @click="handleExportJson" style="flex: 1;">
                <Download :size="12" />
                <span>Export JSON</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Catalog Tab (23 Types) -->
      <div v-else-if="activeTab === 'catalog'" style="display: flex; flex-direction: column; gap: 8px;">
        <div style="font-size: 11px; color: var(--text-muted);">
          23 Standard Motion Generator Types (Requirement 30):
        </div>

        <!-- Filter Buttons -->
        <div style="display: flex; gap: 4px;">
          <button
            v-for="grp in ['ALL', 'Motion', 'Logo Reveal', 'Lower Third']"
            :key="grp"
            class="btn btn-sm"
            :class="typeFilter === grp ? 'btn-primary' : 'btn-ghost'"
            style="font-size: 10px; padding: 3px 6px;"
            @click="typeFilter = grp"
          >
            {{ grp }}
          </button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 6px; max-height: 55vh; overflow-y: auto;">
          <div
            v-for="t in filteredTypes"
            :key="t.typeId"
            style="padding: 8px; border-radius: var(--radius-sm); background: var(--bg-card); border: 1px solid var(--border-subtle); display: flex; flex-direction: column; gap: 4px;"
          >
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight: 600; font-size: 11px; color: var(--text-main);">
                {{ t.name }}
              </span>
              <span class="badge badge-violet" style="font-size: 9px;">
                {{ t.group }}
              </span>
            </div>
            <div style="font-size: 10px; color: var(--text-muted);">
              {{ t.style }} · {{ t.mood }}
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 2px;">
              <span style="font-size: 9px; font-family: var(--font-mono); color: var(--text-muted);">
                {{ t.typeId }}
              </span>
              <button
                class="btn btn-secondary btn-sm"
                style="padding: 2px 6px; font-size: 10px;"
                @click="$emit('load-from-catalog', t)"
              >
                <Plus :size="10" />
                <span>Instantiate</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Metadata Tab -->
      <div v-else style="display: flex; flex-direction: column; gap: 10px;">
        <div style="font-size: 11px; font-weight: 600; color: var(--text-secondary);">
          Classification & VGR Metadata (5 Fields)
        </div>

        <div class="form-group">
          <span class="form-label">Generator ID</span>
          <input
            type="text"
            class="form-input"
            readonly
            :value="activeGenerator.generatorId"
            style="font-family: var(--font-mono); font-size: 10px; color: var(--accent-secondary);"
          />
        </div>

        <div class="form-group">
          <span class="form-label">Panel Version</span>
          <input type="text" class="form-input" readonly value="M1.0" />
        </div>

        <div class="form-group">
          <span class="form-label">1. Category</span>
          <input
            type="text"
            class="form-input"
            :readonly="mode === 'buyer'"
            :value="activeGenerator.classification?.category || ''"
          />
        </div>

        <div class="form-group">
          <span class="form-label">2. Subcategory</span>
          <input
            type="text"
            class="form-input"
            :readonly="mode === 'buyer'"
            :value="activeGenerator.classification?.subcategory || ''"
          />
        </div>

        <div class="form-group">
          <span class="form-label">3. Style</span>
          <input
            type="text"
            class="form-input"
            :readonly="mode === 'buyer'"
            :value="activeGenerator.classification?.style || ''"
          />
        </div>

        <div class="form-group">
          <span class="form-label">4. Mood</span>
          <input
            type="text"
            class="form-input"
            :readonly="mode === 'buyer'"
            :value="activeGenerator.classification?.mood || ''"
          />
        </div>

        <div class="form-group">
          <span class="form-label">5. Industry</span>
          <input
            type="text"
            class="form-input"
            :readonly="mode === 'buyer'"
            :value="activeGenerator.classification?.industry || ''"
          />
        </div>

        <div style="padding: 8px; background: var(--bg-app); border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); font-size: 10px; color: var(--text-muted);">
          <strong>MGGD Rule:</strong> Classification metadata is immutable for Buyers. Only Makers can define or revise generator taxonomy.
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Layers, RefreshCw, Upload, Download, Plus } from 'lucide-vue-next';
import { GENERATOR_TYPES } from '~/data/motionTypes.js';

const props = defineProps({
  mode: { type: String, required: true },
  generators: { type: Array, required: true },
  activeGenerator: { type: Object, required: true }
});

const emit = defineEmits([
  'select-generator',
  'load-from-catalog',
  'create-revision',
  'import-generator'
]);

const activeTab = ref('library');
const typeFilter = ref('ALL');

const filteredTypes = computed(() => {
  if (typeFilter.value === 'ALL') return GENERATOR_TYPES;
  return GENERATOR_TYPES.filter((t) => t.group === typeFilter.value);
});

function handleFileUpload(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const parsed = JSON.parse(event.target.result);
      emit('import-generator', parsed);
    } catch (err) {
      alert('Invalid generator JSON: ' + err.message);
    }
  };
  reader.readAsText(file);
}

function handleExportJson() {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(props.activeGenerator, null, 2));
  const a = document.createElement('a');
  a.setAttribute('href', dataStr);
  a.setAttribute('download', `${props.activeGenerator.generatorId}.mggd.json`);
  document.body.appendChild(a);
  a.click();
  a.remove();
}
</script>
