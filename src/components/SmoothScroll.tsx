"use client";

import { useEffect, useState } from "react";
import { ReactLenis } from "lenis/react";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Only render lenis on client side to avoid SSR issues
    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
            {children}
        </ReactLenis>
    );
}
