---
title: VideoChat2
type: concept
tags: [video-llm, model]
created: 2026-05-15
updated: 2026-05-15
---

# VideoChat2

MLLM video baseline proposto da [[li-2024-mvbench]] insieme al benchmark MVBench (Shanghai AI Lab, 2024). Architettura: visual encoder **UMT-L** + **Q-Former** BERT-base (32 query Stage 1, +64 random-init in Stage 2/3 → 96 query totali) + LLM (Vicuna-7B di default, Vicuna-13B, Vicuna-7B v1.5; la variante con **Mistral-7B** dà i migliori risultati). LoRA r=16, α=32, dropout 0.1 sull'LLM in Stage 3.

## Sources

- [[li-2024-mvbench]] — paper introduttivo (baseline MLLM proposta)
- [[fu-2025-video-mme]] — MLLM video open-source valutato su VideoMME

## Concetti correlati

- [[umt-l]] — visual encoder
- [[q-former]] — compressore token visivi
- [[vicuna]], [[mistral]] — LLM backbone
- [[videochat]] — predecessore
