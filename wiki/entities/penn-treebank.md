---
title: Penn Treebank (WSJ)
type: entity
tags: [dataset, benchmark, parsing, nlp]
created: 2026-05-15
updated: 2026-05-15
---

# Penn Treebank (WSJ)

Corpus annotato sintatticamente sul Wall Street Journal — benchmark storico per parsing di constituency in inglese.

In [[vaswani-2017-attention]] §6.3 il [[transformer]] è applicato al constituency parsing:
- Setup WSJ-only: ~40k frasi di training, vocabolario 16k → **91.3 F1** su Section 23.
- Setup semi-supervisionato: aggiunti BerkeleyParser high-confidence corpora (~17M frasi), vocabolario 32k → **92.7 F1**.

Transformer usato: 4 layer, `d_model = 1024`. Inference con beam=21 e α=0.3, output massimo `input_len + 300` [source: raw/papers/vaswani-2017-attention.pdf §6.3].

## Sources

- [[vaswani-2017-attention]]
