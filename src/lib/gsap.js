import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(
  ScrollTrigger,
  MotionPathPlugin,
  DrawSVGPlugin,
  SplitText,
  ScrambleTextPlugin,
  useGSAP
);

/* Characters used by every "decode" effect on the site */
export const SCRAMBLE_CHARS = "01<>/\\[]{}#$%&*+=?ABCDEFXYZ";

export const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const finePointer = () =>
  window.matchMedia("(pointer: fine)").matches;

export { gsap, ScrollTrigger, SplitText, useGSAP };
