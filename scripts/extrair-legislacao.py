"""
Extrai texto limpo do EAOAB (HTML Planalto) e do CED/2015 (PDF OAB).
Salva em:
  - scripts/legislacao/eaoab.txt
  - scripts/legislacao/ced-2015.txt

Esses arquivos sao usados como entrada para os agents de producao de blocos.
"""

import os
import re
import html
from html.parser import HTMLParser
import fitz  # pymupdf

PASTA = os.path.dirname(__file__)
SAIDA = os.path.join(PASTA, "legislacao")
os.makedirs(SAIDA, exist_ok=True)


class StripHTML(HTMLParser):
    def __init__(self):
        super().__init__()
        self.partes = []
        self.ignorar = False

    def handle_starttag(self, tag, attrs):
        if tag in ("script", "style"):
            self.ignorar = True
        if tag in ("p", "br", "div", "li", "tr", "h1", "h2", "h3", "h4"):
            self.partes.append("\n")

    def handle_endtag(self, tag):
        if tag in ("script", "style"):
            self.ignorar = False

    def handle_data(self, data):
        if not self.ignorar:
            self.partes.append(data)


def extrair_html(path: str) -> str:
    with open(path, encoding="utf-8", errors="replace") as f:
        bruto = f.read()
    # Decodifica entidades HTML (&nbsp;, &aacute; etc.)
    bruto = html.unescape(bruto)
    s = StripHTML()
    s.feed(bruto)
    txt = "".join(s.partes)
    # Normaliza espacos e quebras
    txt = re.sub(r"[ \t]+", " ", txt)
    txt = re.sub(r"\n[ \t]*", "\n", txt)
    txt = re.sub(r"\n{3,}", "\n\n", txt)
    return txt.strip()


def extrair_pdf(path: str) -> str:
    doc = fitz.open(path)
    partes = [pg.get_text() for pg in doc]
    doc.close()
    txt = "\n".join(partes)
    txt = re.sub(r"[ \t]+", " ", txt)
    txt = re.sub(r"\n[ \t]*", "\n", txt)
    txt = re.sub(r"\n{3,}", "\n\n", txt)
    return txt.strip()


def main():
    eaoab = extrair_html(os.path.join(PASTA, "eaoab-planalto.html"))
    with open(os.path.join(SAIDA, "eaoab.txt"), "w", encoding="utf-8") as f:
        f.write(eaoab)
    print(f"EAOAB: {len(eaoab)} chars")

    ced = extrair_pdf(os.path.join(PASTA, "ced-2015.pdf"))
    with open(os.path.join(SAIDA, "ced-2015.txt"), "w", encoding="utf-8") as f:
        f.write(ced)
    print(f"CED/2015: {len(ced)} chars")

    # Diagnostico rapido: achar primeiro artigo
    for nome, txt in [("eaoab", eaoab), ("ced", ced)]:
        m = re.search(r"Art\.?\s*1[.ºo°]", txt)
        print(f"  {nome}: 'Art. 1º' aparece em pos {m.start() if m else '?'}")


if __name__ == "__main__":
    main()
