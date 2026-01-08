"use client";

import { motion } from "framer-motion";
import { Link as ScrollLink } from "react-scroll";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="relative bg-black text-white pt-20 pb-0 overflow-hidden">
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-32 z-10 relative">
                {/* Brand Column */}
                <div className="col-span-1">
                    <h3 className="text-2xl font-bold font-mono mb-4 text-white">
                        Nisarg.ai
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        Building intelligent systems that bridge the gap between complex AI and real-world application.
                    </p>
                </div>

                {/* Navigation */}
                <div className="col-span-1">
                    <h4 className="text-sm font-semibold tracking-wider text-gray-500 uppercase mb-6">
                        Navigation
                    </h4>
                    <ul className="space-y-3">
                        {["Hero", "Experience", "Projects", "Contact"].map((item) => (
                            <li key={item}>
                                <ScrollLink
                                    to={item.toLowerCase()}
                                    smooth={true}
                                    duration={500}
                                    className="text-gray-300 hover:text-[var(--blue)] cursor-pointer text-sm transition-colors"
                                >
                                    {item}
                                </ScrollLink>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Socials */}
                <div className="col-span-1">
                    <h4 className="text-sm font-semibold tracking-wider text-gray-500 uppercase mb-6">
                        Connect
                    </h4>
                    <ul className="space-y-3">
                        {[
                            { name: "GitHub", icon: FaGithub, href: "https://github.com/nisarg" }, // Replace with actual links
                            { name: "LinkedIn", icon: FaLinkedin, href: "https://linkedin.com/in/nisarg" },
                            { name: "Twitter", icon: FaTwitter, href: "https://twitter.com/nisarg" },
                        ].map((social) => (
                            <li key={social.name}>
                                <a
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-gray-300 hover:text-[var(--purple)] text-sm transition-colors group"
                                >
                                    <social.icon className="text-lg group-hover:scale-110 transition-transform" />
                                    {social.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Legal / Copyright */}
                <div className="col-span-1">
                    <h4 className="text-sm font-semibold tracking-wider text-gray-500 uppercase mb-6">
                        Legal
                    </h4>
                    <ul className="space-y-3">
                        <li><a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">Privacy Policy</a></li>
                        <li><a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">Terms of Service</a></li>
                    </ul>
                    <p className="text-xs text-gray-600 mt-6">
                        © {new Date().getFullYear()} Nisarg Chauhan. All rights reserved.
                    </p>
                </div>
            </div>

            {/* Massive Typography Bottom */}
            <div className="w-full flex justify-center items-end select-none pointer-events-none">
                <motion.h1
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="text-[15vw] leading-[0.8] font-bold text-white/[0.2] tracking-tight pointer-events-none select-none"
                >
                    NISARG
                </motion.h1>
            </div>

            {/* Subtle Gradient Overlay at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
        </footer>
    );
};

export default Footer;
