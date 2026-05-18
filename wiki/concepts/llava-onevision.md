---
title: LLaVA-OneVision
type: concept
tags: [vlm, video-llm, model]
created: 2026-05-15
updated: 2026-05-15
---

# LLaVA-OneVision

Unified single-image / multi-image / video MLLM from Bytedance × NTU × HKUST (Li et al., 2024). ViT (SigLIP) + MLP + Qwen2 LLM architecture, training on mixed tasks to enable task-to-task transfer. Very common backbone in token pruning and video QA studies.

## Sources

- [[wang-2025-lvbench]] — model evaluated
- [[doorenbos-2026-video-panels]] — backbone tested for video paneling
- [[kim-2026-sink-token-aware-pruning]] — backbone for sink-aware token pruning
- [[tang-2025-adaptive-keyframe-sampling]] — backbone evaluated

## Related concepts

- [[llava]] — family
- [[siglip]] — vision encoder
- [[qwen]] — LLM backbone
- [[llava-video]] — related backbone
