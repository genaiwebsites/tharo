'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { computeStoreStatus } from '@/lib/storeStatus';
import { StoreStatus } from '@/lib/types';

export default function Header() {
  const [status, setStatus] = useState<StoreStatus>(computeStoreStatus());
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    const tick = setInterval(() => {
      setStatus(computeStoreStatus());
    }, 60000);

    const onScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // initial check

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
          ? '14px 32px 14px clamp(22px, 6.5vw, 92px)'
          : '22px 32px 22px clamp(22px, 6.5vw, 92px)',
        backdropFilter: isScrolled ? 'blur(14px)' : 'none',
        WebkitBackdropFilter: isScrolled ? 'blur(14px)' : 'none',
        background: isScrolled
          ? 'rgba(11, 15, 24, 0.78)'
          : 'transparent',
        borderBottom: isScrolled
          ? '1px solid rgba(207, 211, 229, 0.08)'
          : '1px solid transparent',
        transition:
          'padding 350ms cubic-bezier(0.16, 1, 0.3, 1), background 350ms ease, backdrop-filter 350ms ease, border-color 350ms ease'
      }}
    >
      <Link
        href="#threshold"
        style={{
          fontFamily: 'var(--font-newsreader), Georgia, serif',
          fontSize: '19px',
          letterSpacing: '0.42em',
          fontWeight: 400,
          color: '#e9e9ed',
          paddingRight: '6px'
        }}
      >
        THARO
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
            whiteSpace: 'nowrap'
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: status.open ? '#8fb996' : '#8a6a6f',
              boxShadow: `0 0 10px ${status.open ? '#8fb996' : '#8a6a6f'}`,
              flex: 'none'
            }}
          />
          <span>{status.short}</span>
        </div>

        <Link
          href="#fitting-room"
          style={{
            fontSize: '11.5px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: '#cfd3e5',
            borderBottom: '1px solid rgba(207, 211, 229, 0.32)',
            paddingBottom: '3px',
            whiteSpace: 'nowrap'
          }}
        >
          Book a fitting
        </Link>
      </div>
    </header>
  );
}
