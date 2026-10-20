import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  type SpringConfig,
} from "remotion";

/** Smooth, no-overshoot spring. Swap for `{ damping: 12 }` for a bouncier feel. */
export const SMOOTH: Partial<SpringConfig> = { damping: 200 };

type EnterExitOptions = {
  /** Enter duration in frames. */
  enter: number;
  /** Exit duration in frames. The exit always finishes on the very last frame. */
  exit: number;
  /** Frames to wait before the enter starts (for staggering). */
  delay?: number;
  /** Frames to finish the exit *before* the end (for staggering). */
  exitEarly?: number;
  config?: Partial<SpringConfig>;
};

/**
 * Returns `enter` (0 → 1, spring) and `exit` (0 → 1, eased) progress values,
 * plus `presence` = enter × (1 − exit), which is 0 on the first and last
 * frame. Drive opacity/transform from these so a graphic never pops or cuts.
 */
export const useEnterExit = ({
  enter,
  exit,
  delay = 0,
  exitEarly = 0,
  config = SMOOTH,
}: EnterExitOptions) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const enterProgress = spring({
    frame: frame - delay,
    fps,
    config,
    durationInFrames: enter,
  });

  const lastFrame = durationInFrames - 1 - exitEarly;
  const exitProgress = interpolate(frame, [lastFrame - exit, lastFrame], [0, 1], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return {
    enter: enterProgress,
    exit: exitProgress,
    presence: enterProgress * (1 - exitProgress),
  };
};
