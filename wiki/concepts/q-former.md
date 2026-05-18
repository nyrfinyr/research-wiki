---
title: Q-Former
type: concept
tags: [method, vlm, projector]
created: 2026-05-15
updated: 2026-05-15
---

# Q-Former

Query Transformer introdotto da BLIP-2 (Salesforce, 2023): un Transformer leggero (tipicamente BERT-base) con un set fisso di **query learnable** che estraggono un numero ridotto di token visivi da feature image/video, comprimendoli prima di darli in pasto all'LLM. Diventato modulo paradigmatico di compressione token visivi nei MLLM image+video; usato da BLIP-2, InstructBLIP, Video-LLaMA, VideoChat2.

## Sources

- [[fu-2025-video-mme]] — modulo di compressione token visivi
- [[li-2024-mvbench]] — BERT-base con 32 query (Stage 1) + 64 random-init (Stage 2/3) = 96 query in VideoChat2
- [[wang-2025-lvbench]] — usato da Video-LLaMA

## Concetti correlati

- [[blip-2]] — paper d'origine
- [[instructblip]] — instruction-tuning su Q-Former
- [[videochat2]] — adattamento video con 96 query
