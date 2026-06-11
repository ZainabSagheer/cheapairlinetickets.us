"use client";

import React from "react";

// ─── SVG Distortion Filter ────────────────────────────────────────────────────
// Must be rendered once at the root so `url(#glass-distortion)` resolves globally.
export const GlassFilter: React.FC = () => (
  <svg style={{ display: "none" }} aria-hidden="true">
    <defs>
      <filter
        id="glass-distortion"
        x="0%"
        y="0%"
        width="100%"
        height="100%"
        filterUnits="objectBoundingBox"
      >
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.001 0.005"
          numOctaves="1"
          seed="17"
          result="turbulence"
        />
        <feComponentTransfer in="turbulence" result="mapped">
          <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
          <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
          <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
        </feComponentTransfer>
        <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
        <feSpecularLighting
          in="softMap"
          surfaceScale="5"
          specularConstant="1"
          specularExponent="100"
          lightingColor="white"
          result="specLight"
        >
          <fePointLight x="-200" y="-200" z="300" />
        </feSpecularLighting>
        <feComposite
          in="specLight"
          operator="arithmetic"
          k1="0"
          k2="1"
          k3="1"
          k4="0"
          result="litImage"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="softMap"
          scale="200"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </defs>
  </svg>
);

// ─── Shared spring easing ─────────────────────────────────────────────────────
const SPRING = "cubic-bezier(0.175, 0.885, 0.32, 2.2)";

// ─── Variants ─────────────────────────────────────────────────────────────────
type GlassVariant = "light" | "dark" | "blue" | "cyan";

// Values are defined as CSS custom properties in globals.css and switch
// automatically when the .dark class is toggled by next-themes.
const TINT: Record<GlassVariant, string> = {
  light: "var(--glass-tint-light)",
  dark:  "var(--glass-tint-dark)",
  blue:  "var(--glass-tint-blue)",
  cyan:  "var(--glass-tint-cyan)",
};

const HIGHLIGHT: Record<GlassVariant, string> = {
  light: "var(--glass-hl-light)",
  dark:  "var(--glass-hl-dark)",
  blue:  "var(--glass-hl-blue)",
  cyan:  "var(--glass-hl-cyan)",
};

// ─── Core Glass wrapper ───────────────────────────────────────────────────────
export interface GlassEffectProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  href?: string;
  target?: string;
  variant?: GlassVariant;
  blurStrength?: number;          // backdrop blur px (default 12)
  onClick?: () => void;
}

export const GlassEffect: React.FC<GlassEffectProps> = ({
  children,
  className = "",
  style = {},
  href,
  target = "_blank",
  variant = "dark",
  blurStrength = 12,
  onClick,
}) => {
  const baseStyle: React.CSSProperties = {
    boxShadow: "0 8px 32px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.2)",
    transitionTimingFunction: SPRING,
    ...style,
  };

  const content = (
    <div
      className={`relative flex font-semibold overflow-hidden cursor-pointer transition-all duration-700 ${className}`}
      style={baseStyle}
      onClick={onClick}
    >
      {/* Layer 1 – distorted backdrop blur */}
      <div
        className="absolute inset-0 z-0 overflow-hidden rounded-[inherit]"
        style={{
          backdropFilter: `blur(${blurStrength}px)`,
          WebkitBackdropFilter: `blur(${blurStrength}px)`,
          filter: "url(#glass-distortion)",
          isolation: "isolate",
        }}
      />
      {/* Layer 2 – tinted fill */}
      <div
        className="absolute inset-0 z-10 rounded-[inherit]"
        style={{ background: TINT[variant] }}
      />
      {/* Layer 3 – inner highlight (edge refraction) */}
      <div
        className="absolute inset-0 z-20 rounded-[inherit] overflow-hidden"
        style={{ boxShadow: HIGHLIGHT[variant] }}
      />
      {/* Layer 4 – content */}
      <div className="relative z-30 w-full">{children}</div>
    </div>
  );

  return href ? (
    <a href={href} target={target} rel="noopener noreferrer" className="block">
      {content}
    </a>
  ) : (
    content
  );
};

// ─── Pill / Badge ─────────────────────────────────────────────────────────────
export const GlassPill: React.FC<{
  children: React.ReactNode;
  className?: string;
  variant?: GlassVariant;
}> = ({ children, className = "", variant = "dark" }) => (
  <GlassEffect
    variant={variant}
    blurStrength={16}
    className={`rounded-full px-4 py-2 ${className}`}
  >
    {children}
  </GlassEffect>
);

// ─── Button ───────────────────────────────────────────────────────────────────
export const GlassButton: React.FC<{
  children: React.ReactNode;
  href?: string;
  target?: string;
  onClick?: () => void;
  className?: string;
  variant?: GlassVariant;
}> = ({ children, href, target, onClick, className = "", variant = "blue" }) => (
  <GlassEffect
    href={href}
    target={target}
    onClick={onClick}
    variant={variant}
    blurStrength={14}
    className={`rounded-2xl px-8 py-4 hover:scale-[1.03] active:scale-[0.97] ${className}`}
    style={{ transitionTimingFunction: SPRING }}
  >
    {children}
  </GlassEffect>
);

// ─── Card ─────────────────────────────────────────────────────────────────────
export const GlassCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  variant?: GlassVariant;
  hover?: boolean;
}> = ({ children, className = "", variant = "dark", hover = true }) => (
  <GlassEffect
    variant={variant}
    blurStrength={20}
    className={`rounded-2xl ${hover ? "hover:scale-[1.02] hover:-translate-y-1" : ""} ${className}`}
  >
    {children}
  </GlassEffect>
);

// ─── Stat chip ────────────────────────────────────────────────────────────────
export const GlassStatChip: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <GlassEffect
    variant="dark"
    blurStrength={18}
    className={`rounded-2xl p-4 text-center hover:scale-105 ${className}`}
  >
    {children}
  </GlassEffect>
);

// ─── Nav bar wrapper ──────────────────────────────────────────────────────────
export const GlassNav: React.FC<{
  children: React.ReactNode;
  className?: string;
  scrolled: boolean;
}> = ({ children, className = "", scrolled }) => (
  <GlassEffect
    variant="dark"
    blurStrength={scrolled ? 24 : 14}
    className={`w-full ${className}`}
    style={{
      boxShadow: scrolled
        ? "0 8px 32px rgba(14,165,233,0.15), 0 2px 8px rgba(0,0,0,0.3)"
        : "none",
      transition: "box-shadow 0.5s ease",
    }}
  >
    {children}
  </GlassEffect>
);

// ─── Search widget wrapper ────────────────────────────────────────────────────
export const GlassSearchWidget: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <GlassEffect
    variant="dark"
    blurStrength={30}
    className="rounded-[20px] p-6 md:p-8 w-full"
    style={{
      boxShadow:
        "0 25px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06), 0 0 0 1px rgba(14,165,233,0.25)",
    }}
  >
    {children}
  </GlassEffect>
);

// ─── Modal wrapper ────────────────────────────────────────────────────────────
export const GlassModal: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <GlassEffect
    variant="dark"
    blurStrength={28}
    className={`rounded-2xl w-full overflow-y-auto ${className}`}
    style={{
      boxShadow:
        "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(14,165,233,0.2), inset 0 1px 0 rgba(255,255,255,0.06)",
    }}
  >
    {children}
  </GlassEffect>
);
