#!/usr/bin/env bash
# Generate 9-slice frame for cracked-stone-2
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

python3 "$PROJECT_DIR/tools/framegen.py" \
  "$PROJECT_DIR/src/assets/backgrounds/cracked-stone-2.png" \
  --output "$PROJECT_DIR/src/assets/backgrounds/cracked-stone-2.frame.png" \
  --border 10 --depth 6.0 --curve 1.3 \
  --boundary-jitter 0 --wave-freq 5 --octaves 2 \
  --curve-jitter 0.3 \
  --seed 45
