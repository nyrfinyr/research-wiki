---
title: BLEU
type: concept
tags: [metric, machine-translation, evaluation]
created: 2026-05-15
updated: 2026-05-15
---

# BLEU (Bilingual Evaluation Understudy)

Metrica n-gram-overlap-based per la valutazione automatica della traduzione automatica (Papineni et al. 2002). Compara n-gram della traduzione candidata con quelli di una o più traduzioni di riferimento, applicando una brevity penalty per scoraggiare output troppo corti. Più alto è meglio (range 0–100 in scala percentuale).

## Risultati Transformer (Vaswani 2017)

Su WMT 2014 newstest2014:
- Transformer base: 27.3 EN-DE / 38.1 EN-FR.
- Transformer big: **28.4 EN-DE / 41.8 EN-FR** — SOTA al momento della pubblicazione [source: raw/papers/vaswani-2017-attention.pdf §6.1, Tab. 2].

Inference: beam search con beam=4 e length penalty α=0.6; output massimo `input_len + 50` (§6.1).

## Sources

- [[vaswani-2017-attention]]
