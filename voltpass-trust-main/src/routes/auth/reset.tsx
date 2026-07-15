import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell } from "./login";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/reset")({ component: Reset });

function Reset() {
  const nav = useNavigate();
  const [pw, setPw] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase auto-detects recovery from URL hash
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password: pw });
    if (error) toast.error(error.message);
    else {
      toast.success("Password updated");
      nav({ to: "/dashboard" });
    }
  };

  return (
    <AuthShell
      title="Set new password"
      subtitle={ready ? "Enter a new password" : "Validating link…"}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>New password</Label>
          <Input
            type="password"
            required
            minLength={6}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
          />
        </div>
        <Button
          type="submit"
          disabled={!ready}
          className="w-full bg-gradient-to-r from-primary to-electric-glow text-primary-foreground"
        >
          Update password
        </Button>
      </form>
    </AuthShell>
  );
}
