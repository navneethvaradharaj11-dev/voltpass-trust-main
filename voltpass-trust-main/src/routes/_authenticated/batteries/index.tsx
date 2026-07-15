import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { categorize } from "@/lib/trust-score";
import { Plus, Search } from "lucide-react";

export const Route = createFileRoute("/_authenticated/batteries/")({ component: List });

function toneColor(tone: string) {
  return (
    {
      success: "oklch(0.72 0.19 150)",
      primary: "oklch(0.72 0.19 235)",
      warning: "oklch(0.80 0.17 75)",
      destructive: "oklch(0.64 0.22 25)",
    }[tone] || ""
  );
}

function List() {
  const [q, setQ] = useState("");
  const { data: batteries = [] } = useQuery({
    queryKey: ["batteries-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("batteries")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const filtered = batteries.filter((b) =>
    [b.battery_code, b.manufacturer, b.model, b.chemistry].some((v) =>
      v?.toLowerCase().includes(q.toLowerCase()),
    ),
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Batteries</h1>
          <p className="text-sm text-muted-foreground">
            {batteries.length} registered · Click to open passport
          </p>
        </div>
        <Button
          asChild
          className="bg-gradient-to-r from-primary to-electric-glow text-primary-foreground"
        >
          <Link to="/batteries/register">
            <Plus className="mr-2 h-4 w-4" />
            Register
          </Link>
        </Button>
      </div>

      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-10"
          placeholder="Search by code, manufacturer, model…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((b) => {
          const cat = categorize(b.trust_score ?? 0);
          const soh = Math.round((b.current_capacity_kwh / b.original_capacity_kwh) * 100);
          return (
            <Link
              key={b.id}
              to="/batteries/$id"
              params={{ id: b.id }}
              className="glass-card group rounded-2xl p-5 transition-all hover:border-primary/60 hover:shadow-[0_0_30px_oklch(0.72_0.19_235/0.2)]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-display text-lg font-semibold">{b.battery_code}</div>
                  <div className="text-sm text-muted-foreground">
                    {b.manufacturer} · {b.model}
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className="font-display text-3xl font-bold tabular-nums"
                    style={{ color: toneColor(cat.tone) }}
                  >
                    {b.trust_score}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {cat.label}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="rounded-md bg-accent px-2 py-1">{b.chemistry}</span>
                <span>SOH {soh}%</span>
                <span>{b.charge_cycles} cycles</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${b.trust_score ?? 0}%`,
                    background: `linear-gradient(90deg, ${toneColor(cat.tone)}, oklch(0.78 0.22 220))`,
                  }}
                />
              </div>
            </Link>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-sm text-muted-foreground">
            No batteries match.
          </div>
        )}
      </div>
    </main>
  );
}
