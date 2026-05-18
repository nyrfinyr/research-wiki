---
title: CLIP
type: concept
tags: [vision-encoder, vlm]
created: 2026-05-15
updated: 2026-05-15
---

# CLIP

Contrastive Language-Image Pre-training (OpenAI, 2021). ViT-based vision encoder aligned to a text encoder via InfoNCE loss on 400M image-text pairs from the web. It became the "default choice" of vision encoder in the first MLLMs and is still cited as a feature extractor and image-text scorer in video-QA pipelines.

## Sources

- [[fu-2025-video-mme]] — standard vision encoder in MLLMs
- [[qwen2-5-vl-2025-tech-report]] — CLIP pretraining as initial stage of the ViT
- [[tang-2025-adaptive-keyframe-sampling]] — alternative scorer for keyframe selection

## Related concepts

- [[siglip]] — sigmoid-loss variant
- [[eva-clip]] — variant with masked image modeling
- [[vision-transformer]]
