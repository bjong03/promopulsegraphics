import { zColor } from "@remotion/zod-types";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile } from "remotion";
import { z } from "zod";
import { SAFE, px, sec } from "../config";
import { FONT_FAMILY } from "../fonts";
import { useEnterExit } from "../lib/animation";

export const overlayBadgeSchema = z.object({
  label: z.string(),
  badgeColor: zColor(),
  textColor: zColor(),
  position: z.enum(["top-left", "top-right", "bottom-left", "bottom-right", "center"]),
  playSound: z.boolean(),
});

export type OverlayBadgeProps = z.infer<typeof overlayBadgeSchema>;

export const overlayBadgeDefaults: OverlayBadgeProps = {
  label: "NEW",
  badgeColor: "#ffffff",
  textColor: "#111111",
  position: "top-right",
  playSound: true,
};

const positionStyle = (position: OverlayBadgeProps["position"]): React.CSSProperties => {
  switch (position) {
    case "top-left":
      return { top: SAFE.y, left: SAFE.x };
    case "top-right":
      return { top: SAFE.y, right: SAFE.x };
    case "bottom-left":
      return { bottom: SAFE.y, left: SAFE.x };
    case "bottom-right":
      return { bottom: SAFE.y, right: SAFE.x };
    case "center":
      return { top: "50%", left: "50%", translate: "-50% -50%" };
  }
};

// Transparent background: there is deliberately NO backgroundColor here.
// Render as ProRes 4444 or a PNG sequence to keep the alpha channel.
export const OverlayBadge: React.FC<OverlayBadgeProps> = ({
  label,
  badgeColor,
  textColor,
  position,
  playSound,
}) => {
  // Slightly bouncy spring on the way in, quick ease on the way out.
  const anim = useEnterExit({
    enter: sec(0.7),
    exit: sec(0.35),
    config: { damping: 12, mass: 0.7 },
  });

  const scale = anim.enter * (1 - anim.exit);
  const rotate = interpolate(anim.enter, [0, 1], [-8, 0]);

  return (
    <AbsoluteFill>
      {/* Sound effect: a <Sequence> controls WHEN it plays (from = start frame).
          Trim any leading silence in the file itself so the hit lands on cue. */}
      {playSound ? (
        <Sequence from={0} durationInFrames={sec(1)} layout="none">
          <Audio src={staticFile("audio/pop.wav")} volume={0.6} />
        </Sequence>
      ) : null}

      <div
        style={{
          position: "absolute",
          ...positionStyle(position),
          backgroundColor: badgeColor,
          color: textColor,
          fontFamily: FONT_FAMILY,
          fontWeight: 800,
          fontSize: px(40),
          letterSpacing: "0.08em",
          padding: `${px(14)}px ${px(30)}px`,
          borderRadius: px(999),
          opacity: Math.min(1, anim.presence * 1.5),
          transform: `scale(${scale}) rotate(${rotate}deg)`,
        }}
      >
        {label}
      </div>
    </AbsoluteFill>
  );
};
