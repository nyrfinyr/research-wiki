---
title: Look Twice (LoT)
type: concept
tags: [method, mllm, evidence-highlighting, training-free, inference-time]
created: 2026-05-15
updated: 2026-05-15
---

# Look Twice (LoT)

**Look Twice (LoT)** is the **training-free, inference-time** framework introduced by Morini et al. (2026) to improve the use of multimodal evidence in MLLMs in the Knowledge-Based VQA setting. The core idea: have the model look at the input **twice** — a first forward pass generates **a single token** and produces the attention maps; these are used to identify (a) the relevant visual region (filtering visual attention sinks with a score over the critical dimension-channels of the BOS) and (b) the relevant textual evidence sentences in the retrieved context (RAG). The selected cues are **highlighted** in the prompt with `<START_IMPORTANT_TXT>` markers and with a bounding box `<START_IMPORTANT_IMG>` on the image. A second forward pass generates the final answer on the enriched input. No training, no parameters modified, overhead ≈ 1 token.

## Architecture

Three key components:

1. **Self-guided Visual Evidence Selection**: cross-layer/cross-head aggregation of attention from the target object (extracted via spaCy dependency parsing) toward visual tokens, on intermediate layers `L_vis`. Output: vector `a_vis ∈ R^(N_V)`.
2. **Multi-Layer Attention Sink Filtering**: identifies dimensions `D_sink` in which BOS activates massively; suppresses visual tokens that activate these dimensions above threshold τ (default 25th percentile).
3. **Self-guided Textual Evidence Selection**: last-to-context extraction of the last generated token, aggregated over the **deep layers** (second half of the decoder, consistent with SelfElicit); sentence selection via max score or threshold α.

Bounding box extracted via **weighted centroid** + deviations (β=2). Validated cross-architecture (Qwen, InternVL) and cross-scale (2B → 38B).

## Reference numbers

On 4 KB-VQA benchmarks (E-VQA, InfoSeek, OVEN, ViQuAE) × 10 MLLMs, LoT improves by **+1.1 to +5.3** average points. Largest gains: Qwen2-VL-7B +5.3, Qwen2.5-VL-3B +4.3, InternVL3.5-4B +4.2. Ablation (Tab. 2): visual-only and textual-only are **complementary** (Qwen2.5-VL-3B E-VQA: textual-only 29.4, visual-only 29.6, LoT 30.4).

## Sources

- [[morini-2026-look-twice]] — introductory paper
- [[gu-2024-attention-sink]] — theoretical foundation for attention sink filtering
- [[liu-2025-selfelicit]] — textual antecedent, consistency on deep layers

## Related concepts

- [[evidence-highlighting]] — general task
- [[attention-sink]], [[visual-attention-sink]] — filtering applied
- [[self-elicit]] — text-only counterpart
- [[map-the-flow]] — consistency with "deep layers know"
- [[multimodal-large-language-model]], [[training-free-methods]]
