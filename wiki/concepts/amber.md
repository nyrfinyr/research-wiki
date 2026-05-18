---
title: AMBER
type: concept
tags: [benchmark, mllm, hallucination, evaluation]
created: 2026-05-15
updated: 2026-05-15
---

# AMBER

**AMBER (An LLM-free Multi-dimensional Benchmark for MLLMs hallucination Evaluation)** is a hallucination evaluation benchmark for MLLMs that, unlike POPE which is based only on yes/no probing, covers multiple dimensions (existence, attribute, relation) and is LLM-free (no LLM judge required). Cited in the wiki as the hallucination benchmark used in [[morini-2026-look-twice]] (LoT).

Notable result: LoT's visual highlighting applied to Qwen2.5-VL-3B yields +23.3 points on AMBER (one of the paper's largest gains), confirming that evidence-highlighting can drastically reduce hallucinations — but on Qwen3-VL-4B the gain is -0.7, indicating that the signal is not universally robust [source: raw/papers/morini-2026-look-twice.pdf §4, Tab. 3].

## Sources

- [[morini-2026-look-twice]] — hallucination evaluation benchmark, +23.3 on Qwen2.5-VL-3B.

## Related concepts

- [[pope]] — adjacent hallucination benchmark.
- [[multimodal-large-language-model]] — evaluated models.
- [[realworldqa]], [[v-star]] — adjacent vision-centric benchmarks.
