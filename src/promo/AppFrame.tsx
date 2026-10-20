// The persistent app chrome: SAP shell bar, side rail, object-page header and
// icon tab bar. `tab` picks the selected tab; `tabSwitch` (0–1) animates the
// selection moving from Suggest to Monitor.
import React from "react";
import { Img, interpolate, staticFile } from "remotion";
import { Icon } from "./icons";
import { C, SHADOW } from "./theme";

const TABS = [
  { id: "suggest", label: "Suggest", icon: "bulb", count: 3 },
  { id: "execute", label: "Execute", icon: "send", count: 1 },
  { id: "monitor", label: "Monitor", icon: "chart", count: 4 },
  { id: "deals", label: "Deal room", icon: "doc", count: 1 },
];

// Measured x-positions of each tab (centre and width) for the sliding underline.
const TAB_GEOM = [
  { x: 22, w: 108 },
  { x: 150, w: 107 },
  { x: 276, w: 114 },
  { x: 404, w: 128 },
];

export const PAGE_WIDTH = 1600;

export const ShellBar: React.FC = () => (
  <header
    style={{
      display: "grid",
      gridTemplateColumns: "auto minmax(0,1fr) auto",
      alignItems: "center",
      gap: 12,
      height: 72,
      background: C.surface,
      boxShadow: SHADOW,
      padding: "0 16px 0 24px",
      position: "relative",
      zIndex: 5,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <Img src={staticFile("images/sap-logo.png")} style={{ height: 28, width: "auto", marginRight: 4 }} />
      <div>
        <b style={{ display: "block", fontSize: 16, lineHeight: 1.2 }}>Promo Pulse</b>
        <span style={{ display: "block", fontSize: 12.5, color: C.muted }}>SAP Fiori launchpad</span>
      </div>
    </div>
    <div
      style={{
        justifySelf: "center",
        width: 560,
        display: "flex",
        alignItems: "center",
        gap: 8,
        height: 38,
        borderRadius: 19,
        background: C.sunk,
        border: `1px solid ${C.line}`,
        paddingLeft: 14,
        color: C.muted,
        fontSize: 14,
      }}
    >
      <Icon name="search" size={17} />
      Ask Joule, e.g. why is yogurt at risk?
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 14, paddingRight: 8 }}>
      <Icon name="sparkle" size={18} color={C.accent} />
      <span style={{ position: "relative", color: C.ink }}>
        <Icon name="bell" size={20} />
        <span
          style={{
            position: "absolute",
            top: -8,
            right: -8,
            minWidth: 16,
            height: 16,
            borderRadius: 8,
            background: C.negFill,
            color: "#fff",
            fontSize: 10.5,
            fontWeight: 700,
            lineHeight: "16px",
            textAlign: "center",
            padding: "0 4px",
          }}
        >
          9
        </span>
      </span>
      <span
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: C.avatar,
          color: "#fff",
          fontSize: 12,
          fontWeight: 700,
          display: "grid",
          placeItems: "center",
        }}
      >
        DO
      </span>
    </div>
  </header>
);

const Count: React.FC<{ n: number; hot: boolean }> = ({ n, hot }) => (
  <span
    style={{
      fontSize: 11.5,
      fontWeight: 700,
      minWidth: 20,
      height: 20,
      padding: "0 6px",
      borderRadius: 10,
      background: hot ? C.accentFill : C.sunk,
      color: hot ? C.onAccent : C.muted,
      display: "grid",
      placeItems: "center",
    }}
  >
    {n}
  </span>
);

export const Rail: React.FC<{ active: number }> = ({ active }) => (
  <nav
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 6,
      padding: 8,
      background: C.surface,
      borderRadius: 16,
      boxShadow: SHADOW,
      alignSelf: "start",
    }}
  >
    {TABS.map((t, i) => (
      <span
        key={t.id}
        style={{
          position: "relative",
          width: 44,
          height: 44,
          borderRadius: 12,
          display: "grid",
          placeItems: "center",
          background: i === active ? C.accentSoft : "transparent",
          color: i === active ? C.accent : C.muted,
        }}
      >
        <Icon name={t.icon} size={20} />
        <span
          style={{
            position: "absolute",
            top: 3,
            right: 2,
            minWidth: 16,
            height: 16,
            borderRadius: 8,
            background: C.accentFill,
            color: "#fff",
            fontSize: 10,
            fontWeight: 700,
            lineHeight: "16px",
            textAlign: "center",
            padding: "0 4px",
          }}
        >
          {t.count}
        </span>
      </span>
    ))}
    <span style={{ height: 1, background: C.line, margin: "4px 6px" }} />
    <span style={{ width: 44, height: 44, display: "grid", placeItems: "center" }}>
      <Icon name="sparkle" size={18} color={C.accent} />
    </span>
  </nav>
);

export const WorkspaceHeader: React.FC<{ tabSwitch: number }> = ({ tabSwitch }) => {
  // Underline slides from Suggest (0) to Monitor (2).
  const from = TAB_GEOM[0];
  const to = TAB_GEOM[2];
  const x = interpolate(tabSwitch, [0, 1], [from.x, to.x]);
  const w = interpolate(tabSwitch, [0, 1], [from.w, to.w]);
  const activeIdx = tabSwitch < 0.5 ? 0 : 2;

  return (
    <section style={{ background: C.surface, borderRadius: 16, boxShadow: SHADOW, overflow: "hidden" }}>
      <div style={{ height: 6, background: C.accentFill }} />
      <div style={{ padding: "16px 20px 4px", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <span
              style={{
                width: 46,
                height: 46,
                borderRadius: 13,
                background: C.accentFill,
                color: "#fff",
                display: "grid",
                placeItems: "center",
              }}
            >
              <Icon name="pulse" size={24} />
            </span>
            <div>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, lineHeight: 1.2 }}>Dairy and chilled</h1>
              <span style={{ color: C.muted }}>Promotion workspace · Dana Ortiz, category manager</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                height: 36,
                padding: "0 12px",
                borderRadius: 10,
                background: C.sunk,
                fontSize: 13,
                color: C.muted,
              }}
            >
              <Icon name="cal" size={16} />
              <b style={{ color: C.ink }}>Sun Oct 18</b>
            </span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                height: 36,
                padding: "0 14px",
                borderRadius: 8,
                border: `1px solid ${C.field}`,
                color: C.accent,
                fontWeight: 700,
                fontSize: 13.5,
              }}
            >
              <Icon name="clock" size={16} />
              Simulate next day
            </span>
          </div>
        </div>
        <div style={{ display: "flex", gap: "12px 44px", paddingBottom: 12 }}>
          {[
            ["Needs you", "9 items"],
            ["Stores", "6 stores"],
            ["Brand playbooks", "3 signed, 1 to sign"],
            ["Data", "S/4HANA, CAR, UDF"],
            ["Last sync", "Oct 18, 7:05 am"],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <span style={{ fontSize: 13, color: C.muted }}>{k}</span>
              <b style={{ fontSize: 16, fontWeight: 400 }}>{v}</b>
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: "relative", display: "flex", gap: 2, padding: "0 12px", borderTop: `1px solid ${C.line}` }}>
        {TABS.map((t, i) => (
          <span
            key={t.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              height: 50,
              padding: "0 14px",
              fontSize: 14,
              color: i === activeIdx ? C.accent : C.ink,
              fontWeight: i === activeIdx ? 700 : 400,
            }}
          >
            <Icon name={t.icon} size={17} />
            {t.label}
            <Count n={t.count} hot />
          </span>
        ))}
        <span
          style={{
            position: "absolute",
            left: x,
            width: w,
            bottom: 0,
            height: 3,
            borderRadius: "3px 3px 0 0",
            background: C.accent,
          }}
        />
      </div>
    </section>
  );
};
