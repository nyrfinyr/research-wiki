---
title: LVBench
type: concept
tags: [benchmark, video-qa, mllm, long-video, multi-hour-video, temporal-reasoning]
created: 2026-05-15
updated: 2026-05-15
---

# LVBench

LVBench is a video-QA benchmark for **extremely long videos** introduced by [[wang-2025-lvbench]]: 103 YouTube videos totaling 117 hours (average duration **4101 s ≈ 68 min**, ~4× longer than Video-MME), 1,549 manually annotated multiple-choice questions. Defines "long video" as ≥ 30 min with multiple events, scene transitions and rich visual content. Questions cover 6 core compositional capabilities, and the human baseline is 94.4%.

## Composition / Protocol

- **103 YouTube videos** filtered on 5 criteria (Clear Protagonist Presence, Structural Coherence, Event Density ≥ 1 event/5 min, Visual Clarity ≥ 720p, Modality Independence) [source: raw/papers/wang-2025-lvbench.pdf §3.1].
- 6 thematic categories: Sports Competitions, Documentary Films, Event Records, Lifestyle and Daily Activities, TV Shows and Drama Series, Cartoon Videos.
- **1,549 QA pairs** with 4 options (random baseline 25%).
- **6 core capabilities**: Temporal Grounding (TG), Summarization (Sum), Reasoning (Rea), Entity Recognition (ER), Event Understanding (EU), Key Information Retrieval (KIR). Combined into 26 compositional sub-categories — each QA typically requires multiple skills together [source: raw/papers/wang-2025-lvbench.pdf §3.2].
- **Manual annotation**: ~24 questions/hour of video, each QA with 4 options of similar length + annotation of *clue duration* (analog of [[certificate-length]]).
- **Dual-LLM blind filter**: QA where **both** GLM-4 **and** GPT-4 answer correctly without video are discarded (stricter criterion than the single-LLM filter of [[video-mme]]).
- **Audio excluded**: videos provide only frames [source: raw/papers/wang-2025-lvbench.pdf §5].
- **Eval protocol**: minimal prompt `Question + 4 options + "directly provide the letter"`; extraction via regex; native long-video models @ 1 fps, non-native @ 32 or 96 frames.

## Reference numbers

Selected results from the paper [source: raw/papers/wang-2025-lvbench.pdf Tab. 2-3]:

| Model | Overall | TG | KIR | Rea | Note |
|---|---|---|---|---|---|
| Gemini-1.5-Pro | 33.1 | 31.8 | 39.3 | 27.0 | native long-video |
| Qwen2-VL-72B | 41.3 | 41.4 | 38.3 | 46.5 | native |
| Qwen2.5-VL-72B | 44.0 | 37.7 | 55.6 | 45.2 | native |
| Gemini-2.0-Flash | 48.6 | 39.3 | 56.8 | 44.4 | native |
| Gemini-2.5-Flash | 56.7 | 52.7 | 63.8 | 55.5 | native |
| MR.Video | 60.8 | 58.8 | 71.4 | 57.7 | Gemini-2.0 backbone |
| Seed1.5-VL-Thinking | 64.6 | 53.6 | 68.0 | 63.7 | native |
| **Gemini-2.5-Pro** | **67.4** | **65.9** | **72.8** | **66.5** | native, best 5/6 tasks |
| GPT-4o | 48.9 | 40.9 | 48.1 | 50.3 | non-native |
| mPLUG-Owl3 | 43.5 | 41.1 | 42.4 | 47.5 | non-native |
| VideoLLaMA3-7B | 45.3 | 35.9 | 47.8 | 45.8 | non-native |
| **Human** | **94.4** | — | — | — | 27-point gap |

Results from additional source pages:

| Model | LVBench | Source |
|---|---|---|
| Qwen2.5-VL-3B | 43.3 | [[qwen2-5-vl-2025-tech-report]] |
| Qwen2.5-VL-7B | 45.3 | [[qwen2-5-vl-2025-tech-report]] |
| Qwen2.5-VL-72B | **47.3** | [[qwen2-5-vl-2025-tech-report]] (vs Gemini 1.5 Pro 33.1, +14.2) |
| VideoLLaMA 3-2B | 41.6 | [[zhang-2025-videollama-3]] |
| VideoLLaMA 3-7B | 45.3 | [[zhang-2025-videollama-3]] |
| Qwen3-VL-8B inst | 58.0 | [[qwen3-vl-2025-tech-report]] |
| Qwen3-VL-32B inst | 63.8 | [[qwen3-vl-2025-tech-report]] |
| Qwen3-VL-235B-A22B inst | 67.7 | [[qwen3-vl-2025-tech-report]] |
| LLaVA-Video-7B + AKS | 62.7 | [[tang-2025-adaptive-keyframe-sampling]] (+3.8 vs baseline) |
| TCoT (Gemini Flash, 32K) | 61.7 | [[arnab-2025-temporal-chain-of-thought]] (+11.4 vs baseline) |

## Sources

- [[wang-2025-lvbench]] — introduces the benchmark.
- [[qwen2-5-vl-2025-tech-report]] — evaluates the Qwen2.5-VL family (best Qwen2.5-VL 72B = 47.3).
- [[qwen3-vl-2025-tech-report]] — evaluates the Qwen3-VL family.
- [[zhang-2025-videollama-3]] — evaluates VideoLLaMA 3.
- [[tang-2025-adaptive-keyframe-sampling]] — uses LVBench as main benchmark.
- [[arnab-2025-temporal-chain-of-thought]] — uses LVBench as benchmark; +11.4 points with TCoT.
- [[doorenbos-2026-video-panels]] — reference.

## Related concepts

- [[long-video-understanding]] — target task.
- [[multimodal-large-language-model]] — object of evaluation.
- [[video-llm]] — typical sub-family.
- [[multiple-choice-qa]] — format.
- [[certificate-length]] / clue duration — concept adopted.
- [[video-mme]] — long-video predecessor.
- [[egoschema]] — long-form egocentric predecessor.
- [[mvbench]] — short-clip predecessor.
