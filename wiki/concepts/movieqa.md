---
title: MovieQA
type: concept
tags: [benchmark, video-qa, long-form, movie]
created: 2026-05-15
updated: 2026-05-15
---

# MovieQA

**MovieQA** è un benchmark di video question-answering basato su scene di film, citato nel wiki principalmente come **esempio di benchmark con bias linguistico**: molte domande possono essere risolte usando solo il testo (subtitle/plot) senza guardare il video, motivo per cui i benchmark più recenti come [[video-mme]] e [[lvbench]] introducono filtri blind-LLM per scartare queste QA. Citato anche in [[mangalam-2023-egoschema]] e [[zhang-2024-llovi]] in questa luce.

## Sources

- [[mangalam-2023-egoschema]] — citato come dataset open-ended con bias text-only.
- [[zhang-2024-llovi]] — citato come "benchmark con bias linguistico".
- [[wang-2025-lvbench]] — confronto in Tab. 1.

## Concetti correlati

- [[video-question-answering]] — task.
- [[long-video-understanding]] — task.
- [[lvbench]] — benchmark che risponde al problema con dual-LLM blind filter.
- [[video-mme]] — benchmark che introduce text-only Gemini blind filter.
