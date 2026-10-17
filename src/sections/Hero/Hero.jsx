import "./Hero.css";
import { useMemo, useRef, useState, useEffect } from "react";
import { gsap, useGSAP, reducedMotion } from "../../lib/gsap";
import { ui } from "../../lib/uiStore";
import { lockScroll } from "../../lib/scroll";
import { dockTarget, rocketEl, setThrust } from "../../lib/rocket";
import { unlock, visitSector } from "../../game/gameStore";
import { sfx } from "../../game/sound";
import { LOGO_SRC } from "../../data/content";
import SignalFragment from "../../components/SignalFragment/SignalFragment";

/* =========================================================
   LAYOUTS (SVG user units)
   The title types itself out while the rocket launches,
   orbits the logo once and docks into the nav rail.
========================================================= */

const LAYOUTS = {
  wide: {
    W: 1600,
    H: 900,
    lines: [
      { text: "IEEE COMSOC", x: 800, y: 245, size: 100, length: 1150 },
      { text: "VIT VELLORE", x: 800, y: 340, size: 46, length: 860 },
    ],
    logo: { x: 800, y: 565, r: 88 },
    orbit: 145,
  },
  tall: {
    W: 900,
    H: 1500,
    lines: [
      { text: "IEEE", x: 450, y: 360, size: 150, length: 640 },
      { text: "COMSOC", x: 450, y: 530, size: 118, length: 760 },
      { text: "VIT VELLORE", x: 450, y: 640, size: 50, length: 720 },
    ],
    logo: { x: 450, y: 930, r: 110 },
    orbit: 185,
  },
};

const SPEED = 1100; // user units per second while flying
const EXTRUDE = 10; // depth of the pixel drop-shadow
const TYPE_STEP = 0.075; // seconds per character
const LINE_PAUSE = 0.25;

const pickLayout = () =>
  window.innerWidth / window.innerHeight < 0.9 ? "tall" : "wide";

/* Flight plan: lift off from the bottom, one clockwise orbit of the logo */
function buildFlight({ W, H, logo, orbit: R }) {
  const L = { x: logo.x - R, y: logo.y };
  const T = { x: logo.x, y: logo.y - R };
  const Rt = { x: logo.x + R, y: logo.y };
  const B = { x: logo.x, y: logo.y + R };
  const arc = (p) => `A${R},${R} 0 0 1 ${p.x},${p.y}`;

  return [
    {
      kind: "launch",
      d: `M${W / 2},${H + 110} C${W / 2},${H * 0.88} ${L.x},${L.y + R * 1.3} ${L.x},${L.y}`,
    },
    {
      kind: "orbit",
      d: `M${L.x},${L.y} ${arc(T)} ${arc(Rt)} ${arc(B)} ${arc(L)} ${arc(T)}`,
    },
  ];
}

/* =========================================================
   HERO
========================================================= */

export default function Hero() {
  const [layoutKey, setLayoutKey] = useState(pickLayout);
  const introDone = ui.use((s) => s.introDone);
  const layout = LAYOUTS[layoutKey];
  const flight = useMemo(() => buildFlight(layout), [layout]);

  const rootRef = useRef(null);
  const skipRef = useRef(() => {});

  /* Layout can change after the intro (rotate / resize) */
  useEffect(() => {
    const onResize = () => {
      if (ui.get().introDone) setLayoutKey(pickLayout());
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* -------------------------------------------------------
     INTRO: typewriter title + launch, orbit, dock
  ------------------------------------------------------- */
  useGSAP(
    (context, contextSafe) => {
      const root = rootRef.current;
      const rocket = rocketEl();
      const q = gsap.utils.selector(root);
      const cursor = q(".hero-cursor")[0];
      let finished = false;

      lockScroll(true);

      const complete = (instant) => {
        if (finished) return;
        finished = true;
        tl.kill();

        if (instant) {
          gsap.set(q(".hero-char"), { opacity: 1 });
          gsap.set(q(".hero-logo"), { autoAlpha: 1, scale: 1 });
          const target = dockTarget(0);
          if (target) gsap.set(rocket, { ...target, opacity: 1 });
        }

        gsap.to(cursor, { autoAlpha: 0, duration: 0.3 });
        gsap.to(q(".hero-hint"), { autoAlpha: 1, y: 0, duration: instant ? 0.3 : 0.7, ease: "power3.out" });
        setThrust(0.35);
        ui.set({ introDone: true });
        lockScroll(false);
        visitSector("home");
      };

      const dock = () => {
        const target = dockTarget(0);
        if (!target) return complete(true);

        const from = { x: gsap.getProperty(rocket, "x"), y: gsap.getProperty(rocket, "y") };
        gsap
          .timeline({ onComplete: () => complete(false) })
          .to(rocket, {
            motionPath: {
              path: [from, { x: (from.x + target.x) / 2, y: Math.min(from.y, target.y) - 40 }, { x: target.x, y: target.y }],
              curviness: 1.2,
              autoRotate: 90,
            },
            duration: 1.4,
            ease: "power2.inOut",
          })
          .to(rocket, { rotation: target.rotation, scale: target.scale, duration: 0.5, ease: "back.out(2.2)" });
      };

      /* Puts the cursor right after character `index` of a line's face text */
      const moveCursor = (lineIndex, charIndex) => {
        const face = q(`.hero-line[data-line="${lineIndex}"] .hero-face`)[0];
        if (!face || !cursor) return;
        const size = Number(face.getAttribute("font-size"));
        const end = face.getEndPositionOfChar(charIndex);
        cursor.setAttribute("x", end.x + size * 0.12);
        cursor.setAttribute("y", end.y - size * 0.875);
        cursor.setAttribute("width", size * 0.5);
        cursor.setAttribute("height", size * 0.875);
      };

      const tl = gsap.timeline({ paused: true });
      skipRef.current = contextSafe(() => complete(true));

      /* Starting state */
      gsap.set(q(".hero-char"), { opacity: 0 });
      gsap.set(q(".hero-logo"), { autoAlpha: 0, scale: 0.4, transformOrigin: "50% 50%" });
      gsap.set(q(".hero-hint"), { autoAlpha: 0, y: 20 });
      gsap.set(cursor, { autoAlpha: 0 });
      gsap.set(rocket, { opacity: 0, scale: 1, rotation: 0 });

      if (reducedMotion()) {
        complete(true);
        return;
      }

      /* Typewriter: one character at a time, cursor leading */
      let t = 0.2;
      tl.set(cursor, { autoAlpha: 1 }, t);
      layout.lines.forEach((line, lineIndex) => {
        [...line.text].forEach((ch, charIndex) => {
          tl.call(() => {
            gsap.set(q(`.hero-line[data-line="${lineIndex}"] .hero-char[data-c="${charIndex}"]`), { opacity: 1 });
            moveCursor(lineIndex, charIndex);
            if (ch !== " ") sfx("type");
          }, null, t);
          t += TYPE_STEP;
        });
        t += LINE_PAUSE;
      });

      /* Launch alongside the typing: ignition, lift-off, one orbit */
      const launchAt = 0.5;
      tl.call(() => {
        setThrust(1);
        sfx("launch");
      }, null, launchAt);
      tl.set(rocket, { opacity: 1 }, launchAt);

      const paths = q(".hero-seg");
      let ft = launchAt;
      flight.forEach((seg, i) => {
        const path = paths[i];
        const len = path.getTotalLength();
        /* power1.in ends at 2x average speed, so give the launch twice the time */
        const duration = seg.kind === "launch" ? (2 * len) / SPEED : len / SPEED;
        const ease = seg.kind === "launch" ? "power1.in" : "none";

        tl.to(rocket, { motionPath: { path, align: path, alignOrigin: [0.5, 0.5], autoRotate: 90 }, duration, ease }, ft);
        tl.to(q(`.hero-trail[data-seg="${i}"]`), { drawSVG: "100%", duration, ease }, ft);

        if (seg.kind === "launch") {
          tl.to(q(".hero-logo"), { autoAlpha: 1, scale: 1, duration: 0.9, ease: "back.out(1.8)" }, ft + duration * 0.5);
          tl.to(q(`.hero-trail[data-seg="${i}"]`), { opacity: 0, duration: 1.2 }, ft + duration + 0.1);
        }

        ft += duration;
      });

      gsap.set(q(".hero-trail"), { drawSVG: "0%" });

      /* Dock once the orbit closes and the title is fully typed */
      tl.call(() => {
        if (finished) return;
        unlock("liftoff");
        dock();
      }, null, Math.max(ft, t));

      /* Start once the loader has cleared */
      const go = () => {
        if (!finished && ui.get().loaded && tl.paused()) tl.play();
      };
      const unsubscribe = ui.subscribe(go);
      go();

      const onKey = (e) => {
        if (["Escape", "Enter", " "].includes(e.key)) skipRef.current();
      };
      window.addEventListener("keydown", onKey);

      return () => {
        window.removeEventListener("keydown", onKey);
        unsubscribe();
        if (!finished) lockScroll(false);
        finished = true;
      };
    },
    { scope: rootRef }
  );

  /* Scroll-out parallax once the hero is live */
  useGSAP(
    () => {
      if (!introDone || reducedMotion()) return;
      gsap.to(".hero-stage", {
        yPercent: -18,
        opacity: 0.15,
        scale: 0.96,
        ease: "none",
        scrollTrigger: { trigger: rootRef.current, start: "top top", end: "bottom top", scrub: true },
      });
    },
    { scope: rootRef, dependencies: [introDone] }
  );

  const { W, H, lines, logo, orbit } = layout;

  /* Each character is its own tspan so the typewriter can reveal it */
  const chars = (text) =>
    [...text].map((ch, i) => (
      <tspan key={i} className="hero-char" data-c={i}>
        {ch}
      </tspan>
    ));

  return (
    <section id="home" className={`hero ${introDone ? "is-live" : ""}`} ref={rootRef}>
      <div className="hero-stage">
        <svg
          className="hero-svg"
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid meet"
          aria-labelledby="hero-title"
          role="img"
        >
          <title id="hero-title">IEEE ComSoc VIT Vellore</title>

          <defs>
            {/* Arcade-logo fills: top-lit, with a hard horizon line */}
            <linearGradient id="hero-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="0.42" stopColor="#b9f7ff" />
              <stop offset="0.5" stopColor="#3ff2ff" />
              <stop offset="1" stopColor="#2f6bff" />
            </linearGradient>
            <linearGradient id="hero-fill-sub" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#fff6d6" />
              <stop offset="0.5" stopColor="#ffd166" />
              <stop offset="1" stopColor="#ff9f1c" />
            </linearGradient>

            <filter id="hero-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Logo + orbit */}
          <g className="hero-logo">
            <circle className="hero-ping" cx={logo.x} cy={logo.y} r={logo.r} />
            <circle className="hero-ping delay" cx={logo.x} cy={logo.y} r={logo.r} />
            <image href={LOGO_SRC} x={logo.x - logo.r} y={logo.y - logo.r} width={logo.r * 2} height={logo.r * 2} />
            {introDone && <circle className="hero-orbit-ring" cx={logo.x} cy={logo.y} r={orbit} />}
          </g>

          {/* Title */}
          <g className="hero-title">
            {lines.map((line, i) => {
              const text = {
                x: line.x,
                y: line.y,
                fontSize: line.size,
                textLength: line.length,
                lengthAdjust: "spacing",
                textAnchor: "middle",
              };
              return (
                <g key={`${layoutKey}-${line.text}`} className={`hero-line ${line.size < 80 ? "is-sub" : ""}`} data-line={i}>
                  {/* Pixel extrusion: two hard offset copies under the face */}
                  <text {...text} className="hero-depth-2" transform={`translate(${EXTRUDE} ${EXTRUDE})`} aria-hidden="true">
                    {chars(line.text)}
                  </text>
                  <text {...text} className="hero-depth-1" transform={`translate(${EXTRUDE / 2} ${EXTRUDE / 2})`} aria-hidden="true">
                    {chars(line.text)}
                  </text>
                  <text {...text} className="hero-face">
                    {chars(line.text)}
                  </text>
                </g>
              );
            })}
            <rect className="hero-cursor" />
          </g>

          {/* Flight path + glowing trail */}
          {!introDone &&
            flight.map((seg, i) => (
              <g key={`${layoutKey}-${i}`}>
                <path className="hero-seg" d={seg.d} />
                <path className={`hero-trail ${seg.kind}`} data-seg={i} d={seg.d} filter="url(#hero-glow)" />
              </g>
            ))}
        </svg>

        <div className="hero-film" aria-hidden="true" />
      </div>

      <p className="hero-hint">
        SCROLL TO EXPLORE <span>▼</span>
        <span className="hero-hint-keys"> &nbsp;·&nbsp; PRESS 1–6 TO JUMP SECTORS</span>
      </p>

      {!introDone && (
        <button className="hero-skip" onClick={() => skipRef.current()}>
          SKIP ▸▸
        </button>
      )}

      <SignalFragment id="hero" style={{ left: "4%", bottom: "12%" }} />
    </section>
  );
}
