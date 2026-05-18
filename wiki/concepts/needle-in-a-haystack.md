---
title: Needle-in-a-Haystack
type: concept
tags: [paradigm, long-context, evaluation, probe]
created: 2026-05-15
updated: 2026-05-15
---

# Needle-in-a-Haystack

**Needle-in-a-Haystack (NIAH)** is a long-context evaluation paradigm: a specific piece of information (the "needle") is inserted into a long input (the "haystack") and the model is measured on whether it finds/uses it correctly. Originating with text LLMs (RULER, "Lost in the Middle"), it has been extended to [[video-llm|video-LLMs]] via benchmarks such as [[vnbench]] and the Key Information Retrieval-style tasks of [[lvbench]].

In the wiki it appears in two contexts:

- **[[doorenbos-2026-video-panels]]**: the task category where paneling shines — the paneled representation increases temporal "density" and facilitates needle localization.
- **[[arnab-2025-temporal-chain-of-thought]]**: cites "lost-in-the-middle" (Liu et al. 2024) and RULER as motivating phenomena for the need to select relevant frames rather than relying on brute long-context.

## Sources

- [[doorenbos-2026-video-panels]] — task category.
- [[arnab-2025-temporal-chain-of-thought]] — motivating phenomenon (lost-in-the-middle).

## Related concepts

- [[vnbench]] — NIAH-style video benchmark.
- [[long-context]] — broader paradigm.
- [[long-video-understanding]] — target task.
- [[lvbench]] — benchmark with a Key Information Retrieval skill.
- [[keyframe-sampling]] — relevant strategy.
