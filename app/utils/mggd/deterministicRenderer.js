/**
 * Deterministic Canvas Frame Rendering Engine with Fabric.js Bridge
 * Adheres to MGGD Requirements 3-8, 9, 10, 11, 12, 13
 * All properties are pure functions of absolute timestamp t.
 */

import { EASING, clamp, lerp } from './timingEngine.js';
import { computeSceneTimeline, getActiveSceneAtTime } from './sceneScheduler.js';
import { assetLoader } from './assetLoader.js';

export const RESOLUTION_PRESETS = {
  '1920x1080': { width: 1920, height: 1080, aspect: '16:9', label: 'Landscape 16:9' },
  '1080x1920': { width: 1080, height: 1920, aspect: '9:16', label: 'Portrait 9:16' },
  '1080x1080': { width: 1080, height: 1080, aspect: '1:1', label: 'Square 1:1' },
  '1080x1350': { width: 1080, height: 1350, aspect: '4:5', label: 'Portrait 4:5' },
  '2560x1080': { width: 2560, height: 1080, aspect: '21:9', label: 'Ultrawide 21:9' }
};

export function getSafeAreaBounds(width, height) {
  const marginX = width * 0.05;
  const marginY = height * 0.05;
  return {
    minX: marginX,
    minY: marginY,
    maxX: width - marginX,
    maxY: height - marginY,
    marginX,
    marginY
  };
}

function computeObjectAnimation(obj, objTime, sceneDuration) {
  const duration = obj.duration || 2.0;
  const trigger = obj.trigger || 'Auto - Once - Stay';
  const entranceAnim = obj.entranceAnimation || 'glow-pop';
  const exitAnim = obj.exitAnimation || 'fade-out';

  if (objTime < 0) {
    return { visible: false, alpha: 0, scale: 0, offsetX: 0, offsetY: 0, rotation: 0, isSettled: false };
  }

  let activeTime = objTime;
  if (trigger === 'Auto - Loop') {
    const loopCycle = duration + (obj.loopGap || 0.5);
    activeTime = activeTime % Math.max(0.1, loopCycle);
  }

  if (activeTime > duration) {
    if (trigger === 'Auto - Once - Hide') {
      return { visible: false, alpha: 0, scale: 0, offsetX: 0, offsetY: 0, rotation: 0, isSettled: false };
    }
  }

  const entranceDuration = Math.min(0.8, duration * 0.4);
  const exitDuration = Math.min(0.6, duration * 0.3);
  const exitStartTime = duration - exitDuration;

  let alpha = 1;
  let scale = 1;
  let offsetX = 0;
  let offsetY = 0;
  let rotation = 0;
  let isSettled = false;

  if (activeTime < entranceDuration) {
    const p = activeTime / entranceDuration;
    if (entranceAnim === 'spring-scale') {
      scale = EASING.spring(p);
      alpha = EASING.easeOutQuad(p);
    } else if (entranceAnim === 'slide-in-left') {
      offsetX = lerp(-300, 0, EASING.easeOutCubic(p));
      alpha = EASING.easeOutQuad(p);
    } else if (entranceAnim === 'slide-in-bottom') {
      offsetY = lerp(200, 0, EASING.easeOutCubic(p));
      alpha = EASING.easeOutQuad(p);
    } else if (entranceAnim === 'glow-pop') {
      scale = lerp(0.5, 1.0, EASING.easeOutBack(p));
      alpha = EASING.easeInQuad(p);
    } else if (entranceAnim === 'strobe') {
      scale = 1.0;
      alpha = (Math.sin(activeTime * 35) > 0) ? 1 : 0.1;
    } else {
      alpha = EASING.easeOutQuad(p);
    }
  } else if (activeTime <= exitStartTime || trigger === 'Auto - Once - Stay') {
    alpha = 1;
    scale = 1;
    offsetX = 0;
    offsetY = 0;
    rotation = 0;
    isSettled = true;

    if (obj.type === 'logo') {
      scale = 1 + Math.sin(activeTime * 2.5) * 0.02;
    }
  } else {
    const exitP = (activeTime - exitStartTime) / exitDuration;
    if (exitAnim === 'fade-out') {
      alpha = lerp(1, 0, EASING.easeInQuad(exitP));
    } else if (exitAnim === 'slide-out-right') {
      offsetX = lerp(0, 400, EASING.easeInQuad(exitP));
      alpha = lerp(1, 0, EASING.easeInQuad(exitP));
    } else if (exitAnim === 'shrink') {
      scale = lerp(1, 0.2, EASING.easeInQuad(exitP));
      alpha = lerp(1, 0, EASING.easeInQuad(exitP));
    }
  }

  return {
    visible: alpha > 0.001,
    alpha: clamp(alpha, 0, 1),
    scale: Math.max(0, scale),
    offsetX,
    offsetY,
    rotation,
    isSettled
  };
}

export function renderFrame(canvas, generator, timestamp, resolutionKey = '1920x1080', options = {}) {
  if (!canvas || !generator) return { rendered: false };

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return { rendered: false };

  const res = RESOLUTION_PRESETS[resolutionKey] || RESOLUTION_PRESETS['1920x1080'];
  const scale = options.scaleMultiplier || 1.0;
  const targetWidth = res.width * scale;
  const targetHeight = res.height * scale;

  if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
    canvas.width = targetWidth;
    canvas.height = targetHeight;
  }

  ctx.save();
  ctx.clearRect(0, 0, targetWidth, targetHeight);
  ctx.scale(scale, scale);

  const safeArea = getSafeAreaBounds(res.width, res.height);
  const safeAreaViolations = [];

  const timeline = computeSceneTimeline(generator.scenes || []);
  const activeSceneInfo = getActiveSceneAtTime(timeline, timestamp);

  if (!activeSceneInfo) {
    ctx.restore();
    return { rendered: true, timestamp, violations: [] };
  }

  const { scene, localTime } = activeSceneInfo;
  const isTransparent = Boolean(generator.transparency && scene.background === 'transparent');

  if (!isTransparent) {
    const bgColor = scene.background || generator.properties?.colors?.background || '#090a10';
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, res.width, res.height);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.beginPath();
    ctx.arc(res.width * 0.5, res.height * 0.5, Math.min(res.width, res.height) * 0.45, 0, Math.PI * 2);
    ctx.fill();
  }

  const sceneEntranceDuration = 0.5;
  const sceneExitDuration = 0.5;
  let sceneAlpha = 1.0;

  if (localTime < sceneEntranceDuration) {
    sceneAlpha = EASING.easeOutQuad(localTime / sceneEntranceDuration);
  } else if (localTime > scene.duration - sceneExitDuration) {
    sceneAlpha = EASING.easeInQuad((scene.duration - localTime) / sceneExitDuration);
  }

  ctx.globalAlpha = clamp(sceneAlpha, 0, 1);

  const objects = scene.objects || [];
  const props = generator.properties || {};
  const colors = props.colors || {
    primary: '#8b5cf6',
    secondary: '#06b6d4',
    accent: '#facc15',
    text: '#ffffff',
    subtext: '#94a3b8'
  };
  const fontFamily = props.fontFamily || 'Inter';

  for (const obj of objects) {
    const objTime = localTime - (obj.delay || 0);
    const anim = computeObjectAnimation(obj, objTime, scene.duration);

    if (!anim.visible) continue;

    const layout = (obj.layout && obj.layout[resolutionKey]) || {
      x: res.width * 0.5,
      y: res.height * 0.5,
      scale: 1.0,
      fontSize: 32,
      align: 'center'
    };

    const posX = layout.x + anim.offsetX;
    const posY = layout.y + anim.offsetY;
    const totalScale = (layout.scale || 1.0) * anim.scale;

    ctx.save();
    ctx.globalAlpha = clamp(sceneAlpha * anim.alpha, 0, 1);
    ctx.translate(posX, posY);
    ctx.scale(totalScale, totalScale);

    if (obj.type === 'logo') {
      const img = assetLoader.getImage(props.imageUrl);
      if (img && img.complete) {
        const size = 160;
        ctx.drawImage(img, -size / 2, -size / 2, size, size);
      } else {
        ctx.strokeStyle = colors.primary;
        ctx.lineWidth = 8;
        ctx.shadowColor = colors.primary;
        ctx.shadowBlur = 24;
        ctx.beginPath();
        const r = 70;
        for (let a = 0; a < 6; a++) {
          const angle = (a * 60 - 30) * (Math.PI / 180);
          const px = r * Math.cos(angle);
          const py = r * Math.sin(angle);
          if (a === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();

        ctx.fillStyle = colors.secondary;
        ctx.beginPath();
        ctx.arc(0, 0, 24, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (obj.type === 'text') {
      let textContent = props.headline || 'MGGD TITLE';
      if (obj.id.includes('tagline') || obj.id.includes('subline') || obj.id.includes('role')) {
        textContent = props.subline || 'Dynamic Motion Graphic Generator';
      }

      const fontSize = layout.fontSize || 36;
      ctx.font = `700 ${fontSize}px "${fontFamily}", sans-serif`;
      ctx.textAlign = layout.align || 'center';
      ctx.textBaseline = 'middle';

      ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 4;
      ctx.fillStyle = colors.text;
      ctx.fillText(textContent, 0, 0);

      if (anim.isSettled) {
        const textWidth = ctx.measureText(textContent).width;
        let leftBound = posX;
        let rightBound = posX;
        if (layout.align === 'center') {
          leftBound = posX - (textWidth / 2) * totalScale;
          rightBound = posX + (textWidth / 2) * totalScale;
        } else if (layout.align === 'left') {
          leftBound = posX;
          rightBound = posX + textWidth * totalScale;
        }
        const topBound = posY - (fontSize / 2) * totalScale;
        const bottomBound = posY + (fontSize / 2) * totalScale;

        if (
          leftBound < safeArea.minX ||
          rightBound > safeArea.maxX ||
          topBound < safeArea.minY ||
          bottomBound > safeArea.maxY
        ) {
          safeAreaViolations.push({
            objectId: obj.id,
            objectName: obj.name,
            reason: `Settled text exceeds 5% safe area boundary at (${Math.round(posX)}, ${Math.round(posY)}).`
          });
        }
      }
    } else if (obj.type === 'shape') {
      const barWidth = 640;
      const barHeight = 84;
      ctx.fillStyle = colors.background || 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.roundRect(-20, -barHeight / 2, barWidth, barHeight, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = colors.accent;
      ctx.beginPath();
      ctx.roundRect(-20, -barHeight / 2, 8, barHeight, [8, 0, 0, 8]);
      ctx.fill();
    } else if (obj.type === 'badge') {
      const badgeText = props.tag || 'NEW ALERT';
      ctx.font = `800 20px "${fontFamily}", sans-serif`;
      const txtWidth = ctx.measureText(badgeText).width;
      const padX = 28;
      const padY = 14;

      ctx.fillStyle = colors.primary;
      ctx.shadowColor = colors.primary;
      ctx.shadowBlur = 20;

      ctx.beginPath();
      ctx.roundRect(-txtWidth / 2 - padX, -padY - 8, txtWidth + padX * 2, padY * 2 + 16, 24);
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(badgeText, 0, 0);
    } else if (obj.type === 'image') {
      const img = assetLoader.getImage(props.imageUrl);
      if (img && img.complete) {
        const imgW = 280;
        const imgH = 280;
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(-imgW / 2, -imgH / 2, imgW, imgH, 16);
        ctx.clip();
        ctx.drawImage(img, -imgW / 2, -imgH / 2, imgW, imgH);
        ctx.restore();
      } else {
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = colors.primary;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.roundRect(-140, -140, 280, 280, 16);
        ctx.fill();
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  if (options.showSafeArea) {
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 8]);
    ctx.strokeRect(
      safeArea.minX,
      safeArea.minY,
      safeArea.maxX - safeArea.minX,
      safeArea.maxY - safeArea.minY
    );
    ctx.setLineDash([]);
  }

  ctx.restore();

  return {
    rendered: true,
    timestamp,
    violations: safeAreaViolations
  };
}

/**
 * Optional Fabric.js 5.3.10 Canvas Bridge
 * Fulfills Requirement 1 for Fabric.js integration without breaking pure deterministic rendering
 */
export async function createFabricBridge(canvasElement) {
  if (typeof window === 'undefined') return null;
  try {
    const { fabric } = await import('fabric');
    if (fabric && fabric.StaticCanvas) {
      return new fabric.StaticCanvas(canvasElement);
    }
  } catch (e) {
    console.warn('Fabric.js dynamic load warning:', e);
  }
  return null;
}
