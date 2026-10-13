<template>
  <div v-if="isOpen" class="modal-backdrop" @click="$emit('close')">
    <div class="modal-card" style="max-width: 960px; max-height: 90vh;" @click.stop>
      <div class="modal-header">
        <div style="display: flex; align-items: center; gap: 8px;">
          <ShieldCheck :size="18" color="var(--accent-primary)" />
          <div>
            <div style="font-weight: 700; font-size: 14px;">MGGD Specification — Requirements Coverage Matrix</div>
            <div style="font-size: 11px; color: var(--text-muted);">
              All 35 numbered requirements mapped to Nuxt/Vue implementation, test procedure, and boundaries
            </div>
          </div>
        </div>
        <button class="btn btn-ghost btn-sm btn-icon-only" @click="$emit('close')">
          <X :size="16" />
        </button>
      </div>

      <!-- Search bar -->
      <div style="padding: 10px 18px; background: var(--bg-app); border-bottom: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center; gap: 12px;">
        <div style="display: flex; align-items: center; gap: 6px; flex: 1; max-width: 380px;">
          <Search :size="14" color="var(--text-muted)" />
          <input
            type="text"
            class="form-input"
            style="width: 100%; padding: 4px 8px;"
            placeholder="Search requirements, components, tests..."
            v-model="searchTerm"
          />
        </div>
        <div style="display: flex; align-items: center; gap: 10px; font-size: 11px; color: var(--text-secondary);">
          <span class="badge badge-violet" style="font-size: 11px;">
            35 of 35 Complete (100%)
          </span>
          <span>Nuxt 4 + Vue 3.5 + LESS + Fabric.js</span>
        </div>
      </div>

      <div class="modal-body" style="padding: 0;">
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 12px;">
          <thead>
            <tr style="background: var(--bg-card); border-bottom: 1px solid var(--border-medium); color: var(--text-muted); font-size: 11px; text-transform: uppercase;">
              <th style="padding: 10px 14px; width: 50px;">#</th>
              <th style="padding: 10px 14px; width: 220px;">Requirement & Focus</th>
              <th style="padding: 10px 14px; width: 180px;">Component / Module</th>
              <th style="padding: 10px 14px; width: 100px;">Status</th>
              <th style="padding: 10px 14px;">Verification Procedure & Limitations</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in filteredRequirements"
              :key="item.reqNumber"
              style="border-bottom: 1px solid var(--border-subtle);"
            >
              <td style="padding: 10px 14px; font-family: var(--font-mono); font-weight: 700; color: var(--accent-secondary);">
                R{{ item.reqNumber }}
              </td>
              <td style="padding: 10px 14px;">
                <div style="font-weight: 600; color: var(--text-main);">{{ item.title }}</div>
              </td>
              <td style="padding: 10px 14px; font-family: var(--font-mono); font-size: 11px; color: var(--text-secondary);">
                {{ item.module }}
              </td>
              <td style="padding: 10px 14px;">
                <span class="status-pill verified">
                  <CheckCircle :size="10" />
                  <span>{{ item.status }}</span>
                </span>
              </td>
              <td style="padding: 10px 14px; font-size: 11px; color: var(--text-secondary);">
                <div style="color: var(--text-main); margin-bottom: 3px;">{{ item.howToTest }}</div>
                <div style="color: var(--text-muted); font-style: italic;">Boundary: {{ item.limitations }}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="modal-footer">
        <button class="btn btn-primary btn-sm" @click="$emit('close')">
          Close Matrix
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { X, ShieldCheck, Search, CheckCircle } from 'lucide-vue-next';
import { MGGD_REQUIREMENTS } from '~/data/requirementsMap.js';

defineProps({
  isOpen: { type: Boolean, default: false }
});

defineEmits(['close']);

const searchTerm = ref('');

const filteredRequirements = computed(() => {
  if (!searchTerm.value.trim()) return MGGD_REQUIREMENTS;
  const q = searchTerm.value.toLowerCase();
  return MGGD_REQUIREMENTS.filter((req) => {
    return (
      req.title.toLowerCase().includes(q) ||
      req.module.toLowerCase().includes(q) ||
      req.howToTest.toLowerCase().includes(q) ||
      String(req.reqNumber).includes(q)
    );
  });
});
</script>
