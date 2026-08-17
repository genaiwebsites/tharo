'use client';

import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { SpotLight } from '@react-three/drei';
import * as THREE from 'three';
import { cn } from '@/lib/utils';

const METAL_NOISE =
  'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%221.5%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E")';
const GRAIN_NOISE =
  'url("data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22g%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23g)%22/%3E%3C/svg%3E")';

// Ultra-realistic Silky 2D Canvas Atmospheric Bokeh & Floating Dust Particles
function SilkyCanvasAtmosphericDust({
  lightsOn,
  lightColor,
}: {
  lightsOn: boolean;
  lightColor: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles = Array.from({ length: 48 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.2 + 0.8,
      speedY: -(Math.random() * 0.35 + 0.15),
      speedX: (Math.random() - 0.5) * 0.25,
      opacity: Math.random() * 0.4 + 0.18,
      pulse: Math.random() * Math.PI * 2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (lightsOn) {
        particles.forEach((p) => {
          p.y += p.speedY;
          p.x += p.speedX;
          p.pulse += 0.025;

          if (p.y < -10) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;

          const currentOpacity = p.opacity * (0.75 + Math.sin(p.pulse) * 0.25);

          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2.4);
          grad.addColorStop(0, `rgba(${lightColor}, ${currentOpacity * 1.6})`);
          grad.addColorStop(0.35, `rgba(${lightColor}, ${currentOpacity * 0.7})`);
          grad.addColorStop(1, `rgba(${lightColor}, 0)`);

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.4, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [lightsOn, lightColor]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 22,
        pointerEvents: 'none',
        mixBlendMode: 'screen',
        opacity: lightsOn ? 0.95 : 0,
        transition: 'opacity 800ms ease',
      }}
    />
  );
}

const parseRgbToThreeColor = (colorStr: string) => {
  const parts = colorStr.replace(/[^\d,]/g, '').split(',').map(Number);
  if (parts.length >= 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
    return new THREE.Color(parts[0] / 255, parts[1] / 255, parts[2] / 255);
  }
  return new THREE.Color(colorStr);
};

// 3D Volumetric Spotlight Beam with Motorized Ray Tracking Physics
function RayTrackedSpotlight({
  color,
  isCenter = false,
  lightsOn,
  intensity,
  mousePos,
  isFollowMode = false,
  inwardAim = 0,
}: {
  color: string;
  isCenter?: boolean;
  lightsOn: boolean;
  intensity: number;
  mousePos: { x: number; y: number };
  isFollowMode?: boolean;
  inwardAim?: number;
}) {
  const spotRef = useRef<THREE.SpotLight>(null);
  const targetObj = useMemo(() => new THREE.Object3D(), []);
  const currentPos = useRef(new THREE.Vector3(inwardAim, -3.4, 0));

  const parsedColor = useMemo(() => parseRgbToThreeColor(color), [color]);

  const applyColor = useCallback((targetColor: THREE.Color, lerpRatio = 1.0) => {
    if (!spotRef.current) return;
    if (lerpRatio === 1.0) {
      spotRef.current.color.copy(targetColor);
    } else {
      spotRef.current.color.lerp(targetColor, lerpRatio);
    }

    spotRef.current.traverse((child: any) => {
      if (child.material) {
        const mat = child.material;
        if (mat.color && typeof mat.color.copy === 'function') {
          if (lerpRatio === 1.0) mat.color.copy(targetColor);
          else mat.color.lerp(targetColor, lerpRatio);
        }
        if (mat.uniforms) {
          Object.keys(mat.uniforms).forEach((key) => {
            const u = mat.uniforms[key];
            if (
              u &&
              u.value &&
              (u.value instanceof THREE.Color ||
                (typeof u.value === 'object' && 'r' in u.value && 'g' in u.value && 'b' in u.value))
            ) {
              if (lerpRatio === 1.0) {
                u.value.copy(targetColor);
              } else if (typeof u.value.lerp === 'function') {
                u.value.lerp(targetColor, lerpRatio);
              }
            }
          });
        }
        mat.needsUpdate = true;
      }
    });
  }, []);

  useEffect(() => {
    applyColor(parsedColor, 1.0);
  }, [parsedColor, applyColor]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const mx = mousePos.x;
    const my = mousePos.y;

    let destX = inwardAim;
    let destY = -6.8;

    if (isCenter) {
      if (isFollowMode) {
        // Smooth continuous ray tracking following the user's cursor
        destX = mx * 2.2;
        destY = -6.8 - my * 0.6;
      } else {
        // Natural resting idle center with subtle organic breath
        destX = Math.sin(t * 0.4) * 0.15;
        destY = -6.8 + Math.cos(t * 0.3) * 0.08;
      }
    } else {
      // Side rim spotlights aim inward toward the central runway model
      destX = inwardAim * 1.6 + (isFollowMode ? mx * 0.5 : Math.sin(t * 0.4) * 0.12);
      destY = -6.8;
    }

    currentPos.current.x = THREE.MathUtils.damp(currentPos.current.x, destX, 7, delta);
    currentPos.current.y = THREE.MathUtils.damp(currentPos.current.y, destY, 7, delta);
    currentPos.current.z = THREE.MathUtils.damp(currentPos.current.z, 0, 7, delta);

    targetObj.position.copy(currentPos.current);
    targetObj.updateMatrixWorld();

    if (spotRef.current) {
      spotRef.current.target = targetObj;
      const targetIntensity = lightsOn
        ? intensity * (isCenter ? 1.35 : 0.9) * (0.97 + Math.sin(t * 2.0) * 0.03)
        : 0;
      spotRef.current.intensity = THREE.MathUtils.lerp(
        spotRef.current.intensity,
        targetIntensity,
        0.1
      );
      applyColor(parsedColor, 0.15);
    }
  });

  return (
    <>
      <primitive object={targetObj} />
      <ambientLight intensity={0.3} />
      <SpotLight
        ref={spotRef}
        key={color}
        target={targetObj}
        position={[0, 4.0, 0]}
        color={color.includes(',') ? `rgb(${color})` : color}
        distance={28}
        angle={isCenter ? 0.48 : 0.40}
        attenuation={isCenter ? 6.2 : 7.2}
        anglePower={isCenter ? 4.2 : 4.8}
        volumetric
        opacity={lightsOn ? (isCenter ? 0.95 : 0.78) : 0}
        radiusTop={0.1}
        radiusBottom={isCenter ? 8.2 : 6.4}
      />
    </>
  );
}

export type RoomProps = {
  backWall?: {
    tl: [number, number];
    tr: [number, number];
    br: [number, number];
    bl: [number, number];
  };
  lightsOn?: boolean;
  intensity?: number;
  lightColor?: string;
  spots?: number[];
  vignette?: number;
  isFlickering?: boolean;
  className?: string;
  mousePos?: { x: number; y: number };
  isFollowMode?: boolean;
};

export function StudioRoom({
  backWall = {
    tl: [22, 10],
    tr: [78, 10],
    br: [78, 70],
    bl: [22, 70],
  },
  lightsOn = true,
  intensity = 1,
  lightColor = '230,240,255',
  spots = [35, 50, 65],
  vignette = 0.55,
  isFlickering = false,
  className = '',
  mousePos = { x: 0, y: 0 },
  isFollowMode = true,
}: RoomProps) {
  const { tl, tr, br, bl } = backWall;
  const poly = useMemo(
    () => (pts: readonly (readonly [number, number])[]) =>
      `polygon(${pts.map(([x, y]) => `${x}% ${y}%`).join(', ')})`,
    []
  );
  const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

  const formattedColor = lightColor.includes(',') ? `rgb(${lightColor})` : lightColor;
  const rawRgb = lightColor.replace(/[^\d,]/g, '') || '230,240,255';

  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        backgroundColor: '#000000',
        pointerEvents: 'none',
      }}
      className={className}
    >
      {/* Back Wall */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          clipPath: poly([tl, tr, br, bl]),
          background: 'linear-gradient(to bottom, rgba(20,20,22,1) 0%, rgba(8,8,10,1) 100%)',
        }}
      />
      {/* Ceiling */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          clipPath: poly([[0, 0], [100, 0], tr, tl]),
          background: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 100%)',
        }}
      />
      {/* Left Perspective Wall */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          clipPath: poly([[0, 0], tl, bl, [0, 100]]),
          background: 'linear-gradient(to right, rgba(8,8,10,1) 0%, rgba(18,18,20,1) 70%, rgba(26,26,28,1) 100%)',
        }}
      />
      {/* Right Perspective Wall */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          clipPath: poly([[100, 0], tr, br, [100, 100]]),
          background: 'linear-gradient(to left, rgba(8,8,10,1) 0%, rgba(18,18,20,1) 70%, rgba(26,26,28,1) 100%)',
        }}
      />
      {/* Runway Floor Plane */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          clipPath: poly([[0, 100], [100, 100], br, bl]),
          background: 'linear-gradient(to top, rgba(15,15,17,1) 0%, rgba(6,6,8,1) 100%)',
        }}
      />

      {/* Grid Lines */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 10 }}>
        <defs>
          <linearGradient id="baseGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="20%" stopColor="white" stopOpacity="0.5" />
            <stop offset="80%" stopColor="white" stopOpacity="0.5" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="vGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="50%" stopColor="white" stopOpacity="0.18" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line
          x1={`${bl[0]}%`}
          y1={`${bl[1]}%`}
          x2={`${br[0]}%`}
          y2={`${br[1]}%`}
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="5"
          style={{ filter: 'blur(3px)' }}
        />
        <line
          x1={`${bl[0]}%`}
          y1={`${bl[1]}%`}
          x2={`${br[0]}%`}
          y2={`${br[1]}%`}
          stroke="url(#baseGrad)"
          strokeWidth="1"
        />
        <line
          x1={`${tl[0]}%`}
          y1={`${tl[1]}%`}
          x2={`${bl[0]}%`}
          y2={`${bl[1]}%`}
          stroke="url(#vGrad)"
          strokeWidth="1"
        />
        <line
          x1={`${tr[0]}%`}
          y1={`${tr[1]}%`}
          x2={`${br[0]}%`}
          y2={`${br[1]}%`}
          stroke="url(#vGrad)"
          strokeWidth="1"
        />
      </svg>

      {/* Realistic Floor Light Contact Pools & Specular Bounce */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 15,
          opacity: lightsOn ? intensity : 0,
          transition: isFlickering ? 'none' : `opacity 700ms ${EASE}`,
          mixBlendMode: 'screen',
          willChange: 'opacity',
        }}
      >
        {/* Back Wall Light Diffusions */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            clipPath: poly([tl, tr, br, bl]),
            background: spots
              .map(
                (x) =>
                  `radial-gradient(ellipse 25% 40% at ${x}% 68%, rgba(${rawRgb},0.15) 0%, transparent 70%)`
              )
              .join(', '),
          }}
        />
        {/* Left Side Wall Reflection */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            clipPath: poly([[0, 0], tl, bl, [0, 100]]),
            background: `radial-gradient(ellipse 40% 50% at 15% 75%, rgba(${rawRgb},0.08) 0%, transparent 60%)`,
          }}
        />
        {/* Right Side Wall Reflection */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            clipPath: poly([[100, 0], tr, br, [100, 100]]),
            background: `radial-gradient(ellipse 40% 50% at 85% 75%, rgba(${rawRgb},0.08) 0%, transparent 60%)`,
          }}
        />

        {/* Dynamic Center Floor Podium Light Pool (Tracks with Follow-Spot Ray Tracking) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            clipPath: poly([[0, 100], [100, 100], br, bl]),
            background: `radial-gradient(ellipse 42% 32% at ${50 + (isFollowMode ? mousePos.x * 2.2 : 0)}% 78%, rgba(${rawRgb},0.42) 0%, rgba(${rawRgb},0.12) 48%, transparent 75%)`,
            transition: 'background 200ms ease',
          }}
        />
        {/* Left and Right Floor Footprints */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            clipPath: poly([[0, 100], [100, 100], br, bl]),
            background: [
              { x: 35, offset: 2 },
              { x: 65, offset: -2 },
            ]
              .map(
                (p) =>
                  `radial-gradient(ellipse 30% 24% at ${p.x + p.offset}% 78%, rgba(${rawRgb},0.18) 0%, transparent 60%)`
              )
              .join(', '),
          }}
        />
      </div>

      {/* 3D Volumetric Spotlight Beams with Ray Tracking */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 16,
          mixBlendMode: 'screen',
        }}
      >
        {spots.map((pos, i) => {
          const isCenter = pos === 50;
          const inwardAim = isCenter ? 0 : (pos < 50 ? 0.6 : -0.6);

          return (
            <motion.div
              key={`${formattedColor}-${pos}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: lightsOn ? intensity : 0 }}
              transition={
                isFlickering
                  ? { duration: 0 }
                  : { delay: i * 0.1, duration: 0.8, ease: 'easeInOut' }
              }
              style={{
                position: 'absolute',
                display: 'flex',
                width: '480px',
                height: '92vh',
                transform: 'translateX(-50%)',
                justifyContent: 'center',
                pointerEvents: 'none',
                left: `${pos}%`,
                top: 'calc(3% + 56px)',
                mixBlendMode: 'screen',
                willChange: 'opacity',
              }}
            >
              <Canvas
                key={`${formattedColor}-${pos}`}
                camera={{ position: [0, 0, 10], fov: 45 }}
                shadows={false}
                gl={{ alpha: true }}
              >
                <RayTrackedSpotlight
                  key={formattedColor}
                  color={formattedColor}
                  isCenter={isCenter}
                  lightsOn={lightsOn}
                  intensity={intensity}
                  mousePos={mousePos}
                  isFollowMode={isFollowMode}
                  inwardAim={inwardAim}
                />
              </Canvas>
            </motion.div>
          );
        })}
      </div>

      {/* 1:1 Original 21st.dev Theatrical Fixture Lamps with Barn Doors */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 31,
        }}
      >
        {spots.map((pos, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              left: `${pos}%`,
              top: '3%',
              transform: 'translate(-50%, -4px)',
            }}
          >
            {/* Top Mounting Bracket with Dual Hex Bolts */}
            <div
              style={{
                width: '14px',
                height: '34px',
                borderRadius: '2px',
                border: '1px solid #18181b',
                boxShadow:
                  '0 5px 10px rgba(0,0,0,0.9), inset 0 0 4px rgba(255,255,255,0.5)',
                position: 'relative',
                overflow: 'hidden',
                background:
                  'linear-gradient(to right, #666666 0%, #ffffff 40%, #999999 60%, #333333 100%)',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '4px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '6px',
                  height: '6px',
                  backgroundColor: '#18181b',
                  borderRadius: '50%',
                  boxShadow: 'inset 0 1px 1px rgba(0,0,0,1)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '4px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '6px',
                  height: '6px',
                  backgroundColor: '#18181b',
                  borderRadius: '50%',
                  boxShadow: 'inset 0 1px 1px rgba(0,0,0,1)',
                }}
              />
            </div>

            {/* Swivel Yoke Neck & Ball Joint */}
            <div
              style={{
                width: '8px',
                height: '18px',
                background:
                  'linear-gradient(to right, #18181b, #52525b, #09090b)',
                borderLeft: '1px solid #000000',
                borderRight: '1px solid #000000',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  bottom: '-8px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  border: '1px solid #18181b',
                  boxShadow:
                    '0 4px 8px rgba(0,0,0,1), inset 0 1px 2px rgba(255,255,255,0.3)',
                  background: 'radial-gradient(circle at top left, #777, #111)',
                }}
              />
            </div>

            {/* Lamp Body & Flap Barn Doors */}
            <div
              style={{
                position: 'relative',
                marginTop: '6px',
                width: '54px',
                height: '64px',
                display: 'flex',
                justifyContent: 'center',
                perspective: '100px',
              }}
            >
              {/* Stepped Lamp Housing with Heat Sinks */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '2px 2px 16px 16px',
                  border: '1px solid #000000',
                  boxShadow: '0 20px 30px rgba(0,0,0,0.9)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-evenly',
                  background:
                    'linear-gradient(to right, #111 0%, #3a3a3a 30%, #555 50%, #2a2a2a 80%, #000 100%)',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0.35,
                    mixBlendMode: 'overlay',
                    pointerEvents: 'none',
                    backgroundImage: METAL_NOISE,
                  }}
                />
                <div
                  style={{
                    width: '100%',
                    height: '2px',
                    backgroundColor: 'rgba(0,0,0,0.9)',
                    boxShadow: '0 1px 0 rgba(255,255,255,0.15)',
                    zIndex: 10,
                  }}
                />
                <div
                  style={{
                    width: '100%',
                    height: '2px',
                    backgroundColor: 'rgba(0,0,0,0.9)',
                    boxShadow: '0 1px 0 rgba(255,255,255,0.15)',
                    zIndex: 10,
                  }}
                />
                <div
                  style={{
                    width: '100%',
                    height: '2px',
                    backgroundColor: 'rgba(0,0,0,0.9)',
                    boxShadow: '0 1px 0 rgba(255,255,255,0.15)',
                    zIndex: 10,
                  }}
                />
                <div
                  style={{
                    width: '100%',
                    height: '2px',
                    backgroundColor: 'rgba(0,0,0,0.9)',
                    boxShadow: '0 1px 0 rgba(255,255,255,0.15)',
                    zIndex: 10,
                  }}
                />
              </div>

              {/* Illuminated Optical Circular Lens Dish */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-4px',
                  width: '54px',
                  height: '16px',
                  borderRadius: '50%',
                  border: '1.5px solid #18181b',
                  boxShadow: '0 8px 12px rgba(0,0,0,0.9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                  overflow: 'hidden',
                  background: 'radial-gradient(ellipse at center, #222226, #09090b)',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '9px',
                    borderRadius: '50%',
                    transition: 'background 400ms ease, box-shadow 400ms ease',
                    background: lightsOn ? `rgb(${rawRgb})` : '#111111',
                    boxShadow: lightsOn
                      ? `0 0 16px 6px rgba(${rawRgb}, 0.85), inset 0 0 4px #ffffff`
                      : 'inset 0 1px 3px rgba(0,0,0,0.9)',
                  }}
                />
              </div>

              {/* Front Flap Barn Door */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-18px',
                  width: '46px',
                  height: '20px',
                  border: '1px solid #000000',
                  boxShadow: '0 15px 15px rgba(0,0,0,0.8)',
                  transformOrigin: 'top center',
                  zIndex: 20,
                  display: 'flex',
                  justifyContent: 'center',
                  transform: 'rotateX(-45deg)',
                  background: 'linear-gradient(to bottom, #222, #050505)',
                }}
              >
                <div
                  style={{
                    width: '80%',
                    height: '100%',
                    backgroundColor: 'rgba(255,255,255,0.03)',
                  }}
                />
              </div>

              {/* Rear Flap Barn Door */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '6px',
                  width: '46px',
                  height: '20px',
                  border: '1px solid #000000',
                  transformOrigin: 'bottom center',
                  zIndex: 0,
                  transform: 'rotateX(45deg)',
                  background: 'linear-gradient(to top, #111, #000)',
                }}
              />

              {/* Left Side Flap Barn Door */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-6px',
                  left: '-6px',
                  width: '14px',
                  height: '22px',
                  backgroundColor: '#18181b',
                  border: '1px solid #000000',
                  transformOrigin: 'right center',
                  zIndex: 10,
                  boxShadow: '5px 0 10px rgba(0,0,0,0.5)',
                  transform: 'rotateY(-55deg) skewY(15deg)',
                }}
              />

              {/* Right Side Flap Barn Door */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-6px',
                  right: '-6px',
                  width: '14px',
                  height: '22px',
                  backgroundColor: '#18181b',
                  border: '1px solid #000000',
                  transformOrigin: 'left center',
                  zIndex: 10,
                  boxShadow: '-5px 0 10px rgba(0,0,0,0.5)',
                  transform: 'rotateY(55deg) skewY(-15deg)',
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Silky 2D Atmospheric Bokeh Motes */}
      <SilkyCanvasAtmosphericDust lightsOn={lightsOn} lightColor={rawRgb} />

      {/* Ceiling Rig Bar Shadow Blur */}
      <div
        style={{
          position: 'absolute',
          pointerEvents: 'none',
          width: '100%',
          height: '80px',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)',
          filter: 'blur(24px)',
          zIndex: 29,
          top: '4%',
          left: 0,
        }}
      />

      {/* Overhead Steel Truss Beam */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 30,
          clipPath: poly([[0, 0], [100, 0], tr, tl]),
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '26px',
            top: '3%',
            left: 0,
            background:
              'linear-gradient(to bottom, #111 0%, #3a3a3a 30%, #555 50%, #2a2a2a 80%, #000 100%)',
            boxShadow:
              'inset 0 1px 1px rgba(255,255,255,0.15), inset 0 -1px 2px rgba(0,0,0,0.9), 0 10px 20px -5px rgba(0,0,0,0.8)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.35,
              mixBlendMode: 'overlay',
              pointerEvents: 'none',
              backgroundImage: METAL_NOISE,
            }}
          />
        </div>
      </div>

      {/* Cinematic Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 20,
          background: `radial-gradient(ellipse 90% 80% at 50% 45%, transparent 55%, rgba(0,0,0,${vignette}) 100%)`,
        }}
      />

      {/* Grain Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 25,
          opacity: 0.04,
          mixBlendMode: 'screen',
          backgroundImage: GRAIN_NOISE,
          backgroundSize: '256px 256px',
        }}
      />
    </div>
  );
}

export const VolumetricStudio = ({
  className,
  style,
  children,
  lightColor = '230,240,255',
  spots = [35, 50, 65],
  intensity = 1,
  mousePos = { x: 0, y: 0 },
  isFollowMode = true,
  lightsOn: userLightsOn,
}: {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  lightColor?: string;
  spots?: number[];
  intensity?: number;
  mousePos?: { x: number; y: number };
  isFollowMode?: boolean;
  lightsOn?: boolean;
}) => {
  const [internalLightsOn, setInternalLightsOn] = useState(false);
  const [isFlickering, setIsFlickering] = useState(true);

  useEffect(() => {
    let mounted = true;
    const runFlicker = async () => {
      const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
      await sleep(600);
      if (!mounted) return;
      setInternalLightsOn(true);
      await sleep(100);
      setInternalLightsOn(false);
      await sleep(300);
      setInternalLightsOn(true);
      await sleep(50);
      setInternalLightsOn(false);
      await sleep(200);
      setInternalLightsOn(true);
      await sleep(40);
      setInternalLightsOn(false);
      await sleep(60);
      setInternalLightsOn(true);
      await sleep(40);
      setInternalLightsOn(false);
      await sleep(400);
      if (!mounted) return;
      setIsFlickering(false);
      setInternalLightsOn(true);
    };
    runFlicker();
    return () => {
      mounted = false;
    };
  }, []);

  const effectiveLightsOn =
    userLightsOn !== undefined
      ? isFlickering
        ? internalLightsOn
        : userLightsOn
      : internalLightsOn;

  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '600px',
        backgroundColor: '#000000',
        overflow: 'hidden',
        ...style,
      }}
      className={cn('font-sans', className)}
    >
      <StudioRoom
        lightsOn={effectiveLightsOn}
        intensity={intensity}
        lightColor={lightColor}
        spots={spots}
        isFlickering={isFlickering}
        mousePos={mousePos}
        isFollowMode={isFollowMode}
      />
      <div style={{ position: 'relative', zIndex: 35, width: '100%', height: '100%' }}>
        {children}
      </div>
    </section>
  );
};
