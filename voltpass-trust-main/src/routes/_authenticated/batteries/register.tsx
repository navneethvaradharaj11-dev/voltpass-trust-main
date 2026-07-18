import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { calculateTrustScore } from "@/lib/trust-score";
import { TrustScoreMeter } from "@/components/trust-score-meter";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/batteries/register")({ component: Register });

const initial = {
  battery_code: "",
  manufacturer: "",
  model: "",
  manufacturing_date: "",
  chemistry: "NMC",
  original_capacity_kwh: 75,
  current_capacity_kwh: 60,
  charge_cycles: 500,
  avg_operating_temp_c: 28,
  fast_charging_freq_pct: 15,
  voltage_v: 400,
  current_a: 150,
  fault_count: 0,
  fault_records: "",
  maintenance_notes: "",
  inspection_notes: "",
};

type BatteryForm = typeof initial;

function Register() {
  const nav = useNavigate();
  const [f, setF] = useState(initial);
  const [loading, setLoading] = useState(false);
  const score = calculateTrustScore(f);

  const upd = <K extends keyof BatteryForm>(k: K, v: BatteryForm[K]) => setF({ ...f, [k]: v });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("batteries")
      .insert({
        ...f,
        chemistry: f.chemistry as "NMC" | "LFP" | "NCA" | "LTO" | "LMO",
        trust_score: score,
        owner_id: user?.id ?? null,
      })
      .select("id")
      .single();
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Battery registered");
    nav({ to: "/batteries/$id", params: { id: data.id } });
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold">Register Battery</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Enter specs and operational history. Trust Score updates live.
      </p>

      <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Section title="Identity">
            <Field label="Battery Code">
              <Input
                required
                value={f.battery_code}
                onChange={(e) => upd("battery_code", e.target.value)}
                placeholder="VP-XXX-000"
              />
            </Field>
            <Field label="Manufacturer">
              <Input
                required
                value={f.manufacturer}
                onChange={(e) => upd("manufacturer", e.target.value)}
              />
            </Field>
            <Field label="Model">
              <Input value={f.model} onChange={(e) => upd("model", e.target.value)} />
            </Field>
            <Field label="Manufacturing Date">
              <Input
                type="date"
                required
                value={f.manufacturing_date}
                onChange={(e) => upd("manufacturing_date", e.target.value)}
              />
            </Field>
            <Field label="Chemistry">
              <Select value={f.chemistry} onValueChange={(v) => upd("chemistry", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["NMC", "LFP", "NCA", "LTO", "LMO"].map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </Section>

          <Section title="Capacity & Cycles">
            <Field label="Original Capacity (kWh)">
              <Input
                type="number"
                step="0.1"
                required
                value={f.original_capacity_kwh}
                onChange={(e) => upd("original_capacity_kwh", +e.target.value)}
              />
            </Field>
            <Field label="Current Capacity (kWh)">
              <Input
                type="number"
                step="0.1"
                required
                value={f.current_capacity_kwh}
                onChange={(e) => upd("current_capacity_kwh", +e.target.value)}
              />
            </Field>
            <Field label="Charge Cycles">
              <Input
                type="number"
                required
                value={f.charge_cycles}
                onChange={(e) => upd("charge_cycles", +e.target.value)}
              />
            </Field>
            <Field label="Fast Charging Frequency (%)">
              <Input
                type="number"
                step="0.1"
                value={f.fast_charging_freq_pct}
                onChange={(e) => upd("fast_charging_freq_pct", +e.target.value)}
              />
            </Field>
          </Section>

          <Section title="Electrical & Thermal">
            <Field label="Voltage (V)">
              <Input
                type="number"
                step="0.1"
                required
                value={f.voltage_v}
                onChange={(e) => upd("voltage_v", +e.target.value)}
              />
            </Field>
            <Field label="Current (A)">
              <Input
                type="number"
                step="0.1"
                required
                value={f.current_a}
                onChange={(e) => upd("current_a", +e.target.value)}
              />
            </Field>
            <Field label="Avg Operating Temp (°C)">
              <Input
                type="number"
                step="0.1"
                required
                value={f.avg_operating_temp_c}
                onChange={(e) => upd("avg_operating_temp_c", +e.target.value)}
              />
            </Field>
            <Field label="Fault Count">
              <Input
                type="number"
                value={f.fault_count}
                onChange={(e) => upd("fault_count", +e.target.value)}
              />
            </Field>
          </Section>

          <Section title="History Notes" cols={1}>
            <Field label="Previous Fault Records">
              <Textarea
                rows={2}
                value={f.fault_records}
                onChange={(e) => upd("fault_records", e.target.value)}
              />
            </Field>
            <Field label="Maintenance Records">
              <Textarea
                rows={2}
                value={f.maintenance_notes}
                onChange={(e) => upd("maintenance_notes", e.target.value)}
              />
            </Field>
            <Field label="Inspection Notes">
              <Textarea
                rows={2}
                value={f.inspection_notes}
                onChange={(e) => upd("inspection_notes", e.target.value)}
              />
            </Field>
          </Section>
        </div>

        <aside className="space-y-4">
          <div className="glass-card sticky top-20 rounded-2xl p-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Live Trust Score
            </h3>
            <div className="flex justify-center">
              <TrustScoreMeter score={score} />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-[image:var(--gradient-primary)] font-bold text-primary-foreground shadow-[0_0_20px_oklch(0.72_0.19_235/0.4)] transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_oklch(0.72_0.19_235/0.6)]"
            >
              {loading ? "Registering…" : "Register Battery"}
            </Button>
          </div>
        </aside>
      </form>
    </main>
  );
}

function Section({
  title,
  children,
  cols = 2,
}: {
  title: string;
  children: React.ReactNode;
  cols?: number;
}) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      <div className={`grid gap-4 ${cols === 2 ? "sm:grid-cols-2" : ""}`}>{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
