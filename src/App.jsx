/**
 * MGGD Motion Generator Studio — Main Application
 * Fully Functional Maker & Buyer Demo
 * Demonstrates all 35 MGGD specification requirements
 */

import React, { useState } from 'react';
import { useGenerator } from './hooks/useGenerator.js';
import { useTimeline } from './hooks/useTimeline.js';
import { Header } from './components/layout/Header.jsx';
import { WalkthroughBanner } from './components/layout/WalkthroughBanner.jsx';
import { SidebarLeft } from './components/layout/SidebarLeft.jsx';
import { SidebarRight } from './components/layout/SidebarRight.jsx';
import { CanvasWorkspace } from './components/preview/CanvasWorkspace.jsx';
import { Timeline } from './components/timeline/Timeline.jsx';
import { PngExportDrawer } from './components/export/PngExportDrawer.jsx';
import { VideoExportDrawer } from './components/export/VideoExportDrawer.jsx';
import { CheckerModal } from './components/checker/CheckerModal.jsx';
import { ManifestInspectorModal } from './components/manifests/ManifestInspectorModal.jsx';
import { VgrEditorModal } from './components/manifests/VgrEditorModal.jsx';
import { SizeComparisonModal } from './components/preview/SizeComparisonModal.jsx';
import { RequirementsModal } from './components/layout/RequirementsModal.jsx';

export default function App() {
  const {
    mode,
    setMode,
    generators,
    activeGenerator,
    selectGenerator,
    loadFromCatalogType,
    createNewRevision,
    selectedSceneId,
    setSelectedSceneId,
    currentResolution,
    setCurrentResolution,
    timeline,
    // Buyer
    updateBuyerProperties,
    setBuyerSceneDuration,
    reorderScenes,
    removeBuyerScene,
    updateBuyerObjectTiming,
    applyTheme,
    // Maker
    addMakerScene,
    deleteMakerScene,
    updateMakerScene,
    updateMakerObject,
    updateActiveGenerator
  } = useGenerator();

  // Playback & scrubbing timeline hook
  const {
    isPlaying,
    togglePlay,
    currentTime,
    seekTo,
    stepFrame,
    fps,
    setFps
  } = useTimeline(timeline.totalDuration, 30, Boolean(activeGenerator.loop));

  // Modal & Drawer State
  const [showWalkthrough, setShowWalkthrough] = useState(true);
  const [isCheckerOpen, setIsCheckerOpen] = useState(false);
  const [isManifestOpen, setIsManifestOpen] = useState(false);
  const [isVgrOpen, setIsVgrOpen] = useState(false);
  const [isSizeComparisonOpen, setIsSizeComparisonOpen] = useState(false);
  const [isPngExportOpen, setIsPngExportOpen] = useState(false);
  const [isVideoExportOpen, setIsVideoExportOpen] = useState(false);
  const [isRequirementsOpen, setIsRequirementsOpen] = useState(false);

  // Update validation status after Checker runs
  const handleUpdateValidationStatus = (status) => {
    updateActiveGenerator({ validationStatus: status });
  };

  return (
    <div className="app-container">
      {/* Top Header */}
      <Header
        mode={mode}
        setMode={setMode}
        activeGenerator={activeGenerator}
        currentResolution={currentResolution}
        setCurrentResolution={setCurrentResolution}
        onOpenChecker={() => setIsCheckerOpen(true)}
        onOpenManifest={() => setIsManifestOpen(true)}
        onOpenVgr={() => setIsVgrOpen(true)}
        onOpenSizeComparison={() => setIsSizeComparisonOpen(true)}
        onOpenPngExport={() => setIsPngExportOpen(true)}
        onOpenVideoExport={() => setIsVideoExportOpen(true)}
        onOpenRequirements={() => setIsRequirementsOpen(true)}
        showWalkthrough={showWalkthrough}
        setShowWalkthrough={setShowWalkthrough}
      />

      {/* Interactive 18-Step Walkthrough Banner */}
      {showWalkthrough && (
        <WalkthroughBanner
          onClose={() => setShowWalkthrough(false)}
        />
      )}

      {/* Middle Grid: Left Sidebar, Canvas Workspace, Right Sidebar */}
      <div className="workspace-grid">
        {/* Left Sidebar: Library, 23 Catalog Types, Metadata */}
        <SidebarLeft
          mode={mode}
          generators={generators}
          activeGenerator={activeGenerator}
          onSelectGenerator={selectGenerator}
          onLoadFromCatalog={loadFromCatalogType}
          onCreateRevision={createNewRevision}
          onImportGenerator={(gen) => {
            updateActiveGenerator(gen);
            alert('Generator JSON imported successfully.');
          }}
        />

        {/* Center Workspace: Deterministic Canvas, Safe-Area, Scrubbing */}
        <CanvasWorkspace
          activeGenerator={activeGenerator}
          currentResolution={currentResolution}
          currentTime={currentTime}
          totalDuration={timeline.totalDuration}
          isPlaying={isPlaying}
          onTogglePlay={togglePlay}
          onStepFrame={stepFrame}
          fps={fps}
          onSeek={seekTo}
        />

        {/* Right Sidebar: Contextual Properties (Maker vs Buyer) */}
        <SidebarRight
          mode={mode}
          activeGenerator={activeGenerator}
          selectedSceneId={selectedSceneId}
          onSelectScene={setSelectedSceneId}
          // Buyer
          onUpdateBuyerProperties={updateBuyerProperties}
          onSetBuyerSceneDuration={setBuyerSceneDuration}
          onReorderScenes={reorderScenes}
          onRemoveBuyerScene={removeBuyerScene}
          onApplyTheme={applyTheme}
          // Maker
          onAddMakerScene={addMakerScene}
          onDeleteMakerScene={deleteMakerScene}
          onUpdateMakerScene={updateMakerScene}
          onUpdateMakerObject={updateMakerObject}
          onUpdateActiveGenerator={updateActiveGenerator}
        />
      </div>

      {/* Bottom Timeline: Scene blocks, Object tracks, Playhead */}
      <Timeline
        timeline={timeline}
        currentTime={currentTime}
        totalDuration={timeline.totalDuration}
        onSeek={seekTo}
        fps={fps}
        selectedSceneId={selectedSceneId}
        onSelectScene={setSelectedSceneId}
        mode={mode}
        onReorderScenes={reorderScenes}
      />

      {/* Modals & Drawers */}
      <PngExportDrawer
        isOpen={isPngExportOpen}
        onClose={() => setIsPngExportOpen(false)}
        generator={activeGenerator}
        currentTime={currentTime}
        totalDuration={timeline.totalDuration}
        mode={mode}
      />

      <VideoExportDrawer
        isOpen={isVideoExportOpen}
        onClose={() => setIsVideoExportOpen(false)}
        generator={activeGenerator}
        currentTime={currentTime}
        totalDuration={timeline.totalDuration}
        mode={mode}
      />

      <CheckerModal
        isOpen={isCheckerOpen}
        onClose={() => setIsCheckerOpen(false)}
        generator={activeGenerator}
        onUpdateValidationStatus={handleUpdateValidationStatus}
      />

      <ManifestInspectorModal
        isOpen={isManifestOpen}
        onClose={() => setIsManifestOpen(false)}
        generator={activeGenerator}
      />

      <VgrEditorModal
        isOpen={isVgrOpen}
        onClose={() => setIsVgrOpen(false)}
        generator={activeGenerator}
      />

      <SizeComparisonModal
        isOpen={isSizeComparisonOpen}
        onClose={() => setIsSizeComparisonOpen(false)}
        generator={activeGenerator}
        currentTime={currentTime}
        onSelectResolution={setCurrentResolution}
      />

      <RequirementsModal
        isOpen={isRequirementsOpen}
        onClose={() => setIsRequirementsOpen(false)}
      />
    </div>
  );
}
