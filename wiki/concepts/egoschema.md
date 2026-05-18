---
title: EgoSchema
type: concept
tags: [benchmark, video-qa, long-form-video, egocentric, multiple-choice-qa]
created: 2026-05-15
updated: 2026-05-15
---

# EgoSchema

EgoSchema is a diagnostic benchmark of **very long-form video question-answering** introduced by [[mangalam-2023-egoschema]]: 5,063 multiple-choice questions (5 options) on **3-minute** egocentric clips extracted from [[ego4d]], for a total of ~250 hours of video. The conceptual contribution is the notion of **temporal certificate length** (see [[certificate-length]]): the median for EgoSchema is ~100 s, **5.7×** longer than LVU (the second dataset) and **25–100×** longer than NextQA, AGQA, MSRVTT, ActivityNet-QA, Kinetics. It serves as a standard probe for long-video MLLMs and is cited in nearly all subsequent tech reports and training-free method papers.

## Composition / Protocol

- **5,063 QA pairs** (Fullset with server-side eval) + **500 QA Subset** with public ground-truth.
- 3-min clips each; 5 options per QA → random baseline = 20 % [source: raw/papers/mangalam-2023-egoschema.pdf §3.1, §4.2].
- Videos from Ego4D, filtered to non-overlapping 3-min clips with ≥ 30 timestamped narrations.
- QAW generation via a 4-stage LLM-in-the-loop pipeline (filtering → Q(AW)-shot generation with GPT-4/Bard/Claude → LLM blind filter → 2 rounds of human curation, with a **certificate length ≥ 30 s** constraint).
- Metric: multiple-choice accuracy (direct letter match). Standard zero-shot setting.
- Frames sampled uniformly from the 3-min clip; #frames varies by model (5–180 in the original evaluation).

## Reference numbers

Results from the wiki's source pages:

| Model | #frame | Acc Fullset | Source |
|---|---|---|---|
| Random | — | 20.0 | [[mangalam-2023-egoschema]] |
| FrozenBiLM | 90 | 26.9 | [[mangalam-2023-egoschema]] |
| mPLUG-Owl | 5 | 31.1 | [[mangalam-2023-egoschema]] |
| InternVideo | 90 | 32.1 | [[mangalam-2023-egoschema]] |
| Human | — | 76.0 | [[mangalam-2023-egoschema]] |
| VideoChat2-Mistral | 16 | 54.4 | [[li-2024-mvbench]] |
| LLoVi (GPT-4 + LaViLa) | — | 61.2 | [[zhang-2024-llovi]] |
| Qwen2.5-VL-3B | 768 cap | 64.8 | [[qwen2-5-vl-2025-tech-report]] |
| Qwen2.5-VL-7B | 768 cap | 65.0 | [[qwen2-5-vl-2025-tech-report]] |
| GPT-4o | — | 72.2 | [[qwen2-5-vl-2025-tech-report]] |
| Gemini 1.5 Pro | — | 71.2 | [[qwen2-5-vl-2025-tech-report]] |
| Qwen2.5-VL-72B | 768 cap | **76.2** | [[qwen2-5-vl-2025-tech-report]] |
| VideoLLaMA 3-7B | 180 (1fps) | 63.3 | [[zhang-2025-videollama-3]] |
| VideoLLaMA 3-2B | 180 | 58.5 | [[zhang-2025-videollama-3]] |
| TCoT (Gemini Flash, Subset) | dyn-seg | 75.2 | [[arnab-2025-temporal-chain-of-thought]] |
| TCoT (Gemini Flash, Fullset) | dyn-seg | 69.1 | [[arnab-2025-temporal-chain-of-thought]] |

Qwen2.5-VL-72B is the first open-weight MLLM to match the human baseline on the Fullset (76.2 vs 76.0).

## Sources

- [[mangalam-2023-egoschema]] — introduces the benchmark and defines certificate length.
- [[li-2024-mvbench]] — evaluates VideoChat2/VideoChat2-Mistral in zero-shot.
- [[fu-2025-video-mme]] — compares certificate length with its own short/medium/long bands.
- [[wang-2025-lvbench]] — cites EgoSchema in Tab. 1 as a predecessor.
- [[zhang-2024-llovi]] — reports 61.2 % SOTA on Fullset (GPT-4 + LaViLa captions).
- [[arnab-2025-temporal-chain-of-thought]] — evaluates TCoT (75.2 % Subset / 69.1 % Fullset).
- [[tang-2025-adaptive-keyframe-sampling]] — cites as a reference benchmark.
- [[zhang-2025-videollama-3]] — reports VideoLLaMA 3 numbers (63.3 / 58.5).
- [[doorenbos-2026-video-panels]] — cites as a reference benchmark.
- [[qwen2-5-vl-2025-tech-report]] — reports the Qwen2.5-VL family numbers.

## Related concepts

- [[certificate-length]] — metric introduced in the paper.
- [[ego4d]] — video source.
- [[long-video-understanding]] — target task.
- [[video-question-answering]] — paradigm.
- [[multiple-choice-qa]] — question format.
- [[video-mme]] — subsequent benchmark that adopts certificate length.
- [[lvbench]] — long-video benchmark with an analogous concept (clue duration).
- [[mvbench]] — short-clip temporal benchmark.
