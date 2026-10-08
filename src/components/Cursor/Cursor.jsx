import "./Cursor.css";
import { useEffect, useRef } from "react";
import { gsap, finePointer, reducedMotion } from "../../lib/gsap";

/* =========================================================
   RETICLE CURSOR
   Targeting reticle that locks on to anything clickable,
   with a short trail of cyan pixels. Mouse only.
========================================================= */

const INTERACTIVE = "a, button, [role='button'], input, .film-frame, .memory";

export default function Cursor() {
  const reticleRef = useRef(null);
  const trailRef = useRef(null);

  useEffect(() => {
    if (!finePointer()) return;

    const reticle = reticleRef.current;
    const canvas = trailRef.current;
    const ctx = canvas.getContext("2d");
    const still = reducedMotion();
    const particles = [];
    let lastX = 0;
    let lastY = 0;

    document.documentElement.classList.add("has-reticle");

    const xTo = gsap.quickTo(reticle, "x", { duration: 0.18, ease: "power3.out" });
    const yTo = gsap.quickTo(reticle, "y", { duration: 0.18, ease: "power3.out" });

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const onMove = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
      reticle.classList.add("is-visible");

      const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
      if (!still && dist > 6) {
        particles.push({ x: e.clientX, y: e.clientY, life: 1 });
        lastX = e.clientX;
        lastY = e.clientY;
      }

      const target = e.target.closest?.(INTERACTIVE);
      reticle.classList.toggle("is-locked", Boolean(target));
    };

    const onDown = () => reticle.classList.add("is-down");
    const onUp = () => reticle.classList.remove("is-down");
    const onLeave = () => reticle.classList.remove("is-visible");

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= 0.045;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        const size = Math.max(1, Math.round(4 * p.life));
        ctx.globalAlpha = p.life * 0.7;
        ctx.fillStyle = "#3ff2ff";
        ctx.fillRect(Math.round(p.x - size / 2), Math.round(p.y - size / 2), size, size);
      }
      ctx.globalAlpha = 1;
    };

    resize();
    gsap.ticker.add(tick);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("pointerleave", onLeave);

    return () => {
      document.documentElement.classList.remove("has-reticle");
      gsap.ticker.remove(tick);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <>
      <canvas className="cursor-trail" ref={trailRef} aria-hidden="true" />
      <div className="reticle" ref={reticleRef} aria-hidden="true">
        <span className="reticle-ring" />
        <span className="reticle-dot" />
      </div>
    </>
  );
}
