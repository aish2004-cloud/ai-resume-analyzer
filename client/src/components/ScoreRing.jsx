export default function ScoreRing({ score, size = 140, strokeWidth = 10, label, sublabel }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s) => {
    if (s >= 80) return "#3DDC84";
    if (s >= 60) return "#F59E0B";
    return "#F87171";
  };

  const getGrade = (s) => {
    if (s >= 90) return "A+";
    if (s >= 80) return "A";
    if (s >= 70) return "B";
    if (s >= 60) return "C";
    return "D";
  };

  const color = getColor(score);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          style={{ transform: "rotate(-90deg)" }}
        >
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#21262D"
            strokeWidth={strokeWidth}
          />
          {/* Progress */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
              filter: `drop-shadow(0 0 8px ${color})`,
            }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-4xl leading-none" style={{ color }}>
            {score}
          </span>
          <span className="text-xs font-mono text-ink-600 mt-0.5">/ 100</span>
        </div>
      </div>

      {label && (
        <div className="text-center">
          <p className="text-white font-semibold text-sm">{label}</p>
          {sublabel && <p className="text-ink-600 text-xs mt-0.5">{sublabel}</p>}
        </div>
      )}
    </div>
  );
}
