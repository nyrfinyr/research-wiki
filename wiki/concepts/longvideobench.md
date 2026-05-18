---
title: LongVideoBench
type: concept
tags: [benchmark, video-qa, mllm, long-video, referring-qa]
created: 2026-05-15
updated: 2026-05-15
---

# LongVideoBench

LongVideoBench è un benchmark long-form di video question-answering con domande di tipo "referring" (la domanda fa riferimento a un momento specifico del video). È standard nelle valutazioni dei tech report MLLM accanto a [[video-mme]] e [[mlvu]], in particolare per misurare la capacità di localizzare e ragionare su segmenti di video lunghi.

## Composizione / Protocollo

- Video long-form (durate medio-lunghe); domande referring multiple-choice.
- Tipico cap-frame di valutazione: 32–64 frame per i modelli open-source, 256 frame per i closed-source.
- Metrica: accuracy multiple-choice; eval set su split val.

## Numeri di riferimento

Risultati dai source pages del wiki (val split):

| Modello | LongVideoBench val | Fonte |
|---|---|---|
| Qwen2-VL-2B | 48.7 | [[zhang-2025-videollama-3]] |
| Qwen2-VL-7B | 55.6 | [[zhang-2025-videollama-3]] |
| InternVL2.5-2B | 52.0 | [[zhang-2025-videollama-3]] |
| InternVL2.5-8B | 60.0 | [[zhang-2025-videollama-3]] |
| LLaVA-Video-7B | 58.2 | [[zhang-2025-videollama-3]] |
| LLaVA-OneVision 7B | 54.8 | [[tang-2025-adaptive-keyframe-sampling]] |
| LLaVA-Video 7B (64 frame) | 58.9 | [[tang-2025-adaptive-keyframe-sampling]] |
| LLaVA-Video 7B + AKS | 62.7 | [[tang-2025-adaptive-keyframe-sampling]] (+3.8) |
| VideoLLaMA 3-2B | 57.1 | [[zhang-2025-videollama-3]] |
| VideoLLaMA 3-7B | 59.8 | [[zhang-2025-videollama-3]] |
| Qwen2.5-VL-3B | 54.2 | [[qwen2-5-vl-2025-tech-report]] |
| Qwen2.5-VL-7B | 56.0 | [[qwen2-5-vl-2025-tech-report]] |
| Qwen2.5-VL-72B | 60.7 | [[qwen2-5-vl-2025-tech-report]] |
| Gemini 1.5 Pro | 64.0 | [[qwen2-5-vl-2025-tech-report]] |
| GPT-4o | 66.7 | [[qwen2-5-vl-2025-tech-report]] |

Qwen2.5-VL-72B resta dietro Gemini 1.5 Pro e GPT-4o su LongVideoBench (insieme a Video-MME), uno dei pochi benchmark video dove non è leader.

## Sources

- [[qwen2-5-vl-2025-tech-report]] — riporta Qwen2.5-VL e closed-source baselines.
- [[zhang-2025-videollama-3]] — valuta VideoLLaMA 3 (2B e 7B).
- [[tang-2025-adaptive-keyframe-sampling]] — usa LongVideoBench come benchmark principale (+3.8 punti con AKS su LLaVA-Video-7B).
- [[wang-2025-lvbench]] — confronto in Tab. 1.
- [[kim-2025-map-the-flow]] — valida pathway analysis su LongVideoBench (Tab. A).
- [[kim-2026-sink-token-aware-pruning]] — valuta SToP su LongVideoBench.

## Concetti correlati

- [[long-video-understanding]] — task.
- [[video-mme]] — benchmark complementare.
- [[mlvu]] — benchmark complementare.
- [[lvbench]] — benchmark extreme long-video.
- [[video-llm]] — modelli valutati.
