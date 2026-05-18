---
title: AMBER
type: concept
tags: [benchmark, mllm, hallucination, evaluation]
created: 2026-05-15
updated: 2026-05-15
---

# AMBER

**AMBER (An LLM-free Multi-dimensional Benchmark for MLLMs hallucination Evaluation)** è un benchmark di hallucination evaluation per MLLM che, a differenza di POPE basato solo su yes/no probing, copre dimensioni multiple (existence, attribute, relation) ed è LLM-free (non richiede un LLM judge). Citato nel wiki come benchmark di hallucination usato in [[morini-2026-look-twice]] (LoT).

Risultato significativo: il visual highlighting di LoT applicato a Qwen2.5-VL-3B porta +23.3 punti su AMBER (uno dei guadagni più grandi del paper), confermando che l'evidence-highlighting può ridurre drammaticamente le allucinazioni — ma su Qwen3-VL-4B il guadagno è -0.7, segno che il segnale non è universalmente robusto [source: raw/papers/morini-2026-look-twice.pdf §4, Tab. 3].

## Sources

- [[morini-2026-look-twice]] — benchmark di valutazione hallucination, +23.3 su Qwen2.5-VL-3B.

## Concetti correlati

- [[pope]] — benchmark di hallucination adiacente.
- [[multimodal-large-language-model]] — modelli valutati.
- [[realworldqa]], [[v-star]] — benchmark vision-centric adiacenti.
