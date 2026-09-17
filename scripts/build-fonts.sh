#!/bin/bash
# Rebuilds the self-hosted webfonts from upstream sources (all OFL).
# Requires: fonttools + brotli.
#
#   Display: Young Serif    — single weight, low contrast, rounded terminals.
#   Text:    Instrument Sans — variable weight, width axis pinned to 100.
#   Amharic: Noto Sans Ethiopic, cut down to the restaurant's own name.
set -euo pipefail
PY="${PY:-/tmp/fsub/bin/python}"
SRC="${SRC:-/tmp/fontsrc}"
OUT="public/fonts"
UNI='U+0020-007E,U+00A0-00FF,U+0100-017F,U+00D7,U+00A9,U+2013,U+2014,U+2018,U+2019,U+201C,U+201D,U+2022,U+2026,U+2044,U+2191,U+2192,U+2212'
FLAGS='--layout-features=kern,liga,calt,ccmp,case,lnum,tnum --no-hinting --desubroutinize --drop-tables+=DSIG --flavor=woff2'

# Young Serif ships a single weight, so there is nothing to instance.
"$PY" -m fontTools.subset "$SRC/YoungSerif.ttf" --unicodes="$UNI" $FLAGS \
  --output-file="$OUT/youngserif.woff2"

# Instrument Sans: pin the width axis, keep weight variable.
"$PY" -m fontTools.varLib.instancer "$SRC/InstrumentSans.ttf" wdth=100 wght=400:700 \
  -o /tmp/instrument-i.ttf >/dev/null
"$PY" -m fontTools.subset /tmp/instrument-i.ttf --unicodes="$UNI" $FLAGS \
  --output-file="$OUT/instrumentsans.woff2"

# Noto Sans Ethiopic: static, only the glyphs of the restaurant's own Amharic name.
"$PY" -m fontTools.varLib.instancer "$SRC/NotoEth.ttf" wdth=100 wght=500 -o /tmp/eth-i.ttf >/dev/null
"$PY" -m fontTools.subset /tmp/eth-i.ttf --text='አቢሲኒያየኢትዮጵያምግብቤት ' \
  --layout-features=ccmp,mark,mkmk --no-hinting --drop-tables+=DSIG --flavor=woff2 \
  --output-file="$OUT/ethiopic.woff2"
