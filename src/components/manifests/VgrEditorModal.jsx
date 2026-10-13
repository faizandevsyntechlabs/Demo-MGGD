/**
 * Motion VGR M1.0 Inspector & Schema Validator Modal
 * Requirements 29-30:
 * - VGR M1.0 schema with 5 classification fields
 * - Validates schema and reports errors
 * - Prohibits geometry in Motion VGR
 */

import React, { useState } from 'react';
import { X, FileJson, Copy, Check, AlertCircle, CheckCircle2 } from 'lucide-react';
import { validateMotionVgr } from '../../schemas/motionVgrSchema.js';

export function VgrEditorModal({
  isOpen,
  onClose,
  generator
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const vgrDocument = {
    panelVersion: 'M1.0',
    generatorId: generator.generatorId,
    generatorTypeId: generator.generatorTypeId,
    classification: generator.classification,
    motion: {
      sizes: generator.supportedSizes,
      scenes: (generator.scenes || []).map((s) => ({
        id: s.id,
        name: s.name,
        order: s.order,
        defaultDuration: s.defaultDuration,
        minDuration: s.minDuration,
        maxDuration: s.maxDuration
      })),
      loop: Boolean(generator.loop),
      libraries: generator.libraries || []
    }
  };

  const validation = validateMotionVgr(vgrDocument);
  const jsonString = JSON.stringify(vgrDocument, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-card" 
        style={{ maxWidth: '820px', maxHeight: '88vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileJson size={18} color="var(--accent-primary)" />
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px' }}>Motion VGR M1.0 Inspector</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Requirements 29-30: Generator document schema and classification fields
              </div>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm btn-icon-only" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Validation Status Bar */}
        <div style={{ padding: '10px 18px', background: 'var(--bg-app)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {validation.valid ? (
              <span className="status-pill verified">
                <CheckCircle2 size={12} />
                <span>VGR M1.0 Schema Valid</span>
              </span>
            ) : (
              <span className="status-pill error">
                <AlertCircle size={12} />
                <span>VGR Schema Errors ({validation.errors.length})</span>
              </span>
            )}
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              (No geometry in Motion VGR · 5 classification tags verified)
            </span>
          </div>

          <button className="btn btn-secondary btn-sm" onClick={handleCopy}>
            {copied ? <Check size={13} color="var(--status-success)" /> : <Copy size={13} />}
            <span>{copied ? 'Copied VGR' : 'Copy VGR JSON'}</span>
          </button>
        </div>

        {/* Notice on Demo catalog vs Official MGGD */}
        <div style={{ padding: '8px 18px', background: 'rgba(59, 130, 246, 0.1)', borderBottom: '1px solid var(--border-subtle)', fontSize: '11px', color: '#93c5fd' }}>
          <strong>Catalog Notice:</strong> Uses demo IDs (e.g. <code>demo-mggd-xxx</code>) and sample classification values pending official MGGD VGR catalog issuance.
        </div>

        {/* JSON Viewer */}
        <div className="modal-body" style={{ padding: '0', background: '#0a0d14' }}>
          <pre style={{
            margin: 0,
            padding: '16px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: '#38bdf8',
            lineHeight: 1.6,
            overflowX: 'auto',
            maxHeight: '55vh'
          }}>
            {jsonString}
          </pre>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
