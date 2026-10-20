// CLI/Studio defaults. Applies to `npx remotion render` and `npm run studio`.
// See https://www.remotion.dev/docs/config
import { Config } from "@remotion/cli/config";

// JPEG is faster for opaque MP4 renders. Transparent renders override this
// with --image-format=png on the command line (see README).
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
