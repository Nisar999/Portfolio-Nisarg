"use client";

import { useRef, useEffect } from "react";
import {
    SiNextdotjs,
    SiReact,
    SiTailwindcss,
    SiTypescript,
    SiPython,
    SiTensorflow,
    SiPytorch,
    SiOpencv,
    SiGooglegemini,
    SiAmazon,
    SiNodedotjs,
    SiDocker,
    SiGit,
    SiMongodb,
} from "react-icons/si";
import { FaBrain, FaRobot } from "react-icons/fa6";

// Skill Data
const skills = [
    { name: "Next.js", icon: SiNextdotjs },
    { name: "React", icon: SiReact },
    { name: "Tailwind", icon: SiTailwindcss },
    { name: "TypeScript", icon: SiTypescript },
    { name: "Python", icon: SiPython },
    { name: "TensorFlow", icon: SiTensorflow },
    { name: "PyTorch", icon: SiPytorch },
    { name: "OpenCV", icon: SiOpencv },
    { name: "GenAI", icon: SiGooglegemini },
    { name: "AWS", icon: SiAmazon },
    { name: "Docker", icon: SiDocker },
    { name: "Git", icon: SiGit },
    { name: "NLP", icon: FaBrain },
    { name: "Vision", icon: FaRobot },
    { name: "Node.js", icon: SiNodedotjs },
];

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    element: HTMLDivElement | null;
    isDragging: boolean;
}

export default function SkillsConstellation() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const dragRef = useRef<{ id: number; offsetX: number; offsetY: number } | null>(null);
    const animationRef = useRef<number | null>(null);

    // Initialize Particles & Animation
    useEffect(() => {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas) return;

        // Set Canvas Size
        const resizeCanvas = () => {
            if (container && canvas) {
                canvas.width = container.offsetWidth;
                canvas.height = container.offsetHeight;
            }
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);


        // Create particles immediately
        const { width, height } = container.getBoundingClientRect();
        if (particlesRef.current.length === 0) {
            particlesRef.current = skills.map(() => ({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                element: null,
                isDragging: false,
            }));
        }

        // Mouse handlers
        const handleMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            mouseRef.current = { x, y };

            // Drag Logic
            if (dragRef.current !== null) {
                const p = particlesRef.current[dragRef.current.id];
                if (p) {
                    p.x = x - dragRef.current.offsetX;
                    p.y = y - dragRef.current.offsetY;
                    p.vx = 0;
                    p.vy = 0;
                }
            }
        };

        const handleMouseLeave = () => {
            mouseRef.current = { x: -1000, y: -1000 };
            // Optional: Release drag on leave? 
            // Better to keep dragging if we want to support edge-dragging, 
            // but for "in their space" keeping it strict is fine.
            if (dragRef.current) {
                const p = particlesRef.current[dragRef.current.id];
                if (p) p.isDragging = false;
                dragRef.current = null;
            }
        };

        const handleMouseUp = () => {
            if (dragRef.current) {
                const p = particlesRef.current[dragRef.current.id];
                if (p) {
                    p.isDragging = false;
                    // Give a little "throw" velocity based on random jitter or calculate delta
                    p.vx = (Math.random() - 0.5) * 2;
                    p.vy = (Math.random() - 0.5) * 2;
                }
                dragRef.current = null;
            }
        };

        // For drag, we need window-level listeners for up/move to prevent getting stuck
        container.addEventListener('mousemove', handleMouseMove);
        // container.addEventListener('mouseleave', handleMouseLeave); // disable leave clearing to allow dragging slightly out
        window.addEventListener('mouseup', handleMouseUp);

        // We still reset mouse pos on leave for the friction field
        container.addEventListener('mouseleave', () => {
            mouseRef.current = { x: -1000, y: -1000 };
        });


        const ctx = canvas.getContext('2d');

        const animate = () => {
            if (!ctx || !container) return;

            const width = container.offsetWidth;
            const height = container.offsetHeight;

            ctx.clearRect(0, 0, width, height);
            ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
            ctx.lineWidth = 1;

            const particles = particlesRef.current;
            const mouse = mouseRef.current;

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                // Get element ref if missing (lazy binding)
                if (!p.element) {
                    const el = document.getElementById(`skill-icon-${i}`) as HTMLDivElement;
                    if (el) {
                        p.element = el;
                        // Attach separate mousedown handler
                        el.onmousedown = (e) => {
                            e.preventDefault(); // Prevent text selection
                            const rect = el.getBoundingClientRect();
                            // Calculate offset from center of particle to mouse click
                            // Actually p.x/p.y is center, so just 0,0 is fine for "grabbing" center
                            // But for precision:
                            // p.x is top-left in CSS translate? No, usually center because of -ml-6 -mt-6
                            // Let's assume p.x/p.y is center.
                            p.isDragging = true;
                            dragRef.current = { id: i, offsetX: 0, offsetY: 0 };
                        };
                    }
                }

                if (!p.isDragging) {
                    // Physics
                    const dx = p.x - mouse.x;
                    const dy = p.y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const interactionRadius = 200;

                    if (dist < interactionRadius) {
                        // "Time Dilation" / Friction Field
                        p.vx *= 0.90;
                        p.vy *= 0.90;
                    }

                    p.x += p.vx;
                    p.y += p.vy;

                    p.vx *= 0.99;
                    p.vy *= 0.99;

                    const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                    if (speed < 0.1) {
                        p.vx += (Math.random() - 0.5) * 0.05;
                        p.vy += (Math.random() - 0.5) * 0.05;
                    }

                    // Wall bounce
                    if (p.x <= 20 || p.x >= width - 20) p.vx *= -1;
                    if (p.y <= 20 || p.y >= height - 20) p.vy *= -1;
                }

                // Clamp positions
                p.x = Math.max(20, Math.min(width - 20, p.x));
                p.y = Math.max(20, Math.min(height - 20, p.y));

                // Apply transform directly
                if (p.element) {
                    p.element.style.transform = `translate(${p.x}px, ${p.y}px)`;
                    p.element.style.cursor = p.isDragging ? 'grabbing' : 'grab';
                    p.element.style.zIndex = p.isDragging ? '100' : '10';
                }

                // Draw Lines
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx2 = p.x - p2.x;
                    const dy2 = p.y - p2.y;
                    const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

                    if (dist2 < 180) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.globalAlpha = 1 - dist2 / 180;
                        ctx.stroke();
                    }
                }
            }
            ctx.globalAlpha = 1;

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            container.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            // container.removeEventListener('mouseleave', handleMouseLeave);
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, []);

    return (
        <section
            ref={containerRef}
            className="h-[50vh] min-h-[400px] relative overflow-hidden bg-black/90 flex items-center justify-center group select-none"
        >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                <h3 className="text-white/5 text-[15vw] font-bold tracking-tighter select-none">
                    SKILLS
                </h3>
            </div>

            <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

            <div className="absolute inset-0 z-10 pointer-events-none">
                {skills.map((skill, i) => (
                    <div
                        key={i}
                        id={`skill-icon-${i}`} // Added ID for reliable lookup
                        className="absolute left-0 top-0 w-12 h-12 -ml-6 -mt-6 rounded-full bg-black/60 border border-white/20 backdrop-blur-md flex items-center justify-center shadow-lg will-change-transform pointer-events-auto group/icon hover:z-50 cursor-grab active:cursor-grabbing"
                    >
                        <skill.icon className="text-xl text-gray-300 pointer-events-none group-hover/icon:text-[var(--blue)] group-hover/icon:scale-125 transition-all duration-300" />

                        {/* Tooltip */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-[var(--blue)] text-black text-xs font-bold rounded opacity-0 group-hover/icon:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            {skill.name}
                        </div>
                    </div>
                ))}
            </div>

            <p className="absolute bottom-4 text-white/20 text-xs font-mono pointer-events-none">
                Stellar Skill Constellation • Interactive Gravity Enabled
            </p>
        </section>
    );
}
