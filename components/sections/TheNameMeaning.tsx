'use client';

import React from 'react';
import Image from 'next/image';

export default function TheNameMeaning() {
  return (
    <>
      <section
        id="meaning"
        data-screen-label="Meaning"
        style={{
          position: 'relative',
          padding: 'min(20vh, 180px) 32px min(18vh, 150px) clamp(22px, 6.5vw, 92px)'
        }}
      >
        <div
          style={{
            maxWidth: '1180px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'clamp(40px, 7vw, 110px)',
            alignItems: 'center'
          }}
        >
          <div>
            <p
              style={{
                margin: '0 0 42px',
                fontSize: '11px',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: '#75798c'
              }}
            >
              The name
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <p
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-noto-devanagari), sans-serif',
                  fontWeight: 600,
                  fontSize: 'clamp(30px, 4.4vw, 54px)',
                  lineHeight: 1.25,
                  color: '#f3f5fe'
                }}
              >
                थारो
              </p>
              <p
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-cormorant), var(--font-cinzel), Georgia, serif',
                  fontWeight: 400,
                  fontSize: 'clamp(30px, 4.4vw, 54px)',
                  lineHeight: 1.25,
                  color: '#cfd3e5',
                  fontStyle: 'italic'
                }}
              >
                yours
              </p>
              <p
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-cormorant), var(--font-cinzel), Georgia, serif',
                  fontWeight: 400,
                  fontSize: 'clamp(30px, 4.4vw, 54px)',
                  lineHeight: 1.25,
                  color: '#75798c'
                }}
              >
                designed for you
              </p>
            </div>
            <p
              style={{
                margin: '44px 0 0',
                maxWidth: '44ch',
                fontSize: '17px',
                lineHeight: 1.7,
                color: '#b2b6ca',
                textWrap: 'pretty'
              }}
            >
              <em style={{ fontStyle: 'normal', color: '#e9e9ed' }}>Tharo</em> means{' '}
              <em style={{ fontStyle: 'normal', color: '#e9e9ed' }}>yours</em> in Marwari. Not a slogan
              the house adopted — the whole instruction. The word is second person: the garment
              belongs to the man standing in front of the mirror before it belongs to the house that made
              it.
            </p>
          </div>

          <figure style={{ margin: 0, position: 'relative' }}>
            <div
              style={{
                position: 'relative',
                aspectRatio: '4/5',
                overflow: 'hidden',
                background: '#131b29'
              }}
            >
              <Image
                src="/images/macro_cornelli.png"
                alt="Silver cornelli soutache embroidery running across the shoulder of a black jacket, Blue Room"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{
                  objectFit: 'cover',
                  objectPosition: '22% 40%',
                  filter: 'saturate(.86) contrast(1.04)'
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
                marginTop: '14px',
                fontSize: '11.5px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#75798c'
              }}
            >
              Cornelli, worked by hand · Blue Room
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
