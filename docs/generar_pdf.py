"""
Convierte los documentos de cada fase (Markdown) a PDF usando Microsoft Edge en modo headless.
Uso:  .venv/Scripts/python docs/generar_pdf.py
"""
import re
import subprocess
from pathlib import Path

import markdown

DOCS = Path(__file__).resolve().parent
EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
ARCHIVOS = ["fase-1-analisis", "fase-2-diseno", "fase-3-implementacion", "fase-4-evaluacion", "guion-exposicion"]

CSS = """
@page { size: Letter; margin: 18mm 16mm; }
body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 10.5pt; line-height: 1.5; color: #1f1f1f; }
h1 { font-size: 22pt; color: #141414; border-bottom: 4px solid #E50914; padding-bottom: 6px; margin-top: 0; }
h2 { font-size: 15pt; color: #E50914; margin-top: 22px; page-break-after: avoid; }
h3 { font-size: 12pt; margin-top: 16px; page-break-after: avoid; }
table { border-collapse: collapse; width: 100%; margin: 8px 0 12px; font-size: 9.5pt; page-break-inside: avoid; }
th { background: #141414; color: #fff; text-align: left; padding: 5px 7px; }
td { border-bottom: 1px solid #ddd; padding: 5px 7px; vertical-align: top; }
tr:nth-child(even) td { background: #f7f7f7; }
img { max-width: 100%; display: block; margin: 8px auto; border: 1px solid #ddd; page-break-inside: avoid; }
code { background: #f1f1f1; padding: 1px 4px; border-radius: 3px; font-size: 9pt; }
pre { background: #f6f6f6; border-left: 3px solid #E50914; padding: 8px 10px; font-size: 8.5pt; overflow: hidden; white-space: pre-wrap; page-break-inside: avoid; }
pre code { background: none; padding: 0; }
blockquote { border-left: 4px solid #3B82F6; margin: 10px 0; padding: 4px 12px; background: #f3f7ff; }
hr { border: none; border-top: 1px solid #ddd; margin: 18px 0; }
a { color: #c00810; text-decoration: none; }
"""

for nombre in ARCHIVOS:
    md = (DOCS / f"{nombre}.md").read_text(encoding="utf-8")
    # En Markdown "estricto" una lista necesita una línea en blanco antes; se agrega donde falte
    lineas, previa = [], ""
    for linea in md.splitlines():
        es_lista = re.match(r"^\s*([-*]|\d+\.) ", linea)
        if es_lista and previa.strip() and not re.match(r"^\s*([-*]|\d+\.) ", previa):
            lineas.append("")
        lineas.append(linea)
        previa = linea
    md = "\n".join(lineas)
    cuerpo = markdown.markdown(md, extensions=["tables", "fenced_code", "nl2br"])
    html = f"<!doctype html><html lang='es'><head><meta charset='utf-8'><style>{CSS}</style></head><body>{cuerpo}</body></html>"
    temporal = DOCS / f"_{nombre}.html"   # junto a docs/ para que las imágenes img/... se encuentren
    temporal.write_text(html, encoding="utf-8")
    salida = DOCS / "pdf" / f"{nombre}.pdf"
    subprocess.run([EDGE, "--headless=new", "--disable-gpu", "--no-pdf-header-footer",
                    f"--print-to-pdf={salida}", temporal.as_uri()], check=True, capture_output=True)
    if not __import__("os").environ.get("CONSERVAR_HTML"):
        temporal.unlink()
    print("PDF:", salida.name)
