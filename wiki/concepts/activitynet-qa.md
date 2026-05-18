---
title: ActivityNet-QA
type: concept
tags: [benchmark, video-qa, activity-recognition]
created: 2026-05-15
updated: 2026-05-15
---

# ActivityNet-QA

**ActivityNet-QA** is a Video-QA benchmark based on ActivityNet videos, focused on questions about actions and activities. Cited as a comparison benchmark in many video MLLM tech reports, it has a median [[certificate-length]] of ~1–3 s [source: raw/papers/mangalam-2023-egoschema.pdf Fig. 3] — classified as short-form. [[zhang-2024-llovi]] cites it as a benchmark that "requires only short clips".

## Reference numbers

Selected zero-shot results:

| Model | ActivityNet-QA | Source |
|---|---|---|
| VideoChatGPT | 35.2 | [[li-2024-mvbench]] |
| VideoChat2 | 49.1 | [[li-2024-mvbench]] |
| VideoLLaMA 3-2B | 58.2 | [[zhang-2025-videollama-3]] |
| VideoLLaMA 3-7B | 61.3 | [[zhang-2025-videollama-3]] |
| Qwen2-VL-7B | 57.4 | [[zhang-2025-videollama-3]] |
| InternVL2.5-8B | 58.9 | [[zhang-2025-videollama-3]] |
| NVILA-8B | 60.9 | [[zhang-2025-videollama-3]] |

## Sources

- [[mangalam-2023-egoschema]] — certificate length comparison.
- [[zhang-2024-llovi]] — cited as a short-clip benchmark.
- [[li-2024-mvbench]] — evaluates VideoChat2 zero-shot.
- [[zhang-2025-videollama-3]] — evaluates VideoLLaMA 3.

## Related concepts

- [[video-question-answering]] — task.
- [[next-qa]], [[mvbench]] — adjacent benchmarks.
- [[certificate-length]] — comparison metric.
