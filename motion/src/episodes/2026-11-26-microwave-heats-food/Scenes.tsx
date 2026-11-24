import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, interpolateColors, spring, Easing, random} from 'remotion';
import {FPS, INK, PINK, YEL, TEAL, ORG, CREAM, SKY, RED, clamp, ease, Slam, Pill, Huh, Arrow, Count, SwapCards, CTA, SceneMap} from '../../kit';
import timing from './timing.json';

export const title = 'how a microwave heats your food';
export const segs = timing;

const METAL = '#B8C2D6', METAL2 = '#8C99B5', CHOC = '#6B3A1E', OUT = `0 8px 0 ${INK}`;

/* ---------- helpers ---------- */

/** Sine wave path along the line (x0,y0) -> (x1,y1). */
const wave = (x0: number, y0: number, x1: number, y1: number, amp: number, wl: number, phase: number) => {
  const L = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / L, uy = (y1 - y0) / L, nx = -uy, ny = ux;
  const pts: string[] = [];
  for (let t = 0; t <= L; t += 6) {
    const o = amp * Math.sin((2 * Math.PI * t) / wl - phase);
    pts.push(`${(x0 + ux * t + nx * o).toFixed(1)} ${(y0 + uy * t + ny * o).toFixed(1)}`);
  }
  return 'M ' + pts.join(' L ');
};

/* ---------- illustrations ---------- */

/** Front view microwave oven. */
const Microwave: React.FC<{w?: number; timer?: string; glow?: number; steam?: number; spin?: number}> = ({w = 900, timer = '2:00', glow = 0, steam = 0, spin = 0}) => {
  const f = useCurrentFrame();
  return (
    <svg viewBox="0 0 900 580" width={w} height={(w * 580) / 900} style={{overflow: 'visible'}}>
      <rect x={90} y={540} width={70} height={34} rx={10} fill={INK} /><rect x={740} y={540} width={70} height={34} rx={10} fill={INK} />
      <rect x={10} y={10} width={880} height={540} rx={40} fill="#DCE3F0" stroke={INK} strokeWidth={12} />
      <rect x={60} y={70} width={560} height={420} rx={24} fill="#1E2440" stroke={INK} strokeWidth={10} />
      <rect x={60} y={70} width={560} height={420} rx={24} fill={YEL} opacity={glow * 0.3} />
      {/* turntable + bowl */}
      <ellipse cx={340} cy={430} rx={210} ry={38} fill="#9fb7d9" stroke={INK} strokeWidth={6} />
      <g transform={`translate(${Math.sin(spin) * 30} 0)`}>
        <path d="M 240 340 Q 250 450 340 452 Q 430 450 440 340 Z" fill={CREAM} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
        <ellipse cx={340} cy={340} rx={100} ry={20} fill={ORG} stroke={INK} strokeWidth={7} />
        {[0, 1, 2].map((i) => (
          <path key={i} d={wave(300 + i * 40, 315, 300 + i * 40, 160, 10, 60, f / 4 + i)} fill="none" stroke="#fff" strokeWidth={8} strokeLinecap="round"
            opacity={steam * (0.5 + 0.4 * Math.sin(f / 7 + i))} />
        ))}
      </g>
      {/* door mesh dots */}
      {Array.from({length: 17}).map((_, i) => Array.from({length: 12}).map((__, j) => (
        <circle key={i + '-' + j} cx={88 + i * 32} cy={98 + j * 32} r={3} fill="#ffffff" opacity={0.13} />
      )))}
      {/* panel */}
      <rect x={650} y={70} width={200} height={420} rx={20} fill="#C9D2E3" stroke={INK} strokeWidth={8} />
      <rect x={670} y={95} width={160} height={72} rx={10} fill={INK} />
      <text x={750} y={148} textAnchor="middle" fontFamily="B8" fontSize={50} fill={YEL}>{timer}</text>
      {Array.from({length: 9}).map((_, i) => (
        <circle key={i} cx={695 + (i % 3) * 55} cy={215 + Math.floor(i / 3) * 55} r={18} fill="#fff" stroke={INK} strokeWidth={5} />
      ))}
      <rect x={675} y={390} width={150} height={70} rx={18} fill={PINK} stroke={INK} strokeWidth={6} />
      <text x={750} y={438} textAnchor="middle" fontFamily="B8" fontSize={36} fill="#fff">START</text>
    </svg>
  );
};

/** Magnetron: finned metal cylinder with an antenna. */
const Magnetron: React.FC<{w?: number; hum?: number}> = ({w = 300, hum = 0}) => (
  <svg viewBox="-150 -200 300 400" width={w} height={(w * 400) / 300} style={{overflow: 'visible'}}>
    <g transform={`translate(${hum} 0)`}>
      <rect x={-28} y={-190} width={56} height={90} rx={12} fill="#D6DCE8" stroke={INK} strokeWidth={8} />
      <circle cx={0} cy={-190} r={30} fill={YEL} stroke={INK} strokeWidth={8} />
      <rect x={-95} y={-110} width={190} height={230} rx={30} fill={METAL} stroke={INK} strokeWidth={10} />
      {Array.from({length: 6}).map((_, i) => (
        <rect key={i} x={-135} y={-92 + i * 36} width={270} height={18} rx={9} fill={METAL2} stroke={INK} strokeWidth={6} />
      ))}
      <rect x={-60} y={120} width={120} height={60} rx={10} fill={RED} stroke={INK} strokeWidth={8} />
    </g>
  </svg>
);

/** Water molecule: big O (minus) with two H (plus) in a V. Draw inside an <svg>. */
const Molecule: React.FC<{x: number; y: number; R?: number; angle?: number; s?: number; signs?: boolean}> = ({x, y, R = 120, angle = 0, s = 1, signs = true}) => {
  const d = R * 1.3, a = (52 * Math.PI) / 180, r = R * 0.62;
  const h1 = [-d * Math.sin(a), d * Math.cos(a)], h2 = [d * Math.sin(a), d * Math.cos(a)];
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${s})`}>
      <line x1={0} y1={0} x2={h1[0]} y2={h1[1]} stroke={INK} strokeWidth={R * 0.32} strokeLinecap="round" />
      <line x1={0} y1={0} x2={h2[0]} y2={h2[1]} stroke={INK} strokeWidth={R * 0.32} strokeLinecap="round" />
      <line x1={0} y1={0} x2={h1[0]} y2={h1[1]} stroke={CREAM} strokeWidth={R * 0.16} strokeLinecap="round" />
      <line x1={0} y1={0} x2={h2[0]} y2={h2[1]} stroke={CREAM} strokeWidth={R * 0.16} strokeLinecap="round" />
      <circle cx={h1[0]} cy={h1[1]} r={r} fill="#fff" stroke={INK} strokeWidth={R * 0.08} />
      <circle cx={h2[0]} cy={h2[1]} r={r} fill="#fff" stroke={INK} strokeWidth={R * 0.08} />
      <circle r={R} fill={SKY} stroke={INK} strokeWidth={R * 0.09} />
      {signs && <>
        <rect x={-R * 0.4} y={-R * 0.1} width={R * 0.8} height={R * 0.2} rx={R * 0.1} fill={INK} />
        {[h1, h2].map(([hx, hy], i) => (
          <g key={i} transform={`translate(${hx} ${hy})`}>
            <rect x={-r * 0.5} y={-r * 0.12} width={r} height={r * 0.24} rx={r * 0.12} fill={PINK} />
            <rect x={-r * 0.12} y={-r * 0.5} width={r * 0.24} height={r} rx={r * 0.12} fill={PINK} />
          </g>
        ))}
      </>}
    </g>
  );
};

/* ---------- scenes ---------- */

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const s = spring({frame: f, fps: FPS, config: {damping: 11}});
  const secs = Math.round(interpolate(f, [10, 110], [120, 0], clamp));
  const timer = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
  const steam = interpolate(f, [30, 70], [0, 1], clamp);
  const ding = f > 110 && f < 130 ? Math.sin(f * 2) * 6 : 0;
  return (
    <AbsoluteFill>
      {f < 140
        ? <div style={{position: 'absolute', top: 150, width: '100%', textAlign: 'center', fontFamily: 'B8', fontSize: 150, color: YEL, textShadow: OUT, transform: `rotate(${ding * 0.5}deg)`}}>{timer}</div>
        : <Slam words={["WHERE'S", 'THE', 'HEAT?']} at={140} y={150} size={115} gap={7} />}
      <div style={{position: 'absolute', left: 90, top: 430, transform: `scale(${s}) translateX(${ding}px)`}}>
        <Microwave timer={timer} glow={f < 110 ? 0.6 + 0.4 * Math.sin(f / 4) : 0} steam={steam} spin={f / 25} />
      </div>
      <Pill text="soup: boiling 🔥" x={300} y={1080} at={50} bg={RED} size={46} />
      <Pill text="plate: meh 😐" x={260} y={1190} at={85} bg={SKY} color={INK} size={46} />
      <Pill text="walls: meh 😐" x={260} y={1300} at={105} bg={TEAL} size={46} />
      <Huh mood="curious" x={850} y={1040} h={320} at={150} />
    </AbsoluteFill>
  );
};

const MagnetronScene: React.FC = () => {
  const f = useCurrentFrame();
  const m = spring({frame: f - 5, fps: FPS, config: {damping: 10}});
  const waveOn = interpolate(f, [40, 70], [0, 1], {...clamp, easing: ease});
  const hum = f > 40 ? Math.sin(f * 2.2) * 2 : 0;
  return (
    <AbsoluteFill>
      <Slam words={['MAGNETRON']} at={0} y={150} size={130} />
      <div style={{position: 'absolute', left: 40, top: 380, transform: `scale(${m})`, transformOrigin: '150px 200px'}}><Magnetron w={330} hum={hum} /></div>
      <svg width={1080} height={700} style={{position: 'absolute', top: 330}}>
        {[0, 1, 2].map((i) => (
          <path key={i} d={wave(380, 180 + i * 130, 380 + 640 * waveOn, 180 + i * 130, 34, 120, f / 2.2 + i)} fill="none"
            stroke={[PINK, YEL, TEAL][i]} strokeWidth={14} strokeLinecap="round" opacity={waveOn} />
        ))}
      </svg>
      <Pill text="invisible waves 👻" x={700} y={900} at={60} bg={PINK} size={46} />
      <div style={{position: 'absolute', top: 1040, width: '100%', textAlign: 'center', fontFamily: 'B8', fontSize: 108, color: YEL, textShadow: OUT, opacity: f > 120 ? 1 : 0}}>
        <Count to={2450000000} at={120} len={70} />
      </div>
      <Pill text="flips every second 🤯" x={540} y={1260} at={135} bg={TEAL} size={50} />
    </AbsoluteFill>
  );
};

const Water: React.FC = () => {
  const f = useCurrentFrame();
  const drop = interpolate(f, [0, 15, 45, 60], [0, 1, 1.6, 4], {...clamp, easing: ease});
  const dropO = interpolate(f, [45, 62], [1, 0], clamp);
  const mol = spring({frame: f - 50, fps: FPS, config: {damping: 9}});
  const wob = Math.sin(f / 9) * 8;
  return (
    <AbsoluteFill>
      {f < 95
        ? <Pill text="food = lots of water 💧" x={540} y={230} at={5} bg={SKY} color={INK} size={54} />
        : <Slam words={['LOPSIDED!']} at={95} y={160} size={140} color={PINK} />}
      <svg width={1080} height={1000} style={{position: 'absolute', top: 340}}>
        <g transform={`translate(540 430) scale(${drop})`} opacity={dropO}>
          <path d="M 0 -140 C 60 -60 110 -10 110 50 A 110 110 0 0 1 -110 50 C -110 -10 -60 -60 0 -140 Z" fill={SKY} stroke={INK} strokeWidth={10 / Math.max(drop, 0.2)} />
        </g>
        {f >= 45 && <Molecule x={540} y={380} R={150} s={mol} angle={wob} />}
      </svg>
      <Pill text="slightly minus" x={540} y={470} at={110} bg={SKY} color={INK} size={46} />
      <Pill text="slightly plus" x={230} y={1180} at={150} bg={PINK} size={46} />
      <Pill text="slightly plus" x={850} y={1180} at={160} bg={PINK} size={46} />
      <Huh mood="thinking" x={540} y={1240} h={170} at={185} />
    </AbsoluteFill>
  );
};

const Spin: React.FC = () => {
  const f = useCurrentFrame();
  const P = 24;
  const flips = Math.floor(f / P), ph = (f % P) / P;
  const base = flips * 180 + 180 * Easing.out(Easing.cubic)(Math.min(1, ph * 2.2));
  const chaos = interpolate(f, [90, 150], [0, 1], clamp);
  const heat = interpolate(f, [120, 210], [0, 1], {...clamp, easing: ease});
  const leftPlus = flips % 2 === 0;
  const plate = (x: number, plus: boolean) => (
    <g>
      <rect x={x - 30} y={60} width={60} height={700} rx={20} fill={plus ? PINK : SKY} stroke={INK} strokeWidth={8} />
      <text x={x} y={430} textAnchor="middle" fontFamily="B8" fontSize={80} fill={INK}>{plus ? '+' : '−'}</text>
    </g>
  );
  return (
    <AbsoluteFill>
      <Slam words={['SPIN', 'CRASH', 'HEAT']} at={10} y={140} size={105} gap={55} />
      <svg width={1080} height={820} style={{position: 'absolute', top: 330}}>
        <rect x={150} y={60} width={780} height={700} rx={30} fill={interpolateColors(heat, [0, 1], ['#ffffff00', '#FF404055'])} />
        {plate(110, leftPlus)}{plate(970, !leftPlus)}
        {Array.from({length: 9}).map((_, i) => {
          const cx = 330 + (i % 3) * 210, cy = 200 + Math.floor(i / 3) * 210;
          const jx = chaos * Math.sin(f * 0.9 + i * 2.1) * 26, jy = chaos * Math.cos(f * 1.1 + i * 1.3) * 26;
          const ang = base + 90 + (random('m' + i) - 0.5) * 50 * (1 + chaos);
          return <Molecule key={i} x={cx + jx} y={cy + jy} R={46} angle={ang} signs={false} />;
        })}
        {chaos > 0.3 && Array.from({length: 6}).map((_, i) => {
          const on = (f + i * 7) % 20 < 6;
          const x = 435 + (i % 2) * 210, y = 200 + Math.floor(i / 2) * 210 + 105;
          return on ? <polygon key={i} points={`${x},${y - 30} ${x + 9},${y - 9} ${x + 30},${y} ${x + 9},${y + 9} ${x},${y + 30} ${x - 9},${y + 9} ${x - 30},${y} ${x - 9},${y - 9}`} fill={YEL} stroke={INK} strokeWidth={4} /> : null;
        })}
      </svg>
      {/* thermometer */}
      <div style={{position: 'absolute', left: 140, top: 1230, width: 800, height: 70, borderRadius: 35, background: '#ffffff22', border: `6px solid #fff`, overflow: 'hidden'}}>
        <div style={{width: `${heat * 100}%`, height: '100%', background: `linear-gradient(90deg, ${ORG}, ${RED})`}} />
      </div>
      <div style={{position: 'absolute', left: 60, top: 1215, fontSize: 90, transform: `scale(${1 + heat * 0.2})`}}>🌡️</div>
      <div style={{position: 'absolute', left: 950, top: 1215, fontSize: 90, opacity: heat}}>🔥</div>
    </AbsoluteFill>
  );
};

const Plate: React.FC = () => {
  const f = useCurrentFrame();
  const draw = interpolate(f, [10, 70], [0, 1], {...clamp, easing: ease});
  const hot = interpolate(f, [60, 140], [0, 1], clamp);
  const down = interpolate(f, [170, 220], [0, 1], {...clamp, easing: ease});
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 150, width: '100%', textAlign: 'center', fontFamily: 'B8', fontSize: 80, color: '#fff', textShadow: OUT}}>waves zoom <span style={{color: YEL}}>right through</span></div>
      <svg width={1080} height={1100} style={{position: 'absolute', top: 290}}>
        {/* waves: outer ones pass through the plate, the middle one stops in the food */}
        {[200, 880].map((x, i) => (
          <path key={i} d={wave(x, 0, x, 1050, 26, 110, f / 2.5)} fill="none" stroke={PINK} strokeWidth={12} strokeLinecap="round"
            pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
        ))}
        <path d={wave(540, 0, 540, 560, 26, 110, f / 2.5)} fill="none" stroke={PINK} strokeWidth={12} strokeLinecap="round"
          pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.min(1, draw * 1.9)} />
        {/* plate */}
        <path d="M 90 740 Q 540 860 990 740 L 940 790 Q 540 900 140 790 Z" fill="#E9F1FF" stroke={INK} strokeWidth={10} strokeLinejoin="round" />
        {/* food */}
        <path d="M 330 760 Q 340 540 540 530 Q 740 540 750 760 Q 540 800 330 760 Z" fill={interpolateColors(hot, [0, 1], [ORG, RED])} stroke={INK} strokeWidth={10} strokeLinejoin="round" />
        {[0, 1, 2].map((i) => (
          <path key={i} d={wave(470 + i * 70, 500, 470 + i * 70, 380, 10, 60, f / 4 + i)} fill="none" stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={hot * 0.8} />
        ))}
        {/* heat creeping down into the plate */}
        {[420, 540, 660].map((x, i) => (
          <path key={i} d={`M ${x} 790 L ${x} ${790 + 70 * down}`} stroke={RED} strokeWidth={14} strokeLinecap="round" opacity={down} />
        ))}
      </svg>
      <Pill text="glass ✔" x={250} y={430} at={20} bg={SKY} color={INK} size={46} />
      <Pill text="ceramic ✔" x={840} y={430} at={35} bg={TEAL} size={46} />
      <Pill text="food grabs them 🍲" x={540} y={1280} at={80} bg={RED} size={46} />
      <Pill text="plate warmed by food" x={540} y={1380} at={175} bg={YEL} color={INK} size={44} />
    </AbsoluteFill>
  );
};

const Walls: React.FC = () => {
  const f = useCurrentFrame();
  const bounce = interpolate(f, [5, 95], [0, 1], clamp);
  const mag = spring({frame: f - 100, fps: FPS, config: {damping: 11}});
  const hit = interpolate(f, [110, 145], [0, 1], {...clamp, easing: ease});
  const back = interpolate(f, [145, 175], [0, 1], {...clamp, easing: ease});
  const light = interpolate(f, [180, 215], [0, 1], {...clamp, easing: ease});
  const holes = [1080, 1150, 1220];
  return (
    <AbsoluteFill>
      <Slam words={['BOING!']} at={0} y={140} size={120} color={YEL} />
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        {/* oven box, top view */}
        <rect x={120} y={290} width={840} height={470} rx={20} fill="#ffffff10" stroke={METAL} strokeWidth={22} />
        <Arrow d="M 170 340 L 520 735 L 935 470 L 720 315 L 330 735 L 145 500 L 420 315" progress={bounce} color={PINK} w={12} />
        {/* magnifier on the door screen (side view) */}
        <g transform={`translate(540 1150) scale(${mag}) translate(-540 -1150)`}>
          <defs><clipPath id="lens"><circle cx={540} cy={1150} r={230} /></clipPath></defs>
          <circle cx={540} cy={1150} r={230} fill="#1E2440" />
          <g clipPath="url(#lens)">
            {/* metal screen with tiny holes */}
            {[920, ...holes].map((y0, i) => {
              const y1 = i < holes.length ? holes[i] - 14 : 1390;
              return <rect key={i} x={525} y={i === 0 ? 900 : holes[i - 1] + 14} width={30} height={(i < holes.length ? holes[i] - 14 : 1390) - (i === 0 ? 900 : holes[i - 1] + 14)} fill={METAL} stroke={INK} strokeWidth={4} />;
            })}
            {/* big wave hits and bounces back */}
            <path d={wave(300, 1010, 300 + 215 * hit, 1010, 40, 150, f / 2)} fill="none" stroke={PINK} strokeWidth={14} strokeLinecap="round" opacity={1 - back * 0.4} />
            {back > 0 && <Arrow d="M 505 1060 Q 470 1110 340 1110" progress={back} color={PINK} w={12} />}
            {/* light zips through the holes */}
            {holes.map((y, i) => (
              <path key={i} d={wave(300, y, 300 + 480 * light, y, 4, 22, f)} fill="none" stroke={YEL} strokeWidth={5} opacity={light} />
            ))}
          </g>
          <circle cx={540} cy={1150} r={230} fill="none" stroke="#fff" strokeWidth={16} />
          <path d="M 700 1320 L 800 1410" stroke="#fff" strokeWidth={30} strokeLinecap="round" />
        </g>
      </svg>
      <Pill text="metal = mirror 🪞" x={540} y={830} at={40} bg={TEAL} size={46} />
      <Pill text="wave ~12 cm" x={160} y={980} at={120} bg={PINK} size={38} />
      <Pill text="holes ~1 mm" x={920} y={980} at={130} bg="#fff" color={INK} size={38} />
      <Pill text="light ✅" x={900} y={1250} at={190} bg={YEL} color={INK} size={42} />
    </AbsoluteFill>
  );
};

const Spots: React.FC = () => {
  const f = useCurrentFrame();
  const map = interpolate(f, [10, 60], [0, 1], {...clamp, easing: ease});
  const rot = interpolate(f, [150, 235], [0, 240], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const N = 7, cell = 114, x0 = 141, y0 = 330;
  return (
    <AbsoluteFill>
      <Slam words={['HOT', '&', 'COLD']} at={80} y={150} size={115} gap={10} />
      <svg width={1080} height={1100} style={{position: 'absolute', top: 0}}>
        <rect x={x0 - 20} y={y0 - 20} width={N * cell + 40} height={N * cell + 40} rx={24} fill="#ffffff10" stroke={METAL} strokeWidth={14} />
        {/* food on the turntable */}
        <g transform={`rotate(${rot} 540 729)`}>
          <circle cx={540} cy={729} r={330} fill="#E9F1FF" stroke={INK} strokeWidth={10} />
          <circle cx={540} cy={729} r={260} fill={YEL} stroke={INK} strokeWidth={10} />
          <circle cx={540} cy={729} r={225} fill={ORG} opacity={0.6} />
          {Array.from({length: 7}).map((_, i) => {
            const a = (i / 7) * Math.PI * 2, rr = i === 0 ? 0 : 150;
            return <circle key={i} cx={540 + Math.cos(a) * rr} cy={729 + Math.sin(a) * rr} r={38} fill={RED} stroke={INK} strokeWidth={6} />;
          })}
          <path d="M 540 729 L 540 400" stroke={INK} strokeWidth={8} strokeDasharray="20 14" opacity={0.6} />
        </g>
        {/* standing-wave heat map stays put */}
        {Array.from({length: N * N}).map((_, k) => {
          const i = k % N, j = Math.floor(k / N);
          const v = Math.abs(Math.sin((Math.PI * (i + 0.5)) / 2.2) * Math.sin((Math.PI * (j + 0.5)) / 2.2));
          const pulse = 0.85 + 0.15 * Math.sin(f / 5 + k);
          return <circle key={k} cx={x0 + cell * (i + 0.5)} cy={y0 + cell * (j + 0.5)} r={cell * 0.42 * map * pulse}
            fill={interpolateColors(v, [0, 0.5, 1], [SKY, '#ffffff', RED])} opacity={0.55} />;
        })}
      </svg>
      <div style={{position: 'absolute', left: x0 + cell * 0.5 - 50, top: y0 + cell * 0.5 - 60, fontSize: 90, opacity: interpolate(f, [60, 70], [0, 1], clamp)}}>🔥</div>
      <div style={{position: 'absolute', left: x0 + cell * 2 - 50, top: y0 + cell * 2 - 60, fontSize: 90, opacity: interpolate(f, [75, 85], [0, 1], clamp)}}>🧊</div>
      <Pill text="pile up + cancel out" x={540} y={1210} at={30} bg={PINK} size={46} />
      <Pill text="spin = fair share 🔄" x={420} y={1320} at={150} bg={TEAL} size={46} />
      <Huh mood="laughing" x={930} y={1150} h={240} at={170} />
    </AbsoluteFill>
  );
};

const Myth: React.FC = () => {
  const f = useCurrentFrame();
  const pot = spring({frame: f - 70, fps: FPS, config: {damping: 11}});
  const ring = interpolate(f, [100, 140], [0, 1], {...clamp, easing: ease});
  const cond = interpolate(f, [160, 230], [0, 1], {...clamp, easing: ease});
  const R = 280, cx = 540, cy = 1080;
  return (
    <AbsoluteFill>
      <SwapCards before="cooks from the inside out" after="heats the outside first" label="nope..." at={5} y={150} />
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        <g transform={`translate(${cx} ${cy}) scale(${pot}) translate(${-cx} ${-cy})`}>
          <circle cx={cx} cy={cy} r={R} fill="#F4D58D" stroke={INK} strokeWidth={12} />
          <circle cx={cx} cy={cy} r={R - 6 - 40} fill="none" stroke={RED} strokeWidth={80} opacity={ring * 0.85} />
          <circle cx={cx} cy={cy} r={(R - 86) * cond} fill={ORG} opacity={cond * 0.7} />
          {[0, 1, 2, 3].map((i) => {
            const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
            const r0 = R - 100, r1 = r0 - 90 * cond;
            return <path key={i} d={`M ${cx + Math.cos(a) * r0} ${cy + Math.sin(a) * r0} L ${cx + Math.cos(a) * r1} ${cy + Math.sin(a) * r1}`}
              stroke={INK} strokeWidth={14} strokeLinecap="round" opacity={cond > 0.05 ? 1 : 0} />;
          })}
        </g>
      </svg>
      <Pill text="~1 cm 🔥" x={850} y={850} at={115} bg={RED} size={46} />
      <Pill text="middle: slow way 🐢" x={540} y={1080} at={170} bg={YEL} color={INK} size={46} />
    </AbsoluteFill>
  );
};

const Candy: React.FC = () => {
  const f = useCurrentFrame();
  const melt = interpolate(f, [80, 200], [0, 1], {...clamp, easing: ease});
  const waveOn = interpolate(f, [30, 60], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Pill text="1940s 📻" x={230} y={230} at={0} bg={YEL} color={INK} size={56} />
      <Pill text="Percy Spencer 🧑‍🔬" x={680} y={230} at={20} bg={TEAL} size={50} />
      <div style={{position: 'absolute', left: 20, top: 520}}><Magnetron w={250} hum={f > 30 ? Math.sin(f * 2.2) * 2 : 0} /></div>
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        {[0, 1].map((i) => (
          <path key={i} d={wave(280, 650 + i * 110, 280 + 300 * waveOn, 650 + i * 110, 26, 90, f / 2.2 + i)} fill="none" stroke={PINK} strokeWidth={12} strokeLinecap="round" opacity={waveOn} />
        ))}
        {/* lab coat + pocket */}
        <rect x={600} y={340} width={520} height={820} rx={30} fill="#F3F3F7" stroke={INK} strokeWidth={12} />
        <path d="M 640 340 L 700 470 M 1080 340 L 1020 470" stroke={INK} strokeWidth={10} strokeLinecap="round" />
        {/* candy bar: chocolate on top, red wrapper below */}
        <rect x={700} y={450 + 90 * melt} width={150} height={190 - 90 * melt} rx={12 + 50 * melt} fill={CHOC} stroke={INK} strokeWidth={10} />
        <rect x={700} y={600} width={150} height={120} fill={RED} stroke={INK} strokeWidth={10} />
        <text x={775} y={672} textAnchor="middle" fontFamily="B8" fontSize={44} fill="#fff">YUM</text>
        <rect x={650} y={700} width={330} height={310} rx={16} fill="#E6E8F2" stroke={INK} strokeWidth={10} />
        <line x1={650} y1={740} x2={980} y2={740} stroke={INK} strokeWidth={6} strokeDasharray="16 12" />
        {/* drips */}
        {[714, 836].map((x, i) => {
          const len = (110 + i * 120) * melt;
          return <rect key={i} x={x - 14} y={590} width={28} height={len} rx={14} fill={CHOC} stroke={INK} strokeWidth={6} />;
        })}
      </svg>
      <Slam words={['MELTED!']} at={150} y={1220} size={130} color={ORG} />
      <Huh mood="shocked" x={150} y={1010} h={250} at={160} />
    </AbsoluteFill>
  );
};

export const scenes: SceneMap = {
  hook: {C: Hook, hue: ORG}, magnetron: {C: MagnetronScene, hue: PINK}, water: {C: Water, hue: SKY}, spin: {C: Spin, hue: TEAL},
  plate: {C: Plate, hue: YEL}, walls: {C: Walls, hue: '#5b6cff'}, spots: {C: Spots, hue: RED}, myth: {C: Myth, hue: '#9b5cff'},
  candy: {C: Candy, hue: '#C8743A'}, cta: {C: CTA, hue: PINK},
};
