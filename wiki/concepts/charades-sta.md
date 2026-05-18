---
title: Charades-STA
type: concept
tags: [benchmark, video, temporal-grounding, moment-retrieval]
created: 2026-05-15
updated: 2026-05-15
---

# Charades-STA

**Charades-STA** is a **temporal grounding / moment retrieval** benchmark: given a video and a textual description, localize the corresponding temporal segment (start, end). Main metric: **mIoU** (mean Intersection-over-Union). It is one of the standard tests for measuring an MLLM's ability to reason on the timeline at second-level granularity.

In the wiki it appears as the source of MVBench's "Action Localization" task in [[mvbench]] [source: raw/papers/li-2024-mvbench.pdf §3.2] and as an evaluation benchmark in the Qwen tech reports.

## Reference numbers

Temporal grounding mIoU results:

| Model | Charades-STA mIoU | Source |
|---|---|---|
| GPT-4o | 35.7 | [[qwen2-5-vl-2025-tech-report]] |
| Qwen2.5-VL-3B | 38.8 | [[qwen2-5-vl-2025-tech-report]] |
| Qwen2.5-VL-7B | 43.6 | [[qwen2-5-vl-2025-tech-report]] |
| Qwen2.5-VL-72B | **50.9** | [[qwen2-5-vl-2025-tech-report]] (+15.2 vs GPT-4o) |
| VideoLLaMA 3-2B | 55.5 | [[zhang-2025-videollama-3]] |
| VideoLLaMA 3-7B | 60.7 | [[zhang-2025-videollama-3]] |
| Qwen3-VL-235B-A22B inst | 64.8 | [[qwen3-vl-2025-tech-report]] |

Qwen2.5-VL motivates the absolute-time aligned T-RoPE precisely from the jump on Charades-STA, where second-level temporal grounding is critical.

## Sources

- [[qwen2-5-vl-2025-tech-report]] — evaluates and motivates T-RoPE.
- [[qwen3-vl-2025-tech-report]] — evaluates Qwen3-VL.
- [[zhang-2025-videollama-3]] — evaluates VideoLLaMA 3.
- [[li-2024-mvbench]] — source of Action Localization.

## Related concepts

- [[temporal-grounding]] — task.
- [[mvbench]] — benchmark that uses it as source.
- [[video-llm]] — evaluated models.
- [[mrope]] / T-RoPE — mechanism it motivates.
