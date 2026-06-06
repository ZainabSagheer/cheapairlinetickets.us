"use client";

import { motion } from "framer-motion";
import { Plane, Phone, Mail, MapPin, ExternalLink } from "lucide-react";
import { GlassEffect } from "./LiquidGlass";

const popularRoutes = [
  "New York → Los Angeles",
  "Chicago → Miami",
  "Dallas → New York",
  "Los Angeles → Las Vegas",
  "Miami → Orlando",
  "New York → London",
  "Los Angeles → Tokyo",
  "Chicago → Cancún",
];

const flightDeals = [
  "Cheap Flights to New York",
  "Discount Flights to Miami",
  "Budget Flights to Las Vegas",
  "Cheap International Flights",
  "Last Minute Flight Deals",
  "Business Class Deals",
  "First Class Discounts",
  "Weekend Getaway Flights",
];

const travelInfo = [
  "TSA Security Guidelines",
  "Baggage Allowance Guide",
  "Flight Change Policies",
  "Travel Insurance Tips",
  "Airport Lounge Access",
  "Frequent Flyer Programs",
  "Visa Requirements",
  "Travel Advisories",
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative pt-16 pb-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#030d18]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0EA5E9]/40 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CTA banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <GlassEffect
            variant="blue"
            blurStrength={24}
            className="rounded-2xl p-8 md:p-12 text-center"
            style={{ boxShadow: "0 0 0 1px rgba(14,165,233,0.3), 0 20px 60px rgba(14,165,233,0.15)" }}
          >
          <div className="absolute inset-0 grid-overlay opacity-10 rounded-2xl" />
          <div className="relative">
            <h3 className="text-3xl md:text-4xl font-black text-white mb-3">
              Ready to Fly?{" "}
              <span className="gradient-text">Let's Find Your Deal</span>
            </h3>
            <p className="text-white/60 mb-6 max-w-lg mx-auto">
              Connect with our travel experts via WhatsApp and get a personalized quote in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://wa.me/1234567890?text=Hello%20CheapAirlineTickets.us%2C%20I%20would%20like%20a%20flight%20quote."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white font-bold btn-whatsapp"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat on WhatsApp
              </a>
              <a
                href="#search"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white font-bold btn-primary"
              >
                <Plane className="w-5 h-5 rotate-45" />
                Search Flights
              </a>
            </div>
          </div>
          </GlassEffect>
        </motion.div>

        {/* Main footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0EA5E9] to-[#22D3EE] flex items-center justify-center">
                <Plane className="w-5 h-5 text-white rotate-45" />
              </div>
              <div>
                <div className="text-white font-bold text-lg">
                  CheapAirline<span className="gradient-text">Tickets</span><span className="text-[#22D3EE]/70">.us</span>
                </div>
              </div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-xs">
              Your trusted travel partner for finding the best airline deals. We combine AI-powered search with human expertise to save you money on every flight.
            </p>

            {/* Contact */}
            <div className="space-y-3">
              <a href="tel:+18005551234" className="flex items-center gap-3 text-white/60 hover:text-[#22D3EE] transition-colors text-sm group">
                <div className="w-8 h-8 rounded-lg glass flex items-center justify-center group-hover:bg-[#0EA5E9]/20 transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                1-800-555-1234
              </a>
              <a href="mailto:support@cheapairlinetickets.us" className="flex items-center gap-3 text-white/60 hover:text-[#22D3EE] transition-colors text-sm group">
                <div className="w-8 h-8 rounded-lg glass flex items-center justify-center group-hover:bg-[#0EA5E9]/20 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                support@cheapairlinetickets.us
              </a>
              <div className="flex items-center gap-3 text-white/60 text-sm">
                <div className="w-8 h-8 rounded-lg glass flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                New York, NY, USA
              </div>
            </div>
          </div>

          {/* Popular routes */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Popular Routes</h4>
            <ul className="space-y-2">
              {popularRoutes.map(route => (
                <li key={route}>
                  <a href="#search" className="text-white/50 hover:text-[#22D3EE] transition-colors text-sm flex items-center gap-1 group">
                    <span className="group-hover:translate-x-1 transition-transform">{route}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Flight deals */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Flight Deals</h4>
            <ul className="space-y-2">
              {flightDeals.map(deal => (
                <li key={deal}>
                  <a href="#search" className="text-white/50 hover:text-[#22D3EE] transition-colors text-sm flex items-center gap-1 group">
                    <span className="group-hover:translate-x-1 transition-transform">{deal}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Travel info */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Travel Info</h4>
            <ul className="space-y-2">
              {travelInfo.map(info => (
                <li key={info}>
                  <a href="#" className="text-white/50 hover:text-[#22D3EE] transition-colors text-sm flex items-center gap-1 group">
                    <span className="group-hover:translate-x-1 transition-transform">{info}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* SEO text block */}
        <div className="glass rounded-xl p-5 mb-10 text-center">
          <p className="text-white/30 text-xs leading-relaxed max-w-4xl mx-auto">
            <strong className="text-white/50">CheapAirlineTickets.us</strong> — Find cheap airline tickets, discount flights, and affordable airfare to destinations worldwide.
            Compare USA flight tickets, international flights, domestic flights, and last-minute deals. Our travel experts help you secure the lowest fares on all major airlines including
            American Airlines, Delta, United, Southwest, JetBlue, Emirates, Qatar Airways, British Airways, Lufthansa, and more.
            Search flights from New York, Los Angeles, Chicago, Miami, Dallas, Las Vegas, Orlando, and San Francisco to any destination globally.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-white/30 text-xs text-center md:text-left">
            © {currentYear} CheapAirlineTickets.us — All rights reserved.
            Prices shown are estimated fares and subject to availability.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {["Privacy Policy", "Terms & Conditions", "Cookie Policy", "Sitemap"].map(link => (
              <a key={link} href="#" className="text-white/30 hover:text-white/60 text-xs transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
