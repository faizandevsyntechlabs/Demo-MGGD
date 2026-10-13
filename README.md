# MGGD Motion Generator Studio — Maker & Buyer Demo

A fully functional, standalone **MGGD (Motion Graphic Generator Document) Studio** implementing all 35 MGGD specification requirements. Designed for engineering teams and client demonstrations to showcase the complete **Maker → Generator → Buyer → Rendering → Export → Validation** lifecycle.

---

## Key Highlights

- **Pure React JSX + Plain CSS Variables**: Zero Tailwind dependencies; custom professional dark-theme video suite layout.
- **Deterministic Frame Rendering Engine**: Pure mathematical functions of timestamp $t$ (`lerp`, `easeInOutCubic`, `spring`); completely decoupled from `requestAnimationFrame` state.
- **vincta:seek Custom Protocol**: Listens on the browser window message bus for `vincta:seek`, providing real-time acknowledgement and out-of-order seek verification.
- **Out-of-Order Random Seek Test**: Renders frames across arbitrary non-linear timestamps (e.g. $[0.5, 2.2, 0.0, 1.4, 0.5]$) and compares 32-bit pixel buffers to prove 100% frame byte equality.
- **Asset Readiness & 10s Timeout Mechanism**: Preloads Google Fonts and image assets with a 10-second timeout, applies `data-ready="true"` to design surfaces, and blocks export on failed assets.
- **Maker vs Buyer Mode Segregation**:
  - **Maker**: Full architectural control (1–8 scenes, min/max/default durations, trigger types, 5 per-size layout coordinates, library & asset licensing, "Create New Revision" with new immutable ID).
  - **Buyer**: Gated customization (headline/subline/tag, 20 Google Fonts, color swatches, image replacement, scene reordering, optional scene removal, duration trims within maker bounds). Buyer exports are locked until the generator is verified!
- **5 Standard Output Resolutions**:
  1. `1920×1080` (Landscape 16:9)
  2. `1080×1920` (Portrait 9:16)
  3. `1080×1080` (Square 1:1)
  4. `1080×1350` (Portrait 4:5)
  5. `2560×1080` (Ultrawide 21:9)
  *Includes a Multi-Size Comparison matrix and 2× High-Res / 4K export scale multiplier.*
- **5% Settled-State Safe-Area Guide**: Interactive visual guide and real-time bounding box validator for settled text and logos.
- **Alpha Transparency & Codec Integrity**:
  - Checkerboard alpha background in workspace.
  - 32-bit RGBA transparency preserved in PNG sequence exports.
  - Truthful codec warnings: MP4 has no alpha channel; WebM VP9 supports alpha; MOV ProRes indicates browser limitations without mislabeling.
- **Real PNG Sequence Export**: Packages numbered frames (`frame_0001.png`, etc.) into a ZIP archive using `JSZip` with full cancellation and progress tracking.
- **Real Video Export**: Uses `canvas.captureStream` and `MediaRecorder` with real encoding progress and downloads actual `.webm` or `.mp4` video files.
- **Live Scene Manifest & motion-manifest.json**: Live synchronizing scene manifests and official schema inspector with JSON copy support.
- **Motion VGR M1.0 Document & 23 Catalog Types**:
  - 10 Configurable Motion types.
  - 12 Configurable Intro/Logo Reveal types.
  - 1 Lower-Third Nameplate type.
  - 5 complete high-fidelity presets + dynamic instantiation for all 23 catalog entries.
- **MGGD Compliance Checker**:
  - Shared VGGD/MGGD checks (Manifest, Security, Seek protocol).
  - MGGD-specific checks (Sizes, Durations 1–60s, Scene limits 1–8, Trigger types, Asset readiness, Licensing, Pixel determinism).
- **Requirements Coverage Matrix**: In-app modal detailing all 35 numbered requirements with implementation modules and test methods.
- **Interactive 18-Step Walkthrough Guide**: Top guide banner directing users through the complete Maker-to-Buyer-to-Export workflow.

---

## Getting Started

### 1. Installation

```bash
npm install
```

### 2. Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

### 3. Build & Production Verification

```bash
npm run build
npm run lint
```

---

## 18-Step Client Demonstration Guide

1. **Enter Maker Mode**: Click "Maker Mode" in the top header.
2. **Select a Generator**: Browse the 23 catalog types in the left sidebar or select one of the 5 built-in presets.
3. **Configure Scenes**: Adjust default, min, and max durations; designate required scenes; set entrance and exit transitions.
4. **Set Animation Timing**: Open the Timing tab in the right sidebar to adjust object delays, durations, and automatic triggers (`Auto - Once - Stay`, `Auto - Once - Hide`, `Auto - Loop`).
5. **Configure Output Sizes**: Open the Layouts tab to set independent coordinates for all 5 aspect ratios.
6. **Preview Animation**: Press Play or scrub the timeline playhead. Timecode displays SMPTE time (`HH:MM:SS:FF`).
7. **Test Random Frame Seeking**: Open the "Debug" panel on the canvas toolbar and click "Test Random Seek Order" to run the pixel equality test.
8. **Inspect Generated Manifest**: Click "Manifest" in the header to view the live scene manifest and `motion-manifest.json`.
9. **Run Compliance Checker**: Click "Validate Generator" to run all shared and MGGD-specific tests.
10. **Publish Validated Revision**: Click "Create New Revision" in the left sidebar to generate a new immutable revision ID.
11. **Switch to Buyer Mode**: Toggle to "Buyer Mode" in the header.
12. **Customize Copy & Colors**: In the right sidebar, edit headlines, pick colors, choose from 20 Google Fonts, or upload a custom image.
13. **Reorder Scenes**: Reorder scenes using the up/down arrows or remove optional scenes.
14. **Adjust Permitted Timing**: Slide scene durations within maker limits.
15. **Select Output Resolution**: Select any of the 5 supported dimensions from the header dropdown.
16. **Export PNG Sequence**: Click "PNG Sequence", configure frame rate and range, and click "Start PNG Export" to download a ZIP package.
17. **Export Video**: Click "Export Video", check codec compatibility, and encode a `.webm` / `.mp4` video.
18. **Download Rendered Files**: Open the downloaded files to verify real motion graphic output.
