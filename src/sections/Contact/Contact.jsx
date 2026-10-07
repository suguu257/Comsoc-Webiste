import "./Contact.css";
import { useRef } from "react";
import { SiInstagram, SiGithub, SiYoutube, SiX } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import { gsap, useGSAP } from "../../lib/gsap";
import { scrollToSection } from "../../lib/scroll";
import { openPanel } from "../../lib/uiStore";
import { game, levelOf, rankOf, toast, unlock } from "../../game/gameStore";
import { ACHIEVEMENTS, FRAGMENT_COUNT } from "../../game/achievements";
import { sfx } from "../../game/sound";
import SectionHead from "../../components/SectionHead/SectionHead";
import SignalFragment from "../../components/SignalFragment/SignalFragment";
import { Planet, Asteroid, Satellite } from "../../components/Decor/Decor";
import { EMAILS, SOCIALS, SECTIONS } from "../../data/content";

/* =========================================================
   CONTACT — "Open a Channel"
   Emails on a comms console; socials orbit a planet.
   The footer reports the visitor's mission stats.
========================================================= */

const SOCIAL_ICONS = { instagram: SiInstagram, linkedin: FaLinkedin, github: SiGithub, youtube: SiYoutube, x: SiX };

function OrbitSystem() {
  const inner = SOCIALS.slice(0, 2);
  const outer = SOCIALS.slice(2);

  const ring = (items, className) => (
    <div className={`orbit ${className}`}>
      {items.map((social, i) => {
        const Icon = SOCIAL_ICONS[social.id];
        return (
          <div className="sat-arm" key={social.id} style={{ "--a": `${(360 / items.length) * i + (className === "outer" ? 30 : 0)}deg` }}>
            <a
              className="sat"
              href={social.url}
              target="_blank"
              rel="noreferrer"
              aria-label={social.label}
              onMouseEnter={() => sfx("hover")}
            >
              <span className="sat-icon">
                {Icon && <Icon />}
                <span className="sat-label">{social.label}</span>
              </span>
            </a>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="orbit-system">
      <div className="orbit-planet">
        <Planet size={12} />
      </div>
      {ring(inner, "inner")}
      {ring(outer, "outer")}
    </div>
  );
}

function MissionReport() {
  const xp = game.use((s) => s.xp);
  const visited = game.use((s) => s.visited);
  const unlocked = game.use((s) => s.unlocked);
  const fragments = game.use((s) => s.fragments);
  const highScore = game.use((s) => s.highScore);

  const rows = [
    ["SECTORS", `${visited.length}/${SECTIONS.length}`],
    ["TROPHIES", `${unlocked.length}/${ACHIEVEMENTS.length}`],
    ["FRAGMENTS", `${fragments.length}/${FRAGMENT_COUNT}`],
    ["ARCADE HI", String(highScore).padStart(5, "0")],
  ];

  return (
    <div className="report">
      <div className="report-head">
        <span className="report-title">MISSION COMPLETE</span>
        <span className="report-rank">
          LV {levelOf(xp)} · {rankOf(xp)} · {xp} XP
        </span>
      </div>
      <dl className="report-grid">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <div className="report-actions">
        <button
          className="px-btn"
          onClick={() => {
            sfx("launch");
            scrollToSection("top", { duration: 2.6 });
          }}
        >
          ▲ RETURN TO LAUNCH PAD
        </button>
        <button className="px-btn ghost" onClick={() => { sfx("select"); openPanel("achievements"); }}>
          TROPHY ROOM
        </button>
      </div>
    </div>
  );
}

export default function Contact() {
  const rootRef = useRef(null);

  const copy = async (email, row) => {
    try {
      await navigator.clipboard.writeText(email);
      toast({ kind: "info", title: "CHANNEL COPIED", desc: email });
    } catch {
      toast({ kind: "info", title: "COPY BLOCKED", desc: "Use the mail link instead." });
    }
    sfx("coin");
    unlock("networker");

    /* A packet flies from the console to the orbit */
    const packet = document.createElement("span");
    packet.className = "packet";
    rootRef.current.appendChild(packet);
    const from = row.getBoundingClientRect();
    const to = rootRef.current.querySelector(".orbit-planet").getBoundingClientRect();
    const base = rootRef.current.getBoundingClientRect();
    gsap.fromTo(
      packet,
      { x: from.right - base.left - 40, y: from.top - base.top + from.height / 2 },
      {
        x: to.left - base.left + to.width / 2,
        y: to.top - base.top + to.height / 2,
        duration: 0.9,
        ease: "power2.in",
        onComplete: () => packet.remove(),
      }
    );
  };

  useGSAP(
    () => {
      gsap.from(".console-row", {
        x: -30,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 0.6,
        scrollTrigger: { trigger: ".console", start: "top 80%", once: true },
      });
      gsap.from(".orbit-system", {
        scale: 0.6,
        autoAlpha: 0,
        rotate: -30,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: { trigger: ".orbit-system", start: "top 85%", once: true },
      });
    },
    { scope: rootRef }
  );

  return (
    <section id="contact" className="section contact" ref={rootRef}>
      <Asteroid className="contact-rock rock-a" size={8} />
      <Asteroid className="contact-rock rock-b" size={5} />
      <Satellite className="contact-sat" size={4} />

      <SectionHead index={5} title="OPEN A" boxed="CHANNEL" />

      <div className="contact-grid">
        <div className="console">
          <div className="console-head">
            <span>COMMS CONSOLE</span>
            <span className="console-online">● {EMAILS.length} CHANNELS ONLINE</span>
          </div>

          {EMAILS.map(({ label, email }) => (
            <div className="console-row" key={email}>
              <span className="console-label">{label}</span>
              <a className="console-email" href={`mailto:${email}`} onMouseEnter={() => sfx("hover")}>
                {email}
              </a>
              <button className="console-copy" onClick={(e) => copy(email, e.currentTarget.closest(".console-row"))}>
                [COPY]
              </button>
            </div>
          ))}

          <p className="console-prompt">
            &gt; awaiting transmission<span className="console-caret">_</span>
          </p>
        </div>

        <OrbitSystem />
      </div>

      <footer className="footer">
        <MissionReport />
        <div className="credits">
          <span>© {new Date().getFullYear()} IEEE COMMUNICATIONS SOCIETY · VIT VELLORE</span>
          <span>PRESS ~ FOR THE TERMINAL · ↑↑↓↓←→←→BA FOR SOMETHING ELSE</span>
        </div>
      </footer>

      <SignalFragment id="contact" style={{ right: "3%", top: "12%" }} />
    </section>
  );
}
