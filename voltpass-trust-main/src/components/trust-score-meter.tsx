import { categorize } from "@/lib/trust-score";

export function TrustScoreMeter({ score, size = 180 }: { score: number; size?: number }) {
  const cat = categorize(score);
  const radius = (size - 20) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;
  const colorVar = {
    success: "var(--color-success)",
    primary: "var(--color-electric)",
    warning: "var(--color-warning)",
    destructive: "var(--color-destructive)",
  }[cat.tone];

  return (
    <div className="relative flex flex-col items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--color-muted)"
          strokeWidth={12}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colorVar}
          strokeWidth={12}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 1s ease",
            filter: `drop-shadow(0 0 8px ${colorVar})`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-5xl font-bold tabular-nums">{score}</span>
        <span className="text-xs uppercase tracking-wider text-muted-foreground">Trust Score</span>
        <span className="mt-1 text-sm font-medium" style={{ color: colorVar }}>
          {cat.label}
        </span>
      </div>
    </div>
  );
}
