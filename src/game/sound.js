import { game } from "./gameStore";

/* =========================================================
   8-BIT SOUND ENGINE
   Every effect is synthesised with WebAudio, so there are
   no audio files to load. Silent unless sound is on.
========================================================= */

let ctx = null;

function audio() {
  if (!ctx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    ctx = new Ctx();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function tone({ freq, to, dur = 0.08, type = "square", vol = 0.04, delay = 0 }) {
  const c = audio();
  if (!c) return;

  const t = c.currentTime + delay;
  const osc = c.createOscillator();
  const gain = c.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t + dur);

  gain.gain.setValueAtTime(vol, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

  osc.connect(gain).connect(c.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

function noise({ dur = 0.3, vol = 0.05, from = 2000, to = 200 }) {
  const c = audio();
  if (!c) return;

  const t = c.currentTime;
  const buffer = c.createBuffer(1, c.sampleRate * dur, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

  const src = c.createBufferSource();
  const filter = c.createBiquadFilter();
  const gain = c.createGain();

  src.buffer = buffer;
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(from, t);
  filter.frequency.exponentialRampToValueAtTime(to, t + dur);
  gain.gain.setValueAtTime(vol, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

  src.connect(filter).connect(gain).connect(c.destination);
  src.start(t);
}

const arpeggio = (notes, step = 0.07, dur = 0.12, type = "square") =>
  notes.forEach((freq, i) => tone({ freq, dur, delay: i * step, type }));

const SFX = {
  hover: () => tone({ freq: 1320, dur: 0.025, vol: 0.015 }),
  select: () => tone({ freq: 520, to: 1040, dur: 0.09 }),
  back: () => tone({ freq: 700, to: 300, dur: 0.1 }),
  type: () => tone({ freq: 1800 + Math.random() * 400, dur: 0.015, vol: 0.012 }),
  coin: () => arpeggio([988, 1319], 0.08, 0.14),
  unlock: () => arpeggio([523, 659, 784, 1047], 0.07, 0.14),
  levelup: () => arpeggio([392, 523, 659, 784, 1047, 1319], 0.06, 0.16, "triangle"),
  sector: () => arpeggio([660, 990], 0.06, 0.08, "triangle"),
  error: () => tone({ freq: 160, to: 90, dur: 0.22, type: "sawtooth" }),
  launch: () => noise({ dur: 1.8, vol: 0.06, from: 900, to: 80 }),
  warp: () => { noise({ dur: 2.5, vol: 0.05, from: 300, to: 4000 }); tone({ freq: 80, to: 900, dur: 2.4, type: "sawtooth", vol: 0.02 }); },
  shoot: () => tone({ freq: 900, to: 220, dur: 0.1, vol: 0.025 }),
  hit: () => noise({ dur: 0.15, vol: 0.05, from: 3000, to: 300 }),
  boom: () => noise({ dur: 0.6, vol: 0.08, from: 1200, to: 60 }),
};

export function sfx(name, { force = false } = {}) {
  if (!force && !game.get().sound) return;
  try {
    SFX[name]?.();
  } catch {
    /* audio is decorative; never let it break the page */
  }
}
