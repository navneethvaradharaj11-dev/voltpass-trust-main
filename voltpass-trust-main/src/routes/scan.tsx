import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScanLine } from "lucide-react";
import { toast } from "sonner";
import { AppHeader } from "@/components/app-header";

export const Route = createFileRoute("/scan")({ component: Scan });

function Scan() {
  const nav = useNavigate();
  const [code, setCode] = useState("");

  const onLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data } = await supabase
      .from("batteries")
      .select("id")
      .eq("battery_code", code.trim())
      .maybeSingle();
    if (!data) return toast.error("Battery not found");
    nav({ to: "/passport/$id", params: { id: data.id } });
  };

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-md px-4 py-16">
        <div className="glass-card rounded-2xl p-6 text-center">
          <ScanLine className="mx-auto h-10 w-10 text-primary" />
          <h1 className="mt-3 font-display text-2xl font-bold">Verify a Battery</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter battery code or scan its QR code
          </p>
          <form onSubmit={onLookup} className="mt-6 space-y-3">
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="VP-XXX-000"
            />
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-electric-glow text-primary-foreground"
            >
              Look up
            </Button>
          </form>
        </div>
      </main>
    </>
  );
}
