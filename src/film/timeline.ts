// ─────────────────────────────────────────────────────────────
// Master timeline for the 60-second film. Everything is in SECONDS of film
// time and was aligned to the four recorded voiceover clips in
// public/audio/vo/. If a clip is re-recorded, adjust VO_CLIPS and CAPTIONS,
// then nudge the scene/beat times below.
// ─────────────────────────────────────────────────────────────

/** 59.15 s: closer pause tightened by 1.3 s; clip 2 allowed to finish (+0.45 s). */
export const FILM_SECONDS = 59.15;

export const SCENES = {
  chaos: { from: 0, to: 12.6 }, // Dana + fragmented workflow, ends on freeze + silence
  shelf: { from: 12.6, to: 20.6 }, // perishable selling window
  reveal: { from: 20.2, to: 28.65 }, // fragments align → Promo Pulse workspace
  product: { from: 28.35, to: 42.85 }, // Suggest → Approve → Execute → record
  impact: { from: 42.55, to: 51.75 }, // Monitor → ≈ C$79M
  close: { from: 51.55, to: 59.15 }, // calm Dana → end card
};

/** Beats inside scenes (film seconds). */
export const BEAT = {
  // chaos
  alert: 3.7,
  email: 5.73,
  store: 8.15,
  freeze: 11.75,
  // shelf
  shelfFocus: 13.6,
  danaReturns: 18.0,
  // reveal
  align: 20.3,
  logo: 21.2,
  dataIn: 22.6,
  workspace: 23.6,
  headline: 24.4,
  // product
  suggest: 30.55,
  compare: 31.85,
  approve: 33.35,
  execute: 35.05,
  record: 36.25,
  noEmails: 39.55,
  // impact
  monitor: 42.75,
  scale: 46.65,
  figure: 48.05,
  // close
  calm: 51.55,
  endCard: 55.05,
  tagline: 56.6,
};

/**
 * Voiceover placement. `at` = film second the audio starts; `trim` = seconds
 * cut from the start of the file; `dur` = seconds played.
 * Clip 1 is split at its natural pause to open up the freeze-frame silence.
 */
export const VO_CLIPS = [
  { file: "audio/vo/matched/vo1-intro.wav", at: 0, trim: 0.25, dur: 11.72 },
  { file: "audio/vo/matched/vo1-intro.wav", at: 12.62, trim: 12.3, dur: 7.6 },
  { file: "audio/vo/matched/vo2-reveal.wav", at: 21.07, trim: 0.7, dur: 7.05 },
  { file: "audio/vo/matched/vo3-solution.wav", at: 28.42, trim: 0.7, dur: 14.0 },
  { file: "audio/vo/matched/vo4-impact-close.wav", at: 42.62, trim: 0.2, dur: 8.62 },
  { file: "audio/vo/matched/vo4-impact-close.wav", at: 51.52, trim: 8.95, dur: 7.3 },
];

/** Subtitles — the narration verbatim, split into readable lines. */
export const CAPTIONS: { from: number; to: number; text: string }[] = [
  { from: 0.19, to: 3.5, text: "Meet Dana, she’s a dairy category manager at Loblaws." },
  { from: 3.71, to: 5.55, text: "Her inventory alerts show up late." },
  { from: 5.73, to: 8.1, text: "Brand deals get buried in email threads." },
  { from: 8.15, to: 11.72, text: "And her Store teams struggle to chase the latest promotion execution details." },
  { from: 12.84, to: 15.3, text: "For perishable goods, every delay means less time" },
  { from: 15.3, to: 17.72, text: "to sell fresh stock before it becomes waste." },
  { from: 18.06, to: 20.12, text: "That’s the reality of a category manager." },
  { from: 21.23, to: 24.2, text: "Promo Pulse turns the retail data she already has" },
  { from: 24.33, to: 27.55, text: "into timely promotion campaigns designed to benefit both retailer and brand." },
  { from: 28.57, to: 30.4, text: "Promo pulse can do 3 key things:" },
  { from: 30.62, to: 32.75, text: "1. It flags at-risk products," },
  { from: 33.12, to: 36.15, text: "2. streamlines brand approvals and store readiness," },
  { from: 36.22, to: 39.2, text: "and 3. keeps every key deal decision traceable." },
  { from: 39.52, to: 42.35, text: "No more chasing emails to find out where a promotion stands." },
  { from: 42.76, to: 46.6, text: "Dana tracks results store by store, identifying where action matters most." },
  { from: 46.9, to: 51.05, text: "At Loblaw scale, modeled annual value potential reaches C$79 million." },
  { from: 51.73, to: 54.95, text: "Promo Pulse turns perishable inventory into opportunity—" },
  { from: 55.21, to: 56.35, text: "at the speed of fresh." },
  { from: 56.61, to: 58.75, text: "Less waste. Smarter promotions." },
];

/** Sound effects: file in public/audio/sfx, film second, volume. */
export const SFX: { file: string; at: number; vol: number }[] = [
  // typing under the opening
  ...[0.3, 0.55, 0.72, 1.05, 1.3, 1.46, 1.9, 2.12, 2.3, 2.7, 2.95, 3.12].map((at) => ({ file: "key", at, vol: 0.32 })),
  { file: "alert", at: 3.75, vol: 0.4 },
  { file: "ping", at: 5.8, vol: 0.32 },
  { file: "ping", at: 6.35, vol: 0.3 },
  { file: "ping", at: 6.9, vol: 0.32 },
  { file: "ping", at: 7.45, vol: 0.34 },
  { file: "alert", at: 8.25, vol: 0.34 },
  { file: "ping", at: 9.2, vol: 0.34 },
  { file: "ping", at: 9.85, vol: 0.36 },
  { file: "ping", at: 10.4, vol: 0.38 },
  { file: "ping", at: 10.85, vol: 0.4 },
  { file: "ping", at: 11.25, vol: 0.42 },
  // reveal
  // 20.2 – 21.2: silence, then the logo arrives with the score
  { file: "chime", at: 21.3, vol: 0.28 },
  { file: "tick", at: 22.7, vol: 0.3 },
  { file: "tick", at: 22.95, vol: 0.3 },
  { file: "tick", at: 23.2, vol: 0.3 },
  // product
  { file: "tick", at: 30.75, vol: 0.35 },
  { file: "confirm", at: 31.55, vol: 0.35 },
  { file: "tick", at: 33.8, vol: 0.28 },
  { file: "tick", at: 34.0, vol: 0.28 },
  { file: "tick", at: 34.2, vol: 0.28 },
  { file: "tick", at: 34.4, vol: 0.28 },
  { file: "chime", at: 34.7, vol: 0.4 },
  { file: "confirm", at: 35.75, vol: 0.3 },
  { file: "tick", at: 41.45, vol: 0.3 },
  // impact
  { file: "tick", at: 45.05, vol: 0.3 },
  { file: "impact", at: 48.15, vol: 0.35 },
  // close
  { file: "chime", at: 55.15, vol: 0.3 },
];
