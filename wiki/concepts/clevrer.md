---
title: CLEVRER
type: concept
tags: [benchmark, video, synthetic, causal-reasoning]
created: 2026-05-15
updated: 2026-05-15
---

# CLEVRER

**CLEVRER** (Collision Events for Video Representation and Reasoning) is a **synthetic** video reasoning benchmark generated in a simulated physical environment (colliding objects). Four question families: descriptive, explanatory, predictive, counterfactual. It is one of the few video benchmarks with physical ground-truth, and has [[certificate-length]] on the order of 1–2 s.

In the wiki it appears in two roles: (1) **source** for [[mvbench]] of the Moving Attribute, Counterfactual Inference, Moving Count, Moving Direction, Object Existence tasks (discarding questions with > 10 descriptive conditions) [source: raw/papers/li-2024-mvbench.pdf §3.2]; (2) **instruction-tuning data** for VideoChat2 in Stage 3 Reasoning. The authors acknowledge that this creates a *minimal source gap* between training and benchmark (Tab. 13: removing CLEVRER drops accuracy by 1.8 points).

## Sources

- [[li-2024-mvbench]] — source of 4 MVBench tasks + VideoChat2 instruction-tuning data.
- [[mangalam-2023-egoschema]] — certificate length comparison (~1 s).

## Related concepts

- [[video-question-answering]] — task.
- [[mvbench]] — benchmark that uses it as source.
- [[counterfactual-inference]] — sub-task.
