import { useEffect, useState } from "react";
import { onFirebaseAuthChange, type FirebaseUserProfile } from "@/firebase/auth";

export type AppRole = "admin" | "inspector" | "owner" | "buyer";

export interface AuthState {
  user: FirebaseUserProfile | null;
  session: FirebaseUserProfile | null;
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
    let unsubscribe: (() => void) | undefined;

    const loadExtras = async (user: FirebaseUserProfile | null) => {
      if (!user) {
        if (alive) setState((s) => ({ ...s, roles: [], profile: null, loading: false }));
        return;
      }

      if (!alive) return;
      setState((s) => ({
        ...s,
        roles: [],
        profile: { display_name: user.name, email: user.email, organization: null },
        loading: false,
      }));
    };

    onFirebaseAuthChange((user) => {
      setState((s) => ({ ...s, session: user, user }));
      loadExtras(user);
    })
      .then((firebaseUnsubscribe) => {
        unsubscribe = firebaseUnsubscribe;
      })
      .catch(() => {
        if (alive) setState((s) => ({ ...s, loading: false }));
      });

    return () => {
      alive = false;
      unsubscribe?.();
    };
  }, []);

  return state;
}

export function hasRole(roles: AppRole[], role: AppRole): boolean {
  return roles.includes(role);
}
