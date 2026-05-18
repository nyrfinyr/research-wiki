---
title: SigLIP
type: concept
tags: [vision-encoder, vlm]
created: 2026-05-15
updated: 2026-05-15
---

# SigLIP

Vision encoder Transformer (ViT) addestrato in stile contrastivo con sigmoid loss (Google, 2023). Variante più stabile e scalabile rispetto al CLIP a softmax. Usata diffusamente come backbone visivo dei MLLM moderni — in particolare `siglip-so400m-patch14-384` è il vision encoder citato nella maggior parte dei modelli recenti (Qwen2.5-VL, Qwen3-VL, VideoLLaMA 3, LLaVA-Video).

## Sources

- [[zhang-2025-videollama-3]] — vision encoder iniziale (`siglip-so400m-patch14-384`), adattato con 2D-RoPE in Any-resolution Vision Tokenization
- [[qwen2-5-vl-2025-tech-report]] — CLIP/SigLIP pretraining come stage del ViT
- [[qwen3-vl-2025-tech-report]] — SigLIP-2 come encoder
- [[fu-2025-video-mme]] — citato come vision encoder standard
- [[tang-2025-adaptive-keyframe-sampling]] — vision encoder di LLaVA-Video
- [[arnab-2025-temporal-chain-of-thought]] — feature retriever di baseline
- [[kim-2026-sink-token-aware-pruning]] — encoder citato

## Concetti correlati

- [[clip]] — predecessore con softmax contrastive loss
- [[vision-transformer]] — architettura sottostante
- [[eva-clip]] — encoder alternativo
