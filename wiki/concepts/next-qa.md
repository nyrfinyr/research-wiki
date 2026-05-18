---
title: NExT-QA
type: concept
tags: [benchmark, video-qa, causal-reasoning, temporal-reasoning, short-video]
created: 2026-05-15
updated: 2026-05-15
---

# NExT-QA

NExT-QA is a Video-QA benchmark focused on **causal and temporal reasoning** over short clips. It is distinguished by questions that require reasoning about "why" and "in what order", not just "what": the three families are Causal, Temporal, Descriptive. It is cited as a comparison dataset for **certificate length** (~5 s median) and is evaluated in many MLLM tech reports and training-free method papers.

## Composition / Protocol

- Short videos (~10-30 s typical).
- Questions organized in 3 families: **Causal** (why), **Temporal** (order, after, before), **Descriptive** (content description).
- Format: multiple-choice (zero-shot) and open-ended.
- Median certificate length ~5 s — categorized as a *long-form* task per the taxonomy of [[mangalam-2023-egoschema]] (certificate ~10 s) [source: raw/papers/mangalam-2023-egoschema.pdf §3].

## Reference numbers

Results from the source pages:

| Model | NExT-QA | Notes | Source |
|---|---|---|---|
| VideoChat2 (Vicuna-7B) | 61.7 | zero-shot avg | [[li-2024-mvbench]] |
| VideoChat2 + Mistral-7B | 78.6 | in-domain | [[li-2024-mvbench]] |
| LLoVi (GPT-4 + CogAgent) | — | +10.2 vs. prior SOTA | [[zhang-2024-llovi]] |
| VideoLLaMA 3-2B | 81.1 | | [[zhang-2025-videollama-3]] |
| VideoLLaMA 3-7B | — | | [[zhang-2025-videollama-3]] |
| Qwen2-VL-2B | 77.2 | | [[zhang-2025-videollama-3]] |
| InternVL2.5-2B | 75.6 | | [[zhang-2025-videollama-3]] |
| TCoT (Gemini Flash) | 81.0 | baseline 80.0 | [[arnab-2025-temporal-chain-of-thought]] |

## Sources

- [[li-2024-mvbench]] — zero-shot and in-domain comparison.
- [[zhang-2024-llovi]] — caption-based SOTA (+10.2 vs. prior).
- [[arnab-2025-temporal-chain-of-thought]] — evaluates TCoT (81.0 vs. 80.0).
- [[mangalam-2023-egoschema]] — certificate length comparison (NExT-QA ~5 s vs. EgoSchema ~100 s).
- [[zhang-2025-videollama-3]] — evaluates VideoLLaMA 3.
- [[kim-2026-sink-token-aware-pruning]] — evaluates SToP on NextQA.

## Related concepts

- [[video-question-answering]] — paradigm.
- [[multiple-choice-qa]] — format.
- [[long-video-understanding]] — adjacent task (here short-form).
- [[mvbench]] — temporal multi-task predecessor.
- [[egoschema]] — long-form variant.
- [[intentqa]] — related benchmark (cited in LLoVi).
- [[certificate-length]] — used for comparison.
