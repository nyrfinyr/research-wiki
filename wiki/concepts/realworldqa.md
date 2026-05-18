---
title: RealWorldQA
type: concept
tags: [benchmark, image-vqa, vision-centric, real-world]
created: 2026-05-15
updated: 2026-05-15
---

# RealWorldQA

**RealWorldQA** è un benchmark vision-centric di image VQA progettato per testare la comprensione di scene reali da un punto di vista pragmatico (es. domande tipiche per assistenti AI in scenari fisici). Pubblicato da xAI, è uno dei test standard per VLM image-first.

## Numeri di riferimento

| Modello | RealWorldQA | Fonte |
|---|---|---|
| Claude 3.5 Sonnet | 60.1 | [[qwen2-5-vl-2025-tech-report]] |
| GPT-4o | 75.4 | [[qwen2-5-vl-2025-tech-report]] |
| InternVL2.5-78B | 78.7 | [[qwen2-5-vl-2025-tech-report]] |
| Qwen2-VL-72B | 77.8 | [[qwen2-5-vl-2025-tech-report]] |
| Qwen2.5-VL-7B | 68.5 | [[qwen2-5-vl-2025-tech-report]] |
| Qwen2.5-VL-72B | 75.7 | [[qwen2-5-vl-2025-tech-report]] |
| Qwen3-VL-235B-A22B thinking | **81.3** | [[qwen3-vl-2025-tech-report]] |
| VideoLLaMA 3-7B | 72.7 | [[zhang-2025-videollama-3]] |
| VideoLLaMA 3-2B | 67.3 | [[zhang-2025-videollama-3]] |

Usato anche come benchmark di valutazione vision-centric in [[morini-2026-look-twice]] (LoT).

## Sources

- [[qwen2-5-vl-2025-tech-report]] — valuta Qwen2.5-VL.
- [[qwen3-vl-2025-tech-report]] — valuta Qwen3-VL.
- [[zhang-2025-videollama-3]] — valuta VideoLLaMA 3.
- [[morini-2026-look-twice]] — benchmark di valutazione del metodo LoT.

## Concetti correlati

- [[vision-language-model]] — modelli valutati.
- [[v-star]] — benchmark vision-centric adiacente.
- [[pope]], [[amber]] — benchmark di hallucination adiacenti.
