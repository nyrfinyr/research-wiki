---
title: MVBench
type: concept
tags: [benchmark, video-qa, mllm, temporal-understanding, multiple-choice-qa]
created: 2026-05-15
updated: 2026-05-15
---

# MVBench

MVBench (Multi-modal Video understanding Benchmark) is a video-QA benchmark for MLLMs introduced by [[li-2024-mvbench]]. It is distinguished by its **static-to-dynamic** construction method: for each of the 9 static tasks of image benchmarks (Action, Object, Position, Scene, Count, Attribute, Pose, Character, Cognition) the authors derive dynamic versions that require temporal understanding and cannot be solved from a single frame. The 4,000 multiple-choice QAs (200 per task) are automatically generated from 11 public video datasets via ChatGPT, preserving the original ground-truth. It dominates the "short-clip temporal" evaluations (5–35 s) of all MLLM tech reports.

## Composition / Protocol

- **20 tasks** derived from 9 static spatial tasks (Fig. 1), in 9 families [source: raw/papers/li-2024-mvbench.pdf §3.1]:
  - Action: Sequence, Prediction, Antonym, Fine-grained, Unexpected.
  - Object: Existence, Interaction, Shuffle.
  - Position: Moving Direction, Action Localization.
  - Scene: Scene Transition.
  - Count: Action Count, Moving Count.
  - Attribute: Moving Attribute, State Change.
  - Pose: Fine-grained Pose.
  - Character: Character Order.
  - Cognition: Egocentric Navigation, Episodic Reasoning, Counterfactual Inference.
- **200 QA per task × 20 tasks = 4,000 total QAs**, multiple-choice format (random baseline 27.3).
- Clips of **5–35 s** length (filtered for temporal sensitivity).
- Generated via an automatic pipeline from 11 datasets: [[star-benchmark]], PAXION, Moments in Time, FunQA, [[clevrer]], [[perception-test]], [[charades-sta]], MoVQA, NTU RGB+D, VLN-CE, [[tvqa]].
- "Best Option: (" prompt design → 100% option extraction, direct accuracy without LLM judge (Tab. 9).

## Reference numbers

From the original paper [source: raw/papers/li-2024-mvbench.pdf Tab. 2]:

| Model | LLM | Avg |
|---|---|---|
| Random | — | 27.3 |
| MiniGPT-4 | Vicuna-7B | 18.8 |
| VideoLLaMA | Vicuna-7B | 34.1 |
| VideoChat | Vicuna-7B | 35.5 |
| VideoChatGPT | Vicuna-7B | 32.7 |
| GPT-4V (16 frames) | GPT-4 | 43.5 |
| **VideoChat2** | Vicuna-7B | 51.1 |
| **VideoChat2 + Mistral-7B** | Mistral-7B | **60.4** |

Results from later source pages in the wiki:

| Model | MVBench | Source |
|---|---|---|
| Qwen2.5-VL-3B | 67.0 | [[qwen2-5-vl-2025-tech-report]] |
| Qwen2.5-VL-7B | 69.6 | [[qwen2-5-vl-2025-tech-report]] |
| Qwen2.5-VL-72B | **70.4** | [[qwen2-5-vl-2025-tech-report]] |
| Gemini 1.5 Pro | 60.5 | [[qwen2-5-vl-2025-tech-report]] |
| GPT-4o | 64.6 | [[qwen2-5-vl-2025-tech-report]] |
| VideoLLaMA 3-2B | 65.5 | [[zhang-2025-videollama-3]] |
| VideoLLaMA 3-7B | 69.7 | [[zhang-2025-videollama-3]] |
| InternVL2.5-8B | 72.0 | [[zhang-2025-videollama-3]] |
| Qwen3-VL-8B inst | — | [[qwen3-vl-2025-tech-report]] |
| Qwen3-VL-32B inst | — | [[qwen3-vl-2025-tech-report]] |
| Qwen3-VL-235B-A22B thinking | 75.2 | [[qwen3-vl-2025-tech-report]] |

VideoChat2 is strong on action/object/scene/attribute/pose, but weak on position/count/character — counting is a "joint bottleneck" shared with [[video-mme]].

## Sources

- [[li-2024-mvbench]] — introduces the benchmark and VideoChat2.
- [[qwen2-5-vl-2025-tech-report]] — evaluates the Qwen2.5-VL family.
- [[qwen3-vl-2025-tech-report]] — evaluates the Qwen3-VL family.
- [[zhang-2025-videollama-3]] — evaluates VideoLLaMA 3.
- [[mangalam-2023-egoschema]] — certificate length comparison (~5 s vs. ~100 s for EgoSchema).
- [[fu-2025-video-mme]] — comparison in Tab. 1.
- [[wang-2025-lvbench]] — comparison in Tab. 1.
- [[kim-2026-sink-token-aware-pruning]] — uses MVBench as a benchmark.
- [[tang-2025-adaptive-keyframe-sampling]] — does not evaluate directly but cites.

## Related concepts

- [[multimodal-large-language-model]] — object of evaluation.
- [[video-llm]] — typical sub-family.
- [[video-question-answering]] — paradigm.
- [[multiple-choice-qa]] — format.
- [[star-benchmark]] — source of 3 tasks.
- [[clevrer]] — source of 4 tasks.
- [[charades-sta]] — source of Action Localization.
- [[perception-test]] — source of 4 tasks.
- [[tvqa]] — source of Episodic Reasoning.
- [[egoschema]] — certificate length comparison.
- [[video-mme]] — successor benchmark.
- [[lvbench]] — long-video benchmark.
