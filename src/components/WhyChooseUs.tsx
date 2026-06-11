"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { ScrollReveal, StaggerContainer, StaggerItem, ParallaxLayer } from "./ScrollReveal";
import { GlassCard, GlassEffect } from "./LiquidGlass";
import {
  Users, Headphones, TrendingDown, MessageSquare, Plane, Globe,
  Shield, Clock, Star, Award
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Expert Travel Consultants",
    desc: "Dedicated travel professionals with 10+ years of experience ready to craft your perfect journey.",
    color: "#2563EB",
    stat: "500+",
    statLabel: "Expert Consultants",
  },
  {
    icon: Headphones,
    title: "Personalized Booking Assistance",
    desc: "One-on-one support from inquiry to boarding. We handle every detail so you can focus on your trip.",
    color: "#00D9FF",
    stat: "24/7",
    statLabel: "Support Available",
  },
  {
    icon: TrendingDown,
    title: "Competitive Airfares",
    desc: "Access exclusive deals and unpublished fares negotiated directly with major airlines worldwide.",
    color: "#34D399",
    stat: "60%",
    statLabel: "Avg. Savings",
  },
  {
    icon: MessageSquare,
    title: "Fast WhatsApp Support",
    desc: "Get instant responses via WhatsApp. Your travel consultant is just a message away — always.",
    color: "#25D366",
    stat: "<5min",
    statLabel: "Response Time",
  },
  {
    icon: Plane,
    title: "Multi-Airline Options",
    desc: "Compare 500+ airlines worldwide to find the perfect combination of price, time, and comfort.",
    color: "#A78BFA",
    stat: "500+",
    statLabel: "Airlines",
  },
  {
    icon: Globe,
    title: "Worldwide Destinations",
    desc: "From New York to Tokyo, Dubai to Paris — we book flights to every destination on the globe.",
    color: "#FBBF24",
    stat: "195+",
    statLabel: "Countries",
  },
];

const stats = [
  { value: 2800000, label: "Tickets Sold", suffix: "+" },
  { value: 98, label: "Customer Satisfaction", suffix: "%" },
  { value: 195, label: "Countries Served", suffix: "+" },
  { value: 15, label: "Years of Excellence", suffix: "+" },
];

function AnimatedNumber({ target, suffix }: { target: number; suffix: string }) {
  const [current, setCurrent] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setCurrent(Math.min(Math.round(increment * step), target));
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  const format = (n: number) => n >= 1000000 ? `${(n / 1000000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(0)}K` : String(n);

  return <div ref={ref}>{format(current)}{suffix}</div>;
}

export default function WhyChooseUs() {
  return (
    <section id="about" className="py-20 relative overflow-hidden">
      {/* Parallax decorative blobs */}
      <ParallaxLayer strength={50} className="absolute top-0 left-1/4 pointer-events-none">
        <div className="w-96 h-96 rounded-full bg-[#2563EB]/5 blur-[100px]" />
      </ParallaxLayer>
      <ParallaxLayer strength={-40} className="absolute bottom-0 right-1/4 pointer-events-none">
        <div className="w-80 h-80 rounded-full bg-[#00D9FF]/5 blur-[80px]" />
      </ParallaxLayer>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <ScrollReveal direction="up" className="text-center mb-16">
          <GlassEffect variant="dark" blurStrength={16} className="rounded-full px-4 py-2 inline-flex mb-4">
            <span className="flex items-center gap-2 text-[#00D9FF] text-sm font-medium">
              <Award className="w-4 h-4" />
              Why Choose Us
            </span>
          </GlassEffect>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Your Trusted{" "}
            <span className="gradient-text">Travel Partner</span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            We combine cutting-edge technology with human expertise to deliver an unparalleled flight booking experience
          </p>
        </ScrollReveal>

        {/* Stats banner */}
        <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {stats.map((stat) => (
            <StaggerItem key={stat.label} direction="scale">
              <GlassCard hover={false} className="p-6 text-center">
                <div className="text-3xl sm:text-4xl font-black gradient-text glow-text mb-1">
                  <AnimatedNumber target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-white/50 text-sm">{stat.label}</div>
              </GlassCard>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Feature grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => (
            <StaggerItem key={feat.title} direction="up">
            <GlassCard hover={true} className="p-6 group h-full">
              {/* Icon */}
              <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: `${feat.color}15`, border: `1px solid ${feat.color}30` }}>
                <feat.icon className="w-7 h-7" style={{ color: feat.color }} />
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ boxShadow: `0 0 20px ${feat.color}40` }} />
              </div>

              {/* Content */}
              <h3 className="text-white text-lg font-bold mb-2 group-hover:text-[#00D9FF] transition-colors">
                {feat.title}
              </h3>
              <p className="text-white/50 text-sm leading-relaxed mb-4">
                {feat.desc}
              </p>

              {/* Stat */}
              <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                <span className="text-2xl font-black" style={{ color: feat.color }}>{feat.stat}</span>
                <span className="text-white/40 text-xs">{feat.statLabel}</span>
              </div>
            </GlassCard>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Trust badges */}
        <StaggerContainer className="mt-16 flex flex-wrap items-center justify-center gap-6" staggerDelay={0.1}>
          {[
            { icon: Shield, label: "Secure Booking", color: "#34D399" },
            { icon: Star, label: "5-Star Rated", color: "#FBBF24" },
            { icon: Clock, label: "Instant Quotes", color: "#2563EB" },
            { icon: Plane, label: "500+ Airlines", color: "#A78BFA" },
          ].map((badge) => (
            <StaggerItem key={badge.label} direction="scale">
              <GlassEffect
                variant="dark"
                blurStrength={14}
                className="rounded-xl px-5 py-3 hover:scale-105 hover:-translate-y-0.5"
              >
                <span className="flex items-center gap-2">
                  <badge.icon className="w-4 h-4" style={{ color: badge.color }} />
                  <span className="text-white/80 text-sm font-medium">{badge.label}</span>
                </span>
              </GlassEffect>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
