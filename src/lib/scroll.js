import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap";

/* =========================================================
   SMOOTH SCROLL (Lenis driven by the GSAP ticker)
========================================================= */

let lenis = null;
let lockCount = 0;

/* Live values read every frame by the starfield / rocket */
export const scrollState = {
  velocity: 0,
  y: 0,
};

export function initScroll() {
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);

  lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95 });

  lenis.on("scroll", (instance) => {
    scrollState.velocity = instance.velocity;
    scrollState.y = instance.scroll;
    ScrollTrigger.update();
  });

  const tick = (time) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(tick);
    lenis?.destroy();
    lenis = null;
  };
}

export function scrollToSection(id, options = {}) {
  const target = id === "top" ? 0 : document.getElementById(id);
  if (target === null) return;

  if (lenis) {
    lenis.scrollTo(target, { duration: 1.6, force: true, ...options });
  } else if (target === 0) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    target.scrollIntoView({ behavior: "smooth" });
  }
}

/* Nested locks: intro, modals, terminal and the arcade can overlap */
export function lockScroll(locked) {
  lockCount = Math.max(0, lockCount + (locked ? 1 : -1));
  const isLocked = lockCount > 0;

  if (isLocked) lenis?.stop();
  else lenis?.start();

  document.documentElement.classList.toggle("is-locked", isLocked);
}
