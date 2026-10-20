// The full ~27s pitch: reveal → product demo → end card, with an optional
// voiceover track. Timing lives in src/promo/timing.ts.
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { z } from "zod";
import { sec } from "../config";
import { PromoPulseDemo } from "../promo/Demo";
import { PromoPulseEnd } from "../promo/EndCard";
import { PromoPulseReveal } from "../promo/Reveal";
import { DEMO_DURATION, END_DURATION, REVEAL_DURATION, TRANSITION } from "../promo/timing";

export const promoPulsePitchSchema = z.object({
  /** Path inside public/, e.g. "audio/voiceover.mp3". Leave empty for no audio. */
  voiceover: z.string(),
  voiceoverVolume: z.number().min(0).max(1).step(0.05),
  /** Seconds to shift the voiceover (positive = later). */
  voiceoverOffset: z.number().min(-2).max(2).step(0.05),
  showCaptions: z.boolean(),
});

export type PromoPulsePitchProps = z.infer<typeof promoPulsePitchSchema>;

export const promoPulsePitchDefaults: PromoPulsePitchProps = {
  voiceover: "",
  voiceoverVolume: 1,
  voiceoverOffset: 0,
  showCaptions: true,
};

export const PromoPulsePitch: React.FC<PromoPulsePitchProps> = ({ voiceover, voiceoverVolume, voiceoverOffset, showCaptions }) => {
  const fadeT = linearTiming({ durationInFrames: sec(TRANSITION) });
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B1B2E" }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={sec(REVEAL_DURATION)}>
          <PromoPulseReveal />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={fadeT} />
        <TransitionSeries.Sequence durationInFrames={sec(DEMO_DURATION)}>
          <PromoPulseDemo showCaptions={showCaptions} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={fadeT} />
        <TransitionSeries.Sequence durationInFrames={sec(END_DURATION)}>
          <PromoPulseEnd />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      {voiceover ? (
        <Sequence from={voiceoverOffset > 0 ? sec(voiceoverOffset) : 0} layout="none">
          <Audio src={staticFile(voiceover)} volume={voiceoverVolume} trimBefore={voiceoverOffset < 0 ? sec(-voiceoverOffset) : undefined} />
        </Sequence>
      ) : null}
    </AbsoluteFill>
  );
};
