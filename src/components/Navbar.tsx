"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, Phone, Menu, X } from "lucide-react";
import Link from "next/link";
import { GlassEffect } from "./LiquidGlass";

const WA_ICON = (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Flights", href: "#search" },
    { label: "Destinations", href: "#destinations" },
    { label: "Deals", href: "#deals" },
    { label: "About", href: "#about" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        {/* Liquid glass nav bar */}
        <GlassEffect
          variant="dark"
          blurStrength={scrolled ? 28 : 16}
          className="w-full"
          style={{
            boxShadow: scrolled
              ? "0 8px 32px rgba(14,165,233,0.18), 0 2px 8px rgba(0,0,0,0.35), inset 0 -1px 0 rgba(14,165,233,0.2)"
              : "none",
            borderBottom: scrolled ? "1px solid rgba(14,165,233,0.15)" : "none",
            transition: "box-shadow 0.5s ease, border 0.5s ease",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 md:h-20">

              {/* Logo */}
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#0EA5E9] to-[#22D3EE] flex items-center justify-center glow-blue group-hover:scale-110 transition-transform duration-300">
                  <Plane className="w-5 h-5 text-white rotate-45" />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#0EA5E9] to-[#22D3EE] opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300" />
                </div>
                <div>
                  <div className="text-white font-bold text-lg leading-tight">
                    CheapAirline<span className="gradient-text">Tickets</span>
                  </div>
                  <div className="text-[10px] text-[#22D3EE]/70 tracking-widest uppercase font-medium">.us</div>
                </div>
              </Link>

              {/* Desktop Nav links */}
              <div className="hidden md:flex items-center gap-8">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-white/70 hover:text-[#22D3EE] text-sm font-medium transition-colors duration-200 relative group"
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#0EA5E9] to-[#22D3EE] group-hover:w-full transition-all duration-300 rounded-full" />
                  </a>
                ))}
              </div>

              {/* Right actions */}
              <div className="hidden md:flex items-center gap-3">
                {/* WhatsApp — glass green button */}
                <GlassEffect
                  href="https://wa.me/1234567890?text=Hello%20CheapAirlineTickets.us%2C%20I%20would%20like%20to%20inquire%20about%20a%20flight."
                  variant="dark"
                  blurStrength={12}
                  className="rounded-xl px-4 py-2 hover:scale-105"
                  style={{ background: "rgba(37,211,102,0.18)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15), 0 4px 12px rgba(37,211,102,0.25)" }}
                >
                  <span className="flex items-center gap-2 text-white text-sm font-semibold">
                    {WA_ICON} WhatsApp
                  </span>
                </GlassEffect>

                {/* Call Now — glass blue button */}
                <GlassEffect
                  href="tel:+18005551234"
                  variant="blue"
                  blurStrength={12}
                  className="rounded-xl px-4 py-2 hover:scale-105"
                >
                  <span className="flex items-center gap-2 text-[#22D3EE] text-sm font-semibold">
                    <Phone className="w-4 h-4" /> Call Now
                  </span>
                </GlassEffect>
              </div>

              {/* Mobile menu toggle */}
              <button
                className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </GlassEffect>

        {/* Mobile Menu — liquid glass panel */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <GlassEffect
                variant="dark"
                blurStrength={28}
                className="w-full"
                style={{ borderTop: "1px solid rgba(14,165,233,0.15)" }}
              >
                <div className="px-4 py-4 space-y-2">
                  {navLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="block px-4 py-3 text-white/80 hover:text-white hover:bg-[#0EA5E9]/10 rounded-xl transition-all duration-200"
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.label}
                    </a>
                  ))}
                  <div className="pt-2 flex flex-col gap-2">
                    <a
                      href="https://wa.me/1234567890"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white btn-whatsapp"
                    >
                      {WA_ICON} WhatsApp
                    </a>
                    <a
                      href="tel:+18005551234"
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-[#0EA5E9] border border-[#0EA5E9]/30"
                    >
                      <Phone className="w-4 h-4" /> Call Now
                    </a>
                  </div>
                </div>
              </GlassEffect>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <div className="h-16 md:h-20" />
    </>
  );
}
