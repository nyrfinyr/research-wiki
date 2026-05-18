---
title: "Gu et al. (2024) — When Attention Sink Emerges in Language Models: An Empirical View"
type: source
tags: [attention-sink, language-models, pretraining, softmax, sigmoid-attention, key-bias, kv-cache, streaming-llm, interpretability]
created: 2026-05-15
updated: 2026-05-15
source_path: raw/papers/gu-2024-attention-sink.pdf
source_kind: paper
source_date: 2025-03-02
doi: 10.48550/arXiv.2410.10781
zotero_key: CXGDZHDX
venue: ICLR 2025
authors: [Xiangming Gu, Tianyu Pang, Chao Du, Qian Liu, Fengzhuo Zhang, Cunxiao Du, Ye Wang, Min Lin]
year: 2024
---

# Gu et al. (2024) — When Attention Sink Emerges in Language Models: An Empirical View

## TL;DR

The authors carry out a **systematic empirical study** of the **attention sink** — the phenomenon by which autoregressive language models assign disproportionate attention to the first token regardless of its semantic content. They show that (i) the sink is **universal**: it emerges in models from 14M (Pythia) to 70B (LLaMA-3), even with random inputs; (ii) it emerges **during pre-training** after ~1-2k effective optimisation steps, and strengthens with data scale and weight decay; (iii) its **position** depends on the loss function and data distribution (it can be shifted to different tokens); (iv) the first token acts as a **key bias**: it absorbs extra attention without contributing to the value. Crucially: by replacing softmax with **sigmoid attention without normalisation**, the attention sink **does not emerge** in models up to 1B. This provides the theoretical foundations for [[sliding-window-attention]], [[streaming-llm]], KV-cache eviction and quantisation methods that empirically already relied on the sink token [source: raw/papers/gu-2024-attention-sink.pdf §1, §7-§8].

## Main contribution

- **Decomposition** of the mechanism: `q_t k_1ᵀ = ‖q_t‖·‖k_1‖·cos(q_t, k_1)`; the first token has *small* `‖k_1‖` but very large `cos(q_t, k_1)` ⇒ it is the angle (the position on a separate manifold) that generates the sink, not the key norm (§3.1, Fig. 2).
- Quantitative metric `Sink^ε_k = (1/L)·Σ_l (1/H)·Σ_h I(α^(l,h)_k > ε)` with `ε = 0.3, T = 64` as default; allows empirical measurement of emergence (§3.2).
- Variable-by-variable study (optimisation, data, loss, architecture) — see below.
- Proof that **replacing softmax with sigmoid without normalisation** (or introducing explicit key biases) makes the sink disappear at parity of validation loss (§7.3-7.4).

## Method

### Empirical setup (§3.2, §4)

- Measured on `T=64` sequences (no BOS) on Pile-CC.
- Threshold `ε=0.3` (strict / `T`-robust compromise).
- Observed models: GPT-2, LLaMA-2 (7B,13B Base/Chat), LLaMA-3-8B, Mistral-7B, Pythia (14M→12B), OPT.
- Controlled pre-training: LLaMA-style ~60M parameters, `d=768, L=10, H=8, FFN=1536`, 5B Pile tokens, 20k steps, AdamW lr=4e-4, weight decay 0.1, context 2048, batch 1M tokens.

### Manifestation (§3.1, Fig. 2)

In LLaMA3-8B Base, from `l=2` onwards:
- `‖h^l_1‖` (hidden) has **massive activations**, much larger than the mean of the other tokens.
- `‖k^l_1‖`, `‖v^l_1‖` are **smaller** than the mean of the other tokens.
- `q_t k_1ᵀ ≫ q_t k_jᵀ` for `j≠1`, driven by large `cos(q_t, k_1)` (and not by norm).

Conclusion: the first token uses its key as a **bias** along a direction that minimises the angle with all queries.

### Results per analysis axis

#### Optimisation (§4, Fig. 4)
- Sink emerges between **1k-2k steps** under the default setup.
- **Smaller learning rate** ⇒ sink emerges later and weaker; with too-low LR (broken training) the sink does not emerge.
- **Batch size** has no isolated effect (Tab. 10).

#### Loss function (§6)
- **Weight decay**: `γ ∈ [0.001, 0.5]` increases `Sink^ε_1` (15→41% at γ=0.5). For very large γ (≥2) training breaks and the sink disappears.
- **Prefix LM** (loss on tokens > p, with `p>1`): the sink **spreads over the prefix tokens** rather than only on the first (Fig. 5 middle).
- **Shifted window attention** (Mistral-style): the sink stays on the **absolute first token** if `t ≤ w`; for `t > w` the "relative first token" does not develop a sink. Small window size prevents emergence (Fig. 6).

#### Data distribution (§5)
- With **less data** (≤500M tokens) the sink **does not emerge** (Fig. 5 right).
- Re-sampling the first token uniformly from V → sink **increases** (27% vs. 18%): confirms the low-semantic-information nature of the sink token.
- Pinning `x_fix` at position 2 or 3 → the sink **moves** there (Tab. 10 right).

#### Model architecture (§7)
- **Positional embedding** (NoPE, absolute, learnable, relative, ALiBi, Rotary) does not affect emergence (Tab. 3): all develop a sink.
- **Pre-norm vs. Post-norm**: in post-norm the massive activations come before LN, not in `h^l_1`; the sink remains (`Sink^ε_1 = 13.5%`).
- **Key biases** (learnable `k*^l,h`) or **learnable sink token** or **KV-biases** ⇒ the sink **shifts** from the first token to the biases (`Sink^ε_* ~73%`, `Sink^ε_1 ~0%`), validation loss unchanged (Tab. 4). **V-biases alone** are not enough.
- Increasing `‖v*‖` brings the sink back to the first token (Tab. 5).
- **Softmax → sigmoid without normalisation**: `Sink^ε_1 ≈ 0.44%`, valid loss 3.70 (vs. 3.73 softmax) — sink **does not emerge** up to 1B parameters (Tab. 6, §7.4). Same with elu+1 without normalisation, or kernel MLP. Keeping normalisation (normalised sigmoid) reintroduces the sink.

## Key results (numeric summary)

| Experiment | `Sink^ε_1` | Notes |
|---|---|---|
| Default 60M LLaMA, softmax, Rotary | 18.18% | baseline |
| No weight decay (γ=0) | 15.2% | emerges anyway |
| γ=0.5 | 41.08% | weight decay strengthens it |
| LR×0.1 (same steps) | much lower | weak optimisation |
| Data 50-200M | ~0% | insufficient training data |
| Prefix LM (p=5) | sink on prefix | not only on first |
| K-biases (learnable k*) | 0.04% (on first) / 72.76% (on biases) | shifted sink |
| Sigmoid attention (no norm) | 0.44%* | sink does not emerge |
| MLP-kernel attention | 0%* | sink does not emerge |

LLaMA-3-8B Base reaches `Sink^ε_1 = 99.02%` on natural sequences ⇒ the phenomenon is maximally expressed in production-scale models (Tab. 1).

## Stated limitations

- Controlled pre-training experiments limited to ~60M parameters / 5B tokens; scaling the conclusions to 100B+ remains to be verified at controlled cost.
- The sink is studied as an **emergent** phenomenon of pre-training, but no new large-scale training recipe is proposed: non-normalised sigmoid attention is validated up to 1B (§7.4).
- The `cos(q,k)` analysis is observational: no **predictive theory** is provided for when exactly the sink emerges as a function of lr × token-count.
- The link with [[streaming-llm]] and KV-cache is motivational but those benchmarks are not re-run with the proposed fix.

## Open questions / critiques

- Sigmoid attention without normalisation maintains quality at 1B; **does it hold at 7B / 70B**? Mistral / LLaMA have not adopted it. Cf. [[sliding-window-attention]] (Fu 2025) which uses sigmoid + sliding window with strong results at 760M, directionally confirming.
- Effects on **long contexts** (>32K) and on **in-context learning** are not quantified.
- The "key bias" interpreted as a dump of extra attention: there is no metric for **how much useful information** that attention carries (perhaps not zero for some heads).
- The paper does not discuss the interaction of the sink with [[flash-attention]] or with quantisation that explicitly uses the first token as an anchor (Xiao 2023b).
- MLLMs (e.g. LLaVA, Qwen-VL) show analogous behaviour on visual tokens: cross-modal generalisation of the mechanism is not discussed here (see Morini 2026 [[look-twice]] for evidence in MLLMs).

## Cited concepts

[[attention-sink]], [[self-attention]], [[scaled-dot-product-attention]], [[multi-head-attention]], [[transformer]], [[layer-normalization]], [[positional-encoding]], [[rotary-position-embedding]], [[alibi]], [[sigmoid-attention]], [[key-bias]], [[massive-activations]], [[kv-cache]], [[streaming-llm]], [[pre-norm-post-norm]], [[weight-decay]], [[sliding-window-attention]].

## Relevant direct quotes

> "Auto-regressive Language Models (LMs) assign significant attention to the first token, even if it is not semantically important, which is known as attention sink." (Abstract)

> "Most importantly, we find that attention sink acts more like key biases, storing extra attention scores, which could be non-informative and not contribute to the value computation." (Abstract)

> "After relaxing such dependence by replacing softmax attention with other attention operations, such as sigmoid attention without normalization, attention sinks do not emerge in LMs up to 1B parameters." (Abstract)

> "Attention sink emerges after LMs are trained effectively. Attention sink appears less obvious in LMs trained with small learning rates." (§4, Takeaways)

> "Although ‖q^l,h_t‖·‖k^l,h_1‖ is comparatively small, cos(q^l,h_t, k^l,h_1) is significantly large, leading to attention sink. This explains why attention sink exists despite the small ℓ2-norm of keys of the first token." (§3.1)
