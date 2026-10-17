'use client';

import { useEffect, useRef, useState } from 'react';
import globePointsData from '@/data/globePoints.json';

interface DotGlobeProps {
  size?: number;
  className?: string;
  enableInteraction?: boolean;
}

export function DotGlobe({
  size = 560,
  className = '',
  enableInteraction = true,
}: DotGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rotationRef = useRef<number>(1.5);
  const isDraggingRef = useRef<boolean>(false);
  const lastMouseXRef = useRef<number>(0);
  const velocityRef = useRef<number>(0.0035);
  const animFrameIdRef = useRef<number | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Retina display resolution support
    const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const radius = size * 0.43;
    const centerX = size / 2;
    const centerY = size / 2;
    const tilt = 0.36; // ~21 deg axial tilt

    // Precompute 3D points on unit sphere
    const points3D = (globePointsData as [number, number][]).map(([lat, lon]) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      return {
        x: -radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.cos(phi),
        z: radius * Math.sin(phi) * Math.sin(theta),
      };
    });

    // Dhaka, Bangladesh Coordinates
    const dhakaPhi = (90 - 23.8103) * (Math.PI / 180);
    const dhakaTheta = (90.4125 + 180) * (Math.PI / 180);
    const dhakaPoint = {
      x: -radius * Math.sin(dhakaPhi) * Math.cos(dhakaTheta),
      y: radius * Math.cos(dhakaPhi),
      z: radius * Math.sin(dhakaPhi) * Math.sin(dhakaTheta),
    };

    let pulseRadius = 0;

    const render = () => {
      ctx.clearRect(0, 0, size, size);

      // Continuous auto rotation
      if (!isDraggingRef.current) {
        rotationRef.current += velocityRef.current;
        velocityRef.current = velocityRef.current * 0.96 + 0.0035 * 0.04;
      }

      const angle = rotationRef.current;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      const cosT = Math.cos(tilt);
      const sinT = Math.sin(tilt);

      // 1. Subtle Radial Glow behind sphere
      const haloGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        radius * 0.7,
        centerX,
        centerY,
        radius * 1.05
      );
      haloGrad.addColorStop(0, 'rgba(16, 185, 129, 0)');
      haloGrad.addColorStop(0.85, 'rgba(16, 185, 129, 0.03)');
      haloGrad.addColorStop(1, 'rgba(16, 185, 129, 0.09)');

      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.05, 0, Math.PI * 2);
      ctx.fill();

      // Outer Sphere Circular Rim Outline
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();

      // 2. Render Projected Dotted Matrix Points (Matching Reference Image)
      for (let i = 0; i < points3D.length; i++) {
        const pt = points3D[i];

        // Y-axis rotation
        const x1 = pt.x * cosA - pt.z * sinA;
        const z1 = pt.x * sinA + pt.z * cosA;

        // X-axis axial tilt
        const y2 = pt.y * cosT - z1 * sinT;
        const z2 = pt.y * sinT + z1 * cosT;

        // Front hemisphere depth culling
        if (z2 > -radius * 0.1) {
          const depthRatio = (z2 + radius * 0.1) / (radius * 1.1);
          const screenX = centerX + x1;
          const screenY = centerY + y2;

          // Crisp square pixel dots (matching the user's reference image)
          const dotSize = Math.max(2.2, 1.8 + depthRatio * 2.8);
          const alpha = Math.min(1.0, Math.max(0.18, Math.pow(depthRatio, 1.1)));

          ctx.fillStyle = depthRatio > 0.5
            ? `rgba(255, 255, 255, ${alpha})`
            : `rgba(210, 220, 240, ${alpha * 0.85})`;

          ctx.fillRect(
            screenX - dotSize / 2,
            screenY - dotSize / 2,
            dotSize,
            dotSize
          );
        }
      }

      // 3. Dhaka Beacon Signal
      const dhakaX1 = dhakaPoint.x * cosA - dhakaPoint.z * sinA;
      const dhakaZ1 = dhakaPoint.x * sinA + dhakaPoint.z * cosA;
      const dhakaY2 = dhakaPoint.y * cosT - dhakaZ1 * sinT;
      const dhakaZ2 = dhakaPoint.y * sinT + dhakaZ1 * cosT;

      if (dhakaZ2 > 0) {
        const dhakaScreenX = centerX + dhakaX1;
        const dhakaScreenY = centerY + dhakaY2;

        // Glowing Emerald Dot
        ctx.fillStyle = '#10B981';
        ctx.beginPath();
        ctx.arc(dhakaScreenX, dhakaScreenY, 4, 0, Math.PI * 2);
        ctx.fill();

        // Expanding Ping Ripple
        pulseRadius = (pulseRadius + 0.35) % 22;
        const pulseAlpha = Math.max(0, 1 - pulseRadius / 22);

        ctx.strokeStyle = `rgba(16, 185, 129, ${pulseAlpha * 0.9})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(dhakaScreenX, dhakaScreenY, pulseRadius + 4, 0, Math.PI * 2);
        ctx.stroke();

        // Location Tag
        ctx.font = '600 10px "JetBrains Mono", monospace';
        ctx.fillStyle = '#10B981';
        ctx.fillText('Dhaka (UTC+6)', dhakaScreenX + 10, dhakaScreenY - 5);
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isClient, size]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!enableInteraction) return;
    isDraggingRef.current = true;
    lastMouseXRef.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - lastMouseXRef.current;
    lastMouseXRef.current = e.clientX;
    rotationRef.current += deltaX * 0.007;
    velocityRef.current = deltaX * 0.003;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`relative select-none flex items-center justify-center ${
        enableInteraction ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'
      } ${className}`}
      style={{ width: size, height: size }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size }}
        className="block"
      />
    </div>
  );
}
