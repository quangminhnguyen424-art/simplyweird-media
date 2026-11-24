"""Build a landscape (16:9) compilation video from finished motion Shorts.

Format idea: "every weird thing you never understood, explained" - an intro that lists the chapters,
then each Short as a chapter: the vertical video on the left, chapter number + title + Huh on the right.
Each chapter drops its follow card except the last one.

Usage (repo root):
  python3 motion/compile.py <out-slug> "<intro line to speak>" <short-slug> [<short-slug> ...]
Writes out/<out-slug>.mp4 and out/<out-slug>-chapters.txt (YouTube chapter list).
"""
import json, os, subprocess, sys
import numpy as np, soundfile as sf
from PIL import Image, ImageDraw, ImageFont, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
sys.path.insert(0, os.path.join(ROOT, "engine")); sys.path.insert(0, HERE)
W, H, FPS = 1920, 1080, 30
INK, PINK, YEL, CREAM = (20, 20, 43), (255, 92, 138), (255, 210, 63), (255, 246, 222)
F8 = os.path.join(ROOT, "engine/assets/fonts/Baloo2-800.ttf"); F6 = os.path.join(ROOT, "engine/assets/fonts/Baloo2-600.ttf")
MASC = os.path.join(ROOT, "engine/assets/mascot")
VX, VY, VH = 150, 40, 1000  # vertical video placement
VW = round(VH * 9 / 16 / 2) * 2
ENC = ["-c:v", "libx264", "-preset", "veryfast", "-crf", "19", "-pix_fmt", "yuv420p", "-r", str(FPS),
       "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2"]


def font(p, s): return ImageFont.truetype(p, s)


def wrap(d, text, f, width):
    lines, cur = [], ""
    for w in text.split():
        t = (cur + " " + w).strip()
        if d.textlength(t, font=f) <= width: cur = t
        else: lines.append(cur); cur = w
    return lines + [cur]


def base():
    im = Image.new("RGB", (W, H), INK); d = ImageDraw.Draw(im)
    for x in range(0, W, 90): d.line([(x, 0), (x, H)], fill=(45, 45, 72), width=2)
    for y in range(0, H, 90): d.line([(0, y), (W, y)], fill=(45, 45, 72), width=2)
    glow = Image.new("RGB", (W, H), (0, 0, 0)); ImageDraw.Draw(glow).ellipse([900, 100, 1900, 1000], fill=(90, 40, 80))
    return Image.blend(im, Image.blend(im, glow, 0.5).filter(ImageFilter.GaussianBlur(160)), 0.6)


def text_ol(d, xy, s, f, fill, w=5):
    for dx in range(-w, w + 1, w):
        for dy in range(-w, w + 1 + 3, w):
            d.text((xy[0] + dx, xy[1] + dy), s, font=f, fill=INK)
    d.text(xy, s, font=f, fill=fill)


def mascot(im, mood, x, y, h):
    m = Image.open(os.path.join(MASC, mood + ".png")).convert("RGBA")
    m = m.resize((int(m.width * h / m.height), h)); im.paste(m, (x, y), m)


def chapter_panel(n, of, title, mood, path):
    im = base(); d = ImageDraw.Draw(im)
    d.rounded_rectangle([VX - 14, VY - 14, VX + VW + 14, VY + VH + 14], 34, fill=(255, 255, 255))
    x0 = VX + VW + 120
    d.rounded_rectangle([x0, 170, x0 + 330, 250], 40, fill=PINK)
    d.text((x0 + 165, 210), f"chapter {n}/{of}", font=font(F8, 50), fill="white", anchor="mm")
    f = font(F8, 96); y = 300
    for ln in wrap(d, title, f, W - x0 - 90):
        text_ol(d, (x0, y), ln, f, "white"); y += 104
    for i in range(of):  # progress squares
        c = (255, 255, 255) if i < n - 1 else PINK if i == n - 1 else None
        d.rounded_rectangle([x0 + i * 58, y + 40, x0 + i * 58 + 40, y + 80], 9, fill=c, outline="white", width=5)
    mascot(im, mood, W - 420, H - 430, 380)
    d.text((x0, H - 90), "SIMPLY WEIRD", font=font(F8, 44), fill=YEL)
    im.save(path)


def intro_panel(heading, titles, path):
    im = base(); d = ImageDraw.Draw(im)
    f = font(F8, 110); y = 90
    for ln in wrap(d, heading, f, 1250):
        text_ol(d, (110, y), ln, f, "white"); y += 118
    y += 30
    for i, t in enumerate(titles):
        d.rounded_rectangle([110, y, 180, y + 70], 16, fill=PINK)
        d.text((145, y + 35), str(i + 1), font=font(F8, 48), fill="white", anchor="mm")
        d.text((210, y + 4), t, font=font(F6, 54), fill=CREAM); y += 96
    mascot(im, "curious", 1400, 330, 640)
    im.save(path)


def sh(*a): subprocess.run(list(a), check=True)


def dur(f): return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]))


def main(out, intro_line, slugs):
    work = os.path.join(ROOT, "out", "compile", out); os.makedirs(work, exist_ok=True)
    eps = []
    for s in slugs:
        t = json.load(open(os.path.join(HERE, "src/episodes", s, "timing.json")))
        lens = [round((x["dur"] + 0.35) * FPS) for x in t]
        cta = (8 + sum(lens[:-1])) / FPS if t[-1]["id"] == "cta" else None
        title = [l for l in open(os.path.join(HERE, "src/episodes", s, "Scenes.tsx")) if l.startswith("export const title")][0].split("'")[1]
        eps.append((s, title, cta))
    # intro narration + music bed
    from kokoro_onnx import Kokoro
    from make import mix_audio
    k = Kokoro("/home/claude/tts/kokoro-v1.0.onnx", "/home/claude/tts/voices-v1.0.bin")
    a, sr = k.create(intro_line, voice="am_michael", speed=1.05, lang="en-us"); a = np.asarray(a, np.float32)
    total = len(a) / sr + 1.2
    wav = mix_audio(work, [({}, 0.4, 0.4 + len(a) / sr, a, sr)], total, "intro", seed=7)
    intro_panel("every weird thing you never understood, explained", [e[1] for e in eps], os.path.join(work, "intro.png"))
    segs = [os.path.join(work, "00.mp4")]
    sh("ffmpeg", "-y", "-loglevel", "error", "-framerate", str(FPS), "-i", os.path.join(work, "intro.png"), "-i", wav,
       "-vf", f"format=yuv420p,loop=-1:1,trim=duration={total:.2f},zoompan=z='1+0.0004*on':d=1:s={W}x{H}:fps={FPS},fade=t=out:st={total-0.3:.2f}:d=0.3",
       "-t", f"{total:.2f}", *ENC, segs[0] + ".tmp.mp4")
    os.replace(segs[0] + ".tmp.mp4", segs[0])
    moods = ["explaining", "shocked", "thinking", "laughing", "curious"]
    chapters, t0 = [("0:00", "Intro")], total
    for i, (s, title, cta) in enumerate(eps):
        src = os.path.join(ROOT, "videos", s + ".mp4")
        if not os.path.exists(src): src = os.path.join(ROOT, "out", s + ".mp4")
        last = i == len(eps) - 1
        L = dur(src) if (last or cta is None) else cta + 0.2
        png = os.path.join(work, f"ch{i+1}.png"); chapter_panel(i + 1, len(eps), title, moods[i % 5], png)
        o = os.path.join(work, f"{i+1:02d}.mp4")
        sh("ffmpeg", "-y", "-loglevel", "error", "-loop", "1", "-framerate", str(FPS), "-i", png, "-i", src, "-filter_complex",
           f"[1:v]scale={VW}:{VH},setsar=1[v];[0:v][v]overlay={VX}:{VY}:shortest=1,format=yuv420p,fade=t=in:d=0.25,fade=t=out:st={L-0.3:.2f}:d=0.3[o];"
           f"[1:a]atrim=0:{L:.2f},afade=t=out:st={L-0.3:.2f}:d=0.3[a]",
           "-map", "[o]", "-map", "[a]", "-t", f"{L:.2f}", *ENC, o + ".tmp.mp4")
        os.replace(o + ".tmp.mp4", o); segs.append(o)
        m, sec = divmod(int(t0), 60); chapters.append((f"{m}:{sec:02d}", title)); t0 += L
    lst = os.path.join(work, "list.txt"); open(lst, "w").write("".join(f"file '{p}'\n" for p in segs))
    final = os.path.join(ROOT, "out", out + ".mp4")
    sh("ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", lst, "-c", "copy", "-movflags", "+faststart", final)
    open(os.path.join(ROOT, "out", out + "-chapters.txt"), "w").write("\n".join(f"{a} {b}" for a, b in chapters) + "\n")
    print("done:", final, round(dur(final), 1), "s"); print("\n".join(f"{a} {b}" for a, b in chapters))


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2], sys.argv[3:])
