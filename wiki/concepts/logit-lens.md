---
title: Logit Lens
type: concept
tags: [method, mechanistic-interpretability, probing]
created: 2026-05-16
updated: 2026-05-16
---

# Logit Lens

Logit lens (Nostalgebraist) is a probing technique that projects the intermediate hidden states of a transformer through the unembedding matrix of the final layer, yielding a vocabulary distribution layer-by-layer. It allows tracking when, along the depth, the model "decides" the answer and at which layer semantic information becomes readable.

In the wiki it is one of the mechanistic tools used in Kim's work on video-LLMs.

## Sources

- [[kim-2025-map-the-flow]] — used as a probing tool
- [[kim-2026-sink-token-aware-pruning]] — used for sink token analysis
