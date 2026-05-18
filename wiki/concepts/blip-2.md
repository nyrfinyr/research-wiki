---
title: BLIP-2
type: concept
tags: [vlm, model]
created: 2026-05-15
updated: 2026-05-15
---

# BLIP-2

Paradigmatic MLLM (Salesforce, 2023) that freezes a vision encoder and an LLM and connects them via the **Q-Former**, trained in two stages (image-text matching/contrastive + generative). Founder of the family of models with a learnable-query bottleneck; used as a baseline and as an image-text scorer in keyframe selection pipelines.

## Sources

- [[zhang-2024-llovi]] — image-level captioner
- [[fu-2025-video-mme]] — cited as Q-Former predecessor
- [[li-2024-mvbench]] — baseline comparison
- [[tang-2025-adaptive-keyframe-sampling]] — scorer for Image-Text Matching in keyframe selection

## Related concepts

- [[q-former]] — module introduced
- [[instructblip]] — instruction-tuned version
- [[clip]] — visual encoder in the early versions
