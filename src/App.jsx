import { useEffect } from "react";
import { ScrollTrigger } from "./lib/gsap";
import { initScroll } from "./lib/scroll";

import Starfield from "./components/Starfield/Starfield";
import Cursor from "./components/Cursor/Cursor";
import HUD from "./components/HUD/HUD";
import NavRail from "./components/NavRail/NavRail";
import Rocket from "./components/Rocket/Rocket";
import ModalHost from "./components/ModalHost/ModalHost";

import Hero from "./sections/Hero/Hero";
import Story from "./sections/Story/Story";
import Events from "./sections/Events/Events";
import Board from "./sections/Board/Board";
import Gallery from "./sections/Gallery/Gallery";
import Contact from "./sections/Contact/Contact";

import GameSystems from "./game/GameSystems";
import PanelHost from "./game/PanelHost";
import Toasts from "./game/Toasts/Toasts";

export default function App() {
  useEffect(() => {
    const destroy = initScroll();
    document.fonts.ready.then(() => ScrollTrigger.refresh());
    return destroy;
  }, []);

  return (
    <>
      <Starfield />

      {/* NavRail registers the rocket dock before the hero mounts */}
      <NavRail />
      <Rocket />
      <HUD />

      <main className="site">
        <Hero />
        <Story />
        <Events />
        <Board />
        <Gallery />
        <Contact />
      </main>

      <Toasts />
      <ModalHost />
      <PanelHost />
      <GameSystems />
      <Cursor />
    </>
  );
}
