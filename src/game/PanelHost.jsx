import { lazy, Suspense } from "react";
import { ui, closePanel } from "../lib/uiStore";
import Modal from "../components/Modal/Modal";
import Trophies from "./Trophies/Trophies";
import Terminal from "./Terminal/Terminal";
import Arcade from "./Arcade/Arcade";

/* three.js only loads if someone actually warps */
const Warp = lazy(() => import("./Warp/Warp"));

export default function PanelHost() {
  const panel = ui.use((s) => s.panel);

  switch (panel) {
    case "achievements":
      return (
        <Modal label="TROPHY ROOM" onClose={closePanel}>
          <Trophies />
        </Modal>
      );
    case "terminal":
      return (
        <Modal label="COMSOC-OS // TERMINAL" onClose={closePanel} className="is-terminal">
          <Terminal />
        </Modal>
      );
    case "arcade":
      return (
        <Modal label="ARCADE // COMSOC INVADERS" onClose={closePanel} className="is-arcade">
          <Arcade />
        </Modal>
      );
    case "warp":
      return (
        <Suspense fallback={null}>
          <Warp />
        </Suspense>
      );
    default:
      return null;
  }
}
