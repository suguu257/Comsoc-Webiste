import { useRef } from "react";
import { gsap, useGSAP, SCRAMBLE_CHARS } from "../../lib/gsap";
import { Poster } from "./Events";

export default function EventModal({ event }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      gsap.to(".em-title", {
        duration: 0.9,
        scrambleText: { text: event.title, chars: SCRAMBLE_CHARS, speed: 0.6 },
      });
      gsap.from(".em-info > *", { y: 16, autoAlpha: 0, stagger: 0.06, duration: 0.5, delay: 0.15 });
    },
    { scope: ref }
  );

  const upcoming = event.status === "upcoming";

  return (
    <div className="em" ref={ref}>
      <div className="em-poster">
        <Poster event={event} />
      </div>

      <div className="em-info">
        <span className={`em-status ${upcoming ? "is-live" : ""}`}>
          {upcoming ? "● UPCOMING MISSION" : "■ MISSION ARCHIVE"}
        </span>
        <h3 className="em-title">{event.title}</h3>
        <dl className="em-meta">
          <div>
            <dt>DATE</dt>
            <dd>{event.date}</dd>
          </div>
          <div>
            <dt>LOCATION</dt>
            <dd>{event.venue}</dd>
          </div>
        </dl>
        <p className="em-details">{event.details}</p>

        {event.link ? (
          <a className="px-btn" href={event.link} target="_blank" rel="noreferrer">
            ▶ {upcoming ? "REGISTER NOW" : "VIEW RECAP"}
          </a>
        ) : (
          <span className="px-btn ghost is-disabled">
            {upcoming ? "REGISTRATIONS OPENING SOON" : "RECAP COMING SOON"}
          </span>
        )}
      </div>
    </div>
  );
}
