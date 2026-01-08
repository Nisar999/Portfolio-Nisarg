"use client";

import { projects, identity } from "@/lib/data";
import SpotlightCard from "@/components/SpotlightCard";
import { motion } from "framer-motion";
import {
  SiPython,
  SiReact,
  SiTensorflow,
  SiPytorch,
  SiOpencv,
  SiPandas,
  SiGooglecloud,
} from "react-icons/si";
import { FaCode, FaRobot } from "react-icons/fa6";

const iconMap: Record<string, React.ReactNode> = {
  Python: <SiPython />,
  React: <SiReact />,
  TensorFlow: <SiTensorflow />,
  PyTorch: <SiPytorch />,
  OpenCV: <SiOpencv />,
  GeoPandas: <SiPandas />,
  YOLOv8: <FaRobot />,
  YOLOv5: <FaRobot />,
  "Mask R-CNN": <FaCode />,
  MediaPipe: <FaCode />,
  Sklearn: <SiPandas />, // Using Pandas icon as generic data science placeholder
  Streamlit: <FaCode />,
  Deepface: <FaRobot />,
  "Node.js": <FaCode />,
  GCP: <SiGooglecloud />,
  audiosegment: <SiPython />,
  threading: <FaCode />,
};

export default function Projects() {
  return (
    <section className="py-24 max-w-6xl mx-auto px-6">
      <h2 className="text-3xl font-semibold mb-10">Projects</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {projects.map((p, i) => (
          <a
            key={i}
            href={identity.github}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-full"
          >
            <SpotlightCard
              className={`transition-colors h-full ${p.title === "+ AND COUNTING..."
                ? "border-dashed border-white/10 bg-white/5" // Distinct styling for the last card
                : "hover:border-[var(--orange)]/50"
                }`}
              spotlightColor={
                p.title === "+ AND COUNTING..."
                  ? "rgba(255, 255, 255, 0.1)" // Subtle white glow for the counter
                  : "rgba(255, 126, 33, 0.2)"
              }
            >
              {p.title === "+ AND COUNTING..." ? (
                <div className="p-6 h-full flex flex-col items-center justify-center text-center min-h-[200px]">
                  <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500 mb-2">
                    {p.title}
                  </h3>
                  <p className="text-sm text-gray-500 font-medium tracking-wide">
                    {p.desc}
                  </p>
                </div>
              ) : (
                <div className="p-6 h-full flex flex-col justify-between">
                  <div>
                    <h3 className="font-medium mb-2 group-hover:text-[var(--orange)] transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">{p.desc}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-auto">
                    {p.tags?.map((tag) => (
                      <span
                        key={tag.name}
                        className="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-white/5 text-gray-300 border border-white/5 transition-all z-10"
                      >
                        {iconMap[tag.name] && (
                          <span className="text-[var(--blue)]">
                            {iconMap[tag.name]}
                          </span>
                        )}
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </SpotlightCard>
          </a>
        ))}
      </div>
    </section>
  );
}
