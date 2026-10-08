import { useEffect } from "react";
import { ui, openPanel, closePanel } from "../lib/uiStore";
import { unlock } from "./gameStore";
import { sfx } from "./sound";

/* =========================================================
   GLOBAL GAME SYSTEMS
   Hotkeys, the Konami code, night-owl check and a
   message for anyone who opens dev tools.
========================================================= */

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

const CONSOLE_ART = String.raw`
   ___ ___  __  __ ___  ___   ___
  / __/ _ \|  \/  / __|/ _ \ / __|
 | (_| (_) | |\/| \__ \ (_) | (__
  \___\___/|_|  |_|___/\___/ \___|   VIT VELLORE
`;

export default function GameSystems() {
  useEffect(() => {
    console.log(`%c${CONSOLE_ART}`, "color:#3ff2ff;font-family:monospace");
    console.log(
      "%cHey, dev 👾 you found the console. Like what you see? The ComSoc tech team is always recruiting.\nPress ~ on the page for something fun.",
      "color:#ffd166;font-size:13px"
    );

    const hour = new Date().getHours();
    if (hour >= 0 && hour < 5) setTimeout(() => unlock("night-owl"), 9000);

    let konami = 0;

    const onKey = (e) => {
      if (e.target.closest?.("input, textarea")) return;

      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      konami = key === KONAMI[konami] ? konami + 1 : key === KONAMI[0] ? 1 : 0;
      if (konami === KONAMI.length) {
        konami = 0;
        unlock("konami");
        sfx("levelup");
        openPanel("arcade");
        return;
      }

      if (e.key === "`" || e.key === "~") {
        e.preventDefault();
        if (ui.get().panel === "terminal") closePanel();
        else if (!ui.get().panel && !ui.get().modal) openPanel("terminal");
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return null;
}
