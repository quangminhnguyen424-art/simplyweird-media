import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, spring, Easing, random} from 'remotion';
import {FPS, INK, PINK, YEL, TEAL, ORG, CREAM, SKY, RED, clamp, ease, Slam, Pill, Huh, Arrow, Count, Marker, CTA, SceneMap} from '../../kit';
import timing from './timing.json';

export const title = "how much of earth's water is drinkable?";
export const segs = timing;

const OUT = `0 8px 0 ${INK}`;
const SEA = '#2F6FD6', WATER = '#5FB4FF', LAND = '#3BB273', DRY = '#C9A36B', ICE = '#DFF4FF', SOIL = '#8A5A2B', SOIL2 = '#6E4520';

/** Number with decimals that eases from `from` to `to`. */
const Num: React.FC<{to: number; from?: number; at?: number; len?: number; dec?: number; suffix?: string; prefix?: string}> = ({to, from = 0, at = 0, len = 40, dec = 1, suffix = '', prefix = ''}) => {
  const f = useCurrentFrame();
  const v = interpolate(f, [at, at + len], [from, to], {...clamp, easing: ease});
  return <>{prefix}{v.toFixed(dec)}{suffix}</>;
};

const Big: React.FC<{children: React.ReactNode; y?: number; size?: number; color?: string; at?: number}> = ({children, y = 140, size = 120, color = YEL, at = 0}) => {
  const f = useCurrentFrame();
  const s = spring({frame: f - at, fps: FPS, config: {damping: 10}});
  return (
    <div style={{position: 'absolute', top: y, width: '100%', textAlign: 'center', fontFamily: 'B8', fontSize: size, color, textShadow: OUT, transform: `scale(${s})`, lineHeight: 1}}>{children}</div>
  );
};

/* ---------- illustrations ---------- */

const CONT: [number, number, number, number][] = [[-120, -110, 120, 80], [40, -40, 90, 130], [-60, 140, 110, 60], [180, 120, 70, 90], [-220, 40, 60, 90], [260, -120, 80, 50]];

/** Flat globe. ocean colour can fade to `dry`. Draw inside an <svg>. */
const Globe: React.FC<{cx: number; cy: number; r: number; dry?: number; spin?: number; face?: boolean}> = ({cx, cy, r, dry = 0, spin = 0, face}) => {
  const k = r / 300;
  const oc = interpolate(dry, [0, 1], [0, 1]);
  return (
    <g transform={`translate(${cx} ${cy}) scale(${k})`}>
      <defs><clipPath id={`gl${cx}${cy}`}><circle r={300} /></clipPath></defs>
      <circle r={312} fill={INK} />
      <circle r={300} fill={SEA} />
      <circle r={300} fill={DRY} opacity={oc} />
      <g clipPath={`url(#gl${cx}${cy})`}>
        {[-1, 0, 1].map((rep) => CONT.map(([x, y, w, h], i) => {
          const xx = ((x + spin + 300) % 1200) - 300 + rep * 1200;
          return <ellipse key={rep + '-' + i} cx={xx} cy={y} rx={w} ry={h} fill={LAND} stroke={INK} strokeWidth={10} />;
        }))}
        <ellipse cx={0} cy={-285} rx={190} ry={45} fill={ICE} stroke={INK} strokeWidth={8} />
        <ellipse cx={0} cy={290} rx={210} ry={50} fill={ICE} stroke={INK} strokeWidth={8} />
      </g>
      <circle r={300} fill="none" stroke={INK} strokeWidth={14} />
      <ellipse cx={-120} cy={-130} rx={55} ry={28} fill="#fff" opacity={0.35} transform="rotate(-35 -120 -130)" />
      {face && <g>
        <circle cx={-80} cy={20} r={24} fill={INK} /><circle cx={80} cy={20} r={24} fill={INK} />
        <circle cx={-72} cy={10} r={8} fill="#fff" /><circle cx={88} cy={10} r={8} fill="#fff" />
        <ellipse cx={0} cy={100} rx={30} ry={38} fill={INK} />
      </g>}
    </g>
  );
};

const Drop: React.FC<{x: number; y: number; s?: number; face?: boolean; color?: string}> = ({x, y, s = 1, face, color = WATER}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M 0 -60 C 26 -26 46 -4 46 22 A 46 46 0 0 1 -46 22 C -46 -4 -26 -26 0 -60 Z" fill={color} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
    <ellipse cx={-16} cy={6} rx={8} ry={14} fill="#fff" opacity={0.7} />
    {face && <><circle cx={-12} cy={24} r={6} fill={INK} /><circle cx={14} cy={24} r={6} fill={INK} /><path d="M -8 38 Q 1 46 10 38" stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" /></>}
  </g>
);

const JUG = 'M 60 120 Q 60 90 90 90 L 170 90 L 175 30 L 245 30 L 250 90 Q 290 95 290 140 L 290 470 Q 290 500 260 500 L 90 500 Q 60 500 60 470 Z';
/** One-gallon jug, 230x470 body. level 0..1. Draw inside an <svg>; origin at top-left of viewbox 0 0 340 520. */
const Jug: React.FC<{x: number; y: number; s?: number; level: number; id: string; wave?: number}> = ({x, y, s = 1, level, id, wave = 0}) => {
  const top = 500 - 410 * level;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs><clipPath id={id}><path d={JUG} /></clipPath></defs>
      <path d="M 60 170 Q -20 180 0 290 Q 20 360 60 350" fill="none" stroke={INK} strokeWidth={34} strokeLinecap="round" />
      <path d="M 60 170 Q -20 180 0 290 Q 20 360 60 350" fill="none" stroke="#E8F3FF" strokeWidth={18} strokeLinecap="round" />
      <path d={JUG} fill="#ffffff30" />
      <g clipPath={`url(#${id})`}>
        <path d={`M 0 ${top} Q 85 ${top - 14 * Math.sin(wave)} 170 ${top} T 340 ${top} L 340 520 L 0 520 Z`} fill={SEA} />
        <rect x={80} y={top + 20} width={22} height={Math.max(0, 470 - top - 40)} rx={11} fill="#fff" opacity={0.3} />
      </g>
      <path d={JUG} fill="none" stroke={INK} strokeWidth={12} strokeLinejoin="round" />
      <rect x={165} y={8} width={90} height={34} rx={8} fill={PINK} stroke={INK} strokeWidth={9} />
    </g>
  );
};

const Cloud: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => {
  const P: [number, number, number][] = [[-110, 20, 70], [-40, -25, 90], [50, -35, 85], [120, 15, 70], [0, 35, 85]];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {P.map(([a, b, r], i) => <circle key={'o' + i} cx={a} cy={b} r={r + 9} fill={INK} />)}
      {P.map(([a, b, r], i) => <circle key={i} cx={a} cy={b} r={r} fill="#fff" />)}
      <circle cx={-35} cy={20} r={10} fill={INK} /><circle cx={35} cy={20} r={10} fill={INK} />
      <path d="M -18 48 Q 0 64 18 48" fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" />
    </g>
  );
};

const Sun: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) rotate(${f})`}>
      {Array.from({length: 10}).map((_, i) => <rect key={i} x={-8} y={-115} width={16} height={36} rx={8} fill={YEL} transform={`rotate(${i * 36})`} />)}
      <circle r={70} fill={YEL} stroke={INK} strokeWidth={9} />
    </g>
  );
};

/* ---------- scenes ---------- */

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const g = spring({frame: f - 2, fps: FPS, config: {damping: 12}});
  const drip = (f % 36) / 36;
  const tap = spring({frame: f - 85, fps: FPS, config: {damping: 10}});
  return (
    <AbsoluteFill>
      {f < 90
        ? <div style={{position: 'absolute', top: 150, width: '100%', textAlign: 'center', fontFamily: 'B8', fontSize: 76, color: '#fff', textShadow: OUT}}>a whole planet of <span style={{color: WATER}}>water</span>...</div>
        : <Slam words={['RUNNING', 'OUT?!']} at={90} y={140} size={120} gap={7} />}
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        <g transform={`translate(540 720) scale(${g}) translate(-540 -720)`}>
          <Globe cx={540} cy={720} r={330} spin={f * 1.6} face={f > 90} />
        </g>
        {/* tap with one sad drip */}
        <g transform={`translate(830 1120) scale(${tap}) translate(-830 -1120)`}>
          <rect x={700} y={1060} width={190} height={56} rx={20} fill="#C9D3E3" stroke={INK} strokeWidth={9} />
          <rect x={850} y={1060} width={60} height={110} rx={18} fill="#C9D3E3" stroke={INK} strokeWidth={9} />
          <rect x={760} y={1020} width={70} height={30} rx={10} fill={RED} stroke={INK} strokeWidth={8} />
          <Drop x={880} y={1200 + drip * 170} s={0.45 * (1 - drip * 0.3)} />
        </g>
      </svg>
      <Pill text="water planet 🌊" x={600} y={1330} at={25} bg={SEA} size={50} />
      <Huh mood="shocked" x={170} y={1040} h={290} at={100} />
    </AbsoluteFill>
  );
};

const Sphere: React.FC = () => {
  const f = useCurrentFrame();
  const g = spring({frame: f, fps: FPS, config: {damping: 12}});
  const dry = interpolate(f, [35, 105], [0, 1], {...clamp, easing: ease});
  const ball = spring({frame: f - 95, fps: FPS, config: {damping: 7}});
  const cx = 540, cy = 860, R = 400;
  const br = R * (860 / 7918);
  const bx = 470, by = cy - R - br + 6;
  return (
    <AbsoluteFill>
      <Big y={130} size={110} at={100}><Count to={860} at={100} len={45} /> miles</Big>
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        <g transform={`translate(${cx} ${cy}) scale(${g}) translate(${-cx} ${-cy})`}>
          <Globe cx={cx} cy={cy} r={R} dry={dry} spin={f * 0.8} />
        </g>
        {/* water droplets fly off the globe and gather into one ball */}
        {Array.from({length: 18}).map((_, i) => {
          const a = random('a' + i) * Math.PI * 2, rr = R * (0.3 + random('r' + i) * 0.6);
          const sx = cx + Math.cos(a) * rr, sy = cy + Math.sin(a) * rr;
          const t = interpolate(f, [40 + i * 2, 95 + i * 2], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
          return t > 0 && t < 1 ? <circle key={i} cx={sx + (bx - sx) * t} cy={sy + (by - sy) * t} r={14} fill={WATER} stroke={INK} strokeWidth={5} /> : null;
        })}
        <g transform={`translate(${bx} ${by}) scale(${ball})`}>
          <circle r={br + 7} fill={INK} />
          <circle r={br} fill={WATER} />
          <circle cx={-12} cy={-12} r={10} fill="#fff" opacity={0.7} />
        </g>
        <Arrow d={`M ${bx + 330} ${by - 120} Q ${bx + 150} ${by - 140} ${bx + 70} ${by - 40}`} progress={interpolate(f, [130, 155], [0, 1], clamp)} color={YEL} w={12} />
      </svg>
      <Pill text="ALL of Earth's water" x={800} y={by - 140} at={130} bg={WATER} color={INK} size={40} />
      <Pill text="Earth ≈ 7,900 miles wide" x={540} y={1330} at={60} bg="#fff" color={INK} size={42} />
      <Pill text="kind of small 🤏" x={240} y={300} at={195} bg={PINK} size={44} />
      <Huh mood="curious" x={940} y={1060} h={240} at={185} />
    </AbsoluteFill>
  );
};

const Salty: React.FC = () => {
  const f = useCurrentFrame();
  const C = 72, G = 8, N = 10, x0 = (1080 - (N * C + (N - 1) * G)) / 2, y0 = 340;
  const fillTo = interpolate(f, [15, 115], [0, 96.5], {...clamp, easing: ease});
  const shake = Math.sin(f / 2.5) * 12;
  return (
    <AbsoluteFill>
      <Big y={150} size={120}><Num to={96.5} at={15} len={100} suffix="%" /></Big>
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        {Array.from({length: 100}).map((_, i) => {
          const c = i % N, r = Math.floor(i / N);
          const x = x0 + c * (C + G), y = y0 + r * (C + G);
          const part = Math.max(0, Math.min(1, fillTo - i));
          const rest = i >= 96 && f > 120;
          const pulse = rest ? 1 + 0.08 * Math.sin(f / 4) : 1;
          return (
            <g key={i} transform={`translate(${x + C / 2} ${y + C / 2}) scale(${pulse}) translate(${-x - C / 2} ${-y - C / 2})`}>
              <rect x={x} y={y} width={C} height={C} rx={12} fill={rest ? TEAL : '#ffffff18'} stroke="#ffffff55" strokeWidth={3} />
              {part > 0 && <rect x={x} y={y} width={C * part} height={C} rx={12} fill={SEA} stroke={INK} strokeWidth={4} />}
            </g>
          );
        })}
        {/* salt shaker sprinkling */}
        <g transform={`translate(900 1240) rotate(${150 + shake})`} opacity={interpolate(f, [110, 125], [0, 1], clamp)}>
          <rect x={-45} y={-70} width={90} height={130} rx={22} fill="#fff" stroke={INK} strokeWidth={9} />
          <rect x={-45} y={-90} width={90} height={36} rx={14} fill="#C9D3E3" stroke={INK} strokeWidth={9} />
          {[-20, 0, 20].map((d) => <circle key={d} cx={d} cy={-74} r={5} fill={INK} />)}
        </g>
        {f > 125 && Array.from({length: 12}).map((_, i) => {
          const t = ((f * 2 + i * 17) % 60) / 60;
          return <rect key={i} x={890 - 90 * t + random('sx' + i) * 40 - 20} y={1310 + t * 90} width={9} height={9} fill="#fff" opacity={1 - t} />;
        })}
      </svg>
      <Slam words={['TOO', 'SALTY!']} at={135} y={1180} size={104} gap={7} />
    </AbsoluteFill>
  );
};

const Fresh: React.FC = () => {
  const f = useCurrentFrame();
  const j = spring({frame: f, fps: FPS, config: {damping: 12}});
  const tilt = interpolate(f, [55, 80, 150, 175], [0, -38, -38, 0], {...clamp, easing: ease});
  const pour = interpolate(f, [80, 150], [0, 1], clamp);
  const cup = spring({frame: f - 30, fps: FPS, config: {damping: 10}});
  const lvl = pour;
  const streaming = f > 80 && f < 152;
  return (
    <AbsoluteFill>
      <Big y={140} size={120} at={5}><Num to={2.5} at={10} len={45} suffix="%" /> <span style={{color: '#fff', fontSize: 80}}>fresh</span></Big>
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        <g transform={`translate(110 520) scale(${j})`}>
          <g transform={`rotate(${-tilt} 290 500)`}>
            <Jug x={0} y={0} s={1.15} level={0.92 - pour * 0.03} id="jugA" wave={f / 6} />
          </g>
        </g>
        {streaming && <path d={`M 703 ${613 + 6 * Math.sin(f)} Q 780 700 795 ${1000}`} fill="none" stroke={WATER} strokeWidth={16} strokeLinecap="round" strokeDasharray="30 18" strokeDashoffset={-f * 6} />}
        {/* measuring cup */}
        <g transform={`translate(800 1170) scale(${cup}) translate(-800 -1170)`}>
          <defs><clipPath id="cupC"><path d="M 690 960 L 910 960 L 890 1220 Q 888 1240 868 1240 L 732 1240 Q 712 1240 710 1220 Z" /></clipPath></defs>
          <path d="M 905 1010 Q 990 1020 975 1100 Q 965 1160 895 1160" fill="none" stroke={INK} strokeWidth={26} strokeLinecap="round" />
          <path d="M 905 1010 Q 990 1020 975 1100 Q 965 1160 895 1160" fill="none" stroke="#E8F3FF" strokeWidth={12} strokeLinecap="round" />
          <path d="M 690 960 L 910 960 L 890 1220 Q 888 1240 868 1240 L 732 1240 Q 712 1240 710 1220 Z" fill="#ffffff30" />
          <g clipPath="url(#cupC)"><rect x={680} y={1240 - 150 * lvl} width={240} height={300} fill={WATER} /></g>
          <path d="M 690 960 L 910 960 L 890 1220 Q 888 1240 868 1240 L 732 1240 Q 712 1240 710 1220 Z" fill="none" stroke={INK} strokeWidth={10} strokeLinejoin="round" />
          <line x1={712} y1={1050} x2={770} y2={1050} stroke={RED} strokeWidth={7} strokeDasharray="12 8" />
          <text x={780} y={1062} fontFamily="B8" fontSize={34} fill="#fff">½ cup</text>
        </g>
      </svg>
      <Pill text="1 gallon = ALL Earth's water" x={360} y={430} at={15} bg={SEA} size={40} />
      <Pill text="less than ½ cup! 😬" x={540} y={1340} at={165} bg={PINK} size={50} />
    </AbsoluteFill>
  );
};

const Ice: React.FC = () => {
  const f = useCurrentFrame();
  const cx = 540, cy = 760, R = 320, W = 110;
  const circ = 2 * Math.PI * R;
  const draw = (from: number, to: number, a: number, b: number) => {
    const p = interpolate(f, [a, b], [0, 1], {...clamp, easing: ease});
    return {len: circ * (to - from) * p, off: -circ * from};
  };
  const ice = draw(0, 0.687, 15, 95), gr = draw(0.687, 0.988, 100, 125), ot = draw(0.988, 1, 125, 135);
  const cube = spring({frame: f - 20, fps: FPS, config: {damping: 9}});
  const shiver = Math.sin(f * 1.7) * 4;
  return (
    <AbsoluteFill>
      <Slam words={['FROZEN', 'SOLID']} at={70} y={130} size={112} gap={7} />
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="#ffffff1c" strokeWidth={W} />
        <g transform={`rotate(-90 ${cx} ${cy})`}>
          <circle cx={cx} cy={cy} r={R} fill="none" stroke={ICE} strokeWidth={W} strokeDasharray={`${ice.len} ${circ}`} strokeDashoffset={ice.off} />
          <circle cx={cx} cy={cy} r={R} fill="none" stroke={SOIL} strokeWidth={W} strokeDasharray={`${gr.len} ${circ}`} strokeDashoffset={gr.off} />
          <circle cx={cx} cy={cy} r={R} fill="none" stroke={TEAL} strokeWidth={W} strokeDasharray={`${ot.len} ${circ}`} strokeDashoffset={ot.off} />
        </g>
        <circle cx={cx} cy={cy} r={R + W / 2} fill="none" stroke={INK} strokeWidth={8} />
        <circle cx={cx} cy={cy} r={R - W / 2} fill="none" stroke={INK} strokeWidth={8} />
        {/* shivering ice cube */}
        <g transform={`translate(${cx + shiver} ${cy}) scale(${cube}) rotate(${shiver})`}>
          <path d="M -110 -60 L -50 -120 L 130 -120 L 70 -60 Z" fill="#fff" stroke={INK} strokeWidth={10} strokeLinejoin="round" />
          <path d="M 70 -60 L 130 -120 L 130 60 L 70 120 Z" fill="#A9DCF5" stroke={INK} strokeWidth={10} strokeLinejoin="round" />
          <rect x={-110} y={-60} width={180} height={180} fill={ICE} stroke={INK} strokeWidth={10} />
          <circle cx={-55} cy={20} r={12} fill={INK} /><circle cx={15} cy={20} r={12} fill={INK} />
          <path d="M -60 75 l 12 -10 l 12 10 l 12 -10 l 12 10 l 12 -10 l 12 10" fill="none" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
          <circle cx={-80} cy={50} r={12} fill={PINK} opacity={0.5} /><circle cx={40} cy={50} r={12} fill={PINK} opacity={0.5} />
        </g>
      </svg>
      <Pill text="❄️ 68.7% ice caps & glaciers" x={540} y={1200} at={60} bg={ICE} color={INK} size={44} />
      <Pill text="the rest ↓ next" x={850} y={1310} at={130} bg={SOIL} size={36} />
    </AbsoluteFill>
  );
};

const Ground: React.FC = () => {
  const f = useCurrentFrame();
  const cut = interpolate(f, [5, 45], [0, 1], {...clamp, easing: ease});
  const pump = Math.sin(f / 5) * 18;
  const flow = interpolate(f, [60, 75], [0, 1], clamp);
  const pockets: [number, number, number, number][] = [[230, 940, 170, 60], [620, 870, 220, 70], [880, 1010, 130, 50], [430, 1110, 200, 55], [760, 1260, 170, 45]];
  return (
    <AbsoluteFill>
      <Big y={130} size={110} at={10}>≈ <Count to={30} at={15} len={40} />% <span style={{color: '#fff', fontSize: 74}}>underground</span></Big>
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        <defs><clipPath id="soilC"><rect x={0} y={560} width={1080} height={860 * cut} /></clipPath></defs>
        <g clipPath="url(#soilC)">
          <rect x={0} y={560} width={1080} height={250} fill={SOIL} />
          <rect x={0} y={810} width={1080} height={300} fill={SOIL2} />
          <rect x={0} y={1110} width={1080} height={310} fill="#553417" />
          {Array.from({length: 22}).map((_, i) => <circle key={i} cx={random('px' + i) * 1080} cy={600 + random('py' + i) * 800} r={6 + random('pr' + i) * 10} fill="#00000033" />)}
          {pockets.map(([x, y, w, h], i) => {
            const s = spring({frame: f - 30 - i * 8, fps: FPS, config: {damping: 10}});
            return (
              <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
                <ellipse rx={w} ry={h} fill={WATER} stroke={INK} strokeWidth={8} />
                <path d={`M ${-w * 0.6} 0 q ${w * 0.15} -14 ${w * 0.3} 0 t ${w * 0.3} 0 t ${w * 0.3} 0`} fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={0.7} transform={`translate(${Math.sin(f / 8 + i) * 8} 0)`} />
              </g>
            );
          })}
        </g>
        {/* grass line */}
        <rect x={0} y={540} width={1080} height={34} fill={LAND} stroke={INK} strokeWidth={8} />
        {/* well pipe and hand pump into the first pocket */}
        <rect x={215} y={560} width={30} height={380 * cut} fill="#C9D3E3" stroke={INK} strokeWidth={7} />
        <line x1={230} y1={930} x2={230} y2={570} stroke={WATER} strokeWidth={12} strokeDasharray="22 18" strokeDashoffset={f * 5} opacity={flow} />
        <rect x={195} y={430} width={70} height={120} rx={14} fill={RED} stroke={INK} strokeWidth={9} />
        <rect x={258} y={455} width={70} height={24} rx={10} fill="#C9D3E3" stroke={INK} strokeWidth={7} />
        <g transform={`rotate(${pump} 205 440)`}><rect x={60} y={428} width={150} height={22} rx={11} fill={INK} /></g>
        {f > 75 && <Drop x={318} y={490 + ((f * 4) % 60)} s={0.3} />}
      </svg>
      <Pill text="wells 💪" x={360} y={380} at={60} bg={TEAL} size={44} />
      <Pill text="too deep? 🤷" x={560} y={1330} at={150} bg={ORG} size={44} />
    </AbsoluteFill>
  );
};

const Lakes: React.FC = () => {
  const f = useCurrentFrame();
  const L = 130, MAX = 820;
  const rows: [string, number, string][] = [['oceans', 96.5, SEA], ['ice', 1.74, ICE], ['groundwater', 0.76, SOIL], ['lakes + rivers', 0.0067, TEAL]];
  const zoom = spring({frame: f - 120, fps: FPS, config: {damping: 11}});
  return (
    <AbsoluteFill>
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        {rows.map(([name, pct, col], i) => {
          const y = 300 + i * 150;
          const p = interpolate(f, [10 + i * 12, 55 + i * 12], [0, 1], {...clamp, easing: ease});
          const w = Math.max(i === 3 ? 0 : 4, (MAX * pct) / 100) * p;
          return (
            <g key={i} opacity={p > 0 ? 1 : 0}>
              <text x={L} y={y - 18} fontFamily="B8" fontSize={44} fill="#fff">{name}</text>
              <rect x={L} y={y} width={MAX} height={56} rx={14} fill="#ffffff12" />
              {w > 0 && <rect x={L} y={y} width={w} height={56} rx={10} fill={col} stroke={INK} strokeWidth={4} />}
              {i === 3 && <circle cx={L + 3} cy={y + 28} r={4} fill={TEAL} />}
            </g>
          );
        })}
        {/* magnifier on the tiny lakes+rivers sliver */}
        <g opacity={zoom > 0.01 ? 1 : 0}>
          <line x1={L + 4} y1={778} x2={540 - 150 * zoom} y2={1000} stroke={YEL} strokeWidth={8} strokeDasharray="16 10" />
          <g transform={`translate(560 1080) scale(${zoom})`}>
            <defs><clipPath id="magC"><circle r={190} /></clipPath></defs>
            <circle r={190} fill="#2a3a5a" />
            <g clipPath="url(#magC)">
              <rect x={-200} y={40} width={400} height={200} fill={LAND} />
              <ellipse cx={-40} cy={70} rx={120} ry={50} fill={WATER} stroke={INK} strokeWidth={7} />
              <path d="M 60 70 Q 120 120 90 200" fill="none" stroke={INK} strokeWidth={34} />
              <path d="M 60 70 Q 120 120 90 200" fill="none" stroke={WATER} strokeWidth={20} />
              <g transform={`translate(${-40 + Math.sin(f / 10) * 50} 70)`}>
                <ellipse rx={22} ry={12} fill={ORG} stroke={INK} strokeWidth={4} />
                <path d="M 18 0 l 16 -12 l 0 24 Z" fill={ORG} stroke={INK} strokeWidth={4} transform={`scale(${Math.sin(f / 10) > 0 ? -1 : 1} 1)`} />
              </g>
              <Sun x={110} y={-80} s={0.5} />
            </g>
            <circle r={190} fill="none" stroke="#fff" strokeWidth={18} />
            <path d="M 135 135 L 230 230" stroke="#fff" strokeWidth={34} strokeLinecap="round" />
          </g>
        </g>
      </svg>
      <Big y={130} size={96} at={115}>&lt; 0.01%</Big>
      <Huh mood="thinking" x={190} y={1010} h={260} at={170} />
    </AbsoluteFill>
  );
};

const Drops: React.FC = () => {
  const f = useCurrentFrame();
  const sp = spring({frame: f, fps: FPS, config: {damping: 12}});
  const t0 = 25, gap = 20;
  const n = Math.max(0, Math.min(5, Math.floor((f - t0) / gap) + 1));
  const phase2 = f > 140;
  const ring = ((f - 150) % 30) / 30;
  return (
    <AbsoluteFill>
      <Big y={130} size={110}>{phase2 ? <span style={{color: '#fff'}}>rivers: <span style={{color: RED}}>&lt; 1</span> drop</span> : <>{n} drop{n === 1 ? '' : 's'}</>}</Big>
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        <Jug x={60} y={560} s={0.62 * sp} level={0.92} id="jugB" wave={f / 6} />
        {/* dropper */}
        <g transform={`translate(640 330) scale(${sp})`}>
          <rect x={-45} y={0} width={90} height={110} rx={40} fill={RED} stroke={INK} strokeWidth={9} />
          <path d="M -32 100 L 32 100 L 12 300 L -12 300 Z" fill="#ffffff55" stroke={INK} strokeWidth={9} strokeLinejoin="round" />
          <rect x={-20} y={230} width={40} height={60} fill={WATER} />
        </g>
        {Array.from({length: 5}).map((_, i) => {
          const t = interpolate(f, [t0 + i * gap, t0 + i * gap + 14], [0, 1], {...clamp, easing: Easing.in(Easing.quad)});
          return t > 0 && t < 1 ? <Drop key={i} x={640} y={660 + t * 360} s={0.35} /> : null;
        })}
        {/* spoon */}
        <g transform={`translate(640 1090) scale(${sp})`}>
          <rect x={120} y={-14} width={300} height={28} rx={14} fill="#D6DCE8" stroke={INK} strokeWidth={8} transform="rotate(-8)" />
          <ellipse rx={150} ry={70} fill="#D6DCE8" stroke={INK} strokeWidth={9} />
          <ellipse rx={20 + 18 * n} ry={8 + 7 * n} fill={WATER} opacity={n > 0 ? 1 : 0} />
        </g>
        {phase2 && <g>
          <circle cx={290} cy={1340} r={4} fill={WATER} />
          <circle cx={290} cy={1340} r={20 + ring * 70} fill="none" stroke={YEL} strokeWidth={6} opacity={1 - ring} />
        </g>}
      </svg>
      <Pill text="1 gallon" x={190} y={1000} at={10} bg={SEA} size={40} />
      <Pill text="all lakes + rivers" x={640} y={1195} at={30} bg={TEAL} color={INK} size={40} />
      <Pill text="← all the rivers 😱" x={580} y={1340} at={150} bg={PINK} size={42} />
    </AbsoluteFill>
  );
};

const Cycle: React.FC = () => {
  const f = useCurrentFrame();
  const s = spring({frame: f, fps: FPS, config: {damping: 12}});
  const arrows = interpolate(f, [20, 60], [0, 1], {...clamp, easing: ease});
  const ring = spring({frame: f - 120, fps: FPS, config: {damping: 10}});
  const cloudX = 760 + Math.sin(f / 25) * 30;
  return (
    <AbsoluteFill>
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        <Sun x={190} y={400} s={0.9 * s} />
        <Cloud x={cloudX} y={420} s={1.1 * s} />
        {/* ocean */}
        <path d={`M 0 1200 Q 135 ${1170 + 15 * Math.sin(f / 8)} 270 1200 T 540 1200 T 810 1200 T 1080 1200 L 1080 1420 L 0 1420 Z`} fill={SEA} stroke={INK} strokeWidth={10} />
        {/* evaporation: wavy rising strokes */}
        {[220, 330, 440].map((x, i) => (
          <path key={i} d={`M ${x} 1160 C ${x - 40} 1020 ${x + 40} 900 ${x} 760`} fill="none" stroke="#ffffffaa" strokeWidth={14} strokeLinecap="round"
            strokeDasharray="40 50" strokeDashoffset={f * 4 + i * 30} opacity={arrows} />
        ))}
        {/* rain */}
        {Array.from({length: 9}).map((_, i) => {
          const t = ((f * 1.6 + i * 23) % 60) / 60;
          return <Drop key={i} x={cloudX - 110 + (i % 5) * 55} y={560 + t * 600} s={0.28 * arrows} />;
        })}
        {/* big recycle loop */}
        <g transform={`translate(540 860) scale(${ring}) rotate(${f * 2})`}>
          <circle r={130} fill="none" stroke={TEAL} strokeWidth={22} strokeDasharray="200 72" strokeLinecap="round" />
          {[0, 120, 240].map((a) => <path key={a} d="M 118 -30 L 150 10 L 98 18 Z" fill={TEAL} stroke={INK} strokeWidth={5} transform={`rotate(${a})`} />)}
        </g>
      </svg>
      <Pill text="evaporates ⬆️" x={330} y={700} at={40} bg="#fff" color={INK} size={40} />
      <Pill text="rains ⬇️" x={830} y={1120} at={60} bg={WATER} color={INK} size={40} />
      <Slam words={['RECYCLED!']} at={120} y={150} size={120} color={TEAL} />
      <Huh mood="laughing" x={900} y={1180} h={220} at={170} />
    </AbsoluteFill>
  );
};

export const scenes: SceneMap = {
  hook: {C: Hook, hue: SEA}, sphere: {C: Sphere, hue: SKY}, salty: {C: Salty, hue: '#5b6cff'}, fresh: {C: Fresh, hue: TEAL},
  ice: {C: Ice, hue: '#9fd8ff'}, ground: {C: Ground, hue: ORG}, lakes: {C: Lakes, hue: PINK}, drops: {C: Drops, hue: WATER},
  cycle: {C: Cycle, hue: YEL}, cta: {C: CTA, hue: PINK},
};
