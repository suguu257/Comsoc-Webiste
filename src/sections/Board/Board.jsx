import "./Board.css";
import { useEffect, useRef, useState } from "react";
import { FaLinkedin } from "react-icons/fa";
import { SiInstagram, SiGithub } from "react-icons/si";
import { gsap, useGSAP, ScrollTrigger, SCRAMBLE_CHARS, reducedMotion } from "../../lib/gsap";
import { ui } from "../../lib/uiStore";
import { inspectMember } from "../../game/gameStore";
import { sfx } from "../../game/sound";
import SectionHead from "../../components/SectionHead/SectionHead";
import SignalFragment from "../../components/SignalFragment/SignalFragment";
import { BOARD, BOARD_PHOTO, SECTIONS } from "../../data/content";

/* =========================================================
   BOARD — one group photo as a character-select screen
   The selected member stays in colour; everyone else is
   greyed out. The side card swaps in place.
========================================================= */

const AUTOPLAY_MS = 4200;
const IDLE_MS = 7000;
const TEAM_INDEX = SECTIONS.findIndex((s) => s.id === "team");

const inset = ({ x, y, w, h }) =>
  `inset(${y}% ${100 - x - w}% ${100 - y - h}% ${x}% round 10px)`;

/* Crop the group photo (16:9) to the hotspot inside a 3:4 portrait,
   hotspot width fills the frame, hotspot top sits at the frame top */
const PHOTO_RATIO = 9 / 16;
const PORTRAIT_RATIO = 4 / 3;

const portraitStyle = ({ x, y, w }) => {
  const bgW = 100 / w; // in portrait widths
  const bgH = bgW * PHOTO_RATIO;
  const top = Math.max(0, y - 2) / 100;
  return {
    backgroundImage: `url(${BOARD_PHOTO})`,
    backgroundSize: `${bgW * 100}% auto`,
    backgroundPosition: `${(x / (100 - w)) * 100}% ${((bgH * top) / (bgH - PORTRAIT_RATIO)) * 100}%`,
  };
};

const SOCIAL_ICONS = { linkedin: FaLinkedin, instagram: SiInstagram, github: SiGithub };

/* Draws the photo as chunky pixels; `amount` 1 = blocky, 0 = sharp */
function usePixelReveal(canvasRef, photoRef) {
  useGSAP(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const small = document.createElement("canvas");
    const sctx = small.getContext("2d");
    const img = new Image();
    const state = { amount: 1 };
    let ready = false;

    const draw = () => {
      if (!ready) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(rect.width * dpr));
      const h = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }

      const block = Math.max(1, Math.round(1 + state.amount * 46 * dpr));
      small.width = Math.ceil(w / block);
      small.height = Math.ceil(h / block);
      sctx.drawImage(img, 0, 0, small.width, small.height);

      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(small, 0, 0, small.width, small.height, 0, 0, w, h);
      canvas.style.opacity = state.amount < 0.02 ? 0 : 1;
    };

    img.onload = () => {
      ready = true;
      draw();
    };
    img.src = BOARD_PHOTO;

    if (reducedMotion()) {
      canvas.style.opacity = 0;
      return;
    }

    gsap.to(state, {
      amount: 0,
      ease: "power1.in",
      onUpdate: draw,
      scrollTrigger: { trigger: photoRef.current, start: "top 100%", end: "top 58%", scrub: 0.6 },
    });
  });
}

export default function Board() {
  const [index, setIndex] = useState(0);
  const member = BOARD[index];

  const rootRef = useRef(null);
  const photoRef = useRef(null);
  const canvasRef = useRef(null);
  const showcaseRef = useRef(null);
  const lastInteraction = useRef(0);
  const inView = useRef(false);

  usePixelReveal(canvasRef, photoRef);

  const select = (next, byUser = true) => {
    const i = (next + BOARD.length) % BOARD.length;
    if (byUser) {
      lastInteraction.current = Date.now();
      inspectMember(BOARD[i].id);
    }
    if (i === index) return;
    if (byUser) sfx("hover");
    setIndex(i);
  };

  /* Photo slides into view */
  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top 70%",
        end: "bottom 30%",
        onToggle: (self) => (inView.current = self.isActive),
      });
      if (reducedMotion()) return;
      gsap.from(".board-photo", {
        xPercent: -14,
        rotate: -2,
        autoAlpha: 0,
        ease: "power2.out",
        scrollTrigger: { trigger: ".board-photo", start: "top 100%", end: "top 60%", scrub: 1 },
      });
      gsap.from(".showcase", {
        xPercent: 20,
        autoAlpha: 0,
        ease: "power2.out",
        scrollTrigger: { trigger: ".board-photo", start: "top 95%", end: "top 60%", scrub: 1 },
      });
    },
    { scope: rootRef }
  );

  /* Swap the showcase like a profile being replaced */
  useGSAP(
    () => {
      const q = gsap.utils.selector(showcaseRef);
      gsap.to(q(".sc-name"), {
        duration: 0.7,
        scrambleText: { text: member.name, chars: SCRAMBLE_CHARS, speed: 0.7 },
      });
      gsap.to(q(".sc-role"), {
        duration: 0.5,
        scrambleText: { text: member.role, chars: SCRAMBLE_CHARS, speed: 0.8 },
      });
      gsap.fromTo(q(".sc-portrait-img"), { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.5, ease: "steps(8)" });
      gsap.fromTo(q(".sc-bio, .sc-class, .sc-socials"), { autoAlpha: 0, y: 10, filter: "blur(4px)" }, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.45, stagger: 0.05 });
    },
    { scope: showcaseRef, dependencies: [index] }
  );

  /* Autoplay while idle; arrow keys while in this sector */
  useEffect(() => {
    const timer = setInterval(() => {
      if (!inView.current || Date.now() - lastInteraction.current < IDLE_MS) return;
      setIndex((i) => (i + 1) % BOARD.length);
    }, AUTOPLAY_MS);

    const onKey = (e) => {
      if (ui.get().active !== TEAM_INDEX || ui.get().panel || ui.get().modal) return;
      if (e.key === "ArrowRight") select(index + 1);
      if (e.key === "ArrowLeft") select(index - 1);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      clearInterval(timer);
      window.removeEventListener("keydown", onKey);
    };
  });

  const hs = member.hotspot;

  return (
    <section id="team" className="section board" ref={rootRef}>
      <SectionHead index={3} title="MEET OUR" boxed="TEAM" />
      <p className="board-hint">SELECT YOUR PLAYER · HOVER THE CREW · ◀ ▶ TO CYCLE</p>

      <div className="board-layout">
        <div className="board-photo" ref={photoRef}>
          <img className="bp-base" src={BOARD_PHOTO} alt="The IEEE ComSoc VIT board" />
          <img className="bp-color" src={BOARD_PHOTO} alt="" aria-hidden="true" style={{ clipPath: inset(hs) }} />
          <canvas className="bp-pixels" ref={canvasRef} aria-hidden="true" />

          <div
            className="bp-cursor"
            style={{ left: `${hs.x}%`, top: `${hs.y}%`, width: `${hs.w}%`, height: `${hs.h}%` }}
            aria-hidden="true"
          >
            <i /><i /><i /><i />
            <span className="bp-tag">P1 ▼</span>
          </div>

          {BOARD.map((m, i) => (
            <button
              key={m.id}
              className="bp-hotspot"
              style={{ left: `${m.hotspot.x}%`, top: `${m.hotspot.y}%`, width: `${m.hotspot.w}%`, height: `${m.hotspot.h}%`, zIndex: m.hotspot.y > 40 ? 3 : 2 }}
              onPointerEnter={() => select(i)}
              onFocus={() => select(i)}
              onClick={() => select(i)}
              aria-label={`${m.role}: ${m.name}`}
              aria-pressed={i === index}
            />
          ))}

          <div className="bp-scanlines" aria-hidden="true" />
        </div>

        <aside className="showcase" ref={showcaseRef} aria-live="polite">
          <div className="sc-top">
            <div className="sc-portrait">
              <div className="sc-portrait-img" style={portraitStyle(hs)} />
              <span className="sc-portrait-frame" />
            </div>
            <div className="sc-heading">
              <span className="sc-role">{member.role}</span>
              <h3 className="sc-name">{member.name}</h3>
              <span className="sc-class">CLASS: {member.class}</span>
            </div>
          </div>

          <p className="sc-bio">{member.bio}</p>

          <div className="sc-stats">
            {Object.entries(member.stats).map(([label, value]) => (
              <div className="sc-stat" key={label}>
                <span>{label}</span>
                <span className="sc-stat-bar">
                  <span style={{ transform: `scaleX(${value / 100})` }} />
                </span>
                <span>{value}</span>
              </div>
            ))}
          </div>

          <div className="sc-socials">
            {Object.entries(member.socials).map(([network, url]) => {
              const Icon = SOCIAL_ICONS[network];
              return Icon ? (
                <a key={network} href={url} target="_blank" rel="noreferrer" aria-label={`${member.name} on ${network}`} onMouseEnter={() => sfx("hover")}>
                  <Icon />
                </a>
              ) : null;
            })}
          </div>

          <div className="sc-nav">
            <button onClick={() => select(index - 1)} aria-label="Previous member">◀</button>
            <span>
              {String(index + 1).padStart(2, "0")} / {String(BOARD.length).padStart(2, "0")}
            </span>
            <button onClick={() => select(index + 1)} aria-label="Next member">▶</button>
          </div>
        </aside>
      </div>

      <SignalFragment id="team" style={{ left: "2%", top: "18%" }} />
    </section>
  );
}