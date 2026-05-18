---
title: VNBench
type: concept
tags: [benchmark, video, needle-in-haystack, long-video]
created: 2026-05-15
updated: 2026-05-15
---

# VNBench

**VNBench (Video Needle-in-Benchmark)** is a long-video **needle-in-a-haystack** benchmark for MLLMs: a small "needle" (frame, event, object) is inserted into a long "haystack" video and the model must retrieve it or reason about it. It is designed to stress temporal retrieval capability under long-context.

In the wiki it appears as one of the 5 evaluation benchmarks of [[doorenbos-2026-video-panels|Video Panels]], where paneling shines precisely on needle-in-haystack tasks [source: raw/papers/doorenbos-2026-video-panels.pdf §1].

## Sources

- [[doorenbos-2026-video-panels]] — uses VNBench as one of the 5 benchmarks; "needle-in-a-haystack" category.

## Related concepts

- [[needle-in-a-haystack]] — paradigm.
- [[long-video-understanding]] — target task.
- [[long-context]] — modeling requirement.
- [[video-mme]], [[mlvu]], [[lvbench]], [[timescope]] — adjacent long-video benchmarks.
