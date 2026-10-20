import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const ease = Easing.bezier(0.22, 0.8, 0.2, 1); // decisive ease-out
export const inOut = Easing.bezier(0.65, 0, 0.35, 1); // camera moves
export const easeIn = Easing.bezier(0.5, 0, 0.75, 0);

/** Seconds elapsed in the current Sequence. */
export const useT = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return f / fps;
};

/** 0→1 over [start, start+dur] seconds. */
export const p = (t: number, start: number, dur: number, easing = ease) =>
  interpolate(t, [start, start + dur], [0, 1], { ...clamp, easing });

/** 1 while inside [a, b], with fades of `fade` seconds at each end. */
export const win = (t: number, a: number, b: number, fade = 0.4) =>
  Math.min(p(t, a, fade), 1 - p(t, b - fade, fade, easeIn));

export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

/** Smoothly interpolate keyframed numeric values. */
export const keys = <T extends Record<string, number>>(t: number, frames: ({ at: number } & T)[]): T => {
  const out: Record<string, number> = {};
  for (const k of Object.keys(frames[0]).filter((x) => x !== "at")) {
    out[k] = interpolate(
      t,
      frames.map((f) => f.at),
      frames.map((f) => (f as Record<string, number>)[k]),
      { ...clamp, easing: inOut },
    );
  }
  return out as T;
};

/** Hold time still at `freezeAt` (for the freeze-frame beat). */
export const frozen = (t: number, freezeAt: number) => Math.min(t, freezeAt);

export const money = (n: number) => (n < 0 ? "−" : "") + "$" + Math.abs(Math.round(n)).toLocaleString("en-US");
export const int = (n: number) => Math.round(n).toLocaleString("en-US");
