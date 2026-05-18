---
title: STSP
type: concept
tags: [method, pruning, video-llm, sink-token]
created: 2026-05-16
updated: 2026-05-16
---

# STSP

STSP (Sink-Token-aware Spatial Pruning, Kim 2026) è il modulo di pruning spaziale di token visivi nei video-LLM che usa uno "sink-score" per identificare i token che si comportano da attention sink — tipicamente sullo sfondo della scena — e li rimuove, preservando i token salienti. È accoppiato a STTP, la sua controparte temporale.

Nel wiki è il nome specifico del modulo introdotto dal paper Kim 2026 e citato in Map-the-Flow come direzione complementare al edge pruning.

## Sources

- [[kim-2026-sink-token-aware-pruning]] — modulo introdotto dal paper
- [[kim-2025-map-the-flow]] — citato come direzione complementare
