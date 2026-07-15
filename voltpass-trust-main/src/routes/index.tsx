import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Battery,
  ShieldCheck,
  Gauge,
  Recycle,
  ArrowRight,
  QrCode,
  BarChart3,
  Leaf,
  Cpu,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/app-header";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VoltPass — Trust for the Second Life of EV Batteries" },
      {
        name: "description",
        content:
          "Digital Battery Passport, Trust Score Engine, and recommendations for second-life EV batteries.",
      },
      { property: "og:title", content: "VoltPass" },
      {
        property: "og:description",
        content: "Building Trust for the Second Life of EV Batteries.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <>
      <AppHeader />
      <main>
        <Hero />
        <Stats />
        <Features />
        <Lifecycle />
        <CTA />
        <footer className="border-t border-border/60 py-8 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} VoltPass · Building trust for the circular battery economy
        </footer>
      </main>
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-20 sm:px-6 lg:px-8 lg:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <Sparkles className="h-3 w-3 text-primary" />
            Battery Management Systems · Second-Life Platform
          </div>
          <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Building <span className="text-gradient-electric">Trust</span> for the Second Life of EV
            Batteries
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            A digital passport and transparent Trust Score for every used EV battery. Decide with
            confidence — reuse, repurpose, or recycle.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-primary to-electric-glow text-primary-foreground glow-electric"
            >
              <Link to="/auth/register">
                Start Free <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/dashboard">View Live Dashboard</Link>
            </Button>
          </div>
        </div>

        <div className="mt-20 grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              label: "Digital Passport",
              desc: "Tamper-resistant battery identity",
            },
            { icon: Gauge, label: "Trust Score", desc: "0–100 health & safety rating" },
            { icon: QrCode, label: "QR Verification", desc: "Scan & verify in seconds" },
          ].map((f) => (
            <div key={f.label} className="glass-card rounded-2xl p-5">
              <f.icon className="mb-3 h-6 w-6 text-primary" />
              <div className="font-display text-lg font-semibold">{f.label}</div>
              <div className="mt-1 text-sm text-muted-foreground">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const items = [
    { v: "12 M+", l: "EV batteries reaching end of first life by 2030" },
    { v: "70%", l: "Average remaining capacity at vehicle retirement" },
    { v: "10 yr", l: "Typical second-life duration in stationary storage" },
    { v: "95%", l: "Material recoverable via certified recycling" },
  ];
  return (
    <section className="border-y border-border/60 bg-card/40 py-12">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
        {items.map((s) => (
          <div key={s.l}>
            <div className="font-display text-3xl font-bold text-gradient-electric">{s.v}</div>
            <div className="mt-1 text-xs text-muted-foreground">{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Features() {
  const items = [
    {
      icon: Cpu,
      title: "Trust Score Engine",
      body: "Weighted algorithm combines SOH, charge cycles, temperature exposure, fast-charging frequency, and fault history.",
    },
    {
      icon: QrCode,
      title: "QR Battery Passport",
      body: "Unique QR code per battery — scan to verify provenance, history, and current health.",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      body: "Real-time charts: health distribution, chemistry mix, capacity degradation, trust trends.",
    },
    {
      icon: Recycle,
      title: "Lifecycle Recommendation",
      body: "Automatic guidance — EV reuse, commercial fleet, stationary storage, or recycling.",
    },
    {
      icon: ShieldCheck,
      title: "Multi-role Access",
      body: "Admins, inspectors, owners, buyers — RLS-enforced, audit-logged.",
    },
    {
      icon: Leaf,
      title: "Circular Economy",
      body: "Extend battery life, reduce e-waste, recover critical minerals.",
    },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-4xl font-bold">
          Everything you need to assess a second-life battery
        </h2>
        <p className="mt-3 text-muted-foreground">
          Standardized data, transparent scoring, defensible recommendations.
        </p>
      </div>
      <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((f) => (
          <div
            key={f.title}
            className="glass-card group rounded-2xl p-6 transition-all hover:border-primary/60 hover:shadow-[0_0_30px_oklch(0.72_0.19_235/0.25)]"
          >
            <div className="mb-4 inline-grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/30">
              <f.icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-display text-lg font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Lifecycle() {
  const steps = [
    "Manufacturing",
    "Vehicle Usage",
    "Maintenance",
    "Inspection",
    "Second-Life",
    "Reuse",
    "Recycling",
  ];
  return (
    <section className="border-t border-border/60 bg-card/30 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl font-bold">A passport for every stage</h2>
          <p className="mt-3 text-muted-foreground">
            From cradle to cradle — VoltPass travels with the battery.
          </p>
        </div>
        <div className="mt-14 flex flex-wrap items-center justify-center gap-3">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <div className="glass-card rounded-xl px-4 py-3 text-sm font-medium">{s}</div>
              {i < steps.length - 1 && <ArrowRight className="h-4 w-4 text-primary" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="glass-card rounded-3xl p-10 text-center glow-electric">
        <Battery className="mx-auto h-10 w-10 text-primary" />
        <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
          Register your first battery in minutes
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Free during pilot. No credit card required.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-primary to-electric-glow text-primary-foreground"
          >
            <Link to="/auth/register">Create account</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/dashboard">Explore demo data</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
