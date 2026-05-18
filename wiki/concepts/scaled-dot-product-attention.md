---
title: Scaled Dot-Product Attention
type: concept
tags: [attention, deep-learning]
created: 2026-05-15
updated: 2026-05-15
---

# Scaled Dot-Product Attention

Attention function introduced in [[vaswani-2017-attention]] §3.2.1:

```
Attention(Q, K, V) = softmax( Q Kᵀ / √d_k ) V
```

Given query matrices `Q`, key `K` (both of dimension `d_k`) and value `V` (dimension `d_v`), the dot products Q·Kᵀ are computed, divided by `√d_k`, the softmax is applied, and V is weighted by the resulting weights.

## Why the 1/√d_k scaling

> "We suspect that for large values of d_k, the dot products grow large in magnitude, pushing the softmax function into regions where it has extremely small gradients. To counteract this effect, we scale the dot products by 1/√d_k." [source: raw/papers/vaswani-2017-attention.pdf §3.2.1]

Intuitive argument (footnote 4): if the components of `q` and `k` are i.i.d. with mean 0 and variance 1, their dot product has mean 0 and variance `d_k`. The scaling normalizes the variance to 1, keeping softmax in regimes with non-degenerate gradients.

## Comparison with other attention

- **Additive attention** (Bahdanau et al.): computes compatibility with a single-layer feed-forward.
- **Dot-product attention** (without scaling): identical to Scaled Dot-Product but without the `1/√d_k` factor. Faster but worse for large `d_k`.
- For small `d_k`, additive and unscaled dot-product are comparable; for large `d_k`, additive beats unscaled dot-product [source: raw/papers/vaswani-2017-attention.pdf §3.2.1].

## Use

It is the primitive block inside the [[transformer]]'s [[multi-head-attention]]. In the decoder, self-attention applies an additive mask (−∞ on illegal logits) before the softmax to preserve autoregressivity.

## Sources

- [[vaswani-2017-attention]]
