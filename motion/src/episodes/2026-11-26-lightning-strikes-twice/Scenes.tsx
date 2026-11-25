import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, spring, random} from 'remotion';
import {FPS, INK, PINK, YEL, TEAL, ORG, CREAM, SKY, RED, clamp, ease, Slam, Pill, Huh, Arrow, Count, Counter, SwapCards, CTA, SceneMap} from '../../kit';
import timing from './timing.json';

export const title = 'does lightning strike twice?';
export const segs = timing;

const OUT = `0 8px 0 ${INK}`, STORM = '#5A6378', STORM2 = '#47506A', LEAF = '#3BB273', BARK = '#8A5A35', PURPLE = '#9b5cff', INDIGO = '#5b6cff';

/* ---------- helpers & illustrations ---------- */

/** Jagged bolt path from (x0,y0) to (x1,y1). Same seed = same path every frame. */
const zig = (x0: number, y0: number, x1: number, y1: number, seed: string, n = 7, amp = 45) => {
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const off = i === 0 || i === n ? 0 : (random(seed + i) - 0.5) * 2 * amp;
    pts.push(`${(x0 + (x1 - x0) * t + off).toFixed(1)} ${(y0 + (y1 - y0) * t).toFixed(1)}`);
  }
  return 'M ' + pts.join(' L ');
};

/** Bolt stroke inside an <svg>: ink outline, yellow body, white core, glow. p = draw progress. */
const Bolt: React.FC<{d: string; p?: number; o?: number; w?: number}> = ({d, p = 1, o = 1, w = 1}) => (
  <g opacity={o} style={{filter: `drop-shadow(0 0 ${22 * w}px ${YEL})`}}>
    {[[34, INK], [20, YEL], [7, '#fff']].map(([sw, c], i) => (
      <path key={i} d={d} fill="none" stroke={c as string} strokeWidth={(sw as number) * w} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    ))}
  </g>
);

/** Small lightning icon, centered at (x,y). */
const BoltIcon: React.FC<{x: number; y: number; s?: number; color?: string}> = ({x, y, s = 1, color = YEL}) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} d="M 12 -46 L -22 6 L 0 6 L -12 46 L 26 -10 L 3 -10 Z" fill={color} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
);

const SPUFF: [number, number, number][] = [[-190, 30, 95], [-80, -30, 125], [60, -50, 120], [180, 10, 100], [0, 45, 115], [-120, 60, 85], [120, 60, 90]];
/** Grumpy storm cloud centered on (cx,cy), inside an <svg>. */
const Storm: React.FC<{cx: number; cy: number; s?: number; face?: boolean}> = ({cx, cy, s = 1, face = true}) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${cx} ${cy + Math.sin(f / 15) * 8}) scale(${s})`}>
      {SPUFF.map(([x, y, r], i) => <circle key={'o' + i} cx={x} cy={y} r={r + 11} fill={INK} />)}
      {SPUFF.map(([x, y, r], i) => <circle key={'f' + i} cx={x} cy={y} r={r} fill={i % 2 ? STORM : STORM2} />)}
      {SPUFF.slice(0, 4).map(([x, y, r], i) => <circle key={'h' + i} cx={x - r * 0.3} cy={y - r * 0.35} r={r * 0.25} fill="#ffffff" opacity={0.18} />)}
      {face && <g>
        <path d="M -80 0 L -30 18" stroke={INK} strokeWidth={10} strokeLinecap="round" />
        <path d="M 80 0 L 30 18" stroke={INK} strokeWidth={10} strokeLinecap="round" />
        <circle cx={-48} cy={34} r={12} fill={INK} /><circle cx={48} cy={34} r={12} fill={INK} />
        <path d="M -24 78 Q 0 62 24 78" fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" />
      </g>}
    </g>
  );
};

/** Lone tree on a hill; (cx, ground) = trunk base. */
const Tree: React.FC<{cx: number; g: number; s?: number; burnt?: number}> = ({cx, g, s = 1, burnt = 0}) => (
  <g transform={`translate(${cx} ${g}) scale(${s})`}>
    <ellipse cx={0} cy={40} rx={330} ry={70} fill={LEAF} stroke={INK} strokeWidth={9} />
    <rect x={-24} y={-200} width={48} height={230} rx={10} fill={BARK} stroke={INK} strokeWidth={9} />
    {[[-70, -230, 80], [70, -230, 80], [0, -300, 95], [0, -200, 85]].map(([x, y, r], i) => <circle key={'o' + i} cx={x} cy={y} r={r + 9} fill={INK} />)}
    {[[-70, -230, 80], [70, -230, 80], [0, -300, 95], [0, -200, 85]].map(([x, y, r], i) => <circle key={'f' + i} cx={x} cy={y} r={r} fill={burnt > 0.5 ? '#2E7D4F' : LEAF} />)}
    <circle cx={-30} cy={-330} r={26} fill="#fff" opacity={0.25} />
  </g>
);

/** Empire-State-style stepped tower; (cx, g) = base center. Spire top = g - 960*s. */
const Tower: React.FC<{cx: number; g: number; s?: number; lit?: number}> = ({cx, g, s = 1, lit = 0}) => {
  const parts: [number, number, number][] = [[170, 0, 260], [120, 260, 520], [80, 520, 700], [50, 700, 780], [28, 780, 840]];
  return (
    <g transform={`translate(${cx} ${g}) scale(${s})`}>
      <rect x={-9} y={-965} width={18} height={130} rx={6} fill={lit ? '#fff' : '#D9DEEA'} stroke={INK} strokeWidth={7} />
      {parts.map(([hw, y0, y1], i) => <rect key={i} x={-hw} y={-y1} width={hw * 2} height={y1 - y0} fill={i % 2 ? '#B8C0D8' : '#A6AFC9'} stroke={INK} strokeWidth={9} />)}
      {parts.slice(0, 3).map(([hw, y0, y1], i) => {
        const cols = Math.floor((hw * 2 - 40) / 46), rows = Math.floor((y1 - y0 - 30) / 52);
        return Array.from({length: cols * rows}).map((_, k) => {
          const c = k % cols, r = Math.floor(k / cols);
          return <rect key={i + '-' + k} x={-hw + 26 + c * 46} y={-y1 + 22 + r * 52} width={22} height={30} rx={3} fill={random('w' + i + k) > 0.45 ? YEL : '#6B7390'} />;
        });
      })}
    </g>
  );
};

/** White screen flash right after a strike at frame `at`. */
const flash = (f: number, at: number, k = 0.5) => interpolate(f, [at, at + 2, at + 8], [0, k, 0], clamp);

/** Generic park ranger (not a real likeness): campaign hat, tan shirt. Centered (cx, cy) = face center. */
const Ranger: React.FC<{cx: number; cy: number; s?: number; zap?: number}> = ({cx, cy, s = 1, zap = 0}) => (
  <g transform={`translate(${cx} ${cy}) scale(${s})`}>
    <path d="M -190 380 Q -190 150 0 150 Q 190 150 190 380 Z" fill="#C8A165" stroke={INK} strokeWidth={10} />
    <rect x={60} y={230} width={70} height={60} rx={8} fill="#B08A50" stroke={INK} strokeWidth={7} />
    <path d="M -40 150 L 0 210 L 40 150" fill="none" stroke={INK} strokeWidth={8} />
    <rect x={-34} y={90} width={68} height={70} fill="#F2C9A0" stroke={INK} strokeWidth={8} />
    <circle cx={0} cy={0} r={120} fill="#F2C9A0" stroke={INK} strokeWidth={10} />
    {/* frizzy hair poking out (from all that electricity) */}
    {[-1, 1].map((sd) => <path key={sd} d={`M ${sd * 105} -40 l ${sd * 40} -20 l ${-sd * 10} 30 l ${sd * 40} -5 l ${-sd * 20} 30`} fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" transform={`rotate(${zap * sd * 8})`} />)}
    <circle cx={-42} cy={10} r={14} fill={INK} /><circle cx={42} cy={10} r={14} fill={INK} />
    <circle cx={-80} cy={50} r={18} fill={PINK} opacity={0.5} /><circle cx={80} cy={50} r={18} fill={PINK} opacity={0.5} />
    <path d="M -40 60 Q 0 98 40 60" fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" />
    {/* campaign hat */}
    <ellipse cx={0} cy={-80} rx={200} ry={38} fill="#7A5230" stroke={INK} strokeWidth={10} />
    <path d="M -95 -88 L -60 -200 L -20 -170 L 0 -210 L 20 -170 L 60 -200 L 95 -88 Z" fill="#8C6239" stroke={INK} strokeWidth={10} strokeLinejoin="round" />
    <rect x={-95} y={-112} width={190} height={24} fill="#5C3A1E" />
  </g>
);

const Person: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cx={0} cy={-120} r={30} fill="#F2C9A0" stroke={INK} strokeWidth={7} />
    <circle cx={-10} cy={-122} r={4} fill={INK} /><circle cx={10} cy={-122} r={4} fill={INK} />
    <rect x={-30} y={-88} width={60} height={80} rx={18} fill={PINK} stroke={INK} strokeWidth={7} />
    <path d="M -15 -10 L -20 40 M 15 -10 L 20 40" stroke={INK} strokeWidth={12} strokeLinecap="round" />
  </g>
);

const House: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-120} y={-150} width={240} height={150} fill={CREAM} stroke={INK} strokeWidth={9} />
    <path d="M -150 -140 L 0 -260 L 150 -140 Z" fill={RED} stroke={INK} strokeWidth={9} strokeLinejoin="round" />
    <rect x={-30} y={-90} width={60} height={90} rx={6} fill={ORG} stroke={INK} strokeWidth={7} />
    <rect x={-100} y={-120} width={50} height={50} fill={SKY} stroke={INK} strokeWidth={6} />
    <rect x={50} y={-120} width={50} height={50} fill={SKY} stroke={INK} strokeWidth={6} />
  </g>
);

/* ---------- scenes ---------- */

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const fade = interpolate(f, [92, 104], [1, 0.18], clamp);
  const hits = [8, 44];
  const fl = flash(f, hits[0], 0.6) + flash(f, hits[1], 0.6);
  const d = zig(540, 470, 540, 860, 'hook', 7, 55);
  return (
    <AbsoluteFill>
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0, opacity: fade}}>
        <Storm cx={540} cy={360} s={1.05} />
        {hits.map((h, i) => f >= h && f < h + 12 ? <Bolt key={i} d={d} p={interpolate(f, [h, h + 4], [0, 1], clamp)} /> : null)}
        <Tree cx={540} g={1180} s={1.0} />
        {[0, 1].map((i) => {
          const s = spring({frame: f - hits[i] - 4, fps: FPS, config: {damping: 9}});
          return <g key={i} transform={`translate(${i ? 760 : 320} 820) scale(${s})`}>
            <circle r={58} fill={i ? PINK : YEL} stroke={INK} strokeWidth={8} />
            <text y={22} textAnchor="middle" fontFamily="B8" fontSize={66} fill={INK}>{i + 1}</text>
          </g>;
        })}
      </svg>
      {f < 100 && <Slam words={['NEVER', 'TWICE?']} at={50} y={130} size={120} />}
      <AbsoluteFill style={{background: '#fff', opacity: fl}} />
      {f >= 92 && <SwapCards before="lightning never strikes the same place twice" after="it strikes the same place ALL the time ⚡" label="actually..." at={95} y={330} />}
      {f >= 150 && <Huh mood="shocked" x={540} y={1060} h={330} at={150} />}
    </AbsoluteFill>
  );
};

const Empire: React.FC = () => {
  const f = useCurrentFrame();
  const g = 1300, s = 0.82, top = g - 965 * s;
  const n = Math.max(0, Math.min(23, Math.floor((f - 30) / 9) + 1));
  const since = (f - 30) % 9;
  const on = f >= 30 && n <= 23 && f < 30 + 23 * 9 && since < 4;
  const d = zig(540, 330, 540, top, 'esb' + n, 5, 40);
  const tw = spring({frame: f, fps: FPS, config: {damping: 12}});
  const big = spring({frame: f - 30 - since, fps: FPS, config: {damping: 8, stiffness: 300}});
  return (
    <AbsoluteFill>
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        <g transform={`translate(540 ${g}) scale(${tw}) translate(-540 ${-g})`}><Tower cx={540} g={g} s={s} lit={on ? 1 : 0} /></g>
        {on && <Bolt d={d} p={interpolate(since, [0, 2], [0, 1], clamp)} />}
        <Storm cx={540} cy={250} s={0.85} />
      </svg>
      <AbsoluteFill style={{background: '#fff', opacity: on ? 0.12 : 0}} />
      <div style={{position: 'absolute', left: 30, top: 560, width: 330, textAlign: 'center'}}>
        <div style={{fontFamily: 'B8', fontSize: 190, color: YEL, lineHeight: 1, textShadow: OUT, transform: `scale(${0.85 + 0.15 * big})`}}>{n}</div>
        <div style={{fontFamily: 'B8', fontSize: 50, color: '#fff', textShadow: OUT}}>hits a year</div>
      </div>
      <Pill text="on average 📊" x={870} y={700} at={140} bg={TEAL} size={40} />
      <Pill text="Empire State Building" x={540} y={1365} at={20} bg={SKY} color={INK} size={46} />
      {f > 200 && <Pill text="lightning magnet ⚡" x={880} y={880} at={200} bg={PINK} size={40} />}
    </AbsoluteFill>
  );
};

const Rules: React.FC = () => {
  const f = useCurrentFrame();
  const cards = [{t: 'TALL', at: 108, c: ORG}, {t: 'POINTY', at: 140, c: PINK}, {t: 'ALONE', at: 168, c: TEAL}];
  return (
    <AbsoluteFill>
      <Slam words={['HOW', 'IT', 'PICKS']} at={4} y={170} size={110} gap={6} />
      <Pill text="3 things matter most" x={540} y={380} at={40} bg={CREAM} color={INK} size={46} />
      {cards.map((c, i) => {
        const s = spring({frame: f - c.at, fps: FPS, config: {damping: 10}});
        const hit = f >= c.at + 8 && f < c.at + 16;
        const x = 60 + i * 330;
        return (
          <div key={i} style={{position: 'absolute', left: x, top: 470, width: 300, height: 540, transform: `scale(${s}) rotate(${(i - 1) * 3}deg)`, background: '#ffffff18', border: `6px solid ${c.c}`, borderRadius: 32, boxShadow: OUT}}>
            <svg width={300} height={420} viewBox="0 0 300 420">
              {hit && <Bolt d={zig(150, 0, 150, i === 0 ? 70 : i === 1 ? 150 : 170, 'r' + i, 4, 25)} w={0.7} />}
              {i === 0 && <g><rect x={110} y={80} width={80} height={320} fill="#B8C0D8" stroke={INK} strokeWidth={8} />
                <rect x={30} y={330} width={50} height={70} fill="#8892AE" stroke={INK} strokeWidth={6} /><rect x={220} y={300} width={50} height={100} fill="#8892AE" stroke={INK} strokeWidth={6} /></g>}
              {i === 1 && <g><path d="M 150 150 L 230 400 L 70 400 Z" fill={PINK} stroke={INK} strokeWidth={8} strokeLinejoin="round" /></g>}
              {i === 2 && <g><ellipse cx={150} cy={410} rx={150} ry={40} fill={LEAF} stroke={INK} strokeWidth={7} />
                <rect x={138} y={280} width={24} height={110} fill={BARK} stroke={INK} strokeWidth={6} />
                <circle cx={150} cy={240} r={66} fill={LEAF} stroke={INK} strokeWidth={8} /></g>}
            </svg>
            <div style={{textAlign: 'center', fontFamily: 'B8', fontSize: 64, color: c.c, textShadow: OUT}}>{c.t}</div>
          </div>
        );
      })}
      <Huh mood="thinking" x={540} y={1070} h={320} at={20} />
    </AbsoluteFill>
  );
};

const Metal: React.FC = () => {
  const f = useCurrentFrame();
  const strike = 175;
  const on = f >= strike && f < strike + 14;
  const sl = spring({frame: f - 120, fps: FPS, config: {damping: 12}});
  return (
    <AbsoluteFill>
      <SwapCards before="metal attracts lightning" after="height + shape + being alone" label="nope..." at={10} y={210} />
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0, opacity: sl}}>
        <rect x={60} y={1330} width={960} height={14} rx={7} fill="#ffffff44" />
        {/* short shiny metal box */}
        <rect x={180} y={1210} width={200} height={120} rx={10} fill="#C9D2E3" stroke={INK} strokeWidth={8} />
        <path d="M 200 1230 L 260 1230" stroke="#fff" strokeWidth={10} strokeLinecap="round" />
        {/* tall wooden pole */}
        <rect x={735} y={920} width={40} height={410} rx={8} fill={BARK} stroke={INK} strokeWidth={8} />
        <rect x={680} y={960} width={150} height={20} rx={8} fill={BARK} stroke={INK} strokeWidth={6} />
        {on && <Bolt d={zig(755, 780, 755, 920, 'metal', 4, 30)} p={interpolate(f, [strike, strike + 3], [0, 1], clamp)} />}
      </svg>
      <Pill text="metal" x={280} y={1170} at={130} bg="#C9D2E3" color={INK} size={40} />
      <Pill text="tall wood" x={900} y={880} at={140} bg={ORG} size={40} />
      {f > strike + 6 && <Pill text="tall wins ✓" x={540} y={1060} at={strike + 6} bg={TEAL} size={50} />}
      <AbsoluteFill style={{background: '#fff', opacity: flash(f, strike, 0.45)}} />
    </AbsoluteFill>
  );
};

const STROKES = [12, 120, 155, 190];
const Strokes: React.FC = () => {
  const f = useCurrentFrame();
  const d = zig(540, 540, 540, 1250, 'path', 9, 70);
  const n = STROKES.filter((s) => f >= s).length;
  const cur = STROKES[n - 1] ?? 0;
  const age = f - cur;
  return (
    <AbsoluteFill>
      {n > 0 && <Counter n={n} of={4} y={135} color={YEL} />}
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        {/* faint glowing channel left behind */}
        {n > 0 && <path d={d} fill="none" stroke={YEL} strokeWidth={6} opacity={0.25} />}
        {n > 0 && age < 16 && <Bolt d={d} p={n === 1 ? interpolate(age, [0, 14], [0, 1], clamp) : interpolate(age, [0, 3], [0, 1], clamp)} o={n === 1 || age < 8 ? 1 : 0.3} />}
        <Storm cx={540} cy={420} s={0.95} />
        <rect x={140} y={1250} width={800} height={16} rx={8} fill="#ffffff55" />
        <circle cx={540} cy={1258} r={interpolate(age, [0, 14], [10, 60], clamp)} fill="none" stroke={YEL} strokeWidth={6} opacity={n ? interpolate(age, [0, 14], [1, 0], clamp) : 0} />
      </svg>
      {n === 1 && <Pill text="stroke #1" x={810} y={800} at={20} bg={ORG} size={44} />}
      {n >= 2 && <Pill text="same path! 🔁" x={810} y={800} at={120} bg={PINK} size={44} />}
      {n >= 3 && <Pill text={`+${n - 1} more`} x={260} y={980} at={155} bg={TEAL} size={44} />}
      <AbsoluteFill style={{background: '#fff', opacity: STROKES.reduce((a, s) => a + flash(f, s, 0.35), 0)}} />
    </AbsoluteFill>
  );
};

const Flicker: React.FC = () => {
  const f = useCurrentFrame();
  const on = f > 8 && f % 19 < 4;
  const d = zig(540, 500, 540, 760, 'flick', 5, 45);
  return (
    <AbsoluteFill>
      <Slam words={['FLICKER!']} at={6} y={130} size={110} color={SKY} />
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        {on && <Bolt d={d} />}
        <Storm cx={540} cy={395} s={0.8} />
        <House x={540} y={990} s={0.95} />
        {[0, 1, 2, 3].map((i) => {
          const s = spring({frame: f - 40 - i * 28, fps: FPS, config: {damping: 11}});
          const x = 110 + i * 220;
          const fd = zig(100, 10, 100, 120, 'flick', 5, 18);
          return (
            <g key={i} transform={`translate(${x} 1030) translate(100 110) scale(${s}) translate(-100 -110)`}>
              <rect x={0} y={0} width={200} height={220} rx={16} fill="#0C0C1D" stroke="#fff" strokeWidth={6} />
              {[16, 82, 148].map((yy) => <rect key={yy} x={8} y={yy} width={10} height={14} rx={3} fill="#ffffff55" />)}
              <Bolt d={fd} w={0.45} />
              <g transform="translate(100 205) scale(0.4)"><House x={0} y={0} /></g>
            </g>
          );
        })}
      </svg>
      <Pill text="same spot, again & again" x={540} y={1310} at={150} bg={YEL} color={INK} size={46} />
      <AbsoluteFill style={{background: '#fff', opacity: on ? 0.14 : 0}} />
    </AbsoluteFill>
  );
};

const Dozen: React.FC = () => {
  const f = useCurrentFrame();
  const per = 9, start = 60;
  const k = Math.max(0, Math.min(12, Math.floor((f - start) / per) + 1));
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 160, width: '100%', textAlign: 'center', fontFamily: 'B8', fontSize: 210, color: YEL, lineHeight: 1, textShadow: OUT}}>
        {f >= start ? k : 0}{k >= 12 ? '+' : ''}
      </div>
      <Pill text="strokes in ONE flash" x={540} y={430} at={10} bg={PINK} size={50} />
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        {Array.from({length: 12}).map((_, i) => {
          const s = spring({frame: f - start - i * per, fps: FPS, config: {damping: 8, stiffness: 260}});
          const c = i % 4, r = Math.floor(i / 4);
          return <g key={i} transform={`translate(${210 + c * 220} ${600 + r * 170}) scale(${s}) rotate(${(random('d' + i) - 0.5) * 24})`}><BoltIcon x={0} y={0} s={1.5} /></g>;
        })}
      </svg>
      {f > start + 12 * per && <Slam words={['ONE', 'SPOT!']} at={start + 12 * per + 4} y={1110} size={100} gap={5} />}
      <Huh mood="shocked" x={940} y={1110} h={270} at={30} flip />
    </AbsoluteFill>
  );
};

const Roy: React.FC = () => {
  const f = useCurrentFrame();
  const rs = spring({frame: f - 4, fps: FPS, config: {damping: 12}});
  const hits = Array.from({length: 7}).map((_, i) => 70 + i * 18);
  const last = hits.filter((h) => f >= h).pop();
  const zap = last !== undefined && f - last < 6 ? 1 : 0;
  return (
    <AbsoluteFill>
      <Pill text="park ranger Roy Sullivan" x={540} y={190} at={6} bg={TEAL} size={48} />
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        {hits.map((h, i) => {
          const s = spring({frame: f - h, fps: FPS, config: {damping: 8, stiffness: 260}});
          return <g key={i} transform={`translate(${135 + i * 135} 330) scale(${s})`}><BoltIcon x={0} y={0} s={1.15} /></g>;
        })}
        <g transform={`translate(540 ${820 + (1 - rs) * 300}) rotate(${zap * Math.sin(f * 2) * 4})`}><Ranger cx={0} cy={0} s={1.05} zap={zap} /></g>
        {zap ? <Bolt d={zig(540, 400, 540, 590, 'roy' + last, 4, 30)} w={0.8} /> : null}
      </svg>
      <div style={{position: 'absolute', left: 40, top: 450, fontFamily: 'B8', fontSize: 150, color: YEL, textShadow: OUT, transform: `scale(${spring({frame: f - 200, fps: FPS, config: {damping: 9}})})`}}>7×</div>
      <Pill text="1942 → 1977" x={540} y={1300} at={150} bg={CREAM} color={INK} size={52} />
      {f > 225 && <Pill text="survived all 7 ✓" x={820} y={1080} at={225} bg={PINK} size={44} />}
      <AbsoluteFill style={{background: '#fff', opacity: zap ? 0.18 : 0}} />
    </AbsoluteFill>
  );
};

const Sky: React.FC = () => {
  const f = useCurrentFrame();
  const strike = 70;
  const on = f >= strike && f < strike + 18;
  // arcing "bolt from the blue": out sideways from the storm, then down near the walker
  const pts: string[] = [];
  for (let i = 0; i <= 12; i++) {
    const t = i / 12;
    const x = 250 + (790 - 250) * t + (i && i < 12 ? (random('sky' + i) - 0.5) * 50 : 0);
    const y = 560 - Math.sin(t * Math.PI) * 220 + t * 560 + (i && i < 12 ? (random('sy' + i) - 0.5) * 40 : 0);
    pts.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  const d = 'M ' + pts.join(' L ');
  const arrow = interpolate(f, [110, 150], [0, 1], {...clamp, easing: ease});
  const sun = spring({frame: f, fps: FPS, config: {damping: 12}});
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1130, background: 'linear-gradient(#6FB7FF, #BFE3FF)', opacity: 0.85}} />
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        <g transform={`translate(880 300) scale(${sun}) rotate(${f})`}>
          {Array.from({length: 10}).map((_, i) => <rect key={i} x={-8} y={-130} width={16} height={40} rx={8} fill={YEL} stroke={INK} strokeWidth={5} transform={`rotate(${i * 36})`} />)}
          <circle r={80} fill={YEL} stroke={INK} strokeWidth={8} />
        </g>
        <Storm cx={200} cy={520} s={0.55} face={false} />
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M ${130 + i * 45} 600 l -15 60`} stroke="#5FB4FF" strokeWidth={8} strokeLinecap="round" opacity={0.8} />)}
        <rect x={0} y={1130} width={1080} height={290} fill={LEAF} />
        <rect x={0} y={1124} width={1080} height={12} fill={INK} />
        <Person x={850} y={1110} s={1.1} />
        {on && <Bolt d={d} p={interpolate(f, [strike, strike + 5], [0, 1], clamp)} />}
        <Arrow d="M 210 1250 L 830 1250" progress={arrow} color={INK} w={12} />
      </svg>
      <Pill text="10–15 miles away!" x={520} y={1320} at={130} bg={ORG} size={46} />
      <Pill text="blue sky ☀️" x={600} y={250} at={20} bg="#fff" color={INK} size={44} />
      {f > 190 && <Pill text="hear thunder? → go inside 🏠" x={540} y={850} at={190} bg={PINK} size={46} />}
      <AbsoluteFill style={{background: '#fff', opacity: flash(f, strike, 0.5)}} />
    </AbsoluteFill>
  );
};

export const scenes: SceneMap = {
  hook: {C: Hook, hue: PURPLE}, empire: {C: Empire, hue: SKY}, rules: {C: Rules, hue: ORG}, metal: {C: Metal, hue: RED},
  strokes: {C: Strokes, hue: YEL}, flicker: {C: Flicker, hue: INDIGO}, dozen: {C: Dozen, hue: PINK}, roy: {C: Roy, hue: TEAL},
  sky: {C: Sky, hue: SKY}, cta: {C: CTA, hue: PINK},
};
