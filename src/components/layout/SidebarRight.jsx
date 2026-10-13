/**
 * Right Sidebar Component
 * Contextual properties inspector adapting seamlessly to Maker Mode vs Buyer Mode
 */

import React, { useState } from 'react';
import { 
  Sliders, 
  Layers, 
  Type, 
  Sparkles, 
  Layout, 
  BookOpen, 
  Clock, 
  Palette 
} from 'lucide-react';
import { BuyerProperties } from '../buyer/BuyerProperties.jsx';
import { BuyerThemes } from '../buyer/BuyerThemes.jsx';
import { BuyerSceneList } from '../buyer/BuyerSceneList.jsx';
import { MakerSceneEditor } from '../maker/MakerSceneEditor.jsx';
import { MakerTimingControls } from '../maker/MakerTimingControls.jsx';
import { MakerLayoutConfig } from '../maker/MakerLayoutConfig.jsx';
import { MakerLibraryPanel } from '../maker/MakerLibraryPanel.jsx';

export function SidebarRight({
  mode,
  activeGenerator,
  selectedSceneId,
  onSelectScene,
  // Buyer
  onUpdateBuyerProperties,
  onSetBuyerSceneDuration,
  onReorderScenes,
  onRemoveBuyerScene,
  onApplyTheme,
  // Maker
  onAddMakerScene,
  onDeleteMakerScene,
  onUpdateMakerScene,
  onUpdateMakerObject,
  onUpdateActiveGenerator
}) {
  const [makerTab, setMakerTab] = useState('scenes'); // 'scenes' | 'timing' | 'layout' | 'policy'
  const [buyerTab, setBuyerTab] = useState('design'); // 'design' | 'scenes' | 'themes'

  const selectedScene = (activeGenerator.scenes || []).find((s) => s.id === selectedSceneId) || activeGenerator.scenes?.[0];

  return (
    <aside className="sidebar right">
      <div className="sidebar-header">
        <div className="sidebar-title">
          <Sliders size={13} />
          <span>{mode === 'maker' ? 'Maker Inspector' : 'Buyer Inspector'}</span>
        </div>
        <span className="badge badge-violet" style={{ fontSize: '9px' }}>
          {mode.toUpperCase()} MODE
        </span>
      </div>

      {/* Tabs based on active mode */}
      {mode === 'maker' ? (
        <div className="sidebar-tabs">
          <button
            className={`sidebar-tab ${makerTab === 'scenes' ? 'active' : ''}`}
            onClick={() => setMakerTab('scenes')}
          >
            Scenes
          </button>
          <button
            className={`sidebar-tab ${makerTab === 'timing' ? 'active' : ''}`}
            onClick={() => setMakerTab('timing')}
          >
            Timing
          </button>
          <button
            className={`sidebar-tab ${makerTab === 'layout' ? 'active' : ''}`}
            onClick={() => setMakerTab('layout')}
          >
            Layouts
          </button>
          <button
            className={`sidebar-tab ${makerTab === 'policy' ? 'active' : ''}`}
            onClick={() => setMakerTab('policy')}
          >
            Policy
          </button>
        </div>
      ) : (
        <div className="sidebar-tabs">
          <button
            className={`sidebar-tab ${buyerTab === 'design' ? 'active' : ''}`}
            onClick={() => setBuyerTab('design')}
          >
            Design & Copy
          </button>
          <button
            className={`sidebar-tab ${buyerTab === 'scenes' ? 'active' : ''}`}
            onClick={() => setBuyerTab('scenes')}
          >
            Scenes & Trim
          </button>
          <button
            className={`sidebar-tab ${buyerTab === 'themes' ? 'active' : ''}`}
            onClick={() => setBuyerTab('themes')}
          >
            Themes
          </button>
        </div>
      )}

      {/* Tab Content */}
      <div className="sidebar-content">
        {mode === 'maker' ? (
          <>
            {makerTab === 'scenes' && (
              <MakerSceneEditor
                scenes={activeGenerator.scenes || []}
                selectedSceneId={selectedSceneId}
                onSelectScene={onSelectScene}
                onAddScene={onAddMakerScene}
                onDeleteScene={onDeleteMakerScene}
                onUpdateScene={onUpdateMakerScene}
              />
            )}
            {makerTab === 'timing' && (
              <MakerTimingControls
                scene={selectedScene}
                onUpdateObject={onUpdateMakerObject}
              />
            )}
            {makerTab === 'layout' && (
              <MakerLayoutConfig
                scene={selectedScene}
                onUpdateObject={onUpdateMakerObject}
              />
            )}
            {makerTab === 'policy' && (
              <MakerLibraryPanel
                activeGenerator={activeGenerator}
                onUpdateGenerator={onUpdateActiveGenerator}
              />
            )}
          </>
        ) : (
          <>
            {buyerTab === 'design' && (
              <BuyerProperties
                properties={activeGenerator.properties || {}}
                onUpdateProperties={onUpdateBuyerProperties}
              />
            )}
            {buyerTab === 'scenes' && (
              <BuyerSceneList
                scenes={activeGenerator.scenes || []}
                onReorderScenes={onReorderScenes}
                onRemoveScene={onRemoveBuyerScene}
                onSetSceneDuration={onSetBuyerSceneDuration}
                selectedSceneId={selectedSceneId}
                onSelectScene={onSelectScene}
              />
            )}
            {buyerTab === 'themes' && (
              <BuyerThemes
                onApplyTheme={onApplyTheme}
              />
            )}
          </>
        )}
      </div>
    </aside>
  );
}
