/* =========================================================
   ACHIEVEMENTS
   `hint` is what locked badges show in the trophy room.
========================================================= */

export const ACHIEVEMENTS = [
  { id: "liftoff", title: "LIFTOFF", desc: "Watched the full launch sequence.", hint: "Patience, pilot.", xp: 100, icon: "rocket" },
  { id: "first-contact", title: "FIRST CONTACT", desc: "Left the launch pad.", hint: "Start scrolling.", xp: 50, icon: "signal" },
  { id: "explorer", title: "EXPLORER", desc: "Discovered every sector.", hint: "Visit every sector.", xp: 300, icon: "planet" },
  { id: "mission-complete", title: "MISSION COMPLETE", desc: "Reached the comms array.", hint: "Reach the end of the map.", xp: 150, icon: "flag" },
  { id: "cinephile", title: "CINEPHILE", desc: "Inspected 5 event posters.", hint: "The film reel hides stories.", xp: 150, icon: "film" },
  { id: "talent-scout", title: "TALENT SCOUT", desc: "Met every board member.", hint: "Select every player.", xp: 250, icon: "crew" },
  { id: "signal-hunter", title: "SIGNAL HUNTER", desc: "Recovered all 6 lost signal fragments.", hint: "Something is blinking out there…", xp: 500, icon: "antenna" },
  { id: "hacker", title: "HACKERMAN", desc: "Opened the terminal.", hint: "Try the key under Esc.", xp: 100, icon: "terminal" },
  { id: "warp", title: "WARP DRIVE", desc: "Engaged hyperspeed.", hint: "The terminal knows a shortcut.", xp: 200, icon: "warp" },
  { id: "konami", title: "OLD SCHOOL", desc: "↑ ↑ ↓ ↓ ← → ← → B A", hint: "A classic code.", xp: 250, icon: "gamepad" },
  { id: "ace-pilot", title: "ACE PILOT", desc: "Scored 1000+ in COMSOC INVADERS.", hint: "Find the arcade and play.", xp: 300, icon: "trophy" },
  { id: "speed-demon", title: "SPEED DEMON", desc: "Broke the scroll sound barrier.", hint: "Scroll. Fast.", xp: 100, icon: "bolt" },
  { id: "audiophile", title: "AUDIOPHILE", desc: "Turned the sound on.", hint: "Things sound better on.", xp: 50, icon: "sound" },
  { id: "networker", title: "NETWORKER", desc: "Copied a comms channel.", hint: "Grab an email.", xp: 75, icon: "mail" },
  { id: "night-owl", title: "NIGHT OWL", desc: "Visited between midnight and 5 AM.", hint: "Come back late.", xp: 100, icon: "moon" },
];

export const ACHIEVEMENT_MAP = Object.fromEntries(
  ACHIEVEMENTS.map((a) => [a.id, a])
);

export const FRAGMENT_COUNT = 6;
