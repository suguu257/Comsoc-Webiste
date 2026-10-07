import { useEffect } from "react";
import HyperspeedTransition from "../../components/Hyperspeed/HyperspeedTransition";
import { closePanel } from "../../lib/uiStore";
import { lockScroll } from "../../lib/scroll";
import { unlock } from "../gameStore";
import { sfx } from "../sound";

/* Hyperspeed easter egg (terminal: `warp`) */
export default function Warp() {
  useEffect(() => {
    lockScroll(true);
    sfx("warp");
    return () => lockScroll(false);
  }, []);

  return (
    <HyperspeedTransition
      active
      onComplete={() => {
        closePanel();
        unlock("warp");
      }}
    />
  );
}
