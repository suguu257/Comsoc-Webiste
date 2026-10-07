import "./Modal.css";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { gsap } from "../../lib/gsap";
import { lockScroll } from "../../lib/scroll";
import { sfx } from "../../game/sound";

/* =========================================================
   MODAL
   Opens like a CRT screen switching on. Esc / backdrop
   closes. Locks the page scroll while open.
========================================================= */

export default function Modal({ onClose, label, className = "", children }) {
  const windowRef = useRef(null);
  const closeRef = useRef(onClose);

  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    lockScroll(true);
    sfx("select");

    const el = windowRef.current;
    gsap.fromTo(
      el,
      /* opacity, not autoAlpha: visibility:hidden would steal focus from inputs */
      { scaleY: 0.02, scaleX: 0.6, opacity: 0 },
      { keyframes: [{ scaleX: 1, opacity: 1, duration: 0.18 }, { scaleY: 1, duration: 0.32, ease: "power3.out" }] }
    );
    if (!el.contains(document.activeElement)) el.focus();

    const onKey = (e) => e.key === "Escape" && closeRef.current();
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      lockScroll(false);
    };
  }, []);

  return createPortal(
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        ref={windowRef}
        className={`modal-window ${className}`}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        data-lenis-prevent
      >
        <div className="modal-bar">
          <span>{label}</span>
          <button className="modal-close" onClick={() => { sfx("back"); onClose(); }} aria-label="Close">
            [X]
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>,
    document.body
  );
}
