---
title: "Pei et al. (2025) — Rethinking Causal Mask Attention for Vision-Language Inference"
type: source
tags: [vision-language-model, causal-mask, attention-modulation, training-free, future-aware-attention, attention-sink, multimodal-attention]
created: 2026-05-15
updated: 2026-05-15
source_path: raw/papers/pei-2025-causal-mask-attention.pdf
source_kind: paper
source_date: 2025-05-24
doi: 10.48550/arXiv.2505.18605
zotero_key: PIZCS3GH
venue: arXiv preprint
authors: [Xiaohuan Pei, Tao Huang, YanXiang Ma, Chang Xu]
year: 2025
---

# Rethinking Causal Mask Attention for Vision-Language Inference

## TL;DR

Pei et al. show that the causal mask inherited from LLMs ("attend only to the past") is a suboptimal choice for visual tokens in VLMs: visual tokens have no intrinsic sequential order and blocking the future prevents aggregation of useful information. They propose three **future-aware causal masks** that selectively relax the upper triangle only for visual queries: $M^f$ (all future tokens), $M^{v2v}$ (only future visual tokens), $M^{v2t}$ (only future text tokens). "Lightweight" versions compress the future attention via 1D kernel pooling into the first tokens (attention sinks) during prefill, preserving the causal mask during decoding and achieving 2–3× speedup over the non-merged version. Experiments on 15 multimodal tasks (MILEBench) with LLaVA-7B/13B show task-dependent gains: temporal multi-image ↑ with $M^f/M^{v2v}$, text-rich VQA ↑ with $M^{v2t}$, text-dominant tasks degrade [source: raw/papers/pei-2025-causal-mask-attention.pdf Abstract, §3].

## Main contribution

- Empirical analysis of the (mis)alignment between text-only causal masking and visual tokens: breaking the masking between textual tokens degrades performance, but breaking the masking *between* visual tokens can **improve** it even on causally trained models (Fig.1, ALFRED) [source: raw/papers/pei-2025-causal-mask-attention.pdf §1, Fig.1].
- Three formal future-aware masks with definitions 3.1–3.3: $M^f$, $M^{v2v}$, $M^{v2t}$ — each shows advantages on one category of task.
- **Light Future-Aware Attention** family: compression via 1D max-pool (kernel size $k$) of the future attention and merge into the "sink" tokens (prefix size = 1 sufficient). Maintains causal structure during decoding ⇒ no inference-time overhead [source: raw/papers/pei-2025-causal-mask-attention.pdf §4, Eq.11-14].
- Insight: sink tokens can absorb future information without violating autoregression; prefill-decoding separation makes the overhead negligible.

## Method

**Setup (§2.1)**: input $X = X^v \oplus X^t \in \mathbb{R}^{B\times L\times H\times D}$, $L = m+n$ (m visual, n text). Standard causal mask $M^c_{i,j}=0$ if $j\le i$, $-\infty$ otherwise.

**Future-Aware Masks (§3.1)** — act only on rows $i \in \mathcal{V}$ (visual queries):

- **$M^f$ (Full, Def.3.1)**: $M^f_{i,j}=0$ if $j\le i \lor (j>i \land i\in\mathcal{V})$ ⇒ the entire upper triangle is visible for visual queries. Good for temporal multi-image tasks (Action Prediction, Visual Navigation, State Change: +0.1 / +1.0 / +1.5 points on MILEBench AP/VN/SC) [source: raw/papers/pei-2025-causal-mask-attention.pdf §3.1, Tab.1].
- **$M^{v2v}$ (Visual-to-Visual, Def.3.2)**: visual queries attend to future visual tokens but NOT future text. Good for Visual Change Captioning, Visual Relation Expression (VCC 16.2→16.7, VRE 16.6→18.1) [source: raw/papers/pei-2025-causal-mask-attention.pdf §3.2, Tab.2].
- **$M^{v2t}$ (Visual-to-Textual, Def.3.3)**: visual queries attend to future text but NOT future visual tokens. Good for Text-Rich VQA (OCR-VQA 22.5→23.0, TextVQA 32.0→38.5) [source: raw/papers/pei-2025-causal-mask-attention.pdf §3.3, Tab.3].

**Light Future-Aware Attention (§4)** — reduces prefill cost: compute the admitted future attention $A^f$, apply 1D kernel pooling with kernel $k$ to aggregate it into a *summary score*, and **sum** the summary into the first tokens (sinks) of the same row $A_i$ via Eq.11-12. Decoding remains standard-causal. Final mask is purely lower-triangular.

**Training-free aspect**: everything is a modification of the causal mask in prefill — no weight updates. Applied to LLaVA-1.5-7B/13B and Mistral-v1.6-7B/13B using FlashAttention-2.6.3, context 4096, greedy decoding [source: raw/papers/pei-2025-causal-mask-attention.pdf Appendix A.1].

## Key results

**MILEBench multitask (Tab.4)** — LLaVA-7B / 13B, 13 tasks. Examples (LLaVA-7B):

| Task | $M^c$ | $M^{v2t}$ | $M^{v2v}$ | $M^f$ |
|---|---|---|---|---|
| ActionLocalization | 0.230 | 0.250 | 0.255 | 0.250 |
| ActionPrediction | 0.515 | 0.495 | 0.515 | 0.500 |
| CLEVRER | 0.166 | 0.181 | 0.177 | 0.187 |
| Order | 0.245 | 0.250 | 0.250 | 0.255 |
| Navigation | 0.310 | 0.320 | 0.325 | 0.320 |
| TQA | 0.320 | 0.385 | 0.385 | 0.400 |

**Latency (Tab.6)** — LLaVA-7B context 4096:

| Attention | Decoding latency (ms/token) |
|---|---|
| $M^f$ | 83.18 |
| $M^f$+merge | 26.54 |
| $M^{v2v}$ | 64.13 |
| $M^{v2v}$+merge | 26.40 |
| $M^{v2t}$ | 43.04 |
| $M^{v2t}$+merge | 26.11 |

⇒ 2–3× speedup with merge, performance preserved (Fig.7).

**Prefix ratio (Fig.8)**: merging into the **first token** is already sufficient — a single sink-token absorbs the future context.

**Qualitative summary (Tab.5)**:
- Temporal multi-image (T-1..T-4) → ✓ with $M^f, M^{v2v}$
- Semantic multi-image (S-2, S-3) → ✓ with $M^{v2v}, M^{v2t}$
- Text-dominant (S-5, IR) → ✗ degrades with all relaxed masks

## Stated limitations

- Task-dependent gains: no universally dominant mask exists; requires manual per-task selection (no auto-routing).
- Tests focused on LLaVA-1.5/1.6; models with M-RoPE or already-modified causal masks (Qwen2-VL) are not evaluated.
- On text-dominant tasks (IR, S-5) the relaxed masks worsen results — evidence that text autoregression is essential.
- Quantitative analysis across all 15 tasks is limited to aggregate tables (no CI, no random seeds).

## Open questions / critiques

- Is there a mechanism to **automatically choose** the mask based on the query? (A routing classifier on the prompt.) That would be the natural next step.
- Comparison with [[liu-2026-adaptive-information-flow]] — AIF (Liu's Tab.8) uses $M^{v2v}$ / $M^{v2t}$ as baselines and shows AIF is significantly better on RealWorldQA/CountBench → suggesting that indiscriminate relaxation is suboptimal compared to entropy-driven selective masking.
- The effect on long videos (huge sequences of visual tokens) is untested.
- 1D max-pool merging could be generalized (attention-weighted pool, learnable kernel) — not explored.

## Cited concepts

- [[vision-language-model]]
- [[causal-attention-mask]]
- [[causal-mask-modulation]]
- [[future-aware-causal-mask]] — central concept of the paper
- [[attention-sink]] — mechanism for absorbing future info
- [[prefill-decoding-separation]]
- [[training-free-methods]]
- [[kv-cache]] — discussed in §4 note
- [[milebench]] — multi-image benchmark suite
- [[alfred]] — agentic task cited in Fig.1
- [[clevrer]] — temporal reasoning
- [[ocrvqa]], [[textvqa]] — text-rich VQA
- [[perception-test]] — cited
- [[docvqa]] — cited
- [[multimodalqa]] — cited
- [[llava-1-5]], [[llava-1-6]] — backbones
- [[flash-attention]] — implementation
- [[stablemask]] — related work on mask refinement (Yin et al.)
- [[concentric-causal-attention]] — Xing et al., training-based
- [[modality-mutual-attention]] — Wang et al.

## Direct quotes

> "Strictly masking future positions for vision queries introduces overly rigid constraints, which hinder the model's ability to leverage future context that often contains essential semantic cues for accurate inference." [source: raw/papers/pei-2025-causal-mask-attention.pdf Abstract]

> "While breaking the causal masks between textual tokens significantly disrupts model predictions, relaxing the causal constraints on visual tokens unexpectedly improves performance, even though the model is trained causally." [source: raw/papers/pei-2025-causal-mask-attention.pdf §1]
