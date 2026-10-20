// Suggest tab: today's triggers and the Greek yogurt recommendation.
// Laid out on an absolute 1600×792 page so the camera and the hero
// transition can target exact rects (see RECTS).
import React from "react";
import { int, money, p } from "../lib";
import { P, UI } from "../theme";
import { BEAT } from "../timeline";
import { CHECKS, DEAL, ECON, OPTIONS, STORES, TRIGGERS } from "./data";
import { Alert, Bar, Btn, Card, Check, Kv, StepH, Tag } from "./ui";

/** Page-space rects used by the camera and the hero transition. */
export const RECTS = {
  trigger: { x: 32, y: 60, w: 440, h: 236 },
  header: { x: 496, y: 20, w: 1072, h: 230 },
  options: { x: 516, y: 290, w: 1032, h: 132 },
  econ: { x: 516, y: 470, w: 1032, h: 108 },
  stores: { x: 516, y: 592, w: 1032, h: 50 },
  send: { x: 516, y: 656, w: 1032, h: 100 },
};

const Spark: React.FC<{ id: string; draw: number }> = ({ id, draw }) => {
  const base = id === "yog" ? 88 : id === "oat" ? 53 : 37;
  const pts = Array.from({ length: 21 }, (_, i) => {
    let a = base * (0.95 + ((i * 13) % 9) / 100);
    if (id === "yog") a = base * (1 - 0.31 * Math.min(1, (i + 4) / 8)) * (0.95 + ((i * 7) % 9) / 100);
    if (id === "ched" && i >= 7) a = base * (1 - 0.35 * Math.min(1, (i - 6) / 5)) * (0.95 + ((i * 5) % 9) / 100);
    return { plan: base, a };
  });
  const W = 400;
  const H = 44;
  const max = base * 1.12;
  const x = (i: number) => (i / 20) * W;
  const y = (v: number) => H - 2 - ((H - 6) * v) / max;
  const path = (k: "plan" | "a") => pts.map((q, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(q[k]).toFixed(1)}`).join("");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: "block", width: "100%", height: H }}>
      <defs>
        <clipPath id={`sp-${id}`}>
          <rect width={W * draw} height={H} />
        </clipPath>
      </defs>
      <g clipPath={`url(#sp-${id})`}>
        <path d={`${path("a")}L${W},${H}L0,${H}Z`} fill={P.accentSoft} />
        <path d={path("plan")} fill="none" stroke={P.muted} strokeWidth={1.4} strokeDasharray="4 3" vectorEffect="non-scaling-stroke" />
        <path d={path("a")} fill="none" stroke={P.accentFill} strokeWidth={2.2} vectorEffect="non-scaling-stroke" />
      </g>
    </svg>
  );
};

export const SuggestPage: React.FC<{ T: number; focus: string | null }> = ({ T, focus }) => {
  // dim everything that is not the current focus
  const dim = (key: string) => (focus && focus !== key ? 0.28 : 1);
  const rec = p(T, BEAT.suggest + 0.8, 0.4);
  const econ = p(T, 23.3, 1.2);
  const checks = (i: number) => p(T, BEAT.approve + 0.45 + i * 0.2, 0.25);
  const sent = p(T, BEAT.approve + 1.3, 0.25);
  const flag = p(T, BEAT.suggest, 0.35);

  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: UI, color: P.ink }}>
      <div style={{ position: "absolute", left: 36, top: 22, display: "flex", gap: 12, alignItems: "baseline", opacity: dim("trigger") }}>
        <b style={{ fontSize: 19 }}>Today’s triggers</b>
        <span style={{ fontSize: 15, color: P.muted }}>3 need a decision</span>
      </div>
      {TRIGGERS.map((tr, i) => {
        const r = i === 0 ? RECTS.trigger : { x: 32, y: 312 + (i - 1) * 212, w: 440, h: 196 };
        const sel = i === 0;
        return (
          <Card
            key={tr.id}
            style={{
              position: "absolute",
              left: r.x,
              top: r.y,
              width: r.w,
              height: r.h,
              opacity: sel ? dim("trigger") : focus ? 0.28 : 1,
              borderColor: sel ? `rgba(0,100,217,${0.25 + 0.75 * flag})` : "transparent",
              boxShadow: sel ? `0 0 0 ${6 * flag}px rgba(0,112,242,${0.12 * flag}), ${P.shadow2}` : P.shadow,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Tag tone={tr.tone}>{tr.kind}</Tag>
              <span style={{ fontSize: 15, fontWeight: 700, color: tr.days <= 10 ? P.bad : P.muted }}>{tr.days} days left</span>
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{tr.product}</div>
              <div style={{ fontSize: 15, color: P.muted }}>{tr.brand}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <span>
                <span style={{ fontSize: 30, fontWeight: 300, fontVariantNumeric: "tabular-nums" }}>{tr.atRisk}</span>{" "}
                <span style={{ fontSize: 15, color: P.muted }}>units at risk</span>
              </span>
              <span style={{ fontSize: 15, color: tr.tone === "crit" ? P.warn : P.bad }}>{tr.signal}</span>
            </div>
            {sel ? <Spark id={tr.id} draw={1} /> : null}
          </Card>
        );
      })}

      <Card style={{ position: "absolute", left: 496, top: 20, width: 1072, height: 752, padding: 0, display: "block" }}>
        {/* header: product + inventory context + signal */}
        <div style={{ position: "absolute", left: 20, top: 18, right: 20, opacity: dim("header") }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Tag tone="neg">Near expiry</Tag>
            <span style={{ fontSize: 15, color: P.muted }}>{DEAL.brand}</span>
            <span style={{ marginLeft: "auto", fontSize: 14, color: P.muted }}>Data: S/4HANA · CAR · UDF</span>
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, marginTop: 10 }}>{DEAL.product}</div>
          <div style={{ display: "flex", gap: 44, marginTop: 12 }}>
            <Kv k="Stock" v={DEAL.stock} />
            <Kv k="At risk" v={`${DEAL.atRisk} units`} color={P.bad} />
            <Kv k="Best-before" v={DEAL.bestBefore} />
            <Kv k="Signal" v={DEAL.signal} />
          </div>
          <div
            style={{
              marginTop: 16,
              display: "flex",
              gap: 10,
              alignItems: "center",
              border: `1px solid ${P.infoLine}`,
              background: P.accentSoft,
              borderRadius: 10,
              padding: "9px 14px",
              fontSize: 15,
            }}
          >
            <b>Cause: {DEAL.cause}.</b> The Brightfield Dairy playbook sets the brand’s share at 50% for this cause.
          </div>
        </div>

        {/* step 1: recommended promotion */}
        <div style={{ position: "absolute", left: 20, right: 20, top: 242, opacity: dim("options") }}>
          <StepH n={1} title="Pick a promotion" />
        </div>
        <div style={{ position: "absolute", left: 20, top: 270, width: 1032, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, opacity: dim("options") }}>
          {OPTIONS.map((o) => {
            const s = o.rec ? rec : 0;
            return (
              <div
                key={o.label}
                style={{
                  height: 132,
                  borderRadius: 12,
                  border: `${1 + s}px solid ${s > 0.05 ? P.accent : P.line}`,
                  background: o.rec ? `rgba(225,244,255,${s})` : P.surface,
                  padding: 14 - s,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  opacity: o.rec ? 1 : 1 - 0.45 * rec,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <b style={{ fontSize: 17 }}>{o.label}</b>
                  {o.rec ? <Tag tone="pos" style={{ opacity: s, fontSize: 12 }}>Recommended</Tag> : null}
                </div>
                {[
                  ["Retailer", money(o.retailer)],
                  ["Brightfield", money(o.brand)],
                  ["Saved", `${o.saved} units`],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 15 }}>
                    <span style={{ color: P.muted }}>{k}</span>
                    <b style={{ color: v.startsWith("−") ? P.bad : P.ink, fontVariantNumeric: "tabular-nums" }}>{v}</b>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* step 2: economics for both sides */}
        <div style={{ position: "absolute", left: 20, right: 20, top: 420, opacity: dim("econ") }}>
          <StepH n={2} title="Economics" />
        </div>
        <div style={{ position: "absolute", left: 20, top: 450, width: 1032, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, opacity: dim("econ") }}>
          {[
            { bg: P.accentSoft, k: "Retailer, vs no promotion", v: money(ECON.retailer * econ), s: `${int(ECON.unitsSold * econ)} units sold` },
            { bg: P.cpgSoft, k: "Brightfield Dairy", v: money(ECON.brand * econ), s: `${money(ECON.funding * econ)} funding` },
            { bg: P.goodSoft, k: "Waste avoided", v: `${int(ECON.saved * econ)} units`, s: `of ${ECON.wouldExpire} that would expire` },
          ].map((x) => (
            <div key={x.k} style={{ height: 108, borderRadius: 12, background: x.bg, padding: "12px 16px", display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontSize: 15, color: P.muted }}>{x.k}</span>
              <span style={{ fontSize: 34, fontWeight: 300, lineHeight: 1.1, fontVariantNumeric: "tabular-nums" }}>{x.v}</span>
              <span style={{ fontSize: 14, color: P.muted }}>{x.s}</span>
            </div>
          ))}
        </div>

        {/* store readiness */}
        <div style={{ position: "absolute", left: 20, top: 576, width: 1032, display: "flex", alignItems: "center", gap: 8, opacity: dim("stores") }}>
          <span style={{ fontSize: 15, color: P.muted, fontWeight: 600, marginRight: 6 }}>Store readiness</span>
          {STORES.map((s) => {
            const ok = s.n !== "Riverside" && s.n !== "Maple Grove";
            return (
              <span
                key={s.n}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  height: 36,
                  padding: "0 12px",
                  borderRadius: 18,
                  border: `1px solid ${P.field}`,
                  fontSize: 15,
                  fontWeight: 600,
                }}
              >
                {ok ? <Check size={15} color={P.good} /> : <Alert size={15} color={P.warn} />}
                {s.n}
              </span>
            );
          })}
        </div>

        {/* step 3: check and send */}
        <div style={{ position: "absolute", left: 20, right: 20, top: 640, borderTop: `1px solid ${P.line}`, paddingTop: 14, opacity: dim("send") }}>
          <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <StepH n={3} title="Check and send" />
                <Tag tone="pos" style={{ opacity: p(T, BEAT.approve + 1.1, 0.3) }}>
                  <Check size={14} /> Inside the {DEAL.playbook}
                </Tag>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 20px", marginTop: 12, fontSize: 15 }}>
                {CHECKS.map((c, i) => (
                  <div key={c} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 20, height: 20, borderRadius: "50%", background: checks(i) > 0 ? P.posFill : P.track, display: "grid", placeItems: "center", transform: `scale(${0.7 + 0.3 * checks(i)})` }}>
                      <span style={{ opacity: checks(i) }}>
                        <Check size={12} color="#fff" />
                      </span>
                    </span>
                    {c}
                  </div>
                ))}
              </div>
            </div>
            <Btn
              primary
              style={{
                marginTop: 18,
                background: sent > 0.5 ? P.posFill : P.accentFill,
                borderColor: sent > 0.5 ? P.posFill : P.accentFill,
                transform: `scale(${1 - 0.05 * Math.sin(Math.PI * Math.min(1, Math.max(0, (T - (BEAT.approve + 1.2)) / 0.2)))})`,
              }}
            >
              {sent > 0.5 ? <Check size={18} color="#fff" /> : null}
              {sent > 0.5 ? "Auto-approved" : "Send and auto-approve"}
            </Btn>
          </div>
        </div>
      </Card>
    </div>
  );
};
