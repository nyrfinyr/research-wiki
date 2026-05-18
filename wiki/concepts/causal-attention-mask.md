---
title: Causal Attention Mask
type: concept
tags: [attention, decoder, autoregressive, transformer]
created: 2026-05-15
updated: 2026-05-15
---

# Causal Attention Mask

**Lower-triangular** mask applied to attention logits in decoder-only [[transformer]]s: for the query at position `i`, positions `j > i` are set to `−∞` before softmax, so that the current token cannot attend to the "future". Canonical definition: `M^c_{i,j} = 0` if `j ≤ i`, `−∞` otherwise [source: raw/papers/pei-2025-causal-mask-attention.pdf §2.1]. Originated in Vaswani et al. (2017) as an ingredient of the Transformer decoder. It has become the target of a small family of *training-free* interventions in VLMs — the causal mask inherited from LLMs is sub-optimal for visual tokens, and selective modulations of `M` improve grounding, OCR and hallucination ([[causal-mask-modulation]]).

## Key claims / Technique

- **Autoregressive necessity**: the causal mask allows parallel training on `N` positions while preserving the property that `p(x_t | x_<t)` does not see `x_{t+1..T}`; without it, the decoder would collapse at test time because it would see the target token [source: vaswani-2017].
- **Sub-optimal on visual tokens**: Pei et al. show that visual tokens have no intrinsic sequential order; blocking the future among visual tokens prevents them from aggregating useful information. Breaking masking *between* visual tokens can **improve** even causally-trained models (Fig. 1, ALFRED) [source: raw/papers/pei-2025-causal-mask-attention.pdf §1, Fig. 1].
- **Three future-aware relaxations** (Pei's definitions 3.1-3.3):
  - `M^f` (Full): the whole upper triangle visible for visual queries.
  - `M^{v2v}`: visual query attends to future visual but NOT to future text.
  - `M^{v2t}`: visual query attends to future text but NOT to future visual.
  Task-dependent effects: temporal multi-image ↑ with `M^f / M^{v2v}`; text-rich VQA ↑ with `M^{v2t}`; text-dominant tasks **degrade** [source: raw/papers/pei-2025-causal-mask-attention.pdf §3.1-3.3].
- **Entropy-based modulation** (Liu et al. 2026): an entropy of the "token dynamics" `D_{v_i} = {d^l_{v_i}}_l` with `d^l_{v_i} = max_j a^l_{i,j}` is computed. High-entropy tokens are **masked in the visual→text interaction** (image-to-text attention blocked), but vision-to-vision aggregation is preserved. Cost: 1 extra decoding step [source: raw/papers/liu-2026-adaptive-information-flow.pdf §4.1-4.3].
- **Tool for mechanistic interpretability** (Kim et al. 2025): **Attention Knockout** is a targeted extension of the causal mask: to disable the flow from `s` to `t` at layer `l` one sets `M^l[s,t] = −∞`. Window `k=9` to prevent residual connections from bypassing the intervention. Allows *causally* tracing the information path in Video LLMs [source: raw/papers/kim-2025-map-the-flow.pdf §2.2].

## Variants / Extensions

- **Future-aware mask family** (Pei 2025): see `M^f`, `M^{v2v}`, `M^{v2t}`. The "Light" family compresses future attention via 1D max-pool into a summary score, merged into the first tokens (sink) during prefill ⇒ negligible decoding overhead [source: raw/papers/pei-2025-causal-mask-attention.pdf §4, Eq. 11-14].
- **Adaptive Information Flow** (Liu 2026): modulates the mask only for visual tokens with high token-dynamics entropy; AIF beats both training-free ViCrop and training-based CCA on V*/RealWorldQA/POPE [source: raw/papers/liu-2026-adaptive-information-flow.pdf §5.2].
- **Attention Knockout** (Geva 2023, applied by Kim 2025): does not relax the causal mask, but **reinforces** it locally for probing.

## Related concepts

- [[causal-mask-modulation]] — family of training-free interventions on `M`.
- [[scaled-dot-product-attention]] — operation on which `M` acts additively.
- [[attention-sink]] — Pei interprets the sink as a buffer to absorb future info enabled by the relaxation.
- [[mechanistic-interpretability]] — Attention Knockout is a modulation of `M` for probing.

## Sources

- [[pei-2025-causal-mask-attention]] — introduces the three future-aware masks and the Light version.
- [[liu-2026-adaptive-information-flow]] — proposes AIF, entropy-based modulation of `M`.
- [[kim-2025-map-the-flow]] — uses Attention Knockout (targeted additive mask) for probing.
