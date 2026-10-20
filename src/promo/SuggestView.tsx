// Suggest tab: KPI cards, today's triggers and the Greek yogurt recommendation.
// `t` is seconds since the start of the demo; beats come from timing.ts.
import React from "react";
import { interpolate } from "remotion";
import { enter, int, money, prog } from "./anim";
import { TOTAL_AT_RISK, TRIGGERS, YOGURT, KPI } from "./data";
import { Icon } from "./icons";
import { C } from "./theme";
import { BEATS } from "./timing";
import { Bar, Btn, Card, Num, Row, Small, Tag } from "./ui";

const H3: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, lineHeight: 1.3, ...style }}>{children}</h3>
);
const Sub: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <small style={{ display: "block", fontSize: 12.5, color: C.muted, marginTop: 1 }}>{children}</small>
);
const Big: React.FC<{ children: React.ReactNode; unit?: string; color?: string }> = ({ children, unit, color }) => (
  <div style={{ fontSize: 36, fontWeight: 300, lineHeight: 1.05, fontVariantNumeric: "tabular-nums", color }}>
    {children}
    {unit ? <span style={{ fontSize: 14, fontWeight: 400, color: C.muted, marginLeft: 5 }}>{unit}</span> : null}
  </div>
);

// ── KPI row (shared by every tab) ──────────────────────────────
export const KpiRow: React.FC<{ t: number }> = ({ t }) => {
  const risk = TOTAL_AT_RISK * prog(t, 0.3, 1.3);
  const bars = prog(t, 0.4, 1.1);
  return (
    <section style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 16 }}>
      <Card style={enter(t, 0.05)}>
        <Row between style={{ alignItems: "flex-start" }}>
          <div>
            <H3>At-risk units</H3>
            <Sub>Open triggers</Sub>
          </div>
          <Tag tone="neg">3 open</Tag>
        </Row>
        <Big unit="units">{int(risk)}</Big>
        <Bar p={bars} segs={TRIGGERS.map((x) => ({ w: (x.atRisk / TOTAL_AT_RISK) * 100, color: x.color }))} />
        <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12.5 }}>
          {TRIGGERS.map((x) => (
            <Row key={x.id} between>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <i style={{ width: 10, height: 10, borderRadius: 3, background: x.color, display: "inline-block" }} />
                {x.product.replace(/\s[\d.]+\s?(g|L)$/, "")}
              </span>
              <Num style={{ fontWeight: 700 }}>{x.atRisk}</Num>
            </Row>
          ))}
        </div>
      </Card>
      <Card style={enter(t, 0.13)}>
        <div>
          <H3>Promotions</H3>
          <Sub>Live now</Sub>
        </div>
        <Big unit="live">{KPI.live}</Big>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12.5 }}>
          <Row between>
            <span>{KPI.liveName}</span>
            <span style={{ color: C.muted }}>{KPI.liveDay}</span>
          </Row>
          <Bar h={6} p={bars} segs={[{ w: (4 / 7) * 100, color: C.accentFill }]} />
        </div>
      </Card>
      <Card style={enter(t, 0.21)}>
        <div>
          <H3>Waste avoided</H3>
          <Sub>Near-expiry promotions, to date</Sub>
        </div>
        <Big unit="units">0</Big>
        <Bar segs={[{ w: 0, color: C.posFill }]} />
        <Small muted>Counts once a near-expiry promotion is live</Small>
      </Card>
      <Card style={enter(t, 0.29)}>
        <div>
          <H3>Profit vs plan</H3>
          <Sub>Live promotions, to date</Sub>
        </div>
        <Big color={C.bad}>
          {KPI.profitVs}
          <span style={{ fontSize: 15, fontWeight: 700, marginLeft: 6 }}>▼</span>
        </Big>
        <div style={{ display: "flex", gap: "6px 20px", fontSize: 12.5 }}>
          {[
            ["Actual", KPI.actual, C.ink],
            ["Plan", KPI.plan, C.ink],
            ["Gap", KPI.gap, C.bad],
          ].map(([k, v, col]) => (
            <div key={k} style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ color: C.muted }}>{k}</span>
              <b style={{ fontSize: 14, fontWeight: 600, color: col }}>{v}</b>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
};

// ── Trigger cards ──────────────────────────────────────────────
const BASES: Record<string, number> = { yog: 88, oat: 53, ched: 37 };
const series = (id: string) => {
  const base = BASES[id];
  const pts: { plan: number; a: number }[] = [];
  for (let i = 0; i < 21; i++) {
    let a = base * (0.95 + ((i * 13) % 9) / 100);
    if (id === "yog") a = base * (1 - 0.31 * Math.min(1, (i + 4) / 8)) * (0.95 + ((i * 7) % 9) / 100);
    if (id === "ched" && i >= 7) a = base * (1 - 0.35 * Math.min(1, (i - 6) / 5)) * (0.95 + ((i * 5) % 9) / 100);
    pts.push({ plan: base, a });
  }
  return pts;
};

const Spark: React.FC<{ id: string; p: number }> = ({ id, p }) => {
  const pts = series(id);
  const W = 240;
  const H = 46;
  const max = Math.max(...pts.map((q) => Math.max(q.plan, q.a))) * 1.12;
  const x = (i: number) => (i / (pts.length - 1)) * W;
  const y = (v: number) => H - 2 - ((H - 6) * v) / max;
  const path = (k: "plan" | "a") => pts.map((q, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(q[k]).toFixed(1)}`).join("");
  const a = path("a");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 46 }}>
      <defs>
        <clipPath id={`clip-${id}`}>
          <rect x={0} y={0} width={W * p} height={H} />
        </clipPath>
      </defs>
      <g clipPath={`url(#clip-${id})`}>
        <path d={`${a}L${W},${H}L0,${H}Z`} fill={C.accentSoft} />
        <path d={path("plan")} fill="none" stroke={C.muted} strokeWidth={1.3} strokeDasharray="4 3" vectorEffect="non-scaling-stroke" />
        <path d={a} fill="none" stroke={C.accentFill} strokeWidth={2} vectorEffect="non-scaling-stroke" />
      </g>
    </svg>
  );
};

const TriggerCard: React.FC<{ trig: (typeof TRIGGERS)[number]; t: number; i: number; selected: number }> = ({ trig, t, i, selected }) => {
  const start = 0.7 + i * 0.15;
  const press = trig.id === "yog" ? interpolate(t, [1.75, 1.85, 2.0], [1, 0.975, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
  const e = enter(t, start, 0.55, 24);
  return (
    <Card
      style={{
        ...e,
        transform: `${e.transform} scale(${press})`,
        borderColor: trig.id === "yog" ? `rgba(0,100,217,${selected})` : "transparent",
        boxShadow:
          trig.id === "yog" && selected > 0
            ? `0 0 4px rgba(34,53,72,${0.14 + 0.02 * selected}),0 ${2 + 6 * selected}px ${4 + 12 * selected}px rgba(34,53,72,.16)`
            : undefined,
      }}
    >
      <Row between>
        <Tag tone={trig.tone}>{trig.kind}</Tag>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 700, color: trig.daysLeft <= 10 ? C.bad : C.muted }}>
          <Icon name="clock" size={14} />
          {trig.daysLeft} days left
        </span>
      </Row>
      <div>
        <H3>{trig.product}</H3>
        <Small muted>{trig.brand}</Small>
      </div>
      <Row between style={{ alignItems: "flex-end" }}>
        <div>
          <Num style={{ fontSize: 24, fontWeight: 300, lineHeight: 1.1 }}>{int(trig.atRisk * prog(t, start + 0.1, 1))}</Num>{" "}
          <Small muted>units at risk</Small>
        </div>
        <Small style={{ color: trig.signalTone === "neg" ? C.bad : C.warn }}>{trig.signal}</Small>
      </Row>
      <Spark id={trig.id} p={prog(t, start + 0.15, 1.2)} />
    </Card>
  );
};

// ── Recommendation detail ──────────────────────────────────────
const Step: React.FC<{ n: number; title: string; style?: React.CSSProperties; children: React.ReactNode }> = ({ n, title, style, children }) => (
  <section style={{ display: "flex", flexDirection: "column", gap: 12, paddingTop: 16, borderTop: `1px solid ${C.line}`, ...style }}>
    <h3 style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15, margin: 0 }}>
      <span
        style={{
          width: 24,
          height: 24,
          borderRadius: "50%",
          background: C.accentFill,
          color: "#fff",
          fontSize: 12.5,
          fontWeight: 700,
          display: "grid",
          placeItems: "center",
        }}
      >
        {n}
      </span>
      {title}
    </h3>
    {children}
  </section>
);

const Tune: React.FC<{ label: string; value: string; pos: number; band: [number, number]; mark: number; note: string }> = ({
  label,
  value,
  pos,
  band,
  mark,
  note,
}) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: 13 }}>
      <span style={{ color: C.muted }}>{label}</span>
      <b style={{ fontSize: 16 }}>{value}</b>
    </div>
    <div style={{ position: "relative", height: 28 }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 12, height: 4, borderRadius: 2, background: C.track }} />
      <div style={{ position: "absolute", left: 0, width: `${pos}%`, top: 12, height: 4, borderRadius: 2, background: C.accentFill }} />
      <div
        style={{
          position: "absolute",
          left: `${pos}%`,
          top: 6,
          width: 16,
          height: 16,
          marginLeft: -8,
          borderRadius: "50%",
          background: C.accentFill,
          border: "2px solid #fff",
          boxShadow: "0 0 0 1px rgba(0,0,0,.08)",
        }}
      />
    </div>
    <div style={{ position: "relative", height: 6, borderRadius: 3, background: C.track }}>
      <span style={{ position: "absolute", top: 0, bottom: 0, borderRadius: 3, background: C.cpg, left: `${band[0]}%`, width: `${band[1]}%` }} />
      <i style={{ position: "absolute", top: -3, width: 3, height: 12, borderRadius: 2, background: C.ink, left: `${mark}%`, transform: "translateX(-50%)" }} />
    </div>
    <Small muted>{note}</Small>
  </div>
);

const Detail: React.FC<{ t: number }> = ({ t }) => {
  const R0 = BEATS.recommend;
  const A0 = BEATS.approve;
  const recSel = prog(t, R0 + 0.9, 0.35);
  const out = prog(t, R0 + 1.3, 1.3);
  const o = YOGURT.outcome;
  const press = interpolate(t, [A0 + 2.7, A0 + 2.8, A0 + 2.95], [1, 0.96, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sent = prog(t, A0 + 2.85, 0.2);

  return (
    <Card style={{ gap: 16, padding: 20, ...enter(t, 2.2, 0.6, 24) }}>
      <Row between>
        <Row>
          <Tag tone="neg">Near expiry</Tag>
          <Small muted>Brightfield Dairy</Small>
        </Row>
        <Btn ghost size="small">
          <Icon name="sparkle" size={14} />
          Why is this happening?
        </Btn>
      </Row>
      <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, lineHeight: 1.2 }}>Greek yogurt 500 g</h2>
      <div style={{ display: "flex", gap: "10px 32px" }}>
        {[
          ["Stock", `${int(YOGURT.stock)} units`, C.ink],
          ["At risk", `${YOGURT.atRisk} units`, C.bad],
          ["Best-before", YOGURT.bestBefore, C.ink],
          ["Signal", YOGURT.signal, C.ink],
        ].map(([k, v, col]) => (
          <div key={k} style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <span style={{ fontSize: 13, color: C.muted }}>{k}</span>
            <b style={{ fontSize: 15, fontWeight: 600, color: col }}>{v}</b>
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "flex-start",
          borderRadius: 10,
          padding: "10px 12px",
          fontSize: 13,
          border: `1px solid ${C.infoLine}`,
          background: C.accentSoft,
        }}
      >
        <Icon name="info" size={18} color={C.accent} style={{ marginTop: 1 }} />
        <span>
          <b>Cause: {YOGURT.cause}.</b> The Brightfield Dairy playbook sets the brand’s share at 50% for this cause, so the slider starts there.
        </span>
      </div>

      <Step n={1} title="Pick a promotion">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 10 }}>
          {YOGURT.options.map((op, i) => {
            const sel = op.rec ? recSel : 0;
            return (
              <div
                key={op.label}
                style={{
                  ...enter(t, R0 + 0.1 + i * 0.12, 0.45, 14),
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  padding: 12 - sel,
                  borderRadius: 12,
                  border: `${1 + sel}px solid ${sel > 0 ? C.accent : C.line}`,
                  background: sel > 0 ? `rgba(225,244,255,${sel})` : C.surface,
                }}
              >
                <span style={{ display: "flex", justifyContent: "space-between", gap: 6, alignItems: "flex-start", fontSize: 14 }}>
                  <b>{op.label}</b>
                  {op.rec ? (
                    <Tag tone="pos" small style={{ opacity: recSel, transform: `scale(${0.8 + 0.2 * recSel})` }}>
                      Recommended
                    </Tag>
                  ) : null}
                </span>
                {[
                  ["Retailer", money(op.retailer), op.retailer < 0],
                  ["Brightfield", money(op.brand), op.brand < 0],
                  ["Saved", `${op.saved} units`, false],
                ].map(([k, v, neg]) => (
                  <span key={k as string} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5 }}>
                    <span style={{ color: C.muted }}>{k}</span>
                    <Num style={{ fontWeight: 700, color: neg ? C.bad : C.ink }}>{v}</Num>
                  </span>
                ))}
                <Bar h={6} p={prog(t, R0 + 0.3 + i * 0.12, 0.8)} segs={[{ w: (op.saved / 388) * 100, color: C.posFill }]} />
              </div>
            );
          })}
        </div>
      </Step>

      <Step n={2} title="Tune it">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 20 }}>
          <Tune label="Duration" value="5 days" pos={(2 / 7) * 100} band={[0, (4 / 7) * 100]} mark={(2 / 7) * 100} note="Playbook allows up to 7 days" />
          <Tune label="Brand funds" value="50%" pos={50} band={[40, 20]} mark={50} note="Playbook allows 40%–60%" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 10 }}>
          {[
            { bg: C.accentSoft, k: "Retailer, vs no promotion", v: money(o.retailer * out), s: `${int(o.unitsSold * out)} units sold` },
            { bg: C.cpgSoft, k: "Brightfield Dairy", v: money(o.brand * out), s: `${money(o.funding * out)} funding` },
          ].map((x) => (
            <div key={x.k} style={{ borderRadius: 12, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 3, background: x.bg }}>
              <span style={{ fontSize: 12.5, color: C.muted }}>{x.k}</span>
              <Num style={{ fontSize: 24, fontWeight: 300, lineHeight: 1.15 }}>{x.v}</Num>
              <small style={{ fontSize: 12, color: C.muted }}>{x.s}</small>
            </div>
          ))}
          <div style={{ borderRadius: 12, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 3, background: C.goodSoft }}>
            <span style={{ fontSize: 12.5, color: C.muted }}>Waste avoided</span>
            <Num style={{ fontSize: 24, fontWeight: 300, lineHeight: 1.15 }}>
              {int(o.saved * out)} <small style={{ fontSize: 12, color: C.muted }}>units</small>
            </Num>
            <Bar h={6} p={out} segs={[{ w: (o.saved / o.wouldExpire) * 100, color: C.posFill }]} />
            <small style={{ fontSize: 12, color: C.muted }}>of {o.wouldExpire} that would expire</small>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ fontSize: 12.5, color: C.muted, fontWeight: 600 }}>Stores · 6 of 6 included, tap to leave one out</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {YOGURT.stores.map((s, i) => {
              const p = prog(t, A0 + 0.15 + i * 0.09, 0.35);
              return (
                <span
                  key={s.n}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    minHeight: 32,
                    padding: "0 11px",
                    borderRadius: 16,
                    border: `1px solid ${C.field}`,
                    background: C.surface,
                    fontSize: 12.5,
                    fontWeight: 600,
                  }}
                >
                  <span style={{ opacity: p, transform: `scale(${0.4 + 0.6 * p})` }}>
                    <Icon name={s.ok ? "check" : "alert"} size={14} color={s.ok ? C.good : C.warn} />
                  </span>
                  {s.n}
                </span>
              );
            })}
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: C.muted, display: "flex", flexDirection: "column", gap: 2 }}>
            {YOGURT.stores
              .filter((s) => !s.ok)
              .map((s, i) => (
                <li key={s.n} style={{ opacity: prog(t, A0 + 0.8 + i * 0.15, 0.35) }}>
                  <b>{s.n}:</b> {s.note}
                </li>
              ))}
          </ul>
        </div>
      </Step>

      <Step n={3} title="Check and send">
        <div style={{ opacity: prog(t, A0 + 2.2, 0.3), transform: `scale(${0.92 + 0.08 * prog(t, A0 + 2.2, 0.3)})`, transformOrigin: "left center" }}>
          <Tag tone="pos">
            <Icon name="check" size={14} />
            Inside the {YOGURT.playbook}
          </Tag>
        </div>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: "8px 18px", fontSize: 13 }}>
          {YOGURT.checks.map((c, i) => {
            const p = prog(t, A0 + 1.1 + i * 0.25, 0.3);
            return (
              <li key={c} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    background: p > 0 ? C.posFill : C.track,
                    transform: `scale(${0.6 + 0.4 * p})`,
                  }}
                >
                  <span style={{ opacity: p }}>
                    <Icon name="check" size={12} color="#fff" />
                  </span>
                </span>
                {c}
              </li>
            );
          })}
        </ul>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
          <Btn
            primary
            size="lg"
            style={{
              transform: `scale(${press})`,
              boxShadow: `0 0 0 ${10 * sent}px rgba(0,112,242,${0.35 * (1 - sent)})`,
              background: sent > 0.5 ? C.posFill : C.accentFill,
              borderColor: sent > 0.5 ? C.posFill : C.accentFill,
            }}
          >
            <Icon name={sent > 0.5 ? "check" : "send"} size={17} />
            {sent > 0.5 ? "Approved" : "Send and auto-approve"}
          </Btn>
          <Small muted>No email. It’s approved the moment you send, and the brand’s share is drawn from the playbook fund.</Small>
        </div>
      </Step>
    </Card>
  );
};

export const SuggestView: React.FC<{ t: number }> = ({ t }) => {
  const selected = prog(t, 1.8, 0.3);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,2.1fr)", gap: 16, alignItems: "start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "0 4px", ...enter(t, 0.55) }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Today’s triggers</h2>
          <Small muted>3 need a decision</Small>
        </div>
        {TRIGGERS.map((trig, i) => (
          <TriggerCard key={trig.id} trig={trig} t={t} i={i} selected={selected} />
        ))}
      </div>
      <Detail t={t} />
    </div>
  );
};
