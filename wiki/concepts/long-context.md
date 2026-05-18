---
title: Long Context
type: concept
tags: [task, llm, scaling, attention]
created: 2026-05-16
updated: 2026-05-16
---

# Long Context

Long context refers to the ability of an LLM or MLLM to handle very long input sequences (tens or hundreds of thousands of tokens) while maintaining predictive quality. It is the regime in which problems of [[attention-sink]], positional degradation and quadratic attention cost emerge, and in which variants such as [[sliding-window-attention]], [[ring-attention]] and [[alibi]] become relevant.

In the wiki it is a central evaluation axis for the Qwen3-VL reports and for work on efficient attention.

## Sources

- [[fu-2025-sliding-window-attention]] — cited as a regime of interest
- [[qwen3-vl-2025-tech-report]] — target capability of the model
