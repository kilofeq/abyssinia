#!/usr/bin/env python3
"""
Traces the restaurant's logo (reference/MainLogoDark.png) into the SVG path used
by src/components/Logo.tsx.

The source is a flat single-colour silhouette on transparency, so the alpha
channel alone defines the shape. Output is normalised to a 256-unit viewBox at
one decimal place: the mark is never drawn above ~60px, so more precision than
that is bytes with nothing to show for them.

    /tmp/fsub/bin/pip install Pillow potracer
    /tmp/fsub/bin/python scripts/trace-logo.py
"""
from PIL import Image
import numpy as np
from potrace import Bitmap

SRC = 'reference/MainLogoDark.png'
TRACE_WIDTH = 800        # raster width handed to potrace
VIEW_WIDTH = 256         # viewBox width of the emitted path

im = Image.open(SRC).convert('RGBA')
alpha = im.getchannel('A')
bbox = alpha.point(lambda v: 255 if v > 128 else 0).getbbox()
a = alpha.crop(bbox)
a = a.resize((TRACE_WIDTH, round(TRACE_WIDTH * a.size[1] / a.size[0])), Image.LANCZOS)

# potrace treats set pixels as background here, so the mask is inverted.
data = np.array(a) <= 128
path = Bitmap(data).trace(turdsize=5, alphamax=1.0, opticurve=True, opttolerance=0.3)

k = VIEW_WIDTH / a.size[0]
view_h = round(a.size[1] * k, 2)
f = lambda v: str(round(float(v) * k, 1))

parts = []
for curve in path:
    parts.append(f'M{f(curve.start_point.x)} {f(curve.start_point.y)}')
    for s in curve:
        if s.is_corner:
            parts.append(f'L{f(s.c.x)} {f(s.c.y)}L{f(s.end_point.x)} {f(s.end_point.y)}')
        else:
            parts.append(
                f'C{f(s.c1.x)} {f(s.c1.y)} {f(s.c2.x)} {f(s.c2.y)} {f(s.end_point.x)} {f(s.end_point.y)}'
            )
    parts.append('Z')

d = ''.join(parts).replace(' -', '-')
print(f'viewBox="0 0 {VIEW_WIDTH} {view_h:g}"  path {len(d)} chars')
print(d)
