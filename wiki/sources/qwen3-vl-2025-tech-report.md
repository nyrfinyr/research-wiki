---
title: "Qwen Team (2025) — Qwen3-VL Technical Report"
type: source
tags: [vision-language-model, video-llm, qwen, mixture-of-experts, long-context, mrope, deepstack, siglip, instruction-tuning, dpo, reinforcement-learning, multimodal]
created: 2026-05-15
updated: 2026-05-15
source_path: raw/papers/qwen3-vl-2025-tech-report.pdf
source_kind: paper
source_date: 2025-12-01
doi: 10.48550/arXiv.2511.21631
zotero_key: TWTBTSPP
venue: technical report (arXiv 2511.21631v2)
authors: [Qwen Team, Shuai Bai, Yuxuan Cai, Ruizhe Chen, Keqin Chen, Xionghui Chen, Zesen Cheng, Lianghao Deng, Wei Ding, Chang Gao, Chunjiang Ge, Wenbin Ge, Zhifang Guo, Qidong Huang, Jie Huang, Fei Huang, Binyuan Hui, Shutong Jiang, Zhaohai Li, Mingsheng Li, Mei Li, Kaixin Li, Zicheng Lin, Junyang Lin, Xuejing Liu, Jiawei Liu, Chenglong Liu, Yang Liu, Dayiheng Liu, Shixuan Liu, Dunjie Lu, Ruilin Luo, Chenxu Lv, Rui Men, Lingchen Meng, Xuancheng Ren, Xingzhang Ren, Sibo Song, Yuchong Sun, Jun Tang, Jianhong Tu, Jianqiang Wan, Peng Wang, Pengfei Wang, Qiuyue Wang, Yuxuan Wang, Tianbao Xie, Yiheng Xu, Haiyang Xu, Jin Xu, Zhibo Yang, Mingkun Yang, Jianxin Yang, An Yang, Bowen Yu, Fei Zhang, Hang Zhang, Xi Zhang, Bo Zheng, Humen Zhong, Jingren Zhou, Fan Zhou, Jing Zhou, Yuanzhi Zhu, Ke Zhu]
year: 2025
---

# Qwen Team (2025) — Qwen3-VL Technical Report

## TL;DR

Qwen3-VL is the version 3 of Alibaba's vision-language model family: 4 dense variants (**2B / 4B / 8B / 32B**) + 2 MoE (**30B-A3B** and **235B-A22B**), all with a native **256K-token** context window that interleaves text + image + video. Three architectural upgrades over [[qwen2-5-vl|Qwen2.5-VL]]: (1) **Interleaved MRoPE**, which redistributes temporal/height/width dimensions across the entire frequency spectrum to avoid the *spectral bias* of chunked MRoPE; (2) **DeepStack**, which injects features from 3 intermediate ViT layers into as many LLM layers via residual connections, without lengthening the context; (3) **textual timestamp tokens** (`<3.0 seconds>`) in place of Qwen2.5-VL's absolute-time-aligned T-RoPE. Pre-training in 4 stages (alignment merger → multimodal pretrain 8K → long-context 32K → ultra-long 256K) for ~2.2T total tokens; post-training in three phases (SFT on 1.2M samples with a 32K then 256K phase → text-only strong-to-weak distillation → RL with SAPO) and "instruct" and "thinking" variants. Square-root re-weighting to balance text vs multimodal loss. SOTA or competitive vs Gemini 2.5 Pro / GPT-5 / Claude Opus 4.1 on STEM, OCR, document understanding, video understanding (especially long video), 2D/3D grounding, GUI agents [source: raw/papers/qwen3-vl-2025-tech-report.pdf §1, §2].

## Main contribution

- **Interleaved MRoPE**: the original MRoPE in [[qwen2-vl|Qwen2-VL]] partitions embedding dimensions into temporal/height/width chunks with distinct frequencies, creating a *spectral imbalance* that degrades long-video understanding. Qwen3-VL distributes t,h,w *interleaved* across the full frequency spectrum (low + high) along each axis [source: raw/papers/qwen3-vl-2025-tech-report.pdf §2.1].
- **DeepStack** applied to the ViT: visual tokens from 3 intermediate vision-encoder layers are projected with dedicated mergers and *added* to the hidden states of the first 3 LLM layers. Increases vision-language alignment and preserves low/high-level features without extending the context [source: raw/papers/qwen3-vl-2025-tech-report.pdf §2.2].
- **Text-based timestamps**: instead of T-RoPE, which ties temporal IDs to absolute time (with huge sparse IDs on long video), Qwen3-VL prefixes each temporal patch with a formatted textual timestamp (in `seconds` or `HMS`). Resolves two limitations of Qwen2.5-VL: temporal-ID sparsity and the need for uniform sampling across different fps [source: raw/papers/qwen3-vl-2025-tech-report.pdf §2.3].
- **Square-root reweighting**: per-token loss normalized by `sqrt` instead of per-sample, balances text and multimodal during training; no loss of text-only capability [source: raw/papers/qwen3-vl-2025-tech-report.pdf abstract, §1].
- **Thinking / non-thinking bifurcation**: two post-trained variants, the thinking one explicitly uses extended CoT with contexts up to 81,920 tokens on tasks such as AIME-25 / HMMT-25 / LiveCodeBench [source: raw/papers/qwen3-vl-2025-tech-report.pdf §5.11].
- **Multilingual OCR**: from 10 languages (Qwen2.5-VL) to **39 languages** with >70% accuracy on 32/39 [source: raw/papers/qwen3-vl-2025-tech-report.pdf §5.4, Fig. 2].

## Method

### Architecture

Three modules (as in Qwen2.5-VL) [source: raw/papers/qwen3-vl-2025-tech-report.pdf §2]:

1. **Vision encoder** = [[siglip|SigLIP-2]] (`SigLIP2-SO-400M` by default; `SigLIP2-Large 300M` for the 2B/4B variants), initialized from the official checkpoints and fine-tuned with dynamic resolution. Uses 2D-RoPE with absolute position-embedding interpolation (following CoMP).
2. **MLP-based vision-language merger**: two-layer MLP that compresses `2×2` ViT features into a single visual token. Also includes *dedicated mergers* for the DeepStack path (one per each of the 3 sampled ViT layers).
3. **LLM backbone** = [[qwen|Qwen3]] (Yang et al., 2025a). The variants:

| Variant | Type | Total params | Active / token |
|---|---|---|---|
| Qwen3-VL-2B | dense | 2 B | 2 B |
| Qwen3-VL-4B | dense | 4 B | 4 B |
| Qwen3-VL-8B | dense | 8 B | 8 B |
| Qwen3-VL-32B | dense | 32 B | 32 B |
| Qwen3-VL-30B-A3B | MoE | 30 B | 3 B |
| Qwen3-VL-235B-A22B | MoE | 235 B | 22 B |

All trained with **256K** context. The 235B-A22B flagship "outperforms most VLMs across a broad set of multimodal tasks and surpasses its text-only counterpart on the majority of language benchmarks" [source: raw/papers/qwen3-vl-2025-tech-report.pdf §2, p. 2].

### Interleaved MRoPE

In chunked MRoPE (Qwen2-VL/2.5-VL), embedding dimensions were divided into three blocks (t, h, w), each with a different range of rotary frequencies → spectral bias: the "t" dimension only covers certain frequencies, degrading long-video performance [source: raw/papers/qwen3-vl-2025-tech-report.pdf §2.1]. Qwen3-VL redistributes t/h/w *interleaved* along the embedding so that **each axis covers both low and high frequencies** → mitigates the spectral bias and improves video positional modeling.

### DeepStack

Adaptation of the DeepStack paper (Meng et al., 2024) to the ViT: features are sampled from 3 SigLIP-2 layers; three dedicated mergers project them into the LLM space; the resulting visual tokens are **added as residuals to the first 3 LLM layers** [source: raw/papers/qwen3-vl-2025-tech-report.pdf §2.2]. Benefits: preserves low-level info (texture, edges) alongside high-level features; no context-length increase.

### Video Timestamps

Diagnosed limitations of T-RoPE (Qwen2.5-VL):
1. Temporal position IDs too large/sparse for long videos → long-temporal-context degradation.
2. Requires uniform sampling across many fps, expensive to construct.

Qwen3-VL solution: before each temporal patch, insert a **textual timestamp token** formatted as `<3.0 seconds>`. Trained on two formats (sec and `HH:MM:SS`) to learn both representations. Cost: slight context-length increase [source: raw/papers/qwen3-vl-2025-tech-report.pdf §2.3].

### Pre-training (4 stages, ~2.2T total tokens)

| Stage | Goal | Trainable | Token budget | Sequence length |
|---|---|---|---|---|
| S0 | Vision-Language Alignment | merger only | 67 B | 8 192 |
| S1 | Multimodal Pre-Training (full) | all | ~1 T | 8 192 |
| S2 | Long-Context Pre-Training | all | ~1 T | 32 768 |
| S3 | Ultra-Long-Context Adaptation | all | 100 B | 262 144 |

Data curriculum (§3.2):
- **Image caption + interleaved**: re-captioning with Qwen2.5-VL-32B fine-tuned for recaptioning; semantic deduplication; clustering for coverage. Book-scale interleaved up to 256K tokens using a Qwen2.5-VL-7B parser.
- **Knowledge**: importance-weighted long-tail entity sampling.
- **OCR and document parsing**: 30M in-house OCR samples + 29 additional synthesized languages; 3M PDFs from Common Crawl + 4M internal; `QwenVL-HTML` (with element-level bboxes) and `QwenVL-Markdown` (with LaTeX tables) formats.
- **Grounding & counting**: normalized coordinates `[0, 1000]` (change from Qwen2.5-VL which used native coordinates). Bounding box + point-based grounding.
- **Spatial / 3D**: 9-DoF JSON bounding boxes, unified via Omni3D in a virtual camera coordinate system.
- **Code**: text-only Qwen3-Coder corpus + multimodal (UI→HTML/CSS, image→SVG, flowchart→code).
- **Video**: short-to-long dense caption, spatio-temporal video grounding, length-adaptive sampling (variable fps and max frames per stage).
- **STEM**: 1M point-grounding + 2M perception VQA + 6M annotated diagram captions + 60M K-12/undergrad exercises + 12M long-CoT multimodal samples.
- **Agent (GUI / function calling / search)**: multi-step traces on desktop/mobile/web with CoT augmentation.

### Post-training (3 phases)

1. **SFT** (§4.2.1): ~1.2M-sample dataset (1/3 text-only, 2/3 multimodal). Two-phase strategy: 1 epoch at 32K seq → 1 epoch at 256K seq with 256K/32K interleaved curriculum. Long context includes technical documents of hundreds of pages, books, videos up to 2 hours. Query filtering + response filtering (rule-based + reward model based on the Qwen2.5-VL series).
   - **Long-CoT cold start** (§4.2.2): ~1:1 VL/text, focus on STEM and agentic. "Multimodal Necessity" filter: discards samples Qwen3-30B-nothink solves without the image.
2. **Strong-to-Weak Distillation** (§4.3): off-policy (teacher → student response distillation) + on-policy (student response, KL alignment with teacher logits). Performed **only on text-only data**, but improves multimodal performance too.
3. **Reinforcement Learning** (§4.4):
   - **Reasoning RL**: ~30K verifiable queries (math, code, logic, visual grounding, visual puzzle), pass-rate>90% filter, algorithm **SAPO** (Smooth and Adaptive Policy Optimization, Gao et al., 2025).
   - **General RL**: multi-task for instruction following + preference alignment. Hybrid reward, rule-based + Qwen2.5-VL-72B / Qwen3 as judge model.
   - **Thinking with Images** (§4.5): 2 stages of SFT + multi-turn tool-integrated RL on agent traces, three reward signals (answer accuracy, multi-turn reasoning, scaled tool-calling target).

### Infrastructure

Trained on Alibaba PAI-Lingjun via Megatron-LM with TP+PP+CP+EP+ZeRO-1 DP up to 10,000 GPUs. Inference with vLLM (PagedAttention) or SGLang [source: raw/papers/qwen3-vl-2025-tech-report.pdf §4.6].

## Key results

### Flagship: Qwen3-VL-235B-A22B vs frontier closed-source (§5, Tab. 2)

All scores are "thinking" for Qwen3-VL-235B-A22B. `+` denotes tool use.

| Benchmark | **Qwen3-VL 235B thinking** | Qwen3-VL 235B instruct | Gemini 2.5 Pro (thinking) | GPT-5 high | Claude Opus 4.1 (thinking) |
|---|---|---|---|---|---|
| MMMU | 80.6 | 78.7 | 81.7 | **84.2** | 78.4 |
| MMMU-Pro | 69.3 | 68.1 | 68.8 | **78.4** | 64.8 |
| MathVista mini | **85.8** | 84.9 | 82.7 | 81.3 | 75.5 |
| MathVision | **74.6** | 66.5 | 73.3 | 70.9 | 64.3 |
| MathVerse mini | **85.0** | 72.5 | 82.9 | 84.1 | 70.6 |
| ZeroBench | **4** | 2 | 3 | 2 | 3 |
| LogicVista | **72.2** | 65.8 | 72.0 | 71.8 | 67.3 |
| VisuLogic | **34.4** | 29.9 | 31.6 | 28.5 | 27.9 |
| MMBench-EN | 88.8 | 89.3 | **90.1** | 83.8 | 79.4 |
| RealWorldQA | **81.3** | 79.2 | 78.0 | 82.8 | 69.9 |
| MMStar | 78.7 | 78.4 | 77.5 | 76.4 | 72.1 |
| HallusionBench | **66.7** | 63.2 | 63.7 | 65.7 | 60.4 |
| MIA-Bench | **92.7** | 91.3 | 92.3 | 92.4 | 91.2 |
| DocVQA test | 96.5 | **97.1** | 92.6 | 91.5 | 92.5 |
| InfoVQA test | **89.5** | 89.2 | 84.2 | 79.0 | 69.4 |
| AI2D w. M. | 89.2 | 89.7 | 90.9 | 89.7 | 86.4 |
| ChartQA test | 90.3 | 90.3 | 83.3 | 59.7 | 86.2 |
| OCRBench | 875 | **920** | 866 | 810 | 764 |
| OCRBench_v2 en | 66.8 | **67.1** | 54.3 | 53.0 | 48.4 |
| OmniDocBench en (↓) | 0.155 | **0.143** | 0.347 | 0.356 | 0.194 |
| MMLongBenchDoc | 56.2 | **57.0** | 55.6 | 51.5 | 54.5 |
| RefCOCO avg | **92.1** | 91.9 | 74.6 | 66.8 | – |
| CountBench | **93.7** | 93.0 | 91.0 | 91.7 | 93.1 |
| ODinW-13 | 43.2 | **48.6** | 33.7 | – | – |
| BLINK | 67.1 | **70.7** | 70.6 | 71.0 | 64.1 |
| MuirBench | **80.1** | 73.0 | 77.2 | 77.5 | – |
| MVBench | 75.2 | 76.5 | 69.9 | 75.3 | 61.4 |
| Video-MME w/o sub | 79.0 | 79.2 | **85.1** | 84.7 | 75.6 |
| MLVU M-Avg | 83.8 | 84.3 | 85.6 | **86.2** | 73.5 |
| LVBench | 63.6 | 67.7 | **73.0** | – | – |
| Charades-STA mIoU | 63.5 | **64.8** | – | – | – |
| VideoMMMU | 80.0 | 74.7 | 83.6 | **84.6** | 76.2 |
| MMVU | 71.1 | 68.1 | **74.9** | 73.0 | 66.4 |
| VSI-Bench | 60.0 | **62.7** | – | – | – |
| ScreenSpot Pro | 61.8 | 62.0 | – | – | – |
| OSWorld | 38.1 | 31.6 | – | – | – |

Salient notes (§5):
- **Long video**: Qwen3-VL-235B-A22B-Instruct on MLVU "attains or even surpasses Gemini-2.5-Pro" [§5.9].
- **Hallucination**: the thinking variant surpasses Gemini-2.5-Pro/GPT-5/Claude Opus 4.1 by 3.0 / 1.0 / 6.3 points respectively on HallusionBench [§5.3].
- **MIA-Bench**: on the "math" and "textual" subtasks Qwen3-VL-Thinking beats GPT-5-high by +10.0 and +5.0 points [§5.3].

### Medium models (§5, Tab. 3): Qwen3-VL-30B-A3B / 32B

Selection (instruct numbers; "thinking" similar or slightly higher):

| Benchmark | Qwen3-VL-30B-A3B inst | Qwen3-VL-32B inst | Gemini 2.5 Flash | GPT-5 mini |
|---|---|---|---|---|
| MMMU | 74.2 | 76.0 | 76.3 | **79.0** |
| MathVista mini | 80.1 | 83.8 | 75.3 | 79.1 |
| MathVision | 60.2 | 63.4 | 60.7 | **71.9** |
| MMBench-EN | 86.1 | 87.6 | 86.6 | 86.6 |
| RealWorldQA | 73.7 | 79.0 | 75.7 | **79.0** |
| DocVQA test | 95.0 | 96.9 | 93.0 | 90.5 |
| OCRBench | 903 | **895** | 864 | 821 |
| OCRBench_v2 en | 63.2 | 67.4 | 50.6 | 52.6 |
| MMLongBenchDoc | 47.1 | **55.4** | 44.6 | 50.3 |
| RefCOCO avg | 89.7 | 91.9 | – | – |
| Video-MME w/o sub | 74.5 | 76.6 | 75.6 | **78.9** |
| LVBench | 62.5 | 63.8 | 62.2 | – |
| VideoMMMU | 68.7 | 71.9 | 65.2 | **82.5** |
| OSWorld | 30.3 | **32.6** | – | – |
| AndroidWorld | 54.3 | 57.3 | – | – |

Highlight: Qwen3-VL-32B Instruct surpasses (on many benchmarks) the **previous** Qwen2.5-VL-72B → "the medium-sized Qwen3-VL model has already surpassed it on reasoning tasks" [§5.2].

### Small models (§5, Tab. 4): 2B / 4B / 8B

| Benchmark | Qwen3-VL-2B inst | Qwen3-VL-4B inst | Qwen3-VL-8B inst | GPT-5 nano high |
|---|---|---|---|---|
| MMMU | 53.4 | 67.4 | 69.6 | **75.8** |
| MathVista mini | 61.3 | 73.7 | 77.2 | 71.5 |
| MMBench-EN | 78.4 | 83.9 | **84.5** | 78.4 |
| MMStar | 58.3 | 69.8 | **70.9** | 68.6 |
| DocVQA test | 93.3 | 95.3 | **96.1** | 88.2 |
| OCRBench | 858 | 881 | **896** | 753 |
| Video-MME w/o sub | 61.9 | 69.3 | **71.4** | 66.2 |
| LVBench | 47.4 | 56.2 | **58.0** | – |
| VideoMMMU | 41.9 | 56.2 | **65.3** | 63.0 |

The 8B reaches the **Qwen2.5-VL-72B** tier on many video benchmarks thanks to interleaved MRoPE + textual timestamps + dense-caption scaling [§5.9].

### Text-only (§5.11, Tab. 5)

Qwen3-VL-235B-A22B Instruct vs pure LLMs:

| Benchmark | Qwen3-VL-235B-A22B Inst | Qwen3-235B-A22B-Inst-2507 | DeepSeek V3 0324 | Claude Opus 4 (no think) |
|---|---|---|---|---|
| MMLU-Pro | 81.8 | 83.0 | 81.2 | **86.6** |
| GPQA | 74.3 | **77.5** | 68.4 | 74.9 |
| AIME-25 | **74.7** | 70.3 | 46.6 | 33.9 |
| HMMT-25 | **57.4** | 55.4 | 27.5 | 15.9 |
| LiveCodeBench v6 | **54.3** | 51.8 | 45.2 | 44.6 |
| Arena-Hard V2 (winrate) | 77.4 | **79.2** | 45.6 | 51.5 |
| MultiIF | 76.3 | **77.5** | 66.5 | – |
| PolyMATH | 45.1 | **50.2** | 32.2 | 30.0 |

Implication: the vision-language model is now *complementary* to the pure-LLM Qwen3, not a downgrade — a key result of square-root reweighting.

### What changes vs Qwen2.5-VL

- **Interleaved MRoPE** instead of chunked MRoPE → +long-video.
- **DeepStack injection** instead of a single merger → +alignment, multi-level info.
- **Text-based timestamp tokens** instead of absolute-time T-RoPE → +temporal grounding.
- **Square-root reweighting** of the loss → balances text/multimodal without catastrophic forgetting.
- **256K context** vs Qwen2.5-VL's max ~32K → native long-doc + long-video.
- **MoE variants** (30B-A3B, 235B-A22B) newly introduced.
- **39 OCR languages** vs 10 in Qwen2.5-VL.
- **Native 3D grounding** with 9-DoF bbox, mAP@0.15 on Omni3D (ARKitScenes, Hypersim, SUN RGB-D).
- **Thinking/non-thinking bifurcation** with distinct SFT.

## Stated limitations

The report has no explicit "Limitations" section. Limitations implied by the text:

- fps/frame-cap comparison *not* fully fair: API limitations on Gemini 2.5 Pro (512 frames), GPT-5 (256), Claude Opus 4.1 (100) vs Qwen3-VL up to 2,048 frames; the long-video advantage is partly an artifact of the number of frames [§5.9].
- For Charades-STA sampling is 4 fps; for other video benchmarks 2 fps — the effective window is always limited by `total tokens ≤ 224K` with `max tokens per frame 640-768`.
- Tool use ("Perception with Tool") adds ~5 points on V*/HRBench: "the absolute improvement by adding tools is consistently ~5 points" [§5.6], suggesting that pure architectural uplift is stagnating without tools.

## Open questions / critiques

- How much of the jump vs Qwen2.5-VL comes from architecture (interleaved MRoPE + DeepStack + textual timestamp) vs the backbone (Qwen3 vs Qwen2.5) + scale (256K vs 32K context) + data ridge? The report offers no isolated ablations (e.g. Qwen3 LLM + Qwen2.5-VL architecture).
- Square-root reweighting is described but not quantified: no ablation with/without, no text↔multimodal trade-off curve.
- "Thinking with images" does not report numerical latency / token cost for multi-turn tool-calling RL: the practical inference overhead is obscure.
- No empirical analysis of the original MRoPE's "spectral imbalance" (frequency response plots): the justification for interleaved MRoPE is based on "subsequent studies" cited but not reproduced in-paper [§2.1].
- Open weights: the GitHub exists (`QwenLM/Qwen3-VL`) but the weights license is not stated in the report.

## Cited concepts

- [[vision-language-model]], [[video-llm]], [[multimodal-large-language-model]]
- [[qwen]], [[qwen2-vl]], [[qwen2-5-vl]], [[qwen3]]
- [[mrope]], [[interleaved-mrope]], [[t-rope]], [[rotary-position-embedding]], [[positional-encoding]]
- [[deepstack]] (multi-level vision-encoder fusion)
- [[siglip]] (SigLIP-2, encoder)
- [[mixture-of-experts]] (variants 30B-A3B, 235B-A22B)
- [[long-context]], [[context-length]]
- [[instruction-tuning]], [[supervised-fine-tuning]], [[chain-of-thought]], [[strong-to-weak-distillation]]
- [[reinforcement-learning]], [[sapo]] (Smooth and Adaptive Policy Optimization)
- [[direct-preference-optimization]] (background)
- [[textual-timestamp-tokens]]
- [[gui-agent]], [[function-calling]], [[thinking-with-images]]
- [[grounding]], [[3d-grounding]], [[omni3d]], [[refcoco]], [[countbench]]
- [[ocrbench]], [[ocrbench-v2]], [[docvqa]], [[infovqa]], [[chartqa]], [[ai2d]], [[charxiv]], [[mmlongbenchdoc]], [[omnidocbench]], [[cc-ocr]]
- [[mmmu]], [[mmmu-pro]], [[mathvista]], [[mathvision]], [[mathverse]], [[we-math]], [[dynamath]], [[zerobench]], [[logicvista]], [[visulogic]], [[visualpuzzles]]
- [[video-mme]], [[mvbench]], [[mlvu]], [[lvbench]], [[charades-sta]], [[video-mmmu]], [[mmvu]]
- [[blink]], [[muirbench]]
- [[screenspot]], [[osworld]], [[androidworld]]
- [[v-star]], [[hrbench]]
- [[megatron-lm]], [[vllm]], [[sglang]]

## Direct quotes

> "We introduce Qwen3-VL, the most capable vision–language model in the Qwen series to date […] It natively supports interleaved contexts of up to 256K tokens, seamlessly integrating text, images, and video." (Abstract, p. 1)

> "Chunking the embedding dimensions into temporal (t), horizontal (h), and vertical (w) groups induces an imbalanced frequency spectrum and hampers long-video understanding. We therefore adopt an interleaved MRoPE that distributes t, h, and w uniformly across low- and high-frequency bands." (§1, p. 2)

> "By tying temporal position IDs directly to absolute time, [T-RoPE] produces excessively large and sparse temporal position ids for long videos, degrading the model's ability to understand long temporal contexts." (§2.3, p. 4)

> "We perform this distillation using text-only data to fine-tune the LLM backbone. This method proves highly effective, yielding significant improvements in reasoning abilities across both text-centric and multimodal tasks." (§4.1, p. 9)
