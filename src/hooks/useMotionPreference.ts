"use client";

import { useState, useEffect } from "react";

/**
 * Custom hook to detect user's motion preference via prefers-reduced-motion media query
 * Updates reactively when user changes system preference
 *
 * @example
 * ```tsx
 * const prefersReducedMotion = useMotionPreference();
 *
 * if (prefersReducedMotion) {
 *   // Disable animations
 * } else {
 *   // Use animations
 * }
 * ```
 *
 * @returns {boolean} True if user prefers reduced motion, false otherwise
 *                    Returns false for browsers that don't support media queries
 */
export function useMotionPreference(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if media query is supported
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Create listener for changes
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    // Modern browsers use addEventListener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => {
        mediaQuery.removeEventListener("change", handleChange);
      };
    }
    // Older browsers use addListener (deprecated but kept for compatibility)
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => {
        mediaQuery.removeListener(handleChange);
      };
    }
  }, []);

  return prefersReducedMotion;
}
