---
title: Look Twice (LoT)
type: concept
tags: [method, mllm, evidence-highlighting, training-free, inference-time]
created: 2026-05-15
updated: 2026-05-15
---

# Look Twice (LoT)

**Look Twice (LoT)** è il framework **training-free, inference-time** introdotto da Morini et al. (2026) per migliorare l'utilizzo dell'evidenza multimodale nei MLLM nel setting Knowledge-Based VQA. L'idea cardine: far guardare al modello l'input **due volte** — un primo forward pass genera **un solo token** e produce le attention map; queste vengono usate per identificare (a) la regione visiva rilevante (filtrando attention sink visivi con uno score sulle dimension-channels critiche della BOS) e (b) le frasi di evidenza testuale rilevanti nel contesto recuperato (RAG). I cue selezionati sono **highlighted** nel prompt con marker `<START_IMPORTANT_TXT>` e con un bounding box `<START_IMPORTANT_IMG>` nell'immagine. Un secondo forward pass genera la risposta finale sull'input arricchito. Niente training, niente parametri modificati, overhead ≈ 1 token.

## Architettura

Tre componenti chiave:

1. **Self-guided Visual Evidence Selection**: aggregazione cross-layer/cross-head delle attention dal target object (estratto via dependency parsing spaCy) verso i token visivi, su layer intermedi `L_vis`. Output: vettore `a_vis ∈ R^(N_V)`.
2. **Multi-Layer Attention Sink Filtering**: identifica dimensioni `D_sink` in cui BOS attiva massicciamente; sopprime token visivi che attivano queste dimensioni oltre soglia τ (default 25° percentile).
3. **Self-guided Textual Evidence Selection**: estrazione last-to-context dell'ultimo token generato, aggregata sui **deep layers** (seconda metà del decoder, coerente con SelfElicit); selezione frasi via score massimo o soglia α.

Bounding box estratto via **weighted centroid** + deviazioni (β=2). Validato cross-architecture (Qwen, InternVL) e cross-scale (2B → 38B).

## Numeri di riferimento

Su 4 benchmark KB-VQA (E-VQA, InfoSeek, OVEN, ViQuAE) × 10 MLLM, LoT migliora di **+1.1 a +5.3** punti medi. Guadagni maggiori: Qwen2-VL-7B +5.3, Qwen2.5-VL-3B +4.3, InternVL3.5-4B +4.2. Ablation (Tab. 2): visual-only e textual-only sono **complementari** (Qwen2.5-VL-3B E-VQA: solo-textual 29.4, solo-visual 29.6, LoT 30.4).

## Sources

- [[morini-2026-look-twice]] — paper introduttivo
- [[gu-2024-attention-sink]] — fondamento teorico per attention sink filtering
- [[liu-2025-selfelicit]] — antenato testuale, coerenza sui deep layers

## Concetti correlati

- [[evidence-highlighting]] — task generale
- [[attention-sink]], [[visual-attention-sink]] — filtraggio applicato
- [[self-elicit]] — controparte text-only
- [[map-the-flow]] — coerenza con "deep layers know"
- [[multimodal-large-language-model]], [[training-free-methods]]
