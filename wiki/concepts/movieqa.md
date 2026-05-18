---
title: MovieQA
type: concept
tags: [benchmark, video-qa, long-form, movie]
created: 2026-05-15
updated: 2026-05-15
---

# MovieQA

**MovieQA** is a video question-answering benchmark based on movie scenes, cited in the wiki mainly as an **example of a benchmark with linguistic bias**: many questions can be solved using only the text (subtitle/plot) without watching the video, which is why more recent benchmarks such as [[video-mme]] and [[lvbench]] introduce blind-LLM filters to discard these QAs. Also cited in [[mangalam-2023-egoschema]] and [[zhang-2024-llovi]] in this light.

## Sources

- [[mangalam-2023-egoschema]] — cited as an open-ended dataset with text-only bias.
- [[zhang-2024-llovi]] — cited as a "benchmark with linguistic bias".
- [[wang-2025-lvbench]] — comparison in Tab. 1.

## Related concepts

- [[video-question-answering]] — task.
- [[long-video-understanding]] — task.
- [[lvbench]] — benchmark that addresses the problem with a dual-LLM blind filter.
- [[video-mme]] — benchmark that introduces text-only Gemini blind filter.
