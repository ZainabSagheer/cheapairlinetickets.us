"use client";

import { motion } from "framer-motion";
import { Zap, Plane } from "lucide-react";
import type { WPDeal } from "@/lib/wordpress";
import { FALLBACK_DEALS } from "@/lib/wordpress";

interface Props { deals?: WPDeal[] }

export default function DealsStrip({ deals = FALLBACK_DEALS }: Props) {
  return (
    <div id="deals" className="relative overflow-hidden py-3 border-y border-[#0EA5E9]/15"
      style={{ background: "rgba(14,165,233,0.04)" }}>
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#071B2E] to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#071B2E] to-transparent z-10" />

      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{ x: [0, -2400] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {[...deals, ...deals, ...deals].map((deal, i) => (
          <a
            key={i}
            href="#search"
            className="flex items-center gap-2 px-4 py-1.5 rounded-full group hover:bg-[#0EA5E9]/10 transition-colors"
          >
            <Zap className="w-3 h-3 text-[#FBBF24]" />
            <span className="text-white/70 text-sm group-hover:text-white transition-colors">
              {deal.route}
            </span>
            <span className="text-[#22D3EE] font-black text-sm">{deal.price}</span>
            <span className="text-white/30 text-xs">on {deal.airline}</span>
            <Plane className="w-3 h-3 text-[#0EA5E9]/40 rotate-45" />
          </a>
        ))}
      </motion.div>
    </div>
  );
}
