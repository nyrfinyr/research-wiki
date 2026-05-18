---
title: FlashAttention
type: concept
tags: [attention, gpu, io-aware, kernel-fusion, tiling]
created: 2026-05-15
updated: 2026-05-15
---

# FlashAttention

**IO-aware** and **exact** (non-approximated) algorithm for computing self-attention of [[transformer]] models on GPU. The central thesis is that the bottleneck of self-attention is not FLOPs but **reads/writes between HBM (GPU memory) and on-chip SRAM**: by combining softmax tiling and recomputation in backward in a single fused CUDA kernel, FlashAttention reduces HBM accesses from `Θ(Nd + N²)` to `Θ(N²·d²/M)` (with `M` = SRAM size), with `O(N)` memory instead of `O(N²)` [source: raw/papers/dao-2022-flashattention.pdf §1, §3]. It has become the *de facto* standard for training current Transformers and for the vision encoders of VLMs.

## Key claims / Technique

- **IO-aware principle**: make the GPU memory hierarchy explicit (HBM 40-80GB @ 1.5-2.0 TB/s vs SRAM ~192KB/SM @ 19 TB/s) and optimize accesses, not FLOPs. Attention operations (softmax, dropout, mask) are memory-bound: low arithmetic intensity ⇒ time is dominated by HBM accesses [source: raw/papers/dao-2022-flashattention.pdf §2.1].
- **Softmax tiling with online statistics**: for two blocks `x⁽¹⁾, x⁽²⁾` one maintains `(m, ℓ)` (max and denominator), updated with `m(x) = max(m(x⁽¹⁾), m(x⁽²⁾))` and re-scaling via `e^(m_old−m_new)`; this allows computing exact softmax without materializing `S = QKᵀ` or `P = softmax(S)` on HBM [source: raw/papers/dao-2022-flashattention.pdf §3.1].
- **Forward algorithm**: outer loop over `B_c = ⌈M/(4d)⌉` blocks of `K,V` loaded in SRAM, inner loop over `B_r = min(B_c, d)` blocks of `Q, O, ℓ, m`; everything in a **single fused CUDA kernel**, mask and dropout included [source: raw/papers/dao-2022-flashattention.pdf §3.1, Alg. 1].
- **Backward with recomputation**: only `O, m, ℓ` are saved (total `O(N)`); `S, P` are **recomputed** in SRAM block by block. FLOPs increase, but backward is still faster due to fewer HBM accesses [source: raw/papers/dao-2022-flashattention.pdf §3.1].
- **IO lower bound**: for `d ≤ M ≤ Nd`, FlashAttention requires `Θ(N²d²/M)` HBM accesses versus `Θ(Nd + N²)` for standard attention; **Prop. 3** proves that no exact algorithm can do `o(N²d²/M)` HBM accesses ⇒ FlashAttention is asymptotically optimal [source: raw/papers/dao-2022-flashattention.pdf §3.2, Theorem 2, Prop. 3].
- **Block-sparse extension**: given a sparse mask `M̃` with fraction `s` of non-zero blocks, IO complexity scales as `Θ(Nd + N²d²/M · s)` (2-4× faster than dense) [source: raw/papers/dao-2022-flashattention.pdf §3.3].

### Key formula: softmax tiling

```
m_new = max(m_i, rowmax(S_ij))
ℓ_new = e^(m_i−m_new)·ℓ_i + e^(rowmax(S_ij)−m_new)·rowsum(P̃_ij)
O_i ← diag(ℓ_new)⁻¹ · (diag(ℓ_i)·e^(m_i−m_new)·O_i + e^(rowmax−m_new)·P̃_ij·V_j)
```

## End-to-end results

- BERT-large: 15% faster than the MLPerf 1.1 record; GPT-2 up to 3.5× faster than HuggingFace, 2× over Megatron-LM; LRA 2.4×; first Transformer to beat Path-X (seq 16K) and Path-256 (seq 64K, block-sparse variant) [source: raw/papers/dao-2022-flashattention.pdf §4].

## Limitations and tensions

- **Materialization of attention maps**: FlashAttention deliberately does not write `P` to HBM. Methods that require inspection of attention (e.g. [[evidence-highlighting]] from Morini 2026, [[mechanistic-interpretability]] from Kim 2025, AIF from Liu 2026) are **incompatible** with FlashAttention out-of-the-box and introduce significant memory overhead [source: raw/papers/morini-2026-look-twice.pdf §limitations].
- The paper predates the formal observation of [[attention-sink]]: the interaction between FlashAttention and sink-token-based quantization is not discussed [source: raw/papers/gu-2024-attention-sink.pdf §1].

## Related concepts

- [[io-complexity]] — analysis paradigm (Aggarwal-Vitter) used by Dao for the bounds.
- [[scaled-dot-product-attention]] — base operation that FlashAttention implements exactly.
- [[vision-transformer]] — direct beneficiary: training on long sequences becomes practical.
- [[sliding-window-attention]] — alternative with linear but approximate (non-exact) cost.

## Sources

- [[dao-2022-flashattention]] — introduces the algorithm, the IO-aware principle and the lower bound.
- [[qwen2-5-vl-2025-tech-report]] — uses FlashAttention as comparison baseline for ViT window attention.
- [[li-2024-mvbench]] — used for efficient training of VideoChat2.
- [[pei-2025-causal-mask-attention]] — concrete implementation of future-aware masks (FlashAttention-2.6.3).
- [[morini-2026-look-twice]] — discusses the tension between LoT and FlashAttention (non-materialized attention maps).
- [[gu-2024-attention-sink]] — flags the undiscussed interaction between sink and FlashAttention.
- [[dosovitskiy-2021-vit]] — architectural predecessor, predates the IO-aware technique.
