/* =========================================================
   SITE CONTENT
   Everything editable lives here. Images are placeholders:
   drop real files into /public and point the paths at them.
   Any `image: null` renders a generated placeholder.
========================================================= */

export const SECTIONS = [
  { id: "home", label: "HOME", sector: "LAUNCH PAD" },
  { id: "story", label: "STORY", sector: "MISSION LOG" },
  { id: "events", label: "EVENTS", sector: "CINEMA DECK" },
  { id: "team", label: "TEAM", sector: "CREW BAY" },
  { id: "gallery", label: "GALLERY", sector: "MEMORY BANK" },
  { id: "contact", label: "CONTACT", sector: "COMMS ARRAY" },
];

/* Link used by the "Join ComSoc" button */
export const JOIN_URL = "#contact";

/* Replace with the official IEEE ComSoc logo */
export const LOGO_SRC = "/comsoc-logo.svg";

/* =========================================================
   OUR STORY
========================================================= */

export const STORY = {
  transmission: "TRANSMISSION #0042",
  paragraphs: [
    "IEEE Communications Society, VIT Vellore is a community of students who are curious about how the world stays connected — from the antennas on our rooftops to the satellites above them.",
    "We run workshops, hackathons, talks and competitions that turn signals, networks and systems into things you can build with your own hands.",
    "Placeholder copy: replace these lines with the chapter's real story, milestones and mission.",
  ],
  stats: [
    { label: "CREW MEMBERS", value: 120, suffix: "+" },
    { label: "EVENTS HOSTED", value: 40, suffix: "+" },
    { label: "PARTICIPANTS", value: 5000, suffix: "+" },
    { label: "YEARS IN ORBIT", value: 6, suffix: "" },
  ],
};

/* =========================================================
   EVENTS (two film strips)
   status: "upcoming" shows a blinking LIVE tag
========================================================= */

const event = (id, title, hue, extra = {}) => ({
  id,
  title,
  hue,
  image: null,
  date: "DATE TBA",
  venue: "VIT VELLORE",
  summary: "Short one-line teaser for the event goes here.",
  details:
    "Full event description goes here: what participants will build, learn or compete in, who it is for and what they walk away with.",
  link: null,
  status: "past",
  ...extra,
});

export const EVENTS_TOP = [
  event("gravitas-expo", "GRAVITAS EXPO", 275, { status: "upcoming", date: "GRAVITAS '26" }),
  event("red-handed", "RED HANDED", 350),
  event("perceptron", "PERCEPTRON", 225),
  event("loralink", "LORALINK", 195),
  event("loraquiz", "LORAQUIZ", 170),
  event("yantra", "YANTRA", 20),
  event("signal-sprint", "SIGNAL SPRINT", 250),
];

export const EVENTS_BOTTOM = [
  event("packet-hunt", "PACKET HUNT", 140),
  event("antenna-lab", "ANTENNA LAB", 205),
  event("five-g-talk", "5G DEEP DIVE", 290),
  event("hack-the-air", "HACK THE AIR", 320, { status: "upcoming" }),
  event("netsec-ctf", "NETSEC CTF", 110),
  event("orbit-talks", "ORBIT TALKS", 235),
  event("sdr-workshop", "SDR WORKSHOP", 185),
];

/* =========================================================
   BOARD
   One group photo of the whole board. Each member has a
   hotspot (percent of the photo) that is highlighted on
   hover. When the real photo lands, swap BOARD_PHOTO and
   adjust each hotspot to frame that person.
========================================================= */

export const BOARD_PHOTO = "/team/BOARD_PHOTO.svg";

const member = (id, role, hotspot, extra = {}) => ({
  id,
  role,
  name: "PLAYER NAME",
  bio: "A couple of lines about this board member — what they work on, what they love, and the one thing they want every member to try.",
  hotspot,
  socials: { linkedin: "#", instagram: "#", github: "#" },
  ...extra,
});

/* Hotspots match the silhouettes in board-placeholder.svg */
export const BOARD = [
  member("chair", "CHAIRPERSON", { x: 34.625, y: 13.4,  w: 10.625, h: 40 }, {name: "Keshav S Kaushish", class: "COMMANDER", stats: { LEAD: 98, COMMS: 90, TECH: 80 } }),
  member("vice-chair", "VICE CHAIRPERSON", { x: 17.625, y: 24.4,  w: 10.625, h: 40 }, {name: "Srijan Devipur", class: "NAVIGATOR", stats: { LEAD: 92, COMMS: 88, TECH: 78 } }),
  member("secretary", "SECRETARY", { x: 51.625, y: 15.4,  w: 10.625, h: 40 }, {name: "Ayushman Poddar", class: "ARCHIVIST", stats: { LEAD: 85, COMMS: 94, TECH: 70 } }),
  member("co-secretary", "CO-SECRETARY", { x: 69.125, y: 23.4,  w: 10.625, h: 40 }, {name: "Hardhik Basotia", class: "ARCHIVIST", stats: { LEAD: 80, COMMS: 90, TECH: 72 } }),
  member("tech-head", "TECHNICAL HEAD", { x: 4.225, y: 34.4,  w: 10.625, h: 40 }, {name: "Nainika Pathak", class: "ENGINEER", stats: { LEAD: 82, COMMS: 70, TECH: 99 } }),
  member("events-head", "EVENTS HEAD", { x: 78.525, y: 15, w: 10.625, h: 40 }, {name: "Aadyasha Behera", class: "STRATEGIST", stats: { LEAD: 90, COMMS: 86, TECH: 68 } }),
  member("design-head", "DESIGN HEAD", { x: 59.56, y: 34.2, w: 10.625, h: 40 }, {name: "Vibhor Gupta", class: "ARTIFICER", stats: { LEAD: 78, COMMS: 80, TECH: 85 } }),
  member("publicity-head", "PUBLICITY HEAD", { x: 44.69, y: 30.2, w: 10.625, h: 40 }, {name: "Madhur Mishra", class: "BROADCASTER", stats: { LEAD: 80, COMMS: 99, TECH: 65 } }),
  member("finance-head", "FINANCE HEAD", { x: 85.81, y: 31.2, w: 10.625, h: 40 }, {name: "Anan Jindal", class: "QUARTERMASTER", stats: { LEAD: 84, COMMS: 76, TECH: 74 } }),
  member("mgmt-head", "MANAGEMENT HEAD", { x: 28.54, y: 31.2, w: 10.625, h: 40 }, {name: "Aniruddh Agarwal", class: "OPERATOR", stats: { LEAD: 90, COMMS: 84, TECH: 70 } }),
];

/* =========================================================
   GALLERY
========================================================= */

export const GALLERY = Array.from({ length: 14 }, (_, i) => ({
  id: `memory-${i + 1}`,
  image: null, // e.g. "/gallery/01.jpg"
  caption: `MEMORY ${String(i + 1).padStart(2, "0")}`,
  hue: [200, 225, 260, 190, 285, 175, 240][i % 7],
}));

/* =========================================================
   CONTACT
========================================================= */

export const EMAILS = [
  { label: "GENERAL", email: "comsoc@example.com" },
  { label: "CHAIRPERSON", email: "chair.comsoc@example.com" },
  { label: "EVENTS & COLLABS", email: "events.comsoc@example.com" },
];

export const SOCIALS = [
  { id: "instagram", label: "INSTAGRAM", url: "#" },
  { id: "linkedin", label: "LINKEDIN", url: "#" },
  { id: "github", label: "GITHUB", url: "#" },
  { id: "youtube", label: "YOUTUBE", url: "#" },
  { id: "x", label: "X", url: "#" },
];