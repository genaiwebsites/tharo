'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { StoreStatus } from '@/lib/types';
import { SectionScrim } from '@/components/common/SectionScrim';

interface HeroThresholdProps {
  storeStatus: StoreStatus;
}

const TOTAL_FRAMES = 240;

export default function HeroThreshold({ storeStatus }: HeroThresholdProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const currentFrameRef = useRef<number>(0);
  const targetFrameRef = useRef<number>(0);
  const lastDrawnFrameRef = useRef<number>(-1);

  const veilRef = useRef<HTMLDivElement>(null);
  const beat1Ref = useRef<HTMLDivElement>(null);
  const beat2Ref = useRef<HTMLDivElement>(null);
  const beat3Ref = useRef<HTMLDivElement>(null);
  const heroSideRef = useRef<HTMLDivElement>(null);
  const heroFootRef = useRef<HTMLDivElement>(null);

  const [activeTick, setActiveTick] = useState<number>(0);

  // 1. Crystal-Clear Canvas Render Function
  const renderFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const clampedIdx = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(frameIdx)));

    // Find closest loaded image if exact frame is still buffering
    let img = imagesRef.current[clampedIdx];
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let offset = 1; offset < 30; offset++) {
        const left = imagesRef.current[Math.max(0, clampedIdx - offset)];
        if (left && left.complete && left.naturalWidth > 0) {
          img = left;
          break;
        }
        const right = imagesRef.current[Math.min(TOTAL_FRAMES - 1, clampedIdx + offset)];
        if (right && right.complete && right.naturalWidth > 0) {
          img = right;
          break;
        }
      }
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const w = canvas.width;
    const h = canvas.height;

    // Enable high-fidelity bicubic canvas smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Cinematic cover fitting
    const hRatio = w / img.naturalWidth;
    const vRatio = h / img.naturalHeight;
    const ratio = Math.max(hRatio, vRatio);

    const drawW = Math.round(img.naturalWidth * ratio);
    const drawH = Math.round(img.naturalHeight * ratio);
    const shiftX = Math.round((w - drawW) / 2);
    const shiftY = Math.round((h - drawH) / 2);

    ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, shiftX, shiftY, drawW, drawH);
    lastDrawnFrameRef.current = clampedIdx;
  }, []);

  // 2. High-DPI Canvas Sizing
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;

      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      renderFrame(currentFrameRef.current);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [renderFrame]);

  // 3. Fast Background Async Preloader with Native GPU Image Decoding
  useEffect(() => {
    let isCancelled = false;

    const getFrameUrl = (idx: number) => {
      const pad = (idx + 1).toString().padStart(3, '0');
      return `/images/threshold-sequence/frame-${pad}.jpg`;
    };

    // Load and decode Frame 0 immediately
    const img0 = new window.Image();
    img0.src = getFrameUrl(0);
    img0.onload = async () => {
      if (isCancelled) return;
      try {
        if ('decode' in img0) await img0.decode();
      } catch {
        // ignore decode errors
      }
      imagesRef.current[0] = img0;
      renderFrame(0);
    };

    // Stream-load all 240 frames in background chunks with decode
    const preloadStream = async () => {
      // Stage 1: Load 24 evenly spaced anchor frames
      const anchorIndices = Array.from({ length: 24 }, (_, i) => Math.floor(i * (TOTAL_FRAMES / 24)));
      for (const idx of anchorIndices) {
        if (isCancelled) return;
        if (!imagesRef.current[idx]) {
          const img = new window.Image();
          img.src = getFrameUrl(idx);
          img.onload = async () => {
            if (isCancelled) return;
            try {
              if ('decode' in img) await img.decode();
            } catch {}
            imagesRef.current[idx] = img;
            if (Math.round(currentFrameRef.current) === idx) {
              renderFrame(idx);
            }
          };
        }
      }

      // Stage 2: Fill in the remaining frames
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        if (isCancelled) return;
        if (!imagesRef.current[i]) {
          const img = new window.Image();
          img.src = getFrameUrl(i);
          img.onload = async () => {
            if (isCancelled) return;
            try {
              if ('decode' in img) await img.decode();
            } catch {}
            imagesRef.current[i] = img;
            if (Math.round(currentFrameRef.current) === i) {
              renderFrame(i);
            }
          };
          if (i % 6 === 0) {
            await new Promise((r) => setTimeout(r, 6));
          }
        }
      }
    };

    preloadStream();

    return () => {
      isCancelled = true;
    };
  }, [renderFrame]);

  // 4. Butter-Smooth Physics Animation Loop (Lerped Frame Scrubbing)
  useEffect(() => {
    let animId: number;

    const tick = () => {
      const diff = targetFrameRef.current - currentFrameRef.current;
      if (Math.abs(diff) > 0.01) {
        currentFrameRef.current += diff * 0.22;
        const targetInt = Math.round(currentFrameRef.current);
        if (targetInt !== lastDrawnFrameRef.current) {
          renderFrame(targetInt);
        }
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [renderFrame]);

  // 5. Scroll Sync & Glassmorphism Reveal Transitions
  useEffect(() => {
    const handleScroll = () => {
      const s = sectionRef.current;
      if (!s) return;
      const span = Math.max(1, s.offsetHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, -s.getBoundingClientRect().top / span));

      // Update target frame for physics lerp loop
      targetFrameRef.current = p * (TOTAL_FRAMES - 1);

      const cl = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
      const seg = (a: number, b: number) => cl((p - a) / (b - a));
      const ez = (t: number) => t * t * (3 - 2 * t);

      // Glassmorphism Veil Reveal (Dissolves from p = 0 to 0.16)
      const veilFade = ez(seg(0.0, 0.16));
      if (veilRef.current) {
        veilRef.current.style.opacity = (1 - veilFade).toFixed(3);
        veilRef.current.style.backdropFilter = `blur(${(28 * (1 - veilFade)).toFixed(1)}px)`;
        veilRef.current.style.visibility = veilFade > 0.99 ? 'hidden' : 'visible';
      }

      // Beat 1: Monumental Logo & Salutation (Visible at start, gently lifts and clears as storefront opens)
      const b1Out = ez(seg(0.04, 0.22));
      if (beat1Ref.current) {
        beat1Ref.current.style.opacity = (1 - b1Out).toFixed(3);
        beat1Ref.current.style.transform = `scale(${(1 + b1Out * 0.25).toFixed(3)}) translate3d(0, ${(b1Out * -40).toFixed(1)}px, 0)`;
        beat1Ref.current.style.visibility = b1Out > 0.99 ? 'hidden' : 'visible';
      }

      // Beat 2: Entering the Grand Atelier Salon (0.28 to 0.62)
      const in2 = ez(seg(0.28, 0.42));
      const out2 = ez(seg(0.56, 0.68));

      // Beat 3: The Private Fitting Suite (0.64 to 0.96)
      const in3 = ez(seg(0.66, 0.82));

      const setBeat = (el: HTMLDivElement | null, inT: number, outT: number) => {
        if (!el) return;
        const v = Math.max(0, inT - outT);
        el.style.opacity = v.toFixed(3);
        el.style.transform = `translate3d(0, ${((1 - inT) * 32 - outT * 26).toFixed(1)}px, 0)`;
        el.style.visibility = v > 0.015 ? 'visible' : 'hidden';
        el.style.pointerEvents = v > 0.6 ? 'auto' : 'none';
      };

      setBeat(beat2Ref.current, in2, out2);
      setBeat(beat3Ref.current, in3, 0);

      if (heroSideRef.current) {
        heroSideRef.current.style.opacity = (Math.max(in2 - out2, in3) * 0.95).toFixed(3);
      }

      if (heroFootRef.current) {
        const fo = 1 - ez(seg(0.02, 0.14));
        heroFootRef.current.style.opacity = fo.toFixed(3);
        heroFootRef.current.style.visibility = fo > 0.02 ? 'visible' : 'hidden';
      }

      // Ticks navigation
      const idx = p < 0.3 ? 0 : p < 0.64 ? 1 : 2;
      setActiveTick(idx);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section
      id="threshold"
      data-screen-label="Threshold"
      ref={sectionRef}
      style={{
        position: 'relative',
        height: '420vh',
        background: '#0b0f18',
      }}
    >
      <SectionScrim showTop={false} showBottom={true} height={180} />

      <div style={{ position: 'sticky', top: 0, height: '100svh', overflow: 'hidden' }}>
        {/* Full-Screen Crisp 1080p Scrollytelling Canvas */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            display: 'block',
          }}
        />

        {/* Initial High-Suspense Frosted Glassmorphism Veil (Smoothly dissolves on initial scroll) */}
        <div
          ref={veilRef}
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 3,
            pointerEvents: 'none',
            background:
              'radial-gradient(ellipse at center, rgba(11, 15, 24, 0.72) 0%, rgba(11, 15, 24, 0.88) 100%)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            transition: 'opacity 150ms ease-out',
            willChange: 'opacity, backdrop-filter',
          }}
        />

        {/* Ambient Edge Vignette (Clean cinematic luxury frame, no mouse hover glitches) */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 4,
            pointerEvents: 'none',
            background:
              'radial-gradient(ellipse 95% 85% at 50% 50%, transparent 60%, rgba(11, 15, 24, 0.75) 100%)',
          }}
        />

        {/* Left Side Reading Scrim for Story Beats */}
        <div
          ref={heroSideRef}
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 5,
            opacity: 0,
            background:
              'linear-gradient(90deg, rgba(11, 15, 24, 0.94) 0%, rgba(11, 15, 24, 0.7) 42%, rgba(11, 15, 24, 0.1) 80%)',
            transition: 'opacity 400ms ease',
            pointerEvents: 'none',
          }}
        />

        {/* Narrative Beats Overlaid in 3D Perspective */}
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
          {/* Beat 1: Initial Centered Shimmering Wordmark & Cultural Greeting */}
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
              <p className="devanagari-3d-metallic">खम्मा घणी</p>
            </div>

            {/* 3D Atmospheric Aura Glow */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: '50%',
                top: '52%',
                width: '140%',
                height: '180%',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                zIndex: -1,
                background:
                  'radial-gradient(ellipse 65% 45% at 50% 50%, rgba(207, 211, 229, 0.2) 0%, rgba(197, 168, 128, 0.12) 45%, transparent 75%)',
                filter: 'blur(34px)',
                animation: 'hero-glow-pulse 5s ease-in-out infinite',
              }}
            />

            {/* Authentic Brand Wordmark with Infinitely Running 3D Metallic Shimmer */}
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
                  animation:
                    'th-rise 1100ms cubic-bezier(0.16, 1, 0.3, 1) 120ms both, metallic-sheen 6.5s linear infinite',
                }}
              />
            </h1>

            {/* Editorial Subtitle with Luminous Gold Gradient Hairlines */}
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

          {/* Beat 2: Inside the Flagship Atelier Salon */}
          <div
            ref={beat2Ref}
            style={{
              gridArea: '1/1',
              justifySelf: 'start',
              maxWidth: 'min(88vw, 26ch)',
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
                color: '#c5a880',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#c5a880' }} />
              31 Allenby Road · Grand Atelier
            </p>
            <h2
              style={{
                margin: 0,
                fontFamily: 'var(--font-cormorant), var(--font-cinzel), Georgia, serif',
                fontWeight: 400,
                fontSize: 'clamp(32px, 4.8vh, 58px)',
                lineHeight: 1.08,
                color: '#f3f5fe',
                textWrap: 'pretty',
              }}
            >
              Step across the threshold.
            </h2>
            <p
              style={{
                margin: 'clamp(14px, 2.6vh, 30px) 0 0',
                maxWidth: '34ch',
                fontSize: 'clamp(14.5px, 2.9vh, 16.5px)',
                lineHeight: 1.66,
                color: '#cfd3e5',
              }}
            >
              A sanctuary of Rajasthani zardozi, raw silk archives, and master Calcutta tailoring. Cut for one gentleman at a time.
            </p>
          </div>

          {/* Beat 3: The Private Fitting Sanctuary */}
          <div
            ref={beat3Ref}
            style={{
              gridArea: '1/1',
              justifySelf: 'start',
              maxWidth: 'min(88vw, 26ch)',
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
                color: '#c5a880',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#c5a880' }} />
              The Fitting Suite
            </p>
            <h2
              style={{
                margin: 0,
                fontFamily: 'var(--font-cormorant), var(--font-cinzel), Georgia, serif',
                fontWeight: 400,
                fontSize: 'clamp(32px, 4.8vh, 58px)',
                lineHeight: 1.08,
                color: '#f3f5fe',
                textWrap: 'pretty',
              }}
            >
              A garment made for everyone belongs to no one.
            </h2>
            <p
              style={{
                margin: 'clamp(14px, 2.6vh, 30px) 0 0',
                maxWidth: '36ch',
                fontSize: 'clamp(14.5px, 2.9vh, 16.5px)',
                lineHeight: 1.66,
                color: '#cfd3e5',
              }}
            >
              42 anatomical coordinates. Private consultations. Every silhouette below was crafted entirely by hand for a single client.
            </p>
            <Link
              href="#fitting-room"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                marginTop: 'clamp(18px, 3vh, 34px)',
                padding: '14px 28px',
                background: 'rgba(197, 168, 128, 0.12)',
                border: '1px solid rgba(197, 168, 128, 0.65)',
                borderRadius: '8px',
                fontSize: '11.5px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#f3f5fe',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5), inset 0 0 12px rgba(197, 168, 128, 0.15)',
                transition: 'all 300ms cubic-bezier(0.16, 1, 0.3, 1)',
                textDecoration: 'none',
              }}
            >
              Book a private fitting
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 8h12M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Right Side Journey Progress Ticks */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: 'clamp(20px, 3vw, 42px)',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 15,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '16px',
          }}
        >
          {[
            { id: 0, label: '01 · Threshold' },
            { id: 1, label: '02 · Grand Salon' },
            { id: 2, label: '03 · Fitting Suite' },
          ].map((t) => (
            <div
              key={t.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <span
                style={{
                  fontSize: '9.5px',
                  fontFamily: 'monospace',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: activeTick === t.id ? '#c5a880' : '#5f6472',
                  opacity: activeTick === t.id ? 1 : 0.45,
                  transition: 'all 400ms ease',
                }}
              >
                {t.label}
              </span>
              <span
                style={{
                  display: 'block',
                  width: activeTick === t.id ? '36px' : '14px',
                  height: '1.5px',
                  background: activeTick === t.id ? '#c5a880' : '#5f6472',
                  boxShadow: activeTick === t.id ? '0 0 8px rgba(197, 168, 128, 0.6)' : 'none',
                  transition:
                    'width 500ms cubic-bezier(0.16, 1, 0.3, 1), background 500ms ease, box-shadow 500ms ease',
                }}
              />
            </div>
          ))}
        </div>

        {/* Hero Footer: Clean Luxury Scroll Cue */}
        <div
          ref={heroFootRef}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 15,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            padding: '0 clamp(22px, 6.5vw, 92px) 34px',
            transition: 'opacity 400ms ease',
          }}
        >
          {/* Atelier Status */}
          <div
            style={{
              fontSize: '11px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#c5a880',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#c5a880',
                boxShadow: '0 0 8px #c5a880',
              }}
            />
            <span>31 Allenby Road, Kolkata</span>
          </div>

          {/* Interactive Scroll Cue */}
          <div
            style={{
              fontSize: '11px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#cfd3e5',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 14px',
              background: 'rgba(11, 15, 24, 0.6)',
              border: '1px solid rgba(207, 211, 229, 0.2)',
              borderRadius: '20px',
              backdropFilter: 'blur(8px)',
            }}
          >
            <span>Scroll to unveil atelier</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M6 2v8M2.5 6.5L6 10l3.5-3.5" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
