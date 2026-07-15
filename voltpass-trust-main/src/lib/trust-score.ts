export interface BatteryMetrics {
  original_capacity_kwh: number;
  current_capacity_kwh: number;
  charge_cycles: number;
  avg_operating_temp_c: number;
  fast_charging_freq_pct: number;
  fault_count: number;
}

export function calculateTrustScore(b: BatteryMetrics): number {
  const soh = (b.current_capacity_kwh / b.original_capacity_kwh) * 100;
  const cycles = Math.max(0, 100 - b.charge_cycles / 15);
  const temp = Math.max(0, 100 - Math.max(0, b.avg_operating_temp_c - 25) * 8);
  const fast = Math.max(0, 100 - b.fast_charging_freq_pct * 2);
  const fault = Math.max(0, 100 - b.fault_count * 15);
  const remaining = soh;
  const score =
    soh * 0.35 + cycles * 0.2 + temp * 0.15 + fast * 0.1 + fault * 0.1 + remaining * 0.1;
  return Math.max(0, Math.min(100, Math.round(score)));
}

export interface ScoreCategory {
  label: string;
  tone: "success" | "primary" | "warning" | "destructive";
  recommendation: string;
  use: string;
}

export function categorize(score: number): ScoreCategory {
  if (score >= 90)
    return {
      label: "Excellent",
      tone: "success",
      recommendation: "Suitable for EV reuse",
      use: "Primary EV applications — direct second-life vehicle deployment.",
    };
  if (score >= 75)
    return {
      label: "Good",
      tone: "primary",
      recommendation: "Suitable for commercial applications",
      use: "Fleet vehicles, commercial EVs, light industrial mobility.",
    };
  if (score >= 60)
    return {
      label: "Moderate",
      tone: "warning",
      recommendation: "Suitable for stationary energy storage",
      use: "Grid storage, solar backup, building load-shifting.",
    };
  return {
    label: "High Risk",
    tone: "destructive",
    recommendation: "Recommended for recycling",
    use: "Material recovery via certified recyclers (Li, Co, Ni).",
  };
}

export function sohPercent(b: BatteryMetrics): number {
  return Math.round((b.current_capacity_kwh / b.original_capacity_kwh) * 1000) / 10;
}
