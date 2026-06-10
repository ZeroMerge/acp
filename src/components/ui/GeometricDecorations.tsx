import React from 'react';

export const CrosshairMarker = React.memo(function CrosshairMarker({ size = 12, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" className={className} style={{ opacity: 0.4 }}>
      <line x1="6" y1="0" x2="6" y2="12" stroke="var(--border-default)" strokeWidth="1" />
      <line x1="0" y1="6" x2="12" y2="6" stroke="var(--border-default)" strokeWidth="1" />
    </svg>
  );
});

export const CornerBrackets = React.memo(function CornerBrackets({ size = 12, color = 'var(--border-active)' }: { size?: number; color?: string }) {
  return (
    <>
      <span
        className="absolute pointer-events-none"
        style={{ top: -1, left: -1, width: size, height: size, borderTop: `1px solid ${color}`, borderLeft: `1px solid ${color}` }}
      />
      <span
        className="absolute pointer-events-none"
        style={{ bottom: -1, right: -1, width: size, height: size, borderBottom: `1px solid ${color}`, borderRight: `1px solid ${color}` }}
      />
    </>
  );
});

export const AmbientGlow = React.memo(function AmbientGlow({
  color = 'blue',
  className = '',
  style = {},
}: {
  color?: 'blue' | 'amber' | 'red';
  className?: string;
  style?: React.CSSProperties;
}) {
  const colorClass = {
    blue: 'ambient-glow-blue',
    amber: 'ambient-glow-amber',
    red: 'ambient-glow-red',
  }[color];

  return (
    <div
      className={`ambient-glow ${colorClass} ${className}`}
      style={{ ...style }}
    />
  );
});

export const GridOverlay = React.memo(function GridOverlay({ className = '' }: { className?: string }) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none grid-overlay ${className}`}
      style={{ zIndex: 0 }}
    />
  );
});