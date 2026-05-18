---
title: "Li et al. (2024) — MVBench: A Comprehensive Multi-modal Video Understanding Benchmark"
type: source
tags: [video-qa, benchmark, mllm, temporal-understanding, instruction-tuning, videochat2]
created: 2026-05-15
updated: 2026-05-15
source_path: raw/papers/li-2024-mvbench.pdf
source_kind: paper
source_date: 2024-05-23
doi: 10.48550/arXiv.2311.17005
zotero_key: WWAUW28Q
venue: CVPR 2024
authors: [Kunchang Li, Yali Wang, Yinan He, Yizhuo Li, Yi Wang, Yi Liu, Zun Wang, Jilan Xu, Guo Chen, Ping Luo, Limin Wang, Yu Qiao]
year: 2024
---

# Li et al. (2024) — MVBench: A Comprehensive Multi-modal Video Understanding Benchmark

## TL;DR

MVBench is a video-MLLM benchmark built with a **static-to-dynamic** method: for each of 9 static tasks common to image benchmarks (Action, Object, Position, Scene, Count, Attribute, Pose, Character, Cognition) the authors derive 20 dynamic versions that require temporal understanding (e.g. Position → Moving Direction, Count → Action Count). The 4,000 multiple-choice questions (200 per task) are automatically generated from 11 existing public video datasets via ChatGPT, preserving the original datasets' ground truth. The authors also introduce **VideoChat2**, a video MLLM baseline trained on a 2M-sample instruction-tuning mix from 34 datasets, which surpasses VideoChat by **+15.6%** and GPT-4V by **+16.9%** on MVBench. Main findings: all previous MLLMs are near chance level on many temporal tasks, but with massive instruction-tuning + a good visual encoder (UMT-L) the gap closes considerably [source: raw/papers/li-2024-mvbench.pdf §1, §5.1, Tab. 2].

## Main contribution

- **Static-to-dynamic taxonomy** (Fig. 1): a systematic method to derive video tasks from image tasks — 9 spatial tasks → 20 temporal tasks that cannot be solved by a single frame.
- **Automatic QA generation pipeline** that reuses existing annotations (STAR, PAXION, MiT V1, FunQA, CLEVRER, Perception Test, Charades-STA, MoVQA, NTU RGB+D, VLN-CE, TVQA): 200 QA × 20 tasks = **4,000** multiple-choice QA pairs.
- **VideoChat2**: video MLLM with UMT-L visual encoder, Q-Former with 64+32 queries, 3-stage training (alignment / connection / instruction-tuning) on 2M samples from 34 sources. Surpasses VideoChat by +15.6%, GPT-4V by +16.9% on MVBench; reaches SOTA on NExT-QA, STAR, EgoSchema (Fullset 54.4%), IntentQA, MSVD/MSRVTT/ActivityNet-QA zero-shot.
- **Prompt design** "Best Option: (" that raises the option-extraction rate to **100%** vs. 64–87% for prior methodologies (Tab. 9).

## Method

### Static-to-dynamic task design (§3.1)

The key idea: start from 9 static tasks of image benchmarks (MME, MMBench) and introduce temporal evolution to generate video tasks. Examples:

- Image Position ("Is the man on the stage?") → Video Moving Direction ("What direction is the man moving?")
- Image Action → Video Action Sequence / Prediction / Antonym / Fine-grained / Unexpected
- Image Count → Action Count / Moving Count
- Image Attribute → Moving Attribute / State Change

The 20 final tasks cover **6 spatial families × temporal dimension**:

| Family | Derived tasks |
|---|---|
| **Action** | (1) Action Sequence, (2) Action Prediction, (3) Action Antonym, (4) Fine-grained Action, (5) Unexpected Action |
| **Object** | (6) Object Existence, (7) Object Interaction, (8) Object Shuffle |
| **Position** | (9) Moving Direction, (10) Action Localization |
| **Scene** | (11) Scene Transition |
| **Count** | (12) Action Count, (13) Moving Count |
| **Attribute** | (14) Moving Attribute, (15) State Change |
| **Pose** | (16) Fine-grained Pose |
| **Character** | (17) Character Order |
| **Cognition** | (18) Egocentric Navigation, (19) Episodic Reasoning, (20) Counterfactual Inference |

### Automatic QA generation pipeline (§3.2, Fig. 2)

Three steps:

1. **Data Filtration** on 11 public datasets:
   - *Video Diversity*: first/third person, indoor/outdoor.
   - *Temporal Sensitivity*: exclude clips too short (negligible motion) or too long (excessively complex context); typical range **5–35 s**.
   - *Question Difficulty*: for STAR start/end are randomly shifted to raise difficulty; for CLEVRER questions with > 10 descriptive conditions are dropped (reduces excessive difficulty).
2. **QA Generation**:
   - *Template-based*: for tasks such as Action Antonym and Moving Direction the options are directly the template candidates (correct action, antonym, "not sure"; directions up/down/left/right + stationary).
   - *LLM-based*: for Unexpected Action, ChatGPT is used to convert the original open-ended QA into MCQ. The 3–5 options are shuffled and option length is forced to be similar to avoid leaks.
3. **Answer Option Processing**: shuffle + length balancing via LLM.

Result: 200 QA for each of the 20 tasks = **4,000 total QA**.

### Prompt design for evaluation (§3.3)

A **system prompt** is defined that emphasises temporal evolution:

> Carefully watch the video and pay attention to the cause and sequence of events, the detail and movement of objects and the action and pose of persons. Based on your observations, select the best option that accurately addresses the question.

And an **answer prompt** that makes option extraction deterministic:

> Best Option: (

The extraction rate climbs to **100%** vs. 78–96% of the baselines (Tab. 9), allowing accuracy as a reliable metric without using an LLM judge (unlike MMBench [49] and VideoChatGPT).

### VideoChat2 (§4)

**Architecture**:

- Visual encoder: [[umt-l]] (Unified Masked Transformer Large) — chosen for its strong spatial-temporal capability vs. EVA-CLIP-g (Tab. 6).
- Q-Former (BERT-base): 32 queries in Stage 1, +64 randomly initialised queries in Stage 2/3 → 96 total queries.
- LLM: Vicuna-7B v0 by default; variants with Vicuna-13B, Vicuna-7B v1.5, and finally **Mistral-7B** which gives the best results.
- LoRA r=16, α=32, dropout 0.1 on the LLM in Stage 3.

**Progressive 3-stage training (Fig. 4)**:

- **Stage 1 — Vision-Language Alignment**: freeze visual encoder, train Q-Former with VTC + VTM + VTG loss on 15M image captions (CC3M, CC12M) + 10M video captions (WebVid-10M); 4-frame, 10 epochs.
- **Stage 2 — Vision-Language Connection**: linear projection + connect to LLM (frozen); unfreeze visual encoder; add 2M image captions (COCO, Visual Genome, SBU) + 10M video captions (InternVid). 1 epoch.
- **Stage 3 — Instruction Tuning**: 2M instruction-tuning samples from **34 datasets** in 6 categories:
  1. *Conversation* (LLaVA, VideoChat, VideoChatGPT)
  2. *Simple Caption* (COCO Caption, WebVid, YouCook2)
  3. *Detailed Caption* (MiniGPT-4, LLaVA, VideoChat, Paragraph Captioning, TextCaps, TextVR)
  4. *VQA* (VQAv2, GQA, TGIF-QA, WebVidQA, OK-VQA, AOK-VQA, ViQuAE, OCR-VQA, TextVQA, ST-VQA, DocVQA, Ego4D EgoQA)
  5. *Reasoning* (LLaVA-reasoning, CLEVR, VisualMRC, NExT-QA, CLEVRER)
  6. *Classification* (ImageNet, COCO-ITM, Kinetics-710, SthSthV2)
  - 8-frame, 3 epochs, LoRA on the LLM, instruction (not question) also injected in the Q-Former.

**Inference**: 16-frame, 224×224.

## Key results

### MVBench (Tab. 2, average accuracy over 20 tasks)

| Model | LLM | Avg |
|---|---|---|
| Random | — | 27.3 |
| MiniGPT-4 | Vicuna-7B | 18.8 |
| VideoLLaMA | Vicuna-7B | 34.1 |
| LLaMA-Adapter | LLaMA-7B | 31.7 |
| BLIP-2 | FlanT5-XL | 31.4 |
| Otter-I | MPT-7B | 33.5 |
| InstructBLIP | Vicuna-7B | 32.5 |
| LLaVA | Vicuna-7B | 36.0 |
| Otter-V | LLaMA-7B | 26.8 |
| mPLUG-Owl-V | LLaMA-7B | 29.7 |
| VideoChatGPT | Vicuna-7B | 32.7 |
| VideoChat | Vicuna-7B | 35.5 |
| **VideoChat2text** (text-only) | Vicuna-7B | 34.7 |
| **VideoChat2** | Vicuna-7B | **51.1** |
| GPT-4V (16 frames, 512×512) | GPT-4 | 43.5 |
| **VideoChat2 + Mistral-7B** | Mistral-7B | **60.4** |

Findings:

- **Almost all pre-VideoChat2 MLLMs are near random** (27.3) on many tasks; VideoChat and VideoChatGPT do not significantly exceed VideoChat2text (text-only) → a sign that many MLLMs do not really exploit temporal information.
- VideoChat2 surpasses VideoChat by **+15.6 points** (51.1 vs. 35.5).
- With Mistral as backbone, it beats GPT-4V by **+16.9 points** (60.4 vs. 43.5).
- VideoChat2 is strong on action, object, scene, attribute, pose; **weak on position, count, character** (worse than VideoChat2text), attributed to lack of exposure to those tasks during instruction tuning.

### Cross-benchmark (Tabs. 4, 15–18)

- **MSVD-QA / MSRVTT-QA / ActivityNet-QA** (zero-shot acc): VideoChat2 70.0 / 54.1 / 49.1 vs. previous SOTA VideoChatGPT 64.9 / 49.3 / 35.2.
- **NExT-QA**: VideoChat2 zero-shot 61.7% (Temp 57.4 / Caus 61.9 / Desc 69.9); in-domain Mistral version 78.6.
- **STAR** (zero-shot): VideoChat2 59.0 avg (Mistral: 63.8).
- **TVQA** (zero-shot, no subtitles): VideoChat2 40.6 (Mistral: 46.4) vs. previous SOTA SeViLA 38.2.
- **EgoSchema Fullset zero-shot**: VideoChat2-Mistral 54.4% (16 frames) vs. InternVideo 32.1 (90 frames), mPLUG-Owl 31.1 (5 frames).
- **IntentQA**: VideoChat2-Mistral 83.4 (testing) — surpasses every baseline but stays below human (78.5).

### Ablation (Tabs. 5–14)

- **Instruction data scaling** (Tab. 5): more data → better; image+video > video only > image only; 2M samples → 51.1.
- **Visual encoder** (Tab. 6): UMT-L > EVA-CLIP-g by +6.2 points.
- **LLM size**: Vicuna-7B v0 vs. 13B → only +0.3 points. *MVBench depends more on the visual encoder than on the LLM.*
- **LoRA**: +2.5–3.1 consistent points.
- **Training method** (Tab. 7): progressive unfreezing of Q-Former then visual encoder → +12.6 total points.
- **Frame count** (Tab. 12): 16-frame ≥ 32 ≥ 64 ≥ 8; raising resolution **hurts** (384×384 < 224×224).
- **Question prompt** (Tab. 14): "Let's think step by step" is harmful (-0.6).
- **Q-Former queries** (Tab. 11): 32+64 queries optimal; inserting instruction (no question) in the Q-Former is useful.

### Failure analysis on hard tasks

- **Position (Moving Direction, Action Localization)**: ~23% — near chance — no model performs well.
- **Count (Action Count, Moving Count)**: even VideoChat2 < 45%; bottleneck acknowledged as common (see also Video-MME §4.2 where counting is a "joint bottleneck").
- **Character Order**: same situation.

## Stated limitations

- VideoChat2 is weak on position, counting, character order — attributed to limited exposure to such tasks in instruction tuning.
- "Minimal source gap" between instruction data and MVBench: CLEVRER and SthSthV2 appear both in instruction tuning *and* as sources of Moving Attribute, Counterfactual Inference, Action Antonym questions → the evaluation is not strictly *out-of-domain*. Quantified in Tab. 13: removing CLEVRER drops accuracy by 1.8 points.
- Automatic generation via ChatGPT may introduce bias (though option shuffling and length balancing mitigate it).
- The benchmark excludes overly short or overly long videos (5–35 s) → it does not evaluate long-video understanding.

## Open questions / critiques

- **Narrow temporal range (5–35 s)**: MVBench is not long-video. For long-video understanding cf. [[egoschema]] (3 min), [[video-mme]] (up to 1 h), [[lvbench]] (up to multi-hour). The benchmark measures "temporal understanding" on short clips, not "long-form".
- The **overlap between VideoChat2's training set and MVBench** (CLEVRER, SthSthV2) partly compromises the baseline's fairness: VideoChat2 is effectively optimised for its own benchmark.
- The 20 tasks are not orthogonal: Action Sequence requires Action Recognition + Temporal Reasoning; Action Localization is essentially Temporal Grounding too. The 9-spatial × dynamics taxonomy is elegant but some cells overlap.
- Automatic generation via ChatGPT: little control over plausible distractors — some tasks (Counterfactual Inference on CLEVRER) could be solved with textual shortcuts.
- Only 200 QA per task: the accuracy estimate has ~±3.5% confidence interval per task (at 50% baseline). Per-task gaps of < 3 points between models are not statistically significant.
- The "Best Option: (" option extraction is great for accuracy but forces the model into a rigid mode — debatable whether it helps the evaluation of complex reasoning.
- Audio is not considered — an interesting contrast with [[video-mme]] which does include it.

## Cited concepts

- [[multimodal-large-language-model]] — object of evaluation.
- [[video-question-answering]] — task.
- [[multiple-choice-qa]] — format.
- [[temporal-understanding]] — measured competence.
- [[static-to-dynamic-taxonomy]] — introduced methodology.
- [[videochat2]] — proposed MLLM baseline.
- [[videochat]] — predecessor.
- [[videochatgpt]] — predecessor.
- [[video-llama]] — comparison.
- [[mplug-owl]] — comparison.
- [[llama-adapter]] — comparison.
- [[blip-2]] — comparison.
- [[otter]] — comparison.
- [[instructblip]] — comparison.
- [[minigpt-4]] — comparison.
- [[llava]] — comparison.
- [[gpt-4v]] — comparison.
- [[umt-l]] — visual encoder used by VideoChat2.
- [[q-former]] — visual-token compressor.
- [[vicuna]] — LLM backbone.
- [[mistral]] — LLM backbone (best variant).
- [[lora]] — parameter-efficient fine-tuning.
- [[flash-attention]] — used for efficient training.
- [[clevrer]] — source for Moving Attribute, Counterfactual Inference, Moving Count, Moving Direction, Object Existence.
- [[star-benchmark]] — source for Action Sequence/Prediction, Object Interaction.
- [[perception-test]] — source for Object Shuffle, Action Count, State Change, Character Order.
- [[charades-sta]] — source for Action Localization.
- [[moments-in-time]] — source for Fine-grained Action.
- [[ntu-rgbd]] — source for Fine-grained Pose.
- [[funqa]] — source for Unexpected Action.
- [[vln-ce]] — source for Egocentric Navigation.
- [[tvqa]] — source for Episodic Reasoning.
- [[movqa]] — source for Scene Transition.
- [[paxion]] — source for Action Antonym.
- [[ego4d]] — used as EgoQA source in instruction tuning.
- [[webvid]] — caption training data.
- [[internvid]] — Stage-2 caption training data.
- [[kinetics-710]] — classification data.
- [[egoschema]] — cited as comparison benchmark and zero-shot eval.
- [[next-qa]] — zero-shot and in-domain comparison.
- [[intentqa]] — comparison.
- [[seek-vila]] — SeViLA cited as previous SOTA.
- [[chain-of-thought]] — tested in prompts (worse, Tab. 14).
- [[mme]] — cited as image-benchmark reference.
- [[mmbench]] — cited as comparison benchmark.
- [[seed-bench]] — comparison.

## Direct quotes

> "We introduce a comprehensive Multi-modal Video understanding Benchmark, namely MVBench, which covers 20 challenging video tasks that cannot be effectively solved with a single frame." (Abstract, p. 1)

> "We propose a Multi-modal Video understanding Benchmark (MVBench), which aims at comprehensively evaluating the temporal perception capabilities of MLLMs in the open world." (§1, p. 2)

> "Our VideoChat2 markedly exceeds the leading model by over 15%, particularly excelling in categories like action, object, scene, attribute, and pose recognition. However, it struggles in position, count, and character tasks." (§5.1, p. 7)

> "Note that there is a minimal source gap between our instruction data and MVBench. Specifically, the CLEVRER in our instruction data has similar questions as Moving Attribute and Counterfactual Inference in MVBench, leading the evaluation is not strictly out-domain." (Appendix B, p. 9)

> "Large resolution is harmful, while more frames are better for MVBench." (Tab. 12 caption, p. 9)
