---
title: Sequence Transduction
type: concept
tags: [sequence-modeling, nlp]
created: 2026-05-15
updated: 2026-05-15
---

# Sequence Transduction

Class of problems in which a model maps an input sequence to an output sequence. Prototypical examples: machine translation, summarization, speech-to-text, constituency parsing.

Historically addressed with RNN/LSTM/GRU ([[encoder-decoder-architecture]] with attention, see Bahdanau 2014) or with CNN (ConvS2S, ByteNet). [[vaswani-2017-attention]] proposes the [[transformer]], the first sequence transduction model **entirely based on attention**, with no recurrence or convolution [source: raw/papers/vaswani-2017-attention.pdf §1].

## Sources

- [[vaswani-2017-attention]]
