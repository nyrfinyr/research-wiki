---
title: Perception Test
type: concept
tags: [benchmark, video, multi-task, perception]
created: 2026-05-15
updated: 2026-05-15
---

# Perception Test

**Perception Test** is a multi-task video understanding benchmark developed by Google DeepMind, focused on evaluating basic perceptual capabilities (memory, abstraction, physical reasoning, semantics). In the wiki it appears in two roles: (1) as a **data source** for [[mvbench]] (Object Shuffle, Action Count, State Change, Character Order tasks — see [[li-2024-mvbench]] §3.2) and (2) as an **evaluation benchmark** for modern video-LLMs in tech reports.

## Reference numbers

Selected results (test split):

| Model | PerceptionTest | Source |
|---|---|---|
| Qwen2.5-VL-3B | 66.9 | [[qwen2-5-vl-2025-tech-report]] |
| Qwen2.5-VL-7B | 70.5 | [[qwen2-5-vl-2025-tech-report]] |
| Qwen2.5-VL-72B | 73.2 | [[qwen2-5-vl-2025-tech-report]] |
| VideoLLaMA 3-2B | 68.0 | [[zhang-2025-videollama-3]] |
| VideoLLaMA 3-7B | 72.8 | [[zhang-2025-videollama-3]] |
| Qwen2-VL-7B | 62.3 | [[zhang-2025-videollama-3]] |
| InternVL2.5-8B | 68.9 | [[zhang-2025-videollama-3]] |
| Apollo-2B | 61.0 | [[zhang-2025-videollama-3]] |

## Sources

- [[li-2024-mvbench]] — source of 4 tasks derived for MVBench.
- [[qwen2-5-vl-2025-tech-report]] — evaluates Qwen2.5-VL.
- [[zhang-2025-videollama-3]] — evaluates VideoLLaMA 3.

## Related concepts

- [[video-question-answering]] — task.
- [[mvbench]] — benchmark that uses it as a source.
- [[video-llm]] — evaluated models.
