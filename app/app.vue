<template>
  <div class="app-container">
    <!-- Top Header -->
    <MggdHeader
      v-model:mode="mode"
      v-model:currentResolution="currentResolution"
      :active-generator="activeGenerator"
      :show-walkthrough="showWalkthrough"
      @open-size-comparison="showSizeModal = true"
      @open-manifest="showManifestModal = true"
      @open-vgr="showVgrModal = true"
      @open-checker="showCheckerModal = true"
      @open-png-export="showPngDrawer = true"
      @open-video-export="showVideoDrawer = true"
      @open-requirements="showRequirementsModal = true"
      @toggle-walkthrough="showWalkthrough = !showWalkthrough"
    />

    <!-- Interactive Walkthrough Guide Banner (Requirement 20) -->
    <WalkthroughBanner
      :is-visible="showWalkthrough"
      @close="showWalkthrough = false"
      @step-change="handleWalkthroughStepChange"
    />

    <!-- Main 3-Column Workspace Grid -->
    <main class="workspace-grid">
      <!-- Left Sidebar: Generator Library & 23 Catalog Types -->
      <GeneratorLibrary
        :generators="generators"
        :active-generator="activeGenerator"
        :mode="mode"
        @select-generator="selectGenerator"
        @create-revision="createNewRevision"
        @create-from-type="loadFromCatalogType"
      />

      <!-- Center Workspace: Deterministic Canvas & Playback -->
      <AnimationPreview
        :active-generator="activeGenerator"
        :current-resolution="currentResolution"
        :current-time="currentTime"
        :total-duration="totalDuration"
        :is-playing="isPlaying"
        :fps="fps"
        :last-ack="lastAck"
        @toggle-play="togglePlay"
        @step-frame="stepFrame"
        @seek="seekTo"
      />

      <!-- Right Sidebar: Contextual Inspector (Maker Mode or Buyer Mode) -->
      <aside class="sidebar right">
        <div class="sidebar-header">
          <div class="sidebar-title">
            <component :is="mode === 'maker' ? Wrench : Sliders" :size="13" />
            <span>{{ mode === 'maker' ? 'Maker Architect' : 'Buyer Customizer' }}</span>
          </div>
          <span class="badge" :class="mode === 'maker' ? 'badge-violet' : 'badge-blue'">
            {{ mode === 'maker' ? 'Design Engine' : 'Client Mode' }}
          </span>
        </div>

        <div class="sidebar-content" style="padding: 12px; overflow-y: auto; flex: 1;">
          <!-- Maker Panel -->
          <MakerPanel
            v-if="mode === 'maker'"
            :active-generator="activeGenerator"
            :selected-scene-id="selectedSceneId"
            @select-scene="selectedSceneId = $event"
            @add-scene="addMakerScene"
            @delete-scene="deleteMakerScene"
            @update-scene="updateMakerScene"
            @update-object="updateMakerObject"
            @update-generator="(updates) => updateActiveGenerator(updates)"
          />

          <!-- Buyer Panel -->
          <BuyerPanel
            v-else
            :properties="activeGenerator.properties || activeGenerator.defaultProperties || {}"
            :scenes="activeGenerator.scenes || []"
            :selected-scene-id="selectedSceneId"
            @update-properties="updateBuyerProperties"
            @select-scene="selectedSceneId = $event"
            @reorder-scenes="reorderScenes"
            @remove-scene="removeScene"
            @set-scene-duration="setSceneDuration"
            @apply-theme="applyTheme"
          />
        </div>
      </aside>
    </main>

    <!-- Bottom Timeline: Scenes, Tracks & Playhead -->
    <SceneTimeline
      :scenes="activeGenerator.scenes || []"
      :total-duration="totalDuration"
      :current-time="currentTime"
      :selected-scene-id="selectedSceneId"
      :mode="mode"
      @seek="seekTo"
      @select-scene="selectedSceneId = $event"
      @reorder-scenes="reorderScenes"
      @update-duration="setSceneDuration"
    />

    <!-- Modals & Drawers -->
    <CheckerPanel
      :is-open="showCheckerModal"
      :generator="activeGenerator"
      @close="showCheckerModal = false"
      @update-validation-status="handleUpdateValidationStatus"
    />

    <ManifestViewer
      :is-open="showManifestModal"
      :generator="activeGenerator"
      @close="showManifestModal = false"
    />

    <VgrModal
      :is-open="showVgrModal"
      :generator="activeGenerator"
      @close="showVgrModal = false"
    />

    <SizeComparisonModal
      :is-open="showSizeModal"
      :generator="activeGenerator"
      :current-time="currentTime"
      @close="showSizeModal = false"
      @select-resolution="(res) => { currentResolution = res; showSizeModal = false; }"
    />

    <PngSequenceDrawer
      :is-open="showPngDrawer"
      :generator="activeGenerator"
      :current-resolution="currentResolution"
      :current-time="currentTime"
      :total-duration="totalDuration"
      :fps="fps"
      :mode="mode"
      @close="showPngDrawer = false"
    />

    <VideoExportDrawer
      :is-open="showVideoDrawer"
      :generator="activeGenerator"
      :current-resolution="currentResolution"
      :current-time="currentTime"
      :total-duration="totalDuration"
      :fps="fps"
      :mode="mode"
      @close="showVideoDrawer = false"
    />

    <RequirementsCoverage
      :is-open="showRequirementsModal"
      @close="showRequirementsModal = false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Wrench, Sliders } from 'lucide-vue-next';

// MGGD Subcomponents
import MggdHeader from './components/mggd/MggdHeader.vue';
import WalkthroughBanner from './components/mggd/WalkthroughBanner.vue';
import GeneratorLibrary from './components/mggd/GeneratorLibrary.vue';
import AnimationPreview from './components/mggd/AnimationPreview.vue';
import MakerPanel from './components/mggd/MakerPanel.vue';
import BuyerPanel from './components/mggd/BuyerPanel.vue';
import SceneTimeline from './components/mggd/SceneTimeline.vue';
import CheckerPanel from './components/mggd/CheckerPanel.vue';
import ManifestViewer from './components/mggd/ManifestViewer.vue';
import VgrModal from './components/mggd/VgrModal.vue';
import SizeComparisonModal from './components/mggd/SizeComparisonModal.vue';
import PngSequenceDrawer from './components/mggd/PngSequenceDrawer.vue';
import VideoExportDrawer from './components/mggd/VideoExportDrawer.vue';
import RequirementsCoverage from './components/mggd/RequirementsCoverage.vue';

// Composables
import { useMggdGenerator } from './composables/useMggdGenerator.js';
import { useMggdScenes } from './composables/useMggdScenes.js';
import { useMggdTimeline } from './composables/useMggdTimeline.js';
import { useMggdSeek } from './composables/useMggdSeek.js';

// Central Generator & Permissions State
const {
  mode,
  generators,
  activeGenerator,
  currentResolution,
  selectedSceneId,
  selectGenerator,
  loadFromCatalogType,
  createNewRevision,
  updateActiveGenerator,
  updateBuyerProperties,
  applyTheme,
  addMakerScene,
  deleteMakerScene,
  updateMakerScene,
  updateMakerObject
} = useMggdGenerator();

// Scenes & Duration Math
const {
  timeline,
  totalDuration,
  setSceneDuration,
  reorderScenes,
  removeScene
} = useMggdScenes(activeGenerator, updateActiveGenerator);

// Timeline Loop & Playhead Controls
const {
  isPlaying,
  currentTime,
  fps,
  seekTo,
  stepFrame,
  togglePlay
} = useMggdTimeline(totalDuration, 30);

// vincta:seek Protocol Listener
const { lastAck } = useMggdSeek();

// Modals & Drawers Visibility State
const showWalkthrough = ref(true);
const showSizeModal = ref(false);
const showManifestModal = ref(false);
const showVgrModal = ref(false);
const showCheckerModal = ref(false);
const showPngDrawer = ref(false);
const showVideoDrawer = ref(false);
const showRequirementsModal = ref(false);

function handleUpdateValidationStatus(status) {
  updateActiveGenerator((gen) => ({
    ...gen,
    validationStatus: status
  }));
}

function handleWalkthroughStepChange(stepObj) {
  // Automatically guide the user's view according to the step
  if (stepObj.step === 1) {
    mode.value = 'maker';
  } else if (stepObj.step === 8) {
    showManifestModal.value = true;
  } else if (stepObj.step === 9) {
    showCheckerModal.value = true;
  } else if (stepObj.step === 11) {
    mode.value = 'buyer';
  } else if (stepObj.step === 16) {
    showPngDrawer.value = true;
  } else if (stepObj.step === 17) {
    showVideoDrawer.value = true;
  }
}
</script>
