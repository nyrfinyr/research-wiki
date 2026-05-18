---
title: Vision-Language Model (VLM)
type: concept
tags: [model-family, vision-language, multimodal, broad-concept]
created: 2026-05-15
updated: 2026-05-15
---

# Vision-Language Model (VLM)

Un **Vision-Language Model** (VLM) è un modello che integra encoding visivo (tipicamente immagini) con linguaggio naturale. Nel wiki la dicitura si sovrappone in larga parte a [[multimodal-large-language-model]] ma è usata in modo più ristretto per indicare modelli **image-first** (con o senza estensione video): es. la famiglia [[qwen2-5-vl-2025-tech-report|Qwen2.5-VL]] è esplicitamente descritta come "vision-language model" dal proprio tech report, anche se supporta video. [[qwen3-vl-2025-tech-report|Qwen3-VL]] continua questa convenzione con varianti dense e MoE.

I VLM moderni hanno tipicamente: vision encoder ([[vision-transformer|ViT]], spesso [[siglip|SigLIP-2]] o CLIP), un projector / merger MLP, e un LLM backbone. La distinzione tra "VLM" e "video-LLM" è sfumata: un VLM image-first (es. Qwen2.5-VL) può essere applicato al video con frame sampling, mentre un [[video-llm|video-LLM]] è nativamente progettato per la dimensione temporale.

## Sources

- [[qwen2-5-vl-2025-tech-report]] — esempio di VLM image+video con architettura "vision-language model".
- [[qwen3-vl-2025-tech-report]] — versione successiva con MoE e 256K context.
- [[zhang-2025-videollama-3]] — usa la dicitura VLM per la categoria.
- [[doorenbos-2026-video-panels]] — testa il metodo su 8 "VLM" inclusi GPT-4o-mini/4.1.

## Concetti correlati

- [[multimodal-large-language-model]] — categoria più generale.
- [[video-llm]] — sub-famiglia video-native.
- [[vision-transformer]] — encoder.
- [[siglip]] — vision encoder ricorrente.
- [[long-video-understanding]] — task downstream.
