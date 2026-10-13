/**
 * Buyer Scene Management Panel
 * Requirement 30: Reorder scenes, remove optional scenes, adjust durations within bounds.
 */

import React from 'react';
import { ArrowUp, ArrowDown, Trash2, Lock, Sliders, Layers } from 'lucide-react';

export function BuyerSceneList({
  scenes,
  onReorderScenes,
  onRemoveScene,
  onSetSceneDuration,
  selectedSceneId,
  onSelectScene
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
        Reorder or trim scenes within permitted maker limits:
      </div>

      {scenes.map((scene, idx) => {
        const isSelected = scene.id === selectedSceneId;
        const canMoveUp = idx > 0;
        const canMoveDown = idx < scenes.length - 1;
        const canRemove = !scene.required && scenes.length > 1;

        return (
          <div
            key={scene.id}
            onClick={() => onSelectScene(scene.id)}
            style={{
              padding: '10px',
              borderRadius: 'var(--radius-md)',
              background: isSelected ? 'var(--bg-surface)' : 'var(--bg-card)',
              border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            {/* Header: Scene Name & Reordering Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {scene.required ? (
                  <span title="Required scene: Protected from removal">
                    <Lock size={12} color="var(--accent-secondary)" />
                  </span>
                ) : (
                  <span className="badge" style={{ fontSize: '9px', background: 'rgba(255,255,255,0.06)' }}>
                    Optional
                  </span>
                )}
                <span style={{ fontWeight: 600, fontSize: '12px', color: 'var(--text-main)' }}>
                  {scene.name}
                </span>
              </div>

              {/* Action Buttons: Up, Down, Delete */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                <button
                  className="btn btn-ghost btn-sm btn-icon-only"
                  disabled={!canMoveUp}
                  onClick={(e) => {
                    e.stopPropagation();
                    onReorderScenes(idx, idx - 1);
                  }}
                  title="Move scene earlier in timeline"
                >
                  <ArrowUp size={12} />
                </button>
                <button
                  className="btn btn-ghost btn-sm btn-icon-only"
                  disabled={!canMoveDown}
                  onClick={(e) => {
                    e.stopPropagation();
                    onReorderScenes(idx, idx + 1);
                  }}
                  title="Move scene later in timeline"
                >
                  <ArrowDown size={12} />
                </button>
                {canRemove && (
                  <button
                    className="btn btn-ghost btn-sm btn-icon-only"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveScene(scene.id);
                    }}
                    title="Remove optional scene"
                    style={{ color: 'var(--status-error)' }}
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            </div>

            {/* Duration Slider (Clamped between minDuration and maxDuration) */}
            <div style={{ marginTop: '2px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '3px' }}>
                <span>Length: {Number(scene.currentDuration).toFixed(1)}s</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>
                  [{scene.minDuration}s – {scene.maxDuration}s limit]
                </span>
              </div>

              <input
                type="range"
                min={scene.minDuration}
                max={scene.maxDuration}
                step="0.1"
                value={scene.currentDuration}
                onChange={(e) => onSetSceneDuration(scene.id, e.target.value)}
                style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
