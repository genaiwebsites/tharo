'use client';

/* eslint-disable react/no-unknown-property */
import React, { forwardRef, useRef, useMemo, useLayoutEffect, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Color, Mesh, ShaderMaterial } from 'three';

export interface SilkProps {
  speed?: number;
  scale?: number;
  color?: string;
  noiseIntensity?: number;
  rotation?: number;
  className?: string;
  style?: React.CSSProperties;
  paused?: boolean;
}

const hexToNormalizedRGB = (hex: string): [number, number, number] => {
  hex = hex.replace('#', '');
  return [
    parseInt(hex.slice(0, 2), 16) / 255,
    parseInt(hex.slice(2, 4), 16) / 255,
    parseInt(hex.slice(4, 6), 16) / 255,
  ];
};

const vertexShader = `
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vPosition = position;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
varying vec3 vPosition;

uniform float uTime;
uniform vec3  uColor;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uNoiseIntensity;

const float e = 2.71828182845904523536;

float noise(vec2 texCoord) {
  float G = e;
  vec2  r = (G * sin(G * texCoord));
  return fract(r.x * r.y * (1.0 + texCoord.x));
}

vec2 rotateUvs(vec2 uv, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  mat2  rot = mat2(c, -s, s, c);
  return rot * uv;
}

void main() {
  float rnd        = noise(gl_FragCoord.xy);
  vec2  uv         = rotateUvs(vUv * uScale, uRotation);
  vec2  tex        = uv * uScale;
  float tOffset    = uSpeed * uTime;

  tex.y += 0.03 * sin(8.0 * tex.x - tOffset);

  float pattern = 0.6 +
                  0.4 * sin(5.0 * (tex.x + tex.y +
                                   cos(3.0 * tex.x + 5.0 * tex.y) +
                                   0.02 * tOffset) +
                           sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));

  vec4 col = vec4(uColor, 1.0) * vec4(pattern) - rnd / 15.0 * uNoiseIntensity;
  col.a = 1.0;
  gl_FragColor = col;
}
`;

interface SilkPlaneProps {
  uniforms: {
    uSpeed: { value: number };
    uScale: { value: number };
    uNoiseIntensity: { value: number };
    uColor: { value: Color };
    uRotation: { value: number };
    uTime: { value: number };
  };
  paused?: boolean;
}

const SilkPlane = forwardRef<Mesh, SilkPlaneProps>(function SilkPlane({ uniforms, paused }, ref) {
  const { viewport } = useThree();

  useLayoutEffect(() => {
    if (ref && 'current' in ref && ref.current) {
      ref.current.scale.set(viewport.width, viewport.height, 1);
    }
  }, [ref, viewport]);

  useFrame((_, delta) => {
    if (paused) return;
    if (ref && 'current' in ref && ref.current) {
      const mat = ref.current.material as ShaderMaterial;
      if (mat && mat.uniforms) {
        mat.uniforms.uTime.value += 0.1 * delta;
      }
    }
  });

  return (
    <mesh ref={ref}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
});
SilkPlane.displayName = 'SilkPlane';

export default function Silk({
  speed = 5,
  scale = 1,
  color = '#14438e',
  noiseIntensity = 1.5,
  rotation = 0,
  className,
  style,
  paused = false,
}: SilkProps) {
  const meshRef = useRef<Mesh>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const rgb = useMemo(() => hexToNormalizedRGB(color), [color]);

  const uniforms = useMemo(
    () => ({
      uSpeed: { value: speed },
      uScale: { value: scale },
      uNoiseIntensity: { value: noiseIntensity },
      uColor: { value: new Color(...rgb) },
      uRotation: { value: rotation },
      uTime: { value: 0 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    uniforms.uSpeed.value = speed;
    uniforms.uScale.value = scale;
    uniforms.uNoiseIntensity.value = noiseIntensity;
    uniforms.uColor.value.setRGB(...rgb);
    uniforms.uRotation.value = rotation;
  }, [speed, scale, noiseIntensity, rgb, rotation, uniforms]);

  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        background: 'radial-gradient(ellipse 90% 75% at 50% 50%, #102752 0%, #0b0f18 100%)',
        ...style,
      }}
    >
      {mounted && (
        <Canvas
          dpr={[1, 1.5]}
          frameloop={paused ? 'never' : 'always'}
          gl={{
            antialias: false,
            alpha: true,
            powerPreference: 'high-performance',
            preserveDrawingBuffer: false,
          }}
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          <SilkPlane ref={meshRef} uniforms={uniforms} paused={paused} />
        </Canvas>
      )}
    </div>
  );
}

export { Silk };
