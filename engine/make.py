"""Simply Weird video engine.

One episode JSON -> narration (Kokoro TTS) -> one long 16:9 video + one vertical short per chapter.

Usage:
  python engine/make.py tts     EP.json          # synthesize narration for every beat
  python engine/make.py preview EP.json SEG      # contact sheet of a segment (long | short1 | short2 ...)
  python engine/make.py render  EP.json SEG      # render a segment to out/<id>-<SEG>.mp4
  python engine/make.py thumb   EP.json          # 1280x720 thumbnail for the long video
  python engine/make.py all     EP.json          # tts + every segment + thumb

Episode JSON (see episodes/example.json):
{ "id": "2026-11-23-taipei101", "title": "...", "lang": "en",
  "intro":  [beat, ...],
  "chapters": [ {"title": "...", "short_title": "...", "beats": [beat, ...]}, ... ],
  "outro":  [beat, ...],
  "short_cta": "Full story on our channel. Follow for more weird stuff!" }
beat = {"say": "spoken sentence", "key": "SHORT LABEL", "icons": ["🏢", "🌀"],
        "mood": "curious|shocked|laughing|thinking|explaining", "num": "660 tons" (optional)}
"""
import json, math, os, random, subprocess, sys
import numpy as np
import soundfile as sf
from PIL import Image, ImageDraw, ImageFont, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
ASSET = os.path.join(HERE, "assets")
OMJ = os.environ.get("OPENMOJI_DIR", "/tmp/om/package")
TTS_DIR = os.environ.get("KOKORO_DIR", "/home/claude/tts")
FPS = 30
INK = (27, 27, 58); PINK = (255, 92, 138); YEL = (255, 210, 63); TEAL = (46, 196, 182); ORG = (255, 138, 61); CREAM = (255, 246, 222)
PALETTE = [YEL, TEAL, PINK, ORG, (130, 170, 255)]
GAP = 0.16          # silence between beats (s)
F800 = os.path.join(ASSET, "fonts", "Baloo2-800.ttf")
F600 = os.path.join(ASSET, "fonts", "Baloo2-600.ttf")


def font(path, size, _c={}):
    k = (path, size)
    if k not in _c: _c[k] = ImageFont.truetype(path, size)
    return _c[k]


def ease_out_back(p):
    c1, c3 = 1.70158, 2.70158
    return 1 + c3 * (p - 1) ** 3 + c1 * (p - 1) ** 2


def ease(p): return 4 * p ** 3 if p < 0.5 else 1 - (-2 * p + 2) ** 3 / 2


# ---------------------------------------------------------------- episode helpers
def load(path):
    ep = json.load(open(path))
    work = os.path.join(ROOT, "work", ep["id"]); os.makedirs(work, exist_ok=True)
    beats = []  # flat list with ids
    for b in ep.get("intro", []): beats.append(dict(b, _seg="intro", _ch=-1))
    for ci, ch in enumerate(ep["chapters"]):
        beats.append({"say": f"Number {ci + 1}. {ch['title']}.", "key": f"#{ci + 1}", "card": ch["title"], "mood": "explaining",
                      "icons": ch.get("icons", ch["beats"][0].get("icons", [])), "_seg": "card", "_ch": ci})
        for b in ch["beats"]: beats.append(dict(b, _seg="chapter", _ch=ci))
    for b in ep.get("outro", []): beats.append(dict(b, _seg="outro", _ch=-1))
    cta = ep.get("short_cta", "The full story is on our channel. Follow Simply Weird for more!")
    beats.append({"say": cta, "key": "FOLLOW FOR MORE", "icons": ["👉", "🤓"], "mood": "laughing", "_seg": "cta", "_ch": -2})
    nch = len(ep["chapters"]); hdr = ep.get("series_label", ep["title"]).lower()
    for i, b in enumerate(beats):
        b["_id"] = i; b["_hdr"] = hdr
        if b["_ch"] >= 0: b["_cnt"] = f"{b['_ch'] + 1}/{nch}"
    return ep, work, beats


def segment(beats, seg):
    if seg == "long":
        return [b for b in beats if b["_seg"] in ("intro", "card", "chapter", "outro")]
    n = int(seg.replace("short", "")) - 1
    hook = [b for b in beats if b["_seg"] == "chapter" and b["_ch"] == n]
    return hook + [b for b in beats if b["_seg"] == "cta"]


# ---------------------------------------------------------------- TTS
def tts(ep, work, beats):
    from kokoro_onnx import Kokoro
    k = Kokoro(os.path.join(TTS_DIR, "kokoro-v1.0.onnx"), os.path.join(TTS_DIR, "voices-v1.0.bin"))
    voice = ep.get("voice", "am_michael"); speed = ep.get("speed", 1.05)
    os.makedirs(work + "/beats", exist_ok=True)
    for b in beats:
        f = f"{work}/beats/{b['_id']:03d}.wav"
        if os.path.exists(f): continue
        a, sr = k.create(b["say"], voice=voice, speed=speed, lang="en-us")
        a = np.asarray(a, dtype=np.float32)
        idx = np.where(np.abs(a) > 0.01)[0]
        if len(idx): a = a[max(0, idx[0] - int(0.02 * sr)): idx[-1] + int(0.05 * sr)]
        sf.write(f, a, sr)
    print("tts ok", len(beats))


def timeline(work, seg_beats):
    t = 0.25; out = []
    for b in seg_beats:
        a, sr = sf.read(f"{work}/beats/{b['_id']:03d}.wav", dtype="float32")
        d = len(a) / sr; extra = 0.45 if b.get("card") else 0.0
        out.append((b, t, t + d, a, sr)); t += d + GAP + extra
    return out, t + 0.8


def music_bed(n, sr, seed):
    t = np.arange(n) / sr; rng = np.random.default_rng(seed)
    prog = [[261.63, 329.63, 392.0], [220.0, 261.63, 329.63], [174.61, 220.0, 261.63], [196.0, 246.94, 293.66]]
    rng.shuffle(prog); bar = 2.4; out = np.zeros(n)
    for i, ch in enumerate(prog * int(t[-1] / (bar * 4) + 2)):
        s, e = int(i * bar * sr), int((i + 1) * bar * sr)
        if s >= n: break
        e = min(e, n); tt = t[s:e] - t[s]; env = np.minimum(1, tt / 0.08) * np.exp(-tt * 0.9)
        for j, f in enumerate(ch): out[s:e] += env * (np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(2 * np.pi * f * 2 * tt)) / (j + 1.5)
        for q in range(4):  # plucky eighth-note bass
            ps = s + int(q * bar / 4 * sr); pe = min(ps + int(0.18 * sr), n)
            if ps >= n: break
            tq = t[ps:pe] - t[ps]; out[ps:pe] += 0.6 * np.exp(-tq * 18) * np.sin(2 * np.pi * ch[0] / 2 * tq)
    return out / max(1e-6, np.abs(out).max())


def mix_audio(work, tl, total, name, seed):
    sr = tl[0][4]; n = int(total * sr); v = np.zeros(n, dtype=np.float32)
    for (b, t0, t1, a, _) in tl:
        s = int(t0 * sr); v[s:s + len(a)] += a[: max(0, n - s)]
    fx = np.zeros(n, dtype=np.float32); rng = np.random.default_rng(seed)
    def add(at, clip):
        i0 = int(at * sr)
        if 0 <= i0 < n: fx[i0:i0 + len(clip)] += clip[: n - i0]
    tt = lambda d: np.arange(int(d * sr)) / sr
    w = tt(0.28); noise = rng.standard_normal(len(w)).astype(np.float32)
    whoosh = np.convolve(noise, np.ones(30) / 30, "same") * np.sin(np.pi * w / w[-1]) ** 2 * 0.35
    p_ = tt(0.09); pop = (np.sin(2 * np.pi * (900 - 4000 * p_) * p_) * np.exp(-p_ * 45) * 0.45).astype(np.float32)
    d_ = tt(0.6); ding = ((np.sin(2 * np.pi * 1320 * d_) + 0.4 * np.sin(2 * np.pi * 1980 * d_)) * np.exp(-d_ * 7) * 0.22).astype(np.float32)
    for k, (b, t0, t1, a, _) in enumerate(tl):
        if k: add(t0 - 0.12, whoosh)
        for j in range(len(b.get("icons", [])[:3])): add(t0 + 0.15 * j + 0.06, pop)
        if b.get("num"): add(t0 + 0.55, ding)
    v = v + fx * 0.5
    m = music_bed(n, sr, seed)
    duck = np.convolve((np.abs(v) > 0.02).astype(float), np.ones(int(0.25 * sr)) / int(0.25 * sr), "same")
    mix = v / max(1e-6, np.abs(v).max()) * 0.9 + m * (0.10 - 0.05 * np.clip(duck * 3, 0, 1))
    raw = f"{work}/{name}_raw.wav"; out = f"{work}/{name}.wav"
    sf.write(raw, mix.astype(np.float32), sr)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", raw, "-af", "highpass=f=70,acompressor=threshold=-18dB:ratio=3:attack=5:release=80,loudnorm=I=-14:TP=-1.5:LRA=9", "-ar", "48000", out], check=True)
    return out


# ---------------------------------------------------------------- visuals
def emoji_img(ch, size, _c={}):
    k = (ch, size)
    if k in _c: return _c[k]
    import cairosvg, io
    hexs = "-".join(f"{ord(c):X}" for c in ch)
    cands = [hexs, "-".join(h for h in hexs.split("-") if h != "FE0F")]
    path = None
    for h in cands:
        p = os.path.join(OMJ, "color", "svg", h + ".svg")
        if os.path.exists(p): path = p; break
    if not path: _c[k] = None; return None
    png = cairosvg.svg2png(url=path, output_width=size, output_height=size)
    im = Image.open(io.BytesIO(png)).convert("RGBA"); _c[k] = im; return im


def mascot_img(mood, h, _c={}):
    mood = mood if mood in ("curious", "shocked", "laughing", "thinking", "explaining") else "curious"
    k = (mood, h)
    if k not in _c:
        im = Image.open(os.path.join(ASSET, "mascot", mood + ".png")).convert("RGBA")
        _c[k] = im.resize((int(im.width * h / im.height), h), Image.LANCZOS)
    return _c[k]


def text_w(d, s, f): return d.textlength(s, font=f)


def wrap(d, words, f, maxw):
    lines = [[]]
    for i, w in enumerate(words):
        if lines[-1] and text_w(d, " ".join(x for _, x in lines[-1] + [(i, w)]), f) > maxw: lines.append([])
        lines[-1].append((i, w))
    return lines


def bg_image(W, H, color, seed):
    rng = random.Random(seed); im = Image.new("RGB", (W, H), color); d = ImageDraw.Draw(im, "RGBA")
    light = tuple(min(255, c + 40) for c in color); dark = tuple(max(0, c - 40) for c in color)
    for _ in range(14):  # soft blobs
        r = rng.randint(int(W * 0.08), int(W * 0.25)); x, y = rng.randint(-r, W + r), rng.randint(-r, H + r)
        d.ellipse([x - r, y - r, x + r, y + r], fill=light + (70,))
    for _ in range(60):  # sprinkles
        x, y = rng.randint(0, W), rng.randint(0, H); r = rng.choice([4, 5, 7])
        d.ellipse([x - r, y - r, x + r, y + r], fill=dark + (90,))
    return im.filter(ImageFilter.GaussianBlur(2))


class Scene:
    def __init__(self, b, t0, t1, W, H, vertical, idx, nbeats, card_no=None):
        self.b, self.t0, self.t1, self.W, self.H, self.v, self.idx, self.n = b, t0, t1, W, H, vertical, idx, nbeats
        ch = b.get("_ch", 0); ch = ch if ch >= 0 else (4 if ch == -2 else 0)
        self.col = PALETTE[ch % len(PALETTE)]
        self.bg = bg_image(W, H, self.col, hash((b["_id"], W)) & 0xffff)
        self.hl = PINK if self.col == YEL else YEL
        self.words = b["say"].split(); self.cap_cache = {}
        self.icons = [emoji_img(e, 420 if vertical else 360) for e in b.get("icons", [])[:3]]
        self.icons = [i for i in self.icons if i is not None]

    def caption(self, cur):
        if cur in self.cap_cache: return self.cap_cache[cur]
        W = self.W; fs = 70 if self.v else 58; f = font(F800, fs)
        tmp = ImageDraw.Draw(Image.new("RGB", (10, 10)))
        lines = wrap(tmp, [w + "  " for w in self.words], f, W * (0.93 if self.v else 0.80))
        lines = [[(i, w.strip()) for i, w in ln] for ln in lines]
        lh = int(fs * 1.18); im = Image.new("RGBA", (W, lh * len(lines) + 30), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
        sp = text_w(d, " ", f) + 14; y = lh // 2 + 12
        for ln in lines:
            x = W / 2 - text_w(d, " ".join(w for _, w in ln), f) / 2
            for i, w in ln:
                d.text((x, y), w, font=f, fill=self.hl if i == cur else (255, 255, 255), anchor="lm", stroke_width=9, stroke_fill=INK)
                x += text_w(d, w, f) + sp
            y += lh
        self.cap_cache[cur] = im; return im

    def frame(self, t):
        W, H, v, b = self.W, self.H, self.v, self.b
        lt = t - self.t0; dur = max(0.5, self.t1 - self.t0 + GAP)
        p = min(1, max(0, lt / dur))
        im = self.bg.copy(); d = ImageDraw.Draw(im)
        if b.get("card"):
            self._card(im, d, lt)
        else:
            self._icons(im, lt)
            if b.get("num"): self._num(im, d, lt)
        # mascot (bottom-left), small hop at beat start
        mh = int(H * (0.21 if v else 0.40)); m = mascot_img(b.get("mood", "curious"), mh)
        hop = max(0, math.sin(min(1, lt / 0.35) * math.pi)) * mh * 0.08
        bob = math.sin(t * 4.2) * mh * 0.015
        sq = 1 + 0.03 * math.sin(t * 8.4)
        m2 = m.resize((int(m.width * (2 - sq)), int(m.height * sq)))
        mx = int(W * (0.06 if v else 0.03)); my = int((H * 0.455 if v else H * 0.27) - hop + bob)
        im.paste(m2, (mx, my), m2)
        # Ken Burns: slow zoom across the beat, punch-in on emphasis beats
        z = 1.0 + 0.05 * ease(p) + (0.06 * max(0, 1 - lt / 0.25) if b.get("punch") else 0)
        if z > 1.001:
            cw, chh = int(W / z), int(H / z); ox, oy = (W - cw) // 2, int((H - chh) * 0.45)
            im = im.crop((ox, oy, ox + cw, oy + chh)).resize((W, H), Image.BILINEAR); d = ImageDraw.Draw(im)
        # key pill on top (outside the zoom so it stays crisp)
        if b.get("key") and not b.get("card"): self._pill(im, b["key"], lt)
        # captions with the spoken word highlighted
        cur = -1
        if self.t0 <= t < self.t1:
            lens = [len(w) + 1 for w in self.words]; acc = 0; tot = sum(lens); fr = (t - self.t0) / (self.t1 - self.t0)
            for i, L in enumerate(lens):
                acc += L
                if fr < acc / tot: cur = i; break
        elif t >= self.t1: cur = len(self.words) - 1
        cap = self.caption(cur)
        cy = int(H * 0.795) if v else int(H * 0.855)
        im.paste(cap, (0, cy - cap.height // 2), cap)
        # progress bar
        if v:
            fr = (self.idx + p) / self.n
            d = ImageDraw.Draw(im); d.rectangle([0, H - 14, W, H], fill=INK); d.rectangle([0, H - 14, int(W * fr), H], fill=self.hl)
        return im

    def _pill(self, im, text, lt):
        W, v = self.W, self.v; f = font(F800, 64 if v else 54); d = ImageDraw.Draw(im)
        text = text.upper(); tw = text_w(d, text, f); pw, ph = int(tw + 90), (112 if v else 96)
        a = min(1, lt / 0.3); s = ease_out_back(a) if a < 1 else 1
        pill = Image.new("RGBA", (pw, ph), (0, 0, 0, 0)); pd = ImageDraw.Draw(pill)
        pd.rounded_rectangle([0, 0, pw - 1, ph - 1], radius=ph // 2, fill=INK)
        pd.text((pw / 2, ph / 2 + 2), text, font=f, fill=CREAM, anchor="mm")
        if s <= 0.02: return
        pill = pill.resize((max(1, int(pw * s)), max(1, int(ph * s))))
        y = int(self.H * (0.10 if v else 0.08))
        im.paste(pill, (W // 2 - pill.width // 2, y - pill.height // 2 + ph // 2), pill)

    def _icons(self, im, lt):
        n = len(self.icons)
        if not n: return
        W, H, v = self.W, self.H, self.v
        if v: cx0, cy0, spread = W * 0.5, H * 0.285, W * 0.36
        else: cx0, cy0, spread = W * 0.62, H * 0.42, W * 0.20
        for i, ic in enumerate(self.icons):
            a = (lt - 0.12 * i) / 0.4
            if a <= 0: continue
            s = ease_out_back(min(1, a)) * (1 + 0.03 * math.sin(lt * 3 + i))
            base = 1.15 if n == 1 else (0.92 if n == 2 else 0.70)
            sz = int(ic.width * base * max(0.05, s))
            if sz < 4: continue
            r = ic.resize((sz, sz), Image.BILINEAR).rotate(6 * math.sin(lt * 2 + i * 1.7), resample=Image.BILINEAR, expand=False)
            off = (i - (n - 1) / 2) * spread
            x = int(cx0 + off - sz / 2); y = int(cy0 - sz / 2 + 14 * math.sin(lt * 2.4 + i) + (abs(off) * 0.15 if v else 0))
            im.paste(r, (x, y), r)

    def _num(self, im, d, lt):
        W, H, v = self.W, self.H, self.v; txt = str(self.b["num"]); f = font(F800, 150 if v else 120)
        a = min(1, lt / 0.6)
        import re
        m = re.match(r"^([^\d]*)([\d,.]+)(.*)$", txt)
        if m and a < 1:
            num = float(m.group(2).replace(",", "")); dec = len(m.group(2).split(".")[1]) if "." in m.group(2) else 0
            val = num * ease(a); s = f"{val:,.{dec}f}" if "," in m.group(2) else f"{val:.{dec}f}"
            txt = m.group(1) + s + m.group(3)
        y = H * (0.56 if v else 0.64); x = W * (0.64 if v else 0.62)
        d.text((x, y), txt, font=f, fill=CREAM, anchor="mm", stroke_width=12, stroke_fill=INK)

    def _card(self, im, d, lt):
        W, H, v = self.W, self.H, self.v
        a = min(1, lt / 0.45); s = ease_out_back(a)
        f1 = font(F800, int((190 if v else 170) * max(0.05, s))); f2 = font(F800, 84 if v else 76)
        d.text((W / 2 if v else W * 0.60, H * (0.30 if v else 0.30)), self.b["key"], font=f1, fill=CREAM, anchor="mm", stroke_width=14, stroke_fill=INK)
        tmp = ImageDraw.Draw(Image.new("RGB", (10, 10)))
        lines = wrap(tmp, self.b["card"].split(), f2, W * (0.84 if v else 0.55)); y = H * (0.45 if v else 0.50)
        if a > 0.5:
            for ln in lines:
                d.text((W / 2 if v else W * 0.60, y), " ".join(w for _, w in ln), font=f2, fill=(255, 255, 255), anchor="mm", stroke_width=10, stroke_fill=INK)
                y += f2.size * 1.15


# ---------------------------------------------------------------- "stick" theme: black canvas, white stick figure, red handwritten labels
FHAND = os.path.join(ASSET, "fonts", "PatrickHand-400.ttf")
FSUB = os.path.join(ASSET, "fonts", "ComicNeue-700.ttf")
RED = (255, 64, 64); WHITE = (255, 255, 255); BLACK = (8, 8, 10)


def sticker(ch, size, _c={}):
    """Colour emoji cut out with a thick white border, like a meme cut-out."""
    k = (ch, size)
    if k in _c: return _c[k]
    im = emoji_img(ch, size)
    if im is None: _c[k] = None; return None
    pad = size // 12; big = Image.new("RGBA", (size + 2 * pad, size + 2 * pad), (0, 0, 0, 0)); big.paste(im, (pad, pad), im)
    a = big.split()[3].point(lambda v: 255 if v > 30 else 0).filter(ImageFilter.MaxFilter(2 * (pad // 2) + 1))
    border = Image.new("RGBA", big.size, WHITE + (255,)); border.putalpha(a)
    border.alpha_composite(big); _c[k] = border; return border


def draw_stick(d, cx, gy, h, mood, t, lt, S=1.0):
    """Draw a thick white stick figure standing on y=gy, total height h."""
    lw = max(6, int(h * 0.055)); hr = h * 0.17
    hy = gy - h + hr; neck = hy + hr; hip = gy - h * 0.38
    sway = math.sin(t * 2.0) * h * 0.01; cx = cx + sway
    bob = abs(math.sin(t * 4.0)) * h * 0.012 if mood == "laughing" else 0
    hy -= bob; neck -= bob; hip -= bob
    shoulder = neck + h * 0.06
    W_ = WHITE
    def limb(x0, y0, ang, L, ang2=None, L2=None):
        x1 = x0 + L * math.cos(ang); y1 = y0 + L * math.sin(ang)
        d.line([x0, y0, x1, y1], fill=W_, width=lw); d.ellipse([x1 - lw / 2, y1 - lw / 2, x1 + lw / 2, y1 + lw / 2], fill=W_)
        if ang2 is not None:
            x2 = x1 + L2 * math.cos(ang2); y2 = y1 + L2 * math.sin(ang2)
            d.line([x1, y1, x2, y2], fill=W_, width=lw); d.ellipse([x2 - lw / 2, y2 - lw / 2, x2 + lw / 2, y2 + lw / 2], fill=W_)
            return x2, y2
        return x1, y1
    # body
    d.line([cx, neck, cx, hip], fill=W_, width=int(lw * 1.25))
    # legs
    step = math.sin(t * 3) * 0.04
    limb(cx, hip, math.radians(105) + step, h * 0.38); limb(cx, hip, math.radians(75) - step, h * 0.38)
    ua, la = h * 0.2, h * 0.19; w = math.sin(t * 5 + lt) * 0.12
    if mood == "shocked":
        limb(cx, shoulder, math.radians(-140) + w, ua, math.radians(-110) + w, la); limb(cx, shoulder, math.radians(-40) - w, ua, math.radians(-70) - w, la)
    elif mood == "thinking":
        limb(cx, shoulder, math.radians(120), ua, math.radians(-60), la * 0.9); limb(cx, shoulder, math.radians(70), ua, math.radians(95), la)
    elif mood == "explaining":
        limb(cx, shoulder, math.radians(110), ua, math.radians(95), la); limb(cx, shoulder, math.radians(-15) + w * 0.6, ua, math.radians(-25) + w, la)
    elif mood == "laughing":
        limb(cx, shoulder, math.radians(160) + w, ua, math.radians(200) + w, la); limb(cx, shoulder, math.radians(20) - w, ua, math.radians(-20) - w, la)
    else:  # curious: scratching head
        limb(cx, shoulder, math.radians(-120), ua, math.radians(-40) + w, la * 0.85); limb(cx, shoulder, math.radians(75), ua, math.radians(95), la)
    # head (white disc with a simple black face)
    tilt = {"curious": 0.12, "thinking": -0.1}.get(mood, 0.0) * h
    hx = cx + tilt * 0.3
    d.ellipse([hx - hr, hy - hr, hx + hr, hy + hr], fill=W_)
    ex = hr * 0.32; ey = hy - hr * 0.08; er = max(3, hr * (0.14 if mood == "shocked" else 0.1))
    blink = (t % 3.7) < 0.12
    look = hr * 0.12 if mood in ("explaining", "curious") else 0
    for sx in (-1, 1):
        if blink: d.line([hx + sx * ex - er + look, ey, hx + sx * ex + er + look, ey], fill=BLACK, width=max(2, int(er * 0.6)))
        else: d.ellipse([hx + sx * ex - er + look, ey - er, hx + sx * ex + er + look, ey + er], fill=BLACK)
    my = hy + hr * 0.38; mw = hr * 0.38; mlw = max(2, int(hr * 0.09))
    if mood == "shocked": d.ellipse([hx - mw * 0.45, my - mw * 0.3, hx + mw * 0.45, my + mw * 0.55], fill=BLACK)
    elif mood == "laughing": d.chord([hx - mw, my - mw * 0.6, hx + mw, my + mw * 0.8], 0, 180, fill=BLACK)
    elif mood == "thinking": d.line([hx - mw * 0.6, my + 2, hx + mw * 0.6, my - 4], fill=BLACK, width=mlw)
    else: d.arc([hx - mw, my - mw * 0.7, hx + mw, my + mw * 0.5], 20, 160, fill=BLACK, width=mlw)
    if mood == "thinking":  # thought bubbles
        for i, r in enumerate((hr * 0.12, hr * 0.18, hr * 0.26)):
            bx = hx + hr * (1.1 + 0.45 * i); by = hy - hr * (0.9 + 0.5 * i)
            d.ellipse([bx - r, by - r, bx + r, by + r], outline=W_, width=max(2, lw // 3))
    if mood == "shocked":  # little shock lines
        for a in (-60, -90, -120):
            ra = math.radians(a); d.line([hx + 1.3 * hr * math.cos(ra), hy + 1.3 * hr * math.sin(ra), hx + 1.7 * hr * math.cos(ra), hy + 1.7 * hr * math.sin(ra)], fill=RED, width=max(3, lw // 2))


def mascot_cut(mood, h, _c={}):
    """Mascot with a white cut-out border so the dark outline reads on black."""
    k = (mood, h)
    if k in _c: return _c[k]
    m = mascot_img(mood, h); pad = max(6, h // 40)
    big = Image.new("RGBA", (m.width + 2 * pad, m.height + 2 * pad), (0, 0, 0, 0)); big.paste(m, (pad, pad), m)
    a = big.split()[3].point(lambda v: 255 if v > 40 else 0).filter(ImageFilter.MaxFilter(2 * pad + 1))
    out = Image.new("RGBA", big.size, WHITE + (255,)); out.putalpha(a); out.alpha_composite(big); _c[k] = out; return out


class StickScene(Scene):
    def __init__(self, b, t0, t1, W, H, vertical, idx, nbeats, card_no=None):
        self.b, self.t0, self.t1, self.W, self.H, self.v, self.idx, self.n = b, t0, t1, W, H, vertical, idx, nbeats
        self.words = b["say"].split(); self.cap_cache = {}
        sz = 360 if vertical else 300
        self.icons = [] if b.get("_seg") == "cta" else [i for i in (sticker(e, sz) for e in b.get("icons", [])[:3]) if i is not None]
        self.bg = Image.new("RGB", (W, H), BLACK); self.hl = (255, 214, 64)

    def caption(self, cur):
        if cur in self.cap_cache: return self.cap_cache[cur]
        W = self.W; fs = 62 if self.v else 50; f = font(FSUB, fs)
        tmp = ImageDraw.Draw(Image.new("RGB", (10, 10)))
        lines = wrap(tmp, [w + " " for w in self.words], f, W * (0.88 if self.v else 0.72))
        lines = [[(i, w.strip()) for i, w in ln] for ln in lines]
        lh = int(fs * 1.25); im = Image.new("RGBA", (W, lh * len(lines) + 20), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
        sp = text_w(d, " ", f); y = lh // 2 + 8
        for ln in lines:
            x = W / 2 - text_w(d, " ".join(w for _, w in ln), f) / 2
            for i, w in ln:
                d.text((x, y), w, font=f, fill=self.hl if i == cur else WHITE, anchor="lm", stroke_width=4, stroke_fill=BLACK)
                x += text_w(d, w, f) + sp
            y += lh
        self.cap_cache[cur] = im; return im

    def frame(self, t):
        W, H, v, b = self.W, self.H, self.v, self.b
        lt = t - self.t0; dur = max(0.5, self.t1 - self.t0 + GAP); p = min(1, max(0, lt / dur))
        S = 2  # supersample the line art
        im = Image.new("RGB", (W * S, H * S), BLACK); d = ImageDraw.Draw(im)
        mood = b.get("mood", "curious")
        if b.get("card"):
            f1 = font(FHAND, int((200 if v else 180) * S * max(0.05, ease_out_back(min(1, lt / 0.4)))))
            d.text((W * S / 2, H * S * (0.30 if v else 0.30)), b["key"], font=f1, fill=RED, anchor="mm")
            f2 = font(FHAND, (100 if v else 90) * S); tmp = ImageDraw.Draw(Image.new("RGB", (10, 10)))
            lines = wrap(tmp, b["card"].lower().split(), f2, W * S * 0.86); y = H * S * 0.45
            if lt > 0.25:
                for ln in lines:
                    d.text((W * S / 2, y), " ".join(w for _, w in ln), font=f2, fill=WHITE, anchor="mm"); y += f2.size * 1.1
        else:
            # stick figure: left-centre, standing on an imaginary floor
            pass
            # handwritten red label at the top
            if b.get("key") and b.get("_seg") != "cta":
                a = min(1, lt / 0.25); f = font(FHAND, int((96 if v else 84) * S))
                txt = b["key"].lower()
                shown = txt[: max(1, int(len(txt) * a))]  # typewriter reveal
                d.text((W * S / 2, H * S * (0.12 if v else 0.11)), shown, font=f, fill=RED, anchor="mm")
        im = im.resize((W, H), Image.LANCZOS)
        # the channel mascot Huh: big, centre-left, hops in and bobs
        if b.get("card"): mh, mx, gy = int(H * (0.24 if v else 0.42)), W * (0.5 if v else 0.14), H * (0.76 if v else 0.86)
        else: mh, mx, gy = int(H * (0.34 if v else 0.60)), W * (0.27 if v else 0.19), H * (0.725 if v else 0.80)
        m = mascot_cut(mood, mh)
        hop = max(0, math.sin(min(1, lt / 0.32) * math.pi)) * mh * 0.07
        sq = 1 + 0.035 * math.sin(t * 7.0); rot = 4 * math.sin(t * 1.7) if mood in ("laughing", "curious") else 2 * math.sin(t * 1.3)
        m2 = m.resize((int(m.width * (2 - sq)), int(m.height * sq)), Image.BILINEAR).rotate(rot, resample=Image.BILINEAR, expand=True)
        im.paste(m2, (int(mx - m2.width / 2), int(gy - m2.height - hop)), m2)
        if not b.get("card"):
            # sticker cut-outs pop in to the right of / above the figure
            n = len(self.icons)
            if v: cx0, cy0, spread = W * 0.70, H * 0.42, H * 0.17
            else: cx0, cy0, spread = W * 0.62, H * 0.42, W * 0.18
            for i, ic in enumerate(self.icons):
                a = (lt - 0.15 * i) / 0.35
                if a <= 0: continue
                s = ease_out_back(min(1, a)); base = 1.0 if n == 1 else (0.8 if n == 2 else 0.66)
                sz = int(ic.width * base * max(0.05, s))
                if sz < 4: continue
                r = ic.resize((sz, sz), Image.BILINEAR).rotate(-8 + 16 * ((i * 37) % 3) / 2 + 3 * math.sin(lt * 2 + i), resample=Image.BILINEAR)
                off = (i - (n - 1) / 2) * spread
                if v: x, y = int(cx0 - sz / 2 + (i % 2) * 40 - 20), int(cy0 + off - sz / 2)
                else: x, y = int(cx0 + off - sz / 2), int(cy0 - sz / 2 + (i % 2) * 40 - 20)
                im.paste(r, (x, y), r)
            if b.get("num"):
                d2 = ImageDraw.Draw(im); f = font(FHAND, 150 if v else 130); txt = str(b["num"])
                import re
                m = re.match(r"^([^\d]*)([\d,.]+)(.*)$", txt); a = min(1, lt / 0.6)
                if m and a < 1:
                    num = float(m.group(2).replace(",", "")); dec = len(m.group(2).split(".")[1]) if "." in m.group(2) else 0
                    txt = m.group(1) + (f"{num * ease(a):,.{dec}f}" if "," in m.group(2) else f"{num * ease(a):.{dec}f}") + m.group(3)
                d2.text((W * (0.72 if v else 0.64), H * (0.60 if v else 0.70)), txt, font=f, fill=self.hl, anchor="mm")
        if b.get("_seg") == "cta": self._cta(im, lt)
        # slow zoom-in (Ken Burns) + punch-in on emphasis beats + zoom-through at each new beat
        zt = max(0, 1 - lt / 0.2) if self.idx > 0 else 0
        z = 1.0 + 0.04 * ease(p) + (0.07 * max(0, 1 - lt / 0.25) if b.get("punch") else 0) + 0.45 * zt ** 2
        if z > 1.001:
            cw, chh = int(W / z), int(H / z); ox, oy = (W - cw) // 2, int((H - chh) * 0.45)
            im = im.crop((ox, oy, ox + cw, oy + chh)).resize((W, H), Image.BILINEAR)
        if zt > 0.05: im = im.filter(ImageFilter.GaussianBlur(10 * zt))
        self._header(im)
        cur = -1
        if self.t0 <= t < self.t1:
            lens = [len(w) + 1 for w in self.words]; acc = 0; tot = sum(lens); fr = (t - self.t0) / (self.t1 - self.t0)
            for i, L in enumerate(lens):
                acc += L
                if fr < acc / tot: cur = i; break
        elif t >= self.t1: cur = len(self.words) - 1
        cap = self.caption(cur); cy = int(H * (0.84 if v else 0.88))
        im.paste(cap, (0, cy - cap.height // 2), cap)
        if v:
            fr = (self.idx + p) / self.n; d = ImageDraw.Draw(im); d.rectangle([0, H - 10, int(W * fr), H], fill=RED)
        return im


def _header(self, im):
    """Fixed series title + chapter counter, so viewers always know where they are."""
    W, H, v, b = self.W, self.H, self.v, self.b
    d = ImageDraw.Draw(im); f = font(FSUB, 34 if v else 30); y = int(H * (0.04 if v else 0.045))
    hdr = b.get("_hdr", "")
    if hdr: d.text((W / 2, y), hdr, font=f, fill=(200, 200, 205), anchor="mm")
    if b.get("_cnt"):
        fc = font(FSUB, 40 if v else 34); txt = b["_cnt"]; tw = d.textlength(txt, font=fc); ph = 60 if v else 52
        x1 = W - (40 if v else 50); x0 = x1 - tw - 44; y0 = int(H * (0.075 if v else 0.09)) - ph // 2 + (14 if v else 0)
        if not v: y0 = y - ph // 2; x1 = W - 40; x0 = x1 - tw - 44
        d.rounded_rectangle([x0, y0, x1, y0 + ph], radius=ph // 2, fill=RED)
        d.text(((x0 + x1) / 2, y0 + ph / 2 + 2), txt, font=fc, fill=WHITE, anchor="mm")


def _cta(self, im, lt):
    """Designed follow card with a tapping hand, instead of only a spoken line."""
    W, H, v = self.W, self.H, self.v
    cw, chh = (int(W * 0.78), int(H * 0.17)) if v else (int(W * 0.40), int(H * 0.30))
    a = min(1, lt / 0.4); s = ease_out_back(a)
    card = Image.new("RGBA", (cw, chh), (0, 0, 0, 0)); d = ImageDraw.Draw(card)
    d.rounded_rectangle([0, 0, cw - 1, chh - 1], radius=36, fill=(250, 248, 240), outline=WHITE, width=4)
    av = mascot_img("laughing", int(chh * 0.78)); card.paste(av, (24, (chh - av.height) // 2), av)
    tx = 24 + av.width + 24
    d.text((tx, chh * 0.30), "simply weird", font=font(FHAND, int(chh * 0.26)), fill=INK, anchor="lm")
    d.text((tx, chh * 0.54), "@simplyweirdexplained", font=font(FSUB, int(chh * 0.13)), fill=(90, 90, 110), anchor="lm")
    bx0, by0, bx1, by1 = tx, int(chh * 0.66), tx + int(cw * 0.30), int(chh * 0.90)
    tapped = lt > 1.6
    d.rounded_rectangle([bx0, by0, bx1, by1], radius=(by1 - by0) // 2, fill=(120, 120, 130) if tapped else RED)
    d.text(((bx0 + bx1) / 2, (by0 + by1) / 2 + 2), "following" if tapped else "follow", font=font(FSUB, int(chh * 0.12)), fill=WHITE, anchor="mm")
    if s > 0.05:
        card = card.resize((max(1, int(cw * s)), max(1, int(chh * s))))
        cx, cy = (W * 0.5, H * 0.20) if v else (W * 0.66, H * 0.30)
        ox, oy = int(cx - card.width / 2), int(cy - card.height / 2); im.paste(card, (ox, oy), card)
        hand = emoji_img("👆", 150 if v else 120)
        if hand is not None and a >= 1:
            k = min(1, max(0, (lt - 0.6) / 0.9)); tap = 0.85 if 1.5 < lt < 1.7 else 1.0
            bx = ox + (bx0 + bx1) / 2 * s; by = oy + by1 * s
            hx = int(bx + (1 - ease(k)) * W * 0.25 - hand.width * 0.35); hy = int(by + (1 - ease(k)) * H * 0.10 - hand.height * 0.15)
            hh = hand.resize((int(hand.width * tap), int(hand.height * tap))); im.paste(hh, (hx, hy), hh)


StickScene._header = _header
StickScene._cta = _cta


def stick_thumb(ep, W=1280, H=720):
    im = Image.new("RGB", (W, H), BLACK)
    m = mascot_cut("shocked", 520); im.paste(m, (80, H - m.height + 14), m)
    icons = [sticker(e, 260) for e in ep.get("thumb_icons", [])[:2]]
    for i, ic in enumerate(x for x in icons if x):
        ic = ic.rotate(-10 + 20 * i, expand=True); im.paste(ic, (560 + i * 330, 250 + (i % 2) * 120), ic)
    d = ImageDraw.Draw(im); txt = ep.get("thumb_text", ep["title"]).lower(); fs = 130
    while d.textlength(txt, font=font(FHAND, fs)) > W - 80: fs -= 6
    d.text((W / 2, 95), txt, font=font(FHAND, fs), fill=RED, anchor="mm")
    return im


# ---------------------------------------------------------------- render
def render(ep, work, beats, seg, preview=False):
    sb = segment(beats, seg); tl, total = timeline(work, sb)
    vertical = seg != "long"; W, H = (1080, 1920) if vertical else (1920, 1080)
    SC = StickScene if ep.get("theme", "stick") == "stick" else Scene
    scenes = [SC(b, t0, t1, W, H, vertical, i, len(tl)) for i, (b, t0, t1, a, sr) in enumerate(tl)]
    bounds = [0.0] + [tl[i][1] - 0.04 for i in range(1, len(tl))] + [total]
    os.makedirs(ROOT + "/out", exist_ok=True)
    if preview:
        ts = [(bounds[i] + bounds[i + 1]) / 2 for i in range(len(scenes))][:12]
        cols = 4; tw = 360 if vertical else 480; th = int(tw * H / W)
        sheet = Image.new("RGB", (tw * cols, th * ((len(ts) + cols - 1) // cols)), (0, 0, 0))
        for i, t in enumerate(ts):
            sheet.paste(scenes[i].frame(t).resize((tw, th)), ((i % cols) * tw, (i // cols) * th))
        p = f"{ROOT}/out/{ep['id']}-{seg}-preview.jpg"; sheet.save(p, quality=85); print(p, "total", round(total, 1)); return p
    sd = f"{work}/{seg}_scenes"; os.makedirs(sd, exist_ok=True); lst = []
    for i, sc in enumerate(scenes):
        f0, f1 = round(bounds[i] * FPS), round(bounds[i + 1] * FPS); out = f"{sd}/s{i:03d}.mp4"; tmp = f"{sd}/tmp{i:03d}.mp4"
        if not os.path.exists(out):
            pr = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
                                   "-c:v", "libx264", "-crf", "21", "-preset", "veryfast", "-pix_fmt", "yuv420p", tmp], stdin=subprocess.PIPE)
            for n in range(f0, f1): pr.stdin.write(sc.frame(n / FPS).convert("RGB").tobytes())
            pr.stdin.close()
            if pr.wait() != 0: raise SystemExit("ffmpeg failed on scene %d" % i)
            os.replace(tmp, out)
        lst.append(f"file '{out}'")
    open(f"{sd}/list.txt", "w").write("\n".join(lst) + "\n")
    audio = mix_audio(work, tl, total, seg, hash(ep["id"]) & 0xffff)
    final = f"{ROOT}/out/{ep['id']}-{seg}.mp4"; tmpf = final + ".tmp.mp4"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", f"{sd}/list.txt", "-i", audio, "-map", "0:v", "-map", "1:a",
                    "-c:v", "copy", "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", tmpf], check=True)
    os.replace(tmpf, final); print(final, round(total, 1)); return final


def thumb(ep, work, beats):
    if ep.get("theme", "stick") == "stick":
        p = f"{ROOT}/out/{ep['id']}-thumb.jpg"; stick_thumb(ep).save(p, quality=92); print(p); return p
    W, H = 1280, 720; im = bg_image(W, H, YEL, 7); d = ImageDraw.Draw(im)
    m = mascot_img("shocked", 560); im.paste(m, (30, 150), m)
    icons = [emoji_img(e, 200) for e in ep.get("thumb_icons", ep["chapters"][0]["beats"][0].get("icons", []))[:2]]
    for i, ic in enumerate(i for i in icons if i):
        ic = ic.rotate(-8 + 16 * i, expand=True); im.paste(ic, (1060, 70 + i * 360), ic)
    f = font(F800, 100); words = ep.get("thumb_text", ep["title"]).upper().split()
    lines = wrap(d, words, f, 480); y = 360 - (len(lines) - 1) * 54
    for ln in lines:
        d.text((540, y), " ".join(w for _, w in ln), font=f, fill=(255, 255, 255), anchor="lm", stroke_width=14, stroke_fill=INK); y += 112
    p = f"{ROOT}/out/{ep['id']}-thumb.jpg"; im.save(p, quality=92); print(p); return p


if __name__ == "__main__":
    cmd, path = sys.argv[1], sys.argv[2]
    ep, work, beats = load(path)
    if cmd == "tts": tts(ep, work, beats)
    elif cmd == "preview": render(ep, work, beats, sys.argv[3], preview=True)
    elif cmd == "render": render(ep, work, beats, sys.argv[3])
    elif cmd == "thumb": thumb(ep, work, beats)
    elif cmd == "durations":
        for s in ["long"] + [f"short{i + 1}" for i in range(len(ep["chapters"]))]:
            print(s, round(timeline(work, segment(beats, s))[1], 1))
    elif cmd == "all":
        tts(ep, work, beats); thumb(ep, work, beats); render(ep, work, beats, "long")
        for i in range(len(ep["chapters"])): render(ep, work, beats, f"short{i + 1}")
