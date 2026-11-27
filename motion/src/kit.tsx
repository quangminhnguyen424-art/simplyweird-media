/**
 * Simply Weird motion-graphics kit (Remotion). Every episode imports from here.
 * Look: dark ink background with moving grid + particles, Baloo type with ink outline,
 * kinetic captions (current word yellow), slam headlines, pills, Huh mascot, draw-on arrows,
 * zoom-blur scene transitions, progress bar. One accent hue per scene.
 */
import React from 'react';
import {AbsoluteFill, Sequence, Img, OffthreadVideo, staticFile, useCurrentFrame, interpolate, spring, Easing, random} from 'remotion';

export const FPS = 30;
export const PAD = 0.35; // seconds of air after each narration line
export const LEAD = 8; // frames before first scene
export const TAIL = 20; // frames after last scene
export const INK = '#14142B', PINK = '#FF5C8A', YEL = '#FFD23F', TEAL = '#2EC4B6', ORG = '#FF8A3D', CREAM = '#FFF6DE', SKY = '#7FB2FF', RED = '#FF4040';
export const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
export const ease = Easing.bezier(0.22, 1, 0.36, 1);
export const OUTLINE = (w = 3) => `0 ${w * 2 + 1}px 0 ${INK}, ${w}px ${w}px 0 ${INK}, -${w}px ${w}px 0 ${INK}, ${w}px -${w}px 0 ${INK}, -${w}px -${w}px 0 ${INK}`;

export type Seg = {id: string; say: string; dur: number};
export const layout = (segs: Seg[]) => {
  const lens = segs.map((s) => Math.round((s.dur + PAD) * FPS));
  const starts = lens.map((_, i) => lens.slice(0, i).reduce((a, b) => a + b, 0) + LEAD);
  const total = starts[starts.length - 1] + lens[lens.length - 1] + TAIL;
  return {lens, starts, total};
};

const fontCss = `
@font-face{font-family:'B8';src:url('${staticFile('baloo800.woff2')}') format('woff2');font-weight:800}
@font-face{font-family:'B6';src:url('${staticFile('baloo600.woff2')}') format('woff2');font-weight:600}`;

export const Background: React.FC<{hue: string}> = ({hue}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 38%, ${hue}55 0%, ${INK} 62%)`}}>
      <svg width={1080} height={1920} style={{position: 'absolute', opacity: 0.18}}>
        {Array.from({length: 13}).map((_, i) => (
          <line key={'v' + i} x1={i * 90 + ((f * 0.6) % 90)} y1={0} x2={i * 90 + ((f * 0.6) % 90)} y2={1920} stroke="#fff" strokeWidth={1.5} />
        ))}
        {Array.from({length: 23}).map((_, i) => (
          <line key={'h' + i} x1={0} y1={i * 90 + ((f * 0.4) % 90)} x2={1080} y2={i * 90 + ((f * 0.4) % 90)} stroke="#fff" strokeWidth={1.5} />
        ))}
      </svg>
      {Array.from({length: 26}).map((_, i) => {
        const x = random('x' + i) * 1080, y = ((random('y' + i) * 1920 - f * (0.6 + random('s' + i) * 1.6)) % 1920 + 1920) % 1920;
        const r = 3 + random('r' + i) * 7;
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: r, height: r, borderRadius: r, background: [PINK, YEL, TEAL, '#fff'][i % 4], opacity: 0.55}} />;
      })}
    </AbsoluteFill>
  );
};

/** Kinetic subtitles: 5 words at a time, words pop in as spoken, current word yellow. */
export const Captions: React.FC<{text: string; dur: number; top?: number}> = ({text, dur, top = 1480}) => {
  const f = useCurrentFrame();
  const words = text.split(' ');
  const total = words.reduce((a, w) => a + w.length + 1, 0);
  const t = f / FPS;
  let acc = 0;
  const times = words.map((w) => { const at = (acc / total) * dur; acc += w.length + 1; return [at, (acc / total) * dur]; });
  let cur = times.findIndex(([a, b]) => t >= a && t < b);
  if (cur < 0) cur = t >= dur ? words.length - 1 : 0;
  const CH = 5; const c0 = Math.floor(cur / CH) * CH;
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top, textAlign: 'center', fontFamily: 'B8', fontSize: 78, lineHeight: 1.12, color: '#fff'}}>
      {words.slice(c0, c0 + CH).map((w, k) => {
        const i = c0 + k; const [at] = times[i];
        const p = spring({frame: Math.round((t - at) * FPS), fps: FPS, config: {damping: 12, stiffness: 220}});
        const on = t >= at; const isCur = i === cur;
        return (
          <span key={i} style={{display: 'inline-block', margin: '0 12px', opacity: on ? 1 : 0.3, color: isCur ? YEL : '#fff',
            transform: `translateY(${on ? (1 - p) * 30 : 0}px) scale(${on ? 0.8 + 0.2 * p + (isCur ? 0.06 : 0) : 1})`, textShadow: OUTLINE(3)}}>{w}</span>
        );
      })}
    </div>
  );
};

/** Big kinetic headline: each word slams in with overshoot and a small shake. */
export const Slam: React.FC<{words: string[]; at?: number; size?: number; color?: string; y?: number; gap?: number}> = ({words, at = 0, size = 150, color = '#fff', y = 260, gap = 9}) => {
  const f = useCurrentFrame();
  return (
    <div style={{position: 'absolute', top: y, width: '100%', textAlign: 'center', fontFamily: 'B8', fontSize: size, lineHeight: 1.0}}>
      {words.map((w, i) => {
        const s = spring({frame: f - at - i * gap, fps: FPS, config: {damping: 9, stiffness: 160}});
        const shake = f - at - i * gap < 8 && f - at - i * gap > 0 ? Math.sin(f * 3) * 6 : 0;
        return (
          <span key={i} style={{display: 'inline-block', margin: '0 16px', color: i % 2 ? YEL : color, transform: `scale(${s}) rotate(${(1 - s) * -12 + shake * 0.3}deg)`,
            opacity: s > 0.02 ? 1 : 0, textShadow: `${OUTLINE(4)}, 0 0 40px ${PINK}66`}}>{w}</span>
        );
      })}
    </div>
  );
};

export const Pill: React.FC<{text: string; x: number; y: number; at?: number; bg?: string; color?: string; size?: number}> = ({text, x, y, at = 0, bg = PINK, color = '#fff', size = 46}) => {
  const f = useCurrentFrame();
  const s = spring({frame: f - at, fps: FPS, config: {damping: 12}});
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${s})`, background: bg, color, fontFamily: 'B8', fontSize: size,
      padding: '10px 34px', borderRadius: 999, boxShadow: `0 8px 0 ${INK}`, whiteSpace: 'nowrap'}}>{text}</div>
  );
};

/** Huh, the channel mascot. moods: curious, shocked, laughing, thinking, explaining */
export const Huh: React.FC<{mood: string; x: number; y: number; h?: number; at?: number; flip?: boolean}> = ({mood, x, y, h = 420, at = 0, flip}) => {
  const f = useCurrentFrame();
  const s = spring({frame: f - at, fps: FPS, config: {damping: 10}});
  const bob = Math.sin(f / 6) * 8;
  return <Img src={staticFile(mood + '.png')} style={{position: 'absolute', left: x, top: y + bob + (1 - s) * 300, height: h, transform: `translate(-50%,0) scale(${flip ? -s : s},${s})`, filter: 'drop-shadow(0 12px 0 #0007)'}} />;
};

/** Draw-on stroke; use inside an <svg>. */
export const Arrow: React.FC<{d: string; color?: string; progress: number; w?: number}> = ({d, color = YEL, progress, w = 14}) => (
  <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - progress} />
);

/** Number that counts up with ease-out. */
export const Count: React.FC<{to: number; from?: number; at?: number; len?: number; suffix?: string; prefix?: string; style?: React.CSSProperties}> = ({to, from = 0, at = 0, len = 40, suffix = '', prefix = '', style}) => {
  const f = useCurrentFrame();
  const v = interpolate(f, [at, at + len], [from, to], {...clamp, easing: ease});
  return <span style={style}>{prefix}{Math.round(v).toLocaleString('en-US')}{suffix}</span>;
};

/** Hand-drawn style marker swipe behind a word. */
export const Marker: React.FC<{children: React.ReactNode; at?: number; color?: string}> = ({children, at = 0, color = YEL}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + 12], [0, 1], {...clamp, easing: ease});
  return (
    <span style={{position: 'relative', display: 'inline-block'}}>
      <span style={{position: 'absolute', left: -10, right: -10, top: '55%', height: '38%', background: color, opacity: 0.85, transformOrigin: 'left', transform: `scaleX(${p}) rotate(-1.5deg)`, borderRadius: 8}} />
      <span style={{position: 'relative'}}>{children}</span>
    </span>
  );
};

/** List counter: "3/7" plus a row of squares that fill as the list advances (list / top-N videos). */
export const Counter: React.FC<{n: number; of: number; y?: number; color?: string}> = ({n, of, y = 130, color = PINK}) => {
  const f = useCurrentFrame();
  const s = spring({frame: f, fps: FPS, config: {damping: 12}});
  return (
    <div style={{position: 'absolute', top: y, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14, transform: `scale(${0.8 + 0.2 * s})`}}>
      <div style={{background: '#fff', color: INK, fontFamily: 'B8', fontSize: 44, padding: '2px 20px', borderRadius: 12, boxShadow: `0 6px 0 ${INK}`}}>{n}/{of}</div>
      {Array.from({length: of}).map((_, i) => (
        <div key={i} style={{width: 30, height: 30, borderRadius: 7, border: '4px solid #fff', background: i < n - 1 ? '#fff' : i === n - 1 ? color : 'transparent',
          transform: i === n - 1 ? `scale(${1 + 0.25 * (1 - s)})` : undefined}} />
      ))}
    </div>
  );
};

/** "Old way" card crossed out, arrow, "new way" card pops in. Good for myth vs fact, then vs now. */
export const SwapCards: React.FC<{before: string; after: string; label?: string; at?: number; y?: number}> = ({before, after, label = 'actually...', at = 0, y = 520}) => {
  const f = useCurrentFrame();
  const a = spring({frame: f - at, fps: FPS, config: {damping: 12}});
  const strike = interpolate(f, [at + 20, at + 34], [0, 1], {...clamp, easing: ease});
  const b = spring({frame: f - at - 40, fps: FPS, config: {damping: 10}});
  const card = (txt: string, bg: string, col: string): React.CSSProperties => ({margin: '0 auto', width: 820, padding: '34px 40px', borderRadius: 36, background: bg, color: col, fontFamily: 'B8', fontSize: 62, textAlign: 'center', boxShadow: `0 12px 0 ${INK}`, lineHeight: 1.08});
  return (
    <div style={{position: 'absolute', top: y, width: '100%'}}>
      <div style={{...card(before, '#ffffff22', '#ffffffcc'), transform: `scale(${a})`, position: 'relative'}}>
        {before}
        <div style={{position: 'absolute', left: 30, right: 30, top: '50%', height: 12, borderRadius: 6, background: RED, transformOrigin: 'left', transform: `scaleX(${strike}) rotate(-3deg)`}} />
      </div>
      <div style={{textAlign: 'center', fontFamily: 'B8', fontSize: 46, color: YEL, margin: '22px 0', opacity: b}}>↓ {label}</div>
      <div style={{...card(after, CREAM, INK), transform: `scale(${b}) rotate(${(1 - b) * 6}deg)`}}>{after}</div>
    </div>
  );
};

/** Zoom-blur in, slight push, quick blur out. */
export const Transition: React.FC<{len: number; children: React.ReactNode}> = ({len, children}) => {
  const f = useCurrentFrame();
  const inP = interpolate(f, [0, 9], [1, 0], clamp);
  const outP = interpolate(f, [len - 7, len], [0, 1], clamp);
  const z = 1 + 0.35 * inP * inP + 0.03 * (f / len) + 0.25 * outP * outP;
  return <AbsoluteFill style={{transform: `scale(${z})`, filter: `blur(${12 * inP + 14 * outP}px)`, opacity: 1 - outP * 0.5}}>{children}</AbsoluteFill>;
};

/** Follow card with a tapping hand. Use as the last scene. */
export const CTA: React.FC = () => {
  const f = useCurrentFrame();
  const s = spring({frame: f, fps: FPS, config: {damping: 10}});
  const tapped = f > 55;
  const hand = interpolate(f, [15, 50], [1, 0], {...clamp, easing: ease});
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 110, top: 560, width: 860, height: 380, background: CREAM, borderRadius: 48, transform: `scale(${s})`, boxShadow: `0 16px 0 ${INK}`, display: 'flex', alignItems: 'center', padding: 36, boxSizing: 'border-box'}}>
        <Img src={staticFile('laughing.png')} style={{height: 300}} />
        <div style={{marginLeft: 30}}>
          <div style={{fontFamily: 'B8', fontSize: 78, color: INK, lineHeight: 1}}>Simply Weird</div>
          <div style={{fontFamily: 'B6', fontSize: 36, color: '#555'}}>@simplyweirdexplained</div>
          <div style={{marginTop: 22, display: 'inline-block', background: tapped ? '#888' : PINK, color: '#fff', fontFamily: 'B8', fontSize: 44, padding: '10px 40px', borderRadius: 999, transform: `scale(${tapped && f < 62 ? 0.9 : 1})`}}>{tapped ? 'following' : 'follow'}</div>
        </div>
      </div>
      <div style={{position: 'absolute', left: 520 + hand * 300, top: 860 + hand * 300, fontSize: 130, transform: `scale(${tapped && f < 62 ? 0.85 : 1})`}}>👆</div>
    </AbsoluteFill>
  );
};

export type SceneMap = Record<string, {C: React.FC; hue: string}>;

/** Full vertical episode: scenes in order of timing.json, captions, header line, progress bar. */
export const Episode: React.FC<{segs: Seg[]; scenes: SceneMap; title: string}> = ({segs, scenes, title}) => {
  const f = useCurrentFrame();
  const {lens, starts, total} = layout(segs);
  return (
    <AbsoluteFill style={{background: INK}}>
      <style>{fontCss}</style>
      {segs.map((s, i) => {
        const sc = scenes[s.id];
        if (!sc) throw new Error('No scene component for id ' + s.id);
        return (
          <Sequence key={s.id} from={starts[i]} durationInFrames={lens[i]}>
            <Background hue={sc.hue} />
            <Transition len={lens[i]}><sc.C /></Transition>
            <Captions text={s.say} dur={s.dur} />
          </Sequence>
        );
      })}
      <div style={{position: 'absolute', top: 60, width: '100%', textAlign: 'center', fontFamily: 'B6', fontSize: 38, color: '#ffffffaa'}}>{title}</div>
      <div style={{position: 'absolute', bottom: 0, left: 0, height: 12, width: `${(f / total) * 100}%`, background: PINK}} />
    </AbsoluteFill>
  );
};

/**
 * Exploded view ("bóc tách"): draw an object as separate parts, then pull them apart and put them back.
 * Use inside an <svg>. Each part has its assembled drawing and an offset for the exploded state.
 * p: 0 = assembled, 1 = fully exploded. focus: id of the part to highlight (others dim). stagger: 0..1 spread of timing per part.
 */
export type Part = {id: string; el: React.ReactNode; dx: number; dy: number; rot?: number; z?: number};
export const ExplodedView: React.FC<{parts: Part[]; p: number; focus?: string; stagger?: number}> = ({parts, p, focus, stagger = 0.35}) => {
  const n = parts.length;
  return (
    <>
      {[...parts].sort((a, b) => (a.z ?? 0) - (b.z ?? 0)).map((part) => {
        const i = parts.indexOf(part);
        const s0 = (i / Math.max(1, n - 1)) * stagger;
        const k = ease(Math.min(1, Math.max(0, (p - s0) / (1 - stagger))));
        const dim = focus && focus !== part.id ? 0.22 : 1;
        const pop = focus === part.id ? 1.06 : 1;
        return (
          <g key={part.id} opacity={dim} style={{transition: 'none'}}
             transform={`translate(${part.dx * k} ${part.dy * k}) rotate(${(part.rot ?? 0) * k})`}>
            <g style={{transformBox: 'fill-box', transformOrigin: 'center', transform: `scale(${pop})`}}>{part.el}</g>
          </g>
        );
      })}
    </>
  );
};

/**
 * Full-frame AI video clip (Higgsfield etc.), stretched to fill the scene, with a dark gradient so text reads.
 * Put the file in motion/public/hf/<name>.mp4. rate < 1 slows it down to cover a longer narration line.
 */
export const Clip: React.FC<{name: string; rate?: number; dim?: number; zoom?: number}> = ({name, rate = 1, dim = 0.35, zoom = 0.06}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${1 + zoom * Math.min(1, f / 240)})`}}>
        <OffthreadVideo src={staticFile(`hf/${name}.mp4`)} playbackRate={rate} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: `linear-gradient(180deg, rgba(20,20,43,${dim + 0.25}) 0%, rgba(20,20,43,${dim * 0.4}) 35%, rgba(20,20,43,${dim * 0.4}) 60%, rgba(20,20,43,${dim + 0.45}) 100%)`}} />
    </AbsoluteFill>
  );
};
