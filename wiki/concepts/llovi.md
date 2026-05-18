---
title: LLoVi
type: concept
tags: [method, video-llm, long-video, caption-based, training-free]
created: 2026-05-15
updated: 2026-05-15
---

# LLoVi

**LLoVi** (LLM framework for Long-Range Video Question-Answering) is the training-free two-stage framework introduced by Zhang et al. (2024) for long-range Video QA: (1) a **short-term visual captioner** (LaViLa, BLIP-2, CogAgent, LLaVA) describes in text short clips (0.5-8 s) densely sampled from the video; (2) an **LLM** (GPT-3.5/4, Llama3, Mistral) aggregates the concatenated captions to answer the question. No memory bank, state-space or graph: all "long-range modeling" is delegated to the frozen LLM.

## Architecture

**Stage 1** — short-term captioning: video $V$ → $N_v$ non-overlapping clips → caption $c_m = \phi(v_m)$. Default: LaViLa on 1 s clips (EgoSchema); CogAgent at 0.5 fps (NExT-QA / IntentQA).

**Stage 2** — LLM aggregation with **multi-round summarization prompt**: (C, Q) → S (question-conditioned summary) → (S, Q, A) → answer. The summary is conditioned on the question, reducing noise and redundancy. Variants $(C) \to S$ and $(C,Q,A) \to S$ perform worse (Tab. 5).

## Reference numbers

- **EgoSchema** full set: **61.2%** with GPT-4 + LaViLa (best reported at the time)
- **NExT-QA**: +10.2% over previous SOTA
- **IntentQA**: +6.2% over previous SOTA
- **NExT-GQA**: outperforms all previous grounded VQA methods

Captioner ablation (EgoSchema Subset, GPT-3.5): LaViLa 55.2 (best), BLIP-2 50.6, LLaVA 45.2, EgoVLP 46.6 (oracle 66.0). LLM scaling: GPT-4 61.2 > Llama3-70B 56.8 > GPT-3.5 55.2 > Mistral-7B 50.8. Clip length 1 s optimal; sampling rate 1/8 yields 8× efficiency with only a 2% drop.

## Sources

- [[zhang-2024-llovi]] — introductory paper
- [[arnab-2025-temporal-chain-of-thought]] — LLM-based captioning baseline, surpassed in later epochs

## Related concepts

- [[blip-2]] — image-level captioner
- [[gpt-4]], [[mistral]] — LLM backend
- [[adaptive-keyframe-sampling]] — combinable to reduce caption count
- [[long-video-understanding]], [[training-free-methods]]
