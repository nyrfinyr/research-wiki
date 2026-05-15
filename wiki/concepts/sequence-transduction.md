---
title: Sequence Transduction
type: concept
tags: [sequence-modeling, nlp]
created: 2026-05-15
updated: 2026-05-15
---

# Sequence Transduction

Classe di problemi in cui un modello mappa una sequenza di input in una sequenza di output. Esempi prototipici: traduzione automatica, summarization, speech-to-text, constituency parsing.

Storicamente affrontata con RNN/LSTM/GRU ([[encoder-decoder-architecture]] con attention, vedi Bahdanau 2014) o con CNN (ConvS2S, ByteNet). [[vaswani-2017-attention]] propone il [[transformer]], primo modello di sequence transduction **interamente basato su attention**, senza ricorrenza né convoluzione [source: raw/papers/vaswani-2017-attention.pdf §1].

## Sources

- [[vaswani-2017-attention]]
