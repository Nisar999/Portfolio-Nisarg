"use client";

import { motion } from "framer-motion";
import { education } from "@/lib/data";
import { FaGraduationCap } from "react-icons/fa6";
import SpotlightCard from "./SpotlightCard";

export default function Education() {
    return (
        <section className="py-24 relative overflow-hidden" id="education">
            <div className="max-w-4xl mx-auto px-6">
                {/* Section Title */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <FaGraduationCap className="text-[var(--blue)] text-xl" />
                        <h2 className="text-sm font-bold text-[var(--blue)] uppercase tracking-widest">Academic Journey</h2>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold text-white">Education</h3>
                </motion.div>

                {/* Education Timeline/List */}
                <div className="space-y-6">
                    {education.map((edu, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <SpotlightCard className="p-8 border border-white/10 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors group">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-white group-hover:text-[var(--blue)] transition-colors">
                                            {edu.degree}
                                        </h3>
                                        <p className="text-gray-400 mt-1">{edu.institution}</p>
                                    </div>
                                    <div className="shrink-0">
                                        <span className="inline-block px-4 py-1 rounded-full bg-white/10 border border-white/5 text-sm text-gray-300 font-mono">
                                            {edu.time}
                                        </span>
                                    </div>
                                </div>
                            </SpotlightCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
