"use client";

import { certifications } from "@/lib/data";
import SpotlightCard from "@/components/SpotlightCard";
import { motion } from "framer-motion";
import { FaAward, FaArrowUpRightFromSquare } from "react-icons/fa6";
import { SiGooglecloud, SiAmazonwebservices } from "react-icons/si";

const iconMap: Record<string, React.ReactNode> = {
    "Google Cloud": <SiGooglecloud className="text-yellow-400" />,
    "Amazon Web Services": <SiAmazonwebservices className="text-orange-400" />,
    "AI CERT™": <FaAward className="text-blue-400" />,
};

export default function Certifications() {
    return (
        <section className="py-24 relative overflow-hidden" id="certifications">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Certifications & Badges</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Continuous learning and validation of skills through industry-recognized certifications.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certifications.map((cert, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <SpotlightCard className="h-full bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors group">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="text-4xl">
                                        {iconMap[cert.issuer] || <FaAward className="text-purple-400" />}
                                    </div>
                                    <a
                                        href={cert.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-500 hover:text-white transition-colors"
                                    >
                                        <FaArrowUpRightFromSquare />
                                    </a>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2 leading-relaxed group-hover:text-[var(--blue)] transition-colors">
                                        {cert.title}
                                    </h3>
                                    <p className="text-sm text-gray-400 font-mono border-t border-white/10 pt-4 mt-4 inline-block">
                                        {cert.issuer}
                                    </p>
                                </div>
                            </SpotlightCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
