/**
 * Interactive 18-Step Walkthrough Guide Banner
 * Directly implements Requirement 20
 */

import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Check, Compass, X } from 'lucide-react';

export const WALKTHROUGH_STEPS = [
  { step: 1, title: 'Enter Maker Mode', desc: 'Ensure Maker Mode is active in the top bar to configure generator architecture.' },
  { step: 2, title: 'Select a Generator Type', desc: 'Pick from the 23 catalog types in the left sidebar (Motion, Intro/Logo Reveals, Lower-Third).' },
  { step: 3, title: 'Configure Scenes & Durations', desc: 'In Maker Mode, add/remove scenes (1-8), set min/max/default durations, designate required scenes.' },
  { step: 4, title: 'Set Animation Timing', desc: 'Configure object delays, durations, and assign trigger types (Auto - Once - Stay / Hide / Loop).' },
  { step: 5, title: 'Configure Output Sizes', desc: 'Verify per-size layout coordinates for 16:9, 9:16, 1:1, 4:5, and 21:9 in layout tabs.' },
  { step: 6, title: 'Preview Animation', desc: 'Hit Play in timeline or scrub playhead. Timecode displays real-time deterministic progression.' },
  { step: 7, title: 'Test Random Frame Seeking', desc: 'Open Debug Panel in center canvas and click "Test Random Seek Order" to run pixel verification.' },
  { step: 8, title: 'Inspect Generated Manifest', desc: 'Click "Manifest" in top bar to inspect live scene manifest and motion-manifest.json schema.' },
  { step: 9, title: 'Run Checker', desc: 'Click "Validate Generator" to evaluate shared and MGGD-specific compliance rules.' },
  { step: 10, title: 'Publish Validated Revision', desc: 'Click "Create New Revision" in Maker sidebar to generate a new immutable generator ID.' },
  { step: 11, title: 'Switch to Buyer Mode', desc: 'Toggle to Buyer Mode in the top header to enter the customer customization workspace.' },
  { step: 12, title: 'Edit Text, Colors, Fonts & Images', desc: 'In Buyer properties, change copy, pick colors, select from 20 Google Fonts, or upload custom image.' },
  { step: 13, title: 'Reorder Scenes', desc: 'In Buyer scene list, use drag or up/down arrows to reorder scenes without breaking animations.' },
  { step: 14, title: 'Adjust Allowed Timing', desc: 'Adjust scene and object durations within the maker-defined min/max bounds.' },
  { step: 15, title: 'Select Output Resolution', desc: 'Select desired target resolution from the header dropdown.' },
  { step: 16, title: 'Export PNG Sequence', desc: 'Click "PNG Sequence" button, select range and FPS, and start export to download a real ZIP file.' },
  { step: 17, title: 'Export Supported Video', desc: 'Click "Export Video", verify codec support (WebM/MP4), and encode a playable video file.' },
  { step: 18, title: 'Download Rendered Files', desc: 'Download rendered video or PNG sequence archive. Notice buyer receives rendered files, not source code!' }
];

export function WalkthroughBanner({ onStepClick, onClose }) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const current = WALKTHROUGH_STEPS[currentStepIdx];

  const handleNext = () => {
    if (currentStepIdx < WALKTHROUGH_STEPS.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(currentStepIdx - 1);
    }
  };

  return (
    <div className="walkthrough-banner">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-primary)', fontWeight: 700 }}>
          <Compass size={15} />
          <span>Demo Walkthrough</span>
          <span className="badge badge-violet">Step {current.step} of 18</span>
        </div>
        <div style={{ color: 'var(--text-main)', fontWeight: 600 }}>{current.title}:</div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>{current.desc}</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <button
          className="btn btn-secondary btn-sm"
          onClick={handlePrev}
          disabled={currentStepIdx === 0}
        >
          <ChevronLeft size={13} />
          <span>Prev</span>
        </button>
        <button
          className="btn btn-primary btn-sm"
          onClick={handleNext}
          disabled={currentStepIdx === WALKTHROUGH_STEPS.length - 1}
        >
          <span>Next</span>
          <ChevronRight size={13} />
        </button>
        <button 
          className="btn btn-ghost btn-sm btn-icon-only" 
          onClick={onClose}
          title="Dismiss walkthrough banner"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}
