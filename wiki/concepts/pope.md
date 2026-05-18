---
title: POPE
type: concept
tags: [benchmark, vlm, hallucination, evaluation]
created: 2026-05-15
updated: 2026-05-15
---

# POPE

**POPE (Polling-based Object Probing Evaluation)** is a **hallucination probing** benchmark for VLMs: it measures how much a model "hallucinates" objects not present in the image. The typical setup is a sequence of binary "Is there a {object} in the image?" questions with positive/negative balancing; metric = accuracy / F1 on negative responses.

In the wiki it appears as a hallucination evaluation benchmark in [[morini-2026-look-twice]] (Look Twice / LoT), where it serves to measure whether visual highlighting reduces hallucinations. Results: Qwen2.5-VL-3B +0.8 / Qwen3-VL-4B +0.1; InternVL3.5-4B shows negative fluctuations on POPE/AMBER, indicating that the visual signal is not universally robust [source: raw/papers/morini-2026-look-twice.pdf §4].

## Sources

- [[morini-2026-look-twice]] — hallucination evaluation benchmark.

## Related concepts

- [[amber]] — adjacent MLLM hallucination benchmark.
- [[vision-language-model]] — evaluated models.
- [[realworldqa]] — adjacent vision-centric benchmark.
- [[v-star]] — adjacent vision-centric benchmark.
