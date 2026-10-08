import "./Gallery.css";
import { useRef } from "react";
import { gsap, useGSAP, reducedMotion } from "../../lib/gsap";
import { openModal } from "../../lib/uiStore";
import { sfx } from "../../game/sound";
import SectionHead from "../../components/SectionHead/SectionHead";
import SignalFragment from "../../components/SignalFragment/SignalFragment";
import { GALLERY } from "../../data/content";

/* =========================================================
   GALLERY — "Memory Warp"
   The section pins while photos fly out of deep space
   toward the viewer, past the title, as you scroll.
========================================================= */

const SPACING = 700; // z distance between memories
const NEAR = 650; // fully past the camera
const FAR = -3600; // invisible beyond this

/* Screen positions (percent), kept clear of the centre title */
const SLOTS = [
  [22, 30], [78, 32], [26, 72], [74, 70], [10, 52], [90, 50], [30, 16],
  [70, 84], [14, 82], [86, 18], [28, 48], [72, 46], [12, 22], [88, 78],
];

export function GalleryPhoto({ item }) {
  if (item.image) {
    return <img className="memory-img" src={item.image} alt={item.caption} loading="lazy" />;
  }
  return (
    <span className="memory-placeholder" style={{ "--h": item.hue }}>
      <span className="memory-icon" aria-hidden="true" />
      <span className="memory-label">{item.caption}</span>
      <span className="memory-sub">PHOTO PLACEHOLDER</span>
    </span>
  );
}

export default function Gallery() {
  const rootRef = useRef(null);
  const counterRef = useRef(null);

  useGSAP(
    () => {
      const items = gsap.utils.toArray(".memory");
      if (reducedMotion()) {
        rootRef.current.classList.add("is-static");
        return;
      }

      gsap.set(items, { xPercent: -50, yPercent: -50 });

      const travel = GALLERY.length * SPACING + 900;
      const setters = items.map((el) => ({
        el,
        z: gsap.quickSetter(el, "z", "px"),
      }));

      const render = (progress) => {
        let nearest = 0;
        let nearestDist = Infinity;

        setters.forEach(({ el, z }, i) => {
          const depth = -i * SPACING - 500 + progress * travel;
          z(depth);

          let alpha = 1;
          if (depth < FAR) alpha = 0;
          else if (depth < FAR + 1200) alpha = (depth - FAR) / 1200;
          else if (depth > 250) alpha = Math.max(0, 1 - (depth - 250) / (NEAR - 250));

          el.style.opacity = alpha.toFixed(3);
          el.style.visibility = alpha < 0.01 ? "hidden" : "visible";
          el.style.zIndex = String(Math.round(depth + 5000));
          el.classList.toggle("is-near", alpha > 0.35 && depth > -1600);

          const dist = Math.abs(depth + 300);
          if (dist < nearestDist) {
            nearestDist = dist;
            nearest = i;
          }
        });

        if (counterRef.current) {
          counterRef.current.textContent = `${String(nearest + 1).padStart(2, "0")} / ${String(GALLERY.length).padStart(2, "0")}`;
        }
      };

      render(0);

      gsap.to({}, {
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: () => `+=${window.innerHeight * GALLERY.length * 0.36}`,
          pin: ".gallery-stage",
          scrub: true,
          onUpdate: (self) => render(self.progress),
        },
      });
    },
    { scope: rootRef }
  );

  return (
    <section id="gallery" className="gallery" ref={rootRef}>
      <div className="gallery-stage">
        <div className="gallery-center">
          <SectionHead index={4} title="GALLERY" align="center" />
          <p className="gallery-counter">
            MEMORY <span ref={counterRef}>01 / {String(GALLERY.length).padStart(2, "0")}</span>
          </p>
          <p className="gallery-hint">KEEP SCROLLING TO FLY THROUGH THE ARCHIVE</p>
        </div>

        {GALLERY.map((item, i) => {
          const [x, y] = SLOTS[i % SLOTS.length];
          return (
            <button
              key={item.id}
              className="memory"
              style={{ left: `${x}%`, top: `${y}%` }}
              onMouseEnter={() => sfx("hover")}
              onClick={() => openModal({ kind: "photo", item })}
              aria-label={`Open ${item.caption}`}
            >
              <span className="memory-inner">
                <GalleryPhoto item={item} />
              </span>
            </button>
          );
        })}

        <SignalFragment id="gallery" style={{ left: "48%", bottom: "8%", zIndex: 9999 }} />
      </div>
    </section>
  );
}
