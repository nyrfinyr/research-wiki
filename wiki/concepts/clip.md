---
title: CLIP
type: concept
tags: [vision-encoder, vlm]
created: 2026-05-15
updated: 2026-05-15
---

# CLIP

Contrastive Language-Image Pre-training (OpenAI, 2021). ViT-based vision encoder allineato a un text encoder tramite InfoNCE loss su 400M coppie immagine-testo dal web. Diventato la "scelta standard" di vision encoder nei primi MLLM e tuttora citato come feature extractor e scorer image-text in pipeline video-QA.

## Sources

- [[fu-2025-video-mme]] — vision encoder standard nei MLLM
- [[qwen2-5-vl-2025-tech-report]] — CLIP pretraining come stage iniziale del ViT
- [[tang-2025-adaptive-keyframe-sampling]] — scorer alternativo per keyframe selection

## Concetti correlati

- [[siglip]] — variante con sigmoid loss
- [[eva-clip]] — variante con masked image modeling
- [[vision-transformer]]
