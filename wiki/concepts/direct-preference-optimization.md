---
title: Direct Preference Optimization (DPO)
type: concept
tags: [post-training, alignment, rlhf, preference-learning]
created: 2026-05-15
updated: 2026-05-15
---

# Direct Preference Optimization (DPO)

Algoritmo di alignment introdotto da Rafailov et al. (2023) che apprende da **preference pairs** `(x, y_w, y_l)` (per ciascun prompt `x`, una risposta preferita `y_w` e una rigettata `y_l`) **senza** dover addestrare un reward model esplicito né eseguire PPO. La policy ottimale è ottenuta in closed-form rispetto a un reward implicito basato sul rapporto delle log-probabilities della policy corrente e di una reference, ed è ottimizzata con un classificatore binario sui preference pair. Per il sub-mondo VLM, DPO è oggi lo *stage standard di alignment* dopo l'SFT/instruction tuning [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.3; raw/papers/qwen3-vl-2025-tech-report.pdf §post-training].

## Claim chiave / Tecnica

- **Loss DPO**:
  ```
  L_DPO(π_θ; π_ref) = − E_(x,y_w,y_l) [ log σ( β log π_θ(y_w|x)/π_ref(y_w|x) − β log π_θ(y_l|x)/π_ref(y_l|x) ) ]
  ```
  con `β` temperatura della reference. Niente reward model esplicito; niente RL on-policy.
- **Stage finale di Qwen2.5-VL**: post-training in **due fasi** con ViT congelato — prima SFT (~2M esempi, 50% text-only, 50% multimodale), poi **DPO** per allineare lo stile alle preferenze umane [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.3].
- **Background per Qwen3-VL**: DPO è citato come "background" perché Qwen3-VL evolve verso **SAPO (Smooth and Adaptive Policy Optimization)** + strong-to-weak distillation testuale, ma DPO resta il punto di partenza concettuale per l'alignment basato su preferenze [source: raw/papers/qwen3-vl-2025-tech-report.pdf §concetti citati].
- **Vantaggi pratici (rispetto a PPO/RLHF)**: training stabile (loss simile a cross-entropy), non richiede sampling on-policy, non richiede reward model — implementazione molto più economica e adatta a modelli di taglia 7B-235B.

## Varianti / Estensioni

- **IPO** (Identity Preference Optimization), **KTO** (Kahneman-Tversky Optimization), **SimPO** — varianti recenti che modificano la loss DPO per evitare reward hacking o per gestire preferenze non binarie.
- **SAPO** (Qwen3-VL): RL-based, *non* DPO; usa policy optimization smooth e adaptive per Qwen3-VL "thinking" [source: raw/papers/qwen3-vl-2025-tech-report.pdf §concetti citati].
- **Multimodal DPO**: preference pair `(immagine, prompt, y_w, y_l)`; la policy multimodale apprende preferenze su risposte visivamente-grounded.

## Concetti correlati

- [[supervised-fine-tuning]] — stage precedente; DPO presuppone una policy già instruction-tuned.
- [[instruction-tuning]] — stage tipicamente fra pre-training e DPO.
- [[chain-of-thought]] — DPO può apprendere preferenze fra traiettorie CoT corrette vs errate.

## Sources

- [[qwen2-5-vl-2025-tech-report]] — DPO come stage finale di post-training.
- [[qwen3-vl-2025-tech-report]] — DPO citato come background; Qwen3-VL evolve verso SAPO.
