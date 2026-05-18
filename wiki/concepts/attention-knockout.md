---
title: Attention Knockout
type: concept
tags: [method, mechanistic-interpretability, intervention]
created: 2026-05-16
updated: 2026-05-16
---

# Attention Knockout

Attention knockout (Geva et al. 2023) è una tecnica di intervento meccanicistico in cui si "spegne" un sottoinsieme di edge dell'attenzione (forzando a zero gli score da un set di token sorgente verso un token target a un dato layer) per misurare causalmente il contributo di quei percorsi sull'output. È strumento standard per isolare information pathway in un transformer.

Nel wiki è il metodo usato da Map-the-Flow per individuare i percorsi attivi nei video-LLM.

## Sources

- [[kim-2025-map-the-flow]] — usato per individuare effective pathway
