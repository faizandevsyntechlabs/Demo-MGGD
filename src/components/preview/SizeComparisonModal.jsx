/**
 * Size Comparison Preview Modal
 * Requirements 9-10:
 * Renders all 5 generator output sizes side-by-side to verify individual per-size layout adaptations
 */

import React, { useEffect, useRef } from 'react';
import { X, Maximize2 } from 'lucide-react';
import { renderFrame, RESOLUTION_PRESETS } from '../../engine/deterministicRenderer.js';

export function SizeComparisonModal({
  isOpen,
  onClose,
  generator,
  currentTime,
  onSelectResolution
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-card" 
        style={{ maxWidth: '1100px', maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Maximize2 size={18} color="var(--accent-primary)" />
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px' }}>Multi-Size Comparison Matrix (5 MGGD Dimensions)</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Requirements 9-10: Individual layout configurations per size without anamorphic stretching
              </div>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm btn-icon-only" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {Object.entries(RESOLUTION_PRESETS).map(([resKey, item]) => (
            <SizePreviewCard
              key={resKey}
              resolutionKey={resKey}
              meta={item}
              generator={generator}
              currentTime={currentTime}
              onSelect={() => {
                onSelectResolution(resKey);
                onClose();
              }}
            />
          ))}
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary btn-sm" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

function SizePreviewCard({
  resolutionKey,
  meta,
  generator,
  currentTime,
  onSelect
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    renderFrame(canvasRef.current, generator, currentTime, resolutionKey, {
      scaleMultiplier: 240 / meta.width,
      showSafeArea: false
    });
  }, [generator, currentTime, resolutionKey, meta.width]);

  return (
    <div style={{
      background: 'var(--bg-app)',
      border: '1px solid var(--border-medium)',
      borderRadius: 'var(--radius-md)',
      padding: '12px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      alignItems: 'center'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
        <div>
          <span style={{ fontWeight: 600, fontSize: '12px', color: 'var(--text-main)' }}>{meta.label}</span>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{resolutionKey}</div>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={onSelect} style={{ fontSize: '10px', padding: '2px 8px' }}>
          Select
        </button>
      </div>

      <div style={{
        width: '100%',
        height: '180px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#090a10',
        borderRadius: 'var(--radius-sm)',
        overflow: 'hidden',
        border: '1px solid var(--border-subtle)'
      }}>
        <canvas
          ref={canvasRef}
          width={meta.width}
          height={meta.height}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain'
          }}
        />
      </div>
    </div>
  );
}
