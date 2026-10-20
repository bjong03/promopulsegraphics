import { zColor } from "@remotion/zod-types";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { z } from "zod";
import { COLORS, SAFE, px, sec } from "../config";
import { FONT_FAMILY } from "../fonts";

export const kineticTextSchema = z.object({
  text: z.string(),
  /** Seconds between each word's entrance. */
  stagger: z.number().min(0).max(1).step(0.01),
  backgroundColor: zColor(),
  textColor: zColor(),
});

export type KineticTextProps = z.infer<typeof kineticTextSchema>;

export const kineticTextDefaults: KineticTextProps = {
  text: "Words arrive one at a time",
  stagger: 0.12,
  backgroundColor: COLORS.background,
  textColor: COLORS.text,
};

export const KineticText: React.FC<KineticTextProps> = ({
  text,
  stagger,
  backgroundColor,
  textColor,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const words = text.split(/\s+/).filter(Boolean);

  const staggerFrames = Math.round(stagger * fps);
  const exitDuration = sec(0.4);
  const lastFrame = durationInFrames - 1;

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        justifyContent: "center",
        alignItems: "center",
        padding: `${SAFE.y}px ${SAFE.x}px`,
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: `${px(10)}px ${px(28)}px`,
          fontFamily: FONT_FAMILY,
          fontSize: px(110),
          fontWeight: 800,
          color: textColor,
          lineHeight: 1.1,
        }}
      >
        {words.map((word, i) => {
          // Enter: staggered spring, word rises up through a mask.
          const enter = spring({
            frame: frame - i * staggerFrames,
            fps,
            config: { damping: 14, mass: 0.6 },
          });
          // Exit: same stagger order, timed so the LAST word finishes on the
          // last frame of the composition.
          const exitEnd = lastFrame - (words.length - 1 - i) * Math.round(staggerFrames / 2);
          const exit = interpolate(frame, [exitEnd - exitDuration, exitEnd], [0, 1], {
            easing: Easing.in(Easing.cubic),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          const y = interpolate(enter, [0, 1], [100, 0]) - exit * 100;

          return (
            // overflow:hidden acts as a mask so words slide in/out of view.
            <span key={i} style={{ overflow: "hidden", display: "inline-block" }}>
              <span
                style={{
                  display: "inline-block",
                  transform: `translateY(${y}%)`,
                  opacity: Math.min(1, enter * 2) * (1 - exit),
                }}
              >
                {word}
              </span>
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
