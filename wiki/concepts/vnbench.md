---
title: VNBench
type: concept
tags: [benchmark, video, needle-in-haystack, long-video]
created: 2026-05-15
updated: 2026-05-15
---

# VNBench

**VNBench (Video Needle-in-Benchmark)** è un benchmark long-video di tipo **needle-in-a-haystack** per MLLM: una piccola "needle" (frame, evento, oggetto) è inserita in un video lungo "haystack" e il modello deve recuperarla o ragionare su di essa. È pensato per stressare la capacità di retrieval temporale in long-context.

Nel wiki appare come uno dei 5 benchmark di valutazione di [[doorenbos-2026-video-panels|Video Panels]], dove il paneling brilla proprio sui task di tipo needle-in-haystack [source: raw/papers/doorenbos-2026-video-panels.pdf §1].

## Sources

- [[doorenbos-2026-video-panels]] — usa VNBench come uno dei 5 benchmark; categoria "needle-in-a-haystack".

## Concetti correlati

- [[needle-in-a-haystack]] — paradigma.
- [[long-video-understanding]] — task target.
- [[long-context]] — esigenza modellistica.
- [[video-mme]], [[mlvu]], [[lvbench]], [[timescope]] — benchmark long-video adiacenti.
