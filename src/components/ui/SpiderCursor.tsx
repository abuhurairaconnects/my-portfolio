'use client';

import React, { useEffect, useRef } from 'react';

interface Leg {
  baseOffsetX: number;
  baseOffsetY: number;
  restOffsetX: number;
  restOffsetY: number;
  seg1: number;
  seg2: number;
  group: number;
  side: number;
  kneeBias: number;
  currentX: number;
  currentY: number;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  stepProgress: number;
  isStepping: boolean;
}

export function SpiderCursor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let width = window.innerWidth || document.documentElement.clientWidth || 1280;
    let height = window.innerHeight || document.documentElement.clientHeight || 800;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const updateCanvasSize = () => {
      width = window.innerWidth || document.documentElement.clientWidth || 1280;
      height = window.innerHeight || document.documentElement.clientHeight || 800;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Initial position: center-left until mouse is touched
    let posX = width * 0.5;
    let posY = height * 0.45;
    let targetX = posX;
    let targetY = posY;
    let angle = -Math.PI / 4;
    let hasMouseMoved = false;

    // Silk dragline points
    const silkTrail: { x: number; y: number; alpha: number }[] = [];
    const MAX_SILK_POINTS = 32;

    // Pounce / startle effect on click
    let pounceTimer = 0;

    // 8 Legs with biological arachnid geometry (4 left, 4 right)
    // Sized for crisp, vivid visibility on dark backgrounds
    const legConfigs = [
      // Left Leg 1 (Front Left)
      { baseX: 7, baseY: -8, restX: 38, restY: -42, seg1: 26, seg2: 32, group: 0, side: -1, kneeBias: 1.1 },
      // Left Leg 2 (Mid-Front Left)
      { baseX: 3, baseY: -9, restX: 16, restY: -52, seg1: 25, seg2: 31, group: 1, side: -1, kneeBias: 1.0 },
      // Left Leg 3 (Mid-Back Left)
      { baseX: -3, baseY: -9, restX: -18, restY: -50, seg1: 25, seg2: 31, group: 0, side: -1, kneeBias: 1.0 },
      // Left Leg 4 (Rear Left)
      { baseX: -8, baseY: -8, restX: -46, restY: -40, seg1: 29, seg2: 36, group: 1, side: -1, kneeBias: 1.1 },

      // Right Leg 1 (Front Right)
      { baseX: 7, baseY: 8, restX: 38, restY: 42, seg1: 26, seg2: 32, group: 1, side: 1, kneeBias: 1.1 },
      // Right Leg 2 (Mid-Front Right)
      { baseX: 3, baseY: 9, restX: 16, restY: 52, seg1: 25, seg2: 31, group: 0, side: 1, kneeBias: 1.0 },
      // Right Leg 3 (Mid-Back Right)
      { baseX: -3, baseY: 9, restX: -18, restY: 50, seg1: 25, seg2: 31, group: 1, side: 1, kneeBias: 1.0 },
      // Right Leg 4 (Rear Right)
      { baseX: -8, baseY: 8, restX: -46, restY: 40, seg1: 29, seg2: 36, group: 0, side: 1, kneeBias: 1.1 },
    ];

    // Initialize legs
    const legs: Leg[] = legConfigs.map((cfg) => {
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      const wx = posX + cosA * cfg.restX - sinA * cfg.restY;
      const wy = posY + sinA * cfg.restX + cosA * cfg.restY;
      return {
        baseOffsetX: cfg.baseX,
        baseOffsetY: cfg.baseY,
        restOffsetX: cfg.restX,
        restOffsetY: cfg.restY,
        seg1: cfg.seg1,
        seg2: cfg.seg2,
        group: cfg.group,
        side: cfg.side,
        kneeBias: cfg.kneeBias,
        currentX: wx,
        currentY: wy,
        fromX: wx,
        fromY: wy,
        toX: wx,
        toY: wy,
        stepProgress: 1,
        isStepping: false,
      };
    });

    // Gait coordination
    let gaitPhase = 0;
    let stepCooldown = 0;

    // Pointer tracking with instant first-hit sync
    const updateTarget = (clientX: number, clientY: number) => {
      if (typeof clientX !== 'number' || typeof clientY !== 'number') return;
      targetX = clientX;
      targetY = clientY;

        // First cursor interaction: initialize spider trailing 84px behind the cursor
        if (!hasMouseMoved) {
          hasMouseMoved = true;
          const trailingDist = 84;
          posX = clientX - Math.cos(angle) * trailingDist;
          posY = clientY - Math.sin(angle) * trailingDist;
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
        legs.forEach((leg) => {
          const wx = posX + cosA * leg.restOffsetX - sinA * leg.restOffsetY;
          const wy = posY + sinA * leg.restOffsetX + cosA * leg.restOffsetY;
          leg.currentX = wx;
          leg.currentY = wy;
          leg.fromX = wx;
          leg.fromY = wy;
          leg.toX = wx;
          leg.toY = wy;
          leg.isStepping = false;
        });
      }
    };

    const onPointerMove = (e: MouseEvent | PointerEvent) => {
      updateTarget(e.clientX, e.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        updateTarget(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onPointerDown = () => {
      pounceTimer = 1.0;
    };

    // Attach listeners with capture across window and document
    window.addEventListener('pointermove', onPointerMove, { capture: true, passive: true });
    window.addEventListener('mousemove', onPointerMove, { capture: true, passive: true });
    window.addEventListener('mouseenter', onPointerMove, { capture: true, passive: true });
    window.addEventListener('touchmove', onTouchMove, { capture: true, passive: true });
    window.addEventListener('pointerdown', onPointerDown, { capture: true, passive: true });
    document.addEventListener('pointermove', onPointerMove, { capture: true, passive: true });
    document.addEventListener('mousemove', onPointerMove, { capture: true, passive: true });

    // Handle tab visibility
    let isTabVisible = !document.hidden;
    const onVisibilityChange = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    // 2-Bone Inverse Kinematics solver
    const solveIK = (
      bx: number,
      by: number,
      fx: number,
      fy: number,
      len1: number,
      len2: number,
      side: number,
      bias: number
    ) => {
      const dx = fx - bx;
      const dy = fy - by;
      const dist = Math.hypot(dx, dy);
      const maxReach = len1 + len2;
      const clampedDist = Math.max(3, Math.min(dist, maxReach * 0.96));

      const baseAngle = Math.atan2(dy, dx);
      const cosAngle = (len1 * len1 + clampedDist * clampedDist - len2 * len2) / (2 * len1 * clampedDist);
      const safeCos = Math.max(-1, Math.min(1, cosAngle));
      const interiorAngle = Math.acos(safeCos) * bias;
      const kneeAngle = baseAngle + side * interiorAngle;

      const kx = bx + Math.cos(kneeAngle) * len1;
      const ky = by + Math.sin(kneeAngle) * len1;

      return { kx, ky };
    };

    // Animation Loop
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      animFrameId = requestAnimationFrame(animate);

      if (!isTabVisible) return;

      const rawDt = (currentTime - lastTime) / 1000;
      const dt = Math.max(0.001, Math.min(rawDt, 0.05));
      lastTime = currentTime;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Ambient hover if mouse has never moved
      if (!hasMouseMoved) {
        const time = currentTime * 0.0008;
        targetX = width * 0.5 + Math.sin(time * 0.7) * 90;
        targetY = height * 0.45 + Math.cos(time * 0.9) * 60;
      }

      // Vector from spider to the actual mouse cursor
      const toCursorX = targetX - posX;
      const toCursorY = targetY - posY;
      const distToCursor = Math.hypot(toCursorX, toCursorY);

      // Orientation: spider always faces towards the cursor it is pursuing
      if (distToCursor > 2) {
        const directHeading = Math.atan2(toCursorY, toCursorX);
        let angleDiff = directHeading - angle;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        const turnRate = 28;
        angle += angleDiff * (1 - Math.exp(-turnRate * dt));
      }

      // The spider stays exactly 84px BEHIND the cursor so that any text, button,
      // or navigation link under the cursor remains completely clear and visible!
      const trailingDistance = 84;
      const desiredPosX = targetX - Math.cos(angle) * trailingDistance;
      const desiredPosY = targetY - Math.sin(angle) * trailingDistance;

      const toGoalX = desiredPosX - posX;
      const toGoalY = desiredPosY - posY;
      const distToGoal = Math.hypot(toGoalX, toGoalY);

      // Critically damped pursuit without dead-zone:
      // High responsiveness: instantly tracks the trailing position with silky smooth ease
      const followRate = distToGoal > 150 ? 32 : 24;
      const followFactor = 1 - Math.exp(-followRate * dt);

      const prevX = posX;
      const prevY = posY;

      posX += toGoalX * followFactor;
      posY += toGoalY * followFactor;

      const frameDeltaX = posX - prevX;
      const frameDeltaY = posY - prevY;
      const currentSpeed = Math.hypot(frameDeltaX, frameDeltaY) / dt;

      // Decrement pounce timer
      if (pounceTimer > 0) {
        pounceTimer = Math.max(0, pounceTimer - dt * 3.0);
      }

      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);

      // Silk dragline trailing from spinneret
      const spinneretX = posX - cosA * 22;
      const spinneretY = posY - sinA * 22;

      if (
        silkTrail.length === 0 ||
        Math.hypot(spinneretX - silkTrail[0].x, spinneretY - silkTrail[0].y) > 12
      ) {
        silkTrail.unshift({ x: spinneretX, y: spinneretY, alpha: 0.45 });
        if (silkTrail.length > MAX_SILK_POINTS) {
          silkTrail.pop();
        }
      }

      // Render glowing silk dragline
      if (silkTrail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(spinneretX, spinneretY);
        for (let i = 0; i < silkTrail.length; i++) {
          silkTrail[i].alpha = Math.max(0, silkTrail[i].alpha - dt * (currentSpeed > 300 ? 0.35 : 0.08));
          ctx.lineTo(silkTrail[i].x, silkTrail[i].y);
        }
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.28)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // Gait coordination & Step timing
      stepCooldown -= dt;

      // Leg step frequency increases dynamically with speed
      const stepDuration = Math.max(0.035, 0.13 - Math.min(0.095, currentSpeed * 0.00015));

      if (stepCooldown <= 0) {
        gaitPhase = 1 - gaitPhase;
        stepCooldown = stepDuration;
      }

      // Process and render legs
      legs.forEach((leg) => {
        const baseWorldX = posX + cosA * leg.baseOffsetX - sinA * leg.baseOffsetY;
        const baseWorldY = posY + sinA * leg.baseOffsetX + cosA * leg.baseOffsetY;

        const lead = currentSpeed > 40 ? 0.04 : 0;
        const leadX = frameDeltaX * (lead / dt);
        const leadY = frameDeltaY * (lead / dt);

        const idealFootX = posX + cosA * leg.restOffsetX - sinA * leg.restOffsetY + leadX;
        const idealFootY = posY + sinA * leg.restOffsetX + cosA * leg.restOffsetY + leadY;

        const footDistToIdeal = Math.hypot(idealFootX - leg.currentX, idealFootY - leg.currentY);

        const stepThreshold = currentSpeed > 100 ? 14 : 7;
        const emergencyThreshold = 36;

        if (footDistToIdeal > 55) {
          leg.isStepping = false;
          leg.currentX = idealFootX;
          leg.currentY = idealFootY;
          leg.fromX = idealFootX;
          leg.fromY = idealFootY;
          leg.toX = idealFootX;
          leg.toY = idealFootY;
          leg.stepProgress = 1;
        } else if (!leg.isStepping) {
          if ((leg.group === gaitPhase && footDistToIdeal > stepThreshold) || footDistToIdeal > emergencyThreshold) {
            leg.isStepping = true;
            leg.stepProgress = 0;
            leg.fromX = leg.currentX;
            leg.fromY = leg.currentY;
            leg.toX = idealFootX;
            leg.toY = idealFootY;
          }
        }

        if (leg.isStepping) {
          leg.stepProgress += dt / stepDuration;
          leg.toX = idealFootX;
          leg.toY = idealFootY;

          if (leg.stepProgress >= 1) {
            leg.stepProgress = 1;
            leg.isStepping = false;
            leg.currentX = leg.toX;
            leg.currentY = leg.toY;
          } else {
            const stepT = leg.stepProgress;
            const ease = stepT * stepT * (3 - 2 * stepT);
            leg.currentX = leg.fromX + (leg.toX - leg.fromX) * ease;
            leg.currentY = leg.fromY + (leg.toY - leg.fromY) * ease;
          }
        }

        const { kx, ky } = solveIK(
          baseWorldX,
          baseWorldY,
          leg.currentX,
          leg.currentY,
          leg.seg1,
          leg.seg2,
          leg.side,
          leg.kneeBias
        );

        // 3D Depth Shadow on the glass surface
        const liftHeight = leg.isStepping ? Math.sin(leg.stepProgress * Math.PI) * 8 : 0;
        const shadowOffsetY = 4 + liftHeight;
        ctx.beginPath();
        ctx.moveTo(baseWorldX, baseWorldY + shadowOffsetY);
        ctx.lineTo(kx, ky + shadowOffsetY);
        ctx.lineTo(leg.currentX, leg.currentY + shadowOffsetY * 0.4);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.65)';
        ctx.lineWidth = 2.0;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Upper Femur Segment (Distinct silver-slate chitin with high visibility)
        ctx.beginPath();
        ctx.moveTo(baseWorldX, baseWorldY);
        ctx.lineTo(kx, ky);
        ctx.strokeStyle = '#323E56';
        ctx.lineWidth = 3.6;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Femur highlight stripe (crisp contrast against dark background)
        ctx.beginPath();
        ctx.moveTo(baseWorldX, baseWorldY);
        ctx.lineTo(kx, ky);
        ctx.strokeStyle = '#5A6F98';
        ctx.lineWidth = 1.6;
        ctx.stroke();

        // Lower Tibia Segment (Arched claw reaching ground)
        ctx.beginPath();
        ctx.moveTo(kx, ky);
        ctx.lineTo(leg.currentX, leg.currentY);
        ctx.strokeStyle = '#222B3D';
        ctx.lineWidth = 2.8;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Luminous Emerald Knee Joint (radiant glowing node)
        ctx.save();
        ctx.shadowColor = '#10B981';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(kx, ky, 2.6, 0, Math.PI * 2);
        ctx.fillStyle = '#10B981';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(kx, ky, 1.4, 0, Math.PI * 2);
        ctx.fillStyle = '#A7F3D0';
        ctx.fill();
        ctx.restore();

        // Tarsal Claw Tip (sharp bright emerald contact point)
        ctx.beginPath();
        ctx.arc(leg.currentX, leg.currentY, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = '#34D399';
        ctx.fill();
      });

      // Render Spider Body (Cephalothorax + Abdomen + Glowing Optics + Feelers)
      ctx.save();
      ctx.translate(posX, posY);
      ctx.rotate(angle);

      // Body Ambient Drop Shadow
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 6;

      // Abdomen (Opisthosoma) - rear egg-shaped bulb with breathing
      const breathe = Math.sin(currentTime * 0.004) * 0.9;
      ctx.beginPath();
      ctx.ellipse(-14, 0, 15 + breathe, 11 + breathe * 0.6, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#18202D';
      ctx.fill();
      ctx.restore();

      // Abdomen outer architectural chitin rim (clear contrast)
      ctx.beginPath();
      ctx.ellipse(-14, 0, 15 + breathe, 11 + breathe * 0.6, 0, 0, Math.PI * 2);
      ctx.strokeStyle = '#415273';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Dorsal Bio-Mechanical Luminescent Emerald Chevrons on Abdomen
      ctx.save();
      ctx.shadowColor = '#10B981';
      ctx.shadowBlur = 8;

      ctx.beginPath();
      ctx.moveTo(-23, 0);
      ctx.lineTo(-7, 0);
      ctx.strokeStyle = '#34D399';
      ctx.lineWidth = 2.0;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Lateral luminous chevrons
      ctx.beginPath();
      ctx.moveTo(-19, -5);
      ctx.lineTo(-14, 0);
      ctx.lineTo(-19, 5);
      ctx.moveTo(-13, -6);
      ctx.lineTo(-8, 0);
      ctx.lineTo(-13, 6);
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.85)';
      ctx.lineWidth = 1.6;
      ctx.stroke();
      ctx.restore();

      // Pedicel (waist connecting abdomen and cephalothorax)
      ctx.beginPath();
      ctx.rect(-3.5, -3, 3.5, 6);
      ctx.fillStyle = '#10151E';
      ctx.fill();

      // Cephalothorax (Prosoma: armored head and thorax plate)
      ctx.beginPath();
      ctx.ellipse(7, 0, 10, 8.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#222C3E';
      ctx.fill();
      ctx.strokeStyle = '#4B5E83';
      ctx.lineWidth = 1.6;
      ctx.stroke();

      // Carapace center ridge
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(12, 0);
      ctx.strokeStyle = '#384763';
      ctx.lineWidth = 1.4;
      ctx.stroke();

      // Pedipalps (front sensory feelers with live twitching)
      const palpTwitch = Math.sin(currentTime * 0.009) * 0.22;
      // Left pedipalp
      ctx.beginPath();
      ctx.moveTo(13, -4);
      ctx.lineTo(20, -7.5 + palpTwitch * 3.5);
      ctx.lineTo(24, -5.5 + palpTwitch * 4.5);
      ctx.strokeStyle = '#5A6F96';
      ctx.lineWidth = 2.2;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Right pedipalp
      ctx.beginPath();
      ctx.moveTo(13, 4);
      ctx.lineTo(20, 7.5 - palpTwitch * 3.5);
      ctx.lineTo(24, 5.5 - palpTwitch * 4.5);
      ctx.strokeStyle = '#5A6F96';
      ctx.lineWidth = 2.2;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Chelicerae & Fangs
      ctx.beginPath();
      ctx.moveTo(12, -2.5);
      ctx.lineTo(16, -1.8);
      ctx.moveTo(12, 2.5);
      ctx.lineTo(16, 1.8);
      ctx.strokeStyle = '#121822';
      ctx.lineWidth = 2.6;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Radiant Glowing Compound Optics (8 Arachnid Eyes in Emerald Noir)
      ctx.save();
      ctx.shadowColor = '#10B981';
      ctx.shadowBlur = 12;

      // Anterior Median Eyes (AME) - two large primary forward lenses
      ctx.beginPath();
      ctx.arc(13.5, -2.2, 2.0, 0, Math.PI * 2);
      ctx.arc(13.5, 2.2, 2.0, 0, Math.PI * 2);
      ctx.fillStyle = '#6EE7B7';
      ctx.fill();

      // Anterior Lateral Eyes (ALE)
      ctx.beginPath();
      ctx.arc(12.0, -4.6, 1.4, 0, Math.PI * 2);
      ctx.arc(12.0, 4.6, 1.4, 0, Math.PI * 2);
      ctx.fillStyle = '#34D399';
      ctx.fill();

      // Posterior Crown Eyes (4 secondary optics)
      ctx.beginPath();
      ctx.arc(9.8, -3.0, 1.1, 0, Math.PI * 2);
      ctx.arc(9.8, 3.0, 1.1, 0, Math.PI * 2);
      ctx.arc(8.6, -5.2, 1.1, 0, Math.PI * 2);
      ctx.arc(8.6, 5.2, 1.1, 0, Math.PI * 2);
      ctx.fillStyle = '#10B981';
      ctx.fill();

      ctx.restore();
      ctx.restore();
      ctx.restore();
    };

    animFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', updateCanvasSize);
      window.removeEventListener('pointermove', onPointerMove, { capture: true });
      window.removeEventListener('mousemove', onPointerMove, { capture: true });
      window.removeEventListener('mouseenter', onPointerMove, { capture: true });
      window.removeEventListener('touchmove', onTouchMove, { capture: true });
      window.removeEventListener('pointerdown', onPointerDown, { capture: true });
      document.removeEventListener('pointermove', onPointerMove, { capture: true });
      document.removeEventListener('mousemove', onPointerMove, { capture: true });
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30 overflow-hidden mix-blend-screen"
      aria-hidden="true"
    />
  );
}
