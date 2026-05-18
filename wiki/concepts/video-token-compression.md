---
title: Video Token Compression
type: concept
tags: [task, video, efficiency, token-reduction]
created: 2026-05-16
updated: 2026-05-16
---

# Video Token Compression

La video token compression è la famiglia di tecniche per ridurre il numero di token visivi prodotti da un video prima di passarli all'LLM, in modo da rendere trattabili sequenze lunghe senza esplodere il costo di attenzione. Include pruning, merging, pooling temporale, differential frame pruning e simili.

Nel wiki è uno dei moduli centrali di [[videollama-3]] e si relaziona con [[visual-token-pruning]] e [[keyframe-sampling]].

## Sources

- [[zhang-2025-videollama-3]] — componente architetturale del modello
