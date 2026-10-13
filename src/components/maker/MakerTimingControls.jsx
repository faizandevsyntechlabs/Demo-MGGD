/**
 * Maker Object & Timing Controls Panel
 * Requirements 20-24:
 * - Trigger types: 'Auto - Once - Stay', 'Auto - Once - Hide', 'Auto - Loop'
 * - Delay, duration, loop gap, min/max bounds
 * - Auto-grow scene calculation
 */

import React from 'react';
import { Clock, Play, Zap, AlertCircle } from 'lucide-react';
import { VALID_TRIGGERS } from '../../utils/validation.js';

export function MakerTimingControls({
  scene,
  onUpdateObject
}) {
  if (!scene || !scene.objects || scene.objects.length === 0) {
    return <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>No animated objects in this scene.</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
        Animated Objects & Triggers ({scene.objects.length})
      </div>

      {scene.objects.map((obj) => {
        const requiredTime = (obj.delay || 0) + (obj.duration || 1.0);
        const exceedsScene = requiredTime > scene.currentDuration;

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
              gap: '8px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, fontSize: '12px', color: 'var(--text-main)' }}>
                {obj.name} ({obj.type})
              </span>
              <span className="badge badge-violet" style={{ fontSize: '9px' }}>
                t = {(obj.delay || 0).toFixed(1)}s - {requiredTime.toFixed(1)}s
              </span>
            </div>

            {/* Trigger Selector (Strictly 3 Automatic Triggers - Requirement 22) */}
            <div className="form-group">
              <span className="form-label">
                Trigger Type (Requirement 22)
              </span>
              <select
                className="form-select"
                value={obj.trigger || 'Auto - Once - Stay'}
                onChange={(e) => onUpdateObject(scene.id, obj.id, { trigger: e.target.value })}
              >
                {VALID_TRIGGERS.map((trig) => (
                  <option key={trig} value={trig}>
                    {trig}
                  </option>
                ))}
              </select>
            </div>

            {/* Timing Ranges */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div className="form-group">
                <span className="form-label">Delay: {(obj.delay || 0).toFixed(1)}s</span>
                <input
                  type="range"
                  min={obj.minDelay || 0}
                  max={obj.maxDelay || 3}
                  step="0.1"
                  value={obj.delay || 0}
                  onChange={(e) => onUpdateObject(scene.id, obj.id, { delay: Number(e.target.value) })}
                  style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                />
              </div>

              <div className="form-group">
                <span className="form-label">Duration: {(obj.duration || 1.0).toFixed(1)}s</span>
                <input
                  type="range"
                  min={obj.minDuration || 0.5}
                  max={obj.maxDuration || 6}
                  step="0.1"
                  value={obj.duration || 1.0}
                  onChange={(e) => onUpdateObject(scene.id, obj.id, { duration: Number(e.target.value) })}
                  style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                />
              </div>
            </div>

            {/* Auto-Grow Notice (Requirement 24) */}
            {exceedsScene && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: 'var(--status-warning)' }}>
                <AlertCircle size={12} />
                <span>Object active length exceeds scene duration ({scene.currentDuration}s); timeline will auto-grow up to maxDuration ({scene.maxDuration}s).</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
