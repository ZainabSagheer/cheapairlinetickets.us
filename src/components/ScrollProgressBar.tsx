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
      <div className="absolute inset-0 bg-gradient-to-r from-[#2563EB] via-[#00D9FF] to-[#7C3AED]" />
      <div
        className="absolute inset-0 blur-sm"
        style={{ background: "linear-gradient(90deg, #2563EB, #00D9FF, #7C3AED)" }}
      />
      {/* Leading dot */}
      <motion.div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#00D9FF]"
        style={{ boxShadow: "0 0 10px 3px rgba(34,211,238,0.8)" }}
      />
    </motion.div>
  );
}
