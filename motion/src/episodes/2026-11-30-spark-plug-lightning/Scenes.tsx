import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, spring, random} from 'remotion';
import {FPS, INK, PINK, YEL, TEAL, ORG, CREAM, SKY, RED, clamp, ease, Slam, Pill, Huh, Arrow, Count, Marker, CTA, Clip, SceneMap} from '../../kit';
import timing from './timing.json';

export const title = 'how a spark plug makes lightning';
export const segs = timing;

const COPPER = '#D9773B', METAL = '#C9D1E3', WIRE = '#B5652E', BLUE = '#7FD3FF';

/** Jagged lightning bolt between two points; jitter changes every few frames. */
const Bolt: React.FC<{x1: number; y1: number; x2: number; y2: number; seed: number; w?: number; color?: string}> = ({x1, y1, x2, y2, seed, w = 8, color = BLUE}) => {
  const n = 7;
  const pts = Array.from({length: n + 1}).map((_, i) => {
    const t = i / n; const j = i === 0 || i === n ? 0 : (random(`${seed}-${i}`) - 0.5) * 40;
    return `${x1 + (x2 - x1) * t + j} ${y1 + (y2 - y1) * t + (i === 0 || i === n ? 0 : (random(`${seed}-y${i}`) - 0.5) * 20)}`;
  });
  return (
    <g>
      <path d={'M ' + pts.join(' L ')} fill="none" stroke={color} strokeWidth={w * 2.6} opacity={0.35} strokeLinejoin="round" />
      <path d={'M ' + pts.join(' L ')} fill="none" stroke="#fff" strokeWidth={w} strokeLinejoin="round" />
    </g>
  );
};

/** Spark plug, tip pointing down. spark 0..1 */
const Plug: React.FC<{spark: number; seed: number; size?: number}> = ({spark, seed, size = 1}) => (
  <svg viewBox="-150 0 300 720" width={300 * size} height={720 * size} style={{overflow: 'visible'}}>
    <rect x={-28} y={0} width={56} height={70} rx={10} fill={METAL} stroke={INK} strokeWidth={8} />
    <path d="M -60 70 L 60 70 L 52 330 L -52 330 Z" fill="#F4F1EA" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
    {[110, 160, 210, 260].map((y) => <line key={y} x1={-58} y1={y} x2={58} y2={y} stroke="#d9d3c4" strokeWidth={10} />)}
    <path d="M -80 330 L 80 330 L 80 420 L -80 420 Z" fill={METAL} stroke={INK} strokeWidth={8} />
    <path d="M -60 420 L 60 420 L 60 560 L -60 560 Z" fill="#9aa3b8" stroke={INK} strokeWidth={8} />
    {[440, 470, 500, 530].map((y) => <line key={y} x1={-60} y1={y} x2={60} y2={y + 12} stroke={INK} strokeWidth={5} />)}
    <rect x={-10} y={560} width={20} height={70} fill={COPPER} stroke={INK} strokeWidth={5} />
    <path d="M 55 560 L 55 690 L -15 690" fill="none" stroke="#9aa3b8" strokeWidth={22} strokeLinecap="round" />
    <path d="M 55 560 L 55 690 L -15 690" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" opacity={0.4} />
    {spark > 0 && (
      <g opacity={spark}>
        <circle cx={0} cy={660} r={70 * spark} fill={BLUE} opacity={0.35} />
        <Bolt x1={0} y1={630} x2={0} y2={680} seed={seed} w={6} />
      </g>
    )}
  </svg>
);

const Coil: React.FC<{field: number; surge: number}> = ({field, surge}) => (
  <svg viewBox="-260 -300 520 600" width={620} height={715} style={{overflow: 'visible'}}>
    <rect x={-40} y={-260} width={80} height={520} rx={16} fill="#5b6178" stroke={INK} strokeWidth={8} />
    {/* thin secondary: many turns */}
    {Array.from({length: 34}).map((_, i) => (
      <ellipse key={'s' + i} cx={0} cy={-235 + i * 14.3} rx={150} ry={16} fill="none" stroke={surge > 0 ? YEL : WIRE} strokeWidth={4} opacity={0.9} />
    ))}
    {/* thick primary: few turns */}
    {Array.from({length: 6}).map((_, i) => (
      <ellipse key={'p' + i} cx={0} cy={-150 + i * 60} rx={70} ry={14} fill="none" stroke={COPPER} strokeWidth={16} />
    ))}
    {field > 0 && [140, 200, 250].map((r, i) => (
      <ellipse key={r} cx={0} cy={0} rx={r * field + 30} ry={290 * field + 20} fill="none" stroke={BLUE} strokeWidth={5} strokeDasharray="14 12" opacity={0.7 - i * 0.15} />
    ))}
  </svg>
);

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Clip name="c0" rate={0.57} dim={0.3} />
      <Slam words={['lightning', 'in', 'your', 'engine']} y={200} size={100} />
      {f > 140 && <Pill text="from just 12 volts 🔋" x={540} y={1300} at={140} bg={YEL} color={INK} size={46} />}
    </AbsoluteFill>
  );
};

const Problem: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Slam words={['12V', '❌']} y={170} size={130} />
      <div style={{position: 'absolute', top: 380, width: '100%', display: 'flex', justifyContent: 'center'}}><Plug spark={0} seed={1} size={1.15} /></div>
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <Arrow d="M 760 1130 Q 700 1150 600 1155" color={YEL} progress={interpolate(f, [40, 70], [0, 1], clamp)} />
      </svg>
      <Pill text="gap ≈ 1 mm" x={860} y={1110} at={40} bg={YEL} color={INK} size={44} />
      <Pill text="need THOUSANDS of volts" x={540} y={1330} at={150} bg={RED} size={44} />
    </AbsoluteFill>
  );
};

const CoilScene: React.FC = () => (
  <AbsoluteFill>
    <Slam words={['ignition', 'coil']} y={160} size={110} />
    <div style={{position: 'absolute', top: 360, width: '100%', display: 'flex', justifyContent: 'center'}}><Coil field={0} surge={0} /></div>
    <Pill text="few thick turns" x={260} y={1150} at={60} bg={ORG} color={INK} size={40} />
    <Pill text="thousands of thin turns" x={760} y={1150} at={130} bg={YEL} color={INK} size={40} />
    <Pill text="= a transformer" x={540} y={1290} at={200} bg={TEAL} color={INK} size={44} />
  </AbsoluteFill>
);

const Collapse: React.FC = () => {
  const f = useCurrentFrame();
  const grow = interpolate(f, [10, 90], [0, 1], {...clamp, easing: ease});
  const cut = 150;
  const field = f < cut ? grow : interpolate(f, [cut, cut + 8], [1, 0], clamp);
  return (
    <AbsoluteFill>
      <Pill text={f < cut ? 'magnetic field builds' : 'switch OFF ✂️ field collapses!'} x={540} y={220} at={0} bg={f < cut ? SKY : RED} color={f < cut ? INK : '#fff'} size={48} />
      <div style={{position: 'absolute', top: 340, width: '100%', display: 'flex', justifyContent: 'center'}}><Coil field={field} surge={0} /></div>
      <AbsoluteFill style={{background: '#fff', opacity: interpolate(f, [cut, cut + 3, cut + 12], [0, 0.4, 0], clamp)}} />
    </AbsoluteFill>
  );
};

const Boost: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 200, width: '100%', textAlign: 'center', fontFamily: 'B8', fontSize: 64, color: CREAM}}>12 V in →</div>
      <div style={{position: 'absolute', top: 300, width: '100%', textAlign: 'center', fontFamily: 'B8', fontSize: 190, color: YEL, textShadow: `0 10px 0 ${INK}, 0 0 60px ${YEL}88`}}>
        <Count to={20000} from={12} at={10} len={70} suffix="+" />
      </div>
      <div style={{position: 'absolute', top: 540, width: '100%', textAlign: 'center', fontFamily: 'B8', fontSize: 70, color: '#fff'}}>volts out ⚡</div>
      <div style={{position: 'absolute', top: 650, width: '100%', display: 'flex', justifyContent: 'center', transform: 'scale(0.8)'}}><Coil field={0} surge={1} /></div>
      <Pill text="often tens of thousands" x={540} y={1330} at={110} bg={PINK} size={42} />
    </AbsoluteFill>
  );
};

const Jump: React.FC = () => {
  const f = useCurrentFrame();
  const spark = f > 60 ? (Math.floor(f / 3) % 4 === 0 ? 0.4 : 1) : 0;
  return (
    <AbsoluteFill>
      <Slam words={['the', 'jump']} y={160} size={120} />
      <div style={{position: 'absolute', top: 340, width: '100%', display: 'flex', justifyContent: 'center'}}><Plug spark={spark} seed={Math.floor(f / 3)} size={1.15} /></div>
      <Pill text="air breaks down → SPARK ⚡" x={540} y={1330} at={80} bg={SKY} color={INK} size={44} />
    </AbsoluteFill>
  );
};

const Fire: React.FC = () => {
  const f = useCurrentFrame();
  const bang = f > 70;
  const py = bang ? interpolate(f, [70, 100], [0, 230], {...clamp, easing: ease}) : 0;
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 600 900" width={600} height={900} style={{position: 'absolute', left: 240, top: 330}}>
        <rect x={100} y={60} width={400} height={60} rx={10} fill="#8C99B5" stroke={INK} strokeWidth={8} />
        <rect x={285} y={0} width={30} height={140} fill="#F4F1EA" stroke={INK} strokeWidth={6} />
        <rect x={120} y={120} width={360} height={Math.max(20, 100 + py)} fill={bang ? ORG : BLUE} opacity={bang ? 0.75 - py / 600 : 0.5} />
        {f > 55 && f < 75 && <Bolt x1={300} y1={140} x2={300} y2={175} seed={f} w={6} />}
        <line x1={120} y1={120} x2={120} y2={620} stroke={INK} strokeWidth={14} />
        <line x1={480} y1={120} x2={480} y2={620} stroke={INK} strokeWidth={14} />
        <rect x={128} y={220 + py} width={344} height={110} rx={10} fill="#C9D1E3" stroke={INK} strokeWidth={10} />
        <rect x={280} y={330 + py} width={40} height={200} fill="#9aa3b8" stroke={INK} strokeWidth={6} />
      </svg>
      {bang && <Slam words={['BANG!']} y={180} size={150} at={70} color={ORG} />}
      <Pill text="exactly the right moment ⏱️" x={540} y={1330} at={20} bg={YEL} color={INK} size={42} />
    </AbsoluteFill>
  );
};

const Weird: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Pill text="coil-on-plug" x={540} y={210} at={0} bg={PINK} size={54} />
      <div style={{position: 'absolute', top: 320, width: '100%', display: 'flex', justifyContent: 'center', gap: 20}}>
        {[0, 1, 2, 3].map((i) => {
          const s = spring({frame: f - 20 - i * 15, fps: FPS, config: {damping: 11}});
          const on = Math.floor(f / 8) % 4 === i && f > 90;
          return (
            <div key={i} style={{transform: `scale(${s})`, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <div style={{width: 120, height: 170, background: '#2f3247', border: `7px solid ${INK}`, borderRadius: 18, boxShadow: on ? `0 0 40px ${YEL}` : undefined}} />
              <Plug spark={on ? 1 : 0} seed={f + i} size={0.42} />
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', top: 1060, width: '100%', textAlign: 'center', fontFamily: 'B8', fontSize: 64, color: '#fff'}}>
        4 tiny <Marker at={150} color={BLUE}>lightning machines</Marker>
      </div>
      <Huh mood="laughing" x={880} y={1180} h={200} at={170} />
    </AbsoluteFill>
  );
};

export const scenes: SceneMap = {
  hook: {C: Hook, hue: ORG},
  problem: {C: Problem, hue: RED},
  coil: {C: CoilScene, hue: ORG},
  collapse: {C: Collapse, hue: SKY},
  boost: {C: Boost, hue: YEL},
  jump: {C: Jump, hue: SKY},
  fire: {C: Fire, hue: ORG},
  weird: {C: Weird, hue: PINK},
  cta: {C: CTA, hue: PINK},
};
