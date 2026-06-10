import React from 'react';

interface GlassContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  variant?: 'navbar' | 'hero-focal' | 'app-shell' | 'panel';
  intensity?: 'light' | 'medium' | 'heavy';
}

export default function GlassContainer({
  children,
  variant = 'panel',
  intensity = 'medium',
  className = '',
  style,
  ...props
}: GlassContainerProps) {
  
  // High-fidelity configuration mapping for realistic light refraction
  const blurAmount = {
    light: '8px',
    medium: '16px',
    heavy: '24px'
  }[intensity];

  const baseBackgrounds = {
    navbar: 'rgba(240, 238, 232, 0.45)', // Ultra clear cream blend
    'hero-focal': 'rgba(25, 0, 255, 0.15)', // Blue-tinted glass modifier
    'app-shell': 'rgba(240, 238, 232, 0.7)',  // Full structural backdrop
    panel: 'rgba(247, 246, 252, 0.55)'     // Crisp card surface override
  }[variant];

  return (
    <div
      className={`relative rounded-none border overflow-hidden ${className}`}
      style={{
        backgroundColor: baseBackgrounds,
        backdropFilter: `blur(${blurAmount}) saturate(120%)`,
        WebkitBackdropFilter: `blur(${blurAmount}) saturate(120%)`,
        borderColor: variant === 'hero-focal' ? 'var(--border-active)' : 'var(--border-subtle)',
        
        /* ADVANCED RENDER LAYER: 
          Simulates the physical vertical ridges (fluting) of structural glass panels.
          Uses high-frequency repeating gradients to bounce highlights and create depth.
        */
        backgroundImage: `
          repeating-linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.0) 0px,
            rgba(255, 255, 255, 0.08) 2px,
            rgba(0, 0, 0, 0.02) 3px,
            rgba(0, 0, 0, 0.0) 5px,
            rgba(255, 255, 255, 0.0) 6px
          ),
          linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.2) 0%,
            rgba(255, 255, 255, 0.0) 100%
          )
        `,
        backgroundSize: '8px 100%, 100% 100%',
        boxShadow: variant === 'panel' ? 'inset 0 1px 0 rgba(255,255,255,0.4)' : 'none',
        ...style,
      }}
      {...props}
    >
      {/* Structural Inner Content Wrapper */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}