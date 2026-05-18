---
title: Q-Former
type: concept
tags: [method, vlm, projector]
created: 2026-05-15
updated: 2026-05-15
---

# Q-Former

Query Transformer introduced by BLIP-2 (Salesforce, 2023): a lightweight Transformer (typically BERT-base) with a fixed set of **learnable queries** that extract a reduced number of visual tokens from image/video features, compressing them before feeding them to the LLM. It has become a paradigmatic visual-token compression module in image+video MLLMs; used by BLIP-2, InstructBLIP, Video-LLaMA, VideoChat2.

## Sources

- [[fu-2025-video-mme]] — visual-token compression module
- [[li-2024-mvbench]] — BERT-base with 32 queries (Stage 1) + 64 random-init (Stage 2/3) = 96 queries in VideoChat2
- [[wang-2025-lvbench]] — used by Video-LLaMA

## Related concepts

- [[blip-2]] — origin paper
- [[instructblip]] — instruction-tuning on Q-Former
- [[videochat2]] — video adaptation with 96 queries
