import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, spring} from 'remotion';
import {FPS, INK, PINK, YEL, TEAL, ORG, CREAM, SKY, RED, clamp, ease, Slam, Pill, Huh, Arrow, Count, Marker, Counter, CTA, SceneMap} from '../../kit';
import timing from './timing.json';

export const title = "how your car's engine actually works";
export const segs = timing;

const METAL = '#B8C2D6', METAL2 = '#8C99B5', STEEL = '#6E7A96', MIST = '#7FD3FF', FIRE = '#FF7A2F', SMOKE = '#9A9AB0';
const R = 70, L = 230; // crank radius, rod length (svg units)

/** Piston pin height above crank centre for crank angle th (deg, 0 = top). */
const pinY = (th: number) => {
  const a = (th * Math.PI) / 180;
  return R * Math.cos(a) + Math.sqrt(L * L - (R * Math.sin(a)) ** 2);
};
const phase = (th: number) => (((th % 720) + 720) % 720);

/** Cross-section of one cylinder. th = crank angle 0..720 (0 = top before intake). */
const Engine: React.FC<{th: number; w?: number; labels?: boolean; spark?: number; showCrank?: boolean}> = ({th, w = 620, labels, spark = 0, showCrank = true}) => {
  const f = useCurrentFrame();
  const p = phase(th);
  const cx = 300, cy = 700;
  const a = (p * Math.PI) / 180;
  const crankX = cx + R * Math.sin(a), crankY = cy - R * Math.cos(a);
  const py = cy - pinY(p); // pin y
  const pistonTop = py - 70;
  const chamberTop = 130;
  const intakeOpen = p < 180 ? Math.sin((p / 180) * Math.PI) : 0;
  const exhaustOpen = p >= 540 ? Math.sin(((p - 540) / 180) * Math.PI) : 0;
  const gasH = pistonTop - chamberTop;
  // gas look by stroke
  const stroke = Math.floor(p / 180);
  const gasColor = stroke === 0 || stroke === 1 ? MIST : stroke === 2 ? FIRE : SMOKE;
  const gasOp = stroke === 0 ? 0.25 + 0.5 * (p / 180) : stroke === 1 ? 0.75 + 0.2 * ((p - 180) / 180) : stroke === 2 ? 0.9 - 0.4 * ((p - 360) / 180) : 0.5 * (1 - (p - 540) / 180);
  const dots = Array.from({length: 26}).map((_, i) => ({
    x: 175 + ((i * 47) % 250), y: chamberTop + 15 + (((i * 83) % 100) / 100) * Math.max(10, gasH - 30) + Math.sin(f / 5 + i) * 6,
  }));
  return (
    <svg viewBox="0 0 600 860" width={w} height={(w * 860) / 600} style={{overflow: 'visible'}}>
      {/* head + ports */}
      <rect x={120} y={60} width={360} height={70} rx={12} fill={METAL2} stroke={INK} strokeWidth={10} />
      <path d={`M 40 40 L 190 40 L 200 128`} fill="none" stroke={MIST} strokeWidth={34} strokeLinecap="round" opacity={0.85} />
      <path d={`M 560 40 L 410 40 L 400 128`} fill="none" stroke={SMOKE} strokeWidth={34} strokeLinecap="round" opacity={0.85} />
      {/* valves */}
      <g transform={`translate(0 ${intakeOpen * 26})`}>
        <rect x={192} y={60} width={14} height={66} fill={STEEL} stroke={INK} strokeWidth={4} /><rect x={168} y={118} width={62} height={14} rx={6} fill={STEEL} stroke={INK} strokeWidth={5} />
      </g>
      <g transform={`translate(0 ${exhaustOpen * 26})`}>
        <rect x={394} y={60} width={14} height={66} fill={STEEL} stroke={INK} strokeWidth={4} /><rect x={370} y={118} width={62} height={14} rx={6} fill={STEEL} stroke={INK} strokeWidth={5} />
      </g>
      {/* spark plug */}
      <rect x={290} y={20} width={20} height={110} fill="#eee" stroke={INK} strokeWidth={5} />
      {spark > 0 && (
        <g opacity={spark}>
          <path d="M 300 132 L 285 155 L 305 160 L 290 185" fill="none" stroke={YEL} strokeWidth={8} strokeLinejoin="round" />
          <circle cx={300} cy={150} r={40 * spark} fill={YEL} opacity={0.5} />
        </g>
      )}
      {/* cylinder walls */}
      <rect x={150} y={130} width={300} height={460} fill="#ffffff10" />
      {/* gas */}
      <rect x={150} y={chamberTop} width={300} height={Math.max(0, gasH)} fill={gasColor} opacity={gasOp * 0.55} />
      {stroke !== 2 && dots.filter((d) => d.y < pistonTop - 8).map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={7} fill={gasColor} opacity={gasOp} />)}
      <line x1={150} y1={130} x2={150} y2={590} stroke={INK} strokeWidth={14} />
      <line x1={450} y1={130} x2={450} y2={590} stroke={INK} strokeWidth={14} />
      {/* rod + crank */}
      {showCrank && (
        <>
          <circle cx={cx} cy={cy} r={R + 34} fill={METAL2} stroke={INK} strokeWidth={10} />
          <line x1={cx} y1={cy} x2={crankX} y2={crankY} stroke={STEEL} strokeWidth={34} strokeLinecap="round" />
        </>
      )}
      <line x1={cx} y1={py} x2={crankX} y2={crankY} stroke={METAL} strokeWidth={30} strokeLinecap="round" />
      <line x1={cx} y1={py} x2={crankX} y2={crankY} stroke={INK} strokeWidth={6} strokeLinecap="round" opacity={0.25} />
      <circle cx={crankX} cy={crankY} r={14} fill={INK} />
      {/* piston */}
      <rect x={158} y={pistonTop} width={284} height={110} rx={10} fill={METAL} stroke={INK} strokeWidth={10} />
      <line x1={160} y1={pistonTop + 22} x2={440} y2={pistonTop + 22} stroke={INK} strokeWidth={5} />
      <line x1={160} y1={pistonTop + 38} x2={440} y2={pistonTop + 38} stroke={INK} strokeWidth={5} />
      <circle cx={cx} cy={py} r={16} fill={INK} />
      {labels && (
        <g fontFamily="B8" fontSize={34} fill="#fff">
          <text x={-10} y={20}>air + fuel</text>
          <text x={470} y={20}>exhaust</text>
        </g>
      )}
    </svg>
  );
};

const Center: React.FC<{y: number; children: React.ReactNode}> = ({y, children}) => (
  <div style={{position: 'absolute', top: y, width: '100%', display: 'flex', justifyContent: 'center'}}>{children}</div>
);

/* ---------- scenes ---------- */

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const th = f * 24;
  const p = phase(th);
  const spark = p >= 360 && p < 420 ? 1 - (p - 360) / 60 : 0;
  return (
    <AbsoluteFill>
      <Slam words={['thousands', 'of', 'explosions']} y={150} size={100} />
      <Center y={420}><Engine th={th} w={500} spark={spark} /></Center>
      <Pill text="per minute 🔥" x={850} y={560} at={50} bg={RED} size={44} />
      <Pill text="on purpose" x={230} y={700} at={110} bg={YEL} color={INK} size={44} />
      <div style={{position: 'absolute', left: 820, top: 1150, fontSize: 120, transform: `scale(${spring({frame: f - 200, fps: FPS, config: {damping: 10}})})`}}>🌮</div>
      <Huh mood="shocked" x={170} y={1130} h={240} at={150} />
    </AbsoluteFill>
  );
};

const Parts: React.FC = () => {
  const f = useCurrentFrame();
  const th = 90 + Math.sin(f / 18) * 90;
  return (
    <AbsoluteFill>
      <Pill text="cylinder" x={540} y={220} at={0} bg={TEAL} size={52} />
      <Center y={300}><Engine th={th} w={560} showCrank={false} /></Center>
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <Arrow d="M 960 980 Q 900 900 800 880" progress={interpolate(f, [70, 95], [0, 1], clamp)} color={YEL} />
      </svg>
      <Pill text="piston" x={930} y={1020} at={70} bg={PINK} size={52} />
      <div style={{position: 'absolute', left: 60, top: 1160, fontSize: 110, transform: `rotate(-20deg) scale(${spring({frame: f - 150, fps: FPS, config: {damping: 10}})})`}}>💉</div>
      <Pill text="like a syringe" x={330} y={1230} at={160} bg={SKY} color={INK} size={40} />
    </AbsoluteFill>
  );
};

const Step: React.FC<{n: number; word: string; from: number; to: number; color: string; note: string; spark?: boolean}> = ({n, word, from, to, color, note, spark}) => {
  const f = useCurrentFrame();
  const th = interpolate(f, [25, 125], [from, to], {...clamp, easing: ease});
  const sp = spark ? interpolate(f, [18, 24, 40], [0, 1, 0], clamp) : 0;
  return (
    <AbsoluteFill>
      <Counter n={n} of={4} y={120} color={color} />
      <Slam words={[word]} y={200} size={150} color={color} />
      <Center y={400}><Engine th={th} w={600} labels={n === 1 || n === 4} spark={sp} /></Center>
      <Pill text={note} x={540} y={1330} at={60} bg={color} color={INK} size={44} />
    </AbsoluteFill>
  );
};
const Intake: React.FC = () => <Step n={1} word="suck" from={0} to={180} color={MIST} note="valve open, piston down" />;
const Squeeze: React.FC = () => <Step n={2} word="squeeze" from={180} to={355} color={TEAL} note="valves shut, mist crushed" />;
const Bang: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Step n={3} word="bang!" from={360} to={540} color={FIRE} note="the ONLY power step ⚡" spark />
      <AbsoluteFill style={{background: '#fff', opacity: interpolate(f, [18, 22, 30], [0, 0.35, 0], clamp)}} />
    </AbsoluteFill>
  );
};
const Blow: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Step n={4} word="blow" from={540} to={720} color={SMOKE} note="burnt gas pushed out" />
      {f > 150 && <Slam words={['suck', 'squeeze', 'bang', 'blow']} y={1180} size={70} at={150} gap={6} />}
    </AbsoluteFill>
  );
};

const Crank: React.FC = () => {
  const f = useCurrentFrame();
  const th = f * 10;
  const a = (f * 10 * Math.PI) / 180;
  return (
    <AbsoluteFill>
      <Pill text="crankshaft" x={540} y={200} at={0} bg={PINK} size={52} />
      <div style={{position: 'absolute', left: 20, top: 300}}><Engine th={th} w={500} /></div>
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <Arrow d="M 500 900 L 600 900" progress={interpolate(f, [90, 110], [0, 1], clamp)} color={YEL} />
      </svg>
      {/* bike pedal analogy */}
      <svg viewBox="0 0 400 400" width={400} height={400} style={{position: 'absolute', left: 620, top: 700, opacity: interpolate(f, [150, 170], [0, 1], clamp)}}>
        <circle cx={200} cy={200} r={120} fill="none" stroke="#fff" strokeWidth={10} strokeDasharray="18 14" />
        <circle cx={200} cy={200} r={40} fill={METAL2} stroke={INK} strokeWidth={8} />
        <line x1={200} y1={200} x2={200 + 110 * Math.sin(a)} y2={200 - 110 * Math.cos(a)} stroke={ORG} strokeWidth={22} strokeLinecap="round" />
        <rect x={200 + 110 * Math.sin(a) - 34} y={200 - 110 * Math.cos(a) - 12} width={68} height={24} rx={6} fill={INK} />
        <line x1={200} y1={200} x2={200 - 110 * Math.sin(a)} y2={200 + 110 * Math.cos(a)} stroke={ORG} strokeWidth={22} strokeLinecap="round" />
      </svg>
      <Pill text="like bike pedals 🚲" x={820} y={1160} at={170} bg={YEL} color={INK} size={40} />
      <Pill text="up-down → spin" x={300} y={1300} at={100} bg={TEAL} color={INK} size={44} />
    </AbsoluteFill>
  );
};

const MathScene: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Pill text="1 fire every 2 turns" x={540} y={190} at={0} bg={PINK} size={46} />
      <div style={{position: 'absolute', top: 260, width: '100%', display: 'flex', justifyContent: 'center', gap: 6}}>
        {[0, 180, 540, 360].map((off, i) => {
          const th = f * 30 + off; const p = phase(th);
          return <Engine key={i} th={th} w={230} spark={p >= 360 && p < 420 ? 1 - (p - 360) / 60 : 0} showCrank />;
        })}
      </div>
      <div style={{position: 'absolute', top: 680, width: '100%', textAlign: 'center', fontFamily: 'B8', fontSize: 54, color: CREAM}}>
        4 cylinders × 2,000 RPM ÷ 2
      </div>
      <div style={{position: 'absolute', top: 780, width: '100%', textAlign: 'center', fontFamily: 'B8', fontSize: 150, color: YEL, textShadow: `0 10px 0 ${INK}`, opacity: interpolate(f, [120, 130], [0, 1], clamp)}}>
        <Count to={4000} at={125} len={50} />
      </div>
      <div style={{position: 'absolute', top: 960, width: '100%', textAlign: 'center', fontFamily: 'B8', fontSize: 56, color: '#fff', opacity: interpolate(f, [150, 160], [0, 1], clamp)}}>fires per minute</div>
      <Pill text="≈ 66 bangs a second 💥" x={540} y={1150} at={250} bg={RED} size={50} />
    </AbsoluteFill>
  );
};

const Wheels: React.FC = () => {
  const f = useCurrentFrame();
  const box = (txt: string, x: number, y: number, at: number, bg: string) => (
    <div style={{position: 'absolute', left: x - 150, top: y, width: 300, padding: '18px 0', textAlign: 'center', background: bg, color: INK, fontFamily: 'B8', fontSize: 46, borderRadius: 26,
      boxShadow: `0 10px 0 ${INK}`, transform: `scale(${spring({frame: f - at, fps: FPS, config: {damping: 12}})})`}}>{txt}</div>
  );
  return (
    <AbsoluteFill>
      {box('engine 🔥', 540, 200, 0, ORG)}
      {box('gearbox ⚙️', 540, 430, 40, TEAL)}
      {box('wheels', 540, 660, 80, YEL)}
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <Arrow d="M 540 300 L 540 420" progress={interpolate(f, [20, 40], [0, 1], clamp)} color="#fff" />
        <Arrow d="M 540 530 L 540 650" progress={interpolate(f, [60, 80], [0, 1], clamp)} color="#fff" />
        {/* car */}
        <g transform={`translate(${interpolate(f, [100, 230], [-450, 1200], clamp)} 0)`}>
          <path d="M 40 1060 L 80 960 Q 100 930 140 930 L 300 930 Q 340 930 370 960 L 420 1010 L 470 1020 Q 500 1025 500 1060 L 500 1080 L 40 1080 Z" fill={PINK} stroke={INK} strokeWidth={10} strokeLinejoin="round" />
          <path d="M 120 1000 L 150 950 L 220 950 L 220 1000 Z M 250 1000 L 250 950 L 310 950 L 350 1000 Z" fill={SKY} stroke={INK} strokeWidth={6} />
          {[140, 400].map((cx) => (
            <g key={cx} transform={`translate(${cx} 1080) rotate(${f * 14})`}>
              <circle r={48} fill={INK} /><circle r={20} fill={METAL} /><line x1={-34} y1={0} x2={34} y2={0} stroke={METAL} strokeWidth={6} />
            </g>
          ))}
        </g>
      </svg>
      {f > 150 && <Slam words={['tiny', 'fires', '→', 'smooth', 'ride']} y={1230} size={70} at={150} gap={5} />}
    </AbsoluteFill>
  );
};

export const scenes: SceneMap = {
  hook: {C: Hook, hue: FIRE},
  parts: {C: Parts, hue: SKY},
  intake: {C: Intake, hue: MIST},
  squeeze: {C: Squeeze, hue: TEAL},
  bang: {C: Bang, hue: RED},
  blow: {C: Blow, hue: SMOKE},
  crank: {C: Crank, hue: PINK},
  math: {C: MathScene, hue: YEL},
  wheels: {C: Wheels, hue: ORG},
  cta: {C: CTA, hue: PINK},
};
