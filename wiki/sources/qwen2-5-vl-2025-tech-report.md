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

Qwen2.5-VL is the 2.5 release of Alibaba's [[vision-language-model|vision-language model]] family, shipped in three open-weight sizes (**3B / 7B / 72B**) and trained on roughly **4.1 T tokens** (vs 1.2 T for Qwen2-VL). Four main technical contributions over its predecessor Qwen2-VL: (1) **redesigned vision encoder** — a 675 M [[vision-transformer|ViT]] (32 layers, hidden 1280) trained *from scratch* with **window attention** in 28 of 32 layers (full attention only in layers {7, 15, 23, 31}, window size 112×112) to reduce complexity from quadratic to linear; (2) **dynamic FPS sampling** that extends dynamic resolution to the temporal axis, enabling videos up to hours long (up to 768 frames and ≤24 576 visual tokens); (3) **MRoPE aligned with absolute time** — the temporal ID in [[mrope]] is no longer tied to frame index but to real timestamp, enabling second-level temporal grounding on Charades-STA (mIoU 50.9, beating GPT-4o at 35.7); (4) **MLP-based vision-language merger** that groups 4 adjacent ViT patches before projecting them into the LLM space. The flagship 72B "matches state-of-the-art models like GPT-4o and Claude 3.5 Sonnet, particularly excelling in document and diagram understanding" [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf abstract]. It positions the Qwen-VL line between Qwen2-VL (2024) and [[qwen3-vl-2025-tech-report|Qwen3-VL]] (December 2025, MoE + interleaved MRoPE + DeepStack).

## Main contribution

- **Native dynamic-resolution window-attention ViT**: 32-layer ViT in which only 4 layers do full self-attention, the other 28 use 112×112 window attention (8×8 patches of 14×14). Regions smaller than the window are processed *without padding*, preserving the native resolution. Result: linear cost in the number of patches, low latency even on high-resolution input [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.1.1].
- **Dynamic FPS sampling + temporal dynamic resolution**: the ViT groups **two consecutive frames** as a 3D temporal unit, halving the visual tokens. During training the FPS is sampled dynamically to cover a wide distribution of video speeds. Enables handling of videos up to hours long [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.1.2, §2.2.1].
- **Time-aligned MRoPE (T-RoPE)**: the temporal ID of MRoPE is **anchored to the absolute video clock** instead of the frame index. Lets the model learn "the pace of time through the intervals between temporal dimension IDs" without computational overhead [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.1.3]. → Limitation later overcome by Qwen3-VL (textual timestamp tokens).
- **4.1T-token pretraining in three phases**: ViT-only (1.5T), full multimodal (2T), long-context 32K (0.6T). Scale length from 8 192 to 32 768 in the third phase [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.2.2, Table 2].
- **QwenVL HTML format for document parsing**: a unified HTML format with custom tags (`<table>`, `<div class="chart">`, `<div class="music sheet">`, `<div class="chemical formula">`, etc.) that inserts bounding boxes (`data-bbox="x1 y1 x2 y2"`) for *every* element. Replaces modular layout+OCR+chart+illustrations pipelines with a single generalist model [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.2.1, p. 6-7].
- **Bounding box and point grounding in absolute coordinates** (not normalized), trained on over 10,000 open-vocabulary categories, with copy-paste augmentation and syn data via Grounding-DINO + SAM [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.2.1, p. 6].
- **Two-phase post-training (SFT + DPO)** with frozen ViT; SFT on ~2 M examples (50% pure text, 50% multimodal) followed by **rejection sampling** to improve [[chain-of-thought|CoT]] on reasoning tasks [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.3].

## Method

### Overall architecture

Three modules (Fig. 1) [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.1]:

1. **Vision encoder** — redesigned ViT with 2D-RoPE, window attention, RMSNorm and SwiGLU (aligned with LLM design choices). Patch size 14, input resized to multiples of 28.
2. **MLP-based vision-language merger** — groups 4 spatially adjacent patches, concatenates them and projects through 2 MLP layers to the LLM dimension. Explicit compression of visual tokens.
3. **LLM backbone** — pretrained [[qwen|Qwen2.5]] LLM, with 1D-RoPE replaced by [[mrope|MRoPE]] aligned to absolute time.

### Configuration (Table 1, §2.1)

| Component | Qwen2.5-VL-3B | Qwen2.5-VL-7B | Qwen2.5-VL-72B |
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
| Embedding Tying | yes | no | no |
| Vocab Size | 151 646 | 151 646 | 151 646 |
| Trained Tokens | 4.1 T | 4.1 T | 4.1 T |

### Detailed vision encoder (§2.1.1)

- **Window attention**: 28 of 32 layers use a 112×112 window (= 8×8 patches of 14). Smaller regions are not padded.
- **Full attention** only in the 4 "stitch" layers {7, 15, 23, 31}.
- **2D-RoPE positional encoding** to capture spatial relations; **3D patch partitioning** for video (2 consecutive frames grouped as one unit).
- **RMSNorm + SwiGLU** to align design with LLMs.
- **Three-stage training**: CLIP-style pretraining → vision-language alignment → end-to-end fine-tuning. Dynamic sampling at native resolutions; aspect ratios preserved.

### Native dynamic resolution and dynamic FPS (§2.1.2)

- **Spatial**: no coordinate normalization; bounding boxes and points live in the actual input dimensions. The model intrinsically learns physical scale.
- **Temporal**: dynamic FPS sampling during training (uniform distribution over possible FPS). At inference time the maximum number of frames per video is 768 and total visual tokens ≤ 24 576 [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §3.3.4].

### MRoPE aligned to absolute time (§2.1.3)

- The Qwen2-VL MRoPE had three components (temporal, height, width). For text all three are equal (≡ 1D-RoPE); for images temporal is constant and h/w are spatial; for video temporal is incremented at each frame.
- **Problem in Qwen2-VL**: temporal IDs were tied to the frame index, not to the rate of scene change nor to real time.
- **Qwen2.5-VL solution**: temporal ID is proportional to **absolute time** (in seconds). Intervals between IDs represent the real pace. No extra tokens, no dedicated heads. → Improves temporal grounding and generalizes across different FPS.

### Pre-training data (§2.2.1)

Total dataset: **~4 T tokens** (vs 1.2 T for Qwen2-VL). Composition: image caption, interleaved image-text, OCR (multilingual: French, German, Italian, Spanish, Portuguese, Arabic, Russian, Japanese, Korean, Vietnamese + Chinese/English), document parsing in **QwenVL HTML**, knowledge (celebrity, landmark, flora, fauna), grounding (10,000+ categories, BBox + point), video (caption + temporal grounding in sec or `HH:MM:SS`+frame), agent data (mobile/web/desktop screenshots with UI grounding + multi-step trajectories from an Aguvis-like agent framework).

Scoring pipeline for interleaved data: 4 criteria (text-only quality, image-text relevance, image-text complementarity, info density balance). Document data synthesized with HTML structure and per-element bounding boxes (paragraphs, tables, charts, formulas, images, OCR-on-image, music sheet ABC notation, chemical formula SMILES) [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.2.1].

### Pre-training recipe (§2.2.2, Table 2)

| Stage | Visual Pre-Training | Multimodal Pre-Training | Long-Context Pre-Training |
|---|---|---|---|
| Data | Image Caption + Knowledge + OCR | + Pure text, Interleaved Data, VQA, Video, Grounding, Agent | + Long Video, Long Agent, Long Document |
| Tokens | 1.5 T | 2 T | 0.6 T |
| Sequence length | 8 192 | 8 192 | **32 768** |
| Training | ViT only | ViT + LLM | ViT + LLM |

ViT initialized from DataComp + internal datasets; LLM initialized from Qwen2.5. Dynamic sample packing to balance computational load across GPUs.

### Post-training (§2.3)

Two phases, **frozen ViT**:

1. **SFT** on ~2 M entries (50% pure text, 50% multimodal, ChatML format). Single- and multi-turn, single- and multi-image dialog. Specialized subsets: VQA, captioning, math, code, security, Doc/OCR, Grounding, Video, Agent.
2. **DPO** ([[dpo|Direct Preference Optimization]]) only on image-text and pure text; each sample processed only once.

**Two-stage data filtering pipeline**:

- **Stage 1**: hierarchical classification via Qwen2-VL-Instag into 8 domains × 30 sub-categories (e.g. Coding → Code_Debugging, Code_Generation, Code_Translation, Code_Understanding).
- **Stage 2**: rule-based filtering (anti-repetition, anti-truncation, anti-harm heuristics) + model-based filtering (multidimensional reward model over correctness, completeness, clarity, relevance, helpfulness, visual grounding accuracy).

**Rejection sampling** for [[chain-of-thought|CoT]] (math, code, domain VQA): generate with an intermediate checkpoint, validate against ground truth, discard outputs with code-switching, excessive length, repetitive patterns, or CoT that ignores/misinterprets visual info [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.3.3].

## Key results

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

OCRBench_v2 shows the sharpest gap: Qwen2.5-VL-72B beats Gemini 1.5 Pro by **+9.6 points (en)** and **+20.6 points (zh)** [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §3.3.2].

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

InternVL2.5-78B remains the RefCOCO leader; Qwen2.5-VL's advantage is **versatility** (BBox + point + count + open-vocabulary up to 10k+ classes) and the use of absolute coordinates.

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

**Key points**: Qwen2.5-VL-72B wins on LVBench (+14.2 vs Gemini 1.5 Pro, +16.5 vs GPT-4o), MLVU (+10), Charades-STA temporal grounding (+15.2 vs GPT-4o), MVBench, EgoSchema, TempCompass. Still behind Gemini 1.5 Pro on Video-MME and LongVideoBench. Across all video benchmarks: max 768 frames, max 24 576 visual tokens [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §3.3.4].

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

ScreenSpot Pro is the most dramatic jump: from 1.6 (Qwen2-VL) to 43.6 (Qwen2.5-VL), **+42 points**. OSWorld remains below Claude Computer Use.

### Pure text (Table 4, §3.2)

Qwen2.5-VL-72B preserves the language capabilities of base Qwen2.5-72B: MMLU-Pro 71.2 vs 71.1, MMLU-redux 85.9 vs 86.8, MATH 83.0 vs 83.1, HumanEval 87.8 vs 86.6, MultiPL-E **79.5 vs 75.1**, LiveBench-0831 **57.0 vs 52.3**, IFEval **86.3 vs 84.1**. There is therefore no text-only regression typical of multimodal extensions [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §3.2, Table 4].

## Stated limitations

The authors do not have an explicit "Limitations" section; limitations emerge diffusely:

- **Visual CoT is still an open problem**: intermediate reasoning steps can ignore or misinterpret visual cues. "achieving optimal modality alignment remains an ongoing challenge that requires further advancements" [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.3.3, p. 10].
- **OSWorld 8.83 vs Claude 14.90**: the gap on more realistic computer-use is not closed [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §3.3.5, Table 9].
- **Cap at 768 frames / 24 576 visual tokens** for video → truly long videos require sampling that can miss sub-second events [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §3.3.4].
- **Temporal IDs tied to absolute time** in T-RoPE: on very long videos the IDs become large/sparse, a problem later diagnosed and solved in [[qwen3-vl-2025-tech-report|Qwen3-VL]] with textual timestamp tokens [source: raw/papers/qwen3-vl-2025-tech-report.pdf §2.3, reported as a Qwen2.5-VL limitation].
- **HallBench 55.2** below Qwen2-VL-72B (58.1) and InternVL2.5-78B (57.4) → the data scale-up has a cost in hallucination [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §3.3.1, Table 3].
- **RealWorldQA**: still behind InternVL2.5 and Qwen2-VL.

## Open questions / critiques

- Is absolute-time-aligned T-RoPE truly the optimal design for long video, or do the textual timestamp tokens introduced by [[qwen3-vl-2025-tech-report|Qwen3-VL]] work better structurally? The Qwen3-VL report diagnoses both limits — it is worth re-reading the Qwen2.5-VL results in light of that diagnosis.
- How much of the long-video improvement comes from T-RoPE vs from the dataset (long-video captions synthesized via multi-frame pipeline)?
- Window attention on the 28 ViT layers: has it been explicitly compared with [[flash-attention]] on full attention, or are they complementary?
- The MLP merger that groups 4 patches is a fixed compression: does the merge factor need to adapt to high-resolution images or dense documents?
- Rejection sampling for visual CoT: how is it quantitatively validated that intermediate reasoning *uses* the visual cues rather than ignoring them? The paper mentions "rule-based + model-driven" filtering but does not report metrics.
- Data curriculum: no ablation table on the contributions of interleaved data / OCR / document / agent. How much does each ingredient weigh?
- For the flagship 72B an open vs closed comparison is needed (Claude 3.7, GPT-4.5, Gemini 2.0/2.5) — the report uses Claude 3.5 Sonnet (June 2024) and GPT-4o-0513, both now dated.

## Cited concepts

- [[vision-transformer]], [[vision-language-model]], [[multimodal-large-language-model]], [[video-llm]]
- [[mrope]] (extended to time-aligned), 2D-RoPE (for the ViT)
- window attention, [[flash-attention]] (for comparison)
- [[siglip]] / [[clip]] (CLIP pretraining is one of the ViT stages)
- [[chain-of-thought]] (rejection sampling)
- [[direct-preference-optimization]], [[instruction-tuning]] (ChatML), SFT
- [[video-mme]], [[mvbench]], [[egoschema]], [[lvbench]], [[mlvu]], [[longvideobench]] (video benchmarks)
- [[qwen3-vl-2025-tech-report]] (successor in the family)

### Suggested new concept slugs (not created here)

- `qwen2-5-vl` — the model itself, to be promoted to a concept page if linked from other sources.
- `qwen` — Alibaba LLM family (Qwen2.5 / Qwen3 LLM backbone).
- `qwen2-vl` — predecessor, already implicitly referenced as `[[qwen2-vl|Qwen2-VL]]` in qwen3-vl-2025-tech-report.
- `window-attention` — windowed attention pattern used in the ViT.
- `dynamic-resolution` / `dynamic-fps-sampling` — input handling strategies.
- `qwenvl-html-format` — unified document parsing format introduced here.
- `screenspot`, `screenspot-pro`, `androidworld`, `osworld`, `android-control` — GUI agent benchmarks.
- `docvqa`, `chartqa`, `infovqa`, `textvqa`, `ai2d`, `ocrbench`, `ocrbench-v2`, `mathvista`, `mmmu`, `mmbench`, `mmstar`, `realworldqa`, `mmvet`, `chartxiv`, `omnidocbench`, `cc-ocr` — image/document benchmarks.
- `video-mmmu`, `mmvu`, `mmbench-video`, `tempcompass`, `charades-sta`, `perceptiontest` — additional video benchmarks.
- `rejection-sampling` — post-training technique for CoT.
- `qwen2-vl-instag` — internal hierarchical classifier for data filtering.

## Direct quotes

> "Qwen2.5-VL achieves a major leap forward in understanding and interacting with the world through enhanced visual recognition, precise object localization, robust document parsing, and long-video comprehension." (§Abstract, p. 1)

> "By training a native dynamic-resolution Vision Transformer (ViT) from scratch and incorporating Window Attention, we have significantly reduced computational overhead while maintaining native resolution." (§Abstract, p. 1)

> "We implement window attention in the visual encoder to optimize inference efficiency; (2) We introduce dynamic FPS sampling, extending dynamic resolution to the temporal dimension; (3) We upgrade MRoPE in the temporal domain by aligning to absolute time; (4) … further scaling the pre-training corpus from 1.2 trillion tokens to 4.1 trillion tokens." (§1 Introduction, p. 2)

> "only four layers employ full self-attention, while the remaining layers utilize windowed attention with a maximum window size of 112×112 (corresponding to 8×8 patches). Regions smaller than 112×112 are processed without padding, preserving their original resolution." (§2.1.1, p. 4)

> "by leveraging the intervals between temporal IDs, the model is able to learn consistent temporal alignment across videos with different FPS sampling rates." (§2.1.3, p. 5)

> "we capped the maximum number of frames analyzed per video at 768, with the total number of video tokens not exceeding 24,576." (§3.3.4, p. 14)
