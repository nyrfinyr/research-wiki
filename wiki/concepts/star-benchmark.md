---
title: STAR Benchmark
type: concept
tags: [benchmark, video, situated-reasoning]
created: 2026-05-15
updated: 2026-05-15
---

# STAR Benchmark

**STAR (Situated Reasoning in Real-World Videos)** is a video reasoning benchmark that requires reasoning over real-world scenes with spatial and temporal grounding (interaction, sequence, prediction, feasibility). In the wiki it appears as the **source** of the Action Sequence, Action Prediction, and Object Interaction tasks of [[mvbench]] [source: raw/papers/li-2024-mvbench.pdf §3.2]; MVBench authors apply *random start/end shifts* to increase difficulty.

## Reference numbers

| Model | STAR (zero-shot avg) | Source |
|---|---|---|
| VideoChat2 | 59.0 | [[li-2024-mvbench]] |
| VideoChat2 + Mistral | 63.8 | [[li-2024-mvbench]] |

## Sources

- [[li-2024-mvbench]] — source of 3 MVBench tasks.

## Related concepts

- [[video-question-answering]] — task.
- [[mvbench]] — derived benchmark.
- [[next-qa]], [[clevrer]] — adjacent benchmarks.
