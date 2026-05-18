---
title: Patch Embedding
type: concept
tags: [vision, tokenization, vit, multimodal]
created: 2026-05-15
updated: 2026-05-15
---

# Patch Embedding

Primitiva di tokenizzazione visiva del [[vision-transformer]]: un'immagine `x ∈ R^(H×W×C)` viene tagliata in `N = HW/P²` patch quadrate di lato `P` (tipicamente 14, 16 o 32 px); ogni patch viene appiattita a un vettore in `R^(P²·C)` e proiettata linearmente in `R^D` con una **matrice apprendibile** `E ∈ R^((P²·C)×D)`. `D` è costante in tutti i layer dell'encoder (768 per ViT-Base, 1024 per Large, 1280 per Huge) [source: raw/papers/dosovitskiy-2021-vit.pdf §3.1, Eq. 1, Tab. 1]. È il *bias induttivo* iniziale (l'unico, insieme all'interpolazione delle position embedding) di tutta l'architettura ViT.

## Claim chiave / Tecnica

- **Definizione formale**: per ogni patch `x^p_i ∈ R^(P²·C)`, l'embedding è `z_i = x^p_i · E + b`. Equivalente a una **convoluzione 2D** con kernel `P×P`, stride `P`, output channels `D` — è infatti così che la maggior parte delle implementazioni la realizza (es. PyTorch `nn.Conv2d(C, D, kernel_size=P, stride=P)`) [source: raw/papers/dosovitskiy-2021-vit.pdf §3.1].
- **Solo bias induttivo 2D iniettato a mano**: insieme all'interpolazione delle position embedding a fine-tuning, la patch embedding è l'unica struttura 2D-aware in ViT. Tutte le altre relazioni spaziali (vicinanza fra patch, simmetrie) devono essere apprese dalla self-attention [source: raw/papers/dosovitskiy-2021-vit.pdf §3.1].
- **Hybrid ViT**: in alternativa si può estrarre patch da **feature map di un ResNet** (stage 4 con patch 1×1) per iniettare bias convoluzionali nelle prime fasi e poi continuare con Transformer puro [source: raw/papers/dosovitskiy-2021-vit.pdf §3.1].
- **Position embedding e [class] token**: alla sequenza `(z_1, ..., z_N)` si prepone un embedding `[class]` apprendibile e si somma una **position embedding 1D learnable** `E_pos ∈ R^((N+1)×D)`. La rappresentazione finale del `[class]` token è usata per la classificazione [source: raw/papers/dosovitskiy-2021-vit.pdf §3.1, Eq. 4].
- **Numero variabile di patch** ([[dynamic-resolution]]): nei VLM moderni, la patch embedding è applicata a immagini di dimensione arbitraria ⇒ `N` cambia per ogni immagine; la position embedding deve essere flessibile (interpolazione bilineare per la 1D learnable, oppure 2D-RoPE che è naturalmente size-agnostic).
- **Patch size = trade-off resolution / cost**: ViT-H/14 (`P=14`) è il default per i moderni vision encoder; ViT-L/16 e ViT-B/32 sono più rapidi ma perdono dettaglio. Qwen2.5-VL ViT usa patch 14×14 e merge MLP raggruppa 4 patch (2×2) prima della proiezione in LLM ⇒ patch effettiva 28×28 nello spazio LLM [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.1.1].

## Varianti / Estensioni

- **Overlapping patches**: alcune varianti usano stride < kernel per patch sovrapposte (Swin, T2T-ViT) — non standard nei VLM mainstream.
- **3D patch embedding** (Video ViT): patch volumetriche `(T_p × P × P)` per video — la temporal dimension viene tokenizzata insieme alla spaziale. Qwen2.5-VL raggruppa **due frame consecutivi** come unità temporale 3D ⇒ patch 3D `(2 × 14 × 14)` [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.1.2].

## Concetti correlati

- [[vision-transformer]] — costruito sopra la patch embedding come primo blocco.
- [[positional-encoding]] — necessario perché la patch embedding è permutation-invariant.
- [[dynamic-resolution]] — abilitato da una patch embedding senza padding e da position encoding flessibile.
- [[mrope]] — moderna alternativa alla position embedding 1D learnable originale.

## Sources

- [[dosovitskiy-2021-vit]] — definisce la patch embedding come singolo bias induttivo 2D del ViT.
