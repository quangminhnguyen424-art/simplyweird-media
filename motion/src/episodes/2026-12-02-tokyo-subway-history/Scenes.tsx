import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, spring, random} from 'remotion';
import {FPS, INK, PINK, YEL, TEAL, ORG, SKY, RED, clamp, ease, Slam, Pill, Huh, Arrow, Count, CTA, SceneMap} from '../../kit';
import timing from './timing.json';

export const title = "how tokyo's subway began";
export const segs = timing;

const OUT = `0 8px 0 ${INK}`;
const GINZA = '#FF9500', TRAM = '#3FA34D', STREET = '#4A4E69', CREAM = '#FFF6DE';
const LINES = ['#F62E36', '#B5B5AC', '#009BBF', '#00BB85', '#C1A470', '#8F76D6', '#00AC9B', '#9C5E31', '#E85298', '#0079C2', '#6CBB5A', '#B6007A'];

const Big: React.FC<{children: React.ReactNode; y?: number; size?: number; color?: string; at?: number}> = ({children, y = 140, size = 110, color = YEL, at = 0}) => {
  const f = useCurrentFrame();
  const s = spring({frame: f - at, fps: FPS, config: {damping: 10}});
  return <div style={{position: 'absolute', top: y, width: '100%', textAlign: 'center', fontFamily: 'B8', fontSize: size, color, textShadow: OUT, transform: `scale(${s})`, lineHeight: 1.05}}>{children}</div>;
};
const Sub: React.FC<{children: React.ReactNode; y: number; size?: number; at?: number}> = ({children, y, size = 58, at = 0}) => {
  const f = useCurrentFrame();
  return <div style={{position: 'absolute', top: y, width: '100%', textAlign: 'center', fontFamily: 'B8', fontSize: size, color: '#fff', textShadow: OUT, opacity: interpolate(f, [at, at + 12], [0, 1], clamp)}}>{children}</div>;
};

/** Side view of a subway car. Draw inside <svg>. */
const Car: React.FC<{x: number; y: number; s?: number; color?: string; face?: boolean}> = ({x, y, s = 1, color = GINZA, face}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-170} y={-80} width={340} height={150} rx={30} fill={color} stroke={INK} strokeWidth={10} />
    <rect x={-170} y={20} width={340} height={22} fill="#fff" opacity={0.85} />
    {[-110, -35, 40].map((wx) => <rect key={wx} x={wx} y={-55} width={60} height={50} rx={10} fill={SKY} stroke={INK} strokeWidth={7} />)}
    <rect x={115} y={-55} width={40} height={95} rx={8} fill="#ffffff55" stroke={INK} strokeWidth={7} />
    {[-110, 110].map((wx) => <circle key={wx} cx={wx} cy={78} r={22} fill={INK} />)}
    {face && <><circle cx={-60} cy={-28} r={7} fill={INK} /><circle cx={-20} cy={-28} r={7} fill={INK} /></>}
  </g>
);

/** Little person (dot head + body). */
const Person: React.FC<{x: number; y: number; s?: number; c?: string; bob?: number}> = ({x, y, s = 1, c = PINK, bob = 0}) => (
  <g transform={`translate(${x} ${y + bob}) scale(${s})`}>
    <rect x={-22} y={-10} width={44} height={60} rx={20} fill={c} stroke={INK} strokeWidth={7} />
    <circle cx={0} cy={-34} r={22} fill={CREAM} stroke={INK} strokeWidth={7} />
  </g>
);

const Bean: React.FC<{x: number; y: number; white?: boolean; s?: number}> = ({x, y, white, s = 1}) => (
  <ellipse cx={x} cy={y} rx={16 * s} ry={11 * s} fill={white ? '#FBF6E9' : '#2B2B2B'} stroke={white ? INK : '#000'} strokeWidth={5} />
);

/* ---------- scenes ---------- */

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const slide = interpolate(f, [0, 60], [-500, 0], {...clamp, easing: ease});
  const pockets = spring({frame: f - 150, fps: FPS, config: {damping: 9}});
  return (
    <AbsoluteFill>
      {f < 150
        ? <><Big y={140} size={140} at={4}><Count to={8} at={4} len={40} suffix="M+" /></Big><Sub y={310} at={20}>subway rides every day</Sub></>
        : <Slam words={['ONE', 'GUY', '+', 'BEANS?!']} at={155} y={140} size={110} gap={6} />}
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        <rect x={0} y={760} width={1080} height={300} fill="#1d1d33" />
        <rect x={0} y={1040} width={1080} height={16} fill="#888" />
        <g opacity={interpolate(f, [140, 160], [1, 0.25], clamp)}>
          {[0, 1, 2].map((i) => <Car key={i} x={200 + i * 350 + slide + Math.sin(f / 6) * 2} y={950} s={1} />)}
        </g>
        <g transform={`translate(540 900) scale(${pockets})`}>
          {[-170, 170].map((px, k) => (
            <g key={px}>
              <path d={`M ${px - 120} -110 L ${px + 120} -110 L ${px + 100} 110 Q ${px} 160 ${px - 100} 110 Z`} fill={k ? '#5A6B8C' : '#7D8FB3'} stroke={INK} strokeWidth={10} />
              {Array.from({length: 9}).map((_, i) => <Bean key={i} x={px - 60 + (i % 3) * 60} y={-60 + Math.floor(i / 3) * 50} white={!k} />)}
            </g>
          ))}
        </g>
      </svg>
      <Huh mood="shocked" x={900} y={1250} h={210} at={170} />
    </AbsoluteFill>
  );
};

const London: React.FC = () => {
  const f = useCurrentFrame();
  const flip = f > 190;
  const t = interpolate(f, [10, 120], [-300, 1380], clamp);
  return (
    <AbsoluteFill>
      <Big y={130} size={130} at={0} color={flip ? '#fff' : YEL}>{flip ? 'TOKYO 🇯🇵' : '1914 🇬🇧'}</Big>
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        {!flip ? <g>
          {/* tube tunnel */}
          <path d="M 0 1150 L 0 820 Q 540 520 1080 820 L 1080 1150 Z" fill="#2a2a45" stroke={INK} strokeWidth={12} />
          <path d="M 60 1150 L 60 850 Q 540 590 1020 850 L 1020 1150" fill="none" stroke="#ffffff22" strokeWidth={10} />
          <rect x={0} y={1110} width={1080} height={16} fill="#888" />
          <Car x={t} y={1020} color={RED} />
          <Car x={t - 345} y={1020} color={RED} />
          <Person x={540} y={680} s={2.2} c={ORG} />
          <text x={620} y={560} fontFamily="B8" fontSize={90} fill={YEL}>!</text>
        </g> : <g>
          {/* jammed street with trams */}
          <rect x={0} y={760} width={1080} height={420} fill={STREET} stroke={INK} strokeWidth={10} />
          {[0, 1, 2, 3].map((i) => (
            <g key={i} transform={`translate(${120 + i * 270 + Math.sin(f / 3 + i) * 3} 900)`}>
              <rect x={-110} y={-90} width={220} height={150} rx={24} fill={TRAM} stroke={INK} strokeWidth={9} />
              {[-70, 0, 70].map((wx) => <rect key={wx} x={wx - 25} y={-65} width={50} height={45} rx={8} fill={SKY} stroke={INK} strokeWidth={6} />)}
              <line x1={0} y1={-90} x2={0} y2={-150} stroke={INK} strokeWidth={8} />
            </g>
          ))}
          {Array.from({length: 14}).map((_, i) => <Person key={i} x={70 + i * 72} y={1100} s={0.7} c={[PINK, YEL, TEAL, ORG][i % 4]} bob={Math.sin(f / 4 + i) * 6} />)}
        </g>}
      </svg>
      {!flip && <Pill text="London Underground 🚇" x={540} y={420} at={20} bg={RED} size={46} />}
      {flip && <Pill text="jammed trams 🚋" x={540} y={1300} at={195} bg={TRAM} size={50} />}
      {!flip && <Pill text="“Tokyo needs this.”" x={540} y={1300} at={90} bg={YEL} color={INK} size={50} />}
    </AbsoluteFill>
  );
};

const Beans: React.FC = () => {
  const f = useCurrentFrame();
  const people = Math.floor(interpolate(f, [100, 230], [0, 9], clamp));
  const cars = Math.floor(interpolate(f, [200, 320], [0, 6], clamp));
  return (
    <AbsoluteFill>
      <Big y={130} size={92} at={0}>the <span style={{color: '#fff'}}>bean</span> count 🫘</Big>
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        {/* crossroads */}
        <rect x={0} y={420} width={1080} height={160} fill={STREET} />
        <rect x={460} y={300} width={160} height={420} fill={STREET} />
        {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={40 + i * 220} y={494} width={90} height={12} fill="#fff" opacity={0.6} />)}
        {/* walkers and cars passing */}
        {Array.from({length: 4}).map((_, i) => <Person key={i} x={((f * 4 + i * 280) % 1300) - 110} y={400} s={0.65} c={[PINK, TEAL, YEL, ORG][i]} />)}
        {Array.from({length: 2}).map((_, i) => (
          <g key={'c' + i} transform={`translate(${1200 - ((f * 6 + i * 650) % 1400)} 535)`}>
            <rect x={-70} y={-30} width={140} height={55} rx={16} fill={i ? SKY : RED} stroke={INK} strokeWidth={7} />
            <circle cx={-40} cy={28} r={14} fill={INK} /><circle cx={40} cy={28} r={14} fill={INK} />
          </g>
        ))}
        {/* two pockets with counters */}
        {[[300, true, people], [780, false, cars]].map(([px, white, n]) => (
          <g key={String(px)} transform={`translate(${px} 1000)`}>
            <path d="M -170 -150 L 170 -150 L 145 150 Q 0 210 -145 150 Z" fill={white ? '#7D8FB3' : '#5A6B8C'} stroke={INK} strokeWidth={10} />
            {Array.from({length: n as number}).map((_, i) => <Bean key={i} x={-80 + (i % 3) * 80} y={100 - Math.floor(i / 3) * 55} white={white as boolean} s={1.3} />)}
            <text x={0} y={-180} textAnchor="middle" fontFamily="B8" fontSize={46} fill="#fff">{white ? 'LEFT' : 'RIGHT'}</text>
          </g>
        ))}
      </svg>
      <Pill text="⚪ white = a person" x={300} y={1260} at={100} bg="#fff" color={INK} size={40} />
      <Pill text="⚫ black = a car" x={780} y={1260} at={200} bg={INK} size={40} />
      <Huh mood="laughing" x={540} y={790} h={170} at={60} />
    </AbsoluteFill>
  );
};

const Quake: React.FC = () => {
  const f = useCurrentFrame();
  const shake = f > 110 && f < 190 ? Math.sin(f * 2.3) * 14 : 0;
  const p = interpolate(f, [0, 260], [0, 1], {...clamp, easing: ease});
  const steps: [number, string, string, number][] = [[1920, 'company founded 🏢', TEAL, 10], [1923, 'great earthquake 💥', RED, 110], [1925, 'digging starts ⛏️', GINZA, 240]];
  return (
    <AbsoluteFill style={{transform: `translate(${shake}px, ${shake * 0.6}px)`}}>
      <Big y={130} size={96} at={0} color={f > 110 && f < 240 ? RED : YEL}>{f > 110 && f < 240 ? 'then... 💥' : 'the long wait'}</Big>
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        <line x1={160} y1={500} x2={160} y2={500 + 700 * p} stroke="#fff" strokeWidth={12} strokeLinecap="round" />
        {f > 110 && <path d="M 300 760 L 360 820 L 330 860 L 400 930 L 370 980" stroke={INK} strokeWidth={10} fill="none" />}
      </svg>
      {steps.map(([yr, label, c, at], i) => {
        const s = spring({frame: f - at, fps: FPS, config: {damping: 11}});
        return (
          <div key={yr} style={{position: 'absolute', left: 110, top: 470 + i * 300, transform: `scale(${s})`, transformOrigin: 'left center', display: 'flex', alignItems: 'center', gap: 30}}>
            <div style={{width: 100, height: 100, borderRadius: 50, background: c, border: `8px solid ${INK}`}} />
            <div>
              <div style={{fontFamily: 'B8', fontSize: 96, color: '#fff', textShadow: OUT, lineHeight: 1}}>{yr}</div>
              <div style={{fontFamily: 'B8', fontSize: 50, color: c, textShadow: OUT}}>{label}</div>
            </div>
          </div>
        );
      })}
      <Huh mood="shocked" x={880} y={900} h={220} at={115} />
    </AbsoluteFill>
  );
};

const Short: React.FC = () => {
  const f = useCurrentFrame();
  const shrink = interpolate(f, [70, 150], [0, 1], {...clamp, easing: ease});
  const draw = interpolate(f, [150, 200], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Big y={130} size={110} at={150} color={GINZA}>just <Count to={2.2} at={150} len={30} /> km</Big>
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        <rect x={60} y={480} width={960} height={720} rx={40} fill="#ffffff10" stroke="#ffffff40" strokeWidth={6} />
        {/* original big plan */}
        <path d={`M 160 1050 Q 420 600 960 760`} fill="none" stroke="#ffffff66" strokeWidth={22} strokeDasharray="30 22" opacity={1 - shrink} />
        <text x={960} y={720} textAnchor="end" fontFamily="B8" fontSize={42} fill="#fff" opacity={1 - shrink}>Shimbashi (the plan)</text>
        {/* the real first line */}
        <line x1={160} y1={1050} x2={160 + 260 * draw} y2={1050 - 82.5 * draw} stroke={GINZA} strokeWidth={30} strokeLinecap="round" opacity={draw > 0 ? 1 : 0} />
        {[[160, 1050, 'Asakusa'], [420, 1050 - 250 * 0.33, 'Ueno']].map(([x, y, n], i) => (
          <g key={String(n)} opacity={i === 0 || draw > 0.95 ? 1 : 0}>
            <circle cx={x as number} cy={y as number} r={34} fill="#fff" stroke={INK} strokeWidth={10} />
            <text x={x as number} y={(y as number) + 95} textAnchor="middle" fontFamily="B8" fontSize={50} fill="#fff">{n}</text>
          </g>
        ))}
      </svg>
      <Pill text="plan shrinks 📉" x={540} y={420} at={70} bg={PINK} size={46} />
    </AbsoluteFill>
  );
};

const Opening: React.FC = () => {
  const f = useCurrentFrame();
  const q = interpolate(f, [120, 260], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Big y={120} size={84} at={0} color="#fff">Dec 30, 1927</Big>
      <Pill text="🎉 first subway in Asia" x={540} y={290} at={40} bg={GINZA} color={INK} size={50} />
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        {/* station entrance */}
        <rect x={720} y={560} width={280} height={300} rx={20} fill={GINZA} stroke={INK} strokeWidth={10} />
        <rect x={780} y={680} width={160} height={180} rx={12} fill={INK} />
        <text x={860} y={640} textAnchor="middle" fontFamily="B8" fontSize={48} fill={INK}>地下鉄</text>
        {/* queue */}
        {Array.from({length: 26}).map((_, i) => {
          const row = Math.floor(i / 9), col = i % 9;
          const vis = i < 6 + q * 20;
          return vis ? <Person key={i} x={660 - col * 70 - row * 20} y={820 + row * 120} s={0.75} c={[PINK, TEAL, YEL, ORG, SKY][i % 5]} bob={Math.sin(f / 5 + i) * 4} /> : null;
        })}
        {/* clock */}
        <g transform="translate(860 1100)" opacity={interpolate(f, [230, 250], [0, 1], clamp)}>
          <circle r={90} fill="#fff" stroke={INK} strokeWidth={10} />
          <line x1={0} y1={0} x2={0} y2={-60} stroke={INK} strokeWidth={10} strokeLinecap="round" transform={`rotate(${f * 6})`} />
          <line x1={0} y1={0} x2={40} y2={0} stroke={RED} strokeWidth={10} strokeLinecap="round" transform={`rotate(${f * 0.5})`} />
        </g>
      </svg>
      <Big y={1180} size={96} at={110}><Count to={40000} at={110} len={50} suffix="+" /></Big>
      <Sub y={1290} size={44} at={120}>riders that first morning</Sub>
      <Pill text="⏰ 2+ hour waits" x={860} y={960} at={240} bg={RED} size={40} />
    </AbsoluteFill>
  );
};

const Grow: React.FC = () => {
  const f = useCurrentFrame();
  const a = interpolate(f, [10, 90], [0, 1], {...clamp, easing: ease});
  const b = interpolate(f, [90, 170], [0, 1], {...clamp, easing: ease});
  const more = interpolate(f, [240, 360], [0, 1], clamp);
  const P = [[860, 600], [760, 760], [560, 980], [260, 1120]];
  const seg = (i: number, t: number) => `M ${P[i][0]} ${P[i][1]} L ${P[i][0] + (P[i + 1][0] - P[i][0]) * t} ${P[i][1] + (P[i + 1][1] - P[i][1]) * t}`;
  return (
    <AbsoluteFill>
      <Big y={130} size={96} at={0} color={GINZA}>the Ginza Line 🟠</Big>
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        {Array.from({length: 9}).map((_, i) => {
          const t = interpolate(more, [i / 9, (i + 1) / 9], [0, 1], clamp);
          const y = 520 + i * 75;
          return <path key={i} d={`M ${80} ${y} Q 540 ${y + (i % 2 ? 160 : -120)} ${80 + 920 * t} ${y + 260 * Math.sin(i)}`} fill="none" stroke={LINES[i]} strokeWidth={18} strokeLinecap="round" opacity={t > 0 ? 0.9 : 0} />;
        })}
        <path d={seg(0, 1)} stroke={GINZA} strokeWidth={30} strokeLinecap="round" />
        <path d={seg(1, a)} stroke={GINZA} strokeWidth={30} strokeLinecap="round" />
        <path d={seg(2, b)} stroke={GINZA} strokeWidth={30} strokeLinecap="round" />
        {[['Asakusa', 0, -1], ['Ueno', 1, -1], ['Shimbashi 1934', 2, 90], ['Shibuya 1939', 3, 170]].map(([n, i, at]) => (
          <g key={String(n)} opacity={f >= (at as number) ? 1 : 0}>
            <circle cx={P[i as number][0]} cy={P[i as number][1]} r={30} fill="#fff" stroke={INK} strokeWidth={9} />
            <text x={P[i as number][0] - ((i as number) > 1 ? 0 : 50)} y={P[i as number][1] + ((i as number) > 1 ? -50 : 15)} textAnchor={(i as number) > 1 ? 'middle' : 'end'} fontFamily="B8" fontSize={44} fill="#fff">{n}</text>
          </g>
        ))}
      </svg>
      <Pill text="after the war: more lines 🚇" x={540} y={1310} at={250} bg={TEAL} size={44} />
    </AbsoluteFill>
  );
};

const Today: React.FC = () => {
  const f = useCurrentFrame();
  const dive = interpolate(f, [150, 260], [0, 1], {...clamp, easing: ease});
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 140, width: '100%', display: 'flex', justifyContent: 'center', gap: 70, fontFamily: 'B8', textShadow: OUT}}>
        <div style={{textAlign: 'center'}}><div style={{fontSize: 130, color: YEL}}><Count to={13} at={5} len={30} /></div><div style={{fontSize: 48, color: '#fff'}}>lines</div></div>
        <div style={{textAlign: 'center'}}><div style={{fontSize: 130, color: GINZA}}><Count to={286} at={40} len={40} /></div><div style={{fontSize: 48, color: '#fff'}}>stations</div></div>
      </div>
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        <rect x={0} y={600} width={1080} height={20} fill="#3BB273" />
        <rect x={0} y={620} width={1080} height={700} fill="#6E4520" opacity={interpolate(f, [130, 160], [0, 1], clamp)} />
        {[0, 1, 2, 3].map((i) => <rect key={i} x={120 + i * 70} y={530 - i * 20} width={55} height={70 + i * 20} fill="#9aa5c4" stroke={INK} strokeWidth={6} />)}
        <g opacity={interpolate(f, [130, 160], [0, 1], clamp)}>
          <line x1={760} y1={620} x2={760} y2={620 + 620 * dive} stroke={YEL} strokeWidth={12} strokeDasharray="24 16" />
          <g transform={`translate(760 ${620 + 620 * dive})`}>
            <rect x={-150} y={-50} width={300} height={100} rx={20} fill={'#B6007A'} stroke={INK} strokeWidth={9} />
            <text x={0} y={16} textAnchor="middle" fontFamily="B8" fontSize={44} fill="#fff">Roppongi</text>
          </g>
        </g>
      </svg>
      <Big y={1000} size={120} at={200} color="#fff"><Count to={42} at={200} len={40} /> m ⬇️</Big>
      <Pill text="deepest station" x={360} y={1180} at={210} bg={'#B6007A'} size={46} />
    </AbsoluteFill>
  );
};

const Hundred: React.FC = () => {
  const f = useCurrentFrame();
  const cake = spring({frame: f - 100, fps: FPS, config: {damping: 10}});
  return (
    <AbsoluteFill>
      <Big y={130} size={96} at={0} color={GINZA}>still running 🚇</Big>
      <svg width={1080} height={1420} style={{position: 'absolute', top: 0}}>
        <rect x={0} y={560} width={1080} height={16} fill="#888" />
        <Car x={interpolate(f, [0, 100], [-200, 540], {...clamp, easing: ease})} y={470} face />
        <g transform={`translate(540 1000) scale(${cake})`}>
          <rect x={-240} y={-40} width={480} height={200} rx={30} fill={PINK} stroke={INK} strokeWidth={10} />
          <path d="M -240 10 Q -180 60 -120 10 T 0 10 T 120 10 T 240 10" fill="none" stroke="#fff" strokeWidth={18} />
          <text x={0} y={135} textAnchor="middle" fontFamily="B8" fontSize={120} fill={YEL} stroke={INK} strokeWidth={6}>100</text>
          {[-120, 0, 120].map((x) => <g key={x}><rect x={x - 10} y={-110} width={20} height={70} fill="#fff" stroke={INK} strokeWidth={5} /><ellipse cx={x} cy={-130 + Math.sin(f / 3 + x) * 3} rx={12} ry={20} fill={ORG} /></g>)}
        </g>
      </svg>
      <Pill text="🎂 Dec 30, 2027" x={540} y={1280} at={150} bg={YEL} color={INK} size={52} />
      <Huh mood="laughing" x={900} y={1180} h={190} at={160} />
    </AbsoluteFill>
  );
};

export const scenes: SceneMap = {
  hook: {C: Hook, hue: GINZA}, london: {C: London, hue: RED}, beans: {C: Beans, hue: '#5b6cff'}, quake: {C: Quake, hue: RED},
  short: {C: Short, hue: TEAL}, opening: {C: Opening, hue: GINZA}, grow: {C: Grow, hue: '#3d7bd9'}, today: {C: Today, hue: '#8F76D6'},
  hundred: {C: Hundred, hue: PINK}, cta: {C: CTA, hue: PINK},
};
