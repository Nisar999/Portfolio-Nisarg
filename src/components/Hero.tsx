"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useMotionPreference } from "@/hooks";
import { useLoading } from "@/context/LoadingContext";

export default function Hero() {
  const prefersReducedMotion = useMotionPreference();
  const { isLoading } = useLoading();
  const [skipActive, setSkipActive] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const [introReady, setIntroReady] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      setSkipActive(true);
      setIntroReady(true);
      return;
    }

    if (!isLoading) {
      setIntroReady(true);
    }
  }, [isLoading, prefersReducedMotion]);

  const handleSkip = useCallback(() => {
    setSkipActive(true);
  }, []);

  const handleReplay = useCallback(() => {
    setSkipActive(false);
    setReplayKey((key) => key + 1);
  }, []);

  const stageClass = [
    "hero-stage",
    skipActive ? "skip-active" : "",
    introReady ? "intro-ready" : "intro-pending",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      key={replayKey}
      className={stageClass}
      aria-label="Hero introduction"
    >
      <div className="ship-track" aria-hidden="true">
        <div className="ship-glow" />
        <div className="ship-bob">
          <div className="ship-cutout">
            <Image
              src="/hero/ship-sprite.png"
              alt=""
              width={640}
              height={360}
              className="ship-img"
              priority
              unoptimized
            />
          </div>
        </div>
      </div>

      <div className="hero-content">
        <h1>Nisarg Chauhan</h1>
        <p>
          AI Engineer · Community Leader · Architecting Intelligence One Model
          at a Time
        </p>
      </div>

      <div className="hero-scroll-cue" aria-hidden="true">
        <span>Scroll</span>
        <div className="line" />
      </div>

      {introReady && !prefersReducedMotion && !skipActive && (
        <button type="button" className="hero-skip-btn" onClick={handleSkip}>
          Skip intro
        </button>
      )}

      {introReady && !prefersReducedMotion && (
        <button type="button" className="hero-replay-btn" onClick={handleReplay}>
          ↻ Replay
        </button>
      )}
    </section>
  );
}
