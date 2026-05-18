---
title: Sliding Window Attention (SWA)
type: concept
tags: [attention, efficient-llm, long-context, linear-complexity]
created: 2026-05-15
updated: 2026-05-15
---

# Sliding Window Attention (SWA)

Self-attention variant in which **each token attends only to the previous `ω` tokens** (and/or following ones in encoder models), reducing complexity from `O(N²)` to `O(N·ω)`. Introduced by Longformer (Beltagy 2020) for encoders and adopted by Mistral as a decoder component, it is one of the main families of **efficient attention** for long-context [source: raw/papers/fu-2025-sliding-window-attention.pdf §2.1]. Fu et al. (2025) showed that applying SWA **only at inference time** to a model trained with full attention generates a drastic training-inference gap, and that the root cause is the [[attention-sink]] propagated by the variance of the first token through softmax normalization.

## Key claims / Technique

- **Definition**: each token `m` attends to `n ∈ [m−ω+1, m]` ⇒ cost `O(N·ω)` instead of `O(N²)`. Evicted tokens are classified as **active** (inside the current window), **residual** (outside the embedding window but with information propagated through upper layers), **past** (information lost). Informational range of a token at layer `l`: `1 + (ω−1)·l`. Maximum: `1 + (ω−1)·L` [source: raw/papers/fu-2025-sliding-window-attention.pdf §2.1].
- **Fail-mode at inference**: on LLaMA-2-7B, LLaMA-3.1-8B, Qwen2-7B, Mistral-7B with PG-19, applying SWA only at eval blows up perplexity when `eval-length > training-length` even at fixed window (Fig. 2). The heatmap (Fig. 3) shows that the variance of the first token and the attention sink **strongly co-vary**; the sink is propagated by softmax normalization even in the presence of RoPE [source: raw/papers/fu-2025-sliding-window-attention.pdf §2.2].
- **Information loss of softmax**: the exponential concentrates mass on the max and squashes the other tokens (e.g. logits `[1.5, 5.0, 2.4, 0.5, 1.3]` → softmax `[0.03, 0.88, 0.07, 0.01, 0.02]`); SWA worsens the problem because the window sees even fewer tokens [source: raw/papers/fu-2025-sliding-window-attention.pdf §2.2].
- **SWAT (fix by Fu et al. 2025)**: replaces softmax with [[sigmoid-attention]], adds **balanced ALiBi** (half the heads with positive backward-looking slope, half with negative forward-looking slope) and keeps RoPE to stabilize training [source: raw/papers/fu-2025-sliding-window-attention.pdf §3.2].
- **Maximum attention distance**: `1 + (ω−1)·L`. For exact retrieval of very distant tokens, SWA alone is not enough — hybrids or explicit memory are needed [source: raw/papers/fu-2025-sliding-window-attention.pdf §7].

### SWAT formula

```
Attention(Q,K,V)_m = Σ_{n=m−ω+1}^{m} σ((R_{Θ,m} q_m)ᵀ (R_{Θ,n} k_n) / √d_k + s·(m−n)) · v_n
```
with `m−n < ω`, `R` RoPE rotation, and `s = ±2⁻ᵏ` balanced ALiBi bias [source: raw/papers/fu-2025-sliding-window-attention.pdf §3.2, Eq. 5].

## Variants / Extensions

- **Window attention in ViT** (Qwen2.5-VL): 28 out of 32 layers use a 112×112 window (8×8 patches of 14×14), full attention only in layers {7,15,23,31}; regions smaller than the window are processed without padding ⇒ supports [[dynamic-resolution]] while keeping linear cost [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.1.1].
- **Shifted window** (Mistral-style): allows information to propagate across windows via periodic shifts — Gu et al. show that the sink stays on the first absolute token if `t ≤ w`, outside the window it does not develop [source: raw/papers/gu-2024-attention-sink.pdf §6].
- **Streaming-LLM** (Xiao 2023): SWA + explicit anchoring of the first `k` tokens (sink) for infinite generation [source: raw/papers/gu-2024-attention-sink.pdf §1, §8].

## Related concepts

- [[attention-sink]] — cause of SWA-at-inference failure; anchor of Streaming-LLM.
- [[sigmoid-attention]] — softmax replacement that eliminates the sink in SWAT.
- [[streaming-llm]] — downstream application of SWA based on sink anchoring.
- [[rotary-position-embedding]] — used together with SWA to provide a positional signal.
- [[io-complexity]] — SWA is linear in N but competes with FlashAttention on HBM bandwidth.

## Sources

- [[fu-2025-sliding-window-attention]] — diagnosis of the training-inference gap; introduces SWAT.
- [[gu-2024-attention-sink]] — shows how the attention sink interacts with shifted/sliding window.
- [[qwen2-5-vl-2025-tech-report]] — window attention as efficiency primitive in ViT (not LLM).
