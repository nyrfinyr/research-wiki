---
title: Qwen2.5-VL
type: concept
tags: [vlm, video-llm, model]
created: 2026-05-15
updated: 2026-05-15
---

# Qwen2.5-VL

MLLM frontier open-source di Alibaba (2025), evoluzione di Qwen2-VL: ViT con window attention, native dynamic resolution, M-RoPE estesa, training a più stage (CLIP/SigLIP pretraining → SFT con ChatML → DPO/CoT rejection sampling). Backbone enormemente diffuso in lavori 2025-2026 su long-video QA, token pruning, evidence highlighting.

Vedere il source page [[qwen2-5-vl-2025-tech-report]] per architettura, pipeline di training e numeri completi.

## Sources

- [[qwen2-5-vl-2025-tech-report]] — paper/tech report
- [[morini-2026-look-twice]] — backbone testato
- [[doorenbos-2026-video-panels]] — backbone per video paneling
- [[arnab-2025-temporal-chain-of-thought]] — backbone secondario
- [[kim-2026-sink-token-aware-pruning]] — backbone
- [[wang-2025-lvbench]] — modello valutato
- [[qwen3-vl-2025-tech-report]] — predecessore della linea Qwen3-VL

## Concetti correlati

- [[qwen2-vl]] — predecessore
- [[qwen]] — famiglia LLM
- [[siglip]] / [[clip]] — vision encoder pretraining
