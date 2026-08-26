import "./CircularText.css";

export default function CircularText({
  text,
  radius,
  reverse = false,
  className = "",
}) {

  const chars = [...text];

  // Give different angular 
  // ights to different characters
  const weights = chars.map((char) => {
    if (char === " ") return 0.15;   // smaller gap
    if (char === "•") return 0.9;    // bigger separator
    return 0.72;                        // normal letters
  });

  const totalWeight = weights.reduce((a, b) => a + b, 0);

  let current = 0;

  return (
    <div
      className={`circularText ${reverse ? "reverse" : ""} ${className}`}
    >
      {chars.map((char, index) => {

        const weight = weights[index];

        const angle =
          (current / totalWeight) * 360 - 90;

        current += weight;

        const radians = angle * Math.PI / 180;

        const x = Math.cos(radians) * radius;

        const y = Math.sin(radians) * radius;

        return (

          <span
  key={index}
  className={char === "•" ? "bullet" : ""}
  style={{
    left: `calc(50% + ${x}px)`,
    top: `calc(50% + ${y}px)`,
    transform: `
      translate(-50%, -50%)
      rotate(${angle + 90}deg)
    `
  }}
>
  {char === " " ? "\u00A0" : char}
</span>

        );

      })}
    </div>
  );
}