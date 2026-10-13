/**
 * Motion Manifest Schema Validator
 * Adheres to Requirement 19: default, min, max, and total duration values.
 */

export function validateMotionManifest(manifest) {
  const errors = [];

  if (!manifest) {
    return { valid: false, errors: ['Manifest is empty or undefined.'] };
  }

  if (manifest.panelVersion !== 'M1.0') {
    errors.push(`Manifest panelVersion must be 'M1.0'`);
  }

  if (manifest.executionBranch !== 'Motion') {
    errors.push(`Manifest executionBranch must be 'Motion'`);
  }

  const timing = manifest.timing || {};
  if (typeof timing.currentTotalDuration !== 'number' || timing.currentTotalDuration < 1.0 || timing.currentTotalDuration > 60.0) {
    errors.push('Total duration must be a number between 1.0 and 60.0 seconds.');
  }

  if (typeof timing.maxPossibleDuration !== 'number' || timing.maxPossibleDuration > 60.0) {
    errors.push('Sum of maximum scene durations must not exceed 60.0 seconds.');
  }

  if (!Array.isArray(manifest.scenes) || manifest.scenes.length < 1 || manifest.scenes.length > 8) {
    errors.push('Manifest must specify between 1 and 8 scenes.');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
