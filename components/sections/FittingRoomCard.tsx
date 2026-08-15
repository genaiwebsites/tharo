'use client';

import React, { useEffect, useState } from 'react';
import { OCCASION_OPTIONS } from '@/lib/constants';

export default function FittingRoomCard() {
  const [occasion, setOccasion] = useState<string>('Wedding');
  const [date, setDate] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [detectedCity, setDetectedCity] = useState<string>('Kolkata');

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
      year: 'numeric'
    });
  };

  const formattedDate = dateLabel();

  const waLink = () => {
    const msg = `Khamma Ghani. I would like to book a fitting at Tharo.\nOccasion: ${occasion}\nPreferred date: ${formattedDate}\nCity: ${activeCity}`;
    return `https://wa.me/919062512323?text=${encodeURIComponent(msg)}`;
  };

  const inviteText =
    detectedCity && detectedCity !== 'Kolkata'
      ? `Three lines is all it takes. Tell us the occasion, a date that suits, and we will hold the room — we dress clients travelling in from ${detectedCity} every season.`
      : 'Three lines is all it takes. Tell us the occasion and a date that suits, and we will hold the room on Allenby Road.';

  return (
    <section
      id="fitting-room"
      data-screen-label="The Fitting Room"
      style={{
        position: 'relative',
        padding: 'min(16vh, 140px) 32px min(12vh, 100px) clamp(22px, 6.5vw, 92px)'
      }}
    >
      <div
        style={{
          maxWidth: '1320px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))',
          gap: 'clamp(40px, 6vw, 100px)',
          alignItems: 'start'
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
            The Fitting Room
          </p>
          <h2
            style={{
              margin: 0,
              maxWidth: '16ch',
              fontFamily: 'var(--font-newsreader), Georgia, serif',
              fontWeight: 300,
              fontSize: 'clamp(34px, 5vw, 64px)',
              lineHeight: 1.06,
              color: '#f3f5fe',
              textWrap: 'pretty'
            }}
          >
            Come in and be measured.
          </h2>
          <p
            style={{
              margin: '24px 0 clamp(34px, 4vw, 52px)',
              maxWidth: '40ch',
              fontSize: 'clamp(15px, 1.4vw, 17px)',
              lineHeight: 1.7,
              color: '#9397ab'
            }}
          >
            {inviteText}
          </p>

          <div style={{ display: 'grid', gap: 'clamp(20px, 2.4vw, 32px)', maxWidth: '440px' }}>
            <label style={{ display: 'block' }}>
              <span
                style={{
                  display: 'block',
                  marginBottom: '10px',
                  fontSize: '11px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#75798c'
                }}
              >
                Occasion
              </span>
              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                style={{
                  width: '100%',
                  appearance: 'none',
                  background: 'transparent',
                  border: 0,
                  borderBottom: '1px solid rgba(233, 233, 237, 0.24)',
                  padding: '10px 0',
                  fontFamily: 'var(--font-newsreader), Georgia, serif',
                  fontWeight: 300,
                  fontSize: 'clamp(20px, 2vw, 26px)',
                  color: '#f3f5fe',
                  colorScheme: 'dark',
                  cursor: 'pointer'
                }}
              >
                {OCCASION_OPTIONS.map((o) => (
                  <option key={o} value={o} style={{ background: '#161826', fontSize: '15px' }}>
                    {o}
                  </option>
                ))}
              </select>
            </label>

            <label style={{ display: 'block' }}>
              <span
                style={{
                  display: 'block',
                  marginBottom: '10px',
                  fontSize: '11px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#75798c'
                }}
              >
                Preferred date
              </span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 0,
                  borderBottom: '1px solid rgba(233, 233, 237, 0.24)',
                  padding: '10px 0',
                  fontFamily: 'var(--font-newsreader), Georgia, serif',
                  fontWeight: 300,
                  fontSize: 'clamp(20px, 2vw, 26px)',
                  color: '#f3f5fe',
                  colorScheme: 'dark'
                }}
              />
            </label>

            <label style={{ display: 'block' }}>
              <span
                style={{
                  display: 'block',
                  marginBottom: '10px',
                  fontSize: '11px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#75798c'
                }}
              >
                City
              </span>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder={detectedCity}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 0,
                  borderBottom: '1px solid rgba(233, 233, 237, 0.24)',
                  padding: '10px 0',
                  fontFamily: 'var(--font-newsreader), Georgia, serif',
                  fontWeight: 300,
                  fontSize: 'clamp(20px, 2vw, 26px)',
                  color: '#f3f5fe'
                }}
              />
            </label>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '20px',
              marginTop: 'clamp(34px, 4vw, 52px)'
            }}
          >
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: '15px 28px',
                border: '1px solid rgba(207, 211, 229, 0.55)',
                borderRadius: '8px',
                fontSize: '12px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#f3f5fe',
                transition: 'all 300ms cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              Send on WhatsApp
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 8h12M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.1" />
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
                color: '#a3968a',
                borderBottom: '1px solid rgba(163, 150, 138, 0.35)',
                paddingBottom: '3px'
              }}
            >
              Find the store
            </a>
          </div>
        </div>

        {/* Live Letterpressed Appointment Card */}
        <div style={{ position: 'relative' }}>
          <div
            style={{
              position: 'relative',
              background: 'linear-gradient(168deg, #efe9de, #ddd4c4)',
              borderRadius: '3px',
              padding: 'clamp(30px, 3.4vw, 46px)',
              boxShadow:
                '0 40px 90px rgba(0, 0, 0, 0.5), 0 2px 0 rgba(255, 255, 255, 0.5) inset'
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '3px',
                pointerEvents: 'none',
                opacity: 0.5,
                mixBlendMode: 'multiply',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='p'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23p)' opacity='.34'/%3E%3C/svg%3E")`
              }}
            />
            <div style={{ position: 'relative', color: '#2c2a26' }}>
              <p
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-newsreader), Georgia, serif',
                  fontSize: '15px',
                  letterSpacing: '0.42em',
                  textIndent: '0.42em',
                  textAlign: 'center',
                  color: '#2c2a26',
                  textShadow:
                    '0 1px 0 rgba(255, 255, 255, 0.85), 0 -1px 1px rgba(60, 48, 36, 0.28)'
                }}
              >
                THARO
              </p>
              <p
                style={{
                  margin: '8px 0 0',
                  fontSize: '8.5px',
                  letterSpacing: '0.34em',
                  textIndent: '0.34em',
                  textAlign: 'center',
                  color: '#7a705f'
                }}
              >
                DESIGNED FOR YOU
              </p>
              <p
                style={{
                  margin: 'clamp(26px, 3vw, 38px) 0 0',
                  fontFamily: 'var(--font-newsreader), Georgia, serif',
                  fontStyle: 'italic',
                  fontWeight: 300,
                  fontSize: 'clamp(19px, 2vw, 24px)',
                  color: '#3a362f',
                  textAlign: 'center',
                  textShadow: '0 1px 0 rgba(255, 255, 255, 0.8)'
                }}
              >
                Fitting appointment
              </p>

              <dl
                style={{
                  margin: 'clamp(26px, 3vw, 38px) 0 0',
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  gap: '14px 20px',
                  fontSize: '14px'
                }}
              >
                <dt
                  style={{
                    margin: 0,
                    fontSize: '10px',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: '#8a7f6a',
                    alignSelf: 'center'
                  }}
                >
                  Occasion
                </dt>
                <dd
                  style={{
                    margin: 0,
                    fontFamily: 'var(--font-newsreader), Georgia, serif',
                    fontSize: '19px',
                    fontWeight: 300,
                    color: '#2c2a26'
                  }}
                >
                  {occasion}
                </dd>

                <dt
                  style={{
                    margin: 0,
                    fontSize: '10px',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: '#8a7f6a',
                    alignSelf: 'center'
                  }}
                >
                  Date
                </dt>
                <dd
                  style={{
                    margin: 0,
                    fontFamily: 'var(--font-newsreader), Georgia, serif',
                    fontSize: '19px',
                    fontWeight: 300,
                    color: '#2c2a26'
                  }}
                >
                  {formattedDate}
                </dd>

                <dt
                  style={{
                    margin: 0,
                    fontSize: '10px',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: '#8a7f6a',
                    alignSelf: 'center'
                  }}
                >
                  City
                </dt>
                <dd
                  style={{
                    margin: 0,
                    fontFamily: 'var(--font-newsreader), Georgia, serif',
                    fontSize: '19px',
                    fontWeight: 300,
                    color: '#2c2a26'
                  }}
                >
                  {activeCity}
                </dd>
              </dl>

              <div
                style={{
                  marginTop: 'clamp(28px, 3vw, 40px)',
                  paddingTop: '20px',
                  borderTop: '1px dashed rgba(60, 48, 36, 0.25)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  fontSize: '9.5px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#8a7f6a'
                }}
              >
                <span>Room: Allenby Flagship</span>
                <span>Calcutta Tailoring</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
