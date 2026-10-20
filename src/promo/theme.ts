// Visual tokens copied from "Promo Pulse Prototype.html" (SAP Fiori Horizon, light theme).
import { loadFont } from "@remotion/google-fonts/SourceSans3";

const { fontFamily } = loadFont("normal", {
  weights: ["300", "400", "600", "700"],
  subsets: ["latin"],
});

export const FONT = fontFamily;

export const C = {
  bg: "#F5F6F7",
  surface: "#FFFFFF",
  sunk: "#F2F4F5",
  hover: "#EAECEE",
  ink: "#1D2D3E",
  muted: "#556B82",
  line: "#E5E5E5",
  field: "#BCC3CA",
  track: "#E1E6EB",
  tick: "#1D2D3E",
  accent: "#0064D9",
  accentFill: "#0070F2",
  accentSoft: "#E1F4FF",
  infoLine: "#A6D8FF",
  accentRing: "rgba(0,112,242,.45)",
  onAccent: "#FFFFFF",
  avatar: "#5D36FF",
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
  toastBg: "#223548",
  toastLink: "#7CC4FF",
  // Brand backdrop for the reveal and the space around the app window.
  navy: "#0B1B2E",
  navy2: "#12304F",
};

export const SHADOW = "0 0 2px rgba(34,53,72,.14),0 2px 4px rgba(34,53,72,.14)";
export const SHADOW2 = "0 0 4px rgba(34,53,72,.16),0 8px 16px rgba(34,53,72,.16)";
