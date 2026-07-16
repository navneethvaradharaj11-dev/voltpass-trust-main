import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { waitForAuthState } from "@/firebase/auth";
import { AppHeader } from "@/components/app-header";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const user = await waitForAuthState().catch(() => null);
    if (!user) throw redirect({ to: "/auth/login" });
    return { user };
  },
  component: () => (
    <>
      <AppHeader />
      <Outlet />
    </>
  ),
});
