import { Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/use-auth";
import { signOutOfGoogle } from "@/firebase/auth";
import { Battery, LayoutDashboard, Plus, Shield, LogOut, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppHeader() {
  const { user, roles, profile } = useAuth();
  const isAdmin = roles.includes("admin");

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-electric-glow glow-electric">
            <Battery className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight">VoltPass</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {user && (
            <>
              <NavLink to="/dashboard" icon={<LayoutDashboard className="h-4 w-4" />}>
                Dashboard
              </NavLink>
              <NavLink to="/batteries" icon={<Battery className="h-4 w-4" />}>
                Batteries
              </NavLink>
              <NavLink to="/batteries/register" icon={<Plus className="h-4 w-4" />}>
                Register
              </NavLink>
              {isAdmin && (
                <NavLink to="/admin" icon={<Shield className="h-4 w-4" />}>
                  Admin
                </NavLink>
              )}
            </>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <div className="hidden text-right text-xs sm:block">
                <div className="font-medium">{profile?.display_name}</div>
                <div className="text-muted-foreground capitalize">{roles[0] ?? "user"}</div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={async () => {
                  await signOutOfGoogle();
                  window.location.href = "/auth/login";
                }}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button asChild size="sm" variant="ghost">
                <Link to="/auth/login">Sign in</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="bg-gradient-to-r from-primary to-electric-glow text-primary-foreground"
              >
                <Link to="/auth/register">Get started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function NavLink({
  to,
  icon,
  children,
}: {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      activeProps={{
        className: "flex items-center gap-2 rounded-md px-3 py-2 text-sm bg-accent text-foreground",
      }}
    >
      {icon}
      {children}
    </Link>
  );
}

export function ScanQrButton() {
  return (
    <Button variant="outline" size="sm" asChild>
      <Link to="/scan">
        <ScanLine className="mr-2 h-4 w-4" />
        Scan QR
      </Link>
    </Button>
  );
}
