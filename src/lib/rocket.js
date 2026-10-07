/* =========================================================
   SHARED ROCKET
   A single fixed #rocket element is flown by the hero
   intro, then handed to the nav rail as the section
   indicator. The rail registers how to find a dock spot.
========================================================= */

export const ROCKET_SIZE = { w: 40, h: 60 };

let resolveDock = () => null;

export const setDockResolver = (fn) => {
  resolveDock = fn;
};

/* -> { x, y, rotation, scale } in viewport px for gsap */
export const dockTarget = (index) => resolveDock(index);

export const rocketEl = () => document.getElementById("rocket");

export const setThrust = (value) =>
  rocketEl()?.style.setProperty("--thrust", value.toFixed(2));
