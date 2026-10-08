import "./HUD.css";
import { useEffect, useRef, useState } from "react";
import { GiTrophyCup, GiGamepad, GiSpeaker, GiSpeakerOff } from "react-icons/gi";
import { BsTerminal } from "react-icons/bs";
import { gsap, SCRAMBLE_CHARS } from "../../lib/gsap";
import { ui, openPanel } from "../../lib/uiStore";
import { scrollToSection } from "../../lib/scroll";
import { game, levelOf, rankOf, toggleSound, XP_PER_LEVEL } from "../../game/gameStore";
import { ACHIEVEMENTS } from "../../game/achievements";
import { sfx } from "../../game/sound";
import { SECTIONS } from "../../data/content";

/* =========================================================
   HUD
   Brand · current sector + mission clock · XP / level ·
   trophies, arcade, terminal and sound buttons.
========================================================= */

function MissionClock() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return <span className="hud-clock">T+{mm}:{ss}</span>;
}

export default function HUD() {
  const introDone = ui.use((s) => s.introDone);
  const active = ui.use((s) => s.active);
  const xp = game.use((s) => s.xp);
  const unlocked = game.use((s) => s.unlocked);
  const sound = game.use((s) => s.sound);

  const sectorRef = useRef(null);
  const section = SECTIONS[active];

  /* Decode the sector name whenever it changes */
  useEffect(() => {
    if (!sectorRef.current) return;
    gsap.to(sectorRef.current, {
      duration: 0.8,
      scrambleText: { text: section.sector, chars: SCRAMBLE_CHARS, speed: 0.6 },
    });
  }, [section.sector]);

  const level = levelOf(xp);
  const levelProgress = (xp % XP_PER_LEVEL) / XP_PER_LEVEL;

  const button = (label, onClick, children, extra = "") => (
    <button
      className={`hud-btn ${extra}`}
      onClick={() => {
        sfx("select");
        onClick();
      }}
      onMouseEnter={() => sfx("hover")}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  );

  return (
    <header className={`hud ${introDone ? "is-live" : ""}`}>
      <button className="hud-brand" onClick={() => scrollToSection("top")}>
        <span className="hud-brand-mark" />
        IEEE COMSOC
      </button>

      <div className="hud-sector" aria-live="polite">
        <span className="hud-sector-code">S-{String(active + 1).padStart(2, "0")}</span>
        <span className="hud-sector-name" ref={sectorRef}>
          {section.sector}
        </span>
        <MissionClock />
      </div>

      <div className="hud-right">
        <div className="hud-xp" title={`${xp} XP`}>
          <span className="hud-level">LV {level}</span>
          <span className="hud-rank">{rankOf(xp)}</span>
          <span className="hud-bar">
            <span style={{ transform: `scaleX(${levelProgress})` }} />
          </span>
          <span className="hud-xp-num">{xp} XP</span>
        </div>

        {button("Trophy room", () => openPanel("achievements"), (
          <>
            <GiTrophyCup />
            <span className="hud-count">
              {unlocked.length}/{ACHIEVEMENTS.length}
            </span>
          </>
        ), "hud-trophy")}
        {button("Arcade", () => openPanel("arcade"), <GiGamepad />)}
        {button("Terminal (~)", () => openPanel("terminal"), <BsTerminal />)}
        {button(sound ? "Sound off" : "Sound on", toggleSound, sound ? <GiSpeaker /> : <GiSpeakerOff />, sound ? "is-on" : "")}
      </div>
    </header>
  );
}
