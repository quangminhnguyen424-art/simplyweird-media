import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, spring, Easing} from 'remotion';
import {FPS, INK, PINK, YEL, TEAL, ORG, CREAM, SKY, clamp, ease, Slam, Pill, Huh, Arrow, CTA, SceneMap} from '../../kit';
import timing from './timing.json';

export const title = 'why cats land on their feet';
export const segs = timing;

/** Flat vector cat. The front half (head + front legs) and back half (body + back legs + tail) rotate separately. */
const Cat: React.FC<{front?: number; back?: number; tuckFront?: number; tuckBack?: number; spread?: number; color?: string; scale?: number}> =
  ({front = 0, back = 0, tuckFront = 0, tuckBack = 0, spread = 0, color = ORG, scale = 1}) => {
  const leg = (x: number, tuck: number, side: number) => {
    const len = 70 - tuck * 40 + spread * 20; const ang = (side * (spread * 55)) * Math.PI / 180;
    return <rect x={x - 13} y={18} width={26} height={len} rx={13} fill={color} stroke={INK} strokeWidth={7} transform={`rotate(${side * spread * 55} ${x} 22)`} />;
  };
  return (
    <svg viewBox="-260 -200 520 400" width={520 * scale} height={400 * scale} style={{overflow: 'visible'}}>
      <g transform={`rotate(${back})`}>
        {leg(-95, tuckBack, -1)}{leg(-55, tuckBack, -1)}
        <path d="M -120 -10 C -200 -40 -210 -130 -160 -150" fill="none" stroke={INK} strokeWidth={34} strokeLinecap="round" />
        <path d="M -120 -10 C -200 -40 -210 -130 -160 -150" fill="none" stroke={color} strokeWidth={20} strokeLinecap="round" />
        <ellipse cx={-60} cy={0} rx={85} ry={52} fill={color} stroke={INK} strokeWidth={8} />
        <path d="M -95 -40 l 16 30 M -65 -48 l 14 32" stroke={INK} strokeWidth={8} strokeLinecap="round" opacity={0.35} />
      </g>
      <g transform={`rotate(${front})`}>
        {leg(40, tuckFront, 1)}{leg(78, tuckFront, 1)}
        <ellipse cx={50} cy={0} rx={70} ry={48} fill={color} stroke={INK} strokeWidth={8} />
        <g transform="translate(125,-40)">
          <path d="M -48 -30 L -40 -92 L -6 -48 Z M 48 -30 L 40 -92 L 6 -48 Z" fill={color} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
          <circle r={62} fill={color} stroke={INK} strokeWidth={8} />
          <circle cx={-22} cy={-6} r={9} fill={INK} /><circle cx={22} cy={-6} r={9} fill={INK} />
          <path d="M -10 16 q 10 10 20 0" stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />
          <path d="M -60 10 h -36 M -60 24 h -32 M 60 10 h 36 M 60 24 h 32" stroke={INK} strokeWidth={4} strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
};

/* ---------- scenes ---------- */
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const fall = interpolate(f, [0, 70], [-500, 560], {...clamp, easing: Easing.in(Easing.quad)});
  const flip = interpolate(f, [18, 52], [180, 0], {...clamp, easing: ease});
  const land = spring({frame: f - 70, fps: FPS, config: {damping: 7, stiffness: 200}});
  const squash = f > 70 ? 1 - 0.18 * Math.sin(Math.min(1, (f - 70) / 10) * Math.PI) : 1;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 280, top: fall, transform: `rotate(${flip}deg) scale(1,${squash})`, transformOrigin: '50% 80%'}}>
        <Cat front={0} back={0} tuckFront={f < 50 ? 0.6 : 0} />
      </div>
      <div style={{position: 'absolute', left: 140, top: 960, width: 800, height: 16, borderRadius: 8, background: '#ffffff33'}} />
      {f > 70 && Array.from({length: 8}).map((_, i) => {
        const p = Math.min(1, (f - 70) / 18);
        return <div key={i} style={{position: 'absolute', left: 540 + Math.cos(i) * 300 * p * (i % 2 ? 1 : -1), top: 950 - p * 60 * (i % 3), width: 22, height: 22, borderRadius: 11, background: '#fff', opacity: 1 - p}} />;
      })}
      <Slam words={['EVERY.', 'SINGLE.', 'TIME?']} at={40} y={1010} size={118} />
      <Pill text="...almost 😅" x={540} y={1330} at={120} bg={TEAL} />
    </AbsoluteFill>
  );
};

const Film: React.FC = () => {
  const f = useCurrentFrame();
  const slide = interpolate(f, [0, 260], [0, -900], clamp);
  const year = Math.round(interpolate(f, [0, 40], [1800, 1894], {...clamp, easing: ease}));
  return (
    <AbsoluteFill style={{filter: 'sepia(0.55)'}}>
      <div style={{position: 'absolute', top: 160, width: '100%', textAlign: 'center', fontFamily: 'B8', fontSize: 230, color: CREAM, textShadow: `0 12px 0 ${INK}`}}>{year}</div>
      <div style={{position: 'absolute', top: 560, left: 60 + slide, display: 'flex', gap: 0, background: '#111', padding: '40px 0', borderTop: '6px solid #333', borderBottom: '6px solid #333'}}>
        {Array.from({length: 10}).map((_, i) => (
          <div key={i} style={{width: 300, height: 360, margin: '0 18px', background: '#e9dfc8', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden'}}>
            <div style={{transform: `rotate(${180 - i * 22}deg)`}}><Cat scale={0.5} color="#8a6b3f" tuckFront={i < 4 ? 0.6 : 0} /></div>
            <div style={{position: 'absolute', bottom: 8, right: 14, fontFamily: 'B6', fontSize: 30, color: '#6b5a3c'}}>{i + 1}</div>
          </div>
        ))}
      </div>
      <Pill text="12 frames per second 🎞️" x={540} y={1080} at={60} bg={YEL} color={INK} />
      <Pill text="Étienne-Jules Marey" x={540} y={1200} at={30} bg={PINK} size={40} />
    </AbsoluteFill>
  );
};

const Puzzle: React.FC = () => {
  const f = useCurrentFrame();
  const glow = 0.6 + 0.4 * Math.sin(f / 5);
  const rot = interpolate(f, [70, 150], [180, 0], {...clamp, easing: ease});
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 170, width: '100%', textAlign: 'center', fontFamily: 'B8', fontSize: 120, color: TEAL, textShadow: `0 0 ${40 * glow}px ${TEAL}`}}>spin = 0 ?</div>
      <svg width={1080} height={700} style={{position: 'absolute', top: 360}}>
        <circle cx={540} cy={340} r={250} fill="none" stroke="#ffffff22" strokeWidth={10} strokeDasharray="30 22" style={{transform: `rotate(${f}deg)`, transformOrigin: '540px 340px'}} />
        <Arrow d="M 330 200 A 250 250 0 0 1 760 220" progress={interpolate(f, [80, 140], [0, 1], clamp)} color={YEL} />
      </svg>
      <div style={{position: 'absolute', left: 280, top: 480, transform: `rotate(${rot}deg)`}}><Cat tuckFront={0.5} /></div>
      <Slam words={['?!']} at={30} y={1060} size={220} color={PINK} />
      <Huh mood="shocked" x={860} y={1000} h={380} at={20} />
    </AbsoluteFill>
  );
};

const Spine: React.FC = () => {
  const f = useCurrentFrame();
  const n = Math.round(interpolate(f, [10, 70], [0, 30], clamp));
  return (
    <AbsoluteFill>
      <Slam words={['BENDY', 'BODY']} at={0} y={160} size={150} />
      <svg width={1080} height={700} style={{position: 'absolute', top: 470}}>
        {Array.from({length: 30}).map((_, i) => {
          const x = 90 + i * 31; const y = 300 + Math.sin(i / 3 + f / 7) * 120 * Math.min(1, f / 60);
          const p = interpolate(f - 10 - i * 2, [0, 8], [0, 1], clamp);
          const a = Math.cos(i / 3 + f / 7) * 25;
          return <rect key={i} x={x - 13} y={y - 40} width={26} height={80} rx={10} fill={i % 2 ? CREAM : '#fff'} stroke={INK} strokeWidth={5} opacity={p} transform={`rotate(${a} ${x} ${y})`} />;
        })}
      </svg>
      <div style={{position: 'absolute', top: 400, width: '100%', textAlign: 'center', fontFamily: 'B8', fontSize: 96, color: YEL}}>≈ {n} vertebrae</div>
      <Pill text="no locked collarbone 🔓" x={540} y={1250} at={120} bg={PINK} />
      <Huh mood="laughing" x={900} y={1000} h={300} at={150} />
    </AbsoluteFill>
  );
};

const Twist: React.FC = () => {
  const f = useCurrentFrame();
  const p1 = interpolate(f, [40, 120], [0, 1], {...clamp, easing: ease});
  const p2 = interpolate(f, [170, 250], [0, 1], {...clamp, easing: ease});
  const front = 180 - 180 * p1;
  const back = 180 - 20 * p1 - 160 * p2;
  return (
    <AbsoluteFill>
      <Slam words={['TUCK', '&', 'TURN']} at={0} y={150} size={140} />
      <div style={{position: 'absolute', left: 280, top: 600, transform: `rotate(${0}deg)`}}>
        <Cat front={front} back={back} tuckFront={1 - p1 + p2 * 0} tuckBack={p1} />
      </div>
      <svg width={1080} height={1920} style={{position: 'absolute', top: 0}}>
        <Arrow d="M 720 600 A 220 220 0 0 1 760 980" progress={p1} color={YEL} />
        <Arrow d="M 330 1000 A 220 220 0 0 1 300 620" progress={p2} color={TEAL} />
      </svg>
      <Pill text="front: tucked → spins fast" x={540} y={470} at={45} bg={YEL} color={INK} size={42} />
      <Pill text="back: barely moves (~10°)" x={540} y={1150} at={90} bg="#ffffff" color={INK} size={42} />
      <Pill text="then SWAP! 🔄" x={540} y={1270} at={170} bg={TEAL} size={50} />
    </AbsoluteFill>
  );
};

const Kitten: React.FC = () => {
  const f = useCurrentFrame();
  const w = interpolate(f, [10, 130], [0, 7], {...clamp, easing: ease});
  const x = 120 + (w / 9) * 840;
  return (
    <AbsoluteFill>
      <Slam words={['KITTENS', 'LEARN', 'FAST']} at={0} y={180} size={120} />
      <div style={{position: 'absolute', left: 120, top: 900, width: 840, height: 34, borderRadius: 17, background: '#ffffff22'}} />
      <div style={{position: 'absolute', left: 120, top: 900, width: (w / 9) * 840, height: 34, borderRadius: 17, background: `linear-gradient(90deg, ${TEAL}, ${YEL})`}} />
      {[0, 3, 4, 7, 9].map((k) => (
        <div key={k} style={{position: 'absolute', left: 120 + (k / 9) * 840, top: 950, transform: 'translateX(-50%)', fontFamily: 'B6', fontSize: 40, color: '#fff'}}>{k}w</div>
      ))}
      <div style={{position: 'absolute', left: x - 110, top: 700, transform: `rotate(${Math.sin(f / 4) * 5}deg)`}}><Cat scale={0.42} color={CREAM} /></div>
      <Pill text="3–4 weeks: first tries" x={540} y={1110} at={50} bg={TEAL} size={44} />
      <Pill text="~7 weeks: nailed it 🏆" x={540} y={1230} at={110} bg={YEL} color={INK} size={44} />
    </AbsoluteFill>
  );
};

const Chute: React.FC = () => {
  const f = useCurrentFrame();
  const spread = interpolate(f, [10, 50], [0, 1], {...clamp, easing: ease});
  const bar = (v: number, at: number) => interpolate(f, [at, at + 45], [0, v], {...clamp, easing: ease});
  return (
    <AbsoluteFill>
      <Slam words={['TINY', 'PARACHUTE']} at={0} y={150} size={120} />
      {Array.from({length: 9}).map((_, i) => (
        <div key={i} style={{position: 'absolute', left: 150 + i * 95, top: ((f * 18 + i * 140) % 700) + 380, width: 8, height: 90, borderRadius: 4, background: '#ffffff55'}} />
      ))}
      <div style={{position: 'absolute', left: 280, top: 470, transform: `rotate(180deg) translateY(${Math.sin(f / 5) * 10}px)`}}><Cat spread={spread} /></div>
      <div style={{position: 'absolute', left: 140, top: 940, fontFamily: 'B8', fontSize: 46, color: '#fff'}}>🐱 cat</div>
      <div style={{position: 'absolute', left: 140, top: 1000, height: 70, width: bar(400, 70), background: TEAL, borderRadius: 14}} />
      <div style={{position: 'absolute', left: 160 + bar(400, 70), top: 1000, fontFamily: 'B8', fontSize: 56, color: TEAL}}>{Math.round(bar(60, 70))} mph</div>
      <div style={{position: 'absolute', left: 140, top: 1100, fontFamily: 'B8', fontSize: 46, color: '#fff'}}>🧍 person</div>
      <div style={{position: 'absolute', left: 140, top: 1160, height: 70, width: bar(700, 180), background: PINK, borderRadius: 14}} />
      <div style={{position: 'absolute', left: 160 + Math.min(bar(700, 180), 560), top: 1240, fontFamily: 'B8', fontSize: 56, color: PINK}}>{Math.round(bar(120, 180))} mph</div>
    </AbsoluteFill>
  );
};

const Safety: React.FC = () => {
  const f = useCurrentFrame();
  const pulse = 1 + 0.06 * Math.sin(f / 4);
  const draw = interpolate(f, [120, 200], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <g transform={`translate(540 430) scale(${pulse * spring({frame: f, fps: FPS, config: {damping: 9}})})`}>
          <path d="M 0 -190 L 200 160 L -200 160 Z" fill={YEL} stroke={INK} strokeWidth={18} strokeLinejoin="round" />
          <rect x={-16} y={-90} width={32} height={150} rx={16} fill={INK} /><circle cy={110} r={20} fill={INK} />
        </g>
        <rect x={300} y={760} width={480} height={420} rx={20} fill="#ffffff10" stroke="#fff" strokeWidth={14} />
        {Array.from({length: 8}).map((_, i) => (
          <line key={i} x1={300 + i * 60} y1={760} x2={300 + i * 60} y2={760 + 420 * draw} stroke={TEAL} strokeWidth={5} />
        ))}
        {Array.from({length: 7}).map((_, i) => (
          <line key={'h' + i} x1={300} y1={760 + i * 60} x2={300 + 480 * draw} y2={760 + i * 60} stroke={TEAL} strokeWidth={5} />
        ))}
      </svg>
      <Pill text="high-rise syndrome" x={540} y={700} at={60} bg={PINK} size={50} />
      <Pill text="screen your windows ✅" x={540} y={1260} at={200} bg={TEAL} size={50} />
      <Huh mood="thinking" x={880} y={980} h={300} at={30} />
    </AbsoluteFill>
  );
};

export const scenes: SceneMap = {
  hook: {C: Hook, hue: ORG}, film: {C: Film, hue: '#b08850'}, puzzle: {C: Puzzle, hue: TEAL}, spine: {C: Spine, hue: PINK},
  twist: {C: Twist, hue: YEL}, kitten: {C: Kitten, hue: TEAL}, chute: {C: Chute, hue: SKY}, safety: {C: Safety, hue: '#ff4040'}, cta: {C: CTA, hue: PINK},
};
