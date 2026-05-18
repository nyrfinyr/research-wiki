---
title: Transformer
type: concept
tags: [architecture, attention, deep-learning, sequence-modeling]
created: 2026-05-15
updated: 2026-05-15
---

# Transformer

Encoder-decoder architecture for sequence transduction introduced in [[vaswani-2017-attention]]. It entirely replaces recurrence and convolution with [[self-attention]] and position-wise feed-forward layers, obtaining O(1) path length between arbitrary positions and massively parallel training.

## Composition

- **Encoder**: stack of N=6 identical layers. Each layer has two sub-layers — multi-head self-attention + position-wise FFN — both wrapped by residual connection and [[layer-normalization]] `LayerNorm(x + Sublayer(x))` [source: raw/papers/vaswani-2017-attention.pdf §3.1].
- **Decoder**: stack of N=6 layers; each layer adds a third **encoder-decoder attention** sub-layer. The decoder's self-attention is **masked** (positions `> i` are set to −∞ before softmax) to preserve auto-regressiveness [source: raw/papers/vaswani-2017-attention.pdf §3.1].
- All sub-layers and embeddings produce vectors of dimension `d_model = 512`.
- Input/output embeddings and the pre-softmax projection **share** the weight matrix; in embedding layers the weights are multiplied by `√d_model` [source: raw/papers/vaswani-2017-attention.pdf §3.4].

## Base model hyperparameters

| Hyperparameter | Value |
|---|---|
| N (encoder/decoder depth) | 6 |
| d_model | 512 |
| d_ff | 2048 |
| h (heads) | 8 |
| d_k = d_v | 64 |
| P_drop | 0.1 |
| ε_ls (label smoothing) | 0.1 |
| Parameters | ~65M |

"Big" model: `d_model=1024`, `d_ff=4096`, `h=16`, `P_drop=0.3`, 213M parameters [source: raw/papers/vaswani-2017-attention.pdf Tab. 3].

## Advantages over RNN/CNN

From Tab. 1 of [[vaswani-2017-attention]]:

- Path length **O(1)** vs. O(n) for an RNN ⇒ long-range dependencies easier to learn.
- Sequential operations **O(1)** vs. O(n) for an RNN ⇒ full parallelization along the sequence.
- Faster than an RNN when `n < d` (typical case for BPE/word-piece).

## Components

- [[self-attention]]
- [[scaled-dot-product-attention]]
- [[multi-head-attention]]
- [[positional-encoding]]
- [[layer-normalization]]
- [[encoder-decoder-architecture]]

## Open questions

- Self-attention's **O(n²·d)** cost ⇒ inefficient for very long sequences (the authors propose restricted self-attention as future work).
- Generation is still sequential (auto-regressive) — limits parallelization at inference.
- Extension to non-textual modalities (images, audio, video) is cited as future work.

## Sources

- [[vaswani-2017-attention]]
