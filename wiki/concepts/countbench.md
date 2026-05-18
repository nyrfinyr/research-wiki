---
title: CountBench
type: concept
tags: [benchmark, image, counting, vision-language]
created: 2026-05-15
updated: 2026-05-15
---

# CountBench

**CountBench** is a counting benchmark for VLMs: count how many objects of a given class are present in an image. It is a recurring test for models that perform open-vocabulary grounding; *counting* is notoriously a *joint bottleneck* for video-LLMs (see MVBench "Action Count / Moving Count" and Video-MME counting analysis).

## Reference numbers

| Model | CountBench | Source |
|---|---|---|
| Gemini 1.5 Pro | 85.5 | [[qwen2-5-vl-2025-tech-report]] |
| Molmo 72B | 91.2 | [[qwen2-5-vl-2025-tech-report]] |
| InternVL2.5-78B | 72.1 | [[qwen2-5-vl-2025-tech-report]] |
| Qwen2.5-VL-72B | **93.6** | [[qwen2-5-vl-2025-tech-report]] |
| Qwen3-VL-235B-A22B thinking | 93.7 | [[qwen3-vl-2025-tech-report]] |
| Qwen3-VL-235B-A22B inst | 93.0 | [[qwen3-vl-2025-tech-report]] |
| GPT-5 high | 91.7 | [[qwen3-vl-2025-tech-report]] |
| Claude Opus 4.1 | 93.1 | [[qwen3-vl-2025-tech-report]] |

## Sources

- [[qwen2-5-vl-2025-tech-report]] — evaluates Qwen2.5-VL.
- [[qwen3-vl-2025-tech-report]] — evaluates Qwen3-VL.

## Related concepts

- [[vision-language-model]] — evaluated models.
- [[grounding]] — related task.
- [[mvbench]] — benchmark with counting sub-tasks (Action Count, Moving Count).
