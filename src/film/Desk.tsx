// Dana's workspace: a dark room lit by her monitor and a warm desk lamp.
// Coordinates are Dana's local space (she sits around x 280–650); the whole
// scene is placed with `camera` (translate + scale) on the 1920×1080 frame.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Dana, DanaPose } from "./Dana";
import { F } from "./theme";

export type DeskProps = {
  pose: DanaPose;
  /** 0 = tense blue-black room; 1 = calm, warmer, more open light. */
  calm: number;
  /** Screen state: 0 = scattered alert windows; 1 = one organized workspace. */
  order: number;
  /** Flashing alert intensity on the screen (0–1). */
  alarm: number;
  camera: { x: number; y: number; s: number };
  id: string;
};

const Screen: React.FC<{ order: number; alarm: number; time: number }> = ({ order, alarm, time }) => {
  // Screen face in perspective: we see it from Dana's side.
  const chaos = 1 - order;
  return (
    <g>
      <defs>
        <linearGradient id="screenGlow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1B2A3A" />
          <stop offset="1" stopColor="#0E1823" />
        </linearGradient>
        <clipPath id="screenClip">
          <path d="M 790 238 L 968 200 L 968 556 L 790 532 Z" />
        </clipPath>
      </defs>
      {/* stand */}
      <path d="M 872 556 L 884 556 L 892 640 L 864 640 Z" fill="#1A1E24" />
      <path d="M 830 640 L 930 640 L 924 648 L 836 648 Z" fill="#14171C" />
      {/* bezel + face */}
      <path d="M 782 230 L 976 190 L 976 564 L 782 540 Z" fill="#0B0D10" />
      <path d="M 790 238 L 968 200 L 968 556 L 790 532 Z" fill="url(#screenGlow)" />
      <g clipPath="url(#screenClip)">
        {/* chaotic overlapping windows */}
        <g opacity={chaos}>
          <rect x={800} y={250} width={120} height={70} fill="#24384D" />
          <rect x={830} y={300} width={128} height={80} fill="#2A4058" />
          <rect x={806} y={360} width={110} height={90} fill="#22364A" />
          <rect x={846} y={420} width={112} height={70} fill="#2B3F55" />
          <rect x={812} y={262} width={60} height={6} fill="#6E8BA8" />
          <rect x={842} y={312} width={80} height={6} fill="#6E8BA8" />
          <rect x={818} y={372} width={70} height={6} fill="#6E8BA8" />
          <rect x={858} y={432} width={64} height={6} fill="#6E8BA8" />
          <rect x={890} y={330} width={50} height={8} fill={F.coral} opacity={0.5 + 0.5 * alarm * (0.6 + 0.4 * Math.sin(time * 9))} />
        </g>
        {/* calm: one organized workspace */}
        <g opacity={order}>
          <rect x={790} y={200} width={190} height={360} fill="#EEF1F4" />
          <rect x={790} y={200} width={190} height={22} fill="#FFFFFF" />
          <rect x={800} y={232} width={56} height={120} rx={4} fill="#FFFFFF" />
          <rect x={864} y={232} width={96} height={56} rx={4} fill="#FFFFFF" />
          <rect x={864} y={296} width={96} height={56} rx={4} fill="#FFFFFF" />
          <rect x={800} y={360} width={160} height={90} rx={4} fill="#FFFFFF" />
          <rect x={808} y={242} width={30} height={5} fill="#0070F2" />
          <rect x={872} y={242} width={40} height={5} fill="#30914C" />
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x={812 + i * 28} y={430 - [26, 30, 34, 28, 22][i]} width={14} height={[26, 30, 34, 28, 22][i]} fill={i < 3 ? "#0070F2" : "#BCC3CA"} />
          ))}
        </g>
      </g>
      {/* glass sheen */}
      <path d="M 790 238 L 968 200 L 968 260 L 790 300 Z" fill="#FFFFFF" opacity={0.03} />
    </g>
  );
};

export const DeskScene: React.FC<DeskProps> = ({ pose, calm, order, alarm, camera, id }) => {
  const cool = 1 - calm;
  return (
    <AbsoluteFill style={{ background: F.ink0, overflow: "hidden" }}>
      {/* room: very dark, a cool pool from the monitor, a warm pool from the lamp */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 46% 52% at ${camera.x / 19.2 + 32}% 40%, rgba(46,120,200,${0.22 * cool + 0.1}) 0%, rgba(6,7,8,0) 70%),
            radial-gradient(ellipse 40% 40% at 18% 78%, rgba(232,160,74,${0.08 + 0.1 * calm}) 0%, rgba(6,7,8,0) 70%),
            linear-gradient(180deg, ${F.ink1} 0%, ${F.ink0} 100%)`,
        }}
      />
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(${camera.x} ${camera.y}) scale(${camera.s})`}>
          {/* back wall shelf line + window light, far away and soft */}
          <rect x={-600} y={120} width={2400} height={2} fill="#FFFFFF" opacity={0.03} />
          {/* chair back */}
          <path d="M 236 470 C 226 560 228 650 246 760 L 290 760 C 280 650 280 560 292 470 Z" fill="#111418" />
          <Dana pose={pose} id={id} />
          {/* desk */}
          <path d="M 420 640 L 1400 640 L 1400 664 L 420 664 Z" fill="#1C2026" />
          <path d="M 420 640 L 1400 640 L 1400 643 L 420 643 Z" fill="#3A424C" opacity={0.8} />
          <path d="M 420 664 L 1400 664 L 1400 1100 L 420 1100 Z" fill="#0D0F12" />
          {/* keyboard */}
          <path d="M 540 628 L 760 628 L 766 640 L 534 640 Z" fill="#2A3038" />
          <path d="M 548 630 L 752 630 L 754 633 L 546 633 Z" fill="#4A535E" opacity={0.6} />
          {/* coffee cup — a quiet human detail */}
          <path d="M 1050 600 L 1086 600 L 1082 640 L 1054 640 Z" fill="#E7E1D7" opacity={0.85} />
          <path d="M 1086 608 C 1100 608 1100 628 1084 628" stroke="#E7E1D7" strokeWidth={4} fill="none" opacity={0.85} />
          {/* lamp */}
          <path d="M 1240 640 L 1290 640 L 1284 632 L 1246 632 Z" fill="#20252C" />
          <path d="M 1265 632 L 1250 470 L 1258 468 L 1272 632 Z" fill="#20252C" />
          <path d="M 1196 450 L 1270 430 L 1282 470 L 1214 492 Z" fill="#262C34" />
          <path d="M 1214 492 L 1282 470 L 1286 476 L 1218 498 Z" fill={F.amber} opacity={0.5 + 0.3 * calm} />
          <Screen order={order} alarm={alarm} time={pose.time} />
          {/* light spill from the screen onto the desk */}
          <ellipse cx={760} cy={646} rx={240} ry={10} fill="#5DB6FF" opacity={0.08 + 0.05 * cool} />
        </g>
      </svg>
      {/* vignette */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 75% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,.65) 100%)" }} />
    </AbsoluteFill>
  );
};
