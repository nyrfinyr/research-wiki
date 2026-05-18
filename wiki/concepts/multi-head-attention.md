---
title: Multi-Head Attention
type: concept
tags: [attention, deep-learning]
created: 2026-05-15
updated: 2026-05-15
---

# Multi-Head Attention

Generalization of [[scaled-dot-product-attention]] in which Q, K, V are linearly projected `h` times with distinct learned matrices, attention is applied in parallel to each projection, and the outputs are concatenated and projected again (§3.2.2 of [[vaswani-2017-attention]]):

```
MultiHead(Q, K, V) = Concat(head_1, …, head_h) · W^O
head_i = Attention(Q W_i^Q, K W_i^K, V W_i^V)
```

with `W_i^Q ∈ R^{d_model × d_k}`, `W_i^K ∈ R^{d_model × d_k}`, `W_i^V ∈ R^{d_model × d_v}`, `W^O ∈ R^{h·d_v × d_model}`.

## Hyperparameters

In the base [[transformer]]: `h = 8`, `d_k = d_v = d_model / h = 64`. The reduced per-head dimension makes the total cost ~equal to a single full-dimensional attention [source: raw/papers/vaswani-2017-attention.pdf §3.2.2].

## Motivation

> "Multi-head attention allows the model to jointly attend to information from different representation subspaces at different positions. With a single attention head, averaging inhibits this." [source: raw/papers/vaswani-2017-attention.pdf §3.2.2]

Different heads can specialize on different syntactic/semantic patterns (§4 of [[vaswani-2017-attention]] qualitatively suggests this interpretability).

## Empirical evidence (Tab. 3 row A)

Varying `h` while keeping compute constant:
- `h=1`: 24.9 BLEU dev (0.9 below baseline).
- `h=4`: 25.5.
- `h=8`: 25.8 (baseline).
- `h=16`: 25.8.
- `h=32`: 25.4 (degrades with too many heads).

⇒ Quality degrades both with too few and too many heads [source: raw/papers/vaswani-2017-attention.pdf Tab. 3 (A)].

## Use in the Transformer

- Encoder self-attention (Q=K=V from the previous layer's output).
- Masked decoder self-attention (auto-regressive).
- Encoder-decoder attention (Q from decoder, K/V from encoder output).

## Sources

- [[vaswani-2017-attention]]
