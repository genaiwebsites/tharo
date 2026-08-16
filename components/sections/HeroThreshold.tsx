'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { StoreStatus } from '@/lib/types';

interface HeroThresholdProps {
  storeStatus: StoreStatus;
}

export default function HeroThreshold({ storeStatus }: HeroThresholdProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const heroARef = useRef<HTMLDivElement>(null);
  const heroBRef = useRef<HTMLDivElement>(null);
  const heroCRef = useRef<HTMLDivElement>(null);
  const heroSideRef = useRef<HTMLDivElement>(null);
  const beat1Ref = useRef<HTMLDivElement>(null);
  const beat2Ref = useRef<HTMLDivElement>(null);
  const beat3Ref = useRef<HTMLDivElement>(null);
  const heroFootRef = useRef<HTMLDivElement>(null);

  const [activeTick, setActiveTick] = useState<number>(0);
  const [footReady, setFootReady] = useState<boolean>(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Interactive mouse tracking for high-fashion raking light & parallax
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    const x = nx * 100;
    const y = ny * 100;

    setMousePos({
      x: (nx - 0.5) * 2,
      y: (ny - 0.5) * 2,
    });

    const caX = (nx - 0.5) * 4;
    const caY = (ny - 0.5) * 2;

    document.documentElement.style.setProperty('--spec-x', `${x.toFixed(1)}%`);
    document.documentElement.style.setProperty('--spec-y', `${y.toFixed(1)}%`);
    document.documentElement.style.setProperty('--ca-x', `${caX.toFixed(2)}px`);
    document.documentElement.style.setProperty('--ca-y', `${caY.toFixed(2)}px`);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setFootReady(true);
    }, 2000);

    const handleScroll = () => {
      const s = sectionRef.current;
      if (!s) return;
      const span = Math.max(1, s.offsetHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, -s.getBoundingClientRect().top / span));

      const cl = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
      const seg = (a: number, b: number) => cl((p - a) / (b - a));
      const ez = (t: number) => t * t * (3 - 2 * t);

      // Beat 1
      const out1 = ez(seg(0.06, 0.3));
      if (beat1Ref.current) {
        beat1Ref.current.style.opacity = (1 - out1).toFixed(3);
        beat1Ref.current.style.transform = `scale(${(1 + out1 * 0.45).toFixed(3)}) translate3d(0, ${(out1 * -30).toFixed(1)}px, 0)`;
        beat1Ref.current.style.filter = out1 > 0.02 ? `blur(${(out1 * 10).toFixed(2)}px)` : 'none';
        beat1Ref.current.style.visibility = out1 > 0.99 ? 'hidden' : 'visible';
      }

      // Beat 2 and 3
      const in2 = ez(seg(0.26, 0.44));
      const out2 = ez(seg(0.56, 0.68));
      const in3 = ez(seg(0.64, 0.84));

      const setBeat = (el: HTMLDivElement | null, inT: number, outT: number) => {
        if (!el) return;
        const v = Math.max(0, inT - outT);
        el.style.opacity = v.toFixed(3);
        el.style.transform = `translate3d(0, ${((1 - inT) * 36 - outT * 30).toFixed(1)}px, 0)`;
        el.style.visibility = v > 0.015 ? 'visible' : 'hidden';
        el.style.pointerEvents = v > 0.6 ? 'auto' : 'none';
      };

      setBeat(beat2Ref.current, in2, out2);
      setBeat(beat3Ref.current, in3, 0);

      if (heroSideRef.current) {
        heroSideRef.current.style.opacity = (Math.max(in2 - out2, in3) * 0.92).toFixed(3);
      }

      if (heroFootRef.current && footReady) {
        const fo = 1 - ez(seg(0.02, 0.15));
        heroFootRef.current.style.opacity = fo.toFixed(3);
        heroFootRef.current.style.pointerEvents = fo > 0.05 ? 'auto' : 'none';
        heroFootRef.current.style.visibility = fo > 0.02 ? 'visible' : 'hidden';
      }

      // Background image transitions
      const aOut = ez(seg(0.14, 0.38));
      const bIn = ez(seg(0.2, 0.4));
      const bOut = ez(seg(0.56, 0.74));
      const cIn = ez(seg(0.58, 0.84));

      if (heroARef.current) {
        heroARef.current.style.opacity = (0.88 * (1 - aOut)).toFixed(3);
        heroARef.current.style.transform = `translate3d(${(mousePos.x * -16).toFixed(1)}px, ${(p * -80 + mousePos.y * -16).toFixed(1)}px, 0) scale(${(1.05 + p * 0.12).toFixed(3)})`;
      }
      if (heroBRef.current) {
        heroBRef.current.style.opacity = (0.8 * bIn * (1 - bOut)).toFixed(3);
        heroBRef.current.style.transform = `translate3d(${(mousePos.x * -24).toFixed(1)}px, ${((p - 0.3) * -120 + mousePos.y * -24).toFixed(1)}px, 0) scale(${(1.2 - bIn * 0.12).toFixed(3)})`;
      }
      if (heroCRef.current) {
        heroCRef.current.style.opacity = (0.9 * cIn).toFixed(3);
        heroCRef.current.style.transform = `translate3d(0, ${((p - 0.62) * -90).toFixed(1)}px, 0) scale(${(1.14 - cIn * 0.11).toFixed(3)})`;
      }

      // Ticks
      const idx = p < 0.32 ? 0 : p < 0.62 ? 1 : 2;
      setActiveTick(idx);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [footReady, mousePos.x, mousePos.y]);

  return (
    <section
      id="threshold"
      data-screen-label="Threshold"
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      style={{
        position: 'relative',
        height: '330vh',
        background: '#0b0f18',
      }}
    >
      <div style={{ position: 'sticky', top: 0, height: '100svh', overflow: 'hidden' }}>
        {/* Layer 1: Curated Editorial Campaign Background 1 */}
        <div
          ref={heroARef}
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: '-8%',
            backgroundImage: 'url(/images/hero_editorial_1.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center 35%',
            opacity: 0.88,
            willChange: 'transform, opacity',
            transition: 'transform 120ms ease-out',
            filter: 'contrast(1.08) brightness(0.9)',
          }}
        />

        {/* Layer 2: Editorial Campaign Background 2 (Reveals on Beat 2) */}
        <div
          ref={heroBRef}
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: '-8%',
            backgroundImage: 'url(/images/hero_editorial_2.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center 45%',
            opacity: 0,
            willChange: 'transform, opacity',
            transition: 'transform 120ms ease-out',
            filter: 'contrast(1.06) brightness(0.88)',
          }}
        />

        {/* Layer 3: Bespoke Sequin Tuxedo Texture (Beat 3) */}
        <div
          ref={heroCRef}
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: '-8%',
            backgroundImage: 'url(/images/blue_tux_sequin.png)',
            backgroundSize: 'cover',
            backgroundPosition: '56% 26%',
            opacity: 0,
            willChange: 'transform, opacity',
          }}
        />

        {/* Refined Ambient Luxury Vignette & Cursor-Following Raking Light */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 4,
            background:
              'radial-gradient(130% 90% at var(--spec-x, 50%) var(--spec-y, 35%), rgba(11, 15, 24, 0.2) 0%, rgba(11, 15, 24, 0.65) 55%, rgba(11, 15, 24, 0.94) 100%)',
            transition: 'background 80ms ease-out',
            pointerEvents: 'none',
          }}
        />
        <div
          ref={heroSideRef}
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 4,
            opacity: 0,
            background:
              'linear-gradient(90deg, rgba(11, 15, 24, 0.95) 0%, rgba(11, 15, 24, 0.65) 45%, rgba(11, 15, 24, 0.1) 85%)',
            transition: 'opacity 500ms ease',
            pointerEvents: 'none',
          }}
        />

        {/* Narrative Beats */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 10,
            display: 'grid',
            alignItems: 'center',
            padding: '84px 32px 40px clamp(22px, 7vw, 92px)',
          }}
        >
          {/* Beat 1: 3D Wordmark & Cultural Greeting */}
          <div
            ref={beat1Ref}
            style={{
              gridArea: '1/1',
              justifySelf: 'center',
              textAlign: 'center',
              willChange: 'transform, opacity',
              position: 'relative',
            }}
          >
            {/* Cultural Devanagari Greeting with 3D Metallic Gold Shader */}
            <div>
              <p className="devanagari-3d-metallic">
                खम्मा घणी
              </p>
            </div>

            {/* 3D Atmospheric Aura */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: '50%',
                top: '52%',
                width: '130%',
                height: '170%',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                zIndex: -1,
                background:
                  'radial-gradient(ellipse 65% 45% at 50% 50%, rgba(207, 211, 229, 0.16) 0%, rgba(197, 168, 128, 0.08) 45%, transparent 75%)',
                filter: 'blur(32px)',
                animation: 'hero-glow-pulse 5s ease-in-out infinite',
              }}
            />

            {/* Authentic HD Brand Wordmark with 3D Metallic Shimmer Shader */}
            <h1
              aria-label="THARO"
              style={{
                margin: 0,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <div
                className="tharo-3d-wordmark tharo-3d-wordmark-hero"
                role="img"
                aria-label="THARO"
                style={{
                  animation: 'th-rise 1100ms cubic-bezier(0.16, 1, 0.3, 1) 120ms both, metallic-sheen 6.5s linear infinite',
                }}
              />
            </h1>

            {/* Editorial Subtitle with Luminous Gradient Hairlines */}
            <div
              style={{
                marginTop: 'clamp(22px, 2.6vw, 34px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '18px',
                animation: 'th-fade 1000ms ease 250ms both',
              }}
            >
              <span
                style={{
                  height: '1px',
                  width: 'clamp(28px, 4.5vw, 56px)',
                  background: 'linear-gradient(90deg, transparent, rgba(197, 168, 128, 0.55))',
                }}
              />
              <p
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-cormorant), Georgia, serif',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  fontSize: 'clamp(18px, 1.85vw, 26px)',
                  letterSpacing: '0.04em',
                  color: '#ded7cb',
                  textShadow: '0 2px 14px rgba(0, 0, 0, 0.95)',
                  lineHeight: 1.2,
                }}
              >
                Designed for you
              </p>
              <span
                style={{
                  height: '1px',
                  width: 'clamp(28px, 4.5vw, 56px)',
                  background: 'linear-gradient(90deg, rgba(197, 168, 128, 0.55), transparent)',
                }}
              />
            </div>
          </div>

          {/* Beat 2: Principle */}
          <div
            ref={beat2Ref}
            style={{
              gridArea: '1/1',
              justifySelf: 'start',
              maxWidth: 'min(88vw, 21ch)',
              opacity: 0,
              willChange: 'transform, opacity',
            }}
          >
            <p
              style={{
                margin: '0 0 16px',
                fontSize: '11px',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: '#8a7f70',
              }}
            >
              31 Allenby Road
            </p>
            <h2
              style={{
                margin: 0,
                fontFamily: 'var(--font-cormorant), var(--font-cinzel), Georgia, serif',
                fontWeight: 400,
                fontSize: 'clamp(30px, 4.6vh, 56px)',
                lineHeight: 1.08,
                color: '#f3f5fe',
                textWrap: 'pretty',
              }}
            >
              Bespoke menswear on Allenby Road, Kolkata.
            </h2>
            <p
              style={{
                margin: 'clamp(14px, 2.6vh, 30px) 0 0',
                maxWidth: '32ch',
                fontSize: 'clamp(14.5px, 2.9vh, 16.5px)',
                lineHeight: 1.66,
                color: '#9397ab',
              }}
            >
              Rajasthani hand-work. Calcutta tailoring. Cut for one person.
            </p>
          </div>

          {/* Beat 3: Two Rooms */}
          <div
            ref={beat3Ref}
            style={{
              gridArea: '1/1',
              justifySelf: 'start',
              maxWidth: 'min(88vw, 22ch)',
              opacity: 0,
              willChange: 'transform, opacity',
            }}
          >
            <p
              style={{
                margin: '0 0 16px',
                fontSize: '11px',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: '#8a7f70',
              }}
            >
              The House
            </p>
            <h2
              style={{
                margin: 0,
                fontFamily: 'var(--font-cormorant), var(--font-cinzel), Georgia, serif',
                fontWeight: 400,
                fontSize: 'clamp(30px, 4.6vh, 56px)',
                lineHeight: 1.08,
                color: '#f3f5fe',
                textWrap: 'pretty',
              }}
            >
              A suit made for everyone belongs to no one.
            </h2>
            <p
              style={{
                margin: 'clamp(14px, 2.6vh, 30px) 0 0',
                maxWidth: '34ch',
                fontSize: 'clamp(14.5px, 2.9vh, 16.5px)',
                lineHeight: 1.66,
                color: '#9397ab',
              }}
            >
              Two rooms — one cool, one warm — and a wedding book that runs to five events. Everything below was worked by hand for one client.
            </p>
            <Link
              href="#fitting-room"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                marginTop: 'clamp(18px, 3vh, 34px)',
                padding: '14px 26px',
                border: '1px solid rgba(207, 211, 229, 0.5)',
                borderRadius: '8px',
                fontSize: '11.5px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#f3f5fe',
                transition: 'all 300ms cubic-bezier(0.16, 1, 0.3, 1)',
                textDecoration: 'none',
              }}
            >
              Book a fitting
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 8h12M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.1" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Right side tick marks */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: '30px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '14px',
          }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                display: 'block',
                width: activeTick === i ? '30px' : '12px',
                height: '1px',
                background: '#cfd3e5',
                opacity: activeTick === i ? 0.85 : 0.28,
                transition: 'width 600ms cubic-bezier(0.16, 1, 0.3, 1), opacity 600ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
          ))}
        </div>

        {/* Hero Footer: Clean Scroll Cue */}
        <div
          ref={heroFootRef}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            padding: '0 32px 34px clamp(22px, 6.5vw, 92px)',
            opacity: 0,
            animation: 'th-fade 1400ms cubic-bezier(0.16, 1, 0.3, 1) 900ms both',
          }}
        >

          <div
            style={{
              fontSize: '11px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#5f6472',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>Scroll</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M6 2v8M2.5 6.5L6 10l3.5-3.5" stroke="currentColor" strokeWidth="1.1" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
