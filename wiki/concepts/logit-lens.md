---
title: Logit Lens
type: concept
tags: [method, mechanistic-interpretability, probing]
created: 2026-05-16
updated: 2026-05-16
---

# Logit Lens

Logit lens (Nostalgebraist) è una tecnica di probing che proietta gli hidden state intermedi di un transformer attraverso la unembedding matrix dell'ultimo layer, ottenendo una distribuzione su vocabolario layer-per-layer. Permette di tracciare quando, lungo la profondità, il modello "decide" la risposta e a quale layer l'informazione semantica diventa leggibile.

Nel wiki è uno degli strumenti meccanicistici usati dai lavori di Kim sui video-LLM.

## Sources

- [[kim-2025-map-the-flow]] — usato come strumento di probing
- [[kim-2026-sink-token-aware-pruning]] — usato per analisi dei sink token
