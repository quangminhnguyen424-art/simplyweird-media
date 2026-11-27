import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, spring, Easing, random} from 'remotion';
import {FPS, INK, PINK, YEL, TEAL, ORG, CREAM, SKY, RED, clamp, ease, Slam, Pill, Huh, Arrow, Count, Marker, CTA, SceneMap} from '../../kit';
import timing from './timing.json';

export const title = 'how many times does your heart beat?';
export const segs = timing;

const OUT = `0 8px 0 ${INK}`;
const HEART = '#FF3D5A', HEART2 = '#C81E3C', SEA = '#2F6FD6', LAND = '#3BB273', SKIN = '#F2B48C', SKIN2 = '#D98F66', WHALE = '#4F7FC9';

/** "lub-dub" pulse: returns 0..1 kick for a heart rate in beats per minute. */
const kick = (f: number, bpm: number) => {
  const P = (FPS * 60) / bpm;
  const ph = ((f % P) + P) % P / P;
  if (ph < 0.12) return Math.sin((ph / 0.12) * Math.PI);
  if (ph > 0.2 && ph < 0.3) return 0.6 * Math.sin(((ph - 0.2) / 0.1) * Math.PI);
  return 0;
};

const Big: React.FC<{children: React.ReactNode; y?: number; size?: number; color?: string; at?: number}> = ({children, y = 140, size = 120, color = YEL, at = 0}) => {
  const f = useCurrentFrame();
  const s = spring({frame: f - at, fps: FPS, config: {damping: 10}});
  return <div style={{position: 'absolute', top: y, width: '100%', textAlign: 'center', fontFamily: 'B8', fontSize: size, color, textShadow: OUT, transform: `scale(${s})`, lineHeight: 1}}>{children}</div>;
};

/* ---------- illustrations ---------- */

const HP = 'M 0 95 C -70 45 -130 5 -130 -50 C -130 -105 -65 -125 0 -65 C 65 -125 130 -105 130 -50 C 130 5 70 45 0 95 Z';

/** Cartoon heart with a face. Draw inside an <svg>. */
const Heart: React.FC<{x: number; y: number; s?: number; bpm?: number; face?: 'happy' | 'tired' | 'wow' | 'none'; rot?: number}> = ({x, y, s = 1, bpm = 70, face = 'happy', rot = 0}) => {
  const f = useCurrentFrame();
  const k = 1 + 0.13 * kick(f, bpm);
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s * k})`}>
      <path d={HP} fill={INK} transform="translate(0 10) scale(1.08)" />
      <path d={HP} fill={HEART} stroke={INK} strokeWidth={12} strokeLinejoin="round" />
      <path d="M -95 -55 C -95 -85 -65 -100 -40 -85" fill="none" stroke="#fff" strokeWidth={14} strokeLinecap="round" opacity={0.6} />
      <path d="M 40 60 C 70 35 100 10 108 -20" fill="none" stroke={HEART2} strokeWidth={12} strokeLinecap="round" opacity={0.7} />
      {face !== 'none' && <g>
        {face === 'tired'
          ? <><path d="M -62 -10 q 18 10 36 0" stroke={INK} strokeWidth={9} fill="none" strokeLinecap="round" /><path d="M 26 -10 q 18 10 36 0" stroke={INK} strokeWidth={9} fill="none" strokeLinecap="round" /></>
          : <><circle cx={-44} cy={-12} r={face === 'wow' ? 20 : 16} fill={INK} /><circle cx={44} cy={-12} r={face === 'wow' ? 20 : 16} fill={INK} />
            <circle cx={-38} cy={-19} r={6} fill="#fff" /><circle cx={50} cy={-19} r={6} fill="#fff" /></>}
        {face === 'wow'
          ? <ellipse cx={0} cy={34} rx={18} ry={22} fill={INK} />
          : <path d="M -26 26 Q 0 50 26 26" stroke={INK} strokeWidth={9} fill="none" strokeLinecap="round" />}
        <circle cx={-76} cy={18} r={13} fill="#fff" opacity={0.35} /><circle cx={76} cy={18} r={13} fill="#fff" opacity={0.35} />
      </g>}
    </g>
  );
};

/** ECG trace across the screen, drawn on with progress p, spikes every `gap` px. */
const ecgPath = (x0: number, x1: number, y: number, gap: number, amp = 1) => {
  let d = `M ${x0} ${y}`;
  for (let x = x0; x + gap <= x1; x += gap) {
    const a = x + gap * 0.35;
    d += ` L ${a} ${y} L ${a + 12} ${y - 22 * amp} L ${a + 24} ${y} L ${a + 34} ${y} L ${a + 46} ${y + 30 * amp} L ${a + 62} ${y - 110 * amp} L ${a + 78} ${y + 50 * amp} L ${a + 92} ${y} L ${x + gap} ${y}`;
  }
  return d;
};

const Drop: React.FC<{x: number; y: number; s?: number; color?: string}> = ({x, y, s = 1, color = HEART}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M 0 -60 C 26 -26 46 -4 46 22 A 46 46 0 0 1 -46 22 C -46 -4 -26 -26 0 -60 Z" fill={color} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
    <ellipse cx={-16} cy={6} rx={8} ry={14} fill="#fff" opacity={0.6} />
  </g>
);

/* ---------- scenes ---------- */

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const g = spring({frame: f - 4, fps: FPS, config: {damping: 11}});
  const p = interpolate(f, [10, 120], [0, 1], {...clamp, easing: Easing.linear});
  const k = kick(f, 70);
  return (
    <AbsoluteFill>
      {f < 110
        ? <div style={{position: 'absolute', top: 150, width: '100%', textAlign: 'center', fontFamily: 'B8', fontSize: 92, color: '#fff', textShadow: OUT}}>
            <span style={{display: 'inline-block', transform: `scale(${1 + 0.15 * k})`}}>thump</span>... <span style={{color: HEART}}>thump</span>...
          </div>
        : <Slam words={['NEVER', 'STOPS!']} at={110} y={140} size={124} gap={7} />}
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        {/* pulse rings */}
        {[0, 1, 2].map((i) => {
          const t = ((f + i * 9) % 26) / 26;
          return <circle key={i} cx={540} cy={680} r={240 + t * 180} fill="none" stroke={HEART} strokeWidth={10} opacity={(1 - t) * 0.5 * g} />;
        })}
        <Heart x={540} y={680} s={1.75 * g} face={f > 110 ? 'wow' : 'happy'} />
        {/* ECG */}
        <path d={ecgPath(0, 1080, 1080, 270)} fill="none" stroke="#ffffff22" strokeWidth={10} strokeLinejoin="round" />
        <path d={ecgPath(0, 1080, 1080, 270)} fill="none" stroke={TEAL} strokeWidth={10} strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
        {p > 0 && p < 1 && <circle cx={1080 * p} cy={1080} r={14} fill="#fff" />}
      </svg>
      <Pill text="24/7 ❤️" x={790} y={1270} at={40} bg={HEART} size={52} />
      <Huh mood="curious" x={190} y={1140} h={250} at={60} />
    </AbsoluteFill>
  );
};

const Minute: React.FC = () => {
  const f = useCurrentFrame();
  const w = spring({frame: f, fps: FPS, config: {damping: 12}});
  const hand = (f / 30) * 6 * 6; // sped-up second hand
  const L = 150, R = 930, Y = 1180;
  const mark = interpolate(f, [90, 150], [60, 70], {...clamp, easing: ease});
  const mx = L + ((mark - 40) / 80) * (R - L);
  const bar = interpolate(f, [60, 90], [0, 1], {...clamp, easing: ease});
  return (
    <AbsoluteFill>
      <Big y={130} size={112} at={140}>≈ <Count to={70} from={60} at={140} len={30} /> <span style={{color: '#fff', fontSize: 80}}>/ minute</span></Big>
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        {/* stopwatch */}
        <g transform={`translate(540 680) scale(${w})`}>
          <rect x={-40} y={-330} width={80} height={60} rx={14} fill="#C9D3E3" stroke={INK} strokeWidth={10} />
          <rect x={200} y={-260} width={60} height={40} rx={10} fill="#C9D3E3" stroke={INK} strokeWidth={9} transform="rotate(40)" />
          <circle r={300} fill={INK} />
          <circle r={285} fill={CREAM} stroke={INK} strokeWidth={10} />
          {Array.from({length: 60}).map((_, i) => (
            <line key={i} x1={0} y1={-255} x2={0} y2={i % 5 ? -238 : -215} stroke={INK} strokeWidth={i % 5 ? 4 : 9} transform={`rotate(${i * 6})`} />
          ))}
          <Heart x={0} y={30} s={0.62} face="happy" />
          <g transform={`rotate(${hand})`}>
            <line x1={0} y1={30} x2={0} y2={-230} stroke={RED} strokeWidth={10} strokeLinecap="round" />
          </g>
          <circle r={18} fill={RED} stroke={INK} strokeWidth={6} />
        </g>
        {/* range bar 60..100 */}
        <g opacity={bar}>
          <rect x={L} y={Y} width={R - L} height={40} rx={20} fill="#ffffff18" />
          <rect x={L + ((60 - 40) / 80) * (R - L)} y={Y} width={(40 / 80) * (R - L) * bar} height={40} rx={20} fill={TEAL} stroke={INK} strokeWidth={5} />
          <text x={L + ((60 - 40) / 80) * (R - L)} y={Y + 100} textAnchor="middle" fontFamily="B8" fontSize={46} fill="#fff">60</text>
          <text x={L + ((100 - 40) / 80) * (R - L)} y={Y + 100} textAnchor="middle" fontFamily="B8" fontSize={46} fill="#fff">100</text>
        </g>
        {f > 90 && <g transform={`translate(${mx} ${Y - 18})`}>
          <path d="M 0 0 L -26 -44 L 26 -44 Z" fill={YEL} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
          <text x={0} y={-58} textAnchor="middle" fontFamily="B8" fontSize={44} fill={YEL} stroke={INK} strokeWidth={2}>{Math.round(mark)}</text>
        </g>}
      </svg>
      <Pill text="at rest 🛋️" x={830} y={1080} at={70} bg={PINK} size={42} />
    </AbsoluteFill>
  );
};

const Day: React.FC = () => {
  const f = useCurrentFrame();
  const t = interpolate(f, [10, 200], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
  const a = Math.PI * (1 - t);
  const sx = 540 + Math.cos(a) * 400, sy = 900 - Math.sin(a) * 400;
  const night = interpolate(t, [0.75, 1], [0, 1], clamp);
  const N = 40;
  const lit = Math.floor(t * N);
  return (
    <AbsoluteFill>
      <Big y={130} size={130} at={5}><Count to={100000} at={10} len={190} /></Big>
      <div style={{position: 'absolute', top: 270, width: '100%', textAlign: 'center', fontFamily: 'B8', fontSize: 54, color: '#fff', textShadow: OUT}}>beats in <Marker at={40} color={PINK}>one day</Marker></div>
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        <path d="M 140 900 A 400 400 0 0 1 940 900" fill="none" stroke="#ffffff30" strokeWidth={6} strokeDasharray="14 14" />
        {/* sun turns into moon */}
        <g transform={`translate(${sx} ${sy})`}>
          <g opacity={1 - night} transform={`rotate(${f * 2})`}>
            {Array.from({length: 10}).map((_, i) => <rect key={i} x={-8} y={-105} width={16} height={34} rx={8} fill={YEL} transform={`rotate(${i * 36})`} />)}
            <circle r={64} fill={YEL} stroke={INK} strokeWidth={9} />
          </g>
          <g opacity={night}>
            <circle r={64} fill={CREAM} stroke={INK} strokeWidth={9} />
            <circle cx={30} cy={-20} r={58} fill="#2a2850" />
          </g>
        </g>
        {/* ground line */}
        <rect x={0} y={900} width={1080} height={16} fill="#ffffff40" />
        {/* grid of mini hearts filling up */}
        {Array.from({length: N}).map((_, i) => {
          const c = i % 10, r = Math.floor(i / 10);
          const on = i < lit;
          const s = on ? spring({frame: f - (10 + (i / N) * 190), fps: FPS, config: {damping: 9}}) : 0;
          return (
            <g key={i} transform={`translate(${135 + c * 90} ${990 + r * 95})`}>
              <path d={HP} fill="#ffffff14" transform="scale(0.24)" />
              {on && <path d={HP} fill={HEART} stroke={INK} strokeWidth={22} transform={`scale(${0.24 * s})`} />}
            </g>
          );
        })}
      </svg>
      <Huh mood="shocked" x={170} y={600} h={230} at={150} />
    </AbsoluteFill>
  );
};

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const Year: React.FC = () => {
  const f = useCurrentFrame();
  const c = spring({frame: f, fps: FPS, config: {damping: 12}});
  const m = Math.min(11, Math.floor(interpolate(f, [15, 140], [0, 12], clamp)));
  const flip = f > 15 && f < 140 ? ((f - 15) % 10.4) / 10.4 : 1;
  return (
    <AbsoluteFill>
      <Big y={130} size={120} at={5}>≈ <Count to={37} at={15} len={125} /> million</Big>
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        <g transform={`translate(300 720) scale(${c}) rotate(-4)`}>
          <rect x={-200} y={-200} width={400} height={420} rx={30} fill={INK} transform="translate(0 12)" />
          <rect x={-200} y={-200} width={400} height={420} rx={30} fill={CREAM} stroke={INK} strokeWidth={10} />
          <rect x={-200} y={-200} width={400} height={110} rx={30} fill={RED} stroke={INK} strokeWidth={10} />
          {[-110, 110].map((x) => <rect key={x} x={x - 14} y={-240} width={28} height={70} rx={12} fill="#C9D3E3" stroke={INK} strokeWidth={7} />)}
          <text x={0} y={-122} textAnchor="middle" fontFamily="B8" fontSize={64} fill="#fff" transform={`scale(${1 + 0.25 * Math.max(0, 1 - flip * 3)})`} style={{transformOrigin: '0px -140px'}}>{MONTHS[m]}</text>
          {Array.from({length: 20}).map((_, i) => (
            <rect key={i} x={-165 + (i % 5) * 68} y={-60 + Math.floor(i / 5) * 62} width={48} height={42} rx={8} fill={i < (f % 40) / 2 ? HEART : '#00000014'} />
          ))}
        </g>
        <Heart x={790} y={1180} s={0.7} face={f > 160 ? 'tired' : 'happy'} bpm={90} />
      </svg>
      <Pill text="no weekends ❌" x={770} y={500} at={150} bg={PINK} size={44} />
      <Pill text="no vacation 🏖️" x={770} y={640} at={175} bg={ORG} size={44} />
      <Pill text="no snooze ⏰" x={770} y={780} at={200} bg={TEAL} color={INK} size={44} />
    </AbsoluteFill>
  );
};

const Life: React.FC = () => {
  const f = useCurrentFrame();
  const L = 110, R = 970, Y = 980;
  const p = interpolate(f, [10, 140], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
  const stack = Math.floor(interpolate(f, [10, 140], [0, 30], clamp));
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 130, width: '100%', textAlign: 'center', fontFamily: 'B8', fontSize: 120, color: YEL, textShadow: OUT}}>
        2.5–3 <Marker at={120} color={PINK}><span style={{color: '#fff'}}>BILLION</span></Marker>
      </div>
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        {/* tower of hearts growing over a lifetime */}
        {Array.from({length: stack}).map((_, i) => {
          const col = i % 3, row = Math.floor(i / 3);
          return <path key={i} d={HP} fill={i % 2 ? HEART : HEART2} stroke={INK} strokeWidth={26} transform={`translate(${430 + col * 110 + (row % 2) * 20} ${880 - row * 56}) scale(0.32)`} />;
        })}
        {/* lifetime timeline */}
        <rect x={L} y={Y} width={R - L} height={22} rx={11} fill="#ffffff22" />
        <rect x={L} y={Y} width={(R - L) * p} height={22} rx={11} fill={TEAL} />
        {[0, 20, 40, 60, 80].map((age, i) => (
          <g key={age}>
            <line x1={L + (i / 4) * (R - L)} y1={Y - 14} x2={L + (i / 4) * (R - L)} y2={Y + 36} stroke="#fff" strokeWidth={5} />
            <text x={L + (i / 4) * (R - L)} y={Y + 92} textAnchor="middle" fontFamily="B8" fontSize={44} fill="#fff">{age}</text>
          </g>
        ))}
        <text x={540} y={Y + 160} textAnchor="middle" fontFamily="B6" fontSize={40} fill="#ffffffaa">years</text>
        <g transform={`translate(${L + (R - L) * p} ${Y + 11})`}><circle r={26} fill={YEL} stroke={INK} strokeWidth={7} /></g>
      </svg>
      <Slam words={['with', 'a', 'B!']} at={135} y={1240} size={96} gap={6} />
      <Huh mood="shocked" x={170} y={560} h={260} at={120} />
    </AbsoluteFill>
  );
};

const Pump: React.FC = () => {
  const f = useCurrentFrame();
  const P = (FPS * 60) / 70;
  const beat = Math.floor(f / P);
  const ph = (f % P) / P;
  const spoon = spring({frame: f, fps: FPS, config: {damping: 12}});
  const phase2 = f > 110;
  const n = Math.min(20, Math.max(0, Math.floor((f - 115) / 5)));
  return (
    <AbsoluteFill>
      {phase2
        ? <Big y={130} size={116} at={110}><Count to={2000} at={115} len={100} /> <span style={{color: '#fff', fontSize: 78}}>gallons</span></Big>
        : <Big y={130} size={96} at={5}>4 tablespoons <span style={{color: '#fff', fontSize: 70}}>/ beat</span></Big>}
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        {!phase2 && <g>
          <Heart x={540} y={480} s={0.95} face="happy" />
          {ph < 0.5 && <Drop x={540 + 0} y={640 + ph * 2 * 330} s={0.5} />}
          <g transform={`translate(540 1060) scale(${spoon})`}>
            <rect x={130} y={-16} width={330} height={32} rx={16} fill="#D6DCE8" stroke={INK} strokeWidth={8} transform="rotate(-8)" />
            <ellipse rx={170} ry={78} fill="#D6DCE8" stroke={INK} strokeWidth={10} />
            <ellipse rx={30 + 30 * (beat % 4)} ry={12 + 12 * (beat % 4)} fill={HEART} />
          </g>
        </g>}
        {phase2 && Array.from({length: 20}).map((_, i) => {
          const c = i % 5, r = Math.floor(i / 5);
          const s = i < n ? spring({frame: f - 115 - i * 5, fps: FPS, config: {damping: 9}}) : 0;
          const x = 150 + c * 195, y = 440 + r * 230;
          return (
            <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
              <path d="M -60 -50 L -20 -50 L -15 -90 L 25 -90 L 30 -50 Q 70 -48 70 -10 L 70 90 Q 70 110 50 110 L -50 110 Q -70 110 -70 90 L -70 -40 Q -70 -50 -60 -50 Z" fill={HEART} stroke={INK} strokeWidth={9} strokeLinejoin="round" />
              <rect x={-18} y={-100} width={46} height={20} rx={6} fill={CREAM} stroke={INK} strokeWidth={6} />
              <rect x={-48} y={-30} width={16} height={110} rx={8} fill="#fff" opacity={0.35} />
            </g>
          );
        })}
      </svg>
      {phase2 && <Pill text="every single day 📅" x={540} y={1340} at={170} bg={TEAL} color={INK} size={46} />}
      {!phase2 && <Pill text="glug 🩸" x={830} y={760} at={30} bg={PINK} size={44} />}
    </AbsoluteFill>
  );
};

const CONT: [number, number, number, number][] = [[-120, -110, 120, 80], [40, -40, 90, 130], [-60, 140, 110, 60], [180, 120, 70, 90], [-220, 40, 60, 90], [260, -120, 80, 50]];
const Vessels: React.FC = () => {
  const f = useCurrentFrame();
  const g = spring({frame: f, fps: FPS, config: {damping: 12}});
  const cx = 540, cy = 780, R = 280;
  const w1 = interpolate(f, [40, 120], [0, 1], {...clamp, easing: ease});
  const w2 = interpolate(f, [120, 190], [0, 1], {...clamp, easing: ease});
  const spin = f * 1.2;
  return (
    <AbsoluteFill>
      <Big y={130} size={116} at={5}><Count to={60000} at={10} len={70} /> <span style={{color: '#fff', fontSize: 76}}>miles</span></Big>
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        <g transform={`translate(${cx} ${cy}) scale(${g})`}>
          <defs><clipPath id="hbGlobe"><circle r={R} /></clipPath></defs>
          <circle r={R + 12} fill={INK} />
          <circle r={R} fill={SEA} />
          <g clipPath="url(#hbGlobe)">
            {[-1, 0, 1].map((rep) => CONT.map(([x, y, w, h], i) => {
              const xx = ((x * 0.93 + spin + 280) % 1120) - 280 + rep * 1120;
              return <ellipse key={rep + '-' + i} cx={xx} cy={y * 0.93} rx={w * 0.93} ry={h * 0.93} fill={LAND} stroke={INK} strokeWidth={10} />;
            }))}
          </g>
          <circle r={R} fill="none" stroke={INK} strokeWidth={14} />
          {/* two red "vessel" loops wrapping the planet */}
          <ellipse rx={R + 70} ry={110} fill="none" stroke={HEART} strokeWidth={22} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - w1} transform="rotate(-18)" />
          <ellipse rx={R + 120} ry={150} fill="none" stroke={HEART2} strokeWidth={22} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - w2} transform="rotate(22)" />
          {w1 > 0 && w1 < 1 && <circle cx={Math.cos(w1 * Math.PI * 2) * (R + 70)} cy={Math.sin(w1 * Math.PI * 2) * 110} r={20} fill="#fff" transform="rotate(-18)" />}
        </g>
      </svg>
      <Pill text="1× around 🌍" x={250} y={1200} at={110} bg={HEART} size={48} />
      <Pill text="2×!! 🤯" x={820} y={1200} at={185} bg={YEL} color={INK} size={52} />
      <Pill text="blood vessels" x={540} y={330} at={20} bg="#fff" color={INK} size={40} />
    </AbsoluteFill>
  );
};

const Fist: React.FC = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f - 5, fps: FPS, config: {damping: 11}});
  const b = spring({frame: f - 30, fps: FPS, config: {damping: 11}});
  const tip = interpolate(f, [110, 150], [0, 1], {...clamp, easing: ease});
  const scaleY = 1060;
  return (
    <AbsoluteFill>
      <Slam words={['FIST', 'SIZED']} at={10} y={140} size={118} gap={7} />
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        {/* fist */}
        <g transform={`translate(300 640) scale(${a})`}>
          <rect x={-60} y={110} width={120} height={180} rx={30} fill={SKIN} stroke={INK} strokeWidth={10} />
          <rect x={-150} y={-120} width={300} height={250} rx={70} fill={SKIN} stroke={INK} strokeWidth={10} />
          {[-105, -35, 35, 105].map((x) => <rect key={x} x={x - 34} y={-135} width={68} height={110} rx={32} fill={SKIN} stroke={INK} strokeWidth={9} />)}
          <path d="M -150 30 Q -60 60 40 10" fill={SKIN2} stroke={INK} strokeWidth={9} />
        </g>
        <text x={540} y={700} textAnchor="middle" fontFamily="B8" fontSize={110} fill="#fff" opacity={b}>≈</text>
        <Heart x={790} y={640} s={0.95 * b} face="happy" />
        {/* balance scale */}
        <g opacity={tip}>
          <rect x={530} y={scaleY} width={20} height={250} fill="#C9D3E3" stroke={INK} strokeWidth={6} />
          <path d="M 440 1320 L 640 1320 L 590 1290 L 490 1290 Z" fill="#C9D3E3" stroke={INK} strokeWidth={6} />
          <g transform={`rotate(${-12 * tip} 540 ${scaleY})`}>
            <rect x={300} y={scaleY - 8} width={480} height={16} rx={8} fill={INK} />
            <line x1={330} y1={scaleY} x2={330} y2={scaleY + 90} stroke={INK} strokeWidth={5} />
            <line x1={750} y1={scaleY} x2={750} y2={scaleY + 90} stroke={INK} strokeWidth={5} />
            <path d="M 260 1150 L 400 1150 Q 330 1200 260 1150 Z" fill="#C9D3E3" stroke={INK} strokeWidth={6} />
            <path d="M 680 1150 L 820 1150 Q 750 1200 680 1150 Z" fill="#C9D3E3" stroke={INK} strokeWidth={6} />
            <path d={HP} fill={HEART} stroke={INK} strokeWidth={30} transform="translate(330 1110) scale(0.3)" />
            <rect x={700} y={1080} width={100} height={68} rx={10} fill="#8A8FA0" stroke={INK} strokeWidth={6} />
            <text x={750} y={1128} textAnchor="middle" fontFamily="B8" fontSize={34} fill="#fff">1 lb</text>
          </g>
        </g>
      </svg>
      <Pill text="< 1 pound 🪶" x={540} y={960} at={120} bg={TEAL} color={INK} size={50} />
      <Huh mood="laughing" x={900} y={1100} h={230} at={150} />
    </AbsoluteFill>
  );
};

const Animals: React.FC = () => {
  const f = useCurrentFrame();
  const c1 = spring({frame: f - 5, fps: FPS, config: {damping: 11}});
  const c2 = spring({frame: f - 120, fps: FPS, config: {damping: 11}});
  const wing = Math.sin(f * 2.2) * 40;
  const bars = interpolate(f, [210, 250], [0, 1], {...clamp, easing: ease});
  const show2 = f > 120;
  return (
    <AbsoluteFill>
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        {/* hummingbird card */}
        <g transform={`translate(540 ${show2 ? 380 : 520}) scale(${c1 * (show2 ? 0.8 : 1)})`}>
          <rect x={-420} y={-200} width={840} height={400} rx={40} fill={INK} transform="translate(0 12)" />
          <rect x={-420} y={-200} width={840} height={400} rx={40} fill={CREAM} stroke={INK} strokeWidth={10} />
          <g transform="translate(-200 10)">
            <g transform={`rotate(${-30 + wing})`}><ellipse cx={0} cy={-80} rx={30} ry={90} fill="#9fe3d8" stroke={INK} strokeWidth={7} opacity={0.8} /></g>
            <ellipse rx={90} ry={50} fill={TEAL} stroke={INK} strokeWidth={9} transform="rotate(-15)" />
            <circle cx={80} cy={-40} r={42} fill={TEAL} stroke={INK} strokeWidth={9} />
            <path d="M 118 -46 L 210 -60 L 118 -30 Z" fill={INK} />
            <circle cx={90} cy={-48} r={9} fill={INK} />
            <path d="M -80 10 L -150 40 L -140 0 Z" fill={TEAL} stroke={INK} strokeWidth={7} />
            <Heart x={10} y={10} s={0.14} face="none" bpm={300} />
          </g>
          <text x={150} y={-10} textAnchor="middle" fontFamily="B8" fontSize={110} fill={HEART}>{Math.round(interpolate(f, [20, 70], [0, 1200], {...clamp, easing: ease})).toLocaleString('en-US')}</text>
          <text x={150} y={70} textAnchor="middle" fontFamily="B8" fontSize={46} fill={INK}>beats / minute</text>
        </g>
        {/* blue whale card */}
        {show2 && <g transform={`translate(540 860) scale(${c2})`}>
          <rect x={-420} y={-170} width={840} height={340} rx={40} fill={INK} transform="translate(0 12)" />
          <rect x={-420} y={-170} width={840} height={340} rx={40} fill="#DCEBFF" stroke={INK} strokeWidth={10} />
          <g transform={`translate(-210 ${10 + Math.sin(f / 20) * 8}) scale(0.78)`}>
            <path d="M -200 0 Q -170 -80 0 -80 Q 150 -80 190 -20 L 250 -70 L 240 0 L 250 60 L 190 20 Q 150 70 0 70 Q -170 70 -200 0 Z" fill={WHALE} stroke={INK} strokeWidth={9} strokeLinejoin="round" />
            <path d="M -195 15 Q -120 60 0 55" fill="none" stroke="#DCEBFF" strokeWidth={8} />
            <circle cx={-140} cy={-15} r={9} fill={INK} />
            <Heart x={-20} y={0} s={0.16} face="none" bpm={8} />
          </g>
          <text x={230} y={10} textAnchor="middle" fontFamily="B8" fontSize={120} fill={SEA}>2</text>
          <text x={230} y={80} textAnchor="middle" fontFamily="B8" fontSize={40} fill={INK}>beats / min, diving</text>
        </g>}
        {/* comparison bars */}
        <g opacity={bars}>
          {([['you', 70, PINK], ['hummingbird', 1200, TEAL], ['blue whale', 2, SKY]] as [string, number, string][]).map(([n, v, col], i) => {
            const y = 1140 + i * 90;
            return (
              <g key={n}>
                <text x={110} y={y + 40} fontFamily="B8" fontSize={40} fill="#fff">{n}</text>
                <rect x={430} y={y} width={Math.max(8, (v / 1200) * 540 * bars)} height={52} rx={12} fill={col} stroke={INK} strokeWidth={5} />
              </g>
            );
          })}
        </g>
      </svg>
      {!show2 && <Pill text="hummingbird 🐦 zoom!" x={540} y={850} at={40} bg={TEAL} color={INK} size={46} />}
    </AbsoluteFill>
  );
};

export const scenes: SceneMap = {
  hook: {C: Hook, hue: HEART}, minute: {C: Minute, hue: TEAL}, day: {C: Day, hue: YEL}, year: {C: Year, hue: ORG},
  life: {C: Life, hue: PINK}, pump: {C: Pump, hue: HEART2}, vessels: {C: Vessels, hue: SKY}, fist: {C: Fist, hue: TEAL},
  animals: {C: Animals, hue: '#5b6cff'}, cta: {C: CTA, hue: PINK},
};
