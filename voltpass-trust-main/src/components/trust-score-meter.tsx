import { useState, useEffect } from "react";
import { categorize } from "@/lib/trust-score";
import { NumberTicker } from "@/components/ui/number-ticker";

export function TrustScoreMeter({ score, size = 180 }: { score: number; size?: number }) {
  const cat = categorize(score);
  const radius = (size - 20) / 2;
  const circ = 2 * Math.PI * radius;
  
  const [offset, setOffset] = useState(circ);
  const targetOffset = circ - (score / 100) * circ;

  useEffect(() => {
    const t = setTimeout(() => setOffset(targetOffset), 100);
    return () => clearTimeout(t);
  }, [targetOffset]);

  const colorVar = {
    success: "var(--color-success)",
    primary: "var(--color-electric)",
    warning: "var(--color-warning)",
    destructive: "var(--color-destructive)",
  }[cat.tone];

  const svgPadding = 40;
  const svgSize = size + svgPadding;
  const center = svgSize / 2;

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg 
        width={svgSize} 
        height={svgSize} 
        className="absolute -rotate-90 pointer-events-none"
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="var(--color-muted)"
          strokeWidth={12}
          fill="none"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={colorVar}
          strokeWidth={12}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 1s ease-out",
            filter: `drop-shadow(0 0 8px ${colorVar})`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-5xl font-bold tabular-nums">
          <NumberTicker value={score} />
        </span>
        <span className="text-xs uppercase tracking-wider text-muted-foreground">Trust Score</span>
        <span className="mt-1 text-sm font-medium" style={{ color: colorVar }}>
          {cat.label}
        </span>
      </div>
    </div>
  );
}
