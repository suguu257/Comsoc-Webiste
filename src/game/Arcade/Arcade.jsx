import "./Arcade.css";
import { useEffect, useRef, useState } from "react";
import { game, submitScore } from "../gameStore";
import { sfx } from "../sound";

/* =========================================================
   COMSOC INVADERS
   Defend the uplink from waves of noise packets.
   ← → / A D to move, Space to fire. Touch: drag + tap.
========================================================= */

const W = 640;
const H = 480;
const PX = 3;

const sprite = (rows) => rows.trim().split("\n").map((r) => r.trim());

const PLAYER = sprite(`
  .....X.....
  ....XXX....
  ....XCX....
  ...XXXXX...
  .XXXXXXXXX.
  XXXXXXXXXXX
  XX.XXXXX.XX
  X...F.F...X
`);

const ENEMY = [
  sprite(`
    ..X..X..
    ...XX...
    .XXXXXX.
    XX.XX.XX
    XXXXXXXX
    .X.XX.X.
  `),
  sprite(`
    ..X..X..
    X..XX..X
    XXXXXXXX
    XX.XX.XX
    .XXXXXX.
    X......X
  `),
];

const ROW_COLORS = ["#ff5c8a", "#b26bff", "#4f8bff", "#3ff2ff"];
const ROW_POINTS = [40, 30, 20, 10];

function drawSprite(ctx, rows, x, y, color, accents = {}) {
  rows.forEach((row, j) => {
    [...row].forEach((ch, i) => {
      if (ch === ".") return;
      ctx.fillStyle = accents[ch] || color;
      ctx.fillRect(x + i * PX, y + j * PX, PX, PX);
    });
  });
}

function makeWave(level) {
  const enemies = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 9; col++) {
      enemies.push({ x: 70 + col * 54, y: 60 + row * 40 + Math.min(level, 4) * 10, row, alive: true });
    }
  }
  return enemies;
}

export default function Arcade() {
  const canvasRef = useRef(null);
  const highScore = game.use((s) => s.highScore);
  const [hud, setHud] = useState({ score: 0, lives: 3, wave: 1, mode: "title" });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const keys = {};
    let raf = 0;
    let last = performance.now();

    const s = {
      mode: "title",
      player: { x: W / 2 - 16, cooldown: 0, invincible: 0 },
      bullets: [],
      bombs: [],
      sparks: [],
      enemies: makeWave(1),
      dir: 1,
      speed: 26,
      frame: 0,
      frameTimer: 0,
      score: 0,
      lives: 3,
      wave: 1,
      stars: Array.from({ length: 70 }, () => ({ x: Math.random() * W, y: Math.random() * H, v: 10 + Math.random() * 40 })),
    };

    const sync = () => setHud({ score: s.score, lives: s.lives, wave: s.wave, mode: s.mode });

    const start = () => {
      Object.assign(s, {
        mode: "play",
        bullets: [],
        bombs: [],
        sparks: [],
        enemies: makeWave(1),
        dir: 1,
        speed: 26,
        score: 0,
        lives: 3,
        wave: 1,
      });
      s.player.x = W / 2 - 16;
      sfx("coin");
      sync();
    };

    const fire = () => {
      if (s.mode !== "play") return start();
      if (s.player.cooldown > 0) return;
      s.bullets.push({ x: s.player.x + 15, y: H - 60 });
      s.player.cooldown = 0.32;
      sfx("shoot");
    };

    const burst = (x, y, color) => {
      for (let i = 0; i < 10; i++) {
        s.sparks.push({ x, y, vx: (Math.random() - 0.5) * 220, vy: (Math.random() - 0.5) * 220, life: 0.5, color });
      }
    };

    const gameOver = () => {
      s.mode = "over";
      submitScore(s.score);
      sfx("boom");
      sync();
    };

    const update = (dt) => {
      s.stars.forEach((st) => {
        st.y += st.v * dt;
        if (st.y > H) st.y = 0;
      });
      s.sparks = s.sparks.filter((p) => (p.life -= dt) > 0);
      s.sparks.forEach((p) => {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
      });

      if (s.mode !== "play") return;

      const p = s.player;
      if (keys.ArrowLeft || keys.a) p.x -= 260 * dt;
      if (keys.ArrowRight || keys.d) p.x += 260 * dt;
      if (keys[" "]) fire();
      p.x = Math.max(8, Math.min(W - 41, p.x));
      p.cooldown -= dt;
      p.invincible -= dt;

      /* Bullets */
      s.bullets.forEach((b) => (b.y -= 420 * dt));
      s.bullets = s.bullets.filter((b) => b.y > -10);

      /* Enemy march */
      const alive = s.enemies.filter((e) => e.alive);
      s.frameTimer += dt;
      if (s.frameTimer > 0.45) {
        s.frameTimer = 0;
        s.frame ^= 1;
      }

      const pace = s.speed + (36 - alive.length) * 4.5;
      let hitEdge = false;
      alive.forEach((e) => {
        e.x += s.dir * pace * dt;
        if (e.x < 10 || e.x > W - 34) hitEdge = true;
      });
      if (hitEdge) {
        s.dir *= -1;
        alive.forEach((e) => {
          e.y += 16;
          e.x += s.dir * 4;
        });
      }

      /* Enemy fire */
      if (alive.length && Math.random() < dt * (0.9 + s.wave * 0.25)) {
        const shooter = alive[Math.floor(Math.random() * alive.length)];
        s.bombs.push({ x: shooter.x + 11, y: shooter.y + 18 });
      }
      s.bombs.forEach((b) => (b.y += (170 + s.wave * 15) * dt));
      s.bombs = s.bombs.filter((b) => b.y < H);

      /* Collisions: bullets vs packets */
      s.bullets.forEach((b) => {
        alive.forEach((e) => {
          if (e.alive && !b.hit && b.x > e.x - 2 && b.x < e.x + 26 && b.y > e.y && b.y < e.y + 20) {
            e.alive = false;
            b.hit = true;
            s.score += ROW_POINTS[e.row] * s.wave;
            burst(e.x + 12, e.y + 9, ROW_COLORS[e.row]);
            sfx("hit");
            sync();
          }
        });
      });
      s.bullets = s.bullets.filter((b) => !b.hit);

      /* Bombs vs player */
      const py = H - 50;
      s.bombs.forEach((b) => {
        if (p.invincible <= 0 && b.x > p.x && b.x < p.x + 33 && b.y > py && b.y < py + 24) {
          b.hit = true;
          s.lives -= 1;
          p.invincible = 1.5;
          burst(p.x + 16, py + 10, "#ffb347");
          sfx("boom");
          sync();
          if (s.lives <= 0) gameOver();
        }
      });
      s.bombs = s.bombs.filter((b) => !b.hit);

      /* Packets reaching the uplink */
      if (alive.some((e) => e.y > H - 80)) gameOver();

      /* Next wave */
      if (!alive.length) {
        s.wave += 1;
        s.speed += 10;
        s.enemies = makeWave(s.wave);
        s.score += 100 * s.wave;
        sfx("unlock");
        sync();
      }
    };

    const text = (str, x, y, size, color, align = "center") => {
      ctx.font = `${size}px "Tiny5", monospace`;
      ctx.textAlign = align;
      ctx.fillStyle = color;
      ctx.fillText(str, x, y);
    };

    const draw = () => {
      ctx.fillStyle = "#020306";
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = "#ffffff55";
      s.stars.forEach((st) => ctx.fillRect(st.x, st.y, 2, 2));

      /* Uplink ground line */
      ctx.fillStyle = "#3ff2ff33";
      ctx.fillRect(0, H - 20, W, 2);

      s.enemies.forEach((e) => e.alive && drawSprite(ctx, ENEMY[s.frame], e.x, e.y, ROW_COLORS[e.row]));

      const p = s.player;
      if (s.mode === "play" && (p.invincible <= 0 || Math.floor(p.invincible * 10) % 2)) {
        drawSprite(ctx, PLAYER, p.x, H - 50, "#e8f2ff", { C: "#3ff2ff", F: "#ffb347" });
      }

      ctx.fillStyle = "#3ff2ff";
      s.bullets.forEach((b) => ctx.fillRect(b.x, b.y, 3, 12));
      ctx.fillStyle = "#ff5c8a";
      s.bombs.forEach((b) => ctx.fillRect(b.x, b.y, 4, 8));

      s.sparks.forEach((sp) => {
        ctx.globalAlpha = Math.max(sp.life * 2, 0);
        ctx.fillStyle = sp.color;
        ctx.fillRect(sp.x, sp.y, 4, 4);
      });
      ctx.globalAlpha = 1;

      if (s.mode === "title") {
        text("COMSOC INVADERS", W / 2, 190, 40, "#3ff2ff");
        text("DEFEND THE UPLINK FROM NOISE PACKETS", W / 2, 230, 14, "#8d97ab");
        if (Math.floor(performance.now() / 500) % 2) text("PRESS SPACE / TAP TO START", W / 2, 300, 18, "#ffd166");
      }

      if (s.mode === "over") {
        text("SIGNAL LOST", W / 2, 200, 40, "#ff5c8a");
        text(`SCORE ${s.score}`, W / 2, 245, 20, "#e8f2ff");
        if (Math.floor(performance.now() / 500) % 2) text("PRESS SPACE / TAP TO RETRY", W / 2, 300, 18, "#ffd166");
      }
    };

    const loop = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      update(dt);
      draw();
      raf = requestAnimationFrame(loop);
    };

    const onDown = (e) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "].includes(key)) e.preventDefault();
      if (key === " " && s.mode !== "play") start();
      keys[key] = true;
    };
    const onUp = (e) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      keys[key] = false;
    };

    /* Pointer: move ship to the finger / mouse, tap to fire */
    const toLocal = (e) => {
      const r = canvas.getBoundingClientRect();
      return ((e.clientX - r.left) / r.width) * W;
    };
    const onPointerMove = (e) => {
      if (s.mode === "play" && (e.pointerType !== "mouse" || e.buttons)) s.player.x = toLocal(e) - 16;
    };
    const onPointerDown = (e) => {
      if (s.mode === "play") s.player.x = toLocal(e) - 16;
      fire();
    };

    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerdown", onPointerDown);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerdown", onPointerDown);
      if (s.mode === "play") submitScore(s.score);
    };
  }, []);

  return (
    <div className="arcade">
      <div className="arcade-hud">
        <span>SCORE {String(hud.score).padStart(5, "0")}</span>
        <span>WAVE {hud.wave}</span>
        <span>{"♥".repeat(Math.max(hud.lives, 0))}</span>
        <span>HI {String(Math.max(highScore, hud.score)).padStart(5, "0")}</span>
      </div>
      <canvas ref={canvasRef} width={W} height={H} className="arcade-screen" />
      <p className="arcade-help">← → MOVE · SPACE FIRE · 1000 PTS UNLOCKS ACE PILOT</p>
    </div>
  );
}
