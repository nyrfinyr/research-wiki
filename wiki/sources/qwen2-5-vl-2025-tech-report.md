---
title: "Qwen Team (2025) — Qwen2.5-VL Technical Report"
type: source
tags: [vision-language-model, video-llm, multimodal-large-language-model, qwen, mrope, vision-transformer, window-attention, document-understanding, gui-agent, instruction-tuning, dpo]
created: 2026-05-15
updated: 2026-05-15
source_path: raw/papers/qwen2-5-vl-2025-tech-report.pdf
source_kind: paper
source_date: 2025-02-19
doi: 10.48550/arXiv.2502.13923
zotero_key: 8J84XF6Z
venue: technical report (arXiv 2502.13923v1, Alibaba Qwen team)
authors: [Shuai Bai, Keqin Chen, Xuejing Liu, Jialin Wang, Wenbin Ge, Sibo Song, Kai Dang, Peng Wang, Shijie Wang, Jun Tang, Humen Zhong, Yuanzhi Zhu, Mingkun Yang, Zhaohai Li, Jianqiang Wan, Pengfei Wang, Wei Ding, Zheren Fu, Yiheng Xu, Jiabo Ye, Xi Zhang, Tianbao Xie, Zesen Cheng, Hang Zhang, Zhibo Yang, Haiyang Xu, Junyang Lin, An Yang, Binyuan Hui, Bowen Yu, Chen Cheng, Dayiheng Liu, Fan Hong, Fei Huang, Jiawei Liu, Jin Xu, Jianhong Tu, Jianyuan Zeng, Jie Zhang, Jinkai Wang, Jianwei Zhang, Jingren Zhou, Kexin Yang, Mei Li, Ming Yan, Na Ni, Rui Men, Songtao Jiang, Xiaodong Deng, Xiaoming Huang, Ximing Zhou, Xingzhang Ren, Yang Fan, Yichang Zhang, Yikai Zhu, Yuqiong Liu, Zhifang Guo]
year: 2025
---

# Qwen Team (2025) — Qwen2.5-VL Technical Report

## TL;DR

Qwen2.5-VL è la versione 2.5 della famiglia di [[vision-language-model|vision-language model]] di Alibaba, rilasciata in tre taglie open-weight (**3B / 7B / 72B**) ed addestrata su circa **4.1 T token** (vs 1.2 T per Qwen2-VL). Quattro contributi tecnici principali rispetto al predecessore Qwen2-VL: (1) **vision encoder ridisegnato** — un [[vision-transformer|ViT]] da 675 M (32 layer, hidden 1280) addestrato *from scratch* con **window attention** in 28 layer su 32 (full attention solo nei layer {7, 15, 23, 31}, window size 112×112) per ridurre la complessità da quadratica a lineare; (2) **dynamic FPS sampling** che estende dynamic resolution alla dimensione temporale, permettendo video di durata fino a ore (fino a 768 frame e ≤24 576 token visivi); (3) **MRoPE allineata al tempo assoluto** — il temporal ID nella [[mrope]] non si lega più al frame index ma al timestamp reale, abilitando temporal grounding al secondo su Charades-STA (mIoU 50.9, batte GPT-4o a 35.7); (4) **MLP-based vision-language merger** che raggruppa 4 patch ViT adiacenti prima di proiettarle nello spazio LLM. Il flagship 72B "matches state-of-the-art models like GPT-4o and Claude 3.5 Sonnet, particularly excelling in document and diagram understanding" [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf abstract]. Posiziona la linea Qwen-VL tra Qwen2-VL (2024) e [[qwen3-vl-2025-tech-report|Qwen3-VL]] (dicembre 2025, MoE + interleaved MRoPE + DeepStack).

## Contributo principale

- **Window-attention ViT nativo a risoluzione dinamica**: ViT da 32 layer in cui solo 4 fanno self-attention completa, gli altri 28 usano window attention 112×112 (8×8 patch da 14×14). Le regioni più piccole del window vengono processate *senza padding*, preservando la risoluzione originale. Risultato: costo lineare nel numero di patch, latenza bassa anche su input ad alta risoluzione [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.1.1].
- **Dynamic FPS sampling + dynamic resolution temporale**: il ViT raggruppa **due frame consecutivi** come unità temporale 3D, dimezzando i token visivi. Durante training l'FPS viene campionato dinamicamente per coprire una distribuzione ampia di velocità video. Permette di gestire video di durata fino a ore [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.1.2, §2.2.1].
- **Time-aligned MRoPE (T-RoPE)**: la temporal ID della MRoPE viene **agganciata all'orologio assoluto del video** invece che all'indice frame. Permette al modello di apprendere "la cadenza del tempo through the intervals between temporal dimension IDs" senza overhead computazionale [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.1.3]. → Limite poi superato da Qwen3-VL (textual timestamp tokens).
- **Pretraining 4.1 T token in tre fasi**: ViT-only (1.5T), full multimodal (2T), long-context 32K (0.6T). Scale length da 8 192 a 32 768 nella terza fase [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.2.2, Table 2].
- **QwenVL HTML format per document parsing**: un formato unificato HTML con tag custom (`<table>`, `<div class="chart">`, `<div class="music sheet">`, `<div class="chemical formula">`, ecc.) che inserisce bounding box (`data-bbox="x1 y1 x2 y2"`) per *ogni* elemento. Sostituisce le pipeline modulari layout+OCR+chart+illustrations con un unico modello generalista [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.2.1, p. 6-7].
- **Bounding box e point grounding in coordinate assolute** (non normalizzate), addestrato su oltre 10 000 categorie open-vocabulary, con augmentation copy-paste e syn data via Grounding-DINO + SAM [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.2.1, p. 6].
- **Post-training in due fasi (SFT + DPO)** con ViT congelato; SFT su ~2 M esempi (50% testo puro, 50% multimodale) seguito da **rejection sampling** per migliorare il [[chain-of-thought|CoT]] su task di reasoning [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.3].

## Metodo

### Architettura generale

Tre moduli (Fig. 1) [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.1]:

1. **Vision encoder** — ViT ridisegnato con 2D-RoPE, window attention, RMSNorm e SwiGLU (allineato ai design choice degli LLM). Patch size 14, input ridimensionato a multipli di 28.
2. **MLP-based vision-language merger** — raggruppa 4 patch spazialmente adiacenti, le concatena e le proietta in 2 MLP layer fino alla dimensione dell'LLM. Compressione esplicita dei token visivi.
3. **LLM backbone** — pretrained [[qwen|Qwen2.5]] LLM, con 1D-RoPE sostituita da [[mrope|MRoPE]] aligned to absolute time.

### Configurazione (Table 1, §2.1)

| Componente | Qwen2.5-VL-3B | Qwen2.5-VL-7B | Qwen2.5-VL-72B |
|---|---|---|---|
| ViT Hidden Size | 1280 | 1280 | 1280 |
| ViT Layers | 32 | 32 | 32 |
| ViT Heads | 16 | 16 | 16 |
| ViT Intermediate Size | 3456 | 3456 | 3456 |
| ViT Patch Size | 14 | 14 | 14 |
| ViT Window Size | 112 | 112 | 112 |
| Full Attention Block Indexes | {7,15,23,31} | {7,15,23,31} | {7,15,23,31} |
| Merger In/Out Channel | 1280 / 2048 | 1280 / 3584 | 1280 / 8192 |
| LLM Hidden Size | 2048 | 3584 | 8192 |
| LLM Layers | 36 | 28 | 80 |
| LLM KV Heads | 2 | 4 | 8 |
| LLM Head Size | 128 | 128 | 128 |
| LLM Intermediate Size | 4864 | 18 944 | 29 568 |
| Embedding Tying | sì | no | no |
| Vocab Size | 151 646 | 151 646 | 151 646 |
| Trained Tokens | 4.1 T | 4.1 T | 4.1 T |

### Vision encoder dettagliato (§2.1.1)

- **Window attention**: 28 layer su 32 usano window 112×112 (= 8×8 patch da 14). Le regioni più piccole non sono paddate.
- **Full attention** solo nei 4 layer "stitch" {7, 15, 23, 31}.
- **Positional encoding 2D-RoPE** per catturare relazioni spaziali; **3D patch partitioning** per video (2 frame consecutivi grouped come una stessa unità).
- **RMSNorm + SwiGLU** per allineare design con LLM.
- **Training in tre stage**: CLIP-style pretraining → vision-language alignment → end-to-end fine-tuning. Dynamic sampling at native resolutions; rapporti d'aspetto preservati.

### Native dynamic resolution e dynamic FPS (§2.1.2)

- **Spaziale**: nessuna normalizzazione di coordinate; bounding box e punti vivono nelle dimensioni reali dell'input. Il modello apprende intrinsecamente la scala fisica.
- **Temporale**: FPS sampling dinamico durante training (distribuzione uniforme sui possibili FPS). Per inferenza il numero massimo di frame per video è 768 e i token visivi totali ≤ 24 576 [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §3.3.4].

### MRoPE allineata al tempo assoluto (§2.1.3)

- La MRoPE di Qwen2-VL aveva tre componenti (temporal, height, width). Per testo tutti tre uguali (≡ 1D-RoPE); per immagini temporal costante e h/w spaziali; per video temporal incrementato a ogni frame.
- **Problema in Qwen2-VL**: i temporal ID erano legati all'indice frame, non alla velocità di cambio scena né al tempo reale.
- **Soluzione Qwen2.5-VL**: il temporal ID è proporzionale al **tempo assoluto** (in secondi). Gli intervalli tra ID rappresentano la cadenza reale. Niente token in più, niente head dedicate. → Migliora temporal grounding e generalizza tra FPS diversi.

### Pre-training data (§2.2.1)

Dataset totale: **~4 T token** (vs 1.2 T per Qwen2-VL). Composizione: image caption, interleaved image-text, OCR (multilingua: francese, tedesco, italiano, spagnolo, portoghese, arabo, russo, giapponese, coreano, vietnamita + cinese/inglese), document parsing in **QwenVL HTML**, knowledge (celebrity, landmark, flora, fauna), grounding (10 000+ categorie, BBox + point), video (caption + temporal grounding in sec o `HH:MM:SS`+frame), agent data (mobile/web/desktop screenshot con UI grounding + multi-step trajectories da Aguvis-like agent framework).

Pipeline di scoring per interleaved data: 4 criteri (text-only quality, image-text relevance, image-text complementarity, info density balance). Document data sintetizzata con HTML structure e bounding box per elemento (paragrafi, tabelle, chart, formule, immagini, OCR-on-image, music sheet ABC notation, chemical formula SMILES) [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.2.1].

### Training recipe pre-training (§2.2.2, Table 2)

| Stage | Visual Pre-Training | Multimodal Pre-Training | Long-Context Pre-Training |
|---|---|---|---|
| Data | Image Caption + Knowledge + OCR | + Pure text, Interleaved Data, VQA, Video, Grounding, Agent | + Long Video, Long Agent, Long Document |
| Tokens | 1.5 T | 2 T | 0.6 T |
| Sequence length | 8 192 | 8 192 | **32 768** |
| Training | ViT only | ViT + LLM | ViT + LLM |

ViT inizializzato da DataComp + dataset interni; LLM inizializzato da Qwen2.5. Packing dinamico dei sample per bilanciare il carico computazionale tra GPU.

### Post-training (§2.3)

Due fasi, **ViT congelato**:

1. **SFT** su ~2 M entry (50% testo puro, 50% multimodale, formato ChatML). Dialog single- e multi-turn, single- e multi-image. Subset specializzati: VQA, captioning, math, code, security, Doc/OCR, Grounding, Video, Agent.
2. **DPO** ([[dpo|Direct Preference Optimization]]) solo su image-text e pure text; ogni sample processato una sola volta.

**Pipeline di filtraggio dati a due stage**:

- **Stage 1**: classificazione gerarchica via Qwen2-VL-Instag in 8 domini × 30 sotto-categorie (es. Coding → Code_Debugging, Code_Generation, Code_Translation, Code_Understanding).
- **Stage 2**: filtering rule-based (heuristics anti-repetition, anti-truncation, anti-harm) + model-based (reward model multidimensionale su correctness, completeness, clarity, relevance, helpfulness, visual grounding accuracy).

**Rejection sampling** per [[chain-of-thought|CoT]] (math, code, domain VQA): si genera con un checkpoint intermedio, si valida contro ground truth, si scartano output con code-switching, eccessiva lunghezza, pattern ripetitivi, o CoT che ignora/misinterpreta info visive [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.3.3].

## Risultati chiave

### Image — General Visual QA, College, Math (Table 3, §3.1)

| Dataset | Claude 3.5 Sonnet | GPT-4o | InternVL2.5-78B | Qwen2-VL-72B | **Qwen2.5-VL-72B** | Qwen2.5-VL-7B | Qwen2.5-VL-3B |
|---|---|---|---|---|---|---|---|
| MMMU val | 68.3 | 69.1 | 70.1 | 64.5 | **70.2** | 58.6 | 53.1 |
| MMMU-Pro overall | 51.5 | 51.9 | 48.6 | 46.2 | 51.1 | 38.3 | 31.56 |
| MathVista mini | 67.7 | 63.8 | 72.3 | 70.5 | **74.8** | 68.2 | 62.3 |
| MATH-Vision full | – | 30.4 | 32.2 | 25.9 | **38.1** | 25.1 | 21.2 |
| MathVerse mini | – | 50.2 | 51.7 | – | **57.6** | 49.2 | 47.6 |
| MegaBench | 52.1 | 54.2 | 45.6 | 46.8 | 51.3 | 36.8 | 28.9 |
| MMBench-EN test | 82.6 | 83.4 | 88.3 | 86.9 | **88.6** | 83.5 | 79.1 |
| MMBench-CN test | 83.5 | 82.1 | 88.5 | 86.7 | 87.9 | 83.4 | 78.1 |
| MMBench-V1.1-EN test | 80.9 | 83.1 | 87.4 | 86.1 | **88.4** | 82.6 | 77.4 |
| MMStar | 65.1 | 64.7 | 69.5 | 68.3 | **70.8** | 63.9 | 55.9 |
| MME sum | 1920 | 2328 | **2494** | 2483 | 2448 | 2347 | 2157 |
| MuirBench | – | 68.0 | 63.5 | – | **70.7** | 59.6 | 47.7 |
| BLINK val | – | 68.0 | 63.8 | – | 64.4 | 56.4 | 47.6 |
| CRPE relation | – | 76.6 | 78.8 | – | **79.2** | 76.4 | 73.6 |
| HallBench avg | 55.5 | 55.0 | 57.4 | **58.1** | 55.2 | 52.9 | 46.3 |
| MTVQA | 25.7 | 27.8 | **31.9** | 30.9 | 31.7 | 29.2 | 24.8 |
| RealWorldQA avg | 60.1 | 75.4 | **78.7** | 77.8 | 75.7 | 68.5 | 65.4 |
| MME-RealWorld en | 51.6 | 45.2 | 62.9 | – | **63.2** | 57.4 | 53.1 |
| MMVet turbo | 70.1 | 69.1 | 72.3 | 74.0 | **76.2** | 67.1 | 61.8 |
| MM-MT-Bench | 7.5 | 7.72 | – | 6.59 | 7.6 | 6.3 | 5.7 |

### Document/OCR (Table 5, §3.3.2)

| Dataset | Claude 3.5 Sonnet | Gemini 1.5 Pro | GPT-4o | InternVL2.5-78B | **Qwen2.5-VL-72B** | 7B | 3B |
|---|---|---|---|---|---|---|---|
| CC-OCR | 62.5 | 73.0 | 66.9 | 64.7 | **79.8** | 77.8 | 74.5 |
| OmniDocBench edit en/zh ↓ | 0.330/0.381 | 0.230/0.281 | 0.265/0.435 | 0.275/0.324 | **0.226/0.324** | 0.308/0.398 | 0.409/0.543 |
| AI2D w. M. | 81.2 | 88.4 | 84.6 | **89.1** | 88.7 | 83.9 | 81.6 |
| TextVQA val | 76.5 | 78.8 | 77.4 | 83.4 | 83.5 | **84.9** | 79.3 |
| DocVQA test | 95.2 | 93.1 | 91.1 | 95.1 | **96.4** | 95.7 | 93.9 |
| InfoVQA test | 74.3 | 81.0 | 80.7 | 84.1 | **87.3** | 82.6 | 77.1 |
| ChartQA test Avg. | 90.8 | 87.2 | 86.7 | 88.3 | **89.5** | 87.3 | 84.0 |
| CharXiv RQ/DQ | 60.2/84.3 | 43.3/72.0 | 47.1/84.5 | 42.4/82.3 | **49.7/87.4** | 42.5/73.9 | 31.3/58.6 |
| SEED-Bench-2-Plus | 71.7 | 70.8 | 72.0 | 71.3 | **73.0** | 70.4 | 67.6 |
| OCRBench | 788 | 754 | 736 | 854 | **885** | 864 | 797 |
| VCR En-Hard-EM | 41.7 | 28.1 | 73.2 | – | 79.8 | **80.5** | 37.5 |
| OCRBench_v2 en/zh | 45.2/39.6 | 51.9/43.1 | 46.5/32.2 | 49.8/52.1 | **61.5/63.7** | 56.3/57.2 | 54.3/52.1 |

OCRBench_v2 mostra il gap più netto: Qwen2.5-VL-72B supera Gemini 1.5 Pro di **+9.6 punti (en)** e **+20.6 punti (zh)** [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §3.3.2].

### Grounding (Table 6, §3.3.3)

| Dataset | Gemini 1.5 Pro | Grounding-DINO | Molmo 72B | InternVL2.5-78B | **Qwen2.5-VL-72B** | 7B | 3B |
|---|---|---|---|---|---|---|---|
| RefCOCO val | 73.2 | 90.6 | – | **93.7** | 92.7 | 90.0 | 89.1 |
| RefCOCO testA | 72.9 | 93.2 | – | **95.6** | 94.6 | 92.5 | 91.7 |
| RefCOCO testB | 74.6 | 88.2 | – | **92.5** | 89.7 | 85.4 | 84.0 |
| RefCOCO+ val | 62.5 | 88.2 | – | **90.4** | 88.9 | 84.2 | 82.4 |
| RefCOCO+ testA | 63.9 | 89.0 | – | **94.7** | 92.2 | 89.1 | 88.0 |
| RefCOCO+ testB | 65.0 | 75.9 | – | **86.9** | 83.7 | 76.9 | 74.1 |
| RefCOCOg val | 75.2 | 86.1 | – | **92.7** | 89.9 | 87.2 | 85.2 |
| RefCOCOg test | 76.2 | 87.0 | – | **92.2** | 90.3 | 87.2 | 85.7 |
| ODinW-13 (mAP) | 36.7 | **55.0** | – | 31.7 | 43.1 | 37.3 | 37.5 |
| PointGrounding | – | – | **69.2** | – | 67.5 | 67.3 | 58.3 |
| CountBench | 85.5 | – | 91.2 | 72.1 | **93.6** | – | – |

InternVL2.5-78B resta leader sulle RefCOCO; il vantaggio di Qwen2.5-VL è la **versatilità** (BBox + point + count + open-vocabulary fino a 10k+ classi) e l'uso di coordinate assolute.

### Video (Table 8, §3.3.4)

| Dataset | Gemini 1.5 Pro | GPT-4o | **Qwen2.5-VL-72B** | 7B | 3B |
|---|---|---|---|---|---|
| [[video-mme|Video-MME]] w/o sub. | **75.0** | 71.9 | 73.3 | 65.1 | 61.5 |
| Video-MME w/ sub. | **81.3** | 77.2 | 79.1 | 71.6 | 67.6 |
| Video-MMMU | 53.9 | **61.2** | 60.2 | 47.4 | – |
| MMVU val | 65.4 | **67.4** | 62.9 | 50.1 | – |
| [[mvbench|MVBench]] | 60.5 | 64.6 | **70.4** | 69.6 | 67.0 |
| MMBench-Video | 1.30 | 1.63 | **2.02** | 1.79 | 1.63 |
| [[longvideobench|LongVideoBench]] val | 64.0 | **66.7** | 60.7 | 56.0 | 54.2 |
| [[lvbench|LVBench]] | 33.1 | 30.8 | **47.3** | 45.3 | 43.3 |
| [[egoschema|EgoSchema]] test | 71.2 | 72.2 | **76.2** | 65.0 | 64.8 |
| PerceptionTest test | – | – | **73.2** | 70.5 | 66.9 |
| [[mlvu|MLVU]] M-Avg | – | 64.6 | **74.6** | 70.2 | 68.2 |
| TempCompass Avg | 67.1 | 73.8 | **74.8** | 71.7 | 64.4 |
| Charades-STA mIoU | – | 35.7 | **50.9** | 43.6 | 38.8 |

**Punti chiave**: Qwen2.5-VL-72B vince su LVBench (+14.2 vs Gemini 1.5 Pro, +16.5 vs GPT-4o), MLVU (+10), Charades-STA temporal grounding (+15.2 vs GPT-4o), MVBench, EgoSchema, TempCompass. Resta dietro Gemini 1.5 Pro su Video-MME e LongVideoBench. Su tutti i benchmark video: max 768 frame, max 24 576 visual token [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §3.3.4].

### Agent / GUI (Table 9, §3.3.5)

| Benchmark | GPT-4o | Gemini 2.0 | Claude | Aguvis-72B | Qwen2-VL-72B | **Qwen2.5-VL-72B** |
|---|---|---|---|---|---|---|
| ScreenSpot | 18.1 | 84.0 | 83.0 | **89.2** | – | 87.1 |
| ScreenSpot Pro | – | – | 17.1 | 23.6 | 1.6 | **43.6** |
| Android Control HighEM | 20.8 | 28.5 | 12.5 | 66.4 | 59.1 | **67.36** |
| Android Control LowEM | 19.4 | 60.2 | 19.4 | 84.4 | 59.2 | **93.7** |
| AndroidWorld SR | 34.5% (SoM) | 26% (SoM) | 27.9% | 26.1% | 6% (SoM) | **35%** |
| MobileMiniWob++ SR | 61% | 42% (SoM) | 61% (SoM) | 66% | 50% (SoM) | **68%** |
| OSWorld | 5.03 | 4.70 | **14.90** | 10.26 | 2.42 | 8.83 |

ScreenSpot Pro è il salto più drammatico: da 1.6 (Qwen2-VL) a 43.6 (Qwen2.5-VL), **+42 punti**. OSWorld resta sotto Claude Computer Use.

### Pure text (Table 4, §3.2)

Qwen2.5-VL-72B preserva le capacità linguistiche di Qwen2.5-72B base: MMLU-Pro 71.2 vs 71.1, MMLU-redux 85.9 vs 86.8, MATH 83.0 vs 83.1, HumanEval 87.8 vs 86.6, MultiPL-E **79.5 vs 75.1**, LiveBench-0831 **57.0 vs 52.3**, IFEval **86.3 vs 84.1**. Non c'è quindi la regression text-only tipica delle estensioni multimodali [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §3.2, Table 4].

## Limitazioni dichiarate

Gli autori non hanno una sezione "Limitations" esplicita; le limitazioni emergono in modo diffuso:

- **CoT visivo è ancora un problema aperto**: gli intermediate reasoning step possono ignorare o misinterpretare i cue visivi. "achieving optimal modality alignment remains an ongoing challenge that requires further advancements" [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.3.3, p. 10].
- **OSWorld 8.83 vs Claude 14.90**: il gap su computer-use più realistico non è chiuso [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §3.3.5, Table 9].
- **Cap a 768 frame / 24 576 visual token** per video → video davvero lunghi richiedono sampling che può perdere eventi sub-secondo [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §3.3.4].
- **Temporal ID legati al tempo assoluto** in T-RoPE: su video molto lunghi gli ID diventano grandi/sparsi, problema poi diagnosticato e risolto in [[qwen3-vl-2025-tech-report|Qwen3-VL]] con textual timestamp token [source: raw/papers/qwen3-vl-2025-tech-report.pdf §2.3, riportato come limite di Qwen2.5-VL].
- **HallBench 55.2** sotto Qwen2-VL-72B (58.1) e InternVL2.5-78B (57.4) → l'aumento di scala dati ha un costo in hallucination [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §3.3.1, Table 3].
- **RealWorldQA**: resta dietro InternVL2.5 e Qwen2-VL.

## Domande aperte / critiche

- Il T-RoPE absolute-time-aligned è davvero il design ottimale per long video, o i textual timestamp token introdotti da [[qwen3-vl-2025-tech-report|Qwen3-VL]] funzionano meglio strutturalmente? Il report di Qwen3-VL diagnostica entrambi i limiti — vale la pena rileggere i risultati di Qwen2.5-VL alla luce di quella diagnosi.
- Quanto del miglioramento su long-video viene dalla T-RoPE vs dal dataset (long video captions sintetizzate via multi-frame pipeline)?
- Window attention sui 28 layer del ViT: si è confrontato esplicitamente con [[flash-attention]] su full attention, o sono complementari?
- Il merger MLP che raggruppa 4 patch è una compressione fissa: serve adattare il fattore di merge a immagini ad alta risoluzione o documenti densi?
- Rejection sampling per CoT visivo: come si valida quantitativamente che l'intermediate reasoning *usi* i visual cue invece di ignorarli? Il paper menziona "rule-based + model-driven" filtering ma non riporta metriche.
- Curriculum dati: non c'è una tabella di ablation sui contributi di interleaved data / OCR / document / agent. Quanto pesa ciascun ingrediente?
- Per il flagship 72B serve un confronto open vs closed (Claude 3.7, GPT-4.5, Gemini 2.0/2.5) — il report usa Claude 3.5 Sonnet (giugno 2024) e GPT-4o-0513, ormai entrambi datati.

## Concetti citati

- [[vision-transformer]], [[vision-language-model]], [[multimodal-large-language-model]], [[video-llm]]
- [[mrope]] (estesa a time-aligned), 2D-RoPE (per il ViT)
- window attention, [[flash-attention]] (per confronto)
- [[siglip]] / [[clip]] (CLIP pretraining è una delle stage del ViT)
- [[chain-of-thought]] (rejection sampling)
- [[direct-preference-optimization]], [[instruction-tuning]] (ChatML), SFT
- [[video-mme]], [[mvbench]], [[egoschema]], [[lvbench]], [[mlvu]], [[longvideobench]] (benchmark video)
- [[qwen3-vl-2025-tech-report]] (successore della famiglia)

### Nuovi slug di concetto suggeriti (non creati qui)

- `qwen2-5-vl` — il modello stesso, da promuovere a pagina di concetto se viene linkato da altri source.
- `qwen` — famiglia di LLM Alibaba (Qwen2.5 / Qwen3 LLM backbone).
- `qwen2-vl` — predecessore, già implicitamente richiamato come `[[qwen2-vl|Qwen2-VL]]` in qwen3-vl-2025-tech-report.
- `window-attention` — pattern attentivo a finestra usato nel ViT.
- `dynamic-resolution` / `dynamic-fps-sampling` — strategie di input handling.
- `qwenvl-html-format` — formato unificato document parsing introdotto qui.
- `screenspot`, `screenspot-pro`, `androidworld`, `osworld`, `android-control` — benchmark GUI agent.
- `docvqa`, `chartqa`, `infovqa`, `textvqa`, `ai2d`, `ocrbench`, `ocrbench-v2`, `mathvista`, `mmmu`, `mmbench`, `mmstar`, `realworldqa`, `mmvet`, `chartxiv`, `omnidocbench`, `cc-ocr` — benchmark immagine/documento.
- `video-mmmu`, `mmvu`, `mmbench-video`, `tempcompass`, `charades-sta`, `perceptiontest` — benchmark video aggiuntivi.
- `rejection-sampling` — tecnica post-training per CoT.
- `qwen2-vl-instag` — classificatore gerarchico interno per data filtering.

## Direct quotes

> "Qwen2.5-VL achieves a major leap forward in understanding and interacting with the world through enhanced visual recognition, precise object localization, robust document parsing, and long-video comprehension." (§Abstract, p. 1)

> "By training a native dynamic-resolution Vision Transformer (ViT) from scratch and incorporating Window Attention, we have significantly reduced computational overhead while maintaining native resolution." (§Abstract, p. 1)

> "We implement window attention in the visual encoder to optimize inference efficiency; (2) We introduce dynamic FPS sampling, extending dynamic resolution to the temporal dimension; (3) We upgrade MRoPE in the temporal domain by aligning to absolute time; (4) … further scaling the pre-training corpus from 1.2 trillion tokens to 4.1 trillion tokens." (§1 Introduction, p. 2)

> "only four layers employ full self-attention, while the remaining layers utilize windowed attention with a maximum window size of 112×112 (corresponding to 8×8 patches). Regions smaller than 112×112 are processed without padding, preserving their original resolution." (§2.1.1, p. 4)

> "by leveraging the intervals between temporal IDs, the model is able to learn consistent temporal alignment across videos with different FPS sampling rates." (§2.1.3, p. 5)

> "we capped the maximum number of frames analyzed per video at 768, with the total number of video tokens not exceeding 24,576." (§3.3.4, p. 14)
