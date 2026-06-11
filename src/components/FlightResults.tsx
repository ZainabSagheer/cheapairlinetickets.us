"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, ArrowRight, Zap, X } from "lucide-react";
import { Flight } from "@/lib/flights";
import BookingModal from "./BookingModal";
import { GlassEffect } from "./LiquidGlass";
import { FlightCard } from "./FlightCard";

interface FlightResultsProps {
  flights: Flight[];
  from: string;
  to: string;
  fromCity: string;
  toCity: string;
  departure: string;
  passengers: number;
  cabin: string;
  onClose: () => void;
}

// Rotating set of aviation images for the FlightCard header
const FLIGHT_IMAGES = [
  "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80",
  "https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=600&q=80",
  "https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=600&q=80",
  "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=600&q=80",
  "https://images.unsplash.com/photo-1542296332-2e4473faf563?w=600&q=80",
  "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=80",
];

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function FlightResults({
  flights, from, to, fromCity, toCity, departure, passengers, cabin, onClose,
}: FlightResultsProps) {
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [sortBy, setSortBy] = useState<"price" | "duration" | "departure">("price");
  const [filterStops, setFilterStops] = useState<number | null>(null);

  const sorted = [...flights]
    .filter(f => filterStops === null || f.stops === filterStops)
    .sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "duration") return a.duration.localeCompare(b.duration);
      return a.departure.localeCompare(b.departure);
    });

  const cheapest = Math.min(...flights.map(f => f.price));

  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-white text-2xl font-bold">{fromCity}</span>
              <div className="flex items-center gap-2 text-[#00D9FF]">
                <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#00D9FF] to-transparent" />
                <Plane className="w-5 h-5 rotate-45" />
                <div className="w-16 h-px bg-gradient-to-r from-[#00D9FF] via-[#00D9FF] to-transparent" />
              </div>
              <span className="text-white text-2xl font-bold">{toCity}</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-white/50 text-sm">
              <span>{formatDate(departure)}</span>
              <span>•</span>
              <span>{passengers} Passenger{passengers > 1 ? "s" : ""}</span>
              <span>•</span>
              <span className="capitalize">{cabin}</span>
              <span>•</span>
              <span className="text-[#00D9FF]">{sorted.length} flights found</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-all text-sm"
          >
            <X className="w-4 h-4" />
            New Search
          </button>
        </motion.div>

        {/* Filter + Sort bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap items-center gap-3 mb-8"
        >
          <GlassEffect variant="dark" blurStrength={14} className="rounded-xl p-1">
            {(["price", "duration", "departure"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  sortBy === s ? "bg-[#2563EB] text-white" : "text-white/50 hover:text-white"
                }`}
              >
                {s === "price" ? "Lowest Price" : s === "duration" ? "Fastest" : "Earliest"}
              </button>
            ))}
          </GlassEffect>

          <div className="flex items-center gap-2">
            <span className="text-white/40 text-xs">Stops:</span>
            {([null, 0, 1] as const).map((stop) => (
              <button
                key={String(stop)}
                onClick={() => setFilterStops(filterStops === stop ? null : stop)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterStops === stop
                    ? "bg-[#2563EB]/30 border border-[#2563EB] text-[#00D9FF]"
                    : "glass text-white/50 hover:text-white"
                }`}
              >
                {stop === null ? "Any" : stop === 0 ? "Nonstop" : "1 Stop"}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Flight cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((flight, i) => (
            <motion.div
              key={flight.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="flex flex-col"
            >
              {/* Tag badge */}
              {flight.tag && (
                <div className={`self-start mb-2 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                  flight.tag === "Best Value"  ? "bg-[#00D9FF]/20 text-[#00D9FF]" :
                  flight.tag === "Fastest"     ? "bg-[#34D399]/20 text-[#34D399]" :
                  flight.tag === "Lowest Fare" ? "bg-[#F59E0B]/20 text-[#F59E0B]" :
                                                 "bg-[#2563EB]/20 text-[#2563EB]"
                }`}>
                  {flight.tag === "Lowest Fare" && <Zap className="w-3 h-3" />}
                  {flight.tag}
                </div>
              )}

              {/* FlightCard */}
              <FlightCard
                imageUrl={FLIGHT_IMAGES[i % FLIGHT_IMAGES.length]}
                airline={flight.airline}
                flightCode={flight.flightNumber}
                flightClass={capitalize(flight.cabin)}
                departureCode={flight.from}
                departureCity={flight.fromCity}
                departureTime={flight.departure}
                arrivalCode={flight.to}
                arrivalCity={flight.toCity}
                arrivalTime={flight.arrival}
                duration={flight.duration}
                className="max-w-full"
              />

              {/* Price + CTA strip */}
              <div className="mt-3 flex items-center justify-between gap-3 px-1">
                <div>
                  <div className="text-white text-2xl font-black">
                    ${flight.price.toLocaleString()}
                  </div>
                  <div className="text-white/40 text-[11px]">
                    {flight.price === cheapest && (
                      <span className="text-[#34D399] font-semibold mr-1">Cheapest</span>
                    )}
                    incl. taxes · {flight.seatsLeft} seats left
                  </div>
                </div>

                <GlassEffect
                  variant="blue"
                  blurStrength={12}
                  className="rounded-xl px-5 py-2.5 hover:scale-105 active:scale-95 shrink-0"
                  onClick={() => setSelectedFlight(flight)}
                >
                  <span className="flex items-center gap-1.5 text-white font-bold text-sm whitespace-nowrap">
                    Request Booking
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </GlassEffect>
              </div>
            </motion.div>
          ))}
        </div>

        {sorted.length === 0 && (
          <div className="text-center py-16 text-white/40">
            <Plane className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No flights match your filters. Try adjusting them.</p>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {selectedFlight && (
          <BookingModal
            flight={selectedFlight}
            passengers={passengers}
            departure={departure}
            onClose={() => setSelectedFlight(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
