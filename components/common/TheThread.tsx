'use client';

import React, { useEffect, useRef, useMemo, useState, useCallback } from 'react';
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

  const [isRailHovered, setIsRailHovered] = useState<boolean>(false);
  const [hoveredKnotId, setHoveredKnotId] = useState<string | null>(null);

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

  const getPointAtY = useCallback(
    (y: number) => {
      const { cx, amp, wavelength } = geometry;
      const phase = (2 * Math.PI * y) / wavelength;
      const x = cx + amp * Math.sin(phase);
      const dx_dy = amp * ((2 * Math.PI) / wavelength) * Math.cos(phase);
      const rawAngleDeg = (Math.atan2(1, dx_dy) * 180) / Math.PI;
      const angle = 90 + (rawAngleDeg - 90) * 0.45;
      return { x, y, angle };
    },
    [geometry]
  );

  const [dCord, setDCord] = useState<string>('');
  const [dCouching, setDCouching] = useState<string>('');
  const [chapterList, setChapterList] = useState<
    Array<{ id: string; label: string; roman: string; x: number; y: number; fraction: number }>
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
        startY = thresholdEl.offsetTop + span * 0.8;
      } else if (meaningEl) {
        startY = meaningEl.offsetTop;
      }

      const docHeight = document.documentElement.scrollHeight;
      const totalSpan = Math.max(1, docHeight - startY - window.innerHeight);

      const topY = 28;
      const bottomY = H - 32;
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
      setChapterList(
        calculatedKnots.map((k) => ({
          id: k.id,
          label: k.label,
          roman: k.roman,
          x: k.x,
          y: k.y,
          fraction: k.fraction,
        }))
      );
      setDCord(cordStr);
      setDCouching(couchingStr);
    };

    buildGeometry();
    window.addEventListener('resize', buildGeometry);
    return () => window.removeEventListener('resize', buildGeometry);
  }, [geometry, getPointAtY]);

  // Synchronize scroll progress directly on DOM refs with zero React re-render churn
  useEffect(() => {
    if (!visible) return;

    const H = Math.max(500, window.innerHeight);
    const topY = 28;
    const bottomY = H - 32;
    const usableSpan = bottomY - topY;

    const clampedProg = Math.min(1, Math.max(0, scrollProgress));
    const yPos = topY + clampedProg * usableSpan;
    const pt = getPointAtY(yPos);

    if (clipRectRef.current) {
      clipRectRef.current.setAttribute('height', `${Math.max(0, yPos + 4)}`);
    }

    if (needleGroupRef.current) {
      needleGroupRef.current.setAttribute(
        'transform',
        `translate(${pt.x.toFixed(1)}, ${pt.y.toFixed(1)}) rotate(${pt.angle.toFixed(1)})`
      );
    }

    // Update chapter knots
    let activeKnot = knotsRef.current[0];
    knotsRef.current.forEach((k) => {
      const isActive = clampedProg >= k.fraction - 0.02;
      if (isActive) activeKnot = k;

      if (k.eyeletOuter) {
        k.eyeletOuter.style.opacity = isActive ? '0.95' : '0.25';
        k.eyeletOuter.setAttribute('r', isActive ? '5' : '3');
        k.eyeletOuter.setAttribute('stroke', isActive ? '#e5bd71' : '#cfd3e5');
      }
      if (k.eyeletInner) {
        k.eyeletInner.style.opacity = isActive ? '1' : '0.4';
        k.eyeletInner.setAttribute('r', isActive ? '2' : '1');
        k.eyeletInner.setAttribute('fill', isActive ? '#ffffff' : '#cfd3e5');
      }
    });

    if (badgeRef.current && activeKnot) {
      badgeRef.current.style.top = `${activeKnot.y.toFixed(1)}px`;
      if (badgeRomanRef.current) badgeRomanRef.current.textContent = activeKnot.roman;
      if (badgeLabelRef.current) badgeLabelRef.current.textContent = activeKnot.label;
    }
  }, [scrollProgress, visible, getPointAtY]);

  const handleKnotClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <aside
      ref={containerRef}
      id="thread-rail"
      aria-label="Continuous Cornelli Thread Progress Spine"
      onPointerEnter={() => setIsRailHovered(true)}
      onPointerLeave={() => {
        setIsRailHovered(false);
        setHoveredKnotId(null);
      }}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width: '84px',
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
            <stop offset="40%" stopColor="#f3f5fe" stopOpacity="0.95" />
            <stop offset="75%" stopColor="#cfd3e5" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#c5a880" stopOpacity="0.75" />
          </linearGradient>

          <linearGradient id="needle-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#f3f5fe" />
            <stop offset="85%" stopColor="#e5bd71" />
            <stop offset="100%" stopColor="#8a734e" />
          </linearGradient>

          <filter id="soft-thread-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="needle-starlight-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Strict ClipPath: Ensures EVERYTHING draws seamlessly up to current needle Y with zero gap */}
          <clipPath id="thread-scrolled-clip">
            <rect ref={clipRectRef} x="0" y="0" width="100" height="28" />
          </clipPath>
        </defs>

        {/* 0. Subtle Background Guide Track */}
        <path
          d={dCord}
          fill="none"
          stroke="rgba(207, 211, 229, 0.12)"
          strokeWidth="1.2"
          strokeDasharray="3 4"
          vectorEffect="non-scaling-stroke"
        />

        {/* Group clipped strictly to current needle scroll position */}
        <g clipPath="url(#thread-scrolled-clip)">
          {/* 1. Fabric Shadow of the active cord */}
          <path
            ref={shadowPathRef}
            d={dCord}
            fill="none"
            stroke="#06090f"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.65"
            vectorEffect="non-scaling-stroke"
          />

          {/* 2. Transverse Couching Stitches */}
          <path
            d={dCouching}
            fill="none"
            stroke="#cfd3e5"
            strokeWidth="1.1"
            strokeLinecap="round"
            opacity="0.5"
            vectorEffect="non-scaling-stroke"
          />

          {/* 3. Active Drawn Silver Soutache Cord */}
          <path
            ref={activePathRef}
            d={dCord}
            fill="none"
            stroke="url(#silver-cord-glow)"
            strokeWidth="2.0"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#soft-thread-glow)"
            vectorEffect="non-scaling-stroke"
          />
        </g>

        {/* 4. Chapter Tension Eyelets */}
        {chapterList.map((k, idx) => {
          const isKnotHovered = hoveredKnotId === k.id;
          return (
            <g
              key={k.id}
              className="chapter-eyelet"
              onClick={() => handleKnotClick(k.id)}
              onPointerEnter={() => setHoveredKnotId(k.id)}
              onPointerLeave={() => setHoveredKnotId(null)}
              style={{ cursor: 'pointer' }}
            >
              {/* Invisible touch/hover target */}
              <circle cx={k.x.toFixed(1)} cy={k.y.toFixed(1)} r="14" fill="transparent" />

              {/* Outer Ring */}
              <circle
                ref={(el) => {
                  if (knotsRef.current[idx]) knotsRef.current[idx].eyeletOuter = el;
                }}
                cx={k.x.toFixed(1)}
                cy={k.y.toFixed(1)}
                r={isKnotHovered ? '6' : '3'}
                fill="rgba(11, 15, 24, 0.9)"
                stroke="#ffffff"
                strokeWidth="1.2"
                opacity="0.25"
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
                r={isKnotHovered ? '2.5' : '1'}
                fill="#ffffff"
                opacity="0.4"
                style={{ transition: 'r 250ms ease, fill 250ms ease, opacity 250ms ease' }}
              />
            </g>
          );
        })}

        {/* 5. Sleek Bespoke Tailor's Sewing Needle at Current Scroll Tip */}
        <g
          ref={needleGroupRef}
          transform="translate(36, 28) rotate(90)"
          opacity={visible ? 1 : 0}
        >
          {/* Subtle Needle Ambient Halo */}
          <circle r="9" fill="#e5bd71" opacity="0.16" filter="url(#needle-starlight-glow)" />

          {/* Slender Needle Blade */}
          <path
            d="M 0 -12 L 1.6 -3 L 0.8 9 L 0 14 L -0.8 9 L -1.6 -3 Z"
            fill="url(#needle-gradient)"
            stroke="#ffffff"
            strokeWidth="0.4"
            filter="url(#needle-starlight-glow)"
          />

          {/* Needle Eyelet */}
          <ellipse cx="0" cy="-6" rx="0.55" ry="1.6" fill="#0b0f18" />
          <circle cx="0" cy="-6" r="0.45" fill="#e5bd71" />

          {/* Trailing Active Starlight Stitch */}
          <circle cx="0" cy="14" r="1.4" fill="#e5bd71" filter="url(#soft-thread-glow)" />
        </g>
      </svg>

      {/* 6. Floating Chapter Indicator Badge */}
      <div
        ref={badgeRef}
        style={{
          position: 'absolute',
          left: '48px',
          top: '28px',
          transform: isRailHovered ? 'translateY(-50%) translateX(0)' : 'translateY(-50%) translateX(-6px)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: '4px',
          background: 'rgba(11, 15, 24, 0.94)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(229, 189, 113, 0.3)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.75), 0 0 14px rgba(229, 189, 113, 0.12)',
          whiteSpace: 'nowrap',
          pointerEvents: isRailHovered ? 'auto' : 'none',
          opacity: visible && isRailHovered ? 1 : 0,
          transition:
            'opacity 240ms cubic-bezier(0.16, 1, 0.3, 1), transform 240ms cubic-bezier(0.16, 1, 0.3, 1)',
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
            background: 'linear-gradient(90deg, rgba(229, 189, 113, 0.6), rgba(229, 189, 113, 0.1))',
          }}
        />

        {/* Roman Numeral */}
        <span
          ref={badgeRomanRef}
          style={{
            fontFamily: 'var(--font-cinzel), Georgia, serif',
            fontSize: '11px',
            color: '#c5a880',
            borderRight: '1px solid rgba(207, 211, 229, 0.22)',
            paddingRight: '8px',
          }}
        >
          I
        </span>

        {/* Chapter Title */}
        <span
          ref={badgeLabelRef}
          style={{
            fontSize: '10px',
            fontWeight: 500,
            letterSpacing: '0.22em',
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
