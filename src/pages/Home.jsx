import "./Home.css";
import { useMemo } from "react";

import Background from "../components/Background/Background";
import Navbar from "../components/Navbar/Navbar";
import Events from "../components/Events/Events";

/* =========================================================
   SMALL 4-POINT STAR
========================================================= */

function Sparkle({ size = 60, id, style }) {
  const gradId = `sparkleGrad-${id}`;

  return (
    <svg
      className="icon-sparkle"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={style}
    >
      <defs>
        <linearGradient
          id={gradId}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#4f8bff" />
        </linearGradient>
      </defs>

      <path
        d="
          M12 0
          C13 8 16 11 24 12
          C16 13 13 16 12 24
          C11 16 8 13 0 12
          C8 11 11 8 12 0 Z
        "
        fill={`url(#${gradId})`}
      />
    </svg>
  );
}

/* =========================================================
   HOME
========================================================= */

export default function Home() {

  /* =======================================================
     FLOATING GLOWING SQUARES
  ======================================================= */

  const squares = useMemo(
    () => [
      {
        left: 8,
        top: 34,
        size: 46,
        type: "white",
        dx: 22,
        dy: -18,
        duration: 18,
        delay: -5,
      },
      {
        left: 79,
        top: 32,
        size: 34,
        type: "blue",
        dx: -20,
        dy: 22,
        duration: 21,
        delay: -11,
      },
      {
        left: 69,
        top: 61,
        size: 52,
        type: "white",
        dx: 24,
        dy: -24,
        duration: 20,
        delay: -3,
      },
      {
        left: 23,
        top: 72,
        size: 34,
        type: "blue",
        dx: -18,
        dy: -20,
        duration: 17,
        delay: -8,
      },
      {
        left: 91,
        top: 70,
        size: 24,
        type: "white",
        dx: -16,
        dy: -14,
        duration: 19,
        delay: -13,
      },
    ],
    []
  );

  /* =======================================================
     REFERENCE STARS
  ======================================================= */

  const stars = useMemo(
    () => [
      {
        left: 12,
        top: 18,
        size: 4,
        delay: -1,
      },
      {
        left: 28,
        top: 31,
        size: 3,
        delay: -4,
      },
      {
        left: 87,
        top: 16,
        size: 4,
        delay: -2,
      },
      {
        left: 93,
        top: 43,
        size: 3,
        delay: -5,
      },
      {
        left: 76,
        top: 70,
        size: 4,
        delay: -3,
      },
      {
        left: 15,
        top: 67,
        size: 3,
        delay: -6,
      },
      {
        left: 44,
        top: 18,
        size: 3,
        delay: -7,
      },
    ],
    []
  );

  return (
    <>
    <div className="page">

      <Background />
      <Navbar />


      {/* =================================================
          STARS
      ================================================= */}

      <div className="reference-stars">
        {stars.map((star, index) => (
          <span
            key={index}
            className="reference-star"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: star.size,
              height: star.size,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>

      {/* =================================================
          EXTRA GLOW BOXES
      ================================================= */}

      <div className="glowBoxes">
        <span className="gBox b1" />
        <span className="gBox b2" />
        <span className="gBox b3" />
        <span className="gBox b4" />
      </div>

      {/* =================================================
          HERO
      ================================================= */}

      <main className="hero">

        {/* ================= IEEE ================= */}

        <div className="ieee-row">

          <Sparkle
            size={72}
            id="hero"
          />

          <span className="ieee-text">
            IEEE
          </span>

          <span className="ring" />

        </div>

        {/* ================= COMSOC ================= */}

        <div className="comsoc-wrap">

          <div className="comsoc-glow" />

          <Sparkle
            size={82}
            id="comsoc"
            style={{
              position: "absolute",
              right: "7%",
              top: "-30%",
              zIndex: 2,
            }}
          />

          <span className="comsoc-text">
            COMSOC
          </span>

        </div>

      </main>

      {/* =================================================
          FLOATING SQUARES
      ================================================= */}

      {squares.map((s, i) => (
        <div
          key={i}
          className={`deco soft-square ${s.type}`}
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            "--dx": `${s.dx}px`,
            "--dy": `${s.dy}px`,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}

      {/* =================================================
          BOTTOM RIGHT PIXELS
      ================================================= */}

      <div className="pixel-scatter">

        <span className="pixel blue" />
        <span className="pixel white" />
        <span className="pixel blue" />
        <span className="pixel white" />
        <span className="pixel blue" />

      </div>

      {/* =================================================
          VIT CHAPTER
      ================================================= */}

      <div className="vit-block">

        <div className="eq-icon">

          <span
            style={{
              height: "40%",
              animationDelay: "0s",
            }}
          />

          <span
            style={{
              height: "70%",
              animationDelay: ".15s",
            }}
          />

          <span
            style={{
              height: "100%",
              animationDelay: ".3s",
            }}
          />

          <span
            style={{
              height: "55%",
              animationDelay: ".45s",
            }}
          />

          <span
            style={{
              height: "80%",
              animationDelay: ".6s",
            }}
          />

        </div>

        <div className="vit-text-col">

          <span className="vit-text">
            VIT CHAPTER
          </span>

          <div className="vit-decoration">

            <div className="gradient-bar">
              <span className="cap blue" />
              <span className="lines" />
              <span className="cap white" />
            </div>

            <div className="mini-bars">

              <span
                style={{
                  height: "40%",
                  animationDelay: "0s",
                }}
              />

              <span
                style={{
                  height: "90%",
                  animationDelay: ".1s",
                }}
              />

              <span
                style={{
                  height: "60%",
                  animationDelay: ".2s",
                }}
              />

              <span
                style={{
                  height: "100%",
                  animationDelay: ".3s",
                }}
              />

            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          BOTTOM LEFT LONG GLOW
      ================================================= */}

      <div className="bottom-light">

        <span className="light-line line-one" />
        <span className="light-line line-two" />
        <span className="light-line line-three" />

        <span className="light-core" />

      </div>

      {/* =================================================
          BOTTOM CTA
      ================================================= */}

      <div className="bottom-cta-wrap">
        <div className="bottom-cta" />
      </div>

    </div>

    {/* EVENTS SECTION */}
    <Events />
    </>
  );
}