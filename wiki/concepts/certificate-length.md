---
title: Certificate Length
type: concept
tags: [metric, video, benchmark-design, temporal]
created: 2026-05-15
updated: 2026-05-15
---

# Certificate Length

**Temporal certificate length** è una metrica introdotta da [[mangalam-2023-egoschema]] (§3.2) per misurare la **difficoltà temporale intrinseca** di un task video, *disaccoppiata* dalla durata della clip. Definizione: dato un (video, label) e un task, il **certificate set** è il sottoinsieme minimo di sub-clip *necessario e sufficiente* a convincere un verificatore umano della correttezza della label senza guardare il resto del video; la **certificate length** = somma delle lunghezze temporali delle subclip del set.

Convenzioni: minimo 0.1 s per certificate; due certificati non contigui si fondono se i loro estremi più vicini sono < 5 s.

Tassonomia temporale derivata [source: raw/papers/mangalam-2023-egoschema.pdf §3]:
- *short video task*: certificate ~1 s (Kinetics, UCF101, AVA).
- *long-form video task*: ~10 s (AGQA, NextQA, MSRVTT).
- *very long-form video task*: ~100 s (EgoSchema, isolato in Fig. 3).

Adottato esplicitamente da:
- **[[fu-2025-video-mme]]**: mediana 26 / 165 / 891 s per short/medium/long; EgoSchema (~100 s) si colloca tra short e medium di Video-MME.
- **[[wang-2025-lvbench]]**: concetto analogo "clue duration", annotato manualmente per ogni QA.

## Sources

- [[mangalam-2023-egoschema]] — introduce la metrica.
- [[fu-2025-video-mme]] — adotta come misura comparativa di difficoltà.
- [[wang-2025-lvbench]] — annota clue duration con concetto analogo.

## Concetti correlati

- [[egoschema]] — benchmark in cui è definita.
- [[long-video-understanding]] — task target.
- [[keyframe-sampling]] — pratica che cerca di approssimare il certificate set.
- [[video-question-answering]] — paradigma di applicazione.
