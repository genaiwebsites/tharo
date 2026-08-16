'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { VolumetricStudio } from '@/components/ui/volumetric-studio';
import { ArrowUpRight, Sparkles, MousePointerClick } from 'lucide-react';

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
    id: 'sherwani',
    number: '01',
    name: 'The Imperial Ivory Sherwani',
    category: 'Royal Nuptials',
    materials: 'Hand-woven Raw Silk · Silver Micro-Zari Resham',
    image: '/images/studio/model-ivory-sherwani.png',
  },
  {
    id: 'tuxedo',
    number: '02',
    name: 'The Midnight Velvet Tuxedo',
    category: 'Black Tie Ceremonial',
    materials: 'Milano Silk-Cotton Velvet · Pure Silk Faille Lapels',
    image: '/images/studio/model-midnight-tuxedo.png',
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
    id: 'oxblood',
    number: '04',
    name: 'The Ruby Oxblood Velvet Bandhgala',
    category: 'Sovereign Evening',
    materials: 'Deep Wine Silk Velvet · Antique Gold Marodi Embroidery',
    image: '/images/studio/model-oxblood-velvet.png',
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
    color: '240,246,255',
    swatch: '#ffffff',
  },
  {
    id: 'amber',
    label: 'Imperial Amber',
    temp: '3000K',
    color: '252,216,162',
    swatch: '#f5c070',
  },
  {
    id: 'indigo',
    label: 'Midnight Indigo',
    temp: '7500K',
    color: '145,182,255',
    swatch: '#8fb4ff',
  },
  {
    id: 'ruby',
    label: 'Ruby Dusk',
    temp: '2600K',
    color: '255,160,185',
    swatch: '#f78ca5',
  },
];

export default function VolumetricAtelierStudio() {
  const [activeLookIndex, setActiveLookIndex] = useState<number>(0);
  const [activeMood, setActiveMood] = useState<LightMood>(LIGHT_MOODS[0]);
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
                background: 'rgba(6, 9, 15, 0.75)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '9999px',
                padding: '10px 6px',
                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.85)',
              }}
            >
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '2px',
                }}
              >
                <Sparkles size={11} color="#c5a880" />
              </div>

              {LIGHT_MOODS.map((mood) => {
                const isSelected = activeMood.id === mood.id;
                return (
                  <button
                    key={mood.id}
                    onClick={() => setActiveMood(mood)}
                    title={`${mood.label} (${mood.temp})`}
                    style={{
                      position: 'relative',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      border: isSelected ? '1px solid rgba(255, 255, 255, 0.9)' : '1px solid rgba(255, 255, 255, 0.15)',
                      backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 250ms ease',
                      boxShadow: isSelected ? `0 0 12px ${mood.swatch}88` : 'none',
                    }}
                  >
                    <div
                      style={{
                        width: '9px',
                        height: '9px',
                        borderRadius: '50%',
                        backgroundColor: mood.swatch,
                        boxShadow: isSelected ? `0 0 8px ${mood.swatch}` : 'none',
                        transition: 'transform 200ms ease',
                        transform: isSelected ? 'scale(1.25)' : 'scale(1)',
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
                  margin: '4px 0',
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
                  backgroundColor: isFollowMode ? '#c5a880' : 'rgba(255, 255, 255, 0.08)',
                  color: isFollowMode ? '#000000' : 'rgba(255, 255, 255, 0.65)',
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
                color: 'rgba(255, 255, 255, 0.4)',
                writingMode: 'vertical-rl',
                textOrientation: 'mixed',
                textTransform: 'uppercase',
              }}
            >
              {activeMood.temp}
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
                width: 'min(90vw, 440px)',
                height: 'min(66vh, 620px)',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
              }}
            >
              {/* Floor Light Disc under Model Feet */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-12px',
                  width: '420px',
                  height: '46px',
                  borderRadius: '50%',
                  background: `radial-gradient(ellipse, rgba(${activeMood.color}, 0.5) 0%, rgba(${activeMood.color}, 0.1) 48%, transparent 76%)`,
                  filter: 'blur(12px)',
                  transition: 'background 500ms ease',
                }}
              />

              {/* Contact Shoe Shadow */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-1px',
                  width: '180px',
                  height: '12px',
                  borderRadius: '50%',
                  background: 'rgba(0, 0, 0, 0.9)',
                  filter: 'blur(4px)',
                }}
              />

              {/* Human Cutout Models - Perfectly Stable & Still */}
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
                        filter: 'drop-shadow(0 20px 30px rgba(0, 0, 0, 0.95))',
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

            {/* Symmetrical Numeric Capsule & Appointment CTA */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '2px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'rgba(6, 9, 15, 0.82)',
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
                        padding: '4px 11px',
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

              <a
                href={`https://wa.me/919062512323?text=${encodeURIComponent(
                  `Khamma Ghani. I am inquiring about a private atelier fitting for ${activeLook.name} at Tharo Menswear Allenby Road Atelier.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#c5a880',
                  textDecoration: 'none',
                  borderBottom: '1px solid rgba(197, 168, 128, 0.4)',
                  paddingBottom: '2px',
                  transition: 'color 200ms ease, border-color 200ms ease',
                }}
              >
                <span>Reserve Studio Fitting</span>
                <ArrowUpRight size={11} />
              </a>
            </div>
          </div>
        </div>
      </VolumetricStudio>
    </section>
  );
}
