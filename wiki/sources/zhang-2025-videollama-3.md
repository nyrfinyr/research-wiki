---
title: "Zhang et al. (2025) — VideoLLaMA 3: Frontier Multimodal Foundation Models for Image and Video Understanding"
type: source
tags: [video-llm, vision-language-model, video-understanding, multimodal, image-understanding, dynamic-resolution, video-token-compression, siglip, qwen]
created: 2026-05-15
updated: 2026-05-15
source_path: raw/papers/zhang-2025-videollama-3.pdf
source_kind: paper
source_date: 2025-06-13
doi: 10.48550/arXiv.2501.13106
zotero_key: H6CMXHIP
venue: preprint (arXiv 2501.13106v4)
authors: [Boqiang Zhang, Kehan Li, Zesen Cheng, Zhiqiang Hu, Yuqian Yuan, Guanzheng Chen, Sicong Leng, Yuming Jiang, Hang Zhang, Xin Li, Peng Jin, Wenqi Zhang, Fan Wang, Lidong Bing, Deli Zhao]
year: 2025
---

# Zhang et al. (2025) — VideoLLaMA 3: Frontier Multimodal Foundation Models for Image and Video Understanding

## TL;DR

VideoLLaMA 3 è un MLLM frontier (2B e 7B) sviluppato da DAMO Academy / Alibaba per la comprensione congiunta di immagini e video. Il paper propone un paradigma di addestramento **vision-centric**: invece di accumulare dati video-text rumorosi, si parte da grandi corpora image-text di alta qualità per costruire un encoder visivo robusto, e si addestra il video understanding in coda. Architetturalmente, due novità chiave: (1) **Any-resolution Vision Tokenization (AVT)**, che adatta [[siglip]] con 2D-RoPE per accettare immagini di qualsiasi risoluzione producendo un numero variabile di vision token; (2) **Differential Frame Pruner (DiffFP)**, che elimina patch video temporalmente ridondanti basandosi sulla distanza 1-norm in pixel space. Il training si articola in 4 stage (Vision Encoder Adaptation → Vision-Language Alignment → Multi-task Fine-tuning → Video-centric Fine-tuning) con backbone LLM Qwen2.5. Raggiunge SOTA su VideoMME, MLVU, LongVideoBench, LVBench, PerceptionTest, NextQA e su benchmark immagine come InfoVQA, MathVista, MathVision [source: raw/papers/zhang-2025-videollama-3.pdf §1].

## Contributo principale

- **Paradigma vision-centric**: l'image understanding scala meglio dell'image-text data, quindi l'asse principale è migliorare l'encoder visivo su immagini di alta qualità; il video understanding è ottenuto come *transfer* da quel foundation, con un solo stage finale video-dominato [source: raw/papers/zhang-2025-videollama-3.pdf §1].
- **Any-resolution Vision Tokenization (AVT)**: sostituisce gli embedding posizionali assoluti del ViT con [[mrope|2D-RoPE]], permettendo al vision encoder di processare immagini di forma arbitraria e produrre un numero di token proporzionale alla risoluzione [source: raw/papers/zhang-2025-videollama-3.pdf §2.1].
- **Differential Frame Pruner (DiffFP)**: video compressor che rimuove patch ridondanti tra frame consecutivi sulla base della distanza 1-norm nel pixel space (soglia 0.1, ispirato a RLT), riducendo il context length per video lunghi [source: raw/papers/zhang-2025-videollama-3.pdf §2.2].
- **VL3-Syn7M**: dataset re-captioned di 7M immagini da COYO-700M, ripulito con filtro aspect ratio + aesthetic score + BLIP2/CLIP similarity + KNN clustering, e re-captioned con InternVL2-8B (short) e InternVL2-26B (detailed) [source: raw/papers/zhang-2025-videollama-3.pdf §2.3].

## Metodo

### Architettura

Quattro componenti [source: raw/papers/zhang-2025-videollama-3.pdf §3]:

1. **Vision encoder**: inizializzato da [[siglip]] (`siglip-so400m-patch14-384`), adattato con 2D-RoPE per accettare risoluzioni dinamiche.
2. **Video compressor**: il modulo DiffFP che pruna patch ridondanti tra frame consecutivi.
3. **Projector**: MLP a due layer con attivazione GELU, mappa feature visive nello spazio dell'LLM.
4. **LLM**: [[qwen|Qwen2.5]] — variante 2B (VideoLLaMA3-2B) o 7B (VideoLLaMA3-7B).

### Any-resolution Vision Tokenization (AVT)

L'ablation table (§4.4) confronta CLIP-ViT-L/336, DFN5B-CLIP-H/378 e SigLIP-SO400M/384 a risoluzione fissa: SigLIP vince soprattutto sui task fine-grained text-related (ChartQA 22.4 vs 18.3/16.4; DocVQA 31.3 vs 24.9/23.1) [source: raw/papers/zhang-2025-videollama-3.pdf §4.4, Tab. 9]. Su questa base si rimpiazzano gli embedding posizionali assoluti del ViT con 2D-RoPE (vedi [[positional-encoding]]) e si fine-tuna l'encoder durante lo stage 1 in modo che generalizzi a risoluzioni e aspect ratio arbitrari.

### Differential Frame Pruner (DiffFP)

Algoritmo, ispirato a RLT [source: raw/papers/zhang-2025-videollama-3.pdf §2.2]:

1. Calcola la distanza 1-norm tra patch temporalmente consecutive in pixel space.
2. Patch con distanza sotto la soglia (default `0.1`) sono considerate ridondanti e prunate dal frame successivo.
3. Inoltre applica un downsampling spaziale `2×2` bilineare per limitare il context length.

Applicato negli stage 3 e 4 (cioè dove c'è dato video).

### Pipeline di costruzione VL3-Syn7M

A partire da COYO-700M [source: raw/papers/zhang-2025-videollama-3.pdf §2.3]:

1. **Aspect Ratio Filtering** — rimozione immagini con AR estremi.
2. **Aesthetic Score Filtering** — soglia su modello di scoring estetico.
3. **Text-Image Similarity** — BLIP2 genera caption iniziali, CLIP misura la similarity, scarta low-similarity.
4. **Visual Feature Clustering** — embedding CLIP + k-NN, sample bilanciati per cluster.
5. **Re-caption** — short captions con InternVL2-8B, detailed captions con InternVL2-26B → `VL3-Syn7M-short` e `VL3-Syn7M-detailed`.

### Training: quattro stage

I dettagli quantitativi (§3.2):

| Stage | Obiettivo | Tokens trainable | Dati (M) | Composizione |
|-------|-----------|------------------|----------|--------------|
| 1. Vision Encoder Adaptation | adattare SigLIP a risoluzioni dinamiche | ViT + projector | 15.57 | scene image 11.84M, doc 2.80M, scene text 0.93M |
| 2. Vision-Language Alignment | integrare conoscenza multimodale | tutti | 21.97 | scene 12.56M, doc 2.68M, scene text 4.69M, chart 0.04M, fine-grained 1.0M, text-only 6.25M |
| 3. Multi-task Fine-tuning | instruction tuning + intro video | tutti | 19.05 | image 14.92M (general/doc/chart/OCR/grounding/multi-image/text-only) + video 2.92M |
| 4. Video-centric Fine-tuning | specializzazione video | tutti | 5.71 | general video 3.03M, streaming 36.2K, temporal grounding 0.21M, image-only 0.88M, text-only 1.56M |

Iperparametri (§3.3):
- Cosine LR scheduler, warmup ratio `0.03`.
- Max token length: **16384**; max vision token length: **10240** (a video evaluation si espande a 16K).
- Stage 1: LR ViT `1e-5`, projector `1e-3` (LLM frozen).
- Stage 2-4: LR LLM `1e-5`, projector `1e-5`, ViT `2e-6`.
- DiffFP threshold `0.1`, downsample spaziale `2×2`.
- Video: campionamento a **1 FPS** con FFmpeg, fino a un massimo di **180 frame** (~3 minuti).
- VideoLLaMA3-7B inizializza l'encoder dal 2B (già adattato) e LLM Qwen2.5-7B.

### Formati di dati (§3.1)

Tre formati [source: raw/papers/zhang-2025-videollama-3.pdf §3.1]:

- **Image sequence**: token immagine separati da `\n`.
- **Video sequence**: ogni frame preceduto da `Time: xxs`, frame separati da `,`, separatore `\n` finale.
- **Streaming video sequence**: video+text interleavati, `Time:` per i frame e `GPT:` per le risposte assistant.

## Risultati chiave

### Image benchmarks — VideoLLaMA3-2B vs baseline 2B (§4.1, Tab. 5)

| Benchmark | SmolVLM-2B | InternVL2.5-2B | Qwen2-VL-2B | **VideoLLaMA3-2B** |
|---|---|---|---|---|
| ChartQA | 65.3 | 79.2 | 73.5 | **79.8** |
| DocVQA test | 81.6 | 88.7 | 90.1 | **91.9** |
| InfoVQA test | – | 60.9 | 65.5 | **69.4** |
| OCRBench | 622 | **804** | 767 | 779 |
| MathVista mini | 44.6 | 51.3 | 43.0 | **59.2** |
| MathVision test | 6.5 | 14.7 | 12.4 | **15.5** |
| MMMU-Pro | 17.1 | 23.7 | 26.0 | **28.6** |
| MMMU val | 38.8 | 43.6 | 41.1 | **45.3** |
| RealWorldQA | 48.8 | 60.1 | 62.9 | **67.3** |
| AI2D | 62.1 | 74.9 | 69.9 | **78.2** |

### Image benchmarks — VideoLLaMA3-7B vs baseline 7-8B (§4.1, Tab. 6)

| Benchmark | Molmo-7B-D | InternVL2.5-8B | LLaVA-OV-7B | NVILA-8B | Qwen2-VL-7B | **VideoLLaMA3-7B** |
|---|---|---|---|---|---|---|
| ChartQA | 84.1 | 84.8 | 80.0 | 86.1 | 83.0 | **86.3** |
| DocVQA test | 92.2 | 93.0 | 87.5 | 93.7 | 94.5 | **94.9** |
| InfoVQA test | 72.6 | 77.6 | 68.8 | 70.7 | 76.5 | **78.9** |
| OCRBench | – | 822 | 621 | 676 | **845** | 828 |
| MathVista mini | 51.6 | 64.4 | 63.2 | 65.4 | 58.2 | **67.1** |
| MathVision test | – | 19.7 | – | 11.9 | 16.3 | **26.2** |
| MMMU val | 45.3 | **56.0** | 48.8 | 49.9 | 54.1 | 48.8 |
| BLINK test | – | 54.8 | 48.2 | 47.0 | 43.1 | **56.7** |
| RealWorldQA | 70.7 | 70.1 | 66.3 | 68.6 | 70.1 | **72.7** |
| AI2D | **93.2** | 84.5 | 81.4 | 92.3 | 83.0 | 84.7 |

### Video benchmarks — VideoLLaMA3-2B (§4.2, Tab. 7)

| Benchmark | Apollo-2B | InternVL2.5-2B | Qwen2-VL-2B | **VideoLLaMA3-2B** |
|---|---|---|---|---|
| VideoMME w/o sub | 53.0 | 51.9 | 55.6 | **59.6** |
| VideoMME w/ sub | 54.6 | 54.1 | 60.4 | **63.4** |
| MVBench | – | **68.8** | 63.2 | 65.5 |
| EgoSchema test | – | 58.1 | 54.9 | **58.5** |
| PerceptionTest | 61.0 | 66.3 | 53.9 | **68.0** |
| ActivityNet-QA | – | 54.1 | 53.3 | **58.2** |
| MLVU dev | 63.3 | 58.9 | 62.7 | **65.4** |
| LongVideoBench val | – | 52.0 | 48.7 | **57.1** |
| LVBench | – | 37.9 | 39.4 | **41.6** |
| TempCompass | 60.8 | 57.7 | 62.2 | **63.4** |
| NextQA | – | 75.6 | 77.2 | **81.1** |
| Charades-STA mIoU | – | – | – | **55.5** |

### Video benchmarks — VideoLLaMA3-7B (§4.2, Tab. 8)

| Benchmark | Qwen2-VL-7B | InternVL2.5-8B | LLaVA-Video-7B | NVILA-8B | Apollo-7B | VideoLLaMA2.1-7B | **VideoLLaMA3-7B** |
|---|---|---|---|---|---|---|---|
| VideoMME w/o sub | 63.3 | 64.2 | 63.3 | 64.2 | 61.3 | 54.9 | **66.2** |
| VideoMME w/ sub | 69.0 | 66.9 | 69.7 | 70.0 | 63.3 | 56.4 | **70.3** |
| MVBench | 67.0 | **72.0** | 58.6 | 68.1 | – | 57.3 | 69.7 |
| EgoSchema test | **66.7** | 66.2 | 57.3 | 54.3 | – | 53.1 | 63.3 |
| PerceptionTest | 62.3 | 68.9 | 67.9 | 65.4 | – | 54.9 | **72.8** |
| ActivityNet-QA | 57.4 | 58.9 | 56.5 | 60.9 | – | 53.0 | **61.3** |
| MLVU dev | 69.8 | 69.0 | 70.8 | 70.6 | 70.9 | 57.4 | **73.0** |
| LongVideoBench val | 55.6 | **60.0** | 58.2 | 57.7 | 58.5 | – | 59.8 |
| LVBench | 44.7 | 43.2 | 41.5 | 44.0 | – | 36.2 | **45.3** |
| Charades-STA mIoU | – | – | – | – | – | – | **60.7** |

### Cosa cambia rispetto a VideoLLaMA 2

VideoLLaMA2.1-7B viene staccato di +11.3 punti su VideoMME w/o sub, +15.6 su MLVU, +17.9 su PerceptionTest [source: raw/papers/zhang-2025-videollama-3.pdf §4.2 Tab. 8]. La differenza è attribuita a (i) paradigma vision-centric (ricetta image-first invece di video-heavy), (ii) AVT + dynamic resolution, (iii) DiffFP video compression, (iv) backbone Qwen2.5 (vs Mistral in v2).

## Limitazioni dichiarate

[source: raw/papers/zhang-2025-videollama-3.pdf §6.2]

- **Qualità e diversità dati video** ancora limitate — il bottiglia non è più il modello ma il dato video.
- **Real-time processing** non ottimizzato: overhead computazionale alto su video lunghi/ad alta risoluzione, problematico per applicazioni come autonomous driving o live analytics.
- **Modalità non visive** non esplorate: nessun supporto audio/speech nativo (in contrasto con VideoLLaMA 2 che includeva audio encoder).

Future work indicate: dataset video-text di qualità superiore, ottimizzazioni per inferenza real-time, espansione multimodale (audio, speech), post-training RL più sofisticato (RLHF / DPO scalato a MLLM).

## Domande aperte / critiche

- Il paradigma vision-centric funziona qui ma non c'è studio sistematico del trade-off "quante più ore di video × quanto meglio si fa": forse i guadagni image→video saturano oltre una certa scala di dati immagine. Non c'è ablation che vari la mole di image data a parità di video data.
- DiffFP applica un threshold fisso (0.1) sulla 1-norm in pixel space: per video con illuminazione/cinematografia rumorosa potrebbe sotto-prunare; per video statici (slideshow, talking head) potrebbe sovra-prunare. Manca uno studio di sensitivity al threshold.
- 1 FPS + max 180 frame implica un cap effettivo di ~3 minuti per video; benchmark long-video (LVBench, MLVU, LongVideoBench) coprono ore — quindi si testano comunque frame downsampled. La limitazione di context (16K vision token) è stringente rispetto a Qwen2.5-VL (24K) e Qwen3-VL (256K total).
- Niente menzione esplicita di licenza dei pesi: il repo GitHub esiste ma il paper non specifica termini d'uso commerciale.

## Concetti citati

- [[video-llm]], [[vision-language-model]], [[multimodal-large-language-model]]
- [[vision-encoder]], [[siglip]], [[vision-transformer]] (ViT)
- [[mrope]] (qui usato come 2D-RoPE per immagini)
- [[positional-encoding]], [[rotary-position-embedding]]
- [[any-resolution-vision-tokenization]], [[dynamic-resolution]]
- [[differential-frame-pruner]], [[video-token-compression]]
- [[qwen]] (backbone LLM)
- [[instruction-tuning]], [[supervised-fine-tuning]]
- [[video-mme]], [[mvbench]], [[mlvu]], [[longvideobench]], [[lvbench]], [[egoschema]], [[perception-test]], [[next-qa]], [[charades-sta]], [[tempcompass]], [[activitynet-qa]]
- [[mmmu]], [[mmmu-pro]], [[blink]], [[realworldqa]], [[mathvista]], [[mathvision]], [[docvqa]], [[infovqa]], [[chartqa]], [[ocrbench]], [[ai2d]], [[gqa]], [[mme]]
- [[coyo-700m]], [[la-1b]], [[laion-ocr]], [[panda-70m]], [[ego4d]], [[videollama]] (v2)

## Citazioni dirette

> "The key insight of our vision-centric training paradigm is that high-quality image-text data is crucial for both image and video understanding. Instead of preparing massive video-text datasets, we focus on constructing large-scale, high-quality image-text datasets." (Abstract, p. 1)

> "AVT converts images or videos of any resolution into a set of 1-D token sequences, enabling compatibility with varying amounts of input images and videos of different resolutions… DiffFP eliminates video content with minimal differences between adjacent frames." (Fig. 3 caption, §2)

> "Despite the impressive performance of VideoLLaMA3, several limitations must be acknowledged. […] Video data often suffer from lower annotation quality and limited diversity." (§6.2, p. 23)
