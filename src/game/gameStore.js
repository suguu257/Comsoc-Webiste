import { createStore } from "../lib/createStore";
import { ACHIEVEMENT_MAP, FRAGMENT_COUNT } from "./achievements";
import { SECTIONS, BOARD } from "../data/content";
import { sfx } from "./sound";

/* =========================================================
   SAVE FILE
   Progress persists per browser. Storage can be missing
   (private mode, blocked site data), so every access is
   guarded and the game still works for the session.
========================================================= */

const SAVE_KEY = "comsoc-save-v1";
const PERSISTED = ["xp", "visited", "unlocked", "fragments", "inspected", "posters", "highScore", "sound"];

function load() {
  try {
    return JSON.parse(localStorage.getItem(SAVE_KEY)) || {};
  } catch {
    return {};
  }
}

const saved = load();

export const game = createStore({
  xp: saved.xp ?? 0,
  visited: saved.visited ?? [],
  unlocked: saved.unlocked ?? [],
  fragments: saved.fragments ?? [],
  inspected: saved.inspected ?? [],
  posters: saved.posters ?? [],
  highScore: saved.highScore ?? 0,
  sound: saved.sound ?? false,
  toasts: [],
});

game.subscribe(() => {
  const state = game.get();
  const data = Object.fromEntries(PERSISTED.map((key) => [key, state[key]]));
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch {
    /* storage unavailable: progress lasts for this visit only */
  }
});

/* =========================================================
   XP + LEVELS
========================================================= */

export const XP_PER_LEVEL = 500;
export const levelOf = (xp) => Math.floor(xp / XP_PER_LEVEL) + 1;

const RANKS = ["CADET", "ENSIGN", "PILOT", "NAVIGATOR", "COMMANDER", "CAPTAIN", "ADMIRAL", "LEGEND"];
export const rankOf = (xp) => RANKS[Math.min(levelOf(xp) - 1, RANKS.length - 1)];

export function addXp(amount) {
  const before = levelOf(game.get().xp);
  game.set((s) => ({ xp: s.xp + amount }));
  const after = levelOf(game.get().xp);

  if (after > before) {
    toast({ kind: "level", title: `LEVEL ${after}`, desc: `RANK: ${rankOf(game.get().xp)}` });
    sfx("levelup");
  }
}

/* =========================================================
   TOASTS
========================================================= */

let toastId = 0;

export function toast(t) {
  const id = ++toastId;
  game.set((s) => ({ toasts: [...s.toasts.slice(-2), { ...t, id }] }));
  setTimeout(() => {
    game.set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) }));
  }, 4200);
}

/* =========================================================
   ACHIEVEMENTS
========================================================= */

export function unlock(id) {
  const def = ACHIEVEMENT_MAP[id];
  if (!def || game.get().unlocked.includes(id)) return;

  game.set((s) => ({ unlocked: [...s.unlocked, id] }));
  toast({ kind: "achievement", title: def.title, desc: def.desc, icon: def.icon, xp: def.xp });
  sfx("unlock");
  addXp(def.xp);
}

/* Adds `value` to a list in the save, returns the new list or null if already there */
function addUnique(key, value) {
  const list = game.get()[key];
  if (list.includes(value)) return null;
  const next = [...list, value];
  game.set({ [key]: next });
  return next;
}

export function visitSector(id) {
  const visited = addUnique("visited", id);
  if (!visited) return;

  const index = SECTIONS.findIndex((s) => s.id === id);

  if (id !== "home") {
    toast({
      kind: "sector",
      title: `SECTOR ${String(index + 1).padStart(2, "0")} DISCOVERED`,
      desc: SECTIONS[index].sector,
      xp: 50,
    });
    sfx("sector");
    addXp(50);
    unlock("first-contact");
  }

  if (id === "contact") unlock("mission-complete");
  if (visited.length === SECTIONS.length) unlock("explorer");
}

export function collectFragment(id) {
  const fragments = addUnique("fragments", id);
  if (!fragments) return;

  toast({
    kind: "fragment",
    title: "SIGNAL FRAGMENT RECOVERED",
    desc: `${fragments.length} / ${FRAGMENT_COUNT}`,
    xp: 75,
  });
  sfx("coin");
  addXp(75);

  if (fragments.length >= FRAGMENT_COUNT) unlock("signal-hunter");
}

export function inspectMember(id) {
  const inspected = addUnique("inspected", id);
  if (!inspected) return;
  addXp(10);
  if (inspected.length >= BOARD.length) unlock("talent-scout");
}

export function inspectPoster(id) {
  const posters = addUnique("posters", id);
  if (!posters) return;
  addXp(10);
  if (posters.length >= 5) unlock("cinephile");
}

export function submitScore(score) {
  if (score > game.get().highScore) game.set({ highScore: score });
  if (score >= 1000) unlock("ace-pilot");
}

export function toggleSound() {
  const sound = !game.get().sound;
  game.set({ sound });
  if (sound) {
    sfx("select");
    unlock("audiophile");
  }
}

export function resetSave() {
  game.set({ xp: 0, visited: [], unlocked: [], fragments: [], inspected: [], posters: [], highScore: 0 });
}
