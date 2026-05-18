---
title: OpenEQA
type: concept
tags: [benchmark, video-qa, embodied-qa, open-ended]
created: 2026-05-15
updated: 2026-05-15
---

# OpenEQA

**OpenEQA** è un benchmark di **embodied question answering**: un agente percorre un ambiente reale (registrato come video first-person), e deve rispondere a domande open-ended sulla scena percepita (oggetti, attributi, spaziale, memoria). Misura la capacità di un MLLM di ragionare su video egocentrico in setting embodied.

Nel wiki appare come uno dei 4 benchmark valutati da [[arnab-2025-temporal-chain-of-thought]] (TCoT): TCoT (Gemini Flash) = 69.2 vs baseline 68.0 (+1.2). Marginale rispetto al guadagno su LVBench (+11.4) — segno che il task embodied OpenEQA è già ben gestito dalla baseline Gemini.

## Sources

- [[arnab-2025-temporal-chain-of-thought]] — uno dei 4 benchmark di valutazione.

## Concetti correlati

- [[video-question-answering]] — task imparentato.
- [[ego4d]] — dataset di video egocentrici simili.
- [[video-llm]] — modelli valutati.
- [[long-video-understanding]] — task adiacente.
