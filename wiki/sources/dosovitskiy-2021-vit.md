---
title: "Dosovitskiy et al. (2021) — An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale"
type: source
tags: [vision-transformer, transformer, image-classification, self-attention, pretraining, scaling, jft-300m, imagenet]
created: 2026-05-15
updated: 2026-05-15
source_path: raw/papers/dosovitskiy-2021-vit.pdf
source_kind: paper
source_date: 2021-06-03
doi: 10.48550/arXiv.2010.11929
zotero_key: WVZ3RIYP
venue: ICLR 2021
authors: [Alexey Dosovitskiy, Lucas Beyer, Alexander Kolesnikov, Dirk Weissenborn, Xiaohua Zhai, Thomas Unterthiner, Mostafa Dehghani, Matthias Minderer, Georg Heigold, Sylvain Gelly, Jakob Uszkoreit, Neil Houlsby]
year: 2021
---

# Dosovitskiy et al. (2021) — An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale

## TL;DR

The authors show that a **pure Transformer applied directly to a sequence of image patches** can match or beat state-of-the-art CNNs (ResNet/BiT, EfficientNet/Noisy Student) on classification benchmarks, *provided* it is pre-trained on very large datasets (ImageNet-21k with 14M images or JFT-300M with 303M). The model, called **Vision Transformer (ViT)**, reaches 88.55% top-1 on ImageNet, 90.72% on ImageNet-ReaL, 94.55% on CIFAR-100, 77.63% on the 19-task VTAB suite, with a pre-training cost lower than comparable CNN baselines (2.5k TPUv3-core-days for ViT-H/14 vs. 9.9k for BiT-L) [source: raw/papers/dosovitskiy-2021-vit.pdf §4.2]. It is the paper that opens the Transformer era in computer vision and establishes the [[vision-transformer]] archetype used later in CLIP, DINO, MAE, SAM and modern MLLMs.

## Main contribution

- Show that **no image-specific inductive bias is needed** beyond the initial patch decomposition: with enough pre-training data a "vanilla" Transformer surpasses CNNs [source: raw/papers/dosovitskiy-2021-vit.pdf §1, §3.1].
- Introduce the **patch + linear projection + position embedding + class token** archetype that becomes the standard for every subsequent vision transformer (§3.1).
- Empirically characterise the **data-scale dependence**: ViT is below ResNets on ImageNet (1.3M) but surpasses them on ImageNet-21k and JFT-300M (§4.3, Figs. 3-4).

## Method

### Patch embedding (§3.1)

An image `x ∈ R^(H×W×C)` is cut into `N = HW/P²` square patches of side `P` (typically 14, 16 or 32 px). Each patch is flattened to a vector in `R^(P²·C)` and linearly projected into `R^D` with a learnable matrix `E` (Eq. 1). `D` is constant across layers (768 for ViT-Base, 1024 for Large, 1280 for Huge — Tab. 1).

### Class token + position embedding (§3.1)

In BERT style, a learnable **`[class]` embedding** is prepended to the sequence; its final hidden state (`z⁰_L`) is the image representation used for classification (Eq. 4). To every patch (and to the class token) a **learnable 1D position embedding** `E_pos ∈ R^((N+1)×D)` is added (Eq. 1).

> "We use standard learnable 1D position embeddings, since we have not observed significant performance gains from using more advanced 2D-aware position embeddings." (§3.1)

When fine-tuning at a different resolution, the pre-trained position embeddings are **bilinearly interpolated** in 2D according to their position in the original grid (§3.2). This, together with patch extraction, is declared as the only 2D inductive bias injected by hand.

### Transformer encoder (§3.1)

Identical to the [[transformer]] encoder with two differences:
- **Pre-Norm** (LayerNorm before MSA and MLP, residual after), Eq. 2-4: `z'_ℓ = MSA(LN(z_{ℓ-1})) + z_{ℓ-1}`, `z_ℓ = MLP(LN(z'_ℓ)) + z'_ℓ`.
- **MLP with GELU** instead of ReLU.

### Inductive bias and Hybrid (§3.1)

ViT has **far less inductive bias** than CNNs: only the MLP is local and translation-equivariant; self-attention is global. All spatial relations between patches are learned from scratch. Alternatively, a **hybrid** model can extract patches from a ResNet feature map (e.g. stage 4 with 1×1 patches) to inject convolutional bias in the early stages.

### Model variants (Tab. 1)

| Model | Layers | D | MLP | Heads | Params |
|---|---|---|---|---|---|
| ViT-Base | 12 | 768 | 3072 | 12 | 86M |
| ViT-Large | 24 | 1024 | 4096 | 16 | 307M |
| ViT-Huge | 32 | 1280 | 5120 | 16 | 632M |

Notation `ViT-L/16` = Large with 16×16 patches. Sequence length grows as `1/P²`: ViT-L/14 is more expensive than ViT-L/16 (§4.1).

### Training (§4.1)

- **Pre-training**: Adam with `β1=0.9, β2=0.999`, batch 4096, weight decay 0.1, linear warmup + decay. Datasets: ImageNet (1.3M), ImageNet-21k (14M), JFT-300M (303M). Deduplication against downstream test sets.
- **Fine-tuning**: SGD with momentum, batch 512; often higher resolution (e.g. 512 for L/16, 518 for H/14) with position-embedding interpolation; Polyak averaging factor 0.9999 for the final ImageNet number (§4.1).
- Hardware: TPUv3.

## Key results

### SOTA comparison (Tab. 2, §4.2)

| Dataset | ViT-H/14 (JFT) | ViT-L/16 (JFT) | ViT-L/16 (I21k) | BiT-L (ResNet152×4) | Noisy Student (EffNet-L2) |
|---|---|---|---|---|---|
| ImageNet | **88.55** | 87.76 | 85.30 | 87.54 | 88.4/88.5 |
| ImageNet-ReaL | **90.72** | 90.54 | 88.62 | 90.54 | 90.55 |
| CIFAR-10 | 99.50 | 99.42 | 99.15 | 99.37 | — |
| CIFAR-100 | **94.55** | 93.90 | 93.25 | 93.51 | — |
| Pets | **97.56** | 97.32 | 94.67 | 96.62 | — |
| Flowers-102 | 99.68 | **99.74** | 99.61 | 99.63 | — |
| VTAB (19) | **77.63** | 76.28 | 72.72 | 76.29 | — |
| TPUv3-core-days | 2.5k | 0.68k | 0.23k | 9.9k | 12.3k |

ViT-L/16 pre-trained on ImageNet-21k is "trainable" in ~30 days on a single 8-core TPUv3 node and already beats BiT-L on almost everything (§4.2).

### Data-scale dependence (§4.3, Figs. 3-4)

- On ImageNet (1.3M) ViT-Large is **worse** than ViT-Base ⇒ overfitting; the BiT ResNets (grey area) dominate.
- On ImageNet-21k (14M) the models break even.
- On JFT-300M ViT-H/14 outclasses everything.
- On 9M-90M-300M subsets of JFT without extra regularisation: ViT-B/32 is worse than ResNet50 at 9M but better from 90M onwards; ViT-L/16 only beats ResNet152×2 from 300M on (Fig. 4). Quantitative confirmation that **"large scale training trumps inductive bias"** (§1).

### Scaling (§4.4, Fig. 5)

At equal pre-training FLOPs on JFT-300M, ViT dominates ResNet on a performance/compute curve: ViT uses **2-4× less compute** to reach the same average accuracy (5 datasets). Hybrid (R50+ViT) is slightly better than pure ViT for small models, but the gap vanishes at larger scale. No sign of saturation for ViT-H within the tested range.

### Internal analysis (§4.5, Figs. 6-7)

- The first 28 principal components of ViT-L/32 patch-embedding filters resemble Gabor-like / "plausible filter" bases.
- The **similarity of learned position embeddings** shows 2D row/column structure and sometimes sinusoidal structure, despite being initialised as 1D without 2D prior — this explains why adding a 2D prior does not help (Appx. D.4).
- **Mean attention distance** (analogue of receptive field), computed from attention weights: already at the lowest layers some heads attend globally while others stay very local (especially in hybrid, where early-layer heads do convolution-like work); the distance grows with depth.

### Self-supervision (§4.6)

Preliminary **masked patch prediction** experiment (analogous to MLM in BERT): ViT-B/16 reaches 79.9% on ImageNet, +2% over training from scratch but -4% vs. supervised pre-training. Contrastive learning is left to future work (foreshadowing DINO, MAE, MoCo-v3).

## Stated limitations

- Very **large** pre-training datasets are required (≥14M, ideally ~300M) to beat CNNs; ViT is worse with the 1.3M of ImageNet alone (§4.3).
- Application to detection and segmentation not tested (§5, "many challenges remain"). They suggest the setup can be extended (citing Carion et al.'s DETR).
- Self-supervised pre-training still well behind supervised (-4% on ImageNet, §4.6).
- Hardware: H/14 results require JFT-300M, a proprietary Google dataset not publicly reproducible.

## Open questions / critiques

- **JFT-300M is not public** ⇒ limited reproducibility; the community had to wait for LAION / DataComp to replicate at similar scale.
- **Robustness** (ImageNet-A/C/R, adversarial) and quantitative head-by-head interpretability are not analysed.
- **1D learnable** position embeddings are adequate for regular grids, but the paper does not discuss mixed-resolution sequences or non-grid inputs.
- The attention-distance analysis is descriptive: it is not linked to accuracy metrics or to head pruning.
- The paper predates the emergence of [[attention-sink]] and IO-aware techniques such as [[flash-attention]] ⇒ no discussion of hardware-level efficiency or GPU memory.

## Cited concepts

[[vision-transformer]], [[transformer]], [[self-attention]], [[multi-head-attention]], [[patch-embedding]], [[positional-encoding]], [[class-token]], [[layer-normalization]], [[gelu]], [[encoder-decoder-architecture]], [[imagenet]], [[imagenet-21k]], [[jft-300m]], [[vtab]], [[bit-big-transfer]], [[noisy-student]], [[masked-image-modeling]].

## Relevant direct quotes

> "We show that this reliance on CNNs is not necessary and a pure transformer applied directly to sequences of image patches can perform very well on image classification tasks." (Abstract)

> "Transformers lack some of the inductive biases inherent to CNNs, such as translation equivariance and locality, and therefore do not generalize well when trained on insufficient amounts of data. However, the picture changes if the models are trained on larger datasets (14M-300M images). We find that large scale training trumps inductive bias." (§1)

> "In ViT, only MLP layers are local and translationally equivariant, while the self-attention layers are global. The two-dimensional neighborhood structure is used very sparingly: in the beginning of the model by cutting the image into patches and at fine-tuning time for adjusting the position embeddings for images of different resolution." (§3.1)
