import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, spring, random} from 'remotion';
import {FPS, INK, PINK, YEL, TEAL, ORG, CREAM, SKY, RED, clamp, ease, Slam, Pill, Huh, Arrow, Count, Marker, SwapCards, CTA, SceneMap} from '../../kit';
import timing from './timing.json';

export const title = 'only 10% of your brain?';
export const segs = timing;

const OUT = `0 8px 0 ${INK}`, BP = '#FF9EB8', FOLD = '#D9507A', STEM = '#F07FA0', PURPLE = '#9b5cff', INDIGO = '#5b6cff', LEAF = '#3BB273', WOOL = '#F4F1EA';
const GLOWS = [YEL, TEAL, ORG, SKY, '#B98CFF', LEAF, '#FF6F6F'];

/* ---------- brain illustration ---------- */

/** Lobes of a cartoon brain (side-ish view), relative to its centre. */
const BR: [number, number, number][] = [[-150, -30, 115], [-60, -105, 120], [70, -110, 118], [170, -30, 105], [140, 70, 95], [20, 80, 110], [-120, 75, 95]];
const FOLDS = [
  'M -235 -40 Q -200 -85 -160 -50 Q -120 -15 -85 -60',
  'M -135 -155 Q -95 -195 -55 -155 Q -15 -115 25 -165',
  'M 55 -195 Q 95 -150 140 -175',
  'M 120 -85 Q 160 -45 200 -75 Q 235 -95 255 -40',
  'M -205 60 Q -165 25 -125 70 Q -85 105 -45 60',
  'M 5 40 Q 45 0 85 40 Q 125 80 175 50',
  'M -65 -40 Q -25 -75 15 -30 Q 55 10 100 -25',
];

type Face = 'happy' | 'sleep' | 'shock' | 'bored' | 'chomp' | 'none';

/** Flat pink brain centred on (x, y). lit[i] = glow strength (0..1) of lobe i. */
const Brain: React.FC<{x: number; y: number; s?: number; face?: Face; lit?: number[]; dim?: number; id: string; mouth?: number; dead?: number}> = ({x, y, s = 1, face = 'happy', lit = [], id, mouth = 0, dead = -1}) => {
  const f = useCurrentFrame();
  const blink = f % 90 > 84;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs><clipPath id={id}>{BR.map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} />)}</clipPath></defs>
      <rect x={10} y={110} width={64} height={120} rx={26} fill={STEM} stroke={INK} strokeWidth={9} />
      {BR.map(([cx, cy, r], i) => <circle key={'o' + i} cx={cx} cy={cy} r={r + 11} fill={INK} />)}
      {BR.map(([cx, cy, r], i) => <circle key={'f' + i} cx={cx} cy={cy} r={r} fill={i === dead ? '#8C8296' : BP} />)}
      <g clipPath={`url(#${id})`}>
        {lit.map((v, i) => v > 0 ? <circle key={'g' + i} cx={BR[i][0]} cy={BR[i][1]} r={BR[i][2] * 1.05} fill={GLOWS[i % GLOWS.length]} opacity={v * (0.75 + 0.15 * Math.sin(f / 5 + i))} /> : null)}
      </g>
      {FOLDS.map((d, i) => <path key={'d' + i} d={d} fill="none" stroke={FOLD} strokeWidth={10} strokeLinecap="round" opacity={0.9} />)}
      {BR.slice(0, 3).map(([cx, cy, r], i) => <circle key={'h' + i} cx={cx - r * 0.35} cy={cy - r * 0.4} r={r * 0.18} fill="#fff" opacity={0.35} />)}
      {face !== 'none' && (
        <g transform="translate(0 30)">
          {face === 'sleep' ? (
            <g>{[-55, 55].map((ex) => <path key={ex} d={`M ${ex - 24} 0 Q ${ex} 22 ${ex + 24} 0`} fill="none" stroke={INK} strokeWidth={10} strokeLinecap="round" />)}</g>
          ) : (
            <g>
              {[-55, 55].map((ex) => <g key={ex}>
                <ellipse cx={ex} cy={0} rx={28} ry={blink && face !== 'shock' ? 4 : face === 'shock' ? 34 : 30} fill="#fff" stroke={INK} strokeWidth={8} />
                {!(blink && face !== 'shock') && <circle cx={ex + 4} cy={face === 'bored' ? 10 : 4} r={13} fill={INK} />}
                {face === 'bored' && <rect x={ex - 32} y={-34} width={64} height={30} fill={BP} stroke={INK} strokeWidth={7} />}
              </g>)}
            </g>
          )}
          {face === 'happy' && <path d="M -36 52 Q 0 88 36 52" fill="none" stroke={INK} strokeWidth={10} strokeLinecap="round" />}
          {face === 'sleep' && <path d="M -20 60 Q 0 72 20 60" fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" />}
          {face === 'bored' && <path d="M -26 64 L 26 64" stroke={INK} strokeWidth={10} strokeLinecap="round" />}
          {face === 'shock' && <ellipse cx={0} cy={68} rx={20} ry={26} fill={INK} />}
          {face === 'chomp' && <ellipse cx={0} cy={62} rx={34} ry={6 + 26 * mouth} fill={INK} />}
        </g>
      )}
    </g>
  );
};

const Star: React.FC<{x: number; y: number; s?: number; c?: string; rot?: number}> = ({x, y, s = 1, c = YEL, rot = 0}) => (
  <path transform={`translate(${x} ${y}) scale(${s}) rotate(${rot})`} d="M 0 -40 L 11 -11 L 40 0 L 11 11 L 0 40 L -11 11 L -40 0 L -11 -11 Z" fill={c} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
);

const Stamp: React.FC<{text: string; x: number; y: number; at: number; color?: string; size?: number; rot?: number}> = ({text, x, y, at, color = RED, size = 54, rot = -8}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const k = interpolate(f, [at, at + 6], [2.2, 1], {...clamp, easing: ease});
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${k}) rotate(${rot}deg)`, border: `8px solid ${color}`, color, fontFamily: 'B8', fontSize: size,
      padding: '4px 26px', borderRadius: 18, background: '#14142Bdd', whiteSpace: 'nowrap', opacity: interpolate(f, [at, at + 3], [0, 1], clamp)}}>{text}</div>
  );
};

/* ---------- scenes ---------- */

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const fade = interpolate(f, [150, 162], [1, 0.12], clamp);
  const fill = interpolate(f, [25, 65], [0, 0.1], {...clamp, easing: ease});
  const pow = interpolate(f, [95, 110], [0, 1], clamp);
  const bs = spring({frame: f, fps: FPS, config: {damping: 11}});
  return (
    <AbsoluteFill>
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0, opacity: fade}}>
        <g transform={`translate(470 760) scale(${bs}) translate(-470 -760)`}>
          <Brain id="bh" x={470} y={760} s={1.2} face={f > 95 ? 'shock' : 'happy'} lit={[fill * 10 * 0.9]} />
        </g>
        {pow > 0 && Array.from({length: 8}).map((_, i) => {
          const a = (i / 8) * Math.PI * 2 + f / 20;
          return <Star key={i} x={470 + Math.cos(a) * 400} y={740 + Math.sin(a) * 330} s={pow * (0.8 + 0.3 * Math.sin(f / 4 + i))} c={i % 2 ? YEL : PINK} rot={f * 3} />;
        })}
        <rect x={900} y={500} width={120} height={560} rx={24} fill="#ffffff18" stroke="#fff" strokeWidth={8} />
        <rect x={935} y={472} width={50} height={30} rx={8} fill="#fff" />
        <rect x={912} y={512 + 536 * (1 - fill)} width={96} height={536 * fill} rx={12} fill={YEL} />
      </svg>
      {f < 158 && <Slam words={['ONLY', '10%?']} at={6} y={150} size={140} />}
      {f >= 45 && f < 158 && <Pill text="10% used" x={900} y={1120} at={45} bg={YEL} color={INK} size={40} />}
      {f >= 95 && f < 158 && <Pill text="secret superpower? ✨" x={470} y={1300} at={95} bg={PINK} size={48} />}
      {f >= 158 && <SwapCards before="we only use 10% of our brain" after="100% a MYTH 🧠" label="sadly..." at={160} y={300} />}
      {f >= 200 && <Huh mood="shocked" x={540} y={990} h={350} at={200} />}
    </AbsoluteFill>
  );
};

const TIMES: [number, string][] = [[85, '7 AM ☕'], [115, '11 AM 📚'], [145, '3 PM ⚽'], [175, '9 PM 📺']];
const Scans: React.FC = () => {
  const f = useCurrentFrame();
  const sx = interpolate(f, [12, 75], [210, 870], {...clamp, easing: ease});
  const lit = BR.map((_, i) => interpolate(f, [88 + i * 14, 98 + i * 14], [0, 1], clamp));
  const nOn = lit.filter((v) => v > 0.5).length;
  const t = [...TIMES].reverse().find(([a]) => f >= a);
  const frame = spring({frame: f - 4, fps: FPS, config: {damping: 12}});
  return (
    <AbsoluteFill>
      <Slam words={['BRAIN', 'SCAN']} at={4} y={150} size={110} />
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        <Brain id="bs" x={540} y={770} s={1.25} face={f > 190 ? 'happy' : 'none'} lit={lit} />
        {/* viewfinder corners */}
        <g opacity={frame} stroke="#fff" strokeWidth={10} fill="none" strokeLinecap="round">
          {[[150, 420, 1, 1], [930, 420, -1, 1], [150, 1080, 1, -1], [930, 1080, -1, -1]].map(([x, y, dx, dy], i) => (
            <path key={i} d={`M ${x} ${y + dy * 70} L ${x} ${y} L ${x + dx * 70} ${y}`} />
          ))}
        </g>
        {f >= 12 && f < 80 && <g>
          <rect x={sx - 6} y={430} width={12} height={640} rx={6} fill={TEAL} style={{filter: `drop-shadow(0 0 20px ${TEAL})`}} />
        </g>}
        {/* 7 region dots */}
        {BR.map((_, i) => <circle key={i} cx={360 + i * 60} cy={1270} r={20} fill={lit[i] > 0.5 ? GLOWS[i] : 'transparent'} stroke="#fff" strokeWidth={5} />)}
      </svg>
      {f >= 20 && f < 85 && <Pill text="scanning… 🔍" x={540} y={1180} at={20} bg={TEAL} color={INK} size={46} />}
      {t && f < 200 && <Pill key={t[1]} text={t[1]} x={540} y={1180} at={t[0]} bg={CREAM} color={INK} size={52} />}
      {f >= 200 && <Pill text="lazy 90%? none ✗" x={540} y={1180} at={200} bg={RED} size={52} />}
      {f >= 88 && <div style={{position: 'absolute', left: 820, top: 1240, fontFamily: 'B8', fontSize: 52, color: '#fff', textShadow: OUT}}>{nOn}/7</div>}
    </AbsoluteFill>
  );
};

const Sleep: React.FC = () => {
  const f = useCurrentFrame();
  const pts: string[] = [];
  for (let x = 70; x <= 1010; x += 10) pts.push(`${x} ${(1075 + 48 * Math.sin((x / 230) * Math.PI * 2 - f * 0.09) + 10 * Math.sin(x / 31 + f * 0.3)).toFixed(1)}`);
  const strike = interpolate(f, [200, 212], [0, 1], {...clamp, easing: ease});
  const ms = spring({frame: f, fps: FPS, config: {damping: 12}});
  return (
    <AbsoluteFill>
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        <g transform={`translate(890 250) scale(${ms})`}>
          <circle r={90} fill={CREAM} stroke={INK} strokeWidth={9} />
          <circle cx={40} cy={-25} r={80} fill="#2B2F66" />
        </g>
        {Array.from({length: 9}).map((_, i) => <Star key={i} x={80 + random('sx' + i) * 650} y={160 + random('sy' + i) * 240} s={0.25 + 0.15 * Math.sin(f / 8 + i)} c="#fff" />)}
        <g transform={`translate(0 ${Math.sin(f / 18) * 10})`}>
          <Brain id="bz" x={520} y={590} s={0.95} face="sleep" lit={BR.map((_, i) => 0.35 + 0.35 * Math.sin(f / 9 + i * 1.3))} />
          {/* night cap */}
          <path d="M 330 430 Q 420 300 560 370 Q 470 330 300 300 Z" fill={INDIGO} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
          <circle cx={300} cy={300} r={26} fill="#fff" stroke={INK} strokeWidth={7} />
        </g>
        {[0, 1, 2].map((i) => {
          const p = ((f + i * 30) % 90) / 90;
          return <text key={i} x={760 + p * 120} y={520 - p * 200} fontFamily="B8" fontSize={60 + i * 14} fill="#fff" opacity={1 - p} stroke={INK} strokeWidth={4} paintOrder="stroke">z</text>;
        })}
        <path d={'M ' + pts.join(' L ')} fill="none" stroke={YEL} strokeWidth={9} strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      <Pill text="brain waves 〰️" x={200} y={980} at={40} bg="#ffffff33" size={36} />
      {f >= 100 && <Pill text="sorting memories 🗂️" x={300} y={880} at={100} bg={TEAL} color={INK} size={42} />}
      {f >= 140 && <Pill text="breathing 💨" x={810} y={880} at={140} bg={SKY} color={INK} size={42} />}
      {f >= 185 && <div style={{position: 'absolute', left: 120, top: 1220, transform: `scale(${spring({frame: f - 185, fps: FPS, config: {damping: 12}})})`}}>
        <div style={{position: 'relative', background: '#ffffff33', color: '#fff', fontFamily: 'B8', fontSize: 50, padding: '8px 30px', borderRadius: 999}}>
          OFF
          <div style={{position: 'absolute', left: 14, right: 14, top: '48%', height: 10, borderRadius: 5, background: RED, transformOrigin: 'left', transform: `scaleX(${strike}) rotate(-6deg)`}} />
        </div>
      </div>}
      {f >= 215 && <Pill text="SLEEP MODE 🌙" x={680} y={1262} at={215} bg={YEL} color={INK} size={56} />}
    </AbsoluteFill>
  );
};

const Donut: React.FC<{cx: number; cy: number; v: number; c: string}> = ({cx, cy, v, c}) => (
  <g>
    <circle cx={cx} cy={cy} r={180} fill="none" stroke={INK} strokeWidth={92} />
    <circle cx={cx} cy={cy} r={180} fill="none" stroke="#ffffff22" strokeWidth={72} />
    <circle cx={cx} cy={cy} r={180} fill="none" stroke={c} strokeWidth={72} pathLength={1} strokeDasharray={`${v} 1`} transform={`rotate(-90 ${cx} ${cy})`} />
  </g>
);

const Energy: React.FC = () => {
  const f = useCurrentFrame();
  const a = interpolate(f, [25, 60], [0, 0.02], {...clamp, easing: ease});
  const b = interpolate(f, [120, 165], [0, 0.2], {...clamp, easing: ease});
  const s1 = spring({frame: f - 5, fps: FPS, config: {damping: 12}});
  const s2 = spring({frame: f - 100, fps: FPS, config: {damping: 12}});
  const s3 = spring({frame: f - 120, fps: FPS, config: {damping: 11}});
  const chomp = Math.abs(Math.sin(f / 4));
  return (
    <AbsoluteFill>
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        <g transform={`translate(290 560) scale(${s1}) translate(-290 -560)`}><Donut cx={290} cy={560} v={a} c={TEAL} /></g>
        <g transform={`translate(790 560) scale(${s2}) translate(-790 -560)`}><Donut cx={790} cy={560} v={b} c={YEL} /></g>
        {f >= 120 && <g transform={`translate(540 1130) scale(${s3}) translate(-540 -1130)`}>
          <Brain id="be" x={460} y={1130} s={0.6} face="chomp" mouth={chomp} />
          {/* burger */}
          <g transform={`translate(760 ${1140 + Math.sin(f / 3) * 6})`}>
            <path d="M -90 -10 Q -90 -90 0 -90 Q 90 -90 90 -10 Z" fill={ORG} stroke={INK} strokeWidth={8} />
            <rect x={-100} y={-12} width={200} height={22} rx={8} fill={LEAF} stroke={INK} strokeWidth={7} />
            <rect x={-95} y={10} width={190} height={30} rx={10} fill="#7A4A2A" stroke={INK} strokeWidth={7} />
            <path d="M -90 40 L 90 40 Q 90 80 0 80 Q -90 80 -90 40 Z" fill={ORG} stroke={INK} strokeWidth={8} />
            {[-40, 0, 40].map((x) => <ellipse key={x} cx={x} cy={-60} rx={8} ry={4} fill={CREAM} />)}
          </g>
        </g>}
      </svg>
      <div style={{position: 'absolute', left: 90, width: 400, top: 495, textAlign: 'center', fontFamily: 'B8', fontSize: 120, color: TEAL, textShadow: OUT, transform: `scale(${s1})`}}>
        <Count to={2} at={25} len={35} suffix="%" />
      </div>
      <div style={{position: 'absolute', left: 590, width: 400, top: 495, textAlign: 'center', fontFamily: 'B8', fontSize: 120, color: YEL, textShadow: OUT, transform: `scale(${s2})`}}>
        <Count to={20} at={120} len={45} suffix="%" />
      </div>
      <Pill text="body weight ⚖️" x={290} y={830} at={20} bg={TEAL} color={INK} size={44} />
      {f >= 100 && <Pill text="energy ⚡" x={790} y={830} at={105} bg={YEL} color={INK} size={44} />}
      <Slam words={['TINY', 'BUT', 'HUNGRY']} at={4} y={150} size={96} gap={7} />
      {f >= 205 && <Pill text="nom nom 🍔" x={540} y={1330} at={205} bg={PINK} size={44} />}
    </AbsoluteFill>
  );
};

const FOOD = ['🍎', '🍞', '🍌', '🥕', '🧀'];
const Waste: React.FC = () => {
  const f = useCurrentFrame();
  const x = interpolate(f, [140, 150], [0, 1], {...clamp, easing: ease});
  const cs = spring({frame: f - 45, fps: FPS, config: {damping: 12}});
  return (
    <AbsoluteFill>
      <Slam words={['EVOLUTION', 'HATES', 'WASTE']} at={4} y={140} size={100} gap={7} />
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        <g transform={`translate(560 1000) scale(${cs}) translate(-560 -1000)`}>
          {/* couch */}
          <rect x={250} y={800} width={620} height={170} rx={40} fill={TEAL} stroke={INK} strokeWidth={10} />
          <rect x={210} y={900} width={700} height={130} rx={30} fill="#23A99C" stroke={INK} strokeWidth={10} />
          <rect x={180} y={860} width={90} height={190} rx={30} fill={TEAL} stroke={INK} strokeWidth={10} />
          <rect x={850} y={860} width={90} height={190} rx={30} fill={TEAL} stroke={INK} strokeWidth={10} />
          <rect x={240} y={1040} width={30} height={40} fill={INK} /><rect x={850} y={1040} width={30} height={40} fill={INK} />
          <Brain id="bw" x={560} y={790} s={0.62} face="bored" />
          {/* remote */}
          <rect x={700} y={880} width={90} height={34} rx={10} fill="#333" stroke={INK} strokeWidth={6} transform="rotate(-12 745 897)" />
        </g>
        {f >= 60 && FOOD.map((e, i) => {
          const p = (((f - 60 - i * 11) % 55) + 55) % 55 / 55;
          if (f - 60 - i * 11 < 0) return null;
          const fx = 60 + p * 470, fy = 620 - Math.sin(p * Math.PI) * 180 + p * 160;
          return <text key={i} x={fx} y={fy} fontSize={80} textAnchor="middle" opacity={p < 0.9 ? 1 : (1 - p) * 10}>{e}</text>;
        })}
        {x > 0 && <g opacity={x} stroke={RED} strokeWidth={30} strokeLinecap="round">
          <path d={`M 230 ${640} L ${230 + 650 * x} ${640 + 480 * x}`} />
          <path d={`M 880 ${640} L ${880 - 650 * x} ${640 + 480 * x}`} />
        </g>}
      </svg>
      {f >= 70 && <Pill text="90% doing nothing? 😴" x={560} y={480} at={70} bg={CREAM} color={INK} size={46} />}
      {f >= 150 && <Pill text="would never happen ✗" x={480} y={1290} at={150} bg={RED} size={48} />}
      <Huh mood="thinking" x={930} y={1110} h={270} at={30} flip />
    </AbsoluteFill>
  );
};

const PARTS: {t: string; x: number; y: number; lx: number; ly: number}[] = [
  {t: 'speech 🗣️', x: 210, y: 400, lx: 345, ly: 600},
  {t: 'movement 🏃', x: 820, y: 400, lx: 640, ly: 520},
  {t: 'vision 👁️', x: 860, y: 960, lx: 745, ly: 760},
  {t: 'memory 💭', x: 220, y: 960, lx: 420, ly: 790},
];
const Damage: React.FC = () => {
  const f = useCurrentFrame();
  const hit = 85;
  const age = f - hit;
  const shake = age > 0 && age < 20 ? Math.sin(f * 2.5) * 10 : 0;
  const spare = interpolate(f, [175, 215], [0, 1], {...clamp, easing: ease});
  return (
    <AbsoluteFill>
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        <g transform={`translate(${shake} 0)`}>
          <Brain id="bd" x={540} y={680} s={1.05} face={f > hit ? 'shock' : 'happy'} />
          {PARTS.map((p, i) => {
            const pr = interpolate(f, [20 + i * 10, 40 + i * 10], [0, 1], clamp);
            return <Arrow key={i} d={`M ${p.x} ${p.y + (p.y < 600 ? 40 : -40)} L ${p.lx} ${p.ly}`} color="#ffffffaa" w={7} progress={pr} />;
          })}
          {f >= hit && <g>
            <circle cx={345} cy={600} r={30 + 6 * Math.sin(f / 3)} fill={RED} stroke={INK} strokeWidth={7} />
            <circle cx={345} cy={600} r={interpolate(age, [0, 25], [30, 140], clamp)} fill="none" stroke={RED} strokeWidth={8} opacity={interpolate(age, [0, 25], [1, 0], clamp)} />
          </g>}
        </g>
        {spare > 0 && <g>
          <rect x={300} y={1100} width={480} height={240} rx={30} fill="#ffffff10" stroke="#fff" strokeWidth={6} strokeDasharray="22 16" opacity={spare} />
          <g opacity={spare * 0.8}>
            {BR.map(([cx, cy, r], i) => <circle key={i} cx={540 + cx * 0.32} cy={1215 + cy * 0.32} r={r * 0.32} fill="none" stroke="#ffffff88" strokeWidth={4} strokeDasharray="10 8" />)}
          </g>
          <text x={540} y={1248} textAnchor="middle" fontFamily="B8" fontSize={90} fill={YEL} opacity={spare} stroke={INK} strokeWidth={6} paintOrder="stroke">?</text>
        </g>}
      </svg>
      {PARTS.map((p, i) => {
        const hurt = i === 0 && f >= hit + 6;
        return <div key={i} style={{position: 'absolute', left: 0, top: 0, transform: hurt ? `translate(${Math.sin(f * 1.7) * 5}px,0)` : undefined, opacity: hurt ? 0.9 : 1}}>
          <Pill text={hurt ? 'speech ⚠️' : p.t} x={p.x} y={p.y} at={15 + i * 10} bg={hurt ? '#777' : [PINK, ORG, SKY, TEAL][i]} color={hurt ? '#fff' : INK} size={42} />
        </div>;
      })}
      {f >= hit + 4 && <Pill text="small spot, big problem" x={540} y={180} at={hit + 4} bg={RED} size={46} />}
      {f >= 190 && <Pill text="spare brain: none ✗" x={540} y={1100} at={190} bg={YEL} color={INK} size={44} />}
    </AbsoluteFill>
  );
};

const Sheep: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[-80, -30, 30, 80].map((lx) => <rect key={lx} x={lx - 12} y={60} width={24} height={110} rx={10} fill="#3A3A4A" stroke={INK} strokeWidth={6} />)}
      {[[-110, 0, 70], [-50, -50, 75], [30, -55, 75], [100, -5, 70], [40, 45, 70], [-50, 45, 70]].map(([cx, cy, r], i) => <circle key={'o' + i} cx={cx} cy={cy} r={r + 9} fill={INK} />)}
      {[[-110, 0, 70], [-50, -50, 75], [30, -55, 75], [100, -5, 70], [40, 45, 70], [-50, 45, 70]].map(([cx, cy, r], i) => <circle key={'f' + i} cx={cx} cy={cy} r={r} fill={WOOL} />)}
      <g transform={`translate(-170 -40) rotate(${Math.sin(f / 10) * 5})`}>
        <ellipse cx={-30} cy={-10} rx={38} ry={16} fill="#3A3A4A" stroke={INK} strokeWidth={6} transform="rotate(-25 -30 -10)" />
        <ellipse cx={0} cy={20} rx={56} ry={70} fill="#3A3A4A" stroke={INK} strokeWidth={8} />
        <circle cx={0} cy={-40} r={34} fill={WOOL} stroke={INK} strokeWidth={6} />
        <circle cx={-20} cy={15} r={10} fill="#fff" /><circle cx={20} cy={15} r={10} fill="#fff" />
        <circle cx={-18} cy={17} r={5} fill={INK} /><circle cx={22} cy={17} r={5} fill={INK} />
        <path d="M -14 62 Q 0 72 14 62" fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" />
      </g>
    </g>
  );
};

const SheepScene: React.FC = () => {
  const f = useCurrentFrame();
  const k = interpolate(f, [45, 105], [0, 1], {...clamp, easing: ease});
  const bs = 1.15 + (0.36 - 1.15) * k;
  const bx = 540 + (300 - 540) * k, by = 700 + (960 - 700) * k;
  const sh = spring({frame: f - 160, fps: FPS, config: {damping: 11}});
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 150, width: '100%', textAlign: 'center', fontFamily: 'B8', fontSize: 150, color: YEL, textShadow: OUT, lineHeight: 1}}>
        <Count from={1400} to={140} at={45} len={60} suffix=" g" />
      </div>
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        {/* the lost 90% flying away as ghost pieces */}
        {k > 0 && k < 1 && Array.from({length: 10}).map((_, i) => {
          const a = random('a' + i) * Math.PI * 2;
          return <circle key={i} cx={540 + Math.cos(a) * 500 * k} cy={700 + Math.sin(a) * 420 * k} r={40 * (1 - k) + 10} fill={BP} stroke={INK} strokeWidth={5} opacity={1 - k} />;
        })}
        <Brain id="bsh" x={bx} y={by} s={bs} face={k > 0.5 ? 'shock' : 'happy'} />
        {f >= 160 && <g transform={`translate(830 ${960 + (1 - sh) * 400})`}><Sheep x={0} y={0} s={1.0} /></g>}
        {f >= 160 && <text x={490} y={990} textAnchor="middle" fontFamily="B8" fontSize={110} fill="#fff" stroke={INK} strokeWidth={6} paintOrder="stroke" opacity={sh}>≈</text>}
      </svg>
      {f < 45 && <Pill text="adult brain ≈ 1.4 kg" x={540} y={1260} at={5} bg={CREAM} color={INK} size={46} />}
      {f >= 105 && <Pill text="only 10% left" x={300} y={1180} at={105} bg={PINK} size={42} />}
      {f >= 168 && <Pill text="a sheep's brain 🐑" x={790} y={1240} at={168} bg={CREAM} color={INK} size={44} />}
      <Huh mood="laughing" x={930} y={340} h={230} at={170} />
    </AbsoluteFill>
  );
};

const Origin: React.FC = () => {
  const f = useCurrentFrame();
  const drop = spring({frame: f - 40, fps: FPS, config: {damping: 10}});
  const open = interpolate(f, [108, 124], [0, 1], {...clamp, easing: ease});
  return (
    <AbsoluteFill>
      <Slam words={['WHO', 'SAID', 'IT?']} at={4} y={150} size={110} gap={7} />
      {f >= 40 && <div style={{position: 'absolute', left: 540, top: 720, transform: `translate(-50%,-50%) translateY(${(1 - drop) * -700}px) rotate(${(1 - drop) * 20 - 3}deg)`}}>
        {open < 1 ? (
          <div style={{width: 440, height: 600, background: ORG, border: `10px solid ${INK}`, borderRadius: 22, boxShadow: OUT, position: 'relative', transform: `scaleX(${1 - open})`}}>
            <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 46, background: '#D96A22', borderRight: `6px solid ${INK}`}} />
            <div style={{marginTop: 110, marginLeft: 46, textAlign: 'center', fontFamily: 'B8', fontSize: 64, color: CREAM, lineHeight: 1.05, textShadow: `0 5px 0 ${INK}`}}>SELF<br />HELP<br />📘</div>
            <div style={{position: 'absolute', bottom: 60, left: 46, right: 0, textAlign: 'center'}}>
              <span style={{background: YEL, color: INK, fontFamily: 'B8', fontSize: 58, padding: '4px 24px', borderRadius: 14, border: `5px solid ${INK}`}}>1936</span>
            </div>
          </div>
        ) : (
          <div style={{display: 'flex', transform: `scale(${spring({frame: f - 124, fps: FPS, config: {damping: 12}})})`}}>
            {[0, 1].map((pg) => (
              <div key={pg} style={{width: 400, height: 560, background: CREAM, border: `9px solid ${INK}`, borderRadius: pg ? '0 20px 20px 0' : '20px 0 0 20px', padding: '50px 36px', boxSizing: 'border-box'}}>
                {Array.from({length: 7}).map((_, i) => (pg === 1 && i === 3) ? (
                  <div key={i} style={{fontFamily: 'B8', fontSize: 50, color: INK, margin: '14px 0', lineHeight: 1}}><Marker at={178} color={YEL}>“only 10%…”</Marker></div>
                ) : <div key={i} style={{height: 16, borderRadius: 8, background: '#C9BFA6', margin: '26px 0', width: `${70 + random('l' + pg + i) * 30}%`}} />)}
              </div>
            ))}
          </div>
        )}
      </div>}
      {f >= 130 && <Pill text="“William James said…”" x={540} y={1130} at={130} bg={TEAL} color={INK} size={50} />}
      {f >= 175 && <Pill text="we develop only 10%?! 🤯" x={540} y={1260} at={175} bg={PINK} size={50} />}
    </AbsoluteFill>
  );
};

const Card: React.FC<{text: string; y: number; at: number}> = ({text, y, at}) => {
  const f = useCurrentFrame();
  const s = spring({frame: f - at, fps: FPS, config: {damping: 12}});
  const out = interpolate(f, [130, 141], [0, 1], {...clamp, easing: ease});
  return <div style={{position: 'absolute', left: 120, width: 840, top: y, transform: `scale(${s}) translateX(${out * (y < 500 ? -1200 : 1200)}px)`, background: '#ffffff1c', border: '6px solid #fff', borderRadius: 34, padding: '40px 30px', boxSizing: 'border-box',
    fontFamily: 'B8', fontSize: 64, color: '#fff', textAlign: 'center', textShadow: OUT}}>{text}</div>;
};

const Einstein: React.FC = () => {
  const f = useCurrentFrame();
  const on = f >= 140;
  const lit = BR.map((_, i) => interpolate(f, [145 + i * 4, 153 + i * 4], [0, 1], clamp));
  const bs = spring({frame: f - 138, fps: FPS, config: {damping: 11}});
  return (
    <AbsoluteFill>
      {f < 142 && <>
        <Card text="James: “10%”" y={260} at={4} />
        <Card text="Einstein: “10%”" y={640} at={50} />
        {f < 132 && <Stamp text="NO NUMBER ✗" x={680} y={470} at={28} />}
        {f < 132 && <Stamp text="NEVER FOUND 🔍" x={640} y={860} at={95} rot={6} />}
      </>}
      {on && <>
        <Slam words={['100%', 'ON']} at={142} y={150} size={140} />
        <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
          <g transform={`translate(500 760) scale(${bs}) translate(-500 -760)`}>
            <Brain id="bf" x={500} y={760} s={1.1} face="happy" lit={lit} />
          </g>
          {Array.from({length: 10}).map((_, i) => {
            const a = (i / 10) * Math.PI * 2 + f / 30;
            return <Star key={i} x={500 + Math.cos(a) * 390} y={740 + Math.sin(a) * 320} s={bs * 0.55} c={GLOWS[i % 7]} rot={f * 2} />;
          })}
        </svg>
        <Pill text="all day, every day ☀️🌙" x={480} y={1260} at={175} bg={YEL} color={INK} size={48} />
        <Huh mood="explaining" x={940} y={1050} h={260} at={160} flip />
      </>}
    </AbsoluteFill>
  );
};

export const scenes: SceneMap = {
  hook: {C: Hook, hue: PURPLE}, scans: {C: Scans, hue: TEAL}, sleep: {C: Sleep, hue: INDIGO}, energy: {C: Energy, hue: ORG},
  waste: {C: Waste, hue: LEAF}, damage: {C: Damage, hue: RED}, sheep: {C: SheepScene, hue: YEL}, origin: {C: Origin, hue: PINK},
  einstein: {C: Einstein, hue: SKY}, cta: {C: CTA, hue: PINK},
};
