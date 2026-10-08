import "./NavRail.css";
import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../../lib/gsap";
import { ui } from "../../lib/uiStore";
import { scrollState, scrollToSection } from "../../lib/scroll";
import { ROCKET_SIZE, setDockResolver, dockTarget, rocketEl, setThrust } from "../../lib/rocket";
import { game, visitSector } from "../../game/gameStore";
import { sfx } from "../../game/sound";
import { SECTIONS } from "../../data/content";

/* =========================================================
   NAV RAIL
   Vertical signal path on the right (bottom dock on
   phones). The docked rocket is the active indicator.
========================================================= */

const horizontalRail = () => window.matchMedia("(max-width: 760px)").matches;

export default function NavRail() {
  const active = ui.use((s) => s.active);
  const introDone = ui.use((s) => s.introDone);
  const visited = game.use((s) => s.visited);

  const railRef = useRef(null);
  const markerRefs = useRef([]);

  /* Where the rocket sits for a given marker (layout effect: the hero asks on mount) */
  useLayoutEffect(() => {
    setDockResolver((index) => {
      const dot = markerRefs.current[index]?.querySelector(".rail-dot");
      if (!dot) return null;
      const r = dot.getBoundingClientRect();
      const horizontal = horizontalRail();
      return {
        x: r.left + r.width / 2 - ROCKET_SIZE.w / 2,
        y: r.top + r.height / 2 - ROCKET_SIZE.h / 2 - (horizontal ? 6 : 0),
        rotation: horizontal ? 0 : -90,
        scale: horizontal ? 0.62 : 0.78,
      };
    });
  }, []);

  const markerTarget = (index) => dockTarget(index);

  /* Track which section is on screen */
  useEffect(() => {
    const triggers = SECTIONS.map((section, index) =>
      ScrollTrigger.create({
        trigger: `#${section.id}`,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => {
          if (!self.isActive) return;
          ui.set({ active: index });
          if (ui.get().introDone) visitSector(section.id);
        },
      })
    );

    const progress = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) =>
        railRef.current?.style.setProperty("--progress", self.progress.toFixed(3)),
    });

    return () => {
      triggers.forEach((t) => t.kill());
      progress.kill();
    };
  }, []);

  /* Fly the rocket to the active marker */
  useEffect(() => {
    if (!introDone) return;

    const el = rocketEl();
    const target = markerTarget(active);
    if (!el || !target) return;

    const dir = Math.sign(target.y - gsap.getProperty(el, "y")) || 0;
    const tilt = horizontalRail() ? 0 : -dir * 24;

    gsap.to(el, {
      x: target.x,
      y: target.y,
      scale: target.scale,
      duration: 0.9,
      ease: "power3.inOut",
      overwrite: "auto",
    });

    gsap
      .timeline()
      .to(el, { rotation: target.rotation + tilt, duration: 0.3, ease: "power2.out" })
      .to(el, { rotation: target.rotation, duration: 0.8, ease: "elastic.out(1, 0.45)" });

    /* Burst of thrust while moving */
    const thrust = { v: 1 };
    gsap.to(thrust, { v: 0.35, duration: 1.1, ease: "power2.in", onUpdate: () => setThrust(thrust.v) });
  }, [active, introDone]);

  /* Idle thrust follows scroll speed; keep docked on resize */
  useEffect(() => {
    if (!introDone) return;

    const tick = () => {
      const v = Math.min(1, Math.abs(scrollState.velocity) / 40);
      if (v > 0.35) setThrust(v);
    };

    const onResize = () => {
      const target = markerTarget(ui.get().active);
      if (target) gsap.set(rocketEl(), target);
    };

    gsap.ticker.add(tick);
    window.addEventListener("resize", onResize);
    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("resize", onResize);
    };
  }, [introDone]);

  /* Number keys jump between sectors */
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest?.("input, textarea") || ui.get().panel || ui.get().modal) return;
      const index = Number(e.key) - 1;
      if (index >= 0 && index < SECTIONS.length) {
        scrollToSection(SECTIONS[index].id);
        sfx("select");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <nav
      ref={railRef}
      className={`rail ${introDone ? "is-live" : ""}`}
      aria-label="Sections"
    >
      <div className="rail-line">
        <span className="rail-progress" />
      </div>

      {SECTIONS.map((section, index) => (
        <button
          key={section.id}
          ref={(el) => (markerRefs.current[index] = el)}
          className={[
            "rail-marker",
            index === active && "is-active",
            visited.includes(section.id) && "is-visited",
          ]
            .filter(Boolean)
            .join(" ")}
          onClick={() => {
            scrollToSection(section.id);
            sfx("select");
          }}
          onMouseEnter={() => sfx("hover")}
          aria-current={index === active ? "true" : undefined}
        >
          <span className="rail-label">
            <em>{String(index + 1).padStart(2, "0")}</em>
            {section.label}
          </span>
          <span className="rail-dot" />
        </button>
      ))}
    </nav>
  );
}
