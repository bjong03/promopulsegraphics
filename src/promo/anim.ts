import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

/** Current time in seconds within the enclosing <Sequence>. */
export const useTime = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const easeOut = Easing.bezier(0.2, 0.7, 0.2, 1); // the prototype's own entrance curve
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

/** 0 → 1 between `start` and `start + dur` seconds. */
export const prog = (t: number, start: number, dur: number, easing = easeOut) =>
  interpolate(t, [start, start + dur], [0, 1], { ...clamp, easing });

/** Fade + rise entrance style. */
export const enter = (t: number, start: number, dur = 0.5, dist = 16): React.CSSProperties => {
  const p = prog(t, start, dur);
  return { opacity: p, transform: `translateY(${(1 - p) * dist}px)` };
};

/** Interpolate keyframed values: [{ at, ...values }] with smooth in-out moves. */
export const keyframes = <T extends Record<string, number>>(t: number, frames: ({ at: number } & T)[]): T => {
  const out = {} as Record<string, number>;
  const keys = Object.keys(frames[0]).filter((k) => k !== "at");
  for (const k of keys) {
    out[k] = interpolate(
      t,
      frames.map((f) => f.at),
      frames.map((f) => (f as Record<string, number>)[k]),
      { ...clamp, easing: easeInOut },
    );
  }
  return out as T;
};

export const money = (n: number) => (n < 0 ? "−" : "") + "$" + Math.abs(Math.round(n)).toLocaleString("en-US");
export const int = (n: number) => Math.round(n).toLocaleString("en-US");
