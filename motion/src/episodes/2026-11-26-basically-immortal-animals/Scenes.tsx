import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, spring, random} from 'remotion';
import {FPS, INK, PINK, YEL, TEAL, ORG, CREAM, SKY, RED, clamp, ease, Slam, Pill, Huh, Arrow, Count, Counter, SwapCards, CTA, SceneMap} from '../../kit';
import timing from './timing.json';

export const title = '5 animals that are basically immortal';
export const segs = timing;

const OUT = `0 8px 0 ${INK}`, PURPLE = '#9b5cff', INDIGO = '#5b6cff', LEAF = '#3BB273', SKIN = '#F6A9B8', SKIN2 = '#E98CA0',
  SHELL = '#D9B98C', SHELL2 = '#B8946A', SHARK = '#7D8794', SHARK2 = '#5E6875', ICE = '#BFE6FF', JELLY = '#FF8FC8';

/* ---------- illustrations (all drawn inside an <svg>) ---------- */

/** Naked mole rat, centered on (0,0), facing right. */
const MoleRat: React.FC<{s?: number}> = ({s = 1}) => {
  const f = useCurrentFrame();
  const wig = Math.sin(f / 5) * 4;
  return (
    <g transform={`scale(${s})`}>
      {/* tail */}
      <path d={`M -200 30 Q -260 ${40 + wig} -290 10`} fill="none" stroke={INK} strokeWidth={22} strokeLinecap="round" />
      <path d={`M -200 30 Q -260 ${40 + wig} -290 10`} fill="none" stroke={SKIN} strokeWidth={10} strokeLinecap="round" />
      {/* feet */}
      {[-140, -60, 60, 130].map((x, i) => <ellipse key={i} cx={x + (i % 2 ? wig : -wig)} cy={95} rx={30} ry={16} fill={SKIN2} stroke={INK} strokeWidth={7} />)}
      {/* body */}
      <ellipse cx={0} cy={0} rx={230} ry={105} fill={SKIN} stroke={INK} strokeWidth={10} />
      {/* wrinkles */}
      {[-150, -95, -40, 15, 70].map((x, i) => <path key={i} d={`M ${x} -70 q 14 70 0 140`} fill="none" stroke={SKIN2} strokeWidth={7} strokeLinecap="round" />)}
      {/* head */}
      <ellipse cx={190} cy={-10} rx={95} ry={80} fill={SKIN} stroke={INK} strokeWidth={10} />
      <path d="M 150 -60 q 20 -10 40 0" fill="none" stroke={SKIN2} strokeWidth={6} strokeLinecap="round" />
      <circle cx={215} cy={-30} r={7} fill={INK} />
      {/* buck teeth */}
      <rect x={262} y={20} width={20} height={46} rx={5} fill={CREAM} stroke={INK} strokeWidth={6} />
      <rect x={278} y={20} width={20} height={42} rx={5} fill={CREAM} stroke={INK} strokeWidth={6} />
      <ellipse cx={280} cy={10} rx={18} ry={14} fill={SKIN2} stroke={INK} strokeWidth={6} />
      {/* whiskers */}
      {[-14, 0, 14].map((d, i) => <path key={i} d={`M 290 ${4 + d} l 50 ${d * 1.4}`} stroke={INK} strokeWidth={4} strokeLinecap="round" />)}
    </g>
  );
};

/** Ocean quahog shell, hinge at top center (0,-170). rings = how many growth rings to draw (0..1 progress). */
const Clam: React.FC<{s?: number; rings?: number; face?: 'happy' | 'cold'}> = ({s = 1, rings = 1, face = 'happy'}) => {
  const N = 14;
  return (
    <g transform={`scale(${s})`}>
      <path d="M 0 -170 C 150 -170 250 -60 240 50 C 230 150 120 190 0 190 C -120 190 -230 150 -240 50 C -250 -60 -150 -170 0 -170 Z" fill={SHELL} stroke={INK} strokeWidth={11} />
      {Array.from({length: N}).map((_, i) => {
        const k = (i + 1) / (N + 1);
        const p = interpolate(rings * N, [i, i + 1], [0, 1], clamp);
        return <path key={i} d={`M ${-240 * k} ${-170 + 220 * k} Q 0 ${-170 + 400 * k} ${240 * k} ${-170 + 220 * k}`} fill="none" stroke={SHELL2} strokeWidth={6}
          pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} strokeLinecap="round" />;
      })}
      <path d="M -40 -168 Q 0 -200 40 -168" fill={SHELL2} stroke={INK} strokeWidth={9} />
      {face === 'happy'
        ? <g><circle cx={-60} cy={20} r={13} fill={INK} /><circle cx={60} cy={20} r={13} fill={INK} /><path d="M -26 56 Q 0 80 26 56" fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" /></g>
        : <g><path d="M -75 18 l 30 0 M 45 18 l 30 0" stroke={INK} strokeWidth={9} strokeLinecap="round" /><path d="M -30 66 l 12 -10 l 12 10 l 12 -10 l 12 10 l 12 -10" fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" /></g>}
      <circle cx={-110} cy={60} r={20} fill={PINK} opacity={0.45} /><circle cx={110} cy={60} r={20} fill={PINK} opacity={0.45} />
    </g>
  );
};

/** Greenland shark, facing right, centered (0,0). */
const Shark: React.FC<{s?: number}> = ({s = 1}) => {
  const f = useCurrentFrame();
  const tail = Math.sin(f / 7) * 14;
  return (
    <g transform={`scale(${s})`}>
      <path d={`M -330 0 L -440 ${-80 + tail} L -410 0 L -440 ${80 + tail} Z`} fill={SHARK2} stroke={INK} strokeWidth={10} strokeLinejoin="round" />
      <path d="M -60 -90 L -10 -170 L 40 -95 Z" fill={SHARK2} stroke={INK} strokeWidth={10} strokeLinejoin="round" />
      <path d="M -200 -60 L -170 -110 L -140 -60 Z" fill={SHARK2} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
      <path d="M -350 0 C -250 -110 150 -120 320 -20 C 340 -5 340 15 320 25 C 150 110 -250 100 -350 0 Z" fill={SHARK} stroke={INK} strokeWidth={11} />
      <path d="M -300 20 C -150 70 150 70 300 30" fill="none" stroke="#A3ACB8" strokeWidth={18} strokeLinecap="round" opacity={0.7} />
      {/* spots */}
      {[[-200, -30], [-120, -50], [-40, -40], [-150, 0], [40, -55]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={7} fill={SHARK2} />)}
      <path d="M 30 50 L 0 120 L 90 60 Z" fill={SHARK2} stroke={INK} strokeWidth={9} strokeLinejoin="round" />
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M ${150 + i * 18} -30 q 8 30 0 60`} fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />)}
      <circle cx={255} cy={-22} r={16} fill="#E8F4FF" stroke={INK} strokeWidth={6} />
      <circle cx={258} cy={-22} r={8} fill={INK} />
      <path d="M 250 30 Q 285 40 315 22" fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" />
    </g>
  );
};

/** Hydra: a stalk on a foot with waving tentacles; top at (0,-h). */
const Hydra: React.FC<{s?: number; h?: number}> = ({s = 1, h = 420}) => {
  const f = useCurrentFrame();
  return (
    <g transform={`scale(${s})`}>
      <ellipse cx={0} cy={10} rx={80} ry={24} fill="#2E8F5A" stroke={INK} strokeWidth={9} />
      {Array.from({length: 6}).map((_, i) => {
        const a = -150 + i * 24, w = Math.sin(f / 8 + i) * 30;
        const ex = Math.cos((a * Math.PI) / 180) * 230, ey = Math.sin((a * Math.PI) / 180) * 230;
        const d = `M 0 ${-h} Q ${ex * 0.5 + w} ${-h + ey * 0.5 - 40} ${ex + w} ${-h + ey}`;
        return <g key={i}><path d={d} fill="none" stroke={INK} strokeWidth={26} strokeLinecap="round" /><path d={d} fill="none" stroke={LEAF} strokeWidth={13} strokeLinecap="round" /></g>;
      })}
      <path d={`M -55 0 C -70 ${-h * 0.5} -60 ${-h + 40} -45 ${-h + 10} Q 0 ${-h - 40} 45 ${-h + 10} C 60 ${-h + 40} 70 ${-h * 0.5} 55 0 Z`} fill={LEAF} stroke={INK} strokeWidth={10} />
    </g>
  );
};

/** Jellyfish bell + tentacles, centered on bell (0,0). squash: 0 normal -> 1 balled up. */
const Jelly: React.FC<{s?: number; squash?: number}> = ({s = 1, squash = 0}) => {
  const f = useCurrentFrame();
  const pulse = Math.sin(f / 6) * 0.05 * (1 - squash);
  const tl = 260 * (1 - squash);
  return (
    <g transform={`scale(${s})`}>
      {Array.from({length: 9}).map((_, i) => {
        const x = -130 + i * 32.5, w = Math.sin(f / 7 + i) * 22;
        return <path key={i} d={`M ${x} 40 q ${w} ${tl * 0.5} 0 ${tl}`} fill="none" stroke={JELLY} strokeWidth={8} strokeLinecap="round" opacity={0.9} />;
      })}
      <g transform={`scale(${1 + pulse - squash * 0.35} ${1 - pulse - squash * 0.1})`}>
        <path d="M -170 40 C -170 -150 170 -150 170 40 Q 85 70 0 40 Q -85 70 -170 40 Z" fill={JELLY} fillOpacity={0.85} stroke={INK} strokeWidth={10} />
        <ellipse cx={0} cy={-30} rx={60} ry={40} fill={RED} opacity={0.75} />
        <ellipse cx={-70} cy={-70} rx={24} ry={14} fill="#fff" opacity={0.5} />
        <circle cx={-45} cy={10} r={10} fill={INK} /><circle cx={45} cy={10} r={10} fill={INK} />
      </g>
    </g>
  );
};

/** Tiny polyp on a rock (the jellyfish "baby" stage). */
const Polyp: React.FC<{s?: number}> = ({s = 1}) => (
  <g transform={`scale(${s})`}>
    <ellipse cx={0} cy={20} rx={150} ry={40} fill="#8892AE" stroke={INK} strokeWidth={9} />
    {[-70, 0, 70].map((x, i) => (
      <g key={i} transform={`translate(${x} 0)`}>
        <path d="M -12 0 L -8 -110 L 8 -110 L 12 0 Z" fill={JELLY} stroke={INK} strokeWidth={6} />
        {[-1, 1].map((d) => <path key={d} d={`M 0 -110 q ${d * 30} -20 ${d * 40} -50`} fill="none" stroke={JELLY} strokeWidth={7} strokeLinecap="round" />)}
        <circle cx={0} cy={-114} r={14} fill={JELLY} stroke={INK} strokeWidth={6} />
      </g>
    ))}
  </g>
);

/* ---------- scenes ---------- */

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  // hourglass that keeps flipping
  const flips = Math.floor(f / 45);
  const rot = flips * 180 + interpolate(f % 45, [33, 45], [0, 180], {...clamp, easing: ease});
  const sand = (f % 45) / 33;
  const hs = spring({frame: f, fps: FPS, config: {damping: 11}});
  const icons = ['🐀', '🐚', '🦈', '🌱', '🪼'];
  return (
    <AbsoluteFill>
      <Slam words={['BASICALLY', 'IMMORTAL']} at={4} y={150} size={118} gap={10} />
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        <g transform={`translate(540 720) scale(${hs}) rotate(${rot})`}>
          <rect x={-170} y={-250} width={340} height={36} rx={14} fill={ORG} stroke={INK} strokeWidth={9} />
          <rect x={-170} y={214} width={340} height={36} rx={14} fill={ORG} stroke={INK} strokeWidth={9} />
          <path d="M -130 -214 L 130 -214 C 130 -90 20 -40 20 0 C 20 40 130 90 130 214 L -130 214 C -130 90 -20 40 -20 0 C -20 -40 -130 -90 -130 -214 Z" fill="#ffffff30" stroke={INK} strokeWidth={10} />
          {/* top sand shrinking, bottom sand growing (in the glass's own frame, before flip) */}
          <path d={`M ${-100 * (1 - Math.min(1, sand))} ${-30 - 150 * (1 - Math.min(1, sand))} L ${100 * (1 - Math.min(1, sand))} ${-30 - 150 * (1 - Math.min(1, sand))} L 0 -20 Z`} fill={YEL} />
          <path d={`M -110 205 L 110 205 L ${60 * (1 - Math.min(1, sand))} ${205 - 150 * Math.min(1, sand)} L ${-60 * (1 - Math.min(1, sand))} ${205 - 150 * Math.min(1, sand)} Z`} fill={YEL} />
          {sand < 1 && <rect x={-4} y={-20} width={8} height={220} fill={YEL} />}
        </g>
      </svg>
      {icons.map((ic, i) => {
        const s = spring({frame: f - 120 - i * 10, fps: FPS, config: {damping: 9}});
        return <div key={i} style={{position: 'absolute', left: 130 + i * 205, top: 1110, width: 170, height: 170, marginLeft: -85, borderRadius: 40, background: '#ffffff1c', border: `6px solid ${[PINK, ORG, SKY, LEAF, JELLY][i]}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 100, transform: `scale(${s}) rotate(${(1 - s) * 30}deg)`, boxShadow: OUT}}>{f > 190 ? ic : '?'}</div>;
      })}
      <Pill text="5 creatures" x={540} y={1340} at={125} bg={PINK} size={46} />
      <Huh mood="curious" x={900} y={420} h={260} at={60} flip />
    </AbsoluteFill>
  );
};

const Mole: React.FC = () => {
  const f = useCurrentFrame();
  const rs = spring({frame: f - 6, fps: FPS, config: {damping: 11}});
  const walk = interpolate(f, [0, 60], [-300, 0], {...clamp, easing: ease});
  const b1 = interpolate(f, [90, 120], [0, 1], {...clamp, easing: ease});
  const b2 = interpolate(f, [165, 215], [0, 1], {...clamp, easing: ease});
  const bar = (y: number, w: number, c: string, label: string) => (
    <div style={{position: 'absolute', left: 90, top: y}}>
      <div style={{fontFamily: 'B8', fontSize: 44, color: '#fff', textShadow: OUT, marginBottom: 8}}>{label}</div>
      <div style={{height: 70, width: w, background: c, borderRadius: 18, border: `6px solid ${INK}`, boxShadow: OUT}} />
    </div>
  );
  return (
    <AbsoluteFill>
      <Counter n={1} of={5} />
      <Pill text="naked mole rat" x={540} y={260} at={4} bg={PINK} size={54} />
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        <g transform={`translate(${520 + walk} 560) scale(${rs})`}><MoleRat s={1.05} /></g>
      </svg>
      {f > 85 && bar(820, 40 + 120 * b1, '#9AA5B8', 'normal tiny rodent')}
      {f > 85 && <div style={{position: 'absolute', left: 90 + 40 + 120 * b1 + 30, top: 880, fontFamily: 'B8', fontSize: 60, color: '#fff', textShadow: OUT, opacity: b1}}>~6 yrs</div>}
      {f > 160 && bar(1040, 40 + 560 * b2, PINK, 'naked mole rat')}
      {f > 160 && <div style={{position: 'absolute', left: 90 + 40 + 560 * b2 + 30, top: 1092, fontFamily: 'B8', fontSize: 72, color: YEL, textShadow: OUT}}>
        <Count to={30} at={165} len={50} suffix="+" /></div>}
      {f > 220 && <Pill text="years! 😮" x={830} y={1320} at={220} bg={YEL} color={INK} size={46} />}
    </AbsoluteFill>
  );
};

const Risk: React.FC = () => {
  const f = useCurrentFrame();
  const ax = interpolate(f, [0, 18], [0, 1], {...clamp, easing: ease});
  const red = interpolate(f, [25, 75], [0, 1], {...clamp, easing: ease});
  const flat = interpolate(f, [70, 120], [0, 1], {...clamp, easing: ease});
  const X0 = 150, Y0 = 1100, X1 = 960, Y1 = 380;
  return (
    <AbsoluteFill>
      <Slam words={['RISK', 'OF', 'DYING']} at={2} y={150} size={104} gap={6} />
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        <Arrow d={`M ${X0} ${Y0} L ${X0} ${Y1}`} color="#fff" progress={ax} w={10} />
        <Arrow d={`M ${X0} ${Y0} L ${X1} ${Y0}`} color="#fff" progress={ax} w={10} />
        <Arrow d={`M ${X0 + 10} ${Y0 - 150} C 500 ${Y0 - 160} 750 ${Y0 - 260} ${X1 - 40} ${Y1 + 60}`} color={RED} progress={red} w={16} />
        <Arrow d={`M ${X0 + 10} ${Y0 - 150} L ${X1 - 40} ${Y0 - 150}`} color={TEAL} progress={flat} w={18} />
        {flat > 0.99 && <g transform={`translate(${X1 - 70} ${Y0 - 150})`}><circle r={46} fill={SKIN} stroke={INK} strokeWidth={7} /><circle cx={14} cy={-8} r={6} fill={INK} /><rect x={30} y={4} width={14} height={22} rx={3} fill={CREAM} stroke={INK} strokeWidth={4} /></g>}
      </svg>
      <div style={{position: 'absolute', left: X1 - 290, top: Y0 + 16, fontFamily: 'B8', fontSize: 46, color: '#fff', textShadow: OUT, opacity: ax}}>age →</div>
      <Pill text="other mammals 📈" x={620} y={460} at={60} bg={RED} size={42} />
      <Pill text="mole rat: flat! ➖" x={560} y={870} at={115} bg={TEAL} size={44} />
      {f > 150 && <Pill text="basically unheard of" x={540} y={1300} at={150} bg={YEL} color={INK} size={50} />}
      <Huh mood="thinking" x={940} y={1170} h={220} at={140} flip />
    </AbsoluteFill>
  );
};

const ClamScene: React.FC = () => {
  const f = useCurrentFrame();
  const cs = spring({frame: f - 4, fps: FPS, config: {damping: 10}});
  const rings = interpolate(f, [70, 200], [0, 1], clamp);
  const zoom = interpolate(f, [55, 80], [0, 1], {...clamp, easing: ease});
  return (
    <AbsoluteFill>
      <Counter n={2} of={5} color={ORG} />
      <Pill text="Ming the clam" x={540} y={260} at={4} bg={ORG} size={54} />
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        <g transform={`translate(540 ${640 - zoom * 20}) scale(${cs * (1 + zoom * 0.2)})`}><Clam s={1.2} rings={rings} /></g>
        {/* magnifying glass sweeping across the rings */}
        {f > 60 && <g transform={`translate(${540 + Math.sin(f / 18) * 150} ${530 + Math.cos(f / 22) * 30})`} opacity={zoom}>
          <circle r={90} fill="#ffffff22" stroke={INK} strokeWidth={22} /><circle r={90} fill="none" stroke="#C9D2E3" strokeWidth={10} />
          <path d="M 64 64 L 150 150" stroke={INK} strokeWidth={34} strokeLinecap="round" /><path d="M 64 64 L 150 150" stroke={ORG} strokeWidth={20} strokeLinecap="round" />
        </g>}
      </svg>
      <Pill text="count the growth rings 🔍" x={540} y={1010} at={60} bg={CREAM} color={INK} size={44} />
      {f > 90 && <div style={{position: 'absolute', top: 1080, width: '100%', textAlign: 'center', fontFamily: 'B8', fontSize: 170, color: YEL, lineHeight: 1, textShadow: OUT}}>
        <Count to={507} at={90} len={120} /><span style={{fontSize: 70, color: '#fff'}}> yrs</span></div>}
    </AbsoluteFill>
  );
};

const Oops: React.FC = () => {
  const f = useCurrentFrame();
  const freeze = interpolate(f, [40, 70], [0, 1], {...clamp, easing: ease});
  const shake = f > 70 && f < 82 ? Math.sin(f * 4) * 8 : 0;
  return (
    <AbsoluteFill>
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        {/* the other 200 clams in a pile */}
        {Array.from({length: 18}).map((_, i) => {
          const s = spring({frame: f - 8 - i * 2, fps: FPS, config: {damping: 11}});
          const c = i % 6, r = Math.floor(i / 6);
          return <g key={i} transform={`translate(${170 + c * 148 + (r % 2) * 70} ${970 + r * 95}) scale(${0.22 * s})`}><Clam face="happy" /></g>;
        })}
        {/* Ming, front and centre */}
        <g transform={`translate(${540 + shake} 610)`}><Clam s={0.95} face={freeze > 0.5 ? 'cold' : 'happy'} /></g>
        {/* ice block */}
        <rect x={290} y={360 - (1 - freeze) * 60} width={500} height={480} rx={40} fill={ICE} fillOpacity={0.55 * freeze} stroke="#fff" strokeOpacity={freeze} strokeWidth={10} />
        {freeze > 0.3 && [[330, 400], [740, 420], [350, 790], [720, 780]].map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${f * 2 + i * 30})`} opacity={freeze}>
            {[0, 60, 120].map((a) => <rect key={a} x={-3} y={-24} width={6} height={48} rx={3} fill="#fff" transform={`rotate(${a})`} />)}
          </g>
        ))}
      </svg>
      <Pill text="❄️ frozen on the ship" x={540} y={300} at={45} bg={SKY} color={INK} size={46} />
      <Pill text="+ ~200 other clams" x={540} y={890} at={20} bg={ORG} size={42} />
      {f > 140 && <Slam words={['OOPS.']} at={140} y={1250} size={120} color={SKY} />}
      <Huh mood="shocked" x={935} y={380} h={220} at={150} flip />
    </AbsoluteFill>
  );
};

const SharkScene: React.FC = () => {
  const f = useCurrentFrame();
  const swim = interpolate(f, [0, 70], [-500, 0], {...clamp, easing: ease});
  const lens = spring({frame: f - 85, fps: FPS, config: {damping: 11}});
  return (
    <AbsoluteFill>
      <Counter n={3} of={5} color={SKY} />
      <Pill text="Greenland shark" x={540} y={260} at={4} bg={SKY} color={INK} size={54} />
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        {/* bubbles */}
        {Array.from({length: 8}).map((_, i) => <circle key={i} cx={100 + random('b' + i) * 880} cy={1000 - ((f * (1 + random('v' + i)) + random('o' + i) * 600) % 700)} r={8 + random('r' + i) * 10} fill="none" stroke="#ffffff66" strokeWidth={4} />)}
        <g transform={`translate(${520 + swim} ${560 + Math.sin(f / 20) * 10})`}><Shark s={0.95} /></g>
        {/* zoom bubble on the eye */}
        {f > 80 && <g>
          <path d={`M ${762} ${539} L ${800} ${730}`} stroke="#fff" strokeWidth={5} strokeDasharray="12 10" opacity={lens} />
          <g transform={`translate(800 860) scale(${lens})`}>
            <circle r={130} fill="#0E2238" stroke="#fff" strokeWidth={10} />
            <circle r={80} fill="#E8F4FF" stroke={INK} strokeWidth={7} />
            {[70, 55, 40, 25, 12].map((r, i) => <circle key={i} r={r} fill="none" stroke={SKY} strokeWidth={4} />)}
          </g>
        </g>}
      </svg>
      <Pill text="eye-lens dating 👁️" x={800} y={1040} at={95} bg={CREAM} color={INK} size={40} />
      {f > 130 && <div style={{position: 'absolute', left: 50, top: 760, width: 520, textAlign: 'center'}}>
        <div style={{fontFamily: 'B6', fontSize: 44, color: '#fff', textShadow: OUT}}>biggest one: about</div>
        <div style={{fontFamily: 'B8', fontSize: 190, color: YEL, lineHeight: 1, textShadow: OUT}}><Count to={392} at={130} len={90} /></div>
        <div style={{fontFamily: 'B8', fontSize: 56, color: '#fff', textShadow: OUT}}>years old</div>
      </div>}
      {f > 225 && <Pill text="give or take 120 yrs" x={320} y={1220} at={225} bg={TEAL} size={42} />}
    </AbsoluteFill>
  );
};

const HydraScene: React.FC = () => {
  const f = useCurrentFrame();
  const hs = spring({frame: f - 4, fps: FPS, config: {damping: 11}});
  // cell swap: cells inside the body cycle old (grey) -> new (yellow) in waves
  const cells = Array.from({length: 14}).map((_, i) => ({x: (i % 2 ? 22 : -22) + (random('cx' + i) - 0.5) * 16, y: -40 - i * 26}));
  const wave = (f - 60) / 3;
  const week = Math.max(0, Math.min(4, Math.floor((f - 60) / 25) + 1));
  return (
    <AbsoluteFill>
      <Counter n={4} of={5} color={LEAF} />
      <Pill text="hydra" x={540} y={260} at={4} bg={LEAF} size={56} />
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        <g transform={`translate(330 1180) scale(${hs})`}>
          <Hydra s={1.25} />
          <g transform="scale(1.25)">
            {cells.map((c, i) => {
              const fresh = wave > i;
              const pop = fresh ? spring({frame: Math.round((wave - i) * 3), fps: FPS, config: {damping: 9}}) : 1;
              return <circle key={i} cx={c.x} cy={c.y} r={11 * pop} fill={fresh ? YEL : '#2E8F5A'} stroke={INK} strokeWidth={3} />;
            })}
          </g>
        </g>
      </svg>
      {/* calendar */}
      <div style={{position: 'absolute', left: 600, top: 420, width: 380, transform: `scale(${spring({frame: f - 50, fps: FPS, config: {damping: 11}})})`}}>
        <div style={{background: RED, borderRadius: '28px 28px 0 0', border: `6px solid ${INK}`, fontFamily: 'B8', fontSize: 44, color: '#fff', textAlign: 'center', padding: 8}}>new cells</div>
        <div style={{background: CREAM, borderRadius: '0 0 28px 28px', border: `6px solid ${INK}`, borderTop: 'none', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, padding: 22, boxShadow: OUT}}>
          {[1, 2, 3, 4].map((w) => <div key={w} style={{height: 70, borderRadius: 14, background: w <= week ? LEAF : '#ddd', border: `4px solid ${INK}`, fontFamily: 'B8', fontSize: 34, color: INK, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{w <= week ? '✓' : 'w' + w}</div>)}
        </div>
      </div>
      <Pill text="every ~4 weeks 🔄" x={790} y={760} at={110} bg={YEL} color={INK} size={44} />
      {f > 150 && <Pill text="risk of dying: flat ➖" x={760} y={960} at={150} bg={TEAL} size={44} />}
      {f > 175 && <Pill text="10-year lab study" x={760} y={1110} at={175} bg="#ffffff" color={INK} size={40} />}
    </AbsoluteFill>
  );
};

const JellyScene: React.FC = () => {
  const f = useCurrentFrame();
  const js = spring({frame: f - 4, fps: FPS, config: {damping: 11}});
  const sq = interpolate(f, [100, 140], [0, 1], {...clamp, easing: ease});
  const sink = interpolate(f, [130, 165], [0, 1], {...clamp, easing: ease});
  const pol = spring({frame: f - 168, fps: FPS, config: {damping: 10}});
  const loop = interpolate(f, [190, 240], [0, 1], {...clamp, easing: ease});
  return (
    <AbsoluteFill>
      <Counter n={5} of={5} color={JELLY} />
      <Pill text="the immortal jellyfish" x={540} y={260} at={4} bg={JELLY} color={INK} size={50} />
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        {f < 170 && <g transform={`translate(540 ${560 + sink * 520}) scale(${js * (1 - sink * 0.8)})`}><Jelly s={1.15} squash={sq} /></g>}
        {f >= 160 && <g transform={`translate(540 1140) scale(${pol})`}><Polyp s={1.2} /></g>}
        {f > 185 && <g>
          <Arrow d="M 830 1060 C 1000 900 1000 600 760 520" color={YEL} progress={loop} w={14} />
          <Arrow d="M 250 520 C 80 600 80 900 250 1060" color={YEL} progress={loop} w={14} />
        </g>}
      </svg>
      {f > 70 && f < 160 && <Pill text="hurt or stressed 😣" x={540} y={1000} at={70} bg={RED} size={46} />}
      {f > 168 && <Pill text="⏪ back to a baby polyp" x={540} y={880} at={168} bg={YEL} color={INK} size={46} />}
      {f > 215 && <Pill text="…then grows up again" x={540} y={1330} at={215} bg={TEAL} size={42} />}
      <Huh mood="shocked" x={150} y={330} h={210} at={175} />
    </AbsoluteFill>
  );
};

const Catch: React.FC = () => {
  const f = useCurrentFrame();
  const threats = [{t: '🐟 predators', c: ORG}, {t: '🦠 disease', c: LEAF}, {t: '💥 accidents', c: RED}];
  return (
    <AbsoluteFill>
      <SwapCards before="immortal = can't die" after="immortal-ish = doesn't really age" label="more like..." at={6} y={220} />
      {threats.map((th, i) => (
        <Pill key={i} text={th.t} x={[260, 540, 820][i]} y={900 + (i % 2) * 90} at={110 + i * 14} bg={th.c} size={42} />
      ))}
      {f > 175 && <Slam words={['NOT', 'INVINCIBLE']} at={175} y={1100} size={100} gap={6} color={SKY} />}
      <Huh mood="explaining" x={900} y={1210} h={200} at={60} flip />
    </AbsoluteFill>
  );
};

export const scenes: SceneMap = {
  hook: {C: Hook, hue: PURPLE}, mole: {C: Mole, hue: PINK}, risk: {C: Risk, hue: TEAL}, clam: {C: ClamScene, hue: ORG},
  oops: {C: Oops, hue: SKY}, shark: {C: SharkScene, hue: INDIGO}, hydra: {C: HydraScene, hue: LEAF}, jelly: {C: JellyScene, hue: PURPLE},
  catch: {C: Catch, hue: RED}, cta: {C: CTA, hue: PINK},
};
