// Monitor tab: the live Chilled orange juice promotion, its stores, and the
// agent's recommendations. `t` is seconds since the start of the demo.
import React from "react";
import { interpolate } from "remotion";
import { enter, prog } from "./anim";
import { JUICE } from "./data";
import { Icon } from "./icons";
import { C } from "./theme";
import { BEATS } from "./timing";
import { Btn, Card, Row, Small, Tag } from "./ui";

const Chart: React.FC<{ t: number }> = ({ t }) => {
  const T0 = BEATS.track;
  const W = 560;
  const H = 220;
  const L = 44;
  const Rm = 12;
  const Tp = 16;
  const B = 30;
  const D = JUICE.days.length;
  const top = 200;
  const step = 50;
  const y = (v: number) => Tp + (H - Tp - B) * (1 - v / top);
  const cw = (W - L - Rm) / D;
  const bw = Math.min(34, cw * 0.5);
  const grid: React.ReactNode[] = [];
  for (let v = 0; v <= top; v += step) {
    grid.push(
      <g key={v}>
        <line x1={L} x2={W - Rm} y1={y(v)} y2={y(v)} stroke={C.line} />
        <text x={L - 8} y={y(v) + 4} textAnchor="end" fontSize={11} fill={C.muted}>
          {v}
        </text>
      </g>,
    );
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ display: "block", width: "100%", height: "auto" }}>
      {grid}
      {JUICE.days.map((d, i) => {
        const x = L + cw * i + cw / 2;
        const cur = i === 3;
        const p = prog(t, T0 + 0.9 + i * 0.12, 0.7);
        const tick = prog(t, T0 + 0.7 + i * 0.06, 0.4);
        return (
          <g key={i}>
            {d.a !== null ? (
              <rect
                x={x - bw / 2}
                y={y(d.a * p)}
                width={bw}
                height={Math.max(0, y(0) - y(d.a * p))}
                rx={4}
                fill={d.a >= d.f * 0.95 ? C.accentFill : C.critFill}
              />
            ) : (
              <rect
                x={x - bw / 2}
                y={y(d.f)}
                width={bw}
                height={y(0) - y(d.f)}
                rx={4}
                fill="none"
                stroke={C.field}
                strokeDasharray="3 3"
                opacity={tick}
              />
            )}
            <line
              x1={x - bw / 2 - 6}
              x2={x - bw / 2 - 6 + (bw + 12) * tick}
              y1={y(d.f)}
              y2={y(d.f)}
              stroke={C.tick}
              strokeWidth={3}
              strokeLinecap="round"
            />
            <text x={x} y={H - 10} textAnchor="middle" fontSize={11} fill={cur ? C.accent : C.muted} fontWeight={cur ? 700 : 400}>
              Day {i + 1}
            </text>
          </g>
        );
      })}
      <line x1={L} x2={W - Rm} y1={y(0)} y2={y(0)} stroke={C.muted} />
    </svg>
  );
};

const StoreRows: React.FC<{ t: number }> = ({ t }) => {
  const A0 = BEATS.act;
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {JUICE.stores.map((st, i) => {
        const r = st.a / st.f;
        const p = prog(t, BEATS.track + 1.4 + i * 0.1, 0.8);
        const flag = !st.set ? prog(t, A0 + 2.9, 0.5) : 0;
        return (
          <div
            key={st.n}
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0,1.2fr) minmax(0,1.6fr) 74px 70px",
              gap: 12,
              alignItems: "center",
              padding: "10px 8px",
              margin: "0 -8px",
              borderTop: i ? `1px solid ${C.line}` : "none",
              fontSize: 13,
              borderRadius: 8,
              background: `rgba(255,234,244,${flag})`,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "flex-start" }}>
              <b>{st.n}</b>
              {st.set ? <Tag tone="pos" small>Set up</Tag> : <Tag tone="neg" small>Not set up</Tag>}
            </div>
            <div style={{ position: "relative", height: 10, borderRadius: 5, background: C.track }}>
              <i
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  borderRadius: 5,
                  width: `${Math.min(100, (st.a / (st.f * 1.2)) * 100) * p}%`,
                  background: r >= 0.95 ? C.posFill : r >= 0.8 ? C.accentFill : C.critFill,
                }}
              />
              <span style={{ position: "absolute", top: -4, bottom: -4, width: 3, borderRadius: 2, background: C.tick, left: "83.33%" }} />
            </div>
            <span style={{ textAlign: "right", fontSize: 12.5, fontVariantNumeric: "tabular-nums" }}>
              {st.a} / {st.f}
            </span>
            <span style={{ textAlign: "right", fontSize: 12.5, color: st.left < 2 * 10 ? C.bad : C.muted }}>{st.left} left</span>
          </div>
        );
      })}
    </div>
  );
};

const Recs: React.FC<{ t: number }> = ({ t }) => {
  const A0 = BEATS.act;
  // Ring pulse draws the eye to the first action, then it is pressed.
  const ring = (t - (A0 + 0.6)) % 1.2;
  const ringP = t > A0 + 0.6 && t < A0 + 2.4 ? ring / 1.2 : 0;
  const press = interpolate(t, [A0 + 2.4, A0 + 2.5, A0 + 2.65], [1, 0.94, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const done = prog(t, A0 + 2.55, 0.25);
  return (
    <Card>
      <Row between>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
          <Icon name="sparkle" size={15} color={C.accent} />
          Agent recommendations
        </h3>
        <Tag tone="info">4</Tag>
      </Row>
      {JUICE.recs.map((r, i) => (
        <div
          key={i}
          style={{
            ...enter(t, BEATS.track + 1.3 + i * 0.15, 0.5, 18),
            display: "grid",
            gridTemplateColumns: "38px minmax(0,1fr)",
            gap: 12,
            padding: 12,
            borderRadius: 12,
            background: C.sunk,
            outline: i === 0 ? `2px solid rgba(0,112,242,${prog(t, A0 + 0.3, 0.4) * (1 - done * 0.6)})` : undefined,
          }}
        >
          <span style={{ width: 38, height: 38, borderRadius: 11, display: "grid", placeItems: "center", background: C.accentSoft, color: C.accent }}>
            <Icon name={r.icon} size={18} />
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", color: C.accent }}>{r.lever}</span>
            <p style={{ margin: 0, fontSize: 13 }}>{r.text}</p>
            <Row>
              <Btn
                primary
                size="small"
                style={
                  i === 0
                    ? {
                        transform: `scale(${press})`,
                        boxShadow: ringP ? `0 0 0 ${10 * ringP}px rgba(0,112,242,${0.45 * (1 - ringP)})` : undefined,
                        background: done > 0.5 ? C.posFill : C.accentFill,
                        borderColor: done > 0.5 ? C.posFill : C.accentFill,
                      }
                    : undefined
                }
              >
                {i === 0 && done > 0.5 ? (
                  <>
                    <Icon name="check" size={14} />
                    Nudged
                  </>
                ) : (
                  r.act
                )}
              </Btn>
              <Btn ghost size="small">
                Dismiss
              </Btn>
            </Row>
          </div>
        </div>
      ))}
    </Card>
  );
};

export const MonitorView: React.FC<{ t: number }> = ({ t }) => {
  const T0 = BEATS.track;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.6fr) minmax(0,1fr)", gap: 16, alignItems: "start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
        <Card style={enter(t, T0 + 0.25, 0.5, 20)}>
          <Row between style={{ alignItems: "flex-start" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>{JUICE.title}</h3>
              <small style={{ fontSize: 12.5, color: C.muted }}>{JUICE.sub}</small>
            </div>
            <Btn size="small">
              <Icon name="send" size={14} />
              Track every step
            </Btn>
          </Row>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 10 }}>
            {JUICE.stats.map((s, i) => (
              <div
                key={s.label}
                style={{
                  ...enter(t, T0 + 0.45 + i * 0.1, 0.45, 10),
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  padding: "10px 12px",
                  borderRadius: 12,
                  background: C.sunk,
                }}
              >
                <span style={{ fontSize: 12, color: C.muted }}>{s.label}</span>
                <b style={{ fontSize: 24, fontWeight: 300, lineHeight: 1.15, color: s.tone === "neg" ? C.bad : s.tone === "crit" ? C.warn : C.ink }}>{s.value}</b>
                <small style={{ fontSize: 11.5, color: C.muted }}>{s.small}</small>
              </div>
            ))}
          </div>
          <Chart t={t} />
          <div style={{ display: "flex", gap: 14, fontSize: 12, color: C.muted, alignItems: "center" }}>
            {[
              [C.accentFill, "On forecast"],
              [C.critFill, "Below forecast"],
            ].map(([c, l]) => (
              <span key={l} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <i style={{ width: 10, height: 10, borderRadius: 3, background: c, display: "inline-block" }} />
                {l}
              </span>
            ))}
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <i style={{ width: 16, height: 3, borderRadius: 2, background: C.tick, display: "inline-block" }} />
              Forecast
            </span>
          </div>
        </Card>
        <Card style={enter(t, T0 + 0.5, 0.5, 20)}>
          <div>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>Stores</h3>
            <small style={{ fontSize: 12.5, color: C.muted }}>Sold against forecast to date · line marks 100%</small>
          </div>
          <StoreRows t={t} />
        </Card>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 0, ...enter(t, T0 + 0.4, 0.5, 20) }}>
        <Recs t={t} />
        <Card>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>Locked while live</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {["Advertised price, 2 for $7.00 until the end date", "Sunvale Juice funding terms", "Printed flyer and shelf signage"].map((x) => (
              <div key={x} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13, color: C.muted }}>
                <Icon name="lock" size={15} />
                {x}
              </div>
            ))}
          </div>
          <Small muted>The agent only moves levers that can still change.</Small>
        </Card>
      </div>
    </div>
  );
};
