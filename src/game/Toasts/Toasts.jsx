import "./Toasts.css";
import { GiTrophyCup, GiRadarSweep, GiUpgrade } from "react-icons/gi";
import { game } from "../gameStore";
import { ACHIEVEMENT_ICONS } from "../icons";

const KIND_ICON = { sector: GiRadarSweep, fragment: GiRadarSweep, level: GiUpgrade, info: GiRadarSweep };
const KIND_LABEL = {
  achievement: "ACHIEVEMENT UNLOCKED",
  sector: "NEW SECTOR",
  fragment: "COLLECTIBLE",
  level: "LEVEL UP!",
  info: "COMMS",
};

export default function Toasts() {
  const toasts = game.use((s) => s.toasts);

  return (
    <div className="toasts" aria-live="polite">
      {toasts.map((t) => {
        const Icon = (t.icon && ACHIEVEMENT_ICONS[t.icon]) || KIND_ICON[t.kind] || GiTrophyCup;
        return (
          <div key={t.id} className={`toast is-${t.kind}`}>
            <span className="toast-icon">
              <Icon />
            </span>
            <span className="toast-text">
              <span className="toast-kind">{KIND_LABEL[t.kind]}</span>
              <span className="toast-title">{t.title}</span>
              {t.desc && <span className="toast-desc">{t.desc}</span>}
            </span>
            {t.xp && <span className="toast-xp">+{t.xp} XP</span>}
          </div>
        );
      })}
    </div>
  );
}
