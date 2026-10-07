/* =========================================================
   PIXEL SPACE DECOR
   Small inline-SVG props reused across sections.
========================================================= */

const Pixels = ({ grid, palette, size = 6, className, style }) => {
  const rows = grid.trim().split("\n").map((r) => r.trim());
  const w = Math.max(...rows.map((r) => r.length));
  return (
    <svg
      className={className}
      style={style}
      viewBox={`0 0 ${w} ${rows.length}`}
      width={w * size}
      height={rows.length * size}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {rows.flatMap((row, y) =>
        [...row].map((ch, x) =>
          palette[ch] ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={palette[ch]} /> : null
        )
      )}
    </svg>
  );
};

export const Satellite = (props) => (
  <Pixels
    {...props}
    palette={{ b: "#2f5fe0", d: "#1b3fb8", w: "#e8f2ff", g: "#8d97ab", c: "#3ff2ff" }}
    grid={`
      ..........c.........
      .........ccc........
      ..........g.........
      bbbbbb...www...bbbbbb
      bdbdbdgggwcwgggbdbdbd
      bbbbbb...www...bbbbbb
      ..........g.........
      .........g.g........
    `}
  />
);

export const Planet = (props) => (
  <Pixels
    {...props}
    palette={{ p: "#4f8bff", d: "#2f5fe0", s: "#1b3fb8", r: "#9fb8ff", w: "#cfe3ff" }}
    grid={`
      ......pppppp......
      ....ppwwppppdd....
      ...pwwpppppdddd...
      rr.ppppppppddddsrr
      .rrrpppppdddddrrr.
      ...rrrrrrrrrrrr...
      ...pppppddddssss..
      ....ppdddddssss...
      ......ddssss......
    `}
  />
);

export const Asteroid = (props) => (
  <Pixels
    {...props}
    palette={{ a: "#5a6480", d: "#3a4258", l: "#8d97ab" }}
    grid={`
      ..aaaa..
      .alaaad.
      aaaadaad
      adaaaaad
      .aaadad.
      ..dddd..
    `}
  />
);

export const Comet = (props) => (
  <Pixels
    {...props}
    palette={{ c: "#3ff2ff", b: "#4f8bff", d: "#1b3fb8", w: "#ffffff" }}
    grid={`
      .............ww
      ..........bccww
      .......dbbcc...
      ....ddbb.......
      .ddb...........
    `}
  />
);
