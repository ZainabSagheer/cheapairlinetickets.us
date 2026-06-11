"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane } from "lucide-react";

const BOARD_FLIGHTS = [
  { flight: "AA 4521", dest: "New York JFK", time: "06:45", status: "On Time", gate: "A12" },
  { flight: "DL 8834", dest: "Los Angeles LAX", time: "07:15", status: "Boarding", gate: "B7" },
  { flight: "UA 2201", dest: "Chicago ORD", time: "07:30", status: "On Time", gate: "C22" },
  { flight: "EK 0215", dest: "Dubai DXB", time: "08:00", status: "Departed", gate: "D5" },
  { flight: "BA 0178", dest: "London LHR", time: "08:20", status: "On Time", gate: "E14" },
  { flight: "QR 0723", dest: "Doha DOH", time: "08:45", status: "Boarding", gate: "F3" },
  { flight: "WN 4120", dest: "Las Vegas LAS", time: "09:00", status: "On Time", gate: "A8" },
  { flight: "NK 1234", dest: "Miami MIA", time: "09:15", status: "Delayed", gate: "B11" },
];

const STATUS_COLORS: Record<string, string> = {
  "On Time": "#34D399",
  "Boarding": "#FBBF24",
  "Departed": "#94A3B8",
  "Delayed": "#F87171",
};

export default function DepartureBoard() {
  const [activeRow, setActiveRow] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveRow(r => (r + 1) % BOARD_FLIGHTS.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="glass-dark rounded-2xl border border-[#2563EB]/20 overflow-hidden">
      {/* Board header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#2563EB]/10"
        style={{ background: "rgba(14,165,233,0.08)" }}>
        <Plane className="w-4 h-4 text-[#2563EB] rotate-45" />
        <span className="text-[#2563EB] font-bold text-sm tracking-wider uppercase">Departures</span>
        <div className="ml-auto flex items-center gap-1.5 text-[#34D399] text-xs">
          <div className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
          Live
        </div>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-5 px-4 py-2 text-[10px] text-white/30 uppercase tracking-wider font-bold border-b border-white/5">
        <span>Flight</span>
        <span className="col-span-2">Destination</span>
        <span>Time</span>
        <span>Status</span>
      </div>

      {/* Rows */}
      <div>
        {BOARD_FLIGHTS.map((flight, i) => (
          <div
            key={flight.flight}
            className={`grid grid-cols-5 px-4 py-2.5 text-sm border-b border-white/5 last:border-0 transition-all duration-500 ${
              i === activeRow ? "bg-[#2563EB]/10" : "hover:bg-white/5"
            }`}
          >
            <span className={`font-bold text-xs ${i === activeRow ? "text-[#00D9FF]" : "text-white/70"}`}>
              {flight.flight}
            </span>
            <span className="col-span-2 text-white/70 text-xs truncate pr-2">{flight.dest}</span>
            <span className="text-white/70 text-xs font-mono">{flight.time}</span>
            <span className="text-xs font-bold" style={{ color: STATUS_COLORS[flight.status] }}>
              {flight.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
