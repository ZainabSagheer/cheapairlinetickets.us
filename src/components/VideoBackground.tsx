"use client";

import { useScroll, useTransform, motion } from "framer-motion";

export default function VideoBackground() {
  const { scrollY } = useScroll();

  // Parallax: video drifts up 30% of scroll distance → depth illusion
  const videoY = useTransform(scrollY, [0, 2000], ["0%", "30%"]);

  // Overlay darkens slightly as you scroll down (content sections need more contrast)
  const overlayOpacity = useTransform(scrollY, [0, 600], [0.65, 0.82]);

  // Subtle scale breathe on scroll
  const videoScale = useTransform(scrollY, [0, 1200], [1, 1.12]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Parallax video wrapper */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={{ y: videoY, scale: videoScale }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="vid-element absolute inset-0 w-full h-full object-cover"
        >
          <source src="/bg-video.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* Scroll-reactive overlay — colour switches via CSS var (light/dark) */}
      <motion.div
        className="vid-overlay absolute inset-0"
        style={{ opacity: overlayOpacity }}
      />

      {/* Static blue radial glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(14,165,233,0.1) 0%, transparent 65%)",
        }}
      />
    </div>
  );
}
