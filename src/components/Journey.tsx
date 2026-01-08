"use client";

import { motion, useAnimationFrame, useMotionValue, useTransform, wrap } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

interface JourneyProps {
    images: string[];
}

export default function Journey({ images }: JourneyProps) {
    const baseVelocity = 0.05; // Extremely slow base speed (Glacial)

    // We track target speed factor and current actual speed factor for smoothing
    const slowFactor = useRef<number>(0.5); // The target factor (1 or 0.1)
    const currentFactor = useRef<number>(0.5); // The actual running factor

    return (
        <section className="py-32 max-w-full overflow-hidden">
            <div className="max-w-6xl mx-auto px-6 mb-12">
                <h2 className="text-3xl md:text-4xl font-semibold">Journey</h2>
                <p className="text-gray-400 mt-2">
                    Moments, milestones, and memories from events and conferences.
                </p>
            </div>

            <div
                className="relative flex w-full"
                onMouseEnter={() => slowFactor.current = 0.1} // Ultra slow on hover (almost static)
                onMouseLeave={() => slowFactor.current = 0.5} // Resume gentle drift
            >
                {/* Gradient Masks */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

                <MarqueeContent
                    images={images}
                    baseVelocity={baseVelocity}
                    slowRef={slowFactor}
                    currentFactorRef={currentFactor} // Pass the smoother ref
                />
            </div>
        </section>
    );
}

function MarqueeContent({
    images,
    baseVelocity,
    slowRef,
    currentFactorRef
}: {
    images: string[],
    baseVelocity: number,
    slowRef: React.MutableRefObject<number>,
    currentFactorRef: React.MutableRefObject<number>
}) {
    const baseX = useMotionValue(0);

    useAnimationFrame((time, delta) => {
        // Smoothly interpolate currentFactor towards slowRef
        // lerp(start, end, alpha) -> current = current + (target - current) * 0.05
        currentFactorRef.current += (slowRef.current - currentFactorRef.current) * 0.05;

        const moveBy = baseVelocity * (delta / 16) * currentFactorRef.current;
        baseX.set(baseX.get() + moveBy);
    });

    return (
        <motion.div
            className="flex gap-6 flex-nowrap"
            style={{ x: useTransform(baseX, v => `${wrap(-50, 0, v)}%`) }}
        >
            {[...images, ...images].map((img, i) => (
                <div
                    key={`${img}-${i}`}
                    className="relative w-[400px] h-[250px] md:w-[500px] md:h-[300px] flex-shrink-0 rounded-2xl overflow-hidden border border-white/10 bg-white/5"
                >
                    <Image
                        src={img}
                        alt={`Journey moment`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 400px, 500px"
                    />
                </div>
            ))}
        </motion.div>
    )
}
