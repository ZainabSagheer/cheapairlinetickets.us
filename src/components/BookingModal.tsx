"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Plane, User, Phone, Mail, MessageSquare, Send, CheckCircle } from "lucide-react";
import { Flight } from "@/lib/flights";
import { GlassModal } from "./LiquidGlass";

interface BookingModalProps {
  flight: Flight;
  passengers: number;
  departure: string;
  onClose: () => void;
}

interface FormData {
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  travelers: number;
  notes: string;
}

export default function BookingModal({ flight, passengers, departure, onClose }: BookingModalProps) {
  const [form, setForm] = useState<FormData>({
    name: "", phone: "", whatsapp: "", email: "",
    travelers: passengers, notes: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (): boolean => {
    const errs: Partial<FormData> = {};
    if (!form.name.trim()) errs.name = "Required";
    if (!form.phone.trim()) errs.phone = "Required";
    if (!form.email.trim() || !form.email.includes("@")) errs.email = "Valid email required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
  };

  const whatsappMsg = encodeURIComponent(
    `Hello FlightBooking.bitsolmarketing.com,\n\nI would like a quote for the following flight:\n\nFrom: ${flight.fromCity} (${flight.from})\nTo: ${flight.toCity} (${flight.to})\nFlight: ${flight.airline} ${flight.flightNumber}\nTravel Date: ${departure}\nPassengers: ${form.travelers}\nCabin: ${flight.cabin}\nEstimated Fare: $${flight.price.toLocaleString()}\n\n${form.notes ? `Notes: ${form.notes}\n\n` : ""}Please assist.\n\nName: ${form.name}\nPhone: ${form.phone || form.whatsapp}`
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-2xl"
        style={{ maxHeight: "90vh" }}
      >
      <GlassModal className="max-h-[90vh]">
        {/* Glow top edge */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#2563EB] to-transparent" />

        {/* Header */}
        <div className="p-6 border-b border-[#2563EB]/10">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Request Booking</h2>
              <p className="text-white/50 text-sm">Our travel consultant will confirm your reservation within minutes</p>
            </div>
            <button onClick={onClose} className="text-white/40 hover:text-white transition-colors p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Flight summary card */}
        <div className="mx-6 mt-4 p-4 rounded-xl bg-[#2563EB]/8 border border-[#2563EB]/20">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-white font-bold text-lg">{flight.departure}</span>
                <div className="flex items-center gap-1 text-[#00D9FF] flex-1">
                  <div className="h-px flex-1 bg-gradient-to-r from-[#00D9FF]/40 to-[#00D9FF]/40" />
                  <Plane className="w-4 h-4 rotate-45" />
                  <div className="h-px flex-1 bg-gradient-to-r from-[#00D9FF]/40 to-transparent" />
                </div>
                <span className="text-white font-bold text-lg">{flight.arrival}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/50">
                <span className="text-[#2563EB] font-bold">{flight.from}</span>
                <span>→</span>
                <span className="text-[#2563EB] font-bold">{flight.to}</span>
                <span>•</span>
                <span>{flight.airline}</span>
                <span>•</span>
                <span>{flight.duration}</span>
                <span>•</span>
                <span>{flight.stops === 0 ? "Nonstop" : "1 Stop"}</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-2xl font-black text-white">${flight.price.toLocaleString()}</div>
              <div className="text-white/40 text-xs">est. per person</div>
            </div>
          </div>
        </div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-[#34D399]/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-[#34D399]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Inquiry Submitted!</h3>
            <p className="text-white/60 mb-6">
              Our travel consultant will contact you within 30 minutes on your WhatsApp or phone number.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`https://wa.me/1234567890?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-bold btn-whatsapp"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Continue on WhatsApp
              </a>
              <button onClick={onClose}
                className="px-6 py-3 rounded-xl text-white/70 font-bold border border-white/20 hover:border-white/40 transition-colors">
                Close
              </button>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Form grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-[#00D9FF] uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2563EB]/50" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="John Smith"
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-white text-sm premium-input"
                  />
                </div>
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-[#00D9FF] uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2563EB]/50" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-white text-sm premium-input"
                  />
                </div>
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-[#00D9FF] uppercase tracking-wider mb-1.5">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2563EB]/50" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-white text-sm premium-input"
                  />
                </div>
                {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block text-xs font-semibold text-[#00D9FF] uppercase tracking-wider mb-1.5">
                  WhatsApp Number
                </label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <input
                    type="tel"
                    value={form.whatsapp}
                    onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                    placeholder="Same as phone if same"
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-white text-sm premium-input"
                  />
                </div>
              </div>

              {/* Number of Travelers */}
              <div>
                <label className="block text-xs font-semibold text-[#00D9FF] uppercase tracking-wider mb-1.5">
                  Number of Travelers
                </label>
                <select
                  value={form.travelers}
                  onChange={(e) => setForm({ ...form, travelers: Number(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl text-white text-sm premium-input appearance-none"
                  style={{ background: "rgba(14,165,233,0.05)" }}
                >
                  {[1,2,3,4,5,6,7,8,9].map(n => (
                    <option key={n} value={n} style={{ background: "#0F172A" }}>{n} Traveler{n > 1 ? "s" : ""}</option>
                  ))}
                </select>
              </div>

              {/* Preferred Flight */}
              <div>
                <label className="block text-xs font-semibold text-[#00D9FF] uppercase tracking-wider mb-1.5">
                  Preferred Flight
                </label>
                <input
                  type="text"
                  value={`${flight.airline} ${flight.flightNumber}`}
                  readOnly
                  className="w-full px-4 py-3 rounded-xl text-white/70 text-sm premium-input"
                />
              </div>
            </div>

            {/* Travel notes */}
            <div>
              <label className="block text-xs font-semibold text-[#00D9FF] uppercase tracking-wider mb-1.5">
                Travel Notes (Optional)
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-[#2563EB]/50" />
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Special requests, meal preferences, accessibility needs..."
                  rows={3}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-white text-sm premium-input resize-none"
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-bold btn-primary"
              >
                <Send className="w-4 h-4" />
                Submit Inquiry
              </motion.button>
              <a
                href={`https://wa.me/1234567890?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-bold btn-whatsapp"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Continue on WhatsApp
              </a>
            </div>

            <p className="text-center text-white/30 text-xs">
              By submitting, you agree to our Terms & Conditions. No payment required at this stage.
            </p>
          </form>
        )}
      </GlassModal>
      </motion.div>
    </motion.div>
  );
}
