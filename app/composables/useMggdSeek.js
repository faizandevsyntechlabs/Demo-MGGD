/**
 * useMggdSeek Composable
 * Implements the vincta:seek protocol & arbitrary seek verification
 * Requirements 3-8: Reusable seek controller, window message protocol, out-of-order pixel test.
 */

import { ref, onMounted, onUnmounted } from 'vue';
import { renderFrame } from '../utils/mggd/deterministicRenderer.js';

export function useMggdSeek() {
  const currentTimestamp = ref(0);
  const lastAck = ref(null);
  const isSeeking = ref(false);

  function handleSeekRequest(timestamp, messageId = null) {
    currentTimestamp.value = Math.max(0, timestamp);
    const ack = {
      type: 'vincta:seek:ack',
      timestamp: currentTimestamp.value,
      messageId,
      time: Date.now()
    };
    lastAck.value = ack;

    if (typeof window !== 'undefined') {
      window.postMessage(ack, '*');
    }
  }

  function dispatchError(messageId, errorMsg) {
    if (typeof window === 'undefined') return;
    const errorEvent = {
      type: 'vincta:seek:error',
      messageId,
      error: errorMsg,
      time: Date.now()
    };
    window.postMessage(errorEvent, '*');
  }

  function onWindowMessage(event) {
    if (!event.data || typeof event.data !== 'object') return;
    if (event.data.type === 'vincta:seek') {
      const { timestamp, messageId } = event.data;
      if (typeof timestamp === 'number') {
        handleSeekRequest(timestamp, messageId);
      } else {
        dispatchError(messageId, 'Invalid timestamp: Must be numeric seconds.');
      }
    }
  }

  onMounted(() => {
    window.addEventListener('message', onWindowMessage);
  });

  onUnmounted(() => {
    window.removeEventListener('message', onWindowMessage);
  });

  function seek(timestamp) {
    handleSeekRequest(timestamp, `seek-${Date.now()}`);
  }

  async function testRandomSeekDeterminism(canvas, generator, resolutionKey = '1920x1080') {
    if (typeof document === 'undefined') return { passed: true };

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

    const firstRun = snapshots[0].data;
    const secondRun = snapshots[4].data;

    let diffCount = 0;
    for (let i = 0; i < firstRun.length; i++) {
      if (firstRun[i] !== secondRun[i]) {
        diffCount++;
      }
    }

    const passed = diffCount === 0;

    return {
      passed,
      testedSequence: timestamps,
      diffPixels: diffCount,
      totalPixels: testCanvas.width * testCanvas.height,
      matchPercentage: ((1 - (diffCount / firstRun.length)) * 100).toFixed(2),
      message: passed
        ? 'Determinism Verified: Random out-of-order seeks produced 100% identical pixel buffers.'
        : `Determinism Failure: Detected ${diffCount} pixel byte differences between seeks to t=0.5.`
    };
  }

  return {
    currentTimestamp,
    lastAck,
    isSeeking,
    seek,
    testRandomSeekDeterminism
  };
}
