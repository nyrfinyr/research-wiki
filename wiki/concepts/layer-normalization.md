---
title: Layer Normalization
type: concept
tags: [normalization, deep-learning]
created: 2026-05-15
updated: 2026-05-15
---

# Layer Normalization

Normalization technique introduced by Ba, Kiros & Hinton (2016) [arXiv:1607.06450] that normalizes activations along the feature dimension (not along the batch as in BatchNorm), making it independent of batch size and suitable for recurrent/sequential models.

In [[transformer]] it is used in every sub-layer as `LayerNorm(x + Sublayer(x))` — thus **post-norm** in the original paper ([[vaswani-2017-attention]] §3.1).

> Historical note: in later work (e.g. GPT-2, training of deep Transformers) the **pre-norm** scheme `x + Sublayer(LayerNorm(x))` became widespread because it stabilizes training without a very long warmup. This is not in the original paper.

## Sources

- [[vaswani-2017-attention]]
