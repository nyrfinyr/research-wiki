---
title: Qwen3-VL
type: concept
tags: [vlm, video-llm, model, long-context, mixture-of-experts, mrope]
created: 2026-05-18
updated: 2026-05-18
---

# Qwen3-VL

Open-source vision-language model family from Alibaba (December 2025), successor to [[qwen2-5-vl]]. Six variants: four dense (2B / 4B / 8B / 32B) and two MoE (30B-A3B and 235B-A22B), all trained with a native **256K-token** context that interleaves text, images and video. Three architectural changes over Qwen2.5-VL: (i) **interleaved MRoPE**, which redistributes temporal/height/width position dimensions across the full frequency spectrum (instead of chunked bands) to mitigate spectral imbalance on long video; (ii) **DeepStack**, which injects features from three intermediate ViT layers into the first three LLM layers via residual connections; (iii) **textual timestamp tokens** (`<3.0 seconds>` / `<HH:MM:SS>`) in place of Qwen2.5-VL's absolute-time T-RoPE. Vision encoder is [[siglip|SigLIP-2]] (SO-400M default, Large 300M on 2B/4B). LLM backbone is Qwen3. Post-training is bifurcated into "instruct" and "thinking" variants.

Frequently used as a strong open backbone in 2026 multimodal interpretability and inference-time intervention work (e.g. [[morini-2026-look-twice]] benchmarks LoT on Qwen3-VL-4B and Qwen3-VL-8B).

See [[qwen3-vl-2025-tech-report]] for the full architecture, training pipeline, ablations and benchmark numbers.

## Sources

- [[qwen3-vl-2025-tech-report]] — paper / tech report
- [[morini-2026-look-twice]] — tested backbone (4B, 8B variants)

## Related concepts

- [[qwen2-5-vl]] — predecessor
- [[qwen2-vl]] — earlier predecessor
- [[qwen]] — LLM family
- [[siglip]] — vision encoder
- [[interleaved-mrope]] — positional encoding upgrade
- [[mrope]] / [[rotary-position-embedding]] — background
- [[mixture-of-experts]] — used in 30B-A3B / 235B-A22B variants
- [[long-context]] — 256K native context
- [[deepstack]] — multi-level vision-encoder fusion

## Open questions

- No isolated ablation in the report disentangles the contribution of the new LLM backbone (Qwen3 vs Qwen2.5), the architectural upgrades (interleaved MRoPE + DeepStack + textual timestamps), and the longer context window. See [[qwen3-vl-2025-tech-report]] §"Open questions / critiques".
