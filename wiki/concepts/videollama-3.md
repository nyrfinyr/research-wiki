---
title: VideoLLaMA 3
type: concept
tags: [video-llm, model]
created: 2026-05-15
updated: 2026-05-15
---

# VideoLLaMA 3

Frontier MLLM (2B and 7B) from DAMO Academy / Alibaba for joint image and video understanding. **Vision-centric** training paradigm: visual encoder built on large high-quality image-text corpora before video fine-tuning. Key novelties: Any-resolution Vision Tokenization (AVT) on top of SigLIP with 2D-RoPE, and Differential Frame Pruner (DiffFP) to remove redundant patches between consecutive frames. Qwen2.5 LLM backbone; achieves SOTA on VideoMME, MLVU, LongVideoBench, LVBench, PerceptionTest, NextQA and image benchmarks.

For full details see the source page [[zhang-2025-videollama-3]].

## Sources

- [[zhang-2025-videollama-3]] — introductory paper
- [[doorenbos-2026-video-panels]] — backbone tested
- [[kim-2025-map-the-flow]] — backbone analyzed in mechanistic interpretability
- [[wang-2025-lvbench]] — model evaluated

## Related concepts

- [[siglip]] — vision encoder adapted with AVT
- [[qwen]] — LLM backbone (Qwen2.5)
- [[video-llama]] — ancestor
