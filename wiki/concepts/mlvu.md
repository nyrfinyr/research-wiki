---
title: MLVU
type: concept
tags: [benchmark, video-qa, mllm, long-video, multi-task]
created: 2026-05-15
updated: 2026-05-15
---

# MLVU

MLVU (Multi-task Long Video Understanding) is a multi-task long-form video-QA benchmark, widely used as a complement to [[video-mme]] and [[longvideobench]] in evaluations of modern video MLLMs. It measures comprehension on medium-long durations with a mix of tasks (holistic, perception, ordering, summarization) and an aggregate "M-Avg" metric.

## Composition / Protocol

- Multi-task long-form video QA; durations typically in the tens-of-minutes range.
- Main metric **M-Avg** (multiple-choice average).

## Reference numbers

Selected results from wiki source pages:

| Model | MLVU M-Avg | Source |
|---|---|---|
| Qwen2.5-VL-3B | 68.2 | [[qwen2-5-vl-2025-tech-report]] |
| Qwen2.5-VL-7B | 70.2 | [[qwen2-5-vl-2025-tech-report]] |
| Qwen2.5-VL-72B | 74.6 | [[qwen2-5-vl-2025-tech-report]] (+10 vs GPT-4o) |
| GPT-4o | 64.6 | [[qwen2-5-vl-2025-tech-report]] |
| VideoLLaMA 3-2B (dev) | 65.4 | [[zhang-2025-videollama-3]] |
| VideoLLaMA 3-7B (dev) | 73.0 | [[zhang-2025-videollama-3]] |
| Apollo-7B | 70.9 | [[zhang-2025-videollama-3]] |
| InternVL2.5-8B | 69.0 | [[zhang-2025-videollama-3]] |
| Qwen3-VL-235B-A22B thinking | 83.8 | [[qwen3-vl-2025-tech-report]] |
| Qwen3-VL-235B-A22B inst | 84.3 | [[qwen3-vl-2025-tech-report]] |
| Gemini 2.5 Pro (thinking) | 85.6 | [[qwen3-vl-2025-tech-report]] |
| GPT-5 high | 86.2 | [[qwen3-vl-2025-tech-report]] |

## Sources

- [[qwen2-5-vl-2025-tech-report]] — evaluates Qwen2.5-VL.
- [[qwen3-vl-2025-tech-report]] — evaluates Qwen3-VL; Qwen3-VL-235B "attains or even surpasses Gemini-2.5-Pro" on MLVU [§5.9].
- [[zhang-2025-videollama-3]] — evaluates VideoLLaMA 3.
- [[doorenbos-2026-video-panels]] — uses MLVU as one of the 5 evaluation benchmarks (with a slight loss on the ordering task, −1.2%).
- [[kim-2026-sink-token-aware-pruning]] — evaluates SToP on MLVU.

## Related concepts

- [[long-video-understanding]] — task.
- [[video-mme]] — complementary benchmark.
- [[longvideobench]] — complementary benchmark.
- [[lvbench]] — extreme long-video benchmark.
- [[video-llm]] — evaluated models.
