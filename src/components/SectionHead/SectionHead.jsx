import "./SectionHead.css";
import { useRef } from "react";
import { gsap, useGSAP, SCRAMBLE_CHARS } from "../../lib/gsap";
import { SECTIONS } from "../../data/content";

/* Sector tag + pixel title that decodes when scrolled into view */
export default function SectionHead({ index, title, boxed, align = "left" }) {
  const ref = useRef(null);
  const sector = SECTIONS[index];

  useGSAP(
    () => {
      const words = ref.current.querySelectorAll("[data-text]");
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: "top 82%", once: true },
      });

      tl.from(".sector-tag", { autoAlpha: 0, x: -20, duration: 0.5 });
      words.forEach((word, i) => {
        tl.from(word, { autoAlpha: 0, y: 30, duration: 0.6, ease: "power3.out" }, 0.1 + i * 0.12);
        tl.to(word, {
          duration: 1,
          scrambleText: { text: word.dataset.text, chars: SCRAMBLE_CHARS, revealDelay: 0.2, speed: 0.5 },
        }, 0.1 + i * 0.12);
      });
    },
    { scope: ref }
  );

  return (
    <header className={`section-head align-${align}`} ref={ref}>
      <span className="sector-tag">
        SECTOR {String(index + 1).padStart(2, "0")} // {sector.sector}
      </span>
      <h2 className="pixel-title">
        <span data-text={title}>{title}</span>
        {boxed && (
          <>
            {" "}
            <span className="boxed" data-text={boxed}>{boxed}</span>
          </>
        )}
      </h2>
    </header>
  );
}
