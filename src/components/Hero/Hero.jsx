import "./Hero.css";
import CircularText from "./CircularText";

export default function Hero({ onEnter }) {

  return (

    <section className="hero">

      {/* ================================
          OUTER RING
      ================================= */}

      <div className="outerRing">

        <CircularText
          text="WELCOME TO COMSOC • WELCOME TO COMSOC • WELCOME TO COMSOC • WELCOME TO COMSOC •"
          radius={250}
        />

      </div>


      {/* ================================
          INNER RING
      ================================= */}

      <div className="innerRing">

        <CircularText
          text="WELCOME TO COMSOC • WELCOME TO COMSOC • WELCOME TO COMSOC • WELCOME TO COMSOC •"
          radius={180}
          reverse
        />

      </div>


      {/* ================================
          CENTER
      ================================= */}

      <button
        className="heroCenter"
        onClick={onEnter}
        aria-label="Enter IEEE COMSOC"
      >

        <h1>IEEE</h1>

        <h2>COMSOC</h2>

      </button>

    </section>

  );
}