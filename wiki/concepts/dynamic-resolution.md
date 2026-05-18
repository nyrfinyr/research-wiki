---
title: Dynamic Resolution
type: concept
tags: [vision-encoder, multimodal, tokenization]
created: 2026-05-15
updated: 2026-05-15
---

# Dynamic Resolution

Paradigma di tokenizzazione visiva in cui il vision encoder **processa immagini alla loro risoluzione nativa** invece di ridimensionarle a una dimensione fissa (es. 336×336 di CLIP). Si traduce in un **numero variabile di patch / token visivi** in funzione delle dimensioni dell'input, ed è una delle innovazioni architetturali centrali dei VLM moderni (Qwen2.5-VL, VideoLLaMA-3, Qwen3-VL). Si contrappone al regime fixed-resolution patch counting dei VLM "vintage" (LLaVA-1.5, BLIP-2) che richiedevano resize/center-crop perdendo dettagli, soprattutto su documenti, OCR e immagini ad alta risoluzione [source: raw/papers/zhang-2025-videollama-3.pdf §3.1; raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.1].

## Claim chiave / Tecnica

- **Native dynamic resolution spaziale** (Qwen2.5-VL): nessuna normalizzazione di coordinate; bounding box e punti vivono nelle dimensioni reali dell'input. Il modello apprende intrinsecamente la scala fisica. Regioni più piccole del window di attention (112×112) sono processate **senza padding**, preservando la risoluzione originale [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.1.1, §2.1.2].
- **Dynamic FPS sampling** (Qwen2.5-VL): estende il concetto alla dimensione temporale — il ViT raggruppa due frame consecutivi come unità temporale 3D dimezzando i token visivi. Durante training l'FPS viene **campionato dinamicamente** per coprire una distribuzione ampia di velocità video. Inferenza: max 768 frame e ≤24 576 token visivi per video di durata fino a ore [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.1.2, §2.2.1, §3.3.4].
- **AVT — Any-resolution Vision Tokenization** (VideoLLaMA-3): SigLIP fine-tunato per accettare immagini a risoluzione arbitraria, eliminando il bottleneck del fixed-resolution. Combinato con il Differential Frame Pruner per ridurre ridondanza temporale [source: raw/papers/zhang-2025-videollama-3.pdf §3.1, Tab. 8].
- **Position embedding compatibile**: la dynamic resolution è abilitata da position encoding flessibili — 2D-RoPE / [[mrope]] o interpolazione bilineare delle position embedding 1D learnable del [[vision-transformer]] originale.
- **Impatto cross-task**: VideoLLaMA-3 supera VideoLLaMA2.1-7B di +11.3 punti su VideoMME (w/o sub), +15.6 su MLVU, +17.9 su PerceptionTest, attribuendo il salto in parte a "AVT + dynamic resolution" [source: raw/papers/zhang-2025-videollama-3.pdf §4.2 Tab. 8].

## Varianti / Estensioni

- **AnyRes (LLaVA-Next)**: split di immagini grandi in più sotto-immagini a risoluzione fissa + global view — soluzione "patch-of-patches" intermedia fra fixed-resolution e dynamic-resolution.
- **MLP merger** (Qwen2.5-VL): raggruppa 4 patch ViT adiacenti via MLP prima della proiezione nello spazio LLM; bilancia il tradeoff fra fedeltà visiva e token budget.
- **DeepStack** (Qwen3-VL): inietta feature da 3 layer del ViT in altrettanti layer dell'LLM via residual — preserva multi-livello senza estendere il context length anche a risoluzione alta [source: raw/papers/qwen3-vl-2025-tech-report.pdf §2.2].

## Concetti correlati

- [[vision-transformer]] — architettura che permette dynamic resolution (a differenza di CNN fixed-stride).
- [[mrope]] — position embedding che si adatta nativamente a sequenze di dimensione variabile.
- [[patch-embedding]] — primitiva costitutiva; dynamic resolution = numero variabile di applicazioni della stessa proiezione lineare.

## Sources

- [[zhang-2025-videollama-3]] — introduce AVT + DiffFP nella ricetta vision-centric.
- [[qwen2-5-vl-2025-tech-report]] — dynamic resolution spaziale + dynamic FPS temporale.
- [[qwen3-vl-2025-tech-report]] — combina dynamic resolution con DeepStack injection.
