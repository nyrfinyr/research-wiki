---
title: OpenEQA
type: concept
tags: [benchmark, video-qa, embodied-qa, open-ended]
created: 2026-05-15
updated: 2026-05-15
---

# OpenEQA

**OpenEQA** is an **embodied question answering** benchmark: an agent traverses a real environment (recorded as first-person video) and must answer open-ended questions about the perceived scene (objects, attributes, spatial, memory). It measures the ability of an MLLM to reason over egocentric video in an embodied setting.

In the wiki it appears as one of the 4 benchmarks evaluated by [[arnab-2025-temporal-chain-of-thought]] (TCoT): TCoT (Gemini Flash) = 69.2 vs. baseline 68.0 (+1.2). Marginal compared to the gain on LVBench (+11.4) — a sign that the embodied OpenEQA task is already well handled by the Gemini baseline.

## Sources

- [[arnab-2025-temporal-chain-of-thought]] — one of the 4 evaluation benchmarks.

## Related concepts

- [[video-question-answering]] — related task.
- [[ego4d]] — similar egocentric video dataset.
- [[video-llm]] — evaluated models.
- [[long-video-understanding]] — adjacent task.
