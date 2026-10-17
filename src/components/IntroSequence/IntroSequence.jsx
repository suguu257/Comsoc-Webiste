
import { useCallback, useEffect, useState } from "react";
import "./IntroSequence.css";

import CircularText from "../Hero/CircularText";
import HyperspeedTransition from "../Hyperspeed/HyperspeedTransition";

export default function IntroSequence({ onComplete }) {
  const [phase, setPhase] = useState("circular");

  // Stage 1: show the circular text for 3 seconds.
  useEffect(() => {
    if (phase !== "circular") return;

    const timer = window.setTimeout(() => {
      setPhase("hyperspeed");
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [phase]);

  // Stage 2: finish the hyperspeed transition.
  const finishHyperspeed = useCallback(() => {
    setPhase("complete");
    onComplete?.();
  }, [onComplete]);

  if (phase === "complete") return null;

  return (
    <>
      {phase === "circular" && (
        <section className="intro-sequence">
          <div className="intro-rings">
            <div className="outerRing">
              <CircularText
                text="WELCOME TO COMSOC • WELCOME TO COMSOC • "
                radius={245}
              />
            </div>

            <div className="innerRing">
              <CircularText
                text="IEEE VIT VELLORE • IEEE VIT VELLORE • "
                radius={180}
                reverse
              />
            </div>

            <div className="intro-center">
              <p>IEEE</p>
              <h1>COMSOC</h1>
              <span>CONNECTING THE FUTURE</span>
            </div>
          </div>
        </section>
      )}

      <HyperspeedTransition
        active={phase === "hyperspeed"}
        onComplete={finishHyperspeed}
      />
    </>
  );
}
