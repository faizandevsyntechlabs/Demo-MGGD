/**
 * Bottom Timeline Component
 * Professional multi-track timeline with scenes, object tracks, playhead, scrubbing, and duration handles
 */

import React, { useRef, useState, useEffect } from 'react';
import { 
  Clock, 
  ZoomIn, 
  ZoomOut, 
  Lock, 
  Sliders, 
  Plus, 
  Trash2, 
  Layers 
} from 'lucide-react';
import { formatTimecode } from '../../engine/timingEngine.js';

export function Timeline({
  timeline,
  currentTime,
  totalDuration,
  onSeek,
  fps,
  selectedSceneId,
  onSelectScene,
  mode,
  onReorderScenes
}) {
  const rulerRef = useRef(null);
  const [isDraggingPlayhead, setIsDraggingPlayhead] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1.0); // 1.0 = 100% width

  const { scenes } = timeline;

  // Handle click / drag on timeline tracks to seek playhead
  const handleSeekFromEvent = (e) => {
    if (!rulerRef.current) return;
    const rect = rulerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const targetTime = ratio * totalDuration;
    onSeek(targetTime);
  };

  const handleMouseDown = (e) => {
    setIsDraggingPlayhead(true);
    handleSeekFromEvent(e);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDraggingPlayhead) return;
      handleSeekFromEvent(e);
    };

    const handleMouseUp = () => {
      if (isDraggingPlayhead) {
        setIsDraggingPlayhead(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingPlayhead, totalDuration]);

  // Generate ruler tick marks
  const numSeconds = Math.ceil(totalDuration);
  const playheadPercent = (currentTime / Math.max(0.01, totalDuration)) * 100;

  return (
    <div className="bottom-timeline">
      {/* Timeline Controls Header */}
      <div className="timeline-controls-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Timeline Tracks
          </span>
          <span className="badge badge-violet" style={{ fontSize: '10px' }}>
            {scenes.length} Scenes · {totalDuration.toFixed(1)}s Total
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Zoom Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              className="btn btn-ghost btn-sm btn-icon-only"
              onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.2))}
              title="Zoom Out Timeline"
            >
              <ZoomOut size={12} />
            </button>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', minWidth: '35px', textAlign: 'center' }}>
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              className="btn btn-ghost btn-sm btn-icon-only"
              onClick={() => setZoomLevel((z) => Math.min(2.0, z + 0.2))}
              title="Zoom In Timeline"
            >
              <ZoomIn size={12} />
            </button>
          </div>

          <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent-secondary)' }}>
            Playhead: {currentTime.toFixed(3)}s
          </div>
        </div>
      </div>

      {/* Timeline Interactive Body */}
      <div className="timeline-body" style={{ minWidth: '100%' }}>
        {/* Ruler Track */}
        <div
          className="timeline-ruler"
          ref={rulerRef}
          onMouseDown={handleMouseDown}
          style={{ width: `${zoomLevel * 100}%`, minWidth: '100%', cursor: 'pointer' }}
        >
          {Array.from({ length: numSeconds + 1 }).map((_, sec) => {
            const leftPct = (sec / totalDuration) * 100;
            if (leftPct > 100) return null;
            return (
              <div key={sec} className="ruler-tick" style={{ left: `${leftPct}%` }}>
                {sec}s
              </div>
            );
          })}

          {/* Draggable Playhead */}
          <div
            className="timeline-playhead-line"
            style={{ left: `${playheadPercent}%` }}
          >
            <div className="timeline-playhead-head" />
          </div>
        </div>

        {/* Scene Blocks Track */}
        <div 
          className="timeline-tracks-container"
          style={{ width: `${zoomLevel * 100}%`, minWidth: '100%' }}
        >
          <div className="timeline-scenes-row">
            {scenes.map((scene, idx) => {
              const leftPct = (scene.startTime / totalDuration) * 100;
              const widthPct = (scene.duration / totalDuration) * 100;
              const isSelected = scene.id === selectedSceneId;

              return (
                <div
                  key={scene.id}
                  className={`timeline-scene-block ${isSelected ? 'selected' : ''}`}
                  style={{
                    left: `${leftPct}%`,
                    width: `calc(${widthPct}% - 4px)`
                  }}
                  onClick={() => onSelectScene(scene.id)}
                  title={`${scene.name} (${scene.duration}s)`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
                    {scene.required && (
                      <span title="Required scene: Protected from removal">
                        <Lock size={10} color="var(--accent-secondary)" />
                      </span>
                    )}
                    <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                      S{idx + 1}: {scene.name}
                    </span>
                  </div>

                  <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    {scene.duration.toFixed(1)}s
                  </span>
                </div>
              );
            })}
          </div>

          {/* Sub-track: Animated Objects in Selected Scene */}
          {scenes.map((scene) => {
            if (scene.id !== selectedSceneId) return null;
            const sceneLeftPct = (scene.startTime / totalDuration) * 100;
            const sceneWidthPct = (scene.duration / totalDuration) * 100;

            return (
              <div 
                key={`sub-${scene.id}`} 
                style={{
                  margin: '0 8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                {(scene.objects || []).map((obj) => {
                  const objStart = (obj.delay || 0) / scene.duration;
                  const objDur = (obj.duration || 1.0) / scene.duration;

                  const trackLeft = sceneLeftPct + objStart * sceneWidthPct;
                  const trackWidth = objDur * sceneWidthPct;

                  return (
                    <div
                      key={obj.id}
                      style={{
                        position: 'relative',
                        height: '22px',
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: '3px'
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          left: `${trackLeft}%`,
                          width: `${Math.max(2, trackWidth)}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, rgba(139, 92, 246, 0.4), rgba(6, 182, 212, 0.4))',
                          border: '1px solid var(--accent-primary)',
                          borderRadius: '3px',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0 6px',
                          fontSize: '10px',
                          color: '#ffffff',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {obj.name} ({obj.trigger})
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
