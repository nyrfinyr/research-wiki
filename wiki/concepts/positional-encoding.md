---
title: Positional Encoding
type: concept
tags: [transformer, attention, sequence-modeling]
created: 2026-05-15
updated: 2026-05-15
---

# Positional Encoding

Technique for injecting position information into models that, like the [[transformer]], have no recurrent or convolutional structure and would therefore be permutation-invariant with respect to token order. In [[vaswani-2017-attention]] §3.5 a position encoding is added to the input embeddings at the bottom of the encoder and decoder stacks; it has the same `d_model` dimension as the embeddings.

## Sinusoidal version (Vaswani 2017)

```
PE(pos, 2i)   = sin( pos / 10000^(2i/d_model) )
PE(pos, 2i+1) = cos( pos / 10000^(2i/d_model) )
```

Each dimension of the encoding corresponds to a sinusoid; the wavelengths form a geometric progression from `2π` to `10000·2π` [source: raw/papers/vaswani-2017-attention.pdf §3.5].

### Motivation

For each fixed offset `k`, `PE(pos+k)` is a linear function of `PE(pos)` — this should let the model easily learn to attend by relative positions. Moreover, the parameter-free nature leaves hope for **extrapolation to sequences longer** than those seen in training [source: raw/papers/vaswani-2017-attention.pdf §3.5].

## Alternatives

- **Learned positional embeddings**: a `[max_len × d_model]` embedding matrix that is learned. In [[vaswani-2017-attention]] (Tab. 3 row E) it is experimentally **equivalent** to the sinusoidal version (BLEU 25.7 vs. 25.8, PPL 4.92 for both). The authors prefer sinusoidal for the potential extrapolation beyond the training range.

## Sources

- [[vaswani-2017-attention]]
