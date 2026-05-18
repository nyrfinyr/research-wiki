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

Gli autori dimostrano che un **Transformer puro applicato direttamente a una sequenza di patch d'immagine** può eguagliare o battere le CNN state-of-the-art (ResNet/BiT, EfficientNet/Noisy Student) sui benchmark di classificazione, *a patto* di pre-addestrarlo su dataset molto grandi (ImageNet-21k da 14M immagini o JFT-300M da 303M). Il modello, chiamato **Vision Transformer (ViT)**, raggiunge 88.55% top-1 su ImageNet, 90.72% su ImageNet-ReaL, 94.55% su CIFAR-100, 77.63% sulla suite VTAB a 19 task, con un costo di pre-training inferiore alle baseline CNN comparabili (2.5k TPUv3-core-days per ViT-H/14 vs. 9.9k per BiT-L) [source: raw/papers/dosovitskiy-2021-vit.pdf §4.2]. È il paper che apre la stagione dei Transformer per la computer vision e fonda l'archetipo del [[vision-transformer]] usato poi in CLIP, DINO, MAE, SAM, MLLM moderni.

## Contributo principale

- Mostrare che **non serve alcun bias induttivo specifico per le immagini** oltre alla decomposizione iniziale in patch: con sufficienti dati di pre-training un Transformer "vanilla" supera le CNN [source: raw/papers/dosovitskiy-2021-vit.pdf §1, §3.1].
- Introdurre l'archetipo **patch + linear projection + position embedding + class token** che diventa standard per tutti i vision transformer successivi (§3.1).
- Caratterizzare empiricamente la **dipendenza dalla scala dei dati**: ViT è inferiore alle ResNet su ImageNet (1.3M) ma le supera con ImageNet-21k e JFT-300M (§4.3, Fig. 3-4).

## Metodo

### Patch embedding (§3.1)

Un'immagine `x ∈ R^(H×W×C)` viene tagliata in `N = HW/P²` patch quadrate di lato `P` (tipicamente 14, 16 o 32 px). Ogni patch viene appiattita a un vettore in `R^(P²·C)` e proiettata linearmente in `R^D` con una matrice apprendibile `E` (Eq. 1). `D` è costante in tutti i layer (768 per ViT-Base, 1024 per Large, 1280 per Huge — Tab. 1).

### Class token + position embedding (§3.1)

In stile BERT si prepone un **embedding `[class]` apprendibile** alla sequenza; lo stato finale di quel token (`z⁰_L`) è la rappresentazione dell'immagine per la classificazione (Eq. 4). A ogni patch (e al class token) si **somma una position embedding 1D apprendibile** `E_pos ∈ R^((N+1)×D)` (Eq. 1).

> "We use standard learnable 1D position embeddings, since we have not observed significant performance gains from using more advanced 2D-aware position embeddings." (§3.1)

A fine-tuning con risoluzione diversa, le position embedding pre-addestrate vengono **interpolate bilinearmente** in 2D in base alla loro posizione nella griglia originale (§3.2). Questo, insieme all'estrazione delle patch, è dichiarato come l'unico bias induttivo 2D iniettato a mano.

### Encoder Transformer (§3.1)

Identico all'encoder di [[transformer]] con due differenze:
- **Pre-Norm** (LayerNorm prima di MSA e MLP, residual dopo), Eq. 2-4: `z'_ℓ = MSA(LN(z_{ℓ-1})) + z_{ℓ-1}`, `z_ℓ = MLP(LN(z'_ℓ)) + z'_ℓ`.
- **MLP con GELU** invece di ReLU.

### Inductive bias e Hybrid (§3.1)

ViT ha **molto meno bias induttivo** delle CNN: solo l'MLP è locale e traslazionalmente equivariante; la self-attention è globale. Tutte le relazioni spaziali tra patch vengono apprese da zero. In alternativa, un modello **hybrid** può estrarre patch da feature map di un ResNet (es. stage 4 con patch 1×1) per iniettare bias convoluzionali nelle prime fasi.

### Varianti del modello (Tab. 1)

| Modello | Layers | D | MLP | Heads | Params |
|---|---|---|---|---|---|
| ViT-Base | 12 | 768 | 3072 | 12 | 86M |
| ViT-Large | 24 | 1024 | 4096 | 16 | 307M |
| ViT-Huge | 32 | 1280 | 5120 | 16 | 632M |

Notazione `ViT-L/16` = Large con patch 16×16. La sequence length cresce con `1/P²`: ViT-L/14 è più costoso di ViT-L/16 (§4.1).

### Training (§4.1)

- **Pre-training**: Adam con `β1=0.9, β2=0.999`, batch 4096, weight decay 0.1, warmup + decay lineari. Datasets: ImageNet (1.3M), ImageNet-21k (14M), JFT-300M (303M). Deduplicazione contro i test set downstream.
- **Fine-tuning**: SGD con momentum, batch 512; risoluzione spesso superiore (es. 512 per L/16, 518 per H/14) con interpolazione delle position embeddings; Polyak averaging factor 0.9999 per il numero finale su ImageNet (§4.1).
- Hardware: TPUv3.

## Risultati chiave

### Confronto SOTA (Tab. 2, §4.2)

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

ViT-L/16 pre-addestrato su ImageNet-21k è "treno-abile" in ~30 giorni su un singolo nodo TPUv3 a 8 core e già batte BiT-L su quasi tutto (§4.2).

### Dipendenza dalla scala dei dati (§4.3, Fig. 3-4)

- Su ImageNet (1.3M) ViT-Large è **inferiore** a ViT-Base ⇒ overfitting; le BiT ResNet (area grigia) dominano.
- Su ImageNet-21k (14M) i modelli si pareggiano.
- Su JFT-300M ViT-H/14 surclassa tutto.
- Su subset 9M-90M-300M di JFT senza extra-regularization: ViT-B/32 è peggio di ResNet50 a 9M ma migliore a 90M+; ViT-L/16 batte ResNet152×2 solo dai 300M in poi (Fig. 4). Conferma quantitativa che **"large scale training trumps inductive bias"** (§1).

### Scaling (§4.4, Fig. 5)

A parità di FLOPs di pre-training su JFT-300M, ViT domina ResNet su una curva performance/compute: ViT usa **2-4× meno compute** per raggiungere la stessa accuracy media (5 dataset). Hybrid (R50+ViT) è leggermente meglio di ViT puro per modelli piccoli, ma il gap si annulla a scala maggiore. Nessun segno di saturazione per ViT-H entro l'intervallo testato.

### Analisi interna (§4.5, Fig. 6-7)

- I primi 28 componenti principali dei filtri di patch embedding di ViT-L/32 ricordano basi tipo Gabor / "filtri plausibili".
- La **similarità delle position embedding** apprese mostra struttura riga/colonna 2D e a volte struttura sinusoidale, anche se inizializzate 1D senza prior 2D — spiega perché l'aggiunta di prior 2D non aiuta (Appx D.4).
- **Mean attention distance** (analogo del receptive field) calcolata sui pesi di attention: già nei layer più bassi alcune teste attendono globalmente, altre restano molto locali (specie in hybrid, dove le early-layer fanno lavoro tipo convoluzione); la distanza cresce con la profondità.

### Self-supervision (§4.6)

Esperimento preliminare di **masked patch prediction** (analogo a MLM in BERT): ViT-B/16 raggiunge 79.9% su ImageNet, +2% rispetto al training da zero ma -4% rispetto al pre-training supervisionato. Contrastive learning lasciato a future work (anticipa DINO, MAE, MoCo-v3).

## Limitazioni dichiarate dagli autori

- Servono dataset di pre-training **molto grandi** (≥14M, idealmente ~300M) per battere le CNN; ViT è inferiore con i soli 1.3M di ImageNet (§4.3).
- Applicazione a detection e segmentation non testata (§5, "many challenges remain"). Suggeriscono che il setup possa estendersi (cita DETR di Carion et al.).
- Self-supervised pre-training ancora lontano dal supervisionato (-4% su ImageNet, §4.6).
- Hardware: i risultati H/14 richiedono JFT-300M, dataset proprietario Google non riproducibile pubblicamente.

## Domande aperte / critiche

- **JFT-300M non è pubblico** ⇒ riproducibilità limitata; la community ha dovuto attendere LAION / DataComp per replicare a scala simile.
- Non viene analizzata la **robustezza** (ImageNet-A/C/R, adversarial) né l'interpretabilità head-by-head in modo quantitativo.
- Le position embedding **1D learnable** sono adeguate per griglie regolari, ma il paper non discute sequenze a risoluzione mista o input non-griglia.
- L'analisi dell'attention distance è descrittiva: non viene legata a metriche di accuracy o a pruning delle teste.
- Il paper precede l'emergere di [[attention-sink]] e di tecniche IO-aware tipo [[flash-attention]] ⇒ niente discussione di efficiency a livello hardware né di memoria GPU.

## Concetti citati

[[vision-transformer]], [[transformer]], [[self-attention]], [[multi-head-attention]], [[patch-embedding]], [[positional-encoding]], [[class-token]], [[layer-normalization]], [[gelu]], [[encoder-decoder-architecture]], [[imagenet]], [[imagenet-21k]], [[jft-300m]], [[vtab]], [[bit-big-transfer]], [[noisy-student]], [[masked-image-modeling]].

## Citazioni dirette rilevanti

> "We show that this reliance on CNNs is not necessary and a pure transformer applied directly to sequences of image patches can perform very well on image classification tasks." (Abstract)

> "Transformers lack some of the inductive biases inherent to CNNs, such as translation equivariance and locality, and therefore do not generalize well when trained on insufficient amounts of data. However, the picture changes if the models are trained on larger datasets (14M-300M images). We find that large scale training trumps inductive bias." (§1)

> "In ViT, only MLP layers are local and translationally equivariant, while the self-attention layers are global. The two-dimensional neighborhood structure is used very sparingly: in the beginning of the model by cutting the image into patches and at fine-tuning time for adjusting the position embeddings for images of different resolution." (§3.1)
