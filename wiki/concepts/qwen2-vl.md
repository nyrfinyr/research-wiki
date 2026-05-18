---
title: Qwen2-VL
type: concept
tags: [vlm, video-llm, model]
created: 2026-05-15
updated: 2026-05-15
---

# Qwen2-VL
 
Versione multimodale di Qwen2 (Alibaba, 2024) con LLM backbone Qwen2 e ViT custom; introduce **M-RoPE** (multimodal rotary position embedding) e supporto a risoluzioni dinamiche. Successore di Qwen-VL e predecessore di Qwen2.5-VL; il M-RoPE 3D viene poi adottato per long-video.

## Sources

- [[wang-2025-lvbench]] — modello valutato; cita 3D-RoPE introdotta qui per long-video
- [[tang-2025-adaptive-keyframe-sampling]] — backbone valutato
- [[morini-2026-look-twice]] — backbone testato in Look Twice
- [[qwen3-vl-2025-tech-report]] — predecessore della linea

## Concetti correlati

- [[qwen]] — famiglia LLM
- [[qwen2-5-vl]] — successore
- [[mrope]] — positional encoding introdotto
