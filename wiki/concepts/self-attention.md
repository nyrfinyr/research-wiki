---
title: Self-Attention
type: concept
tags: [attention, sequence-modeling]
created: 2026-05-15
updated: 2026-05-15
---

# Self-Attention

Also called **intra-attention**. Attention mechanism in which queries, keys, and values all come from the same sequence: it relates each position of the sequence to every other one to compute a contextual representation [source: raw/papers/vaswani-2017-attention.pdf §2].

Before the [[transformer]] it had already been used for reading comprehension, abstractive summarization, textual entailment, and sentence embedding (§2 in [[vaswani-2017-attention]]). The contribution of [[vaswani-2017-attention]] is being the **first sequence transduction architecture entirely based on self-attention**, with no RNN or convolutions.

## Why self-attention vs. RNN/CNN

Three desiderata are evaluated in §4 of [[vaswani-2017-attention]]:

1. **Computational complexity per layer** — self-attention: O(n²·d); RNN: O(n·d²); CNN: O(k·n·d²).
2. **Sequential operations** — self-attention: O(1); RNN: O(n); CNN: O(1).
3. **Maximum path length** between two positions — self-attention: O(1); RNN: O(n); dilated CNN: O(log_k n).

Self-attention is faster than an RNN when `n < d`, a condition typical for sub-word representations (BPE/word-piece).

## Restricted self-attention

To reduce the O(n²) cost, attention can be restricted to a neighborhood of size `r` around the output position, bringing the path length to O(n/r). Cited as future work in [[vaswani-2017-attention]] §4.

## Realization in the Transformer

Three distinct uses in [[transformer]]:

- Self-attention in the encoder: Q, K, V from the output of the previous layer.
- **Masked** self-attention in the decoder: same thing but with a triangular mask that prevents attending to future positions.
- Encoder-decoder attention (not self-attention): Q from the decoder, K/V from the encoder.

Implemented via [[scaled-dot-product-attention]] projected into [[multi-head-attention]].

## Sources

- [[vaswani-2017-attention]]
