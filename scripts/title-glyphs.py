"""Generuje src/scene/titleGlyphs.ts: kontury liter "NEST STUDIO" z Space Grotesk (docs/titles.md §6).
Jednostki: cap height = 1, y w górę (jak w Three.js). SVG w DOM odwraca oś y atrybutem transform.
Uruchom: python3 scripts/title-glyphs.py (wymaga fonttools + brotli i node_modules/@fontsource-variable/space-grotesk)."""
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.varLib.instancer import instantiateVariableFont
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2'
OUT = ROOT / 'src/scene/titleGlyphs.ts'
WORDS = [('NEST', 600), ('STUDIO', 400)]
TRACK = 0.03  # w jednostkach cap (litery wersalikowe potrzebują odrobiny światła)
PRECISION = 3

def instance(weight):
    return instantiateVariableFont(TTFont(SRC), {'wght': weight}, inplace=False)

def fmt(n):
    s = f'{n:.{PRECISION}f}'.rstrip('0').rstrip('.')
    return s if s not in ('-0', '') else '0'

def compact(d):
    # SVGPathPen daje "M1.5 2 L3 4 Q..."; ujednolicamy do 3 miejsc po przecinku
    return re.sub(r'-?\d+\.\d+|-?\d+', lambda m: fmt(float(m.group(0))), d)

def build():
    glyphs = []
    space = None
    for wi, (word, weight) in enumerate(WORDS):
        f = instance(weight)
        cmap = f.getBestCmap(); gs = f.getGlyphSet(); hmtx = f['hmtx']
        upem = f['head'].unitsPerEm
        cap = f['OS/2'].sCapHeight
        s = 1 / cap
        if space is None:
            space = hmtx[cmap[ord(' ')]][0] * s
        for ch in word:
            gn = cmap[ord(ch)]
            pen = SVGPathPen(gs)
            gs[gn].draw(TransformPen(pen, (s, 0, 0, s, 0, 0)))
            d = compact(pen.getCommands())
            adv = hmtx[gn][0] * s
            glyphs.append((ch, wi, d, adv))
    lines = ['/* Wygenerowane przez scripts/title-glyphs.py. Nie edytować ręcznie.',
             '   Kontury "NEST STUDIO" (Space Grotesk, NEST 600, STUDIO 400) w jednostkach cap height = 1, y w górę. */',
             'export interface TitleGlyph { ch: string; word: 0 | 1; d: string; adv: number }',
             f'export const TITLE_SPACE = {fmt(space)};',
             f'export const TITLE_TRACK = {TRACK};',
             'export const TITLE_GLYPHS: TitleGlyph[] = [']
    for ch, wi, d, adv in glyphs:
        lines.append(f"  {{ ch: '{ch}', word: {wi}, adv: {fmt(adv)}, d: '{d}' }},")
    lines.append('];')
    OUT.write_text('\n'.join(lines) + '\n')
    total = sum(g[3] for g in glyphs) + space + TRACK * (len(glyphs) - 1)
    print('ok', len(glyphs), 'glyphs, single line width (cap units):', round(total, 3), 'bytes:', OUT.stat().st_size)

build()
