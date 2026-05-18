---
title: Video-MME
type: concept
tags: [benchmark, video-qa, mllm, long-video, multimodal, subtitles, audio]
created: 2026-05-15
updated: 2026-05-15
---

# Video-MME

Video-MME è un benchmark "full-spectrum" di video question-answering per [[multimodal-large-language-model]], introdotto da [[fu-2025-video-mme]]. Combina diversità di dominio, ampio range di durata (11 s – 1 h), input multi-modali (frame + sottotitoli + audio) e annotazione interamente manuale: 900 video YouTube curati a mano, 2.700 domande multiple-choice (3 per video, 4 opzioni), distribuiti in modo bilanciato su tre fasce di durata. È de facto lo standard per confrontare MLLM video moderni in modalità w/o vs w/ subtitles.

## Composizione / Protocollo

- **900 video** totali (300 short < 2 min / 300 medium 4–15 min / 300 long 30–60 min), 744 con sottotitoli, **tutti** con audio. Durata media 1017.9 s (~17 min) [source: raw/papers/fu-2025-video-mme.pdf §3.2].
- **2.700 QA** (3 per video, 4 opzioni → random baseline 25 %). Distribuzione opzioni A/B/C/D ≈ 25.1 / 27.2 / 25.3 / 22.4 % [source: raw/papers/fu-2025-video-mme.pdf §3.2].
- **Tassonomia video**: 6 domini × 30 sottocategorie (Knowledge, Film & Television, Sports Competition, Artistic Performance, Life Record, Multilingual).
- **Tassonomia task**: 12 task type raggruppati in *perception* (OCR, action/attribute/object recognition, counting, spatial/temporal perception) e *reasoning* (spatial/action/temporal reasoning, information synopsis).
- **Filtro qualità**: Gemini 1.5 Pro text-only blind test → si scartano le QA che risponde correttamente; raggiunge < 15 % accuracy nel setting blind, confermando dipendenza dal contenuto video [source: raw/papers/fu-2025-video-mme.pdf §3.1].
- **Certificate length** (concetto da [[egoschema]]): mediana 26 s / 164.7 s / 890.7 s per short/medium/long.
- **Protocollo**: prompt `subtitles + question + 4 options`; output letter-only; accuracy via regex match (non LLM judge). Modalità testate: *w/o subs*, *w/ subs*, *w/ audio*.

## Numeri di riferimento

Dal paper originale [source: raw/papers/fu-2025-video-mme.pdf §4.2, Tab. 4]:

| Modello | Short w/o | Medium w/o | Long w/o | Overall w/o | Overall w/ subs |
|---|---|---|---|---|---|
| Random | 25.0 | 25.0 | 25.0 | 25.0 | 25.0 |
| GPT-4V | 70.5 | 55.8 | 53.5 | 59.9 | 63.3 |
| GPT-4o | 80.0 | 70.3 | 65.3 | 71.9 | 77.2 |
| Gemini 1.5 Flash | 78.8 | 68.8 | 61.1 | 70.3 | 75.0 |
| **Gemini 1.5 Pro** | 81.7 | 74.3 | 67.4 | **75.0** | **81.3** |
| VILA-1.5 34B (best OS) | 68.1 | 58.1 | 50.8 | 59.0 | 59.4 |
| Video-LLaVA 7B | 45.3 | 38.0 | 36.2 | 39.9 | 41.6 |

Dai source pages successivi del wiki:

| Modello | w/o subs | w/ subs | Fonte |
|---|---|---|---|
| Qwen2.5-VL-3B | 61.5 | 67.6 | [[qwen2-5-vl-2025-tech-report]] |
| Qwen2.5-VL-7B | 65.1 | 71.6 | [[qwen2-5-vl-2025-tech-report]] |
| Qwen2.5-VL-72B | 73.3 | 79.1 | [[qwen2-5-vl-2025-tech-report]] |
| VideoLLaMA 3-2B | 59.6 | 63.4 | [[zhang-2025-videollama-3]] |
| VideoLLaMA 3-7B | 66.2 | 70.3 | [[zhang-2025-videollama-3]] |
| Qwen3-VL-2B inst | 61.9 | — | [[qwen3-vl-2025-tech-report]] |
| Qwen3-VL-8B inst | 71.4 | — | [[qwen3-vl-2025-tech-report]] |
| Qwen3-VL-32B inst | 76.6 | — | [[qwen3-vl-2025-tech-report]] |
| Qwen3-VL-235B-A22B thinking | 79.0 | — | [[qwen3-vl-2025-tech-report]] |
| Gemini 2.5 Pro (thinking) | **85.1** | — | [[qwen3-vl-2025-tech-report]] |
| GPT-5 high | 84.7 | — | [[qwen3-vl-2025-tech-report]] |

L'accuracy decade monotonicamente con la durata; i sottotitoli aiutano sempre, con guadagno crescente sui long (+10.1 punti per Gemini 1.5 Pro).

## Sources

- [[fu-2025-video-mme]] — introduce il benchmark e definisce la pipeline.
- [[qwen2-5-vl-2025-tech-report]] — valuta la famiglia Qwen2.5-VL.
- [[qwen3-vl-2025-tech-report]] — valuta la famiglia Qwen3-VL.
- [[zhang-2025-videollama-3]] — valuta VideoLLaMA 3 (2B e 7B).
- [[wang-2025-lvbench]] — confronto in Tab. 1.
- [[tang-2025-adaptive-keyframe-sampling]] — usa Video-MME come benchmark principale.
- [[arnab-2025-temporal-chain-of-thought]] — non valuta direttamente ma cita.
- [[doorenbos-2026-video-panels]] — valuta paneling su Video-MME.
- [[kim-2026-sink-token-aware-pruning]] — valuta SToP su Video-MME.

## Concetti correlati

- [[multimodal-large-language-model]] — oggetto di valutazione.
- [[video-llm]] — sub-famiglia tipicamente valutata.
- [[long-video-understanding]] — task.
- [[multiple-choice-qa]] — formato.
- [[certificate-length]] — adottato dai paper come misura di difficoltà.
- [[egoschema]] — predecessore long-form.
- [[lvbench]] — benchmark contemporaneo extreme long-video.
- [[mvbench]] — predecessore short-clip temporal.
