"use client";

import { useScroll, useSpring, motion } from "framer-motion";

export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX, transformOrigin: "left" }}
      className="fixed top-0 left-0 right-0 h-[3px] z-[100]"
      aria-hidden="true"
    >
      {/* Glowing progress line */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0EA5E9] via-[#22D3EE] to-[#38BDF8]" />
      <div
        className="absolute inset-0 blur-sm"
        style={{ background: "linear-gradient(90deg, #0EA5E9, #22D3EE, #38BDF8)" }}
      />
      {/* Leading dot */}
      <motion.div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#22D3EE]"
        style={{ boxShadow: "0 0 10px 3px rgba(34,211,238,0.8)" }}
      />
    </motion.div>
  );
}
