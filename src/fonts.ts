// Fonts are loaded from public/fonts with @remotion/fonts, so rendering never
// needs the network. Remotion waits until the font is ready before each frame.
// To add a font: drop the .woff2 in public/fonts/ and call loadFont again.
// (@remotion/google-fonts is also installed if you prefer fetching from Google,
//  e.g. `import { loadFont } from "@remotion/google-fonts/Montserrat"`.)
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

loadFont({ family: "Inter", url: staticFile("fonts/Inter-Variable.woff2"), weight: "100 900" });

export const FONT_FAMILY = "Inter, system-ui, sans-serif";
