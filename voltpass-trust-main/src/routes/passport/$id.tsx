import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TrustScoreMeter } from "@/components/trust-score-meter";
import { categorize, sohPercent } from "@/lib/trust-score";
import { generatePdfReport, type BatteryRecord } from "@/lib/pdf-report";
import { Button } from "@/components/ui/button";
import { Battery, Download, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/passport/$id")({
  head: () => ({
    meta: [
      { title: "Battery Passport — VoltPass" },
      { name: "description", content: "Verified VoltPass battery passport." },
    ],
  }),
  component: PublicPassport,
});

function PublicPassport() {
  const { id } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["public-battery", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("batteries")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data as BatteryRecord | null;
    },
  });

  if (isLoading) return <main className="p-8 text-center text-muted-foreground">Loading…</main>;
  if (!data) return <main className="p-8 text-center">Passport not found</main>;
  const cat = categorize(data.trust_score ?? 0);
  const soh = sohPercent(data);

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link to="/" className="mb-6 inline-flex items-center gap-2">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-electric-glow glow-electric">
          <Battery className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="font-display text-lg font-bold">VoltPass</span>
      </Link>

      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-2 text-xs text-success">
          <ShieldCheck className="h-4 w-4" />
          Verified Battery Passport
        </div>
        <h1 className="mt-2 font-display text-3xl font-bold">{data.battery_code}</h1>
        <p className="text-muted-foreground">
          {data.manufacturer} · {data.model}
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-[1fr_auto]">
          <div className="space-y-2 text-sm">
            <Row k="Chemistry" v={data.chemistry} />
            <Row k="Manufacturing Date" v={data.manufacturing_date} />
            <Row k="Original Capacity" v={`${data.original_capacity_kwh} kWh`} />
            <Row k="Current Capacity" v={`${data.current_capacity_kwh} kWh`} />
            <Row k="State of Health" v={`${soh}%`} />
            <Row k="Charge Cycles" v={String(data.charge_cycles)} />
            <Row k="Avg Operating Temp" v={`${data.avg_operating_temp_c} °C`} />
            <Row k="Fault Count" v={String(data.fault_count)} />
            <Row k="Lifecycle" v={data.lifecycle_status.replace(/_/g, " ")} />
          </div>
          <TrustScoreMeter score={data.trust_score ?? 0} size={160} />
        </div>

        <div className="mt-6 rounded-xl bg-accent/40 p-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            Recommendation
          </div>
          <div className="mt-1 font-medium">{cat.recommendation}</div>
          <div className="mt-1 text-sm text-muted-foreground">{cat.use}</div>
        </div>

        <Button
          onClick={() => generatePdfReport(data)}
          className="mt-6 w-full bg-gradient-to-r from-primary to-electric-glow text-primary-foreground"
        >
          <Download className="mr-2 h-4 w-4" />
          Download PDF Report
        </Button>
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Public verification view · Powered by VoltPass
      </p>
    </main>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between border-b border-border/40 py-1.5">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium">{v}</span>
    </div>
  );
}
