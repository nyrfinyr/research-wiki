---
title: Penn Treebank (WSJ)
type: concept
tags: [dataset, benchmark, parsing, nlp]
created: 2026-05-15
updated: 2026-05-15
---

# Penn Treebank (WSJ)

Syntactically annotated corpus on the Wall Street Journal — historical benchmark for English constituency parsing.

In [[vaswani-2017-attention]] §6.3 the [[transformer]] is applied to constituency parsing:
- WSJ-only setup: ~40k training sentences, vocabulary 16k → **91.3 F1** on Section 23.
- Semi-supervised setup: adds BerkeleyParser high-confidence corpora (~17M sentences), vocabulary 32k → **92.7 F1**.

Transformer used: 4 layers, `d_model = 1024`. Inference with beam=21 and α=0.3, maximum output `input_len + 300` [source: raw/papers/vaswani-2017-attention.pdf §6.3].

## Sources

- [[vaswani-2017-attention]]
