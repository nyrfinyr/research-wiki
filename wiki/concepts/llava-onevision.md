---
title: LLaVA-OneVision
type: concept
tags: [vlm, video-llm, model]
created: 2026-05-15
updated: 2026-05-15
---

# LLaVA-OneVision

MLLM unificato single-image / multi-image / video di Bytedance × NTU × HKUST (Li et al., 2024). Architettura ViT (SigLIP) + MLP + Qwen2 LLM, training su task misti per consentire transfer task-to-task. Backbone molto comune in studi di token pruning e video QA.

## Sources

- [[wang-2025-lvbench]] — modello valutato
- [[doorenbos-2026-video-panels]] — backbone testato per video paneling
- [[kim-2026-sink-token-aware-pruning]] — backbone per token pruning sink-aware
- [[tang-2025-adaptive-keyframe-sampling]] — backbone valutato

## Concetti correlati

- [[llava]] — famiglia
- [[siglip]] — vision encoder
- [[qwen]] — LLM backbone
- [[llava-video]] — backbone correlato
