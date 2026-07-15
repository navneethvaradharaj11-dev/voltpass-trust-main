import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TrustScoreMeter } from "@/components/trust-score-meter";
import { categorize, sohPercent } from "@/lib/trust-score";
import { generatePdfReport, type BatteryRecord } from "@/lib/pdf-report";
import { QRCodeCanvas } from "qrcode.react";
import { Button } from "@/components/ui/button";
import {
  Battery,
  Download,
  ArrowLeft,
  Factory,
  Cpu,
  Activity,
  Thermometer,
  Zap,
  AlertTriangle,
  Wrench,
  Clipboard,
  Recycle,
  type LucideIcon,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/batteries/$id")({ component: Passport });

function Passport() {
  const { id } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["battery", id],
    queryFn: async () => {
      const [{ data: b, error }, { data: ins }, { data: mnt }] = await Promise.all([
        supabase.from("batteries").select("*").eq("id", id).maybeSingle(),
        supabase
          .from("inspections")
          .select("*")
          .eq("battery_id", id)
          .order("inspected_at", { ascending: false }),
        supabase
          .from("maintenance_records")
          .select("*")
          .eq("battery_id", id)
          .order("performed_at", { ascending: false }),
      ]);
      if (error) throw error;
      return { battery: b as BatteryRecord, inspections: ins ?? [], maintenance: mnt ?? [] };
    },
  });

  if (isLoading) return <main className="p-8 text-center text-muted-foreground">Loading…</main>;
  if (!data?.battery) return <main className="p-8 text-center">Not found</main>;
  const b = data.battery;
  const cat = categorize(b.trust_score ?? 0);
  const passportUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/passport/${b.id}`
      : `/passport/${b.id}`;
  const soh = sohPercent(b);

  const steps = [
    "Manufacturing",
    "Vehicle Usage",
    "Maintenance",
    "Inspection",
    "Second-Life",
    cat.label === "High Risk" ? "Recycling" : "Reuse",
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <Button asChild variant="ghost" size="sm">
          <Link to="/batteries">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </Link>
        </Button>
        <Button onClick={() => generatePdfReport(b)} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="glass-card rounded-2xl p-6 lg:col-span-2">
          <div className="flex items-start gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-xl bg-gradient-to-br from-primary to-electric-glow glow-electric">
              <Battery className="h-7 w-7 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Battery Passport
              </div>
              <h1 className="font-display text-3xl font-bold">{b.battery_code}</h1>
              <div className="text-muted-foreground">
                {b.manufacturer} · {b.model}
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Spec icon={Factory} label="Manufacturer" value={b.manufacturer} />
            <Spec icon={Cpu} label="Chemistry" value={b.chemistry} />
            <Spec icon={Activity} label="State of Health" value={`${soh}%`} />
            <Spec
              icon={Battery}
              label="Capacity"
              value={`${b.current_capacity_kwh}/${b.original_capacity_kwh} kWh`}
            />
            <Spec
              icon={Zap}
              label="Voltage / Current"
              value={`${b.voltage_v} V · ${b.current_a} A`}
            />
            <Spec icon={Thermometer} label="Avg Temp" value={`${b.avg_operating_temp_c} °C`} />
            <Spec icon={Activity} label="Cycles" value={String(b.charge_cycles)} />
            <Spec icon={Zap} label="Fast Charging" value={`${b.fast_charging_freq_pct}%`} />
            <Spec icon={AlertTriangle} label="Faults" value={String(b.fault_count)} />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="flex flex-col items-center">
            <TrustScoreMeter score={b.trust_score ?? 0} />
            <div className="mt-4 rounded-xl bg-accent/50 p-4 text-center">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Recommendation
              </div>
              <div className="mt-1 font-medium">{cat.recommendation}</div>
              <div className="mt-1 text-xs text-muted-foreground">{cat.use}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="glass-card rounded-2xl p-6 lg:col-span-2">
          <h2 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Lifecycle Timeline
          </h2>
          <ol className="relative space-y-4 border-l border-border pl-6">
            {steps.map((s, i) => (
              <li key={s} className="relative">
                <span className="absolute -left-[29px] grid h-5 w-5 place-items-center rounded-full bg-gradient-to-br from-primary to-electric-glow text-[10px] font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <div className="font-medium">{s}</div>
              </li>
            ))}
          </ol>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h2 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            QR Verification
          </h2>
          <div className="flex flex-col items-center">
            <div className="rounded-xl bg-white p-3">
              <QRCodeCanvas value={passportUrl} size={160} bgColor="#ffffff" fgColor="#0a1535" />
            </div>
            <div className="mt-3 break-all text-center text-xs text-muted-foreground">
              {passportUrl}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="glass-card rounded-2xl p-6">
          <h2 className="mb-4 flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            <Clipboard className="h-4 w-4" />
            Inspections
          </h2>
          <div className="space-y-3">
            {data.inspections.length === 0 && (
              <p className="text-sm text-muted-foreground">No inspections yet.</p>
            )}
            {data.inspections.map((i) => (
              <div key={i.id} className="rounded-lg border border-border p-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">{i.inspector_name ?? "Inspector"}</span>
                  <span className="text-muted-foreground">
                    {new Date(i.inspected_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  SOH {i.soh_pct}% · {i.result}
                </div>
                {i.notes && <div className="mt-1">{i.notes}</div>}
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h2 className="mb-4 flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            <Wrench className="h-4 w-4" />
            Maintenance
          </h2>
          <div className="space-y-3">
            {data.maintenance.length === 0 && (
              <p className="text-sm text-muted-foreground">No records.</p>
            )}
            {data.maintenance.map((m) => (
              <div key={m.id} className="rounded-lg border border-border p-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">{m.technician ?? "—"}</span>
                  <span className="text-muted-foreground">
                    {new Date(m.performed_at).toLocaleDateString()}
                  </span>
                </div>
                <div>{m.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {(b.fault_records || b.maintenance_notes || b.inspection_notes) && (
        <div className="mt-6 glass-card rounded-2xl p-6">
          <h2 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Notes
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {b.fault_records && (
              <NoteCard icon={AlertTriangle} title="Fault Records" body={b.fault_records} />
            )}
            {b.maintenance_notes && (
              <NoteCard icon={Wrench} title="Maintenance" body={b.maintenance_notes} />
            )}
            {b.inspection_notes && (
              <NoteCard icon={Clipboard} title="Inspection" body={b.inspection_notes} />
            )}
          </div>
        </div>
      )}

      <div className="mt-6 glass-card rounded-2xl p-6 text-center">
        <Recycle className="mx-auto h-6 w-6 text-primary" />
        <div className="mt-2 text-sm uppercase tracking-wider text-muted-foreground">
          Lifecycle Status
        </div>
        <div className="font-display text-xl font-semibold capitalize">
          {b.lifecycle_status.replace(/_/g, " ")}
        </div>
      </div>
    </main>
  );
}

function Spec({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card/60 p-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <div className="mt-1 font-display text-lg font-semibold">{value}</div>
    </div>
  );
}

function NoteCard({ icon: Icon, title, body }: { icon: LucideIcon; title: string; body: string }) {
  return (
    <div className="rounded-xl border border-border bg-card/60 p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3 w-3" />
        {title}
      </div>
      <p className="mt-2 text-sm">{body}</p>
    </div>
  );
}
