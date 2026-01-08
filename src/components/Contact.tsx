"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { identity } from "@/lib/data";
import { FaPaperPlane, FaCopy } from "react-icons/fa6";
import { useState, MouseEvent } from "react";

export default function Contact() {
  const [copied, setCopied] = useState<string | null>(null);

  // Mouse position values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth spring physics for rotation
  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const xPct = (clientX - left) / width - 0.5;
    const yPct = (clientY - top) / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  // Calculate rotation based on mouse position (max 10 degrees)
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);

  // Dynamic sheen effect
  const sheenGradient = useMotionTemplate`linear-gradient(
    135deg,
    transparent,
    rgba(255, 255, 255, ${useTransform(mouseX, [-0.5, 0.5], [0, 0.1])}) 40%,
    rgba(255, 255, 255, ${useTransform(mouseX, [-0.5, 0.5], [0, 0.2])}) 50%,
    rgba(255, 255, 255, ${useTransform(mouseX, [-0.5, 0.5], [0, 0.1])}) 60%,
    transparent
  )`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section className="relative py-32 px-6 flex justify-center items-center overflow-hidden perspective-1000">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-4xl"
      >
        <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-12 md:p-16 text-center shadow-2xl overflow-hidden group">

          {/* Moving Sheen */}
          <motion.div
            className="absolute inset-0 pointer-events-none opacity-50 z-20 mix-blend-overlay"
            style={{ background: sheenGradient }}
          />

          <div style={{ transform: "translateZ(50px)" }} className="relative z-30">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to turn ideas into reality?
            </h2>
            <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Whether it's a complex AI problem, a new product, or a research collaboration — I'm always open to discussing new opportunities.
            </p>

            <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-12">
              <a
                href={`mailto:${identity.emailStart}`}
                className="group flex items-center gap-3 bg-[var(--purple)] text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-[var(--blue)] transition-all transform hover:scale-105 shadow-lg shadow-purple-500/25"
              >
                <FaPaperPlane className="text-sm group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                <span>Say Hello</span>
              </a>
            </div>

            {/* Email Copy Section */}
            <div className="flex flex-col gap-3 items-center text-sm text-gray-500 bg-black/20 p-6 rounded-xl border border-white/5 max-w-lg mx-auto hover:bg-black/30 transition-colors">
              <p className="uppercase tracking-wider text-xs font-semibold text-gray-600 mb-2">Direct Contact</p>

              {[identity.emailStart, identity.emailIEEE].map((email) => (
                <div key={email} className="flex items-center gap-3 group/email w-full justify-between px-4">
                  <span className="font-mono text-gray-300 group-hover/email:text-[var(--blue)] transition-colors">{email}</span>
                  <button
                    onClick={() => copyToClipboard(email)}
                    className="text-gray-500 hover:text-white transition-colors p-2 relative"
                    aria-label="Copy email"
                  >
                    <AnimatePresence mode='wait'>
                      {copied === email ? (
                        <motion.span
                          key="copied"
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.5, opacity: 0 }}
                          className="text-green-400 text-xs font-bold"
                        >
                          Copied!
                        </motion.span>
                      ) : (
                        <motion.span
                          key="copy-icon"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <FaCopy />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
