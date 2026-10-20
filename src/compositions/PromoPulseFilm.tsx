// The 60-second Promo Pulse film. Scenes read absolute film time and manage
// their own entrances/exits so transitions can overlap and match-cut.
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { Captions } from "../film/Captions";
import { Chaos } from "../film/scenes/Chaos";
import { Close } from "../film/scenes/Close";
import { DataFeed } from "../film/scenes/DataFeed";
import { Impact } from "../film/scenes/Impact";
import { Product } from "../film/scenes/Product";
import { Reveal } from "../film/scenes/Reveal";
import { ShelfScene } from "../film/scenes/ShelfScene";
import { Soundtrack } from "../film/Soundtrack";
import { F } from "../film/theme";
import { BEAT, FILM_SECONDS } from "../film/timeline";

export const promoPulseFilmSchema = z.object({
  voiceover: z.boolean(),
  music: z.boolean(),
  sfx: z.boolean(),
  captions: z.boolean(),
  musicVolume: z.number().min(0).max(1).step(0.05),
});

export type PromoPulseFilmProps = z.infer<typeof promoPulseFilmSchema>;

export const promoPulseFilmDefaults: PromoPulseFilmProps = {
  voiceover: true,
  music: true,
  sfx: true,
  captions: true,
  musicVolume: 0.42,
};

export const FILM_FPS = 30;
export const FILM_FRAMES = Math.round(FILM_SECONDS * FILM_FPS);

export const PromoPulseFilm: React.FC<PromoPulseFilmProps> = (props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = frame / fps;
  return (
    <AbsoluteFill style={{ background: F.ink0 }}>
      <Chaos T={T} />
      <ShelfScene T={T} />
      <Reveal T={T} />
      {/* Impact sits under Product so the workspace can shrink into its tile field */}
      <Impact T={T} />
      <Product T={T} />
      <DataFeed T={T} />
      <Close T={T} />
      {/* the end card shows the tagline itself, so captions step aside there */}
      {props.captions && T < BEAT.tagline - 0.05 ? <Captions T={T} /> : null}
      <Soundtrack {...props} />
    </AbsoluteFill>
  );
};
