"""Generuje public/brand/wordmark.svg i lockup.svg z konturów Space Grotesk (docs/brand.md §4).
Uruchom: python3 scripts/wordmark-svg.py (wymaga fonttools i node_modules/@fontsource-variable/space-grotesk)."""
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.varLib.instancer import instantiateVariableFont
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2'
OUT = ROOT / 'public/brand'
TRACK = -0.03  # em, jak w DESIGN.md

def instance(weight):
    f = TTFont(SRC)
    return instantiateVariableFont(f, {'wght': weight}, inplace=False)

def word_paths(font, text, size, x0, y0, tracking):
    cmap = font.getBestCmap(); gs = font.getGlyphSet(); hmtx = font['hmtx']
    upem = font['head'].unitsPerEm; scale = size / upem
    x = x0; paths = []
    for i, ch in enumerate(text):
        gn = cmap[ord(ch)]
        pen = SVGPathPen(gs)
        tpen = TransformPen(pen, (scale, 0, 0, -scale, x, y0))
        gs[gn].draw(tpen)
        d = pen.getCommands()
        if d: paths.append(d)
        adv = hmtx[gn][0] * scale
        x += adv + tracking * size
        if i < len(text) - 1 and (ch, text[i + 1]) in (('N', 'e'),):
            pass
    return paths, x

def build():
    f500 = instance(500); f300 = instance(300)
    size = 100
    p1, x1 = word_paths(f500, 'Nest', size, 0, 100, TRACK)
    space = f500['hmtx'][f500.getBestCmap()[ord(' ')]][0] * size / f500['head'].unitsPerEm
    p2, x2 = word_paths(f300, 'Studio', size, x1 + space, 100, TRACK)
    width = x2
    body = ''.join(f'<path d="{d}"/>' for d in p1 + p2)
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -2 {width:.0f} 128" fill="currentColor"><title>Nest Studio</title>{body}</svg>\n'
    (OUT / 'wordmark.svg').write_text(svg)
    # lockup: znak + odstęp 0.6 wysokości + wordmark; cap height Space Grotesk ~0.70 em
    cap = 70; mark_h = cap * 1.15; mark_scale = mark_h / 40  # znak zajmuje ~40 jednostek z 48
    gap = 0.6 * mark_h
    mark = ('<g transform="translate(0 {ty:.1f}) scale({s:.4f})" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round">'
            '<path d="M15 4V6.44M15 14.56V44"/><path d="M33 4V44"/><path d="M11 4.5L30.3 33.45M35.7 41.55L38.6 45.9"/></g>').format(ty=100 - cap - (mark_h - cap) / 2 - 4 * mark_scale, s=mark_scale)
    off = 48 * mark_scale + gap
    lock = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -2 {width + off:.0f} 128" fill="currentColor"><title>Nest Studio</title>{mark}<g transform="translate({off:.1f} 0)">{body}</g></svg>\n'
    (OUT / 'lockup.svg').write_text(lock)
    print('ok', width)

build()
