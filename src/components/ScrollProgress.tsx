"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Return nothing until mounted to avoid SSR hydration issues
    if (!mounted) {
        return null;
    }

    return <ScrollProgressContent />;
}

function ScrollProgressContent() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-[var(--blue)] origin-left z-50"
            style={{ scaleX }}
        />
    );
}
