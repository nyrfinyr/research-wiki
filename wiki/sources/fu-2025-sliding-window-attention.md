---
title: "Fu et al. (2025) — SWAT: Sliding Window Attention Training for Efficient Large Language Models"
type: source
tags: [sliding-window-attention, sigmoid-attention, alibi, rope, attention-sink, long-context, linear-complexity, efficient-llms, swat, training-inference-gap]
created: 2026-05-15
updated: 2026-05-15
source_path: raw/papers/fu-2025-sliding-window-attention.pdf
source_kind: paper
source_date: 2025-06-04
doi: 10.48550/arXiv.2502.18845
zotero_key: SKQEGEC2
venue: arXiv preprint (v2 2025)
authors: [Zichuan Fu, Wentao Song, Yejing Wang, Xian Wu, Yefeng Zheng, Yingying Zhang, Derong Xu, Xuetao Wei, Tong Xu, Xiangyu Zhao]
year: 2025
---

# Fu et al. (2025) — SWAT: Sliding Window Attention Training for Efficient Large Language Models

## TL;DR

SWAT proposes an attention layer designed explicitly to be **trained** with sliding window (not only applied as an inference-time fix). The recipe replaces softmax with **sigmoid** (to prevent the attention sink caused by softmax-normalisation variance and to avoid the aggressive sparsification that erases historical information), adds a **balanced ALiBi** bidirectional bias to inject positional cues inside the window, and integrates **RoPE** for training stability. The result is a model with linear inference complexity `O(N·ω)` that beats both Transformer++ and all modern recurrent architectures (RetNet, Mamba/Mamba-2, GLA, DeltaNet, TTT, Gated DeltaNet, Titans) on the average of 8 common-sense reasoning benchmarks, at 340M and 760M parameters [source: raw/papers/fu-2025-sliding-window-attention.pdf §1, §4.2, Tab. 1].

## Main contribution

- Empirical analysis of the **training-inference gap** of sliding window attention: applying SWA only at inference time degrades (Fig. 2: perplexity explodes when eval-length > training-length even with a fixed window) [source: raw/papers/fu-2025-sliding-window-attention.pdf §2.2].
- Diagnosis: two main causes — (1) **attention sink** (Gu et al. 2024, [[attention-sink]]) propagated by the variance of the first token through softmax normalisation (Fig. 3); (2) softmax **information loss**: the exponential concentrates mass on the max and crushes the other tokens (example: logits `[1.5, 5.0, 2.4, 0.5, 1.3]` → softmax `[0.03, 0.88, 0.07, 0.01, 0.02]`) [source: raw/papers/fu-2025-sliding-window-attention.pdf §2.2].
- **SWAT** architecture = `sigmoid(QKᵀ/√d + s·(m−n)) · V` with `m−n < ω`, integrated with RoPE; "balanced ALiBi" assigns half of the heads a positive slope (backward-looking, preserves history) and half a negative slope (forward-looking, recent) [source: raw/papers/fu-2025-sliding-window-attention.pdf §3.2].

## Method

### Sliding Window Attention (§2.1)

Each token attends only to the `ω` previous ones ⇒ cost `O(N·ω)` (vs. `O(N²)`). Evicted tokens are classified as (Fig. 1):
- **active** (inside the current window),
- **residual** (outside the embedding window but with information propagated through higher layers),
- **past** (lost information).

Informative range of a token at layer `l`: `1 + (ω−1)·l`. Maximum: `1 + (ω−1)·L`.

### Why SWA-at-inference fails (§2.2)

- On LLaMA-2-7B, LLaMA-3.1-8B, Qwen2-7B, Mistral-7B with PG-19 (Fig. 2): perplexity is optimal only when `eval-length = train-length`; when eval exceeds train, PPL grows even with a constant window.
- Heatmap (Fig. 3): the **variance of the first token** (top) and the **attention sink** (bottom) co-vary strongly. Even with RoPE, absolute-position information is reabsorbed through the variance of the softmax normaliser (Chi et al. 2023).
- Conclusion: one must **train** with SWA to close the gap.

### SWAT layer (§3.2)

1. Replace softmax with **sigmoid**:
   `Attention(Q,K,V) = σ(QKᵀ/√d) V`.
   Advantages: dense attention (tokens do not suppress each other), no normalisation ⇒ no attention sink propagated via softmax variance.
2. **Balanced ALiBi**: bias `s·(m−n)` added to the logits; for the `h/2` "forward" heads `s_k = −2⁻ᵏ`, for the other `h/2` "backward" heads `s_k = 2⁻ᵏ`. The positive sign allows privileging tokens *further* in the window ⇒ preserving history (Eq. 4).
3. **RoPE** kept to provide explicit positional signal to the hidden states and stabilise training (sigmoid + balanced ALiBi alone are unstable — Fig. 5).

Final formula (Eq. 5):
```
Attention(Q,K,V)_m = Σ_{n=m−ω+1}^{m} σ((R^d_{Θ,m} q_m)ᵀ (R^d_{Θ,n} k_n) / √d_k + s·(m−n)) · v_n
```

### Inference (§3.3)

Cost `O(N·ω·(1+δ_ALiBi))` with `δ_ALiBi ≪ 1`. Per-token comparable to dense Transformer, but globally linear in `N`.

### Training (§4.1)

- Dataset: FineWeb-Edu 100BT (high-quality educational).
- Models: 340M (15B tokens), 760M (30B tokens).
- Llama-2 vocab, seq 4096, batch 0.5M tokens.

## Key results

### Common-sense reasoning (Tab. 1, §4.2)

Average over 8 tasks (Wiki/LMB ppl, PIQA, Hellaswag, Wino, ARC-e/c, SIQA, BoolQ acc):

**340M / 15B tokens** (top-3):
| Model | Avg |
|---|---|
| **SWAT (-)** (forward-looking) | **46.88** |
| SWAT (-+) (balanced) | 45.85 |
| Titans | 46.17 |
| Gated DeltaNet | 45.42 |
| Transformer++ | 42.92 |

**760M / 30B tokens**:
| Model | Avg |
|---|---|
| **SWAT (-)** | **51.85** |
| Titans | 51.56 |
| Gated DeltaNet | 49.69 |
| Transformer++ | 48.69 |
| Mamba | 47.22 |

Balanced SWAT (-+) excels on **BoolQ** (62.11%, best result): confirms that backward-looking heads are crucial when historical context is discriminative.

### SWA training vs. vanilla (Tab. 2, §4.3)

Llama2-style on OpenWebText, PG-19, OpenOrca, eval sequences up to 16,384:
- **Vanilla 128/128** collapses to 4.84 PPL on OpenWebText at 16K eval.
- **Sliding-Window 128 (train=1024)** reaches 3.00 at 16K — **stable** as eval-length grows.
- Vanilla 1024 with eval > training-length grows in PPL (3.06 → 3.55 at 16K if eval-window > train-window).

Takeaway: training with SWA forces the network to **compress historical information** into residual tokens; vanilla, which sees everything, does not develop this ability and breaks out of distribution.

### Ablation (Tab. 3, §4.4)

11 configurations tested across eval sequences. Summary:
- Pure sigmoid on Vanilla 128/128 fails (PPL 14.26 vs. 5.51 softmax): without positional bias information overlaps (No.2).
- Sigmoid + balanced ALiBi (No.6, 6:6) recovers but is unstable in the long run (Fig. 5).
- Sigmoid + **AliRope-6:6** (No.8) obtains the lowest mean loss (2.51) and **stable** training (Fig. 5).
- Extending training length 1024→2048 at the same window does not help (No.7).
- Increasing the training window to 1024 (No.9) preserves the advantage.

## Stated limitations

- **Hyperparameter sensitivity**: window size, depth, ALiBi slope distribution require dedicated search (§7).
- At larger scale (beyond their 760M) there might be **diminishing returns**: with more parameters the model memorises more training data ⇒ less need for "information passed via residual tokens" ⇒ the SWA mechanism may degrade. Left to future work with cross-step caching (§7).
- **Maximum attention distance** intrinsically limited to `1 + (ω−1)·L`: for tasks that require exact retrieval of very distant tokens, SWAT alone is insufficient — hybrid or explicit memory architectures are needed (§7).

## Open questions / critiques

- A comparison **at matched compute** with FlashAttention-style training is not reported (the wall-clock speedup of SWAT vs. Transformer++ with FlashAttention2 on the same hardware would be desirable).
- No test on long contexts `>16K` nor on retrieval (needle-in-a-haystack): the claim "compress arbitrarily long texts" is motivational, not quantified beyond 16K.
- Scaling beyond 760M: does the same architecture hold at 7B? Mistral uses SWA only at inference, not in training.
- The effect of **balanced ALiBi** is plausible but a heuristic: there is no formal justification of why positive slope preserves *better* than negative slope.
- Generalisation to **multimodal / non-causal**: SWAT is designed for decoder-only; encoder or cross-attention are not discussed.
- Connection with `Sink^ε` from [[gu-2024-attention-sink]]: not directly measured for SWAT, but consistent with the prediction (sigmoid + no normalisation → no sink).

## Cited concepts

[[sliding-window-attention]], [[sigmoid-attention]], [[alibi]], [[rotary-position-embedding]], [[attention-sink]], [[long-context]], [[linear-complexity]], [[transformer]], [[self-attention]], [[scaled-dot-product-attention]], [[longformer]], [[mamba]], [[state-space-models]], [[retnet]], [[gated-linear-attention]], [[deltanet]], [[titans]], [[fineweb-edu]], [[pg-19]], [[piqa]], [[hellaswag]], [[boolq]].

## Relevant direct quotes

> "Current researches on SWA predominantly focus on solving the attention sink problem within the inference phase ... However, they leave the training process unchanged, thereby creating a gap between inference and training." (§1)

> "Removing normalization from the attention mechanism can effectively eliminate the attention sink effect ... we analyze the attention patterns and hidden state statistics of Qwen2-7B ... Our results reveal a strong correlation between token variance and attention sink magnitude." (§2.2)

> "SWAT replaces the softmax operation with the sigmoid function, which not only prevents the attention sink problem but also maintains dense attention weights for higher information capacity per token." (§1)

> "SWAT's maximum attention distance is constrained by the product of window size and model depth ... information loss remains inevitable when processing ultra-long sequences." (§7)
