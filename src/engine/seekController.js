/**
 * Seek Controller & vincta:seek Protocol Implementation
 * Requirements 3-8: Reusable seek controller, window message protocol, out-of-order pixel determinism test.
 */

import { renderFrame } from './deterministicRenderer.js';

class SeekController {
  constructor() {
    this.currentTimestamp = 0;
    this.lastAck = null;
    this.listeners = new Set();
    this.isSeeking = false;
    this.setupWindowListener();
  }

  /**
   * Sets up window message listener for 'vincta:seek'
   */
  setupWindowListener() {
    if (typeof window === 'undefined') return;

    window.addEventListener('message', (event) => {
      if (!event.data || typeof event.data !== 'object') return;
      if (event.data.type === 'vincta:seek') {
        const { timestamp, messageId } = event.data;
        if (typeof timestamp === 'number') {
          this.handleSeekRequest(timestamp, messageId);
        } else {
          this.dispatchError(messageId, 'Invalid timestamp: Must be numeric seconds.');
        }
      }
    });
  }

  handleSeekRequest(timestamp, messageId = null) {
    this.currentTimestamp = Math.max(0, timestamp);
    const ack = {
      type: 'vincta:seek:ack',
      timestamp: this.currentTimestamp,
      messageId,
      time: Date.now()
    };
    this.lastAck = ack;

    // Post ack back to window
    if (typeof window !== 'undefined') {
      window.postMessage(ack, '*');
    }

    // Notify registered subscribers
    this.notifySubscribers(this.currentTimestamp, ack);
  }

  dispatchError(messageId, errorMsg) {
    const errorEvent = {
      type: 'vincta:seek:error',
      messageId,
      error: errorMsg,
      time: Date.now()
    };
    if (typeof window !== 'undefined') {
      window.postMessage(errorEvent, '*');
    }
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifySubscribers(timestamp, ack) {
    this.listeners.forEach((cb) => cb(timestamp, ack));
  }

  /**
   * Programmatic seek triggering (emulates vincta:seek internally)
   */
  seek(timestamp) {
    this.handleSeekRequest(timestamp, `seek-${Date.now()}`);
  }

  /**
   * Runs Out-of-Order Seek Determinism Verification Test
   * Renders frames in non-linear order: [0.5, 2.0, 0.0, 1.2, 0.5]
   * Compares the pixel buffer of the two seeks to t=0.5
   * Requirement 8: Random seek order pixel test
   */
  async testRandomSeekDeterminism(canvas, generator, resolutionKey = '1920x1080') {
    const testCanvas = document.createElement('canvas');
    testCanvas.width = 320;
    testCanvas.height = 180;

    const timestamps = [0.5, 2.2, 0.0, 1.4, 0.5];
    const snapshots = [];

    for (const t of timestamps) {
      renderFrame(testCanvas, generator, t, resolutionKey, { scaleMultiplier: 320 / 1920 });
      const ctx = testCanvas.getContext('2d', { willReadFrequently: true });
      const imgData = ctx.getImageData(0, 0, testCanvas.width, testCanvas.height);
      snapshots.push({ time: t, data: new Uint8ClampedArray(imgData.data) });
    }

    // Compare first seek at t=0.5 (index 0) and final seek at t=0.5 (index 4)
    const firstRun = snapshots[0].data;
    const secondRun = snapshots[4].data;

    let diffCount = 0;
    for (let i = 0; i < firstRun.length; i++) {
      if (firstRun[i] !== secondRun[i]) {
        diffCount++;
      }
    }

    const totalPixels = testCanvas.width * testCanvas.height;
    const passed = diffCount === 0;

    return {
      passed,
      testedSequence: timestamps,
      diffPixels: diffCount,
      totalPixels,
      matchPercentage: ((1 - (diffCount / firstRun.length)) * 100).toFixed(2),
      message: passed
        ? 'Determinism Verified: Random out-of-order seeks produced 100% identical pixel buffers.'
        : `Determinism Failure: Detected ${diffCount} pixel byte differences between first and second seek to t=0.5.`
    };
  }
}

export const seekController = new SeekController();
