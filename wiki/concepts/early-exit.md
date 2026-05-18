---
title: Early Exit
type: concept
tags: [efficiency, inference, llm]
created: 2026-05-16
updated: 2026-05-16
---

# Early Exit

Early exit indica le tecniche di inferenza in cui un modello a profondità L termina il forward pass a un layer ℓ < L quando una "confidence" o uno stato interno indicano che la predizione è già stabile, risparmiando FLOPs. In contesto video-LLM è proposto come applicazione naturale quando si osserva che la probabilità sulla risposta corretta satura ben prima dell'ultimo layer.

Nel wiki è citato come applicazione del fenomeno di "salto di probabilità" descritto da Map-the-Flow.

## Sources

- [[kim-2025-map-the-flow]] — citato come possibile applicazione del fenomeno pathway
