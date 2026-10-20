// Figures as the prototype shows them on Sun Oct 18 (its opening state),
// so the video matches a live demo of the prototype.

export const TRIGGERS = [
  {
    id: "yog",
    kind: "Near expiry",
    tone: "neg" as const,
    color: "#D20A0A",
    product: "Greek yogurt 500 g",
    brand: "Brightfield Dairy",
    atRisk: 388,
    daysLeft: 9,
    signal: "−31% vs plan, 3 weeks",
    signalTone: "neg" as const,
  },
  {
    id: "oat",
    kind: "Overstock",
    tone: "crit" as const,
    color: "#E76500",
    product: "Oat milk 1.75 L",
    brand: "Meadowlark Oat",
    atRisk: 190,
    daysLeft: 21,
    signal: "34 days of cover vs 14",
    signalTone: "crit" as const,
  },
  {
    id: "ched",
    kind: "Selling below forecast",
    tone: "info" as const,
    color: "#0070F2",
    product: "Sliced cheddar 200 g",
    brand: "Hillcrest Creamery",
    atRisk: 154,
    daysLeft: 18,
    signal: "−35% vs forecast, 2 weeks",
    signalTone: "neg" as const,
  },
];

export const TOTAL_AT_RISK = TRIGGERS.reduce((s, t) => s + t.atRisk, 0); // 732

export const YOGURT = {
  stock: 1180,
  atRisk: 388,
  bestBefore: "Oct 27 · 9 days",
  signal: "−31% vs plan, 3 weeks",
  cause: "Demand dropped",
  options: [
    { label: "25% off", retailer: 1354, brand: -138, saved: 328, rec: false },
    { label: "2 for $8.00", retailer: 1395, brand: -175, saved: 342, rec: false },
    { label: "Endcap display + 15% off", retailer: 1716, brand: 139, saved: 336, rec: true },
  ],
  outcome: { retailer: 1716, unitsSold: 906, brand: 139, funding: 373, saved: 336, wouldExpire: 388 },
  stores: [
    { n: "Harbourview", ok: true },
    { n: "Midtown Station", ok: true },
    { n: "Maple Grove", ok: false, note: "No display space, runs price-only" },
    { n: "Riverside", ok: false, note: "Only 1 staff hour free for set-up" },
    { n: "Kingsway", ok: true },
    { n: "Elm Park", ok: true },
  ],
  checks: [
    "Discount 15%, limit 30%",
    "Brand funds 50%, allowed 40%–60%",
    "5 days, limit 7",
    "Funding $373, $880 left this month",
  ],
  playbook: "Brightfield Dairy playbook v3",
};

// The live promotion in Monitor: Chilled orange juice, 2 for $7.00, day 4 of 7.
export const JUICE = {
  title: "Chilled orange juice 1.5 L · 2 for $7.00",
  sub: "Day 4 of 7 · Sunvale Juice funds 50%",
  stats: [
    { label: "Sold vs forecast", value: "85%", small: "495 of 585 units", tone: "" },
    { label: "Stores that set up", value: "88%", small: "of their forecast", tone: "" },
    { label: "Set-up confirmed", value: "5 of 6", small: "stores", tone: "crit" },
    { label: "Profit vs plan", value: "−15%", small: "$543 to date", tone: "neg" },
  ],
  days: [
    { a: 143, f: 146 },
    { a: 141, f: 146 },
    { a: 113, f: 146 },
    { a: 98, f: 146 },
    { a: null, f: 146 },
    { a: null, f: 146 },
    { a: null, f: 146 },
  ] as { a: number | null; f: number }[],
  stores: [
    { n: "Harbourview", set: true, a: 101, f: 93, left: 39 },
    { n: "Midtown Station", set: true, a: 90, f: 160, left: 0 },
    { n: "Maple Grove", set: true, a: 85, f: 80, left: 75 },
    { n: "Riverside", set: false, a: 72, f: 106, left: 78 },
  ],
  recs: [
    {
      lever: "Store execution",
      icon: "users",
      text: "Riverside hasn’t confirmed set-up after 4 days. Nudge the store and pause replenishment of this item until it does.",
      act: "Nudge and pause",
    },
    {
      lever: "Stock between stores",
      icon: "truck",
      text: "Harbourview sells out in about 2 days. Move 30 units from Elm Park, which won’t sell them before the promotion ends.",
      act: "Move 30 units",
    },
    {
      lever: "Stock between stores",
      icon: "truck",
      text: "Midtown Station sells out in about 1 day. Move 120 units from Elm Park, which won’t sell them before the promotion ends.",
      act: "Move 120 units",
    },
  ],
};

export const KPI = {
  live: 1,
  liveName: "Chilled orange juice",
  liveDay: "Day 4 of 7",
  profitVs: "−15%",
  actual: "$543",
  plan: "$641",
  gap: "−$98",
};
