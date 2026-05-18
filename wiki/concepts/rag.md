---
title: Retrieval-Augmented Generation
type: concept
tags: [method, retrieval, llm, kb]
created: 2026-05-16
updated: 2026-05-16
---

# Retrieval-Augmented Generation

RAG (Retrieval-Augmented Generation) è il paradigma in cui un modello generativo riceve, prima di produrre la risposta, un set di passaggi recuperati da una knowledge base esterna tramite un retriever (denso o sparso). Riduce le allucinazioni e permette di aggiornare la conoscenza senza ri-trainare il modello.

Nel wiki è il framework di sfondo per i lavori su evidence-highlighting e KB-VQA, dove l'attenzione del LLM stesso viene usata per individuare il contesto rilevante.

## Sources

- [[morini-2026-look-twice]] — framework di sfondo per KB-VQA
- [[liu-2025-selfelicit]] — framework di sfondo per context-based QA
