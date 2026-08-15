'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { OCCASIONS } from '@/lib/constants';
import { SunHaldiIcon, BloomSangeetIcon, CrownWeddingIcon, SashReceptionIcon } from '@/components/common/Icons';

interface WarmRoomWeddingProps {
  onOccasionChange?: (occasionId: string) => void;
}

export default function WarmRoomWedding({ onOccasionChange }: WarmRoomWeddingProps) {
  const [selectedOccasion, setSelectedOccasion] = useState<string>('wedding');

  const handleSelect = (id: string) => {
    setSelectedOccasion(id);
    const conf = OCCASIONS.find((o) => o.id === id);
    if (conf) {
      document.documentElement.style.setProperty('--occ-accent', conf.color);
    }
    if (onOccasionChange) onOccasionChange(id);
  };

  const activeOccasion = OCCASIONS.find((o) => o.id === selectedOccasion) || OCCASIONS[2];

  const getOccasionIcon = (id: string, color: string) => {
    switch (id) {
      case 'haldi':
        return <SunHaldiIcon size={16} color={color} />;
      case 'sangeet':
        return <BloomSangeetIcon size={16} color={color} />;
      case 'wedding':
        return <CrownWeddingIcon size={16} color={color} />;
      case 'reception':
        return <SashReceptionIcon size={16} color={color} />;
      default:
        return null;
    }
  };

  return (
    <section
      id="warm-room"
      data-screen-label="Warm Room"
      style={{
        position: 'relative',
        padding: 'min(18vh, 150px) 32px min(18vh, 150px) clamp(22px, 6.5vw, 92px)',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(80% 60% at 78% 34%, rgba(196, 132, 62, calc(.16 * var(--warm, 0.5))), transparent 70%)',
        }}
      />
      <div
        style={{
          position: 'relative',
          maxWidth: '1320px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'clamp(36px, 6vw, 96px)',
          alignItems: 'center',
        }}
      >
        <div>
          <p
            style={{
              margin: '0 0 20px',
              fontSize: '11px',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: '#8a7f70',
            }}
          >
            Chapter three · The Warm Room
          </p>
          <h2
            style={{
              margin: 0,
              maxWidth: '14ch',
              fontFamily: 'var(--font-cormorant), var(--font-cinzel), Georgia, serif',
              fontWeight: 400,
              fontSize: 'clamp(34px, 5vw, 64px)',
              lineHeight: 1.06,
              letterSpacing: '-0.01em',
              color: '#f3f5fe',
              textWrap: 'pretty',
            }}
          >
            Dressed for five days, not one night.
          </h2>
          <p
            style={{
              margin: '26px 0 0',
              maxWidth: '38ch',
              fontSize: '16px',
              lineHeight: 1.72,
              color: '#a3968a',
              textWrap: 'pretty',
            }}
          >
            A wedding here runs to five events, each with its own light. Pick one and the room changes with it.
          </p>

          {/* Interactive Occasion Picker with Impeccable Alignment */}
          <div
            role="tablist"
            aria-label="Occasion"
            style={{
              marginTop: 'clamp(32px, 4vw, 52px)',
              display: 'flex',
              flexDirection: 'column',
              borderTop: '1px solid rgba(233, 233, 237, 0.12)',
            }}
          >
            {OCCASIONS.map((o) => {
              const isSelected = o.id === selectedOccasion;
              return (
                <button
                  key={o.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(o.id)}
                  style={{
                    appearance: 'none',
                    background: isSelected ? 'rgba(255, 255, 255, 0.03)' : 'transparent',
                    border: 0,
                    borderBottom: '1px solid rgba(233, 233, 237, 0.12)',
                    padding: '20px 14px',
                    paddingLeft: isSelected ? '18px' : '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '20px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    borderRadius: '4px',
                    transition: 'all 350ms cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  {/* Left: Indicator Dot & Name */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                    }}
                  >
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: o.color,
                        boxShadow: isSelected ? `0 0 10px ${o.color}` : 'none',
                        opacity: isSelected ? 1 : 0.4,
                        transition: 'opacity 300ms ease, box-shadow 300ms ease',
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: 'var(--font-cormorant), var(--font-cinzel), Georgia, serif',
                        fontWeight: isSelected ? 500 : 400,
                        fontSize: 'clamp(22px, 2.4vw, 32px)',
                        lineHeight: 1,
                        color: isSelected ? '#f3f5fe' : '#8a8075',
                        transition: 'color 300ms ease',
                      }}
                    >
                      {o.name}
                    </span>
                  </div>

                  {/* Right: Subtitle with Icon Badge */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '13px',
                        lineHeight: 1.4,
                        color: isSelected ? '#c4b6a8' : '#6a6259',
                        textAlign: 'right',
                        transition: 'color 300ms ease',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {o.note}
                    </span>
                    <span
                      style={{
                        opacity: isSelected ? 1 : 0.35,
                        transition: 'opacity 300ms ease',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {getOccasionIcon(o.id, isSelected ? o.color : '#7d7367')}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Arch and side composition */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.5fr 1fr',
            gap: 'clamp(14px, 1.6vw, 24px)',
            alignItems: 'end',
          }}
        >
          {/* Main Arched Frame */}
          <div
            style={{
              position: 'relative',
              aspectRatio: '3/4.1',
              overflow: 'hidden',
              background: '#2a221c',
              borderRadius: '50% 50% 6px 6px / 33% 33% 1.5% 1.5%',
              border: '1px solid rgba(229, 189, 113, 0.35)',
              boxShadow: '0 40px 100px rgba(0, 0, 0, 0.75), 0 0 45px rgba(196, 132, 62, 0.18), inset 0 0 0 1px rgba(255, 255, 255, 0.12)',
            }}
          >
            {OCCASIONS.map((o) => (
              <div
                key={o.id}
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: o.id === selectedOccasion ? 1 : 0,
                  transition: 'opacity 800ms cubic-bezier(0.16, 1, 0.3, 1)',
                  zIndex: o.id === selectedOccasion ? 2 : 1,
                }}
              >
                <Image
                  src={o.hero}
                  alt={o.heroAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  style={{
                    objectFit: 'cover',
                    filter: 'saturate(.95) contrast(1.03)',
                  }}
                />
              </div>
            ))}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                background: 'var(--grade)',
                mixBlendMode: 'multiply',
                zIndex: 3,
              }}
            />
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                boxShadow: 'inset 0 -70px 90px rgba(24, 16, 10, 0.5)',
                zIndex: 4,
              }}
            />
          </div>

          {/* Supporting detail plates */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 1.6vw, 24px)' }}>
            <div
              style={{
                position: 'relative',
                aspectRatio: '1/1',
                overflow: 'hidden',
                borderRadius: '4px',
                background: '#2a221c',
                boxShadow: '0 20px 45px rgba(0, 0, 0, 0.35)',
              }}
            >
              {OCCASIONS.map((o) => (
                <div
                  key={o.id}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: o.id === selectedOccasion ? 1 : 0,
                    transition: 'opacity 800ms cubic-bezier(0.16, 1, 0.3, 1)',
                    zIndex: o.id === selectedOccasion ? 2 : 1,
                  }}
                >
                  <Image
                    src={o.detail}
                    alt={o.detailAlt}
                    fill
                    sizes="(max-width: 768px) 50vw, 20vw"
                    style={{
                      objectFit: 'cover',
                      filter: 'saturate(.95) contrast(1.03)',
                    }}
                  />
                </div>
              ))}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'var(--grade)',
                  mixBlendMode: 'multiply',
                  zIndex: 3,
                }}
              />
            </div>

            <div
              style={{
                position: 'relative',
                aspectRatio: '1/1.15',
                overflow: 'hidden',
                borderRadius: '4px',
                background: '#2a221c',
                boxShadow: '0 20px 45px rgba(0, 0, 0, 0.35)',
              }}
            >
              {OCCASIONS.map((o) => (
                <div
                  key={o.id}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: o.id === selectedOccasion ? 1 : 0,
                    transition: 'opacity 800ms cubic-bezier(0.16, 1, 0.3, 1)',
                    zIndex: o.id === selectedOccasion ? 2 : 1,
                  }}
                >
                  <Image
                    src={o.support}
                    alt={o.supportAlt}
                    fill
                    sizes="(max-width: 768px) 50vw, 20vw"
                    style={{
                      objectFit: 'cover',
                      filter: 'saturate(.95) contrast(1.03)',
                    }}
                  />
                </div>
              ))}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'var(--grade)',
                  mixBlendMode: 'multiply',
                  zIndex: 3,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
