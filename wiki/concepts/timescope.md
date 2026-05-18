---
title: TimeScope
type: concept
tags: [benchmark, video, long-video, evaluation]
created: 2026-05-15
updated: 2026-05-15
---

# TimeScope

**TimeScope** is a long-video benchmark focused on very extended durations: the "Long" sub-tranche has an average duration of **27,600 s ≈ 7.7 h** [source: raw/papers/doorenbos-2026-video-panels.pdf §1]. In the wiki it is the benchmark that shows the **biggest gain** of [[doorenbos-2026-video-panels|Video Panels]] on VideoLLaMA 3 7B: 39.1 → 46.7 (+7.6 / +19.4 % relative).

## Reference numbers (TimeScope Long)

Results from [[doorenbos-2026-video-panels]] §4:

| Model | Default | + Panels | Δ |
|---|---|---|---|
| VideoLLaMA 3 7B (180 frames) | 39.1 | 46.7 | +7.6 |
| LLaVA-OV 7B (panels @ 23-25k tokens) | 58.7 | 69.5 | +10.8 |
| LLaVA-Video 7B (panels) | 64.8 | 79.2 | +14.4 |

LLaVA-Video 7B + panels (79.2) also surpasses the LLaVA-Video 72B baselines.

## Sources

- [[doorenbos-2026-video-panels]] — uses TimeScope as the primary benchmark and shows the paper's largest gains.

## Related concepts

- [[long-video-understanding]] — target task.
- [[video-mme]], [[mlvu]], [[lvbench]] — adjacent long-video benchmarks.
- [[visual-prompting]] — Video Panels paradigm.
- [[video-llm]] — models evaluated.
