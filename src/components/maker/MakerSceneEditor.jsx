/**
 * Maker Scene Architecture Editor
 * Requirements 13-19:
 * - 1 to 8 scenes
 * - Required scene flags
 * - min/max/default durations
 * - Entrance and exit types
 * - Scene background and transparency policy
 */

import React from 'react';
import { Plus, Trash2, Lock, Unlock, Settings2, Sliders } from 'lucide-react';

export function MakerSceneEditor({
  scenes,
  selectedSceneId,
  onSelectScene,
  onAddScene,
  onDeleteScene,
  onUpdateScene
}) {
  const selectedScene = scenes.find((s) => s.id === selectedSceneId) || scenes[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Scene List Selection Bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Scene Architecture ({scenes.length}/8)
          </span>
          <button
            className="btn btn-secondary btn-sm"
            onClick={onAddScene}
            disabled={scenes.length >= 8}
            title="Add new scene (max 8 scenes)"
          >
            <Plus size={12} />
            <span>Add Scene</span>
          </button>
        </div>

        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {scenes.map((s, idx) => (
            <button
              key={s.id}
              className={`btn btn-sm ${s.id === selectedScene?.id ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => onSelectScene(s.id)}
              style={{ fontSize: '11px' }}
            >
              {s.required && <Lock size={10} style={{ marginRight: '3px' }} />}
              Scene {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Scene Architectural Configuration */}
      {selectedScene && (
        <div style={{ padding: '12px', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '12px' }}>
              Configure Scene #{selectedScene.order || 1}
            </span>
            {scenes.length > 1 && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => onDeleteScene(selectedScene.id)}
                style={{ color: 'var(--status-error)', padding: '2px 6px' }}
                title="Delete this scene"
              >
                <Trash2 size={12} />
                <span>Delete</span>
              </button>
            )}
          </div>

          <div className="form-group">
            <span className="form-label">Scene Label / Name</span>
            <input
              type="text"
              className="form-input"
              value={selectedScene.name}
              onChange={(e) => onUpdateScene(selectedScene.id, { name: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
            <div className="form-group">
              <span className="form-label">Default (s)</span>
              <input
                type="number"
                step="0.1"
                min={selectedScene.minDuration}
                max={selectedScene.maxDuration}
                className="form-input"
                value={selectedScene.defaultDuration}
                onChange={(e) => onUpdateScene(selectedScene.id, { 
                  defaultDuration: Number(e.target.value),
                  currentDuration: Number(e.target.value)
                })}
              />
            </div>
            <div className="form-group">
              <span className="form-label">Min Limit</span>
              <input
                type="number"
                step="0.1"
                min="0.5"
                max={selectedScene.defaultDuration}
                className="form-input"
                value={selectedScene.minDuration}
                onChange={(e) => onUpdateScene(selectedScene.id, { minDuration: Number(e.target.value) })}
              />
            </div>
            <div className="form-group">
              <span className="form-label">Max Limit</span>
              <input
                type="number"
                step="0.1"
                min={selectedScene.defaultDuration}
                max="60"
                className="form-input"
                value={selectedScene.maxDuration}
                onChange={(e) => onUpdateScene(selectedScene.id, { maxDuration: Number(e.target.value) })}
              />
            </div>
          </div>

          {/* Required Scene Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '11px', color: 'var(--text-main)' }}>Required Scene</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Buyer cannot delete or bypass this scene</div>
            </div>
            <input
              type="checkbox"
              checked={Boolean(selectedScene.required)}
              onChange={(e) => onUpdateScene(selectedScene.id, { required: e.target.checked })}
              style={{ width: '16px', height: '16px', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
            />
          </div>

          {/* Transitions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            <div className="form-group">
              <span className="form-label">Entrance</span>
              <select
                className="form-select"
                value={selectedScene.entrance || 'fade'}
                onChange={(e) => onUpdateScene(selectedScene.id, { entrance: e.target.value })}
              >
                <option value="fade">Fade In</option>
                <option value="zoom-in">Zoom In</option>
                <option value="slide-in-left">Slide Left</option>
                <option value="strobe">Strobe Cut</option>
                <option value="wipe">Wipe</option>
              </select>
            </div>

            <div className="form-group">
              <span className="form-label">Exit</span>
              <select
                className="form-select"
                value={selectedScene.exit || 'fade'}
                onChange={(e) => onUpdateScene(selectedScene.id, { exit: e.target.value })}
              >
                <option value="fade">Fade Out</option>
                <option value="slide-out-right">Slide Right</option>
                <option value="shrink">Shrink Out</option>
                <option value="wipe">Wipe</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
