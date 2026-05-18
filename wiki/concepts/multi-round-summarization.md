---
title: Multi-round Summarization
type: concept
tags: [method, prompting, long-video, llm]
created: 2026-05-16
updated: 2026-05-16
---

# Multi-round Summarization

Multi-round summarization is a prompting strategy in which an LLM receives a very long sequence of captions (or transcripts of video clips) and summarizes them in successive passes — summaries of summaries — until it compresses them into a representation usable to answer the final question. It bypasses the context limit without fine-tuning.

In the wiki it is the central concept of LLoVi for caption-based long-video VQA.

## Sources

- [[zhang-2024-llovi]] — central concept of the prompt strategy
