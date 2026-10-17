import "./Hero.css";

import Hyperspeed from "../../components/Hyperspeed/Hyperspeed";
import CircularText from "../../components/Hero/CircularText";

export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-hyperspeed">
        <Hyperspeed />
      </div>

      <div className="hero-content">
        <p className="hero-eyebrow">IEEE VIT VELLORE</p>

        <h1 className="hero-title">IEEE COMSOC</h1>

        <p className="hero-subtitle">
          CONNECTING THE FUTURE
        </p>

        <div className="hero-circular">
          <CircularText
            text="IEEE COMSOC • VIT VELLORE • "
            radius={95}
          />
        </div>
      </div>

      <p className="hero-hint">
        SCROLL TO EXPLORE <span>▼</span>
      </p>
    </section>
  );
}
