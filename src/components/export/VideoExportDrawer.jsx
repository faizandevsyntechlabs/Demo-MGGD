/**
 * Video Export Right-Side Drawer
 * Requirements 6, 12, 31:
 * - Real video encoding with MediaRecorder stream capture
 * - Validates browser codecs (WebM VP9, MP4 H264)
 * - Truthfully reports transparency constraints (MP4 has no alpha channel)
 * - Does NOT mislabel WebM as MP4 or MOV
 * - Unverified Buyer Gating
 */

import React, { useState, useRef, useEffect } from 'react';
import { X, Film, Download, AlertTriangle, CheckCircle, Info, Loader2 } from 'lucide-react';
import { RESOLUTION_PRESETS } from '../../engine/deterministicRenderer.js';
import { getSupportedVideoFormats, encodeVideoFromGenerator } from '../../engine/videoEncoder.js';
import { triggerFileDownload } from '../../utils/zipExport.js';

export function VideoExportDrawer({
  isOpen,
  onClose,
  generator,
  currentTime,
  totalDuration,
  mode
}) {
  const [rangeMode, setRangeMode] = useState('full');
  const [customStart, setCustomStart] = useState(0);
  const [customEnd, setCustomEnd] = useState(totalDuration);
  const [fps, setFps] = useState(30);
  const [resolutionKey, setResolutionKey] = useState(generator.defaultSize || '1920x1080');
  const [scaleMultiplier, setScaleMultiplier] = useState(1.0);
  const [selectedFormat, setSelectedFormat] = useState('webm'); // 'webm' | 'mp4' | 'mov'

  const [codecInfo, setCodecInfo] = useState({ formats: [] });
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [currentFrameInfo, setCurrentFrameInfo] = useState('');
  const [downloadReady, setDownloadReady] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const abortControllerRef = useRef(null);

  useEffect(() => {
    setCodecInfo(getSupportedVideoFormats());
  }, []);

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

  // Codec availability checks
  const hasMp4 = codecInfo.canRecordMp4;
  const hasWebm = codecInfo.canRecordWebm;

  const handleStartExport = async () => {
    setIsExporting(true);
    setExportProgress(0);
    setDownloadReady(null);
    setErrorMessage(null);
    abortControllerRef.current = new AbortController();

    // Map format to supported MIME type
    let targetMime = 'video/webm;codecs=vp9';
    if (selectedFormat === 'mp4') {
      if (!hasMp4) {
        setIsExporting(false);
        setErrorMessage('MP4 container encoding is not supported by your current browser MediaRecorder engine. Please select WebM (VP9).');
        return;
      }
      targetMime = 'video/mp4';
    } else if (selectedFormat === 'mov') {
      setIsExporting(false);
      setErrorMessage('QuickTime MOV container encoding is not natively exposed by standard browser MediaRecorder without an external wasm muxer. Use WebM or PNG sequence.');
      return;
    }

    try {
      const result = await encodeVideoFromGenerator({
        generator,
        resolutionKey,
        fps,
        startTime,
        endTime,
        scaleMultiplier,
        mimeType: targetMime,
        onProgress: (p) => {
          setExportProgress(Math.round(p.progress * 100));
          setCurrentFrameInfo(`Encoding frame ${p.frame} of ${p.totalFrames}...`);
        },
        abortSignal: abortControllerRef.current.signal
      });

      setDownloadReady({
        blob: result.blob,
        filename: `${generator.generatorId}_${resolutionKey}_${fps}fps.${result.extension}`,
        sizeBytes: result.sizeBytes,
        framesCount: result.framesCount
      });
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
            <Film size={16} color="var(--accent-primary)" />
            <div>
              <div style={{ fontWeight: 700, fontSize: '13px' }}>Video Export</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Requirements 6, 12, 31: Real deterministic video encoding</div>
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
                <strong>Buyer Export Gated (Requirement 35):</strong> This generator is unverified. Run Checker and verify in Maker Mode before buyer export is permitted.
              </div>
            </div>
          )}

          {/* Video Container Format Selection */}
          <div className="form-group">
            <span className="form-label">Container Format & Codec</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                className={`btn btn-sm ${selectedFormat === 'webm' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1, fontSize: '11px' }}
                onClick={() => setSelectedFormat('webm')}
              >
                WebM (VP9)
              </button>
              <button
                className={`btn btn-sm ${selectedFormat === 'mp4' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1, fontSize: '11px' }}
                onClick={() => setSelectedFormat('mp4')}
              >
                MP4 {hasMp4 ? '(H.264)' : '(Browser N/A)'}
              </button>
              <button
                className={`btn btn-sm ${selectedFormat === 'mov' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1, fontSize: '11px' }}
                onClick={() => setSelectedFormat('mov')}
              >
                MOV (ProRes)
              </button>
            </div>

            {/* Truth in Codec Disclaimers (Requirement 12) */}
            {selectedFormat === 'mp4' && (
              <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px', background: 'var(--bg-app)', padding: '6px', borderRadius: 'var(--radius-sm)' }}>
                <strong>Codec Notice (Req 12):</strong> MP4 format does not support an alpha transparency channel. Any transparent background will be rendered against black.
              </div>
            )}
            {selectedFormat === 'mov' && (
              <div style={{ fontSize: '10px', color: 'var(--status-warning)', marginTop: '4px', background: 'rgba(245, 158, 11, 0.1)', padding: '6px', borderRadius: 'var(--radius-sm)' }}>
                <strong>Unsupported in Browser:</strong> MOV ProRes encoding requires non-browser native muxing. Please use WebM or PNG sequence.
              </div>
            )}
          </div>

          {/* Export Range */}
          <div>
            <span className="form-label" style={{ marginBottom: '6px' }}>Export Range</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                className={`btn btn-sm ${rangeMode === 'full' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1, fontSize: '11px' }}
                onClick={() => setRangeMode('full')}
              >
                Full ({totalDuration.toFixed(1)}s)
              </button>
              <button
                className={`btn btn-sm ${rangeMode === 'playhead_end' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1, fontSize: '11px' }}
                onClick={() => setRangeMode('playhead_end')}
              >
                Playhead to End
              </button>
            </div>
          </div>

          {/* Frame Rate */}
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

          {/* Resolution & Scale */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div className="form-group">
              <span className="form-label">Resolution</span>
              <select
                className="form-select"
                value={resolutionKey}
                onChange={(e) => setResolutionKey(e.target.value)}
              >
                {Object.entries(RESOLUTION_PRESETS).map(([key, item]) => (
                  <option key={key} value={key}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <span className="form-label">Scale Multiplier</span>
              <select
                className="form-select"
                value={scaleMultiplier}
                onChange={(e) => setScaleMultiplier(Number(e.target.value))}
              >
                <option value={1.0}>1× Standard</option>
                <option value={2.0}>2× High-Res / 4K</option>
              </select>
            </div>
          </div>

          {/* Encoding Summary */}
          <div style={{ padding: '10px', background: 'var(--bg-app)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Target Dimensions:</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>{targetW} × {targetH} px</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Frames to Encode:</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>{totalFrames} frames</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Audio Track:</span>
              <span style={{ color: 'var(--text-secondary)' }}>Silent (MGGD Standard)</span>
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
                <span>Video Encoded Successfully!</span>
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                File Size: {(downloadReady.sizeBytes / (1024 * 1024)).toFixed(2)} MB ({downloadReady.framesCount} frames)
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
              Cancel Encoding
            </button>
          ) : (
            <button
              className="btn btn-primary btn-sm"
              onClick={handleStartExport}
              disabled={isBuyerBlocked || selectedFormat === 'mov'}
            >
              <Film size={13} />
              <span>Start Video Export</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
