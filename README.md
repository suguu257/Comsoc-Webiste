# IEEE ComSoc VIT Vellore — website

A single-page, game-like site: a rocket launches, writes the chapter name, orbits the logo and docks into the nav rail, then guides visitors through six "sectors".

```bash
npm install
npm run dev
```

## The flow

| # | Sector | What happens |
|---|--------|--------------|
| 1 | **Launch Pad** (`sections/Hero`) | Countdown → rocket launch. Its cyan trail reveals *IEEE COMSOC / VIT VELLORE*, it orbits the logo, then docks into the nav rail. CTAs fade in. Skippable (button, Esc, Enter, Space). |
| 2 | **Mission Log** (`sections/Story`) | Title decodes, decor slides in from both sides, story arrives line by line like a transmission, stats count up. |
| 3 | **Cinema Deck** (`sections/Events`) | Two film strips in opposite directions; speed follows scroll velocity, hovering brakes a strip. Hover a poster = zoom + cyan glow + details; click = mission file modal. |
| 4 | **Crew Bay** (`sections/Board`) | The board photo resolves from 8-bit pixels to sharp, then becomes a character-select screen: hovered member in colour, everyone else greyed out, profile card swaps in place. ◀ ▶ to cycle; idles into autoplay. |
| 5 | **Memory Bank** (`sections/Gallery`) | Pinned "memory warp": photos fly out of deep space toward you as you scroll. Hover = zoom + glow, click = lightbox. |
| 6 | **Comms Array** (`sections/Contact`) | Emails on a comms console (click to copy), socials orbiting a planet, and a "Mission Complete" report in the footer. |

The **rocket** (`components/Rocket`) is the section indicator in the **nav rail** (`components/NavRail`; bottom dock on phones). Number keys **1–6** jump between sectors.

## Gamification

Everything lives in `src/game/` and saves to `localStorage` per visitor.

- **XP, levels and ranks** in the HUD; sector discovery, achievements and collectibles award XP.
- **15 achievements** (`game/achievements.js`) shown in the trophy room.
- **6 hidden signal fragments**, one blinking somewhere in each sector.
- **Terminal**: press `~` — try `help`, `goto 3`, `whoami`, `warp`, `play`.
- **COMSOC INVADERS** arcade game (HUD gamepad button, `play`, or the Konami code ↑↑↓↓←→←→BA).
- **Warp**: `warp` in the terminal plays the Hyperspeed effect.
- Synthesised **8-bit sound** (off by default, speaker button in the HUD).
- Reticle cursor with a pixel trail, and a message in the dev-tools console.

## Editing content

All copy, links and image paths are in **`src/data/content.js`**.

- **Logo**: replace `public/comsoc-logo.svg` (or point `LOGO_SRC` elsewhere).
- **Event posters**: add images to `public/events/` and set `image` on each event. Without an image, a pixel-art poster is generated. Set `status: "upcoming"` for the blinking LIVE tag and `link` for the register button.
- **Board photo**: drop the group photo in `public/team/` and set `BOARD_PHOTO`. Each member has a `hotspot` (`x, y, w, h` in **percent of the photo**). Adjust these so each box frames that person; the highlight, bracket and portrait crop all derive from it.
- **Gallery**: put photos in `public/gallery/` and set `image` on each item.
- **Contact**: `EMAILS` and `SOCIALS`.

## Stack

React 19 + Vite, GSAP (ScrollTrigger, MotionPath, DrawSVG, SplitText, ScrambleText) with Lenis smooth scrolling, a canvas starfield, and three.js only for the lazy-loaded warp.

`prefers-reduced-motion` skips the launch, pinning and parallax.
