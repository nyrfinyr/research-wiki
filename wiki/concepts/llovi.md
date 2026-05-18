---
title: LLoVi
type: concept
tags: [method, video-llm, long-video, caption-based, training-free]
created: 2026-05-15
updated: 2026-05-15
---

# LLoVi

**LLoVi** (LLM framework for Long-Range Video Question-Answering) è il framework training-free a due stadi introdotto da Zhang et al. (2024) per long-range Video QA: (1) un **short-term visual captioner** (LaViLa, BLIP-2, CogAgent, LLaVA) descrive in testo clip brevi (0.5-8 s) campionate densamente dal video; (2) un **LLM** (GPT-3.5/4, Llama3, Mistral) aggrega le caption concatenate per rispondere alla domanda. Nessuna memory bank, state-space o graph: tutta la "long-range modeling" è delegata al LLM frozen.

## Architettura

**Stadio 1** — short-term captioning: video $V$ → $N_v$ clip non sovrapposte → caption $c_m = \phi(v_m)$. Default: LaViLa su clip da 1 s (EgoSchema); CogAgent a 0.5 fps (NExT-QA / IntentQA).

**Stadio 2** — LLM aggregation con **multi-round summarization prompt**: (C, Q) → S (riassunto condizionato sulla domanda) → (S, Q, A) → answer. La summary è condizionata sulla domanda, riducendo noise e ridondanza. Varianti $(C) \to S$ e $(C,Q,A) \to S$ performano peggio (Tab. 5).

## Numeri di riferimento

- **EgoSchema** full set: **61.2%** con GPT-4 + LaViLa (best reported all'epoca)
- **NExT-QA**: +10.2% sopra SOTA precedente
- **IntentQA**: +6.2% sopra SOTA precedente
- **NExT-GQA**: outperforms tutti i metodi grounded VQA precedenti

Ablation captioner (EgoSchema Subset, GPT-3.5): LaViLa 55.2 (best), BLIP-2 50.6, LLaVA 45.2, EgoVLP 46.6 (oracle 66.0). LLM scaling: GPT-4 61.2 > Llama3-70B 56.8 > GPT-3.5 55.2 > Mistral-7B 50.8. Clip length 1 s ottimale; sampling rate 1/8 dà efficienza 8× con drop solo 2%.

## Sources

- [[zhang-2024-llovi]] — paper introduttivo
- [[arnab-2025-temporal-chain-of-thought]] — baseline LLM-based captioning, superata in epoch successivi

## Concetti correlati

- [[blip-2]] — captioner image-level
- [[gpt-4]], [[mistral]] — LLM backend
- [[adaptive-keyframe-sampling]] — combinabile per ridurre numero caption
- [[long-video-understanding]], [[training-free-methods]]
