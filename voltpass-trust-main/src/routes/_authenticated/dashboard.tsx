import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Battery, ShieldCheck, AlertTriangle, Activity, type LucideIcon } from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  LabelList,
} from "recharts";
import { categorize } from "@/lib/trust-score";
import { NumberTicker } from "@/components/ui/number-ticker";

export const Route = createFileRoute("/_authenticated/dashboard")({ component: Dashboard });

const COLORS = [
  "oklch(0.72 0.19 235)",
  "oklch(0.72 0.19 150)",
  "oklch(0.80 0.17 75)",
  "oklch(0.64 0.22 25)",
  "oklch(0.65 0.20 290)",
];

function Dashboard() {
  const { data: batteries = [], isLoading } = useQuery({
    queryKey: ["batteries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("batteries")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  if (isLoading) {
    return (
      <main className="mx-auto flex min-h-[50vh] max-w-7xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
          <p className="text-sm text-muted-foreground">Loading dashboard data...</p>
        </div>
      </main>
    );
  }

  const total = batteries.length;
  const avg = total
    ? Math.round(batteries.reduce((a, b) => a + (b.trust_score ?? 0), 0) / total)
    : 0;
  const healthy = batteries.filter((b) => (b.trust_score ?? 0) >= 75).length;
  const atRisk = batteries.filter((b) => (b.trust_score ?? 0) < 60).length;

  const trustBuckets = [
    { name: "Excellent (90+)", value: batteries.filter((b) => (b.trust_score ?? 0) >= 90).length },
    {
      name: "Good (75–89)",
      value: batteries.filter((b) => (b.trust_score ?? 0) >= 75 && (b.trust_score ?? 0) < 90)
        .length,
    },
    {
      name: "Moderate (60–74)",
      value: batteries.filter((b) => (b.trust_score ?? 0) >= 60 && (b.trust_score ?? 0) < 75)
        .length,
    },
    { name: "High Risk (<60)", value: batteries.filter((b) => (b.trust_score ?? 0) < 60).length },
  ];

  const chemMap = new Map<string, number>();
  batteries.forEach((b) => chemMap.set(b.chemistry, (chemMap.get(b.chemistry) ?? 0) + 1));
  const chemData = Array.from(chemMap.entries()).map(([name, value]) => ({ name, value }));

  const sohData = batteries
    .map((b) => ({
      name: b.battery_code,
      soh: Math.round((b.current_capacity_kwh / b.original_capacity_kwh) * 100),
      score: b.trust_score ?? 0,
    }))
    .slice(0, 12);

  const recent = batteries.slice(0, 6);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Real-time overview of your battery fleet</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Batteries" value={total} icon={Battery} tone="primary" />
        <StatCard
          label="Average Trust Score"
          value={avg}
          icon={Activity}
          tone="primary"
          suffix="/100"
        />
        <StatCard label="Healthy" value={healthy} icon={ShieldCheck} tone="success" />
        <StatCard label="At Risk" value={atRisk} icon={AlertTriangle} tone="destructive" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Panel title="Trust Score Distribution">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={trustBuckets} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.30 0.03 250 / 0.2)" />
              <XAxis dataKey="name" tick={{ fill: "oklch(0.68 0.03 250)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "oklch(0.68 0.03 250)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                cursor={{ fill: "oklch(0.30 0.03 250 / 0.1)" }}
                contentStyle={{
                  background: "rgba(10, 10, 15, 0.8)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid oklch(0.30 0.03 250 / 0.4)",
                  borderRadius: 12,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                  color: "#fff",
                }}
                itemStyle={{ color: "#fff" }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} animationDuration={1500} animationEasing="ease-out">
                {trustBuckets.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
                <LabelList dataKey="value" position="top" fill="oklch(0.68 0.03 250)" fontSize={12} fontWeight="bold" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Chemistry Mix">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={chemData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={90}
                paddingAngle={5}
                animationDuration={1500}
                animationEasing="ease-out"
                stroke="none"
                label={{ fill: "oklch(0.97 0.01 240)", fontSize: 12, fontWeight: "bold" }}
              >
                {chemData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "rgba(10, 10, 15, 0.8)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid oklch(0.30 0.03 250 / 0.4)",
                  borderRadius: 12,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                  color: "#fff",
                }}
                itemStyle={{ color: "#fff" }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="State of Health vs Trust Score" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sohData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.30 0.03 250 / 0.2)" />
              <XAxis dataKey="name" tick={{ fill: "oklch(0.68 0.03 250)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "oklch(0.68 0.03 250)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "rgba(10, 10, 15, 0.8)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid oklch(0.30 0.03 250 / 0.4)",
                  borderRadius: 12,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                  color: "#fff",
                }}
                itemStyle={{ color: "#fff" }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Line
                type="monotone"
                dataKey="soh"
                stroke="oklch(0.72 0.19 150)"
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                name="SOH %"
                animationDuration={1500}
              >
                <LabelList dataKey="soh" position="top" fill="oklch(0.72 0.19 150)" fontSize={11} fontWeight="bold" />
              </Line>
              <Line
                type="monotone"
                dataKey="score"
                stroke="oklch(0.72 0.19 235)"
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                name="Trust Score"
                animationDuration={1500}
              >
                <LabelList dataKey="score" position="bottom" fill="oklch(0.72 0.19 235)" fontSize={11} fontWeight="bold" />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      <Panel title="Recent Activity" className="mt-6">
        <div className="divide-y divide-border/60">
          {recent.map((b) => {
            const cat = categorize(b.trust_score ?? 0);
            return (
              <Link
                key={b.id}
                to="/batteries/$id"
                params={{ id: b.id }}
                className="flex items-center justify-between py-3 transition-colors hover:bg-accent/40 -mx-2 px-2 rounded-md"
              >
                <div>
                  <div className="font-medium">
                    {b.battery_code} ·{" "}
                    <span className="text-muted-foreground">
                      {b.manufacturer} {b.model}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {b.chemistry} · {b.charge_cycles} cycles · {b.current_capacity_kwh}/
                    {b.original_capacity_kwh} kWh
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="text-xs uppercase tracking-wide"
                    style={{ color: toneColor(cat.tone) }}
                  >
                    {cat.label}
                  </span>
                  <span className="font-display text-xl font-bold tabular-nums">
                    <NumberTicker value={b.trust_score ?? 0} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </Panel>
    </main>
  );
}

function toneColor(tone: string) {
  return (
    {
      success: "oklch(0.72 0.19 150)",
      primary: "oklch(0.72 0.19 235)",
      warning: "oklch(0.80 0.17 75)",
      destructive: "oklch(0.64 0.22 25)",
    }[tone] || "oklch(0.68 0.03 250)"
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  tone,
  suffix,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  tone: string;
  suffix?: string;
}) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4" style={{ color: toneColor(tone) }} />
      </div>
      <div className="mt-2 font-display text-3xl font-bold tabular-nums">
        <NumberTicker value={value} />
        <span className="text-base font-normal text-muted-foreground">{suffix}</span>
      </div>
    </div>
  );
}

function Panel({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`glass-card rounded-2xl p-5 ${className}`}>
      <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      {children}
    </div>
  );
}
