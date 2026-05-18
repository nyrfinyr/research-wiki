---
title: RealWorldQA
type: concept
tags: [benchmark, image-vqa, vision-centric, real-world]
created: 2026-05-15
updated: 2026-05-15
---

# RealWorldQA

**RealWorldQA** is a vision-centric image VQA benchmark designed to test understanding of real scenes from a pragmatic standpoint (e.g., questions typical of AI assistants in physical scenarios). Released by xAI, it is one of the standard tests for image-first VLMs.

## Reference numbers

| Model | RealWorldQA | Source |
|---|---|---|
| Claude 3.5 Sonnet | 60.1 | [[qwen2-5-vl-2025-tech-report]] |
| GPT-4o | 75.4 | [[qwen2-5-vl-2025-tech-report]] |
| InternVL2.5-78B | 78.7 | [[qwen2-5-vl-2025-tech-report]] |
| Qwen2-VL-72B | 77.8 | [[qwen2-5-vl-2025-tech-report]] |
| Qwen2.5-VL-7B | 68.5 | [[qwen2-5-vl-2025-tech-report]] |
| Qwen2.5-VL-72B | 75.7 | [[qwen2-5-vl-2025-tech-report]] |
| Qwen3-VL-235B-A22B thinking | **81.3** | [[qwen3-vl-2025-tech-report]] |
| VideoLLaMA 3-7B | 72.7 | [[zhang-2025-videollama-3]] |
| VideoLLaMA 3-2B | 67.3 | [[zhang-2025-videollama-3]] |

Also used as a vision-centric evaluation benchmark in [[morini-2026-look-twice]] (LoT).

## Sources

- [[qwen2-5-vl-2025-tech-report]] — evaluates Qwen2.5-VL.
- [[qwen3-vl-2025-tech-report]] — evaluates Qwen3-VL.
- [[zhang-2025-videollama-3]] — evaluates VideoLLaMA 3.
- [[morini-2026-look-twice]] — evaluation benchmark for the LoT method.

## Related concepts

- [[vision-language-model]] — evaluated models.
- [[v-star]] — adjacent vision-centric benchmark.
- [[pope]], [[amber]] — adjacent hallucination benchmarks.
