---
title: Needle-in-a-Haystack
type: concept
tags: [paradigm, long-context, evaluation, probe]
created: 2026-05-15
updated: 2026-05-15
---

# Needle-in-a-Haystack

**Needle-in-a-Haystack (NIAH)** è un paradigma di valutazione long-context: si inserisce un'informazione specifica (la "needle") in un input lungo (il "haystack") e si misura se il modello la trova/usa correttamente. Nato per gli LLM testuali (RULER, "Lost in the Middle"), è stato esteso ai [[video-llm|video-LLM]] tramite benchmark come [[vnbench]] e i task di [[lvbench]] tipo Key Information Retrieval.

Nel wiki appare in due contesti:

- **[[doorenbos-2026-video-panels]]**: la categoria di task in cui il paneling brilla — la rappresentazione paneled aumenta la "density" temporale e facilita la localizzazione della needle.
- **[[arnab-2025-temporal-chain-of-thought]]**: cita "lost-in-the-middle" (Liu et al. 2024) e RULER come fenomeni motivanti per la necessità di selezionare frame rilevanti invece di affidarsi al long-context bruto.

## Sources

- [[doorenbos-2026-video-panels]] — categoria di task.
- [[arnab-2025-temporal-chain-of-thought]] — fenomeno motivante (lost-in-the-middle).

## Concetti correlati

- [[vnbench]] — benchmark video di tipo NIAH.
- [[long-context]] — paradigma più ampio.
- [[long-video-understanding]] — task target.
- [[lvbench]] — benchmark con skill Key Information Retrieval.
- [[keyframe-sampling]] — strategia rilevante.
