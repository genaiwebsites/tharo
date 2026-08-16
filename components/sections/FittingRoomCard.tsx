'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { OCCASION_OPTIONS } from '@/lib/constants';
import { StorePinIcon } from '@/components/common/Icons';

export default function FittingRoomCard() {
  const [occasion, setOccasion] = useState<string>('Wedding');
  const [date, setDate] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [detectedCity, setDetectedCity] = useState<string>('Kolkata');
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardTilt, setCardTilt] = useState<{ rx: number; ry: number }>({ rx: 0, ry: 0 });

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      const seg = tz.split('/').pop() || '';
      const foundCity = seg ? seg.replace(/_/g, ' ') : '';
      if (foundCity === 'Calcutta' || foundCity === '') {
        setDetectedCity('Kolkata');
      } else {
        setDetectedCity(foundCity);
      }
    } catch {
      setDetectedCity('Kolkata');
    }
  }, []);

  const activeCity = city.trim() || detectedCity;

  const dateLabel = () => {
    if (!date) return 'To be set';
    const d = new Date(date + 'T12:00:00');
    if (isNaN(d.getTime())) return 'To be set';
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formattedDate = dateLabel();

  const waLink = () => {
    const msg = `Khamma Ghani. I would like to book a bespoke fitting at Tharo.\n\nOccasion: ${occasion}\nPreferred Date: ${formattedDate}\nCity: ${activeCity}`;
    return `https://wa.me/919062512323?text=${encodeURIComponent(msg)}`;
  };

  const inviteText =
    detectedCity && detectedCity !== 'Kolkata'
      ? `Three lines is all it takes. Tell us the occasion, a date that suits, and we will hold the room on Allenby Road — we dress clients travelling in from ${detectedCity} every season.`
      : 'Three lines is all it takes. Tell us the occasion and a date that suits, and we will hold the room on Allenby Road.';

  // 3D Card tilt on hover
  const handleCardPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    setCardTilt({
      rx: ny * -12,
      ry: nx * 14,
    });
  };

  const handleCardPointerLeave = () => {
    setCardTilt({ rx: 0, ry: 0 });
  };

  return (
    <section
      id="fitting-room"
      data-screen-label="The Fitting Room"
      style={{
        position: 'relative',
        padding: 'min(18vh, 160px) 32px min(16vh, 140px) clamp(22px, 6.5vw, 92px)',
        background: 'radial-gradient(90% 70% at 50% 30%, rgba(20, 26, 40, 0.4) 0%, transparent 80%)',
      }}
    >
      <div
        style={{
          maxWidth: '1320px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 'clamp(48px, 6.5vw, 110px)',
          alignItems: 'center',
        }}
      >
        {/* Left Column: Bespoke Atelier Form */}
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '20px',
              fontSize: '11px',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: '#c5a880',
            }}
          >
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#c5a880' }} />
            <span>Chapter seven · The Fitting Room</span>
          </div>

          <h2
            style={{
              margin: 0,
              maxWidth: '16ch',
              fontFamily: 'var(--font-cormorant), var(--font-cinzel), Georgia, serif',
              fontWeight: 400,
              fontSize: 'clamp(34px, 4.8vw, 64px)',
              lineHeight: 1.06,
              color: '#f3f5fe',
              textWrap: 'pretty',
            }}
          >
            Come in and be measured.
          </h2>

          <p
            style={{
              margin: '24px 0 clamp(36px, 4vw, 52px)',
              maxWidth: '42ch',
              fontSize: 'clamp(15px, 1.4vw, 16.5px)',
              lineHeight: 1.72,
              color: '#9397ab',
              textWrap: 'pretty',
            }}
          >
            {inviteText}
          </p>

          <div style={{ display: 'grid', gap: 'clamp(24px, 2.6vw, 36px)', maxWidth: '480px' }}>
            {/* 1. Occasion Selector Chips */}
            <div>
              <span
                style={{
                  display: 'block',
                  marginBottom: '12px',
                  fontSize: '11px',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: '#75798c',
                  fontWeight: 500,
                }}
              >
                1. Select Occasion
              </span>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                {OCCASION_OPTIONS.map((o) => {
                  const isSelected = occasion === o;
                  return (
                    <button
                      key={o}
                      type="button"
                      onClick={() => setOccasion(o)}
                      style={{
                        appearance: 'none',
                        border: isSelected ? '1px solid #c5a880' : '1px solid rgba(207, 211, 229, 0.16)',
                        background: isSelected ? 'rgba(197, 168, 128, 0.12)' : 'rgba(11, 15, 24, 0.5)',
                        color: isSelected ? '#f3f5fe' : '#9397ab',
                        padding: '9px 16px',
                        borderRadius: '30px',
                        fontSize: '12.5px',
                        letterSpacing: '0.04em',
                        cursor: 'pointer',
                        transition: 'all 250ms ease',
                        boxShadow: isSelected ? '0 0 14px rgba(197, 168, 128, 0.25)' : 'none',
                      }}
                    >
                      {o}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Preferred Date Picker */}
            <div>
              <span
                style={{
                  display: 'block',
                  marginBottom: '10px',
                  fontSize: '11px',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: '#75798c',
                  fontWeight: 500,
                }}
              >
                2. Preferred Date
              </span>
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(11, 15, 24, 0.6)',
                  border: '1px solid rgba(207, 211, 229, 0.2)',
                  borderRadius: '6px',
                  padding: '12px 16px',
                  transition: 'border-color 200ms ease',
                }}
              >
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 0,
                    outline: 'none',
                    fontFamily: 'var(--font-inter-tight), sans-serif',
                    fontSize: '14.5px',
                    color: '#f3f5fe',
                    colorScheme: 'dark',
                    cursor: 'pointer',
                  }}
                />
              </div>
            </div>

            {/* 3. City Input */}
            <div>
              <span
                style={{
                  display: 'block',
                  marginBottom: '10px',
                  fontSize: '11px',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: '#75798c',
                  fontWeight: 500,
                }}
              >
                3. Your City
              </span>
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'rgba(11, 15, 24, 0.6)',
                  border: '1px solid rgba(207, 211, 229, 0.2)',
                  borderRadius: '6px',
                  padding: '12px 16px',
                }}
              >
                <StorePinIcon size={16} color="#c5a880" />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder={`e.g. ${detectedCity}`}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 0,
                    outline: 'none',
                    fontFamily: 'var(--font-inter-tight), sans-serif',
                    fontSize: '14.5px',
                    color: '#f3f5fe',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '20px',
              marginTop: 'clamp(36px, 4vw, 52px)',
            }}
          >
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '14px',
                padding: '16px 32px',
                background: 'linear-gradient(135deg, #c5a880 0%, #a68b63 100%)',
                color: '#0b0f18',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                boxShadow: '0 12px 30px rgba(197, 168, 128, 0.35)',
                transition: 'all 300ms cubic-bezier(0.16, 1, 0.3, 1)',
                textDecoration: 'none',
              }}
            >
              Request on WhatsApp
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 8h12M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </a>

            <a
              href="https://maps.google.com/?q=31+Allenby+Road+Bhawanipore+Kolkata+700020"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '12px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#9397ab',
                borderBottom: '1px solid rgba(207, 211, 229, 0.3)',
                paddingBottom: '4px',
                transition: 'color 200ms ease',
              }}
            >
              Find Atelier on Map →
            </a>
          </div>
        </div>

        {/* Right Column: 3D Tactile Letterpressed Invitation Card */}
        <div
          style={{
            perspective: '1200px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            ref={cardRef}
            onPointerMove={handleCardPointerMove}
            onPointerLeave={handleCardPointerLeave}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '460px',
              background: 'linear-gradient(145deg, #f7f3ec 0%, #ebe3d5 100%)',
              borderRadius: '8px',
              padding: 'clamp(34px, 4vw, 50px)',
              boxShadow:
                '0 40px 100px rgba(0, 0, 0, 0.75), 0 12px 30px rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(255, 255, 255, 0.9)',
              transform: `rotateX(${cardTilt.rx.toFixed(2)}deg) rotateY(${cardTilt.ry.toFixed(2)}deg)`,
              transition: 'transform 180ms ease-out, box-shadow 300ms ease',
              willChange: 'transform',
            }}
          >
            {/* Cotton Paper Subtle Texture Overlay */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: '12px',
                borderRadius: '4px',
                border: '1px solid rgba(184, 158, 122, 0.45)',
                pointerEvents: 'none',
              }}
            />
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: '15px',
                borderRadius: '3px',
                border: '0.5px dashed rgba(184, 158, 122, 0.35)',
                pointerEvents: 'none',
              }}
            />

            <div style={{ position: 'relative', zIndex: 2, color: '#2b2722' }}>
              {/* Card Header Monogram */}
              <div style={{ textAlign: 'center' }}>
                <Image
                  src="/images/brand/tharo-logo-dark.png"
                  alt="THARO"
                  width={95}
                  height={25}
                  style={{
                    height: '25px',
                    width: 'auto',
                    margin: '0 auto',
                    display: 'block',
                    objectFit: 'contain',
                  }}
                />
                <p
                  style={{
                    margin: '8px 0 0',
                    fontSize: '8.5px',
                    letterSpacing: '0.36em',
                    textIndent: '0.36em',
                    textTransform: 'uppercase',
                    color: '#847866',
                    fontWeight: 500,
                  }}
                >
                  DESIGNED FOR YOU · 31 ALLENBY ROAD
                </p>
              </div>

              {/* Italic Script Sub-title */}
              <p
                style={{
                  margin: 'clamp(28px, 3.2vw, 42px) 0 0',
                  fontFamily: 'var(--font-cormorant), Georgia, serif',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  fontSize: 'clamp(22px, 2.3vw, 28px)',
                  color: '#2b2722',
                  textAlign: 'center',
                  textShadow: '0 1px 0 rgba(255, 255, 255, 0.85)',
                }}
              >
                Fitting appointment
              </p>

              {/* Data Rows */}
              <dl
                style={{
                  margin: 'clamp(26px, 3vw, 38px) 0 0',
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  gap: '16px 22px',
                  alignItems: 'center',
                }}
              >
                <dt
                  style={{
                    margin: 0,
                    fontSize: '10px',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: '#8c7e6c',
                    fontWeight: 600,
                  }}
                >
                  Occasion
                </dt>
                <dd
                  style={{
                    margin: 0,
                    fontFamily: 'var(--font-cormorant), Georgia, serif',
                    fontSize: '21px',
                    fontWeight: 500,
                    color: '#1f1c18',
                    textShadow: '0 1px 0 rgba(255, 255, 255, 0.9)',
                  }}
                >
                  {occasion}
                </dd>

                <dt
                  style={{
                    margin: 0,
                    fontSize: '10px',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: '#8c7e6c',
                    fontWeight: 600,
                  }}
                >
                  Date
                </dt>
                <dd
                  style={{
                    margin: 0,
                    fontFamily: 'var(--font-cormorant), Georgia, serif',
                    fontSize: '21px',
                    fontWeight: 500,
                    color: '#1f1c18',
                    textShadow: '0 1px 0 rgba(255, 255, 255, 0.9)',
                  }}
                >
                  {formattedDate}
                </dd>

                <dt
                  style={{
                    margin: 0,
                    fontSize: '10px',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: '#8c7e6c',
                    fontWeight: 600,
                  }}
                >
                  City
                </dt>
                <dd
                  style={{
                    margin: 0,
                    fontFamily: 'var(--font-cormorant), Georgia, serif',
                    fontSize: '21px',
                    fontWeight: 500,
                    color: '#1f1c18',
                    textShadow: '0 1px 0 rgba(255, 255, 255, 0.9)',
                  }}
                >
                  {activeCity}
                </dd>
              </dl>

              {/* Card Footer & Wax Seal */}
              <div
                style={{
                  marginTop: 'clamp(32px, 3.5vw, 44px)',
                  paddingTop: '20px',
                  borderTop: '1px dashed rgba(140, 126, 108, 0.4)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ fontSize: '9.5px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#7a6f5e' }}>
                  <span>ROOM: ALLENBY FLAGSHIP</span>
                  <br />
                  <span style={{ color: '#a3937c' }}>CALCUTTA TAILORING</span>
                </div>

                {/* Antique Gold Atelier Wax Seal */}
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 35%, #e2be84 0%, #b89358 60%, #8c6a32 100%)',
                    boxShadow: '0 4px 12px rgba(90, 65, 25, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.35)',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-cinzel), serif',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#463212',
                      textShadow: '0 1px 0 rgba(255, 255, 255, 0.5)',
                    }}
                  >
                    TH
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
