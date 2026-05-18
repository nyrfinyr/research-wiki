---
title: Long Video Understanding
type: concept
tags: [task, video, long-form, broad-concept]
created: 2026-05-15
updated: 2026-05-15
---

# Long Video Understanding

**Long Video Understanding** is the task of answering questions, summarizing or reasoning over videos of "long" duration — variably defined: from tens of seconds to multi-hour. The clearest operational notion in the wiki is that of [[mangalam-2023-egoschema]]: long-form video task = those with [[certificate-length]] on the order of **10 s**; very long-form = order of **100 s**. [[wang-2025-lvbench]] explicitly defines "long video" as **≥ 30 min** with multiple events, scene transitions and visually rich content.

## Benchmarks

- [[egoschema]] — very long-form egocentric (~100 s certificate, 3 min/video).
- [[video-mme]] — full-spectrum (11 s – 1 h) with short/medium/long sub-bands.
- [[lvbench]] — extreme long-video (~68 min/video).
- [[mlvu]] — multi-task long-form.
- [[longvideobench]] — referring QA over long video.
- [[timescope]] — long-video with biggest gain in [[doorenbos-2026-video-panels]].
- [[vnbench]] — needle-in-haystack video.

## Methods in the wiki

- **Native long-context video-LLM**: [[qwen2-5-vl-2025-tech-report|Qwen2.5-VL]] (768 frames, 24 576 tokens), [[qwen3-vl-2025-tech-report|Qwen3-VL]] (256K context, up to 2 048 frames), MovieChat, LWM.
- **Training-free pipelines**: [[zhang-2024-llovi|LLoVi]] (caption + LLM), [[tang-2025-adaptive-keyframe-sampling|AKS]] (keyframe selection), [[arnab-2025-temporal-chain-of-thought|TCoT]] (selector-then-answerer), [[doorenbos-2026-video-panels|Video Panels]] (paneling).

## Sources

- [[mangalam-2023-egoschema]] — temporal taxonomy and very long-form benchmark.
- [[fu-2025-video-mme]] — full-spectrum benchmark.
- [[wang-2025-lvbench]] — operational definition "≥ 30 min".
- [[zhang-2024-llovi]] — caption-based pipeline.
- [[tang-2025-adaptive-keyframe-sampling]] — keyframe selection.
- [[arnab-2025-temporal-chain-of-thought]] — training-free inference strategy.
- [[doorenbos-2026-video-panels]] — visual prompt engineering.
- [[qwen2-5-vl-2025-tech-report]] — native long-video model.
- [[qwen3-vl-2025-tech-report]] — native long-video model with interleaved MRoPE.
- [[zhang-2025-videollama-3]] — video-LLM with DiffFP.

## Related concepts

- [[video-question-answering]] — related task (short + long).
- [[certificate-length]] — temporal difficulty metric.
- [[long-context]] — modeling requirement.
- [[keyframe-sampling]] — input strategy.
- [[video-llm]] — target models.
