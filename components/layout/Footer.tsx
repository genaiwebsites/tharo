'use client';

import React, { useEffect, useState } from 'react';
import { computeStoreStatus } from '@/lib/storeStatus';
import { StoreStatus } from '@/lib/types';

export default function Footer() {
  const [status, setStatus] = useState<StoreStatus>(computeStoreStatus());

  useEffect(() => {
    const tick = setInterval(() => {
      setStatus(computeStoreStatus());
    }, 60000);
    return () => clearInterval(tick);
  }, []);

  return (
    <footer
      style={{
        position: 'relative',
        padding: 'min(10vh, 80px) 32px 46px clamp(22px, 6.5vw, 92px)',
        borderTop: '1px solid rgba(233, 233, 237, 0.10)'
      }}
    >
      <div
        style={{
          maxWidth: '1320px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'clamp(28px, 4vw, 64px)'
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              fontFamily: 'var(--font-newsreader), Georgia, serif',
              fontSize: '17px',
              letterSpacing: '0.42em',
              color: '#e9e9ed'
            }}
          >
            THARO
          </p>
          <p
            style={{
              margin: '10px 0 0',
              fontSize: '10.5px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#5f6472'
            }}
          >
            Designed for you
          </p>
          <p
            style={{
              margin: '22px 0 0',
              maxWidth: '30ch',
              fontSize: '14.5px',
              lineHeight: 1.7,
              color: '#75798c'
            }}
          >
            Bespoke sherwani, made-to-measure suits and designer shirts in Bhowanipore, Kolkata.
          </p>
        </div>

        <div style={{ fontSize: '14.5px', lineHeight: 1.85, color: '#9397ab' }}>
          <p
            style={{
              margin: '0 0 12px',
              fontSize: '10.5px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#5f6472'
            }}
          >
            Flagship store
          </p>
          <p style={{ margin: 0 }}>
            31 Allenby Road, Bhawanipore
            <br />
            Kolkata 700020
          </p>
          <a
            href="https://maps.google.com/?q=31+Allenby+Road+Bhawanipore+Kolkata+700020"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              marginTop: '12px',
              fontSize: '11.5px',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              borderBottom: '1px solid rgba(207, 211, 229, 0.3)',
              paddingBottom: '3px'
            }}
          >
            Open in Google Maps
          </a>
        </div>

        <div style={{ fontSize: '14.5px', lineHeight: 1.85, color: '#9397ab' }}>
          <p
            style={{
              margin: '0 0 12px',
              fontSize: '10.5px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#5f6472'
            }}
          >
            Hours
          </p>
          <p style={{ margin: 0 }}>
            11:00 AM – 8:30 PM
            <br />
            {status.long}
          </p>
          <p style={{ margin: '12px 0 0', color: '#5f6472' }}>Private fittings by appointment</p>
        </div>

        <div style={{ fontSize: '14.5px', lineHeight: 1.85, color: '#9397ab' }}>
          <p
            style={{
              margin: '0 0 12px',
              fontSize: '10.5px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#5f6472'
            }}
          >
            Direct
          </p>
          <p style={{ margin: 0 }}>
            <a
              href="https://wa.me/919062512323?text=Hello%20Tharo%2C%20I%20would%20like%20to%20book%20a%20fitting%20at%20your%20Allenby%20Road%20atelier."
              target="_blank"
              rel="noopener noreferrer"
              style={{ borderBottom: '1px solid rgba(207, 211, 229, 0.3)', paddingBottom: '3px' }}
            >
              WhatsApp (+91 90625 12323)
            </a>
          </p>
          <p style={{ margin: '10px 0 0' }}>
            <a
              href="https://instagram.com/tharo_designedforyou"
              target="_blank"
              rel="noopener noreferrer"
              style={{ borderBottom: '1px solid rgba(207, 211, 229, 0.3)', paddingBottom: '3px' }}
            >
              Instagram @tharo_designedforyou
            </a>
          </p>
        </div>
      </div>

      <div
        style={{
          maxWidth: '1320px',
          margin: 'clamp(40px, 6vw, 70px) auto 0',
          paddingTop: '28px',
          borderTop: '1px solid rgba(233, 233, 237, 0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          fontSize: '12px',
          color: '#5f6472'
        }}
      >
        <p style={{ margin: 0 }}>
          Rajasthani hand-work. Calcutta tailoring. Cut for one person.
        </p>
        <p style={{ margin: 0 }}>
          &copy; {new Date().getFullYear()} Tharo • Designed for you
        </p>
      </div>
    </footer>
  );
}
