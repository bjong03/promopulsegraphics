# Promo Pulse Graphics

Motion graphics built with [Remotion](https://www.remotion.dev) (React + TypeScript),
exported as files you can drop into any video editor (Premiere, Resolve, Final Cut,
After Effects, CapCut…).

The four starter graphics are deliberately plain — neutral colors, one font, simple
moves — so you can take the look in your own direction.

## Setup

```bash
npm install
npm run studio      # live preview at http://localhost:3000
```

Requires Node 18+. The first render downloads a headless Chrome automatically.

## Project layout

```
remotion.config.ts        CLI/Studio defaults
src/
  index.ts                entry point (registerRoot) — leave as is
  Root.tsx                registers every composition (id, size, fps, schema, defaultProps)
  config.ts               ★ WIDTH / HEIGHT / FPS, sec(), px(), title-safe area, colors
  fonts.ts                Google Font loading (@remotion/google-fonts)
  lib/animation.ts        useEnterExit() — spring in, eased out, 0 on first & last frame
  compositions/           one file per graphic
    TitleCard.tsx         full-frame title + subtitle
    LowerThird.tsx        name/role bar          (transparent background)
    KineticText.tsx       word-by-word text
    OverlayBadge.tsx      badge + sound effect   (transparent background)
public/                   static assets → reference with staticFile("…")
  fonts/  images/  audio/
out/                      renders (git-ignored)
```

## Promo Pulse — 60-second film (`PromoPulseFilm`)

The competition film: 1920×1080, 30 fps, exactly 1,800 frames. Every visual is
drawn in React/SVG/CSS (no footage, screenshots or stock), and it renders
fully offline: fonts and audio are local files.

```bash
npm run studio                       # pick "PromoPulseFilm"
npx remotion render PromoPulseFilm out/PromoPulseFilm.mp4 --codec=h264 --crf=18
```

| Time      | Scene                                                                      |
| --------- | -------------------------------------------------------------------------- |
| 0 – 12.6  | Dana at her desk; late alerts, email negotiation, conflicting store plans; freeze + silence |
| 12.6 – 18 | Chilled shelf: the at-risk yogurt and its shrinking selling window          |
| 18 – 23   | Dana among the pieces → they align → Promo Pulse → pieces land in the app   |
| 23 – 46   | One promotion through Suggest → Compare → Approve → Execute → record → Monitor |
| 46 – 52   | One workspace among many → ≈ C$79M modeled annual value potential           |
| 52 – 60   | Dana, calm → end card                                                       |

**Code** (`src/film/`): `timeline.ts` (every scene/beat time, voiceover
placement, captions, sound cues), `Dana.tsx` (layered vector character with
tension / look / typing / blink controls), `Desk.tsx`, `Fragments.tsx`
(report, alert, emails, spreadsheet, store task, plan versions), `Shelf.tsx`,
`Type.tsx` (headlines, lower third, labels), `app/` (the Promo Pulse UI:
Suggest, Execute and Monitor pages on one camera strip), `scenes/`,
`Captions.tsx`, `Soundtrack.tsx`.

**Data**: interface figures come from `Promo Pulse Prototype.html`. The yogurt
deal's Execute/Monitor numbers were produced by the prototype's own model
(send → launch → "Simulate next day" ×3). See `src/film/app/data.ts`.
The C$79M figure is the modeled full-rollout scenario from the narration script
and is always labelled "modeled", never as an achieved result.

**Audio**

- Voiceover: the four recorded clips in `public/audio/vo/` (originals `.m4a`),
  level-matched copies in `public/audio/vo/matched/` (plain gain, see
  `scripts/normalize_vo.py`). Clip 1 is split at its natural pause to create the
  freeze-frame silence. Placement lives in `VO_CLIPS` in `timeline.ts`.
- Score and sound effects are original, synthesized by
  `python3 scripts/generate_audio.py` (numpy, fixed seed) into
  `public/audio/music/score.wav` and `public/audio/sfx/`. The score ducks under
  the narration automatically.
- Props in the Studio toggle `voiceover`, `music`, `sfx`, `captions` and set
  `musicVolume`.

**Re-recording a line**: replace the clip, re-run the normalize step, then
update `VO_CLIPS`, `CAPTIONS` and (if timing moved) `BEAT` in `timeline.ts`.

## Promo Pulse pitch video (27 s)

A 27-second reveal + product demo built from `Promo Pulse Prototype.html` — same
SAP Fiori styling, screens and figures (Greek yogurt trigger, Brightfield Dairy
playbook, orange-juice Monitor view).

| Composition        | Length | What it is                                                        |
| ------------------ | ------ | ----------------------------------------------------------------- |
| `PromoPulsePitch`  | 27 s   | Everything below, cross-faded, with optional voiceover            |
| `PromoPulseReveal` | 7 s    | Logo reveal + tagline ("Meet Promo Pulse…")                       |
| `PromoPulseDemo`   | 18.4 s | App walkthrough in five captioned beats                           |
| `PromoPulseEnd`    | 2.6 s  | Closing lockup                                                    |

```bash
npx remotion render PromoPulsePitch out/PromoPulsePitch.mp4 --codec=h264 --crf=18
```

**Syncing to your voiceover**

1. Put the recording in `public/audio/`, e.g. `public/audio/voiceover.mp3`.
2. In the Studio, open `PromoPulsePitch` and set the `voiceover` prop to
   `audio/voiceover.mp3` (use `voiceoverOffset` to nudge it earlier/later).
3. Scrub and adjust the beat times in `src/promo/timing.ts` — each value is the
   second a line of the voiceover starts. Every animation, camera move and caption
   follows them. Turn `showCaptions` off for a full-height app window.

Code lives in `src/promo/`: `data.ts` (figures from the prototype), `theme.ts`
(Fiori tokens), `SuggestView.tsx` / `MonitorView.tsx` (screens), `Demo.tsx`
(window, camera keyframes, captions, toasts), `Reveal.tsx`, `EndCard.tsx`.

## Preview & live editing

`npm run studio` opens Remotion Studio. Pick a composition in the left sidebar, scrub
the timeline, and edit props in the right-hand **Props** panel — every graphic has a
zod schema, so text fields, color pickers, sliders and dropdowns are generated
automatically. Hit **Save** in the panel to write new defaults back into the code.

Tip: toggle the checkerboard (transparency) button under the preview to see the alpha
on overlays.

## Changing resolution / fps

Everything reads from `src/config.ts`:

```ts
export const WIDTH = 3840;   // 4K
export const HEIGHT = 2160;
export const FPS = 60;
```

Timing is written in seconds with `sec(1.5)` and sizes with `px(120)` (authored at
1920 wide), so animations keep the same speed and proportions when you switch.
A single render can also be overridden on the fly with `--scale=2` (1080p → 4K).

## Adding a new graphic

1. **Create the component** — `src/compositions/MyGraphic.tsx`:

   ```tsx
   import { zColor } from "@remotion/zod-types";
   import { AbsoluteFill } from "remotion";
   import { z } from "zod";
   import { px, sec } from "../config";
   import { FONT_FAMILY } from "../fonts";
   import { useEnterExit } from "../lib/animation";

   export const myGraphicSchema = z.object({
     text: z.string(),
     color: zColor(),
   });
   export type MyGraphicProps = z.infer<typeof myGraphicSchema>;
   export const myGraphicDefaults: MyGraphicProps = { text: "Hello", color: "#ffffff" };

   export const MyGraphic: React.FC<MyGraphicProps> = ({ text, color }) => {
     const { presence } = useEnterExit({ enter: sec(0.6), exit: sec(0.4) });
     return (
       <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
         <div style={{ fontFamily: FONT_FAMILY, fontSize: px(96), color, opacity: presence }}>
           {text}
         </div>
       </AbsoluteFill>
     );
   };
   ```

   Leave out a `backgroundColor` on the root `AbsoluteFill` if it should be an overlay.

2. **Register it** in `src/Root.tsx`:

   ```tsx
   <Composition
     id="MyGraphic"                 // used in render commands; letters, numbers, hyphens
     component={MyGraphic}
     durationInFrames={sec(4)}
     width={WIDTH} height={HEIGHT} fps={FPS}   // or {...canvas}; override for e.g. 1080x1920
     schema={myGraphicSchema}
     defaultProps={myGraphicDefaults}
   />
   ```

3. It appears in the Studio immediately.

### Animation building blocks

- `useCurrentFrame()` — the current frame number; everything is a function of it.
- `interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })` — map a range of frames to any value.
- `spring({ frame, fps, config: { damping: 200 } })` — natural 0 → 1 motion (lower damping = bouncier).
- `useEnterExit()` (in `src/lib/animation.ts`) — combines both into `enter`, `exit` and `presence` values that are guaranteed 0 on the first and last frame.
- `<Sequence from={sec(1)}>` — delay or time-box anything (including audio).

## Rendering / export

Replace `<id>` with a composition id (`TitleCard`, `LowerThird`, `KineticText`, `OverlayBadge`).

**MP4 (H.264)** — opaque graphics, previews, social:

```bash
npx remotion render <id> out/<id>.mp4 --codec=h264 --crf=18
```

**Transparent ProRes 4444 (.mov with alpha)** — overlays for your editor:

```bash
npx remotion render <id> out/<id>.mov --codec=prores \
  --prores-profile=4444 --pixel-format=yuva444p10le --image-format=png
```

**PNG sequence (with alpha)**:

```bash
npx remotion render <id> out/<id> --sequence --image-format=png \
  --image-sequence-pattern="frame-[frame].[ext]"
```

> Note: in current Remotion an output path ending in `/frame-%04d.png` is treated as a
> video filename and fails — use `--sequence` with a folder and `--image-sequence-pattern`
> as above. Files come out as `out/<id>/frame-000.png`, `frame-001.png`, …

Other useful flags: `--scale=2` (render at 2× size), `--frames=0-59` (partial range),
`--props='{"title":"Launch Day"}'` (override props without editing code), and
`npx remotion still <id> out/<id>.png --frame=60` for a single frame.

MP4/H.264 has **no alpha** — use ProRes 4444 or PNG for anything transparent.

## Fonts

Fonts are local files in `public/fonts/` (Inter and Source Sans 3, both SIL Open
Font License), loaded with `@remotion/fonts`, so renders never need the network.
`src/fonts.ts` loads **Inter** for the starter graphics — every one uses
`FONT_FAMILY`. To change it, drop a `.woff2` in `public/fonts/` and point
`loadFont` at it (or use `@remotion/google-fonts` if fetching from Google is fine).
Remotion waits for the font before rendering each frame, so no fallback-font flashes.

## Sound effects

`OverlayBadge.tsx` shows the pattern — a `<Sequence>` decides **when** the sound plays:

```tsx
import { Audio, Sequence, staticFile } from "remotion";

<Sequence from={sec(0.5)} durationInFrames={sec(1)} layout="none">
  <Audio src={staticFile("audio/pop.wav")} volume={0.6} />
</Sequence>
```

Put files in `public/audio/`. `pop.wav` is a generated placeholder — replace it.
Audio is included in MP4 and ProRes renders. (If you'd rather sync sound in your
editor, toggle `playSound` off in the Props panel.)

## Tips

- **Keep text in the title-safe area.** `SAFE` in `config.ts` is a 5% margin on every
  side; position text with it so nothing gets cropped by TVs, social crops or player UI.
- **Always give animations a full enter and exit.** Every element should start and end
  invisible (opacity/scale 0, or off-screen) so the clip never pops on or cuts off
  mid-move in your edit. `useEnterExit` does this; check the first and last frame in
  the Studio.
- **Trim leading silence on sound effects.** Any silence at the start of a file delays
  the hit, so it won't land on the frame you placed it on. Trim it in an audio editor.
- Keep a little hold time between the enter and exit so viewers can read the text
  (roughly: 1 second + 0.3s per word).
- Render a quick MP4 to check timing, then render ProRes/PNG for the final overlay.
