---
title: ActivityNet-QA
type: concept
tags: [benchmark, video-qa, activity-recognition]
created: 2026-05-15
updated: 2026-05-15
---

# ActivityNet-QA

**ActivityNet-QA** è un benchmark di Video-QA basato sui video di ActivityNet, con focus su domande relative ad azioni e attività. Citato come benchmark di confronto in molti tech report di MLLM video, ha [[certificate-length]] mediana ~1–3 s [source: raw/papers/mangalam-2023-egoschema.pdf Fig. 3] — classificato come short-form. [[zhang-2024-llovi]] lo cita come benchmark che "richiede solo short clip".

## Numeri di riferimento

Risultati selezionati zero-shot:

| Modello | ActivityNet-QA | Fonte |
|---|---|---|
| VideoChatGPT | 35.2 | [[li-2024-mvbench]] |
| VideoChat2 | 49.1 | [[li-2024-mvbench]] |
| VideoLLaMA 3-2B | 58.2 | [[zhang-2025-videollama-3]] |
| VideoLLaMA 3-7B | 61.3 | [[zhang-2025-videollama-3]] |
| Qwen2-VL-7B | 57.4 | [[zhang-2025-videollama-3]] |
| InternVL2.5-8B | 58.9 | [[zhang-2025-videollama-3]] |
| NVILA-8B | 60.9 | [[zhang-2025-videollama-3]] |

## Sources

- [[mangalam-2023-egoschema]] — confronto certificate length.
- [[zhang-2024-llovi]] — citato come benchmark short-clip.
- [[li-2024-mvbench]] — valuta VideoChat2 zero-shot.
- [[zhang-2025-videollama-3]] — valuta VideoLLaMA 3.

## Concetti correlati

- [[video-question-answering]] — task.
- [[next-qa]], [[mvbench]] — benchmark adiacenti.
- [[certificate-length]] — metrica di confronto.
