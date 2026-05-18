---
title: MLVU
type: concept
tags: [benchmark, video-qa, mllm, long-video, multi-task]
created: 2026-05-15
updated: 2026-05-15
---

# MLVU

MLVU (Multi-task Long Video Understanding) è un benchmark di video-QA long-form multi-task, ampiamente usato come complemento di [[video-mme]] e [[longvideobench]] nelle valutazioni dei moderni MLLM video. Misura comprensione su durate medio-lunghe con un mix di task (holistic, perception, ordering, summarization) e una metrica aggregata "M-Avg".

## Composizione / Protocollo

- Long-form video QA multi-task; durate tipicamente nell'intervallo decine-di-minuti.
- Metrica principale **M-Avg** (multiple-choice average).

## Numeri di riferimento

Risultati selezionati dai source pages del wiki:

| Modello | MLVU M-Avg | Fonte |
|---|---|---|
| Qwen2.5-VL-3B | 68.2 | [[qwen2-5-vl-2025-tech-report]] |
| Qwen2.5-VL-7B | 70.2 | [[qwen2-5-vl-2025-tech-report]] |
| Qwen2.5-VL-72B | 74.6 | [[qwen2-5-vl-2025-tech-report]] (+10 vs GPT-4o) |
| GPT-4o | 64.6 | [[qwen2-5-vl-2025-tech-report]] |
| VideoLLaMA 3-2B (dev) | 65.4 | [[zhang-2025-videollama-3]] |
| VideoLLaMA 3-7B (dev) | 73.0 | [[zhang-2025-videollama-3]] |
| Apollo-7B | 70.9 | [[zhang-2025-videollama-3]] |
| InternVL2.5-8B | 69.0 | [[zhang-2025-videollama-3]] |
| Qwen3-VL-235B-A22B thinking | 83.8 | [[qwen3-vl-2025-tech-report]] |
| Qwen3-VL-235B-A22B inst | 84.3 | [[qwen3-vl-2025-tech-report]] |
| Gemini 2.5 Pro (thinking) | 85.6 | [[qwen3-vl-2025-tech-report]] |
| GPT-5 high | 86.2 | [[qwen3-vl-2025-tech-report]] |

## Sources

- [[qwen2-5-vl-2025-tech-report]] — valuta Qwen2.5-VL.
- [[qwen3-vl-2025-tech-report]] — valuta Qwen3-VL; Qwen3-VL-235B "attains or even surpasses Gemini-2.5-Pro" su MLVU [§5.9].
- [[zhang-2025-videollama-3]] — valuta VideoLLaMA 3.
- [[doorenbos-2026-video-panels]] — usa MLVU come uno dei 5 benchmark di valutazione (con perdita lieve sul task ordering, −1.2 %).
- [[kim-2026-sink-token-aware-pruning]] — valuta SToP su MLVU.

## Concetti correlati

- [[long-video-understanding]] — task.
- [[video-mme]] — benchmark complementare.
- [[longvideobench]] — benchmark complementare.
- [[lvbench]] — benchmark long-video extreme.
- [[video-llm]] — modelli valutati.
