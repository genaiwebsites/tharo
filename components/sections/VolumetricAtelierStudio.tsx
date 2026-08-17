'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { VolumetricStudio } from '@/components/ui/volumetric-studio';
import { ArrowUpRight, Sparkles, MousePointerClick, Power } from 'lucide-react';

interface AtelierLook {
  id: string;
  number: string;
  name: string;
  category: string;
  materials: string;
  image: string;
}

const ATELIER_COLLECTION: AtelierLook[] = [
  {
    id: 'tuxedo',
    number: '01',
    name: 'The Midnight Velvet Tuxedo',
    category: 'Black Tie Ceremonial',
    materials: 'Milano Silk-Cotton Velvet · Pure Silk Faille Lapels',
    image: '/images/studio/model-midnight-tuxedo.png',
  },
  {
    id: 'oxblood',
    number: '02',
    name: 'The Ruby Oxblood Velvet Bandhgala',
    category: 'Sovereign Evening',
    materials: 'Deep Wine Silk Velvet · Antique Gold Marodi Embroidery',
    image: '/images/studio/model-oxblood-velvet.png',
  },
  {
    id: 'jodhpuri',
    number: '03',
    name: 'The Royal Blue Silk Jodhpuri',
    category: 'Heritage Suiting',
    materials: 'Handspun Indigo Silk · Botanical Floral Silver Threadwork',
    image: '/images/studio/model-royal-jodhpuri.png',
  },
  {
    id: 'sherwani',
    number: '04',
    name: 'The Imperial Ivory Sherwani',
    category: 'Royal Nuptials',
    materials: 'Hand-woven Raw Silk · Silver Micro-Zari Resham',
    image: '/images/studio/model-ivory-sherwani.png',
  },
];

type LightMood = {
  id: string;
  label: string;
  temp: string;
  color: string;
  swatch: string;
};

const LIGHT_MOODS: LightMood[] = [
  {
    id: 'diamond',
    label: 'Diamond White',
    temp: '5600K',
    color: '245,248,255',
    swatch: '#ffffff',
  },
  {
    id: 'amber',
    label: 'Imperial Amber',
    temp: '3000K',
    color: '255,185,90',
    swatch: '#f5a623',
  },
  {
    id: 'indigo',
    label: 'Midnight Indigo',
    temp: '7500K',
    color: '100,160,255',
    swatch: '#6395ff',
  },
  {
    id: 'ruby',
    label: 'Ruby Dusk',
    temp: '2600K',
    color: '255,80,130',
    swatch: '#ff4d79',
  },
];

export default function VolumetricAtelierStudio() {
  const [activeLookIndex, setActiveLookIndex] = useState<number>(0);
  const [activeMood, setActiveMood] = useState<LightMood>(LIGHT_MOODS[0]);
  const [lightsOn, setLightsOn] = useState<boolean>(true);
  const [isFollowMode, setIsFollowMode] = useState<boolean>(true);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const sectionRef = useRef<HTMLElement>(null);
  const activeLook = ATELIER_COLLECTION[activeLookIndex];

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x: nx, y: ny });
  };

  return (
    <section
      ref={sectionRef}
      id="studio"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: '700px',
        background: 'linear-gradient(180deg, var(--room-bg) 0%, #020306 14%, #020306 86%, var(--room-bg) 100%)',
        color: '#f3f5fe',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        transition: 'background 600ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* 3D Physical Volumetric Studio Canvas */}
      <VolumetricStudio
        lightsOn={lightsOn}
        lightColor={activeMood.color}
        spots={[35, 50, 65]}
        intensity={1}
        mousePos={mousePos}
        isFollowMode={isFollowMode}
        style={{ width: '100%', height: '100%' }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '24px clamp(20px, 4vw, 56px)',
            boxSizing: 'border-box',
          }}
        >
          {/* Top Breathable Space */}
          <div style={{ width: '100%', height: '12px' }} />

          {/* Right Side Vertical Luxury Light Switcher */}
          <div
            style={{
              position: 'absolute',
              right: 'clamp(16px, 2.5vw, 36px)',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 60,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            {/* Minimal Vertical Glass Capsule */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(6, 9, 15, 0.78)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '9999px',
                padding: '8px 6px',
                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.85)',
              }}
            >
              {/* Luxury Tactile Master Lighting Power Toggle */}
              <button
                onClick={() => setLightsOn((prev) => !prev)}
                title={
                  lightsOn
                    ? 'Studio Master Lighting: ON (Click to turn off)'
                    : 'Studio Master Lighting: STANDBY (Click to turn on)'
                }
                style={{
                  position: 'relative',
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  border: lightsOn
                    ? '1px solid rgba(197, 168, 128, 0.65)'
                    : '1px solid rgba(255, 255, 255, 0.12)',
                  background: lightsOn
                    ? 'radial-gradient(circle at center, #1f2736 0%, #0c1017 100%)'
                    : 'radial-gradient(circle at center, #141418 0%, #08080a 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 300ms cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: lightsOn
                    ? '0 0 14px rgba(197, 168, 128, 0.35), inset 0 1px 2px rgba(255, 255, 255, 0.2)'
                    : 'inset 0 2px 4px rgba(0, 0, 0, 0.8)',
                  transform: lightsOn ? 'scale(1)' : 'scale(0.95)',
                }}
              >
                {/* Active Micro-LED Indicator Ring */}
                <div
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    backgroundColor: lightsOn ? '#4ade80' : '#ef4444',
                    boxShadow: lightsOn ? '0 0 6px #4ade80' : '0 0 4px #ef4444',
                    transition: 'all 300ms ease',
                  }}
                />
                <Power
                  size={12}
                  strokeWidth={2.4}
                  color={lightsOn ? '#ffffff' : 'rgba(255, 255, 255, 0.35)'}
                  style={{
                    filter: lightsOn ? 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.6))' : 'none',
                    transition: 'all 300ms ease',
                  }}
                />
              </button>

              <div
                style={{
                  width: '14px',
                  height: '1px',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  margin: '2px 0',
                }}
              />

              {LIGHT_MOODS.map((mood) => {
                const isSelected = activeMood.id === mood.id;
                return (
                  <button
                    key={mood.id}
                    onClick={() => {
                      setActiveMood(mood);
                      if (!lightsOn) setLightsOn(true);
                    }}
                    title={`${mood.label} (${mood.temp})`}
                    style={{
                      position: 'relative',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      border: isSelected && lightsOn ? '1px solid rgba(255, 255, 255, 0.9)' : '1px solid rgba(255, 255, 255, 0.15)',
                      backgroundColor: isSelected && lightsOn ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 250ms ease',
                      boxShadow: isSelected && lightsOn ? `0 0 12px ${mood.swatch}88` : 'none',
                      opacity: lightsOn ? 1 : 0.45,
                    }}
                  >
                    <div
                      style={{
                        width: '9px',
                        height: '9px',
                        borderRadius: '50%',
                        backgroundColor: mood.swatch,
                        boxShadow: isSelected && lightsOn ? `0 0 8px ${mood.swatch}` : 'none',
                        transition: 'transform 200ms ease',
                        transform: isSelected && lightsOn ? 'scale(1.25)' : 'scale(1)',
                      }}
                    />
                  </button>
                );
              })}

              <div
                style={{
                  width: '14px',
                  height: '1px',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  margin: '2px 0',
                }}
              />

              {/* Cursor Ray Tracking Toggle */}
              <button
                onClick={() => setIsFollowMode(!isFollowMode)}
                title={isFollowMode ? 'Cursor Tracking: Active' : 'Cursor Tracking: Static'}
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  border: 'none',
                  backgroundColor: isFollowMode && lightsOn ? '#c5a880' : 'rgba(255, 255, 255, 0.08)',
                  color: isFollowMode && lightsOn ? '#000000' : 'rgba(255, 255, 255, 0.65)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 200ms ease',
                }}
              >
                <MousePointerClick size={12} />
              </button>
            </div>

            {/* Vertical Kelvin Indicator Label */}
            <span
              style={{
                fontSize: '9px',
                fontFamily: 'monospace',
                letterSpacing: '0.15em',
                color: lightsOn ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.18)',
                writingMode: 'vertical-rl',
                textOrientation: 'mixed',
                textTransform: 'uppercase',
                transition: 'color 300ms ease',
              }}
            >
              {lightsOn ? activeMood.temp : 'OFF'}
            </span>
          </div>

          {/* Center Stage: Symmetrical, Stable Human Model on Runway Podium */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              flex: 1,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            {/* Center Stage Container */}
            <div
              style={{
                position: 'relative',
                width: 'min(75vw, 330px)',
                height: 'min(48vh, 440px)',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
              }}
            >
              {/* Human Cutout Models - Clean & Sharp Feet on Stage Floor */}
              {ATELIER_COLLECTION.map((look, index) => {
                const isSelected = activeLookIndex === index;
                return (
                  <div
                    key={look.id}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      opacity: isSelected ? 1 : 0,
                      transform: isSelected ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(12px)',
                      pointerEvents: isSelected ? 'auto' : 'none',
                      transition:
                        'opacity 500ms cubic-bezier(0.16, 1, 0.3, 1), transform 500ms cubic-bezier(0.16, 1, 0.3, 1)',
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                    }}
                  >
                    <Image
                      src={look.image}
                      alt={look.name}
                      fill
                      sizes="(max-width: 768px) 85vw, 440px"
                      style={{
                        objectFit: 'contain',
                        objectPosition: 'bottom center',
                      }}
                      priority={index === 0}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Centered Symmetrical Editorial Caption (Perfect Central Runway Axis) */}
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              gap: '10px',
              zIndex: 40,
              maxWidth: '640px',
              margin: '0 auto',
              paddingTop: '6px',
            }}
          >
            {/* Occasion & Title & Fabrication */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
              <span
                style={{
                  fontSize: '10px',
                  fontFamily: 'monospace',
                  letterSpacing: '0.22em',
                  color: '#c5a880',
                  textTransform: 'uppercase',
                }}
              >
                {activeLook.category}
              </span>
              <h3
                style={{
                  margin: 0,
                  fontSize: 'clamp(18px, 2.2vw, 24px)',
                  fontFamily: 'var(--font-serif)',
                  fontWeight: 400,
                  letterSpacing: '-0.01em',
                  color: '#ffffff',
                  lineHeight: 1.15,
                }}
              >
                {activeLook.name}
              </h3>
              <span
                style={{
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.55)',
                  fontFamily: 'var(--font-inter-tight), sans-serif',
                }}
              >
                {activeLook.materials}
              </span>
            </div>

            {/* Symmetrical Numeric Capsule Center Aligned */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '6px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'rgba(6, 9, 15, 0.85)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  padding: '3px 6px',
                  borderRadius: '9999px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.7)',
                }}
              >
                {ATELIER_COLLECTION.map((look, index) => {
                  const isSelected = activeLookIndex === index;
                  return (
                    <button
                      key={look.id}
                      onClick={() => setActiveLookIndex(index)}
                      title={look.name}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '9999px',
                        fontSize: '11px',
                        fontFamily: 'monospace',
                        cursor: 'pointer',
                        border: 'none',
                        transition: 'all 250ms ease',
                        backgroundColor: isSelected ? '#ffffff' : 'transparent',
                        color: isSelected ? '#000000' : 'rgba(255, 255, 255, 0.65)',
                        fontWeight: isSelected ? 600 : 400,
                        boxShadow: isSelected ? '0 0 12px rgba(255, 255, 255, 0.3)' : 'none',
                      }}
                    >
                      {look.number}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </VolumetricStudio>
    </section>
  );
}
