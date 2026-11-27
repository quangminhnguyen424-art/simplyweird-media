import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, spring} from 'remotion';
import {FPS, INK, PINK, YEL, TEAL, ORG, CREAM, SKY, RED, clamp, ease, Slam, Pill, Huh, Arrow, Marker, CTA, Clip, SceneMap} from '../../kit';
import timing from './timing.json';

export const title = 'why wheels spin backwards on camera';
export const segs = timing;

const METAL = '#C9D1E3';
const SPOKES = 5;

/** A car wheel: tyre, rim and 5 spokes; one spoke painted red so you can track it. */
const Wheel: React.FC<{angle: number; size?: number; ghost?: boolean}> = ({angle, size = 420, ghost}) => (
  <svg viewBox="-220 -220 440 440" width={size} height={size} style={{overflow: 'visible', opacity: ghost ? 0.35 : 1}}>
    <circle r={205} fill="#1e1e2c" stroke={INK} strokeWidth={10} />
    <circle r={150} fill="#2f3247" stroke={METAL} strokeWidth={10} />
    <g transform={`rotate(${angle})`}>
      {Array.from({length: SPOKES}).map((_, i) => (
        <g key={i} transform={`rotate(${(i * 360) / SPOKES})`}>
          <path d="M -16 -30 L -26 -142 L 26 -142 L 16 -30 Z" fill={i === 0 ? RED : METAL} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        </g>
      ))}
      <circle r={40} fill={METAL} stroke={INK} strokeWidth={8} />
      {Array.from({length: SPOKES}).map((_, i) => <circle key={i} r={6} cx={22 * Math.sin((i * 2 * Math.PI) / SPOKES)} cy={-22 * Math.cos((i * 2 * Math.PI) / SPOKES)} fill={INK} />)}
    </g>
  </svg>
);

/** Row of "photos" (frames) showing the wheel at angle start + k*step. */
const FrameStrip: React.FC<{step: number; y: number; n?: number; at?: number; color?: string}> = ({step, y, n = 4, at = 0, color = '#fff'}) => {
  const f = useCurrentFrame();
  return (
    <div style={{position: 'absolute', top: y, width: '100%', display: 'flex', justifyContent: 'center', gap: 18}}>
      {Array.from({length: n}).map((_, k) => {
        const s = spring({frame: f - at - k * 10, fps: FPS, config: {damping: 12}});
        return (
          <div key={k} style={{transform: `scale(${s})`, background: CREAM, padding: 10, borderRadius: 14, boxShadow: `0 8px 0 ${INK}`, border: `4px solid ${color}`}}>
            <Wheel angle={k * step} size={190} />
            <div style={{textAlign: 'center', fontFamily: 'B8', fontSize: 30, color: INK}}>photo {k + 1}</div>
          </div>
        );
      })}
    </div>
  );
};

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Clip name="c1" rate={0.53} dim={0.3} />
      <Slam words={['wheels', 'spinning', 'backwards?']} y={220} size={110} />
      {f > 150 && <Pill text="the camera is tricking you 🎥" x={540} y={1300} at={150} bg={YEL} color={INK} size={44} />}
    </AbsoluteFill>
  );
};

const Frames: React.FC = () => {
  const f = useCurrentFrame();
  const flip = Math.floor(f / 6) % 6;
  return (
    <AbsoluteFill>
      <Slam words={['video', '=', 'photos']} y={160} size={110} />
      <div style={{position: 'absolute', left: 290, top: 420, width: 500, height: 600}}>
        {Array.from({length: 6}).map((_, i) => (
          <div key={i} style={{position: 'absolute', left: i * 12, top: i * 12, width: 440, height: 540, background: i === flip ? CREAM : '#ffffffcc', borderRadius: 20, border: `6px solid ${INK}`,
            boxShadow: `0 8px 0 ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            {i === 5 && <Wheel angle={flip * 20} size={330} />}
          </div>
        ))}
      </div>
      {['24', '30', '60'].map((n, i) => <Pill key={n} text={`${n} / second`} x={220 + i * 320} y={1150} at={60 + i * 25} bg={[TEAL, YEL, PINK][i]} color={INK} size={40} />)}
      <Pill text="flipped fast = motion" x={540} y={1290} at={180} bg={SKY} color={INK} size={44} />
    </AbsoluteFill>
  );
};

const Slow: React.FC = () => (
  <AbsoluteFill>
    <Pill text="slow wheel" x={540} y={220} at={0} bg={TEAL} color={INK} size={56} />
    <FrameStrip step={15} y={360} at={10} />
    <svg width={1080} height={1920} style={{position: 'absolute'}}>
      <Arrow d="M 160 700 L 920 700" color={TEAL} progress={interpolate(useCurrentFrame(), [60, 110], [0, 1], clamp)} />
    </svg>
    <div style={{position: 'absolute', top: 760, width: '100%', textAlign: 'center', fontFamily: 'B8', fontSize: 64, color: '#fff'}}>red spoke moves <Marker at={120} color={TEAL}>forward</Marker> ✅</div>
    <div style={{position: 'absolute', top: 900, width: '100%', display: 'flex', justifyContent: 'center'}}><Wheel angle={useCurrentFrame() * 1.5} size={360} /></div>
  </AbsoluteFill>
);

const Fast: React.FC = () => {
  const f = useCurrentFrame();
  // each photo the wheel turns 64 deg; one spoke gap is 72 deg
  return (
    <AbsoluteFill>
      <Pill text="fast wheel" x={540} y={220} at={0} bg={RED} size={56} />
      <FrameStrip step={64} y={360} at={10} color={YEL} />
      <div style={{position: 'absolute', top: 720, width: '100%', textAlign: 'center', fontFamily: 'B8', fontSize: 56, color: '#fff'}}>
        each photo: <span style={{color: YEL}}>64°</span> turned
      </div>
      <div style={{position: 'absolute', top: 800, width: '100%', textAlign: 'center', fontFamily: 'B8', fontSize: 56, color: '#fff', opacity: interpolate(f, [90, 105], [0, 1], clamp)}}>
        spokes are <span style={{color: TEAL}}>72°</span> apart
      </div>
      <div style={{position: 'absolute', top: 900, width: '100%', display: 'flex', justifyContent: 'center'}}><Wheel angle={Math.floor(f / 4) * 64} size={360} /></div>
    </AbsoluteFill>
  );
};

const Trick: React.FC = () => {
  const f = useCurrentFrame();
  const a = interpolate(f, [20, 70], [0, 1], {...clamp, easing: ease});
  return (
    <AbsoluteFill>
      <Slam words={['shortest', 'path']} y={170} size={110} />
      <div style={{position: 'absolute', top: 360, width: '100%', display: 'flex', justifyContent: 'center'}}>
        <div style={{position: 'relative', width: 560, height: 560}}>
          <div style={{position: 'absolute', inset: 0}}><Wheel angle={0} size={560} ghost /></div>
          <div style={{position: 'absolute', inset: 0}}><Wheel angle={64} size={560} /></div>
        </div>
      </div>
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        {/* real move: +64 deg (long way, clockwise) vs seen: -8 deg (short way) */}
        <Arrow d="M 540 330 A 300 300 0 0 1 810 520" color={TEAL} progress={a} w={12} />
        <Arrow d="M 610 350 A 300 300 0 0 0 560 335" color={RED} progress={interpolate(f, [90, 120], [0, 1], clamp)} w={16} />
      </svg>
      <Pill text="real: 64° forward" x={300} y={1000} at={40} bg={TEAL} color={INK} size={42} />
      <Pill text="brain sees: 8° back ↩" x={780} y={1000} at={110} bg={RED} size={42} />
      {f > 170 && <Slam words={['reverse!']} y={1110} size={110} at={170} color={RED} />}
      <Huh mood="shocked" x={930} y={1180} h={200} at={180} />
    </AbsoluteFill>
  );
};

const Freeze: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Pill text="72° per photo = frozen 🧊" x={540} y={230} at={0} bg={SKY} color={INK} size={50} />
      <div style={{position: 'absolute', top: 340, width: '100%', display: 'flex', justifyContent: 'center'}}><Wheel angle={Math.floor(f / 3) * 72} size={520} /></div>
      <svg viewBox="-200 -60 400 120" width={700} height={210} style={{position: 'absolute', left: 190, top: 950}}>
        <rect x={-30} y={-14} width={60} height={28} rx={10} fill={INK} />
        <g transform={`rotate(${Math.floor(f / 3) * 90})`}>
          <rect x={-190} y={-8} width={380} height={16} rx={8} fill={METAL} stroke={INK} strokeWidth={4} />
        </g>
      </svg>
      <Pill text="helicopter blades too 🚁" x={540} y={1250} at={130} bg={YEL} color={INK} size={44} />
    </AbsoluteFill>
  );
};

const Name: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Slam words={['wagon', 'wheel', 'effect']} y={170} size={110} />
      <svg viewBox="-260 -200 520 400" width={760} height={585} style={{position: 'absolute', left: 160, top: 440}}>
        <rect x={-200} y={-160} width={300} height={170} rx={20} fill="#8B5A2B" stroke={INK} strokeWidth={10} />
        <path d="M -220 -160 Q -50 -260 120 -160" fill={CREAM} stroke={INK} strokeWidth={10} />
        {[-130, 60].map((cx) => (
          <g key={cx} transform={`translate(${cx} 60) rotate(${-f * 4})`}>
            <circle r={90} fill="none" stroke="#5a3a1a" strokeWidth={16} />
            {Array.from({length: 8}).map((_, i) => <line key={i} x1={0} y1={0} x2={0} y2={-88} stroke="#5a3a1a" strokeWidth={10} transform={`rotate(${i * 45})`} />)}
            <circle r={16} fill="#5a3a1a" />
          </g>
        ))}
      </svg>
      <Pill text="old western movies 🤠" x={540} y={1180} at={60} bg={ORG} color={INK} size={46} />
      <Pill text="wheels rolling the wrong way" x={540} y={1300} at={110} bg={PINK} size={38} />
    </AbsoluteFill>
  );
};

const Weird: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 200, width: '100%', textAlign: 'center', fontSize: 180, transform: `scale(${spring({frame: f, fps: FPS, config: {damping: 10}})})`}}>☀️👀</div>
      <div style={{position: 'absolute', top: 470, width: '100%', textAlign: 'center', fontFamily: 'B8', fontSize: 70, color: '#fff', lineHeight: 1.15}}>
        happens in <Marker at={30}>real life</Marker> too
      </div>
      <div style={{position: 'absolute', top: 640, width: '100%', display: 'flex', justifyContent: 'center'}}><Wheel angle={-f * 3} size={420} /></div>
      <Pill text="scientists still argue why 🤔" x={540} y={1180} at={120} bg={YEL} color={INK} size={46} />
      <Huh mood="thinking" x={880} y={1220} h={190} at={150} />
    </AbsoluteFill>
  );
};

export const scenes: SceneMap = {
  hook: {C: Hook, hue: SKY},
  frames: {C: Frames, hue: YEL},
  slow: {C: Slow, hue: TEAL},
  fast: {C: Fast, hue: RED},
  trick: {C: Trick, hue: PINK},
  freeze: {C: Freeze, hue: SKY},
  name: {C: Name, hue: ORG},
  weird: {C: Weird, hue: YEL},
  cta: {C: CTA, hue: PINK},
};
