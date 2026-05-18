---
title: Early Exit
type: concept
tags: [efficiency, inference, llm]
created: 2026-05-16
updated: 2026-05-16
---

# Early Exit

Early exit refers to inference techniques in which a model of depth L terminates the forward pass at a layer ℓ < L when a "confidence" or internal state indicates that the prediction is already stable, saving FLOPs. In the video-LLM context, it is proposed as a natural application when one observes that the probability of the correct answer saturates well before the last layer.

In the wiki it is cited as an application of the "probability jump" phenomenon described by Map-the-Flow.

## Sources

- [[kim-2025-map-the-flow]] — cited as a possible application of the pathway phenomenon
