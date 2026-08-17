'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { SectionScrim } from '@/components/common/SectionScrim';
import { LOUPE_PLATES } from '@/lib/constants';
import { LoupeIcon } from '@/components/common/Icons';

export default function TheHandLoupe() {
  const loupeRef = useRef<HTMLDivElement>(null);
  const activePlateRef = useRef<HTMLElement | null>(null);
  const [isTouch, setIsTouch] = useState<boolean>(false);
  const [zoomedIdx, setZoomedIdx] = useState<number | null>(null);

  useEffect(() => {
    const touch = window.matchMedia('(hover: none)').matches;
    setIsTouch(touch);

    // Hide loupe immediately if user scrolls away or leaves window
    const handleWindowScrollOrBlur = () => {
      if (loupeRef.current) {
        loupeRef.current.style.opacity = '0';
        loupeRef.current.style.visibility = 'hidden';
      }
      activePlateRef.current = null;
    };

    window.addEventListener('scroll', handleWindowScrollOrBlur, { passive: true });
    window.addEventListener('blur', handleWindowScrollOrBlur);
    document.addEventListener('mouseleave', handleWindowScrollOrBlur);

    return () => {
      window.removeEventListener('scroll', handleWindowScrollOrBlur);
      window.removeEventListener('blur', handleWindowScrollOrBlur);
      document.removeEventListener('mouseleave', handleWindowScrollOrBlur);
    };
  }, []);

  const hideLoupe = useCallback(() => {
    if (!loupeRef.current) return;
    loupeRef.current.style.opacity = '0';
    loupeRef.current.style.visibility = 'hidden';
    activePlateRef.current = null;
  }, []);

  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>, src: string) => {
    if (isTouch || !loupeRef.current) return;
    activePlateRef.current = e.currentTarget;
    loupeRef.current.style.backgroundImage = `url(${src})`;
    loupeRef.current.style.visibility = 'visible';
    loupeRef.current.style.opacity = '1';
  };

  const handlePointerLeave = () => {
    hideLoupe();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isTouch || !loupeRef.current) return;

    const frame = e.currentTarget;
    const r = frame.getBoundingClientRect();
    
    // Safety boundary check: if cursor stepped outside the bounding box, hide immediately
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    ) {
      hideLoupe();
      return;
    }

    const Z = 2.0;
    const R = 110;
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;

    loupeRef.current.style.visibility = 'visible';
    loupeRef.current.style.opacity = '1';
    loupeRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    loupeRef.current.style.backgroundSize = `${r.width * Z}px ${r.height * Z}px`;
    loupeRef.current.style.backgroundPosition = `${R - x * Z}px ${R - y * Z}px`;
  };

  const handleTouchClick = (idx: number) => {
    if (!isTouch) return;
    setZoomedIdx(zoomedIdx === idx ? null : idx);
  };

  return (
    <>
      <section
        id="the-hand"
        data-screen-label="The Hand"
        onPointerLeave={hideLoupe}
        style={{
          position: 'relative',
          padding: 'min(18vh, 150px) 32px min(18vh, 150px) clamp(22px, 6.5vw, 92px)',
          background:
            'linear-gradient(180deg, #0b0f18 0%, #08090f 10%, #08090f 90%, #0b0f18 100%)',
        }}
      >
        <SectionScrim />
        <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 'clamp(32px, 6vw, 90px)',
              alignItems: 'end',
              marginBottom: 'clamp(46px, 7vw, 92px)',
            }}
          >
            <div>
              <p
                style={{
                  margin: '0 0 20px',
                  fontSize: '11px',
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color: '#75798c',
                }}
              >
                Chapter two · The Hand
              </p>
              <h2
                style={{
                  margin: 0,
                  maxWidth: '15ch',
                  fontFamily: 'var(--font-cormorant), var(--font-cinzel), Georgia, serif',
                  fontWeight: 400,
                  fontSize: 'clamp(34px, 5vw, 68px)',
                  lineHeight: 1.06,
                  letterSpacing: '-0.01em',
                  color: '#f3f5fe',
                  textWrap: 'pretty',
                }}
              >
                The art of dressing without excess.
              </h2>
            </div>
            <div>
              <p
                style={{
                  margin: 0,
                  maxWidth: '40ch',
                  fontSize: '16px',
                  lineHeight: 1.72,
                  color: '#9397ab',
                  textWrap: 'pretty',
                }}
              >
                The silhouettes are conventional. The surface is not. Every technique below is worked
                by hand in Kolkata, on cloth already cut to one person.
              </p>
              <div
                style={{
                  margin: '22px 0 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '11.5px',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: '#75798c',
                }}
              >
                <LoupeIcon size={14} color="#c5a880" />
                <span>{isTouch ? 'Tap a plate to inspect craftsmanship' : 'Hover a plate to bring the loupe'}</span>
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'clamp(28px, 3.6vw, 48px)',
            }}
          >
            {LOUPE_PLATES.map((p, idx) => (
              <figure key={p.n} data-reveal="1" style={{ margin: 0 }}>
                <div
                  onPointerEnter={(e) => handlePointerEnter(e, p.src)}
                  onPointerLeave={handlePointerLeave}
                  onPointerMove={handlePointerMove}
                  onClick={() => handleTouchClick(idx)}
                  style={{
                    position: 'relative',
                    aspectRatio: '4/5',
                    overflow: 'hidden',
                    background: '#0e1420',
                    borderRadius: '4px',
                    cursor: isTouch ? 'zoom-in' : 'none',
                    boxShadow: '0 20px 45px rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(207, 211, 229, 0.1)',
                  }}
                >
                  <Image
                    src={p.src}
                    alt={p.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{
                      objectFit: 'cover',
                      objectPosition: 'center 20%',
                      filter: 'saturate(.95) contrast(1.03)',
                      transform: isTouch && zoomedIdx === idx ? 'scale(1.25)' : 'none',
                      transition: 'transform 700ms cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  />
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      boxShadow: 'inset 0 0 60px rgba(6, 9, 15, 0.45)',
                    }}
                  />
                </div>
                <figcaption
                  style={{
                    marginTop: '18px',
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '14px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-cinzel), Georgia, serif',
                      fontSize: '11px',
                      letterSpacing: '0.2em',
                      color: '#c5a880',
                    }}
                  >
                    {p.n}
                  </span>
                  <span>
                    <span
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-cormorant), var(--font-cinzel), Georgia, serif',
                        fontSize: 'clamp(20px, 2vw, 26px)',
                        fontWeight: 400,
                        color: '#f3f5fe',
                        lineHeight: 1.2,
                      }}
                    >
                      {p.name}
                    </span>
                    <span
                      style={{
                        display: 'block',
                        marginTop: '6px',
                        fontSize: '13px',
                        lineHeight: 1.5,
                        color: '#75798c',
                      }}
                    >
                      {p.note}
                    </span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Floating Loupe Inspector Portal */}
      {!isTouch && (
        <div
          ref={loupeRef}
          aria-hidden="true"
          className="optic-lens-frame"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '220px',
            height: '220px',
            marginLeft: '-110px',
            marginTop: '-110px',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 9999,
            border: '2px solid rgba(229, 189, 113, 0.85)',
            boxShadow:
              '0 30px 90px rgba(0, 0, 0, 0.85), inset 0 0 0 1.5px rgba(255, 70, 70, 0.3), inset 0 0 35px rgba(0, 0, 0, 0.6), 0 0 30px rgba(229, 189, 113, 0.25)',
            backgroundRepeat: 'no-repeat',
            opacity: 0,
            visibility: 'hidden',
            transition: 'opacity 180ms ease, visibility 180ms ease',
            willChange: 'transform, background-position',
          }}
        >
          {/* Glass Specular Convex Reflection */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background:
                'radial-gradient(circle at 32% 28%, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0.04) 45%, transparent 70%)',
            }}
          />

          {/* Micro Precision Calibration Reticle */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: '18px',
              height: '1px',
              background: '#e5bd71',
              transform: 'translate(-50%, -50%)',
              opacity: 0.85,
              boxShadow: '0 0 4px rgba(229, 189, 113, 0.6)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: '1px',
              height: '18px',
              background: '#e5bd71',
              transform: 'translate(-50%, -50%)',
              opacity: 0.85,
              boxShadow: '0 0 4px rgba(229, 189, 113, 0.6)',
            }}
          />
        </div>
      )}
    </>
  );
}
