import "./Starfield.css";
import { useEffect, useRef } from "react";
import { gsap, reducedMotion } from "../../lib/gsap";
import { scrollState } from "../../lib/scroll";
import { unlock } from "../../game/gameStore";

/* =========================================================
   STARFIELD
   One fixed canvas behind the whole site. Three depth
   layers parallax with scroll and the mouse; stars stretch
   into warp streaks when the user scrolls fast.
========================================================= */

const LAYERS = [
  { depth: 0.15, density: 1 / 5200, size: [1, 1], alpha: [0.15, 0.45] },
  { depth: 0.4, density: 1 / 14000, size: [1, 2], alpha: [0.3, 0.7] },
  { depth: 0.9, density: 1 / 42000, size: [2, 3], alpha: [0.6, 1] },
];

const rand = (min, max) => min + Math.random() * (max - min);

export default function Starfield() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const still = reducedMotion();

    let w = 0;
    let h = 0;
    let stars = [];
    let meteors = [];
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let smoothVelocity = 0;

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      stars = LAYERS.flatMap((layer) =>
        Array.from({ length: Math.round(w * h * layer.density) }, () => ({
          x: Math.random() * w,
          y: Math.random() * h,
          size: Math.round(rand(...layer.size)),
          alpha: rand(...layer.alpha),
          phase: Math.random() * Math.PI * 2,
          speed: rand(0.6, 2),
          blue: Math.random() < 0.12,
          depth: layer.depth,
        }))
      );
    };

    const onMove = (e) => {
      mouse.tx = (e.clientX / w - 0.5) * 2;
      mouse.ty = (e.clientY / h - 0.5) * 2;
    };

    const spawnMeteor = () => {
      meteors.push({
        x: rand(w * 0.2, w * 1.1),
        y: rand(-h * 0.1, h * 0.4),
        len: rand(80, 160),
        life: 0,
        speed: rand(9, 14),
      });
    };

    const draw = (time) => {
      const t = time;
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;

      const v = still ? 0 : scrollState.velocity;
      smoothVelocity += (v - smoothVelocity) * 0.15;
      if (Math.abs(v) > 90) unlock("speed-demon");

      ctx.clearRect(0, 0, w, h);

      for (const s of stars) {
        const py = (((s.y - scrollState.y * s.depth * 0.35 - mouse.y * 14 * s.depth) % h) + h) % h;
        const px = (((s.x - mouse.x * 18 * s.depth) % w) + w) % w;
        const twinkle = 0.65 + 0.35 * Math.sin(t * s.speed + s.phase);

        ctx.globalAlpha = s.alpha * twinkle;
        ctx.fillStyle = s.blue ? "#8ecbff" : "#ffffff";

        const streak = smoothVelocity * s.depth * 1.6;
        if (Math.abs(streak) > 2) {
          ctx.fillRect(px, py - Math.max(streak, 0), s.size, Math.abs(streak) + s.size);
        } else {
          ctx.fillRect(px, py, s.size, s.size);
        }
      }

      /* Meteors */
      if (!still && Math.random() < 0.003) spawnMeteor();
      meteors = meteors.filter((m) => m.life < 1);
      for (const m of meteors) {
        m.life += 0.012;
        m.x -= m.speed;
        m.y += m.speed * 0.55;
        const fade = Math.sin(m.life * Math.PI);
        const grad = ctx.createLinearGradient(m.x, m.y, m.x + m.len, m.y - m.len * 0.55);
        grad.addColorStop(0, `rgba(190,230,255,${0.8 * fade})`);
        grad.addColorStop(1, "rgba(190,230,255,0)");
        ctx.globalAlpha = 1;
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x + m.len, m.y - m.len * 0.55);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
    };

    build();
    gsap.ticker.add(draw);
    window.addEventListener("resize", build);
    window.addEventListener("pointermove", onMove);

    return () => {
      gsap.ticker.remove(draw);
      window.removeEventListener("resize", build);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div className="starfield" aria-hidden="true">
      <div className="nebula nebula-a" />
      <div className="nebula nebula-b" />
      <div className="nebula nebula-c" />
      <canvas ref={canvasRef} />
      <div className="vignette" />
    </div>
  );
}
