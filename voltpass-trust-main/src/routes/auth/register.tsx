import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AuthShell } from "./login";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/register")({ component: Register });

function Register() {
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", org: "", role: "owner" });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: window.location.origin + "/dashboard",
        data: { display_name: form.name, organization: form.org, role: form.role },
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Account created");
    nav({ to: "/dashboard" });
  };

  const onGoogle = async () => {
    const res = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/dashboard",
    });
    if (res.error) toast.error(res.error.message ?? "Google sign-in failed");
    else if (!res.redirected) nav({ to: "/dashboard" });
  };

  return (
    <AuthShell title="Create your account" subtitle="Get a free VoltPass account in seconds">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>Full name</Label>
          <Input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Password</Label>
          <Input
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Organization (optional)</Label>
          <Input value={form.org} onChange={(e) => setForm({ ...form, org: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>I am a</Label>
          <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="owner">Battery Owner</SelectItem>
              <SelectItem value="inspector">Battery Inspector</SelectItem>
              <SelectItem value="buyer">Buyer</SelectItem>
              <SelectItem value="admin">Admin (demo)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-primary to-electric-glow text-primary-foreground"
        >
          {loading ? "Creating…" : "Create account"}
        </Button>
      </form>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-card px-2 text-muted-foreground">or</span>
        </div>
      </div>
      <Button variant="outline" onClick={onGoogle} className="w-full">
        Continue with Google
      </Button>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Have an account?{" "}
        <Link to="/auth/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
