import xml.etree.ElementTree as ET, os

src = os.path.join(os.path.dirname(__file__), "dese-logo-png-plain.svg")
dst = os.path.join(os.path.dirname(__file__), "desenho-logo-png.svg")

tree = ET.parse(src)
root = tree.getroot()
ns = "http://www.w3.org/2000/svg"

path_el = root.find(f".//{{{ns}}}path")
if path_el is None:
    path_el = root.find(".//path")

path_d = path_el.get("d")
print(f"Path: {len(path_d)} chars, inicia com: {path_d[:40]}")

svg = f'''<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg version="1.1" width="1536" height="1024" viewBox="0 0 1536 1024"
     xmlns="http://www.w3.org/2000/svg">
<defs>
  <linearGradient id="gold" x1="0" y1="0" x2="1536" y2="0" gradientUnits="userSpaceOnUse">
    <stop offset="0%"   stop-color="#c9a84c"/>
    <stop offset="28%"  stop-color="#f5e27a"/>
    <stop offset="52%"  stop-color="#b8860b"/>
    <stop offset="78%"  stop-color="#f0d060"/>
    <stop offset="100%" stop-color="#c9a84c"/>
  </linearGradient>
  <style>
    #contour {{
      fill: none;
      stroke: url(#gold);
      stroke-width: 7;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-dasharray: 99999;
      stroke-dashoffset: 99999;
      animation: draw 4.5s cubic-bezier(0.22, 0.61, 0.36, 1) 0s both;
    }}
    @keyframes draw {{
      from {{ stroke-dashoffset: 99999; opacity: 0; }}
      3%   {{ opacity: 1; }}
      to   {{ stroke-dashoffset: 0; opacity: 1; }}
    }}
  </style>
</defs>
<path id="contour" d="{path_d}"/>
</svg>'''

with open(dst, "w", encoding="utf-8") as f:
    f.write(svg)

print(f"Gerado: {dst} ({os.path.getsize(dst):,} bytes)")
