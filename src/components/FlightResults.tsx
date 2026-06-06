"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, Clock, ArrowRight, Users, Zap, Filter, X, ChevronDown } from "lucide-react";
import { Flight } from "@/lib/flights";
import BookingModal from "./BookingModal";
import { GlassCard, GlassEffect } from "./LiquidGlass";

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

const AIRLINE_COLORS: Record<string, string> = {
  AA: "#C0272D", DL: "#003A70", UA: "#1B4B8A", WN: "#F9B612", B6: "#003876",
  AS: "#01426A", NK: "#FFD700", F9: "#63C132", EK: "#C69C35", QR: "#5C1244",
  BA: "#075AAA", LH: "#05164D",
};

export default function FlightResults({
  flights, from, to, fromCity, toCity, departure, passengers, cabin, onClose
}: FlightResultsProps) {
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [sortBy, setSortBy] = useState<"price" | "duration" | "departure">("price");
  const [filterStops, setFilterStops] = useState<number | null>(null);
  const [showFilter, setShowFilter] = useState(false);

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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-white text-2xl font-bold">{fromCity}</span>
              <div className="flex items-center gap-2 text-[#22D3EE]">
                <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#22D3EE] to-transparent" />
                <Plane className="w-5 h-5 rotate-45" />
                <div className="w-16 h-px bg-gradient-to-r from-[#22D3EE] via-[#22D3EE] to-transparent" />
              </div>
              <span className="text-white text-2xl font-bold">{toCity}</span>
            </div>
            <div className="flex items-center gap-3 text-white/50 text-sm">
              <span>{formatDate(departure)}</span>
              <span>•</span>
              <span>{passengers} Passenger{passengers > 1 ? "s" : ""}</span>
              <span>•</span>
              <span className="capitalize">{cabin}</span>
              <span>•</span>
              <span className="text-[#22D3EE]">{sorted.length} flights found</span>
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
          className="flex flex-wrap items-center gap-3 mb-6"
        >
          <GlassEffect variant="dark" blurStrength={14} className="rounded-xl p-1">
            {(["price", "duration", "departure"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  sortBy === s ? "bg-[#0EA5E9] text-white" : "text-white/50 hover:text-white"
                }`}
              >
                {s === "price" ? "Lowest Price" : s === "duration" ? "Fastest" : "Earliest"}
              </button>
            ))}
          </GlassEffect>

          <div className="flex items-center gap-2">
            <span className="text-white/40 text-xs">Stops:</span>
            {[null, 0, 1].map((stop) => (
              <button
                key={String(stop)}
                onClick={() => setFilterStops(filterStops === stop ? null : stop)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterStops === stop ? "bg-[#0EA5E9]/30 border border-[#0EA5E9] text-[#22D3EE]" : "glass text-white/50 hover:text-white"
                }`}
              >
                {stop === null ? "Any" : stop === 0 ? "Nonstop" : "1 Stop"}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Flight cards */}
        <div className="space-y-4">
          {sorted.map((flight, i) => (
            <motion.div
              key={flight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <GlassCard hover={false} className="overflow-hidden">
              <div className="p-5 md:p-6">
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-5">
                  {/* Airline info */}
                  <div className="flex items-center gap-3 w-full lg:w-48 shrink-0">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0"
                      style={{ background: `${AIRLINE_COLORS[flight.airlineCode] || "#0EA5E9"}22`, border: `1px solid ${AIRLINE_COLORS[flight.airlineCode] || "#0EA5E9"}44` }}
                    >
                      <span style={{ color: AIRLINE_COLORS[flight.airlineCode] || "#0EA5E9" }}>
                        {flight.airlineCode}
                      </span>
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">{flight.airline}</div>
                      <div className="text-white/40 text-xs">{flight.flightNumber}</div>
                      <div className="text-white/30 text-xs">{flight.aircraft}</div>
                    </div>
                  </div>

                  {/* Flight timeline */}
                  <div className="flex-1 flex items-center gap-4">
                    {/* Departure */}
                    <div className="text-center">
                      <div className="text-white text-2xl font-black">{flight.departure}</div>
                      <div className="text-[#0EA5E9] font-bold text-sm">{from}</div>
                      <div className="text-white/40 text-xs">{fromCity}</div>
                    </div>

                    {/* Duration */}
                    <div className="flex-1 flex flex-col items-center gap-1">
                      <div className="flex items-center gap-1 text-white/40 text-xs">
                        <Clock className="w-3 h-3" />
                        {flight.duration}
                      </div>
                      <div className="relative w-full">
                        <div className="h-px w-full bg-gradient-to-r from-[#0EA5E9]/40 via-[#22D3EE]/60 to-[#0EA5E9]/40" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                          <Plane className="w-4 h-4 text-[#22D3EE] rotate-45" />
                        </div>
                      </div>
                      <div className="text-xs">
                        {flight.stops === 0 ? (
                          <span className="text-[#34D399]">Nonstop</span>
                        ) : (
                          <span className="text-[#F59E0B]">1 Stop • {flight.stopCity}</span>
                        )}
                      </div>
                    </div>

                    {/* Arrival */}
                    <div className="text-center">
                      <div className="text-white text-2xl font-black">{flight.arrival}</div>
                      <div className="text-[#0EA5E9] font-bold text-sm">{to}</div>
                      <div className="text-white/40 text-xs">{toCity}</div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="hidden lg:block w-px h-16 bg-gradient-to-b from-transparent via-[#0EA5E9]/20 to-transparent" />

                  {/* Price + CTA */}
                  <div className="flex flex-row lg:flex-col items-center lg:items-end gap-4 lg:gap-2 w-full lg:w-auto">
                    <div className="text-right">
                      {flight.tag && (
                        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold mb-1 ${
                          flight.tag === "Best Value" ? "bg-[#22D3EE]/20 text-[#22D3EE]" :
                          flight.tag === "Fastest" ? "bg-[#34D399]/20 text-[#34D399]" :
                          flight.tag === "Lowest Fare" ? "bg-[#F59E0B]/20 text-[#F59E0B]" :
                          "bg-[#0EA5E9]/20 text-[#0EA5E9]"
                        }`}>
                          {flight.tag === "Lowest Fare" && <Zap className="w-3 h-3" />}
                          {flight.tag}
                        </div>
                      )}
                      <div className="text-white text-3xl font-black">
                        ${flight.price.toLocaleString()}
                      </div>
                      <div className="text-white/40 text-xs">
                        incl. taxes & fees
                      </div>
                      {flight.price === cheapest && (
                        <div className="text-[#34D399] text-xs font-semibold">Cheapest option</div>
                      )}
                      <div className="text-white/30 text-xs mt-0.5">
                        {flight.seatsLeft} seats left
                      </div>
                    </div>

                    <GlassEffect
                      variant="blue"
                      blurStrength={12}
                      className="rounded-xl px-6 py-3 hover:scale-105 active:scale-95"
                      onClick={() => setSelectedFlight(flight)}
                    >
                      <span className="flex items-center gap-2 text-white font-bold text-sm whitespace-nowrap">
                        Request Booking
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </GlassEffect>
                  </div>
                </div>
              </div>

              {/* Bottom strip */}
              <div className="px-6 py-2 border-t border-[#0EA5E9]/10 flex items-center gap-4 text-xs text-white/30">
                <span className="capitalize">{flight.cabin} Class</span>
                <span>•</span>
                <span>{flight.aircraft}</span>
                <span>•</span>
                <span>Tax: ${flight.taxes}</span>
              </div>
              </GlassCard>
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
