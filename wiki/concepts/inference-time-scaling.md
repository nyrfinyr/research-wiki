---
title: Inference-Time Scaling
type: concept
tags: [reasoning, test-time-compute, llm, paradigm]
created: 2026-05-15
updated: 2026-05-15
---

# Inference-Time Scaling

Paradigm of **scaling the compute used at inference time** (per generated token, per call, per search branch) to improve answer quality, independently of model parameters. Canonical manifestations: [[chain-of-thought|CoT]] (generation of intermediate tokens), self-consistency (multiple sample + majority vote), tree-of-thought / search-based decoding, multi-turn agentic loop. The scaling-law logic is that final quality depends not only on the model but on how much compute one is willing to spend at inference; the compute/quality ratio is often more favorable than scaling parameters at training time [source: raw/papers/arnab-2025-temporal-chain-of-thought.pdf §1, §4.2].

## Key claims / Technique

- **CoT as prototype**: the first example in which increasing intermediate tokens improves the final answer at fixed model — cf. [[chain-of-thought]] [source: raw/papers/arnab-2025-temporal-chain-of-thought.pdf §1].
- **TCoT (Temporal CoT)** is an **application of the paradigm to video QA**: the same VLM is used first to **select the relevant frames** (with textual justification) and then to answer the question. No external captioners or tools: a single VLM, two calls. The Dynamic-Segment TCoT variant partitions the video into `l` segments and handles inference-time scaling along the `l` axis [source: raw/papers/arnab-2025-temporal-chain-of-thought.pdf §3.2].
- **Smooth curve with compute** (Arnab 2025, Fig. 4): on LVBench, TCoT scales smoothly from `l=2` to `l=32` (31K → 697K total tokens, accuracy 50.3 → 61.7). The non-iterative baseline at 700K (2700 native frames) only reaches 58.9. Self-consistency CoT is **ineffective** (≈51) [source: raw/papers/arnab-2025-temporal-chain-of-thought.pdf §4.2, Fig. 4].
- **Task-dependent adaptivity**: the fraction of frames selected by TCoT varies 6-25% per question type, aligned with human annotations of "time references" on LVBench (Fig. 6). The model "spends" more compute where needed [source: raw/papers/arnab-2025-temporal-chain-of-thought.pdf §4.3, Fig. 6].
- **SOTA with moderate compute**: TCoT(Gemini Flash, 32K context, 672K total) = **61.7** on LVBench vs previous best Gemini 1.5 Flash at 700K single-shot = 58.9. TCoT(GPT-4o-mini, 22K) = 53.5 vs baseline 48.0. TCoT(Qwen2.5-VL-7B, 128K) = 49.1 vs 46.1. The gain generalizes across 3 backbone families [source: raw/papers/arnab-2025-temporal-chain-of-thought.pdf §Tab. 3].

## Variants / Extensions

- **CoT** (Wei 2022) — monolithic base.
- **Self-consistency** (Wang 2022) — sample + vote.
- **Tree-of-Thought / Search** (Yao 2023) — explicit search over branches.
- **Reflection / self-refine** — multi-turn correction.
- **TCoT** (Arnab 2025) — video application with frame selection.
- **"Thinking with images"** (Qwen3-VL) — multi-turn tool calling with images, RL-trained [source: raw/papers/qwen3-vl-2025-tech-report.pdf §cited concepts].

## Related concepts

- [[chain-of-thought]] — historical prototype of inference-time scaling.
- [[evidence-highlighting]] — alternative that spends compute in a more targeted way (1 extra token instead of chains).
- [[supervised-fine-tuning]] — Qwen3-VL "thinking" variant is SFT on extended CoT (inference-time scaling built-in).

## Sources

- [[arnab-2025-temporal-chain-of-thought]] — explicitly applies the paradigm to video QA via TCoT.
