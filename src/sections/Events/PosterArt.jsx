/* Generated placeholder poster, used until a real image is set */
export default function PosterArt({ event }) {
  const id = `poster-${event.id}`;
  const words = event.title.split(" ");
  const h = event.hue;

  return (
    <svg className="poster-art" viewBox="0 0 260 330" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={`hsl(${h} 70% 22%)`} />
          <stop offset="1" stopColor={`hsl(${h + 50} 80% 7%)`} />
        </linearGradient>
        <pattern id={`${id}-grid`} width="10" height="10" patternUnits="userSpaceOnUse">
          <rect width="10" height="10" fill="none" stroke="#fff" strokeOpacity=".05" />
        </pattern>
      </defs>

      <rect width="260" height="330" fill={`url(#${id}-bg)`} />
      <rect width="260" height="330" fill={`url(#${id}-grid)`} />

      <g shapeRendering="crispEdges">
        <circle cx="190" cy="92" r="52" fill={`hsl(${h + 20} 85% 60%)`} opacity=".85" />
        <rect x="130" y="88" width="120" height="8" fill={`hsl(${h - 20} 90% 75%)`} opacity=".7" />
        <rect x="24" y="60" width="10" height="10" fill="#fff" opacity=".8" />
        <rect x="44" y="120" width="6" height="6" fill={`hsl(${h} 90% 70%)`} />
        <rect x="214" y="250" width="8" height="8" fill="#fff" opacity=".6" />
      </g>

      <text x="20" y="34" fontFamily="Tiny5, monospace" fontSize="11" letterSpacing="2" fill="#ffffffaa">
        IEEE COMSOC · VIT
      </text>

      {words.map((word, i) => (
        <text
          key={i}
          x="20"
          y={196 + i * 40}
          fontFamily="Pixelify Sans, monospace"
          fontWeight="700"
          fontSize="38"
          fill="#ffffff"
        >
          {word}
        </text>
      ))}

      <rect x="20" y="292" width="110" height="18" fill={`hsl(${h} 90% 60%)`} />
      <text x="26" y="305" fontFamily="Tiny5, monospace" fontSize="10" letterSpacing="1" fill="#020306">
        {event.date}
      </text>
      <text x="240" y="305" textAnchor="end" fontFamily="Tiny5, monospace" fontSize="8" fill="#ffffff66">
        POSTER TBA
      </text>
    </svg>
  );
}
