"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { identity, experience, projects } from "@/lib/data";
import { FaDownload, FaCode, FaLaptopCode, FaBrain } from "react-icons/fa6";

export default function About() {
    // Calculate dynamic stats
    const totalProjects = projects.length;
    // Approximation for years of experience (assuming start date around 2023 based on data)
    const yearsOfExperience = new Date().getFullYear() - 2023;
    const companiesWorkedWith = experience.length;

    const stats = [
        { label: "Years Experience", value: `${yearsOfExperience}+`, icon: FaLaptopCode },
        { label: "Projects Completed", value: "17+", icon: FaCode },
        { label: "Organizations", value: `${companiesWorkedWith}`, icon: FaBrain },
    ];

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left: Image & Stats */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative"
                >
                    <div className="relative z-10 rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
                        <Image
                            src="/Nisarg_about.png"
                            alt={identity.name}
                            width={500}
                            height={500}
                            className="w-full h-auto object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-105"
                        />

                        {/* Floating Badge */}
                        <div className="absolute bottom-6 left-6 right-6 bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex justify-between items-center">
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider">Current Focus</p>
                                <p className="text-white font-semibold">Generative AI & Computer Vision</p>
                            </div>
                        </div>
                    </div>

                    {/* Decor Elements */}
                    <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-[var(--orange)] rounded-full blur-2xl opacity-20" />
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-[var(--purple)] rounded-full blur-3xl opacity-20" />
                </motion.div>

                {/* Right: Content */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <h2 className="text-sm font-bold text-[var(--blue)] uppercase tracking-widest mb-3">About Me</h2>
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                        Architecting Intelligence, <br />
                        <span className="text-gray-400">One Model at a Time.</span>
                    </h3>

                    <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                        Just another passionate <span className="text-white font-semibold">AI Engineer</span> and <span className="text-white font-semibold">Cloud Practitioner</span> based in {identity.location}.
                        My journey involves bridging the gap between theoretical AI research and practical, scalable applications.
                    </p>

                    <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                        From building <strong>RAG-based chatbots</strong> to deploying <strong>Computer Vision pipelines</strong> for industrial safety, I thrive on solving complex problems.
                        Currently, I am actively leading tech communities at Silver Oak University, fostering innovation in Cloud and AI.
                    </p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4 mb-10">
                        {stats.map((stat, index) => (
                            <div key={index} className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center hover:bg-white/10 transition-colors">
                                <stat.icon className="text-[var(--blue)] text-2xl mx-auto mb-2" />
                                <h4 className="text-2xl font-bold text-white">{stat.value}</h4>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    <a
                        href="/resume.pdf"
                        target="_blank"
                        className="inline-flex items-center gap-2 bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors"
                    >
                        <FaDownload />
                        Download CV
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
