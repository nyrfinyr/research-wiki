---
title: "Fu et al. (2025) — Video-MME: The First-Ever Comprehensive Evaluation Benchmark of Multi-modal LLMs in Video Analysis"
type: source
tags: [video-qa, benchmark, mllm, multimodal, long-video, subtitles, audio]
created: 2026-05-15
updated: 2026-05-15
source_path: raw/papers/fu-2025-video-mme.pdf
source_kind: paper
source_date: 2025-05-30
doi: 10.48550/arXiv.2405.21075
zotero_key: HUX79FUI
venue: arXiv preprint (CVPR 2025 community version)
authors: [Chaoyou Fu, Yuhan Dai, Yongdong Luo, Lei Li, Shuhuai Ren, Renrui Zhang, Zihan Wang, Chenyu Zhou, Yunhang Shen, Mengdan Zhang, Peixian Chen, Yanwei Li, Shaohui Lin, Sirui Zhao, Ke Li, Tong Xu, Xiawu Zheng, Enhong Chen, Caifeng Shan, Ran He, Xing Sun]
year: 2025
---

# Fu et al. (2025) — Video-MME: The First-Ever Comprehensive Evaluation Benchmark of Multi-modal LLMs in Video Analysis

## TL;DR

Video-MME is a "full-spectrum" video question-answering benchmark designed for [[multimodal-large-language-model]]: 900 videos manually curated from YouTube, 2,700 multiple-choice questions (3 per video, 4 options), balanced across three duration bands — short (<2 min), medium (4–15 min), long (30–60 min). The novelties relative to previous benchmarks are four: (1) video diversity (6 domains × 30 sub-categories), (2) wide temporal range (11 s – 1 h), (3) multimodal inputs (frames + subtitles + audio), (4) fully manual annotation by researchers with a vision-language background. On Video-MME, Gemini 1.5 Pro is the top closed-source model (75.0% frame-only, 81.3% with subtitles), while the best open-source one (VILA-1.5 34B) reaches only 59.0%; performance decreases monotonically with duration and adding subtitles/audio helps more on long videos [source: raw/papers/fu-2025-video-mme.pdf §1, §4.2, Tabs. 4–5].

## Main contribution

- First "full-spectrum" video-MLLM benchmark that jointly combines *domain diversity*, *11 s – 1 h duration range*, *multiple modalities* (visual + subtitles + audio) and *fully manual annotation* — features not jointly present in MVBench, EgoSchema, Video-Bench, ActivityNet-QA, TempCompass, etc. (Tab. 1).
- Empirical evidence that (i) model performance decays as video duration grows, (ii) subtitles and audio increase accuracy progressively with duration, (iii) the main bottleneck is *long-context modelling*.
- Side-by-side comparison of 13 video MLLMs, 3 image MLLMs, 4 closed-source models (GPT-4V, GPT-4o, Gemini 1.5 Flash/Pro): shows that image MLLMs generalise non-trivially to video (≈50% multi-frame accuracy), validating the benchmark as "universal" for image+video MLLMs (§4.2).

## Method

### Dataset construction (§3.1)

Three phases:

1. **Video Collection**. Top-down 2-level taxonomy: 6 primary domains — Knowledge, Film & Television, Sports Competition, Artistic Performance, Life Record, Multilingual — split into 30 sub-categories (e.g. *technology*, *documentary*, *news report*, *esports*, *magic show*, *fashion*). For each sub-category, YouTube videos are collected in the 3 bands: short < 2 min, medium 4–15 min, long 30–60 min. Subtitles (when available) and audio tracks are also downloaded.
2. **QA Annotation**. Annotators with a vision-language background watch the whole video and create 3 multiple-choice questions per video, each with 4 options → 2,700 QA pairs. The questions span 12 task types, grouped into *perception*, *reasoning*, *information synthesis* (Fig. 2 bottom-right).
3. **Quality Review**. Human cross-review + automatic filter: questions are passed *text-only* to Gemini 1.5 Pro and those it can answer on its own are discarded. Statistic: Gemini 1.5 Pro reaches < 15% accuracy in the text-only setting, a signal that the dataset requires the video [source: raw/papers/fu-2025-video-mme.pdf §3.1, p. 4].

### Statistics (§3.2)

- 900 total videos (300 short / 300 medium / 300 long), 744 with subtitles, **all** with audio.
- Mean duration: short 80.7 s, medium 515.9 s, long 2466.7 s; overall 1017.9 s — about **17 min** on average.
- Mean tokens per QA: 28.7 (short), 32.8 (medium), 45.6 (long); mean subtitle tokens: 198.6 / 1425.6 / 6515.6 (Tab. 1–2).
- Option distribution A/B/C/D = 25.1 / 27.2 / 25.3 / 22.4% — nearly uniform (§3.2).
- **Certificate length** (concept borrowed from EgoSchema, [[egoschema]]): median 26 s / 164.7 s / 890.7 s for short/medium/long. For the medium and long bands the certificate length is considerably higher than EgoSchema's (Tab. 3, §3.2).

### Question taxonomy (Fig. 2)

12 task types grouped into two families:

- **Perception**: OCR, action recognition, attribute perception, object recognition, counting problems, spatial perception, temporal perception, action recognition.
- **Reasoning**: spatial reasoning, action reasoning, temporal reasoning, information synopsis.

Distribution depends on duration: short videos are dominated by perception tasks (object/action recognition), long ones by reasoning (§3.2, Fig. 2).

### Evaluation protocol (§4.1, §7)

Format: `video_frames + subtitles/audio (optional) + question_prompt`. Standard prompt:

> This video's subtitles are listed below: [Subtitles]. Select the best answer to the following multiple-choice question based on the video. Respond with only the letter (A, B, C, or D) of the correct option. [Question] The best answer is:

Accuracy = direct regex match of the letter with the ground-truth; ChatGPT is **not** used as a judge — choice motivated to avoid evaluation bias (§4.1, p. 7).

Frame sampling differs by model: Gemini 1.5 Pro samples @ 1 fps (short/medium) and 0.5 fps (long); other models use their official config, e.g. GPT-4V 10 frames, GPT-4o 384 frames, Video-LLaVA 8, VideoChat2 16, ST-LLM 64, VILA-1.5 8, InternVL-Chat-V1.5 10 (§7).

For the "with subtitles" mode only subtitles temporally aligned with the sampled frames are selected (§7).

## Key results

### Overall performance (§4.2, Tab. 4)

| Model | Params | Short w/o subs | Medium w/o subs | Long w/o subs | Overall w/o subs | Overall w/ subs |
|---|---|---|---|---|---|---|
| Random | — | 25.0 | 25.0 | 25.0 | 25.0 | 25.0 |
| GPT-4V | — | 70.5 | 55.8 | 53.5 | 59.9 | 63.3 |
| GPT-4o | — | 80.0 | 70.3 | 65.3 | 71.9 | 77.2 |
| Gemini 1.5 Flash | — | 78.8 | 68.8 | 61.1 | 70.3 | 75.0 |
| **Gemini 1.5 Pro** | — | **81.7** | **74.3** | **67.4** | **75.0** | **81.3** |
| VILA-1.5 (best open-source) | 34B | 68.1 | 58.1 | 50.8 | 59.0 | 59.4 |
| VITA-1.5 | 7B | 67.0 | 54.2 | 47.1 | 56.1 | 58.7 |
| LLaVA-NeXT-Video | 34B | 61.7 | 50.1 | 44.3 | 52.0 | 54.9 |
| InternVL-Chat-V1.5 (image MLLM) | 20B | 60.2 | 46.4 | 45.6 | 50.7 | 52.4 |
| Qwen-VL-Max (image MLLM) | — | 55.8 | 49.2 | 48.9 | 51.3 | 51.2 |
| Video-LLaVA | 7B | 45.3 | 38.0 | 36.2 | 39.9 | 41.6 |

Three observations:

1. All models show **monotone decay** of accuracy with duration. Gemini 1.5 Pro loses ~14% from short to long; VILA-1.5 loses ~17%.
2. Closed-source ↔ open-source gap: ~16 points between Gemini 1.5 Pro and VILA-1.5; ~13 points between GPT-4o and VILA-1.5.
3. Image MLLMs (Qwen-VL-Max, InternVL-Chat-V1.5) reach ~50% multi-frame, close to the video MLLM LLaVA-NeXT-Video — a sign that image understanding is the foundation of video understanding (§4.2).

### Impact of auxiliary modalities (§4.3, Tab. 5)

For Gemini 1.5 Pro:

| Modality | Short | Medium | Long | Overall |
|---|---|---|---|---|
| Frames | 81.7 | 74.3 | 67.4 | 75.0 |
| Frames + Subs | 84.5 (+2.8) | 81.0 (+6.7) | 77.4 (+10.1) | 81.3 (+6.2) |
| Frames + Audio | 83.6 (+1.9) | 79.5 (+5.2) | 73.6 (+6.2) | 79.4 (+4.3) |

Findings:

- Subtitles always help, audio almost always.
- The benefit grows with duration: +2.8 on short → +10.1 on long for subtitles.
- Subtitles > audio on average (probably because subtitles transcribe speech, while audio includes less informative ambient noise).
- On the Multilingual subset audio gives exceptional gains (+11.5 overall, +12.5 long), probably due to lower subtitle quality in non-English languages (§4.3).

### Causes of decay with duration (§4.3)

Three concurrent causes:

1. *Increased proportion of difficult tasks*: long videos contain proportionally more reasoning questions.
2. *Increased sparsity in frame sampling*: most open-source models use a fixed number N of frames (e.g. 8 frames) → information density falls as duration grows.
3. *Increased difficulty in long-context understanding*: even Gemini 1.5 Pro, which scales the number of frames with duration, decays — the problem is intrinsic to long context.

## Stated limitations

- Multiple-choice format only (4 options): does not evaluate open-ended generation.
- Videos from YouTube → domain bias (sports, esports, news, etc.) and dependence on YouTube copyright.
- Audio is provided but many open-source models do not support it → the audio comparison is limited to closed-source ones (Gemini 1.5 Pro/Flash, GPT-4o).
- Manual annotation is costly and potentially annotator-biased.
- The "Gemini-blind-test" filter uses **the same model** later evaluated as top performer: risk of data leakage / overfitting impossible to fully rule out.

## Open questions / critiques

- The text-only filter uses Gemini 1.5 Pro, which is also the model evaluated as top → judge and party. An ensemble of different LLMs would have been more robust (cf. [[lvbench]] which uses GLM-4 + GPT-4 with AND).
- Tab. 2 shows annotators write longer questions/options on long videos: a confounding bias with difficulty that the paper does not discuss.
- The duration-decay analysis is correlational: it does not truly distinguish between (b) sampling sparsity and (c) long-context modelling.
- The "Multilingual" sub-category is a single group (5% of the dataset?) but gets its own column in Tab. 5 — very small sample, high variance.
- The dataset is not split into train/dev/test and access to the videos is subject to YouTube policies: long-term reproducibility is fragile (clips can disappear).
- No *human baseline* reported — the benchmark "ceiling" is unknown, unlike EgoSchema (76%) and LVBench (94.4%).

## Cited concepts

- [[multimodal-large-language-model]] — object of the benchmark.
- [[video-question-answering]] — task paradigm.
- [[multiple-choice-qa]] — question format.
- [[certificate-length]] — adopted from [[egoschema]] to measure intrinsic temporal difficulty.
- [[long-context-modeling]] — main identified bottleneck.
- [[egoschema]] — prior long-form benchmark and reference.
- [[mvbench]] — prior benchmark, cited in Tab. 1.
- [[lvbench]] — contemporary benchmark for long video (cited in §2).
- [[gemini-1-5-pro]] — top-performer model.
- [[gpt-4o]] — second closed-source model.
- [[gpt-4v]] — predecessor of GPT-4o.
- [[vila]] — top open-source video MLLM.
- [[llava-next-video]] — evaluated open-source video MLLM.
- [[videochat2]] — evaluated open-source video MLLM.
- [[internvl-chat]] — evaluated image MLLM.
- [[qwen-vl]] — evaluated image MLLM.
- [[video-llava]] — evaluated open-source video MLLM.
- [[clip]] — vision encoder cited as standard choice.
- [[siglip]] — vision encoder cited.
- [[blip-2]] — Q-Former predecessor.
- [[q-former]] — visual-token compression module.
- [[ring-attention]] — cited as a long-context technique.
- [[flamingo]] — precursor with gated cross-attention.
- [[fuyu]] — architecture cited for pixel-to-embedding.
- [[ego4d]] — source of EgoSchema videos, cited indirectly.

## Direct quotes

> "Video-MME, the first-ever full-spectrum, Multi-Modal Evaluation benchmark of MLLMs in Video analysis." (Abstract, p. 1)

> "Gemini 1.5 Pro is the highest-performing commercial model, achieving an average accuracy of 75%." (§1, p. 2)

> "Statistical analysis shows that Gemini 1.5 Pro achieves less than 15% accuracy in the text-only setup, underscoring the robustness of the video content-based requirement." (§3.1, p. 4)

> "We can also see that the effect of subtitles and audios is different in these six categories. These motivate future research to develop versatile models that can support a wider range of modality inputs." (§4.2, p. 7)

> "Understanding the long context of either single-modality (LLM) or multi-modality (MLLM) is always a great challenge." (§4.3, p. 8)
