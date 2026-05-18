---
title: Mixture-of-Experts (MoE)
type: concept
tags: [architecture, sparse, scaling, efficient-llm]
created: 2026-05-15
updated: 2026-05-15
---

# Mixture-of-Experts (MoE)

Architecture in which the Transformer's feed-forward blocks are **partitioned into `E` experts** (parallel FFNs), and at each token a **router** dynamically selects a subset `k ≪ E` of experts to dispatch the computation to (typically `k=2`). The result is a model with **high total parameter count** but **low compute activated per token** — the usual nomenclature is "total-A-activated", e.g. **30B-A3B** (30B total, 3B activated) or **235B-A22B** (235B total, 22B activated). In the VLM world, Qwen3-VL is the first in the Qwen-VL family to introduce MoE variants [source: raw/papers/qwen3-vl-2025-tech-report.pdf §1, §2].

## Key claims / Technique

- **Sparse activation**: for each token, only `k` experts participate in the forward (and backward). Routing is typically top-`k` softmax with a load-balancing loss to prevent router collapse onto few experts.
- **Qwen3-VL MoE variants**: two new sizes introduced in the family — **30B-A3B** and **235B-A22B**; both share the same pre-training recipe (4 stages, 2.2T tokens) and post-training (SFT on 1.2M samples, strong-to-weak distillation, RL with SAPO) as the dense variants (2B/4B/8B/32B) [source: raw/papers/qwen3-vl-2025-tech-report.pdf §1].
- **Trade-off**: parameter scaling is "free" relative to compute (sparse) but **costly in VRAM** (all experts must be loaded in memory); moreover routing introduces communication overhead on multi-GPU. For single-host inference it is worthwhile when abundant VRAM is available.
- **Performance**: Qwen3-VL-235B-A22B competes on STEM, OCR, document understanding, video understanding, grounding with Gemini 2.5 Pro / GPT-5 / Claude Opus 4.1; the MoE flagship is the top-of-the-line of the family [source: raw/papers/qwen3-vl-2025-tech-report.pdf §5].

## Variants / Extensions

- **Switch Transformer** (Fedus 2021): `k=1`, simplifies routing.
- **GShard / Mixtral**: `k=2`, soft routing with load balancing.
- **DeepSeekMoE**: fine-grained experts + shared experts.
- **Qwen3-VL MoE**: does not report details on specific routing (`k`, expert count, balancing loss); only cited at the level of the `A3B / A22B` acronym [source: raw/papers/qwen3-vl-2025-tech-report.pdf §1].

## Related concepts

- [[supervised-fine-tuning]] — post-training recipe shared with the Qwen3-VL dense variants.
- [[instruction-tuning]] — also applied to MoE variants.
- [[direct-preference-optimization]] — DPO/SAPO applies to MoE as it does to dense.

## Sources

- [[qwen3-vl-2025-tech-report]] — introduces the 30B-A3B and 235B-A22B MoE variants.
