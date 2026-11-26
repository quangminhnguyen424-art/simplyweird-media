import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, interpolateColors, spring, random} from 'remotion';
import {FPS, INK, PINK, YEL, TEAL, ORG, CREAM, SKY, RED, clamp, ease, Slam, Pill, Huh, Arrow, CTA, SceneMap} from '../../kit';
import timing from './timing.json';

export const title = 'how noise-cancelling headphones work';
export const segs = timing;

const OUT = `0 8px 0 ${INK}`, PURPLE = '#9b5cff', INDIGO = '#5b6cff', BROWN = '#C8743A', LEAF = '#3BB273',
  SHELL = '#2B2F4A', SHELL2 = '#3D4266', FOAM = '#C9CEE6', SKIN = '#F4C7A1', METAL = '#B8C2D6';

/* ---------- helpers ---------- */

/** Horizontal wave path from x0 to x1 around y. fn(x) returns the offset at x. */
const wpath = (x0: number, x1: number, y: number, fn: (x: number) => number, step = 5) => {
  const pts: string[] = [];
  for (let x = x0; x <= x1; x += step) pts.push(`${x.toFixed(1)} ${(y + fn(x)).toFixed(1)}`);
  return 'M ' + pts.join(' L ');
};

/** The "noise": a lumpy, irregular wave so its flipped twin is easy to see. */
const noise = (x: number, p: number) => Math.sin(x / 55 - p) + 0.55 * Math.sin(x / 21 - 1.7 * p + 1);

/* ---------- illustrations ---------- */

/** Side-view airliner, nose to the right, centred on (0,0). Draw inside an <svg>. */
const Plane: React.FC<{s?: number}> = ({s = 1}) => (
  <g transform={`scale(${s})`}>
    <path d="M -330 -10 L -390 -130 L -330 -130 L -250 -40 Z" fill={SKY} stroke={INK} strokeWidth={10} strokeLinejoin="round" />
    <path d="M -360 -30 Q -360 -60 -300 -60 L 280 -60 Q 400 -60 420 0 Q 400 60 280 60 L -300 60 Q -360 60 -360 30 Z" fill="#F2F4FA" stroke={INK} strokeWidth={10} />
    <path d="M 330 -40 Q 380 -38 398 -10 L 340 -10 Z" fill={INK} />
    {Array.from({length: 9}).map((_, i) => <circle key={i} cx={-230 + i * 55} cy={-18} r={11} fill={SKY} stroke={INK} strokeWidth={4} />)}
    <path d="M -60 20 L 60 20 L -120 150 L -190 150 Z" fill={METAL} stroke={INK} strokeWidth={9} strokeLinejoin="round" />
    <rect x={-120} y={78} width={130} height={56} rx={28} fill="#8C99B5" stroke={INK} strokeWidth={9} />
    <ellipse cx={-118} cy={106} rx={12} ry={24} fill={INK} />
  </g>
);

/** Simple head (front view) with optional over-ear headphones. Draw inside an <svg>. */
const Head: React.FC<{x: number; y: number; r?: number; calm: number; phones: number; squish?: number}> = ({x, y, r = 190, calm, phones, squish = 0}) => {
  const f = useCurrentFrame();
  const drop = (1 - phones) * -500;
  const cupW = 70 * (1 - squish * 0.2);
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill={SKIN} stroke={INK} strokeWidth={11} />
      <path d={`M ${-r + 10} -40 Q ${-r + 20} ${-r - 30} 0 ${-r - 20} Q ${r - 20} ${-r - 30} ${r - 10} -40 Q ${r * 0.5} ${-r * 0.75} 0 ${-r * 0.8} Q ${-r * 0.5} ${-r * 0.75} ${-r + 10} -40 Z`} fill={INK} />
      {calm < 0.5 ? (
        <g>
          <path d="M -95 -20 l 50 20 l -50 20" fill="none" stroke={INK} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 95 -20 l -50 20 l 50 20" fill="none" stroke={INK} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" />
          <path d={`M -60 85 l 20 -16 l 20 16 l 20 -16 l 20 16 l 20 -16 l 20 16`} fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" transform={`translate(0 ${Math.sin(f) * 3})`} />
        </g>
      ) : (
        <g>
          <path d="M -100 0 Q -70 22 -40 0" fill="none" stroke={INK} strokeWidth={10} strokeLinecap="round" />
          <path d="M 40 0 Q 70 22 100 0" fill="none" stroke={INK} strokeWidth={10} strokeLinecap="round" />
          <path d="M -40 70 Q 0 100 40 70" fill="none" stroke={INK} strokeWidth={10} strokeLinecap="round" />
        </g>
      )}
      <circle cx={-115} cy={45} r={22} fill={PINK} opacity={0.45} /><circle cx={115} cy={45} r={22} fill={PINK} opacity={0.45} />
      <g transform={`translate(0 ${drop})`} opacity={phones > 0.01 ? 1 : 0}>
        <path d={`M ${-r - 10} -10 Q ${-r - 10} ${-r - 90} 0 ${-r - 90} Q ${r + 10} ${-r - 90} ${r + 10} -10`} fill="none" stroke={INK} strokeWidth={44} strokeLinecap="round" />
        <path d={`M ${-r - 10} -10 Q ${-r - 10} ${-r - 90} 0 ${-r - 90} Q ${r + 10} ${-r - 90} ${r + 10} -10`} fill="none" stroke={PINK} strokeWidth={24} strokeLinecap="round" />
        {[-1, 1].map((side) => (
          <g key={side}>
            <rect x={side < 0 ? -r - 20 - cupW * 0.5 : r - 20 + cupW * 0.5 - 30} y={-90} width={40} height={180} rx={20} fill={FOAM} stroke={INK} strokeWidth={9} />
            <rect x={side < 0 ? -r - 40 - cupW - 10 : r + 30} y={-110} width={cupW + 10} height={220} rx={36} fill={PINK} stroke={INK} strokeWidth={11} />
          </g>
        ))}
      </g>
    </g>
  );
};

/** Side view of one big ear cup. Mic grille on the outside (left). Draw inside an <svg>. */
const Cup: React.FC<{x: number; y: number; led: boolean}> = ({x, y, led}) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M 0 -280 Q 0 -540 220 -560" fill="none" stroke={INK} strokeWidth={48} strokeLinecap="round" />
    <path d="M 0 -280 Q 0 -540 220 -560" fill="none" stroke={PINK} strokeWidth={26} strokeLinecap="round" />
    <rect x={-170} y={-300} width={340} height={600} rx={170} fill={PINK} stroke={INK} strokeWidth={14} />
    <rect x={-120} y={-250} width={240} height={500} rx={120} fill="#E04A78" />
    <rect x={150} y={-270} width={70} height={540} rx={35} fill={FOAM} stroke={INK} strokeWidth={12} />
    {/* mic grille */}
    <circle cx={-70} cy={-150} r={52} fill={SHELL} stroke={INK} strokeWidth={10} />
    {Array.from({length: 9}).map((_, i) => <circle key={i} cx={-70 + ((i % 3) - 1) * 22} cy={-150 + (Math.floor(i / 3) - 1) * 22} r={6} fill="#9aa3c7" />)}
    <circle cx={-70} cy={-70} r={14} fill={led ? RED : '#5a2230'} stroke={INK} strokeWidth={5} />
  </g>
);

/** Little square chip with pins. Draw inside an <svg>. */
const Chip: React.FC<{x: number; y: number; s?: number; glow?: number}> = ({x, y, s = 1, glow = 0}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {Array.from({length: 5}).map((_, i) => (
      <g key={i}>
        <rect x={-80 + i * 34 - 6} y={-110} width={12} height={30} fill={METAL} stroke={INK} strokeWidth={4} />
        <rect x={-80 + i * 34 - 6} y={80} width={12} height={30} fill={METAL} stroke={INK} strokeWidth={4} />
        <rect x={-110} y={-80 + i * 34 - 6} width={30} height={12} fill={METAL} stroke={INK} strokeWidth={4} />
        <rect x={80} y={-80 + i * 34 - 6} width={30} height={12} fill={METAL} stroke={INK} strokeWidth={4} />
      </g>
    ))}
    <rect x={-90} y={-90} width={180} height={180} rx={20} fill={SHELL} stroke={INK} strokeWidth={10} />
    <rect x={-60} y={-60} width={120} height={120} rx={12} fill={interpolateColors(glow, [0, 1], [SHELL2, TEAL])} />
    <text x={0} y={18} textAnchor="middle" fontFamily="B8" fontSize={50} fill="#fff">CHIP</text>
  </g>
);

/* ---------- scenes ---------- */

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const phones = spring({frame: f - 95, fps: FPS, config: {damping: 12}});
  const quiet = interpolate(f, [100, 150], [0, 1], {...clamp, easing: ease});
  const shake = (1 - quiet) * Math.sin(f * 2.3) * 7;
  return (
    <AbsoluteFill>
      {f < 140 ? <Slam words={['ROAR!']} at={0} y={140} size={150} color={RED} /> : <Slam words={['SOUND', 'VS', 'SOUND']} at={140} y={160} size={98} gap={8} />}
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        <g transform={`translate(${540 + Math.sin(f / 30) * 20} ${470 + Math.sin(f / 18) * 8})`}><Plane s={1.05} /></g>
        {/* noise ripples from the engine */}
        {Array.from({length: 5}).map((_, k) => {
          const r = ((f * 7 + k * 110) % 550) + 40;
          const o = (1 - r / 600) * (1 - quiet);
          return <path key={k} d={`M ${410 - r} ${590 + r * 0.25} A ${r} ${r * 0.8} 0 0 0 ${410 + r} ${590 + r * 0.25}`} fill="none" stroke={RED} strokeWidth={14}
            strokeDasharray="34 20" opacity={Math.max(0, o)} strokeLinecap="round" />;
        })}
        <g transform={`translate(${shake} 0)`}><Head x={470} y={1080} r={170} calm={quiet} phones={phones} /></g>
        {quiet > 0.3 && [0, 1].map((i) => (
          <text key={i} x={700 + i * 50} y={850 - i * 60 - (f % 40)} fontFamily="B8" fontSize={60 + i * 16} fill="#fff" opacity={quiet * 0.8}>z</text>
        ))}
      </svg>
      {f < 120 && <Pill text="🔊 so loud" x={200} y={800} at={20} bg={RED} size={46} />}
      <Huh mood="shocked" x={900} y={1110} h={280} at={160} />
    </AbsoluteFill>
  );
};

const Wave: React.FC = () => {
  const f = useCurrentFrame();
  const on = interpolate(f, [5, 35], [0, 1], {...clamp, easing: ease});
  const p = f / 5;
  const A = 26 * on, L = 260;
  const disp = (x0: number) => A * Math.sin((2 * Math.PI * x0) / L - p);
  const drum = Math.sin((2 * Math.PI * 860) / L - p) * 14 * on;
  const graph = interpolate(f, [60, 110], [0, 1], {...clamp, easing: ease});
  return (
    <AbsoluteFill>
      <Slam words={['PRESSURE', 'WAVE']} at={0} y={150} size={115} gap={8} />
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        {/* speaker on the left */}
        <path d="M 40 470 L 110 470 L 170 400 L 170 760 L 110 690 L 40 690 Z" fill={SHELL2} stroke={INK} strokeWidth={10} strokeLinejoin="round" transform={`translate(${disp(170) * 0.4} 0)`} />
        {/* air particles */}
        {Array.from({length: 15}).map((_, i) => Array.from({length: 6}).map((__, j) => {
          const x0 = 210 + i * 44 + (j % 2) * 22, y = 430 + j * 58;
          return <circle key={i + '-' + j} cx={x0 + disp(x0)} cy={y} r={11} fill={[SKY, '#fff', YEL][(i + j) % 3]} stroke={INK} strokeWidth={4} />;
        }))}
        {/* ear + eardrum */}
        <path d="M 930 420 Q 1060 430 1050 590 Q 1040 720 950 760" fill={SKIN} stroke={INK} strokeWidth={10} />
        <path d={`M 905 470 Q ${905 + drum} 580 905 690`} fill="none" stroke={PINK} strokeWidth={16} strokeLinecap="round" />
        {/* pressure graph */}
        <line x1={120} y1={1060} x2={960} y2={1060} stroke="#ffffff55" strokeWidth={4} strokeDasharray="14 12" />
        <path d={wpath(120, 120 + 840 * graph, 1060, (x) => -Math.cos((2 * Math.PI * x) / L - p) * 120)} fill="none" stroke={YEL} strokeWidth={14} strokeLinecap="round" />
      </svg>
      <Pill text="squeeze ↑" x={260} y={880} at={75} bg={PINK} size={44} />
      <Pill text="stretch ↓" x={800} y={1260} at={110} bg={SKY} color={INK} size={44} />
      <Pill text="eardrum 👂" x={880} y={360} at={160} bg={TEAL} size={40} />
    </AbsoluteFill>
  );
};

const Mic: React.FC = () => {
  const f = useCurrentFrame();
  const cup = spring({frame: f - 3, fps: FPS, config: {damping: 11}});
  const inP = interpolate(f, [20, 60], [0, 1], {...clamp, easing: ease});
  const notes = interpolate(f, [70, 190], [0, 1], clamp);
  const led = f > 40 && Math.floor(f / 8) % 2 === 0;
  return (
    <AbsoluteFill>
      <Slam words={['LISTEN', 'UP']} at={0} y={140} size={120} gap={8} />
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        {/* incoming noise */}
        {[0, 1, 2].map((i) => {
          const y = 480 + i * 90;
          return <path key={i} d={wpath(0, 20 + 300 * inP, y, (x) => noise(x, f / 4 + i) * 16 * (1 - x / 500))} fill="none" stroke={YEL} strokeWidth={9} strokeLinecap="round" opacity={inP} />;
        })}
        <g transform={`translate(470 900) scale(${cup}) translate(-470 -900)`}><Cup x={470} y={900} led={led} /></g>
        {/* spy notepad */}
        <g transform={`translate(780 500) rotate(${4 + Math.sin(f / 15) * 2})`}>
          <rect x={0} y={0} width={250} height={330} rx={16} fill={CREAM} stroke={INK} strokeWidth={10} />
          <rect x={0} y={0} width={250} height={50} rx={16} fill={TEAL} stroke={INK} strokeWidth={10} />
          {[0, 1, 2].map((i) => (
            <path key={i} d={wpath(25, 225, 110 + i * 80, (x) => noise(x * 2, i) * 16)} fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round"
              pathLength={1} strokeDasharray={1} strokeDashoffset={1 - interpolate(notes * 3, [i, i + 1], [0, 1], clamp)} />
          ))}
        </g>
      </svg>
      <Pill text="mic on the outside 🎤" x={330} y={1300} at={45} bg={TEAL} size={44} />
      <Pill text="taking notes 🕵️" x={905} y={910} at={90} bg={YEL} color={INK} size={38} />
      <Huh mood="curious" x={890} y={1080} h={300} at={130} />
    </AbsoluteFill>
  );
};

const Flip: React.FC = () => {
  const f = useCurrentFrame();
  const p = f / 6;
  const top = interpolate(f, [0, 25], [0, 1], {...clamp, easing: ease});
  const chip = spring({frame: f - 20, fps: FPS, config: {damping: 10}});
  const flip = interpolate(f, [70, 115], [1, -1], {...clamp, easing: ease});
  const bot = interpolate(f, [50, 70], [0, 1], clamp);
  return (
    <AbsoluteFill>
      {f < 140 ? <Pill text="the exact opposite 🙃" x={540} y={210} at={0} bg={PINK} size={58} /> : <Slam words={['ANTI-NOISE']} at={140} y={150} size={130} color={PINK} />}
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        <rect x={60} y={330} width={960} height={250} rx={30} fill="#ffffff12" stroke="#ffffff44" strokeWidth={4} />
        <path d={wpath(90, 90 + 900 * top, 455, (x) => -noise(x, p) * 62)} fill="none" stroke={YEL} strokeWidth={13} strokeLinecap="round" />
        <Arrow d="M 540 600 L 540 640" progress={chip} w={12} color="#fff" />
        <Chip x={540} y={755} s={chip * 0.9} glow={interpolate(f, [70, 115], [0, 1], clamp)} />
        <Arrow d="M 540 870 L 540 910" progress={bot} w={12} color="#fff" />
        <rect x={60} y={930} width={960} height={250} rx={30} fill="#ffffff12" stroke="#ffffff44" strokeWidth={4} opacity={bot} />
        <path d={wpath(90, 990, 1055, (x) => -noise(x, p) * 62 * flip)} fill="none" stroke={PINK} strokeWidth={13} strokeLinecap="round" opacity={bot} />
      </svg>
      <Pill text="noise" x={170} y={360} at={10} bg={YEL} color={INK} size={38} />
      <Pill text="peak ↔ dip" x={860} y={1240} at={115} bg="#fff" color={INK} size={42} />
      <Pill text="anti-noise" x={200} y={960} at={110} bg={PINK} size={38} />
    </AbsoluteFill>
  );
};

const Cancel: React.FC = () => {
  const f = useCurrentFrame();
  const p = f / 6;
  const anti = interpolate(f, [25, 110], [0, 1], {...clamp, easing: ease});
  const show = (at: number) => interpolate(f, [at, at + 15], [0, 1], clamp);
  const bars = Math.round(10 * (1 - anti * 0.85));
  return (
    <AbsoluteFill>
      {f < 125 ? <Pill text="peak + dip = 0" x={540} y={210} at={0} bg={YEL} color={INK} size={58} /> : <Slam words={['SHHH...']} at={125} y={150} size={140} color={TEAL} />}
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        <path d={wpath(140, 940, 400, (x) => -noise(x, p) * 50)} fill="none" stroke={YEL} strokeWidth={12} strokeLinecap="round" opacity={show(0)} />
        <text x={70} y={420} fontFamily="B8" fontSize={70} fill="#fff" opacity={show(0)}>🔊</text>
        <text x={540} y={545} textAnchor="middle" fontFamily="B8" fontSize={100} fill="#fff" opacity={show(10)}>+</text>
        <path d={wpath(140, 940, 640, (x) => noise(x, p) * 50 * anti)} fill="none" stroke={PINK} strokeWidth={12} strokeLinecap="round" opacity={show(10)} />
        <text x={540} y={790} textAnchor="middle" fontFamily="B8" fontSize={100} fill="#fff" opacity={show(20)}>=</text>
        <path d={wpath(140, 940, 890, (x) => -noise(x, p) * 50 * (1 - anti))} fill="none" stroke="#fff" strokeWidth={16} strokeLinecap="round" opacity={show(20)} />
        {/* volume meter */}
        {Array.from({length: 10}).map((_, i) => (
          <rect key={i} x={140 + i * 58} y={1150 - i * 12} width={42} height={80 + i * 12} rx={8}
            fill={i < bars ? interpolateColors(i, [0, 5, 9], [LEAF, YEL, RED]) : '#ffffff22'} stroke={INK} strokeWidth={5} />
        ))}
      </svg>
      <div style={{position: 'absolute', left: 140, top: 1000, fontFamily: 'B8', fontSize: 52, color: '#fff', textShadow: OUT}}>drone volume</div>
      <Huh mood="laughing" x={900} y={1000} h={280} at={130} />
    </AbsoluteFill>
  );
};

const Check: React.FC = () => {
  const f = useCurrentFrame();
  const sneak = interpolate(f, [15, 70], [0, 1], {...clamp, easing: ease});
  const fix = interpolate(f, [120, 175], [0, 1], {...clamp, easing: ease});
  const loop = f > 80 ? ((f - 80) % 45) / 45 : 0;
  const ping = f > 75 ? ((f - 75) % 30) / 30 : 0;
  return (
    <AbsoluteFill>
      <Slam words={['DOUBLE', 'CHECK']} at={0} y={140} size={115} gap={8} />
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        {/* cup cross-section */}
        <path d="M 640 360 L 300 360 Q 130 360 130 560 L 130 1000 Q 130 1200 300 1200 L 640 1200" fill={SHELL} stroke={INK} strokeWidth={14} />
        <rect x={620} y={340} width={70} height={130} rx={30} fill={FOAM} stroke={INK} strokeWidth={10} />
        <rect x={620} y={1090} width={70} height={130} rx={30} fill={FOAM} stroke={INK} strokeWidth={10} />
        {/* ear */}
        <path d="M 980 520 Q 760 520 760 780 Q 760 1040 980 1040" fill={SKIN} stroke={INK} strokeWidth={12} />
        <path d="M 920 640 Q 840 650 840 780 Q 840 900 920 910" fill="none" stroke="#D99B78" strokeWidth={12} strokeLinecap="round" />
        {/* speaker */}
        <circle cx={360} cy={780} r={130} fill="#596085" stroke={INK} strokeWidth={10} />
        <circle cx={360} cy={780} r={60} fill={SHELL2} stroke={INK} strokeWidth={8} />
        {/* inner mic */}
        <circle cx={560} cy={560} r={70 * ping + 34} fill="none" stroke={TEAL} strokeWidth={6} opacity={(1 - ping) * (f > 75 ? 1 : 0)} />
        <rect x={530} y={530} width={60} height={60} rx={14} fill={TEAL} stroke={INK} strokeWidth={8} />
        {/* sneaky leftover noise */}
        <path d={wpath(130, 130 + 560 * sneak, 1300, (x) => noise(x * 1.5, f / 3) * 14 * (1 - fix))} fill="none" stroke={YEL} strokeWidth={9} strokeLinecap="round"
          transform="translate(0 -70) rotate(-28 400 1300)" opacity={sneak} />
        {/* feedback loop */}
        {f > 80 && <Arrow d="M 560 610 Q 600 760 470 780" progress={Math.min(1, loop * 1.6)} w={10} color={PINK} />}
        <g transform={`translate(850 1130) scale(${fix})`}><circle r={55} fill={LEAF} stroke={INK} strokeWidth={8} /><path d="M -25 2 l 18 20 l 32 -40" fill="none" stroke="#fff" strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" /></g>
      </svg>
      <Pill text="mic #2 inside 🔍" x={560} y={460} at={60} bg={TEAL} size={42} />
      <Pill text="leftovers?" x={260} y={1290} at={40} bg={YEL} color={INK} size={40} />
      <Pill text="fixed on the fly" x={830} y={1300} at={140} bg={LEAF} size={40} />
    </AbsoluteFill>
  );
};

const Low: React.FC = () => {
  const f = useCurrentFrame();
  const p = f / 7;
  const calm = interpolate(f, [40, 90], [1, 0.08], {...clamp, easing: ease});
  const row2 = spring({frame: f - 100, fps: FPS, config: {damping: 12}});
  const tryHard = interpolate(f, [150, 200], [1, 0.75], clamp);
  const stamp = (at: number) => spring({frame: f - at, fps: FPS, config: {damping: 8, stiffness: 200}});
  const spiky = (x: number) => {
    const k = Math.floor(x / 18);
    return (random('s' + k + Math.floor(f / 3)) - 0.5) * 2 + 0.5 * Math.sin(x / 6 - f);
  };
  return (
    <AbsoluteFill>
      <Slam words={['EASY', 'vs', 'HARD']} at={0} y={140} size={110} gap={55} />
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        <rect x={50} y={330} width={980} height={360} rx={34} fill="#ffffff12" stroke={LEAF} strokeWidth={6} />
        <path d={wpath(250, 990, 520, (x) => Math.sin(x / 70 - p) * 90 * calm)} fill="none" stroke={YEL} strokeWidth={13} strokeLinecap="round" />
        <g transform={`translate(540 ${780}) scale(${row2}) translate(-540 -780)`}>
          <rect x={50} y={740} width={980} height={360} rx={34} fill="#ffffff12" stroke={RED} strokeWidth={6} />
          <path d={wpath(250, 990, 920, (x) => spiky(x) * 80 * tryHard, 9)} fill="none" stroke={ORG} strokeWidth={9} strokeLinejoin="round" />
        </g>
        <g transform={`translate(930 420) scale(${stamp(75)}) rotate(-12)`}><circle r={62} fill={LEAF} stroke={INK} strokeWidth={8} /><path d="M -28 2 l 20 22 l 36 -44" fill="none" stroke="#fff" strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" /></g>
        <g transform={`translate(930 830) scale(${stamp(170)}) rotate(10)`}><circle r={62} fill={RED} stroke={INK} strokeWidth={8} /><path d="M -24 -24 l 48 48 M 24 -24 l -48 48" stroke="#fff" strokeWidth={14} strokeLinecap="round" /></g>
      </svg>
      <div style={{position: 'absolute', left: 80, top: 420, fontSize: 90, lineHeight: 1.1}}>✈️<br />❄️</div>
      <div style={{position: 'absolute', left: 80, top: 830, fontSize: 90, lineHeight: 1.1, opacity: row2}}>🗣️<br />🍽️</div>
      <Pill text="low + steady" x={540} y={680} at={30} bg={LEAF} size={40} />
      <Pill text="high + jumpy" x={540} y={1090} at={120} bg={RED} size={40} />
      <Huh mood="thinking" x={160} y={1170} h={230} at={185} />
    </AbsoluteFill>
  );
};

const Cushion: React.FC = () => {
  const f = useCurrentFrame();
  const phones = spring({frame: f - 5, fps: FPS, config: {damping: 12}});
  const squish = interpolate(f, [20, 30, 45], [0, 1, 0.4], clamp);
  const zip = (k: number) => ((f * 9 + k * 90) % 300) / 300;
  const math = spring({frame: f - 150, fps: FPS, config: {damping: 11}});
  return (
    <AbsoluteFill>
      {f < 130 ? <Pill text="cushions = a seal 🧽" x={540} y={210} at={0} bg={PURPLE} size={56} /> : <Slam words={['TEAMWORK']} at={130} y={150} size={130} color={PURPLE} />}
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        <Head x={540} y={800} r={170} calm={1} phones={phones} squish={squish} />
        {/* high squiggles bouncing off the cups */}
        {[-1, 1].map((side) => [0, 1, 2].map((k) => {
          const t = zip(k + (side > 0 ? 1.5 : 0));
          const inbound = t < 0.5;
          const dist = inbound ? 1 - t * 2 : (t - 0.5) * 2;
          const xEdge = 540 + side * 310;
          const x = xEdge + side * dist * 230;
          const y = 640 + k * 110 + (inbound ? 0 : -dist * 60);
          return <path key={side + '-' + k} d={wpath(x - 50, x + 50, y, (xx) => Math.sin(xx / 5) * 12)} fill="none" stroke={inbound ? ORG : '#ffffff99'} strokeWidth={7} strokeLinecap="round" opacity={phones} />;
        }))}
      </svg>
      <div style={{position: 'absolute', top: 1160, width: '100%', display: 'flex', justifyContent: 'center', gap: 20, transform: `scale(${math})`, fontFamily: 'B8', fontSize: 54, color: '#fff', textShadow: OUT}}>
        <span style={{background: FOAM, color: INK, padding: '8px 28px', borderRadius: 999, boxShadow: OUT, textShadow: 'none'}}>foam 🧽</span>
        <span>+</span>
        <span style={{background: TEAL, padding: '8px 28px', borderRadius: 999, boxShadow: OUT, textShadow: 'none'}}>math 🧮</span>
      </div>
      <Pill text="boing!" x={150} y={560} at={50} bg={ORG} size={40} />
    </AbsoluteFill>
  );
};

const History: React.FC = () => {
  const f = useCurrentFrame();
  const line = interpolate(f, [10, 200], [0, 1], {...clamp, easing: ease});
  const pop = (at: number) => spring({frame: f - at, fps: FPS, config: {damping: 10}});
  const stops = [200, 540, 880];
  const stamp = spring({frame: f - 50, fps: FPS, config: {damping: 7, stiffness: 220}});
  return (
    <AbsoluteFill>
      <Slam words={['OLD', 'IDEA!']} at={0} y={140} size={130} gap={10} />
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        <line x1={120} y1={1060} x2={960} y2={1060} stroke="#ffffff44" strokeWidth={14} strokeLinecap="round" />
        <line x1={120} y1={1060} x2={120 + 840 * line} y2={1060} stroke={YEL} strokeWidth={14} strokeLinecap="round" />
        {stops.map((x, i) => <circle key={i} cx={x} cy={1060} r={26} fill={line * 840 + 120 >= x ? YEL : SHELL2} stroke={INK} strokeWidth={8} />)}
        {/* patent card */}
        <g transform={`translate(200 700) scale(${pop(10)}) rotate(-6)`}>
          <rect x={-140} y={-190} width={280} height={360} rx={14} fill={CREAM} stroke={INK} strokeWidth={10} />
          {Array.from({length: 7}).map((_, i) => <rect key={i} x={-105} y={-150 + i * 38} width={i % 3 === 2 ? 130 : 210} height={12} rx={6} fill="#C9B99A" />)}
          <path d={wpath(-100, 100, 120, (x) => Math.sin(x / 14) * 18)} fill="none" stroke={INK} strokeWidth={6} />
          <g transform={`translate(60 -20) scale(${stamp}) rotate(-18)`}>
            <rect x={-95} y={-34} width={190} height={68} rx={10} fill="none" stroke={RED} strokeWidth={8} />
            <text x={0} y={18} textAnchor="middle" fontFamily="B8" fontSize={46} fill={RED}>PATENT</text>
          </g>
        </g>
        {/* pilot plane */}
        <g transform={`translate(${540 + Math.sin(f / 20) * 10} ${700 + Math.sin(f / 13) * 10}) scale(${pop(90) * 0.42})`}><Plane /></g>
      </svg>
      <div style={{position: 'absolute', left: 540, top: 470, transform: `translate(-50%,0) scale(${pop(100)})`, fontSize: 110}}>🎧</div>
      <div style={{position: 'absolute', left: 880, top: 640, transform: `translate(-50%,0) scale(${pop(170)})`, fontSize: 150}}>🚌</div>
      <Pill text="1930s 📜" x={200} y={1150} at={20} bg={YEL} color={INK} size={44} />
      <Pill text="pilots ✈️" x={540} y={1150} at={95} bg={SKY} color={INK} size={44} />
      <Pill text="you 😎" x={880} y={1150} at={170} bg={PINK} size={44} />
      <Pill text="German physicist" x={260} y={440} at={40} bg={BROWN} size={36} />
    </AbsoluteFill>
  );
};

export const scenes: SceneMap = {
  hook: {C: Hook, hue: ORG}, wave: {C: Wave, hue: SKY}, mic: {C: Mic, hue: TEAL}, flip: {C: Flip, hue: PINK},
  cancel: {C: Cancel, hue: YEL}, check: {C: Check, hue: INDIGO}, low: {C: Low, hue: RED}, cushion: {C: Cushion, hue: PURPLE},
  history: {C: History, hue: BROWN}, cta: {C: CTA, hue: PINK},
};
