"use client";

import { motion } from "framer-motion";
import { Link as ScrollLink } from "react-scroll";
import { useState, useEffect } from "react";

const navLinks = [
    { name: "About Me", to: "about" },
    { name: "Experience", to: "experience" },
    { name: "Projects", to: "projects" },
    { name: "Journey", to: "journey" },
    { name: "Contact", to: "contact" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -100, width: "auto" }}
            animate={{
                y: 0,
                width: scrolled ? "100%" : "auto",
                top: scrolled ? "0px" : "24px",
                borderRadius: scrolled ? "0px" : "9999px",
                padding: scrolled ? "16px 0" : "12px 32px",
                backgroundColor: scrolled ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.05)",
                borderColor: scrolled ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(12px)",
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={`fixed z-50 left-1/2 -translate-x-1/2 border transition-all duration-300 flex items-center justify-between ${scrolled
                ? "border-b border-white/5"
                : "border border-white/10 shadow-lg shadow-purple-500/10"
                }`}
            style={{
                maxWidth: scrolled ? "100%" : "1152px", // Constraints max width in capsule mode
            }}
        >
            <div className={`flex justify-between items-center w-full px-6 gap-12 ${scrolled ? "max-w-6xl mx-auto" : ""}`}>
                <ScrollLink
                    to="hero"
                    smooth={true}
                    duration={500}
                    className="text-xl font-bold font-mono text-white cursor-pointer hover:text-[var(--blue)] transition-colors"
                >
                    Nisarg.ai
                </ScrollLink>

                <div className="flex gap-8">
                    {navLinks.map((link) => (
                        <ScrollLink
                            key={link.name}
                            to={link.to}
                            smooth={true}
                            duration={500}
                            offset={-100}
                            className="text-sm font-medium text-white hover:text-[var(--purple)] cursor-pointer transition-colors relative group"
                        >
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--purple)] group-hover:w-full transition-all duration-300" />
                        </ScrollLink>
                    ))}
                </div>
            </div>
        </motion.nav>
    );
}
