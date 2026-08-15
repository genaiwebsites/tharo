'use client';

import React, { useEffect, useRef } from 'react';
import { FITTING_STAGES } from '@/lib/constants';

export default function TheFitting() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const svgPiecesRef = useRef<
    Array<{
      cutEl: SVGPathElement | null;
      cutLen: number;
      seamEl: SVGPathElement | null;
      stitchEl: SVGPathElement | null;
      markEl: SVGPathElement | null;
    }>
  >([]);

  useEffect(() => {
    // Initialize stroke lengths
    svgPiecesRef.current.forEach((p) => {
      if (p && p.cutEl) {
        const len = p.cutEl.getTotalLength();
        p.cutLen = len;
        p.cutEl.style.strokeDasharray = `${len}`;
        p.cutEl.style.strokeDashoffset = `${len}`;
      }
    });

    const handleScroll = () => {
      const s = sectionRef.current;
      const track = trackRef.current;
      if (!s || !track) return;

      const r = s.getBoundingClientRect();
      const span = Math.max(1, r.height - window.innerHeight);
      const fp = Math.min(1, Math.max(0, -r.top / span));
      const dist = Math.max(0, track.scrollWidth - window.innerWidth + 120);

      track.style.transform = `translate3d(${(-fp * dist).toFixed(1)}px, 0, 0)`;

      const n = svgPiecesRef.current.length;
      const march = (performance.now() * 0.012) % 100;

      for (let i = 0; i < n; i++) {
        const p = svgPiecesRef.current[i];
        if (!p) continue;

        const start = i / (n + 0.6);
        const end = start + (1 / (n + 0.6)) * 1.3;
        const lp = Math.min(1, Math.max(0, (fp - start) / (end - start)));
        const st = (a: number, b: number) => Math.min(1, Math.max(0, (lp - a) / (b - a)));

        if (p.cutEl) {
          p.cutEl.style.strokeDashoffset = `${(p.cutLen * (1 - st(0, 0.5))).toFixed(1)}`;
        }
        if (p.seamEl) {
          p.seamEl.style.opacity = `${(0.4 * st(0.24, 0.54)).toFixed(3)}`;
        }
        if (p.markEl) {
          p.markEl.style.opacity = `${(0.82 * st(0.5, 0.8)).toFixed(3)}`;
        }
        if (p.stitchEl) {
          p.stitchEl.style.opacity = `${(0.6 * st(0.4, 0.7)).toFixed(3)}`;
          p.stitchEl.style.strokeDashoffset = `${(-march).toFixed(1)}`;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <section
        id="fitting"
        data-screen-label="The Fitting"
        ref={sectionRef}
        style={{ position: 'relative', height: '460vh' }}
      >
        <div
          style={{
            position: 'sticky',
            top: 0,
            height: '100svh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <div
            style={{
              padding: '0 32px 0 clamp(22px, 6.5vw, 92px)',
              maxWidth: '1320px',
              margin: '0 auto 0',
              width: '100%'
            }}
          >
            <p
              style={{
                margin: '0 0 16px',
                fontSize: '11px',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: '#75798c'
              }}
            >
              Chapter four · The Fitting
            </p>
            <h2
              style={{
                margin: '0 0 10px',
                fontFamily: 'var(--font-newsreader), Georgia, serif',
                fontWeight: 300,
                fontSize: 'clamp(28px, 3.6vw, 48px)',
                lineHeight: 1.1,
                color: '#f3f5fe'
              }}
            >
              What a fitting actually takes.
            </h2>
            <p
              style={{
                margin: 0,
                maxWidth: '52ch',
                fontSize: '16px',
                lineHeight: 1.7,
                color: '#9397ab',
                textWrap: 'pretty'
              }}
            >
              Made-to-measure is a sequence, not a purchase. The whole of it is set out here so none
              of the timeline is a surprise.
            </p>
          </div>

          <div
            ref={trackRef}
            style={{
              marginTop: 'clamp(28px, 4vw, 56px)',
              display: 'flex',
              gap: 'clamp(24px, 3vw, 56px)',
              padding: '0 32px 0 clamp(22px, 6.5vw, 92px)',
              width: 'max-content',
              willChange: 'transform'
            }}
          >
            {FITTING_STAGES.map((s, i) => (
              <article
                key={s.n}
                style={{
                  flex: 'none',
                  width: 'clamp(300px, 32vw, 420px)',
                  borderTop: '1px solid rgba(233, 233, 237, 0.14)',
                  paddingTop: '24px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', marginBottom: '8px' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-newsreader), Georgia, serif',
                      fontSize: '11px',
                      letterSpacing: '0.2em',
                      color: '#5f6472'
                    }}
                  >
                    {s.n}
                  </span>
                  <h3
                    style={{
                      margin: 0,
                      fontFamily: 'var(--font-newsreader), Georgia, serif',
                      fontWeight: 300,
                      fontSize: 'clamp(22px, 2.3vw, 30px)',
                      color: '#f3f5fe',
                      lineHeight: 1.2
                    }}
                  >
                    {s.name}
                  </h3>
                </div>
                <p
                  style={{
                    margin: '0 0 22px',
                    fontSize: '15.5px',
                    lineHeight: 1.66,
                    color: '#9397ab',
                    maxWidth: '34ch',
                    textWrap: 'pretty'
                  }}
                >
                  {s.note}
                </p>

                {/* Animated Pattern SVG */}
                <svg
                  viewBox="0 0 340 360"
                  fill="none"
                  aria-hidden="true"
                  style={{
                    width: '100%',
                    height: 'clamp(190px, 24vh, 300px)',
                    display: 'block',
                    overflow: 'visible'
                  }}
                >
                  <path
                    ref={(el) => {
                      if (!svgPiecesRef.current[i]) svgPiecesRef.current[i] = {} as any;
                      svgPiecesRef.current[i].seamEl = el;
                    }}
                    d={s.seam}
                    stroke="#cfd3e5"
                    strokeWidth="1"
                    strokeDasharray="7 6"
                    strokeLinejoin="round"
                    opacity="0"
                    vectorEffect="non-scaling-stroke"
                  />
                  <path
                    ref={(el) => {
                      if (!svgPiecesRef.current[i]) svgPiecesRef.current[i] = {} as any;
                      svgPiecesRef.current[i].cutEl = el;
                    }}
                    d={s.cut}
                    stroke="#cfd3e5"
                    strokeWidth="1.25"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    opacity="0.92"
                    vectorEffect="non-scaling-stroke"
                  />
                  <path
                    ref={(el) => {
                      if (!svgPiecesRef.current[i]) svgPiecesRef.current[i] = {} as any;
                      svgPiecesRef.current[i].stitchEl = el;
                    }}
                    d={s.stitch}
                    stroke="#cfd3e5"
                    strokeWidth="1"
                    strokeDasharray="3 7"
                    strokeLinecap="round"
                    opacity="0"
                    vectorEffect="non-scaling-stroke"
                  />
                  <path
                    ref={(el) => {
                      if (!svgPiecesRef.current[i]) svgPiecesRef.current[i] = {} as any;
                      svgPiecesRef.current[i].markEl = el;
                    }}
                    d={s.mark}
                    stroke="#cfd3e5"
                    strokeWidth="1"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    opacity="0"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>

                <p
                  style={{
                    margin: '16px 0 0',
                    fontSize: '11.5px',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: '#5f6472'
                  }}
                >
                  {s.piece}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Figures expectation setting */}
      <section
        aria-label="Fitting figures"
        style={{
          position: 'relative',
          padding: '0 32px min(16vh, 130px) clamp(22px, 6.5vw, 92px)'
        }}
      >
        <div
          style={{
            maxWidth: '1320px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: 'clamp(20px, 3vw, 48px)',
            borderTop: '1px solid rgba(233, 233, 237, 0.12)',
            paddingTop: 'clamp(28px, 4vw, 52px)'
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--font-newsreader), Georgia, serif',
                fontWeight: 300,
                fontSize: 'clamp(40px, 5vw, 68px)',
                lineHeight: 1,
                color: '#cfd3e5'
              }}
            >
              28+
            </p>
            <p
              style={{
                margin: '14px 0 0',
                fontSize: '11.5px',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: '#75798c'
              }}
            >
              Measurements taken
            </p>
          </div>

          <div>
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--font-newsreader), Georgia, serif',
                fontWeight: 300,
                fontSize: 'clamp(40px, 5vw, 68px)',
                lineHeight: 1,
                color: '#cfd3e5'
              }}
            >
              3
            </p>
            <p
              style={{
                margin: '14px 0 0',
                fontSize: '11.5px',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: '#75798c'
              }}
            >
              Fittings scheduled
            </p>
          </div>

          <div>
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--font-newsreader), Georgia, serif',
                fontWeight: 300,
                fontSize: 'clamp(40px, 5vw, 68px)',
                lineHeight: 1,
                color: '#cfd3e5'
              }}
            >
              21
            </p>
            <p
              style={{
                margin: '14px 0 0',
                fontSize: '11.5px',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: '#75798c'
              }}
            >
              Days, consult to delivery
            </p>
          </div>

          <p
            style={{
              margin: 0,
              alignSelf: 'end',
              fontSize: '13px',
              lineHeight: 1.6,
              color: '#5f6472',
              maxWidth: '26ch'
            }}
          >
            Every piece is cut, fitted, adjusted, and finished on Allenby Road.
          </p>
        </div>
      </section>
    </>
  );
}
