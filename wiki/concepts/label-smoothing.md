---
title: Label Smoothing
type: concept
tags: [regularization, deep-learning]
created: 2026-05-15
updated: 2026-05-15
---

# Label Smoothing

Regularization technique introduced by Szegedy et al. (2016, Inception v3) that replaces the one-hot target with a "smoothed" distribution, giving probability mass `ε_ls` distributed over the non-target classes.

In [[vaswani-2017-attention]] §5.4 it is used with `ε_ls = 0.1`. Effect: **worsens perplexity** (the model learns to be more uncertain) but **improves accuracy and BLEU** [source: raw/papers/vaswani-2017-attention.pdf §5.4].

## Sources

- [[vaswani-2017-attention]]
