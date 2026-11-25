import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, interpolateColors, spring, Easing, random} from 'remotion';
import {FPS, INK, PINK, YEL, TEAL, ORG, CREAM, SKY, RED, clamp, ease, Slam, Pill, Huh, Arrow, Count, Marker, CTA, SceneMap} from '../../kit';
import timing from './timing.json';

export const title = 'how heavy is a cloud?';
export const segs = timing;

const OUT = `0 8px 0 ${INK}`, GREY = '#9AA5B8', GREY2 = '#7C879C', WATER = '#5FB4FF';

/* ---------- illustrations ---------- */

const PUFFS: [number, number, number][] = [[-175, 45, 105], [-70, -25, 135], [70, -55, 125], [185, 25, 105], [0, 60, 130], [-110, 75, 95], [120, 80, 95]];

/** Flat puffy cloud with an optional cute face. Centered on (0,0) in a 600x360 box. */
const Cloud: React.FC<{w?: number; face?: boolean; mood?: 'happy' | 'shock'; fill?: string}> = ({w = 600, face = true, mood = 'happy', fill = '#FFFFFF'}) => {
  const f = useCurrentFrame();
  const blink = f % 90 > 84;
  return (
    <svg viewBox="-300 -190 600 380" width={w} height={(w * 380) / 600} style={{overflow: 'visible'}}>
      {PUFFS.map(([x, y, r], i) => <circle key={'o' + i} cx={x} cy={y} r={r + 11} fill={INK} />)}
      {PUFFS.map(([x, y, r], i) => <circle key={'f' + i} cx={x} cy={y} r={r} fill={fill} />)}
      {PUFFS.slice(0, 4).map(([x, y, r], i) => <circle key={'h' + i} cx={x - r * 0.3} cy={y - r * 0.35} r={r * 0.28} fill="#ffffff" opacity={0.7} />)}
      {face && <g>
        {blink
          ? <><rect x={-70} y={28} width={36} height={8} rx={4} fill={INK} /><rect x={34} y={28} width={36} height={8} rx={4} fill={INK} /></>
          : <><circle cx={-52} cy={30} r={mood === 'shock' ? 18 : 15} fill={INK} /><circle cx={52} cy={30} r={mood === 'shock' ? 18 : 15} fill={INK} />
            <circle cx={-47} cy={24} r={5} fill="#fff" /><circle cx={57} cy={24} r={5} fill="#fff" /></>}
        <circle cx={-95} cy={68} r={18} fill={PINK} opacity={0.5} /><circle cx={95} cy={68} r={18} fill={PINK} opacity={0.5} />
        {mood === 'shock'
          ? <ellipse cx={0} cy={82} rx={20} ry={26} fill={INK} />
          : <path d="M -26 70 Q 0 98 26 70" fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" />}
      </g>}
    </svg>
  );
};

const House: React.FC<{w?: number}> = ({w = 420}) => (
  <svg viewBox="0 0 420 380" width={w} height={(w * 380) / 420} style={{overflow: 'visible'}}>
    <rect x={290} y={30} width={50} height={110} fill={RED} stroke={INK} strokeWidth={10} />
    <rect x={50} y={160} width={320} height={210} fill={CREAM} stroke={INK} strokeWidth={10} />
    <path d="M 20 180 L 210 20 L 400 180 Z" fill={PINK} stroke={INK} strokeWidth={10} strokeLinejoin="round" />
    <rect x={170} y={250} width={80} height={120} rx={8} fill={ORG} stroke={INK} strokeWidth={8} />
    <rect x={80} y={210} width={70} height={70} fill={SKY} stroke={INK} strokeWidth={8} />
    <rect x={270} y={210} width={70} height={70} fill={SKY} stroke={INK} strokeWidth={8} />
  </svg>
);

/** Small flat elephant for counting. Draw inside an <svg>. */
const Elephant: React.FC<{x: number; y: number; s?: number; flip?: boolean}> = ({x, y, s = 1, flip}) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    {[-14, 2, 18, 30].map((lx, i) => <rect key={i} x={lx - 1} y={12} width={11} height={20} rx={4} fill={GREY2} stroke={INK} strokeWidth={3.5} />)}
    <ellipse cx={10} cy={6} rx={30} ry={20} fill={GREY} stroke={INK} strokeWidth={4} />
    <path d="M -22 0 Q -42 10 -38 32" fill="none" stroke={INK} strokeWidth={11} strokeLinecap="round" />
    <path d="M -22 0 Q -42 10 -38 32" fill="none" stroke={GREY} strokeWidth={5} strokeLinecap="round" />
    <circle cx={-20} cy={-8} r={17} fill={GREY} stroke={INK} strokeWidth={4} />
    <ellipse cx={-8} cy={-6} rx={10} ry={14} fill={PINK} stroke={INK} strokeWidth={3.5} />
    <circle cx={-26} cy={-12} r={3} fill={INK} />
  </g>
);

const Drop: React.FC<{x: number; y: number; s?: number; face?: boolean; color?: string}> = ({x, y, s = 1, face, color = WATER}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M 0 -60 C 26 -26 46 -4 46 22 A 46 46 0 0 1 -46 22 C -46 -4 -26 -26 0 -60 Z" fill={color} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
    <ellipse cx={-16} cy={6} rx={8} ry={14} fill="#fff" opacity={0.7} />
    {face && <><circle cx={-12} cy={24} r={6} fill={INK} /><circle cx={14} cy={24} r={6} fill={INK} /><path d="M -8 38 Q 1 46 10 38" stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" /></>}
  </g>
);

/* ---------- scenes ---------- */

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const c = spring({frame: f - 2, fps: FPS, config: {damping: 12}});
  const bob = Math.sin(f / 14) * 14;
  const tag = spring({frame: f - 25, fps: FPS, config: {damping: 9}});
  const sway = Math.sin(f / 9) * 6 * tag;
  const wobble = f > 120 ? Math.sin(f / 3) * 3 : 0;
  return (
    <AbsoluteFill>
      {f < 120
        ? <div style={{position: 'absolute', top: 140, width: '100%', textAlign: 'center', fontFamily: 'B8', fontSize: 70, color: '#fff', textShadow: OUT}}>this fluffy thing weighs...</div>
        : <Slam words={['SO', 'WHY', "ISN'T", 'IT', 'FALLING?']} at={120} y={130} size={100} gap={6} />}
      <div style={{position: 'absolute', left: 140, top: 380 + bob, transform: `scale(${c}) rotate(${wobble}deg)`}}>
        <Cloud w={800} mood={f > 120 ? 'shock' : 'happy'} />
      </div>
      {/* weight tag hanging from the cloud */}
      <div style={{position: 'absolute', left: 540, top: 790 + bob, transformOrigin: '0 0', transform: `rotate(${sway}deg) scale(${tag})`}}>
        <div style={{position: 'absolute', left: -3, top: -60, width: 6, height: 70, background: '#fff'}} />
        <div style={{position: 'absolute', left: -230, top: 0, width: 460, textAlign: 'center', background: YEL, color: INK, fontFamily: 'B8', fontSize: 64, padding: '10px 0', borderRadius: 24, boxShadow: OUT}}>
          <Count to={1100000} at={30} len={60} /> lb
        </div>
      </div>
      <div style={{position: 'absolute', left: 90, top: 1040}}><House w={380} /></div>
      <Pill text="your house 🏠" x={280} y={1400 - 20} at={60} bg={TEAL} size={44} />
      <Huh mood="shocked" x={800} y={1010} h={360} at={135} />
    </AbsoluteFill>
  );
};

const Cube: React.FC = () => {
  const f = useCurrentFrame();
  const c = spring({frame: f, fps: FPS, config: {damping: 12}});
  const draw = interpolate(f, [95, 150], [0, 1], {...clamp, easing: ease});
  const fill = interpolate(f, [150, 175], [0, 1], clamp);
  // front square + back square offset
  const x0 = 200, y0 = 560, S = 560, dx = 150, dy = -150;
  const F = [[x0, y0], [x0 + S, y0], [x0 + S, y0 + S], [x0, y0 + S]];
  const B = F.map(([x, y]) => [x + dx, y + dy]);
  const sq = (P: number[][]) => `M ${P.map((p) => p.join(' ')).join(' L ')} Z`;
  return (
    <AbsoluteFill>
      <Pill text="cumulus ☁️" x={540} y={200} at={8} bg={SKY} color={INK} size={56} />
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        <path d={sq(B)} fill={SKY} opacity={fill * 0.12} />
        <path d={sq(F)} fill={SKY} opacity={fill * 0.18} />
        <Arrow d={sq(B)} progress={draw} color="#ffffff88" w={8} />
        {F.map(([x, y], i) => <Arrow key={i} d={`M ${x} ${y} L ${B[i][0]} ${B[i][1]}`} progress={draw} color={YEL} w={10} />)}
      </svg>
      <div style={{position: 'absolute', left: 175, top: 600 + Math.sin(f / 14) * 10, transform: `scale(${c})`}}><Cloud w={660} /></div>
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        <Arrow d={sq(F)} progress={draw} color={YEL} w={12} />
      </svg>
      <Pill text="1 km ↔" x={x0 + S / 2} y={y0 + S + 50} at={160} bg={PINK} size={46} />
      <Pill text="1 km ↕" x={x0 + S + 115} y={y0 + S / 2 - 20} at={175} bg={TEAL} size={44} />
      <Pill text="1 km ↗" x={925} y={475} at={190} bg={ORG} size={44} />
      <Slam words={['A', 'GIANT', 'BOX']} at={100} y={320} size={96} gap={6} />
    </AbsoluteFill>
  );
};

const Water: React.FC = () => {
  const f = useCurrentFrame();
  const box = spring({frame: f - 5, fps: FPS, config: {damping: 11}});
  const drop = spring({frame: f - 40, fps: FPS, config: {damping: 8}});
  const ring = (f % 40) / 40;
  const spoon = spring({frame: f - 110, fps: FPS, config: {damping: 10}});
  const pour = interpolate(f, [125, 165], [0, 1], {...clamp, easing: ease});
  return (
    <AbsoluteFill>
      <Slam words={['HALF', 'A', 'GRAM']} at={30} y={140} size={120} gap={7} />
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        <g transform={`translate(300 820) scale(${box}) translate(-300 -820)`}>
          {/* 1 m3 box, isometric-ish */}
          <path d="M 90 640 L 410 640 L 410 960 L 90 960 Z" fill="#ffffff14" stroke="#fff" strokeWidth={8} />
          <path d="M 90 640 L 190 540 L 510 540 L 410 640 M 410 960 L 510 860 L 510 540" fill="none" stroke="#fff" strokeWidth={8} strokeLinejoin="round" />
          <circle cx={300} cy={800} r={30 + ring * 90} fill="none" stroke={WATER} strokeWidth={6} opacity={(1 - ring) * drop} />
          <Drop x={300} y={805} s={0.42 * drop} />
        </g>
        {/* teaspoon */}
        <g transform={`translate(800 820) scale(${spoon}) rotate(${-20 + 6 * Math.sin(f / 10)}) translate(-800 -820)`}>
          <rect x={790} y={560} width={34} height={260} rx={17} fill="#D6DCE8" stroke={INK} strokeWidth={8} />
          <ellipse cx={807} cy={880} rx={95} ry={120} fill="#D6DCE8" stroke={INK} strokeWidth={9} />
          <ellipse cx={807} cy={890} rx={70 * pour} ry={92 * pour} fill={WATER} />
        </g>
      </svg>
      <Pill text="1 m³ of cloud" x={300} y={1040} at={10} bg="#fff" color={INK} size={46} />
      <Pill text="0.5 g" x={300} y={1150} at={45} bg={WATER} color={INK} size={50} />
      <Pill text="teaspoon ≈ 5 g" x={800} y={1080} at={125} bg={ORG} size={44} />
      <div style={{position: 'absolute', top: 1260, width: '100%', textAlign: 'center', fontFamily: 'B8', fontSize: 84, color: '#fff', textShadow: OUT, opacity: f > 150 ? 1 : 0}}>
        <Marker at={152} color={PINK}>way less!</Marker>
      </div>
    </AbsoluteFill>
  );
};

const Mathy: React.FC = () => {
  const f = useCurrentFrame();
  const l1 = spring({frame: f, fps: FPS, config: {damping: 12}});
  const l2 = spring({frame: f - 95, fps: FPS, config: {damping: 9}});
  const N = 100, cols = 10, cw = 98, ch = 84, gx = 50, gy = 590;
  const st = 150;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 140, width: '100%', textAlign: 'center', fontFamily: 'B8', fontSize: 74, color: '#fff', textShadow: OUT, transform: `scale(${l1})`}}>
        0.5 g × <span style={{color: SKY}}><Count to={1000000000} at={15} len={55} /></span>
      </div>
      <div style={{position: 'absolute', top: 260, width: '100%', textAlign: 'center', fontFamily: 'B8', fontSize: 112, color: YEL, textShadow: OUT, transform: `scale(${l2}) rotate(${(1 - l2) * -8}deg)`}}>
        = <Count to={500000} at={95} len={45} /> kg
      </div>
      <Pill text="≈ 100 elephants 🐘" x={540} y={500} at={st - 10} bg={PINK} size={50} />
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        {Array.from({length: N}).map((_, i) => {
          const s = spring({frame: f - st - i * 0.8, fps: FPS, config: {damping: 10}});
          const c = i % cols, r = Math.floor(i / cols);
          const hop = Math.max(0, Math.sin((f + i * 5) / 6)) * 5;
          return s > 0.01 ? <Elephant key={i} x={gx + cw * c + 50} y={gy + ch * r + 40 - hop} s={1.1 * s} flip={r % 2 === 1} /> : null;
        })}
      </svg>
    </AbsoluteFill>
  );
};

const Size: React.FC = () => {
  const f = useCurrentFrame();
  const lens = spring({frame: f - 40, fps: FPS, config: {damping: 11}});
  const hair = interpolate(f, [70, 110], [0, 1], {...clamp, easing: ease});
  const cx = 540, cy = 820, R = 400;
  return (
    <AbsoluteFill>
      <Slam words={['SIZE', 'MATTERS']} at={0} y={140} size={120} gap={8} />
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        <g transform={`translate(${cx} ${cy}) scale(${lens}) translate(${-cx} ${-cy})`}>
          <defs><clipPath id="lensC"><circle cx={cx} cy={cy} r={R} /></clipPath></defs>
          <circle cx={cx} cy={cy} r={R} fill="#1E2440" />
          <g clipPath="url(#lensC)">
            {/* a human hair crossing the view */}
            <g transform={`rotate(-28 ${cx} ${cy})`}>
              <rect x={cx - 700} y={cy - 110} width={1400 * hair} height={220} fill="#C98A4B" stroke={INK} strokeWidth={10} />
              {Array.from({length: 12}).map((_, i) => (
                <path key={i} d={`M ${cx - 640 + i * 120} ${cy - 110} l 40 0 l -30 50`} fill="none" stroke="#8A5A2B" strokeWidth={8} opacity={hair > i / 12 ? 0.8 : 0} />
              ))}
            </g>
            {/* tiny cloud droplets drifting */}
            {Array.from({length: 14}).map((_, i) => {
              const a = spring({frame: f - 120 - i * 3, fps: FPS, config: {damping: 10}});
              const x = cx - 330 + random('dx' + i) * 660 + Math.sin(f / 20 + i) * 14;
              const y = cy - 330 + random('dy' + i) * 660 + Math.cos(f / 23 + i) * 14;
              const r = 18 + random('dr' + i) * 18;
              return <circle key={i} cx={x} cy={y} r={r * a} fill={WATER} stroke={INK} strokeWidth={5} />;
            })}
          </g>
          <circle cx={cx} cy={cy} r={R} fill="none" stroke="#fff" strokeWidth={20} />
          <path d={`M ${cx + 285} ${cy + 285} L ${cx + 400} ${cy + 400}`} stroke="#fff" strokeWidth={40} strokeLinecap="round" />
        </g>
      </svg>
      <Pill text="one human hair" x={290} y={470} at={80} bg="#C98A4B" size={44} />
      <Pill text="cloud droplets" x={760} y={1340} at={135} bg={WATER} color={INK} size={46} />
      <Pill text="thousandths of a mm!" x={330} y={1250} at={160} bg={YEL} color={INK} size={44} />
    </AbsoluteFill>
  );
};

const Walker: React.FC<{x: number; y: number; phase: number}> = ({x, y, phase}) => {
  const a = Math.sin(phase) * 28;
  return (
    <g transform={`translate(${x} ${y})`}>
      <g transform={`rotate(${a} 0 0)`}><rect x={-9} y={0} width={18} height={80} rx={9} fill={TEAL} stroke={INK} strokeWidth={5} /></g>
      <g transform={`rotate(${-a} 0 0)`}><rect x={-9} y={0} width={18} height={80} rx={9} fill={TEAL} stroke={INK} strokeWidth={5} /></g>
      <rect x={-26} y={-90} width={52} height={100} rx={22} fill={PINK} stroke={INK} strokeWidth={6} />
      <g transform={`rotate(${-a} 0 -75)`}><rect x={-8} y={-75} width={16} height={70} rx={8} fill={CREAM} stroke={INK} strokeWidth={5} /></g>
      <circle cx={0} cy={-120} r={32} fill={CREAM} stroke={INK} strokeWidth={6} />
      <circle cx={12} cy={-124} r={5} fill={INK} />
    </g>
  );
};

const Slow: React.FC = () => {
  const f = useCurrentFrame();
  const mins = interpolate(f, [25, 205], [0, 60], clamp);
  const L0 = 110, L1 = 970, W = L1 - L0;
  const dropX = L0 + W * (mins / 60) * 0.036; // ~36 m out of a 1 km track
  const walk = (mins / 12) % 1; // ~5 km per hour = 5 laps of 1 km
  const laps = Math.floor(mins / 12);
  const lane = (y: number, col: string) => (
    <g>
      <rect x={L0 - 20} y={y - 70} width={W + 40} height={140} rx={30} fill="#ffffff12" stroke={col} strokeWidth={6} />
      <line x1={L1} y1={y - 70} x2={L1} y2={y + 70} stroke="#fff" strokeWidth={10} strokeDasharray="14 10" />
    </g>
  );
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 140, width: '100%', textAlign: 'center', fontFamily: 'B8', fontSize: 96, color: '#fff', textShadow: OUT}}>
        ⏱️ <span style={{color: YEL}}>{Math.floor(mins)}</span> min
      </div>
      <Pill text="1 km race 🏁" x={540} y={300} at={5} bg={PINK} size={48} />
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        {lane(560, WATER)}
        {lane(900, TEAL)}
        <Drop x={dropX + 30} y={575} s={0.85} face />
        <Walker x={L0 + 40 + (W - 60) * walk} y={880} phase={f / 3} />
      </svg>
      <Pill text="droplet: 18 to 36 m per hour 😴" x={540} y={420} at={40} bg={WATER} color={INK} size={44} />
      <div style={{position: 'absolute', top: 1010, width: '100%', textAlign: 'center', fontFamily: 'B8', fontSize: 64, color: '#fff', textShadow: OUT}}>
        you: <span style={{color: YEL}}>{laps}</span> laps done 😎
      </div>
      <Huh mood="laughing" x={540} y={1110} h={290} at={150} />
    </AbsoluteFill>
  );
};

const Updraft: React.FC = () => {
  const f = useCurrentFrame();
  const c = spring({frame: f, fps: FPS, config: {damping: 12}});
  const arrows = interpolate(f, [30, 70], [0, 1], {...clamp, easing: ease});
  const sun = spring({frame: f - 10, fps: FPS, config: {damping: 10}});
  return (
    <AbsoluteFill>
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        {/* ground + sun */}
        <rect x={0} y={1270} width={1080} height={150} fill="#3BB273" stroke={INK} strokeWidth={10} />
        <g transform={`translate(930 1130) scale(${sun}) rotate(${f})`}>
          {Array.from({length: 10}).map((_, i) => <rect key={i} x={-8} y={-115} width={16} height={36} rx={8} fill={YEL} transform={`rotate(${i * 36})`} />)}
          <circle r={70} fill={YEL} stroke={INK} strokeWidth={9} />
        </g>
        {/* rising warm air: looping wavy arrows */}
        {[220, 420, 620].map((x, i) => {
          const off = ((f * 4 + i * 60) % 120);
          return (
            <g key={i} opacity={arrows}>
              <path d={`M ${x} 1250 C ${x - 40} 1120 ${x + 40} 1000 ${x} 860`} fill="none" stroke={ORG} strokeWidth={16} strokeLinecap="round" strokeDasharray="60 60" strokeDashoffset={off} />
              <path d={`M ${x - 32} 900 L ${x} 852 L ${x + 32} 900`} fill="none" stroke={ORG} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" />
            </g>
          );
        })}
      </svg>
      <div style={{position: 'absolute', left: 90, top: 260, transform: `scale(${c})`}}><Cloud w={900} /></div>
      {/* droplets sink a little, then get pushed back up */}
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        {Array.from({length: 7}).map((_, i) => {
          const t = ((f + i * 23) % 70) / 70;
          const y = 760 + (t < 0.7 ? t * 80 : (1 - (t - 0.7) / 0.3) * 56);
          const show = interpolate(f, [60 + i * 4, 70 + i * 4], [0, 1], clamp);
          return <Drop key={i} x={200 + i * 110} y={y} s={0.38 * show} />;
        })}
      </svg>
      <Pill text="warm air rises ⬆️" x={400} y={1345} at={40} bg={ORG} size={48} />
      <Pill text="droplets: sink slowly ⬇️" x={540} y={170} at={110} bg={WATER} color={INK} size={44} />
      <Slam words={['PUSHED', 'BACK', 'UP!']} at={150} y={1010} size={92} gap={7} />
    </AbsoluteFill>
  );
};

const Air: React.FC = () => {
  const f = useCurrentFrame();
  const s = spring({frame: f - 5, fps: FPS, config: {damping: 12}});
  const airIn = spring({frame: f - 60, fps: FPS, config: {damping: 9}});
  const tilt = interpolate(f, [70, 110], [0, -18], {...clamp, easing: Easing.out(Easing.back(2))});
  const cx = 540, cy = 760, arm = 360;
  const rad = (tilt * Math.PI) / 180;
  // tilt < 0 => right side goes down (air side heavier)
  const lx = cx - arm * Math.cos(rad), ly = cy + arm * Math.sin(rad);
  const rx = cx + arm * Math.cos(rad), ry = cy - arm * Math.sin(rad);
  const pan = (x: number, y: number, col: string) => (
    <g>
      <line x1={x} y1={y} x2={x - 120} y2={y + 170} stroke="#fff" strokeWidth={6} />
      <line x1={x} y1={y} x2={x + 120} y2={y + 170} stroke="#fff" strokeWidth={6} />
      <path d={`M ${x - 150} ${y + 170} Q ${x} ${y + 260} ${x + 150} ${y + 170} Z`} fill={col} stroke={INK} strokeWidth={9} />
    </g>
  );
  return (
    <AbsoluteFill>
      <Slam words={['THE', 'WILD', 'PART']} at={0} y={140} size={110} gap={7} />
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        <g transform={`translate(${cx} 1200) scale(${s}) translate(${-cx} -1200)`}>
          <path d={`M ${cx - 140} 1200 L ${cx + 140} 1200 L ${cx + 40} 1150 L ${cx - 40} 1150 Z`} fill={GREY} stroke={INK} strokeWidth={9} />
          <rect x={cx - 18} y={cy} width={36} height={400} fill={GREY} stroke={INK} strokeWidth={9} />
          <line x1={lx} y1={ly} x2={rx} y2={ry} stroke={CREAM} strokeWidth={26} strokeLinecap="round" />
          <circle cx={cx} cy={cy} r={26} fill={YEL} stroke={INK} strokeWidth={8} />
          {pan(lx, ly, '#D6DCE8')}
          {pan(rx, ry, '#D6DCE8')}
          <Drop x={lx} y={ly + 150} s={0.5} face />
          {/* big swirly air blob on the right pan */}
          <g transform={`translate(${rx} ${ry + 110}) scale(${airIn})`}>
            {[[-70, 0, 70], [0, -40, 85], [70, 0, 70], [0, 30, 80]].map(([x, y, r], i) => <circle key={'o' + i} cx={x} cy={y} r={r + 9} fill={INK} />)}
            {[[-70, 0, 70], [0, -40, 85], [70, 0, 70], [0, 30, 80]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#BFE3FF" />)}
            {[0, 1, 2].map((i) => (
              <path key={i} d={`M ${-80 + i * 10} ${-20 + i * 30} q 40 -30 80 0 t 80 0`} fill="none" stroke="#fff" strokeWidth={10} strokeLinecap="round"
                strokeDasharray="40 30" strokeDashoffset={-f * 2 - i * 20} />
            ))}
          </g>
        </g>
      </svg>
      <Pill text="water: 500,000 kg" x={250} y={420} at={20} bg={WATER} color={INK} size={42} />
      <Pill text="air: ~1,000,000,000 kg" x={700} y={520} at={65} bg="#BFE3FF" color={INK} size={42} />
      <Pill text="air ≈ 2,000× heavier 😮" x={540} y={1300} at={150} bg={PINK} size={50} />
      <Huh mood="thinking" x={170} y={1000} h={220} at={180} />
    </AbsoluteFill>
  );
};

const Rain: React.FC = () => {
  const f = useCurrentFrame();
  const cx = 540, cy = 640;
  const merge = interpolate(f, [20, 110], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const big = interpolate(f, [40, 120], [0.15, 1.6], {...clamp, easing: ease});
  const fall = interpolate(f, [150, 185], [0, 1], {...clamp, easing: Easing.in(Easing.quad)});
  const splash = interpolate(f, [185, 215], [0, 1], clamp);
  const dy = fall * 600;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 140, width: '100%', textAlign: 'center', fontFamily: 'B8', fontSize: 100, color: YEL, textShadow: OUT}}>
        <Count to={1000000} at={20} len={90} />
      </div>
      <Pill text="droplets crash together 💥" x={540} y={310} at={15} bg={WATER} color={INK} size={44} />
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        {Array.from({length: 36}).map((_, i) => {
          const a = random('a' + i) * Math.PI * 2, r0 = 250 + random('r' + i) * 220;
          const r = r0 * (1 - merge);
          const x = cx + Math.cos(a + f / 30) * r, y = cy + Math.sin(a + f / 30) * r * 0.8;
          return merge < 0.98 ? <circle key={i} cx={x} cy={y} r={14 + random('s' + i) * 10} fill={WATER} stroke={INK} strokeWidth={5} /> : null;
        })}
        <Drop x={cx} y={cy + dy} s={big * 1.3} face />
        {/* ground + splash */}
        <rect x={140} y={1330} width={800} height={14} rx={7} fill="#ffffff44" />
        {splash > 0 && Array.from({length: 8}).map((_, i) => {
          const ang = Math.PI + (i / 7) * Math.PI;
          return <circle key={i} cx={cx + Math.cos(ang) * 220 * splash} cy={1310 + Math.sin(ang) * 160 * splash} r={18 * (1 - splash * 0.6)} fill={WATER} stroke={INK} strokeWidth={4} opacity={1 - splash} />;
        })}
      </svg>
      <Pill text="= 1 raindrop" x={820} y={560} at={115} bg={PINK} size={46} />
      <Slam words={['SPLASH!']} at={185} y={1000} size={120} color={SKY} />
    </AbsoluteFill>
  );
};

export const scenes: SceneMap = {
  hook: {C: Hook, hue: SKY}, cube: {C: Cube, hue: TEAL}, water: {C: Water, hue: WATER}, math: {C: Mathy, hue: PINK},
  size: {C: Size, hue: ORG}, slow: {C: Slow, hue: '#5b6cff'}, updraft: {C: Updraft, hue: YEL}, air: {C: Air, hue: '#9b5cff'},
  rain: {C: Rain, hue: SKY}, cta: {C: CTA, hue: PINK},
};
