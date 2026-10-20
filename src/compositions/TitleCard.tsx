import { zColor } from "@remotion/zod-types";
import { AbsoluteFill, interpolate } from "remotion";
import { z } from "zod";
import { COLORS, SAFE, px, sec } from "../config";
import { FONT_FAMILY } from "../fonts";
import { useEnterExit } from "../lib/animation";

export const titleCardSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  backgroundColor: zColor(),
  textColor: zColor(),
});

export type TitleCardProps = z.infer<typeof titleCardSchema>;

export const titleCardDefaults: TitleCardProps = {
  title: "Your Title Here",
  subtitle: "A short supporting line",
  backgroundColor: COLORS.background,
  textColor: COLORS.text,
};

export const TitleCard: React.FC<TitleCardProps> = ({
  title,
  subtitle,
  backgroundColor,
  textColor,
}) => {
  // Title and subtitle each get their own enter/exit; the subtitle enters a
  // little later and leaves a little earlier, so they feel layered.
  const titleAnim = useEnterExit({ enter: sec(0.8), exit: sec(0.5) });
  const subAnim = useEnterExit({
    enter: sec(0.8),
    exit: sec(0.4),
    delay: sec(0.25),
    exitEarly: sec(0.1),
  });
  const rule = useEnterExit({ enter: sec(0.7), exit: sec(0.4), delay: sec(0.1) });

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        justifyContent: "center",
        alignItems: "center",
        padding: `${SAFE.y}px ${SAFE.x}px`,
        fontFamily: FONT_FAMILY,
        color: textColor,
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: px(120),
          fontWeight: 800,
          letterSpacing: "-0.02em",
          lineHeight: 1.05,
          opacity: titleAnim.presence,
          transform: `translateY(${interpolate(titleAnim.enter, [0, 1], [px(40), 0]) - titleAnim.exit * px(20)}px)`,
        }}
      >
        {title}
      </div>
      <div
        style={{
          width: px(160),
          height: px(4),
          margin: `${px(36)}px 0`,
          backgroundColor: textColor,
          transform: `scaleX(${rule.presence})`,
        }}
      />
      <div
        style={{
          fontSize: px(44),
          fontWeight: 400,
          opacity: subAnim.presence * 0.8,
          transform: `translateY(${interpolate(subAnim.enter, [0, 1], [px(24), 0])}px)`,
        }}
      >
        {subtitle}
      </div>
    </AbsoluteFill>
  );
};
