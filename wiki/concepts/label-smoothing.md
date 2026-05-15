---
title: Label Smoothing
type: concept
tags: [regularization, deep-learning]
created: 2026-05-15
updated: 2026-05-15
---

# Label Smoothing

Tecnica di regolarizzazione introdotta da Szegedy et al. (2016, Inception v3) che sostituisce il target one-hot con una distribuzione "smussata", dando massa di probabilità `ε_ls` distribuita sulle classi non-target.

In [[vaswani-2017-attention]] §5.4 è usato con `ε_ls = 0.1`. Effetto: **peggiora la perplexity** (il modello impara a essere più incerto) ma **migliora accuracy e BLEU** [source: raw/papers/vaswani-2017-attention.pdf §5.4].

## Sources

- [[vaswani-2017-attention]]
