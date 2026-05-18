---
title: Vision Transformer (ViT)
type: concept
tags: [vision, transformer, image-classification, multimodal, backbone]
created: 2026-05-15
updated: 2026-05-15
---

# Vision Transformer (ViT)

Architecture that applies a **pure Transformer encoder** directly to a sequence of **image patches**, after a linear projection and the addition of positional embeddings. Introduced by Dosovitskiy et al. (2021), it shows that a "vanilla" Transformer can match or surpass state-of-the-art CNNs (ResNet/BiT, EfficientNet/Noisy Student) on classification benchmarks, provided it is pre-trained on very large datasets (ImageNet-21k, JFT-300M) [source: raw/papers/dosovitskiy-2021-vit.pdf §1, §4.2]. ViT is the architectural blueprint of the vision encoders used in CLIP, SigLIP, DINO, MAE, SAM and in modern [[mllm-conceptpending]] (Qwen2.5-VL, VideoLLaMA-3, InternVL).

## Key claim / Technique

- **Patch + linear projection + position embedding + class token**: an image `x ∈ R^(H×W×C)` is cut into `N = HW/P²` square patches of side `P` (14/16/32 px), flattened to `R^(P²·C)` and linearly projected to `R^D` with a learnable matrix `E` (cf. [[patch-embedding]]); a learnable `[class]` embedding is prepended BERT-style and a **1D learnable position embedding** `E_pos ∈ R^((N+1)×D)` is added [source: raw/papers/dosovitskiy-2021-vit.pdf §3.1, Eq. 1, 4].
- **Pre-Norm encoder with GELU**: identical to the [[transformer]] encoder but with LayerNorm before MSA/MLP and the MLP using GELU instead of ReLU. `z'_ℓ = MSA(LN(z_{ℓ-1})) + z_{ℓ-1}`; `z_ℓ = MLP(LN(z'_ℓ)) + z'_ℓ` [source: raw/papers/dosovitskiy-2021-vit.pdf §3.1, Eq. 2-4].
- **No image-specific inductive bias**: all spatial structure is learned from data; only the MLP is local, self-attention is global from layer 1 [source: raw/papers/dosovitskiy-2021-vit.pdf §3.1].
- **Data-scale dependence**: ViT is **inferior** to ResNets on ImageNet (1.3M) but **surpasses** them with ImageNet-21k and JFT-300M; ViT-H/14 reaches 88.55% top-1 ImageNet, 94.55% CIFAR-100, 77.63% VTAB with 2.5k TPUv3-core-days vs 9.9k for BiT-L [source: raw/papers/dosovitskiy-2021-vit.pdf §4.2-4.3, Fig. 3-4].
- **Hybrid ViT**: alternatively, patches are extracted from a ResNet feature map (stage 4, 1×1 patches) to inject convolutional biases into the early stages [source: raw/papers/dosovitskiy-2021-vit.pdf §3.1].
- **Fine-tuning at a different resolution**: pre-trained position embeddings are bilinearly interpolated in 2D based on their position in the original grid [source: raw/papers/dosovitskiy-2021-vit.pdf §3.2].

### Canonical variants

| Model | Layers | D | MLP | Heads | Params |
|---|---|---|---|---|---|
| ViT-Base | 12 | 768 | 3072 | 12 | 86M |
| ViT-Large | 24 | 1024 | 4096 | 16 | 307M |
| ViT-Huge | 32 | 1280 | 5120 | 16 | 632M |

[source: raw/papers/dosovitskiy-2021-vit.pdf Tab. 1]

## Variants / Extensions

- **Window-attention ViT** (Qwen2.5-VL): a 675M ViT (32 layers, hidden 1280) trained *from scratch* with **window attention** in 28 of 32 layers (full attention only in layers {7,15,23,31}, window 112×112); regions smaller than the window are processed without padding ⇒ linear cost, natively supports [[dynamic-resolution]] [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.1.1].
- **SigLIP-based ViT** (VideoLLaMA-3, Qwen3-VL): starts from SigLIP/SigLIP-2 (vision encoder pre-trained with sigmoid contrastive loss) and fine-tunes it during multimodal alignment [source: raw/papers/zhang-2025-videollama-3.pdf §3.1; raw/papers/qwen3-vl-2025-tech-report.pdf §2.2].
- **2D-RoPE/MRoPE instead of 1D learnable**: modern VLM ViTs replace the original 1D positional embedding with [[rotary-position-embedding]] in 2D (Qwen) or axial form; enables arbitrary resolution without interpolation.

## Related concepts

- [[patch-embedding]] — constitutive primitive of ViT.
- [[transformer]] — backbone on which ViT is built.
- [[positional-encoding]] — required because self-attention is permutation-invariant.
- [[self-attention]] — mechanism that gives ViT its global expressiveness.
- [[mrope]] — modern generalization of the 1D position embedding to 2D/temporal cases.
- [[dynamic-resolution]] — enabled by flexible pos-embeddings on top of ViT.
- [[flash-attention]] — efficient implementation of MSA in modern ViTs.

## Sources

- [[dosovitskiy-2021-vit]] — introductory paper; defines patch embedding, class token, and the scaling protocol.
- [[qwen2-5-vl-2025-tech-report]] — uses a custom ViT with window attention as visual encoder.
- [[zhang-2025-videollama-3]] — uses SigLIP as base ViT; extends to "any-resolution".
- [[qwen3-vl-2025-tech-report]] — combination of ViT (SigLIP-2) + DeepStack injection in LLM.
