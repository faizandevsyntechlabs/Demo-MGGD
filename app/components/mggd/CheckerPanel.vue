<template>
  <div v-if="isOpen" class="modal-backdrop" @click="$emit('close')">
    <div class="modal-card" style="max-width: 820px; max-height: 88vh;" @click.stop>
      <div class="modal-header">
        <div style="display: flex; align-items: center; gap: 8px;">
          <CheckSquare :size="18" color="var(--accent-primary)" />
          <div>
            <div style="font-weight: 700; font-size: 14px;">MGGD Compliance Checker Dashboard</div>
            <div style="font-size: 11px; color: var(--text-muted);">
              Requirements 34-35: Strict verification gate for live generators
            </div>
          </div>
        </div>
        <button class="btn btn-ghost btn-sm btn-icon-only" @click="$emit('close')">
          <X :size="16" />
        </button>
      </div>

      <!-- Action bar -->
      <div style="padding: 12px 18px; background: var(--bg-app); border-bottom: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-size: 12px; font-weight: 600; color: var(--text-main);">
            Target: {{ generator.name }} ({{ generator.generatorId }})
          </div>
          <div style="font-size: 11px; color: var(--text-muted);">
            Status:
            <span :style="{ fontWeight: 700, color: generator.validationStatus === 'Verified' ? 'var(--status-success)' : 'var(--status-warning)' }">
              {{ generator.validationStatus }}
            </span>
          </div>
        </div>

        <button
          class="btn btn-primary btn-sm"
          :disabled="isEvaluating"
          @click="runChecker"
        >
          <RefreshCw :size="13" />
          <span>{{ isEvaluating ? 'Evaluating Rules...' : 'Run Compliance Checker' }}</span>
        </button>
      </div>

      <!-- Body -->
      <div class="modal-body">
        <div v-if="!lastReport" style="text-align: center; padding: 30px; color: var(--text-muted);">
          <ShieldCheck :size="36" style="margin: 0 auto 10px; opacity: 0.5;" />
          <div style="font-weight: 600; color: var(--text-main); margin-bottom: 4px;">
            Checker Ready for Execution
          </div>
          <div style="font-size: 12px; max-width: 440px; margin: 0 auto;">
            Click "Run Compliance Checker" to evaluate manifest structure, timing bounds, scene counts, safe areas, licensing, and live pixel determinism.
          </div>
        </div>

        <div v-else style="display: flex; flex-direction: column; gap: 16px;">
          <!-- Overall Banner -->
          <div
            :style="{
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              background: lastReport.verified ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              border: `1px solid ${lastReport.verified ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }"
          >
            <div style="display: flex; alignItems: center; gap: 10px;">
              <CheckCircle v-if="lastReport.verified" :size="22" color="var(--status-success)" />
              <AlertCircle v-else :size="22" color="var(--status-error)" />
              <div>
                <div :style="{ fontWeight: 700, fontSize: '13px', color: lastReport.verified ? '#34d399' : '#f87171' }">
                  {{ lastReport.verified ? 'VERIFICATION PASSED: All Compliance Rules Satisfied' : 'VERIFICATION FAILED: Unmet Compliance Rules Detected' }}
                </div>
                <div style="font-size: 11px; color: var(--text-secondary);">
                  Passed {{ lastReport.passedCount }} of {{ lastReport.tests.length }} tests
                </div>
              </div>
            </div>

            <span class="status-pill" :class="lastReport.verified ? 'verified' : 'unverified'">
              {{ lastReport.verified ? 'VERIFIED' : 'UNVERIFIED' }}
            </span>
          </div>

          <!-- Shared Checks -->
          <div>
            <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px;">
              Shared VGGD/MGGD Checks (Manifest, Security, Seek Protocol)
            </div>
            <div
              v-for="t in sharedTests"
              :key="t.id"
              class="checker-row"
              :class="t.status === 'PASS' ? 'pass' : 'fail'"
            >
              <CheckCircle v-if="t.status === 'PASS'" :size="14" color="var(--status-success)" />
              <AlertCircle v-else :size="14" color="var(--status-error)" />
              <div style="flex: 1;">
                <div style="display: flex; justify-content: space-between;">
                  <span style="font-weight: 600; color: var(--text-main); font-size: 12px;">{{ t.name }}</span>
                  <span :style="{ fontWeight: 700, fontSize: '10px', color: t.status === 'PASS' ? 'var(--status-success)' : 'var(--status-error)' }">
                    {{ t.status }}
                  </span>
                </div>
                <div style="font-size: 11px; color: var(--text-secondary); margin-top: 2px;">
                  {{ t.details }}
                </div>
              </div>
            </div>
          </div>

          <!-- MGGD Specific Checks -->
          <div>
            <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px;">
              MGGD-Specific Checks (Sizes, Length, Scenes, Loops, Determinism)
            </div>
            <div
              v-for="t in mggdTests"
              :key="t.id"
              class="checker-row"
              :class="t.status === 'PASS' ? 'pass' : 'fail'"
            >
              <CheckCircle v-if="t.status === 'PASS'" :size="14" color="var(--status-success)" />
              <AlertCircle v-else :size="14" color="var(--status-error)" />
              <div style="flex: 1;">
                <div style="display: flex; justify-content: space-between;">
                  <span style="font-weight: 600; color: var(--text-main); font-size: 12px;">{{ t.name }}</span>
                  <span :style="{ fontWeight: 700, fontSize: '10px', color: t.status === 'PASS' ? 'var(--status-success)' : 'var(--status-error)' }">
                    {{ t.status }}
                  </span>
                </div>
                <div style="font-size: 11px; color: var(--text-secondary); margin-top: 2px;">
                  {{ t.details }}
                </div>
              </div>
            </div>
          </div>
        </div>
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
import { computed } from 'vue';
import { X, CheckSquare, RefreshCw, ShieldCheck, CheckCircle, AlertCircle } from 'lucide-vue-next';
import { useMggdValidation } from '~/composables/useMggdValidation.js';

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  generator: { type: Object, required: true }
});

const emit = defineEmits(['close', 'update-validation-status']);

const { isEvaluating, lastReport, evaluateGenerator } = useMggdValidation();

const sharedTests = computed(() => {
  return lastReport.value?.tests?.filter((t) => t.group.includes('Shared')) || [];
});

const mggdTests = computed(() => {
  return lastReport.value?.tests?.filter((t) => t.group.includes('MGGD')) || [];
});

async function runChecker() {
  const result = await evaluateGenerator(props.generator);
  emit('update-validation-status', result.verified ? 'Verified' : 'Unverified');
}
</script>
