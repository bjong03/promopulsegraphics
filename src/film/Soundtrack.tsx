// Voiceover, score and sound effects, all local files.
import React from "react";
import { Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { CAPTIONS, SFX, VO_CLIPS } from "./timeline";

/** Music ducks ~5 dB under every spoken line (ramps of 0.3 s). */
const duck = (sec: number) => {
  let d = 0;
  for (const c of CAPTIONS) {
    const a = Math.min(1, Math.max(0, (sec - (c.from - 0.3)) / 0.3));
    const b = Math.min(1, Math.max(0, (c.to + 0.3 - sec) / 0.3));
    d = Math.max(d, Math.min(a, b));
  }
  return 1 - 0.45 * d;
};

export const Soundtrack: React.FC<{ voiceover: boolean; music: boolean; sfx: boolean; musicVolume: number }> = ({ voiceover, music, sfx, musicVolume }) => {
  const { fps } = useVideoConfig();
  const f = (s: number) => Math.round(s * fps);
  return (
    <>
      {music ? <Audio src={staticFile("audio/music/score.wav")} volume={(fr) => musicVolume * duck(fr / fps)} /> : null}
      {voiceover
        ? VO_CLIPS.map((c, i) => (
            <Sequence key={`vo${i}`} from={f(c.at)} durationInFrames={f(c.dur)} layout="none">
              <Audio src={staticFile(c.file)} trimBefore={f(c.trim)} volume={1} />
            </Sequence>
          ))
        : null}
      {sfx
        ? SFX.map((s, i) => (
            <Sequence key={`sfx${i}`} from={f(s.at)} durationInFrames={f(3)} layout="none">
              <Audio src={staticFile(`audio/sfx/${s.file}.wav`)} volume={s.vol} />
            </Sequence>
          ))
        : null}
    </>
  );
};
