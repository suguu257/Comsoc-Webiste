import { createStore } from "./createStore";

/* Session-only UI state (never persisted) */
export const ui = createStore({
  introDone: false,
  active: 0,
  panel: null, // "achievements" | "terminal" | "arcade" | "warp" | null
  modal: null, // { kind: "event" | "photo", item, rect }
});

export const openPanel = (panel) => ui.set({ panel });
export const closePanel = () => ui.set({ panel: null });
export const openModal = (modal) => ui.set({ modal });
export const closeModal = () => ui.set({ modal: null });
