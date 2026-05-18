---
title: Interleaved MRoPE
type: concept
tags: [method, positional-encoding, rope, mllm]
created: 2026-05-16
updated: 2026-05-16
---

# Interleaved MRoPE

Interleaved MRoPE is a variant of [[mrope]] introduced in Qwen3-VL in which the rotary embedding dimensions dedicated to the temporal axis, height and width are interleaved along the channels instead of being assigned to contiguous blocks. Interleaving stabilizes extrapolation to long video contexts and improves positional behavior compared to base M-RoPE.

In the wiki it is one of the distinctive architectural components of the Qwen3-VL technical report.

## Sources

- [[qwen3-vl-2025-tech-report]] — variant introduced by the model
