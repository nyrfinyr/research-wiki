---
title: Self-Elicit
type: concept
tags: [method, prompting, evidence-highlighting, attention]
created: 2026-05-16
updated: 2026-05-16
---

# Self-Elicit

Self-Elicit (Liu 2025) is a training-free evidence-highlighting method in which the model itself identifies, through its own attention patterns over deep layers, the portions of context relevant to the query and re-promotes them via prompt augmentation. It exploits attention as a relevance signal internal to the model.

In the wiki it is the method introduced by the Liu 2025 paper and cited by Look-Twice as a direct precedent for the attention-as-relevance idea.

## Sources

- [[liu-2025-selfelicit]] — method introduced by the paper
- [[morini-2026-look-twice]] — cited as a precedent
