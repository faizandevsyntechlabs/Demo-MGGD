/**
 * MGGD Compliance Checker Modal
 * Requirements 18, 34-35:
 * Real compliance test runner evaluating live generator data and canvas frame buffers
 */

import React, { useState } from 'react';
import { 
  X, 
  CheckCircle, 
  AlertCircle, 
  HelpCircle, 
  RefreshCw, 
  ShieldCheck, 
  Layers, 
  Play, 
  CheckSquare 
} from 'lucide-react';
import { runMggdChecker } from '../../utils/validation.js';

export function CheckerModal({
  isOpen,
  onClose,
  generator,
  onUpdateValidationStatus
}) {
  const [isRunning, setIsRunning] = useState(false);
  const [report, setReport] = useState(null);

  if (!isOpen) return null;

  const handleRunChecker = async () => {
    setIsRunning(true);
    try {
      const result = await runMggdChecker(generator);
      setReport(result);
      if (result.verified) {
        onUpdateValidationStatus('Verified');
      } else {
        onUpdateValidationStatus('Unverified');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRunning(false);
    }
  };

  const sharedTests = report ? report.tests.filter((t) => t.group.includes('Shared')) : [];
  const mggdTests = report ? report.tests.filter((t) => t.group.includes('MGGD')) : [];

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
            <CheckSquare size={18} color="var(--accent-primary)" />
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px' }}>MGGD Compliance Checker Dashboard</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Requirements 34-35: Strict verification gate for live generators
              </div>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm btn-icon-only" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Action bar */}
        <div style={{ padding: '12px 18px', background: 'var(--bg-app)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-main)' }}>
              Target: {generator.name} ({generator.generatorId})
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Status: <span style={{ fontWeight: 700, color: generator.validationStatus === 'Verified' ? 'var(--status-success)' : 'var(--status-warning)' }}>{generator.validationStatus}</span>
            </div>
          </div>

          <button
            className="btn btn-primary btn-sm"
            onClick={handleRunChecker}
            disabled={isRunning}
          >
            <RefreshCw size={13} className={isRunning ? 'spin' : ''} />
            <span>{isRunning ? 'Evaluating...' : 'Run Compliance Checker'}</span>
          </button>
        </div>

        {/* Results Body */}
        <div className="modal-body">
          {!report && (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
              <ShieldCheck size={36} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
              <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>
                Checker Ready for Execution
              </div>
              <div style={{ fontSize: '12px', maxWidth: '440px', margin: '0 auto' }}>
                Click "Run Compliance Checker" to evaluate manifest structure, timing bounds, scene counts, safe areas, licensing, and live pixel determinism.
              </div>
            </div>
          )}

          {report && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Overall Banner */}
              <div style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                background: report.verified ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                border: `1px solid ${report.verified ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {report.verified ? <CheckCircle size={22} color="var(--status-success)" /> : <AlertCircle size={22} color="var(--status-error)" />}
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '13px', color: report.verified ? '#34d399' : '#f87171' }}>
                      {report.verified ? 'VERIFICATION PASSED: All Compliance Rules Satisfied' : 'VERIFICATION FAILED: Unmet Compliance Rules Detected'}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      Passed {report.passedCount} of {report.tests.length} tests · Evaluated on live generator at {new Date(report.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                <span className={`status-pill ${report.verified ? 'verified' : 'unverified'}`}>
                  {report.verified ? 'VERIFIED' : 'UNVERIFIED'}
                </span>
              </div>

              {/* Group 1: Shared VGGD/MGGD Checks */}
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Shared VGGD/MGGD Checks (Manifest, Security, Seek Protocol)
                </div>
                {sharedTests.map((t) => (
                  <div key={t.id} className={`checker-row ${t.status === 'PASS' ? 'pass' : 'fail'}`}>
                    {t.status === 'PASS' ? <CheckCircle size={14} color="var(--status-success)" /> : <AlertCircle size={14} color="var(--status-error)" />}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '12px' }}>{t.name}</span>
                        <span style={{ fontWeight: 700, fontSize: '10px', color: t.status === 'PASS' ? 'var(--status-success)' : 'var(--status-error)' }}>
                          {t.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {t.details}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Group 2: MGGD-Specific Checks */}
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  MGGD-Specific Checks (Sizes, Length, Scenes, Loops, Determinism)
                </div>
                {mggdTests.map((t) => (
                  <div key={t.id} className={`checker-row ${t.status === 'PASS' ? 'pass' : 'fail'}`}>
                    {t.status === 'PASS' ? <CheckCircle size={14} color="var(--status-success)" /> : <AlertCircle size={14} color="var(--status-error)" />}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '12px' }}>{t.name}</span>
                        <span style={{ fontWeight: 700, fontSize: '10px', color: t.status === 'PASS' ? 'var(--status-success)' : 'var(--status-error)' }}>
                          {t.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {t.details}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
