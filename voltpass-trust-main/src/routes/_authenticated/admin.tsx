import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/use-auth";
import { Shield, Users, Battery, BarChart3, Trash2, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin")({ component: Admin });

function Admin() {
  const { roles } = useAuth();
  const isAdmin = roles.includes("admin");

  const { data: batteries = [], refetch } = useQuery({
    queryKey: ["admin-batteries"],
    queryFn: async () => {
      const { data } = await supabase
        .from("batteries")
        .select("*")
        .order("created_at", { ascending: false });
      return data ?? [];
    },
    enabled: isAdmin,
  });

  const { data: profiles = [] } = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      return data ?? [];
    },
    enabled: isAdmin,
  });

  if (!isAdmin) {
    return (
      <main className="mx-auto max-w-md p-12 text-center">
        <Shield className="mx-auto h-10 w-10 text-muted-foreground" />
        <h1 className="mt-3 font-display text-2xl font-bold">Admin only</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          You don't have permission to view this page.
        </p>
      </main>
    );
  }

  const remove = async (id: string) => {
    if (!confirm("Delete this battery?")) return;
    const { error } = await supabase.from("batteries").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Deleted");
      refetch();
    }
  };

  const exportCsv = () => {
    const headers = [
      "battery_code",
      "manufacturer",
      "model",
      "chemistry",
      "trust_score",
      "lifecycle_status",
    ] as const;
    type CsvBatteryField = (typeof headers)[number];
    const rows = batteries.map((b) =>
      headers
        .map((h) => JSON.stringify((b as Record<CsvBatteryField, unknown>)[h] ?? ""))
        .join(","),
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "voltpass-batteries.csv";
    a.click();
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold">Admin Panel</h1>
      <p className="mb-6 text-sm text-muted-foreground">Manage users, batteries, and exports</p>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat icon={Battery} label="Batteries" value={batteries.length} />
        <Stat icon={Users} label="Users" value={profiles.length} />
        <Stat
          icon={BarChart3}
          label="Avg Trust"
          value={
            batteries.length
              ? Math.round(
                  batteries.reduce((a, b) => a + (b.trust_score ?? 0), 0) / batteries.length,
                )
              : 0
          }
        />
      </div>

      <div className="mt-6 glass-card rounded-2xl p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">All Batteries</h2>
          <Button variant="outline" onClick={exportCsv}>
            Export CSV
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                <th className="py-2">Code</th>
                <th>Manufacturer</th>
                <th>Chemistry</th>
                <th>Score</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {batteries.map((b) => (
                <tr key={b.id} className="border-b border-border/40">
                  <td className="py-2">
                    <Link
                      to="/batteries/$id"
                      params={{ id: b.id }}
                      className="text-primary hover:underline"
                    >
                      {b.battery_code}
                    </Link>
                  </td>
                  <td>{b.manufacturer}</td>
                  <td>{b.chemistry}</td>
                  <td className="font-bold tabular-nums">{b.trust_score}</td>
                  <td className="capitalize">{b.lifecycle_status.replace(/_/g, " ")}</td>
                  <td>
                    <Button size="sm" variant="ghost" onClick={() => remove(b.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 glass-card rounded-2xl p-5">
        <h2 className="mb-4 font-display text-lg font-semibold">Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                <th className="py-2">Name</th>
                <th>Email</th>
                <th>Organization</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((p) => (
                <tr key={p.id} className="border-b border-border/40">
                  <td className="py-2">{p.display_name}</td>
                  <td>{p.email}</td>
                  <td>{p.organization ?? "—"}</td>
                  <td>{new Date(p.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

function Stat({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: number }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="mt-2 font-display text-3xl font-bold tabular-nums">{value}</div>
    </div>
  );
}
