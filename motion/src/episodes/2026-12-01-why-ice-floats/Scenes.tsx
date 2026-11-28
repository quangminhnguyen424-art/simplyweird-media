import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, spring, random} from 'remotion';
import {FPS, INK, PINK, YEL, TEAL, ORG, SKY, RED, clamp, ease, Slam, Pill, Huh, Arrow, Count, CTA, SceneMap} from '../../kit';
import timing from './timing.json';

export const title = 'why does ice float? (explained simply)';
export const segs = timing;

const OUT = `0 8px 0 ${INK}`;
const WATER = '#4FA8FF', DEEP = '#2160C4', ICE = '#E4F6FF', ICE2 = '#B9E6FF', WAX = '#F4D58D', OX = '#FF4D5E';

const Big: React.FC<{children: React.ReactNode; y?: number; size?: number; color?: string; at?: number}> = ({children, y = 140, size = 110, color = YEL, at = 0}) => {
  const f = useCurrentFrame();
  const s = spring({frame: f - at, fps: FPS, config: {damping: 10}});
  return <div style={{position: 'absolute', top: y, width: '100%', textAlign: 'center', fontFamily: 'B8', fontSize: size, color, textShadow: OUT, transform: `scale(${s})`, lineHeight: 1.05}}>{children}</div>;
};

/** One water molecule (red O, two white H). Draw inside <svg>. */
const H2O: React.FC<{x: number; y: number; s?: number; rot?: number; face?: boolean}> = ({x, y, s = 1, rot = 0, face}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    {[-52, 52].map((a) => {
      const r = (a * Math.PI) / 180;
      return <g key={a}>
        <line x1={0} y1={0} x2={Math.sin(r) * 46} y2={Math.cos(r) * 46} stroke={INK} strokeWidth={10} />
        <circle cx={Math.sin(r) * 46} cy={Math.cos(r) * 46} r={21} fill="#fff" stroke={INK} strokeWidth={7} />
      </g>;
    })}
    <circle r={34} fill={OX} stroke={INK} strokeWidth={8} />
    <ellipse cx={-11} cy={-13} rx={9} ry={6} fill="#fff" opacity={0.55} />
    {face && <><circle cx={-11} cy={2} r={5} fill={INK} /><circle cx={11} cy={2} r={5} fill={INK} /><path d="M -8 14 Q 0 20 8 14" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" /></>}
  </g>
);

/** Ice cube, size w. Draw inside <svg>, centred. */
const Cube: React.FC<{x: number; y: number; w?: number; rot?: number; face?: boolean}> = ({x, y, w = 160, rot = 0, face}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <rect x={-w / 2} y={-w / 2} width={w} height={w} rx={w * 0.16} fill={ICE} stroke={INK} strokeWidth={9} />
    <rect x={-w / 2 + 14} y={-w / 2 + 14} width={w * 0.3} height={w * 0.14} rx={8} fill="#fff" />
    <path d={`M ${w * 0.18} ${-w * 0.3} L ${w * 0.3} ${-w * 0.18}`} stroke={ICE2} strokeWidth={8} strokeLinecap="round" />
    {face && <><circle cx={-w * 0.15} cy={w * 0.05} r={w * 0.05} fill={INK} /><circle cx={w * 0.15} cy={w * 0.05} r={w * 0.05} fill={INK} /><path d={`M ${-w * 0.1} ${w * 0.2} Q 0 ${w * 0.28} ${w * 0.1} ${w * 0.2}`} stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" /></>}
  </g>
);

/** Glass/tank with liquid. x,y = top-left. */
const Tank: React.FC<{x: number; y: number; w: number; h: number; level: number; color: string; children?: React.ReactNode}> = ({x, y, w, h, level, color, children}) => {
  const f = useCurrentFrame();
  const top = y + h * (1 - level);
  return (
    <g>
      <path d={`M ${x} ${top} Q ${x + w / 4} ${top - 10 * Math.sin(f / 9)} ${x + w / 2} ${top} T ${x + w} ${top} L ${x + w} ${y + h - 30} Q ${x + w} ${y + h} ${x + w - 30} ${y + h} L ${x + 30} ${y + h} Q ${x} ${y + h} ${x} ${y + h - 30} Z`} fill={color} />
      {children}
      <path d={`M ${x} ${y} L ${x} ${y + h - 30} Q ${x} ${y + h} ${x + 30} ${y + h} L ${x + w - 30} ${y + h} Q ${x + w} ${y + h} ${x + w} ${y + h - 30} L ${x + w} ${y}`} fill="none" stroke={INK} strokeWidth={12} strokeLinejoin="round" strokeLinecap="round" />
      <rect x={x + 22} y={y + 30} width={16} height={h - 90} rx={8} fill="#fff" opacity={0.3} />
    </g>
  );
};

/* ---------- scenes ---------- */

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f - 2, fps: FPS, config: {damping: 12}});
  const sink = interpolate(f, [150, 220], [0, 1], {...clamp, easing: ease});
  const iceIn = interpolate(f, [250, 300], [0, 1], {...clamp, easing: ease});
  const bob = Math.sin(f / 10) * 8;
  return (
    <AbsoluteFill>
      {f < 255
        ? <div style={{position: 'absolute', top: 150, width: '100%', textAlign: 'center', fontFamily: 'B8', fontSize: 74, color: '#fff', textShadow: OUT, lineHeight: 1.1}}>solids <span style={{color: YEL}}>sink</span> in<br />their own liquid...</div>
        : <Slam words={['ICE', 'FLOATS?!']} at={290} y={130} size={130} gap={7} />}
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        <g transform={`translate(540 860) scale(${a}) translate(-540 -860)`}>
          <Tank x={110} y={560} w={380} h={560} level={0.78} color={WAX}>
            <rect x={230} y={interpolate(sink, [0, 1], [420, 950])} width={140} height={110} rx={16} fill="#E8B84B" stroke={INK} strokeWidth={9} opacity={interpolate(f, [100, 130], [0, 1], clamp)} />
          </Tank>
          <Tank x={590} y={560} w={380} h={560} level={0.78} color={WATER}>
            <g opacity={iceIn}><Cube x={780} y={interpolate(iceIn, [0, 1], [380, 700]) + bob} w={150} rot={bob} face={f > 300} /></g>
          </Tank>
        </g>
      </svg>
      <Pill text="melted wax 🕯️" x={300} y={1180} at={40} bg={WAX} color={INK} size={44} />
      <Pill text="water 💧" x={780} y={1180} at={240} bg={WATER} color={INK} size={44} />
      {f > 150 && f < 255 && <Pill text="sinks ⬇️" x={300} y={500} at={160} bg={RED} size={46} />}
      <Huh mood="shocked" x={540} y={1290} h={230} at={300} />
    </AbsoluteFill>
  );
};

const Rule: React.FC = () => {
  const f = useCurrentFrame();
  const squeeze = interpolate(f, [30, 150], [1, 0.55], {...clamp, easing: ease});
  const temp = interpolate(f, [30, 150], [1, 0.15], {...clamp, easing: ease});
  const drop = interpolate(f, [170, 240], [0, 1], {...clamp, easing: ease});
  return (
    <AbsoluteFill>
      <Big y={130} size={96} at={0}>colder = <span style={{color: SKY}}>tighter</span></Big>
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        {/* thermometer */}
        <g transform="translate(150 520)">
          <rect x={-30} y={0} width={60} height={460} rx={30} fill="#fff" stroke={INK} strokeWidth={9} />
          <rect x={-14} y={20 + 400 * (1 - temp)} width={28} height={400 * temp + 20} rx={14} fill={temp > 0.5 ? RED : SKY} />
          <circle cx={0} cy={490} r={50} fill={temp > 0.5 ? RED : SKY} stroke={INK} strokeWidth={9} />
        </g>
        {/* molecule crowd squeezing */}
        <g transform={`translate(620 ${760 + drop * 280})`}>
          <rect x={-260 * squeeze - 30} y={-260 * squeeze - 30} width={520 * squeeze + 60} height={520 * squeeze + 60} rx={30} fill="#ffffff22" stroke="#fff" strokeWidth={6} strokeDasharray="22 16" />
          {Array.from({length: 16}).map((_, i) => {
            const gx = (i % 4) - 1.5, gy = Math.floor(i / 4) - 1.5;
            const j = (1 - squeeze) < 0.4 ? Math.sin(f / 4 + i) * 8 * squeeze : 0;
            return <H2O key={i} x={gx * 150 * squeeze + j} y={gy * 150 * squeeze + j} s={0.7} rot={i * 47} />;
          })}
        </g>
        {drop > 0 && <Arrow d="M 960 760 L 960 1180" progress={drop} color={YEL} />}
      </svg>
      <Pill text="packed tight = heavier" x={620} y={430} at={120} bg={PINK} size={44} />
      <Pill text="solid should sink" x={620} y={1330} at={180} bg={RED} size={44} />
      <Huh mood="thinking" x={150} y={1200} h={220} at={230} />
    </AbsoluteFill>
  );
};

const Bonds: React.FC = () => {
  const f = useCurrentFrame();
  const g = spring({frame: f - 2, fps: FPS, config: {damping: 11}});
  const n = interpolate(f, [150, 200], [0, 1], {...clamp, easing: ease});
  const dash = interpolate(f, [190, 250], [0, 1], clamp);
  const ring: [number, number, number][] = [[-300, -40, 30], [300, -40, -30], [0, 260, 180]];
  return (
    <AbsoluteFill>
      <Big y={130} size={110} at={0}>H<span style={{fontSize: 70}}>₂</span>O</Big>
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        <g transform="translate(540 760)">
          {ring.map(([x, y], i) => <line key={'b' + i} x1={0} y1={0} x2={x * n} y2={y * n} stroke={YEL} strokeWidth={10} strokeDasharray="18 18" strokeDashoffset={-f * 2} opacity={dash} />)}
          {ring.map(([x, y, r], i) => <g key={i} opacity={n}><H2O x={x * n} y={y * n} s={0.95} rot={r + Math.sin(f / 12 + i) * 6} /></g>)}
          <g transform={`scale(${g * 2})`}><H2O x={0} y={0} face /></g>
        </g>
      </svg>
      <Pill text="1 oxygen 🔴" x={330} y={560} at={45} bg={OX} size={42} />
      <Pill text="2 hydrogen ⚪" x={760} y={560} at={75} bg="#fff" color={INK} size={42} />
      <Pill text="hydrogen bonds 🔗" x={540} y={1250} at={200} bg={YEL} color={INK} size={50} />
    </AbsoluteFill>
  );
};

const Dance: React.FC = () => {
  const f = useCurrentFrame();
  const g = spring({frame: f, fps: FPS, config: {damping: 13}});
  return (
    <AbsoluteFill>
      <Big y={130} size={92} at={0}>liquid water =</Big>
      <Big y={240} size={92} color={PINK} at={70}>a dance floor 🕺</Big>
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        <g transform={`translate(540 860) scale(${g}) translate(-540 -860)`}>
          <rect x={120} y={450} width={840} height={820} rx={40} fill={DEEP} stroke={INK} strokeWidth={12} />
          {Array.from({length: 22}).map((_, i) => {
            const bx = 220 + (i % 5) * 160 + (Math.floor(i / 5) % 2) * 60;
            const by = 540 + Math.floor(i / 5) * 165;
            const x = bx + Math.sin(f / (5 + random('x' + i) * 4) + i) * 32;
            const y = by + Math.cos(f / (6 + random('y' + i) * 4) + i * 2) * 28;
            return <H2O key={i} x={x} y={y} s={0.68} rot={f * (random('r' + i) * 6 - 3) + i * 40} />;
          })}
          {/* flickering bonds */}
          {Array.from({length: 10}).map((_, i) => {
            const on = Math.sin(f / 4 + i * 1.7) > 0.3;
            const x = 240 + (i % 5) * 160, y = 620 + Math.floor(i / 5) * 330;
            return on ? <line key={'l' + i} x1={x} y1={y} x2={x + 120} y2={y + 60} stroke={YEL} strokeWidth={8} strokeDasharray="12 12" /> : null;
          })}
        </g>
      </svg>
      <Pill text="bonds snap & re-form ⚡" x={540} y={1330} at={20} bg={YEL} color={INK} size={46} />
      <Huh mood="laughing" x={900} y={1160} h={230} at={110} />
    </AbsoluteFill>
  );
};

/* honeycomb vertices around the centre */
const HEX: [number, number][] = (() => {
  const R = 105, pts: [number, number][] = [];
  const centres: [number, number][] = [];
  for (let r = -2; r <= 2; r++) for (let c = -2; c <= 2; c++) {
    const cx = c * R * Math.sqrt(3) + (r % 2 ? (R * Math.sqrt(3)) / 2 : 0), cy = r * R * 1.5;
    if (Math.hypot(cx, cy) < 330) centres.push([cx, cy]);
  }
  centres.forEach(([cx, cy]) => {
    for (let k = 0; k < 6; k++) {
      const a = (Math.PI / 3) * k + Math.PI / 6;
      const p: [number, number] = [Math.round(cx + R * Math.cos(a)), Math.round(cy + R * Math.sin(a))];
      if (!pts.some((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) < 10)) pts.push(p);
    }
  });
  return pts;
})();
const CENTRES: [number, number][] = (() => {
  const R = 105, out: [number, number][] = [];
  for (let r = -2; r <= 2; r++) for (let c = -2; c <= 2; c++) {
    const cx = c * R * Math.sqrt(3) + (r % 2 ? (R * Math.sqrt(3)) / 2 : 0), cy = r * R * 1.5;
    if (Math.hypot(cx, cy) < 330) out.push([cx, cy]);
  }
  return out;
})();

const Snowflake: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) rotate(${f * 0.6})`}>
      {Array.from({length: 6}).map((_, i) => (
        <g key={i} transform={`rotate(${i * 60})`}>
          <line x1={0} y1={0} x2={0} y2={-120} stroke={INK} strokeWidth={22} strokeLinecap="round" />
          <line x1={0} y1={-70} x2={-34} y2={-100} stroke={INK} strokeWidth={18} strokeLinecap="round" />
          <line x1={0} y1={-70} x2={34} y2={-100} stroke={INK} strokeWidth={18} strokeLinecap="round" />
          <line x1={0} y1={0} x2={0} y2={-120} stroke="#fff" strokeWidth={10} strokeLinecap="round" />
          <line x1={0} y1={-70} x2={-34} y2={-100} stroke="#fff" strokeWidth={8} strokeLinecap="round" />
          <line x1={0} y1={-70} x2={34} y2={-100} stroke="#fff" strokeWidth={8} strokeLinecap="round" />
        </g>
      ))}
      <circle r={20} fill={ICE2} stroke={INK} strokeWidth={7} />
    </g>
  );
};

const Hexagon: React.FC = () => {
  const f = useCurrentFrame();
  const lock = interpolate(f, [20, 120], [0, 1], {...clamp, easing: ease});
  const holes = interpolate(f, [120, 160], [0, 1], clamp);
  const flake = spring({frame: f - 225, fps: FPS, config: {damping: 10}});
  const shrink = interpolate(f, [215, 260], [1, 0.62], {...clamp, easing: ease});
  return (
    <AbsoluteFill>
      {f < 220 ? <Big y={130} size={82} at={0}>freezing ❄️ = <span style={{color: ICE2}}>hexagons</span></Big>
        : <Big y={130} size={100} at={220} color="#fff">6 sides ❄️</Big>}
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        <g transform={`translate(${540 - 220 * (1 - shrink) / 0.38} ${780 - 120 * (1 - shrink) / 0.38}) scale(${shrink})`}>
          {CENTRES.map(([x, y], i) => (
            <g key={'h' + i} opacity={holes}>
              <polygon points={Array.from({length: 6}).map((_, k) => { const a = (Math.PI / 3) * k + Math.PI / 6; return `${x + 105 * Math.cos(a)},${y + 105 * Math.sin(a)}`; }).join(' ')} fill="#ffffff18" stroke={YEL} strokeWidth={8} strokeDasharray="14 12" />
              <text x={x} y={y + 14} textAnchor="middle" fontFamily="B8" fontSize={34} fill="#ffffffcc">{f > 150 ? 'empty' : ''}</text>
            </g>
          ))}
          {HEX.map(([x, y], i) => {
            const sx = (random('sx' + i) - 0.5) * 900, sy = (random('sy' + i) - 0.5) * 900;
            const j = (1 - lock) * Math.sin(f / 5 + i) * 30;
            return <H2O key={i} x={interpolate(lock, [0, 1], [sx, x]) + j} y={interpolate(lock, [0, 1], [sy, y]) + j} s={0.5} rot={interpolate(lock, [0, 1], [i * 70, (i % 2) * 180])} />;
          })}
        </g>
        {f > 215 && <Snowflake x={760} y={1060} s={flake * 1.6} />}
      </svg>
      <Pill text="space in every ring 🕳️" x={540} y={1330} at={150} bg={PINK} size={46} />
    </AbsoluteFill>
  );
};

const Floats: React.FC = () => {
  const f = useCurrentFrame();
  const rise = interpolate(f, [150, 230], [0, 1], {...clamp, easing: ease});
  const bob = rise > 0.95 ? Math.sin(f / 10) * 8 : 0;
  return (
    <AbsoluteFill>
      <Big y={120} size={150} at={10}><Count to={9} at={10} len={40} suffix="%" /></Big>
      <div style={{position: 'absolute', top: 290, width: '100%', textAlign: 'center', fontFamily: 'B8', fontSize: 62, color: '#fff', textShadow: OUT}}>less dense than water</div>
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        {/* same-size blocks on a scale */}
        <g opacity={interpolate(f, [130, 160], [1, 0], clamp)}>
          <line x1={240} y1={700} x2={840} y2={700 + interpolate(f, [40, 90], [0, -70], {...clamp, easing: ease}) * -1} stroke={INK} strokeWidth={16} strokeLinecap="round" />
          <polygon points="540,700 500,800 580,800" fill={ORG} stroke={INK} strokeWidth={8} />
          <rect x={170} y={interpolate(f, [40, 90], [560, 630], {...clamp, easing: ease})} width={150} height={130} rx={18} fill={WATER} stroke={INK} strokeWidth={9} />
          <Cube x={835} y={interpolate(f, [40, 90], [625, 555], {...clamp, easing: ease})} w={135} />
          <text x={245} y={860} textAnchor="middle" fontFamily="B8" fontSize={40} fill="#fff">water</text>
          <text x={835} y={860} textAnchor="middle" fontFamily="B8" fontSize={40} fill="#fff">ice</text>
        </g>
        <g opacity={interpolate(f, [140, 170], [0, 1], clamp)}>
          <Tank x={240} y={560} w={600} h={640} level={0.7} color={WATER}>
            <Cube x={540} y={interpolate(rise, [0, 1], [1080, 760]) + bob} w={190} rot={bob} face />
          </Tank>
        </g>
      </svg>
      <Pill text="lighter for its size" x={540} y={470} at={60} bg={TEAL} size={44} />
      <Slam words={['IT FLOATS!']} at={200} y={1250} size={110} color={YEL} />
    </AbsoluteFill>
  );
};

const Weirder: React.FC = () => {
  const f = useCurrentFrame();
  const t = interpolate(f, [150, 260], [0, 1], {...clamp, easing: ease});
  const freeze = interpolate(f, [250, 320], [0, 1], {...clamp, easing: ease});
  return (
    <AbsoluteFill>
      <Big y={120} size={130} at={30} color={TEAL}><Count to={4} at={30} len={30} suffix="°C" /></Big>
      <div style={{position: 'absolute', top: 270, width: '100%', textAlign: 'center', fontFamily: 'B8', fontSize: 60, color: '#fff', textShadow: OUT}}>= water's heaviest</div>
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        {/* lake cross-section */}
        <path d="M 60 560 L 1020 560 L 1020 1200 Q 540 1340 60 1200 Z" fill={DEEP} stroke={INK} strokeWidth={12} />
        <path d="M 60 1030 L 1020 1030 L 1020 1200 Q 540 1340 60 1200 Z" fill="#1A4C9E" />
        <text x={880} y={1160} textAnchor="middle" fontFamily="B8" fontSize={46} fill="#fff">4°C</text>
        {/* cold parcels rising */}
        {[260, 540, 820].map((x, i) => {
          const y = interpolate(t, [0, 1], [1000, 640]) + i * 20;
          return <g key={i} opacity={1 - freeze}>
            <circle cx={x} cy={y} r={48} fill={SKY} stroke={INK} strokeWidth={8} />
            <text x={x} y={y + 14} textAnchor="middle" fontFamily="B8" fontSize={34} fill={INK}>0°</text>
          </g>;
        })}
        {t > 0 && t < 1 && <Arrow d="M 140 1000 L 140 640" progress={t} color={YEL} />}
        {/* ice forming on top */}
        <rect x={60} y={540} width={960 * freeze} height={60} rx={14} fill={ICE} stroke={INK} strokeWidth={9} />
      </svg>
      <Pill text="coldest water rises ⬆️" x={540} y={470} at={150} bg={SKY} color={INK} size={44} />
      <Pill text="freezes at the top first" x={540} y={1340} at={260} bg={ICE} color={INK} size={44} />
      <Huh mood="shocked" x={940} y={350} h={170} at={20} />
    </AbsoluteFill>
  );
};

const Fish: React.FC<{x: number; y: number; s?: number; flip?: boolean; frozen?: boolean}> = ({x, y, s = 1, flip, frozen}) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <path d="M 60 0 L 110 -40 L 110 40 Z" fill={frozen ? '#9ab' : ORG} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
    <ellipse rx={80} ry={46} fill={frozen ? '#bcd' : ORG} stroke={INK} strokeWidth={8} />
    <circle cx={-42} cy={-10} r={10} fill={INK} />
    {!frozen && <path d="M -70 14 Q -60 22 -50 14" stroke={INK} strokeWidth={5} fill="none" />}
  </g>
);

const FishScene: React.FC = () => {
  const f = useCurrentFrame();
  const flip = interpolate(f, [175, 200], [0, 1], clamp);
  const grow = interpolate(f, [195, 270], [0, 1], {...clamp, easing: ease});
  const swim = Math.sin(f / 20) * 160;
  return (
    <AbsoluteFill>
      {f < 180 ? <Big y={130} size={96} at={0}>an ice <span style={{color: ICE2}}>lid</span> 🧊</Big>
        : <Big y={130} size={96} at={180} color={RED}>if ice sank... 😱</Big>}
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        <path d="M 60 520 L 1020 520 L 1020 1200 Q 540 1340 60 1200 Z" fill={DEEP} stroke={INK} strokeWidth={12} />
        {/* normal: lid on top */}
        <g opacity={1 - flip}>
          <rect x={60} y={500} width={960} height={80} rx={16} fill={ICE} stroke={INK} strokeWidth={9} />
          <Fish x={540 + swim} y={900} flip={Math.cos(f / 20) < 0} />
          <Fish x={360 - swim * 0.6} y={1080} s={0.7} flip={Math.cos(f / 20) > 0} />
        </g>
        {/* what-if: freezing upward from the bottom */}
        <g opacity={flip}>
          <path d={`M 60 ${1200 - 680 * grow} L 1020 ${1200 - 680 * grow} L 1020 1200 Q 540 1340 60 1200 Z`} fill={ICE} stroke={INK} strokeWidth={9} />
          <Fish x={540} y={1000} frozen />
        </g>
      </svg>
      {f < 180 && <Pill text="fish survive below 🐟" x={540} y={1330} at={70} bg={ORG} size={46} />}
      {f >= 180 && <Pill text="frozen from the bottom up" x={540} y={1330} at={200} bg={RED} size={44} />}
      <Huh mood={f < 180 ? 'explaining' : 'shocked'} x={930} y={340} h={170} at={10} />
    </AbsoluteFill>
  );
};

export const scenes: SceneMap = {
  hook: {C: Hook, hue: SKY}, rule: {C: Rule, hue: '#5b6cff'}, bonds: {C: Bonds, hue: TEAL}, dance: {C: Dance, hue: PINK},
  hexagon: {C: Hexagon, hue: '#3d7bd9'}, floats: {C: Floats, hue: SKY}, weirder: {C: Weirder, hue: '#5b6cff'},
  fish: {C: FishScene, hue: TEAL}, cta: {C: CTA, hue: PINK},
};
