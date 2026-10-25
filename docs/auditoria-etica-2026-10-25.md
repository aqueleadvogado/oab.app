# Auditoria — Módulo Ética (9 blocos em revisão)

**Data:** 2026-10-25
**Material analisado:** 9 blocos de Ética produzidos por LLM, submetidos como `em_revisao`
**Resultado:** NENHUM aprovado. Todos reprovados por falha crítica.
**Revisor:** Evandro + revisor jurídico externo

> Critério: **CRÍTICA** = ensina regra errada ou gabarito errado (aluno erra na prova por causa do material) · **MODERADA** = citação errada, lacuna de tema que a FGV cobra, afirmação imprecisa · **LEVE** = redação/apresentação.

## Problema estrutural (afeta 4 blocos)

Parte do conteúdo foi montada com a **numeração do CED antigo (1995)** — art. 19 (ex-cliente), arts. 25-27 (sigilo), art. 38 (quota litis). No **CED/2015** esses temas estão em outros artigos e, no caso do **quota litis**, a regra mudou de sentido.

**Varredura obrigatória** antes de qualquer novo bloco: toda citação "CED art. X" precisa ser conferida contra o texto do CED/2015 (Resolução CFOAB 02/2015).

## Lições para o processo de produção

1. Agent precisa receber **texto literal** da lei antes de escrever, não só a referência.
2. Instrução explícita: **CED é de 2015, não 1995**. Checklist "qual é a numeração atual do art. X?".
3. **Validação cruzada**: segundo agent revisa antes de salvar.
4. **Checagem automática** (regex) de citações.
5. Acentuação completa — alguns blocos saíram sem acento, inaceitável em produto pago.
6. Nunca inventar jurisprudência ou prazo que não esteja na lei.

## Correções por bloco

Ver auditoria completa em commits do histórico (mensagem contém "Auditoria Ética 2026-10-25"). Resumo:

- **B1 Inscrição**: Q2 troca Beatriz "Deputada Federal" (impedida, não incompatível) por "Prefeita"; corrigir lista de cancelamento; CDTINCA — macete não segue ordem; estagiário sem convênio obrigatório.
- **B2 Prerrogativas**: calúnia nunca esteve no §2º do art. 7º (só injúria + difamação; a ADI 1.127 retirou desacato); corrigir incisos de exame de autos (XIII) e flagrante (§3º); regra de delegacias (art. 7º VI "c").
- **B3 Deveres**: sigilo é de ordem pública, autorização do cliente NÃO libera; renumerar arts. de ex-cliente (21), conflito (20), declinar patrocínio (22) para CED/2015; honorários "preferencialmente" por escrito; aceitar causa de colega (art. 14 CED/2015); abandono EAOAB art. 34 XI.
- **B4 Incompatibilidades**: professor de Direito de universidade federal PODE advogar contra União (art. 30 p.ú.); Q1 tem duas respostas certas, refazer; faltam incisos III e IV do art. 28; **remover nota de rascunho esquecida no texto**; corrigir consequências (art. 4º p.ú. nulidade; art. 34 I; art. 47 LCP contravenção).
- **B5 Honorários**: quota litis não exige mínimo — Q1 com gabarito B errado, correto é **A**; "vedada compensação com crédito do cliente" é regra inventada (compensação é a de sucumbência parcial, CPC 85 §14); substabelecimento com reserva (art. 26 EAOAB); prescrição 5 marcos (art. 25).
- **B6 Sociedade**: sociedade responde **diretamente**, sócios **subsidiariamente** (Q2 com alternativa B errada); nome de sócio falecido depende só do ato constitutivo (art. 16 §1º); apagar sigla "SUAIU".
- **B7 Infrações**: Q1 — não prestar contas = **suspensão** (art. 37 I + §2º), não censura; suspensão por anuidade declarada inconstitucional pelo STF (Tema 732); exemplo Camila com inciso e atenuante trocados; prescrição conta da **constatação oficial** (não da infração).
- **B8 Processo disciplinar**: sigilo invertido — regra é sigilo até o fim (art. 72 §2º), não publicidade; defensor dativo pelo Presidente do Conselho/Subseção (art. 73 §4º); competência do Seccional da infração (art. 70); recorrer no CFOAB (art. 75 sem incisos); efeito suspensivo (art. 77); mesma correção da prescrição.
- **B9 Publicidade e sigilo**: sigilo inteiro citado por CED/1995 — renumerar para arts. 35-38 do CED/2015; exceções do art. 37 são **exemplificativas**; Mapa e Pegadinha se contradizem sobre divulgação de honorários (checar Provimento 205/2021).

## Pontos a verificar antes de republicar

- Provimento CFOAB 144/2011 (dispensa de exame — texto exato)
- Lei 14.365/2022 (sustentação oral — §2º-B)
- STF Tema 732 (redação final da tese)
- Lei 14.612/2023 (assédio/discriminação — inciso XXX, em qual faixa de pena)
- Provimento CFOAB 205/2021 (publicidade — dispositivos exatos)
