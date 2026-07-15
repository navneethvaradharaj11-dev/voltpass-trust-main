import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

export type AppRole = "admin" | "inspector" | "owner" | "buyer";

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  roles: AppRole[];
  profile: { display_name: string; email: string | null; organization: string | null } | null;
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    roles: [],
    profile: null,
  });

  useEffect(() => {
    let alive = true;

    const loadExtras = async (user: User | null) => {
      if (!user) {
        if (alive) setState((s) => ({ ...s, roles: [], profile: null, loading: false }));
        return;
      }
      const [{ data: roleRows }, { data: prof }] = await Promise.all([
        supabase.from("user_roles").select("role").eq("user_id", user.id),
        supabase
          .from("profiles")
          .select("display_name,email,organization")
          .eq("id", user.id)
          .maybeSingle(),
      ]);
      if (!alive) return;
      setState((s) => ({
        ...s,
        roles: (roleRows ?? []).map((r) => r.role as AppRole),
        profile: prof ?? null,
        loading: false,
      }));
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setState((s) => ({ ...s, session, user: session?.user ?? null }));
      // Defer DB call to avoid deadlocks
      setTimeout(() => loadExtras(session?.user ?? null), 0);
    });

    supabase.auth.getSession().then(({ data }) => {
      setState((s) => ({ ...s, session: data.session, user: data.session?.user ?? null }));
      loadExtras(data.session?.user ?? null);
    });

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}

export function hasRole(roles: AppRole[], role: AppRole): boolean {
  return roles.includes(role);
}
