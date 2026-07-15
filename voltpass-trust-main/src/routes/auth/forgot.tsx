import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell } from "./login";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/forgot")({ component: Forgot });

function Forgot() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/auth/reset",
    });
    if (error) toast.error(error.message);
    else {
      setSent(true);
      toast.success("Reset email sent");
    }
  };

  return (
    <AuthShell title="Reset password" subtitle="We'll send you a reset link">
      {sent ? (
        <p className="text-sm text-muted-foreground">Check your inbox for a reset link.</p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-electric-glow text-primary-foreground"
          >
            Send reset link
          </Button>
        </form>
      )}
      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link to="/auth/login" className="text-primary hover:underline">
          Back to sign in
        </Link>
      </p>
    </AuthShell>
  );
}
