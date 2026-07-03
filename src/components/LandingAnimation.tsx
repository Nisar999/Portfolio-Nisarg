"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMotionPreference } from "@/hooks";

interface LandingAnimationProps {
  onComplete?: () => void;
  skipAnimation?: boolean;
}

/**
 * Landing page animation component
 * Shows a spaceship entering the frame with a smoke trail effect
 * Plays automatically on page load for exactly 2 seconds
 * Respects prefers-reduced-motion preference
 */
export function LandingAnimation({
  onComplete,
  skipAnimation = false,
}: LandingAnimationProps) {
  const prefersReducedMotion = useMotionPreference();
  const [isVisible, setIsVisible] = useState(true);

  // Skip animation if user prefers reduced motion or skip prop is true
  if (skipAnimation || prefersReducedMotion) {
    return null;
  }

  const handleVideoEnd = () => {
    setIsVisible(false);
    onComplete?.();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="landing-animation"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed inset-0 z-[9998] bg-black flex items-center justify-center"
          role="img"
          aria-label="Spaceship intro animation"
        >
          <video
            src="/animations/spaceship-intro.mp4"
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnd}
            className="w-full h-full object-cover"
            aria-hidden="true"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
