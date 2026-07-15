import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Battery } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/login")({ component: Login });

function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back");
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
    <AuthShell title="Welcome back" subtitle="Sign in to your VoltPass account">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/auth/forgot" className="text-xs text-primary hover:underline">
              Forgot?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-primary to-electric-glow text-primary-foreground"
        >
          {loading ? "Signing in…" : "Sign in"}
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
        No account?{" "}
        <Link to="/auth/register" className="text-primary hover:underline">
          Register
        </Link>
      </p>
    </AuthShell>
  );
}

export function AuthShell({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-electric-glow glow-electric">
            <Battery className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-2xl font-bold">VoltPass</span>
        </Link>
        <div className="glass-card rounded-2xl p-8">
          <h1 className="font-display text-2xl font-bold">{title}</h1>
          <p className="mt-1 mb-6 text-sm text-muted-foreground">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
