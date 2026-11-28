import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, spring} from 'remotion';
import {FPS, INK, PINK, YEL, TEAL, ORG, SKY, RED, CREAM, clamp, ease, Slam, Pill, Huh, Arrow, Count, CTA, SceneMap} from '../../kit';
import timing from './timing.json';

export const title = 'how does gps know where you are?';
export const segs = timing;

const OUT = `0 8px 0 ${INK}`;
const PANEL = '#5AA9FF', GOLD = '#F7C548', LAND = '#5BC27A', SEA = '#3A7BEA', MAP = '#EAF2E3', ROAD = '#FFFFFF';

const Big: React.FC<{children: React.ReactNode; y?: number; size?: number; color?: string; at?: number}> = ({children, y = 140, size = 110, color = YEL, at = 0}) => {
  const f = useCurrentFrame();
  const s = spring({frame: f - at, fps: FPS, config: {damping: 10}});
  return <div style={{position: 'absolute', top: y, width: '100%', textAlign: 'center', fontFamily: 'B8', fontSize: size, color, textShadow: OUT, transform: `scale(${s})`, lineHeight: 1.05}}>{children}</div>;
};

/** GPS satellite: gold body, two blue solar panels, dish. Draw inside <svg>. */
const Sat: React.FC<{x: number; y: number; s?: number; rot?: number; glow?: boolean}> = ({x, y, s = 1, rot = 0, glow}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    {glow && <circle r={120} fill={YEL} opacity={0.25} />}
    <line x1={-150} y1={0} x2={150} y2={0} stroke={INK} strokeWidth={10} />
    {[-1, 1].map((d) => (
      <g key={d}>
        <rect x={d < 0 ? -175 : 65} y={-34} width={110} height={68} rx={8} fill={PANEL} stroke={INK} strokeWidth={8} />
        <line x1={d < 0 ? -120 : 120} y1={-34} x2={d < 0 ? -120 : 120} y2={34} stroke={INK} strokeWidth={5} />
        <line x1={d < 0 ? -175 : 65} y1={0} x2={d < 0 ? -65 : 175} y2={0} stroke={INK} strokeWidth={5} />
      </g>
    ))}
    <rect x={-50} y={-48} width={100} height={96} rx={14} fill={GOLD} stroke={INK} strokeWidth={8} />
    <rect x={-34} y={-34} width={30} height={20} rx={5} fill="#fff" opacity={0.6} />
    <path d="M -26 48 Q 0 86 26 48 Z" fill="#fff" stroke={INK} strokeWidth={7} />
    <line x1={0} y1={62} x2={0} y2={84} stroke={INK} strokeWidth={6} />
  </g>
);

/** Phone with a map and a pin. x,y = centre. */
const Phone: React.FC<{x: number; y: number; s?: number; pin?: number; face?: boolean}> = ({x, y, s = 1, pin = 1, face}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-110} y={-190} width={220} height={380} rx={36} fill={INK} stroke="#fff" strokeWidth={7} />
    <rect x={-92} y={-160} width={184} height={320} rx={18} fill={MAP} />
    <path d="M -92 40 L 92 -20" stroke={ROAD} strokeWidth={22} />
    <path d="M -20 -160 L 30 160" stroke={ROAD} strokeWidth={18} />
    <rect x={40} y={60} width={40} height={60} rx={6} fill={LAND} opacity={0.6} />
    <g transform={`translate(5 ${-10 - 40 * (1 - pin)}) scale(${pin})`}>
      <path d="M 0 30 C -40 -10 -36 -56 0 -56 C 36 -56 40 -10 0 30 Z" fill={RED} stroke={INK} strokeWidth={6} />
      <circle cx={0} cy={-26} r={12} fill="#fff" />
    </g>
    {face && <><circle cx={-30} cy={-120} r={7} fill={INK} /><circle cx={30} cy={-120} r={7} fill={INK} /></>}
  </g>
);

/** Earth: blue disc with green blobs that slide (rotation). */
const Earth: React.FC<{x: number; y: number; r: number}> = ({x, y, r}) => {
  const f = useCurrentFrame();
  const off = (f * 1.2) % (r * 4);
  return (
    <g transform={`translate(${x} ${y})`}>
      <defs><clipPath id={'earth' + r}><circle r={r} /></clipPath></defs>
      <circle r={r} fill={SEA} />
      <g clipPath={`url(#earth${r})`}>
        {[0, 1].map((k) => (
          <g key={k} transform={`translate(${-r * 2 + off - k * r * 4} 0)`}>
            <path d={`M ${r * 0.2} ${-r * 0.6} q ${r * 0.5} ${-r * 0.2} ${r * 0.7} ${r * 0.3} q ${-r * 0.1} ${r * 0.5} ${-r * 0.5} ${r * 0.4} q ${-r * 0.4} ${-r * 0.2} ${-r * 0.2} ${-r * 0.7} Z`} fill={LAND} />
            <path d={`M ${r * 1.6} ${r * 0.1} q ${r * 0.6} ${-r * 0.1} ${r * 0.6} ${r * 0.4} q ${-r * 0.2} ${r * 0.4} ${-r * 0.6} ${r * 0.2} Z`} fill={LAND} />
            <path d={`M ${r * 2.6} ${-r * 0.5} q ${r * 0.4} 0 ${r * 0.5} ${r * 0.3} q ${-r * 0.3} ${r * 0.3} ${-r * 0.6} 0 Z`} fill={LAND} />
          </g>
        ))}
      </g>
      <circle r={r} fill="none" stroke={INK} strokeWidth={10} />
      <ellipse cx={-r * 0.35} cy={-r * 0.4} rx={r * 0.18} ry={r * 0.1} fill="#fff" opacity={0.35} />
    </g>
  );
};

/** Clock face; speed = turns of the minute hand per second of video. */
const Clock: React.FC<{x: number; y: number; r?: number; speed?: number; color?: string; wobble?: number}> = ({x, y, r = 120, speed = 0.2, color = CREAM, wobble = 0}) => {
  const f = useCurrentFrame();
  const a = (f / FPS) * speed * 360 + Math.sin(f / 3) * wobble;
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill={color} stroke={INK} strokeWidth={10} />
      {Array.from({length: 12}).map((_, i) => <line key={i} x1={0} y1={-r * 0.82} x2={0} y2={-r * 0.7} stroke={INK} strokeWidth={6} transform={`rotate(${i * 30})`} />)}
      <line x1={0} y1={0} x2={0} y2={-r * 0.45} stroke={INK} strokeWidth={10} strokeLinecap="round" transform={`rotate(${a / 12})`} />
      <line x1={0} y1={0} x2={0} y2={-r * 0.72} stroke={RED} strokeWidth={7} strokeLinecap="round" transform={`rotate(${a})`} />
      <circle r={10} fill={INK} />
    </g>
  );
};

/* ---------- scenes ---------- */

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const ph = spring({frame: f - 2, fps: FPS, config: {damping: 11}});
  const pin = spring({frame: f - 20, fps: FPS, config: {damping: 8}});
  const up = interpolate(f, [70, 100], [0, 1], {...clamp, easing: ease});
  const cross = interpolate(f, [105, 120], [0, 1], clamp);
  const down = interpolate(f, [150, 230], [0, 1], clamp);
  return (
    <AbsoluteFill>
      {f < 145
        ? <Big y={130} size={86} color="#fff">your phone knows <span style={{color: YEL}}>where</span> you are</Big>
        : <Slam words={['IT', 'JUST', 'LISTENS']} at={150} y={140} size={118} gap={6} />}
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        <Sat x={540} y={470} s={0.9} rot={Math.sin(f / 15) * 5} />
        {/* failed upload arrow */}
        <g opacity={f < 140 ? 1 : interpolate(f, [140, 155], [1, 0], clamp)}>
          <Arrow d="M 420 1000 L 420 640" progress={up} color={ORG} w={18} />
          <g opacity={cross} transform="translate(420 820)">
            <line x1={-60} y1={-60} x2={60} y2={60} stroke={RED} strokeWidth={22} strokeLinecap="round" />
            <line x1={60} y1={-60} x2={-60} y2={60} stroke={RED} strokeWidth={22} strokeLinecap="round" />
          </g>
        </g>
        {/* signals raining down */}
        {f > 145 && [0, 1, 2].map((i) => {
          const p = (down * 3 + i * 0.33) % 1;
          return <path key={i} d={`M ${440 + 0} ${560 + p * 420} q 100 40 200 0`} fill="none" stroke={TEAL} strokeWidth={12} strokeLinecap="round" opacity={1 - p * 0.6} />;
        })}
        <g transform={`translate(540 1120) scale(${ph}) translate(-540 -1120)`}><Phone x={540} y={1120} s={1} pin={pin} face /></g>
      </svg>
      <Pill text="sends to space? ❌" x={760} y={830} at={95} bg={RED} size={44} />
      <Huh mood="shocked" x={900} y={1090} h={220} at={150} />
    </AbsoluteFill>
  );
};

const Sats: React.FC = () => {
  const f = useCurrentFrame();
  const g = spring({frame: f - 2, fps: FPS, config: {damping: 12}});
  const orbits = [{rx: 400, ry: 140, rot: -20}, {rx: 400, ry: 140, rot: 40}, {rx: 400, ry: 140, rot: 100}];
  const laps = interpolate(f, [150, 240], [0, 2], {...clamp, easing: ease});
  return (
    <AbsoluteFill>
      <Big y={120} size={120} at={0}>~<Count to={30} at={5} len={45} /> satellites</Big>
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        <g transform={`translate(540 820) scale(${g}) translate(-540 -820)`}>
          {orbits.map((o, i) => (
            <ellipse key={'o' + i} cx={540} cy={820} rx={o.rx} ry={o.ry} transform={`rotate(${o.rot} 540 820)`} fill="none" stroke="#fff" strokeWidth={4} strokeDasharray="16 14" opacity={0.5} />
          ))}
          <Earth x={540} y={820} r={190} />
          {orbits.flatMap((o, i) => [0, 1, 2].map((k) => {
            const t = f / 60 + k * ((Math.PI * 2) / 3) + i;
            const ex = Math.cos(t) * o.rx, ey = Math.sin(t) * o.ry;
            const r = (o.rot * Math.PI) / 180;
            const x = 540 + ex * Math.cos(r) - ey * Math.sin(r), y = 820 + ex * Math.sin(r) + ey * Math.cos(r);
            return <Sat key={i + '-' + k} x={x} y={y} s={0.28} rot={o.rot} />;
          }))}
        </g>
        {/* lap counter ring */}
        <g transform="translate(870 1240)" opacity={interpolate(f, [140, 155], [0, 1], clamp)}>
          <circle r={70} fill="none" stroke="#ffffff33" strokeWidth={16} />
          <circle r={70} fill="none" stroke={YEL} strokeWidth={16} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - (laps % 1 || (laps >= 2 ? 1 : 0))} transform="rotate(-90)" />
          <text y={18} textAnchor="middle" fontFamily="B8" fontSize={52} fill="#fff">{Math.floor(laps)}×</text>
        </g>
      </svg>
      <Pill text="20,000 km up 🚀" x={540} y={330} at={60} bg={PINK} size={50} />
      <Pill text="2 laps a day 🔄" x={420} y={1240} at={150} bg={TEAL} size={48} />
    </AbsoluteFill>
  );
};

const Shout: React.FC = () => {
  const f = useCurrentFrame();
  const a = spring({frame: f - 2, fps: FPS, config: {damping: 11}});
  const c1 = spring({frame: f - 75, fps: FPS, config: {damping: 10}});
  const c2 = spring({frame: f - 120, fps: FPS, config: {damping: 10}});
  const ms = Math.floor((f * 33.3) % 1000).toString().padStart(3, '0');
  const sec = (Math.floor(f / 30) % 60).toString().padStart(2, '0');
  return (
    <AbsoluteFill>
      <Big y={120} size={100} at={0}>it shouts <span style={{color: PINK}}>2 things</span> 📢</Big>
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        <g transform={`translate(300 560) scale(${a})`}>
          {[0, 1, 2].map((i) => {
            const p = ((f / 30) + i / 3) % 1;
            return <circle key={i} r={120 + p * 300} fill="none" stroke={YEL} strokeWidth={10 * (1 - p)} opacity={1 - p} />;
          })}
          <Sat x={0} y={0} s={0.9} rot={-15 + Math.sin(f / 10) * 4} />
        </g>
      </svg>
      {/* message cards */}
      <div style={{position: 'absolute', left: 120, top: 830, width: 840, transform: `scale(${c1})`, transformOrigin: 'left center', background: CREAM, borderRadius: 34, boxShadow: OUT, padding: '26px 36px', fontFamily: 'B8', fontSize: 64, color: INK}}>
        📍 where I am
      </div>
      <div style={{position: 'absolute', left: 120, top: 1040, width: 840, transform: `scale(${c2})`, transformOrigin: 'left center', background: YEL, borderRadius: 34, boxShadow: OUT, padding: '26px 36px', fontFamily: 'B8', fontSize: 64, color: INK}}>
        🕒 sent at 12:00:{sec}.{ms}
      </div>
      <Huh mood="explaining" x={900} y={560} h={200} at={20} />
    </AbsoluteFill>
  );
};

const Delay: React.FC = () => {
  const f = useCurrentFrame();
  const travel = interpolate(f, [20, 120], [0, 1], {...clamp, easing: ease});
  const sx = 230, sy = 430, px = 820, py = 1080;
  const dx = sx + (px - sx) * travel, dy = sy + (py - sy) * travel;
  const watch = interpolate(f, [20, 120], [0, 0.07], clamp);
  const eq = spring({frame: f - 150, fps: FPS, config: {damping: 11}});
  return (
    <AbsoluteFill>
      <Big y={120} size={96} at={0}>⚡ speed of light</Big>
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        <line x1={sx} y1={sy} x2={px} y2={py} stroke="#ffffff44" strokeWidth={8} strokeDasharray="20 16" />
        <line x1={sx} y1={sy} x2={dx} y2={dy} stroke={YEL} strokeWidth={12} strokeLinecap="round" />
        <circle cx={dx} cy={dy} r={26} fill={YEL} stroke={INK} strokeWidth={7} />
        <Sat x={sx} y={sy} s={0.65} rot={20} />
        <Phone x={px} y={py} s={0.75} pin={travel > 0.98 ? 1 : 0.6} />
        {/* stopwatch */}
        <g transform="translate(250 960)">
          <rect x={-22} y={-160} width={44} height={36} rx={8} fill={INK} stroke="#fff" strokeWidth={5} />
          <circle r={130} fill={CREAM} stroke={INK} strokeWidth={10} />
          <line x1={0} y1={0} x2={0} y2={-100} stroke={RED} strokeWidth={9} strokeLinecap="round" transform={`rotate(${travel * 300})`} />
          <circle r={10} fill={INK} />
          <text y={70} textAnchor="middle" fontFamily="B8" fontSize={44} fill={INK}>{watch.toFixed(2)} s</text>
        </g>
      </svg>
      <div style={{position: 'absolute', top: 1250, width: '100%', textAlign: 'center', transform: `scale(${eq})`}}>
        <span style={{background: TEAL, color: '#fff', fontFamily: 'B8', fontSize: 52, padding: '12px 34px', borderRadius: 999, boxShadow: OUT}}>delay ⏱️ × light = distance 📏</span>
      </div>
      <Pill text="a tiny moment" x={760} y={420} at={60} bg={PINK} size={44} />
    </AbsoluteFill>
  );
};

const Bubbles: React.FC = () => {
  const f = useCurrentFrame();
  const P = {x: 540, y: 900};
  const sats = [{x: 300, y: 680, at: 10, c: PINK}, {x: 800, y: 700, at: 70, c: TEAL}, {x: 540, y: 1150, at: 120, c: ORG}];
  const pin = spring({frame: f - 175, fps: FPS, config: {damping: 8}});
  return (
    <AbsoluteFill>
      {f < 170 ? <Big y={120} size={92} at={0}>1 satellite = 1 bubble 🫧</Big> : <Slam words={['THAT\'S', 'YOU!']} at={172} y={140} size={120} />}
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        {sats.map((s, i) => {
          const r = Math.hypot(P.x - s.x, P.y - s.y);
          const p = interpolate(f, [s.at, s.at + 40], [0, 1], {...clamp, easing: ease});
          return (
            <g key={i}>
              <circle cx={s.x} cy={s.y} r={r * p} fill={s.c + '22'} stroke={s.c} strokeWidth={10} />
              <Sat x={s.x} y={s.y} s={0.38} rot={i * 20} />
              <text x={s.x} y={s.y - 50} textAnchor="middle" fontFamily="B8" fontSize={54} fill="#fff" opacity={p}>{i + 1}</text>
            </g>
          );
        })}
        <g transform={`translate(${P.x} ${P.y}) scale(${pin * 1.6})`}>
          <path d="M 0 0 C -40 -40 -36 -86 0 -86 C 36 -86 40 -40 0 0 Z" fill={RED} stroke={INK} strokeWidth={6} />
          <circle cx={0} cy={-56} r={13} fill="#fff" />
        </g>
      </svg>
      <Pill text="only 1 spot overlaps" x={540} y={320} at={150} bg={YEL} color={INK} size={46} />
    </AbsoluteFill>
  );
};

const Fourth: React.FC = () => {
  const f = useCurrentFrame();
  const fix = interpolate(f, [120, 150], [0, 1], clamp);
  const s4 = spring({frame: f - 110, fps: FPS, config: {damping: 9}});
  return (
    <AbsoluteFill>
      {f < 105 ? <Big y={120} size={96} at={0} color={ORG}>cheap clock 😬</Big> : <Big y={120} size={110} at={105}>at least <span style={{color: PINK}}>4</span> 🛰️</Big>}
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        {/* phone clock wobbling, then steadied */}
        <g transform={`translate(${f < 105 ? 540 : interpolate(f, [105, 130], [540, 300], {...clamp, easing: ease})} ${f < 105 ? 820 : 960}) scale(${f < 105 ? 1.3 : 0.9})`}>
          <g transform={`rotate(${Math.sin(f / 2.5) * 10 * (1 - fix)})`}>
            <Clock x={0} y={0} r={170} speed={0.25} wobble={40 * (1 - fix)} color={fix > 0.5 ? '#C9F2C7' : CREAM} />
          </g>
        </g>
        {f < 105 && <text x={780} y={640} fontFamily="B8" fontSize={120} fill={YEL} transform={`rotate(${Math.sin(f / 4) * 10} 780 600)`}>?!</text>}
        {f >= 105 && [0, 1, 2, 3].map((i) => {
          const x = 560 + (i % 2) * 260, y = 560 + Math.floor(i / 2) * 230;
          const s = i < 3 ? spring({frame: f - 105 - i * 4, fps: FPS, config: {damping: 11}}) : s4;
          return <Sat key={i} x={x} y={y} s={0.42 * s} rot={-10 + i * 8} glow={i === 3 && f > 130} />;
        })}
        {f > 125 && <Arrow d="M 820 900 Q 600 1100 420 1010" progress={fix} color={YEL} />}
      </svg>
      {f >= 140 && <Pill text="#4 fixes the timing ✅" x={540} y={1300} at={140} bg={TEAL} size={48} />}
      <Huh mood="laughing" x={880} y={1100} h={200} at={10} />
    </AbsoluteFill>
  );
};

const Nano: React.FC = () => {
  const f = useCurrentFrame();
  const beam = interpolate(f, [40, 100], [0, 1], {...clamp, easing: ease});
  const err = interpolate(f, [160, 240], [0, 1], {...clamp, easing: ease});
  return (
    <AbsoluteFill>
      <Big y={150} size={84} at={0} color="#fff">1 billionth of a second</Big>
      <Big y={250} size={120} at={30}>= 30 cm 📏</Big>
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        {/* ruler with light beam */}
        <g transform="translate(140 520)">
          <rect x={0} y={0} width={800} height={110} rx={14} fill={GOLD} stroke={INK} strokeWidth={9} />
          {Array.from({length: 31}).map((_, i) => <line key={i} x1={i * (800 / 30)} y1={0} x2={i * (800 / 30)} y2={i % 10 === 0 ? 60 : i % 5 === 0 ? 44 : 28} stroke={INK} strokeWidth={5} />)}
          <rect x={0} y={-50} width={800 * beam} height={26} rx={13} fill={YEL} />
          <circle cx={800 * beam} cy={-37} r={22} fill="#fff" stroke={YEL} strokeWidth={8} />
          <text x={400} y={96} textAnchor="middle" fontFamily="B8" fontSize={36} fill={INK}>30 cm</text>
        </g>
        {/* map error */}
        <g transform="translate(540 1030)">
          <rect x={-420} y={-230} width={840} height={400} rx={30} fill={MAP} stroke={INK} strokeWidth={10} />
          <path d="M -420 -20 L 420 -20" stroke={ROAD} strokeWidth={50} />
          <path d="M -100 -230 L -100 170" stroke={ROAD} strokeWidth={40} />
          <path d="M 180 -230 L 240 170" stroke="#9DD4A8" strokeWidth={30} />
          <circle cx={-100} cy={-20} r={26} fill={TEAL} stroke={INK} strokeWidth={6} />
          <g transform={`translate(${-100 + err * 360} ${-20 + err * 120})`}>
            <path d="M 0 0 C -36 -36 -32 -78 0 -78 C 32 -78 36 -36 0 0 Z" fill={RED} stroke={INK} strokeWidth={6} />
            <circle cx={0} cy={-50} r={11} fill="#fff" />
          </g>
          {err > 0 && <Arrow d="M -80 -20 L 240 100" progress={err} color={RED} w={8} />}
        </g>
      </svg>
      <Pill text="tiny clock error = big map error" x={540} y={1340} at={170} bg={RED} size={42} />
      <Huh mood="thinking" x={960} y={360} h={150} at={20} />
    </AbsoluteFill>
  );
};

const Einstein: React.FC = () => {
  const f = useCurrentFrame();
  const p1 = spring({frame: f - 70, fps: FPS, config: {damping: 11}});
  const p2 = spring({frame: f - 140, fps: FPS, config: {damping: 11}});
  const tot = spring({frame: f - 200, fps: FPS, config: {damping: 9}});
  return (
    <AbsoluteFill>
      <Big y={130} size={96} at={0} color={PINK}>it gets weirder 🤯</Big>
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        {/* Earth surface and satellite clock high above */}
        <path d="M 0 1180 Q 540 1060 1080 1180 L 1080 1420 L 0 1420 Z" fill={LAND} stroke={INK} strokeWidth={10} />
        <Clock x={300} y={1010} r={110} speed={0.2} />
        <text x={300} y={1180} textAnchor="middle" fontFamily="B8" fontSize={40} fill="#fff">ground</text>
        <Sat x={760} y={470} s={0.55} rot={-10} />
        <Clock x={760} y={700} r={110} speed={f > 200 ? 0.5 : 0.2} color={f > 200 ? '#FFE08A' : CREAM} />
        <text x={760} y={860} textAnchor="middle" fontFamily="B8" fontSize={40} fill="#fff">up there</text>
      </svg>
      <div style={{position: 'absolute', left: 60, top: 300, transform: `scale(${p1})`, transformOrigin: 'left', background: SKY, color: INK, fontFamily: 'B8', fontSize: 44, padding: '10px 28px', borderRadius: 999, boxShadow: OUT}}>🚀 speed: slower</div>
      <div style={{position: 'absolute', left: 60, top: 400, transform: `scale(${p2})`, transformOrigin: 'left', background: ORG, color: '#fff', fontFamily: 'B8', fontSize: 44, padding: '10px 28px', borderRadius: 999, boxShadow: OUT}}>🪐 less gravity: faster</div>
      <div style={{position: 'absolute', left: 40, top: 560, width: 460, textAlign: 'center', transform: `scale(${tot})`, fontFamily: 'B8', fontSize: 110, color: YEL, textShadow: OUT, lineHeight: 1}}>
        +<Count to={38} at={200} len={40} /> µs
        <div style={{fontSize: 48, color: '#fff'}}>every day</div>
      </div>
    </AbsoluteFill>
  );
};

const Drift: React.FC = () => {
  const f = useCurrentFrame();
  const d = interpolate(f, [50, 150], [0, 1], {...clamp, easing: ease});
  const fixP = interpolate(f, [175, 215], [0, 1], {...clamp, easing: ease});
  const rocket = interpolate(f, [215, 285], [0, 1], {...clamp, easing: ease});
  return (
    <AbsoluteFill>
      {f < 170
        ? <Big y={120} size={120} at={20} color={RED}><Count to={10} at={50} len={100} /> km a day 😱</Big>
        : <Big y={120} size={90} at={170}>set slow before launch 🔧</Big>}
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        {f < 170 && (
          <g>
            <rect x={90} y={420} width={900} height={760} rx={36} fill={MAP} stroke={INK} strokeWidth={10} />
            <path d="M 90 800 Q 400 700 600 820 T 990 760" stroke={ROAD} strokeWidth={46} fill="none" />
            <path d="M 300 420 L 360 1180" stroke={ROAD} strokeWidth={36} />
            <rect x={640} y={480} width={120} height={90} rx={10} fill="#9DD4A8" />
            <rect x={160} y={960} width={140} height={110} rx={10} fill="#9DD4A8" />
            <path d="M 700 1060 q 80 -40 160 0 q -80 50 -160 0" fill="#8EC5FF" />
            <circle cx={330} cy={780} r={24} fill={TEAL} stroke={INK} strokeWidth={6} />
            <g transform={`translate(${330 + d * 520} ${780 + d * 300})`}>
              <path d="M 0 0 C -44 -44 -40 -96 0 -96 C 40 -96 44 -44 0 0 Z" fill={RED} stroke={INK} strokeWidth={7} />
              <circle cx={0} cy={-62} r={14} fill="#fff" />
            </g>
            <Arrow d="M 350 790 L 840 1070" progress={d} color={RED} w={10} />
          </g>
        )}
        {f >= 170 && (
          <g>
            <g transform={`translate(380 ${760 - rocket * 260})`}>
              <Sat x={0} y={0} s={0.8} rot={-8} glow={rocket > 0.2} />
            </g>
            {/* tuning dial */}
            <g transform="translate(780 960)">
              <circle r={150} fill={CREAM} stroke={INK} strokeWidth={10} />
              <path d="M -110 60 A 125 125 0 0 1 110 60" fill="none" stroke="#ccc" strokeWidth={18} strokeLinecap="round" />
              <line x1={0} y1={0} x2={0} y2={-110} stroke={RED} strokeWidth={12} strokeLinecap="round" transform={`rotate(${-fixP * 40})`} />
              <circle r={16} fill={INK} />
              <text y={110} textAnchor="middle" fontFamily="B8" fontSize={40} fill={INK}>slower</text>
            </g>
            {rocket > 0 && [0, 1, 2].map((i) => <circle key={i} cx={360 + i * 20} cy={900 - rocket * 260 + 40 + i * 30} r={26 - i * 6} fill={i ? ORG : YEL} opacity={1 - rocket * 0.5} />)}
          </g>
        )}
      </svg>
      {f >= 175 && <Pill text="10.23 → 10.22999999543 MHz" x={540} y={1300} at={180} bg={TEAL} size={44} />}
      {f < 170 && <Pill text="without the fix" x={540} y={1300} at={60} bg={PINK} size={46} />}
      <Huh mood={f < 170 ? 'shocked' : 'explaining'} x={940} y={250} h={160} at={10} />
    </AbsoluteFill>
  );
};

export const scenes: SceneMap = {
  hook: {C: Hook, hue: SKY}, sats: {C: Sats, hue: '#5b6cff'}, shout: {C: Shout, hue: YEL}, delay: {C: Delay, hue: TEAL},
  bubbles: {C: Bubbles, hue: PINK}, fourth: {C: Fourth, hue: ORG}, nano: {C: Nano, hue: SKY}, einstein: {C: Einstein, hue: '#9b5cff'},
  drift: {C: Drift, hue: RED}, cta: {C: CTA, hue: PINK},
};
