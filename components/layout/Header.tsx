'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { computeStoreStatus } from '@/lib/storeStatus';
import { StoreStatus } from '@/lib/types';

export default function Header() {
  const [status, setStatus] = useState<StoreStatus>(computeStoreStatus());
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isHeroPassedStart, setIsHeroPassedStart] = useState<boolean>(false);

  useEffect(() => {
    const tick = setInterval(() => {
      setStatus(computeStoreStatus());
    }, 60000);

    const onScroll = () => {
      const sy = window.scrollY;
      setIsHeroPassedStart(sy > 60);
      setIsScrolled(sy > 160);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      clearInterval(tick);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 70,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '24px',
        padding: isScrolled
          ? '16px 32px 16px clamp(22px, 6.5vw, 92px)'
          : '24px 32px 24px clamp(22px, 6.5vw, 92px)',
        opacity: isHeroPassedStart ? 1 : 0,
        transform: isHeroPassedStart ? 'translateY(0)' : 'translateY(-14px)',
        pointerEvents: isHeroPassedStart ? 'auto' : 'none',
        backdropFilter: isScrolled ? 'blur(20px) saturate(140%)' : 'none',
        WebkitBackdropFilter: isScrolled ? 'blur(20px) saturate(140%)' : 'none',
        background: isScrolled
          ? 'linear-gradient(180deg, rgba(11, 15, 24, 0.88) 0%, rgba(11, 15, 24, 0.72) 100%)'
          : 'transparent',
        borderBottom: 'none',
        boxShadow: isScrolled ? '0 12px 32px -8px rgba(0, 0, 0, 0.75)' : 'none',
        transition:
          'opacity 500ms cubic-bezier(0.16, 1, 0.3, 1), transform 500ms cubic-bezier(0.16, 1, 0.3, 1), padding 400ms cubic-bezier(0.16, 1, 0.3, 1), background 400ms ease, backdrop-filter 400ms ease, box-shadow 400ms ease',
      }}
    >
      <Link
        href="#threshold"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          textDecoration: 'none',
          paddingRight: '6px',
        }}
        aria-label="THARO — Back to top"
      >
        <span className="tharo-3d-wordmark tharo-3d-wordmark-nav" role="img" aria-label="THARO" />
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '9px',
            fontSize: '11.5px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: '#9397ab',
            whiteSpace: 'nowrap',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: status.open ? '#8fb996' : '#8a6a6f',
              boxShadow: `0 0 10px ${status.open ? '#8fb996' : '#8a6a6f'}`,
              flex: 'none',
            }}
          />
          <span>{status.short}</span>
        </div>

        <Link
          href="#fitting-room"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 18px',
            background: 'rgba(207, 211, 229, 0.08)',
            border: '1px solid rgba(207, 211, 229, 0.22)',
            borderRadius: '6px',
            fontSize: '11.5px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: '#f3f5fe',
            textDecoration: 'none',
            transition: 'all 280ms cubic-bezier(0.16, 1, 0.3, 1)',
            whiteSpace: 'nowrap',
          }}
        >
          Book a fitting
        </Link>
      </div>
    </header>
  );
}
