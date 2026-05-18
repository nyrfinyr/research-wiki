---
title: Concentric Causal Attention
type: concept
tags: [method, attention, causal-mask, mllm, training-based]
created: 2026-05-16
updated: 2026-05-16
---

# Concentric Causal Attention

Concentric Causal Attention (Xing et al.) is a training-based variant of the causal mask in MLLMs in which visual tokens are organized into "concentric rings" around the region of interest and attention is redefined to respect this spatial structure, reducing positional biases introduced by the standard causal mask.

In the wiki it is cited as a training-based competitor of the training-free causal-mask modification methods of Pei 2025 and Liu 2026.

## Sources

- [[pei-2025-causal-mask-attention]] — training-based competitor
- [[liu-2026-adaptive-information-flow]] — comparison with CCA
