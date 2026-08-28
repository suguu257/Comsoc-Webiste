import { useState } from "react";

import Landing from "./pages/Landing";
import Home from "./pages/Home";
import HyperspeedTransition
  from "./components/Hyperspeed/HyperspeedTransition";

export default function App() {

  const [stage, setStage] = useState("landing");

  return (
    <>
      {stage === "landing" && (
        <Landing
          onEnter={() => setStage("hyper")}
        />
      )}

      {stage === "hyper" && (
        <HyperspeedTransition
          active={true}
          onComplete={() => setStage("home")}
        />
      )}

      {stage === "home" && (
        <Home />
      )}
    </>
  );
}