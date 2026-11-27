import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, spring, random} from 'remotion';
import {FPS, INK, PINK, YEL, TEAL, ORG, CREAM, SKY, RED, clamp, ease, Slam, Pill, Huh, Arrow, Count, SwapCards, CTA, SceneMap} from '../../kit';
import timing from './timing.json';

export const title = 'can a falling penny kill you?';
export const segs = timing;

const OUT = `0 8px 0 ${INK}`;
const COP = '#E08A4F', COPD = '#A8552A', STONE = '#8FA3C9', STONED = '#6E80A8', SKIN = '#F2C9A0', PURPLE = '#9b5cff', LEAF = '#3BB273', GREY = '#6B6F86';

/* ---------- illustrations ---------- */

/** Copper penny. tilt = vertical squash (1 = face-on, ~0.15 = edge-on) for tumbling. */
const Penny: React.FC<{x: number; y: number; r?: number; tilt?: number; rot?: number}> = ({x, y, r = 60, tilt = 1, rot = 0}) => {
  const t = Math.max(0.12, Math.abs(tilt));
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(1 ${t})`}>
      <circle r={r + 8} fill={INK} />
      <circle r={r} fill={COP} />
      <circle r={r * 0.8} fill="none" stroke={COPD} strokeWidth={r * 0.09} />
      <text y={r * 0.32} textAnchor="middle" fontFamily="B8" fontSize={r * 0.92} fill={COPD}>1¢</text>
      <ellipse cx={-r * 0.38} cy={-r * 0.42} rx={r * 0.26} ry={r * 0.12} fill="#fff" opacity={0.45} />
    </g>
  );
};

/** Generic stepped skyscraper standing on `base`, total height h. grow 0..1 rises from the ground. */
const Tower: React.FC<{x: number; base: number; h: number; w?: number; grow?: number}> = ({x, base, h, w = 240, grow = 1}) => {
  const b1 = h * 0.72, b2 = h * 0.12, b3 = h * 0.06, b4 = h * 0.1;
  const y1 = base - b1, y2 = y1 - b2, y3 = y2 - b3, y4 = y3 - b4;
  const rows = Math.floor((b1 - 40) / 36);
  return (
    <g transform={`translate(0 ${base}) scale(1 ${Math.max(0.001, grow)}) translate(0 ${-base})`}>
      <rect x={x - 6} y={y4} width={12} height={b4 + 4} fill={STONE} stroke={INK} strokeWidth={6} />
      <rect x={x - w * 0.22} y={y3} width={w * 0.44} height={b3 + 4} fill={STONE} stroke={INK} strokeWidth={8} />
      <rect x={x - w * 0.36} y={y2} width={w * 0.72} height={b2 + 4} fill={STONE} stroke={INK} strokeWidth={8} />
      <rect x={x - w / 2} y={y1} width={w} height={b1} fill={STONE} stroke={INK} strokeWidth={9} />
      <rect x={x - w / 2 + 9} y={y1 + 5} width={w * 0.16} height={b1 - 10} fill={STONED} />
      {Array.from({length: rows}).map((_, r) => Array.from({length: 5}).map((__, c) => (
        <rect key={r + '-' + c} x={x - w / 2 + 22 + c * ((w - 44) / 5)} y={y1 + 22 + r * 36} width={(w - 44) / 5 - 12} height={20} rx={3}
          fill={random('w' + r + c) > 0.55 ? YEL : '#3E4A6E'} />
      )))}
    </g>
  );
};

/** Small person looking up. mood: calm | shock | wince */
const Person: React.FC<{x: number; y: number; s?: number; mood?: string; shirt?: string}> = ({x, y, s = 1, mood = 'calm', shirt = TEAL}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -70 150 Q -70 70 0 70 Q 70 70 70 150 Z" fill={shirt} stroke={INK} strokeWidth={8} />
    <circle cx={0} cy={0} r={62} fill={SKIN} stroke={INK} strokeWidth={8} />
    <path d="M -58 -18 Q -50 -70 0 -66 Q 50 -70 58 -18 Q 30 -42 0 -40 Q -30 -42 -58 -18 Z" fill="#3A2A20" stroke={INK} strokeWidth={6} />
    {mood === 'wince' ? (
      <g stroke={INK} strokeWidth={7} strokeLinecap="round" fill="none">
        <path d="M -32 -4 L -14 4 L -32 12" /><path d="M 32 -4 L 14 4 L 32 12" />
        <path d="M -16 34 Q 0 26 16 34" />
      </g>
    ) : (
      <g>
        {[-22, 22].map((ex) => <g key={ex}>
          <ellipse cx={ex} cy={0} rx={13} ry={mood === 'shock' ? 18 : 15} fill="#fff" stroke={INK} strokeWidth={5} />
          <circle cx={ex} cy={-6} r={7} fill={INK} />
        </g>)}
        {mood === 'shock' ? <ellipse cx={0} cy={36} rx={12} ry={16} fill={INK} /> : <path d="M -16 32 Q 0 44 16 32" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />}
      </g>
    )}
  </g>
);

/** Speedometer, use inside <svg>. v in mph. */
const Gauge: React.FC<{x: number; y: number; r?: number; v: number; max?: number; color?: string}> = ({x, y, r = 170, v, max = 220, color = RED}) => {
  const k = Math.min(v, max) / max;
  const a = Math.PI + Math.PI * k;
  return (
    <g>
      <path d={`M ${x - r} ${y} A ${r} ${r} 0 0 1 ${x + r} ${y}`} fill="none" stroke={INK} strokeWidth={54} strokeLinecap="round" />
      <path d={`M ${x - r} ${y} A ${r} ${r} 0 0 1 ${x + r} ${y}`} fill="none" stroke="#ffffff22" strokeWidth={36} strokeLinecap="round" />
      <path d={`M ${x - r} ${y} A ${r} ${r} 0 0 1 ${x + r} ${y}`} fill="none" stroke={color} strokeWidth={36} strokeLinecap="round" pathLength={1} strokeDasharray={`${k} 1`} />
      {[0, 50, 100, 150, 200].map((t) => {
        const ta = Math.PI + (Math.PI * t) / max;
        return <text key={t} x={x + Math.cos(ta) * (r - 62)} y={y + Math.sin(ta) * (r - 62) + 12} textAnchor="middle" fontFamily="B8" fontSize={30} fill="#fff">{t}</text>;
      })}
      <line x1={x} y1={y} x2={x + Math.cos(a) * (r - 20)} y2={y + Math.sin(a) * (r - 20)} stroke={INK} strokeWidth={20} strokeLinecap="round" />
      <line x1={x} y1={y} x2={x + Math.cos(a) * (r - 20)} y2={y + Math.sin(a) * (r - 20)} stroke={YEL} strokeWidth={10} strokeLinecap="round" />
      <circle cx={x} cy={y} r={22} fill={YEL} stroke={INK} strokeWidth={8} />
      <text x={x} y={y + 90} textAnchor="middle" fontFamily="B8" fontSize={76} fill="#fff" stroke={INK} strokeWidth={8} paintOrder="stroke">{Math.round(v)} mph</text>
    </g>
  );
};

const Burst: React.FC<{x: number; y: number; at: number; c?: string}> = ({x, y, at, c = YEL}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + 14], [0, 1], {...clamp, easing: ease});
  if (f < at) return null;
  return (
    <g opacity={1 - p * 0.6}>
      {Array.from({length: 10}).map((_, i) => {
        const a = (i / 10) * Math.PI * 2;
        return <line key={i} x1={x + Math.cos(a) * 40 * p} y1={y + Math.sin(a) * 40 * p} x2={x + Math.cos(a) * (40 + 90 * p)} y2={y + Math.sin(a) * (40 + 90 * p)} stroke={c} strokeWidth={12} strokeLinecap="round" />;
      })}
    </g>
  );
};

const Stamp: React.FC<{text: string; x: number; y: number; at: number; color?: string; size?: number; rot?: number}> = ({text, x, y, at, color = RED, size = 70, rot = -8}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const k = interpolate(f, [at, at + 6], [2.2, 1], {...clamp, easing: ease});
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${k}) rotate(${rot}deg)`, border: `10px solid ${color}`, color, fontFamily: 'B8', fontSize: size,
      padding: '4px 30px', borderRadius: 20, background: '#14142Bee', whiteSpace: 'nowrap', opacity: interpolate(f, [at, at + 3], [0, 1], clamp)}}>{text}</div>
  );
};

/* ---------- scenes ---------- */

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [20, 100], [0, 1], {...clamp, easing: (t) => t * t});
  const py = 400 + p * 790, px = 480 + Math.sin(p * 9) * 40;
  const frozen = f > 100;
  const wob = frozen ? Math.sin(f / 3) * 6 : 0;
  const ts = spring({frame: f, fps: FPS, config: {damping: 13}});
  return (
    <AbsoluteFill>
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        <Tower x={300} base={1420} h={1060} w={300} grow={ts} />
        {f > 20 && !frozen && [1, 2, 3].map((k) => <line key={k} x1={px} y1={py - 40 - k * 40} x2={px} y2={py - 80 - k * 40} stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={0.5 / k} />)}
        {f > 14 && <Penny x={px} y={py + wob} r={46} tilt={frozen ? 1 : Math.cos(f / 3)} rot={frozen ? wob : f * 6} />}
        <Person x={640} y={1290} s={1.1} mood={f > 80 ? 'shock' : 'calm'} />
        {frozen && <circle cx={px} cy={py} r={80 + 6 * Math.sin(f / 4)} fill="none" stroke={YEL} strokeWidth={8} strokeDasharray="18 14" />}
      </svg>
      <Slam words={['PENNY', 'OF', 'DOOM?']} at={6} y={140} size={118} gap={8} />
      {f >= 104 && <Pill text="⏸ wait…" x={720} y={1080} at={104} bg={YEL} color={INK} size={50} />}
      {f >= 140 && <Pill text="everyone's heard it 🗣️" x={720} y={430} at={140} bg={CREAM} color={INK} size={44} />}
      {f >= 175 && <Pill text="deadly? ☠️" x={760} y={560} at={175} bg={RED} size={56} />}
      {f >= 160 && <Huh mood="shocked" x={920} y={720} h={260} at={160} flip />}
    </AbsoluteFill>
  );
};

const Tall: React.FC = () => {
  const f = useCurrentFrame();
  const grow = interpolate(f, [5, 70], [0, 1], {...clamp, easing: ease});
  const rule = interpolate(f, [10, 75], [0, 1], {...clamp, easing: ease});
  const s = spring({frame: f - 150, fps: FPS, config: {damping: 10}});
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 140, width: '100%', textAlign: 'center', fontFamily: 'B8', fontSize: 150, color: YEL, textShadow: OUT, lineHeight: 1}}>
        <Count to={1250} at={10} len={65} suffix=" ft" />
      </div>
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        <Tower x={430} base={1380} h={1000} w={280} grow={grow} />
        <rect x={0} y={1380} width={1080} height={40} fill={GREY} />
        <Arrow d="M 800 1380 L 800 380" color="#fff" progress={rule} w={10} />
        {Array.from({length: 11}).map((_, i) => (
          <line key={i} x1={780} x2={i % 5 === 0 ? 850 : 825} y1={1380 - i * 100} y2={1380 - i * 100} stroke="#fff" strokeWidth={7} opacity={rule * 10 > i ? 1 : 0} />
        ))}
        <Person x={600} y={1330} s={0.32} mood="calm" />
        {f >= 150 && <g transform={`translate(430 ${555 - 25}) scale(${s})`}><Penny x={0} y={-60} r={22} rot={f * 2} /></g>}
      </svg>
      {f >= 85 && <Pill text="highest floor 🏢" x={820} y={330} at={85} bg={TEAL} color={INK} size={40} />}
      {f >= 115 && <Pill text="102 floors" x={870} y={760} at={115} bg={CREAM} color={INK} size={42} />}
      {f >= 158 && <Pill text="← one tiny coin" x={650} y={480} at={158} bg={PINK} size={40} />}
      {f >= 195 && <Pill text="4+ football fields tall 🏈" x={540} y={1260} at={195} bg={YEL} color={INK} size={44} />}
    </AbsoluteFill>
  );
};

const Vacuum: React.FC = () => {
  const f = useCurrentFrame();
  const js = spring({frame: f, fps: FPS, config: {damping: 12}});
  const loop = ((f - 20) % 45 + 45) % 45 / 45;
  const py = 470 + loop * loop * 780;
  const v = interpolate(f, [70, 150], [0, 200], {...clamp, easing: ease});
  const gs = spring({frame: f - 60, fps: FPS, config: {damping: 12}});
  return (
    <AbsoluteFill>
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        <g transform={`translate(320 820) scale(${js}) translate(-320 -820)`}>
          <rect x={110} y={380} width={420} height={940} rx={60} fill="#ffffff10" stroke="#fff" strokeWidth={10} />
          <rect x={80} y={1300} width={480} height={50} rx={14} fill={GREY} stroke={INK} strokeWidth={8} />
          <path d="M 160 460 L 160 700" stroke="#ffffff55" strokeWidth={14} strokeLinecap="round" />
          {f > 20 && <>
            {[1, 2, 3, 4].map((k) => <line key={k} x1={320} y1={py - 50 - k * 50} x2={320} y2={py - 100 - k * 50} stroke={YEL} strokeWidth={8} strokeLinecap="round" opacity={(0.7 / k) * Math.min(1, loop * 4)} />)}
            <Penny x={320} y={py} r={52} />
          </>}
        </g>
        {f >= 60 && <g transform={`translate(810 820) scale(${gs}) translate(-810 -820)`}><Gauge x={810} y={820} r={200} v={v} /></g>}
      </svg>
      <Pill text="NO AIR 🚫💨" x={320} y={300} at={6} bg={SKY} color={INK} size={54} />
      {f >= 30 && <Pill text="nothing to slow it" x={800} y={480} at={30} bg={CREAM} color={INK} size={40} />}
      {f >= 190 && <Huh mood="shocked" x={810} y={1030} h={300} at={190} />}
    </AbsoluteFill>
  );
};

const Light: React.FC = () => {
  const f = useCurrentFrame();
  const drop = interpolate(f, [8, 22], [0, 1], {...clamp, easing: (t) => t * t});
  const grams = interpolate(f, [24, 60], [0, 2.5], {...clamp, easing: ease});
  const out = interpolate(f, [95, 115], [0, 1], {...clamp, easing: ease});
  const big = spring({frame: f - 105, fps: FPS, config: {damping: 11}});
  const air = interpolate(f, [140, 170], [0, 1], {...clamp, easing: ease});
  const push = f > 150 ? Math.sin(f / 4) * 10 - 20 * air : 0;
  return (
    <AbsoluteFill>
      <Slam words={['LIGHT', '+', 'FLAT']} at={4} y={140} size={120} gap={7} />
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        {out < 1 && <g transform={`translate(0 ${out * 900})`} opacity={1 - out}>
          <rect x={290} y={900} width={500} height={220} rx={40} fill={CREAM} stroke={INK} strokeWidth={10} />
          <rect x={380} y={960} width={320} height={110} rx={18} fill={INK} />
          <text x={540} y={1045} textAnchor="middle" fontFamily="B8" fontSize={84} fill={YEL}>{grams.toFixed(1)} g</text>
          <rect x={340} y={860} width={400} height={40} rx={14} fill="#C9D1E3" stroke={INK} strokeWidth={8} />
          <Penny x={540} y={430 + drop * 405} r={70} tilt={drop < 1 ? Math.cos(f / 2) : 0.28} />
        </g>}
        {f >= 105 && <g transform={`translate(0 ${push})`}>
          <g transform={`translate(430 700) scale(${big}) translate(-430 -700)`}>
            <Penny x={430} y={700} r={150} tilt={interpolate(f, [120, 140], [1, 0.3], clamp)} />
          </g>
        </g>}
        {f >= 112 && <text x={830} y={735} textAnchor="middle" fontSize={140} opacity={big}>🥏</text>}
        {air > 0 && [250, 340, 430, 520, 610].map((x, i) => (
          <Arrow key={x} d={`M ${x} 1180 L ${x} ${860 + push}`} color={TEAL} progress={interpolate(f, [140 + i * 4, 165 + i * 4], [0, 1], clamp)} w={16} />
        ))}
      </svg>
      {f >= 30 && f < 100 && <Pill text="just 2.5 grams ⚖️" x={540} y={1260} at={30} bg={YEL} color={INK} size={48} />}
      {f >= 118 && <Pill text="like a tiny frisbee" x={760} y={460} at={118} bg={PINK} size={42} />}
      {f >= 170 && <Pill text="AIR PUSHES BACK 💨" x={540} y={1280} at={170} bg={TEAL} color={INK} size={52} />}
    </AbsoluteFill>
  );
};

const Flutter: React.FC = () => {
  const f = useCurrentFrame();
  const rockY = 420 + ((f * 16) % 700);
  const t = f / FPS;
  const py = 420 + ((f * 3.2) % 680);
  const px = 760 + Math.sin(t * 3.2) * 120;
  const graph = interpolate(f, [110, 190], [0, 1], {...clamp, easing: ease});
  const ls = spring({frame: f - 10, fps: FPS, config: {damping: 12}});
  return (
    <AbsoluteFill>
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        <line x1={540} y1={340} x2={540} y2={1130} stroke="#ffffff33" strokeWidth={6} strokeDasharray="20 16" />
        <g opacity={ls}>
          {[1, 2, 3].map((k) => <line key={k} x1={290} y1={rockY - 60 - k * 45} x2={290} y2={rockY - 95 - k * 45} stroke="#fff" strokeWidth={7} strokeLinecap="round" opacity={0.5 / k} />)}
          <path transform={`translate(290 ${rockY})`} d="M -60 -20 L -30 -55 L 30 -50 L 62 -10 L 45 40 L -20 52 L -58 25 Z" fill={GREY} stroke={INK} strokeWidth={9} strokeLinejoin="round" />
          <Penny x={px} y={py} r={52} tilt={Math.cos(t * 6.4)} rot={Math.sin(t * 3.2) * 35} />
          <text x={px - Math.sin(t * 3.2) * 90} y={py - 90} fontSize={60} textAnchor="middle" opacity={0.7}>🍂</text>
        </g>
        {/* speed vs distance graph */}
        <g opacity={graph > 0 ? 1 : 0}>
          <rect x={110} y={1160} width={860} height={240} rx={26} fill="#ffffff14" stroke="#fff" strokeWidth={5} />
          <path d="M 160 1360 L 420 1230 L 930 1230" fill="none" stroke={YEL} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - graph} />
          {graph > 0.45 && <>
            <line x1={420} y1={1200} x2={420} y2={1380} stroke={PINK} strokeWidth={6} strokeDasharray="12 10" />
            <text x={430} y={1388} fontFamily="B8" fontSize={36} fill={PINK}>50 ft</text>
          </>}
          <text x={150} y={1205} fontFamily="B8" fontSize={32} fill="#fff">speed</text>
        </g>
      </svg>
      <Pill text="rock 🪨" x={290} y={300} at={6} bg={GREY} size={46} />
      <Pill text="penny" x={760} y={300} at={14} bg={COP} color={INK} size={46} />
      {f >= 190 && <Pill text="no more speeding up ✋" x={700} y={1120} at={190} bg={PINK} size={44} />}
    </AbsoluteFill>
  );
};

const Bar: React.FC<{y: number; v: number; at: number; label: string; color: string}> = ({y, v, at, label, color}) => {
  const f = useCurrentFrame();
  const w = interpolate(f, [at, at + 30], [0, (v / 200) * 420], {...clamp, easing: ease});
  const s = spring({frame: f - at, fps: FPS, config: {damping: 12}});
  if (f < at) return null;
  return (
    <div style={{position: 'absolute', left: 90, top: y, display: 'flex', alignItems: 'center', gap: 20, opacity: s, transform: `translateX(${(1 - s) * -60}px)`}}>
      <div style={{width: 260, fontFamily: 'B8', fontSize: 40, color: '#fff', textAlign: 'right', textShadow: OUT}}>{label}</div>
      <div style={{width: w, height: 80, borderRadius: 18, background: color, border: `6px solid ${INK}`, boxShadow: `0 6px 0 ${INK}`}} />
      <div style={{fontFamily: 'B8', fontSize: 52, color, textShadow: OUT, whiteSpace: 'nowrap'}}>{Math.round((w / 420) * 200)} mph</div>
    </div>
  );
};

const Terminal: React.FC = () => {
  const f = useCurrentFrame();
  const drag = interpolate(f, [25, 85], [0.15, 1], {...clamp, easing: ease});
  const g = interpolate(f, [10, 30], [0, 1], {...clamp, easing: ease});
  const eq = spring({frame: f - 88, fps: FPS, config: {damping: 10}});
  const shrink = interpolate(f, [120, 140], [1, 0.75], {...clamp, easing: ease});
  return (
    <AbsoluteFill>
      <Slam words={['TERMINAL', 'VELOCITY']} at={4} y={140} size={96} gap={8} />
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        <g transform={`translate(540 620) scale(${shrink}) translate(-540 -620)`}>
          <Arrow d="M 540 700 L 540 900" color={RED} progress={g} w={26} />
          <path d="M 510 880 L 540 930 L 570 880 Z" fill={RED} opacity={g} />
          <Arrow d={`M 540 540 L 540 ${540 - 200 * drag}`} color={TEAL} progress={g} w={26} />
          <path d={`M 510 ${560 - 200 * drag} L 540 ${510 - 200 * drag} L 570 ${560 - 200 * drag} Z`} fill={TEAL} opacity={g} />
          <Penny x={540} y={620} r={80} tilt={Math.cos(f / 7) * 0.5 + 0.5} rot={Math.sin(f / 9) * 20} />
          <text x={620} y={410} fontFamily="B8" fontSize={42} fill={TEAL} opacity={g}>air drag</text>
          <text x={620} y={880} fontFamily="B8" fontSize={42} fill={RED} opacity={g}>gravity</text>
        </g>
      </svg>
      {f >= 88 && <div style={{position: 'absolute', left: 250, top: 500, fontFamily: 'B8', fontSize: 120, color: YEL, textShadow: OUT, transform: `scale(${eq})`}}>=</div>}
      {f >= 92 && <Pill text="balanced!" x={300} y={700} at={92} bg={YEL} color={INK} size={40} />}
      {f >= 100 && <Pill text="Louis Bloomfield, physicist 🔬" x={540} y={950} at={100} bg={CREAM} color={INK} size={40} />}
      <Bar y={1030} v={25} at={150} label="measured 🐢" color={TEAL} />
      <Bar y={1150} v={50} at={245} label="max guess" color={YEL} />
      <Bar y={1270} v={200} at={285} label="no air" color={RED} />
    </AbsoluteFill>
  );
};

const Flick: React.FC = () => {
  const f = useCurrentFrame();
  const hand = interpolate(f, [70, 92], [0, 1], {...clamp, easing: ease});
  const hit = f >= 92;
  const back = interpolate(f, [92, 110], [0, 1], {...clamp, easing: ease});
  const head = hit && f < 104 ? Math.sin(f * 2.2) * 6 : 0;
  return (
    <AbsoluteFill>
      <SwapCards before="a penny can kill you ☠️" after="feels like a flick 👆" label="actually..." at={6} y={250} />
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        <g transform={`translate(${head} 0)`}><Person x={440} y={1060} s={1.3} mood={hit && f < 140 ? 'wince' : 'calm'} shirt={PURPLE} /></g>
        <Burst x={425} y={990} at={92} />
        {hit && <Penny x={425 + back * 160} y={965 - back * 120} r={30} rot={f * 9} tilt={Math.cos(f / 2)} />}
      </svg>
      <div style={{position: 'absolute', left: 60 + hand * 170 - (hit ? back * 60 : 0), top: 925, fontSize: 120}}>👉</div>
      {hit && <Pill text="flick! not even hard" x={560} y={860} at={94} bg={YEL} color={INK} size={40} />}
      <Stamp text="MYTH BUSTED ✗" x={540} y={1340} at={140} />
      {f >= 120 && <Huh mood="laughing" x={880} y={1000} h={280} at={120} flip />}
    </AbsoluteFill>
  );
};

const Updraft: React.FC = () => {
  const f = useCurrentFrame();
  const fall = interpolate(f, [10, 60], [0, 1], {...clamp, easing: (t) => t * t});
  const lift = interpolate(f, [60, 150], [0, 1], {...clamp, easing: ease});
  const py = 380 + fall * 560 - lift * 420 + (f > 150 ? Math.sin(f / 8) * 30 : 0);
  const px = 560 + (f > 60 ? Math.sin(f / 11) * 110 : 0);
  return (
    <AbsoluteFill>
      <Slam words={['WIND', 'GOES', 'UP']} at={4} y={140} size={120} gap={7} />
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        <rect x={40} y={330} width={330} height={1060} fill={STONE} stroke={INK} strokeWidth={10} />
        {Array.from({length: 24}).map((_, r) => Array.from({length: 4}).map((__, c) => (
          <rect key={r + '-' + c} x={70 + c * 75} y={360 + r * 42} width={52} height={24} rx={3} fill={random('u' + r + c) > 0.6 ? YEL : '#3E4A6E'} />
        )))}
        <rect x={0} y={1360} width={1080} height={60} fill={GREY} />
        {[420, 520, 640, 760, 880].map((x, i) => {
          const pts: string[] = [];
          for (let y = 1340; y >= 330; y -= 30) pts.push(`${(x + Math.sin(y / 70 + i) * 26).toFixed(1)} ${y}`);
          return <path key={x} d={'M ' + pts.join(' L ')} fill="none" stroke="#ffffff66" strokeWidth={8} strokeLinecap="round" strokeDasharray="60 50" strokeDashoffset={f * 9 + i * 30} />;
        })}
        {f >= 70 && [470, 700, 900].map((x, i) => (
          <Arrow key={x} d={`M ${x} 1250 L ${x} 760`} color={TEAL} progress={interpolate(f, [70 + i * 8, 100 + i * 8], [0, 1], clamp)} w={18} />
        ))}
        <Penny x={px} y={py} r={46} tilt={Math.cos(f / 4)} rot={f * 4} />
      </svg>
      {f >= 75 && <Pill text="updraft 🌬️" x={790} y={1180} at={75} bg={TEAL} color={INK} size={50} />}
      {f >= 175 && <Pill text="never lands? 🤷" x={700} y={1300} at={175} bg={PINK} size={48} />}
    </AbsoluteFill>
  );
};

const Pen: React.FC<{x: number; y: number; rot?: number}> = ({x, y, rot = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <rect x={-26} y={-330} width={52} height={300} rx={20} fill={SKY} stroke={INK} strokeWidth={8} />
    <rect x={-30} y={-360} width={60} height={70} rx={18} fill="#2E5BD8" stroke={INK} strokeWidth={8} />
    <rect x={18} y={-350} width={14} height={110} rx={6} fill="#2E5BD8" stroke={INK} strokeWidth={6} />
    <path d="M -26 -40 L 26 -40 L 6 20 L -6 20 Z" fill="#C9D1E3" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
    <circle cx={0} cy={22} r={6} fill={INK} />
    <rect x={-14} y={-310} width={10} height={240} rx={5} fill="#fff" opacity={0.4} />
  </g>
);

const PenScene: React.FC = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [40, 100], [0, 1], {...clamp, easing: (t) => t * t});
  const y = 380 + p * 860;
  const v = interpolate(f, [40, 100], [0, 200], {...clamp, easing: (t) => t * t});
  const hit = f >= 100;
  const shake = hit && f < 116 ? Math.sin(f * 2.4) * 10 : 0;
  const crack = interpolate(f, [100, 112], [0, 1], {...clamp, easing: ease});
  const gs = spring({frame: f - 30, fps: FPS, config: {damping: 12}});
  return (
    <AbsoluteFill style={{transform: `translate(${shake}px, 0)`}}>
      <Slam words={['REAL', 'DANGER']} at={4} y={140} size={120} gap={8} />
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        <rect x={0} y={1250} width={1080} height={170} fill={GREY} stroke={INK} strokeWidth={8} />
        {[0, 1, 2, 3].map((i) => <line key={i} x1={i * 300 + 120} y1={1250} x2={i * 300 + 80} y2={1420} stroke={INK} strokeWidth={6} />)}
        {!hit && [1, 2, 3, 4].map((k) => <line key={k} x1={330} y1={y - 400 - k * 60} x2={330} y2={y - 450 - k * 60} stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={(0.6 / k) * p} />)}
        <Pen x={330} y={hit ? 1262 : y + 12} rot={hit ? 4 : 0} />
        {hit && <g stroke={INK} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 330 1280 L 270 1330 L 240 1400" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - crack} />
          <path d="M 330 1280 L 400 1320 L 460 1310 L 520 1380" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - crack} />
          <path d="M 330 1280 L 340 1350 L 310 1410" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - crack} />
        </g>}
        <Burst x={330} y={1270} at={100} c={ORG} />
        {f >= 30 && <g transform={`translate(800 620) scale(${gs}) translate(-800 -620)`}><Gauge x={800} y={620} r={170} v={v} /></g>}
      </svg>
      {f >= 8 && <Pill text="ballpoint pen 🖊️" x={330} y={330} at={8} bg={SKY} color={INK} size={44} />}
      {f >= 48 && f < 100 && <Pill text="point first ⬇" x={560} y={560} at={48} bg={YEL} color={INK} size={40} />}
      {f >= 205 && <Pill text="please: drop NOTHING 🙏" x={540} y={1180} at={205} bg={PINK} size={50} />}
      {f >= 150 && <Huh mood="explaining" x={800} y={860} h={270} at={150} />}
    </AbsoluteFill>
  );
};

export const scenes: SceneMap = {
  hook: {C: Hook, hue: PURPLE}, tall: {C: Tall, hue: SKY}, vacuum: {C: Vacuum, hue: RED}, light: {C: Light, hue: ORG},
  flutter: {C: Flutter, hue: LEAF}, terminal: {C: Terminal, hue: TEAL}, flick: {C: Flick, hue: PINK}, updraft: {C: Updraft, hue: SKY},
  pen: {C: PenScene, hue: YEL}, cta: {C: CTA, hue: PINK},
};
