// Narration subtitles: verbatim voiceover, timed to the recording.
// Kept visually distinct from design headlines (small, sentence case, on a scrim).
import React from "react";
import { p } from "./lib";
import { DISPLAY } from "./theme";
import { CAPTIONS } from "./timeline";

export const Captions: React.FC<{ T: number }> = ({ T }) => {
  const c = CAPTIONS.find((x) => T >= x.from - 0.05 && T < x.to + 0.12);
  if (!c) return null;
  const a = p(T, c.from - 0.05, 0.12) * (1 - p(T, c.to, 0.12));
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 44, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
      <div
        style={{
          maxWidth: 1240,
          textAlign: "center",
          fontFamily: DISPLAY,
          fontSize: 31,
          fontWeight: 500,
          lineHeight: 1.3,
          color: "#FFFFFF",
          background: "rgba(8,10,12,.72)",
          padding: "8px 20px 10px",
          borderRadius: 8,
          opacity: a,
          letterSpacing: "0.005em",
        }}
      >
        {c.text}
      </div>
    </div>
  );
};
