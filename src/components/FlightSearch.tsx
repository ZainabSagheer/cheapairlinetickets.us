"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "./ScrollReveal";
import { GlassSearchWidget, GlassEffect } from "./LiquidGlass";
import { Plane, MapPin, Calendar, Users, ChevronDown, ArrowLeftRight, Search } from "lucide-react";
import { searchAirports, Airport } from "@/lib/airports";

interface SearchData {
  from: Airport | null;
  to: Airport | null;
  departure: string;
  returnDate: string;
  passengers: number;
  cabin: string;
  tripType: "oneway" | "roundtrip";
}

interface FlightSearchProps {
  onSearch: (data: SearchData) => void;
}

const cabins = ["Economy", "Premium Economy", "Business", "First Class"];

export default function FlightSearch({ onSearch }: FlightSearchProps) {
  const [tripType, setTripType] = useState<"oneway" | "roundtrip">("roundtrip");
  const [from, setFrom] = useState<Airport | null>(null);
  const [to, setTo] = useState<Airport | null>(null);
  const [fromQuery, setFromQuery] = useState("");
  const [toQuery, setToQuery] = useState("");
  const [fromSuggestions, setFromSuggestions] = useState<Airport[]>([]);
  const [toSuggestions, setToSuggestions] = useState<Airport[]>([]);
  const [departure, setDeparture] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [cabin, setCabin] = useState("Economy");
  const [showCabin, setShowCabin] = useState(false);
  const [showPassengers, setShowPassengers] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);
  const cabinRef = useRef<HTMLDivElement>(null);
  const passRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (fromRef.current && !fromRef.current.contains(e.target as Node)) setFromSuggestions([]);
      if (toRef.current && !toRef.current.contains(e.target as Node)) setToSuggestions([]);
      if (cabinRef.current && !cabinRef.current.contains(e.target as Node)) setShowCabin(false);
      if (passRef.current && !passRef.current.contains(e.target as Node)) setShowPassengers(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const handleFromChange = (val: string) => {
    setFromQuery(val);
    setFrom(null);
    setFromSuggestions(val.length >= 2 ? searchAirports(val) : []);
  };

  const handleToChange = (val: string) => {
    setToQuery(val);
    setTo(null);
    setToSuggestions(val.length >= 2 ? searchAirports(val) : []);
  };

  const swapAirports = () => {
    const tmp = from;
    const tmpQ = fromQuery;
    setFrom(to);
    setFromQuery(toQuery);
    setTo(tmp);
    setToQuery(tmpQ);
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!from) errs.from = "Select departure airport";
    if (!to) errs.to = "Select destination airport";
    if (!departure) errs.departure = "Select departure date";
    if (tripType === "roundtrip" && !returnDate) errs.returnDate = "Select return date";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSearch = () => {
    if (!validate()) return;
    onSearch({ from, to, departure, returnDate, passengers, cabin: cabin.toLowerCase().replace(" ", ""), tripType });
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <section id="search" className="relative py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" duration={0.7}>
        <GlassSearchWidget>
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Search Flights</h2>
              <p className="text-white/50 text-sm mt-1">Find the best fares worldwide</p>
            </div>

            {/* Trip type tabs */}
            <div className="flex items-center gap-1 glass rounded-xl p-1">
              {(["roundtrip", "oneway"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setTripType(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    tripType === type
                      ? "bg-[#2563EB] text-white shadow-lg shadow-[#2563EB]/30"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {type === "roundtrip" ? "Round Trip" : "One Way"}
                </button>
              ))}
            </div>
          </div>

          {/* Search row */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3 mb-3">
            {/* From */}
            <div ref={fromRef} className="relative xl:col-span-1">
              <label className="block text-xs font-semibold text-[#00D9FF] uppercase tracking-wider mb-1.5">
                From
              </label>
              <div className={`relative flex items-center rounded-xl border transition-all duration-300 ${errors.from ? "border-red-500/60" : "border-[#2563EB]/20 focus-within:border-[#00D9FF]/60"}`}
                style={{ background: "rgba(14,165,233,0.05)" }}>
                <MapPin className="absolute left-3 w-4 h-4 text-[#2563EB]/60" />
                <input
                  type="text"
                  value={fromQuery}
                  onChange={(e) => handleFromChange(e.target.value)}
                  placeholder="City or airport"
                  className="w-full pl-9 pr-3 py-3.5 bg-transparent text-white placeholder-white/30 text-sm focus:outline-none"
                />
                {from && (
                  <span className="absolute right-3 text-xs text-[#00D9FF] font-bold">{from.code}</span>
                )}
              </div>
              {errors.from && <p className="text-red-400 text-xs mt-1">{errors.from}</p>}

              <AnimatePresence>
                {fromSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 z-50 glass-dark rounded-xl border border-[#2563EB]/20 overflow-hidden shadow-2xl shadow-black/50"
                  >
                    {fromSuggestions.map((apt) => (
                      <button
                        key={apt.code}
                        onClick={() => { setFrom(apt); setFromQuery(`${apt.city} (${apt.code})`); setFromSuggestions([]); }}
                        className="w-full px-4 py-3 text-left hover:bg-[#2563EB]/10 transition-colors flex items-start gap-3 border-b border-white/5 last:border-0"
                      >
                        <span className="text-[#2563EB] font-bold text-sm mt-0.5 w-10 shrink-0">{apt.code}</span>
                        <div>
                          <div className="text-white text-sm font-medium">{apt.city}</div>
                          <div className="text-white/40 text-xs truncate">{apt.name}</div>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Swap button */}
            <div className="hidden xl:flex items-end justify-center pb-1">
              <button
                onClick={swapAirports}
                className="w-10 h-10 rounded-full glass border border-[#2563EB]/30 flex items-center justify-center text-[#2563EB] hover:bg-[#2563EB]/20 hover:scale-110 transition-all duration-200"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>
            </div>

            {/* To */}
            <div ref={toRef} className="relative xl:col-span-1">
              <label className="block text-xs font-semibold text-[#00D9FF] uppercase tracking-wider mb-1.5">
                To
              </label>
              <div className={`relative flex items-center rounded-xl border transition-all duration-300 ${errors.to ? "border-red-500/60" : "border-[#2563EB]/20 focus-within:border-[#00D9FF]/60"}`}
                style={{ background: "rgba(14,165,233,0.05)" }}>
                <Plane className="absolute left-3 w-4 h-4 text-[#2563EB]/60 rotate-45" />
                <input
                  type="text"
                  value={toQuery}
                  onChange={(e) => handleToChange(e.target.value)}
                  placeholder="City or airport"
                  className="w-full pl-9 pr-3 py-3.5 bg-transparent text-white placeholder-white/30 text-sm focus:outline-none"
                />
                {to && (
                  <span className="absolute right-3 text-xs text-[#00D9FF] font-bold">{to.code}</span>
                )}
              </div>
              {errors.to && <p className="text-red-400 text-xs mt-1">{errors.to}</p>}

              <AnimatePresence>
                {toSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 z-50 glass-dark rounded-xl border border-[#2563EB]/20 overflow-hidden shadow-2xl shadow-black/50"
                  >
                    {toSuggestions.map((apt) => (
                      <button
                        key={apt.code}
                        onClick={() => { setTo(apt); setToQuery(`${apt.city} (${apt.code})`); setToSuggestions([]); }}
                        className="w-full px-4 py-3 text-left hover:bg-[#2563EB]/10 transition-colors flex items-start gap-3 border-b border-white/5 last:border-0"
                      >
                        <span className="text-[#2563EB] font-bold text-sm mt-0.5 w-10 shrink-0">{apt.code}</span>
                        <div>
                          <div className="text-white text-sm font-medium">{apt.city}</div>
                          <div className="text-white/40 text-xs truncate">{apt.name}</div>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-3 xl:col-span-1">
              <div>
                <label className="block text-xs font-semibold text-[#00D9FF] uppercase tracking-wider mb-1.5">
                  Depart
                </label>
                <div className={`relative rounded-xl border transition-all duration-300 ${errors.departure ? "border-red-500/60" : "border-[#2563EB]/20 focus-within:border-[#00D9FF]/60"}`}
                  style={{ background: "rgba(14,165,233,0.05)" }}>
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2563EB]/60" />
                  <input
                    type="date"
                    value={departure}
                    min={today}
                    onChange={(e) => setDeparture(e.target.value)}
                    className="w-full pl-9 pr-2 py-3.5 bg-transparent text-white text-sm focus:outline-none cursor-pointer"
                    style={{ colorScheme: "dark" }}
                  />
                </div>
                {errors.departure && <p className="text-red-400 text-xs mt-1">{errors.departure}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#00D9FF] uppercase tracking-wider mb-1.5">
                  Return
                </label>
                <div className={`relative rounded-xl border transition-all duration-300 ${
                  tripType === "oneway" ? "opacity-40 pointer-events-none" : errors.returnDate ? "border-red-500/60" : "border-[#2563EB]/20 focus-within:border-[#00D9FF]/60"
                }`} style={{ background: "rgba(14,165,233,0.05)" }}>
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2563EB]/60" />
                  <input
                    type="date"
                    value={returnDate}
                    min={departure || today}
                    onChange={(e) => setReturnDate(e.target.value)}
                    disabled={tripType === "oneway"}
                    className="w-full pl-9 pr-2 py-3.5 bg-transparent text-white text-sm focus:outline-none cursor-pointer"
                    style={{ colorScheme: "dark" }}
                  />
                </div>
                {errors.returnDate && <p className="text-red-400 text-xs mt-1">{errors.returnDate}</p>}
              </div>
            </div>
          </div>

          {/* Second row: passengers + cabin + button */}
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            {/* Passengers */}
            <div ref={passRef} className="relative w-full sm:w-44">
              <label className="block text-xs font-semibold text-[#00D9FF] uppercase tracking-wider mb-1.5">
                Passengers
              </label>
              <button
                onClick={() => setShowPassengers(!showPassengers)}
                className="w-full flex items-center gap-2 px-3 py-3.5 rounded-xl border border-[#2563EB]/20 text-white text-sm transition-all duration-200 hover:border-[#00D9FF]/40"
                style={{ background: "rgba(14,165,233,0.05)" }}
              >
                <Users className="w-4 h-4 text-[#2563EB]/60" />
                <span>{passengers} Passenger{passengers > 1 ? "s" : ""}</span>
                <ChevronDown className={`w-4 h-4 ml-auto text-white/40 transition-transform ${showPassengers ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {showPassengers && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 z-50 glass-dark rounded-xl border border-[#2563EB]/20 p-4 shadow-2xl"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white text-sm">Adults</span>
                      <div className="flex items-center gap-3">
                        <button onClick={() => setPassengers(Math.max(1, passengers - 1))}
                          className="w-8 h-8 rounded-full border border-[#2563EB]/40 text-[#2563EB] hover:bg-[#2563EB]/20 transition-colors flex items-center justify-center text-lg font-bold">-</button>
                        <span className="text-white font-bold w-6 text-center">{passengers}</span>
                        <button onClick={() => setPassengers(Math.min(9, passengers + 1))}
                          className="w-8 h-8 rounded-full border border-[#2563EB]/40 text-[#2563EB] hover:bg-[#2563EB]/20 transition-colors flex items-center justify-center text-lg font-bold">+</button>
                      </div>
                    </div>
                    <button onClick={() => setShowPassengers(false)}
                      className="mt-3 w-full py-2 rounded-lg bg-[#2563EB]/20 text-[#00D9FF] text-sm font-medium hover:bg-[#2563EB]/30 transition-colors">
                      Done
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cabin */}
            <div ref={cabinRef} className="relative w-full sm:w-48">
              <label className="block text-xs font-semibold text-[#00D9FF] uppercase tracking-wider mb-1.5">
                Cabin Class
              </label>
              <button
                onClick={() => setShowCabin(!showCabin)}
                className="w-full flex items-center gap-2 px-3 py-3.5 rounded-xl border border-[#2563EB]/20 text-white text-sm transition-all duration-200 hover:border-[#00D9FF]/40"
                style={{ background: "rgba(14,165,233,0.05)" }}
              >
                <span>✈</span>
                <span>{cabin}</span>
                <ChevronDown className={`w-4 h-4 ml-auto text-white/40 transition-transform ${showCabin ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {showCabin && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 z-50 glass-dark rounded-xl border border-[#2563EB]/20 overflow-hidden shadow-2xl"
                  >
                    {cabins.map((c) => (
                      <button
                        key={c}
                        onClick={() => { setCabin(c); setShowCabin(false); }}
                        className={`w-full px-4 py-3 text-left text-sm transition-colors border-b border-white/5 last:border-0 ${
                          cabin === c ? "bg-[#2563EB]/20 text-[#00D9FF] font-semibold" : "text-white hover:bg-[#2563EB]/10"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Search button */}
            <div className="flex-1 sm:flex-none">
              <button
                onClick={handleSearch}
                className="w-full sm:w-auto px-10 py-3.5 rounded-xl text-white font-bold text-base btn-primary flex items-center justify-center gap-2 group"
              >
                <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Find Flights
              </button>
            </div>
          </div>
        </GlassSearchWidget>
        </ScrollReveal>
      </div>
    </section>
  );
}
