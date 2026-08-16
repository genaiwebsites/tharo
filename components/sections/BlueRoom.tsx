'use client';

import React from 'react';
import Image from 'next/image';

export default function BlueRoom() {
  return (
    <section
      id="blue-room"
      data-screen-label="Blue Room"
      style={{
        position: 'relative',
        padding: 'min(16vh, 140px) 32px min(14vh, 120px) clamp(22px, 6.5vw, 92px)'
      }}
    >
      <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: '32px',
            flexWrap: 'wrap',
            marginBottom: 'clamp(48px, 7vw, 96px)'
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
              Chapter one · The Blue Room
            </p>
            <h2
              style={{
                margin: 0,
                maxWidth: '16ch',
                fontFamily: 'var(--font-cormorant), var(--font-cinzel), Georgia, serif',
                fontWeight: 400,
                fontSize: 'clamp(34px, 5vw, 68px)',
                lineHeight: 1.06,
                letterSpacing: '-0.01em',
                color: '#f3f5fe',
                textWrap: 'pretty'
              }}
            >
              Just unforgettable, not loud.
            </h2>
          </div>
          <p
            style={{
              margin: 0,
              maxWidth: '34ch',
              fontSize: '16px',
              lineHeight: 1.72,
              color: '#9397ab',
              textWrap: 'pretty'
            }}
          >
            Tuxedos, bandhgalas, dinner jackets and black shirting, cut in the panelled room. Cool light,
            hard shadow, silver thread. The evening half of the house.
          </p>
        </div>

        {/* Gallery Grid 1 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: 'clamp(14px, 1.8vw, 28px)',
            alignItems: 'start'
          }}
        >
          <figure data-depth="0.05" data-reveal="1" style={{ margin: 0, gridColumn: 'span 2' }}>
            <div
              style={{
                position: 'relative',
                aspectRatio: '3/4',
                overflow: 'hidden',
                background: '#131b29'
              }}
            >
              <Image
                src="/images/collection/tharo-midnight-blue-sequin-velvet-tuxedo.png"
                alt="THARO midnight navy sequin-embroidered bespoke tuxedo in deep blue salon"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'cover', filter: 'saturate(.9) contrast(1.03)' }}
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
              Sequin tuxedo
            </figcaption>
          </figure>

          <figure
            data-depth="-0.04"
            data-reveal="1"
            style={{ margin: 'clamp(60px, 9vw, 150px) 0 0', gridColumn: 'span 2' }}
          >
            <div
              style={{
                position: 'relative',
                aspectRatio: '4/5',
                overflow: 'hidden',
                background: '#131b29'
              }}
            >
              <Image
                src="/images/collection/tharo-royal-blue-raw-silk-jacket-silver-embroidery.png"
                alt="THARO royal blue raw silk dinner jacket with artisanal silver soutache embroidery"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'cover', filter: 'saturate(.9) contrast(1.03)' }}
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
              Soutache dinner jacket
            </figcaption>
          </figure>

          <figure
            data-depth="0.09"
            data-reveal="1"
            style={{ margin: 'clamp(20px, 4vw, 70px) 0 0', gridColumn: 'span 1' }}
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
                src="/images/craft/tharo-cornelli-corded-threadwork-macro.png"
                alt="Macro detail of THARO silver corded cornelli thread coiling across black silk cloth"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                style={{ objectFit: 'cover', filter: 'saturate(.86) contrast(1.06)' }}
              />
            </div>
          </figure>
        </div>

        {/* Gallery Grid 2 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: 'clamp(14px, 1.8vw, 28px)',
            alignItems: 'end',
            marginTop: 'clamp(40px, 6vw, 96px)'
          }}
        >
          <div style={{ gridColumn: 'span 1', paddingBottom: '12px' }}>
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--font-cormorant), var(--font-cinzel), Georgia, serif',
                fontStyle: 'italic',
                fontWeight: 400,
                fontSize: 'clamp(20px, 2.1vw, 27px)',
                lineHeight: 1.4,
                color: '#cfd3e5',
                textWrap: 'pretty'
              }}
            >
              Clean lines, composed presence.
            </p>
            <p
              style={{
                margin: '20px 0 0',
                fontSize: '15.5px',
                lineHeight: 1.7,
                color: '#75798c',
                textWrap: 'pretty'
              }}
            >
              The single accent in the room is oxblood. It appears once a season.
            </p>
          </div>

          <figure data-depth="0.03" data-reveal="1" style={{ margin: 0, gridColumn: 'span 2' }}>
            <div
              style={{
                position: 'relative',
                aspectRatio: '3/4',
                overflow: 'hidden',
                background: '#131b29'
              }}
            >
              <Image
                src="/images/collection/tharo-oxblood-velvet-dinner-jacket.png"
                alt="THARO oxblood maroon bespoke dinner jacket with tonal hand beadwork"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'cover', filter: 'saturate(.94) contrast(1.03)' }}
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
              Oxblood dinner jacket
            </figcaption>
          </figure>

          <figure data-depth="-0.06" data-reveal="1" style={{ margin: 0, gridColumn: 'span 2' }}>
            <div
              style={{
                position: 'relative',
                aspectRatio: '4/5',
                overflow: 'hidden',
                background: '#131b29'
              }}
            >
              <Image
                src="/images/collection/tharo-navy-bespoke-suit-structured-shoulder.png"
                alt="THARO bespoke midnight navy suit with architectural shoulder and silver threadwork"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'cover', filter: 'saturate(.9) contrast(1.03)' }}
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
          </figure>
        </div>
      </div>
    </section>
  );
}
