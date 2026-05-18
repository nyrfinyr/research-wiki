---
title: IO Complexity
type: concept
tags: [hardware, gpu, memory-hierarchy, complexity-analysis]
created: 2026-05-15
updated: 2026-05-15
---

# IO Complexity

Algorithmic analysis paradigm (Aggarwal-Vitter 1988) that counts **memory transfers** between two levels of the memory hierarchy — typically *fast small* (cache/SRAM) and *slow large* (DRAM/HBM) — instead of counting FLOPs. For [[transformer]] self-attention on GPU, Dao et al. (2022) showed that the bottleneck is not FLOPs but HBM accesses, and used IO analysis to prove that [[flash-attention]] is asymptotically optimal: no exact algorithm can do `o(N²d²/M)` HBM accesses for `M ∈ [d, Nd]` [source: raw/papers/dao-2022-flashattention.pdf §3.2, Theorem 2, Prop. 3].

## Key claims / Technique

- **Setup**: a hierarchy is modeled with fast but small SRAM (`M` words) and large but slow HBM. The cost of the algorithm is the number of word-transfers between the two levels; FLOPs executed in SRAM are "free" for IO counting.
- **GPU A100 example** (Fig. 1 of Dao): HBM 40-80 GB at 1.5-2.0 TB/s; on-chip SRAM ~192 KB per SM (108 SMs) at ~19 TB/s ⇒ SRAM is ~10× faster and ~10⁵× smaller. Attention operations (softmax, dropout, mask) are **memory-bound**: low arithmetic intensity ⇒ time is dominated by HBM accesses [source: raw/papers/dao-2022-flashattention.pdf §2.1].
- **Standard attention IO**: three passes that each write/read `O(N²)` on HBM (write `S = QKᵀ`, read `S`/write `P = softmax(S)`, read `P`/compute `O = PV`). Total `Θ(Nd + N²)` HBM accesses. GPT-2 with `N=1024, d=64`: 40.3 GB HBM R/W for 66.6 GFLOPs ⇒ memory-bound [source: raw/papers/dao-2022-flashattention.pdf §2.2].
- **FlashAttention IO** (Theorem 2): for `d ≤ M ≤ Nd`, FlashAttention requires `Θ(N²d²/M)` HBM accesses. For `d ∈ {64, 128}` and `M ≈ 100 KB`, `d²/M ≪ 1` ⇒ up to **9× fewer** HBM accesses [source: raw/papers/dao-2022-flashattention.pdf §3.2, Fig. 2].
- **Lower bound** (Prop. 3): no exact attention algorithm can do `o(N²d²/M)` HBM accesses for all `M` in the interval ⇒ FlashAttention is optimal up to constants.
- **Block-sparse**: given sparsity `s`, IO drops to `Θ(Nd + N²d²/M · s)`. For butterfly patterns `s = O(1/√N)` ⇒ `Θ(N√N)` [source: raw/papers/dao-2022-flashattention.pdf §3.3, Prop. 4].

### IO complexity comparison

| Algorithm | HBM accesses | Extra memory |
|---|---|---|
| Standard attention | `Θ(Nd + N²)` | `O(N²)` |
| **FlashAttention** | **`Θ(N²d²/M)`** | **`O(N)`** |
| Block-sparse FA (sparsity `s`) | `Θ(Nd + N²d²·s/M)` | `O(N)` |
| Lower bound (any exact) | `Ω(N²d²/M)` | — |

[source: raw/papers/dao-2022-flashattention.pdf §3.2-3.3]

## Related concepts

- [[flash-attention]] — implementation that reaches the IO lower bound.
- [[scaled-dot-product-attention]] — operation on which IO analysis is applied.
- [[sliding-window-attention]] — alternative to IO-aware approach (reduces `N` instead of `M`).

## Sources

- [[dao-2022-flashattention]] — applies IO complexity to attention; proves lower bound `Ω(N²d²/M)`.
