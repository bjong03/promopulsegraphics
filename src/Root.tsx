import { Composition, Folder } from "remotion";
import { FPS, HEIGHT, WIDTH, sec } from "./config";
import { KineticText, kineticTextDefaults, kineticTextSchema } from "./compositions/KineticText";
import { LowerThird, lowerThirdDefaults, lowerThirdSchema } from "./compositions/LowerThird";
import { OverlayBadge, overlayBadgeDefaults, overlayBadgeSchema } from "./compositions/OverlayBadge";
import { TitleCard, titleCardDefaults, titleCardSchema } from "./compositions/TitleCard";

// Every graphic is registered here. The `id` is what you pass to
// `npx remotion render <id>`. Size/fps come from src/config.ts so they can be
// changed in one place; override per-composition if a graphic needs to differ
// (e.g. a 1080x1920 vertical version).
const canvas = { width: WIDTH, height: HEIGHT, fps: FPS };

export const RemotionRoot: React.FC = () => {
  return (
    <>
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
