---
title: Qwen2-VL
type: concept
tags: [vlm, video-llm, model]
created: 2026-05-15
updated: 2026-05-15
---

# Qwen2-VL
 
Multimodal version of Qwen2 (Alibaba, 2024) with Qwen2 LLM backbone and a custom ViT; introduces **M-RoPE** (multimodal rotary position embedding) and support for dynamic resolutions. Successor of Qwen-VL and predecessor of Qwen2.5-VL; the 3D M-RoPE is later adopted for long-video.

## Sources

- [[wang-2025-lvbench]] — evaluated model; cites the 3D-RoPE introduced here for long-video
- [[tang-2025-adaptive-keyframe-sampling]] — evaluated backbone
- [[morini-2026-look-twice]] — backbone tested in Look Twice
- [[qwen3-vl-2025-tech-report]] — predecessor of the line

## Related concepts

- [[qwen]] — LLM family
- [[qwen2-5-vl]] — successor
- [[mrope]] — positional encoding introduced
