"use client";

import React, { useMemo } from "react";

/**
 * ─────────────────────────────────────────────────────────────────────
 *  GlassBackground.tsx
 *
 *  A full-viewport liquid glass background for React / Next.js.
 *  Uniform frosted vertical panels sit over softly drifting color blobs.
 *
 *  Usage:
 *    <GlassBackground>
 *      <YourPageContent />
 *    </GlassBackground>
 *
 *  Custom colors:
 *    <GlassBackground colors={{ blob1: "#FADADD", blob2: "#DAF0FF" }}>
 *      ...
 *    </GlassBackground>
 * ─────────────────────────────────────────────────────────────────────
 */

// ── Color tokens ──────────────────────────────────────────────────────
//    Adjust any value here — or pass `colors` prop for per-instance overrides.

export interface GlassColors {
  /** Base canvas — keep near #FFFFFF for extreme light mode */
  canvas: string;
  /** Ambient blob 1 — drifts from top-left */
  blob1: string;
  /** Ambient blob 2 — drifts from right-center */
  blob2: string;
  /** Ambient blob 3 — drifts from bottom-center */
  blob3: string;
  /** Translucent fill of each glass panel */
  panelFill: string;
  /** Right-edge dividing line — where the blue lives */
  panelEdge: string;
  /** Left-edge inner highlight — simulates glass catching light */
  panelHighlight: string;
}

const DEFAULT_COLORS: GlassColors = {
  canvas:         "#fff1f1",
  blob1:          "#c5dbff",   // barely-blue whisper
  blob2:          "#d0edff",   // icy breath
  blob3:          "#d9cfff",   // ghost lavender — keeps canvas from going flat
  panelFill:      "rgba(255, 255, 255, 0.52)",
  panelEdge:      "rgba(255, 255, 255, 0.99)",
  panelHighlight: "rgba(255, 255, 255, 0.58)",
};

// ── Props ─────────────────────────────────────────────────────────────

export interface GlassBackgroundProps {
  /** Partial color overrides — only supply what you want to change */
  colors?: Partial<GlassColors>;
  /** Number of uniform vertical glass panels (default: 14) */
  panelCount?: number;
  /** Backdrop blur intensity in px (default: 20) */
  blurPx?: number;
  /** Full shimmer wave cycle in seconds (default: 3.8) */
  shimmerDuration?: number;
  /** Stagger delay between each panel shimmer in seconds (default: 0.20) */
  shimmerStagger?: number;
  /** Content rendered above the glass */
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// ── CSS keyframes (injected inline — no CSS file needed) ──────────────

const KEYFRAMES = `
  @keyframes gb-drift1 {
    0%,100% { transform: translate(  0px,   0px) scale(1);    }
    33%      { transform: translate( 50px, -70px) scale(1.07); }
    66%      { transform: translate(-40px,  45px) scale(0.94); }
  }
  @keyframes gb-drift2 {
    0%,100% { transform: translate(  0px,   0px) scale(1);    }
    30%      { transform: translate(-60px,  40px) scale(1.05); }
    70%      { transform: translate( 45px, -60px) scale(0.96); }
  }
  @keyframes gb-drift3 {
    0%,100% { transform: translate( 0px,   0px) scale(1);    }
    40%      { transform: translate(40px,  60px) scale(1.04); }
    75%      { transform: translate(-50px,-40px) scale(0.97); }
  }
  @keyframes gb-wave {
    0%,100% { opacity: 0.68; }
    50%      { opacity: 1;    }
  }
  @media (prefers-reduced-motion: reduce) {
    .gb-blob, .gb-panel { animation: none !important; }
  }
`;

// ── Component ─────────────────────────────────────────────────────────

export const GlassBackground: React.FC<GlassBackgroundProps> = ({
  colors,
  panelCount       = 14,
  blurPx           = 20,
  shimmerDuration  = 3.8,
  shimmerStagger   = 0.20,
  children,
  className,
  style,
}) => {
  const c = useMemo<GlassColors>(
    () => ({ ...DEFAULT_COLORS, ...colors }),
    [colors]
  );

  const panels = useMemo(
    () => Array.from({ length: panelCount }, (_, i) => i),
    [panelCount]
  );

  return (
    <div
      className={className}
      style={{
        position:  "relative",
        width:     "100%",
        minHeight: "100vh",
        background: c.canvas,
        overflow:  "hidden",
        ...style,
      }}
    >
      {/* Keyframe definitions */}
      <style>{KEYFRAMES}</style>

      {/* ── Layer 0 · Ambient color blobs ───────────────────────────── */}
      <div
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}
      >
        {/* Blob 1 — top-left */}
        <div
          className="gb-blob"
          style={{
            position:     "absolute",
            width:        "80vw",
            height:       "80vh",
            top:          "-20%",
            left:         "-15%",
            borderRadius: "50%",
            background:   `radial-gradient(ellipse at center, ${c.blob1} 0%, transparent 68%)`,
            filter:       "blur(70px)",
            animation:    "gb-drift1 22s ease-in-out infinite",
          }}
        />

        {/* Blob 2 — right-center */}
        <div
          className="gb-blob"
          style={{
            position:     "absolute",
            width:        "70vw",
            height:       "70vh",
            top:          "10%",
            right:        "-20%",
            borderRadius: "50%",
            background:   `radial-gradient(ellipse at center, ${c.blob2} 0%, transparent 68%)`,
            filter:       "blur(80px)",
            animation:    "gb-drift2 28s ease-in-out infinite",
          }}
        />

        {/* Blob 3 — bottom-center */}
        <div
          className="gb-blob"
          style={{
            position:     "absolute",
            width:        "75vw",
            height:       "75vh",
            bottom:       "-25%",
            left:         "15%",
            borderRadius: "50%",
            background:   `radial-gradient(ellipse at center, ${c.blob3} 0%, transparent 68%)`,
            filter:       "blur(75px)",
            animation:    "gb-drift3 34s ease-in-out infinite",
          }}
        />
      </div>

      {/* ── Layer 1 · Glass panels ──────────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position:       "absolute",
          inset:          0,
          zIndex:         1,
          display:        "flex",
          pointerEvents:  "none",
        }}
      >
        {panels.map((i) => (
          <div
            key={i}
            className="gb-panel"
            style={{
              flex:                  1,
              height:                "100%",
              backdropFilter:        `blur(${blurPx}px) saturate(160%)`,
              WebkitBackdropFilter:  `blur(${blurPx}px) saturate(160%)`,
              background:            c.panelFill,
              borderRight:           `1px solid ${c.panelEdge}`,
              boxShadow:             `inset 1px 0 0 ${c.panelHighlight}`,
              animation:             `gb-wave ${shimmerDuration}s ease-in-out infinite`,
              animationDelay:        `${(i * shimmerStagger).toFixed(2)}s`,
            }}
          />
        ))}
      </div>

      {/* ── Layer 2 · Content ───────────────────────────────────────── */}
      <div style={{ position: "relative", zIndex: 2 }}>
        {children}
      </div>
    </div>
  );
};

export default GlassBackground;
