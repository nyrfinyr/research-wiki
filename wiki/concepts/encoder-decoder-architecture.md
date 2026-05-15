---
title: Encoder-Decoder Architecture
type: concept
tags: [sequence-modeling, architecture]
created: 2026-05-15
updated: 2026-05-15
---

# Encoder-Decoder Architecture

Schema standard per [[sequence-transduction]] introdotto nei primi seq2seq (Cho 2014, Sutskever 2014, Bahdanau 2014) e adottato anche dal [[transformer]].

- **Encoder**: mappa la sequenza simbolica in input `(x_1, …, x_n)` in una sequenza di rappresentazioni continue `z = (z_1, …, z_n)`.
- **Decoder**: dato `z`, genera la sequenza di output `(y_1, …, y_m)` un elemento alla volta. Auto-regressivo: ogni step consuma i simboli generati in precedenza [source: raw/papers/vaswani-2017-attention.pdf §3].

In [[transformer]] ognuna delle due parti è uno stack di 6 layer; il decoder ha un sub-layer addizionale di encoder-decoder attention che permette a ogni posizione di output di attendere a tutte le posizioni di input.

## Sources

- [[vaswani-2017-attention]]
