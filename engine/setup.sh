#!/usr/bin/env bash
# One-time setup for a fresh machine. Safe to run again: skips what already exists.
set -e
pip install --break-system-packages -q kokoro-onnx soundfile cairosvg pillow numpy 2>/dev/null || pip install -q kokoro-onnx soundfile cairosvg pillow numpy
KDIR="${KOKORO_DIR:-/home/claude/tts}"; mkdir -p "$KDIR"
base=https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0
[ -s "$KDIR/kokoro-v1.0.onnx" ] || curl -sSL -o "$KDIR/kokoro-v1.0.onnx" "$base/kokoro-v1.0.onnx"
[ -s "$KDIR/voices-v1.0.bin" ]  || curl -sSL -o "$KDIR/voices-v1.0.bin"  "$base/voices-v1.0.bin"
OM="${OPENMOJI_DIR:-/tmp/om/package}"
if [ ! -d "$OM/color/svg" ]; then
  mkdir -p /tmp/om && (cd /tmp/om && npm pack openmoji@17.0.0 -q >/dev/null && tar xzf openmoji-17.0.0.tgz)
fi
command -v ffmpeg >/dev/null || (apt-get update -qq && apt-get install -y -qq ffmpeg)
# motion-graphics (Remotion) toolchain
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
[ -d "$ROOT/motion/node_modules/remotion" ] || (cd "$ROOT/motion" && npm ci --no-audit --no-fund --loglevel=error)
command -v google-chrome >/dev/null || echo "WARN: no google-chrome; set CHROME=/path/to/chrome for motion/build.py"
echo "setup ok"
