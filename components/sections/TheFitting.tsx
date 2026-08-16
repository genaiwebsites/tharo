'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FITTING_STAGES } from '@/lib/constants';
import { TapeMeasureIcon, ShearsIcon, NeedleThreadIcon } from '@/components/common/Icons';

export default function TheFitting() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeStageIdx, setActiveStageIdx] = useState<number>(0);
  const [isManualOverride, setIsManualOverride] = useState<boolean>(false);
  const overrideTimerRef = useRef<NodeJS.Timeout | null>(null);

  const svgPiecesRef = useRef<
    Array<{
      cutEl: SVGPathElement | null;
      cutLen: number;
      seamEl: SVGPathElement | null;
      stitchEl: SVGPathElement | null;
      markEl: SVGPathElement | null;
    }>
  >([]);

  useEffect(() => {
    // Initialize stroke lengths
    svgPiecesRef.current.forEach((p) => {
      if (p && p.cutEl) {
        const len = p.cutEl.getTotalLength();
        p.cutLen = len;
        p.cutEl.style.strokeDasharray = `${len}`;
        p.cutEl.style.strokeDashoffset = `${len}`;
      }
    });

    const handleScroll = () => {
      const s = sectionRef.current;
      const track = trackRef.current;
      if (!s || !track) return;

      const r = s.getBoundingClientRect();
      const span = Math.max(1, r.height - window.innerHeight);
      const fp = Math.min(1, Math.max(0, -r.top / span));
      const dist = Math.max(0, track.scrollWidth - window.innerWidth + 120);

      // Only update track scroll if not temporarily overridden by manual click
      if (!isManualOverride) {
        track.style.transform = `translate3d(${(-fp * dist).toFixed(1)}px, 0, 0)`;
        const stageIndex = Math.min(
          FITTING_STAGES.length - 1,
          Math.floor(fp * FITTING_STAGES.length)
        );
        setActiveStageIdx(stageIndex);
      }

      const n = svgPiecesRef.current.length;
      const march = (performance.now() * 0.012) % 100;

      for (let i = 0; i < n; i++) {
        const p = svgPiecesRef.current[i];
        if (!p) continue;

        const start = i / (n + 0.6);
        const end = start + (1 / (n + 0.6)) * 1.3;
        const lp = Math.min(1, Math.max(0, (fp - start) / (end - start)));
        const st = (a: number, b: number) => Math.min(1, Math.max(0, (lp - a) / (b - a)));

        if (p.cutEl) {
          p.cutEl.style.strokeDashoffset = `${(p.cutLen * (1 - st(0, 0.5))).toFixed(1)}`;
        }
        if (p.seamEl) {
          p.seamEl.style.opacity = `${(0.45 * st(0.24, 0.54)).toFixed(3)}`;
        }
        if (p.markEl) {
          p.markEl.style.opacity = `${(0.85 * st(0.5, 0.8)).toFixed(3)}`;
        }
        if (p.stitchEl) {
          p.stitchEl.style.opacity = `${(0.7 * st(0.4, 0.7)).toFixed(3)}`;
          p.stitchEl.style.strokeDashoffset = `${(-march).toFixed(1)}`;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (overrideTimerRef.current) clearTimeout(overrideTimerRef.current);
    };
  }, [isManualOverride]);

  const handleStageSelect = useCallback((idx: number) => {
    setActiveStageIdx(idx);
    setIsManualOverride(true);

    const s = sectionRef.current;
    const track = trackRef.current;
    if (s && track) {
      const dist = Math.max(0, track.scrollWidth - window.innerWidth + 120);
      const fraction = idx / (FITTING_STAGES.length - 1);
      track.style.transition = 'transform 600ms cubic-bezier(0.16, 1, 0.3, 1)';
      track.style.transform = `translate3d(${(-fraction * dist).toFixed(1)}px, 0, 0)`;

      // Scroll window to approximate section position for smooth continuity
      const r = s.getBoundingClientRect();
      const span = Math.max(1, r.height - window.innerHeight);
      const targetScrollY = s.offsetTop + fraction * span;
      window.scrollTo({ top: targetScrollY, behavior: 'smooth' });

      if (overrideTimerRef.current) clearTimeout(overrideTimerRef.current);
      overrideTimerRef.current = setTimeout(() => {
        if (track) track.style.transition = '';
        setIsManualOverride(false);
      }, 700);
    }
  }, []);

  const getStageIcon = (idx: number) => {
    switch (idx) {
      case 0:
        return <TapeMeasureIcon size={18} color="#c5a880" />;
      case 1:
        return <ShearsIcon size={18} color="#c5a880" />;
      default:
        return <NeedleThreadIcon size={18} color="#c5a880" />;
    }
  };

  return (
    <>
      <section
        id="fitting"
        data-screen-label="The Fitting"
        ref={sectionRef}
        style={{
          position: 'relative',
          height: '460vh',
          background: 'linear-gradient(180deg, rgba(6, 9, 15, 0.4) 0%, rgba(9, 13, 21, 0.95) 15%, rgba(9, 13, 21, 0.95) 85%, rgba(6, 9, 15, 0.4) 100%)',
        }}
      >
        <div
          style={{
            position: 'sticky',
            top: 0,
            height: '100svh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {/* Section Masthead */}
          <div
            style={{
              padding: '0 32px 0 clamp(22px, 6.5vw, 92px)',
              maxWidth: '1320px',
              margin: '0 auto 0',
              width: '100%',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <div>
                <p
                  style={{
                    margin: '0 0 14px',
                    fontSize: '11px',
                    letterSpacing: '0.28em',
                    textTransform: 'uppercase',
                    color: '#75798c',
                  }}
                >
                  Chapter four · The Fitting Blueprint
                </p>
                <h2
                  style={{
                    margin: '0 0 8px',
                    fontFamily: 'var(--font-cormorant), var(--font-cinzel), Georgia, serif',
                    fontWeight: 400,
                    fontSize: 'clamp(30px, 4vw, 54px)',
                    lineHeight: 1.08,
                    color: '#f3f5fe',
                  }}
                >
                  What a fitting actually takes.
                </h2>
              </div>

              {/* Interactive Stage Tabstrip */}
              <div
                role="tablist"
                aria-label="Fitting Sequence"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(15, 21, 33, 0.7)',
                  padding: '4px',
                  borderRadius: '30px',
                  border: '1px solid rgba(207, 211, 229, 0.12)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                {FITTING_STAGES.map((s, idx) => {
                  const isActive = activeStageIdx === idx;
                  return (
                    <button
                      key={s.n}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => handleStageSelect(idx)}
                      style={{
                        appearance: 'none',
                        background: isActive ? 'rgba(197, 168, 128, 0.16)' : 'transparent',
                        border: isActive ? '1px solid rgba(197, 168, 128, 0.45)' : '1px solid transparent',
                        color: isActive ? '#f3f5fe' : '#75798c',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontFamily: 'var(--font-cinzel), Georgia, serif',
                        letterSpacing: '0.12em',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 280ms cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                    >
                      <span style={{ color: isActive ? '#c5a880' : 'inherit' }}>{s.n}</span>
                      <span className="hidden sm:inline" style={{ textTransform: 'uppercase' }}>
                        {s.name.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <p
              style={{
                margin: '12px 0 0',
                maxWidth: '56ch',
                fontSize: '15px',
                lineHeight: 1.65,
                color: '#9397ab',
                textWrap: 'pretty',
              }}
            >
              Made-to-measure is a sequence, not a purchase. Every garment is drafted to 42 anatomical
              coordinates and verified through two intermediate fittings.
            </p>
          </div>

          {/* Horizontal Track of Tailor's Drafting Tables */}
          <div
            ref={trackRef}
            style={{
              marginTop: 'clamp(24px, 3.5vw, 44px)',
              display: 'flex',
              gap: 'clamp(24px, 3vw, 52px)',
              padding: '0 32px 0 clamp(22px, 6.5vw, 92px)',
              width: 'max-content',
              willChange: 'transform',
            }}
          >
            {FITTING_STAGES.map((s, i) => {
              const isCurrent = activeStageIdx === i;
              return (
                <article
                  key={s.n}
                  onClick={() => handleStageSelect(i)}
                  style={{
                    flex: 'none',
                    width: 'clamp(320px, 34vw, 440px)',
                    background: isCurrent
                      ? 'linear-gradient(180deg, rgba(16, 23, 37, 0.85) 0%, rgba(10, 14, 23, 0.95) 100%)'
                      : 'linear-gradient(180deg, rgba(13, 18, 29, 0.6) 0%, rgba(9, 13, 21, 0.8) 100%)',
                    border: isCurrent
                      ? '1px solid rgba(197, 168, 128, 0.35)'
                      : '1px solid rgba(233, 233, 237, 0.1)',
                    borderRadius: '8px',
                    padding: '24px clamp(18px, 2vw, 28px)',
                    boxShadow: isCurrent
                      ? '0 24px 60px rgba(0, 0, 0, 0.6), 0 0 35px rgba(197, 168, 128, 0.12)'
                      : '0 12px 30px rgba(0, 0, 0, 0.4)',
                    cursor: 'pointer',
                    transition: 'all 400ms cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  {/* Card Header & Stage Metric Telemetry */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '14px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-cinzel), Georgia, serif',
                          fontSize: '11px',
                          letterSpacing: '0.2em',
                          color: '#c5a880',
                          background: 'rgba(197, 168, 128, 0.12)',
                          padding: '3px 8px',
                          borderRadius: '3px',
                        }}
                      >
                        {s.n}
                      </span>
                      <h3
                        style={{
                          margin: 0,
                          fontFamily: 'var(--font-cormorant), var(--font-cinzel), Georgia, serif',
                          fontWeight: 400,
                          fontSize: 'clamp(20px, 2vw, 26px)',
                          color: '#f3f5fe',
                          lineHeight: 1.2,
                        }}
                      >
                        {s.name}
                      </h3>
                    </div>
                    <span style={{ opacity: isCurrent ? 1 : 0.6, transition: 'opacity 300ms ease' }}>
                      {getStageIcon(i)}
                    </span>
                  </div>

                  {/* Craft Telemetry Pills */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '16px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '11px',
                        letterSpacing: '0.08em',
                        color: '#c5a880',
                        background: 'rgba(197, 168, 128, 0.08)',
                        padding: '2px 8px',
                        borderRadius: '3px',
                        border: '1px solid rgba(197, 168, 128, 0.2)',
                      }}
                    >
                      {s.duration}
                    </span>
                    <span
                      style={{
                        fontSize: '11px',
                        letterSpacing: '0.04em',
                        color: '#9397ab',
                      }}
                    >
                      • {s.metric} ({s.metricLabel})
                    </span>
                  </div>

                  <p
                    style={{
                      margin: '0 0 20px',
                      fontSize: '14.5px',
                      lineHeight: 1.62,
                      color: '#9397ab',
                      minHeight: '48px',
                      textWrap: 'pretty',
                    }}
                  >
                    {s.note}
                  </p>

                  {/* Drafting Blueprint SVG with Grid & Basting Lines */}
                  <div
                    style={{
                      position: 'relative',
                      background: '#070b12',
                      borderRadius: '6px',
                      padding: '14px',
                      border: '1px solid rgba(207, 211, 229, 0.08)',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Blueprint Grid Lines */}
                    <div
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage:
                          'linear-gradient(to right, rgba(207, 211, 229, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(207, 211, 229, 0.04) 1px, transparent 1px)',
                        backgroundSize: '20px 20px',
                        pointerEvents: 'none',
                      }}
                    />

                    {/* Chalk Coordinates Callout */}
                    <div
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        bottom: '8px',
                        right: '10px',
                        fontSize: '9px',
                        fontFamily: 'monospace',
                        letterSpacing: '0.12em',
                        color: 'rgba(207, 211, 229, 0.35)',
                        pointerEvents: 'none',
                      }}
                    >
                      PIECE: {s.piece.toUpperCase()}
                    </div>

                    <svg
                      viewBox="0 0 340 360"
                      fill="none"
                      aria-hidden="true"
                      style={{
                        width: '100%',
                        height: 'clamp(180px, 22vh, 260px)',
                        display: 'block',
                        overflow: 'visible',
                      }}
                    >
                      {/* 1. Tailor's Seam Line (Dashed Chalk) */}
                      <path
                        ref={(el) => {
                          if (!svgPiecesRef.current[i]) svgPiecesRef.current[i] = {} as any;
                          svgPiecesRef.current[i].seamEl = el;
                        }}
                        d={s.seam}
                        stroke="#8a94b8"
                        strokeWidth="1.2"
                        strokeDasharray="6 5"
                        strokeLinejoin="round"
                        opacity="0.35"
                        vectorEffect="non-scaling-stroke"
                      />

                      {/* 2. Main Cut Line (Solid Contour) */}
                      <path
                        ref={(el) => {
                          if (!svgPiecesRef.current[i]) svgPiecesRef.current[i] = {} as any;
                          svgPiecesRef.current[i].cutEl = el;
                        }}
                        d={s.cut}
                        stroke="#e4e7f5"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                      />

                      {/* 3. Basting Stitches */}
                      <path
                        ref={(el) => {
                          if (!svgPiecesRef.current[i]) svgPiecesRef.current[i] = {} as any;
                          svgPiecesRef.current[i].stitchEl = el;
                        }}
                        d={s.stitch}
                        stroke="#c5a880"
                        strokeWidth="1.5"
                        strokeDasharray="8 6"
                        strokeLinecap="round"
                        opacity="0.5"
                        vectorEffect="non-scaling-stroke"
                      />

                      {/* 4. Tailor's Chalk Measurement Marks & Grainline */}
                      <path
                        ref={(el) => {
                          if (!svgPiecesRef.current[i]) svgPiecesRef.current[i] = {} as any;
                          svgPiecesRef.current[i].markEl = el;
                        }}
                        d={s.mark}
                        stroke="#e5bd71"
                        strokeWidth="1.1"
                        strokeLinecap="round"
                        opacity="0.75"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Master Tailor's Metric Tape Measure Scrubber */}
          <div
            style={{
              maxWidth: '1320px',
              margin: '22px auto 0',
              padding: '0 32px 0 clamp(22px, 6.5vw, 92px)',
              width: '100%',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '8px 16px',
                borderRadius: '4px',
                background: 'rgba(10, 14, 23, 0.6)',
                border: '1px solid rgba(207, 211, 229, 0.08)',
              }}
            >
              <span
                style={{
                  fontSize: '10px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#c5a880',
                  whiteSpace: 'nowrap',
                }}
              >
                Atelier Tape
              </span>

              {/* Progress Metric Bar */}
              <div
                style={{
                  flex: 1,
                  height: '2px',
                  background: 'rgba(207, 211, 229, 0.12)',
                  borderRadius: '1px',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: `${((activeStageIdx + 1) / FITTING_STAGES.length) * 100}%`,
                    background: 'linear-gradient(90deg, #c5a880, #f3f5fe)',
                    transition: 'width 400ms cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                />
              </div>

              <span
                style={{
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  color: '#9397ab',
                  whiteSpace: 'nowrap',
                }}
              >
                Stage {activeStageIdx + 1} of 5
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
