import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, spring} from 'remotion';
import {FPS, INK, PINK, YEL, TEAL, ORG, CREAM, SKY, RED, clamp, ease, Slam, Pill, Huh, Arrow, Count, Marker, CTA, SceneMap} from '../../kit';
import timing from './timing.json';

export const title = 'two friends, same $100, very different results';
export const segs = timing;

const GREEN = '#3DBE7A', SKIN = '#F2C39B', SKIN2 = '#C98B5E';

/* ---------- characters & props ---------- */

/** Flat cartoon person. who: 'mia' (teal shirt, bun) or 'leo' (orange shirt, spiky hair). */
const Person: React.FC<{who: 'mia' | 'leo'; x: number; y: number; s?: number; mood?: 'happy' | 'meh' | 'wow'; at?: number}> = ({who, x, y, s = 1, mood = 'happy', at = 0}) => {
  const f = useCurrentFrame();
  const p = spring({frame: f - at, fps: FPS, config: {damping: 11}});
  const bob = Math.sin((f + (who === 'mia' ? 0 : 9)) / 7) * 5;
  const shirt = who === 'mia' ? TEAL : ORG, skin = who === 'mia' ? SKIN : SKIN2, hair = who === 'mia' ? '#5B3A29' : '#1d1d2e';
  return (
    <svg width={300 * s} height={460 * s} viewBox="0 0 300 460" style={{position: 'absolute', left: x - 150 * s, top: y + bob + (1 - p) * 400, overflow: 'visible', opacity: p > 0.02 ? 1 : 0}}>
      <rect x={60} y={230} width={180} height={210} rx={80} fill={shirt} stroke={INK} strokeWidth={10} />
      <circle cx={150} cy={140} r={100} fill={skin} stroke={INK} strokeWidth={10} />
      {who === 'mia' ? (
        <>
          <path d="M 52 130 Q 60 40 150 38 Q 240 40 248 130 Q 210 80 150 78 Q 90 80 52 130 Z" fill={hair} stroke={INK} strokeWidth={8} />
          <circle cx={150} cy={30} r={34} fill={hair} stroke={INK} strokeWidth={8} />
        </>
      ) : (
        <path d="M 55 120 L 70 50 L 100 85 L 120 30 L 150 75 L 180 28 L 200 82 L 232 48 L 245 120 Q 150 80 55 120 Z" fill={hair} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
      )}
      <circle cx={115} cy={150} r={11} fill={INK} /><circle cx={185} cy={150} r={11} fill={INK} />
      <circle cx={95} cy={185} r={14} fill={PINK} opacity={0.45} /><circle cx={205} cy={185} r={14} fill={PINK} opacity={0.45} />
      {mood === 'happy' && <path d="M 115 190 Q 150 222 185 190" fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" />}
      {mood === 'meh' && <path d="M 120 200 L 180 196" fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" />}
      {mood === 'wow' && <ellipse cx={150} cy={203} rx={18} ry={22} fill={INK} />}
    </svg>
  );
};

/** Dollar bill. */
const Bill: React.FC<{x: number; y: number; w?: number; rot?: number; label?: string; op?: number}> = ({x, y, w = 220, rot = 0, label = '$100', op = 1}) => (
  <div style={{position: 'absolute', left: x - w / 2, top: y - w * 0.24, width: w, height: w * 0.48, background: GREEN, border: `7px solid ${INK}`, borderRadius: 14,
    transform: `rotate(${rot}deg)`, opacity: op, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'B8', fontSize: w * 0.26, color: '#fff', textShadow: `0 4px 0 ${INK}`, boxShadow: `0 8px 0 ${INK}`}}>
    {label}
  </div>
);

const Jar: React.FC<{x: number; y: number; fill?: number}> = ({x, y, fill = 0}) => (
  <svg width={340} height={420} viewBox="0 0 340 420" style={{position: 'absolute', left: x - 170, top: y, overflow: 'visible'}}>
    <rect x={70} y={10} width={200} height={50} rx={14} fill="#9aa6bf" stroke={INK} strokeWidth={9} />
    <path d="M 60 70 Q 30 90 30 150 L 30 360 Q 30 405 75 405 L 265 405 Q 310 405 310 360 L 310 150 Q 310 90 280 70 Z" fill="#ffffff22" stroke={INK} strokeWidth={10} />
    <rect x={95} y={405 - 70 * fill - 20} width={150} height={70 * fill} rx={10} fill={GREEN} stroke={INK} strokeWidth={6} opacity={fill > 0 ? 1 : 0} />
    <path d="M 70 120 L 70 330" stroke="#ffffff88" strokeWidth={14} strokeLinecap="round" />
  </svg>
);

/** Pot with a stem that grows (g 0..1) and coin leaves. */
const Plant: React.FC<{x: number; y: number; g: number; coins: number}> = ({x, y, g, coins}) => {
  const f = useCurrentFrame();
  const top = 330 - 280 * g;
  return (
    <svg width={360} height={520} viewBox="0 0 360 520" style={{position: 'absolute', left: x - 180, top: y, overflow: 'visible'}}>
      <path d={`M 180 360 C 170 300 195 ${top + 80} 180 ${top}`} fill="none" stroke={GREEN} strokeWidth={16} strokeLinecap="round" />
      {Array.from({length: coins}).map((_, i) => {
        const t = (i + 1) / (coins + 1); const cy = 360 - (360 - top) * t; const side = i % 2 ? 1 : -1;
        const pop = spring({frame: f - 10 - i * 8, fps: FPS, config: {damping: 10}});
        return (
          <g key={i} transform={`translate(${180 + side * 52} ${cy}) scale(${pop}) rotate(${Math.sin(f / 10 + i) * 8})`}>
            <ellipse cx={0} cy={0} rx={38} ry={22} fill={GREEN} stroke={INK} strokeWidth={6} transform={`rotate(${side * -25})`} />
            <circle cx={side * 6} cy={-4} r={20} fill={YEL} stroke={INK} strokeWidth={5} />
            <text x={side * 6} y={5} textAnchor="middle" fontFamily="B8" fontSize={24} fill={INK}>$</text>
          </g>
        );
      })}
      <path d="M 90 360 L 270 360 L 245 500 L 115 500 Z" fill={ORG} stroke={INK} strokeWidth={10} strokeLinejoin="round" />
      <rect x={75} y={340} width={210} height={44} rx={12} fill="#E0763A" stroke={INK} strokeWidth={10} />
    </svg>
  );
};

/** Vertical bar with a counting label. */
const Bar: React.FC<{x: number; base: number; h: number; color: string; to: number; from?: number; at?: number; label: string; w?: number}> = ({x, base, h, color, to, from = 0, at = 0, label, w = 170}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + 30], [0, 1], {...clamp, easing: ease});
  return (
    <>
      <div style={{position: 'absolute', left: x - w / 2, top: base - h * p, width: w, height: h * p, background: color, border: `7px solid ${INK}`, borderRadius: '18px 18px 0 0', boxSizing: 'border-box'}} />
      <div style={{position: 'absolute', left: x - 160, width: 320, top: base - h * p - 92, textAlign: 'center', fontFamily: 'B8', fontSize: 64, color: '#fff', textShadow: `0 6px 0 ${INK}`, opacity: p}}>
        <Count to={to} from={from} at={at} len={30} prefix="$" />
      </div>
      <div style={{position: 'absolute', left: x - 160, width: 320, top: base + 16, textAlign: 'center', fontFamily: 'B8', fontSize: 46, color: CREAM}}>{label}</div>
    </>
  );
};

/* ---------- scenes ---------- */

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const later = f > 120;
  return (
    <AbsoluteFill>
      <Slam words={['same', '$100']} y={170} size={140} />
      <Person who="mia" x={300} y={520} s={0.95} mood={later ? 'meh' : 'happy'} at={6} />
      <Person who="leo" x={780} y={520} s={0.95} mood={later ? 'wow' : 'happy'} at={14} />
      {!later && <><Bill x={300} y={1000} rot={-6} op={interpolate(f, [24, 34], [0, 1], clamp)} /><Bill x={780} y={1000} rot={6} op={interpolate(f, [30, 40], [0, 1], clamp)} /></>}
      {later && (
        <>
          <Pill text="40 years later..." x={540} y={420} at={120} bg={YEL} color={INK} />
          <div style={{position: 'absolute', left: 140, width: 320, top: 990, textAlign: 'center', fontFamily: 'B8', fontSize: 96, color: '#fff', textShadow: `0 7px 0 ${INK}`}}>$100</div>
          <div style={{position: 'absolute', left: 580, width: 400, top: 990, textAlign: 'center', fontFamily: 'B8', fontSize: 96, color: YEL, textShadow: `0 7px 0 ${INK}`}}>
            <Count to={1497} from={100} at={150} len={60} prefix="$" />
          </div>
          <Huh mood="shocked" x={540} y={1170} h={260} at={190} />
        </>
      )}
    </AbsoluteFill>
  );
};

const JarScene: React.FC = () => {
  const f = useCurrentFrame();
  const drop = interpolate(f, [20, 50], [420, 860], {...clamp, easing: ease});
  const inJar = f > 50;
  return (
    <AbsoluteFill>
      <Pill text="Mia" x={270} y={250} bg={TEAL} at={2} />
      <Person who="mia" x={270} y={360} s={0.9} at={0} />
      <Jar x={720} y={620} fill={inJar ? 1 : 0} />
      {!inJar && <Bill x={720} y={drop} w={180} rot={f * 3} />}
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <Arrow d="M 420 560 Q 560 420 660 560" progress={interpolate(f, [8, 26], [0, 1], clamp)} />
      </svg>
      {f > 70 && <div style={{position: 'absolute', top: 1090, width: '100%', textAlign: 'center', fontFamily: 'B8', fontSize: 84, color: '#fff', textShadow: `0 6px 0 ${INK}`}}>
        $100 <Marker at={80} color={RED}>forever</Marker></div>}
      <Pill text="🔒 safe" x={880} y={560} at={60} bg={SKY} color={INK} size={40} />
    </AbsoluteFill>
  );
};

const PlantScene: React.FC = () => {
  const f = useCurrentFrame();
  const g = interpolate(f, [30, 200], [0.15, 1], {...clamp, easing: ease});
  return (
    <AbsoluteFill>
      <Pill text="Leo" x={270} y={250} bg={ORG} at={2} />
      <Person who="leo" x={270} y={360} s={0.9} at={0} />
      <Plant x={730} y={420} g={g} coins={Math.min(6, Math.floor(f / 30))} />
      <Pill text="+7% a year" x={730} y={1010} at={110} bg={GREEN} size={60} />
      <Pill text="no extra cents 🙅" x={300} y={1010} at={190} bg={PINK} size={42} />
    </AbsoluteFill>
  );
};

const YearOne: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Slam words={['year', '1']} y={170} size={130} />
      <Bar x={340} base={1150} h={520} color={TEAL} to={100} at={10} label="Mia" />
      <Bar x={740} base={1150} h={556} color={ORG} to={107} at={20} label="Leo" />
      <Pill text="+$7 🙄" x={740} y={430} at={70} bg={YEL} color={INK} size={52} />
      {f > 110 && <Person who="mia" x={200} y={1240} s={0.38} mood="meh" at={110} />}
      <Huh mood="laughing" x={900} y={1180} h={220} at={120} />
    </AbsoluteFill>
  );
};

const Snowball: React.FC = () => {
  const f = useCurrentFrame();
  const t = interpolate(f, [10, 280], [0, 1], clamp);
  const r = 40 + 120 * t;
  const bx = 120 + 760 * t, by = 470 + 330 * t;
  const card = (txt: string, y: number, at: number, hl?: boolean) => {
    const s = spring({frame: f - at, fps: FPS, config: {damping: 12}});
    return <div style={{position: 'absolute', left: 120, right: 120, top: y, transform: `scale(${s})`, background: hl ? CREAM : '#ffffff22', color: hl ? INK : '#fff', fontFamily: 'B8', fontSize: 56, textAlign: 'center', borderRadius: 30, padding: '20px 0', boxShadow: `0 10px 0 ${INK}`}}>{txt}</div>;
  };
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <path d="M 0 430 L 1080 960 L 1080 1000 L 0 1000 Z" fill="#ffffff18" />
        <g transform={`translate(${bx} ${by - r}) rotate(${f * 6})`}>
          <circle r={r} fill="#fff" stroke={INK} strokeWidth={10} />
          <text y={r * 0.35} textAnchor="middle" fontFamily="B8" fontSize={r} fill={GREEN}>$</text>
        </g>
      </svg>
      {card('7% of $100 = $7.00', 160, 30)}
      {card('7% of $107 = $7.49', 290, 110, true)}
      {f > 200 && <div style={{position: 'absolute', top: 1080, width: '100%', textAlign: 'center', fontFamily: 'B8', fontSize: 80, color: '#fff', textShadow: `0 6px 0 ${INK}`}}>
        growth <Marker at={210}>grows</Marker> too</div>}
    </AbsoluteFill>
  );
};

const Rule72: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Pill text="the rule of 72" x={540} y={240} at={0} bg={PINK} size={58} />
      <div style={{position: 'absolute', top: 400, width: '100%', textAlign: 'center', fontFamily: 'B8', fontSize: 210, color: '#fff', textShadow: `0 10px 0 ${INK}`}}>
        <span style={{opacity: interpolate(f, [20, 30], [0, 1], clamp)}}>72</span>
        <span style={{color: YEL, opacity: interpolate(f, [60, 70], [0, 1], clamp)}}> ÷ 7</span>
      </div>
      <div style={{position: 'absolute', top: 680, width: '100%', textAlign: 'center', fontFamily: 'B8', fontSize: 120, color: TEAL, textShadow: `0 8px 0 ${INK}`, opacity: interpolate(f, [150, 165], [0, 1], clamp)}}>
        ≈ <Count to={10} at={160} len={40} /> years
      </div>
      <Pill text="to double 💵💵" x={540} y={950} at={240} bg={GREEN} size={56} />
      <Huh mood="thinking" x={880} y={1130} h={240} at={40} />
    </AbsoluteFill>
  );
};

const Doubles: React.FC = () => {
  const vals = [100, 197, 387, 761, 1497];
  const max = 1497, base = 1200, H = 700;
  return (
    <AbsoluteFill>
      <Slam words={['Leo', 'vs', 'Mia']} y={150} size={110} />
      {vals.map((v, i) => (
        <Bar key={i} x={150 + i * 195} base={base} h={Math.max(40, (H * v) / max)} color={i === 4 ? YEL : ORG} to={v} at={10 + i * 45} label={`yr ${i * 10}`} w={130} />
      ))}
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <Arrow d={`M 70 ${base - 47} L 1010 ${base - 47}`} color={TEAL} w={10} progress={interpolate(useCurrentFrame(), [30, 200], [0, 1], clamp)} />
      </svg>
      <Pill text="Mia: still $100" x={300} y={1340} at={200} bg={TEAL} size={42} />
    </AbsoluteFill>
  );
};

const Catch: React.FC = () => {
  const f = useCurrentFrame();
  const pts = Array.from({length: 40}).map((_, i) => {
    const x = 90 + i * 23; const trend = 860 - i * 9; const wob = Math.sin(i * 1.7) * 55 + Math.sin(i * 0.6) * 30;
    return `${x} ${trend + wob}`;
  });
  return (
    <AbsoluteFill>
      <Pill text="the catch" x={540} y={230} at={0} bg={RED} size={58} />
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <path d={'M ' + pts.join(' L ')} fill="none" stroke={YEL} strokeWidth={12} strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray={1}
          strokeDashoffset={1 - interpolate(f, [10, 90], [0, 1], clamp)} />
      </svg>
      <Pill text="ups & downs 📉📈" x={780} y={900} at={60} bg={SKY} color={INK} size={44} />
      <Pill text="no guarantees" x={300} y={360} at={110} bg={PINK} size={44} />
      <div style={{position: 'absolute', left: 120, right: 120, top: 1000, background: CREAM, color: INK, borderRadius: 30, padding: '22px 30px', fontFamily: 'B8', fontSize: 50, textAlign: 'center', boxShadow: `0 10px 0 ${INK}`,
        transform: `scale(${spring({frame: f - 160, fps: FPS, config: {damping: 12}})})`}}>simplified story · not financial advice</div>
      {f > 260 && <Slam words={['time', 'does', 'the', 'lifting']} y={1180} size={78} at={260} gap={5} />}
    </AbsoluteFill>
  );
};

export const scenes: SceneMap = {
  hook: {C: Hook, hue: GREEN},
  jar: {C: JarScene, hue: TEAL},
  plant: {C: PlantScene, hue: ORG},
  yearone: {C: YearOne, hue: YEL},
  snowball: {C: Snowball, hue: SKY},
  rule: {C: Rule72, hue: PINK},
  doubles: {C: Doubles, hue: ORG},
  catch: {C: Catch, hue: RED},
  cta: {C: CTA, hue: PINK},
};
