'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { RAIL_ITEMS } from '@/lib/constants';

export default function TheRail() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const velRef = useRef<number>(0);
  const lastScrollRef = useRef<number>(0);

  useEffect(() => {
    const r = containerRef.current;
    const track = trackRef.current;
    if (!r || !track) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const handleScroll = () => {
      const v = r.scrollLeft - lastScrollRef.current;
      lastScrollRef.current = r.scrollLeft;
      velRef.current = Math.max(-60, Math.min(60, v));
    };

    const handlePointerDown = (e: PointerEvent) => {
      isDown = true;
      startX = e.clientX;
      scrollLeft = r.scrollLeft;
      r.style.cursor = 'grabbing';
      r.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDown) return;
      r.scrollLeft = scrollLeft - (e.clientX - startX);
    };

    const handlePointerUp = () => {
      isDown = false;
      r.style.cursor = 'grab';
    };

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      const max = r.scrollWidth - r.clientWidth;
      if (
        (r.scrollLeft > 0 && r.scrollLeft < max) ||
        (r.scrollLeft === 0 && e.deltaY > 0) ||
        (r.scrollLeft >= max && e.deltaY < 0)
      ) {
        r.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    };

    r.addEventListener('scroll', handleScroll, { passive: true });
    r.addEventListener('pointerdown', handlePointerDown);
    r.addEventListener('pointermove', handlePointerMove);
    r.addEventListener('pointerup', handlePointerUp);
    r.addEventListener('pointercancel', handlePointerUp);
    r.addEventListener('wheel', handleWheel, { passive: false });

    // Animation frame for inertia skew and settling
    let animId: number;
    const loop = () => {
      animId = requestAnimationFrame(loop);
      velRef.current *= 0.86;
      const sk = Math.max(-4.5, Math.min(4.5, velRef.current * 0.09));
      track.style.transform = `skewX(${sk.toFixed(2)}deg)`;
      const b = Math.min(3.2, Math.abs(velRef.current) * 0.055);
      track.style.filter = b > 0.08 ? `blur(${b.toFixed(2)}px)` : 'none';
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      r.removeEventListener('scroll', handleScroll);
      r.removeEventListener('pointerdown', handlePointerDown);
      r.removeEventListener('pointermove', handlePointerMove);
      r.removeEventListener('pointerup', handlePointerUp);
      r.removeEventListener('pointercancel', handlePointerUp);
      r.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <section
      id="rail"
      data-screen-label="The Rail"
      style={{
        position: 'relative',
        padding: 'min(14vh, 120px) 0 min(14vh, 120px)'
      }}
    >
      <div
        style={{
          padding: '0 32px 0 clamp(22px, 6.5vw, 92px)',
          maxWidth: '1320px',
          margin: '0 auto 44px',
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: '24px',
          flexWrap: 'wrap'
        }}
      >
        <div>
          <p
            style={{
              margin: '0 0 18px',
              fontSize: '11px',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: '#75798c'
            }}
          >
            The rail
          </p>
          <h2
            style={{
              margin: 0,
              fontFamily: 'var(--font-newsreader), Georgia, serif',
              fontWeight: 300,
              fontSize: 'clamp(28px, 3.6vw, 48px)',
              lineHeight: 1.1,
              color: '#f3f5fe'
            }}
          >
            Every great outfit starts with a great shirt.
          </h2>
        </div>
        <p
          style={{
            margin: 0,
            fontSize: '11.5px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: '#75798c',
            whiteSpace: 'nowrap'
          }}
        >
          Drag to move along the rail →
        </p>
      </div>

      <div
        ref={containerRef}
        style={{
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollbarWidth: 'none',
          cursor: 'grab',
          padding: '0 32px 0 clamp(22px, 6.5vw, 92px)',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <div
          ref={trackRef}
          style={{
            display: 'flex',
            gap: 'clamp(16px, 2vw, 30px)',
            width: 'max-content',
            alignItems: 'flex-end',
            paddingBottom: '8px',
            willChange: 'transform'
          }}
        >
          {RAIL_ITEMS.map((it, idx) => (
            <figure
              key={idx}
              style={{
                margin: 0,
                flex: 'none',
                width: 'clamp(220px, 20vw, 310px)'
              }}
            >
              <div
                style={{
                  position: 'relative',
                  aspectRatio: '3/4',
                  overflow: 'hidden',
                  background: '#131b29'
                }}
              >
                <Image
                  src={it.src}
                  alt={it.alt}
                  fill
                  sizes="310px"
                  style={{
                    objectFit: 'cover',
                    filter: 'saturate(.9) contrast(1.03)',
                    pointerEvents: 'none'
                  }}
                />
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'var(--grade)',
                    mixBlendMode: 'multiply'
                  }}
                />
              </div>
              <figcaption
                style={{
                  marginTop: '12px',
                  fontSize: '11.5px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: '#75798c'
                }}
              >
                {it.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
