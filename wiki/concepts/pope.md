---
title: POPE
type: concept
tags: [benchmark, vlm, hallucination, evaluation]
created: 2026-05-15
updated: 2026-05-15
---

# POPE

**POPE (Polling-based Object Probing Evaluation)** è un benchmark di **hallucination probing** per VLM: misura quanto un modello "allucini" oggetti non presenti nell'immagine. Il setup tipico è una sequenza di domande binary "Is there a {object} in the image?" con bilanciamento positivo/negativo; metrica = accuracy / F1 sulle risposte negative.

Nel wiki appare come benchmark di valutazione hallucination in [[morini-2026-look-twice]] (Look Twice / LoT), dove serve a misurare se il visual highlighting riduce le allucinazioni. Risultati: Qwen2.5-VL-3B +0.8 / Qwen3-VL-4B +0.1; InternVL3.5-4B mostra fluttuazioni negative su POPE/AMBER, indicando che il segnale visual non è universalmente robusto [source: raw/papers/morini-2026-look-twice.pdf §4].

## Sources

- [[morini-2026-look-twice]] — benchmark di valutazione hallucination.

## Concetti correlati

- [[amber]] — benchmark di hallucination MLLM adiacente.
- [[vision-language-model]] — modelli valutati.
- [[realworldqa]] — benchmark vision-centric adiacente.
- [[v-star]] — benchmark vision-centric adiacente.
