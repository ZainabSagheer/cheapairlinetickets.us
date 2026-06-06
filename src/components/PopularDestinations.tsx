"use client";

import { motion } from "framer-motion";
import { MapPin, ArrowRight, Plane } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "./ScrollReveal";
import { GlassEffect } from "./LiquidGlass";
import type { WPDestination } from "@/lib/wordpress";
import { FALLBACK_DESTINATIONS } from "@/lib/wordpress";

interface Props { destinations?: WPDestination[] }

export default function PopularDestinations({ destinations = FALLBACK_DESTINATIONS }: Props) {
  return (
    <section id="destinations" className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050f1a]/50 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <ScrollReveal direction="up" className="text-center mb-14">
          <GlassEffect variant="dark" blurStrength={16} className="rounded-full px-4 py-2 inline-flex mb-4">
            <span className="flex items-center gap-2 text-[#22D3EE] text-sm font-medium">
              <MapPin className="w-4 h-4" />
              Popular Destinations
            </span>
          </GlassEffect>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Explore Top{" "}
            <span className="gradient-text">US Destinations</span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            From coast to coast — find incredible deals to America's most beloved cities
          </p>
        </ScrollReveal>

        {/* Destination grid */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {destinations.map((dest) => (
            <StaggerItem key={dest.code || dest.city} direction="up">
              <div
                className="group relative overflow-hidden rounded-2xl cursor-pointer"
                style={{ minHeight: 220 }}
              >
                {/* Background image */}
                <div className="absolute inset-0">
                  {dest.bg && (
                    <img
                      src={dest.bg}
                      alt={dest.city}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  )}
                  {/* Dynamic gradient via inline style — safe for runtime-fetched values */}
                  <div
                    className="absolute inset-0 opacity-80 group-hover:opacity-70 transition-opacity duration-300"
                    style={{ background: `linear-gradient(to top, ${dest.gradientFrom}, ${dest.gradientTo})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>

                {/* Glow border on hover */}
                <div
                  className="absolute inset-0 rounded-2xl border border-transparent transition-all duration-300"
                  style={{ borderColor: `${dest.accent}40` }}
                />

                {/* Content */}
                <div className="relative p-5 h-full flex flex-col justify-between" style={{ minHeight: 220 }}>
                  {/* Top: emoji + tag */}
                  <div className="flex items-start justify-between">
                    <div className="text-3xl">{dest.emoji}</div>
                    {dest.tag && (
                      <span
                        className="px-2 py-1 rounded-lg text-xs font-bold"
                        style={{ background: `${dest.accent}20`, color: dest.accent, border: `1px solid ${dest.accent}40` }}
                      >
                        {dest.tag}
                      </span>
                    )}
                  </div>

                  {/* Bottom: city info */}
                  <div>
                    <div className="flex items-end justify-between mb-3">
                      <div>
                        <h3 className="text-white text-xl font-black">{dest.city}</h3>
                        <div className="flex items-center gap-1 text-white/60 text-sm">
                          <MapPin className="w-3 h-3" />
                          <span>{dest.code} • {dest.country}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white/50 text-xs">Flights from</div>
                        <div className="text-2xl font-black" style={{ color: dest.accent }}>{dest.from}</div>
                      </div>
                    </div>

                    <a
                      href="#search"
                      className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-bold transition-all duration-200"
                      style={{ background: `${dest.accent}20`, border: `1px solid ${dest.accent}40` }}
                    >
                      <Plane className="w-4 h-4 rotate-45" />
                      Explore Flights
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* View all CTA */}
        <ScrollReveal direction="up" delay={0.2} className="text-center mt-10">
          <a
            href="#search"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-bold btn-primary"
          >
            <Plane className="w-5 h-5 rotate-45" />
            Search All Destinations
            <ArrowRight className="w-4 h-4" />
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
