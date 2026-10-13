/**
 * Top Header Component
 * Contains branding, Maker/Buyer toggle, resolution selector, export triggers, and modal triggers.
 */

import React from 'react';
import { 
  Clapperboard, 
  CheckCircle, 
  AlertCircle, 
  Layers, 
  FileJson, 
  Film, 
  Image, 
  Eye, 
  Sparkles, 
  CheckSquare,
  HelpCircle,
  Maximize2
} from 'lucide-react';
import { RESOLUTION_PRESETS } from '../../engine/deterministicRenderer.js';

export function Header({
  mode,
  setMode,
  activeGenerator,
  currentResolution,
  setCurrentResolution,
  onOpenChecker,
  onOpenManifest,
  onOpenVgr,
  onOpenSizeComparison,
  onOpenPngExport,
  onOpenVideoExport,
  onOpenRequirements,
  showWalkthrough,
  setShowWalkthrough
}) {
  const isVerified = activeGenerator.validationStatus === 'Verified';

  return (
    <header className="top-header">
      {/* Brand & Mode Switcher */}
      <div className="header-left">
        <div className="brand-badge">
          <div className="brand-icon">
            <Clapperboard size={16} />
          </div>
          <span>MGGD Motion Studio</span>
          <span className="brand-tag">M1.0</span>
        </div>

        {/* Maker / Buyer Toggle (Requirement 3) */}
        <div className="mode-toggle">
          <button
            className={`mode-btn ${mode === 'maker' ? 'active maker' : ''}`}
            onClick={() => setMode('maker')}
            title="Maker Mode: Create & configure architecture, scenes, limits, trigger types, layouts"
          >
            Maker Mode
          </button>
          <button
            className={`mode-btn ${mode === 'buyer' ? 'active buyer' : ''}`}
            onClick={() => setMode('buyer')}
            title="Buyer Mode: Customize text, colors, fonts, images, reorder scenes, export"
          >
            Buyer Mode
          </button>
        </div>

        {/* Generator Status Pill */}
        <div 
          className={`status-pill ${isVerified ? 'verified' : 'unverified'}`}
          title={isVerified ? 'Passed all MGGD compliance checks' : 'Unverified generator: Buyer exports are gated'}
        >
          {isVerified ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
          <span>{isVerified ? 'Verified' : 'Unverified'}</span>
        </div>
      </div>

      {/* Center Details & Resolution Picker */}
      <div className="header-center">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Resolution:</span>
          <select
            className="form-select"
            style={{ padding: '3px 8px', fontSize: '11px', minWidth: '130px' }}
            value={currentResolution}
            onChange={(e) => setCurrentResolution(e.target.value)}
          >
            {Object.entries(RESOLUTION_PRESETS).map(([key, item]) => (
              <option key={key} value={key}>
                {item.label} ({key})
              </option>
            ))}
          </select>
        </div>

        <button 
          className="btn btn-ghost btn-sm" 
          onClick={onOpenSizeComparison}
          title="Compare all 5 layouts side-by-side"
        >
          <Maximize2 size={13} />
          <span>Sizes</span>
        </button>

        <button 
          className="btn btn-ghost btn-sm" 
          onClick={onOpenManifest}
          title="Inspect live scene manifest & motion-manifest.json"
        >
          <Layers size={13} />
          <span>Manifest</span>
        </button>

        <button 
          className="btn btn-ghost btn-sm" 
          onClick={onOpenVgr}
          title="Inspect Motion VGR M1.0 Document & Catalog"
        >
          <FileJson size={13} />
          <span>VGR M1.0</span>
        </button>
      </div>

      {/* Right Action Buttons */}
      <div className="header-right">
        {/* Validate Generator button */}
        <button
          className="btn btn-secondary btn-sm"
          onClick={onOpenChecker}
          title="Run MGGD compliance checker on current generator"
        >
          <CheckSquare size={13} color="var(--accent-primary)" />
          <span>Validate Generator</span>
        </button>

        {/* Requirement 31: PNG Sequence Export button IMMEDIATELY left of Export Video */}
        <button
          className="btn btn-secondary btn-sm"
          onClick={onOpenPngExport}
          title="Export PNG frame sequence in ZIP"
        >
          <Image size={13} />
          <span>PNG Sequence</span>
        </button>

        {/* Video Export button */}
        <button
          className="btn btn-accent btn-sm"
          onClick={onOpenVideoExport}
          title="Export rendered video"
        >
          <Film size={13} />
          <span>Export Video</span>
        </button>

        {/* Requirements Coverage Matrix */}
        <button
          className="btn btn-ghost btn-sm"
          onClick={onOpenRequirements}
          title="View all 35 MGGD specification requirements and verification status"
        >
          <Sparkles size={13} color="var(--accent-secondary)" />
          <span>Requirements (35)</span>
        </button>

        {/* Walkthrough Toggle */}
        <button
          className={`btn btn-sm ${showWalkthrough ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setShowWalkthrough(!showWalkthrough)}
          title="Toggle interactive 18-step demonstration walkthrough guide"
        >
          <HelpCircle size={13} />
          <span>Guide</span>
        </button>
      </div>
    </header>
  );
}
