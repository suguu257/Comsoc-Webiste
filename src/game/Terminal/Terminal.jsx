import "./Terminal.css";
import { useEffect, useRef, useState } from "react";
import { closePanel, openPanel } from "../../lib/uiStore";
import { scrollToSection } from "../../lib/scroll";
import { game, levelOf, rankOf, toggleSound, unlock } from "../gameStore";
import { ACHIEVEMENTS } from "../achievements";
import { sfx } from "../sound";
import { SECTIONS, STORY, EVENTS_TOP, EVENTS_BOTTOM, BOARD, SOCIALS, EMAILS } from "../../data/content";

/* =========================================================
   TERMINAL  (~ to open)
========================================================= */

const BANNER = [
  "COMSOC-OS v26.10 — secure uplink established",
  "type 'help' to list commands",
];

const HELP = [
  "help              this list",
  "about             what is ComSoc?",
  "ls | sectors      list sectors",
  "goto <1-6|name>   fly to a sector",
  "events            list missions",
  "crew              list the board",
  "contact           comms channels",
  "whoami            your pilot stats",
  "trophies          open the trophy room",
  "play              launch COMSOC INVADERS",
  "warp              engage hyperspeed",
  "sound <on|off>    toggle audio",
  "clear             clear the screen",
  "exit              close the terminal",
];

function run(raw) {
  const [cmd, ...args] = raw.trim().split(/\s+/);
  const arg = args.join(" ").toLowerCase();

  switch ((cmd || "").toLowerCase()) {
    case "":
      return [];
    case "help":
    case "?":
      return HELP;
    case "about":
      return [STORY.paragraphs[0]];
    case "ls":
    case "sectors":
      return SECTIONS.map((s, i) => `[${i + 1}] ${s.label.padEnd(8)} ${s.sector}`);
    case "goto":
    case "cd": {
      const index = SECTIONS.findIndex(
        (s, i) => String(i + 1) === arg || s.id === arg || s.label.toLowerCase() === arg
      );
      if (index < 0) return [`unknown sector '${arg}'. try 'ls'.`];
      setTimeout(() => {
        closePanel();
        scrollToSection(SECTIONS[index].id);
      }, 250);
      return [`plotting course to ${SECTIONS[index].sector}...`];
    }
    case "events":
      return [...EVENTS_TOP, ...EVENTS_BOTTOM].map(
        (e) => `${e.status === "upcoming" ? "●" : "·"} ${e.title.padEnd(16)} ${e.date}`
      );
    case "crew":
    case "board":
      return BOARD.map((m) => `${m.role.padEnd(18)} ${m.name}`);
    case "contact":
    case "socials":
      return [...EMAILS.map((e) => `${e.label.padEnd(18)} ${e.email}`), ...SOCIALS.map((s) => `${s.label.padEnd(18)} ${s.url}`)];
    case "whoami": {
      const s = game.get();
      return [
        `rank      ${rankOf(s.xp)} (LV ${levelOf(s.xp)})`,
        `xp        ${s.xp}`,
        `trophies  ${s.unlocked.length}/${ACHIEVEMENTS.length}`,
        `sectors   ${s.visited.length}/${SECTIONS.length}`,
        `hi-score  ${s.highScore}`,
      ];
    }
    case "trophies":
    case "achievements":
      setTimeout(() => openPanel("achievements"), 200);
      return ["opening trophy room..."];
    case "play":
    case "arcade":
      setTimeout(() => openPanel("arcade"), 200);
      return ["inserting coin..."];
    case "warp":
    case "hyperspeed":
      setTimeout(() => openPanel("warp"), 300);
      return ["spooling warp core... hold on to something."];
    case "sound": {
      const on = game.get().sound;
      if ((arg === "on" && !on) || (arg === "off" && on) || !arg) toggleSound();
      return [`sound ${game.get().sound ? "ON" : "OFF"}`];
    }
    case "ping":
      return ["pong · 2ms · signal ▮▮▮▮▯"];
    case "date":
      return [new Date().toString()];
    case "hello":
    case "hi":
      return ["hello, pilot. o7"];
    case "sudo":
      return ["nice try. this incident has been reported to the chairperson."];
    case "rm":
      return ["permission denied: sector protected by the ComSoc firewall."];
    case "exit":
    case "quit":
      setTimeout(closePanel, 100);
      return ["closing uplink..."];
    default:
      sfx("error");
      return [`command not found: ${cmd}. type 'help'.`];
  }
}

export default function Terminal() {
  const [lines, setLines] = useState(BANNER);
  const [value, setValue] = useState("");
  const history = useRef([]);
  const historyIndex = useRef(-1);
  const inputRef = useRef(null);
  const screenRef = useRef(null);

  useEffect(() => {
    unlock("hacker");
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    screenRef.current?.scrollTo(0, screenRef.current.scrollHeight);
  }, [lines]);

  const submit = (e) => {
    e.preventDefault();
    const command = value;
    setValue("");
    history.current.unshift(command);
    historyIndex.current = -1;

    if (command.trim().toLowerCase() === "clear") {
      setLines([]);
      return;
    }
    sfx("select");
    const output = run(command);
    setLines((prev) => [...prev, `> ${command}`, ...output]);
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const dir = e.key === "ArrowUp" ? 1 : -1;
      const next = Math.min(Math.max(historyIndex.current + dir, -1), history.current.length - 1);
      historyIndex.current = next;
      setValue(next < 0 ? "" : history.current[next]);
    } else if (e.key.length === 1) {
      sfx("type");
    }
  };

  return (
    <div className="terminal" onClick={() => inputRef.current?.focus()}>
      <div className="term-screen" ref={screenRef}>
        {lines.map((line, i) => (
          <p key={i} className={line.startsWith(">") ? "is-cmd" : ""}>
            {line}
          </p>
        ))}
        <form onSubmit={submit} className="term-input">
          <span>pilot@comsoc:~$</span>
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoComplete="off"
            aria-label="Terminal command"
          />
        </form>
      </div>
    </div>
  );
}
