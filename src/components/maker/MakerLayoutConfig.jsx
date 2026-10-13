/**
 * Maker Individual Layout Configuration Panel
 * Requirements 9-10:
 * - Independent layouts per resolution (16:9, 9:16, 1:1, 4:5, 21:9)
 * - Prevents naive anamorphic stretching
 */

import React, { useState } from 'react';
import { Layout, Sliders, Move } from 'lucide-react';
import { RESOLUTION_PRESETS } from '../../engine/deterministicRenderer.js';

export function MakerLayoutConfig({
  scene,
  onUpdateObject
}) {
  const [selectedRes, setSelectedRes] = useState('1920x1080');

  if (!scene || !scene.objects || scene.objects.length === 0) {
    return <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>No objects to position.</div>;
  }

  const resMeta = RESOLUTION_PRESETS[selectedRes];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
        Per-Size Layout Overrides (No Stretching)
      </div>

      {/* Resolution Selector Tabs */}
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
        {Object.entries(RESOLUTION_PRESETS).map(([key, item]) => (
          <button
            key={key}
            className={`btn btn-sm ${selectedRes === key ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '10px', padding: '3px 6px' }}
            onClick={() => setSelectedRes(key)}
          >
            {item.aspect} ({key})
          </button>
        ))}
      </div>

      <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
        Configuring layout coordinates for <strong>{resMeta.label}</strong> ({resMeta.width}×{resMeta.height}px):
      </div>

      {scene.objects.map((obj) => {
        const layout = (obj.layout && obj.layout[selectedRes]) || {
          x: resMeta.width * 0.5,
          y: resMeta.height * 0.5,
          scale: 1.0,
          fontSize: 32,
          align: 'center'
        };

        const handleLayoutChange = (key, val) => {
          const updatedLayoutMap = {
            ...(obj.layout || {}),
            [selectedRes]: {
              ...layout,
              [key]: val
            }
          };
          onUpdateObject(scene.id, obj.id, { layout: updatedLayoutMap });
        };

        return (
          <div
            key={obj.id}
            style={{
              padding: '10px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-app)',
              border: '1px solid var(--border-medium)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <div style={{ fontWeight: 600, fontSize: '11px', color: 'var(--text-main)' }}>
              {obj.name} ({obj.type})
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              <div className="form-group">
                <span className="form-label">Position X (px)</span>
                <input
                  type="number"
                  className="form-input"
                  value={Math.round(layout.x)}
                  onChange={(e) => handleLayoutChange('x', Number(e.target.value))}
                />
              </div>

              <div className="form-group">
                <span className="form-label">Position Y (px)</span>
                <input
                  type="number"
                  className="form-input"
                  value={Math.round(layout.y)}
                  onChange={(e) => handleLayoutChange('y', Number(e.target.value))}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              <div className="form-group">
                <span className="form-label">Scale Factor</span>
                <input
                  type="number"
                  step="0.05"
                  min="0.1"
                  max="3.0"
                  className="form-input"
                  value={layout.scale || 1.0}
                  onChange={(e) => handleLayoutChange('scale', Number(e.target.value))}
                />
              </div>

              {obj.type === 'text' && (
                <div className="form-group">
                  <span className="form-label">Font Size (px)</span>
                  <input
                    type="number"
                    min="12"
                    max="140"
                    className="form-input"
                    value={layout.fontSize || 32}
                    onChange={(e) => handleLayoutChange('fontSize', Number(e.target.value))}
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
