import "./Events.css";
import { useEffect, useRef } from "react";
import { gsap, useGSAP, reducedMotion } from "../../lib/gsap";
import { scrollState } from "../../lib/scroll";
import { openModal } from "../../lib/uiStore";
import { inspectPoster } from "../../game/gameStore";
import { sfx } from "../../game/sound";
import SectionHead from "../../components/SectionHead/SectionHead";
import SignalFragment from "../../components/SignalFragment/SignalFragment";
import PosterArt from "./PosterArt";
import { EVENTS_TOP, EVENTS_BOTTOM } from "../../data/content";

/* =========================================================
   EVENTS — film reel
   Two strips run in opposite directions. Their speed
   follows scroll velocity; hovering a strip brakes it.
========================================================= */

const BASE_SPEED = 38; // px per second
const COPIES = 3;

export function Poster({ event }) {
  return event.image ? (
    <img className="poster-img" src={event.image} alt={event.title} loading="lazy" />
  ) : (
    <PosterArt event={event} />
  );
}

function EventFrame({ event, copy }) {
  return (
    <button
      className="film-frame"
      tabIndex={copy === 0 ? 0 : -1}
      aria-hidden={copy !== 0}
      onMouseEnter={() => {
        inspectPoster(event.id);
        sfx("hover");
      }}
      onFocus={() => inspectPoster(event.id)}
      onClick={() => {
        inspectPoster(event.id);
        openModal({ kind: "event", item: event });
      }}
    >
      <span className="frame-card">
        <Poster event={event} />

        {event.status === "upcoming" && <span className="frame-live">● LIVE</span>}

        <span className="frame-info">
          <span className="frame-title">{event.title}</span>
          <span className="frame-meta">{event.date} · {event.venue}</span>
          <span className="frame-summary">{event.summary}</span>
          <span className="frame-cta">▶ VIEW MISSION</span>
        </span>
      </span>
    </button>
  );
}

function Strip({ events, direction, className }) {
  const stripRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const strip = stripRef.current;
    const track = trackRef.current;
    const still = reducedMotion();
    let x = 0;
    let speed = BASE_SPEED;
    let hovering = false;
    let visible = false;
    let setWidth = 0;

    const measure = () => {
      setWidth = track.scrollWidth / COPIES;
      x = -setWidth;
    };

    const tick = (time, deltaTime) => {
      if (!visible || still || !setWidth) return;
      const dt = Math.min(deltaTime, 50) / 1000;
      const boost = Math.abs(scrollState.velocity) * 14;
      const target = hovering ? 0 : BASE_SPEED + boost;
      speed += (target - speed) * (hovering ? 0.12 : 0.06);

      x += speed * dt * direction;
      if (x <= -setWidth * 2) x += setWidth;
      if (x >= 0) x -= setWidth;
      track.style.transform = `translate3d(${x}px,0,0)`;
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });

    const enter = () => (hovering = true);
    const leave = () => (hovering = false);

    measure();
    track.style.transform = `translate3d(${x}px,0,0)`;
    observer.observe(strip);
    strip.addEventListener("pointerenter", enter);
    strip.addEventListener("pointerleave", leave);
    window.addEventListener("resize", measure);
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      observer.disconnect();
      strip.removeEventListener("pointerenter", enter);
      strip.removeEventListener("pointerleave", leave);
      window.removeEventListener("resize", measure);
    };
  }, [direction]);

  return (
    <div className={`film-strip ${className}`} ref={stripRef}>
      <div className="film-track" ref={trackRef}>
        {Array.from({ length: COPIES }, (_, copy) =>
          events.map((event) => <EventFrame key={`${event.id}-${copy}`} event={event} copy={copy} />)
        )}
      </div>
    </div>
  );
}

export default function Events() {
  const rootRef = useRef(null);

  useGSAP(
    () => {
      gsap.set(".film-strip-top", { rotate: -1.2 });
      gsap.set(".film-strip-bottom", { rotate: 1.2 });
      if (reducedMotion()) return;
      const enter = { trigger: rootRef.current, start: "top bottom", end: "top 25%", scrub: 1 };
      gsap.from(".film-strip-top", { xPercent: -18, rotate: -4, scrollTrigger: enter });
      gsap.from(".film-strip-bottom", { xPercent: 18, rotate: 4, scrollTrigger: enter });
      gsap.from(".projector-beam", { autoAlpha: 0, scaleY: 0.2, scrollTrigger: enter });
    },
    { scope: rootRef }
  );

  return (
    <section id="events" className="section events" ref={rootRef}>
      <Strip events={EVENTS_TOP} direction={-1} className="film-strip-top" />

      <div className="events-title">
        <span className="projector-beam" aria-hidden="true" />
        <SectionHead index={2} title="EVENTS" align="center" />
        <p className="events-hint">NOW SHOWING · HOVER A REEL TO PAUSE · CLICK A FRAME FOR DETAILS</p>
        <SignalFragment id="events" style={{ right: "14%", top: "30%" }} />
      </div>

      <Strip events={EVENTS_BOTTOM} direction={1} className="film-strip-bottom" />

      <div className="film-grain" aria-hidden="true" />
    </section>
  );
}
