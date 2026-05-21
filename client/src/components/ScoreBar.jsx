export default function ScoreBar({ label, score, icon }) {
  const getColor = (s) => {
    if (s >= 80) return "bg-jade-400";
    if (s >= 60) return "bg-amber-400";
    return "bg-rose-400";
  };

  const getGlow = (s) => {
    if (s >= 80) return "shadow-jade-400/40";
    if (s >= 60) return "shadow-amber-400/40";
    return "shadow-rose-400/40";
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-ink-600 flex items-center gap-2">
          {icon && <span>{icon}</span>}
          {label}
        </span>
        <span className="font-mono font-semibold text-white">{score}%</span>
      </div>
      <div className="h-2 bg-ink-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out shadow-lg ${getColor(score)} ${getGlow(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
