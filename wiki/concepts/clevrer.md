---
title: CLEVRER
type: concept
tags: [benchmark, video, synthetic, causal-reasoning]
created: 2026-05-15
updated: 2026-05-15
---

# CLEVRER

**CLEVRER** (Collision Events for Video Representation and Reasoning) è un benchmark **sintetico** di video reasoning generato in ambiente fisico simulato (oggetti che si urtano). Quattro famiglie di domande: descriptive, explanatory, predictive, counterfactual. È uno dei pochi benchmark video con ground-truth fisica e ha [[certificate-length]] dell'ordine di 1–2 s.

Nel wiki appare in due ruoli: (1) **sorgente** per [[mvbench]] dei task Moving Attribute, Counterfactual Inference, Moving Count, Moving Direction, Object Existence (con scarto domande con > 10 condizioni descrittive) [source: raw/papers/li-2024-mvbench.pdf §3.2]; (2) **dato di instruction-tuning** per VideoChat2 in Stage 3 Reasoning. Gli autori riconoscono che questo crea un *minimal source gap* tra training e benchmark (Tab. 13: rimuovere CLEVRER fa scendere accuracy di 1.8 punti).

## Sources

- [[li-2024-mvbench]] — sorgente di 4 task MVBench + dato di instruction tuning VideoChat2.
- [[mangalam-2023-egoschema]] — confronto certificate length (~1 s).

## Concetti correlati

- [[video-question-answering]] — task.
- [[mvbench]] — benchmark che lo usa come sorgente.
- [[counterfactual-inference]] — sotto-task.
