// ─────────────────────────────────────────────────────────────
// Voiceover timing. All values are SECONDS.
// Adjust these to line the visuals up with your recorded voiceover;
// every animation in the pitch is positioned relative to them.
// ─────────────────────────────────────────────────────────────

/** "Meet Promo Pulse: an SAP-powered solution that turns at-risk inventory
 *  into actionable, measurable promotions." */
export const REVEAL_DURATION = 7;

/** Beats of the product demo, measured from the start of the demo section. */
export const BEATS = {
  /** "It identifies at-risk products" */
  identify: 0,
  /** "and recommends promotions with clear financial rationale." */
  recommend: 3,
  /** "It streamlines brand approvals and store readiness," */
  approve: 6.6,
  /** "then tracks promotion performance and execution" */
  track: 10.6,
  /** "so Dana knows what's working and where to act." */
  act: 14.6,
};
export const DEMO_DURATION = 18.4;

/** Closing lockup after the voiceover ends. */
export const END_DURATION = 2.6;

/** Cross-fade between sections (overlaps, so it shortens the total). */
export const TRANSITION = 0.5;

export const PITCH_DURATION = REVEAL_DURATION + DEMO_DURATION + END_DURATION - 2 * TRANSITION; // 27s
