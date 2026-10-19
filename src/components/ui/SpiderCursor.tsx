'use client';

import React, { useEffect, useRef } from 'react';

interface Leg {
  // Base offset relative to body center in unrotated body space
  baseOffsetX: number;
  baseOffsetY: number;
  // Natural rest offset relative to body center in unrotated body space
  restOffsetX: number;
  restOffsetY: number;
  // Segment lengths: [femur, tibia]
  seg1: number;
  seg2: number;
  // Gait group: 0 or 1 for alternating tetrapod locomotion
  group: number;
  // Side: -1 for left, 1 for right
  side: number;
  // Knee outward bias factor
  kneeBias: number;
  // Current world position of the foot (planted or in transit)
  currentX: number;
  currentY: number;
  // Step interpolation state
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  stepProgress: number; // 0 to 1
  isStepping: boolean;
}

export function SpiderCursor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Respect user's accessibility preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const updateCanvasSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Initial position: center-left
    let posX = width * 0.45;
    let posY = height * 0.45;
    let targetX = posX;
    let targetY = posY;
    let velX = 0;
    let velY = 0;
    let angle = -Math.PI / 4;
    let targetAngle = angle;
    let hasMouseMoved = false;

    // Silk dragline points
    const silkTrail: { x: number; y: number; alpha: number }[] = [];
    const MAX_SILK_POINTS = 36;

    // Click reaction impulse
    let pounceTimer = 0;

    // 8 Legs with biological arachnid geometry (4 left, 4 right)
    // Scaled for crisp visibility on obsidian noir background
    // Group 0 and Group 1 alternate in classic arachnid metachronal gait
    const legConfigs = [
      // Left Leg 1 (Front Left: reaching forward-left)
      { baseX: 6, baseY: -7, restX: 34, restY: -38, seg1: 24, seg2: 30, group: 0, side: -1, kneeBias: 1.1 },
      // Left Leg 2 (Mid-Front Left: reaching out-left)
      { baseX: 3, baseY: -8, restX: 14, restY: -48, seg1: 23, seg2: 29, group: 1, side: -1, kneeBias: 1.0 },
      // Left Leg 3 (Mid-Back Left: reaching out-back-left)
      { baseX: -3, baseY: -8, restX: -16, restY: -46, seg1: 23, seg2: 29, group: 0, side: -1, kneeBias: 1.0 },
      // Left Leg 4 (Rear Left: reaching far back-left)
      { baseX: -7, baseY: -7, restX: -42, restY: -36, seg1: 27, seg2: 33, group: 1, side: -1, kneeBias: 1.1 },

      // Right Leg 1 (Front Right: reaching forward-right)
      { baseX: 6, baseY: 7, restX: 34, restY: 38, seg1: 24, seg2: 30, group: 1, side: 1, kneeBias: 1.1 },
      // Right Leg 2 (Mid-Front Right: reaching out-right)
      { baseX: 3, baseY: 8, restX: 14, restY: 48, seg1: 23, seg2: 29, group: 0, side: 1, kneeBias: 1.0 },
      // Right Leg 3 (Mid-Back Right: reaching out-back-right)
      { baseX: -3, baseY: 8, restX: -16, restY: 46, seg1: 23, seg2: 29, group: 1, side: 1, kneeBias: 1.0 },
      // Right Leg 4 (Rear Right: reaching far back-right)
      { baseX: -7, baseY: 7, restX: -42, restY: 36, seg1: 27, seg2: 33, group: 0, side: 1, kneeBias: 1.1 },
    ];

    // Initialize legs at their resting footprint
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

    // Mouse & Touch listeners
    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      hasMouseMoved = true;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        targetX = e.touches[0].clientX;
        targetY = e.touches[0].clientY;
        hasMouseMoved = true;
      }
    };

    const onPointerDown = () => {
      // Agitated pounce / startled jump impulse
      pounceTimer = 1.0;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });

    // Handle tab visibility to pause loop
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

      // Angle from base to foot
      const baseAngle = Math.atan2(dy, dx);

      // Cosine rule for angle at base joint
      const cosAngle = (len1 * len1 + clampedDist * clampedDist - len2 * len2) / (2 * len1 * clampedDist);
      const safeCos = Math.max(-1, Math.min(1, cosAngle));
      const interiorAngle = Math.acos(safeCos) * bias;

      // Outward knee protrusion
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

      const dt = Math.min((currentTime - lastTime) / 1000, 0.05);
      lastTime = currentTime;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Gentle ambient hover motion when mouse hasn't moved yet
      if (!hasMouseMoved) {
        const time = currentTime * 0.0008;
        targetX = width * 0.5 + Math.sin(time * 0.7) * 110;
        targetY = height * 0.45 + Math.cos(time * 0.9) * 80;
      }

      // Distance to target
      const toMouseX = targetX - posX;
      const toMouseY = targetY - posY;
      const distToTarget = Math.hypot(toMouseX, toMouseY);

      // Instant / super-fast heading alignment
      if (distToTarget > 6) {
        targetAngle = Math.atan2(toMouseY, toMouseX);
      }

      let angleDiff = targetAngle - angle;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      // High-speed responsiveness: turns instantly when far away
      const turnSpeed = distToTarget > 140 ? 36.0 : 22.0;
      angle += angleDiff * Math.min(1, turnSpeed * dt);

      // Super responsive speed curve:
      // When user moves mouse across the screen, the spider immediately rushes at turbo speed!
      const stopDistance = 22; // snug right near cursor
      let speed = 0;

      if (distToTarget > stopDistance) {
        const moveDist = distToTarget - stopDistance;
        // Scales proportionally with distance up to 4200 px/s so it keeps up instantly
        speed = Math.min(4200, moveDist * 14 + 220);
      }

      if (pounceTimer > 0) {
        pounceTimer = Math.max(0, pounceTimer - dt * 3.0);
      }

      // Desired velocity vector
      // At larger distances, blend directly towards the target for immediate interception
      const directAngle = Math.atan2(toMouseY, toMouseX);
      const headingBlend = distToTarget > 140 ? 0.4 : 0.05;
      const moveAngle = angle * (1 - headingBlend) + directAngle * headingBlend;

      const desiredVelX = Math.cos(moveAngle) * speed;
      const desiredVelY = Math.sin(moveAngle) * speed;

      // Ultra-snappy acceleration: 28.0 (no sluggish ramp-up lag)
      const accel = 28.0;
      velX += (desiredVelX - velX) * Math.min(1, accel * dt);
      velY += (desiredVelY - velY) * Math.min(1, accel * dt);

      posX += velX * dt;
      posY += velY * dt;

      // Silk dragline trailing from spinneret
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      const spinneretX = posX - cosA * 20;
      const spinneretY = posY - sinA * 20;

      if (
        silkTrail.length === 0 ||
        Math.hypot(spinneretX - silkTrail[0].x, spinneretY - silkTrail[0].y) > 16
      ) {
        silkTrail.unshift({ x: spinneretX, y: spinneretY, alpha: 0.35 });
        if (silkTrail.length > MAX_SILK_POINTS) {
          silkTrail.pop();
        }
      }

      // Render silk dragline
      if (silkTrail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(spinneretX, spinneretY);
        for (let i = 0; i < silkTrail.length; i++) {
          silkTrail[i].alpha = Math.max(0, silkTrail[i].alpha - dt * (speed > 600 ? 0.3 : 0.09));
          ctx.lineTo(silkTrail[i].x, silkTrail[i].y);
        }
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.18)';
        ctx.lineWidth = 1.0;
        ctx.stroke();
      }

      // Gait coordination & Step timing
      const currentSpeed = Math.hypot(velX, velY);
      stepCooldown -= dt;

      // Rapid stepping proportional to speed: up to 28 steps per second during high-speed sprint
      const stepDuration = Math.max(0.035, 0.14 - Math.min(0.105, currentSpeed * 0.00015));

      if (stepCooldown <= 0) {
        gaitPhase = 1 - gaitPhase;
        stepCooldown = stepDuration;
      }

      // Process and render legs
      legs.forEach((leg) => {
        // Base joint on cephalothorax/sternum in world coordinates
        const baseWorldX = posX + cosA * leg.baseOffsetX - sinA * leg.baseOffsetY;
        const baseWorldY = posY + sinA * leg.baseOffsetX + cosA * leg.baseOffsetY;

        // Ideal resting footprint in world coordinates, with dynamic speed projection
        const lead = currentSpeed > 30 ? 0.06 : 0;
        const leadX = velX * lead;
        const leadY = velY * lead;

        const idealFootX = posX + cosA * leg.restOffsetX - sinA * leg.restOffsetY + leadX;
        const idealFootY = posY + sinA * leg.restOffsetX + cosA * leg.restOffsetY + leadY;

        const footDistToIdeal = Math.hypot(idealFootX - leg.currentX, idealFootY - leg.currentY);

        // Immediate snap / fast-step if mouse flicked across screen (> 65px)
        if (footDistToIdeal > 65) {
          leg.isStepping = false;
          leg.currentX = idealFootX;
          leg.currentY = idealFootY;
          leg.fromX = idealFootX;
          leg.fromY = idealFootY;
          leg.toX = idealFootX;
          leg.toY = idealFootY;
          leg.stepProgress = 1;
        } else if (!leg.isStepping) {
          const stepThreshold = currentSpeed > 200 ? 22 : 12;
          const emergencyThreshold = 38;
          if ((leg.group === gaitPhase && footDistToIdeal > stepThreshold) || footDistToIdeal > emergencyThreshold) {
            leg.isStepping = true;
            leg.stepProgress = 0;
            leg.fromX = leg.currentX;
            leg.fromY = leg.currentY;
            leg.toX = idealFootX;
            leg.toY = idealFootY;
          }
        }

        // Animate leg lift and touchdown
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
            const t = leg.stepProgress;
            const ease = t * t * (3 - 2 * t);
            leg.currentX = leg.fromX + (leg.toX - leg.fromX) * ease;
            leg.currentY = leg.fromY + (leg.toY - leg.fromY) * ease;
          }
        }

        // Solve Inverse Kinematics for Knee Joint
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
        const liftHeight = leg.isStepping ? Math.sin(leg.stepProgress * Math.PI) * 7 : 0;
        const shadowOffsetY = 3 + liftHeight;
        ctx.beginPath();
        ctx.moveTo(baseWorldX, baseWorldY + shadowOffsetY);
        ctx.lineTo(kx, ky + shadowOffsetY);
        ctx.lineTo(leg.currentX, leg.currentY + shadowOffsetY * 0.4);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.55)';
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Femur Segment (Upper leg bone: dark slate carapace with highlight)
        ctx.beginPath();
        ctx.moveTo(baseWorldX, baseWorldY);
        ctx.lineTo(kx, ky);
        ctx.strokeStyle = '#222A3A';
        ctx.lineWidth = 3.0;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Femur specular highlight
        ctx.beginPath();
        ctx.moveTo(baseWorldX, baseWorldY);
        ctx.lineTo(kx, ky);
        ctx.strokeStyle = '#3D4B66';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Tibia / Metatarsus Segment (Lower leg reaching down to ground)
        ctx.beginPath();
        ctx.moveTo(kx, ky);
        ctx.lineTo(leg.currentX, leg.currentY);
        ctx.strokeStyle = '#181E2B';
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Knee Joint Accent (Bio-mechanical emerald node)
        ctx.beginPath();
        ctx.arc(kx, ky, 2.0, 0, Math.PI * 2);
        ctx.fillStyle = '#10B981';
        ctx.fill();

        // Inner glowing core of knee
        ctx.beginPath();
        ctx.arc(kx, ky, 1.0, 0, Math.PI * 2);
        ctx.fillStyle = '#6EE7B7';
        ctx.fill();

        // Claw Tip (sharp luminous contact point)
        ctx.beginPath();
        ctx.arc(leg.currentX, leg.currentY, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = '#10B981';
        ctx.fill();
      });

      // Render Spider Body (Cephalothorax + Abdomen + Optics + Feelers)
      ctx.save();
      ctx.translate(posX, posY);
      ctx.rotate(angle);

      // Body Drop Shadow
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
      ctx.shadowBlur = 14;
      ctx.shadowOffsetY = 6;

      // Abdomen (Opisthosoma) - rear egg-shaped bulb with subtle breathing
      const breathe = Math.sin(currentTime * 0.004) * 0.8;
      ctx.beginPath();
      ctx.ellipse(-12, 0, 13 + breathe, 10 + breathe * 0.6, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#0E1119';
      ctx.fill();
      ctx.restore();

      // Abdomen outer chitin rim
      ctx.beginPath();
      ctx.ellipse(-12, 0, 13 + breathe, 10 + breathe * 0.6, 0, 0, Math.PI * 2);
      ctx.strokeStyle = '#283347';
      ctx.lineWidth = 1.4;
      ctx.stroke();

      // Dorsal Bio-Mechanical Chevrons on Abdomen
      ctx.beginPath();
      ctx.moveTo(-20, 0);
      ctx.lineTo(-6, 0);
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.65)';
      ctx.lineWidth = 1.6;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Lateral abdominal chevrons
      ctx.beginPath();
      ctx.moveTo(-16, -4);
      ctx.lineTo(-12, 0);
      ctx.lineTo(-16, 4);
      ctx.moveTo(-11, -5);
      ctx.lineTo(-7, 0);
      ctx.lineTo(-11, 5);
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.35)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Pedicel (waist connecting abdomen and cephalothorax)
      ctx.beginPath();
      ctx.rect(-3, -2.5, 3, 5);
      ctx.fillStyle = '#0A0C12';
      ctx.fill();

      // Cephalothorax (Prosoma: armored head and thorax shield)
      ctx.beginPath();
      ctx.ellipse(6, 0, 8.5, 7.2, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#171D28';
      ctx.fill();
      ctx.strokeStyle = '#323D54';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Carapace crown ridge
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(10, 0);
      ctx.strokeStyle = '#273144';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Pedipalps (front sensory feelers with live twitching)
      const palpTwitch = Math.sin(currentTime * 0.009) * 0.2;
      // Left pedipalp
      ctx.beginPath();
      ctx.moveTo(12, -3.5);
      ctx.lineTo(18, -6.5 + palpTwitch * 3);
      ctx.lineTo(21, -5.0 + palpTwitch * 4);
      ctx.strokeStyle = '#3E4B65';
      ctx.lineWidth = 1.8;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Right pedipalp
      ctx.beginPath();
      ctx.moveTo(12, 3.5);
      ctx.lineTo(18, 6.5 - palpTwitch * 3);
      ctx.lineTo(21, 5.0 - palpTwitch * 4);
      ctx.strokeStyle = '#3E4B65';
      ctx.lineWidth = 1.8;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Chelicerae & Fangs (sturdy predatory jaws)
      ctx.beginPath();
      ctx.moveTo(11, -2.0);
      ctx.lineTo(14, -1.5);
      ctx.moveTo(11, 2.0);
      ctx.lineTo(14, 1.5);
      ctx.strokeStyle = '#0E1118';
      ctx.lineWidth = 2.2;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Glowing Compound Optics (8 Arachnid Eyes in Emerald Noir)
      // Anterior Median Eyes (AME) - two large primary forward lenses
      ctx.save();
      ctx.shadowColor = '#10B981';
      ctx.shadowBlur = 9;

      ctx.beginPath();
      ctx.arc(11.8, -1.8, 1.6, 0, Math.PI * 2);
      ctx.arc(11.8, 1.8, 1.6, 0, Math.PI * 2);
      ctx.fillStyle = '#34D399';
      ctx.fill();

      // Anterior Lateral Eyes (ALE) - medium flanking lenses
      ctx.beginPath();
      ctx.arc(10.6, -3.8, 1.1, 0, Math.PI * 2);
      ctx.arc(10.6, 3.8, 1.1, 0, Math.PI * 2);
      ctx.fillStyle = '#10B981';
      ctx.fill();

      // Posterior Median & Lateral Eyes (4 secondary crown lenses)
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.arc(8.5, -2.5, 0.9, 0, Math.PI * 2);
      ctx.arc(8.5, 2.5, 0.9, 0, Math.PI * 2);
      ctx.arc(7.6, -4.4, 0.9, 0, Math.PI * 2);
      ctx.arc(7.6, 4.4, 0.9, 0, Math.PI * 2);
      ctx.fillStyle = '#059669';
      ctx.fill();

      ctx.restore(); // restore eye glow
      ctx.restore(); // restore spider body transform
      ctx.restore(); // restore DPR scaling
    };

    animFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', updateCanvasSize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-40 overflow-hidden"
      aria-hidden="true"
    />
  );
}
