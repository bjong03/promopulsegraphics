// Google Fonts via @remotion/google-fonts. Loading is handled for you:
// Remotion waits until the font is ready before rendering each frame.
// To switch fonts: import a different one, e.g.
//   import { loadFont } from "@remotion/google-fonts/Montserrat";
// For a local font file, drop it in public/fonts/ and use @remotion/fonts
// (`loadFont({ family, url: staticFile("fonts/MyFont.woff2") })`).
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "600", "800"],
  subsets: ["latin"],
});

export const FONT_FAMILY = fontFamily;
