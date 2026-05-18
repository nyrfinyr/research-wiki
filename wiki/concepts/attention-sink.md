---
title: Attention Sink
type: concept
tags: [attention, transformer, interpretability, softmax, kv-cache]
created: 2026-05-15
updated: 2026-05-15
---

# Attention Sink

Empirical phenomenon by which auto-regressive language models assign a **disproportionately large** share of attention weight to the **first token** of the sequence, regardless of its semantic content. The first token acts as a global "key bias" that absorbs attention the model would otherwise have to distribute elsewhere [source: raw/papers/gu-2024-attention-sink.pdf §1, §3]. Formally defined and systematically studied by [[gu-2024-attention-sink]], the sink has since become a reference observation for explaining the failure of inference-only [[sliding-window-attention]], the modulation of the [[causal-attention-mask]] and the [[visual-token-pruning]] methods in MLLMs.

## Key claims / Technique

- **Formal definition** (emergence metric): `Sink^ε_k = (1/L)·Σ_l (1/H)·Σ_h I(α^(l,h)_k > ε)` with `ε = 0.3, T = 64` as defaults; measures the fraction of (layer, head) pairs in which the token at position `k` receives attention `> ε` [source: raw/papers/gu-2024-attention-sink.pdf §3.2].
- **Causal decomposition**: `q_t k_1ᵀ = ‖q_t‖·‖k_1‖·cos(q_t, k_1)`. The first token has *small* `‖k_1‖` but very large `cos(q_t, k_1)` — it is the **angle** (i.e. the position on a separate manifold) that generates the sink, not the norm of the key [source: raw/papers/gu-2024-attention-sink.pdf §3.1, Fig. 2].
- **Universal and at scale**: emerges in models from 14M (Pythia) to 70B (LLaMA-3) — LLaMA-3-8B Base reaches `Sink^ε_1 = 99.02%` on natural sequences [source: raw/papers/gu-2024-attention-sink.pdf Tab. 1].
- **Emerges during pre-training** after 1k-2k steps of effective optimization; weight decay and amount of data reinforce it (γ=0.5 → `Sink^ε_1 ≈ 41%`); too low a learning rate or data <500M tokens suppress it [source: raw/papers/gu-2024-attention-sink.pdf §4, §5].
- **The position is mobile**: with prefix-LM (loss on tokens > p>1) the sink spreads over the prefix tokens; fixing a token `x_fix` at position 2-3 **moves** the sink there; with shifted window attention it stays on the absolute first token if `t ≤ w` [source: raw/papers/gu-2024-attention-sink.pdf §5, §6].
- **Independent of positional encoding**: NoPE, absolute, learnable, relative, ALiBi and Rotary all exhibit the sink (Tab. 3) — it is not a RoPE artifact [source: raw/papers/gu-2024-attention-sink.pdf §7].
- **Removable with [[sigmoid-attention]] without normalization**: `Sink^ε_1 ≈ 0.44%` at matched validation loss up to 1B parameters; keeping normalization (normalized sigmoid) makes it reappear [source: raw/papers/gu-2024-attention-sink.pdf §7.3-7.4, Tab. 6].
- **Massive activations**: in pre-norm, from `l=2` onward `‖h^l_1‖` is much larger than the average of other tokens while `‖k^l_1‖` and `‖v^l_1‖` are **smaller** — the first token acts as a *dump* of extra attention [source: raw/papers/gu-2024-attention-sink.pdf §3.1].

## Variants / Extensions

- **Sink as a "future-aware" mechanism** in VLMs: Pei et al. interpret the sink as a token that can **absorb future information** without violating autoregression, building on it a family of compressions via 1D pooling of future attention merged into the sink during prefill [source: raw/papers/pei-2025-causal-mask-attention.pdf §4].
- **Visual sink tokens** in MLLMs ([[visual-attention-sink]]): spatially persistent background patches with high attention and almost no semantics — Kim et al. show that they dominate the budget of [[visual-token-pruning]] methods and degrade fine-grained understanding [source: raw/papers/kim-2026-sink-token-aware-pruning.pdf §3.2-3.3]. Morini et al. apply a "multi-layer attention sink filtering" on the visual tokens before evidence highlighting (filtering on the `D_sink` dimensions of the BOS) [source: raw/papers/morini-2026-look-twice.pdf §3.2].
- **SWA failure mode**: Fu et al. show that the attention sink propagated by the variance of the first token through softmax normalization is the main cause of the perplexity collapse of inference-only [[sliding-window-attention]] [source: raw/papers/fu-2025-sliding-window-attention.pdf §2.2, Fig. 3].
- **Downstream applications**: the sink is the anchor of [[streaming-llm]] (Xiao 2023) and of [[kv-cache]] eviction/quantization methods that empirically already exploited it before Gu's formalization [source: raw/papers/gu-2024-attention-sink.pdf §1, §8].

## Related concepts

- [[sigmoid-attention]] — architectural remedy that prevents the sink from emerging.
- [[sliding-window-attention]] — the sink is the cause of the SWA training-inference gap.
- [[streaming-llm]] — exploits the sink as anchor for infinite generation.
- [[kv-cache]] — the sink token is a mandatory anchor for eviction/quantization.
- [[causal-mask-modulation]] — Pei et al. use the sink as a buffer to absorb future info.
- [[visual-attention-sink]] — extension of the phenomenon to visual tokens in MLLMs.
- [[mechanistic-interpretability]] — the sink is one of the most studied "circuit primitives".

## Sources

- [[gu-2024-attention-sink]] — defines the phenomenon, provides the `Sink^ε_k` metric, shows emergence during pre-training and proposes sigmoid-attention as a fix.
- [[fu-2025-sliding-window-attention]] — uses the sink analysis to justify SWAT (sigmoid + balanced ALiBi).
- [[pei-2025-causal-mask-attention]] — reinterprets the sink as a buffer to absorb future information in a training-free regime.
- [[kim-2026-sink-token-aware-pruning]] — extends the concept to visual tokens (sink-token in the video encoder) and introduces STSP/STTP.
- [[morini-2026-look-twice]] — applies sink filtering on the MLLM attention maps to identify visual evidence.
- [[kim-2025-map-the-flow]] — discusses the "static bias" as a possible mechanistic manifestation of the sink in Video LLMs.
- [[dosovitskiy-2021-vit]] — predecessor of the phenomenon: the `[class]` token acts as an embryonic analog.
