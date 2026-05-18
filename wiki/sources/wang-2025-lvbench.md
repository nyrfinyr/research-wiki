---
title: "Wang et al. (2025) — LVBench: An Extreme Long Video Understanding Benchmark"
type: source
tags: [video-qa, benchmark, mllm, long-video, multi-hour-video, temporal-reasoning]
created: 2026-05-15
updated: 2026-05-15
source_path: raw/papers/wang-2025-lvbench.pdf
source_kind: paper
source_date: 2025-08-09
doi: 10.48550/arXiv.2406.08035
zotero_key: 62E46AMN
venue: arXiv preprint (CC-BY-NC-SA-4.0)
authors: [Weihan Wang, Zehai He, Wenyi Hong, Yean Cheng, Xiaohan Zhang, Ji Qi, Xiaotao Gu, Shiyu Huang, Bin Xu, Yuxiao Dong, Ming Ding, Jie Tang]
year: 2025
---

# Wang et al. (2025) — LVBench: An Extreme Long Video Understanding Benchmark

## TL;DR

LVBench is a video-QA benchmark designed to stress-test MLLMs on *extremely long* videos: 103 YouTube videos totaling **117 hours**, average duration **4101 s ≈ 68 min** (≈ 4× longer than prior benchmarks such as Video-MME, MovieChat-1K, MoVQA). The 1,549 4-option questions cover 6 core capabilities (Temporal Grounding, Summarization, Reasoning, Entity Recognition, Event Understanding, Key Information Retrieval) that can be combined into 26 task types. Even top closed-source models struggle: Gemini 2.5 Pro 67.4%, Seed1.5-VL-Thinking 64.6%; the top open-source ones (Qwen2.5-VL-72B, mPLUG-Owl3) stay below 45%; humans score **94.4%**, leaving a ~27-point gap to SOTA [source: raw/papers/wang-2025-lvbench.pdf §1, §4.2, Tab. 2–3].

## Main contribution

- **Average duration 4×** longer than the most ambitious previous long-video benchmark (Video-MME 1018 s → LVBench 4101 s); explicit definition of "long video" as ≥ 30 min with rich content and multiple events (§3.1).
- Taxonomy of **6 compositional core capabilities** (TG, Sum, Rea, ER, EU, KIR) → 26 combinatorial sub-categories; the combinations ensure each question requires multiple skills together.
- Fully manual annotation + dual-LLM filter (GLM-4 ∩ GPT-4 both correct ⇒ discard) to ensure each question genuinely requires the visual content.
- Empirical evidence that (i) "native long-video" models can perform worse than non-native ones (LLaMA-VID, MovieChat, LWM collapse due to poor instruction following), (ii) dense sampling (1 fps) is critical — the 50-frame → 1-fps jump is the largest observed.

## Method

### "Long video" definition and collection (§3.1)

Operational definition: video ≥ 30 min, with multiple events, scene transitions, and visually rich content.

Pipeline:

1. Initial pool: 500 YouTube videos via search/recommendation, manually selected keywords.
2. Quality filter on 5 criteria:
   - **Clear Protagonist Presence**: identifiable, recurring protagonist (human or virtual).
   - **Structural Coherence**: coherent narrative structure (beginning-development-conclusion, causally connected events).
   - **Event Density**: ≥ 1 significant event every 5 minutes.
   - **Visual Clarity**: minimum 720p, stable camerawork, no excessive cuts.
   - **Modality Independence**: all critical information conveyed visually — audio is discarded (see limitations).
3. After filtering: **103 videos, 117 hours of total content**, 6 thematic categories: Sports Competitions, Documentary Films, Event Records, Lifestyle and Daily Activities, TV Shows and Drama Series, Cartoon Videos.

### Skill taxonomy (§3.2)

| Skill | What it measures | Example |
|---|---|---|
| **Temporal Grounding (TG)** | Localizing events in time | "What happened at 29:30?" |
| **Summarization (Sum)** | Global content synthesis | "Identify key developments" |
| **Reasoning (Rea)** | Causes, intents, predictions | "Why did the experiment fail?" |
| **Entity Recognition (ER)** | Identifying and tracking entities | Tracking people/objects |
| **Event Understanding (EU)** | Classifying events and transitions | Classifying video type |
| **Key Information Retrieval (KIR)** | Extracting specific numbers / text | "What revenue growth did the firm report?" |

Questions are often hybrid (e.g. a Reasoning question implicitly requires ER + EU). Distribution: ER and EU dominate due to the intrinsic nature of the videos (Fig. 2). 26 total skill combinations (Fig. 5).

### Annotation (§3.3)

Three-stage pipeline, professional annotators paid ~30 USD per video:

1. **Video Analysis**: the annotator watches the full video, marks salient events, transitions, key entities, temporal/causal dependencies.
2. **Question Generation**: ~24 questions per hour of video, distributed along the entire timeline; each video covers all 6 skills; questions built with the **specificity** principle (unique, unambiguous references).
3. **Answer Construction**: 4 options per question (1 correct + 3 plausible distractors of similar length); the annotator also marks the **clue duration** — the minimum temporal interval needed to answer (analog of [[egoschema]]'s certificate length).

### Data Quality Control (§3.4)

Two interventions:

- **Reduction of "temporal grounding-friendly" questions**: annotators tended to inject a temporal range into many questions (e.g. "around 15:00…"). This made questions too easy and penalized models without temporal sense → annotators were asked to minimize such phrasings.
- **Dual-LLM blind filter**: GLM-4 and GPT-4 answer textually without the video; if *both* agree with the ground truth → the question is solvable without vision → discarded. Final result: **1,549 QA pairs** after filtering.

### Evaluation protocol (§4.1)

Minimal prompt:

> Question (A) Option1 (B) Option2 (C) Option3 (D) Option4. Please select the best answer from the options above and directly provide the letter representing your choice without giving any explanation.

Answer extraction via regex; LLM fallback only if regex fails. Frame sampling:

- **Native long-video models**: 1 fps; downsample only if it exceeds the context window.
- **Non-native long-video models**: fixed number of frames (32 or 96 depending on training).

## Key results

### Performance per core capability (Tab. 2)

Selection of the main results (overall %):

| Model | ER | EU | KIR | TG | Rea | Sum | **Overall** |
|---|---|---|---|---|---|---|---|
| Random ~25.0 | — | — | — | — | — | — | ~25.0 |
| **Native long-video** |  |  |  |  |  |  |  |
| MovieChat (Vicuna-7B) | 21.3 | 23.1 | 25.9 | 22.3 | 24.0 | 17.2 | 22.5 |
| LWM (LLaMA2-7B) | 24.7 | 24.8 | 26.5 | 28.6 | 30.5 | 22.4 | 25.5 |
| Gemini-1.5-Pro | 32.1 | 30.9 | 39.3 | 31.8 | 27.0 | 32.8 | 33.1 |
| Qwen2-VL-72B | 38.0 | 41.1 | 38.3 | 41.4 | 46.5 | 46.6 | 41.3 |
| Qwen2.5-VL-72B | 44.2 | 40.9 | 55.6 | 37.7 | 45.2 | 34.5 | 44.0 |
| Gemini-2.0-Flash | 47.4 | 48.5 | 56.8 | 39.3 | 44.4 | 41.4 | 48.6 |
| Gemini-2.5-Flash | 55.2 | 55.5 | 63.8 | 52.7 | 55.5 | 44.8 | 56.7 |
| MR.Video (Gemini-2.0 backbone) | 59.8 | 57.4 | 71.4 | 58.8 | 57.7 | 50.0 | 60.8 |
| Seed1.5-VL | 64.3 | 64.0 | 64.7 | 52.3 | 65.0 | 51.7 | 64.0 |
| Seed1.5-VL-Thinking | 65.4 | 63.4 | 68.0 | 53.6 | 63.7 | 46.6 | 64.6 |
| **Gemini-2.5-Pro** | **64.5** | **67.5** | **72.8** | **65.9** | **66.5** | **58.6** | **67.4** |
| **Non-native long-video** |  |  |  |  |  |  |  |
| TimeChat (LLaMA2-7B) | 21.9 | 21.7 | 25.9 | 22.7 | 25.0 | 24.1 | 22.3 |
| PLLaVA (Yi-34B) | 25.0 | 24.9 | 26.2 | 21.4 | 30.0 | 25.9 | 26.1 |
| LLaVA-OneVision (LLaMA3-70B) | 25.0 | 26.9 | 29.2 | 30.9 | 25.4 | 31.0 | 26.9 |
| InternVL2-40B | 37.4 | 39.7 | 43.4 | 31.4 | 42.5 | 41.4 | 39.6 |
| mPLUG-Owl3 (Qwen2-7B) | 46.0 | 41.6 | 42.4 | 41.1 | 47.5 | 40.4 | 43.5 |
| VideoLLaMA3-7B | 45.8 | 42.4 | 47.8 | 35.9 | 45.8 | 36.2 | 45.3 |
| GLM4V-Plus | 46.2 | 47.8 | 54.1 | 42.7 | 46.5 | 37.9 | 48.7 |
| GPT-4o-20241120 | 48.9 | 49.5 | 48.1 | 40.9 | 50.3 | 50.0 | 48.9 |
| GPT-4.1 | — | — | — | — | — | — | **60.1** |

Findings:

- Top performer: **Gemini-2.5-Pro 67.4%** (best in 5/6 tasks: EU, KIR, TG, Rea, Sum).
- Proprietary ↔ open-source gap ~20 points: the best non-native open-source is VideoLLaMA3-7B 45.3%, the best native open-source is Qwen2.5-VL-72B 44.0%.
- Some "native long-video" models (MovieChat, LLaMA-VID, LWM, even Gemini-1.5-Pro) are surprisingly weaker than non-native ones — hypothesis: scarcity of long-video instruction-tuning data.

### Failure modes (§4.3, Fig. 3)

- **Gemini-1.5-Pro** generates output outside the 4 options **20.9%** of the time (e.g. "I cannot answer this question") despite the prompt constraint.
- **MovieChat** and **LWM** show strong bias toward option A regardless of the question.
- Authors' hypothesis: lack of long-video instruction tuning → compromised instruction following.

### Performance per video category (Tab. 3)

| Category | Human | Seed1.5-VL | Gemini-2.5-Pro |
|---|---|---|---|
| Sports | 96.3 | 63.3 | 71.3 |
| Documentary | 89.8 | 67.5 | 54.3 |
| Event Record | 87.4 | 60.3 | 72.1 |
| Lifestyle | 98.4 | 66.9 | 68.5 |
| TV Show | 97.2 | 60.4 | 69.2 |
| Cartoon | 95.8 | 65.0 | 66.1 |
| **Overall** | **94.4** | **64.0** | **67.4** |

Gemini-2.5-Pro is strong on Event Record and Sports but collapses on Documentary (54.3); Seed1.5-VL is more uniform. **Human-machine gap ~27 points.**

### Frame-density ablation (§4.5, Fig. 4)

Seed1.5-VL, Gemini-2.5-Pro, Qwen2.5-VL-72B tested with 0, 1, 4, 8, 50 frames and 1 fps:

- "0 frames" → all near random guess (validation: the benchmark is not solvable by pure LLMs).
- 1 → 8 frames: modest gain.
- 50 → 1 fps: **big jump**. Suggests dense sampling is necessary to catch critical transient signals.

## Stated limitations

- **No audio**: the authors deliberately exclude audio because many models do not support it (§5 *Limitations*). A decision that limits the benchmark's realism.
- Annotator bias: some QAs may still be of slightly low quality even after filtering.
- Dependence on YouTube videos → degradation over time (broken links, takedowns).
- No train/val/test split: dataset is purely for evaluation.

## Open questions / critiques

- Excluding audio makes LVBench *less* multimodal than Video-MME (where audio is a key column). For many long videos (e.g. documentaries, TV shows) audio is highly informative: an artificial setting is being evaluated.
- The dual-LLM filter (GLM-4 ∩ GPT-4) is more robust than Video-MME's single-LLM filter, but remains biased toward what GLM-4 and GPT-4 *do not know*. Non-LLM models well-trained on Wikipedia could still answer without video.
- The evaluation scheme shows that 5 of 6 tasks are dominated by Gemini-2.5-Pro, but with aggregated metrics (one number per skill). Variance / confidence interval breakdown is missing.
- "Native" vs "non-native long-video" comparisons are confounded by LLM backbone diversity (Vicuna-7B vs Qwen2.5-72B vs Gemini): hard to attribute the differences to native long-video support.
- 1,549 questions are many but over only 103 videos — high correlation among QAs from the same video, effective size smaller than it seems.
- "Modality Independence" as a filtering criterion is subjective: who decides whether information is truly visual-only? Likely audio-information leaks in Sport/TV questions.

## Cited concepts

- [[multimodal-large-language-model]] — object of evaluation.
- [[long-video-understanding]] — target task of the benchmark.
- [[temporal-grounding]] — one of the 6 core skills.
- [[video-summarization]] — Sum skill.
- [[video-reasoning]] — Rea skill.
- [[key-information-retrieval]] — KIR skill.
- [[entity-recognition]] — ER skill.
- [[event-understanding]] — EU skill.
- [[clue-duration]] — concept analogous to certificate length, from [[egoschema]].
- [[certificate-length]] — not explicitly used but conceptually close.
- [[multiple-choice-qa]] — format.
- [[ring-attention]] — cited for LWM.
- [[q-former]] — used by Video-LLaMA.
- [[3d-rope]] — introduced by Qwen2-VL for long video.
- [[ego4d]] — not used directly but mentioned as the EgoSchema domain.
- [[video-mme]] — comparison in Tab. 1.
- [[mvbench]] — cited in Tab. 1.
- [[egoschema]] — cited in Tab. 1.
- [[movieqa]] — cited in Tab. 1.
- [[longvideobench]] — cited in Tab. 1.
- [[moviechat-benchmark]] — cited in Tab. 1.
- [[gemini-1-5-pro]] — evaluated model (surprisingly weak, 33.1%).
- [[gemini-2-5-pro]] — top performer.
- [[gpt-4o]] — evaluated model.
- [[gpt-4-1]] — evaluated model.
- [[qwen2-vl]] — evaluated model.
- [[qwen2-5-vl]] — evaluated model.
- [[mplug-owl3]] — evaluated model.
- [[videollama-3]] — evaluated model.
- [[seed1-5-vl]] — second top performer.
- [[llava-onevision]] — evaluated model.
- [[internvl2]] — evaluated model.
- [[cogvlm2]] — evaluated model.
- [[mr-video]] — "MapReduce" model for long video.
- [[adaretake]] — model with adaptive redundancy reduction.
- [[mm-star]] — cited as motivation for the dual-LLM blind filter.

## Direct quotes

> "We define long videos as those having a minimum duration of 30 minutes and containing rich, dynamic visual information with multiple events and scene transitions." (§3.1, p. 3)

> "We utilized two powerful large language models, GLM-4 and GPT-4, to independently generate answers for all the questions. In cases where the outputs from both models were identical and matched the ground truth answer, we removed that particular data sample from the dataset." (§3.4, p. 5)

> "A significant performance gap persists between proprietary and open-source models. The top-performing open-source models … scored 45.3 and 44.0, respectively, lagging behind Gemini-2.5-Pro by over 20%." (§4.2, p. 7)

> "Despite explicitly constraining the output in the prompt to be one of four provided answer choices, Gemini-1.5-Pro generated responses outside of the specified options 20.9% of the time." (§4.3, p. 7)

> "A limitation of our benchmark is the exclusion of audio data. While audio can provide valuable context, we did not include it because most current models lack effective audio processing capabilities." (§5 Limitations, p. 8)
