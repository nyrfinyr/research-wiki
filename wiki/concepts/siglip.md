---
title: SigLIP
type: concept
tags: [vision-encoder, vlm]
created: 2026-05-15
updated: 2026-05-15
---

# SigLIP

Transformer vision encoder (ViT) trained contrastively with sigmoid loss (Google, 2023). A more stable and scalable variant compared to softmax CLIP. Widely used as the visual backbone of modern MLLMs — in particular `siglip-so400m-patch14-384` is the vision encoder cited in most recent models (Qwen2.5-VL, Qwen3-VL, VideoLLaMA 3, LLaVA-Video).

## Sources

- [[zhang-2025-videollama-3]] — initial vision encoder (`siglip-so400m-patch14-384`), adapted with 2D-RoPE in Any-resolution Vision Tokenization
- [[qwen2-5-vl-2025-tech-report]] — CLIP/SigLIP pretraining as a ViT stage
- [[qwen3-vl-2025-tech-report]] — SigLIP-2 as encoder
- [[fu-2025-video-mme]] — cited as standard vision encoder
- [[tang-2025-adaptive-keyframe-sampling]] — vision encoder of LLaVA-Video
- [[arnab-2025-temporal-chain-of-thought]] — baseline feature retriever
- [[kim-2026-sink-token-aware-pruning]] — cited encoder

## Related concepts

- [[clip]] — predecessor with softmax contrastive loss
- [[vision-transformer]] — underlying architecture
- [[eva-clip]] — alternative encoder
