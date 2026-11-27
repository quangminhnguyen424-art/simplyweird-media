import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, spring} from 'remotion';
import {FPS, INK, PINK, YEL, TEAL, ORG, CREAM, SKY, RED, clamp, ease, Slam, Pill, Huh, Arrow, Count, Counter, CTA, SceneMap, ExplodedView, Part} from '../../kit';
import timing from './timing.json';

export const title = 'how a drill actually works';
export const segs = timing;

const BODY = '#FFB020', BODY2 = '#E08E00', DARK = '#2B2B3D', METAL = '#B8C2D6', STEEL = '#7D89A6', COPPER = '#D9773B';

/* ---------- the drill, as separate parts (viewBox 0 0 1000 900) ---------- */

const Motor: React.FC<{spin: number}> = ({spin}) => (
  <g>
    <rect x={190} y={215} width={190} height={110} rx={22} fill={STEEL} stroke={INK} strokeWidth={8} />
    {Array.from({length: 7}).map((_, i) => {
      const x = 205 + ((i * 26 + spin) % 182);
      return <rect key={i} x={x} y={225} width={12} height={90} rx={4} fill={COPPER} opacity={0.9} />;
    })}
    <rect x={380} y={258} width={30} height={24} fill={METAL} stroke={INK} strokeWidth={5} />
  </g>
);

const Gearbox: React.FC<{spin: number}> = ({spin}) => (
  <g>
    <rect x={410} y={220} width={130} height={100} rx={14} fill={METAL} stroke={INK} strokeWidth={8} />
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(${440 + i * 36} 270) rotate(${spin * (i % 2 ? -1 : 1)})`}>
        <circle r={16} fill="#fff" stroke={INK} strokeWidth={4} />
        {Array.from({length: 8}).map((_, t) => <rect key={t} x={-3} y={-21} width={6} height={8} fill={INK} transform={`rotate(${t * 45})`} />)}
      </g>
    ))}
  </g>
);

const Clutch: React.FC = () => (
  <g>
    <rect x={548} y={200} width={58} height={140} rx={14} fill={DARK} stroke={INK} strokeWidth={8} />
    {[0, 1, 2, 3].map((i) => <text key={i} x={577} y={232 + i * 30} textAnchor="middle" fontFamily="B8" fontSize={22} fill={YEL}>{[4, 8, 12, 16][i]}</text>)}
  </g>
);

const Chuck: React.FC<{spin: number}> = ({spin}) => (
  <g>
    <path d="M 612 215 L 720 232 L 770 250 L 770 290 L 720 308 L 612 325 Z" fill="#3A3A50" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
    {[0, 1, 2].map((i) => <rect key={i} x={630 + ((i * 40 + spin) % 120)} y={222} width={10} height={96} fill="#55557a" />)}
  </g>
);

const Bit: React.FC<{spin: number}> = ({spin}) => (
  <g>
    <rect x={770} y={258} width={190} height={24} rx={6} fill={METAL} stroke={INK} strokeWidth={6} />
    {Array.from({length: 6}).map((_, i) => <line key={i} x1={790 + ((i * 30 + spin) % 170)} y1={260} x2={804 + ((i * 30 + spin) % 170)} y2={280} stroke={INK} strokeWidth={5} />)}
    <path d="M 960 258 L 990 270 L 960 282 Z" fill={METAL} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
  </g>
);

const Housing: React.FC<{see: number}> = ({see}) => (
  <g opacity={1 - 0.8 * see}>
    <path d="M 150 200 Q 150 180 175 180 L 600 180 Q 625 180 625 205 L 625 335 Q 625 360 600 360 L 470 360 L 500 640 L 300 640 L 330 360 L 175 360 Q 150 360 150 335 Z"
      fill={BODY} stroke={INK} strokeWidth={10} strokeLinejoin="round" />
    <path d="M 175 200 L 590 200" stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={0.5} />
    <rect x={240} y={230} width={200} height={20} rx={10} fill={BODY2} />
  </g>
);

const Trigger: React.FC<{press?: number}> = ({press = 0}) => (
  <g transform={`translate(${-12 * press} 0)`}>
    <rect x={455} y={385} width={48} height={70} rx={18} fill={RED} stroke={INK} strokeWidth={8} />
  </g>
);

const Battery: React.FC<{level?: number}> = ({level = 1}) => (
  <g>
    <rect x={250} y={640} width={310} height={120} rx={20} fill={DARK} stroke={INK} strokeWidth={10} />
    <rect x={250} y={640} width={310} height={30} rx={12} fill={BODY} stroke={INK} strokeWidth={8} />
    {[0, 1, 2, 3].map((i) => <rect key={i} x={290 + i * 62} y={700} width={44} height={26} rx={6} fill={i < Math.round(level * 4) ? '#4CD964' : '#555'} />)}
  </g>
);

const drillParts = (spin: number, see: number, press = 0, level = 1): Part[] => [
  {id: 'housing', el: <Housing see={see} />, dx: 0, dy: -220, z: 0},
  {id: 'battery', el: <Battery level={level} />, dx: 0, dy: 110, z: 2},
  {id: 'trigger', el: <Trigger press={press} />, dx: 90, dy: 90, z: 3},
  {id: 'motor', el: <Motor spin={spin} />, dx: -70, dy: 30, z: 1},
  {id: 'gears', el: <Gearbox spin={spin * 2} />, dx: -25, dy: 30, z: 1},
  {id: 'clutch', el: <Clutch />, dx: 20, dy: 30, z: 1},
  {id: 'chuck', el: <Chuck spin={spin} />, dx: 60, dy: 30, z: 1},
  {id: 'bit', el: <Bit spin={spin} />, dx: 85, dy: 30, z: 1},
];

/** The whole drill. p = explode amount, focus = highlighted part. */
const Drill: React.FC<{p: number; focus?: string; spin?: number; press?: number; level?: number; w?: number; x?: number; y?: number}> = ({p, focus, spin = 0, press = 0, level = 1, w = 1000, x = 40, y = 300}) => (
  <svg viewBox="60 -60 1040 960" width={w} height={(w * 960) / 1040} style={{position: 'absolute', left: x, top: y, overflow: 'visible'}}>
    <ExplodedView parts={drillParts(spin, Math.min(1, p * 2), press, level)} p={p} focus={focus} />
  </svg>
);

const Label: React.FC<{text: string; x: number; y: number; at: number; bg?: string}> = ({text, x, y, at, bg = PINK}) => <Pill text={text} x={x} y={y} at={at} bg={bg} size={42} />;

/* ---------- scenes ---------- */

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [150, 230], [0, 1], {...clamp, easing: ease});
  return (
    <AbsoluteFill>
      <Slam words={['one', 'squeeze']} y={150} size={120} />
      <Drill p={p} spin={f * 8} press={f < 140 ? Math.min(1, f / 20) : 0} y={330} />
      {f > 100 && f < 160 && <Pill text="6 parts?!" x={800} y={420} at={100} bg={YEL} color={INK} size={50} />}
      {f > 200 && <Pill text="let's take it apart 🔧" x={540} y={1330} at={200} bg={TEAL} color={INK} size={46} />}
    </AbsoluteFill>
  );
};

const Focus: React.FC<{n: number; id: string; name: string; children?: React.ReactNode; spin?: (f: number) => number; press?: (f: number) => number; level?: (f: number) => number}> = ({n, id, name, children, spin, press, level}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Counter n={n} of={6} y={120} color={YEL} />
      <Slam words={[name]} y={190} size={110} />
      <Drill p={1} focus={id} spin={spin ? spin(f) : 0} press={press ? press(f) : 0} level={level ? level(f) : 1} w={1000} x={40} y={320} />
      {children}
    </AbsoluteFill>
  );
};

const BatteryScene: React.FC = () => (
  <Focus n={1} id="battery" name="battery" level={(f) => 0.25 + 0.75 * Math.min(1, f / 60)}>
    <Label text="lithium-ion cells 🔋" x={540} y={1290} at={30} bg={TEAL} />
    <Label text="1961: first cordless drill" x={540} y={1390} at={170} bg={YEL} />
  </Focus>
);

const TriggerScene: React.FC = () => {
  const f = useCurrentFrame();
  const sq = interpolate(f, [90, 170], [0, 1], clamp);
  return (
    <Focus n={2} id="trigger" name="trigger" press={() => sq} spin={(fr) => fr * 30 * sq}>
      <div style={{position: 'absolute', left: 140, right: 140, top: 1270, height: 36, borderRadius: 20, background: '#ffffff22', border: '5px solid #fff'}}>
        <div style={{width: `${sq * 100}%`, height: '100%', borderRadius: 20, background: `linear-gradient(90deg, ${TEAL}, ${RED})`}} />
      </div>
      <div style={{position: 'absolute', top: 1320, width: '100%', textAlign: 'center', fontFamily: 'B8', fontSize: 46, color: '#fff'}}>squeeze harder = faster</div>
      <Label text="closes the circuit ⚡" x={540} y={1210} at={20} bg={PINK} />
    </Focus>
  );
};

const MotorScene: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Focus n={3} id="motor" name="motor" spin={(fr) => fr * 40}>
      <Label text="super fast 🌀" x={300} y={1320} at={20} bg={SKY} />
      {f > 170 && <Label text="but weak 😮‍💨" x={760} y={1320} at={170} bg={RED} />}
      <Huh mood="thinking" x={540} y={1240} h={190} at={200} />
    </Focus>
  );
};

/** Planetary gearbox close-up. */
const Planetary: React.FC = () => {
  const f = useCurrentFrame();
  const sun = f * 6, carrier = f * 1.2;
  const gear = (r: number, teeth: number, fill: string) => (
    <g>
      <circle r={r} fill={fill} stroke={INK} strokeWidth={6} />
      {Array.from({length: teeth}).map((_, t) => <rect key={t} x={-5} y={-r - 10} width={10} height={14} fill={fill} stroke={INK} strokeWidth={3} transform={`rotate(${(t * 360) / teeth})`} />)}
    </g>
  );
  return (
    <svg viewBox="-260 -260 520 520" width={600} height={600} style={{position: 'absolute', left: 240, top: 340}}>
      <circle r={240} fill="none" stroke={INK} strokeWidth={30} />
      <circle r={240} fill="none" stroke={METAL} strokeWidth={20} />
      {Array.from({length: 48}).map((_, t) => <rect key={t} x={-5} y={-232} width={10} height={14} fill={METAL} stroke={INK} strokeWidth={2} transform={`rotate(${t * 7.5})`} />)}
      <g transform={`rotate(${carrier})`}>
        {[0, 120, 240].map((a) => (
          <g key={a} transform={`rotate(${a}) translate(0 -140) rotate(${-sun * 0.7})`}>{gear(70, 12, TEAL)}</g>
        ))}
      </g>
      <g transform={`rotate(${sun})`}>{gear(55, 10, YEL)}</g>
    </svg>
  );
};

const GearsScene: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Counter n={4} of={6} y={120} color={YEL} />
      <Slam words={['planetary', 'gears']} y={180} size={90} />
      <Planetary />
      <Pill text="sun" x={540} y={1000} at={60} bg={YEL} color={INK} size={40} />
      <Pill text="planets" x={260} y={1000} at={100} bg={TEAL} color={INK} size={40} />
      <Pill text="ring" x={820} y={1000} at={140} bg={SKY} color={INK} size={40} />
      {f > 200 && <Slam words={['speed', '→', 'twist']} y={1120} size={84} at={200} gap={6} />}
    </AbsoluteFill>
  );
};

const ClutchScene: React.FC = () => {
  const f = useCurrentFrame();
  const slip = f > 140;
  const turn = slip ? 360 * 2 : interpolate(f, [20, 140], [0, 720], clamp);
  return (
    <AbsoluteFill>
      <Counter n={5} of={6} y={120} color={YEL} />
      <Slam words={['clutch']} y={190} size={120} />
      {/* screw going into wood */}
      <div style={{position: 'absolute', left: 140, right: 140, top: 760, height: 260, background: '#C68A55', border: `8px solid ${INK}`, borderRadius: 20}} />
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <g transform={`translate(540 ${interpolate(f, [20, 140], [470, 700], clamp)})`}>
          <rect x={-18} y={0} width={36} height={180} fill={METAL} stroke={INK} strokeWidth={6} />
          {Array.from({length: 6}).map((_, i) => <line key={i} x1={-18} y1={20 + i * 26 + ((turn / 30) % 26)} x2={18} y2={10 + i * 26 + ((turn / 30) % 26)} stroke={INK} strokeWidth={5} />)}
          <ellipse cx={0} cy={0} rx={60} ry={18} fill={METAL} stroke={INK} strokeWidth={6} />
          <path d={`M -30 0 L 30 0 M 0 -10 L 0 10`} stroke={INK} strokeWidth={6} transform={`rotate(${turn % 180})`} />
        </g>
      </svg>
      {slip && [0, 1, 2].map((i) => (
        <Pill key={i} text="click" x={300 + i * 240} y={560 - (f % 20 < 10 ? 10 : 0)} at={140 + i * 12} bg={YEL} color={INK} size={40} />
      ))}
      <Pill text="snug → it slips, screw stays safe ✅" x={540} y={1130} at={170} bg={TEAL} color={INK} size={38} />
    </AbsoluteFill>
  );
};

const ChuckScene: React.FC = () => {
  const f = useCurrentFrame();
  const close = interpolate(f, [30, 110], [0, 1], {...clamp, easing: ease});
  return (
    <AbsoluteFill>
      <Counter n={6} of={6} y={120} color={YEL} />
      <Slam words={['chuck']} y={190} size={120} />
      <svg viewBox="-300 -300 600 600" width={640} height={640} style={{position: 'absolute', left: 220, top: 380}}>
        <circle r={270} fill="#3A3A50" stroke={INK} strokeWidth={12} />
        <circle r={60} fill={METAL} stroke={INK} strokeWidth={8} />
        <path d="M -20 -45 L 20 -45 L 5 45 L -5 45 Z" fill={STEEL} opacity={0.6} />
        {[0, 120, 240].map((a) => (
          <g key={a} transform={`rotate(${a + f * (close >= 1 ? 3 : 0)})`}>
            <rect x={-34} y={-250 + 170 * close} width={68} height={130} rx={14} fill={YEL} stroke={INK} strokeWidth={8} />
          </g>
        ))}
      </svg>
      <Pill text="3 jaws, always centered" x={540} y={1110} at={60} bg={PINK} size={44} />
    </AbsoluteFill>
  );
};

const Rebuild: React.FC = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [10, 140], [1, 0], {...clamp, easing: ease});
  const go = f > 160;
  const names = ['battery', 'trigger', 'motor', 'gears', 'clutch', 'chuck'];
  return (
    <AbsoluteFill>
      <Slam words={['back', 'together']} y={150} size={110} />
      <Drill p={p} spin={go ? f * 30 : 0} press={go ? 1 : 0} y={330} />
      <div style={{position: 'absolute', top: 1310, width: '100%', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 12, padding: '0 60px', boxSizing: 'border-box'}}>
        {names.map((n, i) => {
          const s = spring({frame: f - 20 - i * 18, fps: FPS, config: {damping: 12}});
          return <div key={n} style={{transform: `scale(${s})`, background: [TEAL, RED, SKY, YEL, ORG, PINK][i], color: INK, fontFamily: 'B8', fontSize: 34, padding: '6px 22px', borderRadius: 999}}>{n}</div>;
        })}
      </div>
    </AbsoluteFill>
  );
};

export const scenes: SceneMap = {
  hook: {C: Hook, hue: BODY},
  battery: {C: BatteryScene, hue: TEAL},
  trigger: {C: TriggerScene, hue: RED},
  motor: {C: MotorScene, hue: SKY},
  gears: {C: GearsScene, hue: YEL},
  clutch: {C: ClutchScene, hue: ORG},
  chuck: {C: ChuckScene, hue: PINK},
  rebuild: {C: Rebuild, hue: TEAL},
  cta: {C: CTA, hue: PINK},
};
