---
title: Vision Transformer (ViT)
type: concept
tags: [vision, transformer, image-classification, multimodal, backbone]
created: 2026-05-15
updated: 2026-05-15
---

# Vision Transformer (ViT)

Architettura che applica un **Transformer encoder puro** direttamente a una sequenza di **patch d'immagine**, dopo proiezione lineare e somma di positional embedding. Introdotta da Dosovitskiy et al. (2021), dimostra che un Transformer "vanilla" può eguagliare o superare le CNN state-of-the-art (ResNet/BiT, EfficientNet/Noisy Student) sui benchmark di classificazione, a patto di pre-addestrarlo su dataset molto grandi (ImageNet-21k, JFT-300M) [source: raw/papers/dosovitskiy-2021-vit.pdf §1, §4.2]. ViT è il blueprint architetturale dei vision encoder usati in CLIP, SigLIP, DINO, MAE, SAM e nei moderni [[mllm-conceptpending]] (Qwen2.5-VL, VideoLLaMA-3, InternVL).

## Claim chiave / Tecnica

- **Patch + linear projection + position embedding + class token**: un'immagine `x ∈ R^(H×W×C)` viene tagliata in `N = HW/P²` patch quadrate di lato `P` (14/16/32 px), appiattite a `R^(P²·C)` e proiettate linearmente in `R^D` con matrice `E` apprendibile (cfr. [[patch-embedding]]); si prepone un embedding `[class]` apprendibile in stile BERT e si somma una **position embedding 1D learnable** `E_pos ∈ R^((N+1)×D)` [source: raw/papers/dosovitskiy-2021-vit.pdf §3.1, Eq. 1, 4].
- **Encoder Pre-Norm con GELU**: identico al [[transformer]] encoder ma con LayerNorm prima di MSA/MLP e MLP con GELU invece di ReLU. `z'_ℓ = MSA(LN(z_{ℓ-1})) + z_{ℓ-1}`; `z_ℓ = MLP(LN(z'_ℓ)) + z'_ℓ` [source: raw/papers/dosovitskiy-2021-vit.pdf §3.1, Eq. 2-4].
- **Niente bias induttivo specifico per le immagini**: tutta la struttura spaziale viene appresa dai dati; solo l'MLP è locale, la self-attention è globale dal layer 1 [source: raw/papers/dosovitskiy-2021-vit.pdf §3.1].
- **Dipendenza dalla scala dei dati**: ViT è **inferiore** alle ResNet su ImageNet (1.3M) ma le **supera** con ImageNet-21k e JFT-300M; ViT-H/14 raggiunge 88.55% top-1 ImageNet, 94.55% CIFAR-100, 77.63% VTAB con 2.5k TPUv3-core-days vs 9.9k per BiT-L [source: raw/papers/dosovitskiy-2021-vit.pdf §4.2-4.3, Fig. 3-4].
- **Hybrid ViT**: in alternativa si estraggono patch da feature map di un ResNet (stage 4, patch 1×1) per iniettare bias convoluzionali nelle prime fasi [source: raw/papers/dosovitskiy-2021-vit.pdf §3.1].
- **Fine-tuning a risoluzione diversa**: le position embedding pre-trained vengono interpolate bilinearmente in 2D in base alla loro posizione nella griglia originale [source: raw/papers/dosovitskiy-2021-vit.pdf §3.2].

### Varianti canoniche

| Modello | Layers | D | MLP | Heads | Params |
|---|---|---|---|---|---|
| ViT-Base | 12 | 768 | 3072 | 12 | 86M |
| ViT-Large | 24 | 1024 | 4096 | 16 | 307M |
| ViT-Huge | 32 | 1280 | 5120 | 16 | 632M |

[source: raw/papers/dosovitskiy-2021-vit.pdf Tab. 1]

## Varianti / Estensioni

- **Window-attention ViT** (Qwen2.5-VL): un ViT 675M (32 layer, hidden 1280) addestrato *from scratch* con **window attention** in 28 layer su 32 (full attention solo nei layer {7,15,23,31}, window 112×112); regioni più piccole del window processate senza padding ⇒ costo lineare, [[dynamic-resolution]] supportata nativamente [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.1.1].
- **SigLIP-based ViT** (VideoLLaMA-3, Qwen3-VL): si parte da SigLIP/SigLIP-2 (vision encoder pre-addestrato con sigmoid loss contrastiva) e si fine-tuna durante l'allineamento multimodale [source: raw/papers/zhang-2025-videollama-3.pdf §3.1; raw/papers/qwen3-vl-2025-tech-report.pdf §2.2].
- **2D-RoPE/MRoPE invece di 1D learnable**: i ViT moderni dei VLM sostituiscono la position embedding 1D originale con [[rotary-position-embedding]] in versione 2D (Qwen) o axial; permette risoluzione arbitraria senza interpolazione.

## Concetti correlati

- [[patch-embedding]] — primitiva costitutiva del ViT.
- [[transformer]] — backbone su cui ViT è costruito.
- [[positional-encoding]] — necessario perché la self-attention è permutation-invariant.
- [[self-attention]] — meccanismo che dà al ViT la sua espressività globale.
- [[mrope]] — generalizzazione moderna della 1D pos. embedding ai casi 2D/temporal.
- [[dynamic-resolution]] — abilitato da pos-embedding flessibili sopra ViT.
- [[flash-attention]] — implementazione efficiente delle MSA in ViT moderni.

## Sources

- [[dosovitskiy-2021-vit]] — paper introduttivo; definisce patch embedding, class token e protocol di scaling.
- [[qwen2-5-vl-2025-tech-report]] — usa un ViT custom con window attention come vision encoder.
- [[zhang-2025-videollama-3]] — usa SigLIP come ViT base; estende a "any-resolution".
- [[qwen3-vl-2025-tech-report]] — combinazione ViT (SigLIP-2) + DeepStack injection in LLM.
