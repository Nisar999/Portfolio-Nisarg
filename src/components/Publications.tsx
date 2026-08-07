"use client";

import { publications } from "@/lib/data";
import { motion } from "framer-motion";

export default function Publications() {
  return (
    <section className="py-24 max-w-4xl mx-auto px-6 relative">
      <h2 className="text-3xl font-semibold mb-12">Publications</h2>

      <div className="space-y-8">
        {publications.map((paper, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative group"
          >
            {/* Paper Card */}
            <div className="relative p-6 md:p-8 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-[var(--blue)]/30 transition-all duration-300">
              {/* Decorative element */}
              <div className="absolute inset-0 rounded-2xl bg-[var(--blue)]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              <div className="relative z-10">
                {/* Title and Icon */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 pt-1">
                    <div className="w-10 h-10 rounded-lg bg-[var(--blue)]/10 flex items-center justify-center group-hover:bg-[var(--blue)]/20 transition-colors">
                      📄
                    </div>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-white group-hover:text-gray-100 transition-colors leading-tight flex-1">
                    {paper.title}
                  </h3>
                </div>

                {/* Publication Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 ml-14">
                  {/* DOI */}
                  <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-widest text-gray-500 mb-1">DOI</span>
                    <code className="text-sm text-gray-300 font-mono bg-white/5 px-3 py-2 rounded-lg truncate group-hover:bg-white/10 transition-colors">
                      {paper.doi}
                    </code>
                  </div>

                  {/* Published & Indexed Status */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase tracking-widest text-gray-500">Published in</span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--blue)]/10 border border-[var(--blue)]/30 text-xs font-semibold text-[var(--blue)]">
                        <span className="w-1.5 h-1.5 bg-[var(--blue)] rounded-full" />
                        {paper.publishedIn}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase tracking-widest text-gray-500">Indexed in</span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--orange)]/10 border border-[var(--orange)]/30 text-xs font-semibold text-[var(--orange)]">
                        <span className="w-1.5 h-1.5 bg-[var(--orange)] rounded-full" />
                        {paper.indexedIn}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Link Button */}
                <div className="ml-14 flex gap-2">
                  <a
                    href={paper.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--blue)]/10 border border-[var(--blue)]/30 text-[var(--blue)] hover:bg-[var(--blue)]/20 hover:border-[var(--blue)]/50 transition-all duration-300 text-sm font-medium group-hover:translate-x-1"
                  >
                    View on IEEE Xplore
                    <span>↗</span>
                  </a>
                </div>
              </div>

              {/* Shine Effect on Hover */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none bg-gradient-to-r from-transparent via-white to-transparent" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Publication Badge/Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        viewport={{ once: true }}
        className="mt-12 p-6 rounded-2xl bg-[var(--blue)]/5 border border-white/10 backdrop-blur-sm"
      >
        <div className="flex items-start gap-4">
          <div className="text-2xl">📚</div>
          <div>
            <h4 className="font-semibold text-white mb-1">Academic Contributions</h4>
            <p className="text-sm text-gray-400">
              All papers are officially published in IEEE Xplore and indexed in Scopus, contributing to peer-reviewed research in advanced computational and networking domains.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
