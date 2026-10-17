import "./Loader.css";
import { useRef, useState } from "react";
import { gsap, useGSAP, reducedMotion } from "../../lib/gsap";
import { ui } from "../../lib/uiStore";
import { lockScroll } from "../../lib/scroll";
import { BOARD_PHOTO, LOGO_SRC } from "../../data/content";

/* =========================================================
   LOADER
   Two rings of "WELCOME TO COMSOC" spin in opposite
   directions around IEEE while fonts and key images load.
   On exit the rings zoom past the camera and the rocket
   launch begins.
========================================================= */

const PHRASE = "WELCOME TO COMSOC - ";
const MIN_SHOW = 2.4; // seconds, so the loader never just flashes
const C = 300; // svg centre
const OUTER_R = 252;
const INNER_R = 168;

const circle = (r) => `M${C - r},${C} a${r},${r} 0 1,1 ${r * 2},0 a${r},${r} 0 1,1 ${-r * 2},0`;

const preload = (src) =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = img.onerror = resolve;
    img.src = src;
  });

export default function Loader() {
  const [gone, setGone] = useState(false);
  const rootRef = useRef(null);

  useGSAP(
    (context, contextSafe) => {
      const root = rootRef.current;
      const q = gsap.utils.selector(root);
      const pctEl = q(".loader-pct")[0];
      const progress = { v: 0 };
      let exiting = false;

      lockScroll(true);

      const showProgress = () => {
        pctEl.textContent = `${String(Math.round(progress.v)).padStart(2, "0")}%`;
      };

      const exit = contextSafe((fast) => {
        if (exiting) return;
        exiting = true;
        lockScroll(false);

        gsap
          .timeline({ onComplete: () => setGone(true) })
          .to(progress, { v: 100, duration: fast ? 0 : 0.35, onUpdate: showProgress })
          .call(() => ui.set({ loaded: true }), null, fast ? 0 : 0.55)
          .to(q(".loader-rings"), { scale: 2.6, opacity: 0, duration: fast ? 0.2 : 0.9, ease: "power3.in" }, fast ? 0 : 0.3)
          .to(q(".loader-center"), { scale: 0.4, opacity: 0, filter: "blur(8px)", duration: fast ? 0.2 : 0.6, ease: "power2.in" }, "<")
          .to(q(".loader-status, .loader-deco"), { opacity: 0, duration: 0.3 }, "<")
          .to(root, { opacity: 0, duration: fast ? 0.2 : 0.5 }, fast ? 0.1 : 0.85);
      });

      /* Entrance */
      gsap.from(q(".loader-rings"), { scale: 0.6, opacity: 0, duration: 1.1, ease: "power3.out" });
      gsap.from(q(".loader-center"), { opacity: 0, scale: 1.3, duration: 0.8, delay: 0.25, ease: "power3.out" });

      /* Fake-but-honest progress: crawls to 90%, finishes when assets are in */
      gsap.to(progress, { v: 90, duration: MIN_SHOW, ease: "power1.out", onUpdate: showProgress });

      const minTime = new Promise((resolve) => setTimeout(resolve, (reducedMotion() ? 0.3 : MIN_SHOW) * 1000));
      Promise.all([document.fonts.ready, preload(LOGO_SRC), preload(BOARD_PHOTO), minTime]).then(() => exit(false));

      /* The hero's skip (Esc / Enter / Space) also skips the loader */
      const unsubscribe = ui.subscribe(() => {
        if (ui.get().introDone) exit(true);
      });

      return () => {
        unsubscribe();
        if (!exiting) lockScroll(false);
        exiting = true;
      };
    },
    { scope: rootRef }
  );

  if (gone) return null;

  return (
    <div className="loader" ref={rootRef} role="status" aria-label="Loading IEEE ComSoc">
      <div className="loader-glow" />

      <div className="loader-deco" aria-hidden="true">
        <span className="glow-square" style={{ right: "9%", top: "6%", width: 58, height: 58 }} />
        <span className="glow-square" style={{ right: "15%", top: "14%", width: 58, height: 58, "--dx": "-12px" }} />
        <span className="glow-square" style={{ left: "13%", bottom: "14%", width: 76, height: 76, "--dy": "16px" }} />
        <span className="loader-dots" />
        <span className="loader-arc" />
      </div>

      <svg className="loader-rings" viewBox="0 0 600 600" aria-hidden="true">
        <defs>
          <path id="loader-outer" d={circle(OUTER_R)} />
          <path id="loader-inner" d={circle(INNER_R)} />
        </defs>

        <g className="ring ring-outer">
          <text className="ring-text">
            <textPath href="#loader-outer" textLength={Math.floor(2 * Math.PI * OUTER_R)} lengthAdjust="spacing">
              {PHRASE.repeat(4)}
            </textPath>
          </text>
        </g>

        <g className="ring ring-inner">
          <text className="ring-text is-inner">
            <textPath href="#loader-inner" textLength={Math.floor(2 * Math.PI * INNER_R)} lengthAdjust="spacing">
              {PHRASE.repeat(3)}
            </textPath>
          </text>
        </g>
      </svg>

      <div className="loader-center">
        <span className="loader-ieee">IEEE</span>
      </div>

      <p className="loader-status">
        ESTABLISHING UPLINK <span className="loader-pct">00%</span>
      </p>
    </div>
  );
}
