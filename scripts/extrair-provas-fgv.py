"""
Extrai questoes dos PDFs do Exame de Ordem FGV.
Gera scripts/questoes-fgv.json com estrutura:
  [
    {
      "exame": 46,
      "numero": 1,
      "enunciado": "...",
      "alternativas": [{"chave": "A", "texto": "..."}, ...],
      "correta": null  <- preenchido depois com gabarito oficial
    }
  ]

Rodar: python scripts/extrair-provas-fgv.py
"""

import fitz
import re
import json
import os
import sys

PASTA = r"C:/Users/LENOVO X1 CARBON 8th/Desktop/Area do doctor/OAB App"
SAIDA = os.path.join(os.path.dirname(__file__), "questoes-fgv.json")

PROVAS = [
    (46, "561671_ADVOGADO OAB(CNS01) Tipo 1.pdf"),
    (47, "566837_ADVOGADO OAB(CNS01) Tipo 1.pdf"),
    # 45 fica fora porque tem fonte CID travada
]

RE_HEADER = re.compile(r"^\s*4[0-9]o EXAME D[OE] ORDEM UNIFICADO\s*$", re.MULTILINE)
RE_PAGE = re.compile(r"^\s*Tipo Branca.*P.gina\s+\d+\s*$", re.MULTILINE)
RE_NUM = re.compile(r"^\s*(\d{1,2})\s*$", re.MULTILINE)
RE_ALT = re.compile(r"\(([ABCD])\)\s+")
RE_PERCEPCAO = re.compile(
    r"Question.rio\s+de\s+percep.*prova", re.IGNORECASE
)


def normalizar(t: str) -> str:
    t = t.replace(" ", " ")
    t = re.sub(r"[ \t]+", " ", t)
    t = re.sub(r"\n\s*\n", "\n\n", t)
    return t.strip()


def extrair_texto_prova(path: str) -> str:
    """Extrai texto de todas as paginas, ate chegar no questionario de percepcao."""
    doc = fitz.open(path)
    partes = []
    for pg in doc:
        txt = pg.get_text()
        # Para no questionario de percepcao (vem depois das 80 questoes)
        if RE_PERCEPCAO.search(txt):
            # Pega soh o que vem antes dele nessa pagina
            idx = RE_PERCEPCAO.search(txt).start()
            partes.append(txt[:idx])
            break
        partes.append(txt)
    doc.close()
    return "\n".join(partes)


def limpar_headers(texto: str) -> str:
    texto = RE_HEADER.sub("", texto)
    texto = RE_PAGE.sub("", texto)
    return texto


def dividir_questoes(texto: str, numero_min: int = 1, numero_max: int = 80):
    """
    Divide por numeros de questao (linha isolada "1", "2", ..., "80").
    Retorna lista de (numero, bloco_texto).
    """
    # Acha todas as posicoes de numeros em linha isolada
    matches = []
    for m in RE_NUM.finditer(texto):
        n = int(m.group(1))
        if numero_min <= n <= numero_max:
            matches.append((n, m.start(), m.end()))

    # Filtra: so aceita numeros em sequencia (1, 2, 3, ..., 80)
    # Alguns numeros podem aparecer dentro do texto de enunciado (ex: "art. 5"); ignoramos.
    sequencia = []
    esperado = numero_min
    for n, s, e in matches:
        if n == esperado:
            sequencia.append((n, s, e))
            esperado += 1
            if esperado > numero_max:
                break

    questoes = []
    for i, (n, s, e) in enumerate(sequencia):
        proximo_inicio = sequencia[i + 1][1] if i + 1 < len(sequencia) else len(texto)
        bloco = texto[e:proximo_inicio].strip()
        questoes.append((n, bloco))
    return questoes


def parse_questao(numero: int, bloco: str):
    """Separa enunciado + 4 alternativas."""
    # Acha posicoes de (A), (B), (C), (D)
    alts = {}
    posicoes = []
    for m in RE_ALT.finditer(bloco):
        posicoes.append((m.group(1), m.start()))

    if len(posicoes) < 4:
        return None  # formato inesperado

    enunciado = bloco[: posicoes[0][1]].strip()
    for i, (letra, pos) in enumerate(posicoes[:4]):
        fim = posicoes[i + 1][1] if i + 1 < len(posicoes) else len(bloco)
        texto = bloco[pos:fim]
        # Remove "(X) " do inicio
        texto = re.sub(r"^\([ABCD]\)\s*", "", texto).strip()
        texto = normalizar(texto)
        alts[letra] = texto

    enunciado = normalizar(enunciado)
    alternativas = [{"chave": k, "texto": alts[k]} for k in "ABCD"]
    return {"numero": numero, "enunciado": enunciado, "alternativas": alternativas}


def main():
    todas = []
    for exame_num, arquivo in PROVAS:
        path = os.path.join(PASTA, arquivo)
        if not os.path.exists(path):
            print(f"[!] {arquivo} nao encontrado", file=sys.stderr)
            continue

        print(f"Lendo {exame_num}o Exame ({arquivo})...")
        texto = extrair_texto_prova(path)
        texto = limpar_headers(texto)

        blocos = dividir_questoes(texto)
        print(f"  {len(blocos)} questoes detectadas em sequencia")

        for numero, bloco in blocos:
            parsed = parse_questao(numero, bloco)
            if not parsed:
                print(f"  [!] Questao {numero}: formato inesperado, pulando")
                continue
            parsed["exame"] = exame_num
            parsed["correta"] = None  # preenchido depois com gabarito oficial
            todas.append(parsed)

    with open(SAIDA, "w", encoding="utf-8") as f:
        json.dump(todas, f, ensure_ascii=False, indent=2)

    print(f"\nTotal: {len(todas)} questoes gravadas em {SAIDA}")
    # Mostra uma amostra
    if todas:
        print("\n=== AMOSTRA (questao 1 do primeiro exame) ===")
        a = todas[0]
        print(f"Exame {a['exame']}, Questao {a['numero']}")
        print(f"Enunciado: {a['enunciado'][:300]}...")
        for alt in a["alternativas"]:
            print(f"  ({alt['chave']}) {alt['texto'][:100]}")


if __name__ == "__main__":
    main()
