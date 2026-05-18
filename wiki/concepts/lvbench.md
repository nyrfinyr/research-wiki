---
title: LVBench
type: concept
tags: [benchmark, video-qa, mllm, long-video, multi-hour-video, temporal-reasoning]
created: 2026-05-15
updated: 2026-05-15
---

# LVBench

LVBench è un benchmark di video-QA per **video estremamente lunghi** introdotto da [[wang-2025-lvbench]]: 103 video YouTube per un totale di 117 ore (durata media **4101 s ≈ 68 min**, ~4× più lungo di Video-MME), 1.549 domande multiple-choice annotate manualmente. Definisce "long video" come ≥ 30 min con eventi multipli, transizioni di scena e contenuto visivo ricco. Le domande coprono 6 capacità core composizionali, e l'human baseline è 94.4 %.

## Composizione / Protocollo

- **103 video YouTube** filtrati su 5 criteri (Clear Protagonist Presence, Structural Coherence, Event Density ≥ 1 evento/5 min, Visual Clarity ≥ 720p, Modality Independence) [source: raw/papers/wang-2025-lvbench.pdf §3.1].
- 6 categorie tematiche: Sports Competitions, Documentary Films, Event Records, Lifestyle and Daily Activities, TV Shows and Drama Series, Cartoon Videos.
- **1.549 QA pairs** a 4 opzioni (random baseline 25 %).
- **6 capacità core**: Temporal Grounding (TG), Summarization (Sum), Reasoning (Rea), Entity Recognition (ER), Event Understanding (EU), Key Information Retrieval (KIR). Combinate in 26 sotto-categorie composizionali — ogni QA richiede tipicamente più skill insieme [source: raw/papers/wang-2025-lvbench.pdf §3.2].
- **Annotazione manuale**: ~24 domande/ora di video, ogni QA con 4 opzioni di lunghezza simile + annotazione di *clue duration* (analogo della [[certificate-length]]).
- **Filtro dual-LLM blind**: si scartano QA dove **sia** GLM-4 **sia** GPT-4 rispondono correttamente senza video (criterio più stringente del single-LLM filter di [[video-mme]]).
- **Audio escluso**: i video forniscono solo frame [source: raw/papers/wang-2025-lvbench.pdf §5].
- **Protocollo eval**: prompt minimale `Question + 4 options + "directly provide the letter"`; estrazione via regex; native long-video models @ 1 fps, non-native @ 32 o 96 frame.

## Numeri di riferimento

Risultati selezionati dal paper [source: raw/papers/wang-2025-lvbench.pdf Tab. 2-3]:

| Modello | Overall | TG | KIR | Rea | Note |
|---|---|---|---|---|---|
| Gemini-1.5-Pro | 33.1 | 31.8 | 39.3 | 27.0 | native long-video |
| Qwen2-VL-72B | 41.3 | 41.4 | 38.3 | 46.5 | native |
| Qwen2.5-VL-72B | 44.0 | 37.7 | 55.6 | 45.2 | native |
| Gemini-2.0-Flash | 48.6 | 39.3 | 56.8 | 44.4 | native |
| Gemini-2.5-Flash | 56.7 | 52.7 | 63.8 | 55.5 | native |
| MR.Video | 60.8 | 58.8 | 71.4 | 57.7 | Gemini-2.0 backbone |
| Seed1.5-VL-Thinking | 64.6 | 53.6 | 68.0 | 63.7 | native |
| **Gemini-2.5-Pro** | **67.4** | **65.9** | **72.8** | **66.5** | native, best 5/6 task |
| GPT-4o | 48.9 | 40.9 | 48.1 | 50.3 | non-native |
| mPLUG-Owl3 | 43.5 | 41.1 | 42.4 | 47.5 | non-native |
| VideoLLaMA3-7B | 45.3 | 35.9 | 47.8 | 45.8 | non-native |
| **Human** | **94.4** | — | — | — | gap 27 punti |

Risultati da source pages aggiuntivi:

| Modello | LVBench | Fonte |
|---|---|---|
| Qwen2.5-VL-3B | 43.3 | [[qwen2-5-vl-2025-tech-report]] |
| Qwen2.5-VL-7B | 45.3 | [[qwen2-5-vl-2025-tech-report]] |
| Qwen2.5-VL-72B | **47.3** | [[qwen2-5-vl-2025-tech-report]] (vs Gemini 1.5 Pro 33.1, +14.2) |
| VideoLLaMA 3-2B | 41.6 | [[zhang-2025-videollama-3]] |
| VideoLLaMA 3-7B | 45.3 | [[zhang-2025-videollama-3]] |
| Qwen3-VL-8B inst | 58.0 | [[qwen3-vl-2025-tech-report]] |
| Qwen3-VL-32B inst | 63.8 | [[qwen3-vl-2025-tech-report]] |
| Qwen3-VL-235B-A22B inst | 67.7 | [[qwen3-vl-2025-tech-report]] |
| LLaVA-Video-7B + AKS | 62.7 | [[tang-2025-adaptive-keyframe-sampling]] (+3.8 vs baseline) |
| TCoT (Gemini Flash, 32K) | 61.7 | [[arnab-2025-temporal-chain-of-thought]] (+11.4 vs baseline) |

## Sources

- [[wang-2025-lvbench]] — introduce il benchmark.
- [[qwen2-5-vl-2025-tech-report]] — valuta la famiglia Qwen2.5-VL (best Qwen2.5-VL 72B = 47.3).
- [[qwen3-vl-2025-tech-report]] — valuta la famiglia Qwen3-VL.
- [[zhang-2025-videollama-3]] — valuta VideoLLaMA 3.
- [[tang-2025-adaptive-keyframe-sampling]] — usa LVBench come benchmark principale.
- [[arnab-2025-temporal-chain-of-thought]] — usa LVBench come benchmark; +11.4 punti con TCoT.
- [[doorenbos-2026-video-panels]] — riferimento.

## Concetti correlati

- [[long-video-understanding]] — task target.
- [[multimodal-large-language-model]] — oggetto di valutazione.
- [[video-llm]] — sub-famiglia tipica.
- [[multiple-choice-qa]] — formato.
- [[certificate-length]] / clue duration — concetto adottato.
- [[video-mme]] — predecessore long-video.
- [[egoschema]] — predecessore long-form egocentrico.
- [[mvbench]] — predecessore short-clip.
