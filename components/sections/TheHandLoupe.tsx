'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { LOUPE_PLATES } from '@/lib/constants';
import { LoupeIcon } from '@/components/common/Icons';

export default function TheHandLoupe() {
  const loupeRef = useRef<HTMLDivElement>(null);
  const [isTouch, setIsTouch] = useState<boolean>(false);
  const [zoomedIdx, setZoomedIdx] = useState<number | null>(null);

  useEffect(() => {
    const touch = window.matchMedia('(hover: none)').matches;
    setIsTouch(touch);
  }, []);

  const handlePointerEnter = (src: string) => {
    if (isTouch || !loupeRef.current) return;
    loupeRef.current.style.backgroundImage = `url(${src})`;
    loupeRef.current.style.opacity = '1';
  };

  const handlePointerLeave = () => {
    if (isTouch || !loupeRef.current) return;
    loupeRef.current.style.opacity = '0';
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isTouch || !loupeRef.current) return;
    const Z = 2.1;
    const R = 105;
    const frame = e.currentTarget;
    const r = frame.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;

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
        style={{
          position: 'relative',
          padding: 'min(18vh, 150px) 32px min(18vh, 150px) clamp(22px, 6.5vw, 92px)',
          background:
            'linear-gradient(180deg, rgba(6, 9, 15, 0), rgba(6, 9, 15, 0.85) 12%, rgba(6, 9, 15, 0.85) 88%, rgba(6, 9, 15, 0))',
        }}
      >
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
                <span>{isTouch ? 'Tap a plate to inspect macro embroidery' : 'Hover a plate to bring the loupe'}</span>
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
                  onPointerEnter={() => handlePointerEnter(p.src)}
                  onPointerLeave={handlePointerLeave}
                  onPointerMove={handlePointerMove}
                  onClick={() => handleTouchClick(idx)}
                  style={{
                    position: 'relative',
                    aspectRatio: '1/1',
                    overflow: 'hidden',
                    background: '#0e1420',
                    borderRadius: '4px',
                    cursor: isTouch ? 'zoom-in' : 'none',
                    boxShadow: '0 20px 45px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  <Image
                    src={p.src}
                    alt={p.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{
                      objectFit: 'cover',
                      filter: 'saturate(.92) contrast(1.04)',
                      transform: isTouch && zoomedIdx === idx ? 'scale(2.1)' : 'none',
                      transition: 'transform 700ms cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  />
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      boxShadow: 'inset 0 0 90px rgba(6, 9, 15, 0.55)',
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
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '210px',
            height: '210px',
            marginLeft: '-105px',
            marginTop: '-105px',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 80,
            border: '1px solid rgba(207, 211, 229, 0.65)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.6), inset 0 0 40px rgba(0,0,0,0.4)',
            backgroundRepeat: 'no-repeat',
            opacity: 0,
            transition: 'opacity 250ms ease',
            willChange: 'transform, background-position',
          }}
        >
          {/* Glass Specular & Crosshair */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background:
                'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.18) 0%, transparent 60%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: '12px',
              height: '1px',
              background: '#cfd3e5',
              transform: 'translate(-50%, -50%)',
              opacity: 0.7,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: '1px',
              height: '12px',
              background: '#cfd3e5',
              transform: 'translate(-50%, -50%)',
              opacity: 0.7,
            }}
          />
        </div>
      )}
    </>
  );
}
