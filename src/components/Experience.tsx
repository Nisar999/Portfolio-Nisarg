"use client";

import { experience } from "@/lib/data";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <section ref={containerRef} className="py-24 max-w-4xl mx-auto px-6 relative">
      <h2 className="text-3xl font-semibold mb-12">Experience</h2>

      {/* Continuous Timeline Beam */}
      <div className="absolute left-[39px] top-32 bottom-24 w-0.5 bg-white/10 hidden md:block">
        <motion.div
          style={{ scaleY, transformOrigin: "top" }}
          className="w-full h-full bg-gradient-to-b from-[var(--blue)] via-[var(--purple)] to-[var(--blue)]"
        />
      </div>

      <div className="space-y-12">
        {experience.map((group, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative pl-8 md:pl-16 group"
          >
            {/* Timeline Dot (Pulse effect on hover) */}
            <div className="absolute left-[2px] md:left-[11px] top-0 w-4 h-4 rounded-full bg-[var(--bg)] border-2 border-[var(--blue)] z-10 group-hover:scale-150 group-hover:bg-[var(--blue)] transition-all duration-300">
              <div className="absolute inset-0 rounded-full bg-[var(--blue)] animate-ping opacity-0 group-hover:opacity-75" />
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-12 h-12 flex-shrink-0 bg-white rounded-lg overflow-hidden shadow-lg shadow-blue-500/10 group-hover:shadow-blue-500/20 transition-all">
                <Image
                  src={group.logo}
                  alt={group.org}
                  fill
                  className="object-contain p-1"
                />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-[var(--blue)] transition-colors">{group.org}</h3>
            </div>

            <div className="space-y-6">
              {group.roles.map((role, j) => (
                <div key={j} className="relative pl-4 border-l border-white/10 ml-1 hover:border-[var(--blue)]/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                    <h4 className="text-lg font-medium text-gray-200 group-hover:text-white transition-colors">
                      {role.title}
                    </h4>
                    <span className="text-sm font-mono text-[var(--orange)] bg-[var(--orange)]/10 px-3 py-1 rounded-full w-fit">
                      {role.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
