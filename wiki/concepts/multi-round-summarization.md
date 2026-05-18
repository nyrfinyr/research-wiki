---
title: Multi-round Summarization
type: concept
tags: [method, prompting, long-video, llm]
created: 2026-05-16
updated: 2026-05-16
---

# Multi-round Summarization

La multi-round summarization è la strategia di prompting in cui un LLM riceve una sequenza molto lunga di caption (o trascrizioni di clip video) e procede a riassumerle a passi successivi — riassunti di riassunti — fino a comprimerle in una rappresentazione utilizzabile per rispondere alla domanda finale. Aggira il limite di context senza fine-tuning.

Nel wiki è il concetto centrale di LLoVi per il long-video VQA basato su caption.

## Sources

- [[zhang-2024-llovi]] — concetto centrale del prompt strategy
