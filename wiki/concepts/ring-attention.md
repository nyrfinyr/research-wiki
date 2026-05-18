---
title: Ring Attention
type: concept
tags: [method, attention, long-context, parallelism]
created: 2026-05-16
updated: 2026-05-16
---

# Ring Attention

Ring Attention è una tecnica di parallelizzazione dell'attenzione su sequenze lunghissime in cui ogni device tiene una chunk dei token K/V e li fa "circolare" tra i device in modo che ogni Q veda tutti i K, senza mai materializzare la matrice di attenzione completa su un singolo nodo. Permette di scalare il [[long-context]] linearmente nel numero di device.

Nel wiki è citata come la tecnica long-context dietro a Large World Model nei lavori su video benchmark.

## Sources

- [[fu-2025-video-mme]] — citata come tecnica per long-context
- [[wang-2025-lvbench]] — citata per LWM
