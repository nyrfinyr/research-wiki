---
title: LLaVA-1.5
type: concept
tags: [vlm, model]
created: 2026-05-15
updated: 2026-05-15
---

# LLaVA-1.5

Version 1.5 of LLaVA (Liu et al., October 2023): compared to the first LLaVA, it introduces a two-layer MLP projector, higher resolution (336²) and an expanded instruction tuning dataset. Typical backbone Vicuna-7B/13B + CLIP ViT-L/14. Used as target backbone in work on interpretation/attention in MLLMs.

## Sources

- [[pei-2025-causal-mask-attention]] — backbone on which the causal mask analysis is applied

## Related concepts

- [[llava]] — family it belongs to
- [[llava-1-6]] — successor
- [[vicuna]] — LLM backbone
