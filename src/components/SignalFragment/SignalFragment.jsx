import "./SignalFragment.css";
import { useState } from "react";
import { game, collectFragment } from "../../game/gameStore";

/* =========================================================
   SIGNAL FRAGMENT
   Six of these blink in hidden corners of the site (one per sector).
   Collecting all of them unlocks SIGNAL HUNTER.
========================================================= */

export default function SignalFragment({ id, style }) {
  const collected = game.use((s) => s.fragments).includes(id);
  const [popping, setPopping] = useState(false);

  if (collected && !popping) return null;

  return (
    <button
      className={`fragment ${popping ? "is-popping" : ""}`}
      style={style}
      aria-label="Hidden signal fragment"
      onClick={() => {
        setPopping(true);
        collectFragment(id);
        setTimeout(() => setPopping(false), 700);
      }}
    >
      <span />
    </button>
  );
}
