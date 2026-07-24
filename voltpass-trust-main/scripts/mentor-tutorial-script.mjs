export const tutorial = [
  {
    path: "/",
    cursor: { x: 650, y: 190 },
    action: "top",
    caption: "VoltPass overview",
    narration:
      "Hello sir. This is a complete walkthrough of VoltPass, our digital trust platform for second life electric vehicle batteries. The main problem we are solving is trust. When an EV battery finishes its first life in a vehicle, buyers, inspectors, owners, and recyclers need a clear way to understand its identity, health, safety, and best next use.",
  },
  {
    path: "/",
    cursor: { x: 650, y: 365 },
    action: "top",
    caption: "Core promise: passport plus Trust Score",
    narration:
      "On the landing page, VoltPass introduces the core promise: every used EV battery gets a digital passport and a transparent Trust Score. Instead of relying only on manual documents or verbal claims, the platform creates a standardized record that helps users decide whether the battery should be reused, repurposed, or recycled.",
  },
  {
    path: "/",
    cursor: { x: 355, y: 565 },
    action: "top",
    caption: "Three user-facing pillars",
    narration:
      "The first three pillars are visible here. Digital Passport gives each battery a tamper-resistant identity. Trust Score converts technical health signals into a zero to one hundred rating. QR Verification lets someone scan or enter a code and verify the battery in seconds.",
  },
  {
    path: "/",
    cursor: { x: 625, y: 375 },
    action: "scroll:650",
    caption: "Why second-life batteries need structure",
    narration:
      "This section explains why the idea matters. Millions of EV batteries will reach the end of their first vehicle life, but many still retain useful capacity. VoltPass is designed for that transition point, where structured data can reduce risk and support the circular battery economy.",
  },
  {
    path: "/",
    cursor: { x: 760, y: 330 },
    action: "scroll:1250",
    caption: "What the platform evaluates",
    narration:
      "The feature section shows exactly what the platform evaluates. The Trust Score Engine combines state of health, charge cycles, temperature exposure, fast charging frequency, and fault history. These are the kinds of signals a technical evaluator would want before approving a second life use case.",
  },
  {
    path: "/",
    cursor: { x: 650, y: 360 },
    action: "scroll:1900",
    caption: "Lifecycle guidance",
    narration:
      "VoltPass also maps the lifecycle from manufacturing to vehicle usage, maintenance, inspection, second life, reuse, and recycling. The important point is that the passport travels with the battery, so each stage adds more context instead of losing information.",
  },
  {
    path: "/scan",
    cursor: { x: 640, y: 235 },
    action: "top",
    caption: "Public verification flow",
    narration:
      "Now I will demonstrate the public verification flow. This is useful for a buyer, inspector, recycler, or any stakeholder who has a battery code or QR code and wants to check the battery without needing full dashboard access.",
  },
  {
    path: "/scan",
    cursor: { x: 610, y: 350 },
    action: "type-code",
    caption: "Demo code: VP-TES-001",
    narration:
      "In the input field, I enter the demo battery code VP-TES-001. When I click Look up, the application searches the public batteries table for a matching code and then opens the matching public passport page.",
  },
  {
    path: "current",
    cursor: { x: 580, y: 115 },
    action: "lookup",
    caption: "Verified Battery Passport",
    narration:
      "This is the verified Battery Passport. At the top, we can see the battery code, manufacturer, and model. In this example, the battery is a Tesla Model S 100D pack with a visible verified passport label.",
  },
  {
    path: "current",
    cursor: { x: 455, y: 345 },
    action: "none",
    caption: "Identity and health fields",
    narration:
      "The passport then shows the technical fields that matter for evaluation: chemistry, manufacturing date, original capacity, current capacity, state of health, charge cycles, average operating temperature, fault count, and lifecycle status.",
  },
  {
    path: "current",
    cursor: { x: 975, y: 310 },
    action: "none",
    caption: "Trust Score rating",
    narration:
      "On the right, the Trust Score summarizes these inputs into one understandable rating. For this battery, the score is eighty out of one hundred, which is categorized as good. This makes the result easier to understand for both technical and non-technical users.",
  },
  {
    path: "current",
    cursor: { x: 610, y: 535 },
    action: "none",
    caption: "Recommendation engine",
    narration:
      "Below the metrics, VoltPass gives a recommendation. A good score is suitable for commercial applications such as fleet vehicles, commercial EVs, or light industrial mobility. Lower scores would be directed toward stationary storage or certified recycling.",
  },
  {
    path: "current",
    cursor: { x: 650, y: 630 },
    action: "none",
    caption: "PDF report export",
    narration:
      "The Download PDF Report button is important for sharing. A user can export the battery passport as a document for offline review, mentor evaluation, inspection records, or buyer communication.",
  },
  {
    path: "/auth/register",
    cursor: { x: 650, y: 130 },
    action: "top",
    caption: "Account creation",
    narration:
      "Next is the account flow. A new user can create a VoltPass account by adding their name, email, password, optional organization, and role. The role options include battery owner, battery inspector, buyer, and admin for the demo.",
  },
  {
    path: "/auth/register",
    cursor: { x: 610, y: 465 },
    action: "register-fields",
    caption: "Role-based access",
    narration:
      "This role selection supports the idea that different people need different levels of access. A buyer may only need verification, an inspector may add inspection notes, an owner may register batteries, and an admin may monitor the full system.",
  },
  {
    path: "/auth/login",
    cursor: { x: 630, y: 345 },
    action: "top",
    caption: "Returning users",
    narration:
      "Returning users sign in from this page. The project supports email login and also has a Google sign-in option if Firebase settings are configured. After authentication, users are redirected to the dashboard.",
  },
  {
    path: "/dashboard",
    cursor: { x: 400, y: 250 },
    action: "top",
    caption: "Authenticated dashboard",
    narration:
      "This is the authenticated dashboard view. It gives a fleet-level overview: total batteries, average Trust Score, how many batteries are healthy, and how many are at risk. This helps an organization understand the overall condition of its battery inventory.",
  },
  {
    path: "/dashboard",
    cursor: { x: 405, y: 525 },
    action: "none",
    caption: "Trust distribution and chemistry mix",
    narration:
      "The charts show Trust Score distribution and chemistry mix. This is useful because not every battery has the same chemistry, degradation behavior, or second life suitability. The dashboard turns those records into a quick operational view.",
  },
  {
    path: "/dashboard",
    cursor: { x: 650, y: 595 },
    action: "scroll:520",
    caption: "SOH versus Trust Score",
    narration:
      "The dashboard also compares state of health against Trust Score. That matters because capacity alone is not enough. A battery can have decent capacity but still be risky if it has too many cycles, overheating history, fast charging stress, or fault records.",
  },
  {
    path: "/batteries",
    cursor: { x: 650, y: 190 },
    action: "top",
    caption: "Battery inventory",
    narration:
      "The batteries page lists registered batteries as searchable cards. Each card shows the battery code, manufacturer, model, chemistry, state of health, charge cycles, score category, and score progress bar. This is the working inventory screen.",
  },
  {
    path: "/batteries/register",
    cursor: { x: 700, y: 130 },
    action: "top",
    caption: "Registering a battery",
    narration:
      "When registering a battery, the form collects identity, capacity, cycle history, electrical values, thermal values, fault records, maintenance records, and inspection notes. The Trust Score updates live as the user changes those inputs.",
  },
  {
    path: "/batteries/register",
    cursor: { x: 980, y: 330 },
    action: "scroll:430",
    caption: "Live Trust Score calculation",
    narration:
      "The score calculation is weighted. State of health contributes the largest share, then charge cycles, temperature behavior, fast charging frequency, fault count, and remaining capacity. The goal is not only to store data, but to convert it into a decision-ready score.",
  },
  {
    path: "/",
    cursor: { x: 650, y: 360 },
    action: "top",
    caption: "Final summary",
    narration:
      "To summarize, VoltPass connects three important pieces: a digital battery passport, a transparent Trust Score, and lifecycle recommendations. This makes second life battery decisions easier to verify, easier to explain, and easier to share with stakeholders.",
  },
  {
    path: "/",
    cursor: { x: 650, y: 360 },
    action: "top",
    caption: "Mentor-ready closing",
    narration:
      "For a mentor review, the key takeaway is that this is not just a landing page. It is a working product flow: public verification, real battery passports, report export, role-based accounts, fleet analytics, battery inventory, and live scoring during registration. Thank you.",
  },
];
