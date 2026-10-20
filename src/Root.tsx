import { Composition, Folder } from "remotion";
import { FPS, HEIGHT, WIDTH, sec } from "./config";
import { KineticText, kineticTextDefaults, kineticTextSchema } from "./compositions/KineticText";
import { LowerThird, lowerThirdDefaults, lowerThirdSchema } from "./compositions/LowerThird";
import { OverlayBadge, overlayBadgeDefaults, overlayBadgeSchema } from "./compositions/OverlayBadge";
import { TitleCard, titleCardDefaults, titleCardSchema } from "./compositions/TitleCard";
import { FILM_FPS, FILM_FRAMES, PromoPulseFilm, promoPulseFilmDefaults, promoPulseFilmSchema } from "./compositions/PromoPulseFilm";
import { PromoPulsePitch, promoPulsePitchDefaults, promoPulsePitchSchema } from "./compositions/PromoPulsePitch";
import { PromoPulseDemo } from "./promo/Demo";
import { PromoPulseEnd } from "./promo/EndCard";
import { PromoPulseReveal } from "./promo/Reveal";
import { DEMO_DURATION, END_DURATION, PITCH_DURATION, REVEAL_DURATION } from "./promo/timing";

// Every graphic is registered here. The `id` is what you pass to
// `npx remotion render <id>`. Size/fps come from src/config.ts so they can be
// changed in one place; override per-composition if a graphic needs to differ
// (e.g. a 1080x1920 vertical version).
const canvas = { width: WIDTH, height: HEIGHT, fps: FPS };

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 60-second competition film (fixed at 1920×1080, 30 fps, 1800 frames). */}
      <Composition
        id="PromoPulseFilm"
        component={PromoPulseFilm}
        durationInFrames={FILM_FRAMES}
        fps={FILM_FPS}
        width={1920}
        height={1080}
        schema={promoPulseFilmSchema}
        defaultProps={promoPulseFilmDefaults}
      />

      {/* The pitch video, plus each section on its own for editing in your NLE. */}
      <Folder name="PromoPulse">
        <Composition
          id="PromoPulsePitch"
          component={PromoPulsePitch}
          durationInFrames={sec(PITCH_DURATION)}
          {...canvas}
          schema={promoPulsePitchSchema}
          defaultProps={promoPulsePitchDefaults}
        />
        <Composition id="PromoPulseReveal" component={PromoPulseReveal} durationInFrames={sec(REVEAL_DURATION)} {...canvas} />
        <Composition
          id="PromoPulseDemo"
          component={PromoPulseDemo}
          durationInFrames={sec(DEMO_DURATION)}
          {...canvas}
          defaultProps={{ showCaptions: true }}
        />
        <Composition id="PromoPulseEnd" component={PromoPulseEnd} durationInFrames={sec(END_DURATION)} {...canvas} />
      </Folder>

      <Folder name="Fullscreen">
        <Composition
          id="TitleCard"
          component={TitleCard}
          durationInFrames={sec(4)}
          {...canvas}
          schema={titleCardSchema}
          defaultProps={titleCardDefaults}
        />
        <Composition
          id="KineticText"
          component={KineticText}
          durationInFrames={sec(4)}
          {...canvas}
          schema={kineticTextSchema}
          defaultProps={kineticTextDefaults}
        />
      </Folder>

      {/* Overlays have transparent backgrounds — export as ProRes 4444 / PNG. */}
      <Folder name="Overlays">
        <Composition
          id="LowerThird"
          component={LowerThird}
          durationInFrames={sec(5)}
          {...canvas}
          schema={lowerThirdSchema}
          defaultProps={lowerThirdDefaults}
        />
        <Composition
          id="OverlayBadge"
          component={OverlayBadge}
          durationInFrames={sec(3)}
          {...canvas}
          schema={overlayBadgeSchema}
          defaultProps={overlayBadgeDefaults}
        />
      </Folder>
    </>
  );
};
