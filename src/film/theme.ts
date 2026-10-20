// Promo Pulse film identity. Fonts are loaded from public/fonts so rendering
// never touches the network.
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

loadFont({ family: "Inter", url: staticFile("fonts/Inter-Variable.woff2"), weight: "100 900" });
for (const w of ["300", "400", "600", "700"]) {
  loadFont({ family: "Source Sans 3", url: staticFile(`fonts/SourceSans3-${w}.woff2`), weight: w });
}

/** Film typography (headlines, labels, captions). */
export const DISPLAY = "Inter, system-ui, sans-serif";
/** Product UI typography — the prototype's own fallback face. */
export const UI = "'Source Sans 3', Inter, system-ui, sans-serif";

export const F = {
  // Film
  ink0: "#060708", // near-black
  ink1: "#0C0E11", // charcoal
  ink2: "#15181C",
  graphite: "#2A2F36",
  graphite2: "#3A414A",
  mist: "#8C949E",
  paper: "#F4F2EE", // warm white
  paper2: "#E9E6E0",
  cyan: "#2EA8FF",
  cyanSoft: "rgba(46,168,255,.16)",
  amber: "#E8A04A",
  coral: "#E86F55",
  green: "#3CB878",
  white: "#FFFFFF",
};

// Product UI tokens, from "Promo Pulse Prototype.html" (Fiori Horizon light).
export const P = {
  bg: "#F5F6F7",
  surface: "#FFFFFF",
  sunk: "#F2F4F5",
  ink: "#1D2D3E",
  muted: "#556B82",
  line: "#E5E5E5",
  field: "#BCC3CA",
  track: "#E1E6EB",
  accent: "#0064D9",
  accentFill: "#0070F2",
  accentSoft: "#E1F4FF",
  infoLine: "#A6D8FF",
  cpg: "#07838F",
  cpgSoft: "#DAF6F5",
  good: "#256F3A",
  goodSoft: "#F5FAE5",
  posFill: "#30914C",
  warn: "#B44F00",
  warnSoft: "#FFF8D6",
  critFill: "#E76500",
  bad: "#AA0808",
  badSoft: "#FFEAF4",
  negFill: "#D20A0A",
  avatar: "#5D36FF",
  shadow: "0 0 2px rgba(34,53,72,.14),0 2px 4px rgba(34,53,72,.14)",
  shadow2: "0 0 4px rgba(34,53,72,.16),0 8px 16px rgba(34,53,72,.16)",
};
