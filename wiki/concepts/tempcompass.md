---
title: TempCompass
type: concept
tags: [benchmark, video, temporal-reasoning]
created: 2026-05-15
updated: 2026-05-15
---

# TempCompass

**TempCompass** è un benchmark di temporal reasoning per MLLM video, focalizzato sulla capacità di ragionare su ordine, durata, direzione e altre dimensioni temporali. È un complemento ai benchmark "temporal" di [[mvbench]] (Action Sequence, Moving Direction, ecc.) e tipicamente compare nei tech report MLLM accanto a [[video-mme]], [[mlvu]], [[longvideobench]].

## Numeri di riferimento

| Modello | TempCompass Avg | Fonte |
|---|---|---|
| Qwen2.5-VL-3B | 64.4 | [[qwen2-5-vl-2025-tech-report]] |
| Qwen2.5-VL-7B | 71.7 | [[qwen2-5-vl-2025-tech-report]] |
| Qwen2.5-VL-72B | 74.8 | [[qwen2-5-vl-2025-tech-report]] |
| Gemini 1.5 Pro | 67.1 | [[qwen2-5-vl-2025-tech-report]] |
| GPT-4o | 73.8 | [[qwen2-5-vl-2025-tech-report]] |
| VideoLLaMA 3-2B | 63.4 | [[zhang-2025-videollama-3]] |
| VideoLLaMA 3-7B | — | [[zhang-2025-videollama-3]] |
| Apollo-2B | 60.8 | [[zhang-2025-videollama-3]] |

## Sources

- [[qwen2-5-vl-2025-tech-report]] — valuta Qwen2.5-VL.
- [[zhang-2025-videollama-3]] — valuta VideoLLaMA 3.
- [[fu-2025-video-mme]] — confronto in Tab. 1.

## Concetti correlati

- [[video-question-answering]] — task.
- [[temporal-understanding]] — competenza misurata.
- [[mvbench]] — benchmark adiacente con focus temporal.
