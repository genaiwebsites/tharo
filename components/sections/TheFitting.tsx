'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { FITTING_STAGES } from '@/lib/constants';
import { TapeMeasureIcon, ShearsIcon, NeedleThreadIcon } from '@/components/common/Icons';
import { SectionScrim } from '@/components/common/SectionScrim';

export default function TheFitting() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeStageIdx, setActiveStageIdx] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [cardProgresses, setCardProgresses] = useState<number[]>([0, 0, 0, 0, 0]);

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
    // Initialize stroke lengths for SVG drawing animations
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
      if (!s) return;

      const r = s.getBoundingClientRect();
      const span = Math.max(1, r.height - window.innerHeight);
      const p = Math.min(1, Math.max(0, -r.top / span));
      setScrollProgress(p);

      const totalStages = FITTING_STAGES.length;
      const newProgresses: number[] = [];
      const stageSpan = 1 / totalStages;

      for (let i = 0; i < totalStages; i++) {
        const cardStart = i * stageSpan;
        const cardEnd = (i + 1) * stageSpan;
        const localP = Math.min(1, Math.max(0, (p - cardStart) / (cardEnd - cardStart)));
        newProgresses.push(localP);

        // Animate SVG blueprint paths based on local card progress
        const piece = svgPiecesRef.current[i];
        if (piece) {
          const drawProgress = Math.min(1, Math.max(0, localP / 0.6));
          const march = (performance.now() * 0.015) % 100;

          if (piece.cutEl) {
            piece.cutEl.style.strokeDashoffset = `${(piece.cutLen * (1 - drawProgress)).toFixed(1)}`;
          }
          if (piece.seamEl) {
            const seamOp = localP > 0.08 ? Math.min(0.45, (localP - 0.08) * 2) : 0;
            piece.seamEl.style.opacity = `${seamOp.toFixed(3)}`;
          }
          if (piece.markEl) {
            const markOp = localP > 0.2 ? Math.min(0.85, (localP - 0.2) * 2.5) : 0;
            piece.markEl.style.opacity = `${markOp.toFixed(3)}`;
          }
          if (piece.stitchEl) {
            const stitchOp = localP > 0.15 ? Math.min(0.8, (localP - 0.15) * 2) : 0;
            piece.stitchEl.style.opacity = `${stitchOp.toFixed(3)}`;
            piece.stitchEl.style.strokeDashoffset = `${(-march).toFixed(1)}`;
          }
        }
      }

      setCardProgresses(newProgresses);

      const activeIdx = Math.min(
        totalStages - 1,
        Math.floor(p * totalStages)
      );
      setActiveStageIdx(activeIdx);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleStepClick = useCallback((idx: number) => {
    const s = sectionRef.current;
    if (!s) return;
    const span = Math.max(1, s.offsetHeight - window.innerHeight);
    const targetP = (idx + 0.35) / FITTING_STAGES.length;
    const targetScrollY = s.offsetTop + targetP * span;
    window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
  }, []);

  const getStageIcon = (idx: number) => {
    switch (idx) {
      case 0:
        return <TapeMeasureIcon size={16} color="#c5a880" />;
      case 1:
        return <ShearsIcon size={16} color="#c5a880" />;
      default:
        return <NeedleThreadIcon size={16} color="#c5a880" />;
    }
  };

  const activeStage = FITTING_STAGES[activeStageIdx] || FITTING_STAGES[0];

  return (
    <section
      id="fitting"
      data-screen-label="The Fitting"
      ref={sectionRef}
      style={{
        position: 'relative',
        height: '380vh',
        background: 'linear-gradient(180deg, #0b0f18 0%, #080b13 6%, #080b13 94%, #0b0f18 100%)',
      }}
    >
      <SectionScrim showTop={true} showBottom={true} height={160} />

      {/* Sticky Dual-Column Atelier Stage */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100svh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 clamp(20px, 4.5vw, 56px)',
        }}
      >
        <div
          style={{
            maxWidth: '1240px',
            width: '100%',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'minmax(280px, 0.9fr) minmax(320px, 1.1fr)',
            gap: 'clamp(32px, 5vw, 64px)',
            alignItems: 'center',
          }}
        >
          {/* LEFT COLUMN: Clean Editorial & Step Navigator */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              zIndex: 10,
            }}
          >
            {/* Header */}
            <div>
              <p
                style={{
                  margin: '0 0 10px',
                  fontSize: '10.5px',
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                  color: '#c5a880',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#c5a880' }} />
                Chapter four · The Blueprint
              </p>
              <h2
                style={{
                  margin: '0 0 10px',
                  fontFamily: 'var(--font-cormorant), var(--font-cinzel), Georgia, serif',
                  fontWeight: 400,
                  fontSize: 'clamp(28px, 3.4vw, 44px)',
                  lineHeight: 1.08,
                  color: '#f3f5fe',
                  textWrap: 'pretty',
                }}
              >
                What a fitting actually takes.
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: '13.5px',
                  lineHeight: 1.6,
                  color: '#9397ab',
                  maxWidth: '38ch',
                  textWrap: 'pretty',
                }}
              >
                Made-to-measure is a sequence, not a purchase. Drafted to 42 anatomical
                coordinates and sculpted through two intermediate fittings.
              </p>
            </div>

            {/* Compact Step Navigator */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
              }}
            >
              {FITTING_STAGES.map((s, idx) => {
                const isActive = activeStageIdx === idx;
                const isCompleted = activeStageIdx > idx;
                return (
                  <button
                    key={s.n}
                    type="button"
                    onClick={() => handleStepClick(idx)}
                    style={{
                      appearance: 'none',
                      background: isActive
                        ? 'rgba(197, 168, 128, 0.12)'
                        : 'rgba(14, 19, 31, 0.4)',
                      border: isActive
                        ? '1px solid rgba(197, 168, 128, 0.45)'
                        : '1px solid rgba(207, 211, 229, 0.08)',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 250ms ease',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-cinzel), monospace',
                          fontSize: '10.5px',
                          color: isActive || isCompleted ? '#c5a880' : '#5f6472',
                          fontWeight: isActive ? 600 : 400,
                        }}
                      >
                        {s.n}
                      </span>
                      <span
                        style={{
                          fontSize: '13px',
                          fontFamily: 'var(--font-cormorant), Georgia, serif',
                          color: isActive ? '#f3f5fe' : isCompleted ? '#cfd3e5' : '#75798c',
                          letterSpacing: '0.02em',
                        }}
                      >
                        {s.name}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: '10px',
                        color: isActive ? '#c5a880' : '#5f6472',
                        fontFamily: 'monospace',
                        letterSpacing: '0.06em',
                      }}
                    >
                      {s.duration.split('·')[0].trim()}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Streamlined Active Phase Pill & Concierge CTA */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '6px',
                borderTop: '1px solid rgba(207, 211, 229, 0.1)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    fontSize: '10px',
                    fontFamily: 'var(--font-cinzel), monospace',
                    letterSpacing: '0.14em',
                    color: '#c5a880',
                    textTransform: 'uppercase',
                  }}
                >
                  Phase {activeStage.n}/05
                </span>
                <span style={{ fontSize: '11px', color: '#75798c' }}>•</span>
                <span style={{ fontSize: '11px', color: '#9397ab' }}>
                  {activeStage.metric}
                </span>
              </div>

              <Link
                href="#fitting-room"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '10.5px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: '#f3f5fe',
                  textDecoration: 'none',
                  borderBottom: '1px solid rgba(197, 168, 128, 0.55)',
                  paddingBottom: '2px',
                  transition: 'color 200ms ease',
                }}
              >
                <span>Reserve fitting</span>
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M2 8h12M9 3l5 5-5 5" stroke="#c5a880" strokeWidth="1.4" />
                </svg>
              </Link>
            </div>
          </div>

          {/* RIGHT COLUMN: Fixed-Anchor Stacking Deck (Never Shifts Position) */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '480px',
              height: '400px',
              margin: '0 auto',
            }}
          >
            {FITTING_STAGES.map((s, i) => {
              const isPast = activeStageIdx > i;
              const isCurrent = activeStageIdx === i;
              const isFuture = activeStageIdx < i;

              // Fixed anchor stacking model:
              // Card i has a FIXED resting position at top: (i * 10px).
              // It never moves up when future cards arrive!
              const fixedRestingY = i * 10;
              let translateY = fixedRestingY;
              let opacity = 1;
              let zIndex = i + 1;

              if (isFuture) {
                const prevCardP = cardProgresses[i - 1] || 0;
                // Slides in smoothly from bottom
                const enterP = Math.min(1, Math.max(0, (prevCardP - 0.65) / 0.35));
                translateY = fixedRestingY + (1 - enterP) * 80;
                opacity = enterP > 0.01 ? 1 : 0;
              } else {
                // Current and past cards lock at their fixed resting position
                translateY = fixedRestingY;
                opacity = 1;
              }

              return (
                <div
                  key={s.n}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '350px',
                    zIndex,
                    transform: `translate3d(0, ${translateY}px, 0)`,
                    opacity,
                    transition: 'transform 380ms cubic-bezier(0.16, 1, 0.3, 1), opacity 300ms ease',
                    willChange: 'transform, opacity',
                  }}
                >
                  <article
                    style={{
                      height: '100%',
                      background:
                        'linear-gradient(180deg, rgba(16, 23, 37, 0.97) 0%, rgba(9, 13, 21, 0.99) 100%)',
                      border: isCurrent
                        ? '1px solid rgba(197, 168, 128, 0.6)'
                        : '1px solid rgba(207, 211, 229, 0.18)',
                      borderRadius: '12px',
                      padding: '16px 20px',
                      backdropFilter: 'blur(28px)',
                      boxShadow: isCurrent
                        ? '0 20px 45px rgba(0, 0, 0, 0.8), 0 0 28px rgba(197, 168, 128, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
                        : '0 12px 28px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxSizing: 'border-box',
                    }}
                  >
                    {/* Card Header */}
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '6px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              fontFamily: 'var(--font-cinzel), Georgia, serif',
                              fontSize: '10px',
                              letterSpacing: '0.16em',
                              color: '#c5a880',
                              background: 'rgba(197, 168, 128, 0.14)',
                              border: '1px solid rgba(197, 168, 128, 0.3)',
                              padding: '2px 6px',
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
                              fontSize: '19px',
                              color: '#f3f5fe',
                              lineHeight: 1.15,
                            }}
                          >
                            {s.name}
                          </h3>
                        </div>
                        <span
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            background: 'rgba(197, 168, 128, 0.1)',
                            border: '1px solid rgba(197, 168, 128, 0.25)',
                          }}
                        >
                          {getStageIcon(i)}
                        </span>
                      </div>

                      {/* Duration & Metric Row */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          marginBottom: '6px',
                          flexWrap: 'wrap',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '9.5px',
                            letterSpacing: '0.06em',
                            color: '#c5a880',
                            background: 'rgba(197, 168, 128, 0.08)',
                            padding: '2px 5px',
                            borderRadius: '3px',
                            border: '1px solid rgba(197, 168, 128, 0.22)',
                          }}
                        >
                          {s.duration}
                        </span>
                        <span
                          style={{
                            fontSize: '10px',
                            color: '#9397ab',
                          }}
                        >
                          • {s.metric} ({s.metricLabel})
                        </span>
                      </div>

                      <p
                        style={{
                          margin: 0,
                          fontSize: '12px',
                          lineHeight: 1.4,
                          color: '#cfd3e5',
                          textWrap: 'pretty',
                        }}
                      >
                        {s.note}
                      </p>
                    </div>

                    {/* Drafting Blueprint SVG */}
                    <div
                      style={{
                        position: 'relative',
                        background: '#060910',
                        borderRadius: '6px',
                        padding: '8px',
                        marginTop: '6px',
                        border: '1px solid rgba(207, 211, 229, 0.1)',
                        overflow: 'hidden',
                        boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.7)',
                      }}
                    >
                      {/* Grid */}
                      <div
                        aria-hidden="true"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          backgroundImage:
                            'linear-gradient(to right, rgba(207, 211, 229, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(207, 211, 229, 0.04) 1px, transparent 1px)',
                          backgroundSize: '16px 16px',
                          pointerEvents: 'none',
                        }}
                      />

                      {/* Spec Label */}
                      <div
                        aria-hidden="true"
                        style={{
                          position: 'absolute',
                          bottom: '5px',
                          right: '6px',
                          fontSize: '8px',
                          fontFamily: 'monospace',
                          letterSpacing: '0.12em',
                          color: 'rgba(197, 168, 128, 0.65)',
                          pointerEvents: 'none',
                        }}
                      >
                        SPEC: {s.piece.toUpperCase()}
                      </div>

                      <svg
                        viewBox="0 0 340 360"
                        fill="none"
                        aria-hidden="true"
                        style={{
                          width: '100%',
                          height: '135px',
                          display: 'block',
                          overflow: 'visible',
                        }}
                      >
                        {/* 1. Tailor's Seam Allowance Line */}
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
                          opacity="0"
                          vectorEffect="non-scaling-stroke"
                        />

                        {/* 2. Razor Cutting Line */}
                        <path
                          ref={(el) => {
                            if (!svgPiecesRef.current[i]) svgPiecesRef.current[i] = {} as any;
                            svgPiecesRef.current[i].cutEl = el;
                          }}
                          d={s.cut}
                          stroke="#c5a880"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          vectorEffect="non-scaling-stroke"
                          style={{ filter: 'drop-shadow(0 0 4px rgba(197, 168, 128, 0.5))' }}
                        />

                        {/* 3. Live Marching Stitch Basting Line */}
                        <path
                          ref={(el) => {
                            if (!svgPiecesRef.current[i]) svgPiecesRef.current[i] = {} as any;
                            svgPiecesRef.current[i].stitchEl = el;
                          }}
                          d={s.stitch}
                          stroke="#f3f5fe"
                          strokeWidth="1.5"
                          strokeDasharray="5 6"
                          strokeLinecap="round"
                          vectorEffect="non-scaling-stroke"
                          opacity="0"
                        />

                        {/* 4. Anatomical Chalk Markings */}
                        <path
                          ref={(el) => {
                            if (!svgPiecesRef.current[i]) svgPiecesRef.current[i] = {} as any;
                            svgPiecesRef.current[i].markEl = el;
                          }}
                          d={s.mark}
                          stroke="#c5a880"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          opacity="0"
                          vectorEffect="non-scaling-stroke"
                        />
                      </svg>
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
