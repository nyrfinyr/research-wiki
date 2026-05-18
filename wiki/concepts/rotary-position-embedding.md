---
title: Rotary Position Embedding (RoPE)
type: concept
tags: [positional-encoding, transformer, relative-position]
created: 2026-05-15
updated: 2026-05-15
---

# Rotary Position Embedding (RoPE)

Positional encoding scheme (Su et al. 2021) in which each pair of embedding features is given a **2D rotation** whose frequency depends on the token position. The dot product `q_mᵀ k_n` after the rotations becomes a function **only of the difference `m − n`** ⇒ self-attention becomes intrinsically *relative-position-aware*, while computed as a per-token local operation (compatible with the [[scaled-dot-product-attention]] formulation). RoPE is today the default for modern LLMs (LLaMA, Mistral, Qwen) and is the architectural basis for its multimodal extensions (cf. [[mrope]]) [source: raw/papers/fu-2025-sliding-window-attention.pdf §3.2; raw/papers/zhang-2025-videollama-3.pdf §3.1].

## Key claims / Technique

- **Rotation per pair of features**: given `q ∈ R^d` with `d` even, the components are grouped into pairs `(q^(2i), q^(2i+1))` and the rotation matrix `R^d_{Θ,m}` is applied:
  ```
  R^d_{Θ,m} = blkdiag(R(mθ_0), R(mθ_1), …, R(mθ_{d/2-1}))
  ```
  with frequencies `θ_i = 10000^(-2i/d)`. The same rotation is applied to `k_n`.
- **Relative encoding via inner product**: `(R_{Θ,m} q_m)ᵀ (R_{Θ,n} k_n) = q_mᵀ R^d_{Θ,n−m} k_n` ⇒ the dot product depends only on `n − m` and on the frequency `θ_i`. Yields the benefit of relative encoding (Shaw 2018) without modifying the attention computation.
- **Universal with respect to the sink**: Gu et al. show that the position embedding (NoPE, absolute, learnable, relative, ALiBi, **Rotary**) does not influence the emergence of the [[attention-sink]] — all have a sink (Tab. 3) [source: raw/papers/gu-2024-attention-sink.pdf §7].
- **Compatible with SWA**: SWAT integrates RoPE to give an explicit positional signal to hidden states and stabilize training; without RoPE, sigmoid + balanced ALiBi is unstable (Fig. 5) [source: raw/papers/fu-2025-sliding-window-attention.pdf §3.2].
- **2D-RoPE for ViT**: VideoLLaMA-3 and Qwen2.5-VL use a "2D-RoPE" that rotates separately along the *height* and *width* axes — it is a specialization of [[mrope]] applied to the spatial dimensions only [source: raw/papers/zhang-2025-videollama-3.pdf §3.1; raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.1.3].

## Variants / Extensions

- **Chunked MRoPE** (Qwen2-VL): partitions the embedding dimensions into *t/h/w* chunks each with distinct rotary frequencies ⇒ extends RoPE to video [source: raw/papers/qwen3-vl-2025-tech-report.pdf §2.1].
- **T-RoPE** (Qwen2.5-VL): ties the temporal ID to absolute time rather than to the frame index ⇒ temporal grounding at the second [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.1.3].
- **Interleaved MRoPE** (Qwen3-VL): redistributes t/h/w across frequencies in an *interleaved* fashion to avoid the spectral bias of chunked MRoPE on long video [source: raw/papers/qwen3-vl-2025-tech-report.pdf §2.1].

## Related concepts

- [[mrope]] — generalization of RoPE for temporal+spatial dimensions in VLMs.
- [[positional-encoding]] — super-family of which RoPE is the dominant representative.
- [[sliding-window-attention]] — uses RoPE as a positional signal inside the window.
- [[attention-sink]] — neither caused nor eliminated by RoPE; orthogonal.

## Sources

- [[fu-2025-sliding-window-attention]] — RoPE as a positional signal inside SWAT.
- [[gu-2024-attention-sink]] — shows that RoPE does not influence the emergence of the sink.
- [[zhang-2025-videollama-3]] — uses 2D-RoPE for the image-first ViT.
- [[qwen3-vl-2025-tech-report]] — develops interleaved MRoPE on top of RoPE.
