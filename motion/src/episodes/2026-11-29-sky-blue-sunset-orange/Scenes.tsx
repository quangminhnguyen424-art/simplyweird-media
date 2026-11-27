import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, interpolateColors, spring, Easing} from 'remotion';
import {FPS, INK, PINK, YEL, TEAL, ORG, CREAM, SKY, RED, clamp, ease, Slam, Pill, Huh, Arrow, Count, SwapCards, CTA, SceneMap} from '../../kit';
import timing from './timing.json';

export const title = 'why the sky is blue, but sunsets orange';
export const segs = timing;

const BLUE = '#3B82F6', VIOLET = '#9B5DE5', GREEN = '#3DDC84';

/** Sine wave as an SVG path. */
const wave = (x0: number, x1: number, y: number, amp: number, wl: number, ph: number) => {
  let d = '';
  for (let x = x0; x <= x1; x += 5) d += (x === x0 ? 'M' : 'L') + x.toFixed(1) + ' ' + (y + amp * Math.sin(((x - x0) / wl) * 2 * Math.PI + ph)).toFixed(1) + ' ';
  return d;
};

/** Flat sun with turning rays. */
const Sun: React.FC<{x: number; y: number; r: number; color?: string; f: number; s?: number}> = ({x, y, r, color = YEL, f, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <g transform={`rotate(${f * 1.2})`}>
      {Array.from({length: 10}).map((_, i) => (
        <rect key={i} x={-9} y={-r - 46} width={18} height={34} rx={9} fill={color} stroke={INK} strokeWidth={6} transform={`rotate(${i * 36})`} />
      ))}
    </g>
    <circle r={r} fill={color} stroke={INK} strokeWidth={9} />
    <circle cx={-r * 0.3} cy={-r * 0.1} r={r * 0.1} fill={INK} /><circle cx={r * 0.3} cy={-r * 0.1} r={r * 0.1} fill={INK} />
    <path d={`M ${-r * 0.3} ${r * 0.25} Q 0 ${r * 0.5} ${r * 0.3} ${r * 0.25}`} stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />
  </g>
);

/** Simple flat person (head centre at x,y). */
const Person: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-46} y={50} width={92} height={120} rx={36} fill={PINK} stroke={INK} strokeWidth={8} />
    <rect x={-40} y={150} width={30} height={80} rx={14} fill={CREAM} stroke={INK} strokeWidth={7} />
    <rect x={10} y={150} width={30} height={80} rx={14} fill={CREAM} stroke={INK} strokeWidth={7} />
    <circle r={52} fill={CREAM} stroke={INK} strokeWidth={8} />
    <circle cx={-17} cy={-6} r={7} fill={INK} /><circle cx={17} cy={-6} r={7} fill={INK} />
    <path d="M -14 18 q 14 12 28 0" stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />
  </g>
);

/* ---------- scenes ---------- */
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const sky = interpolateColors(f, [45, 90, 130], ['#4FA3FF', '#E77BC8', '#FF7A3D']);
  const sunC = interpolateColors(f, [45, 130], [YEL, '#FF5A2D']);
  const sunY = interpolate(f, [0, 150], [360, 760], {...clamp, easing: Easing.inOut(Easing.quad)});
  const pop = spring({frame: f, fps: FPS, config: {damping: 12}});
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <defs><clipPath id="hookpanel"><rect x={90} y={190} width={900} height={780} rx={48} /></clipPath></defs>
        <g transform={`translate(540 580) scale(${pop}) translate(-540 -580)`}>
          <rect x={90} y={190} width={900} height={780} rx={48} fill={sky} />
          <g clipPath="url(#hookpanel)">
            <Sun x={540} y={sunY} r={95} color={sunC} f={f} />
            <path d="M 90 840 Q 300 740 540 820 T 990 790 L 990 970 L 90 970 Z" fill="#2F6B57" stroke={INK} strokeWidth={9} />
            <path d="M 90 900 Q 380 830 700 900 T 990 880 L 990 970 L 90 970 Z" fill="#245446" />
          </g>
          <rect x={90} y={190} width={900} height={780} rx={48} fill="none" stroke={INK} strokeWidth={12} />
        </g>
      </svg>
      <Slam words={['SAME', 'SUN?']} at={50} y={1030} size={140} />
      <Pill text="noon 💙" x={300} y={1290} at={8} bg={BLUE} />
      <Pill text="sunset 🧡" x={770} y={1290} at={90} bg={ORG} />
      <Huh mood="shocked" x={880} y={640} h={260} at={110} />
    </AbsoluteFill>
  );
};

const White: React.FC = () => {
  const f = useCurrentFrame();
  const beam = interpolate(f, [8, 34], [0, 1], {...clamp, easing: ease});
  const fan = interpolate(f, [34, 80], [0, 1], {...clamp, easing: ease});
  const prism = spring({frame: f - 4, fps: FPS, config: {damping: 10}});
  const cols = [RED, ORG, YEL, GREEN, BLUE, VIOLET];
  const red = interpolate(f, [150, 190], [0, 1], {...clamp, easing: ease});
  const blue = interpolate(f, [195, 235], [0, 1], {...clamp, easing: ease});
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <Sun x={150} y={470} r={70} f={f} />
        <Arrow d="M 240 480 L 470 480" color="#ffffff" progress={beam} w={22} />
        {cols.map((c, i) => (
          <Arrow key={c} d={`M 575 480 L 1040 ${360 + i * 50}`} color={c} progress={interpolate(fan, [i * 0.06, 0.7 + i * 0.06], [0, 1], clamp)} w={20} />
        ))}
        <g transform={`translate(540 480) scale(${prism}) rotate(${(1 - prism) * 30})`}>
          <path d="M 0 -130 L 115 95 L -115 95 Z" fill="#CFF3FF" fillOpacity={0.85} stroke={INK} strokeWidth={10} strokeLinejoin="round" />
          <path d="M -20 -70 L -60 50" stroke="#fff" strokeWidth={10} strokeLinecap="round" opacity={0.8} />
        </g>
        <Arrow d={wave(120, 960, 1010, 55, 360, -f * 0.12)} color={RED} progress={red} w={16} />
        <Arrow d={wave(120, 960, 1280, 45, 105, -f * 0.3)} color={BLUE} progress={blue} w={16} />
      </svg>
      <Pill text="white = ALL colors 🌈" x={540} y={720} at={60} bg={CREAM} color={INK} />
      <Pill text="red = long waves" x={540} y={900} at={150} bg={RED} />
      <Pill text="blue = short waves" x={540} y={1170} at={195} bg={BLUE} />
    </AbsoluteFill>
  );
};

const Air: React.FC = () => {
  const f = useCurrentFrame();
  const glass = spring({frame: f, fps: FPS, config: {damping: 11}});
  const mols = [[400, 470, 'N'], [610, 420, 'O'], [700, 600, 'N'], [470, 640, 'N'], [560, 800, 'O'], [370, 780, 'N'], [740, 770, 'N'], [560, 530, 'N']] as const;
  const big = interpolate(f, [95, 140], [0, 1], {...clamp, easing: ease});
  const bounce = f - 165;
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <defs><clipPath id="lens"><circle cx={555} cy={610} r={320} /></clipPath></defs>
        <g transform={`translate(555 610) scale(${glass}) translate(-555 -610)`}>
          <line x1={790} y1={850} x2={930} y2={990} stroke={INK} strokeWidth={60} strokeLinecap="round" />
          <line x1={790} y1={850} x2={930} y2={990} stroke={ORG} strokeWidth={40} strokeLinecap="round" />
          <circle cx={555} cy={610} r={320} fill="#ffffff12" />
          <g clipPath="url(#lens)">
            <path d={wave(150, 960, 610, 150, 760, -f * 0.05)} stroke={YEL} strokeWidth={14} fill="none" opacity={0.85 * big} strokeLinecap="round" />
            {mols.map(([x, y, k], i) => {
              const s = spring({frame: f - 10 - i * 4, fps: FPS, config: {damping: 9}});
              const jx = x + Math.sin(f / 4 + i * 2) * 10, jy = y + Math.cos(f / 5 + i) * 10;
              const c = k === 'N' ? TEAL : PINK;
              return (
                <g key={i} transform={`translate(${jx} ${jy}) scale(${s}) rotate(${i * 40 + f * (i % 2 ? 1 : -1)})`}>
                  <circle cx={-22} r={30} fill={c} stroke={INK} strokeWidth={6} />
                  <circle cx={22} r={30} fill={c} stroke={INK} strokeWidth={6} />
                </g>
              );
            })}
            {bounce > 0 && Array.from({length: 12}).map((_, i) => {
              const a = (i / 12) * Math.PI * 2 + 0.3;
              const d = ((bounce * 7 + i * 23) % 300);
              const ox = mols[i % 8][0], oy = mols[i % 8][1];
              return <circle key={i} cx={ox + Math.cos(a) * d} cy={oy + Math.sin(a) * d} r={13} fill={BLUE} stroke="#fff" strokeWidth={4} opacity={1 - d / 300} />;
            })}
          </g>
          <circle cx={555} cy={610} r={320} fill="none" stroke="#fff" strokeWidth={16} />
          <circle cx={555} cy={610} r={320} fill="none" stroke={INK} strokeWidth={5} />
        </g>
      </svg>
      <Pill text="nitrogen + oxygen" x={540} y={1090} at={20} bg={TEAL} />
      <Pill text="tinier than a light wave 🔬" x={540} y={1210} at={100} bg={YEL} color={INK} />
      <Pill text="boing! 💥" x={250} y={230} at={170} bg={BLUE} size={52} />
    </AbsoluteFill>
  );
};

const Ten: React.FC = () => {
  const f = useCurrentFrame();
  const bar = (w: number, at: number) => interpolate(f, [at, at + 45], [0, w], {...clamp, easing: ease});
  const head = spring({frame: f - 120, fps: FPS, config: {damping: 10}});
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 140, width: '100%', textAlign: 'center', fontFamily: 'B8', fontSize: 210, color: SKY, textShadow: `0 12px 0 ${INK}`}}>
        ≈<Count from={1} to={10} at={10} len={50} />×
      </div>
      <div style={{position: 'absolute', left: 80, top: 450, fontFamily: 'B8', fontSize: 46, color: '#fff'}}>red</div>
      <div style={{position: 'absolute', left: 250, top: 445, height: 66, width: bar(70, 15), background: RED, borderRadius: 14, border: `5px solid ${INK}`}} />
      <div style={{position: 'absolute', left: 80, top: 570, fontFamily: 'B8', fontSize: 46, color: '#fff'}}>short</div>
      <div style={{position: 'absolute', left: 250, top: 565, height: 66, width: bar(700, 15), background: BLUE, borderRadius: 14, border: `5px solid ${INK}`}} />
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        {Array.from({length: 9}).map((_, i) => {
          const a = Math.PI + (i / 8) * Math.PI;
          const sx = 540 + Math.cos(a) * 430, sy = 1080 + Math.sin(a) * 300;
          const ex = 540 + Math.cos(a) * 110, ey = 1080 + Math.sin(a) * 95;
          const mx = (sx + ex) / 2 + Math.sin(a) * 40, my = (sy + ey) / 2 - Math.cos(a) * 40;
          const p = interpolate(f, [130 + i * 6, 165 + i * 6], [0, 1], {...clamp, easing: ease});
          return <Arrow key={i} d={`M ${sx} ${sy} Q ${mx} ${my} ${ex} ${ey}`} color={BLUE} progress={p} w={13} />;
        })}
        <g transform={`translate(540 1080) scale(${head}) translate(-540 -1080)`}><Person x={540} y={1080} s={0.85} /></g>
      </svg>
      <Pill text="blue from everywhere 👀" x={540} y={1370} at={160} bg={BLUE} />
    </AbsoluteFill>
  );
};

const Violet: React.FC = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, 30], [0, 1], {...clamp, easing: ease});
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <Arrow d={wave(160, 920, 290, 40, 70, -f * 0.35)} color={VIOLET} progress={p} w={14} />
      </svg>
      <Pill text="violet = even shorter" x={540} y={190} at={4} bg={VIOLET} />
      <SwapCards before="purple sky? 💜" after="sun sends less violet + our eyes love blue 👁️" at={40} y={400} />
      <Huh mood="thinking" x={540} y={990} h={340} at={20} />
    </AbsoluteFill>
  );
};

const Sunset: React.FC = () => {
  const f = useCurrentFrame();
  const noon = interpolate(f, [10, 40], [0, 1], {...clamp, easing: ease});
  const side = interpolate(f, [60, 120], [0, 1], {...clamp, easing: ease});
  const earth = spring({frame: f, fps: FPS, config: {damping: 14}});
  const sunset = spring({frame: f - 50, fps: FPS, config: {damping: 10}});
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <g transform={`translate(0 ${(1 - earth) * 400})`}>
          <circle cx={540} cy={1900} r={1080} fill={SKY} fillOpacity={0.22} stroke={SKY} strokeWidth={4} strokeDasharray="18 14" />
          <circle cx={540} cy={1900} r={900} fill="#2F6B57" stroke={INK} strokeWidth={12} />
          <path d="M 300 1060 q 60 -30 120 0 M 640 1050 q 70 -36 140 0" stroke="#3E8A70" strokeWidth={18} fill="none" strokeLinecap="round" />
        </g>
        <Sun x={540} y={290} r={60} f={f} s={noon > 0 ? 1 : 0} />
        <Arrow d="M 540 380 L 540 855" color={YEL} progress={noon} w={18} />
        <rect x={510} y={820} width={60} height={40} fill={YEL} opacity={0.35 * noon} rx={10} />
        <Sun x={70} y={940} r={48} color={ORG} f={f} s={sunset} />
        <Arrow d="M 130 945 L 470 945" color={ORG} progress={side} w={18} />
        {f > 85 && Array.from({length: 10}).map((_, i) => {
          const t = ((f - 85 + i * 9) % 60) / 60;
          const x0 = 170 + i * 30;
          return <circle key={i} cx={x0 + t * 40} cy={945 + (i % 2 ? -1 : 1) * t * 260} r={12} fill={BLUE} stroke="#fff" strokeWidth={4} opacity={1 - t} />;
        })}
        <g transform="translate(0 0)"><Person x={540} y={900} s={0.5} /></g>
      </svg>
      <Pill text="noon: short trip" x={800} y={560} at={20} bg={YEL} color={INK} />
      <Pill text="sunset: LONG trip" x={330} y={720} at={70} bg={ORG} />
      <Pill text="blue gets bounced away 💨" x={540} y={1280} at={130} bg={BLUE} />
    </AbsoluteFill>
  );
};

const Leftover: React.FC = () => {
  const f = useCurrentFrame();
  const cols = [RED, BLUE, ORG, VIOLET, YEL];
  const bowl = spring({frame: f - 5, fps: FPS, config: {damping: 10}});
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <rect x={360} y={420} width={300} height={520} rx={40} fill={SKY} fillOpacity={0.18} stroke={SKY} strokeWidth={5} strokeDasharray="16 12" />
        <text x={510} y={400} textAnchor="middle" fontFamily="B8" fontSize={44} fill={SKY}>air</text>
        {Array.from({length: 20}).map((_, i) => {
          const c = cols[i % 5];
          const scat = c === BLUE || c === VIOLET;
          const x = -40 + (f - i * 7) * 10;
          if (x < -40) return null;
          let cx = x, cy = 680, op = 1;
          if (scat && x > 470) { const d = x - 470; cx = 470 + d * 0.4; cy = 680 + (i % 4 < 2 ? -1 : 1) * d * 0.9; op = Math.max(0, 1 - d / 420); }
          if (!scat && x > 900) { const k = i % 3; cx = 870 + k * 34; cy = Math.min(820 - Math.floor(i / 5) * 8, 680 + (x - 900) * 1.5); }
          return <circle key={i} cx={cx} cy={cy} r={24} fill={c} stroke={INK} strokeWidth={6} opacity={op} />;
        })}
        <g transform={`translate(910 840) scale(${bowl})`}>
          <path d="M -130 -20 L 130 -20 Q 120 90 0 95 Q -120 90 -130 -20 Z" fill={CREAM} stroke={INK} strokeWidth={10} strokeLinejoin="round" />
        </g>
      </svg>
      <Pill text="reds, oranges, yellows ✅" x={540} y={250} at={20} bg={ORG} />
      <Slam words={['LEFTOVERS!']} at={110} y={1020} size={140} />
      <Pill text="🍽️ the sky's leftovers" x={540} y={1300} at={130} bg={CREAM} color={INK} />
    </AbsoluteFill>
  );
};

const Rayleigh: React.FC = () => {
  const f = useCurrentFrame();
  const card = spring({frame: f, fps: FPS, config: {damping: 11}});
  const cloudIn = spring({frame: f - 215, fps: FPS, config: {damping: 9}});
  const cols = [RED, ORG, YEL, GREEN, BLUE, VIOLET];
  const part2 = f > 150;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 140, top: 170, width: 800, height: 300, background: CREAM, borderRadius: 40, boxShadow: `0 14px 0 ${INK}`, transform: `scale(${card})`, display: 'flex', alignItems: 'center', padding: 30, boxSizing: 'border-box'}}>
        <div style={{fontSize: 170}}>🎩</div>
        <div style={{marginLeft: 26}}>
          <div style={{fontFamily: 'B8', fontSize: 70, color: INK, lineHeight: 1}}>Lord Rayleigh</div>
          <div style={{fontFamily: 'B8', fontSize: 80, color: PINK}}>{Math.round(interpolate(f, [20, 70], [1800, 1870], {...clamp, easing: ease}))}s</div>
        </div>
      </div>
      <Pill text="Rayleigh scattering" x={540} y={560} at={30} bg={PINK} size={52} />
      <svg width={1080} height={1920} style={{position: 'absolute', opacity: part2 ? 1 : 0}}>
        <circle cx={270} cy={900} r={16} fill={TEAL} stroke="#fff" strokeWidth={5} />
        {[0, 1, 2, 3].map((i) => {
          const a = (i / 4) * Math.PI * 2 + 0.6;
          return <Arrow key={i} d={`M ${270 + Math.cos(a) * 30} ${900 + Math.sin(a) * 30} L ${270 + Math.cos(a) * 150} ${900 + Math.sin(a) * 150}`} color={BLUE} progress={interpolate(f, [160, 190], [0, 1], clamp)} w={12} />;
        })}
        {cols.map((c, i) => {
          const a = (i / 6) * Math.PI * 2 + 0.3;
          return <Arrow key={c} d={`M ${770 + Math.cos(a) * 100} ${900 + Math.sin(a) * 100} L ${770 + Math.cos(a) * 200} ${900 + Math.sin(a) * 200}`} color={c} progress={interpolate(f, [175, 210], [0, 1], clamp)} w={14} />;
        })}
        <g transform={`translate(770 900) scale(${1 - cloudIn * 0.15})`} opacity={1 - cloudIn}>
          <circle r={85} fill="#BFE6FF" stroke={INK} strokeWidth={8} />
        </g>
        <g transform={`translate(770 900) scale(${cloudIn})`}>
          <circle cx={-70} cy={20} r={60} fill="#fff" stroke={INK} strokeWidth={8} />
          <circle cx={60} cy={20} r={65} fill="#fff" stroke={INK} strokeWidth={8} />
          <circle cx={0} cy={-25} r={80} fill="#fff" stroke={INK} strokeWidth={8} />
          <rect x={-70} y={10} width={130} height={72} fill="#fff" />
          <path d="M -128 82 L 122 82" stroke={INK} strokeWidth={8} strokeLinecap="round" />
        </g>
      </svg>
      <Pill text="tiny air bit → blue" x={270} y={1170} at={160} bg={BLUE} size={40} />
      <Pill text="big droplet → ALL = white ☁️" x={600} y={1300} at={200} bg="#ffffff" color={INK} size={40} />
    </AbsoluteFill>
  );
};

const Mars: React.FC = () => {
  const f = useCurrentFrame();
  const sunY = interpolate(f, [0, 260], [560, 860], {...clamp, easing: Easing.inOut(Easing.quad)});
  const halo = interpolate(f, [20, 120], [0.2, 1], clamp);
  const pop = spring({frame: f, fps: FPS, config: {damping: 12}});
  const roll = interpolate(f, [0, 260], [0, 60], clamp);
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <defs>
          <clipPath id="marspanel"><rect x={70} y={170} width={940} height={900} rx={48} /></clipPath>
          <linearGradient id="marssky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6E4A3A" /><stop offset="1" stopColor="#C9925A" /></linearGradient>
          <radialGradient id="halo"><stop offset="0" stopColor="#BFE3FF" stopOpacity={1} /><stop offset="0.35" stopColor="#5BA8FF" stopOpacity={0.8} /><stop offset="1" stopColor="#5BA8FF" stopOpacity={0} /></radialGradient>
        </defs>
        <g transform={`translate(540 620) scale(${pop}) translate(-540 -620)`}>
          <g clipPath="url(#marspanel)">
            <rect x={70} y={170} width={940} height={900} fill="url(#marssky)" />
            <circle cx={540} cy={sunY} r={260} fill="url(#halo)" opacity={halo} />
            <circle cx={540} cy={sunY} r={34} fill="#F4FBFF" />
            <path d="M 70 880 Q 260 800 450 870 T 830 850 T 1010 870 L 1010 1070 L 70 1070 Z" fill="#A0442A" stroke={INK} strokeWidth={9} />
            <path d="M 70 960 Q 400 900 700 970 T 1010 950 L 1010 1070 L 70 1070 Z" fill="#7E3420" />
            <g transform={`translate(${200 + roll} 900)`}>
              <rect x={-90} y={-60} width={180} height={60} rx={10} fill="#E8E2D6" stroke={INK} strokeWidth={7} />
              <rect x={40} y={-160} width={14} height={100} fill="#E8E2D6" stroke={INK} strokeWidth={5} />
              <rect x={22} y={-190} width={54} height={34} rx={6} fill="#E8E2D6" stroke={INK} strokeWidth={6} />
              <circle cx={62} cy={-173} r={7} fill={INK} />
              {[-70, 0, 70].map((x) => <circle key={x} cx={x} cy={12} r={24} fill="#555" stroke={INK} strokeWidth={6} />)}
            </g>
          </g>
          <rect x={70} y={170} width={940} height={900} rx={48} fill="none" stroke={INK} strokeWidth={12} />
        </g>
      </svg>
      <Pill text="MARS 🔴" x={540} y={250} at={6} bg={RED} size={56} />
      <Pill text="Curiosity rover, 2015 📷" x={540} y={1190} at={60} bg={ORG} />
      <Pill text="a BLUE sunset! 🔵" x={540} y={1320} at={150} bg={BLUE} />
      <Huh mood="shocked" x={880} y={700} h={260} at={110} />
    </AbsoluteFill>
  );
};

export const scenes: SceneMap = {
  hook: {C: Hook, hue: ORG}, white: {C: White, hue: YEL}, air: {C: Air, hue: TEAL}, ten: {C: Ten, hue: SKY}, violet: {C: Violet, hue: VIOLET},
  sunset: {C: Sunset, hue: ORG}, leftover: {C: Leftover, hue: RED}, rayleigh: {C: Rayleigh, hue: PINK}, mars: {C: Mars, hue: '#C9925A'}, cta: {C: CTA, hue: PINK},
};
