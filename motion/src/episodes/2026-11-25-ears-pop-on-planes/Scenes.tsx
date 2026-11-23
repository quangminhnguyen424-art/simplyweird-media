import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, spring, Easing, random} from 'remotion';
import {FPS, INK, PINK, YEL, TEAL, ORG, CREAM, SKY, RED, clamp, ease, Slam, Pill, Huh, Arrow, Count, CTA, SceneMap} from '../../kit';
import timing from './timing.json';

export const title = 'why your ears pop on a plane';
export const segs = timing;

const SKIN = '#F2B38B', SKIN2 = '#D98E68', CAVE = '#4A2340', MID = '#7A3460';

/* ---------- illustrations ---------- */

/** Flat side-view airliner, facing right. */
const Plane: React.FC<{w?: number; color?: string}> = ({w = 520, color = '#fff'}) => (
  <svg viewBox="-260 -110 520 220" width={w} height={(w * 220) / 520} style={{overflow: 'visible'}}>
    <path d="M -150 -10 L -205 -95 L -165 -95 L -95 -18 Z" fill={PINK} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
    <path d="M -230 -18 Q -240 22 -200 30 L 180 30 Q 250 28 250 0 Q 245 -30 180 -32 L -200 -32 Q -225 -30 -230 -18 Z" fill={color} stroke={INK} strokeWidth={9} strokeLinejoin="round" />
    <path d="M 205 -22 Q 232 -18 238 -2 L 205 -2 Z" fill={SKY} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    {Array.from({length: 9}).map((_, i) => <circle key={i} cx={-140 + i * 36} cy={-10} r={8} fill={SKY} stroke={INK} strokeWidth={4} />)}
    <path d="M -40 10 L 60 10 L -10 90 L -60 90 Z" fill={TEAL} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
  </svg>
);

/** Cross-section of the ear: canal (left), eardrum, middle ear, Eustachian tube down to the throat.
 * bulge: +1 drum pushed out toward the canal, -1 pushed in. open: tube width 0..1. flow: dots running through the tube (+ up/out of ear, - into ear). */
const EarSection: React.FC<{bulge?: number; open?: number; flow?: number; dotsIn?: number; dotsOut?: number; drawTube?: number; labels?: boolean; glow?: number}> =
  ({bulge = 0, open = 0, flow = 0, dotsIn = 12, dotsOut = 12, drawTube = 1, labels = false, glow = 0}) => {
  const f = useCurrentFrame();
  // tube: quadratic bezier P0 -> P2 with control P1
  const P0 = [640, 470], P1 = [700, 640], P2 = [900, 760];
  const at = (t: number) => [(1 - t) ** 2 * P0[0] + 2 * (1 - t) * t * P1[0] + t * t * P2[0], (1 - t) ** 2 * P0[1] + 2 * (1 - t) * t * P1[1] + t * t * P2[1]];
  const tubeD = `M ${P0[0]} ${P0[1]} Q ${P1[0]} ${P1[1]} ${P2[0]} ${P2[1]}`;
  const dx = -80 * bulge;
  return (
    <svg viewBox="0 0 1000 860" width={1000} height={860} style={{overflow: 'visible'}}>
      {/* head tissue */}
      <path d="M 120 120 Q 560 40 980 140 L 980 860 L 120 860 Z" fill={SKIN} stroke={INK} strokeWidth={10} />
      {/* outer ear flap */}
      <path d="M 150 160 Q 0 220 20 380 Q 40 560 170 590 Q 120 470 140 380 Z" fill={SKIN2} stroke={INK} strokeWidth={10} strokeLinejoin="round" />
      {/* canal */}
      <path d="M 40 320 L 420 320 L 420 450 L 40 450 Z" fill={CAVE} stroke={INK} strokeWidth={10} strokeLinejoin="round" />
      {/* middle ear */}
      <ellipse cx={560} cy={385} rx={145} ry={120} fill={MID} stroke={INK} strokeWidth={10} />
      {/* tiny bones */}
      <g stroke={INK} strokeWidth={6} fill={CREAM} strokeLinejoin="round">
        <path d="M 470 360 q 30 -50 60 -10 q -10 30 -40 30 Z" />
        <path d="M 540 360 l 50 -10 l 10 40 l -40 10 Z" />
        <path d="M 610 380 l 40 0 l 0 40 l -40 0 Z" />
      </g>
      {/* tube (opens wider) */}
      <path d={tubeD} fill="none" stroke={INK} strokeWidth={34 + 44 * open} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - drawTube} />
      <path d={tubeD} fill="none" stroke={glow > 0 ? YEL : PINK} strokeWidth={14 + 44 * open} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - drawTube} opacity={0.9} />
      {/* eardrum */}
      <path d={`M 420 300 Q ${420 + dx} 385 420 470`} fill="none" stroke={YEL} strokeWidth={16} strokeLinecap="round" />
      {/* air dots in the canal */}
      {Array.from({length: dotsOut}).map((_, i) => (
        <circle key={'o' + i} cx={70 + random('ox' + i) * 300 + Math.sin(f / 5 + i) * 10} cy={340 + random('oy' + i) * 90 + Math.cos(f / 6 + i) * 8} r={10} fill="#fff" opacity={0.85} />
      ))}
      {/* air dots in the middle ear */}
      {Array.from({length: dotsIn}).map((_, i) => {
        const a = random('ia' + i) * Math.PI * 2, r = Math.sqrt(random('ir' + i)) * 0.78;
        return <circle key={'i' + i} cx={565 + Math.cos(a) * 125 * r + Math.sin(f / 4 + i) * 8} cy={390 + Math.sin(a) * 95 * r + Math.cos(f / 5 + i) * 8} r={10} fill={CREAM} opacity={0.9} />;
      })}
      {/* dots flowing through the tube */}
      {flow !== 0 && Array.from({length: 7}).map((_, i) => {
        const t = (((f * 0.03 * Math.abs(flow) + i / 7) % 1) + 1) % 1;
        const [x, y] = at(flow > 0 ? t : 1 - t);
        return <circle key={'f' + i} cx={x} cy={y} r={12} fill="#fff" stroke={INK} strokeWidth={4} />;
      })}
      {labels && <>
        <text x={230} y={300} textAnchor="middle" fontFamily="B8" fontSize={42} fill={INK}>ear canal</text>
        <text x={560} y={240} textAnchor="middle" fontFamily="B8" fontSize={42} fill={INK}>middle ear</text>
        <text x={880} y={840} textAnchor="middle" fontFamily="B8" fontSize={42} fill={INK}>throat</text>
      </>}
    </svg>
  );
};

/** Front-view face with ears. cotton 0..1 = cotton puffs on the ears, popped = puffs fly away. */
const Face: React.FC<{cotton: number; popped: number}> = ({cotton, popped}) => {
  const puff = (side: number) => (
    <g transform={`translate(${side * (250 + popped * 260)} ${-popped * 180}) scale(${cotton * (1 - popped * 0.5)}) rotate(${popped * side * 90})`} opacity={1 - popped}>
      {[[0, 0, 46], [-30, -26, 32], [28, -30, 34], [30, 22, 30], [-28, 26, 30]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#fff" stroke={INK} strokeWidth={6} />)}
    </g>
  );
  return (
    <svg viewBox="-360 -300 720 600" width={720} height={600} style={{overflow: 'visible'}}>
      <ellipse cx={-235} cy={0} rx={55} ry={85} fill={SKIN2} stroke={INK} strokeWidth={9} />
      <ellipse cx={235} cy={0} rx={55} ry={85} fill={SKIN2} stroke={INK} strokeWidth={9} />
      <circle r={240} fill={SKIN} stroke={INK} strokeWidth={10} />
      <path d="M -150 -150 Q 0 -300 150 -150 Q 60 -210 -150 -150 Z" fill={INK} />
      <circle cx={-80} cy={-20} r={popped > 0.1 ? 28 : 20} fill={INK} /><circle cx={80} cy={-20} r={popped > 0.1 ? 28 : 20} fill={INK} />
      {popped > 0.1
        ? <ellipse cx={0} cy={110} rx={46} ry={56} fill={INK} />
        : <path d="M -60 110 q 20 -20 40 0 q 20 20 40 0 q 20 -20 40 0" stroke={INK} strokeWidth={9} fill="none" strokeLinecap="round" />}
      {puff(-1)}{puff(1)}
    </svg>
  );
};

/** Burst star for the POP. */
const Burst: React.FC<{s: number; color?: string; r?: number}> = ({s, color = YEL, r = 220}) => {
  const pts = Array.from({length: 24}).map((_, i) => {
    const a = (i / 24) * Math.PI * 2, rr = i % 2 ? r * 0.62 : r;
    return `${Math.cos(a) * rr},${Math.sin(a) * rr}`;
  }).join(' ');
  return <svg viewBox={`${-r - 20} ${-r - 20} ${2 * r + 40} ${2 * r + 40}`} width={2 * r + 40} height={2 * r + 40} style={{overflow: 'visible', transform: `scale(${s}) rotate(${s * 20}deg)`}}>
    <polygon points={pts} fill={color} stroke={INK} strokeWidth={12} strokeLinejoin="round" />
  </svg>;
};

/* ---------- scenes ---------- */

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const px = interpolate(f, [0, 200], [-560, 1100], clamp);
  const cotton = spring({frame: f - 25, fps: FPS, config: {damping: 10}});
  const popped = interpolate(f, [100, 125], [0, 1], {...clamp, easing: ease});
  const burst = spring({frame: f - 100, fps: FPS, config: {damping: 8, stiffness: 180}});
  const shake = f > 25 && f < 100 ? Math.sin(f * 1.3) * 4 : 0;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: px, top: 170, transform: `rotate(${-6 + Math.sin(f / 8) * 2}deg)`}}><Plane w={460} /></div>
      {f >= 100 && <div style={{position: 'absolute', left: 540 - 360, top: 780 - 360, opacity: 1 - popped * 0.3}}><Burst s={burst} r={340} /></div>}
      <div style={{position: 'absolute', left: 180, top: 480, transform: `translateX(${shake}px)`}}><Face cotton={cotton} popped={popped} /></div>
      {f >= 100 && <Slam words={['POP!']} at={100} y={1080} size={210} color={PINK} />}
      {f < 100 && <Pill text="stuffed with cotton? 🤔" x={540} y={1200} at={40} bg={TEAL} size={50} />}
      <Huh mood="curious" x={900} y={1060} h={300} at={130} />
    </AbsoluteFill>
  );
};

const Drum: React.FC = () => {
  const f = useCurrentFrame();
  const hit = Math.max(0, Math.sin(Math.max(0, f - 20) / 2.2)) * Math.exp(-Math.max(0, f - 20) / 14) * (f > 20 ? 1 : 0);
  const arrows = interpolate(f, [110, 150], [0, 1], {...clamp, easing: ease});
  const push = Math.sin(f / 6) * 10;
  return (
    <AbsoluteFill>
      <Slam words={['EAR', 'DRUM']} at={0} y={160} size={160} gap={7} />
      {/* drum seen from the front: a tight round skin */}
      <svg width={1080} height={800} style={{position: 'absolute', top: 400}}>
        <g transform={`translate(540 380) scale(${1 + hit * 0.06}, ${1 - hit * 0.06})`}>
          <ellipse rx={260} ry={260} fill={CREAM} stroke={INK} strokeWidth={14} />
          <ellipse rx={260 - 40} ry={260 - 40} fill="none" stroke={YEL} strokeWidth={10} opacity={0.6} />
          {Array.from({length: 12}).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return <line key={i} x1={Math.cos(a) * 262} y1={Math.sin(a) * 262} x2={Math.cos(a) * 300} y2={Math.sin(a) * 300} stroke={INK} strokeWidth={12} strokeLinecap="round" />;
          })}
          <circle r={18 + hit * 40} fill="none" stroke={PINK} strokeWidth={8} opacity={hit} />
        </g>
        {/* equal pushes from both sides */}
        <g opacity={arrows}>
          {[-1, 1].map((side) => [0, 1, 2].map((k) => (
            <path key={side + '' + k} d={`M ${540 + side * (470 - push)} ${250 + k * 130} l ${-side * 140 * arrows} 0`} stroke={side < 0 ? TEAL : PINK} strokeWidth={22} strokeLinecap="round" markerEnd="" />
          )))}
          {[-1, 1].map((side) => [0, 1, 2].map((k) => {
            const x = 540 + side * (470 - push) - side * 140 * arrows;
            return <path key={'h' + side + k} d={`M ${x + side * 30} ${250 + k * 130 - 26} L ${x - side * 6} ${250 + k * 130} L ${x + side * 30} ${250 + k * 130 + 26}`} fill="none" stroke={side < 0 ? TEAL : PINK} strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" />;
          }))}
        </g>
      </svg>
      <Pill text="thin skin, stretched tight" x={540} y={400} at={40} bg={YEL} color={INK} size={44} />
      <Pill text="outside air" x={250} y={1290} at={120} bg={TEAL} size={44} />
      <Pill text="inside air" x={830} y={1290} at={130} bg={PINK} size={44} />
      <div style={{position: 'absolute', top: 1250, width: '100%', textAlign: 'center', fontFamily: 'B8', fontSize: 90, color: '#fff', opacity: interpolate(f, [160, 175], [0, 1], clamp)}}>=</div>
    </AbsoluteFill>
  );
};

const Cabin: React.FC = () => {
  const f = useCurrentFrame();
  const draw = interpolate(f, [10, 70], [0, 1], {...clamp, easing: ease});
  const fill = interpolate(f, [110, 200], [0, 1], {...clamp, easing: ease});
  const py = interpolate(f, [0, 90], [900, 470], {...clamp, easing: ease});
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 150, width: '100%', textAlign: 'center', fontFamily: 'B8', fontSize: 70, color: '#fff', textShadow: `0 6px 0 ${INK}`}}>cabin air feels like...</div>
      <svg width={1080} height={1000} style={{position: 'absolute', top: 300}}>
        {/* mountain */}
        <path d="M 120 900 L 470 250 L 590 420 L 690 300 L 1000 900 Z" fill="#3d4a7a" stroke={INK} strokeWidth={12} strokeLinejoin="round"
          pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} fillOpacity={draw} />
        <path d="M 400 380 L 470 250 L 530 335 L 495 360 L 460 330 Z" fill="#fff" stroke={INK} strokeWidth={8} strokeLinejoin="round" opacity={draw} />
        {/* altitude gauge */}
        <rect x={60} y={150} width={60} height={750} rx={30} fill="#ffffff18" stroke="#fff" strokeWidth={6} />
        <rect x={60} y={900 - 750 * fill} width={60} height={750 * fill} rx={30} fill={YEL} />
      </svg>
      <div style={{position: 'absolute', left: 560, top: py, transform: `rotate(-8deg)`}}><Plane w={360} /></div>
      <div style={{position: 'absolute', left: 150, top: 1010, fontFamily: 'B8', fontSize: 110, color: YEL, textShadow: OUT}}>
        <Count to={8000} at={110} len={90} suffix=" ft" />
      </div>
      <Pill text="up to 🏔️" x={350} y={960} at={100} bg={PINK} size={42} />
      <Pill text="not ground level ✈️" x={540} y={1300} at={30} bg={TEAL} size={48} />
    </AbsoluteFill>
  );
};
const OUT = `0 8px 0 ${INK}`;

const Bulge: React.FC = () => {
  const f = useCurrentFrame();
  const bar1 = interpolate(f, [10, 45], [0, 1], {...clamp, easing: ease});
  const bar2 = interpolate(f, [40, 80], [0, 0.74], {...clamp, easing: ease});
  const b = interpolate(f, [100, 160], [0, 1], {...clamp, easing: Easing.out(Easing.back(2))});
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 150, left: 100, fontFamily: 'B8', fontSize: 46, color: '#fff'}}>air push on the ground</div>
      <div style={{position: 'absolute', top: 215, left: 100, height: 60, width: 880 * bar1, background: TEAL, borderRadius: 14}} />
      <div style={{position: 'absolute', top: 300, left: 100, fontFamily: 'B8', fontSize: 46, color: '#fff'}}>air push in the cabin</div>
      <div style={{position: 'absolute', top: 365, left: 100, height: 60, width: 880 * bar2, background: PINK, borderRadius: 14}} />
      <div style={{position: 'absolute', top: 355, left: 120 + 880 * bar2, fontFamily: 'B8', fontSize: 64, color: PINK, opacity: bar2 > 0.7 ? 1 : 0}}>≈ ¾</div>
      {/* side view: drum skin between two posts, dense air behind it pushes it out */}
      <svg width={1080} height={800} style={{position: 'absolute', top: 500}}>
        <rect x={0} y={60} width={540} height={560} fill="#ffffff10" />
        <rect x={540} y={60} width={540} height={560} fill={`${MID}`} opacity={0.75} />
        {Array.from({length: 6}).map((_, i) => (
          <circle key={'o' + i} cx={60 + random('a' + i) * 380 + Math.sin(f / 9 + i) * 14} cy={110 + random('b' + i) * 460} r={16} fill="#fff" opacity={0.7} />
        ))}
        {Array.from({length: 20}).map((_, i) => (
          <circle key={'i' + i} cx={640 + random('c' + i) * 400 + Math.sin(f / 3 + i) * 10} cy={100 + random('d' + i) * 480 + Math.cos(f / 3 + i) * 10} r={16} fill={CREAM} />
        ))}
        <path d={`M 540 60 Q ${540 - 260 * b} 340 540 620`} fill="none" stroke={YEL} strokeWidth={22} strokeLinecap="round" />
        <rect x={520} y={20} width={40} height={60} rx={10} fill={INK} /><rect x={520} y={600} width={40} height={60} rx={10} fill={INK} />
        <Arrow d="M 760 340 L 470 340" progress={interpolate(f, [120, 160], [0, 1], clamp)} color={PINK} w={18} />
      </svg>
      <Pill text="cabin side" x={250} y={610} at={20} bg="#ffffff" color={INK} size={40} />
      <Pill text="trapped air" x={830} y={610} at={30} bg={PINK} size={40} />
      <Slam words={['BULGE!']} at={110} y={1270} size={120} color={YEL} />
      <Huh mood="shocked" x={140} y={1180} h={220} at={120} />
    </AbsoluteFill>
  );
};

const Tube: React.FC = () => {
  const f = useCurrentFrame();
  const draw = interpolate(f, [30, 110], [0, 1], {...clamp, easing: ease});
  const glow = f > 30 ? 1 : 0;
  const ruler = interpolate(f, [130, 190], [0, 1], {...clamp, easing: ease});
  return (
    <AbsoluteFill>
      <Slam words={['THE', 'SECRET', 'VALVE']} at={0} y={140} size={110} gap={6} />
      <div style={{position: 'absolute', left: 40, top: 330, transform: 'scale(0.9)', transformOrigin: '0 0'}}>
        <EarSection drawTube={draw} labels glow={glow} dotsIn={8} dotsOut={8} />
      </div>
      <Pill text="Eustachian tube" x={720} y={1160} at={60} bg={YEL} color={INK} size={50} />
      <div style={{position: 'absolute', left: 120, top: 1250, width: 840 * ruler, height: 70, background: CREAM, borderRadius: 10, border: `6px solid ${INK}`, overflow: 'hidden', display: 'flex'}}>
        {Array.from({length: 36}).map((_, i) => <div key={i} style={{width: 2, height: i % 5 ? 22 : 40, background: INK, marginLeft: 21}} />)}
      </div>
      <div style={{position: 'absolute', left: 120, top: 1080, fontFamily: 'B8', fontSize: 80, color: '#fff', textShadow: OUT, opacity: ruler}}>≈ 3.5 cm</div>
    </AbsoluteFill>
  );
};

const Shut: React.FC = () => {
  const f = useCurrentFrame();
  const open1 = interpolate(f, [120, 135, 150, 165], [0, 1, 1, 0], clamp);
  const open2 = interpolate(f, [185, 200, 215, 230], [0, 1, 1, 0], clamp);
  const open = Math.max(open1, open2);
  const h = 30 + 170 * open; // hose opening height
  const pinch = 1 - open;
  return (
    <AbsoluteFill>
      <Slam words={['SQUISHED', 'SHUT']} at={0} y={150} size={130} gap={8} />
      <svg width={1080} height={700} style={{position: 'absolute', top: 420}}>
        {/* the tube as a soft hose seen from the side */}
        <path d={`M 120 ${350 - h / 2 - 20} Q 540 ${350 - h / 2 + 60 * pinch} 960 ${350 - h / 2 - 20} L 960 ${350 + h / 2 + 20} Q 540 ${350 + h / 2 - 60 * pinch} 120 ${350 + h / 2 + 20} Z`}
          fill={PINK} stroke={INK} strokeWidth={14} strokeLinejoin="round" />
        <path d={`M 140 350 L 940 350`} stroke={INK} strokeWidth={8} opacity={pinch} strokeDasharray="30 20" />
        {/* muscles pulling it open */}
        {[-1, 1].map((s) => (
          <g key={s}>
            <path d={`M 540 ${350 + s * (h / 2 + 30)} L 540 ${350 + s * (h / 2 + 30 + 120 + open * 30)}`} stroke={RED} strokeWidth={34} strokeLinecap="round" opacity={0.85} />
            <path d={`M 540 ${350 + s * (h / 2 + 30)} L 540 ${350 + s * (h / 2 + 30 + 120 + open * 30)}`} stroke="#fff" strokeWidth={6} strokeDasharray="10 14" strokeLinecap="round" />
          </g>
        ))}
      </svg>
      <div style={{position: 'absolute', left: 140, top: 1200, fontSize: 130, transform: `scale(${1 + open1 * 0.3})`, opacity: f > 110 ? 1 : 0.25}}>😋</div>
      <div style={{position: 'absolute', left: 800, top: 1200, fontSize: 130, transform: `scale(${1 + open2 * 0.3})`, opacity: f > 175 ? 1 : 0.25}}>🥱</div>
      <Pill text="swallow" x={240} y={1160} at={110} bg={TEAL} size={42} />
      <Pill text="yawn" x={880} y={1160} at={175} bg={YEL} color={INK} size={42} />
      <Pill text="muscles pull it open 💪" x={540} y={410} at={60} bg={RED} size={44} />
    </AbsoluteFill>
  );
};

const Pop: React.FC = () => {
  const f = useCurrentFrame();
  const open = interpolate(f, [20, 35], [0, 1], {...clamp, easing: ease});
  const bulge = interpolate(f, [30, 120], [1, 0], {...clamp, easing: Easing.out(Easing.back(1.4))});
  const dotsIn = Math.round(interpolate(f, [30, 120], [20, 9], clamp));
  const burst = spring({frame: f - 18, fps: FPS, config: {damping: 8, stiffness: 200}});
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 40, top: 420, transform: 'scale(0.9)', transformOrigin: '0 0'}}>
        <EarSection bulge={bulge} open={open * (f < 200 ? 1 : 0.5)} flow={f > 25 && f < 150 ? 1.2 : 0} dotsIn={dotsIn} dotsOut={8} />
      </div>
      <div style={{position: 'absolute', left: 540 - 180, top: 100, opacity: interpolate(f, [18, 60, 90], [0, 1, 0.9], clamp)}}><Burst s={burst} r={160} color={YEL} /></div>
      <div style={{position: 'absolute', top: 175, width: '100%', textAlign: 'center', fontFamily: 'B8', fontSize: 130, color: PINK, transform: `scale(${burst})`, textShadow: `0 8px 0 ${INK}`}}>POP!</div>
      <Pill text="air whooshes through 💨" x={540} y={1260} at={50} bg={TEAL} size={46} />
      <Pill text="drum relaxes ✅" x={300} y={1360} at={130} bg={YEL} color={INK} size={42} />
      <Huh mood="laughing" x={880} y={1080} h={280} at={150} />
    </AbsoluteFill>
  );
};

const Down: React.FC = () => {
  const f = useCurrentFrame();
  const t = interpolate(f, [0, 150], [0, 1], {...clamp, easing: ease});
  const bulge = interpolate(f, [60, 140], [0, -1], {...clamp, easing: ease});
  return (
    <AbsoluteFill>
      <svg width={1080} height={600} style={{position: 'absolute', top: 120}}>
        <Arrow d="M 100 260 Q 600 270 960 500" progress={t} color="#ffffff55" w={10} />
        <rect x={40} y={520} width={1000} height={20} rx={10} fill="#ffffff44" />
      </svg>
      <div style={{position: 'absolute', left: 120 + t * 640 - 180, top: 300 + t * 200, transform: `rotate(${14}deg)`}}><Plane w={360} /></div>
      <Slam words={['GOING', 'DOWN']} at={0} y={160} size={110} color={SKY} />
      <div style={{position: 'absolute', left: 150, top: 720, transform: 'scale(0.62)', transformOrigin: '0 0'}}>
        <EarSection bulge={bulge} open={0} dotsIn={8} dotsOut={22} />
      </div>
      <Pill text="air needs to get back IN ⬅️" x={540} y={680} at={70} bg={PINK} size={44} />
      <Pill text="floppy tube stays shut 😬" x={540} y={1330} at={150} bg={YEL} color={INK} size={44} />
      <Huh mood="thinking" x={930} y={1020} h={260} at={170} />
    </AbsoluteFill>
  );
};

const Tips: React.FC = () => {
  const f = useCurrentFrame();
  const cards = [['🍬', 'chew gum'], ['😋', 'swallow'], ['🥱', 'yawn'], ['🤏', 'pinch + blow gently']];
  const ats = [0, 22, 44, 70];
  const nosleep = spring({frame: f - 150, fps: FPS, config: {damping: 10}});
  const strike = interpolate(f, [170, 185], [0, 1], {...clamp, easing: ease});
  return (
    <AbsoluteFill>
      <Slam words={['HELP', 'IT', 'OPEN']} at={0} y={130} size={110} gap={6} />
      {cards.map(([e, label], i) => {
        const s = spring({frame: f - ats[i], fps: FPS, config: {damping: 11}});
        const x = i % 2 ? 560 : 100, y = 330 + Math.floor(i / 2) * 370;
        return (
          <div key={i} style={{position: 'absolute', left: x, top: y, width: 420, height: 330, background: [TEAL, YEL, PINK, CREAM][i], borderRadius: 40, boxShadow: `0 12px 0 ${INK}`,
            transform: `scale(${s}) rotate(${(1 - s) * (i % 2 ? 8 : -8) + Math.sin(f / 10 + i) * 1.5}deg)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{fontSize: 140}}>{e}</div>
            <div style={{fontFamily: 'B8', fontSize: i === 3 ? 40 : 54, color: INK, textAlign: 'center', padding: '0 20px'}}>{label}</div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 190, top: 1090, width: 700, height: 170, background: '#ffffff22', borderRadius: 30, transform: `scale(${nosleep})`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 30}}>
        <span style={{fontSize: 100}}>😴</span>
        <span style={{fontFamily: 'B8', fontSize: 56, color: '#fff'}}>sleep on descent</span>
        <div style={{position: 'absolute', left: 30, right: 30, top: '50%', height: 14, borderRadius: 7, background: RED, transformOrigin: 'left', transform: `scaleX(${strike}) rotate(-4deg)`}} />
      </div>
    </AbsoluteFill>
  );
};

export const scenes: SceneMap = {
  hook: {C: Hook, hue: SKY}, drum: {C: Drum, hue: YEL}, cabin: {C: Cabin, hue: '#5b6cff'}, bulge: {C: Bulge, hue: PINK},
  tube: {C: Tube, hue: TEAL}, shut: {C: Shut, hue: RED}, pop: {C: Pop, hue: YEL}, down: {C: Down, hue: SKY}, tips: {C: Tips, hue: TEAL}, cta: {C: CTA, hue: PINK},
};
