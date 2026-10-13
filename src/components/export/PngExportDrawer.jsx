/**
 * PNG Sequence Export Right-Side Drawer
 * Requirement 14 & 31:
 * - Export Range: Full Timeline, Playhead to End, Custom Start/End
 * - Frame Rate: 24, 25, 30, 50, 60 FPS
 * - Output: Resolution, 1x/2x scale, Transparency status, Frame count, Est. size, Filename prefix
 * - Actions: Start Export, Cancel, Real Progress, Download ZIP
 * - Unverified Buyer Gating
 */

import React, { useState, useRef } from 'react';
import { X, Image, Download, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { RESOLUTION_PRESETS } from '../../engine/deterministicRenderer.js';
import { exportPngSequenceZip, triggerFileDownload } from '../../utils/zipExport.js';

export function PngExportDrawer({
  isOpen,
  onClose,
  generator,
  currentTime,
  totalDuration,
  mode
}) {
  const [rangeMode, setRangeMode] = useState('full'); // 'full' | 'playhead_end' | 'custom'
  const [customStart, setCustomStart] = useState(0);
  const [customEnd, setCustomEnd] = useState(totalDuration);
  const [fps, setFps] = useState(30);
  const [resolutionKey, setResolutionKey] = useState(generator.defaultSize || '1920x1080');
  const [scaleMultiplier, setScaleMultiplier] = useState(1.0);
  const [filePrefix, setFilePrefix] = useState('frame_');

  // Export execution state
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [currentFrameInfo, setCurrentFrameInfo] = useState('');
  const [downloadReady, setDownloadReady] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const abortControllerRef = useRef(null);

  if (!isOpen) return null;

  const isVerified = generator.validationStatus === 'Verified';
  const isBuyerBlocked = mode === 'buyer' && !isVerified;

  // Calculate actual time range
  let startTime = 0;
  let endTime = totalDuration;
  if (rangeMode === 'playhead_end') {
    startTime = currentTime;
    endTime = totalDuration;
  } else if (rangeMode === 'custom') {
    startTime = Math.max(0, Math.min(totalDuration, customStart));
    endTime = Math.max(startTime + 0.1, Math.min(totalDuration, customEnd));
  }

  const durationToExport = Math.max(0.1, endTime - startTime);
  const totalFrames = Math.max(1, Math.round(durationToExport * fps));
  const res = RESOLUTION_PRESETS[resolutionKey] || RESOLUTION_PRESETS['1920x1080'];
  const targetW = res.width * scaleMultiplier;
  const targetH = res.height * scaleMultiplier;
  // Estimate ~0.8MB per 1080p PNG frame or ~2.5MB for 4K
  const estMb = ((totalFrames * (targetW * targetH * 0.00000045))).toFixed(1);

  const handleStartExport = async () => {
    setIsExporting(true);
    setExportProgress(0);
    setDownloadReady(null);
    setErrorMessage(null);
    abortControllerRef.current = new AbortController();

    try {
      const result = await exportPngSequenceZip({
        generator,
        resolutionKey,
        fps,
        startTime,
        endTime,
        scaleMultiplier,
        prefix: filePrefix,
        onProgress: (p) => {
          setExportProgress(Math.round(p.progress * 100));
          setCurrentFrameInfo(`Rendering frame ${p.frame} of ${p.totalFrames} (t=${p.currentTimestamp.toFixed(2)}s)...`);
        },
        abortSignal: abortControllerRef.current.signal
      });

      setDownloadReady(result);
      setIsExporting(false);
    } catch (err) {
      setIsExporting(false);
      setErrorMessage(err.message);
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsExporting(false);
  };

  const handleDownload = () => {
    if (downloadReady) {
      triggerFileDownload(downloadReady.blob, downloadReady.filename);
    }
  };

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Image size={16} color="var(--accent-primary)" />
            <div>
              <div style={{ fontWeight: 700, fontSize: '13px' }}>PNG Sequence Export</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Requirement 31: ZIP archive packaging with numbered frames</div>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm btn-icon-only" onClick={onClose}>
            <X size={15} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Buyer Blocked Warning */}
          {isBuyerBlocked && (
            <div style={{ padding: '10px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: 'var(--radius-sm)', color: '#fbbf24', fontSize: '11px', display: 'flex', gap: '8px' }}>
              <AlertTriangle size={16} />
              <div>
                <strong>Buyer Export Gated (Requirement 35):</strong> This generator is unverified. Validate and verify the generator first in Maker Mode before buyer export is permitted.
              </div>
            </div>
          )}

          {mode === 'maker' && !isVerified && (
            <div style={{ padding: '8px', background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: 'var(--radius-sm)', color: '#93c5fd', fontSize: '11px' }}>
              <strong>Maker Test Render:</strong> Available for preview and diagnostic verification while unverified.
            </div>
          )}

          {/* Export Range */}
          <div>
            <span className="form-label" style={{ marginBottom: '6px' }}>Export Timeline Range</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                className={`btn btn-sm ${rangeMode === 'full' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1, fontSize: '11px' }}
                onClick={() => setRangeMode('full')}
              >
                Full (0.0s – {totalDuration.toFixed(1)}s)
              </button>
              <button
                className={`btn btn-sm ${rangeMode === 'playhead_end' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1, fontSize: '11px' }}
                onClick={() => setRangeMode('playhead_end')}
              >
                Playhead to End ({currentTime.toFixed(1)}s – {totalDuration.toFixed(1)}s)
              </button>
              <button
                className={`btn btn-sm ${rangeMode === 'custom' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1, fontSize: '11px' }}
                onClick={() => setRangeMode('custom')}
              >
                Custom
              </button>
            </div>

            {rangeMode === 'custom' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '8px' }}>
                <div className="form-group">
                  <span className="form-label">Start Time (s)</span>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max={totalDuration}
                    className="form-input"
                    value={customStart}
                    onChange={(e) => setCustomStart(Number(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <span className="form-label">End Time (s)</span>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max={totalDuration}
                    className="form-input"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(Number(e.target.value))}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Frame Rate Selection (Requirement 7) */}
          <div className="form-group">
            <span className="form-label">Frame Rate (FPS)</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              {[24, 25, 30, 50, 60].map((f) => (
                <button
                  key={f}
                  className={`btn btn-sm ${fps === f ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: 1, fontSize: '11px' }}
                  onClick={() => setFps(f)}
                >
                  {f} FPS
                </button>
              ))}
            </div>
          </div>

          {/* Resolution & 2x Scale */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div className="form-group">
              <span className="form-label">Output Resolution</span>
              <select
                className="form-select"
                value={resolutionKey}
                onChange={(e) => setResolutionKey(e.target.value)}
              >
                {Object.entries(RESOLUTION_PRESETS).map(([key, item]) => (
                  <option key={key} value={key}>
                    {item.label} ({key})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <span className="form-label">Scale Multiplier (Req 14)</span>
              <select
                className="form-select"
                value={scaleMultiplier}
                onChange={(e) => setScaleMultiplier(Number(e.target.value))}
              >
                <option value={1.0}>1× Standard ({res.width}×{res.height})</option>
                <option value={2.0}>2× High-Res / 4K ({res.width * 2}×{res.height * 2})</option>
              </select>
            </div>
          </div>

          {/* Naming Prefix */}
          <div className="form-group">
            <span className="form-label">File Naming Prefix</span>
            <input
              type="text"
              className="form-input"
              value={filePrefix}
              onChange={(e) => setFilePrefix(e.target.value)}
              placeholder="e.g. frame_"
            />
          </div>

          {/* Summary Card */}
          <div style={{ padding: '10px', background: 'var(--bg-app)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Target Canvas Size:</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>{targetW} × {targetH} px</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Total Frame Count:</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>{totalFrames} frames</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Alpha Transparency:</span>
              <span style={{ color: generator.transparency ? 'var(--status-success)' : 'var(--text-secondary)' }}>
                {generator.transparency ? 'Preserved (RGBA 32-bit)' : 'Solid Background'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Estimated Archive Size:</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>~{estMb} MB</span>
            </div>
          </div>

          {/* Export Progress Bar */}
          {isExporting && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{currentFrameInfo}</span>
                <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>{exportProgress}%</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'var(--bg-app)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${exportProgress}%`, height: '100%', background: 'linear-gradient(90deg, #8b5cf6, #06b6d4)', transition: 'width 0.1s linear' }} />
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div style={{ padding: '8px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', borderRadius: 'var(--radius-sm)', fontSize: '11px' }}>
              {errorMessage}
            </div>
          )}

          {/* Download Ready Card */}
          {downloadReady && (
            <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399', fontWeight: 600 }}>
                <CheckCircle size={14} />
                <span>ZIP Archive Ready: {downloadReady.totalFrames} frames encoded.</span>
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                Archive Size: {(downloadReady.sizeBytes / (1024 * 1024)).toFixed(2)} MB
              </div>
              <button className="btn btn-success btn-sm" onClick={handleDownload} style={{ width: '100%' }}>
                <Download size={13} />
                <span>Download {downloadReady.filename}</span>
              </button>
            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
        <div className="modal-footer">
          {isExporting ? (
            <button className="btn btn-secondary btn-sm" onClick={handleCancel}>
              Cancel Export
            </button>
          ) : (
            <button
              className="btn btn-primary btn-sm"
              onClick={handleStartExport}
              disabled={isBuyerBlocked}
            >
              <Image size={13} />
              <span>Start PNG Export</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
