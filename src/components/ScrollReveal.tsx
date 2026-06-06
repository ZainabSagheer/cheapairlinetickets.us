"use client";

import { useRef, ReactNode } from "react";
import {
  motion, useInView, useScroll, useTransform, useSpring,
  type TargetAndTransition, type Variant,
} from "framer-motion";

type Direction = "up" | "down" | "left" | "right" | "scale" | "fade";

interface ScrollRevealProps {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  parallaxStrength?: number;
  stagger?: boolean;
}

const INITIAL: Record<Direction, TargetAndTransition> = {
  up:    { opacity: 0, y: 60 },
  down:  { opacity: 0, y: -60 },
  left:  { opacity: 0, x: -60 },
  right: { opacity: 0, x: 60 },
  scale: { opacity: 0, scale: 0.85 },
  fade:  { opacity: 0 },
};

const ANIMATE: Record<Direction, TargetAndTransition> = {
  up:    { opacity: 1, y: 0 },
  down:  { opacity: 1, y: 0 },
  left:  { opacity: 1, x: 0 },
  right: { opacity: 1, x: 0 },
  scale: { opacity: 1, scale: 1 },
  fade:  { opacity: 1 },
};

export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.65,
  className = "",
  once = true,
  parallaxStrength = 0,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-80px" });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rawY = useTransform(
    scrollYProgress,
    [0, 1],
    [parallaxStrength, -parallaxStrength]
  );
  const y = useSpring(rawY, { stiffness: 60, damping: 20 });

  return (
    <motion.div
      ref={ref}
      initial={INITIAL[direction]}
      animate={inView ? ANIMATE[direction] : INITIAL[direction]}
      style={parallaxStrength ? { y } : undefined}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],  // custom expo-out
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Staggered children — wraps a list and animates each child in sequence */
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  direction?: Direction;
  once?: boolean;
}

export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.08,
  direction = "up",
  once = true,
}: StaggerContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  direction = "up",
  className = "",
}: {
  children: ReactNode;
  direction?: Direction;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: INITIAL[direction] as Variant,
        visible: { ...ANIMATE[direction], transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } as Variant,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Parallax-only wrapper — no entrance animation, just depth drift */
export function ParallaxLayer({
  children,
  strength = 40,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const rawY = useTransform(scrollYProgress, [0, 1], [strength, -strength]);
  const y = useSpring(rawY, { stiffness: 50, damping: 18 });

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
