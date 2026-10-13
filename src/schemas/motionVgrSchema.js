/**
 * Motion VGR M1.0 Schema Definition & Validator
 * Adheres to Requirements 29-30:
 * Required fields: panelVersion, generatorId, generatorTypeId, 5 classification fields, motion.sizes, motion.scenes, motion.loop, motion.libraries.
 * Does NOT include geometry in the Motion VGR.
 */

export const MOTION_VGR_SCHEMA = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'MotionVgrM1',
  type: 'object',
  required: [
    'panelVersion',
    'generatorId',
    'generatorTypeId',
    'classification',
    'motion'
  ],
  properties: {
    panelVersion: { type: 'string', const: 'M1.0' },
    generatorId: { type: 'string', minLength: 3 },
    generatorTypeId: { type: 'string', minLength: 3 },
    classification: {
      type: 'object',
      required: ['category', 'subcategory', 'style', 'mood', 'industry'],
      properties: {
        category: { type: 'string' },
        subcategory: { type: 'string' },
        style: { type: 'string' },
        mood: { type: 'string' },
        industry: { type: 'string' }
      }
    },
    motion: {
      type: 'object',
      required: ['sizes', 'scenes', 'loop', 'libraries'],
      properties: {
        sizes: {
          type: 'array',
          minItems: 1,
          items: { type: 'string' }
        },
        scenes: {
          type: 'array',
          minItems: 1,
          maxItems: 8
        },
        loop: { type: 'boolean' },
        libraries: { type: 'array' }
      }
    }
  }
};

/**
 * Validates a Motion VGR JSON object
 */
export function validateMotionVgr(vgr) {
  const errors = [];

  if (!vgr) {
    return { valid: false, errors: ['Null or undefined VGR document.'] };
  }

  if (vgr.panelVersion !== 'M1.0') {
    errors.push(`panelVersion must strictly be "M1.0" (found "${vgr.panelVersion}").`);
  }

  if (!vgr.generatorId || typeof vgr.generatorId !== 'string') {
    errors.push('Missing or invalid "generatorId".');
  }

  if (!vgr.generatorTypeId || typeof vgr.generatorTypeId !== 'string') {
    errors.push('Missing or invalid "generatorTypeId".');
  }

  // 5 classification fields
  const cls = vgr.classification || {};
  const requiredCls = ['category', 'subcategory', 'style', 'mood', 'industry'];
  requiredCls.forEach((field) => {
    if (!cls[field] || typeof cls[field] !== 'string') {
      errors.push(`Classification missing required field "${field}".`);
    }
  });

  // Motion branch fields
  const motion = vgr.motion || {};
  if (!Array.isArray(motion.sizes) || motion.sizes.length === 0) {
    errors.push('"motion.sizes" must be an array of supported resolution sizes.');
  }

  if (!Array.isArray(motion.scenes) || motion.scenes.length < 1 || motion.scenes.length > 8) {
    errors.push('"motion.scenes" must contain between 1 and 8 scenes.');
  }

  if (typeof motion.loop !== 'boolean') {
    errors.push('"motion.loop" must be a boolean.');
  }

  if (!Array.isArray(motion.libraries)) {
    errors.push('"motion.libraries" must be an array.');
  }

  // Check that geometry is NOT included in Motion VGR (Req 30)
  if (vgr.geometry !== undefined || motion.geometry !== undefined) {
    errors.push('Requirement 30 Violation: Motion VGR must NOT include geometry fields.');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
