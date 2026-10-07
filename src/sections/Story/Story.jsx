import "./Story.css";
import { useRef } from "react";
import { gsap, useGSAP, SplitText, reducedMotion } from "../../lib/gsap";
import SectionHead from "../../components/SectionHead/SectionHead";
import SignalFragment from "../../components/SignalFragment/SignalFragment";
import { Satellite, Planet, Comet } from "../../components/Decor/Decor";
import { STORY } from "../../data/content";

/* =========================================================
   OUR STORY — "Mission Log"
   The story arrives as an incoming transmission, line by
   line; stats count up like a mission readout.
========================================================= */

export default function Story() {
  const rootRef = useRef(null);

  useGSAP(
    () => {
      const still = reducedMotion();

      /* Decor drifts in from opposite sides */
      if (!still) {
        const enter = { trigger: rootRef.current, start: "top bottom", end: "top 20%", scrub: 1 };
        gsap.from(".story-sat", { x: "-45vw", rotate: -40, scrollTrigger: enter });
        gsap.from(".story-planet", { x: "45vw", rotate: 25, scrollTrigger: enter });
        gsap.from(".story-comet", { x: "30vw", y: "-20vh", autoAlpha: 0, scrollTrigger: enter });
      }

      /* Lines decode in one after another */
      SplitText.create(".log-body p", {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 110,
            autoAlpha: 0,
            duration: 0.8,
            stagger: 0.09,
            ease: "power3.out",
            scrollTrigger: { trigger: ".log", start: "top 72%", once: true },
          }),
      });

      /* Header decode percentage */
      const pct = { v: 0 };
      gsap.to(pct, {
        v: 100,
        duration: 2.4,
        ease: "power1.inOut",
        scrollTrigger: { trigger: ".log", start: "top 72%", once: true },
        onUpdate: () => {
          const el = rootRef.current?.querySelector(".log-progress");
          if (el) el.textContent = `${Math.round(pct.v)}%`;
        },
      });

      /* Stat counters */
      gsap.utils.toArray(".stat-value").forEach((el) => {
        const target = Number(el.dataset.value);
        const counter = { v: 0 };
        gsap.to(counter, {
          v: target,
          duration: still ? 0 : 2,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
          onUpdate: () => {
            el.textContent = Math.round(counter.v).toLocaleString("en-IN");
          },
        });
      });

      gsap.from(".stat", {
        y: 40,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: ".stats", start: "top 85%", once: true },
      });
    },
    { scope: rootRef }
  );

  return (
    <section id="story" className="section story" ref={rootRef}>
      <Satellite className="story-sat" size={7} />
      <Planet className="story-planet" size={9} />
      <Comet className="story-comet" size={6} />
      <span className="glow-square" style={{ left: "6%", top: "70%", width: 34, height: 34 }} />
      <span className="glow-square blue" style={{ right: "12%", top: "18%", width: 26, height: 26, "--dx": "-20px" }} />

      <SectionHead index={1} title="OUR" boxed="STORY" />

      <div className="story-grid">
        <article className="log">
          <header className="log-head">
            <span className="log-rec">● REC</span>
            <span>{STORY.transmission}</span>
            <span>
              DECODING <span className="log-progress">0%</span>
            </span>
          </header>

          <div className="log-body">
            {STORY.paragraphs.map((text) => (
              <p key={text}>{text}</p>
            ))}
            <span className="log-cursor" aria-hidden="true" />
          </div>
        </article>

        <div className="stats">
          {STORY.stats.map((stat) => (
            <div className="stat" key={stat.label}>
              <span className="stat-label">{stat.label}</span>
              <span className="stat-number">
                <span className="stat-value" data-value={stat.value}>
                  0
                </span>
                {stat.suffix}
              </span>
              <span className="stat-bar" />
            </div>
          ))}
        </div>
      </div>

      <SignalFragment id="story" style={{ right: "8%", bottom: "6%" }} />
    </section>
  );
}
