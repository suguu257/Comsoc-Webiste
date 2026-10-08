import { useSyncExternalStore } from "react";

/* =========================================================
   TINY EXTERNAL STORE
   Readable from React (store.use) and from plain modules
   (store.get / store.set) such as the sound engine or GSAP
   callbacks. Selectors must return existing state values.
========================================================= */

export function createStore(initial) {
  let state = initial;
  const listeners = new Set();

  const get = () => state;

  const set = (patch) => {
    const next = typeof patch === "function" ? patch(state) : patch;
    state = { ...state, ...next };
    listeners.forEach((listener) => listener());
  };

  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const use = (selector = (s) => s) =>
    useSyncExternalStore(subscribe, () => selector(state));

  return { get, set, subscribe, use };
}
