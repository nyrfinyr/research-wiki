---
title: ALiBi
type: concept
tags: [method, positional-encoding, attention, long-context]
created: 2026-05-16
updated: 2026-05-16
---

# ALiBi

ALiBi (Attention with Linear Biases) is a positional encoding scheme that, instead of adding positional embeddings, directly adds a linear bias proportional to the query-key distance to the attention score. It favors extrapolation to sequences longer than those seen in training and is therefore a standard baseline for [[long-context]].

In the wiki it appears as a comparison term in work on [[attention-sink]] and [[sliding-window-attention]] together with [[rotary-position-embedding]].

## Sources

- [[gu-2024-attention-sink]] — cited among the positional encoding variants
- [[fu-2025-sliding-window-attention]] — cited among the positional encoding variants
