---
title: TimeScope
type: concept
tags: [benchmark, video, long-video, evaluation]
created: 2026-05-15
updated: 2026-05-15
---

# TimeScope

**TimeScope** è un benchmark long-video con focus su durate molto estese: la sub-tranche "Long" ha durata media **27.600 s ≈ 7.7 h** [source: raw/papers/doorenbos-2026-video-panels.pdf §1]. Nel wiki è il benchmark che mostra il **biggest gain** di [[doorenbos-2026-video-panels|Video Panels]] su VideoLLaMA 3 7B: 39.1 → 46.7 (+7.6 / +19.4 % relativo).

## Numeri di riferimento (TimeScope Long)

Risultati da [[doorenbos-2026-video-panels]] §4:

| Modello | Default | + Panels | Δ |
|---|---|---|---|
| VideoLLaMA 3 7B (180 frame) | 39.1 | 46.7 | +7.6 |
| LLaVA-OV 7B (panels @ 23-25k tokens) | 58.7 | 69.5 | +10.8 |
| LLaVA-Video 7B (panels) | 64.8 | 79.2 | +14.4 |

LLaVA-Video 7B + panels (79.2) supera anche le baseline LLaVA-Video 72B.

## Sources

- [[doorenbos-2026-video-panels]] — usa TimeScope come benchmark principale e mostra i guadagni più grandi del paper.

## Concetti correlati

- [[long-video-understanding]] — task target.
- [[video-mme]], [[mlvu]], [[lvbench]] — benchmark long-video adiacenti.
- [[visual-prompting]] — paradigma di Video Panels.
- [[video-llm]] — modelli valutati.
