---
title: LongVideoBench
type: concept
tags: [benchmark, video-qa, mllm, long-video, referring-qa]
created: 2026-05-15
updated: 2026-05-15
---

# LongVideoBench

LongVideoBench is a long-form video question-answering benchmark with "referring" questions (the question refers to a specific moment in the video). It is standard in MLLM tech report evaluations alongside [[video-mme]] and [[mlvu]], in particular for measuring the ability to localize and reason about segments of long videos.

## Composition / Protocol

- Long-form videos (medium-long durations); multiple-choice referring questions.
- Typical evaluation frame cap: 32–64 frames for open-source models, 256 frames for closed-source.
- Metric: multiple-choice accuracy; eval set on val split.

## Reference numbers

Results from wiki source pages (val split):

| Model | LongVideoBench val | Source |
|---|---|---|
| Qwen2-VL-2B | 48.7 | [[zhang-2025-videollama-3]] |
| Qwen2-VL-7B | 55.6 | [[zhang-2025-videollama-3]] |
| InternVL2.5-2B | 52.0 | [[zhang-2025-videollama-3]] |
| InternVL2.5-8B | 60.0 | [[zhang-2025-videollama-3]] |
| LLaVA-Video-7B | 58.2 | [[zhang-2025-videollama-3]] |
| LLaVA-OneVision 7B | 54.8 | [[tang-2025-adaptive-keyframe-sampling]] |
| LLaVA-Video 7B (64 frames) | 58.9 | [[tang-2025-adaptive-keyframe-sampling]] |
| LLaVA-Video 7B + AKS | 62.7 | [[tang-2025-adaptive-keyframe-sampling]] (+3.8) |
| VideoLLaMA 3-2B | 57.1 | [[zhang-2025-videollama-3]] |
| VideoLLaMA 3-7B | 59.8 | [[zhang-2025-videollama-3]] |
| Qwen2.5-VL-3B | 54.2 | [[qwen2-5-vl-2025-tech-report]] |
| Qwen2.5-VL-7B | 56.0 | [[qwen2-5-vl-2025-tech-report]] |
| Qwen2.5-VL-72B | 60.7 | [[qwen2-5-vl-2025-tech-report]] |
| Gemini 1.5 Pro | 64.0 | [[qwen2-5-vl-2025-tech-report]] |
| GPT-4o | 66.7 | [[qwen2-5-vl-2025-tech-report]] |

Qwen2.5-VL-72B remains behind Gemini 1.5 Pro and GPT-4o on LongVideoBench (together with Video-MME), one of the few video benchmarks where it is not the leader.

## Sources

- [[qwen2-5-vl-2025-tech-report]] — reports Qwen2.5-VL and closed-source baselines.
- [[zhang-2025-videollama-3]] — evaluates VideoLLaMA 3 (2B and 7B).
- [[tang-2025-adaptive-keyframe-sampling]] — uses LongVideoBench as main benchmark (+3.8 points with AKS on LLaVA-Video-7B).
- [[wang-2025-lvbench]] — comparison in Tab. 1.
- [[kim-2025-map-the-flow]] — validates pathway analysis on LongVideoBench (Tab. A).
- [[kim-2026-sink-token-aware-pruning]] — evaluates SToP on LongVideoBench.

## Related concepts

- [[long-video-understanding]] — task.
- [[video-mme]] — complementary benchmark.
- [[mlvu]] — complementary benchmark.
- [[lvbench]] — extreme long-video benchmark.
- [[video-llm]] — evaluated models.
