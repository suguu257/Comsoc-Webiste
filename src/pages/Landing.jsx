import Background from "../components/Background/Background";
import Hyperspeed from "../components/Hyperspeed/Hyperspeed";
import CircularText from "../components/Hero/CircularText";
import "./Landing.css";

export default function Landing({ onEnter }) {
  return (
    <section className="landing">
      <Background />

      <main className="landing-content">
        <div className="landing-hyperspeed">
          <Hyperspeed />
        </div>

        <div className="landing-hero-content">
          <p className="landing-eyebrow">IEEE VIT VELLORE</p>

          <h1>IEEE COMSOC</h1>

          <p className="landing-subtitle">
            CONNECTING THE FUTURE
          </p>

          <div className="landing-circular-text">
            <CircularText
              text="IEEE COMSOC • VIT VELLORE • "
              radius={95}
              className="landing-circular"
            />
          </div>

          <button onClick={onEnter} className="landing-enter">
            ENTER
          </button>
        </div>
      </main>
    </section>
  );
}
