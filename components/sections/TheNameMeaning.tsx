'use client';

import React from 'react';
import Image from 'next/image';
import { SectionScrim } from '@/components/common/SectionScrim';

export default function TheNameMeaning() {
  return (
    <>
      <section
        id="meaning"
        data-screen-label="Meaning"
        style={{
          position: 'relative',
          padding: 'clamp(54px, 8vh, 84px) 32px clamp(54px, 8vh, 84px) clamp(22px, 6.5vw, 92px)',
        }}
      >
        <SectionScrim />
        <div
          style={{
            maxWidth: '1120px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(36px, 5vw, 72px)',
            alignItems: 'center',
          }}
        >
          {/* Left Column: Editorial Manifesto */}
          <div>
            {/* Eyebrow Chapter Tag */}
            <p
              style={{
                margin: '0 0 20px',
                fontSize: '10.5px',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: '#c5a880',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ width: '14px', height: '1px', background: '#c5a880' }} />
              The Philosophy
            </p>

            {/* Unified Typographic Headline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-noto-devanagari), sans-serif',
                    fontWeight: 600,
                    fontSize: 'clamp(28px, 3.4vw, 44px)',
                    lineHeight: 1.15,
                    color: '#f3f5fe',
                  }}
                >
                  थारो
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-cormorant), var(--font-cinzel), Georgia, serif',
                    fontWeight: 400,
                    fontSize: 'clamp(26px, 3.2vw, 42px)',
                    lineHeight: 1.15,
                    color: '#c5a880',
                    fontStyle: 'italic',
                  }}
                >
                  yours
                </span>
              </div>
              <p
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-cormorant), var(--font-cinzel), Georgia, serif',
                  fontWeight: 400,
                  fontSize: 'clamp(20px, 2.2vw, 28px)',
                  lineHeight: 1.25,
                  color: '#9397ab',
                  letterSpacing: '0.02em',
                }}
              >
                Designed for you. Never the rack.
              </p>
            </div>

            {/* Poetic & Sharp Manifesto Copy */}
            <p
              style={{
                margin: '24px 0 0',
                maxWidth: '42ch',
                fontSize: 'clamp(14.5px, 1.4vw, 16px)',
                lineHeight: 1.7,
                color: '#b2b6ca',
                textWrap: 'pretty',
              }}
            >
              In Marwari, <strong style={{ fontWeight: 600, color: '#f3f5fe' }}>Tharo</strong> translates directly to{' '}
              <strong style={{ fontWeight: 600, color: '#f3f5fe' }}>yours</strong>. It is not a marketing slogan—it is the whole instruction. Every anatomical cut, basting stitch, and lapel contour is crafted in the second person: belonging to the gentleman standing before the mirror before it ever belongs to the atelier.
            </p>
          </div>

          {/* Right Column: Tailored Haute Couture Specimen Card */}
          <figure style={{ margin: '0 auto', maxWidth: '400px', width: '100%', position: 'relative' }}>
            <div
              style={{
                position: 'relative',
                aspectRatio: '3/4',
                overflow: 'hidden',
                borderRadius: '6px',
                background: '#131b29',
                border: '1px solid rgba(207, 211, 229, 0.16)',
                boxShadow: '0 24px 60px rgba(0, 0, 0, 0.75), 0 0 30px rgba(197, 168, 128, 0.08)',
              }}
            >
              <Image
                src="/images/collection/tharo-navy-bespoke-suit-structured-shoulder.png"
                alt="Silver cornelli soutache hand-embroidery across the shoulder of bespoke THARO navy tailoring"
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center',
                  filter: 'contrast(1.02) brightness(0.98)',
                }}
              />
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, transparent 65%, rgba(11, 15, 24, 0.65) 100%)',
                }}
              />
            </div>
            <figcaption
              style={{
                marginTop: '12px',
                fontSize: '10.5px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#8a90a2',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#c5a880' }} />
              <span>Silver Cornelli Hand-Work · The Blue Room</span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Decorative embroidery transition stitch divider */}
      <div
        aria-hidden="true"
        style={{ padding: '0 32px 0 clamp(22px, 6.5vw, 92px)' }}
      >
        <svg
          viewBox="0 0 1200 34"
          preserveAspectRatio="none"
          style={{ width: '100%', height: '32px', display: 'block' }}
        >
          <path
            d="M0 17C40 17 52 5 84 6C116 7 122 28 154 28C186 28 194 6 226 6C258 6 266 28 298 28C330 28 338 6 370 6C402 6 410 28 442 28C474 28 482 6 514 6C546 6 554 28 586 28C618 28 626 6 658 6C690 6 698 28 730 28C762 28 770 6 802 6C834 6 842 28 874 28C906 28 914 6 946 6C978 6 986 28 1018 28C1050 28 1058 6 1090 6C1122 6 1134 17 1200 17"
            fill="none"
            stroke="#cfd3e5"
            strokeWidth="1"
            opacity="0.42"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M0 17C40 17 52 28 84 28C116 28 122 6 154 6C186 6 194 28 226 28C258 28 266 6 298 6C330 6 338 28 370 28C402 28 410 6 442 6C474 6 482 28 514 28C546 28 554 6 586 6C618 6 626 28 658 28C690 28 698 6 730 6C762 6 770 28 802 28C834 28 842 6 874 6C906 6 914 28 946 28C978 28 986 6 1018 6C1050 6 1058 28 1090 28C1122 28 1134 17 1200 17"
            fill="none"
            stroke="#cfd3e5"
            strokeWidth="1"
            opacity="0.18"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M0 17H1200"
            stroke="#cfd3e5"
            strokeWidth="1"
            strokeDasharray="1.5 9"
            opacity="0.22"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M84 6v22M226 6v22M370 6v22M514 6v22M658 6v22M802 6v22M946 6v22M1090 6v22"
            stroke="#cfd3e5"
            strokeWidth="1"
            opacity="0.12"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </>
  );
}
