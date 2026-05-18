---
title: Keyframe Sampling
type: concept
tags: [task, inference, video, frame-selection]
created: 2026-05-15
updated: 2026-05-15
---

# Keyframe Sampling

**Keyframe sampling** è il problema di scegliere un sottoinsieme di $M$ frame da un video di $T$ frame con cui alimentare un [[video-llm|video-LLM]] a context limitato. È un bottleneck centrale per il [[long-video-understanding]] perché determina quanta informazione utile arriva al modello.

Due paradigmi principali nel wiki:

- **Uniform sampling**: $M$ frame equispaziati. Default nella maggior parte dei video-LLM (LLaVA-Video, Qwen2.5-VL). Robusto ma cieco al contenuto.
- **Adaptive / prompt-conditioned sampling**: i frame sono scelti in funzione della domanda. Tre realizzazioni nel wiki:
  - **[[tang-2025-adaptive-keyframe-sampling|AKS]]**: relevance via BLIP/CLIP ITM + coverage via Ripley's K, algoritmo ADA judge-and-split.
  - **[[arnab-2025-temporal-chain-of-thought|TCoT]]**: lo **stesso VLM** seleziona i frame rilevanti via prompt JSON, poi risponde — Dynamic-Segment TCoT segmenta video lunghi in $l$ blocchi.
  - **[[doorenbos-2026-video-panels|Video Panels]]**: alternativa che mantiene $T$ alto raggruppando $\alpha\beta$ frame in un'unica immagine "a pannelli", aumentando la risoluzione temporale a costo di quella spaziale.

L'oracolo di selezione (annotated time-references) dà +5.7 punti su LVBench rispetto a TCoT (67.4 vs 61.7) [source: raw/papers/arnab-2025-temporal-chain-of-thought.pdf Tab. 2], indicando che la selezione resta un ceiling aperto.

## Sources

- [[tang-2025-adaptive-keyframe-sampling]] — AKS, formalizzazione relevance + coverage.
- [[arnab-2025-temporal-chain-of-thought]] — TCoT, selector = VLM stesso.
- [[doorenbos-2026-video-panels]] — paneling come alternativa.
- [[zhang-2024-llovi]] — sampling rate ablation (1/8 ottimo per efficienza).
- [[qwen2-5-vl-2025-tech-report]] — dynamic FPS sampling (training-time).

## Concetti correlati

- [[long-video-understanding]] — task target.
- [[training-free-methods]] — paradigma.
- [[video-llm]] — modello a valle.
- [[uniform-sampling]] — baseline.
- [[caption-based-vqa]] — paradigma alternativo (non sceglie frame ma caption).
- [[certificate-length]] — metrica che motiva la selezione (frame "certificanti").
