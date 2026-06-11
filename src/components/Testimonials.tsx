"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";
import { GlassCard, GlassEffect } from "./LiquidGlass";
import type { WPTestimonial } from "@/lib/wordpress";
import { FALLBACK_TESTIMONIALS } from "@/lib/wordpress";

interface Props { testimonials?: WPTestimonial[] }

export default function Testimonials({ testimonials = FALLBACK_TESTIMONIALS }: Props) {
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const visibleCount = 3;
  const maxIndex = testimonials.length - visibleCount;

  useEffect(() => {
    if (!autoPlay) return;
    timerRef.current = setInterval(() => {
      setCurrent(c => (c >= maxIndex ? 0 : c + 1));
    }, 5000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [autoPlay, maxIndex]);

  const prev = () => {
    setAutoPlay(false);
    setCurrent(c => Math.max(0, c - 1));
  };

  const next = () => {
    setAutoPlay(false);
    setCurrent(c => Math.min(maxIndex, c + 1));
  };

  const visible = testimonials.slice(current, current + visibleCount);

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050f1a]/80 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-[#2563EB]/3 blur-[100px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal direction="up" className="text-center mb-14">
          <GlassEffect variant="dark" blurStrength={16} className="rounded-full px-4 py-2 inline-flex mb-4">
            <span className="flex items-center gap-2 text-[#00D9FF] text-sm font-medium">
              <Star className="w-4 h-4 fill-[#FBBF24] text-[#FBBF24]" />
              Customer Reviews
            </span>
          </GlassEffect>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Trusted by{" "}
            <span className="gradient-text">Thousands</span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Join over 2.8 million happy travelers who've saved big with FlightBooking.bitsolmarketing.com
          </p>

          {/* Overall rating */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="flex gap-1">
              {[1,2,3,4,5].map(s => (
                <Star key={s} className="w-6 h-6 fill-[#FBBF24] text-[#FBBF24]" style={{ filter: "drop-shadow(0 0 6px rgba(251,191,36,0.6))" }} />
              ))}
            </div>
            <span className="text-white text-2xl font-black">4.9</span>
            <span className="text-white/40">/</span>
            <span className="text-white/40">5.0</span>
            <span className="text-white/40 text-sm">from 18,400+ reviews</span>
          </div>
        </ScrollReveal>

        {/* Cards */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 overflow-hidden">
            <AnimatePresence mode="wait">
              {visible.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ delay: i * 0.07 }}
                >
                <GlassCard hover={false} className="p-6 flex flex-col">
                  {/* Quote icon */}
                  <Quote className="w-8 h-8 mb-4 opacity-30" style={{ color: t.color }} />

                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-[#FBBF24] text-[#FBBF24]" />
                    ))}
                  </div>

                  {/* Review */}
                  <p className="text-white/70 text-sm leading-relaxed flex-1 mb-5 italic">
                    "{t.review}"
                  </p>

                  {/* Route + savings */}
                  <div className="flex items-center gap-2 mb-4 text-xs">
                    <span className="px-2 py-1 rounded-lg font-bold" style={{ background: `${t.color}15`, color: t.color }}>
                      {t.route}
                    </span>
                    <span className="text-[#34D399] font-bold">Saved {t.savings}</span>
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0"
                      style={{ background: `${t.color}25`, border: `1px solid ${t.color}40` }}>
                      {t.avatar}
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">{t.name}</div>
                      <div className="text-white/40 text-xs">{t.location}</div>
                    </div>
                    <div className="ml-auto">
                      <div className="w-6 h-6 rounded-full bg-[#34D399]/20 flex items-center justify-center">
                        <svg className="w-3 h-3 text-[#34D399]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              disabled={current === 0}
              className="w-10 h-10 rounded-full glass border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-[#2563EB]/40 disabled:opacity-30 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setAutoPlay(false); setCurrent(i); }}
                  className={`rounded-full transition-all duration-300 ${
                    i === current ? "w-6 h-2 bg-[#2563EB]" : "w-2 h-2 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              disabled={current >= maxIndex}
              className="w-10 h-10 rounded-full glass border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-[#2563EB]/40 disabled:opacity-30 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
