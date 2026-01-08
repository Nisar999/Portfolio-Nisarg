"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLoading } from "@/context/LoadingContext";

export default function Preloader() {
    const { isLoading, setIsLoading } = useLoading();

    useEffect(() => {
        // Disable scrolling
        document.body.style.overflow = "hidden";

        // Play animation for a fixed time (e.g. 2.5 seconds)
        const timeout = setTimeout(() => {
            setIsLoading(false);
        }, 2500);

        return () => clearTimeout(timeout);
    }, [setIsLoading]);

    useEffect(() => {
        if (!isLoading) {
            setTimeout(() => {
                document.body.style.overflow = "auto";
            }, 1000);
        }
    }, [isLoading]);

    return (
        <AnimatePresence mode="wait">
            {isLoading && (
                <motion.div
                    key="preloader"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
                >
                    <div className="flex flex-col items-center gap-8">
                        {/* Custom CSS Loader */}
                        <div className="loader"></div>

                        <p className="text-gray-500 text-xs uppercase tracking-[0.3em] animate-pulse">
                            COLLECTING
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
