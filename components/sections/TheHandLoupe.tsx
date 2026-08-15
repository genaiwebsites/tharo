'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { LOUPE_PLATES } from '@/lib/constants';

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
            'linear-gradient(180deg, rgba(6, 9, 15, 0), rgba(6, 9, 15, 0.85) 12%, rgba(6, 9, 15, 0.85) 88%, rgba(6, 9, 15, 0))'
        }}
      >
        <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 'clamp(32px, 6vw, 90px)',
              alignItems: 'end',
              marginBottom: 'clamp(46px, 7vw, 92px)'
            }}
          >
            <div>
              <p
                style={{
                  margin: '0 0 20px',
                  fontSize: '11px',
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color: '#75798c'
                }}
              >
                Chapter two · The Hand
              </p>
              <h2
                style={{
                  margin: 0,
                  maxWidth: '15ch',
                  fontFamily: 'var(--font-newsreader), Georgia, serif',
                  fontWeight: 300,
                  fontSize: 'clamp(34px, 5vw, 68px)',
                  lineHeight: 1.06,
                  letterSpacing: '-0.01em',
                  color: '#f3f5fe',
                  textWrap: 'pretty'
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
                  textWrap: 'pretty'
                }}
              >
                The silhouettes are conventional. The surface is not. Every technique below is worked
                by hand in Kolkata, on cloth already cut to one person.
              </p>
              <p
                style={{
                  margin: '22px 0 0',
                  fontSize: '11.5px',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: '#5f6472'
                }}
              >
                {isTouch ? 'Tap a plate to inspect macro embroidery' : 'Hover a plate to bring the loupe'}
              </p>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 'clamp(22px, 3vw, 52px)'
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
                    cursor: isTouch ? 'zoom-in' : 'none'
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
                      transition: 'transform 700ms cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  />
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      boxShadow: 'inset 0 0 90px rgba(6, 9, 15, 0.55)'
                    }}
                  />
                </div>
                <figcaption
                  style={{
                    marginTop: '18px',
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '14px'
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-newsreader), Georgia, serif',
                      fontSize: '11px',
                      letterSpacing: '0.2em',
                      color: '#5f6472'
                    }}
                  >
                    {p.n}
                  </span>
                  <span>
                    <span
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-newsreader), Georgia, serif',
                        fontSize: 'clamp(20px, 2vw, 26px)',
                        fontWeight: 300,
                        color: '#f3f5fe',
                        lineHeight: 1.2
                      }}
                    >
                      {p.name}
                    </span>
                    <span
                      style={{
                        display: 'block',
                        marginTop: '8px',
                        fontSize: '15px',
                        lineHeight: 1.65,
                        color: '#9397ab',
                        maxWidth: '36ch',
                        textWrap: 'pretty'
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

      {/* Floating Loupe Inspector Element */}
      <div
        ref={loupeRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 85,
          width: '210px',
          height: '210px',
          margin: '-105px 0 0 -105px',
          borderRadius: '50%',
          opacity: 0,
          pointerEvents: 'none',
          backgroundRepeat: 'no-repeat',
          boxShadow:
            'inset 0 0 0 1px rgba(207, 211, 229, 0.55), inset 0 0 44px rgba(6, 9, 15, 0.5), 0 28px 70px rgba(0, 0, 0, 0.55)',
          transition: 'opacity 260ms cubic-bezier(0.16, 1, 0.3, 1)',
          willChange: 'transform'
        }}
      />
    </>
  );
}
