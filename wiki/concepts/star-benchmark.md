---
title: STAR Benchmark
type: concept
tags: [benchmark, video, situated-reasoning]
created: 2026-05-15
updated: 2026-05-15
---

# STAR Benchmark

**STAR (Situated Reasoning in Real-World Videos)** è un benchmark di video reasoning che richiede di ragionare su scene reali con grounding spaziale e temporale (interaction, sequence, prediction, feasibility). Nel wiki appare come **sorgente** dei task Action Sequence, Action Prediction, Object Interaction di [[mvbench]] [source: raw/papers/li-2024-mvbench.pdf §3.2]; gli autori di MVBench fanno *shift randomico di start/end* per aumentare la difficoltà.

## Numeri di riferimento

| Modello | STAR (zero-shot avg) | Fonte |
|---|---|---|
| VideoChat2 | 59.0 | [[li-2024-mvbench]] |
| VideoChat2 + Mistral | 63.8 | [[li-2024-mvbench]] |

## Sources

- [[li-2024-mvbench]] — sorgente di 3 task MVBench.

## Concetti correlati

- [[video-question-answering]] — task.
- [[mvbench]] — benchmark derivato.
- [[next-qa]], [[clevrer]] — benchmark adiacenti.
