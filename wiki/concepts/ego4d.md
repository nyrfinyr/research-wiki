---
title: Ego4D
type: concept
tags: [dataset, egocentric-video, large-scale, video-foundation-data]
created: 2026-05-15
updated: 2026-05-15
---

# Ego4D

Ego4D è il dataset egocentrico large-scale di riferimento per la ricerca video: **3.670 ore** di video RGB egocentrici raccolti da centinaia di partecipanti, con **3.85 M narrazioni dense** (1772 verbi, 4336 sostantivi unici) timestamped. È al tempo stesso un corpus di training (per video encoder e MLLM) e la base diretta di [[egoschema]] (clip di 3 min con ≥ 30 narrazioni → 5.063 QA), oltre a essere usato come fonte di dati instruction-tuning ("EgoQA") in VideoChat2 e come dominio di valutazione in [[longvideobench]], [[lvbench]], etc.

## Ruolo nel wiki

- **Sorgente per EgoSchema**: lo Stage I della pipeline di [[mangalam-2023-egoschema]] filtra clip non-overlapping di 3 minuti con ≥ 30 narrazioni timestamped, ottenendo ~250 h di video filtrato [source: raw/papers/mangalam-2023-egoschema.pdf §3.1].
- **Training data per MLLM**: usato come EgoQA in instruction-tuning di [[li-2024-mvbench|VideoChat2]] e come parte del corpus video di [[zhang-2025-videollama-3|VideoLLaMA 3]].
- **Pre-training di captioner**: LaViLa e EgoVLP, usati in [[zhang-2024-llovi]], sono pre-trained su Ego4D.

## Sources

- [[mangalam-2023-egoschema]] — usa Ego4D come video pool per EgoSchema.
- [[li-2024-mvbench]] — usa Ego4D come sorgente EgoQA in instruction tuning di VideoChat2.
- [[zhang-2024-llovi]] — il captioner LaViLa è pre-trained su Ego4D.
- [[zhang-2025-videollama-3]] — Ego4D citato come parte del corpus video.
- [[wang-2025-lvbench]] — citato come dominio di video-understanding.

## Concetti correlati

- [[egoschema]] — benchmark derivato.
- [[long-video-understanding]] — task supportato.
- [[video-llm]] — famiglia di modelli che lo usa in training.
- [[multimodal-large-language-model]] — oggetto downstream.
