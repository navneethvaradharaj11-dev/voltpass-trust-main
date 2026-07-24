# ⚡ VoltPass — Digital Battery Passport & Trust Score

<div align="center">

![VoltPass Banner](https://img.shields.io/badge/VoltPass-Battery%20Passport%20Platform-0891b2?style=for-the-badge&logo=lightning&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-95.4%25-3178c6?style=flat-square&logo=typescript)
![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)
![TanStack](https://img.shields.io/badge/TanStack-Full%20Stack-000000?style=flat-square&logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-3ECF8E?style=flat-square&logo=supabase)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

**🔋 Revolutionizing Second-Life EV Battery Trust & Transparency**

**Secure • Transparent • Sustainable • Intelligent**

[🚀 Live Demo](#-live-platform) • [📖 Features](#-features) • [⚙️ Tech Stack](#-tech-stack) • [🏗️ Architecture](#-architecture) • [📚 Documentation](#-documentation)

</div>

---

## 🌐 Live Platform

**[🔗 Visit VoltPass Live](https://voltpass-trust.vercel.app)** — Experience the platform in action

> **Demo Access:** Create a free account to explore the dashboard, register batteries, and view trust scores in real-time.

---

## 🎯 Overview

**VoltPass** is a cutting-edge digital battery passport and trust-scoring platform that revolutionizes transparency for second-life EV batteries. By combining advanced AI-driven algorithms with comprehensive data collection, VoltPass enables battery owners, inspectors, and buyers to make confident decisions about reuse, repurposing, or recycling.

> 🔑 **The Problem:** How do you trust the quality of a second-life EV battery without transparent data?
>
> ✅ **The Solution:** VoltPass provides **digital passports, algorithmic trust scoring, lifecycle recommendations, and audit trails**—all enforced by row-level security on PostgreSQL.

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🔐 Digital Battery Passport
- **Tamper-resistant** battery identity
- **Unique QR codes** for instant verification
- **Complete provenance tracking** from manufacturing to recycling
- **Immutable audit logs** for compliance

</td>
<td width="50%">

### 📊 Trust Score Engine
- **Weighted AI algorithm** combining:
  - State of Health (SOH) - 35%
  - Charge Cycles - 20%
  - Temperature Exposure - 15%
  - Fast-Charging Frequency - 10%
  - Fault History - 10%
  - Remaining Capacity - 10%
- **Real-time scoring** updates
- **Category-based recommendations**

</td>
</tr>
<tr>
<td width="50%">

### 🎨 Real-Time Analytics Dashboard
- **Interactive Recharts** visualizations
- **Health distribution charts**
- **Capacity degradation trends**
- **Chemistry mix analytics**
- **Multi-role insights** (Admin, Inspector, Owner, Buyer)

</td>
<td width="50%">

### ♻️ Lifecycle Intelligence
- **Automatic recommendations:**
  - 🚗 **90+** → EV reuse (primary applications)
  - 🏭 **75–89** → Commercial fleet (industrial mobility)
  - 🔋 **60–74** → Stationary storage (grid backup)
  - ♻️ **<60** → Certified recycling (material recovery)

</td>
</tr>
<tr>
<td width="50%">

### 👥 Multi-Role Access Control
- **Role-based permissions:**
  - `admin` — Platform management & oversight
  - `inspector` — Data collection & validation
  - `owner` — Battery management
  - `buyer` — View-only verification
- **Row-Level Security (RLS)** on PostgreSQL
- **Audit-logged** access trails

</td>
<td width="50%">

### 📄 Smart Report Generation
- **PDF battery passports** with QR codes
- **Certificate generation** for compliance
- **Export capabilities** for fleet management
- **Shareable inspection reports**

</td>
</tr>
</table>

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or **Bun** (recommended)
- PostgreSQL 13+ (via Supabase)
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/Tharunmtb-racer21/voltpass-trust.git
cd voltpass-trust

# Install dependencies (using Bun)
bun install

# Or with npm
npm install
```

### Environment Setup

Create a `.env` file in the project root:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional: Server-side Supabase for API routes
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Running Locally

```bash
# Start development server (hot reload enabled)
bun run dev
# or: npm run dev

# Server runs at http://localhost:5173
```

### Building & Deployment

```bash
# Build for production
bun run build

# Preview production build
bun run preview

# Deploy to Vercel (configured by default)
# Push to main branch — auto-deploys to https://voltpass-trust.vercel.app
```

---

## 📊 Trust Score Algorithm

The **Trust Score** (0–100) combines multiple weighted factors:

```typescript
Score = (SOH × 0.35) + (Cycles × 0.20) + (Temp × 0.15) 
      + (FastCharge × 0.10) + (Faults × 0.10) + (Remaining × 0.10)

where:
  SOH = Current Capacity / Original Capacity
  Cycles = 100 - (charge_cycles / 1500)
  Temp = 100 - max(avg_temp - 25°C, 0) × 8
  FastCharge = 100 - fast_charging_frequency × 2
  Faults = 100 - fault_count × 15
  Remaining = SOH (weighted again for emphasis)
```

**Recommendation Thresholds:**
| Score | Category | Use Case | Recommendation |
|-------|----------|----------|-----------------|
| 90–100 | ✅ Excellent | Primary EV reuse | Direct second-life vehicle deployment |
| 75–89 | 🟢 Good | Commercial fleet | Fleet vehicles, light industrial |
| 60–74 | 🟡 Moderate | Stationary storage | Grid backup, solar storage |
| <60 | 🔴 High Risk | Recycling | Material recovery via certified recyclers |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React 19)                       │
│  TanStack Router • TanStack Query • Recharts • Radix UI     │
└─────────────────────────────┬───────────────────────────────┘
                              │
                ┌─────────────┴──────────────┐
                │                            │
       ┌────────▼────────┐        ┌─────────▼──────────┐
       │  Client Auth    │        │  API Routes        │
       │  (Supabase)     │        │  (Server-side)     │
       └────────┬────────┘        └─────────┬──────────┘
                │                           │
                └─────────────┬─────────────┘
                              │
              ┌───────────────▼──────────────┐
              │  Supabase (PostgreSQL)       │
              │  ✓ Row-Level Security (RLS) │
              │  ✓ Real-time subscriptions   │
              │  ✓ Audit logging             │
              └──────────────────────────────┘
```

### Directory Structure

```
voltpass-trust/
├── src/
│   ├── routes/                    # TanStack Start file-based routing
│   │   ├── __root.tsx            # App shell & context
│   │   ├── index.tsx             # Marketing landing page
│   │   ├── scan.tsx              # QR scanner page
│   │   ├── auth/                 # Auth flows (login, register, forgot, reset)
│   │   └── _authenticated/       # Protected routes (dashboard, admin, batteries)
│   │       ├── dashboard.tsx     # Analytics dashboard
│   │       ├── admin.tsx         # Admin panel
│   │       └── batteries/        # Battery CRUD operations
│   │
│   ├── components/
│   │   ├── app-header.tsx        # Global navigation
│   │   ├── trust-score-meter.tsx # Score visualization
│   │   └── ui/                   # Radix UI components
│   │
│   ├── lib/
│   │   ├── trust-score.ts        # 📈 Trust algorithm
│   │   ├── use-auth.ts           # 🔐 Auth state hook
│   │   ├── pdf-report.ts         # 📄 PDF generation
│   │   ├── auth-middleware.ts    # 🛡️ RLS enforcement
│   │   └── error-capture.ts      # 🚨 SSR error handling
│   │
│   ├── integrations/
│   │   ├── supabase/
│   │   │   ├── types.ts          # Generated TypeScript schema
│   │   │   ├── client.ts         # Browser client
│   │   │   └── client.server.ts  # Server client
│   │   └── lovable/              # Lovable.dev integration
│   │
│   └── styles.css                # Tailwind + global styles
│
├── supabase/
│   ├── migrations/               # Database schema (PostgreSQL)
│   │   ├── 20260623095817_...    # Initial schema
│   │   ├── 20260623095844_...    # RLS policies
│   │   └── 20260623100423_...    # Audit logging
│   └── config.toml               # Local dev configuration
│
├── package.json                  # Dependencies & scripts
├── vite.config.ts               # Build configuration
├── tsconfig.json                # TypeScript configuration
└── README.md                    # 📖 This file
```

---

## ⚙️ Tech Stack

### Frontend
- **React 19** — Latest React with hooks & suspense
- **TanStack Router** — Type-safe file-based routing
- **TanStack Query** — Powerful data fetching & caching
- **Vite** — Lightning-fast build tool
- **Tailwind CSS** — Utility-first styling
- **Radix UI** — Accessible, unstyled components
- **Recharts** — React charting library
- **jsPDF** — PDF generation
- **QR Code React** — QR code generation

### Backend & Data
- **TanStack Start** — Full-stack framework
- **Supabase** — PostgreSQL + real-time subscriptions
- **PostgREST** — Auto-generated REST API
- **Row-Level Security (RLS)** — Enforced data privacy
- **Audit Logging** — Compliance tracking

### DevOps & Deployment
- **Vercel** — Hosting & edge functions
- **GitHub** — Version control & CI/CD
- **Lovable.dev** — Visual editor integration
- **ESLint & Prettier** — Code quality & formatting

---

## 🔐 Security & Compliance

✅ **Row-Level Security (RLS)**
- Database-level access control
- Every query respects user roles and permissions
- Prevents unauthorized data exposure

✅ **Audit Logging**
- All battery data changes recorded
- User identity & timestamp tracked
- Immutable audit trail

✅ **Authentication**
- Supabase Auth (OAuth, email/password)
- Session management with refresh tokens
- Multi-factor authentication support

✅ **Data Privacy**
- GDPR-ready data handling
- Encrypted sensitive fields
- Secure API endpoints

---

## 📈 Analytics & Insights

The dashboard provides real-time analytics:

- **Health Distribution** — Battery population trends
- **Capacity Degradation** — Wear patterns over time
- **Chemistry Mix** — LiFePO₄, NCA, NCM analysis
- **Trust Score Distribution** — Platform-wide health metrics
- **Lifecycle Breakdown** — Reuse vs. recycling recommendations

---

## 🤝 Multi-Role Workflows

### 🏭 Admin Workflow
1. View platform statistics
2. Manage inspectors & users
3. Generate compliance reports
4. Audit access logs

### 🔍 Inspector Workflow
1. Register new batteries
2. Input health metrics (SOH, cycles, temperature)
3. Validate data quality
4. Generate inspection reports

### 👤 Owner Workflow
1. Register & manage battery
2. View QR passport
3. Track historical data
4. Export reports for resale

### 🛒 Buyer Workflow
1. Scan QR code
2. View trust score & recommendations
3. Verify provenance
4. Access public certificate

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Push to main branch to auto-deploy
git push origin main

# Live at: https://voltpass-trust.vercel.app
```

### Self-Hosted (Docker)
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm ci && npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 📚 Documentation

- 📖 [Architecture Deep Dive](./docs/ARCHITECTURE.md)
- 🔐 [Security & RLS Guide](./docs/SECURITY.md)
- 🤖 [Trust Algorithm Explained](./docs/ALGORITHM.md)
- 💾 [Database Schema](./supabase/migrations/)
- 🛠️ [Contributing Guide](./CONTRIBUTING.md)

---

## 🤖 AI Chatbot Assistant — VoltBot

VoltPass features an integrated AI chatbot — **VoltBot** — powered by **[Chatbase](https://www.chatbase.co)**, embedded directly into the platform for real-time user assistance.

### 💬 What is VoltBot?

VoltBot is a trained conversational AI assistant that guides users across all VoltPass workflows — from understanding trust scores to navigating battery lifecycle decisions. It is embedded as a persistent chat widget across every page of the platform.

```
Chatbot Provider : Chatbase (chatbase.co)
Chatbot ID       : ieYb8i-I9LjdYAJshex_6
Embed Method     : Client-side JS snippet in <body>
Scope            : All pages (global, via __root.tsx shell)
```

### 🧠 Training Data & Knowledge Base

VoltBot was trained on a curated set of domain-specific data covering:

| Topic | Data Source |
|-------|-------------|
| 🔋 Battery Health Metrics | SOH, charge cycles, temperature, fast-charge frequency, fault history |
| 📊 Trust Score Algorithm | Weighted scoring formula, threshold breakpoints, recommendation logic |
| ♻️ Lifecycle Recommendations | Reuse vs repurpose vs recycling decision matrix |
| 👥 Multi-Role Workflows | Admin, Inspector, Owner, Buyer – their access and actions |
| 📄 Digital Passport System | QR code verification, provenance, compliance reports |
| 🔐 Security & RLS | Row-Level Security, audit logging, authentication flows |
| 🌐 Platform Navigation | Dashboard, battery registration, admin panel features |
| 🚗 EV Industry Context | Second-life batteries, circular economy, EU Battery Regulation |

### ⚙️ Integration

The chatbot is injected into the app shell (`src/routes/__root.tsx`) as a global script:

```tsx
// Embedded in RootShell → <body>
<script dangerouslySetInnerHTML={{ __html: `
  (function(){
    // Chatbase loader — initializes VoltBot widget
    // ID: ieYb8i-I9LjdYAJshex_6
    window.chatbase = ...
  })();
` }} />
```

This ensures VoltBot is available on every authenticated and public page without needing per-route configuration.

### 🎯 VoltBot Capabilities

- ✅ Answer questions about **what trust scores mean**
- ✅ Explain **lifecycle recommendations** (Reuse / Fleet / Storage / Recycle)
- ✅ Guide users through **battery registration** and inspection workflows
- ✅ Help **buyers** interpret QR passport data
- ✅ Clarify **role-based permissions** and what each role can do
- ✅ Provide **general EV battery domain knowledge**

---

## 🎯 Roadmap

- [x] **AI Chatbot (VoltBot)** — Chatbase-powered assistant with custom domain training
- [ ] **Mobile App** — React Native for iOS/Android
- [ ] **Blockchain Integration** — Immutable passport ledger
- [ ] **AI Predictive Maintenance** — ML-based degradation forecasting
- [ ] **Marketplace** — Battery trading platform
- [ ] **API v2** — GraphQL support
- [ ] **Localization** — Multi-language support

---

## 🤲 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for code style guidelines and standards.

---

## 📞 Support & Community

- 💬 **GitHub Issues** — Bug reports & feature requests
- 📧 **Email** — [support@voltpass.dev](mailto:support@voltpass.dev)
- 🐦 **Twitter** — [@VoltPass](https://twitter.com/voltpass)
- 💼 **LinkedIn** — [VoltPass](https://linkedin.com/company/voltpass)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- **TanStack** — Router, Query, and Start frameworks
- **Supabase** — PostgreSQL hosting & authentication
- **Radix UI** — Accessible component library
- **Vercel** — Seamless deployment platform
- **Lovable.dev** — Visual editor integration
- **EV Industry Partners** — Domain expertise & validation

---

<div align="center">

### Built with ⚡ by Navneeth for a Sustainable EV Future

**[🌐 Live Platform](https://voltpass-trust.vercel.app)** • **[📖 Docs](./docs)** • **[💬 Discussions](https://github.com/navneethvaradharaj11-dev/voltpass-trust-main/discussions)**

**© 2026 VoltPass — Building Trust for the Circular Battery Economy**

</div>
