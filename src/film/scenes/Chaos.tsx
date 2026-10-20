// Scene 1 (0 – 12.6 s): Dana at her desk, three frustrations arrive in sync
// with the narration, then everything freezes and falls silent.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { DeskScene } from "../Desk";
import { AlertToast, EmailCard, PlanVersion, ReportWindow, SheetWindow, StoreTask, TubGlyph } from "../Fragments";
import { easeIn, frozen, inOut, keys, lerp, p } from "../lib";
import { DISPLAY, F } from "../theme";
import { BEAT } from "../timeline";
import { Headline, LowerThird } from "../Type";

/** Enter (slide + fade), then recede to a depth layer, optionally come back. */
const layer = (t: number, at: number, recedeAt: number, back?: number) => {
  const a = p(t, at, 0.45);
  const r = p(t, recedeAt, 0.5, inOut) * (back !== undefined ? 1 - p(t, back, 0.5, inOut) * 0.7 : 1);
  return {
    opacity: a * (1 - r * 0.62),
    transform: `translate(${(1 - a) * 40 - r * 30}px, ${-r * 16}px) scale(${(0.97 + 0.03 * a) * (1 - r * 0.07)})`,
    filter: r > 0.01 ? `brightness(${1 - r * 0.35})` : undefined,
  } as React.CSSProperties;
};

export const Chaos: React.FC<{ T: number }> = ({ T }) => {
  if (T > 12.7) return null;
  const t = frozen(T, BEAT.freeze);
  const B1 = BEAT.alert;
  const B2 = BEAT.email;
  const B3 = BEAT.store;

  const tension = keys(t, [
    { at: 0, v: 0.15 },
    { at: 3.6, v: 0.3 },
    { at: 6, v: 0.55 },
    { at: 9, v: 0.75 },
    { at: 11.2, v: 0.95 },
  ]).v;
  const look = keys(t, [
    { at: 0, v: 1 },
    { at: 3.8, v: 1 },
    { at: 4.3, v: -3 },
    { at: 6, v: -1 },
    { at: 7, v: -4 },
    { at: 8.4, v: 2 },
    { at: 9.6, v: -2.5 },
    { at: 11, v: 3 },
  ]).v;
  const blinkAt = [1.6, 4.9, 9.3];
  const blink = Math.max(...blinkAt.map((b) => interpolate(t, [b, b + 0.06, b + 0.14], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })));
  const typing = t < 3.6 ? 1 : t < 5.6 ? 0.25 : t < 8 ? 0.7 : 0.35;

  const s = lerp(1.3, 1.42, inOut(Math.min(1, t / BEAT.freeze)));
  const head = { x: 560, y: 470 };
  const camera = { s, x: head.x - 430 * s, y: head.y - 250 * s };

  // Freeze beat, then the alert's yogurt glyph carries us into the shelf.
  const out = p(T, 12.1, 0.5, easeIn);
  const carry = p(T, 12.05, 0.55, inOut);
  const alarm = t > B1 ? 1 : 0;

  // Reply counters tick up during the email beat.
  const replies = Math.min(9, 3 + Math.floor(Math.max(0, t - B2) * 2.2));

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: 1 - out }}>
        <DeskScene id="chaos" pose={{ tension, look, typing, blink, rim: 1, time: t }} calm={0} order={0} alarm={alarm} camera={camera} />

        {/* Beat 1: late inventory signal */}
        <ReportWindow style={{ left: 1150, top: 150, ...layer(t, B1 + 0.05, B2, 10.4) }} highlight={p(t, B1 + 0.6, 0.4)} />
        {/* Beat 2: negotiation by email + spreadsheet revisions */}
        <EmailCard
          style={{ left: 1170, top: 130, ...layer(t, B2 + 0.05, B3, 10.6) }}
          from="Sam Patel · Brightfield Dairy"
          subject="RE: RE: Yogurt promo — 25% off?"
          snippet="We could go to 20% if you take the endcap…"
          replies={replies}
          unread
        />
        <EmailCard
          style={{ left: 1300, top: 300, ...layer(t, B2 + 0.6, B3 + 0.1, 10.7) }}
          from="Category finance"
          subject="Funding split — can the brand cover 50%?"
          snippet="Need this before Thursday’s cut-off."
          replies={Math.max(1, replies - 3)}
        />
        <SheetWindow style={{ left: 1120, top: 470, ...layer(t, B2 + 1.15, B3 + 0.2, 10.8) }} rev={Math.max(0, (t - (B2 + 1.5)) / 0.5)} />
        <EmailCard
          style={{ left: 1330, top: 690, ...layer(t, B2 + 1.7, B3 + 0.3, 10.9) }}
          from="Sam Patel · Brightfield Dairy"
          subject="Please confirm promo terms by EOD"
          snippet="Attached: Promo_terms_v3_FINAL.xlsx"
          replies={2}
          unread
        />
        {/* Beat 3: store execution confusion */}
        <StoreTask style={{ left: 1240, top: 170, ...layer(t, B3 + 0.1, 99) }} />
        <PlanVersion style={{ left: 1100, top: 560, ...layer(t, B3 + 0.85, 99) }} v="v2" terms="20% off" start="Starts Monday" stale />
        <PlanVersion style={{ left: 1470, top: 600, ...layer(t, B3 + 1.35, 99) }} v="v3" terms="15% off + endcap" start="Starts Tuesday" />
        <div
          style={{
            position: "absolute",
            left: 1418,
            top: 626,
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: F.amber,
            color: "#0C0E11",
            fontFamily: DISPLAY,
            fontWeight: 800,
            fontSize: 26,
            display: "grid",
            placeItems: "center",
            opacity: p(t, B3 + 1.8, 0.3),
            transform: `scale(${0.6 + 0.4 * p(t, B3 + 1.8, 0.3)})`,
          }}
        >
          ?
        </div>
        {/* Alert toast sits on top so it can carry the transition */}
        <AlertToast style={{ left: 1230, top: 440, ...layer(t, B1 + 0.35, B2 + 0.2, 10.5), opacity: (layer(t, B1 + 0.35, B2 + 0.2, 10.5).opacity as number) * (1 - carry) }} />

        <LowerThird t={T} at={0.45} out={3.55} name="DANA" role="DAIRY CATEGORY MANAGER" style={{ left: 110, top: 800 }} />
        <Headline t={T} at={B1 + 0.05} out={B2 - 0.05} lines={["INVENTORY ALERTS.", "TOO LATE."]} accent={1} accentColor={F.coral} size={64} style={{ left: 110, top: 96 }} />
        <Headline t={T} at={B2 + 0.05} out={B3 - 0.05} lines={["DEALS LOST", "IN EMAIL."]} accent={1} accentColor={F.amber} size={64} style={{ left: 110, top: 96 }} />
        <Headline t={T} at={B3 + 0.05} out={12.2} lines={["WHICH VERSION", "IS FINAL?"]} accent={1} accentColor={F.amber} size={64} style={{ left: 110, top: 96 }} />
      </AbsoluteFill>

      {/* The yogurt glyph leaves the alert and grows to centre: match cut to the shelf. */}
      {T > 12.0 ? (
        <div
          style={{
            position: "absolute",
            left: lerp(1230 + 18 + 26, 960, carry) - lerp(18, 130, carry),
            top: lerp(440 + 16 + 26, 540, carry) - lerp(18, 130, carry),
            opacity: 1 - p(T, 12.45, 0.25),
          }}
        >
          <TubGlyph size={lerp(36, 260, carry)} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
