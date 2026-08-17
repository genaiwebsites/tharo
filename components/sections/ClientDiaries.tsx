'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { CLIENT_DIARIES } from '@/lib/constants';
import { SectionScrim } from '@/components/common/SectionScrim';

export default function ClientDiaries() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dxRef = useRef<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const s = sectionRef.current;
      const track = trackRef.current;
      if (!s || !track) return;

      const r = s.getBoundingClientRect();
      const vh = window.innerHeight;
      const dp = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
      const dist = Math.max(0, track.scrollWidth - window.innerWidth + 120);
      const x = -dp * dist;

      track.style.transform = `translate3d(${x.toFixed(1)}px, 0, 0)`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      id="diaries"
      data-screen-label="Client Diaries"
      ref={sectionRef}
      style={{
        position: 'relative',
        padding: 'min(14vh, 120px) 0 min(16vh, 130px)',
        overflow: 'hidden'
      }}
    >
      <SectionScrim />
      <div
        style={{
          padding: '0 32px 0 clamp(22px, 6.5vw, 92px)',
          maxWidth: '1320px',
          margin: '0 auto clamp(36px, 5vw, 64px)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'clamp(28px, 5vw, 80px)',
          alignItems: 'end'
        }}
      >
        <div>
          <p
            style={{
              margin: '0 0 20px',
              fontSize: '11px',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: '#8a7f70'
            }}
          >
            Chapter five · Client Diaries
          </p>
          <h2
            style={{
              margin: 0,
              maxWidth: '18ch',
              fontFamily: 'var(--font-cormorant), var(--font-cinzel), Georgia, serif',
              fontWeight: 400,
              fontSize: 'clamp(32px, 4.4vw, 58px)',
              lineHeight: 1.08,
              color: '#f3f5fe',
              textWrap: 'pretty'
            }}
          >
            The days these were made for.
          </h2>
        </div>
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--font-cormorant), var(--font-cinzel), Georgia, serif',
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: 'clamp(17px, 1.7vw, 21px)',
            lineHeight: 1.5,
            color: '#a3968a',
            textWrap: 'pretty'
          }}
        >
          “Tharo tailoring — designed for legacy, worn with grace.”
        </p>
      </div>

      <div
        ref={trackRef}
        style={{
          display: 'flex',
          gap: 'clamp(16px, 2vw, 30px)',
          padding: '0 32px 0 clamp(22px, 6.5vw, 92px)',
          width: 'max-content',
          willChange: 'transform'
        }}
      >
        {CLIENT_DIARIES.map((d, idx) => (
          <figure
            key={idx}
            style={{
              margin: 0,
              flex: 'none',
              width: 'clamp(230px, 21vw, 320px)'
            }}
          >
            <div
              style={{
                position: 'relative',
                aspectRatio: '4/5',
                overflow: 'hidden',
                background: '#2a221c'
              }}
            >
              <Image
                src={d.src}
                alt={d.alt}
                fill
                sizes="320px"
                style={{
                  objectFit: 'cover',
                  filter: 'saturate(.8) contrast(1.07) brightness(.97) sepia(.1)',
                  transition: 'transform 900ms cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              />
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(28, 20, 14, 0.05), rgba(28, 20, 14, 0.42))'
                }}
              />
            </div>
            <figcaption style={{ marginTop: '14px' }}>
              <span
                style={{
                  display: 'block',
                  fontSize: '11.5px',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: '#a3968a'
                }}
              >
                {d.occasion}
              </span>
              <span
                style={{
                  display: 'block',
                  marginTop: '6px',
                  fontSize: '14.5px',
                  lineHeight: 1.55,
                  color: '#7d7367'
                }}
              >
                {d.note}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
