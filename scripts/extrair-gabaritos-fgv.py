"""
Extrai os gabaritos oficiais dos PDFs baixados do oab.fgv.br.
Formato esperado por PDF: lista de 80 numeros seguida de 80 letras A/B/C/D
(ou intercalada em colunas), para a PROVA TIPO 1 (BRANCA).

Gera scripts/gabarito-fgv.json:
  { "46": { "1": "C", "2": "D", ... }, "47": { ... } }
"""

import fitz
import re
import json
import os
import sys

PASTA = os.path.dirname(__file__)
PROVAS = [(46, "gabarito-46.pdf"), (47, "gabarito-47.pdf")]
SAIDA = os.path.join(PASTA, "gabarito-fgv.json")


def extrair_tipo1(texto: str) -> dict[int, str]:
    """
    O gabarito vem com secoes por tipo. Pegamos a do Tipo 1 (Branca).
    Dentro dessa secao, acumulamos numeros e letras na ordem em que aparecem;
    pareamos: Nª numero -> Nª letra.
    """
    # Localiza bloco do Tipo 1
    m = re.search(r"PROVA\s+TIPO\s+1(.*?)(?:PROVA\s+TIPO\s+[2-9]|\Z)", texto, re.DOTALL | re.IGNORECASE)
    if not m:
        print("[!] Secao 'PROVA TIPO 1' nao encontrada", file=sys.stderr)
        return {}

    bloco = m.group(1)

    numeros: list[int] = []
    letras: list[str] = []
    # Varre tokens linha a linha
    for linha in bloco.splitlines():
        token = linha.strip()
        if not token:
            continue
        if token.isdigit() and 1 <= int(token) <= 80:
            numeros.append(int(token))
        elif token in ("A", "B", "C", "D"):
            letras.append(token)
        elif token in ("ANULADA", "ANUL", "N"):
            # Questao anulada — marca como None
            letras.append("ANULADA")

    if len(numeros) != len(letras):
        print(
            f"[!] Mismatch: {len(numeros)} numeros vs {len(letras)} letras. Mostrando...",
            file=sys.stderr,
        )
        print("Numeros:", numeros[:20], "...", file=sys.stderr)
        print("Letras:", letras[:20], "...", file=sys.stderr)

    pareados = {}
    for n, l in zip(numeros, letras):
        pareados[n] = l
    return pareados


def main():
    todos = {}
    for exame, arquivo in PROVAS:
        path = os.path.join(PASTA, arquivo)
        if not os.path.exists(path):
            print(f"[!] {arquivo} nao encontrado", file=sys.stderr)
            continue
        doc = fitz.open(path)
        texto = "\n".join(p.get_text() for p in doc)
        doc.close()

        gabarito = extrair_tipo1(texto)
        if len(gabarito) == 80:
            print(f"OK: {exame}o Exame - 80 questoes gabaritadas")
        else:
            print(f"[!] {exame}o Exame - apenas {len(gabarito)}/80. Confira manualmente.")
        todos[str(exame)] = gabarito

    with open(SAIDA, "w", encoding="utf-8") as f:
        json.dump(todos, f, ensure_ascii=False, indent=2)
    print(f"\nGravado em {SAIDA}")

    # Amostra
    for exame, g in todos.items():
        amostra = {k: g[k] for k in sorted(g)[:10]}
        print(f"{exame}o primeiros 10: {amostra}")


if __name__ == "__main__":
    main()
