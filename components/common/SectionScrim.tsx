import React from 'react';

const BG = '#0b0f18';

/**
 * SectionScrim — absolute-positioned top/bottom gradient fade.
 * Dissolves the section edge into the page background colour (#0b0f18).
 * Place as the FIRST child inside <section style={{ position:'relative' }}>
 */
export function SectionScrim({
  height = 140,
  zIndex = 8,
  topColor = BG,
  bottomColor = BG,
  showTop = true,
  showBottom = true,
}: {
  height?: number;
  zIndex?: number;
  topColor?: string;
  bottomColor?: string;
  showTop?: boolean;
  showBottom?: boolean;
}) {
  const base: React.CSSProperties = {
    position: 'absolute',
    left: 0,
    right: 0,
    pointerEvents: 'none',
    zIndex,
  };

  return (
    <>
      {showTop && (
        <div
          aria-hidden
          style={{
            ...base,
            top: 0,
            height,
            background: `linear-gradient(to bottom, ${topColor} 0%, transparent 100%)`,
          }}
        />
      )}
      {showBottom && (
        <div
          aria-hidden
          style={{
            ...base,
            bottom: 0,
            height,
            background: `linear-gradient(to top, ${bottomColor} 0%, transparent 100%)`,
          }}
        />
      )}
    </>
  );
}
