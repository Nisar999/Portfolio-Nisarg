"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { identity } from "@/lib/data";

import Typewriter from "typewriter-effect";

import { useLoading } from "@/context/LoadingContext";

export default function Hero() {
  const { isLoading } = useLoading();

  return (
    <section className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background with Header Image and Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/header.png"
          alt="Background"
          fill
          className="object-cover opacity-100" // Increased visibility
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--bg)]/50 to-[var(--bg)]" /> {/* Reduced overlay opacity */}
      </div>

      {/* Animated Glowing Orbs */}
      <motion.div
        animate={!isLoading ? {
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        } : {}}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--blue)] rounded-full blur-[128px] opacity-30 z-0"
      />
      <motion.div
        animate={!isLoading ? {
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2],
        } : {}}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--purple)] rounded-full blur-[128px] opacity-20 z-0"
      />

      <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center max-w-6xl w-full">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={!isLoading ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-xl"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white pb-2 flex overflow-hidden">
            {identity.name.split("").map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={!isLoading ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.05, type: "spring", stiffness: 100 }}
                className="inline-block"
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </h1>

          <div className="text-xl md:text-2xl text-[var(--blue)] font-medium mb-6 h-[60px]">
            {!isLoading && (
              <Typewriter
                options={{
                  strings: [
                    "AI Engineer",
                    "Computer Vision Specialist",
                    "NLP Researcher",
                    "Community Leader",
                  ],
                  autoStart: true,
                  loop: true,
                  deleteSpeed: 50,
                }}
              />
            )}
          </div>

          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            {identity.title}
          </p>

          <div className="flex gap-4">
            <a
              href="/resume.pdf"
              className="px-6 py-3 rounded-full bg-[var(--blue)] text-black font-semibold hover:bg-white hover:scale-105 transition-all shadow-[0_0_20px_rgba(76,195,255,0.3)]"
            >
              Resume
            </a>
            <a
              href={identity.github}
              className="px-6 py-3 rounded-full border border-gray-600 hover:border-[var(--blue)] hover:text-[var(--blue)] hover:bg-[var(--blue)]/10 transition-all font-medium"
            >
              GitHub
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={!isLoading ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="relative flex justify-center items-center"
        >
          {/* Glassmorphic Background Circle (Restored) */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] z-0" />

          {/* Animated Gradient Glow */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full blur-3xl bg-gradient-to-tr from-[var(--blue)] to-[var(--purple)] opacity-40 animate-pulse -z-10" />

          <Image
            src="/nisarg.png"
            alt="Nisarg Chauhan"
            width={350}
            height={350}
            className="relative rounded-full z-10 object-cover w-[350px] h-[350px] hover:scale-105 transition duration-500"
          />
        </motion.div>
      </div>
    </section>
  );
}
