---
title: ViT Registers
type: concept
tags: [method, vision-transformer, attention-sink]
created: 2026-05-16
updated: 2026-05-16
---

# ViT Registers

ViT registers (Darcet et al. 2023) are additional tokens without semantic meaning inserted into the input of a Vision Transformer during training, whose function is to absorb the "leftover" attention that would otherwise land on background tokens, producing artifacts in the feature maps. They are close relatives of the sink tokens observed in LLMs.

In the wiki they are the conceptual reference for the Kim 2026 paper, which hypothesizes the sink tokens in video-LLMs as the object that registers "would like" to absorb — and that SToP removes training-free.

## Sources

- [[kim-2026-sink-token-aware-pruning]] — reference for the conceptual connection
