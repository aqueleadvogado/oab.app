"""
Prepara os inputs compactos para os agents de classificacao.
Divide as 160 questoes em 4 lotes de 40 e gera scripts/lote-{1..4}.txt
Cada lote: lista de topicos no inicio + 40 questoes compactas.
"""

import json
import os
import re

PASTA = os.path.dirname(__file__)
QUESTOES_JSON = os.path.join(PASTA, "questoes-fgv.json")
TOPICOS_TS = os.path.join(PASTA, "..", "lib", "edital", "topicos.ts")


def extrair_topicos():
    """Le o TS e extrai mapa disciplina_slug -> [topico_slugs]."""
    txt = open(TOPICOS_TS, encoding="utf-8").read()
    resultado = {}
    # Match: "slug_disciplina": [ ... entries ... ],
    pattern = re.compile(
        r'"?([a-z-]+)"?:\s*\[\s*((?:\{[^}]+\},?\s*)+)\s*\]',
        re.DOTALL,
    )
    for m in pattern.finditer(txt):
        disc = m.group(1)
        bloco = m.group(2)
        slugs = re.findall(r'slug:\s*"([a-z-]+)"', bloco)
        if slugs:
            resultado[disc] = slugs
    return resultado


def main():
    questoes = json.load(open(QUESTOES_JSON, encoding="utf-8"))
    topicos = extrair_topicos()

    # Monta cabecalho de topicos (compacto)
    cabecalho = ["LISTA DE DISCIPLINAS E TOPICOS (use EXATAMENTE esses slugs):"]
    for disc, slugs in topicos.items():
        cabecalho.append(f"  {disc}: {', '.join(slugs)}")
    cabecalho_txt = "\n".join(cabecalho)

    # Divide em 4 lotes
    tamanho = 40
    for i in range(4):
        inicio = i * tamanho
        fim = inicio + tamanho
        lote = questoes[inicio:fim]

        linhas = [cabecalho_txt, "", f"=== LOTE {i+1}/4 — {len(lote)} questoes ===", ""]
        for q in lote:
            enun = re.sub(r"\s+", " ", q["enunciado"])[:600]
            linhas.append(f"[Q-{q['exame']}-{q['numero']}]")
            linhas.append(f"ENUNCIADO: {enun}")
            for alt in q["alternativas"]:
                texto_alt = re.sub(r"\s+", " ", alt["texto"])[:200]
                linhas.append(f"  ({alt['chave']}) {texto_alt}")
            linhas.append("")

        saida = os.path.join(PASTA, f"lote-{i+1}.txt")
        with open(saida, "w", encoding="utf-8") as f:
            f.write("\n".join(linhas))
        print(f"Gerado {saida} ({len(lote)} questoes)")


if __name__ == "__main__":
    main()
