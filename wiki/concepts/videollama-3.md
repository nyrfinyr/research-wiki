---
title: VideoLLaMA 3
type: concept
tags: [video-llm, model]
created: 2026-05-15
updated: 2026-05-15
---

# VideoLLaMA 3

MLLM frontier (2B e 7B) di DAMO Academy / Alibaba per comprensione congiunta di immagini e video. Paradigma di training **vision-centric**: encoder visivo costruito su grandi corpora image-text di alta qualità prima del fine-tuning video. Novità chiave: Any-resolution Vision Tokenization (AVT) sopra SigLIP con 2D-RoPE, e Differential Frame Pruner (DiffFP) per rimuovere patch ridondanti tra frame consecutivi. LLM backbone Qwen2.5; raggiunge SOTA su VideoMME, MLVU, LongVideoBench, LVBench, PerceptionTest, NextQA e benchmark immagine.

Per i dettagli completi vedere la pagina di source [[zhang-2025-videollama-3]].

## Sources

- [[zhang-2025-videollama-3]] — paper introduttivo
- [[doorenbos-2026-video-panels]] — backbone testato
- [[kim-2025-map-the-flow]] — backbone analizzato in mechanistic interpretability
- [[wang-2025-lvbench]] — modello valutato

## Concetti correlati

- [[siglip]] — vision encoder adattato con AVT
- [[qwen]] — LLM backbone (Qwen2.5)
- [[video-llama]] — antenato
