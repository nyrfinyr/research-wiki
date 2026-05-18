---
title: Qwen2.5-VL
type: concept
tags: [vlm, video-llm, model]
created: 2026-05-15
updated: 2026-05-15
---

# Qwen2.5-VL

Open-source frontier MLLM from Alibaba (2025), evolution of Qwen2-VL: ViT with window attention, native dynamic resolution, extended M-RoPE, multi-stage training (CLIP/SigLIP pretraining → SFT with ChatML → DPO/CoT rejection sampling). Widely adopted backbone in 2025-2026 work on long-video QA, token pruning, and evidence highlighting.

See the source page [[qwen2-5-vl-2025-tech-report]] for architecture, training pipeline, and full numbers.

## Sources

- [[qwen2-5-vl-2025-tech-report]] — paper/tech report
- [[morini-2026-look-twice]] — tested backbone
- [[doorenbos-2026-video-panels]] — backbone for video paneling
- [[arnab-2025-temporal-chain-of-thought]] — secondary backbone
- [[kim-2026-sink-token-aware-pruning]] — backbone
- [[wang-2025-lvbench]] — evaluated model
- [[qwen3-vl-2025-tech-report]] — predecessor of the Qwen3-VL line

## Related concepts

- [[qwen2-vl]] — predecessor
- [[qwen]] — LLM family
- [[siglip]] / [[clip]] — vision encoder pretraining
