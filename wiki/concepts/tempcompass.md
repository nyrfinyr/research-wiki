---
title: TempCompass
type: concept
tags: [benchmark, video, temporal-reasoning]
created: 2026-05-15
updated: 2026-05-15
---

# TempCompass

**TempCompass** is a temporal reasoning benchmark for video MLLMs, focused on the ability to reason over order, duration, direction, and other temporal dimensions. It complements the "temporal" benchmarks of [[mvbench]] (Action Sequence, Moving Direction, etc.) and typically appears in MLLM tech reports alongside [[video-mme]], [[mlvu]], [[longvideobench]].

## Reference numbers

| Model | TempCompass Avg | Source |
|---|---|---|
| Qwen2.5-VL-3B | 64.4 | [[qwen2-5-vl-2025-tech-report]] |
| Qwen2.5-VL-7B | 71.7 | [[qwen2-5-vl-2025-tech-report]] |
| Qwen2.5-VL-72B | 74.8 | [[qwen2-5-vl-2025-tech-report]] |
| Gemini 1.5 Pro | 67.1 | [[qwen2-5-vl-2025-tech-report]] |
| GPT-4o | 73.8 | [[qwen2-5-vl-2025-tech-report]] |
| VideoLLaMA 3-2B | 63.4 | [[zhang-2025-videollama-3]] |
| VideoLLaMA 3-7B | — | [[zhang-2025-videollama-3]] |
| Apollo-2B | 60.8 | [[zhang-2025-videollama-3]] |

## Sources

- [[qwen2-5-vl-2025-tech-report]] — evaluates Qwen2.5-VL.
- [[zhang-2025-videollama-3]] — evaluates VideoLLaMA 3.
- [[fu-2025-video-mme]] — comparison in Tab. 1.

## Related concepts

- [[video-question-answering]] — task.
- [[temporal-understanding]] — capability measured.
- [[mvbench]] — adjacent benchmark with temporal focus.
