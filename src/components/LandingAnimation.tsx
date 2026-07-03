"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMotionPreference } from "@/hooks";
import dynamic from "next/dynamic";

// Dynamically import DotLottieReact to avoid SSR issues
const DotLottieReact = dynamic(
  () => import("@lottiefiles/dotlottie-react").then((mod) => mod.DotLottieReact),
  { ssr: false }
);

interface LandingAnimationProps {
  onComplete?: () => void;
  skipAnimation?: boolean;
}

/**
 * Landing page animation component
 * Shows a spaceship entering the frame with a smoke trail effect via Lottie
 * Plays automatically on page load for approximately 2 seconds
 * Respects prefers-reduced-motion preference
 */
export function LandingAnimation({
  onComplete,
  skipAnimation = false,
}: LandingAnimationProps) {
  const prefersReducedMotion = useMotionPreference();
  const [isVisible, setIsVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Skip animation if user prefers reduced motion or skip prop is true
  if (skipAnimation || prefersReducedMotion) {
    return null;
  }

  useEffect(() => {
    if (!mounted) return;

    // Animation duration is approximately 2 seconds based on Lottie file
    // Add 500ms buffer for fade-out transition
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete, mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="landing-animation"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed inset-0 z-[9998] bg-black flex items-center justify-center overflow-hidden"
          role="img"
          aria-label="Spaceship intro animation"
        >
          <div className="w-full h-full flex items-center justify-center">
            <DotLottieReact
              src="https://lottie.host/848d978a-0459-42e3-9cbd-fe195e0353bc/apccbJuWZ7.lottie"
              loop={false}
              autoplay
              className="w-full h-full"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
