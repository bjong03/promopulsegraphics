// Sample data for the film, taken from "Promo Pulse Prototype.html".
// The yogurt deal's Execute/Monitor figures were produced by the prototype's
// own model: send the recommended promotion, launch it, then "Simulate next
// day" three times (Sun Oct 18 → Wed Oct 21).

export const DEAL = {
  product: "Greek yogurt 500 g",
  brand: "Brightfield Dairy",
  contact: "Sam Patel",
  offer: "Endcap display + 15% off",
  terms: "Endcap display + 15% off · 5 days · Brightfield Dairy funds 50%",
  stock: "1,180 units",
  atRisk: 388,
  bestBefore: "Oct 27 · 9 days",
  signal: "−31% vs plan, 3 weeks",
  cause: "Demand dropped",
  playbook: "Brightfield Dairy playbook v3",
};

export const TRIGGERS = [
  { id: "yog", kind: "Near expiry", tone: "neg", product: "Greek yogurt 500 g", brand: "Brightfield Dairy", atRisk: 388, days: 9, signal: "−31% vs plan, 3 weeks" },
  { id: "oat", kind: "Overstock", tone: "crit", product: "Oat milk 1.75 L", brand: "Meadowlark Oat", atRisk: 190, days: 21, signal: "34 days of cover vs 14" },
  { id: "ched", kind: "Selling below forecast", tone: "info", product: "Sliced cheddar 200 g", brand: "Hillcrest Creamery", atRisk: 154, days: 18, signal: "−35% vs forecast, 2 weeks" },
] as const;

export const OPTIONS = [
  { label: "25% off", retailer: 1354, brand: -138, saved: 328, rec: false },
  { label: "2 for $8.00", retailer: 1395, brand: -175, saved: 342, rec: false },
  { label: "Endcap display + 15% off", retailer: 1716, brand: 139, saved: 336, rec: true },
];

export const ECON = { retailer: 1716, unitsSold: 906, brand: 139, funding: 373, saved: 336, wouldExpire: 388 };

export const CHECKS = ["Discount 15%, limit 30%", "Brand funds 50%, allowed 40%–60%", "5 days, limit 7", "Funding $373, $880 left this month"];

export const STORES = [
  { n: "Harbourview", set: true, a: 98, f: 90 },
  { n: "Midtown Station", set: true, a: 136, f: 141 },
  { n: "Maple Grove", set: true, a: 60, f: 55 },
  { n: "Riverside", set: false, a: 61, f: 103 },
  { n: "Kingsway", set: true, a: 89, f: 83 },
  { n: "Elm Park", set: true, a: 66, f: 71 },
];

export const STAGES = [
  { l: "Detected", sub: "Sun Oct 18" },
  { l: "Approved", sub: "Auto, at send" },
  { l: "Live in SAP", sub: "PMR + OPP" },
  { l: "Stores set up", sub: "5 of 6" },
  { l: "Selling", sub: "From Mon Oct 19" },
  { l: "Ended", sub: "Fri Oct 23" },
];

/** Live tracker entries for the yogurt deal, with the SAP system that recorded each. */
export const RECORD = [
  { time: "7:05 am", text: "Near expiry flagged: 388 units at risk in 6 stores", sys: "S/4HANA + CAR", kind: "detect" },
  { time: "9:02 am", text: "Dana picked Endcap display + 15% off, 5 days, Brightfield Dairy funds 50%", sys: "Promo Pulse", kind: "decide" },
  { time: "9:04 am", text: "Inside all 4 playbook rules. Auto-approved under v3, $373 committed", sys: "Trade Mgmt", kind: "approve" },
  { time: "9:06 am", text: "Promotion created, Mon Oct 19 to Fri Oct 23", sys: "PMR", kind: "launch" },
  { time: "9:08 am", text: "Price Endcap display + 15% off pushed to 6 stores", sys: "OPP", kind: "launch" },
  { time: "9:10 am", text: "Set-up tasks sent to 6 store apps, with display instructions", sys: "Store app", kind: "launch" },
  { time: "9:20 am", text: "5 stores confirmed set-up · shelf photos", sys: "Store app", kind: "store" },
] as const;

export const MONITOR = {
  head: "Greek yogurt 500 g · Endcap display + 15% off",
  sub: "Day 3 of 5 · Brightfield Dairy funds 50%",
  stats: [
    { k: "Sold vs forecast", v: "94%", s: "510 of 543 units", tone: "" },
    { k: "Stores that set up", v: "102%", s: "of their forecast", tone: "good" },
    { k: "Set-up confirmed", v: "5 of 6", s: "stores", tone: "crit" },
    { k: "Profit vs plan", v: "−6%", s: "$754 to date", tone: "" },
  ],
  days: [
    { a: 173, f: 181 },
    { a: 170, f: 181 },
    { a: 167, f: 181 },
    { a: null, f: 181 },
    { a: null, f: 181 },
  ] as { a: number | null; f: number }[],
  rec: "Riverside hasn’t confirmed set-up after 3 days. Nudge the store and pause replenishment of this item until it does.",
};
