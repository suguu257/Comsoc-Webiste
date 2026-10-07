import "./Trophies.css";
import { useState } from "react";
import { game, levelOf, rankOf, resetSave, XP_PER_LEVEL } from "../gameStore";
import { ACHIEVEMENTS, FRAGMENT_COUNT } from "../achievements";
import { ACHIEVEMENT_ICONS } from "../icons";
import { openPanel } from "../../lib/uiStore";
import { sfx } from "../sound";

/* Trophy room: every achievement, locked ones show a hint */
export default function Trophies() {
  const xp = game.use((s) => s.xp);
  const unlocked = game.use((s) => s.unlocked);
  const fragments = game.use((s) => s.fragments);
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="trophies">
      <div className="tr-summary">
        <div>
          <span className="tr-level">LV {levelOf(xp)}</span>
          <span className="tr-rank">{rankOf(xp)}</span>
        </div>
        <div className="tr-xp">
          <span className="tr-bar">
            <span style={{ transform: `scaleX(${(xp % XP_PER_LEVEL) / XP_PER_LEVEL})` }} />
          </span>
          <span>
            {xp} XP · NEXT LEVEL AT {(levelOf(xp)) * XP_PER_LEVEL}
          </span>
        </div>
        <div className="tr-counts">
          <span>🏆 {unlocked.length}/{ACHIEVEMENTS.length}</span>
          <span>◆ {fragments.length}/{FRAGMENT_COUNT} FRAGMENTS</span>
        </div>
      </div>

      <ul className="tr-grid">
        {ACHIEVEMENTS.map((a) => {
          const got = unlocked.includes(a.id);
          const Icon = ACHIEVEMENT_ICONS[a.icon];
          return (
            <li key={a.id} className={`tr-card ${got ? "is-got" : ""}`}>
              <span className="tr-icon">{got ? <Icon /> : "?"}</span>
              <span className="tr-text">
                <span className="tr-title">{got ? a.title : "???"}</span>
                <span className="tr-desc">{got ? a.desc : a.hint}</span>
              </span>
              <span className="tr-xp-tag">{a.xp} XP</span>
            </li>
          );
        })}
      </ul>

      <div className="tr-actions">
        <button className="px-btn" onClick={() => { sfx("select"); openPanel("arcade"); }}>
          ▶ PLAY COMSOC INVADERS
        </button>
        <button
          className="tr-reset"
          onClick={() => {
            if (confirmReset) {
              resetSave();
              sfx("error");
              setConfirmReset(false);
            } else {
              setConfirmReset(true);
            }
          }}
        >
          {confirmReset ? "CLICK AGAIN TO WIPE YOUR SAVE" : "RESET SAVE"}
        </button>
      </div>
    </div>
  );
}
