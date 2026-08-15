'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
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
  const oLoopRef = useRef<SVGEllipseElement>(null);
  const lettersRef = useRef<HTMLSpanElement[]>([]);

  const [activeTick, setActiveTick] = useState<number>(0);
  const [footReady, setFootReady] = useState<boolean>(false);

  // Anisotropic specular highlight tracking
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    document.documentElement.style.setProperty('--spec-x', `${x.toFixed(1)}%`);
    document.documentElement.style.setProperty('--spec-y', `${y.toFixed(1)}%`);
  };

  useEffect(() => {
    // O-loop SVG animation
    if (oLoopRef.current) {
      const L = oLoopRef.current.getTotalLength();
      oLoopRef.current.style.strokeDasharray = `${L}`;
      oLoopRef.current.style.strokeDashoffset = `${L}`;
      oLoopRef.current.style.transition = 'stroke-dashoffset 1600ms cubic-bezier(0.16, 1, 0.3, 1) 600ms';
      requestAnimationFrame(() => {
        if (oLoopRef.current) oLoopRef.current.style.strokeDashoffset = '0';
      });
    }

    const timer = setTimeout(() => {
      setFootReady(true);
    }, 2600);

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
        beat1Ref.current.style.transform = `scale(${(1 + out1 * 0.5).toFixed(3)})`;
        beat1Ref.current.style.filter = out1 > 0.02 ? `blur(${(out1 * 11).toFixed(2)}px)` : 'none';
        beat1Ref.current.style.visibility = out1 > 0.99 ? 'hidden' : 'visible';
      }

      lettersRef.current.forEach((ltr, i) => {
        if (ltr) {
          ltr.style.transform = `translate3d(${((i - 2) * out1 * 54).toFixed(1)}px, 0, 0)`;
        }
      });

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
        heroARef.current.style.opacity = (0.78 * (1 - aOut)).toFixed(3);
        heroARef.current.style.transform = `translate3d(0, ${(p * -80).toFixed(1)}px, 0) scale(${(1.05 + p * 0.12).toFixed(3)})`;
      }
      if (heroBRef.current) {
        heroBRef.current.style.opacity = (0.66 * bIn * (1 - bOut)).toFixed(3);
        heroBRef.current.style.transform = `translate3d(0, ${((p - 0.3) * -120).toFixed(1)}px, 0) scale(${(1.2 - bIn * 0.12).toFixed(3)})`;
      }
      if (heroCRef.current) {
        heroCRef.current.style.opacity = (0.88 * cIn).toFixed(3);
        heroCRef.current.style.transform = `translate3d(0, ${((p - 0.62) * -90).toFixed(1)}px, 0) scale(${(1.14 - cIn * 0.11).toFixed(3)})`;
        if (cIn > 0.004 && cIn < 0.985) {
          const ms = `${(380 - 280 * cIn).toFixed(0)}%`;
          heroCRef.current.style.maskImage = 'url(/images/mask_cornelli.png)';
          heroCRef.current.style.webkitMaskImage = 'url(/images/mask_cornelli.png)';
          heroCRef.current.style.maskPosition = '38% 28%';
          heroCRef.current.style.webkitMaskPosition = '38% 28%';
          heroCRef.current.style.maskSize = ms;
          heroCRef.current.style.webkitMaskSize = ms;
        } else {
          heroCRef.current.style.maskImage = 'none';
          heroCRef.current.style.webkitMaskImage = 'none';
        }
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
  }, [footReady]);

  return (
    <section
      id="threshold"
      data-screen-label="Threshold"
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      style={{
        position: 'relative',
        height: '330vh',
        background: '#0b0f18'
      }}
    >
      <div style={{ position: 'sticky', top: 0, height: '100svh', overflow: 'hidden' }}>
        {/* Layered photographic fabric textures */}
        <div
          ref={heroARef}
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: '-7%',
            backgroundImage: 'url(/images/hero_bead.png)',
            backgroundSize: 'cover',
            backgroundPosition: '50% 38%',
            opacity: 0.78,
            willChange: 'transform, opacity'
          }}
        />
        <div
          ref={heroBRef}
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: '-7%',
            backgroundImage: 'url(/images/macro_cornelli_b.png)',
            backgroundSize: 'cover',
            backgroundPosition: '44% 52%',
            opacity: 0,
            willChange: 'transform, opacity'
          }}
        />
        <div
          ref={heroCRef}
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: '-7%',
            backgroundImage: 'url(/images/blue_tux_sequin.png)',
            backgroundSize: 'cover',
            backgroundPosition: '56% 26%',
            opacity: 0,
            willChange: 'transform, opacity'
          }}
        />

        {/* Refined Ambient Lighting & Vignette (Clean Luxury Shading, No Center Halo) */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(130% 90% at 50% 35%, rgba(11, 15, 24, 0.35) 0%, rgba(11, 15, 24, 0.75) 60%, rgba(11, 15, 24, 0.95) 100%)'
          }}
        />
        <div
          ref={heroSideRef}
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0,
            background:
              'linear-gradient(90deg, rgba(11, 15, 24, 0.95) 0%, rgba(11, 15, 24, 0.65) 45%, rgba(11, 15, 24, 0.1) 85%)',
            transition: 'opacity 500ms ease'
          }}
        />

        {/* Narrative Beats */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            alignItems: 'center',
            padding: '84px 32px 40px clamp(22px, 7vw, 92px)'
          }}
        >
          {/* Beat 1: Wordmark & Greeting */}
          <div
            ref={beat1Ref}
            style={{
              gridArea: '1/1',
              justifySelf: 'center',
              textAlign: 'center',
              willChange: 'transform, opacity'
            }}
          >
            <p
              style={{
                margin: '0 0 34px',
                fontFamily: 'var(--font-tiro-hindi), var(--font-newsreader), serif',
                fontSize: 'clamp(15px, 1.5vw, 19px)',
                letterSpacing: '0.06em',
                color: '#b2b6ca',
                opacity: 0,
                animation: 'th-fade 1400ms cubic-bezier(0.16, 1, 0.3, 1) 700ms both'
              }}
            >
              खम्मा घणी
            </p>
            <h1
              style={{
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-newsreader), Georgia, serif',
                fontWeight: 300,
                fontSize: 'clamp(4rem, 14vw, 12rem)',
                lineHeight: 0.9,
                letterSpacing: '0.13em',
                color: '#f3f5fe',
                textIndent: '0.13em'
              }}
            >
              {['T', 'H', 'A', 'R'].map((char, i) => (
                <span
                  key={char}
                  style={{
                    display: 'inline-block',
                    opacity: 0,
                    animation: `th-rise 1400ms cubic-bezier(0.16, 1, 0.3, 1) ${i * 50}ms both`
                  }}
                >
                  <span
                    ref={(el) => {
                      if (el) lettersRef.current[i] = el;
                    }}
                    style={{ display: 'inline-block', willChange: 'transform' }}
                  >
                    {char}
                  </span>
                </span>
              ))}
              <span
                style={{
                  display: 'inline-block',
                  opacity: 0,
                  animation: 'th-rise 1400ms cubic-bezier(0.16, 1, 0.3, 1) 200ms both'
                }}
              >
                <span
                  ref={(el) => {
                    if (el) lettersRef.current[4] = el;
                  }}
                  style={{ position: 'relative', display: 'inline-block', willChange: 'transform' }}
                >
                  O
                  <svg
                    viewBox="0 0 100 100"
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '52%',
                      width: '150%',
                      height: '150%',
                      transform: 'translate(-50%, -50%)',
                      overflow: 'visible'
                    }}
                  >
                    <ellipse
                      ref={oLoopRef}
                      cx="50"
                      cy="50"
                      rx="34"
                      ry="39"
                      fill="none"
                      stroke="#cfd3e5"
                      strokeWidth="1"
                      opacity="0.55"
                      transform="rotate(-12 50 50)"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </span>
              </span>
            </h1>
            <p
              style={{
                margin: '30px 0 0',
                fontSize: '12px',
                letterSpacing: '0.44em',
                textTransform: 'uppercase',
                color: '#b2b6ca',
                textIndent: '0.44em',
                opacity: 0,
                animation: 'th-rise 1400ms cubic-bezier(0.16, 1, 0.3, 1) 340ms both'
              }}
            >
              Designed for you
            </p>
          </div>

          {/* Beat 2: Principle */}
          <div
            ref={beat2Ref}
            style={{
              gridArea: '1/1',
              justifySelf: 'start',
              maxWidth: 'min(88vw, 21ch)',
              opacity: 0,
              willChange: 'transform, opacity'
            }}
          >
            <p
              style={{
                margin: '0 0 clamp(12px, 2.4vh, 26px)',
                fontSize: '11px',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: '#75798c'
              }}
            >
              The principle
            </p>
            <h2
              style={{
                margin: 0,
                fontFamily: 'var(--font-newsreader), Georgia, serif',
                fontWeight: 300,
                fontSize: 'clamp(30px, min(5.4vw, 8.4vh), 80px)',
                lineHeight: 1.04,
                letterSpacing: '-0.012em',
                color: '#f3f5fe'
              }}
            >
              Nothing in this house is cut twice.
            </h2>
            <p
              style={{
                margin: 'clamp(16px, 3vh, 30px) 0 0',
                maxWidth: '34ch',
                fontSize: 'clamp(14.5px, 2.9vh, 16.5px)',
                lineHeight: 1.66,
                color: '#9397ab'
              }}
            >
              There is no rail of finished coats to choose from. A garment begins as a set of
              measurements taken on Allenby Road, and ends on one body.
            </p>
          </div>

          {/* Beat 3: The House */}
          <div
            ref={beat3Ref}
            style={{
              gridArea: '1/1',
              justifySelf: 'start',
              maxWidth: 'min(88vw, 24ch)',
              opacity: 0,
              willChange: 'transform, opacity'
            }}
          >
            <p
              style={{
                margin: '0 0 clamp(12px, 2.4vh, 26px)',
                fontSize: '11px',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: '#75798c'
              }}
            >
              The house
            </p>
            <h2
              style={{
                margin: 0,
                fontFamily: 'var(--font-newsreader), Georgia, serif',
                fontWeight: 300,
                fontSize: 'clamp(28px, min(5vw, 7.6vh), 74px)',
                lineHeight: 1.04,
                letterSpacing: '-0.012em',
                color: '#f3f5fe'
              }}
            >
              Rajasthani hand-work.
              <br />
              Calcutta tailoring.
            </h2>
            <p
              style={{
                margin: 'clamp(14px, 2.6vh, 30px) 0 0',
                maxWidth: '34ch',
                fontSize: 'clamp(14.5px, 2.9vh, 16.5px)',
                lineHeight: 1.66,
                color: '#9397ab'
              }}
            >
              Two rooms — one cool, one warm — and a wedding book that runs to five events.
              Everything below was worked by hand for one client.
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
                transition: 'all 300ms cubic-bezier(0.16, 1, 0.3, 1)'
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
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '14px'
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
                transition: 'width 600ms cubic-bezier(0.16, 1, 0.3, 1), opacity 600ms cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            />
          ))}
        </div>

        {/* Hero Footer */}
        <div
          ref={heroFootRef}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '24px',
            padding: '0 32px 34px clamp(22px, 6.5vw, 92px)',
            opacity: 0,
            animation: 'th-fade 1400ms cubic-bezier(0.16, 1, 0.3, 1) 900ms both'
          }}
        >
          <div
            style={{
              fontSize: '11.5px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#75798c',
              lineHeight: 1.9
            }}
          >
            <div style={{ color: '#b2b6ca' }}>{storeStatus.long}</div>
            <div>31 Allenby Road, Bhawanipore · Kolkata</div>
          </div>
          <Link
            href="#meaning"
            aria-label="Scroll to continue"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
              fontSize: '10.5px',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: '#75798c'
            }}
          >
            <span>Scroll</span>
            <svg width="16" height="58" viewBox="0 0 16 58" fill="none" aria-hidden="true">
              <path
                d="M8 0C8 9 2 11 3 18C4 25 13 26 13 33C13 40 3 41 4 48C5 53 8 54 8 58"
                stroke="#cfd3e5"
                strokeWidth="1"
                opacity="0.6"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
