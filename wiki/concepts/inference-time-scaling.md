---
title: Inference-Time Scaling
type: concept
tags: [reasoning, test-time-compute, llm, paradigm]
created: 2026-05-15
updated: 2026-05-15
---

# Inference-Time Scaling

Paradigma di **scalare il compute usato a inference time** (per token generati, per chiamate, per ramo di ricerca) per migliorare la qualità della risposta, indipendentemente dai parametri del modello. Manifestazioni canoniche: [[chain-of-thought|CoT]] (generazione di token intermedi), self-consistency (multiple sample + majority vote), tree-of-thought / search-based decoding, multi-turn agentic loop. La logica scaling-law è che la qualità finale dipende non solo dal modello ma da quanto compute si è disposti a spendere a inference; il ratio compute/qualità è spesso più favorevole che scalare i parametri al training [source: raw/papers/arnab-2025-temporal-chain-of-thought.pdf §1, §4.2].

## Claim chiave / Tecnica

- **CoT come prototipo**: il primo esempio in cui aumentare i token intermedi migliora la risposta finale a parità di modello — cfr. [[chain-of-thought]] [source: raw/papers/arnab-2025-temporal-chain-of-thought.pdf §1].
- **TCoT (Temporal CoT)** è un'**applicazione del paradigma al video QA**: lo stesso VLM viene usato prima per **selezionare i frame rilevanti** (con justification testuale) e poi per rispondere alla domanda. Niente captioner esterni né tool: un solo VLM, due chiamate. La variante Dynamic-Segment TCoT partiziona il video in `l` segmenti e gestisce inference-time scaling lungo l'asse `l` [source: raw/papers/arnab-2025-temporal-chain-of-thought.pdf §3.2].
- **Curva smooth con compute** (Arnab 2025, Fig. 4): su LVBench, TCoT scala smoothly da `l=2` a `l=32` (31K → 697K token totali, accuracy 50.3 → 61.7). La baseline non-iterativa a 700K (2700 frame nativi) raggiunge solo 58.9. Self-consistency CoT è **inefficace** (≈51) [source: raw/papers/arnab-2025-temporal-chain-of-thought.pdf §4.2, Fig. 4].
- **Adattività task-dipendente**: la frazione di frame selezionati da TCoT varia 6-25% per question type, allineata con annotazioni human di "time references" su LVBench (Fig. 6). Il modello "spende" più compute dove serve [source: raw/papers/arnab-2025-temporal-chain-of-thought.pdf §4.3, Fig. 6].
- **SOTA con compute moderato**: TCoT(Gemini Flash, 32K context, 672K total) = **61.7** su LVBench vs precedente best Gemini 1.5 Flash a 700K single-shot = 58.9. TCoT(GPT-4o-mini, 22K) = 53.5 vs baseline 48.0. TCoT(Qwen2.5-VL-7B, 128K) = 49.1 vs 46.1. Il guadagno si generalizza su 3 famiglie di backbone [source: raw/papers/arnab-2025-temporal-chain-of-thought.pdf §Tab. 3].

## Varianti / Estensioni

- **CoT** (Wei 2022) — base monolitica.
- **Self-consistency** (Wang 2022) — sample + vote.
- **Tree-of-Thought / Search** (Yao 2023) — ricerca esplicita su rami.
- **Reflection / self-refine** — multi-turn correction.
- **TCoT** (Arnab 2025) — applicazione video con frame selection.
- **"Thinking with images"** (Qwen3-VL) — multi-turn tool calling con immagini, RL-trained [source: raw/papers/qwen3-vl-2025-tech-report.pdf §concetti citati].

## Concetti correlati

- [[chain-of-thought]] — prototipo storico dell'inference-time scaling.
- [[evidence-highlighting]] — alternativa che spende compute in modo più mirato (1 token extra invece di catene).
- [[supervised-fine-tuning]] — Qwen3-VL "thinking" variant è SFT su CoT esteso (inference-time scaling built-in).

## Sources

- [[arnab-2025-temporal-chain-of-thought]] — applica esplicitamente il paradigma al video QA via TCoT.
