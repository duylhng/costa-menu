"""Generate Costa's logo files: outlined-text SVGs (print-safe) for the badge and icon.

Usage:  pip install fonttools
        python3 brand/make_logo.py <fonts-dir> brand

<fonts-dir> must contain Fraunces Black (900) and JetBrains Mono Bold (700) as .ttf files,
named as below (the static files Google Fonts serves). Download them from
https://fonts.google.com/specimen/Fraunces and https://fonts.google.com/specimen/JetBrains+Mono
and rename, or edit the two paths below.
"""
import math, sys
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen

FONTS = sys.argv[1]
OUT = sys.argv[2]
FRAUNCES = TTFont(f"{FONTS}/Fraunces-Black.ttf")
MONO = TTFont(f"{FONTS}/JetBrainsMono-Bold.ttf")

TOMATO, INK, PAPER, MUSTARD, FACE = "#c9442a", "#1d1915", "#f3ecdf", "#e2a12f", "#fffaf2"

def glyphs(font, text, size, spacing):
    cmap, gs, hmtx = font.getBestCmap(), font.getGlyphSet(), font["hmtx"]
    scale = size / font["head"].unitsPerEm
    out = []
    for ch in text:
        name = cmap[ord(ch)]
        pen = SVGPathPen(gs)
        gs[name].draw(pen)
        out.append((pen.getCommands(), hmtx[name][0] * scale, scale))
    total = sum(a for _, a, _ in out) + spacing * (len(out) - 1)
    return out, total

def arc_text(font, text, size, radius, cx, cy, top=True, spacing=0.0, fill=PAPER):
    gl, total = glyphs(font, text, size, spacing)
    parts, pos = [], 0.0
    for d, adv, scale in gl:
        mid = pos + adv / 2
        if top:
            theta = -math.pi / 2 - total / 2 / radius + mid / radius
            rot = math.degrees(theta) + 90
        else:
            theta = math.pi / 2 + total / 2 / radius - mid / radius
            rot = math.degrees(theta) - 90
        x, y = cx + radius * math.cos(theta), cy + radius * math.sin(theta)
        if d:
            parts.append(
                f'<path transform="translate({x:.2f} {y:.2f}) rotate({rot:.3f}) translate({-adv/2:.2f} 0) scale({scale:.5f} {-scale:.5f})" d="{d}"/>'
            )
        pos += adv + spacing
    return f'<g fill="{fill}">' + "".join(parts) + "</g>"

def rooster(transform, stroke=4):
    # Drawn on a ~240 grid; the face, outline and wink use fixed colours so it reads in light and dark mode.
    return f'''<g transform="{transform}" stroke="{INK}" stroke-width="{stroke}" stroke-linejoin="round" stroke-linecap="round">
  <circle cx="100" cy="66" r="15" fill="{TOMATO}"/><circle cx="122" cy="58" r="17" fill="{TOMATO}"/><circle cx="143" cy="68" r="14" fill="{TOMATO}"/>
  <path d="M78 178 C 70 140, 78 92, 120 80 C 160 90, 170 140, 162 178 L150 170 L140 180 L128 170 L116 180 L104 170 L92 180 Z" fill="{FACE}"/>
  <path d="M140 112 L170 120 L140 130 Z" fill="{MUSTARD}"/>
  <path d="M136 132 C 150 136, 150 160, 138 162 C 128 160, 128 140, 136 132 Z" fill="{TOMATO}"/>
  <path d="M110 108 q9 -8 18 0" fill="none" stroke-width="{stroke * 1.15:.2f}"/>
</g>'''

def svg(body, title):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="{title}"><title>{title}</title>{body}</svg>\n'

C = 256
badge = svg(
    f'<circle cx="{C}" cy="{C}" r="252" fill="{TOMATO}"/>'
    f'<circle cx="{C}" cy="{C}" r="232" fill="none" stroke="{PAPER}" stroke-width="3" stroke-dasharray="3 9" stroke-linecap="round"/>'
    f'<circle cx="{C}" cy="{C}" r="150" fill="{PAPER}" stroke="{INK}" stroke-width="6"/>'
    + arc_text(FRAUNCES, "COSTA'S", 66, 180, C, C, top=True, spacing=7)
    + arc_text(MONO, "TAKEAWAY · WOODRIDGE", 25, 213, C, C, top=False, spacing=4.2)
    + f'<circle cx="{C-198}" cy="{C}" r="7" fill="{PAPER}"/><circle cx="{C+198}" cy="{C}" r="7" fill="{PAPER}"/>'
    + rooster(f"translate({C} {C+6}) scale(1.5) translate(-124 -112)"),
    "Costa's Takeaway, Woodridge",
)
icon = svg(
    f'<circle cx="{C}" cy="{C}" r="252" fill="{TOMATO}"/>'
    f'<circle cx="{C}" cy="{C}" r="214" fill="{PAPER}" stroke="{INK}" stroke-width="12"/>'
    + rooster(f"translate({C} {C+10}) scale(2.25) translate(-124 -112)", stroke=5.5),
    "Costa's Takeaway",
)
open(f"{OUT}/costas-badge.svg", "w").write(badge)
open(f"{OUT}/costas-icon.svg", "w").write(icon)
print("badge", len(badge), "bytes; icon", len(icon), "bytes")
