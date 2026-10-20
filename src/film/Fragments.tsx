// The disconnected tools Dana juggles today. Presentational only: parents
// position and animate them. Names and figures come from the prototype's
// sample data (Brightfield Dairy, Sam Patel, Greek yogurt 500 g, Riverside).
import React from "react";
import { DISPLAY, F } from "./theme";

const card: React.CSSProperties = {
  background: "#14181E",
  border: "1px solid rgba(255,255,255,.09)",
  borderRadius: 12,
  boxShadow: "0 24px 60px rgba(0,0,0,.55)",
  fontFamily: DISPLAY,
  color: "#E6E9ED",
  overflow: "hidden",
};

const TitleBar: React.FC<{ title: string; right?: React.ReactNode }> = ({ title, right }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      height: 38,
      padding: "0 14px",
      borderBottom: "1px solid rgba(255,255,255,.07)",
      background: "#1A1F26",
      fontSize: 15,
      color: F.mist,
    }}
  >
    {["#3A414A", "#3A414A", "#3A414A"].map((c, i) => (
      <i key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: c, display: "inline-block" }} />
    ))}
    <span style={{ marginLeft: 8, flex: 1 }}>{title}</span>
    {right}
  </div>
);

/** A small yogurt-tub glyph, the visual thread into the shelf scene. */
export const TubGlyph: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={{ display: "block" }}>
    <path d="M 8 14 L 32 14 L 29 34 Q 20 37 11 34 Z" fill="#EDE8DF" />
    <rect x={6} y={10} width={28} height={5} rx={2} fill="#D9D2C6" />
    <path d="M 9.5 20 L 30.5 20 L 29.8 25 L 10.2 25 Z" fill={F.cyan} opacity={0.9} />
  </svg>
);

export const ReportWindow: React.FC<{ style?: React.CSSProperties; highlight: number }> = ({ style, highlight }) => (
  <div style={{ ...card, width: 620, position: "absolute", ...style }}>
    <TitleBar title="Weekly inventory report — Dairy & chilled" right={<span style={{ fontSize: 13 }}>Generated Mon 6:00 am</span>} />
    <div style={{ padding: "10px 16px 14px", fontSize: 17 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr", color: F.mist, fontSize: 13, letterSpacing: ".06em", padding: "6px 0" }}>
        <span>ITEM</span>
        <span>ON HAND</span>
        <span>BEST-BEFORE</span>
        <span>VS PLAN</span>
      </div>
      {[
        ["Oat milk 1.75 L", "2,140", "Nov 8", "+4%"],
        ["Greek yogurt 500 g", "1,180", "Oct 27", "−31%"],
        ["Sliced cheddar 200 g", "820", "Nov 5", "−35%"],
        ["Kefir 1 L", "610", "Nov 2", "−2%"],
      ].map((r, i) => (
        <div
          key={r[0]}
          style={{
            display: "grid",
            gridTemplateColumns: "1.6fr 1fr 1fr 1fr",
            padding: "8px 8px",
            margin: "0 -8px",
            borderRadius: 6,
            borderTop: "1px solid rgba(255,255,255,.05)",
            background: i === 1 ? `rgba(232,111,85,${0.18 * highlight})` : undefined,
            color: i === 1 && highlight > 0.5 ? "#FFD9CF" : undefined,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {r.map((c, j) => (
            <span key={j} style={{ color: j === 3 && c.startsWith("−") ? (i === 1 ? F.coral : "#C9A27A") : undefined }}>
              {c}
            </span>
          ))}
        </div>
      ))}
    </div>
  </div>
);

export const AlertToast: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <div style={{ ...card, width: 540, position: "absolute", display: "flex", gap: 16, alignItems: "center", padding: "16px 18px", borderColor: "rgba(232,111,85,.45)", ...style }}>
    <span style={{ width: 52, height: 52, borderRadius: 12, background: "rgba(232,111,85,.14)", display: "grid", placeItems: "center", flex: "none" }}>
      <TubGlyph size={36} />
    </span>
    <div style={{ flex: 1 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 700, letterSpacing: ".08em", color: F.coral }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: F.coral, display: "inline-block" }} />
        STOCK ALERT
      </div>
      <div style={{ fontSize: 22, fontWeight: 600, marginTop: 2 }}>Greek yogurt 500 g at risk</div>
      <div style={{ fontSize: 16, color: F.mist, marginTop: 2 }}>Sales 31% below plan — for 3 weeks</div>
    </div>
  </div>
);

export const EmailCard: React.FC<{ subject: string; from: string; snippet: string; replies: number; style?: React.CSSProperties; unread?: boolean }> = ({
  subject,
  from,
  snippet,
  replies,
  style,
  unread,
}) => (
  <div style={{ ...card, width: 520, position: "absolute", padding: "14px 18px", ...style }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15, color: F.mist }}>
      <span style={{ width: 30, height: 30, borderRadius: "50%", background: "#26313D", color: "#C9D3DD", display: "grid", placeItems: "center", fontSize: 12, fontWeight: 700 }}>
        {from
          .split(" ")
          .map((w) => w[0])
          .join("")
          .slice(0, 2)}
      </span>
      <span style={{ flex: 1 }}>{from}</span>
      <span
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "#0C0E11",
          background: unread ? F.amber : "#5B6470",
          borderRadius: 10,
          padding: "1px 8px",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {replies}
      </span>
    </div>
    <div style={{ fontSize: 21, fontWeight: 600, marginTop: 8 }}>{subject}</div>
    <div style={{ fontSize: 16, color: F.mist, marginTop: 3 }}>{snippet}</div>
  </div>
);

/** Spreadsheet with a discount cell being revised. */
export const SheetWindow: React.FC<{ style?: React.CSSProperties; rev: number }> = ({ style, rev }) => {
  const discounts = ["25%", "20%", "15% + endcap"];
  const shares = ["40%", "60%", "50%"];
  const r = Math.min(2, Math.floor(rev));
  const flash = rev - Math.floor(rev) < 0.35 && rev >= 1 ? 1 - (rev - Math.floor(rev)) / 0.35 : 0;
  return (
    <div style={{ ...card, width: 560, position: "absolute", ...style }}>
      <TitleBar title={`Promo_terms_v${r + 1}_FINAL.xlsx`} />
      <div style={{ display: "grid", gridTemplateColumns: "40px 1.4fr 1fr", fontSize: 17, fontVariantNumeric: "tabular-nums" }}>
        {[
          ["", "A", "B"],
          ["1", "Item", "Greek yogurt 500 g"],
          ["2", "Discount", discounts[r]],
          ["3", "Brand funds", shares[r]],
          ["4", "Length", "5 days"],
        ].map((row, i) =>
          row.map((c, j) => (
            <span
              key={`${i}-${j}`}
              style={{
                padding: "7px 10px",
                borderRight: "1px solid rgba(255,255,255,.06)",
                borderBottom: "1px solid rgba(255,255,255,.06)",
                color: i === 0 || j === 0 ? F.mist : undefined,
                fontSize: i === 0 || j === 0 ? 13 : 17,
                background: (i === 2 || i === 3) && j === 2 ? `rgba(232,160,74,${0.1 + 0.3 * flash})` : i === 0 || j === 0 ? "#181C22" : undefined,
              }}
            >
              {c}
            </span>
          )),
        )}
      </div>
    </div>
  );
};

export const StoreTask: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <div style={{ ...card, width: 500, position: "absolute", padding: "16px 18px", ...style }}>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: F.mist, letterSpacing: ".06em" }}>
      <span>STORE TASK · RIVERSIDE</span>
      <span>Today 7:40 am</span>
    </div>
    <div style={{ fontSize: 22, fontWeight: 600, marginTop: 8 }}>Set up yogurt endcap display</div>
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
      <span style={{ fontSize: 14, fontWeight: 700, color: F.amber, background: "rgba(232,160,74,.14)", borderRadius: 6, padding: "3px 10px" }}>Awaiting confirmation</span>
      <span style={{ fontSize: 15, color: F.mist }}>Which plan applies?</span>
    </div>
  </div>
);

export const PlanVersion: React.FC<{ v: string; terms: string; start: string; style?: React.CSSProperties; stale?: boolean }> = ({ v, terms, start, style, stale }) => (
  <div style={{ ...card, width: 330, position: "absolute", padding: "14px 16px", ...style }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 14, color: F.mist, letterSpacing: ".06em" }}>PROMOTION PLAN</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: stale ? "#0C0E11" : "#E6E9ED", background: stale ? "#5B6470" : "rgba(46,168,255,.25)", padding: "1px 8px", borderRadius: 6 }}>{v}</span>
    </div>
    <div style={{ fontSize: 22, fontWeight: 600, marginTop: 8 }}>{terms}</div>
    <div style={{ fontSize: 15, color: F.mist, marginTop: 4 }}>{start}</div>
  </div>
);
