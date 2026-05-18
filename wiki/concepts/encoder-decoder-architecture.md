---
title: Encoder-Decoder Architecture
type: concept
tags: [sequence-modeling, architecture]
created: 2026-05-15
updated: 2026-05-15
---

# Encoder-Decoder Architecture

Standard scheme for [[sequence-transduction]] introduced in the early seq2seq models (Cho 2014, Sutskever 2014, Bahdanau 2014) and adopted by the [[transformer]] as well.

- **Encoder**: maps the symbolic input sequence `(x_1, …, x_n)` into a sequence of continuous representations `z = (z_1, …, z_n)`.
- **Decoder**: given `z`, generates the output sequence `(y_1, …, y_m)` one element at a time. Auto-regressive: each step consumes the previously generated symbols [source: raw/papers/vaswani-2017-attention.pdf §3].

In the [[transformer]], each of the two parts is a stack of 6 layers; the decoder has an additional encoder-decoder attention sub-layer that lets every output position attend to all input positions.

## Sources

- [[vaswani-2017-attention]]
