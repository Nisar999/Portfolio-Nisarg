"use client";

import { useState, useEffect, useRef } from "react";
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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Skip animation if user prefers reduced motion or skip prop is true
  if (skipAnimation || prefersReducedMotion) {
    return null;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 1920;
    const height = 1080;
    const duration = 2000; // milliseconds
    const fps = 60;
    const frameDuration = 1000 / fps;

    let animationFrameId: number;
    let lastFrameTime = Date.now();
    let particles: Array<{
      x: number;
      y: number;
      size: number;
      opacity: number;
      lifetime: number;
      age: number;
      driftX: number;
      driftY: number;
    }> = [];

    function easeInOutCubic(t: number) {
      t = Math.max(0, Math.min(1, t));
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function interpolatePosition(progress: number) {
      const eased = easeInOutCubic(progress);
      const x = -150 + (150 - -150) * eased;
      const y = -150 + (150 - -150) * eased;
      return { x: Math.floor(x), y: Math.floor(y) };
    }

    function drawSpaceship(x: number, y: number, size: number) {
      ctx.save();
      ctx.translate(x, y);

      // Draw spaceship body (light blue)
      ctx.fillStyle = "#4CC3FF";
      ctx.strokeStyle = "#3296D1";
      ctx.lineWidth = 2;

      // Triangle body
      ctx.beginPath();
      ctx.moveTo(0, -size / 2);
      ctx.lineTo(size / 2, size / 4);
      ctx.lineTo(0, size / 2);
      ctx.lineTo(-size / 2, size / 4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Cockpit (darker blue)
      ctx.fillStyle = "#1E64B4";
      ctx.beginPath();
      ctx.arc(0, -size / 6, size / 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    function drawSmoke() {
      particles.forEach((p) => {
        const alpha = ((1 - p.age / p.lifetime) * p.opacity);
        const gray = Math.floor(120);
        ctx.fillStyle = `rgba(${gray}, ${gray}, ${gray}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    function animate(currentTime: number) {
      const elapsed = currentTime - lastFrameTime;

      if (elapsed >= frameDuration) {
        const progress = Math.min((currentTime % duration) / duration, 1);
        const shipPos = interpolatePosition(progress);

        // Draw background gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, "#0a0a14");
        gradient.addColorStop(0.5, "#16213e");
        gradient.addColorStop(1, "#0f3460");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Add stars
        ctx.fillStyle = "#ffffff";
        ctx.globalAlpha = 0.5;
        for (let i = 0; i < 50; i++) {
          const x = (currentTime * 0.001 + i * 38.4) % width;
          const y = (i * 21.6) % height;
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;

        // Spawn new particles
        for (let i = 0; i < 15; i++) {
          const offsetX = (Math.random() - 0.5) * 40;
          const offsetY = (Math.random() - 0.5) * 40;
          particles.push({
            x: shipPos.x - 60 + offsetX,
            y: shipPos.y - 60 + offsetY,
            size: Math.random() * 25 + 15,
            opacity: Math.random() * 0.4 + 0.2,
            lifetime: 60,
            age: 0,
            driftX: (Math.random() - 0.5) * 2,
            driftY: Math.random() * 2,
          });
        }

        // Update particles
        particles.forEach((p) => {
          p.age++;
          p.x += p.driftX;
          p.y += p.driftY;
        });

        // Remove dead particles
        particles = particles.filter((p) => p.age < p.lifetime);

        // Draw smoke
        drawSmoke();

        // Draw spaceship
        drawSpaceship(shipPos.x, shipPos.y, 120);

        lastFrameTime = currentTime;

        // Check if animation is done
        if (progress >= 1) {
          setIsVisible(false);
          onComplete?.();
          return;
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    }

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [onComplete]);

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
          <canvas
            ref={canvasRef}
            width={1920}
            height={1080}
            className="w-full h-full max-w-full max-h-full"
            aria-hidden="true"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
