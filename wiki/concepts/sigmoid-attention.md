---
title: Sigmoid Attention
type: concept
tags: [attention, softmax-alternative, attention-sink, transformer]
created: 2026-05-15
updated: 2026-05-15
---

# Sigmoid Attention

Replacement of softmax with the **element-wise sigmoid function** in attention weights: `Attention(Q,K,V) = σ(QKᵀ/√d) V` instead of `softmax(QKᵀ/√d) V`. The crucial difference is the absence of **row-wise normalization**: weights are not required to sum to 1 per row, so attention becomes **dense** (all tokens can contribute significantly) and does not develop the winner-take-all effect of the exponential. It was proposed in a "clean" form by Gu et al. (2024) as an **architectural remedy to the [[attention-sink]]** and adopted by SWAT (Fu 2025) as the central component of the sliding window training layer [source: raw/papers/gu-2024-attention-sink.pdf §7.3-7.4; raw/papers/fu-2025-sliding-window-attention.pdf §3.2].

## Key claims / Technique

- **Sink elimination in pre-training** (Gu et al.): replacing softmax with **sigmoid without normalization**, `Sink^ε_1 ≈ 0.44%` vs 18.18% for the default; valid loss 3.70 vs 3.73 softmax — **sink does not emerge** up to 1B parameters. Same effect with `elu+1 without normalization` or MLP kernel. **Keeping normalization** (normalized sigmoid) the sink reappears ⇒ the root cause is **normalization**, not softmax itself [source: raw/papers/gu-2024-attention-sink.pdf §7.4, Tab. 6].
- **Double benefit for SWA** (Fu et al.): in SWAT the sigmoid is used to (1) **prevent the attention sink** propagated by the variance of the first token through normalization, (2) **keep dense attention weights** that avoid the **information loss of softmax** (e.g. logits `[1.5, 5.0, 2.4, 0.5, 1.3]` → softmax `[0.03, 0.88, 0.07, 0.01, 0.02]`) [source: raw/papers/fu-2025-sliding-window-attention.pdf §1, §2.2, §3.2].
- **Practical limits (instability without positional bias)**: pure sigmoid on Vanilla 128/128 fails in Fu et al. (PPL 14.26 vs 5.51 softmax); it must be combined with [[rotary-position-embedding]] and/or balanced ALiBi for stability [source: raw/papers/fu-2025-sliding-window-attention.pdf §4.4, Tab. 3, No.2].
- **Adoption open question**: validated up to 760M (SWAT) / 1B (Gu); behavior at 7B / 70B / 235B (the scales of current production models) **is not yet demonstrated** — Mistral, LLaMA, Qwen have not adopted it [source: raw/papers/gu-2024-attention-sink.pdf §open questions].

### Formula comparison

| Variant | Weights | Sink^ε_1 | Notes |
|---|---|---|---|
| Softmax (default) | `softmax(QKᵀ/√d)` | ~18-99% | sink always emerges |
| Normalized sigmoid | `σ(QKᵀ/√d) / Σσ` | sink reappears | normalization = cause |
| **Sigmoid no-norm** | `σ(QKᵀ/√d)` | **≈ 0.44%** | sink does not emerge |
| MLP kernel no-norm | `φ(Q)φ(K)ᵀ` | ≈ 0% | sink does not emerge |

[source: raw/papers/gu-2024-attention-sink.pdf §7.4, Tab. 6]

## Variants / Extensions

- **SWAT layer** (Fu 2025): `σ(QKᵀ/√d + s·(m−n)) · V` with `m−n < ω` (sliding window), RoPE on Q,K, balanced ALiBi on `s` [source: raw/papers/fu-2025-sliding-window-attention.pdf §3.2, Eq. 5].
- **Linear attention kernel** (Katharopoulos 2020 and successors): `φ(Q)φ(K)ᵀ V` — even without normalization the sink disappears; indirectly confirms Gu's thesis.

## Related concepts

- [[attention-sink]] — phenomenon that sigmoid-attention eliminates at the root.
- [[scaled-dot-product-attention]] — "canonical" variant replaced by sigmoid.
- [[sliding-window-attention]] — SWAT combines sigmoid with windowing for efficient long-context.
- [[kv-cache]] — a sink-free model could make Streaming-LLM's anchoring obsolete.

## Sources

- [[gu-2024-attention-sink]] — proposes sigmoid-no-norm as an architectural remedy to the sink.
- [[fu-2025-sliding-window-attention]] — adopts sigmoid in SWAT, directionally confirms Gu at 760M.
