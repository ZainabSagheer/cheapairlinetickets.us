"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, type MotionValue } from "framer-motion";
import { Plane, Zap, Globe, TrendingDown } from "lucide-react";
import { GlassEffect, GlassButton, GlassStatChip } from "./LiquidGlass";

interface Particle { id: number; x: number; y: number; size: number; duration: number; delay: number; }

function ParticleItem({ p, scrollY }: { p: Particle; scrollY: MotionValue<number> }) {
  const y = useTransform(scrollY, [0, 600], [0, -(p.size * 12)]);
  return (
    <motion.div
      className="absolute rounded-full bg-[#0EA5E9]"
      style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, opacity: 0.3, y }}
      animate={{ y: [0, -30, 0], opacity: [0.2, 0.6, 0.2] }}
      transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

const FLIGHT_ROUTES = [
  { x1: "15%", y1: "40%", x2: "85%", y2: "30%", delay: 0 },
  { x1: "20%", y1: "65%", x2: "75%", y2: "20%", delay: 1.5 },
  { x1: "10%", y1: "50%", x2: "90%", y2: "55%", delay: 3 },
];

const LIVE_STATS = [
  { label: "Flights Tracked", value: "12,847", icon: Plane, color: "#0EA5E9" },
  { label: "Active Routes", value: "4,230+", icon: Globe, color: "#22D3EE" },
  { label: "Avg. Savings", value: "Up to 60%", icon: TrendingDown, color: "#34D399" },
];

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeRoute, setActiveRoute] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 8 + 4,
        delay: Math.random() * 4,
      }))
    );
  }, []);

  // Scroll-based parallax values scoped to this section
  const { scrollY } = useScroll();

  const rawBadgeY    = useTransform(scrollY, [0, 600], [0, -40]);
  const rawHeadlineY = useTransform(scrollY, [0, 600], [0, -80]);
  const rawSubY      = useTransform(scrollY, [0, 600], [0, -60]);
  const rawCtaY      = useTransform(scrollY, [0, 600], [0, -50]);
  const rawStatsY    = useTransform(scrollY, [0, 600], [0, -30]);
  const rawPlaneX    = useTransform(scrollY, [0, 600], [0, 60]);
  const rawGlobeX    = useTransform(scrollY, [0, 600], [0, -50]);
  const rawOpacity   = useTransform(scrollY, [0, 500], [1, 0]);
  const rawCanvasY   = useTransform(scrollY, [0, 600], [0, -50]);

  // Smooth out the transforms
  const badgeY    = useSpring(rawBadgeY,    { stiffness: 80, damping: 20 });
  const headlineY = useSpring(rawHeadlineY, { stiffness: 80, damping: 20 });
  const subY      = useSpring(rawSubY,      { stiffness: 80, damping: 20 });
  const ctaY      = useSpring(rawCtaY,      { stiffness: 80, damping: 20 });
  const statsY    = useSpring(rawStatsY,    { stiffness: 80, damping: 20 });
  const planeX    = useSpring(rawPlaneX,    { stiffness: 60, damping: 18 });
  const globeX    = useSpring(rawGlobeX,    { stiffness: 60, damping: 18 });
  const canvasY   = useSpring(rawCanvasY,   { stiffness: 60, damping: 18 });

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveRoute(r => (r + 1) % 3);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrame: number;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const dots = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.005;

      dots.forEach((dot, i) => {
        dots.slice(i + 1).forEach((other) => {
          const dx = dot.x - other.x;
          const dy = dot.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(dot.x, dot.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(14,165,233,${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      dots.forEach((dot) => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(14,165,233,0.6)";
        ctx.fill();
        dot.x += dot.vx;
        dot.y += dot.vy;
        if (dot.x < 0 || dot.x > canvas.width) dot.vx *= -1;
        if (dot.y < 0 || dot.y > canvas.height) dot.vy *= -1;
      });

      FLIGHT_ROUTES.forEach((route, idx) => {
        if (idx !== activeRoute) return;
        const x1 = (parseFloat(route.x1) / 100) * canvas.width;
        const y1 = (parseFloat(route.y1) / 100) * canvas.height;
        const x2 = (parseFloat(route.x2) / 100) * canvas.width;
        const y2 = (parseFloat(route.y2) / 100) * canvas.height;
        const cpx = (x1 + x2) / 2;
        const cpy = Math.min(y1, y2) - 80;

        const grad = ctx.createLinearGradient(x1, y1, x2, y2);
        grad.addColorStop(0, "rgba(14,165,233,0)");
        grad.addColorStop(0.5, "rgba(34,211,238,0.8)");
        grad.addColorStop(1, "rgba(14,165,233,0)");

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(cpx, cpy, x2, y2);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        const progress = (t * 0.5) % 1;
        const bx = (1 - progress) ** 2 * x1 + 2 * (1 - progress) * progress * cpx + progress ** 2 * x2;
        const by = (1 - progress) ** 2 * y1 + 2 * (1 - progress) * progress * cpy + progress ** 2 * y2;

        ctx.beginPath();
        ctx.arc(bx, by, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#22D3EE";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(bx, by, 8, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(34,211,238,0.3)";
        ctx.fill();
      });

      animFrame = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", resize);
    };
  }, [activeRoute]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[92vh] flex flex-col justify-center overflow-hidden"
    >
      {/* Static overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />
      <div className="absolute inset-0 grid-overlay opacity-20" />

      {/* Parallax canvas layer */}
      <motion.canvas
        ref={canvasRef}
        style={{ y: canvasY }}
        className="absolute inset-0 w-full h-full opacity-70"
      />

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#0EA5E9]/5 blur-[120px] pointer-events-none" />

      {/* Floating particles — generated client-side only to avoid hydration mismatch */}
      {particles.map((p) => (
        <ParticleItem key={p.id} p={p} scrollY={scrollY} />
      ))}

      {/* Floating plane — drifts right on scroll */}
      <motion.div
        className="absolute right-10 top-1/4 hidden xl:block"
        style={{ x: planeX, opacity: rawOpacity }}
        animate={{ y: [0, -20, 0], rotate: [0, 3, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#0EA5E9]/20 to-[#22D3EE]/10 flex items-center justify-center glow-blue">
            <Plane className="w-16 h-16 text-[#22D3EE] rotate-45" />
          </div>
          <div className="absolute inset-0 rounded-full bg-[#0EA5E9]/10 blur-xl animate-pulse-glow" />
        </div>
      </motion.div>

      {/* Floating globe — drifts left on scroll */}
      <motion.div
        className="absolute left-8 bottom-1/3 hidden xl:block"
        style={{ x: globeX, opacity: rawOpacity }}
        animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-20 h-20 rounded-full border border-[#0EA5E9]/30 flex items-center justify-center glass">
          <Globe className="w-10 h-10 text-[#0EA5E9]/70" />
        </div>
      </motion.div>

      {/* ── Main content — each layer has its own scroll parallax speed ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">

        {/* Badge */}
        <motion.div
          style={{ y: badgeY, opacity: rawOpacity }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <GlassEffect variant="dark" blurStrength={16} className="rounded-full px-4 py-2 inline-flex">
            <span className="flex items-center gap-2 text-[#22D3EE] text-sm font-medium">
              <Zap className="w-4 h-4" />
              AI-Powered Travel Platform
              <span className="w-2 h-2 rounded-full bg-[#22D3EE] animate-pulse" />
            </span>
          </GlassEffect>
        </motion.div>

        {/* Headline — fastest drift = strongest parallax depth */}
        <motion.h1
          style={{ y: headlineY }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] tracking-tight mb-6"
        >
          Find{" "}
          <span className="gradient-text glow-text">Cheap Flights</span>
          <br />
          <span className="text-white/90">Worldwide</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          style={{ y: subY }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Compare routes, explore destinations, and request your booking with our
          <span className="text-[#22D3EE]"> expert travel consultants</span>. Save up to 60% on airfares.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          style={{ y: ctaY }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <GlassButton href="#search" target="_self" variant="blue">
            <span className="flex items-center gap-3 text-white font-bold text-lg">
              <Plane className="w-5 h-5" />
              Search Flights
            </span>
          </GlassButton>

          <GlassEffect
            href="https://wa.me/1234567890?text=Hello%20CheapAirlineTickets.us%2C%20I%20would%20like%20a%20flight%20quote."
            variant="dark"
            blurStrength={14}
            className="rounded-2xl px-8 py-4 hover:scale-[1.03] active:scale-[0.97]"
            style={{ background: "rgba(37,211,102,0.2)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15), 0 6px 20px rgba(37,211,102,0.3)" }}
          >
            <span className="flex items-center gap-3 text-white font-bold text-lg">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat on WhatsApp
            </span>
          </GlassEffect>
        </motion.div>

        {/* Live Stats */}
        <motion.div
          style={{ y: statsY }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="grid grid-cols-3 gap-4 max-w-2xl mx-auto"
        >
          {LIVE_STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
            >
              <GlassStatChip>
                <stat.icon className="w-5 h-5 mx-auto mb-2" style={{ color: stat.color }} />
                <div className="text-xl sm:text-2xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-xs text-white/50">{stat.label}</div>
              </GlassStatChip>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll indicator — fades out as user scrolls */}
        <motion.div
          style={{ opacity: rawOpacity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex flex-col items-center gap-2 text-white/30">
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1">
              <div className="w-1 h-2 rounded-full bg-[#0EA5E9] animate-bounce" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
