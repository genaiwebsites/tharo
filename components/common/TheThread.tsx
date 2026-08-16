'use client';

import React, { useEffect, useRef, useMemo, useState } from 'react';
import { CHAPTERS } from '@/lib/constants';

interface TheThreadProps {
  visible: boolean;
  scrollProgress: number;
}

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

export default function TheThread({ visible, scrollProgress }: TheThreadProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activePathRef = useRef<SVGPathElement>(null);
  const shadowPathRef = useRef<SVGPathElement>(null);
  const clipRectRef = useRef<SVGRectElement>(null);
  const needleGroupRef = useRef<SVGGElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const badgeRomanRef = useRef<HTMLSpanElement>(null);
  const badgeLabelRef = useRef<HTMLSpanElement>(null);

  const [isHovered, setIsHovered] = useState<boolean>(false);

  const knotsRef = useRef<
    Array<{
      id: string;
      label: string;
      roman: string;
      y: number;
      x: number;
      fraction: number;
      eyeletOuter: SVGCircleElement | null;
      eyeletInner: SVGCircleElement | null;
    }>
  >([]);

  // Wave parameters
  const geometry = useMemo(() => {
    return {
      cx: 36,
      amp: 8,
      wavelength: 68,
    };
  }, []);

  const getPointAtY = (y: number) => {
    const { cx, amp, wavelength } = geometry;
    const phase = (2 * Math.PI * y) / wavelength;
    const x = cx + amp * Math.sin(phase);
    const dx_dy = amp * ((2 * Math.PI) / wavelength) * Math.cos(phase);
    const rawAngleDeg = (Math.atan2(1, dx_dy) * 180) / Math.PI;
    const angle = 90 + (rawAngleDeg - 90) * 0.45;
    return { x, y, angle };
  };

  const [dCord, setDCord] = useState<string>('');
  const [dCouching, setDCouching] = useState<string>('');
  const [chapterList, setChapterList] = useState<
    Array<{ id: string; label: string; roman: string; x: number; y: number }>
  >([]);

  useEffect(() => {
    const buildGeometry = () => {
      const H = Math.max(500, window.innerHeight);
      const { cx, amp, wavelength } = geometry;

      // 1. Continuous cord path from 0 to H
      let cordStr = `M ${cx} 0`;
      const half = wavelength / 2;

      for (let y = 0; y <= H + wavelength; y += half) {
        const nextY = y + half;
        const s = y % wavelength === 0 ? 1 : -1;
        const cp1x = cx + amp * 1.35 * s;
        const cp1y = y + half * 0.45;
        const cp2x = cx + amp * 1.35 * s;
        const cp2y = nextY - half * 0.45;
        const targetX = cx;
        const targetY = nextY;
        cordStr += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${targetX.toFixed(1)} ${targetY.toFixed(1)}`;
      }

      // 2. Transverse couching stitches
      let couchingStr = '';
      for (let y = 6; y <= H + wavelength; y += 9) {
        const pt = getPointAtY(y);
        const phase = (2 * Math.PI * y) / wavelength;
        const dx_dy = amp * ((2 * Math.PI) / wavelength) * Math.cos(phase);
        const len = Math.hypot(1, dx_dy);
        const nx = 1 / len;
        const ny = -dx_dy / len;
        const stitchW = 4.2;
        const x1 = pt.x - nx * stitchW;
        const y1 = pt.y - ny * stitchW;
        const x2 = pt.x + nx * stitchW;
        const y2 = pt.y + ny * stitchW;
        couchingStr += ` M ${x1.toFixed(1)} ${y1.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)}`;
      }

      // 3. Measure chapter knot milestones
      const thresholdEl = document.getElementById('threshold');
      const meaningEl = document.getElementById('meaning');

      let startY = 0;
      if (thresholdEl) {
        const span = Math.max(1, thresholdEl.offsetHeight - H);
        startY = thresholdEl.offsetTop + span * 0.80;
      } else if (meaningEl) {
        startY = meaningEl.offsetTop;
      }

      const docHeight = document.documentElement.scrollHeight;
      const totalSpan = Math.max(1, docHeight - startY - window.innerHeight);

      const topY = 24;
      const bottomY = H - 28;
      const usableSpan = bottomY - topY;

      const calculatedKnots = CHAPTERS.map((c, idx) => {
        const el = document.getElementById(c.id);
        const sectionTop = el ? el.offsetTop : 0;
        const relY = Math.max(0, sectionTop - startY);
        const fraction = Math.min(1, Math.max(0, relY / totalSpan));
        const knotY = topY + fraction * usableSpan;
        const pt = getPointAtY(knotY);
        return {
          id: c.id,
          label: c.label,
          roman: ROMAN_NUMERALS[idx] || `${idx + 1}`,
          y: knotY,
          x: pt.x,
          fraction,
          eyeletOuter: null,
          eyeletInner: null,
        };
      });

      knotsRef.current = calculatedKnots;
      setChapterList(calculatedKnots.map((k) => ({ id: k.id, label: k.label, roman: k.roman, x: k.x, y: k.y })));
      setDCord(cordStr);
      setDCouching(couchingStr);
    };

    buildGeometry();
    window.addEventListener('resize', buildGeometry);
    return () => window.removeEventListener('resize', buildGeometry);
  }, [geometry]);

  // Synchronize scroll progress directly on DOM refs with zero React re-render churn
  useEffect(() => {
    if (!visible) return;

    const H = Math.max(500, window.innerHeight);
    const topY = 24;
    const bottomY = H - 28;
    const usableSpan = bottomY - topY;

    const clampedProg = Math.min(1, Math.max(0, scrollProgress));
    const yPos = topY + clampedProg * usableSpan;
    const pt = getPointAtY(yPos);

    // Thread is physically and seamlessly drawn exactly up to needle position with 0 gap
    if (clipRectRef.current) {
      clipRectRef.current.setAttribute('height', `${Math.max(0, yPos + 4)}`);
    }

    if (needleGroupRef.current) {
      needleGroupRef.current.setAttribute(
        'transform',
        `translate(${pt.x.toFixed(1)}, ${pt.y.toFixed(1)}) rotate(${pt.angle.toFixed(1)})`
      );
    }

    // Update chapter knots directly
    let activeKnot = knotsRef.current[0];
    knotsRef.current.forEach((k) => {
      const isActive = clampedProg >= k.fraction - 0.02;
      if (isActive) activeKnot = k;

      if (k.eyeletOuter) {
        k.eyeletOuter.style.opacity = isActive ? '0.95' : '0';
        k.eyeletOuter.setAttribute('r', isActive ? '5' : '3');
      }
      if (k.eyeletInner) {
        k.eyeletInner.style.opacity = isActive ? '1' : '0';
        k.eyeletInner.setAttribute('r', isActive ? '2' : '1');
      }
    });

    if (badgeRef.current && activeKnot) {
      badgeRef.current.style.top = `${activeKnot.y.toFixed(1)}px`;
      if (badgeRomanRef.current) badgeRomanRef.current.textContent = activeKnot.roman;
      if (badgeLabelRef.current) badgeLabelRef.current.textContent = activeKnot.label;
    }
  }, [scrollProgress, visible]);

  return (
    <aside
      ref={containerRef}
      id="thread-rail"
      aria-label="Reading stitch progress indicator"
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width: '80px',
        zIndex: 50,
        pointerEvents: 'auto',
        cursor: 'default',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(-28px)',
        transition:
          'opacity 400ms cubic-bezier(0.16, 1, 0.3, 1), transform 400ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          overflow: 'visible',
        }}
      >
        <defs>
          <linearGradient id="silver-cord-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="45%" stopColor="#e4e7f5" stopOpacity="0.95" />
            <stop offset="80%" stopColor="#cfd3e5" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#8d94a8" stopOpacity="0.7" />
          </linearGradient>

          <linearGradient id="needle-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#dce0ef" />
            <stop offset="100%" stopColor="#62687a" />
          </linearGradient>

          <filter id="soft-thread-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="needle-starlight-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Strict ClipPath: Ensures EVERYTHING draws seamlessly up to current needle Y with zero lag */}
          <clipPath id="thread-scrolled-clip">
            <rect ref={clipRectRef} x="0" y="0" width="100" height="24" />
          </clipPath>
        </defs>

        {/* Group clipped strictly to current needle scroll position so thread directly enters needle eye */}
        <g clipPath="url(#thread-scrolled-clip)">
          {/* 1. Fabric Shadow of the active cord */}
          <path
            ref={shadowPathRef}
            d={dCord}
            fill="none"
            stroke="#06090f"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.6"
            vectorEffect="non-scaling-stroke"
          />

          {/* 2. Transverse Couching Stitches */}
          <path
            d={dCouching}
            fill="none"
            stroke="#cfd3e5"
            strokeWidth="1.1"
            strokeLinecap="round"
            opacity="0.45"
            vectorEffect="non-scaling-stroke"
          />

          {/* 3. Active Drawn Silver Soutache Cord */}
          <path
            ref={activePathRef}
            d={dCord}
            fill="none"
            stroke="url(#silver-cord-glow)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#soft-thread-glow)"
            vectorEffect="non-scaling-stroke"
          />
        </g>

        {/* 4. Chapter Tension Eyelets */}
        {chapterList.map((k, idx) => (
          <g key={k.id} className="chapter-eyelet" style={{ cursor: 'pointer' }}>
            {/* Outer Ring */}
            <circle
              ref={(el) => {
                if (knotsRef.current[idx]) knotsRef.current[idx].eyeletOuter = el;
              }}
              cx={k.x.toFixed(1)}
              cy={k.y.toFixed(1)}
              r="3"
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.2"
              opacity="0"
              filter="url(#soft-thread-glow)"
              style={{
                transition:
                  'r 300ms cubic-bezier(0.16, 1, 0.3, 1), stroke 300ms ease, opacity 300ms ease',
              }}
              vectorEffect="non-scaling-stroke"
            />

            {/* Inner Core Knot */}
            <circle
              ref={(el) => {
                if (knotsRef.current[idx]) knotsRef.current[idx].eyeletInner = el;
              }}
              cx={k.x.toFixed(1)}
              cy={k.y.toFixed(1)}
              r="1"
              fill="#ffffff"
              opacity="0"
              style={{ transition: 'r 250ms ease, fill 250ms ease, opacity 250ms ease' }}
            />
          </g>
        ))}

        {/* 5. Sleek Bespoke Tailor's Sewing Needle at Current Scroll Tip */}
        <g
          ref={needleGroupRef}
          transform="translate(36, 24) rotate(90)"
          opacity={visible ? 1 : 0}
        >
          {/* Subtle Needle Ambient Halo */}
          <circle r="8" fill="#ffffff" opacity="0.12" filter="url(#needle-starlight-glow)" />

          {/* Slender Needle Blade */}
          <path
            d="M 0 -11 L 1.6 -2 L 0.8 9 L 0 13 L -0.8 9 L -1.6 -2 Z"
            fill="url(#needle-gradient)"
            stroke="#ffffff"
            strokeWidth="0.4"
            filter="url(#needle-starlight-glow)"
          />

          {/* Needle Eyelet */}
          <ellipse cx="0" cy="-5" rx="0.55" ry="1.6" fill="#0b0f18" />
          <circle cx="0" cy="-5" r="0.45" fill="#ffffff" />

          {/* Trailing Active Starlight Stitch */}
          <circle cx="0" cy="13" r="1.3" fill="#ffffff" filter="url(#soft-thread-glow)" />
        </g>
      </svg>

      {/* 6. Floating Chapter Indicator Badge: Only shown on hover to keep UI clean and uncluttered */}
      <div
        ref={badgeRef}
        style={{
          position: 'absolute',
          left: '48px',
          top: '24px',
          transform: isHovered ? 'translateY(-50%) translateX(0)' : 'translateY(-50%) translateX(-6px)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '5px 12px',
          borderRadius: '4px',
          background: 'rgba(11, 15, 24, 0.94)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(207, 211, 229, 0.24)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.65), 0 0 12px rgba(207, 211, 229, 0.08)',
          whiteSpace: 'nowrap',
          pointerEvents: isHovered ? 'auto' : 'none',
          opacity: visible && isHovered ? 1 : 0,
          transition: 'opacity 220ms cubic-bezier(0.16, 1, 0.3, 1), transform 220ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Connecting Hairline Lead from Knot */}
        <div
          style={{
            position: 'absolute',
            left: '-8px',
            top: '50%',
            width: '8px',
            height: '1px',
            background: 'linear-gradient(90deg, rgba(207, 211, 229, 0.5), rgba(207, 211, 229, 0.1))',
          }}
        />

        {/* Roman Numeral */}
        <span
          ref={badgeRomanRef}
          style={{
            fontFamily: 'var(--font-cormorant), var(--font-cinzel), Georgia, serif',
            fontSize: '12px',
            fontStyle: 'italic',
            color: '#cfd3e5',
            borderRight: '1px solid rgba(207, 211, 229, 0.22)',
            paddingRight: '6px',
          }}
        >
          I
        </span>

        {/* Chapter Title */}
        <span
          ref={badgeLabelRef}
          style={{
            fontSize: '9px',
            fontWeight: 500,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#f3f5fe',
          }}
        >
          THE THRESHOLD
        </span>
      </div>
    </aside>
  );
}
