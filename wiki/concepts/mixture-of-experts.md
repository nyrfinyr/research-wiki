---
title: Mixture-of-Experts (MoE)
type: concept
tags: [architecture, sparse, scaling, efficient-llm]
created: 2026-05-15
updated: 2026-05-15
---

# Mixture-of-Experts (MoE)

Architettura in cui i blocchi feed-forward del Transformer sono **partizionati in `E` esperti** (FFN paralleli), e ad ogni token un **router** seleziona dinamicamente un subset `k ≪ E` di esperti (tipicamente `k=2`) cui dispatchare il calcolo. Il risultato è un modello con **alto parameter count totale** ma **basso compute attivato per token** — la nomenclatura usuale è "totale-A-attivati", es. **30B-A3B** (30B totali, 3B attivati) o **235B-A22B** (235B totali, 22B attivati). Nel mondo VLM, Qwen3-VL è il primo della famiglia Qwen-VL a introdurre varianti MoE [source: raw/papers/qwen3-vl-2025-tech-report.pdf §1, §2].

## Claim chiave / Tecnica

- **Sparse activation**: per ogni token, solo `k` esperti partecipano alla forward (e backward). Routing tipicamente top-`k` softmax con load-balancing loss per evitare collasso del router su pochi esperti.
- **Varianti Qwen3-VL MoE**: due taglie introdotte ex novo nella famiglia — **30B-A3B** e **235B-A22B**; entrambe condividono la stessa ricetta di pre-training (4 stage, 2.2T token) e post-training (SFT su 1.2M campioni, strong-to-weak distillation, RL con SAPO) delle varianti dense (2B/4B/8B/32B) [source: raw/papers/qwen3-vl-2025-tech-report.pdf §1].
- **Trade-off**: parameter scaling è "gratis" rispetto al compute (sparse) ma **costoso in VRAM** (tutti gli esperti devono essere caricati in memoria); inoltre il routing introduce overhead di comunicazione su multi-GPU. Per inference single-host conviene quando si dispone di VRAM abbondante.
- **Performance**: Qwen3-VL-235B-A22B compete su STEM, OCR, document understanding, video understanding, grounding con Gemini 2.5 Pro / GPT-5 / Claude Opus 4.1; il flagship MoE è la versione di punta della famiglia [source: raw/papers/qwen3-vl-2025-tech-report.pdf §5].

## Varianti / Estensioni

- **Switch Transformer** (Fedus 2021): `k=1`, semplifica routing.
- **GShard / Mixtral**: `k=2`, soft routing con load balancing.
- **DeepSeekMoE**: esperti fine-grained + shared experts.
- **Qwen3-VL MoE**: non riporta dettagli sul routing specifico (`k`, expert count, balancing loss); citata solo a livello di sigla `A3B / A22B` [source: raw/papers/qwen3-vl-2025-tech-report.pdf §1].

## Concetti correlati

- [[supervised-fine-tuning]] — ricetta di post-training condivisa con le varianti dense Qwen3-VL.
- [[instruction-tuning]] — applicata anche alle varianti MoE.
- [[direct-preference-optimization]] — DPO/SAPO si applicano a MoE come ai dense.

## Sources

- [[qwen3-vl-2025-tech-report]] — introduce le varianti MoE 30B-A3B e 235B-A22B.
