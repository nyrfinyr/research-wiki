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

VideoLLaMA 3 is a frontier MLLM (2B and 7B) developed by DAMO Academy / Alibaba for joint image and video understanding. The paper proposes a **vision-centric** training paradigm: instead of accumulating noisy video-text data, it starts from large high-quality image-text corpora to build a robust visual encoder, and trains video understanding at the tail end. Architecturally, two key novelties: (1) **Any-resolution Vision Tokenization (AVT)**, which adapts [[siglip]] with 2D-RoPE to accept images at any resolution while producing a variable number of vision tokens; (2) **Differential Frame Pruner (DiffFP)**, which removes temporally redundant video patches based on the 1-norm distance in pixel space. Training is organized in 4 stages (Vision Encoder Adaptation → Vision-Language Alignment → Multi-task Fine-tuning → Video-centric Fine-tuning) with a Qwen2.5 LLM backbone. Achieves SOTA on VideoMME, MLVU, LongVideoBench, LVBench, PerceptionTest, NextQA and on image benchmarks like InfoVQA, MathVista, MathVision [source: raw/papers/zhang-2025-videollama-3.pdf §1].

## Main contribution

- **Vision-centric paradigm**: image understanding scales better than image-text data, so the main axis is improving the visual encoder on high-quality images; video understanding is obtained as *transfer* from that foundation, with a single final video-dominated stage [source: raw/papers/zhang-2025-videollama-3.pdf §1].
- **Any-resolution Vision Tokenization (AVT)**: replaces the ViT's absolute positional embeddings with [[mrope|2D-RoPE]], allowing the vision encoder to process images of arbitrary shape and produce a number of tokens proportional to the resolution [source: raw/papers/zhang-2025-videollama-3.pdf §2.1].
- **Differential Frame Pruner (DiffFP)**: video compressor that removes redundant patches between consecutive frames based on the 1-norm distance in pixel space (threshold 0.1, inspired by RLT), shortening context length for long videos [source: raw/papers/zhang-2025-videollama-3.pdf §2.2].
- **VL3-Syn7M**: re-captioned dataset of 7M images from COYO-700M, cleaned with aspect-ratio + aesthetic-score + BLIP2/CLIP-similarity filter + KNN clustering, and re-captioned with InternVL2-8B (short) and InternVL2-26B (detailed) [source: raw/papers/zhang-2025-videollama-3.pdf §2.3].

## Method

### Architecture

Four components [source: raw/papers/zhang-2025-videollama-3.pdf §3]:

1. **Vision encoder**: initialized from [[siglip]] (`siglip-so400m-patch14-384`), adapted with 2D-RoPE to accept dynamic resolutions.
2. **Video compressor**: the DiffFP module that prunes redundant patches between consecutive frames.
3. **Projector**: two-layer MLP with GELU activation, maps visual features into the LLM space.
4. **LLM**: [[qwen|Qwen2.5]] — 2B (VideoLLaMA3-2B) or 7B (VideoLLaMA3-7B) variant.

### Any-resolution Vision Tokenization (AVT)

The ablation table (§4.4) compares CLIP-ViT-L/336, DFN5B-CLIP-H/378, and SigLIP-SO400M/384 at fixed resolution: SigLIP wins especially on fine-grained text-related tasks (ChartQA 22.4 vs 18.3/16.4; DocVQA 31.3 vs 24.9/23.1) [source: raw/papers/zhang-2025-videollama-3.pdf §4.4, Tab. 9]. Building on this, the ViT's absolute positional embeddings are replaced by 2D-RoPE (see [[positional-encoding]]) and the encoder is fine-tuned during stage 1 so that it generalizes to arbitrary resolutions and aspect ratios.

### Differential Frame Pruner (DiffFP)

Algorithm, inspired by RLT [source: raw/papers/zhang-2025-videollama-3.pdf §2.2]:

1. Compute the 1-norm distance between temporally consecutive patches in pixel space.
2. Patches with distance below the threshold (default `0.1`) are considered redundant and pruned from the next frame.
3. Also applies a bilinear `2×2` spatial downsample to bound the context length.

Applied in stages 3 and 4 (i.e. where video data is present).

### VL3-Syn7M construction pipeline

Starting from COYO-700M [source: raw/papers/zhang-2025-videollama-3.pdf §2.3]:

1. **Aspect Ratio Filtering** — removal of images with extreme ARs.
2. **Aesthetic Score Filtering** — threshold over an aesthetic scoring model.
3. **Text-Image Similarity** — BLIP2 generates initial captions, CLIP measures similarity, low-similarity items discarded.
4. **Visual Feature Clustering** — CLIP embedding + k-NN, samples balanced per cluster.
5. **Re-caption** — short captions with InternVL2-8B, detailed captions with InternVL2-26B → `VL3-Syn7M-short` and `VL3-Syn7M-detailed`.

### Training: four stages

Quantitative details (§3.2):

| Stage | Goal | Trainable | Data (M) | Composition |
|-------|-----------|------------------|----------|--------------|
| 1. Vision Encoder Adaptation | adapt SigLIP to dynamic resolutions | ViT + projector | 15.57 | scene image 11.84M, doc 2.80M, scene text 0.93M |
| 2. Vision-Language Alignment | integrate multimodal knowledge | all | 21.97 | scene 12.56M, doc 2.68M, scene text 4.69M, chart 0.04M, fine-grained 1.0M, text-only 6.25M |
| 3. Multi-task Fine-tuning | instruction tuning + intro video | all | 19.05 | image 14.92M (general/doc/chart/OCR/grounding/multi-image/text-only) + video 2.92M |
| 4. Video-centric Fine-tuning | video specialization | all | 5.71 | general video 3.03M, streaming 36.2K, temporal grounding 0.21M, image-only 0.88M, text-only 1.56M |

Hyperparameters (§3.3):
- Cosine LR scheduler, warmup ratio `0.03`.
- Max token length: **16384**; max vision token length: **10240** (expanded to 16K at video evaluation).
- Stage 1: LR ViT `1e-5`, projector `1e-3` (LLM frozen).
- Stages 2-4: LR LLM `1e-5`, projector `1e-5`, ViT `2e-6`.
- DiffFP threshold `0.1`, `2×2` spatial downsample.
- Video: **1 FPS** sampling with FFmpeg, up to **180 frames** (~3 minutes).
- VideoLLaMA3-7B initializes the encoder from the (already adapted) 2B and the LLM from Qwen2.5-7B.

### Data formats (§3.1)

Three formats [source: raw/papers/zhang-2025-videollama-3.pdf §3.1]:

- **Image sequence**: image tokens separated by `\n`.
- **Video sequence**: each frame preceded by `Time: xxs`, frames separated by `,`, final `\n` separator.
- **Streaming video sequence**: interleaved video+text, `Time:` for frames and `GPT:` for assistant replies.

## Key results

### Image benchmarks — VideoLLaMA3-2B vs 2B baselines (§4.1, Tab. 5)

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

### Image benchmarks — VideoLLaMA3-7B vs 7-8B baselines (§4.1, Tab. 6)

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

### What changes vs VideoLLaMA 2

VideoLLaMA2.1-7B is left behind by +11.3 points on VideoMME w/o sub, +15.6 on MLVU, +17.9 on PerceptionTest [source: raw/papers/zhang-2025-videollama-3.pdf §4.2 Tab. 8]. The difference is attributed to (i) the vision-centric paradigm (image-first recipe instead of video-heavy), (ii) AVT + dynamic resolution, (iii) DiffFP video compression, (iv) Qwen2.5 backbone (vs Mistral in v2).

## Stated limitations

[source: raw/papers/zhang-2025-videollama-3.pdf §6.2]

- **Video data quality and diversity** still limited — the bottleneck is no longer the model but video data.
- **Real-time processing** not optimized: high computational overhead on long/high-resolution videos, problematic for applications such as autonomous driving or live analytics.
- **Non-visual modalities** not explored: no native audio/speech support (in contrast to VideoLLaMA 2, which included an audio encoder).

Indicated future work: higher-quality video-text datasets, real-time inference optimizations, multimodal expansion (audio, speech), more sophisticated post-training RL (RLHF / DPO scaled to MLLMs).

## Open questions / critiques

- The vision-centric paradigm works here but there is no systematic study of the trade-off "more hours of video × how much better": image→video gains may saturate beyond a certain image-data scale. No ablation varying the amount of image data with fixed video data.
- DiffFP applies a fixed threshold (0.1) on the 1-norm in pixel space: for videos with noisy lighting/cinematography it could under-prune; for static videos (slideshow, talking head) it could over-prune. A threshold-sensitivity study is missing.
- 1 FPS + max 180 frames implies an effective ~3-minute cap per video; long-video benchmarks (LVBench, MLVU, LongVideoBench) cover hours — so downsampled frames are tested anyway. The context cap (16K vision tokens) is tight compared to Qwen2.5-VL (24K) and Qwen3-VL (256K total).
- No explicit mention of weight licensing: the GitHub repo exists but the paper does not specify commercial-use terms.

## Cited concepts

- [[video-llm]], [[vision-language-model]], [[multimodal-large-language-model]]
- [[vision-encoder]], [[siglip]], [[vision-transformer]] (ViT)
- [[mrope]] (used here as 2D-RoPE for images)
- [[positional-encoding]], [[rotary-position-embedding]]
- [[any-resolution-vision-tokenization]], [[dynamic-resolution]]
- [[differential-frame-pruner]], [[video-token-compression]]
- [[qwen]] (LLM backbone)
- [[instruction-tuning]], [[supervised-fine-tuning]]
- [[video-mme]], [[mvbench]], [[mlvu]], [[longvideobench]], [[lvbench]], [[egoschema]], [[perception-test]], [[next-qa]], [[charades-sta]], [[tempcompass]], [[activitynet-qa]]
- [[mmmu]], [[mmmu-pro]], [[blink]], [[realworldqa]], [[mathvista]], [[mathvision]], [[docvqa]], [[infovqa]], [[chartqa]], [[ocrbench]], [[ai2d]], [[gqa]], [[mme]]
- [[coyo-700m]], [[la-1b]], [[laion-ocr]], [[panda-70m]], [[ego4d]], [[videollama]] (v2)

## Direct quotes

> "The key insight of our vision-centric training paradigm is that high-quality image-text data is crucial for both image and video understanding. Instead of preparing massive video-text datasets, we focus on constructing large-scale, high-quality image-text datasets." (Abstract, p. 1)

> "AVT converts images or videos of any resolution into a set of 1-D token sequences, enabling compatibility with varying amounts of input images and videos of different resolutions… DiffFP eliminates video content with minimal differences between adjacent frames." (Fig. 3 caption, §2)

> "Despite the impressive performance of VideoLLaMA3, several limitations must be acknowledged. […] Video data often suffer from lower annotation quality and limited diversity." (§6.2, p. 23)
