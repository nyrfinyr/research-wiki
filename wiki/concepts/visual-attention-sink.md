---
title: Visual Attention Sink
type: concept
tags: [attention-sink, mllm, video-llm, visual-tokens, interpretability]
created: 2026-05-15
updated: 2026-05-15
---

# Visual Attention Sink

Extension of the [[attention-sink]] phenomenon to **visual tokens** in Multimodal LLMs: a small subset of visual tokens — typically **spatially persistent background patches** along the temporal axis or constant in position — receives very high attention but carries almost no semantics. Analogous behavior to BOS/SEP tokens in text LLMs, but localized in the visual grid. Documented in the video encoder of Video LLMs by Kim et al. (2026) and in multimodal tokens (text + image) of MLLMs by Morini et al. (2026), which cites Kang et al. 2026 ("Visual Attention Sink in MLLM") and [[gu-2024-attention-sink]] as foundational [source: raw/papers/kim-2026-sink-token-aware-pruning.pdf §3.2; raw/papers/morini-2026-look-twice.pdf §3.2].

## Key claim / Technique

- **Spatial persistence** (Kim 2026): the patch-wise visualization (Fig. 3) shows that visual sink tokens have **persistently high attention at fixed spatial coordinates** along the temporal axis, typically in background regions (e.g. bottom-left corner: patch 154/155 on LLaVA-OneVision-7B). By analogy with sinks in [[transformer]] LLMs (BOS, SEP), Kim et al. call them *sink tokens* of the visual encoder [source: raw/papers/kim-2026-sink-token-aware-pruning.pdf §3.2].
- **Sink score** (Kim 2026): for visual token `i` over `T` frames: `ŝ_i = Σ_t A^t_i` (temporal sum of column-wise mean attention), then `s_i = MinMax-Norm(ŝ_i^w)` with `w=1.1` for sharpening. The hyperparameter `w>1` makes the distribution of `s_i` sharper so as to concentrate the penalty on true sinks [source: raw/papers/kim-2026-sink-token-aware-pruning.pdf §4.1, Eq. 4].
- **Causal test** (Kim 2026): selectively removing the sink tokens (top 10% by frequency) from VisionZip's selected set and replacing them with the next-highest-attention tokens, the performance drop on EventHallusion shrinks drastically, while MCQA improves — confirming that sinks are **directly harmful** to fine-grained understanding [source: raw/papers/kim-2026-sink-token-aware-pruning.pdf §3.3].
- **Temporal pruning as implicit sink-suppressor**: Holitom (temporal+spatial pruning) selects **83% fewer** sink tokens than the variant without temporal pruning (384 → 66): sinks in background regions have high cosine similarity between adjacent frames and are therefore *merged away* by temporal pruning [source: raw/papers/kim-2026-sink-token-aware-pruning.pdf §3.3].
- **MLLM manifestation (Morini 2026)**: in LoT, some visual tokens massively activate the same `D_sink` dimensions of the hidden state that BOS activates (textual sink prototype). Sink score:
  ```
  s_sink = (1/|L_sink|) Σ_{ℓ ∈ L_sink} max_{m ∈ D_sink} |H^ℓ_V[:,m]| / ‖H^ℓ_V‖_row
  ```
  Tokens with `s_sink > τ` (default: 25th percentile) are **zeroed out** in the analysis attention pass. Filtering is applied *only* to the analysis pass; the final generation uses the unfiltered attention [source: raw/papers/morini-2026-look-twice.pdf §3.2, Eq. 3].

## Variants / Extensions

- **STSP — Sink-Token-aware Spatial Pruning** (Kim 2026): modifies the score `Ã^t_i = A^t_i − μ_s · s_i` with `μ_s ∈ {0.2, 0.3}` for VisionZip/FastVid.
- **STTP — Sink-Token-aware Temporal Pruning** (Kim 2026): adds `μ_t·s_i ≈ 0.07` to the temporal merging criterion to push sinks into the pruning set.
- **Multi-layer sink filtering** (Morini 2026): based on `D_sink` of the hidden state, not on attention weights — a different definition from Kim 2026 but the same goal.
- **Typology**: the visual sink includes background patches, padding patches of "vintage" fixed-resolution VLMs, and possibly registers tokens (Darcet 2023, cited in Kim 2026).

## Related concepts

- [[attention-sink]] — parent phenomenon, originally observed in pure LLMs.
- [[visual-token-pruning]] — target family of the sink-aware intervention.
- [[evidence-highlighting]] — Morini 2026 uses it to **filter** sinks before computing the relevant visual region.
- [[kv-cache]] — visual sinks are a special case of "tokens that must be kept or evicted with different priority".

## Sources

- [[kim-2026-sink-token-aware-pruning]] — defines visual sink tokens, sink score, STSP/STTP.
- [[morini-2026-look-twice]] — uses multi-layer sink filtering based on `D_sink` for evidence highlighting in MLLMs.
