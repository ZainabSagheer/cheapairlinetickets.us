"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Sparkles, Plane, TrendingDown, MapPin, X, Minimize2 } from "lucide-react";
import { ScrollReveal, ParallaxLayer } from "./ScrollReveal";

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
  suggestions?: string[];
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hello! I'm your AI Travel Assistant ✈️ I can help you find the best flights, suggest destinations, and provide fare guidance. What can I help you with today?",
    suggestions: ["Best deals this week", "Recommend a destination", "Business class upgrades", "Cheapest international flights"],
  },
];

const AI_RESPONSES: Record<string, Message> = {
  "best deals this week": {
    id: "", role: "assistant",
    content: "🔥 This week's hottest deals:\n\n✈️ **NYC → LAX** from $149 (Delta)\n✈️ **Chicago → Miami** from $99 (Spirit)\n✈️ **Dallas → Las Vegas** from $89 (Southwest)\n✈️ **Atlanta → Orlando** from $79 (Frontier)\n\nThese fares won't last! Want me to open the booking flow for any of these?",
    suggestions: ["Book NYC → LAX", "Book Dallas → Las Vegas", "More deals"],
  },
  "recommend a destination": {
    id: "", role: "assistant",
    content: "🌍 Based on current trends, here are my top picks:\n\n🏖️ **Cancún** — Beach paradise, flights from $249 RT\n🗽 **New York** — City that never sleeps, from $149\n🎰 **Las Vegas** — Entertainment capital, from $99\n🌴 **Miami** — Art Deco & beaches, from $159\n\nAll bookings include personal consultant support. Which destination sparks your interest?",
    suggestions: ["Tell me more about Cancún", "Show NYC flights", "Las Vegas deals"],
  },
  "business class upgrades": {
    id: "", role: "assistant",
    content: "💼 Business Class Upgrade Tips:\n\n⭐ Book 3-6 months in advance for best availability\n⭐ Our consultants have access to exclusive upgrade fares\n⭐ Airlines like Emirates & Qatar Airways offer premium deals\n⭐ Avg. business class: **40-60% below published rates**\n\nWant our travel experts to find the best business class deal for your route?",
    suggestions: ["Get business class quote", "Compare airlines", "See routes"],
  },
  "cheapest international flights": {
    id: "", role: "assistant",
    content: "🌐 Top International Deals Right Now:\n\n🇬🇧 **NYC → London** from $399 RT\n🇩🇪 **NYC → Frankfurt** from $449 RT\n🇦🇪 **NYC → Dubai** from $699 RT\n🇯🇵 **LAX → Tokyo** from $599 RT\n🇲🇽 **Any US City → Cancún** from $249 RT\n\nAll prices include taxes. Our consultants can often beat these rates!",
    suggestions: ["Book London flight", "Book Tokyo flight", "Other destinations"],
  },
};

function getResponse(input: string): Message {
  const lower = input.toLowerCase();
  for (const [key, resp] of Object.entries(AI_RESPONSES)) {
    if (lower.includes(key.split(" ")[0]) || lower.includes(key)) {
      return { ...resp, id: Date.now().toString() };
    }
  }
  return {
    id: Date.now().toString(),
    role: "assistant",
    content: `Great question! For "${input}", I'd recommend speaking directly with one of our travel consultants via WhatsApp for personalized assistance. They can access exclusive fares not available online and craft the perfect itinerary for you. 🎯`,
    suggestions: ["Chat on WhatsApp", "Browse destinations", "Search flights"],
  };
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const resp = getResponse(text);
      setMessages(prev => [...prev, resp]);
    }, 1200 + Math.random() * 800);
  };

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 grid-overlay opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#2563EB]/5 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <ScrollReveal direction="left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-[#2563EB]/30 text-[#00D9FF] text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI Travel Assistant
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 leading-tight">
              Your Personal{" "}
              <span className="gradient-text">AI Travel</span>{" "}
              Concierge
            </h2>
            <p className="text-white/60 text-lg mb-8 leading-relaxed">
              Get instant flight recommendations, fare guidance, and destination suggestions
              from our AI assistant — then connect with a human expert to finalize your booking.
            </p>

            <div className="space-y-4 mb-8">
              {[
                { icon: Plane, label: "Intelligent Flight Recommendations", color: "#2563EB" },
                { icon: TrendingDown, label: "Real-time Fare Guidance & Alerts", color: "#34D399" },
                { icon: MapPin, label: "Personalized Destination Suggestions", color: "#FBBF24" },
                { icon: Bot, label: "24/7 Instant Response", color: "#A78BFA" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${item.color}15` }}>
                    <item.icon className="w-4 h-4" style={{ color: item.color }} />
                  </div>
                  <span className="text-white/80 text-sm">{item.label}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-bold text-lg btn-primary"
            >
              <Bot className="w-5 h-5" />
              Chat with AI Assistant
              <Sparkles className="w-4 h-4" />
            </button>
          </ScrollReveal>

          {/* Right: Chat preview */}
          <ScrollReveal direction="right" parallaxStrength={20}
            className="relative"
          >
            {/* Glow */}
            <div className="absolute inset-0 rounded-3xl bg-[#2563EB]/10 blur-3xl" />

            <div className="relative glass-dark rounded-3xl border border-[#2563EB]/20 overflow-hidden shadow-2xl">
              {/* Chat header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-[#2563EB]/10">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#00D9FF] flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#34D399] border-2 border-[#0F172A]" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm">TravelAI</div>
                  <div className="text-[#34D399] text-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
                    Online — Ready to help
                  </div>
                </div>
                <div className="ml-auto flex gap-1">
                  {["#F59E0B", "#34D399", "#EF4444"].map(c => (
                    <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
                  ))}
                </div>
              </div>

              {/* Static preview messages */}
              <div className="p-5 space-y-4 h-80 overflow-hidden">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#00D9FF] flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="glass rounded-2xl rounded-tl-sm p-3 text-sm text-white/80 leading-relaxed">
                      Hello! I'm your AI Travel Assistant ✈️ I can help you find the best flights and deals. What's your destination?
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <div className="max-w-xs bg-[#2563EB]/20 border border-[#2563EB]/30 rounded-2xl rounded-tr-sm p-3 text-sm text-white">
                    Looking for cheap flights from NYC to London
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#00D9FF] flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="glass rounded-2xl rounded-tl-sm p-3 text-sm text-white/80 leading-relaxed">
                      🎯 Great choice! NYC → London (LHR) flights from <span className="text-[#34D399] font-bold">$399 roundtrip</span>. Want our expert to find you an even better deal?
                    </div>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {["Yes, find deals", "See flights", "Business class?"].map(s => (
                        <button key={s} className="px-3 py-1 rounded-lg text-xs text-[#00D9FF] border border-[#00D9FF]/30 hover:bg-[#00D9FF]/10 transition-colors">
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Typing indicator overlay */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#00D9FF] flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="glass rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5 items-center">
                    {[0, 0.2, 0.4].map((delay) => (
                      <motion.div key={delay} className="w-2 h-2 rounded-full bg-[#2563EB]"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 0.8, delay, repeat: Infinity }} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Input preview */}
              <div className="p-4 border-t border-[#2563EB]/10 flex gap-2">
                <div className="flex-1 px-4 py-3 rounded-xl glass text-white/30 text-sm">
                  Ask me anything about flights...
                </div>
                <button onClick={() => setIsOpen(true)} className="w-11 h-11 rounded-xl btn-primary flex items-center justify-center">
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Full chat overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 60 }}
              className="relative w-full max-w-lg glass-dark rounded-3xl border border-[#2563EB]/20 shadow-2xl overflow-hidden"
              style={{ height: "80vh", maxHeight: 640 }}
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#2563EB] to-transparent" />

              {/* Header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-[#2563EB]/10">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#00D9FF] flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#34D399] border-2 border-[#0F172A]" />
                </div>
                <div>
                  <div className="text-white font-bold">TravelAI</div>
                  <div className="text-[#34D399] text-xs">Online</div>
                </div>
                <div className="ml-auto flex gap-2">
                  <button onClick={() => setIsOpen(false)} className="p-2 text-white/40 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ height: "calc(100% - 140px)" }}>
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                    {msg.role === "assistant" && (
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#00D9FF] flex items-center justify-center shrink-0 mt-1">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className="max-w-[80%]">
                      <div className={`rounded-2xl p-3 text-sm leading-relaxed whitespace-pre-line ${
                        msg.role === "user"
                          ? "bg-[#2563EB]/20 border border-[#2563EB]/30 text-white rounded-tr-sm"
                          : "glass text-white/80 rounded-tl-sm"
                      }`}>
                        {msg.content}
                      </div>
                      {msg.suggestions && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {msg.suggestions.map((s) => (
                            <button key={s} onClick={() => sendMessage(s)}
                              className="px-3 py-1.5 rounded-lg text-xs text-[#00D9FF] border border-[#00D9FF]/30 hover:bg-[#00D9FF]/10 transition-colors">
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#00D9FF] flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="glass rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5 items-center">
                      {[0, 0.2, 0.4].map((delay) => (
                        <motion.div key={delay} className="w-2 h-2 rounded-full bg-[#2563EB]"
                          animate={{ y: [0, -6, 0] }}
                          transition={{ duration: 0.8, delay, repeat: Infinity }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#2563EB]/10 bg-[#0F172A]/80 backdrop-blur">
                <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="flex gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about flights, deals, destinations..."
                    className="flex-1 px-4 py-3 rounded-xl text-white text-sm premium-input"
                  />
                  <motion.button
                    type="submit"
                    whileTap={{ scale: 0.95 }}
                    disabled={!input.trim() || isTyping}
                    className="w-11 h-11 rounded-xl btn-primary flex items-center justify-center disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
