'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { OCCASION_OPTIONS } from '@/lib/constants';
import { StorePinIcon } from '@/components/common/Icons';
import { SectionScrim } from '@/components/common/SectionScrim';

export default function FittingRoomCard() {
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [occasion, setOccasion] = useState<string>('Wedding');
  const [date, setDate] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [detectedCity, setDetectedCity] = useState<string>('Kolkata');
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

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

  // Validate if all key fields are filled
  const isFormComplete = name.trim().length >= 2 && phone.trim().length >= 8 && date !== '';

  const waLink = () => {
    const clientName = name.trim() ? `\nClient: ${name.trim()}` : '';
    const clientPhone = phone.trim() ? `\nPhone: ${phone.trim()}` : '';
    const msg = `Khamma Ghani. I would like to book a bespoke fitting at Tharo.${clientName}${clientPhone}\nOccasion: ${occasion}\nPreferred Date: ${formattedDate}\nCity: ${activeCity}`;
    return `https://wa.me/919062512323?text=${encodeURIComponent(msg)}`;
  };

  // High-Resolution Client Invitation Card Exporter (Matches frontend 100% with balanced typography)
  const handleDownloadCard = useCallback(async () => {
    if (!isFormComplete || isDownloading) return;
    setIsDownloading(true);

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const scale = 2; // 2x Retina resolution
      const width = 800;
      const height = 540;

      canvas.width = width * scale;
      canvas.height = height * scale;
      ctx.scale(scale, scale);

      // 1. Luxury Cotton Deckle Paper Gradient Base
      const paperGrad = ctx.createLinearGradient(0, 0, width, height);
      paperGrad.addColorStop(0, '#f8f5ee');
      paperGrad.addColorStop(1, '#ece4d6');
      ctx.fillStyle = paperGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Dual Basting Stitch Border
      ctx.strokeStyle = 'rgba(184, 158, 122, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(18, 18, width - 36, height - 36);

      ctx.strokeStyle = 'rgba(184, 158, 122, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(24, 24, width - 48, height - 48);
      ctx.setLineDash([]); // reset dash

      // 3. Load & Draw Authentic THARO Logo
      const logoImg = new window.Image();
      logoImg.crossOrigin = 'anonymous';
      logoImg.src = '/images/brand/tharo-logo-dark.png';
      await new Promise((resolve) => {
        logoImg.onload = resolve;
        logoImg.onerror = resolve;
      });

      const logoW = 124;
      const logoH = logoImg.naturalWidth ? (logoW / logoImg.naturalWidth) * logoImg.naturalHeight : 32;
      const logoY = 46;
      ctx.drawImage(logoImg, width / 2 - logoW / 2, logoY, logoW, logoH);

      // 4. Cultural Greeting & Tagline (Single balanced, centered lockup)
      const lockupY = 96;
      ctx.textAlign = 'center';
      
      // Draw centered lockup
      ctx.font = '500 12px "Rozha One", "Noto Serif Devanagari", Georgia, serif';
      const devanagariText = 'खम्मा घणी';
      const devW = ctx.measureText(devanagariText).width;

      ctx.font = 'italic 400 12px "Cormorant Garamond", Georgia, serif';
      const tagText = 'Designed for you';
      const tagW = ctx.measureText(tagText).width;

      const sepGap = 16;
      const totalLockupW = devW + sepGap + tagW;
      const startLockupX = width / 2 - totalLockupW / 2;

      // Draw Devanagari part
      ctx.textAlign = 'left';
      ctx.fillStyle = '#b89e7a';
      ctx.font = '500 12px "Rozha One", "Noto Serif Devanagari", Georgia, serif';
      ctx.fillText(devanagariText, startLockupX, lockupY);

      // Draw Dot
      ctx.fillStyle = 'rgba(184, 158, 122, 0.6)';
      ctx.beginPath();
      ctx.arc(startLockupX + devW + sepGap / 2, lockupY - 4, 2, 0, Math.PI * 2);
      ctx.fill();

      // Draw Tagline part
      ctx.fillStyle = '#847866';
      ctx.font = 'italic 400 12px "Cormorant Garamond", Georgia, serif';
      ctx.fillText(tagText, startLockupX + devW + sepGap, lockupY);

      // 5. Fitting Appointment Subtitle
      ctx.textAlign = 'center';
      ctx.fillStyle = '#2b2722';
      ctx.font = 'italic 400 21px "Cormorant Garamond", Georgia, serif';
      ctx.fillText('Fitting appointment pass', width / 2, 138);

      // 6. Subtle Gold Accent Hairline
      ctx.strokeStyle = 'rgba(184, 158, 122, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 50, 150);
      ctx.lineTo(width / 2 + 50, 150);
      ctx.stroke();

      // 7. Data Rows (Evenly spaced & clean typography)
      const leftColX = 100;
      const rightColX = width - 100;
      let startY = 205;
      const rowGap = 42;

      const rows = [
        { label: 'GENTLEMAN', val: name.trim() || 'Distinguished Guest' },
        { label: 'CONTACT', val: phone.trim() || 'Confidential' },
        { label: 'OCCASION', val: occasion },
        { label: 'PREFERRED DATE', val: formattedDate },
        { label: 'CITY', val: activeCity },
      ];

      rows.forEach((r) => {
        // Label
        ctx.fillStyle = '#7f7260';
        ctx.font = '600 10.5px Inter, -apple-system, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(r.label, leftColX, startY);

        // Value
        ctx.fillStyle = '#1a1815';
        ctx.font = '600 15px "Cormorant Garamond", Georgia, serif';
        ctx.textAlign = 'right';
        ctx.fillText(r.val, rightColX, startY);

        // Dotted row leader
        ctx.strokeStyle = 'rgba(184, 158, 122, 0.22)';
        ctx.lineWidth = 0.75;
        ctx.setLineDash([2, 4]);
        ctx.beginPath();
        ctx.moveTo(leftColX + 110, startY - 4);
        ctx.lineTo(rightColX - 220, startY - 4);
        ctx.stroke();
        ctx.setLineDash([]);

        startY += rowGap;
      });

      // 8. Footer Coordinates
      ctx.strokeStyle = 'rgba(184, 158, 122, 0.35)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(40, height - 52);
      ctx.lineTo(width - 40, height - 52);
      ctx.stroke();

      ctx.fillStyle = '#847866';
      ctx.font = '500 9px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('31 ALLENBY RD · KOLKATA', 40, height - 32);

      ctx.textAlign = 'right';
      ctx.fillText('COORDINATES · 22.5354° N', width - 40, height - 32);

      // Convert to file blob
      canvas.toBlob((blob) => {
        if (!blob) return;
        const cleanName = name
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '_')
          .replace(/_+/g, '_')
          .slice(0, 32);
        const fileName = `${cleanName || 'gentleman'}_tharo_invitation.png`;

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setIsDownloading(false);
      }, 'image/png');
    } catch (err) {
      console.error('Error generating card image:', err);
      setIsDownloading(false);
    }
  }, [formattedDate, isDownloading, isFormComplete, name, occasion, phone, activeCity]);

  // 3D Card tilt on hover
  const handleCardPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    setCardTilt({
      rx: ny * -8,
      ry: nx * 10,
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
        padding: 'clamp(54px, 7.5vh, 84px) 32px clamp(54px, 7.5vh, 84px) clamp(22px, 6.5vw, 92px)',
        background: 'radial-gradient(90% 70% at 50% 30%, rgba(20, 26, 40, 0.35) 0%, transparent 80%)',
      }}
    >
      <SectionScrim />
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 'clamp(32px, 4.5vw, 56px)',
          alignItems: 'stretch',
        }}
      >
        {/* Left Column: Structured Luxury Atelier Consultation Dossier */}
        <div
          style={{
            position: 'relative',
            background: 'rgba(14, 19, 31, 0.72)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(207, 211, 229, 0.14)',
            borderRadius: '8px',
            padding: 'clamp(26px, 3.2vw, 36px)',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6), inset 0 0 0 1px rgba(255, 255, 255, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            {/* Eyebrow Chapter */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '14px',
                fontSize: '9.5px',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: '#c5a880',
              }}
            >
              <span style={{ width: '12px', height: '1px', background: '#c5a880' }} />
              <span>Chapter 07 · Private Consultation</span>
            </div>

            {/* Section Headline */}
            <h2
              style={{
                margin: 0,
                fontFamily: 'var(--font-cormorant), var(--font-cinzel), Georgia, serif',
                fontWeight: 400,
                fontSize: 'clamp(24px, 2.6vw, 34px)',
                lineHeight: 1.15,
                color: '#f3f5fe',
                textWrap: 'pretty',
              }}
            >
              Reserve a Private Fitting
            </h2>

            <p
              style={{
                margin: '8px 0 20px',
                fontSize: 'clamp(13px, 1.1vw, 14.5px)',
                lineHeight: 1.55,
                color: '#9397ab',
              }}
            >
              42 anatomical coordinates. Private 1-on-1 consultation with master tailors.
            </p>

            <div style={{ display: 'grid', gap: '14px' }}>
              {/* 1. Client Name & Phone Number (Symmetrical 2-Column Row) */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: '10px',
                }}
              >
                {/* Full Name */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '6px',
                      fontSize: '9px',
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      color: '#75798c',
                      fontWeight: 600,
                    }}
                  >
                    Your Full Name *
                  </label>
                  <div
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'rgba(11, 15, 24, 0.75)',
                      border: name.trim() ? '1px solid rgba(197, 168, 128, 0.45)' : '1px solid rgba(207, 211, 229, 0.16)',
                      borderRadius: '4px',
                      padding: '8px 12px',
                      transition: 'border-color 200ms ease',
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M8 8a3 3 0 100-6 3 3 0 000 6zM2 14a6 6 0 0112 0" stroke="#c5a880" strokeWidth="1.2" />
                    </svg>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Kabir Bathla"
                      style={{
                        width: '100%',
                        background: 'transparent',
                        border: 0,
                        outline: 'none',
                        fontFamily: 'var(--font-inter-tight), sans-serif',
                        fontSize: '12.5px',
                        color: '#f3f5fe',
                      }}
                    />
                  </div>
                </div>

                {/* Phone / WhatsApp */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '6px',
                      fontSize: '9px',
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      color: '#75798c',
                      fontWeight: 600,
                    }}
                  >
                    Phone / WhatsApp *
                  </label>
                  <div
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'rgba(11, 15, 24, 0.75)',
                      border: phone.trim() ? '1px solid rgba(197, 168, 128, 0.45)' : '1px solid rgba(207, 211, 229, 0.16)',
                      borderRadius: '4px',
                      padding: '8px 12px',
                      transition: 'border-color 200ms ease',
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M3 3h3l1.5 3-2 1.5a9 9 0 004 4L11 9.5l3 1.5v3a2 2 0 01-2 2C6 16 0 10 0 4a2 2 0 012-2" stroke="#c5a880" strokeWidth="1.2" />
                    </svg>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 90625 12323"
                      style={{
                        width: '100%',
                        background: 'transparent',
                        border: 0,
                        outline: 'none',
                        fontFamily: 'var(--font-inter-tight), sans-serif',
                        fontSize: '12.5px',
                        color: '#f3f5fe',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* 2. Occasion Selector (Symmetrical 3x2 Grid) */}
              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '9px',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: '#75798c',
                    fontWeight: 600,
                  }}
                >
                  Occasion Type
                </label>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '6px',
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
                          border: isSelected ? '1px solid #c5a880' : '1px solid rgba(207, 211, 229, 0.12)',
                          background: isSelected ? 'rgba(197, 168, 128, 0.14)' : 'rgba(11, 15, 24, 0.6)',
                          color: isSelected ? '#f3f5fe' : '#8e93a6',
                          padding: '8px 6px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          letterSpacing: '0.02em',
                          textAlign: 'center',
                          cursor: 'pointer',
                          transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)',
                          boxShadow: isSelected ? '0 0 12px rgba(197, 168, 128, 0.22)' : 'none',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {o}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Symmetrical 2-Column Date & City Pickers */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: '10px',
                }}
              >
                {/* Date Input */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '6px',
                      fontSize: '9px',
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      color: '#75798c',
                      fontWeight: 600,
                    }}
                  >
                    Preferred Date *
                  </label>
                  <div
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      background: 'rgba(11, 15, 24, 0.75)',
                      border: date ? '1px solid rgba(197, 168, 128, 0.45)' : '1px solid rgba(207, 211, 229, 0.16)',
                      borderRadius: '4px',
                      padding: '8px 12px',
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
                        fontSize: '12px',
                        color: '#f3f5fe',
                        colorScheme: 'dark',
                        cursor: 'pointer',
                      }}
                    />
                  </div>
                </div>

                {/* City Input */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '6px',
                      fontSize: '9px',
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      color: '#75798c',
                      fontWeight: 600,
                    }}
                  >
                    Your City
                  </label>
                  <div
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'rgba(11, 15, 24, 0.75)',
                      border: '1px solid rgba(207, 211, 229, 0.16)',
                      borderRadius: '4px',
                      padding: '8px 12px',
                    }}
                  >
                    <StorePinIcon size={12} color="#c5a880" />
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
                        fontSize: '12px',
                        color: '#f3f5fe',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              marginTop: '22px',
              paddingTop: '16px',
              borderTop: '1px solid rgba(207, 211, 229, 0.1)',
            }}
          >
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #c5a880 0%, #a68b63 100%)',
                color: '#0b0f18',
                borderRadius: '4px',
                fontSize: '10.5px',
                fontWeight: 600,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                boxShadow: '0 6px 18px rgba(197, 168, 128, 0.3)',
                transition: 'all 250ms cubic-bezier(0.16, 1, 0.3, 1)',
                textDecoration: 'none',
              }}
            >
              Request on WhatsApp
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 8h12M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </a>

            <a
              href="https://maps.google.com/?q=31+Allenby+Road+Bhawanipore+Kolkata+700020"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '10px',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: '#8e93a6',
                transition: 'color 200ms ease',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <span>Atelier Map</span>
              <span>→</span>
            </a>
          </div>
        </div>

        {/* Right Column: 3D Tactile Letterpressed Invitation Card (Matches Height & Alignment) */}
        <div
          style={{
            perspective: '1200px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div
            ref={cardRef}
            onPointerMove={handleCardPointerMove}
            onPointerLeave={handleCardPointerLeave}
            style={{
              position: 'relative',
              width: '100%',
              background: 'linear-gradient(145deg, #f7f3ec 0%, #ebe3d5 100%)',
              borderRadius: '8px',
              padding: 'clamp(22px, 2.8vw, 32px)',
              boxShadow:
                '0 32px 80px rgba(0, 0, 0, 0.75), 0 10px 24px rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(255, 255, 255, 0.9)',
              transform: `rotateX(${cardTilt.rx.toFixed(2)}deg) rotateY(${cardTilt.ry.toFixed(2)}deg)`,
              transition: 'transform 180ms ease-out, box-shadow 300ms ease',
              willChange: 'transform',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%',
            }}
          >
            {/* Cotton Paper Subtle Texture Overlay */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: '10px',
                borderRadius: '6px',
                border: '1px solid rgba(184, 158, 122, 0.45)',
                pointerEvents: 'none',
              }}
            />
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: '13px',
                borderRadius: '4px',
                border: '0.5px dashed rgba(184, 158, 122, 0.35)',
                pointerEvents: 'none',
              }}
            />

            <div style={{ position: 'relative', zIndex: 2, color: '#2b2722' }}>
              {/* Card Header: Authentic Monogram + Khamma Ghani + Designed for you */}
              <div style={{ textAlign: 'center' }}>
                <Image
                  src="/images/brand/tharo-logo-dark.png"
                  alt="THARO"
                  width={96}
                  height={26}
                  style={{
                    height: '22px',
                    width: 'auto',
                    margin: '0 auto',
                    display: 'block',
                    objectFit: 'contain',
                  }}
                />
                
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      color: '#b89e7a',
                      fontFamily: 'var(--font-rozha), Georgia, serif',
                      letterSpacing: '0.08em',
                    }}
                  >
                    खम्मा घणी
                  </span>
                  <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: '#b89e7a', opacity: 0.6 }} />
                  <span
                    style={{
                      fontSize: '10.5px',
                      fontFamily: 'var(--font-cormorant), Georgia, serif',
                      fontStyle: 'italic',
                      color: '#847866',
                    }}
                  >
                    Designed for you
                  </span>
                </div>
              </div>

              {/* Italic Script Sub-title */}
              <p
                style={{
                  margin: 'clamp(14px, 1.8vw, 20px) 0 0',
                  fontFamily: 'var(--font-cormorant), Georgia, serif',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  fontSize: 'clamp(17px, 1.7vw, 21px)',
                  color: '#2b2722',
                  textAlign: 'center',
                  textShadow: '0 1px 0 rgba(255, 255, 255, 0.85)',
                }}
              >
                Fitting appointment pass
              </p>

              {/* Real-time Data Rows (No Salon Row) */}
              <dl
                style={{
                  margin: 'clamp(14px, 1.8vw, 22px) 0 0',
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  gap: '10px 16px',
                  alignItems: 'center',
                }}
              >
                <dt
                  style={{
                    margin: 0,
                    fontSize: '8.5px',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: '#7f7260',
                  }}
                >
                  Gentleman
                </dt>
                <dd
                  style={{
                    margin: 0,
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#1a1815',
                    textAlign: 'right',
                    fontFamily: 'var(--font-cormorant), Georgia, serif',
                  }}
                >
                  {name.trim() || 'Distinguished Guest'}
                </dd>

                <dt
                  style={{
                    margin: 0,
                    fontSize: '8.5px',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: '#7f7260',
                  }}
                >
                  Contact
                </dt>
                <dd
                  style={{
                    margin: 0,
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#1a1815',
                    textAlign: 'right',
                  }}
                >
                  {phone.trim() || 'Upon Confirmation'}
                </dd>

                <dt
                  style={{
                    margin: 0,
                    fontSize: '8.5px',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: '#7f7260',
                  }}
                >
                  Occasion
                </dt>
                <dd
                  style={{
                    margin: 0,
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#1a1815',
                    textAlign: 'right',
                  }}
                >
                  {occasion}
                </dd>

                <dt
                  style={{
                    margin: 0,
                    fontSize: '8.5px',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: '#7f7260',
                  }}
                >
                  Date
                </dt>
                <dd
                  style={{
                    margin: 0,
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#1a1815',
                    textAlign: 'right',
                  }}
                >
                  {formattedDate}
                </dd>

                <dt
                  style={{
                    margin: 0,
                    fontSize: '8.5px',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: '#7f7260',
                  }}
                >
                  City
                </dt>
                <dd
                  style={{
                    margin: 0,
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#1a1815',
                    textAlign: 'right',
                  }}
                >
                  {activeCity}
                </dd>
              </dl>

              {/* Letterpress Blind Emboss Coordinates Footer */}
              <div
                style={{
                  marginTop: 'clamp(14px, 1.8vw, 20px)',
                  paddingTop: '10px',
                  borderTop: '1px solid rgba(184, 158, 122, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '7.5px',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: '#847866',
                }}
              >
                <span>31 Allenby Rd · Kolkata</span>
                <span>Coordinates · 22.5354° N</span>
              </div>
            </div>

            {/* Custom Interactive Download Invitation Pass Button */}
            <div style={{ marginTop: '14px', position: 'relative', zIndex: 5 }}>
              <button
                type="button"
                onClick={handleDownloadCard}
                disabled={!isFormComplete || isDownloading}
                style={{
                  width: '100%',
                  padding: '9px 14px',
                  borderRadius: '4px',
                  border: isFormComplete
                    ? '1px solid rgba(184, 158, 122, 0.7)'
                    : '1px dashed rgba(184, 158, 122, 0.35)',
                  background: isFormComplete
                    ? 'linear-gradient(135deg, rgba(197, 168, 128, 0.22) 0%, rgba(166, 139, 99, 0.16) 100%)'
                    : 'rgba(184, 158, 122, 0.06)',
                  color: isFormComplete ? '#2b2722' : '#847866',
                  fontSize: '9.5px',
                  fontFamily: 'var(--font-inter-tight), sans-serif',
                  fontWeight: 600,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: isFormComplete ? 'pointer' : 'not-allowed',
                  opacity: isFormComplete ? 1 : 0.65,
                  transition: 'all 250ms ease',
                  boxShadow: isFormComplete ? '0 4px 14px rgba(184, 158, 122, 0.2)' : 'none',
                }}
              >
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M8 2v8M4 7l4 4 4-4M2 14h12"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>
                  {isDownloading
                    ? 'Generating luxury pass...'
                    : isFormComplete
                    ? `Save Invitation Card (${name.trim() || 'Pass'})`
                    : 'Fill Name, Phone & Date to Save Card'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
