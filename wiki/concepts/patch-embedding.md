---
title: Patch Embedding
type: concept
tags: [vision, tokenization, vit, multimodal]
created: 2026-05-15
updated: 2026-05-15
---

# Patch Embedding

Visual tokenization primitive of the [[vision-transformer]]: an image `x ∈ R^(H×W×C)` is cut into `N = HW/P²` square patches of side `P` (typically 14, 16 or 32 px); each patch is flattened to a vector in `R^(P²·C)` and linearly projected to `R^D` with a **learnable matrix** `E ∈ R^((P²·C)×D)`. `D` is constant across all encoder layers (768 for ViT-Base, 1024 for Large, 1280 for Huge) [source: raw/papers/dosovitskiy-2021-vit.pdf §3.1, Eq. 1, Tab. 1]. It is the initial *inductive bias* (the only one, together with position embedding interpolation) of the entire ViT architecture.

## Key claims / Technique

- **Formal definition**: for each patch `x^p_i ∈ R^(P²·C)`, the embedding is `z_i = x^p_i · E + b`. Equivalent to a **2D convolution** with `P×P` kernel, stride `P`, `D` output channels — this is in fact how most implementations realize it (e.g., PyTorch `nn.Conv2d(C, D, kernel_size=P, stride=P)`) [source: raw/papers/dosovitskiy-2021-vit.pdf §3.1].
- **Only manually injected 2D inductive bias**: together with position embedding interpolation at fine-tuning, patch embedding is the only 2D-aware structure in ViT. All other spatial relationships (patch adjacency, symmetries) must be learned by self-attention [source: raw/papers/dosovitskiy-2021-vit.pdf §3.1].
- **Hybrid ViT**: alternatively, patches can be extracted from **ResNet feature maps** (stage 4 with 1×1 patches) to inject convolutional bias in the early stages and then continue with a pure Transformer [source: raw/papers/dosovitskiy-2021-vit.pdf §3.1].
- **Position embedding and [class] token**: a learnable `[class]` embedding is prepended to the sequence `(z_1, ..., z_N)` and a **1D learnable position embedding** `E_pos ∈ R^((N+1)×D)` is added. The final representation of the `[class]` token is used for classification [source: raw/papers/dosovitskiy-2021-vit.pdf §3.1, Eq. 4].
- **Variable number of patches** ([[dynamic-resolution]]): in modern VLMs, patch embedding is applied to images of arbitrary size ⇒ `N` changes per image; position embedding must be flexible (bilinear interpolation for 1D learnable, or 2D-RoPE which is naturally size-agnostic).
- **Patch size = resolution / cost trade-off**: ViT-H/14 (`P=14`) is the default for modern vision encoders; ViT-L/16 and ViT-B/32 are faster but lose detail. The Qwen2.5-VL ViT uses 14×14 patches and the MLP merger groups 4 patches (2×2) before projection into the LLM ⇒ effective 28×28 patch in the LLM space [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.1.1].

## Variants / Extensions

- **Overlapping patches**: some variants use stride < kernel for overlapping patches (Swin, T2T-ViT) — not standard in mainstream VLMs.
- **3D patch embedding** (Video ViT): volumetric patches `(T_p × P × P)` for video — the temporal dimension is tokenized together with the spatial one. Qwen2.5-VL groups **two consecutive frames** as a 3D temporal unit ⇒ 3D patch `(2 × 14 × 14)` [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.1.2].

## Related concepts

- [[vision-transformer]] — built on top of patch embedding as the first block.
- [[positional-encoding]] — needed because patch embedding is permutation-invariant.
- [[dynamic-resolution]] — enabled by a padding-free patch embedding and flexible position encoding.
- [[mrope]] — modern alternative to the original 1D learnable position embedding.

## Sources

- [[dosovitskiy-2021-vit]] — defines patch embedding as the sole 2D inductive bias of the ViT.
