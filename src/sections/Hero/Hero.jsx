import "./Hero.css";
import { useMemo, useRef, useState, useEffect } from "react";
import { gsap, useGSAP, reducedMotion } from "../../lib/gsap";
import { ui } from "../../lib/uiStore";
import { lockScroll, scrollToSection } from "../../lib/scroll";
import { dockTarget, rocketEl, setThrust } from "../../lib/rocket";
import { unlock, visitSector } from "../../game/gameStore";
import { sfx } from "../../game/sound";
import { JOIN_URL, LOGO_SRC } from "../../data/content";
import SignalFragment from "../../components/SignalFragment/SignalFragment";

/* =========================================================
   LAYOUTS (SVG user units)
   Each title line is swept by the rocket; the sweep path
   doubles as that line's reveal mask.
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

const SPEED = 1450; // user units per second while flying
const PAD = 40;
const TURN = 130;
const CAP = 0.875; // Press Start 2P glyph height in em
const EXTRUDE = 10; // depth of the pixel drop-shadow

const pickLayout = () =>
  window.innerWidth / window.innerHeight < 0.9 ? "tall" : "wide";

/* Build the flight plan: launch → sweeps & turns → orbit */
function buildFlight({ W, H, lines, logo, orbit }) {
  const segs = [];

  const rows = lines.map((line, i) => {
    const dir = i % 2 === 0 ? 1 : -1;
    const left = line.x - line.length / 2 - PAD;
    const right = line.x + line.length / 2 + PAD;
    return {
      yc: line.y - (line.size * CAP) / 2 + EXTRUDE / 2,
      dir,
      start: dir > 0 ? left : right,
      end: dir > 0 ? right : left,
    };
  });

  const first = rows[0];
  segs.push({
    kind: "launch",
    d: `M${W / 2},${H + 110} C${W / 2},${H * 0.6} ${first.start - 140},${first.yc + 260} ${first.start - 110},${first.yc + 80} C${first.start - 95},${first.yc} ${first.start - 60},${first.yc} ${first.start},${first.yc}`,
  });

  rows.forEach((row, i) => {
    segs.push({ kind: "sweep", line: i, d: `M${row.start},${row.yc} L${row.end},${row.yc}` });

    const next = rows[i + 1];
    if (next) {
      segs.push({
        kind: "turn",
        d: `M${row.end},${row.yc} C${row.end + row.dir * TURN},${row.yc} ${next.start + row.dir * TURN},${next.yc} ${next.start},${next.yc}`,
      });
    }
  });

  /* Enter the orbit on the side the last sweep finished on */
  const last = rows[rows.length - 1];
  const side = last.dir < 0 ? -1 : 1;
  const sweep = side < 0 ? 0 : 1;
  const R = orbit;
  const L = { x: logo.x - R, y: logo.y };
  const Rt = { x: logo.x + R, y: logo.y };
  const T = { x: logo.x, y: logo.y - R };
  const B = { x: logo.x, y: logo.y + R };
  const entry = side < 0 ? L : Rt;
  const opposite = side < 0 ? Rt : L;
  const arc = (p) => `A${R},${R} 0 0 ${sweep} ${p.x},${p.y}`;

  segs.push({
    kind: "approach",
    d: `M${last.end},${last.yc} C${last.end + last.dir * TURN},${last.yc} ${entry.x},${entry.y - TURN * 1.2} ${entry.x},${entry.y}`,
  });
  segs.push({
    kind: "orbit",
    d: `M${entry.x},${entry.y} ${arc(B)} ${arc(opposite)} ${arc(T)} ${arc(entry)} ${arc(B)}`,
  });

  return segs;
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
     LAUNCH SEQUENCE
  ------------------------------------------------------- */
  useGSAP(
    (context, contextSafe) => {
      const root = rootRef.current;
      const rocket = rocketEl();
      const q = gsap.utils.selector(root);
      let finished = false;

      lockScroll(true);

      const revealUi = (instant) => {
        gsap.to(q(".hero-cta > *, .hero-hint"), {
          autoAlpha: 1,
          y: 0,
          stagger: instant ? 0 : 0.12,
          duration: instant ? 0.3 : 0.7,
          ease: "power3.out",
        });
      };

      const complete = (instant) => {
        if (finished) return;
        finished = true;
        tl.kill();

        if (instant) {
          gsap.set(q(".hero-mask"), { drawSVG: "100%" });
          gsap.set(q(".hero-logo"), { autoAlpha: 1, scale: 1 });
          const target = dockTarget(0);
          if (target) gsap.set(rocket, { ...target, opacity: 1 });
        }

        setThrust(0.35);
        revealUi(instant);
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
              path: [from, { x: target.x - 160, y: (from.y + target.y) / 2 }, { x: target.x, y: target.y }],
              curviness: 1.3,
              autoRotate: 90,
            },
            duration: 1.4,
            ease: "power2.inOut",
          })
          .to(rocket, { rotation: target.rotation, scale: target.scale, duration: 0.5, ease: "back.out(2.2)" });
      };

      const tl = gsap.timeline({ paused: true });

      skipRef.current = contextSafe(() => complete(true));

      /* Starting state */
      gsap.set(q(".hero-mask, .hero-trail"), { drawSVG: "0%" });
      gsap.set(q(".hero-logo"), { autoAlpha: 0, scale: 0.4, transformOrigin: "50% 50%" });
      gsap.set(q(".hero-cta > *, .hero-hint"), { autoAlpha: 0, y: 20 });
      gsap.set(rocket, { opacity: 0, scale: 1, rotation: 0 });

      if (reducedMotion()) {
        complete(true);
        return;
      }

      /* Ignition: rumble, then lift off */
      tl.call(() => {
        setThrust(1);
        sfx("launch");
      }, null, 0);
      tl.fromTo(q(".hero-stage"), { x: -3 }, { x: 3, duration: 0.05, repeat: 9, yoyo: true, clearProps: "x" }, 0);
      tl.set(rocket, { opacity: 1 }, 0.4);

      /* Fly each segment at constant speed */
      const paths = q(".hero-seg");
      let t = 0.4;

      flight.forEach((seg, i) => {
        const path = paths[i];
        const len = path.getTotalLength();
        /* power1.in ends at 2x average speed, so give the launch twice the time */
        const duration =
          seg.kind === "launch" ? (2 * len) / SPEED : seg.kind === "orbit" ? len / (SPEED * 0.7) : len / SPEED;
        const ease = seg.kind === "launch" ? "power1.in" : "none";

        tl.to(rocket, {
          motionPath: { path, align: path, alignOrigin: [0.5, 0.5], autoRotate: 90 },
          duration,
          ease,
        }, t);

        tl.to(q(`.hero-trail[data-seg="${i}"]`), { drawSVG: "100%", duration, ease }, t);

        if (seg.kind === "sweep") {
          tl.to(q(`.hero-mask[data-line="${seg.line}"]`), { drawSVG: "100%", duration, ease }, t);
          /* The trail cools down once its line is written */
          tl.to(q(`.hero-trail[data-seg="${i}"]`), { opacity: 0, duration: 1.6 }, t + duration + 0.2);
        }

        if (seg.kind !== "orbit" && seg.kind !== "sweep") {
          tl.to(q(`.hero-trail[data-seg="${i}"]`), { opacity: 0, duration: 1.2 }, t + duration + 0.1);
        }

        if (seg.kind === "approach") {
          tl.to(q(".hero-logo"), { autoAlpha: 1, scale: 1, duration: 0.9, ease: "back.out(1.8)" }, t);
        }

        t += duration;
      });

      /* Dock as soon as the orbit closes; trail fades finish on their own */
      tl.call(() => {
        if (finished) return;
        unlock("liftoff");
        dock();
      }, null, t);

      /* Launch once the loader has cleared */
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

            {!introDone &&
              lines.map((line, i) => {
                const seg = flight.find((s) => s.kind === "sweep" && s.line === i);
                return (
                  <mask key={i} id={`hero-mask-${i}`} maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
                    <path className="hero-mask" data-line={i} d={seg.d} stroke="#fff" strokeWidth={line.size * CAP + 50} fill="none" />
                  </mask>
                );
              })}
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
              const sub = line.size < 80;
              const text = {
                x: line.x,
                y: line.y,
                fontSize: line.size,
                textLength: line.length,
                lengthAdjust: "spacing",
                textAnchor: "middle",
              };
              return (
                <g
                  key={line.text}
                  className={`hero-line ${sub ? "is-sub" : ""}`}
                  mask={introDone ? undefined : `url(#hero-mask-${i})`}
                >
                  {/* Pixel extrusion: two hard offset copies under the face */}
                  <text {...text} className="hero-depth-2" transform={`translate(${EXTRUDE} ${EXTRUDE})`} aria-hidden="true">
                    {line.text}
                  </text>
                  <text {...text} className="hero-depth-1" transform={`translate(${EXTRUDE / 2} ${EXTRUDE / 2})`} aria-hidden="true">
                    {line.text}
                  </text>
                  <text {...text} className="hero-face">
                    {line.text}
                  </text>
                </g>
              );
            })}
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

      <div className="hero-cta">
        <a className="px-btn" href={JOIN_URL} onClick={(e) => {
          if (JOIN_URL.startsWith("#")) {
            e.preventDefault();
            scrollToSection(JOIN_URL.slice(1));
          }
          sfx("select");
        }}>
          ▶ JOIN COMSOC
        </a>
        <button className="px-btn ghost" onClick={() => { scrollToSection("events"); sfx("select"); }}>
          EXPLORE EVENTS
        </button>
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
