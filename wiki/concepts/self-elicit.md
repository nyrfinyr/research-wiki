---
title: Self-Elicit
type: concept
tags: [method, prompting, evidence-highlighting, attention]
created: 2026-05-16
updated: 2026-05-16
---

# Self-Elicit

Self-Elicit (Liu 2025) è un metodo training-free di evidence highlighting in cui il modello stesso identifica, attraverso i propri pattern di attenzione sui layer profondi, le porzioni di contesto rilevanti per la query e le ri-promuove via prompt augmentation. Sfrutta l'attenzione come segnale di rilevanza interno al modello.

Nel wiki è il metodo introdotto dal paper Liu 2025 e citato da Look-Twice come precedente diretto sull'idea di attention-as-relevance.

## Sources

- [[liu-2025-selfelicit]] — metodo introdotto dal paper
- [[morini-2026-look-twice]] — citato come precedente
