import "./Rocket.css";

/* Pixel rocket, nose pointing up. Grid is 10 x 11 units. */
const PIXELS = [
  [4, 0, 2, 1, "#ffffff"],
  [3, 1, 4, 1, "#e8f2ff"],
  [2, 2, 6, 8, "#e8f2ff"],
  [7, 2, 1, 8, "#a9b8d6"],
  [4, 3, 2, 2, "#3ff2ff"],
  [2, 7, 6, 1, "#2f6bff"],
  [0, 7, 2, 4, "#2f5fe0"],
  [8, 7, 2, 4, "#1b3fb8"],
  [1, 6, 1, 1, "#2f5fe0"],
  [8, 6, 1, 1, "#1b3fb8"],
  [3, 10, 4, 1, "#6c7a99"],
];

export default function Rocket() {
  return (
    <div id="rocket" className="rocket" aria-hidden="true">
      <div className="rocket-bob">
        <svg
          className="rocket-body"
          viewBox="0 0 10 11"
          shapeRendering="crispEdges"
        >
          {PIXELS.map(([x, y, w, h, fill], i) => (
            <rect key={i} x={x} y={y} width={w} height={h} fill={fill} />
          ))}
        </svg>
        <div className="rocket-flame">
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}
