// Execute tab: the same yogurt deal, now live — stage flow, store readiness,
// the next task, and the deal's step-by-step record (concept UI).
import React from "react";
import { p } from "../lib";
import { P, UI } from "../theme";
import { BEAT } from "../timeline";
import { DEAL, RECORD, STAGES, STORES } from "./data";
import { Alert, Card, Check, Tag } from "./ui";

export const EXEC_RECTS = {
  flow: { x: 32, y: 20, w: 760, h: 250 },
  stores: { x: 32, y: 286, w: 760, h: 486 },
  record: { x: 808, y: 20, w: 760, h: 752 },
};

const KIND: Record<string, string> = {
  detect: P.negFill,
  decide: P.muted,
  approve: P.posFill,
  launch: P.ink,
  store: P.cpg,
};

export const ExecutePage: React.FC<{ T: number; focus: string | null }> = ({ T, focus }) => {
  const dim = (k: string) => (focus && focus !== k ? 0.3 : 1);
  const E = BEAT.execute;
  const R = BEAT.record;
  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: UI, color: P.ink }}>
      {/* deal header + stage flow */}
      <Card style={{ position: "absolute", left: 32, top: 20, width: 760, height: 250, opacity: dim("flow") }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{DEAL.product}</div>
          <Tag tone="pos">
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: P.good, display: "inline-block" }} /> Live in PMR + OPP
          </Tag>
        </div>
        <div style={{ fontSize: 16, color: P.muted, marginTop: -6 }}>{DEAL.terms}</div>
        <div style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(6,1fr)", marginTop: 10 }}>
          {STAGES.map((s, i) => {
            const done = p(T, E + 0.15 + i * 0.18, 0.3);
            const state = i < 3 ? "done" : i === 3 ? "now" : "todo";
            const fill = state === "done" ? P.posFill : state === "now" ? P.accentFill : P.surface;
            return (
              <div key={s.l} style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, textAlign: "center" }}>
                {i > 0 ? (
                  <span style={{ position: "absolute", top: 19, right: "50%", width: "100%", height: 3, background: P.track }}>
                    <i style={{ display: "block", height: "100%", width: `${(i <= 3 ? done : 0) * 100}%`, background: P.posFill }} />
                  </span>
                ) : null}
                <span
                  style={{
                    position: "relative",
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    background: state === "todo" ? P.surface : done > 0.5 ? fill : P.surface,
                    border: `2px solid ${state === "todo" || done <= 0.5 ? P.field : fill}`,
                    color: "#fff",
                    boxShadow: state === "now" && done > 0.5 ? `0 0 0 ${6 + 4 * Math.sin(T * 5)}px rgba(0,112,242,.18)` : undefined,
                  }}
                >
                  {state === "done" && done > 0.5 ? <Check size={18} color="#fff" /> : null}
                  {state === "now" && done > 0.5 ? <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#fff" }} /> : null}
                </span>
                <b style={{ fontSize: 15 }}>{s.l}</b>
                <span style={{ fontSize: 13, color: P.muted }}>{s.sub}</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* store readiness + next task */}
      <Card style={{ position: "absolute", left: 32, top: 286, width: 760, height: 486, opacity: dim("stores") }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <b style={{ fontSize: 19 }}>Store readiness</b>
          <span style={{ fontSize: 15, color: P.muted }}>Set-up confirmed in the store app</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {STORES.map((s, i) => {
            const c = p(T, E + 0.6 + i * 0.12, 0.3);
            const ok = s.set;
            return (
              <div
                key={s.n}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  height: 64,
                  padding: "0 16px",
                  borderRadius: 12,
                  background: ok ? P.sunk : P.warnSoft,
                  border: `1px solid ${ok ? "transparent" : "#FFD37A"}`,
                }}
              >
                <span
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    background: ok ? (c > 0.5 ? P.posFill : P.track) : P.critFill,
                    transform: `scale(${0.7 + 0.3 * c})`,
                  }}
                >
                  {ok ? <Check size={16} color="#fff" /> : <Alert size={16} color="#fff" />}
                </span>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <b style={{ fontSize: 17 }}>{s.n}</b>
                  <span style={{ fontSize: 14, color: ok ? P.muted : P.warn }}>{ok ? "Set up · shelf photo" : "Awaiting set-up"}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            borderRadius: 12,
            padding: "14px 16px",
            background: P.accentSoft,
            border: `1px solid ${P.infoLine}`,
            opacity: p(T, E + 1.4, 0.4),
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: ".06em", color: P.accent }}>NEXT</span>
          <span style={{ fontSize: 17 }}>Riverside hasn’t confirmed set-up. Flagged for follow-up.</span>
        </div>
      </Card>

      {/* the deal's record: every step and the system that recorded it */}
      <Card style={{ position: "absolute", left: 808, top: 20, width: 760, height: 752, opacity: dim("record") }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <span style={{ fontSize: 14, color: P.muted, fontWeight: 600 }}>Live tracker</span>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{DEAL.product}</div>
            <span style={{ fontSize: 15, color: P.muted }}>{DEAL.offer} · {DEAL.brand}</span>
          </div>
          <Tag tone="info">Every step, one record</Tag>
        </div>
        <div style={{ borderTop: `1px solid ${P.line}`, paddingTop: 8, display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: P.muted, padding: "6px 0" }}>Sun Oct 18</span>
          {RECORD.map((e, i) => {
            const a = p(T, R + 0.1 + i * 0.32, 0.35);
            return (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "72px 14px 1fr",
                  gap: 12,
                  alignItems: "start",
                  padding: "10px 6px",
                  opacity: Math.max(0.0, a),
                  transform: `translateY(${(1 - a) * 10}px)`,
                  borderRadius: 8,
                  background: a > 0 && a < 1 ? `rgba(225,244,255,${1 - a})` : undefined,
                }}
              >
                <span style={{ fontSize: 14, color: P.muted, textAlign: "right", paddingTop: 2 }}>{e.time}</span>
                <span style={{ width: 13, height: 13, borderRadius: "50%", marginTop: 5, background: KIND[e.kind] }} />
                <span style={{ fontSize: 16, lineHeight: 1.35 }}>
                  {e.text}
                  <span style={{ marginLeft: 8, fontSize: 13, fontWeight: 600, color: P.muted, background: P.sunk, borderRadius: 6, padding: "1px 7px", whiteSpace: "nowrap" }}>{e.sys}</span>
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
