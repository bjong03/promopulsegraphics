// ─────────────────────────────────────────────────────────────
// Shared video settings. Change these once and every composition follows.
//
//   1080p30 (default):  WIDTH 1920, HEIGHT 1080, FPS 30
//   4K60:               WIDTH 3840, HEIGHT 2160, FPS 60
//
// Animations are written in SECONDS (via `sec()`), so switching FPS keeps
// timing identical. Layout uses `px()` so switching resolution keeps
// proportions identical.
// ─────────────────────────────────────────────────────────────

export const WIDTH = 1920;
export const HEIGHT = 1080;
export const FPS = 30;

/** Design reference width. Sizes in the code are authored for 1920px wide. */
const DESIGN_WIDTH = 1920;

/** Seconds → frames at the current FPS. */
export const sec = (seconds: number): number => Math.round(seconds * FPS);

/** Scale a pixel value authored at 1920px to the current resolution. */
export const px = (value: number): number => (value * WIDTH) / DESIGN_WIDTH;

/**
 * Title-safe area (90% of frame → 5% margin each side). Keep text inside it
 * so nothing gets cropped on TVs, social crops, or by editor overlays.
 */
export const SAFE = {
  x: WIDTH * 0.05,
  y: HEIGHT * 0.05,
};

/** Neutral starter palette — replace with your own. */
export const COLORS = {
  background: "#111111",
  text: "#ffffff",
  muted: "#a0a0a0",
  accent: "#ffffff",
};
