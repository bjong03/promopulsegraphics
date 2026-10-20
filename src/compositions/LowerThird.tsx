import { zColor } from "@remotion/zod-types";
import { AbsoluteFill, interpolate } from "remotion";
import { z } from "zod";
import { COLORS, SAFE, px, sec } from "../config";
import { FONT_FAMILY } from "../fonts";
import { useEnterExit } from "../lib/animation";

export const lowerThirdSchema = z.object({
  name: z.string(),
  role: z.string(),
  barColor: zColor(),
  textColor: zColor(),
});

export type LowerThirdProps = z.infer<typeof lowerThirdSchema>;

export const lowerThirdDefaults: LowerThirdProps = {
  name: "Jane Doe",
  role: "Title / Organization",
  barColor: "#000000",
  textColor: COLORS.text,
};

// No background: renders over transparency, so it can be exported as
// ProRes 4444 and dropped on top of footage.
export const LowerThird: React.FC<LowerThirdProps> = ({
  name,
  role,
  barColor,
  textColor,
}) => {
  const bar = useEnterExit({ enter: sec(0.6), exit: sec(0.5), exitEarly: sec(0.15) });
  const nameAnim = useEnterExit({ enter: sec(0.6), exit: sec(0.35), delay: sec(0.15), exitEarly: sec(0.3) });
  const roleAnim = useEnterExit({ enter: sec(0.6), exit: sec(0.3), delay: sec(0.3), exitEarly: sec(0.4) });
  const accent = useEnterExit({ enter: sec(0.4), exit: sec(0.3) });

  // The bar wipes open left→right, then closes right→left on exit.
  const clipRight = interpolate(bar.presence, [0, 1], [100, 0]);

  return (
    <AbsoluteFill style={{ fontFamily: FONT_FAMILY }}>
      <div
        style={{
          position: "absolute",
          left: SAFE.x,
          bottom: SAFE.y + px(40),
          display: "flex",
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            width: px(8),
            backgroundColor: textColor,
            transform: `scaleY(${accent.presence})`,
          }}
        />
        <div
          style={{
            backgroundColor: barColor,
            padding: `${px(22)}px ${px(36)}px`,
            clipPath: `inset(0 ${clipRight}% 0 0)`,
            color: textColor,
          }}
        >
          <div
            style={{
              fontSize: px(52),
              fontWeight: 600,
              opacity: nameAnim.presence,
              transform: `translateX(${interpolate(nameAnim.enter, [0, 1], [px(-20), 0])}px)`,
            }}
          >
            {name}
          </div>
          <div
            style={{
              fontSize: px(30),
              opacity: roleAnim.presence * 0.75,
              marginTop: px(6),
              transform: `translateX(${interpolate(roleAnim.enter, [0, 1], [px(-20), 0])}px)`,
            }}
          >
            {role}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
