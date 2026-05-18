---
title: BLEU
type: concept
tags: [metric, machine-translation, evaluation]
created: 2026-05-15
updated: 2026-05-15
---

# BLEU (Bilingual Evaluation Understudy)

N-gram-overlap-based metric for the automatic evaluation of machine translation (Papineni et al. 2002). It compares n-grams of the candidate translation with those of one or more reference translations, applying a brevity penalty to discourage overly short outputs. Higher is better (range 0–100 on a percentage scale).

## Transformer results (Vaswani 2017)

On WMT 2014 newstest2014:
- Transformer base: 27.3 EN-DE / 38.1 EN-FR.
- Transformer big: **28.4 EN-DE / 41.8 EN-FR** — SOTA at publication time [source: raw/papers/vaswani-2017-attention.pdf §6.1, Tab. 2].

Inference: beam search with beam=4 and length penalty α=0.6; output capped at `input_len + 50` (§6.1).

## Sources

- [[vaswani-2017-attention]]
