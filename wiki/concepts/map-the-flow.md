---
title: Map the Flow
type: concept
tags: [method, video-llm, mechanistic-interpretability, attention-knockout, logit-lens]
created: 2026-05-15
updated: 2026-05-15
---

# Map the Flow

**Map the Flow** è il framework di **interpretabilità meccanicistica** introdotto da Kim, Kim & Han (2025) per studiare *come* e *dove* i Video LLM eseguono ragionamento temporale durante la VideoQA. Combina **Attention Knockout** (Geva et al. 2023, disabilitazione del flusso `s→t` al layer `l` settando `M^l[s,t] = −∞`) e **Logit Lens** (nostalgebraist 2020, proiezione dei hidden state attraverso il LM head) su 4 Video LLM (LLaVA-NeXT-7B/13B-Video-FT, Mini-InternVL-4B-Video-FT, VideoLLaMA3-7B).

## Architettura

Identifica una **pipeline ricorrente a 4 stadi**:

1. **Cross-frame interactions** (layer 1-16, early-to-middle): token video formano rappresentazioni spaziotemporali interagendo tra frame. Bloccarle cala l'accuracy di 18-60.8 punti (TVBench).
2. **Video-language integration su temporal keyword** (layer 6-20): l'informazione video propagata selettivamente verso i token delle option corrette del prompt.
3. **Concept emergence**: concetti spaziali emergono nei layer early sui patch foreground; concetti temporali ("eat", "sit", "hold") solo nei layer middle, su patch residui.
4. **Answer generation** (layer 16-25): probabilità del true option salta al last-token attorno al layer 20.

Il fine-tuning su VideoQA induce **specificamente** la dipendenza cross-frame nei layer early-middle, assente nel solo ImageLLM precursore.

## Numeri di riferimento

Mantenendo solo i pathway efficaci si conserva la performance sopprimendo fino al **58% degli edge di attenzione** (LLaVA-NeXT-7B-Video-FT). VideoLLaMA3-7B addirittura **migliora** (TVBench 55.2 → 57.2) eliminando il 42% degli edge: i pathway non-efficaci agiscono come noise. Random blocking dello stesso budget crolla di 33+ punti. Validato anche su TOMATO, LongVideoBench, VCGBench.

## Sources

- [[kim-2025-map-the-flow]] — paper introduttivo
- [[morini-2026-look-twice]] — coerenza con "deep layers know"
- [[liu-2025-selfelicit]] — analogia layer-wise sul flusso informazione

## Concetti correlati

- [[video-llm]], [[mechanistic-interpretability]]
- [[attention-knockout]], [[logit-lens]]
- [[early-exit]], [[temporal-reasoning]]
- [[llava-next]], [[videollama-3]] — backbone analizzati
