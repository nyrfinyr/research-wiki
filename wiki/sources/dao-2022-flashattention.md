---
title: "Dao et al. (2022) — FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness"
type: source
tags: [flash-attention, attention, gpu, io-aware, transformer, kernel-fusion, tiling, memory-efficiency, hbm, sram]
created: 2026-05-15
updated: 2026-05-15
source_path: raw/papers/dao-2022-flashattention.pdf
source_kind: paper
source_date: 2022-06-24
doi: 10.48550/arXiv.2205.14135
zotero_key: ABDL6XM2
venue: NeurIPS 2022
authors: [Tri Dao, Daniel Y. Fu, Stefano Ermon, Atri Rudra, Christopher Ré]
year: 2022
---

# Dao et al. (2022) — FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness

## TL;DR

FlashAttention is an **IO-aware**, **exact** (non-approximate) algorithm for computing self-attention in [[transformer]] models on GPUs. The central thesis: the bottleneck is not FLOPs but **reads/writes between HBM (GPU memory) and on-chip SRAM**. By combining softmax tiling and backward-pass recomputation in a single fused CUDA kernel, FlashAttention reduces HBM accesses from `Θ(Nd + N²)` to `Θ(N²·d²/M)` (where `M` is the SRAM size), with `O(N)` memory instead of `O(N²)`. End-to-end results: BERT-large 15% faster than the MLPerf 1.1 record, GPT-2 up to 3× faster than Megatron/HuggingFace, LRA 2.4×, and the **first Transformer** to beat the chance baseline on Path-X (seq 16K) and — in a block-sparse variant — on Path-256 (seq 64K) [source: raw/papers/dao-2022-flashattention.pdf §1, §4].

## Main contribution

- **IO-aware principle**: make the GPU memory hierarchy explicit (slow/large HBM vs. fast/small SRAM) and optimise memory accesses, not FLOPs (§1, §2.1).
- **Exact** algorithm that computes block softmax while keeping statistics (max `m`, denominator `ℓ`) to reconstruct the global result ⇒ no need to materialise `S = QKᵀ` or `P = softmax(S)` in HBM (§3.1).
- **IO lower bound**: `Ω(N²·d²/M⁻¹)` for any exact attention algorithm in the range `M ∈ [d, Nd]` ⇒ FlashAttention is optimal up to constants (§3.2, Prop. 3).
- **Block-sparse FlashAttention** extension that applies the same scheme only to non-zero blocks of a mask ⇒ IO complexity scaled by a sparsity factor `s`, 2-4× faster than dense FlashAttention (§3.3).

## Method

### GPU memory hierarchy (§2.1)

A100 example (Fig. 1): HBM 40-80 GB at 1.5-2.0 TB/s; on-chip SRAM ~192 KB per SM (108 SMs) at ~19 TB/s. SRAM is ~10× faster and ~10⁵× smaller. Attention operations (softmax, dropout, mask) are **memory-bound**: low arithmetic intensity ⇒ runtime is dominated by HBM accesses.

### Standard attention (Alg. 0, §2.2)

Three passes each writing/reading `O(N²)` to HBM:
1. `S = QKᵀ` (write `S`).
2. `P = softmax(S)` (read `S`, write `P`).
3. `O = PV` (read `P`).

On GPT-2 with `N=1024, d=64`: 40.3 GB of HBM R/W for attention vs. 66.6 GFLOPs ⇒ the run is memory-dominated.

### Softmax tiling (§3.1)

Softmax couples columns (requires the max and sum over the entire row). The **algebraic decomposition** is used: for two blocks `x⁽¹⁾, x⁽²⁾`,
- `m(x) = max(m(x⁽¹⁾), m(x⁽²⁾))`,
- `f(x⁽ⁱ⁾) = e^(m(x⁽ⁱ⁾) − m(x)) · f(x⁽ⁱ⁾)`,
- `ℓ(x) = e^(m(x⁽¹⁾)−m(x))·ℓ(x⁽¹⁾) + e^(m(x⁽²⁾)−m(x))·ℓ(x⁽²⁾)`.

Keeping `(m_i, ℓ_i)` for each row block, the contributions of the column blocks are **aggregated incrementally**, rescaling the output with `diag(ℓ_new)⁻¹`. This aggregation is called "algebraic aggregation" (§3.1, footnote 2).

### Algorithm 1 (forward) (§3.1)

- Block sizes `B_c = ⌈M/(4d)⌉`, `B_r = min(B_c, d)`.
- Outer loop over `j = 1..T_c` (blocks of `K, V` loaded into SRAM).
- Inner loop over `i = 1..T_r` (blocks of `Q, O, ℓ, m` loaded into SRAM).
- On-chip: `S_ij = Q_i K_jᵀ`, `m̃_ij = rowmax(S_ij)`, `P̃_ij = exp(S_ij − m̃_ij)`, `ℓ̃_ij = rowsum(P̃_ij)`.
- Update: `m_new = max(m_i, m̃_ij)`, `ℓ_new = e^(m_i−m_new)·ℓ_i + e^(m̃_ij−m_new)·ℓ̃_ij`.
- Write back `O_i = diag(ℓ_new)⁻¹ (diag(ℓ_i)·e^(m_i−m_new)·O_i + e^(m̃_ij−m_new)·P̃_ij·V_j)`.

Everything runs in a **single fused CUDA kernel** (kernel fusion), including mask and dropout (Appendix B).

### Backward with recomputation (§3.1)

Instead of saving `S, P ∈ R^(N×N)` to HBM for the backward pass, only `O` and the statistics `(m, ℓ)` are saved (total `O(N)`). In backward, `S, P` are **recomputed** in SRAM block by block. This is a form of selective gradient checkpointing. FLOPs increase, but the backward pass is still faster thanks to fewer HBM accesses (§3.1, Fig. 2 left).

### Theorems 1 and 2 — IO complexity (§3.2)

- **Theorem 1**: the algorithm returns `O = softmax(QKᵀ)V` with `O(N²d)` FLOPs and `O(N)` extra memory (beyond input/output).
- **Theorem 2**: for `d ≤ M ≤ Nd`, FlashAttention needs `Θ(N²d²/M)` HBM accesses against `Θ(Nd + N²)` for standard attention.

For `d ∈ {64, 128}` and `M ≈ 100 KB`, `d²/M ≪ 1` ⇒ up to **9× fewer** HBM accesses (Fig. 2).

- **Proposition 3 (lower bound)**: no exact algorithm can do `o(N²d²/M)` HBM accesses for all `M ∈ [d, Nd]` ⇒ FlashAttention is asymptotically optimal.

### Block-sparse FlashAttention (§3.3)

Given a block-sparse mask `M̃ ∈ {0,1}^(N/B_r × N/B_c)` with a fraction `s` of non-zero blocks, computation of zero blocks is skipped ⇒ IO complexity `Θ(Nd + N²d²/M · s)` (Prop. 4). For butterfly patterns `s = O(1/√N)` or `s = O(log N / N)` ⇒ `Θ(N√N)` or `Θ(N log N)`.

## Key results

### BERT-large (Tab. 1, §4.1)

Training to a target 72.0% MLM accuracy on Wikipedia, 8×A100:
- Nvidia MLPerf 1.1: 20.0 ± 1.5 min.
- FlashAttention: **17.4 ± 1.4 min** (15% faster).

### GPT-2 on OpenWebText (Tab. 2, §4.1)

8×A100, identical perplexity (no quality regression):

| Model | Implementation | Time (days) | Speedup |
|---|---|---|---|
| GPT-2 small | HuggingFace | 9.5 | 1.0× |
| GPT-2 small | Megatron-LM | 4.7 | 2.0× |
| GPT-2 small | FlashAttention | **2.7** | **3.5×** |
| GPT-2 medium | HuggingFace | 21.0 | 1.0× |
| GPT-2 medium | Megatron-LM | 11.5 | 1.8× |
| GPT-2 medium | FlashAttention | **6.9** | **3.0×** |

### Long-Range Arena (Tab. 3, §4.1)

2.4× speedup over the standard Transformer while maintaining or improving the average accuracy (59.8 vs. 59.3). Block-sparse FlashAttention reaches 2.8× speedup and beats all approximate baselines (Linformer, Performer, Reformer, Linear Attention, Local, Smyrf).

### Long contexts (Tab. 4-6, §4.2)

- **GPT-2 small at 4K** with FlashAttention is still **30% faster** than Megatron at 1K, with **0.7 ppl** better (17.5 vs. 18.2).
- **Long-doc classification** (MIMIC-III, ECtHR): seq 16K vs. 512 → +4.3 F1 points on MIMIC, +8.5 on ECtHR (Tab. 5).
- **Path-X (seq 16K)**: first Transformer to beat chance (61.4% accuracy). **Path-256 (seq 64K)**: only block-sparse FlashAttention succeeds (63.1%) — Tab. 6.

### Runtime/memory benchmark (Fig. 3, §4.3)

- Runtime: up to **3×** faster than PyTorch attention on seq 128-2K, **up to 20×** more memory-efficient.
- Memory: linear in `N` (vs. `N²`). Crossover with approximate attention (Linformer) around `N=512-1024`; block-sparse FlashAttention is faster than **any** sparse or approximate attention tested, across all lengths.

### Block size effect (Fig. 2 middle)

Growing `B_c` from 64 to 256 reduces HBM accesses and runtime; beyond 256 the gain saturates (compute-bound) and the block no longer fits in SRAM.

## Stated limitations

- **Hand-written CUDA**: every new variant (mask, dropout, ALiBi, RoPE, etc.) requires a new kernel; low-level code and not always portable across GPU architectures (§5).
- **Single-GPU** implementation: the analysis does not cover inter-GPU communication in multi-node settings (§5).
- The IO bound is asymptotically optimal but **not finely parameterised in `M`** ⇒ improvable (§3.2, future work).

## Open questions / critiques

- Generalisation of the IO-aware principle to **other modules** (FFN, LayerNorm, conv) is only hinted at (Appendix D, §5).
- The paper predates FlashAttention-2 (Dao 2023) and FlashAttention-3 (Shah et al. 2024); many optimisations left implicit (warp-level scheduling, FP8, async copy) live there.
- Comparison with **multi-query / GQA** strategies is missing — the relative advantage depends on the `d_kv / d_model` ratio.
- The design assumes classical softmax; it does not discuss interaction with **sigmoid attention** or variants without normalisation (cf. [[attention-sink]]).
- Recomputation increases FLOPs but the paper only reports `O(N²d)` total; no specific forward vs. backward FLOPs breakdown is provided.

## Cited concepts

[[flash-attention]], [[scaled-dot-product-attention]], [[self-attention]], [[transformer]], [[kernel-fusion]], [[tiling-softmax]], [[gradient-checkpointing]], [[hbm-sram-memory-hierarchy]], [[io-complexity]], [[block-sparse-attention]], [[long-range-arena]], [[path-x-path-256]], [[multi-head-attention]], [[layer-normalization]].

## Relevant direct quotes

> "We argue that a missing principle is making attention algorithms IO-aware—accounting for reads and writes between levels of GPU memory." (Abstract)

> "Our main goal is to avoid reading and writing the attention matrix to and from HBM. This requires (i) computing the softmax reduction without access to the whole input (ii) not storing the large intermediate attention matrix for the backward pass." (§1)

> "For typical values of d (64-128) and M (around 100KB), d² is many times smaller than M, and thus FlashAttention requires many times fewer HBM accesses than standard implementation." (§3.2)

> "There does not exist an algorithm to compute exact attention with o(N²d²M⁻¹) HBM accesses for all M in the range [d, Nd]." (Proposition 3, §3.2)
