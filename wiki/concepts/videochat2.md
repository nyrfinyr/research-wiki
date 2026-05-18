---
title: VideoChat2
type: concept
tags: [video-llm, model]
created: 2026-05-15
updated: 2026-05-15
---

# VideoChat2

Baseline video MLLM proposed by [[li-2024-mvbench]] together with the MVBench benchmark (Shanghai AI Lab, 2024). Architecture: visual encoder **UMT-L** + **Q-Former** BERT-base (32 queries Stage 1, +64 random-init in Stage 2/3 → 96 total queries) + LLM (Vicuna-7B by default, Vicuna-13B, Vicuna-7B v1.5; the **Mistral-7B** variant gives the best results). LoRA r=16, α=32, dropout 0.1 on the LLM in Stage 3.

## Sources

- [[li-2024-mvbench]] — introductory paper (proposed MLLM baseline)
- [[fu-2025-video-mme]] — open-source video MLLM evaluated on VideoMME

## Related concepts

- [[umt-l]] — visual encoder
- [[q-former]] — visual token compressor
- [[vicuna]], [[mistral]] — LLM backbone
- [[videochat]] — predecessor
