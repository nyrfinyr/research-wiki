---
title: CountBench
type: concept
tags: [benchmark, image, counting, vision-language]
created: 2026-05-15
updated: 2026-05-15
---

# CountBench

**CountBench** è un benchmark di counting per VLM: contare quanti oggetti di una classe data sono presenti in un'immagine. È un test ricorrente per modelli che fanno grounding open-vocabulary; il *counting* è notoriamente un *joint bottleneck* per i video-LLM (vedi MVBench "Action Count / Moving Count" e Video-MME counting analysis).

## Numeri di riferimento

| Modello | CountBench | Fonte |
|---|---|---|
| Gemini 1.5 Pro | 85.5 | [[qwen2-5-vl-2025-tech-report]] |
| Molmo 72B | 91.2 | [[qwen2-5-vl-2025-tech-report]] |
| InternVL2.5-78B | 72.1 | [[qwen2-5-vl-2025-tech-report]] |
| Qwen2.5-VL-72B | **93.6** | [[qwen2-5-vl-2025-tech-report]] |
| Qwen3-VL-235B-A22B thinking | 93.7 | [[qwen3-vl-2025-tech-report]] |
| Qwen3-VL-235B-A22B inst | 93.0 | [[qwen3-vl-2025-tech-report]] |
| GPT-5 high | 91.7 | [[qwen3-vl-2025-tech-report]] |
| Claude Opus 4.1 | 93.1 | [[qwen3-vl-2025-tech-report]] |

## Sources

- [[qwen2-5-vl-2025-tech-report]] — valuta Qwen2.5-VL.
- [[qwen3-vl-2025-tech-report]] — valuta Qwen3-VL.

## Concetti correlati

- [[vision-language-model]] — modelli valutati.
- [[grounding]] — task imparentato.
- [[mvbench]] — benchmark con sub-task di counting (Action Count, Moving Count).
