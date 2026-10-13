/**
 * Center Canvas Workspace Component
 * Deterministic Canvas viewport, playback controls, safe-area overlay, checkerboard, debug panel.
 */

import React, { useRef, useEffect, useState } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Maximize2, 
  Minimize2, 
  ShieldAlert, 
  Grid, 
  Terminal, 
  Activity,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { renderFrame, RESOLUTION_PRESETS } from '../../engine/deterministicRenderer.js';
import { formatTimecode } from '../../engine/timingEngine.js';
import { seekController } from '../../engine/seekController.js';
import { assetLoader } from '../../engine/assetLoader.js';

export function CanvasWorkspace({
  activeGenerator,
  currentResolution,
  currentTime,
  totalDuration,
  isPlaying,
  onTogglePlay,
  onStepFrame,
  fps,
  onSeek
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [zoomMode, setZoomMode] = useState('fit'); // 'fit' | '50%' | '100%'
  const [showSafeArea, setShowSafeArea] = useState(true);
  const [showCheckerboard, setShowCheckerboard] = useState(true);
  const [showDebug, setShowDebug] = useState(false);
  const [violations, setViolations] = useState([]);
  const [debugAck, setDebugAck] = useState(null);
  const [determinismTestReport, setDeterminismTestReport] = useState(null);
  const [isReady, setIsReady] = useState(true);

  const res = RESOLUTION_PRESETS[currentResolution] || RESOLUTION_PRESETS['1920x1080'];

  // Subscribe to seekController events
  useEffect(() => {
    const unsubscribe = seekController.subscribe((timestamp, ack) => {
      setDebugAck(ack);
    });
    return unsubscribe;
  }, []);

  // Check asset readiness
  useEffect(() => {
    const report = assetLoader.getReadinessReport();
    setIsReady(report.status === 'READY');
  }, [activeGenerator]);

  // Deterministic Canvas Rendering Effect
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    // Render frame deterministically at absolute currentTime
    const result = renderFrame(canvas, activeGenerator, currentTime, currentResolution, {
      showSafeArea,
      scaleMultiplier: 1.0
    });

    if (result && result.violations) {
      setViolations(result.violations);
    }
  }, [activeGenerator, currentTime, currentResolution, showSafeArea]);

  // Run Out-of-Order Random Seek Test (Requirement 8)
  const handleRunDeterminismTest = async () => {
    const report = await seekController.testRandomSeekDeterminism(canvasRef.current, activeGenerator, currentResolution);
    setDeterminismTestReport(report);
  };

  // Compute CSS sizing for fitting aspect ratio
  const getCanvasStyle = () => {
    if (zoomMode === '100%') {
      return {
        width: `${res.width}px`,
        height: `${res.height}px`
      };
    }
    if (zoomMode === '50%') {
      return {
        width: `${res.width * 0.5}px`,
        height: `${res.height * 0.5}px`
      };
    }

    // Default 'fit'
    const aspect = res.width / res.height;
    if (aspect >= 1) {
      return {
        width: 'min(92%, 820px)',
        height: 'auto',
        aspectRatio: `${res.width} / ${res.height}`
      };
    } else {
      return {
        height: 'min(78vh, 520px)',
        width: 'auto',
        aspectRatio: `${res.width} / ${res.height}`
      };
    }
  };

  const isTransparent = Boolean(activeGenerator.transparency);

  return (
    <div className="center-viewport" ref={containerRef}>
      {/* Viewport Top Toolbar */}
      <div className="viewport-toolbar">
        {/* Playhead & Stepping */}
        <div className="playback-controls">
          <button 
            className="btn btn-secondary btn-sm btn-icon-only" 
            onClick={() => onStepFrame(-1)}
            title="Step 1 frame backward"
          >
            <SkipBack size={13} />
          </button>
          <button 
            className={`btn btn-sm ${isPlaying ? 'btn-secondary' : 'btn-primary'}`} 
            onClick={onTogglePlay}
            title={isPlaying ? 'Pause playback' : 'Play animation'}
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>
          <button 
            className="btn btn-secondary btn-sm btn-icon-only" 
            onClick={() => onStepFrame(1)}
            title="Step 1 frame forward"
          >
            <SkipForward size={13} />
          </button>

          {/* Timecode Badge */}
          <div className="timecode-badge" title="SMPTE Timecode (HH:MM:SS:FF)">
            {formatTimecode(currentTime, fps)}
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            / {formatTimecode(totalDuration, fps)} ({fps} FPS)
          </span>
        </div>

        {/* Guides & Tools */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* Safe Area Toggle */}
          <button
            className={`btn btn-sm ${showSafeArea ? 'btn-secondary' : 'btn-ghost'}`}
            onClick={() => setShowSafeArea(!showSafeArea)}
            title="Toggle 5% Safe Area Guide (Requirement 11)"
            style={{ color: showSafeArea ? 'var(--status-error)' : 'var(--text-secondary)' }}
          >
            <ShieldAlert size={13} />
            <span>5% Safe Area</span>
          </button>

          {/* Checkerboard Toggle */}
          <button
            className={`btn btn-sm ${showCheckerboard ? 'btn-secondary' : 'btn-ghost'}`}
            onClick={() => setShowCheckerboard(!showCheckerboard)}
            title="Toggle Transparency Checkerboard"
          >
            <Grid size={13} />
            <span>Alpha Grid</span>
          </button>

          {/* Zoom Selector */}
          <select
            className="form-select"
            style={{ padding: '2px 6px', fontSize: '11px' }}
            value={zoomMode}
            onChange={(e) => setZoomMode(e.target.value)}
          >
            <option value="fit">Fit View</option>
            <option value="50%">50%</option>
            <option value="100%">100%</option>
          </select>

          {/* Debug Panel Toggle */}
          <button
            className={`btn btn-sm ${showDebug ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setShowDebug(!showDebug)}
            title="Toggle Seek Protocol & Determinism Debug Console"
          >
            <Terminal size={13} />
            <span>Debug</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Stage */}
      <div className={`canvas-container ${isTransparent && showCheckerboard ? 'checkerboard' : ''}`}>
        <div 
          className="canvas-frame"
          style={getCanvasStyle()}
          data-ready={isReady ? 'true' : 'false'}
        >
          <canvas
            ref={canvasRef}
            className="render-canvas"
            width={res.width}
            height={res.height}
          />

          {/* Safe Area Label Overlay */}
          {showSafeArea && (
            <div className="safe-area-guide">
              <div className="safe-area-label">5% SAFE AREA MARGIN</div>
            </div>
          )}
        </div>
      </div>

      {/* Safe Area Violation Banner */}
      {violations.length > 0 && showSafeArea && (
        <div style={{
          position: 'absolute',
          bottom: '8px',
          left: '12px',
          right: '12px',
          background: 'rgba(239, 68, 68, 0.9)',
          color: '#ffffff',
          padding: '6px 12px',
          borderRadius: 'var(--radius-sm)',
          fontSize: '11px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 25
        }}>
          <AlertTriangle size={14} />
          <span><strong>Safe Area Warning (Requirement 11):</strong> {violations[0].reason}</span>
        </div>
      )}

      {/* Debug Panel (Requirements 5 & 8) */}
      {showDebug && (
        <div style={{
          position: 'absolute',
          top: '46px',
          right: '12px',
          width: '340px',
          background: 'rgba(17, 24, 39, 0.95)',
          backdropFilter: 'blur(8px)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-md)',
          padding: '12px',
          zIndex: 35,
          boxShadow: 'var(--shadow-lg)',
          fontSize: '11px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
            <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-secondary)' }}>
              <Terminal size={13} />
              <span>Seek & Readiness Debug Console</span>
            </div>
            <button className="btn btn-ghost btn-sm" style={{ padding: '0 4px' }} onClick={() => setShowDebug(false)}>✕</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Timestamp:</span>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{currentTime.toFixed(3)}s</div>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Frame #:</span>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{Math.floor(currentTime * fps)}</div>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Surface Ready:</span>
              <div style={{ color: isReady ? 'var(--status-success)' : 'var(--status-error)', fontWeight: 600 }}>
                {isReady ? 'READY (data-ready=true)' : 'WAITING ASSETS'}
              </div>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Failed Assets:</span>
              <div style={{ fontFamily: 'var(--font-mono)' }}>{assetLoader.failedAssets.length}</div>
            </div>
          </div>

          {/* Last Seek Ack */}
          <div style={{ background: 'var(--bg-app)', padding: '6px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>Last vincta:seek Event Ack:</span>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-main)', marginTop: '2px' }}>
              {debugAck ? `Ack t=${debugAck.timestamp.toFixed(3)}s (msgId: ${debugAck.messageId})` : 'Listening on window message bus...'}
            </div>
          </div>

          {/* Test Random Seek Order Button (Requirement 8) */}
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleRunDeterminismTest}
            style={{ width: '100%', marginTop: '4px' }}
          >
            <Activity size={12} color="var(--accent-primary)" />
            <span>Test Random Seek Order (Pixel Test)</span>
          </button>

          {determinismTestReport && (
            <div style={{
              background: determinismTestReport.passed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              border: `1px solid ${determinismTestReport.passed ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              padding: '6px 8px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '10px'
            }}>
              <div style={{ fontWeight: 700, color: determinismTestReport.passed ? 'var(--status-success)' : 'var(--status-error)' }}>
                {determinismTestReport.passed ? '✓ Pixel Determinism 100% Match' : '✗ Determinism Discrepancy'}
              </div>
              <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                {determinismTestReport.message}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
