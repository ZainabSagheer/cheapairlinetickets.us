"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FlightSearch from "@/components/FlightSearch";
import FlightResults from "@/components/FlightResults";
import PopularDestinations from "@/components/PopularDestinations";
import WhyChooseUs from "@/components/WhyChooseUs";
import AIAssistant from "@/components/AIAssistant";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import DealsStrip from "@/components/DealsStrip";
import { generateFlights, fetchFlights, Flight } from "@/lib/flights";
import type { WPDeal, WPDestination, WPTestimonial } from "@/lib/wordpress";

interface SearchState {
  flights:    Flight[];
  from:       string;
  to:         string;
  fromCity:   string;
  toCity:     string;
  departure:  string;
  passengers: number;
  cabin:      string;
}

interface HomeClientProps {
  deals:        WPDeal[];
  destinations: WPDestination[];
  testimonials: WPTestimonial[];
}

export default function HomeClient({ deals, destinations, testimonials }: HomeClientProps) {
  const [searchState, setSearchState] = useState<SearchState | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (data: {
    from:       { code: string; city: string } | null;
    to:         { code: string; city: string } | null;
    departure:  string;
    returnDate: string;
    passengers: number;
    cabin:      string;
    tripType:   string;
  }) => {
    if (!data.from || !data.to) return;
    setLoading(true);

    let flights: Flight[];
    try {
      flights = await fetchFlights(
        data.from.code, data.from.city,
        data.to.code,   data.to.city,
        data.departure, data.returnDate,
        data.passengers, data.cabin,
      );
    } catch {
      // API unavailable or quota exhausted — fall back to mock data
      flights = generateFlights(
        data.from.code, data.from.city,
        data.to.code,   data.to.city,
        data.cabin,
      );
    }

    setSearchState({
      flights,
      from:       data.from.code,
      to:         data.to.code,
      fromCity:   data.from.city,
      toCity:     data.to.city,
      departure:  data.departure,
      passengers: data.passengers,
      cabin:      data.cabin,
    });
    setLoading(false);
    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <DealsStrip deals={deals} />

      {/* Search widget */}
      <div className="relative z-20 mt-2">
        <FlightSearch onSearch={handleSearch} />
      </div>

      {/* Loading overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-dark rounded-3xl p-10 flex flex-col items-center gap-6 border border-[#0EA5E9]/20 shadow-2xl max-w-sm w-full mx-4"
            >
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 rounded-full border-2 border-[#0EA5E9]/20 animate-spin" style={{ animationDuration: "2s" }} />
                <div className="absolute inset-3 rounded-full border-2 border-[#22D3EE]/50 animate-spin" style={{ animationDuration: "1s", animationDirection: "reverse" }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl animate-bounce">✈️</span>
                </div>
              </div>

              <div className="text-center">
                <div className="text-white text-xl font-bold mb-2">Searching Flights</div>
                <div className="text-white/50 text-sm">Scanning 500+ airlines for the best fares...</div>
              </div>

              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#0EA5E9] to-[#22D3EE]"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.4, ease: "easeInOut" }}
                />
              </div>

              <div className="flex gap-2 flex-wrap justify-center">
                {["AA", "DL", "UA", "EK", "QR", "BA"].map((code, i) => (
                  <motion.div
                    key={code}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}
                    className="px-3 py-1 rounded-lg glass border border-[#0EA5E9]/20 text-[#0EA5E9] text-xs font-bold"
                  >
                    {code}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic content area */}
      <AnimatePresence mode="wait">
        {searchState ? (
          <motion.div
            key="results"
            id="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <FlightResults
              flights={searchState.flights}
              from={searchState.from}
              to={searchState.to}
              fromCity={searchState.fromCity}
              toCity={searchState.toCity}
              departure={searchState.departure}
              passengers={searchState.passengers}
              cabin={searchState.cabin}
              onClose={() => setSearchState(null)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="home-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <PopularDestinations destinations={destinations} />
            <WhyChooseUs />
            <AIAssistant />
            <Testimonials testimonials={testimonials} />
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}
