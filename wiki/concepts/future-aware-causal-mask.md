---
title: Future-Aware Causal Mask
type: concept
tags: [method, attention, causal-mask, mllm]
created: 2026-05-16
updated: 2026-05-16
---

# Future-Aware Causal Mask

The future-aware causal mask (Pei 2025) is a training-free modification of the causal mask in an MLLM that allows visual tokens to look "forward" over a limited window, so that visual information does not remain trapped in [[attention-sink]] at the head of the sequence but flows toward the query tokens. Designed for the prefill phase, separate from decoding.

In the wiki it is the central concept of the Pei 2025 paper and a point of comparison for the Liu 2026 work on adaptive information flow.

## Sources

- [[pei-2025-causal-mask-attention]] — central concept of the paper
- [[liu-2026-adaptive-information-flow]] — direct comparison as baseline
