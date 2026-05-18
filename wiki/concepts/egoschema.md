---
title: EgoSchema
type: concept
tags: [benchmark, video-qa, long-form-video, egocentric, multiple-choice-qa]
created: 2026-05-15
updated: 2026-05-15
---

# EgoSchema

EgoSchema è un benchmark diagnostico di **very long-form video question-answering** introdotto da [[mangalam-2023-egoschema]]: 5.063 domande a scelta multipla (5 opzioni) su clip egocentriche di **3 minuti** estratte da [[ego4d]], per un totale di ~250 ore di video. Il contributo concettuale è la nozione di **temporal certificate length** (vedi [[certificate-length]]): la mediana per EgoSchema è ~100 s, **5.7×** più lunga di LVU (secondo dataset) e **25–100×** più lunga di NextQA, AGQA, MSRVTT, ActivityNet-QA, Kinetics. Funge da probe standard per long-video MLLM ed è citato in quasi tutti i tech report e i paper di metodi training-free successivi.

## Composizione / Protocollo

- **5.063 QA pairs** (Fullset con eval server-side) + **500 QA Subset** con ground-truth pubblica.
- Clip di 3 min ognuna; 5 opzioni per QA → random baseline = 20 % [source: raw/papers/mangalam-2023-egoschema.pdf §3.1, §4.2].
- Video da Ego4D, filtrati a clip non-overlapping di 3 min con ≥ 30 narrazioni timestamped.
- Generazione QAW via pipeline LLM-in-the-loop a 4 stadi (filtering → Q(AW)-shot generation con GPT-4/Bard/Claude → LLM blind filter → 2 round di curazione umana, con vincolo **certificate length ≥ 30 s**).
- Metrica: accuracy multiple-choice (match diretto della lettera). Setting zero-shot standard.
- Frame campionati uniformemente dalla clip di 3 min; #frame varia per modello (5–180 nella valutazione originale).

## Numeri di riferimento

Risultati da source pages del wiki:

| Modello | #frame | Acc Fullset | Fonte |
|---|---|---|---|
| Random | — | 20.0 | [[mangalam-2023-egoschema]] |
| FrozenBiLM | 90 | 26.9 | [[mangalam-2023-egoschema]] |
| mPLUG-Owl | 5 | 31.1 | [[mangalam-2023-egoschema]] |
| InternVideo | 90 | 32.1 | [[mangalam-2023-egoschema]] |
| Human | — | 76.0 | [[mangalam-2023-egoschema]] |
| VideoChat2-Mistral | 16 | 54.4 | [[li-2024-mvbench]] |
| LLoVi (GPT-4 + LaViLa) | — | 61.2 | [[zhang-2024-llovi]] |
| Qwen2.5-VL-3B | 768 cap | 64.8 | [[qwen2-5-vl-2025-tech-report]] |
| Qwen2.5-VL-7B | 768 cap | 65.0 | [[qwen2-5-vl-2025-tech-report]] |
| GPT-4o | — | 72.2 | [[qwen2-5-vl-2025-tech-report]] |
| Gemini 1.5 Pro | — | 71.2 | [[qwen2-5-vl-2025-tech-report]] |
| Qwen2.5-VL-72B | 768 cap | **76.2** | [[qwen2-5-vl-2025-tech-report]] |
| VideoLLaMA 3-7B | 180 (1fps) | 63.3 | [[zhang-2025-videollama-3]] |
| VideoLLaMA 3-2B | 180 | 58.5 | [[zhang-2025-videollama-3]] |
| TCoT (Gemini Flash, Subset) | dyn-seg | 75.2 | [[arnab-2025-temporal-chain-of-thought]] |
| TCoT (Gemini Flash, Fullset) | dyn-seg | 69.1 | [[arnab-2025-temporal-chain-of-thought]] |

Il modello Qwen2.5-VL-72B è il primo MLLM open-weight a uguagliare l'human baseline sul Fullset (76.2 vs 76.0).

## Sources

- [[mangalam-2023-egoschema]] — introduce il benchmark e definisce certificate length.
- [[li-2024-mvbench]] — valuta VideoChat2/VideoChat2-Mistral in zero-shot.
- [[fu-2025-video-mme]] — confronta certificate length con le proprie fasce short/medium/long.
- [[wang-2025-lvbench]] — cita EgoSchema in Tab. 1 come predecessore.
- [[zhang-2024-llovi]] — riporta 61.2 % SOTA su Fullset (GPT-4 + LaViLa caption).
- [[arnab-2025-temporal-chain-of-thought]] — valuta TCoT (75.2 % Subset / 69.1 % Fullset).
- [[tang-2025-adaptive-keyframe-sampling]] — cita come benchmark di riferimento.
- [[zhang-2025-videollama-3]] — riporta i numeri di VideoLLaMA 3 (63.3 / 58.5).
- [[doorenbos-2026-video-panels]] — cita come benchmark di riferimento.
- [[qwen2-5-vl-2025-tech-report]] — riporta i numeri della famiglia Qwen2.5-VL.

## Concetti correlati

- [[certificate-length]] — metrica introdotta nel paper.
- [[ego4d]] — sorgente dei video.
- [[long-video-understanding]] — task target.
- [[video-question-answering]] — paradigma.
- [[multiple-choice-qa]] — formato delle domande.
- [[video-mme]] — benchmark successivo che adotta certificate length.
- [[lvbench]] — benchmark long-video con concetto analogo (clue duration).
- [[mvbench]] — benchmark short-clip temporal.
