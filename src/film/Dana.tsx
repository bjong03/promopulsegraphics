// Dana — the film's category manager. An editorial profile illustration built
// from layered vector parts so each can move: hair, face, eye, brow, mouth,
// blazer, blouse, near arm, hands. She faces right (toward her monitor).
//
// Pose controls (all 0–1 unless noted):
//   tension  — 1 = hunched forward, shoulders raised; 0 = upright and relaxed
//   look     — head angle toward the screen in degrees (−4 … 6)
//   typing   — amount of finger/hand motion
//   blink    — 1 = eyes closed
//   rim      — strength of the monitor's cool rim light
//   time     — seconds, drives typing cycles deterministically
import React from "react";

export const DANA = {
  skin: "#B97C5A",
  skinShade: "#93593F",
  skinDeep: "#7A4632",
  lip: "#8A4A3A",
  hair: "#1A1412",
  hairHi: "#3B2B24",
  blazer: "#2C323C",
  blazerNear: "#353C48",
  blazerShade: "#20252D",
  lapel: "#232830",
  blouse: "#E7E1D7",
  blouseShade: "#C9C1B4",
  earring: "#D8B46A",
};

export type DanaPose = {
  tension: number;
  look: number;
  typing: number;
  blink: number;
  rim: number;
  time: number;
};

const H = DANA;

export const Dana: React.FC<{ pose: DanaPose; id: string }> = ({ pose, id }) => {
  const { tension, look, typing, blink, rim, time } = pose;
  // Upper body leans forward around the hip when tense.
  const lean = 1.5 + tension * 5.5;
  const shoulderLift = tension * 10;
  const headTilt = look + tension * 3;
  // Typing: two hands alternate on a slightly irregular deterministic rhythm.
  const tap = (ph: number) => Math.max(0, Math.sin(time * 17 + ph) * Math.sin(time * 5.3 + ph * 2)) * typing;
  const handA = tap(0) * 5;
  const handB = tap(2.1) * 5;
  const breathe = Math.sin(time * 1.6) * 1.2 * (1 - tension * 0.5);
  const rimId = `rim-${id}`;
  const rimSoft = `rimsoft-${id}`;

  return (
    <g>
      <defs>
        <linearGradient id={rimId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0.55" stopColor="#7CC8FF" stopOpacity={0} />
          <stop offset="1" stopColor="#9BD6FF" stopOpacity={0.75 * rim} />
        </linearGradient>
        <linearGradient id={rimSoft} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0.6" stopColor="#5DB6FF" stopOpacity={0} />
          <stop offset="1" stopColor="#5DB6FF" stopOpacity={0.35 * rim} />
        </linearGradient>
      </defs>

      {/* Whole upper body pivots at the hip */}
      <g transform={`rotate(${lean} 400 760) translate(0 ${breathe})`}>
        {/* far arm (mostly hidden behind torso), reaching to keyboard */}
        <path d="M 420 470 C 470 520 500 560 560 586" stroke={H.blazerShade} strokeWidth={40} strokeLinecap="round" fill="none" />
        <g transform={`translate(0 ${-handB})`}>
          <path d="M 556 574 C 580 568 604 570 622 578 C 628 581 627 588 620 589 C 604 592 584 594 562 600 Z" fill={H.skinShade} />
        </g>

        {/* torso / blazer */}
        <g transform={`translate(0 ${-shoulderLift * 0.4})`}>
          <path
            d="M 384 404 C 326 414 292 448 284 506 L 270 760 L 520 760 C 522 680 520 590 506 520 C 496 470 474 436 444 414 Z"
            fill={H.blazer}
          />
          {/* back shading */}
          <path d="M 384 404 C 326 414 292 448 284 506 L 270 760 L 312 760 L 318 520 C 322 470 344 430 384 404 Z" fill={H.blazerShade} opacity={0.8} />
          {/* blouse V */}
          <path d="M 432 404 C 452 420 470 442 482 470 L 462 508 C 452 470 440 440 422 414 Z" fill={H.blouse} />
          <path d="M 432 404 C 446 414 458 428 466 444 L 458 452 C 450 436 440 424 428 414 Z" fill={H.blouseShade} opacity={0.6} />
          {/* lapel */}
          <path d="M 446 414 C 476 440 494 474 500 520 L 488 560 C 478 506 462 470 438 430 Z" fill={H.lapel} />
          {/* rim light on chest edge */}
          <path d="M 444 414 C 474 436 496 470 506 520 C 520 590 522 680 520 760 L 500 760 C 502 680 500 600 488 530 C 480 480 462 446 444 414 Z" fill={`url(#${rimSoft})`} />
        </g>

        {/* neck */}
        <g transform={`translate(${tension * 6} ${-shoulderLift})`}>
          <path d="M 398 336 L 436 340 L 442 414 C 426 422 406 420 390 410 Z" fill={H.skinShade} />
          <path d="M 424 338 L 436 340 L 442 414 C 436 417 430 418 426 418 Z" fill={H.skin} opacity={0.55} />
          <path d="M 400 350 C 414 366 430 370 440 362 L 440 380 C 426 388 410 382 398 368 Z" fill={H.skinDeep} opacity={0.35} />

          {/* head group pivots at the neck */}
          <g transform={`rotate(${headTilt} 418 360)`}>
            {/* back hair mass (behind face) */}
            <path
              d="M 410 128 C 360 130 330 172 324 236 C 318 300 322 352 336 392 C 350 418 378 428 404 424 C 398 404 398 384 404 364 C 372 330 362 280 368 236 Z"
              fill={H.hair}
            />
            {/* face */}
            <path
              d="M 420 150 C 456 152 478 174 482 204 C 484 219 483 228 486 236 C 492 250 500 262 504 272 C 506 278 503 282 497 282 C 493 283 490 285 490 289 C 494 293 496 297 492 300 C 489 303 489 305 491 308 C 494 313 490 318 484 320 C 481 326 485 334 481 341 C 474 352 459 356 446 352 C 438 350 432 354 428 362 L 404 364 C 384 334 372 290 374 240 C 376 190 392 152 420 150 Z"
              fill={H.skin}
            />
            {/* cheek / jaw shading */}
            <path d="M 404 364 C 392 330 386 300 392 270 C 410 300 428 330 440 352 C 434 354 430 358 428 362 Z" fill={H.skinShade} opacity={0.55} />
            {/* rim light along the profile */}
            <path
              d="M 420 150 C 456 152 478 174 482 204 C 484 219 483 228 486 236 C 492 250 500 262 504 272 C 506 278 503 282 497 282 C 493 283 490 285 490 289 C 494 293 496 297 492 300 C 489 303 489 305 491 308 C 494 313 490 318 484 320 C 481 326 485 334 481 341 C 474 352 459 356 446 352 C 438 350 432 354 428 362 L 404 364 C 384 334 372 290 374 240 C 376 190 392 152 420 150 Z"
              fill={`url(#${rimId})`}
            />
            {/* lips */}
            <path d="M 490 290 C 494 293 495 297 492 300 C 488 301 484 300 482 298 C 485 296 487 293 490 290 Z" fill={H.lip} opacity={0.75} />
            <path d="M 491 308 C 493 312 490 317 484 319 C 482 315 483 311 486 309 Z" fill={H.lip} opacity={0.6} />
            {/* mouth line: a little tighter when tense */}
            <path d={`M 491 304 Q ${482 + tension * 2} ${304 + tension * 1.5} 476 ${303 + tension * 2}`} stroke={H.skinDeep} strokeWidth={1.6} fill="none" strokeLinecap="round" />
            {/* nostril */}
            <path d="M 492 276 Q 487 278 485 274" stroke={H.skinDeep} strokeWidth={1.6} fill="none" strokeLinecap="round" opacity={0.7} />
            {/* eye */}
            <g transform={`translate(468 238) scale(1 ${Math.max(0.08, 1 - blink)})`}>
              <path d="M -10 0 Q -1 -7 9 -1 Q 1 5 -10 0 Z" fill="#F3EEE8" />
              <circle cx={3} cy={-1} r={3.6} fill="#2A1B14" />
              <path d="M -11 -1 Q -1 -9 11 -2" stroke={H.hair} strokeWidth={2.4} fill="none" strokeLinecap="round" />
            </g>
            {/* brow: lowers and draws in when tense */}
            <path
              d={`M 454 ${223 + tension * 2} Q 468 ${215 + tension * 3} 482 ${220 + tension * 2}`}
              stroke={H.hair}
              strokeWidth={4.2}
              fill="none"
              strokeLinecap="round"
            />
            {/* front hair: side-swept fringe and length falling behind the ear */}
            <path
              d="M 410 126 C 462 120 498 154 492 210 C 482 196 468 186 452 184 C 440 196 434 214 430 240 C 426 286 418 326 406 362 C 400 380 402 398 410 414 C 386 410 368 392 360 368 C 348 330 346 276 352 226 C 358 170 378 132 410 126 Z"
              fill={H.hair}
            />
            {/* hair sheen */}
            <path d="M 404 140 C 438 136 466 150 480 176 C 458 160 432 154 404 158 C 386 162 374 174 366 192 C 372 166 384 146 404 140 Z" fill={H.hairHi} opacity={0.9} />
            <path d="M 486 196 C 490 204 492 208 492 210 C 486 203 478 198 470 195 Z" fill="#7CC8FF" opacity={0.35 * rim} />
            {/* earring */}
            <circle cx={426} cy={300} r={3.2} fill={H.earring} />
          </g>
        </g>

        {/* near arm: upper arm, forearm, cuff, hand on keyboard */}
        <g transform={`translate(0 ${-shoulderLift * 0.6})`}>
          <path d="M 352 452 C 368 520 384 570 404 606" stroke={H.blazerNear} strokeWidth={60} strokeLinecap="round" fill="none" />
          <path d="M 330 470 C 344 530 360 580 380 616" stroke={H.blazerShade} strokeWidth={14} strokeLinecap="round" fill="none" opacity={0.6} />
        </g>
        <path d="M 404 606 C 450 606 500 602 548 596" stroke={H.blazerNear} strokeWidth={48} strokeLinecap="round" fill="none" />
        <path d="M 404 628 C 450 626 500 622 548 618" stroke={H.blazerShade} strokeWidth={6} strokeLinecap="round" fill="none" opacity={0.7} />
        {/* cuff */}
        <path d="M 552 576 L 566 576 L 568 618 L 552 618 Z" fill={H.blouse} />
        {/* hand */}
        <g transform={`translate(0 ${-handA})`}>
          <path
            d="M 566 580 C 590 574 616 576 636 586 C 646 591 646 600 636 602 C 616 606 594 610 568 616 Z"
            fill={H.skin}
          />
          <path d="M 600 600 C 612 600 624 600 634 600" stroke={H.skinShade} strokeWidth={2} fill="none" />
          <path d="M 566 580 C 590 574 616 576 636 586 C 640 588 642 590 643 592 C 620 584 594 582 566 590 Z" fill="#9BD6FF" opacity={0.25 * rim} />
        </g>
      </g>
    </g>
  );
};
