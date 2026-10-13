/**
 * Live Manifest & motion-manifest.json Inspector Modal
 * Requirements 19 & 25:
 * Real-time dynamic manifest updating on every scene change with JSON copy actions
 */

import React, { useState } from 'react';
import { X, Layers, Copy, Check, FileCode, CheckCircle2 } from 'lucide-react';
import { generateLiveSceneManifest, generateMotionManifestJson } from '../../engine/sceneScheduler.js';

export function ManifestInspectorModal({
  isOpen,
  onClose,
  generator
}) {
  const [activeTab, setActiveTab] = useState('live'); // 'live' | 'motion_json'
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const liveManifest = generateLiveSceneManifest(generator);
  const motionManifestJson = generateMotionManifestJson(generator);

  const displayedJson = activeTab === 'live' 
    ? JSON.stringify(liveManifest, null, 2)
    : JSON.stringify(motionManifestJson, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(displayedJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-card" 
        style={{ maxWidth: '800px', maxHeight: '85vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={18} color="var(--accent-primary)" />
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px' }}>MGGD Manifest Inspector</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Requirements 19 & 25: Live scene manifest & motion-manifest.json
              </div>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm btn-icon-only" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Tab switcher */}
        <div style={{ padding: '8px 18px', background: 'var(--bg-app)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              className={`btn btn-sm ${activeTab === 'live' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('live')}
            >
              Live Scene Manifest ({liveManifest.sceneCount} Scenes)
            </button>
            <button
              className={`btn btn-sm ${activeTab === 'motion_json' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('motion_json')}
            >
              motion-manifest.json
            </button>
          </div>

          <button className="btn btn-secondary btn-sm" onClick={handleCopy}>
            {copied ? <Check size={13} color="var(--status-success)" /> : <Copy size={13} />}
            <span>{copied ? 'Copied JSON' : 'Copy JSON'}</span>
          </button>
        </div>

        {/* JSON Viewer */}
        <div className="modal-body" style={{ padding: '0', background: '#0a0d14' }}>
          <pre style={{
            margin: 0,
            padding: '16px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: '#a78bfa',
            lineHeight: 1.6,
            overflowX: 'auto',
            maxHeight: '60vh'
          }}>
            {displayedJson}
          </pre>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginRight: 'auto' }}>
            ✓ Synchronizes automatically on all buyer/maker scene duration updates
          </span>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
