---
title: "Mangalam, Akshulakov, Malik (2023) — EgoSchema: A Diagnostic Benchmark for Very Long-form Video Language Understanding"
type: source
tags: [video-qa, benchmark, long-form-video, egocentric, ego4d, certificate-length, zero-shot]
created: 2026-05-15
updated: 2026-05-15
source_path: raw/papers/mangalam-2023-egoschema.pdf
source_kind: paper
source_date: 2023-08-17
doi: 10.48550/arXiv.2308.09126
zotero_key: ENPEDZNI
venue: NeurIPS 2023 (Datasets and Benchmarks track)
authors: [Karttikeya Mangalam, Raiymbek Akshulakov, Jitendra Malik]
year: 2023
---

# Mangalam, Akshulakov, Malik (2023) — EgoSchema: A Diagnostic Benchmark for Very Long-form Video Language Understanding

## TL;DR

EgoSchema is a diagnostic dataset for *very long-form* video question-answering: > 5,000 multiple-choice QAs (5 options), each based on a **3-minute** egocentric clip drawn from [[ego4d]], for a total of **>250 hours** of video. The key conceptual contribution is the notion of **temporal certificate set** — the minimum subset of subclips a human verifier must watch to be convinced of the answer's correctness. Across 15 video-understanding datasets, EgoSchema has a median certificate length of ~100 s, **5.7× longer than the second dataset** (LVU) and **25–100× longer** than all the others. Experimental result: the best zero-shot MLLMs of 2023 (FrozenBiLM, mPLUG-Owl, InternVideo, VIOLET) stay below **33%** accuracy (random = 20%), while humans reach **76%** [source: raw/papers/mangalam-2023-egoschema.pdf §1, §4.1, §4.2, Tab. 6–7].

## Main contribution

- **Temporal certificate length**: a new metric that measures the *intrinsic* temporal difficulty of a video task, decoupled from clip duration. Applicable to action classification, detection, localization, QA, captioning. Shows that clip length is only *weakly correlated* with real temporal difficulty (Fig. 3).
- **EgoSchema dataset**: 5,063 QAs over 3-minute clips, each with 5 options, **median certificate length ~100 s** — the first "very long-form" dataset according to the authors' taxonomy (short ~1 s, long-form ~10 s, very long-form ~100 s).
- **4-stage construction pipeline** with LLM-in-the-loop: narration filtering → LLM generation (Q(AW)-shot) → LLM filtering (blind baseline) → 2-round manual curation. Produces high-quality data while minimizing human cost.
- **Zero-shot benchmark** of the main 2023 video MLLMs: all < 33% accuracy; humans 76%; first-of-its-kind gap quantification that motivated much of the subsequent research on long-video MLLMs.

## Method

### Temporal certificate notion (§3.2)

Definition: given a (video, label) and a task, the **certificate set** is the minimum subset of sub-clips *necessary and sufficient* to convince a human verifier of the label's correctness, without watching the rest of the video. The **certificate length** = sum of the temporal lengths of the subclips in the set.

Derived temporal taxonomy:
- *short video task*: certificate length ~1 s (e.g. action classification on Kinetics).
- *long-form video task*: ~10 s (e.g. AGQA, NextQA).
- *very long-form video task*: ~100 s (only EgoSchema in Fig. 3).

**Meta-rules**: implicit dataset conventions the verifier can use (e.g. mutual exclusivity of the 400 Kinetics classes). They significantly reduce certificate length.

**Certificate conventions**: minimum 0.1 s per certificate; two non-contiguous certificates are merged if their closest endpoints are < 5 s apart.

### Dataset construction pipeline (§3.1, Fig. 4)

**Stage I — Raw Data Filtering**.

Ego4D provides 3670 h of RGB with 3.85M dense narrations (1772 verbs, 4336 unique nouns). The pipeline filters **non-overlapping 3-minute clips** with **≥ 30 narrations** each (timestamp + sentence) to ensure sufficient narration density.

**Stage II — Question-Answer Generation**.

Narrations are passed to an LLM to generate *N = 3* (Q, A, W) triplets per clip, each with **M = 4 distractors** + 1 correct answer (5 options total). Prompting schemes tested:

| Scheme | Inference calls | Pros | Cons |
|---|---|---|---|
| One-shot | 1 | Cheapest | Low quality, high FP/FN |
| N-shot | N | Improves FP/FN | Similar-looking questions |
| QAW-shot | 3 chained | Distinct Q, distinct A | Cascading failure |
| **Q(AW)-shot** (chosen) | **2 chained** | Distinct Q; A jointly with W; 30% cheaper | — |

LLMs chosen for quality: GPT-4, Bard, Claude. GPT-3 and ChatGPT discarded for insufficient quality. Manual iteration on ~85 seed prompts before converging on the final PQ + PAW.

**Stage III — Generated QAW Filtering**.

- *Rule-based*: discard outputs containing prompt keywords (`long-term`, `narrations`, `timestamp`) that leak into QAW.
- *LLM blind filter*: give only the question + options (no narrations) to an LLM; if it guesses correctly, the question is solvable without video → discarded. Optimizes precision over recall.
- *No-Q baseline* (tested but not used): give narrations without the question → ~20% accuracy (random), evidence that the W options are already plausible.

**Stage IV — Manual QAW Curation**.

Two rounds of human annotators; each QAW must pass 3 conditions:

1. Q is well-formed and A is truly the correct answer;
2. all 4 distractors W are actually wrong;
3. the **temporal certificate length** is **≥ 30 s**.

The first round shrinks the QAW count by 4–5×. The second round confirms > 97% of the questions from the first.

### Final EgoSchema statistics

- **5,063 QA pairs** over **~250 h** of filtered Ego4D video.
- **3-min** clips each; **5 options** per QA (random baseline = 20%).
- **Median certificate length ~100 s**; certificate length **5.7×** longer than LVU [50] (second place), **25–100×** longer than NextQA, AGQA, IVQA, MSRVTT, ActivityNet-QA, AVA, Kinetics, UCF101, HVU, Youtube-8M, Something-Something (Fig. 3).
- A **500-QA subset** (Subset) exists with public ground-truth, and a **~5000 fullset** with server-side eval.

### Evaluation protocol (§4.2)

Zero-shot setting for each model. Two configurations per MLLM:

1. Same #frames as training.
2. Maximum number of frames runnable on an A100-80G without OOM.

Frames uniformly sampled from the 3-min clip. Accuracy = multiple-choice QA accuracy. For models without native MCQ support:

- **mPLUG-Owl**: prompt "Given question Q, is answer X correct?" → pick the option with the highest softmax of "Yes".
- **InternVideo** (MSRVTT-finetuned): "Question: Q? Is it X?" → option with the best score.

### Human baseline (§4.2, Tab. 7)

Five settings:

| Setting | QA Accuracy |
|---|---|
| 180 frames (1 fps) | 67.2% |
| In < 1 min | 67.0% |
| In < 3 min | 68.0% |
| No constraint | 75.0% |
| Video → Text (no re-watch) | **76.2%** |

Surprises:
- 1 fps is nearly equivalent to watching the full video (67.2 vs 75.0).
- 1 min of human time is nearly equivalent to 3 min (67.0 vs 68.0).
- "Video → Text" (watch the video without text, then answer without re-watching) **beats** the "no constraint" setting (76.2 vs 75.0): undivided attention helps.

## Key results

### Certificate length across 15 datasets (Fig. 3)

EgoSchema sits isolated in the upper right:

- EgoSchema: ~100 s median, clip 180 s.
- LVU: ~17 s, clip 1–3 min.
- NextQA / AGQA: ~5 s.
- MSRVTT / ActivityNet-QA / IVQA / HOW2QA: ~1–3 s.
- Action class. (Kinetics, UCF101, HVU-Action): < 1 s.
- Detection (AVA): < 1 s.
- Concept class. (HVU-Concept), Youtube-8M, Something-Something: all ~0.5–2 s.

### Zero-shot MLLM benchmark (Tab. 6, on the fullset)

| Model | Release | Params | #frame | QA Acc |
|---|---|---|---|---|
| Random | — | — | — | 20.0% |
| **FrozenBiLM** [57] | Oct 2022 | 1.2B | 10 | 26.4% |
|  |  |  | 90 | 26.9% |
| **VIOLET** [14] | Sept 2022 | 198M | 5 | 19.9% |
|  |  |  | 75 | 19.6% |
| **mPLUG-Owl** [59] | May 2023 | 7.2B | 1 | 27.0% |
|  |  |  | **5** | **31.1%** |
|  |  |  | 10 | 29.6% |
|  |  |  | 15 | 28.7% |
|  |  |  | 30 | 20.0% |
| **InternVideo** [48] | Dec 2022 | 478M | 10 | 31.4% |
|  |  |  | 30 | 31.8% |
|  |  |  | 90 | **32.1%** |
| **Human** | — | — | — | **76.0%** |

Findings:

- No model exceeds 33%; human–machine gap **>40 points**.
- InternVideo scales monotonically with #frame but saturates around 30 frames.
- mPLUG-Owl is non-monotonic: 5 frames is the sweet spot, 30 frames degrades to random (20%).
- VIOLET (198M params) stays at chance level — parameters alone are not enough.
- FrozenBiLM, pre-2023 SOTA on 8 QA datasets, is barely above random here.

### Comparison with follow-on benchmarks

- [[mvbench]] (2024) uses a different pipeline (LLM-generated from 11 datasets, no certificate length, 5–35 s clips) and reaches > 60% accuracy with VideoChat2-Mistral; but on the EgoSchema fullset VideoChat2-Mistral reaches 54.4% (with 16 frames) — still well below human.
- [[video-mme]] (2025) adopts the certificate-length idea for its short/medium/long bands (26/164/890 s median) — EgoSchema (~100 s) sits between Video-MME's short and medium.
- [[lvbench]] (2025) uses a similar concept ("clue duration") but over multi-hour clips.

## Stated limitations

- Egocentric bias inherited from [[ego4d]] (sports, household tasks, cooking, etc.); does not represent third-person web video.
- Linguistic bias inherited from the LLMs used in generation (GPT-4, Bard, Claude); possible artifacts.
- Imperfect manual curation: even with 2 rounds, some QAs may remain ill-formed.
- Errata board planned but not yet active at release time.

## Open questions / critiques

- Certificate length is estimated on **100 QAs total** (5 h of video) for EgoSchema, and on only ~2 h of human effort for each of the other 14 datasets. High estimation error; the 5.7× factor relative to LVU is based on few samples.
- The blind LLM filter assumes the LLM reflects the "typical" textual prior → false negatives (actually-hard questions that happen to be guessable) might be unfairly removed. The authors acknowledge optimizing precision over recall.
- Distractors are generated by the same LLM that generates the correct answer → possible stylistic bias that a well-tuned MLLM (e.g. one that recognizes GPT-4 style) could exploit.
- The number of distinct clips is bounded by 3-min Ego4D clips with ≥ 30 narrations; it covers only part of the Ego4D domains (cooking, household, etc.).
- Human baseline on only 5–9 h of video (~100–180 QAs) → wide CI (~±5%).
- The "10× to 100× longer" claim is based on *median* certificate length, but the distribution (Fig. 2) has mass even on values < 50 s — the dataset itself contains "easy" QAs.
- LLM-heavy pipeline: replicability is undermined if the 2023 GPT-4/Bard/Claude models are no longer accessible.
- The 5 options (vs 4 in Video-MME/MVBench/LVBench) lower the random baseline (20% vs 25%) but make questions more ambiguous for models that struggle to discriminate among similar distractors.

## Cited concepts

- [[temporal-certificate-length]] — concept introduced in the paper, central.
- [[very-long-form-video-understanding]] — temporal category defined by the authors (~100 s certificate).
- [[long-form-video-understanding]] — temporal category (~10 s certificate).
- [[short-video-task]] — temporal category (~1 s certificate).
- [[ego4d]] — source of the video data.
- [[egocentric-video]] — nature of the videos.
- [[video-question-answering]] — task.
- [[multiple-choice-qa]] — format (5 options).
- [[multimodal-large-language-model]] — object of evaluation.
- [[frozenbilm]] — evaluated model.
- [[violet]] — evaluated model.
- [[mplug-owl]] — evaluated model (best non-InternVideo, 31.1%).
- [[internvideo]] — evaluated model (best zero-shot, 32.1%).
- [[gpt-4]] — LLM used for QAW generation.
- [[bard]] — LLM used for QAW generation.
- [[claude]] — LLM used for QAW generation.
- [[chatgpt]] — tested but discarded for quality.
- [[gpt-3]] — tested but discarded for quality.
- [[bleu]] — cited as a metric with shortcomings.
- [[rouge]] — cited as a metric with shortcomings.
- [[mvbench]] — follow-on benchmark that cites it.
- [[video-mme]] — follow-on benchmark adopting certificate length.
- [[lvbench]] — follow-on benchmark adopting clue duration.
- [[next-qa]] — certificate-length comparison.
- [[agqa]] — certificate-length comparison.
- [[lvu]] — second longest dataset in the certificate-length map.
- [[kinetics]] — certificate-length comparison.
- [[ucf101]] — certificate-length comparison.
- [[something-something]] — certificate-length comparison.
- [[hvu]] — certificate-length comparison.
- [[ava-dataset]] — certificate-length comparison.
- [[howto100m]] — cited as a pre-training dataset.
- [[howto100m-vqa]] / [[how2vqa69m]] — cited as a pre-training dataset.
- [[ivqa]] — comparison.
- [[msrvtt]] — comparison.
- [[activitynet-qa]] — comparison.
- [[movieqa]] — cited as an open-ended dataset with text-only bias.
- [[mad-dataset]] — cited as a long-video grounding dataset.
- [[youtube-8m]] — comparison.
- [[datasheets-for-datasets]] — practice cited for dataset documentation.

## Direct quotes

> "EgoSchema, with its long intrinsic temporal structures and diverse complexity, would serve as a valuable evaluation probe for developing effective long-term video understanding systems in the future." (Abstract, p. 1)

> "We introduce the notion of temporal certificate length, a tool to measure the intrinsic temporal length of a benchmark." (§3, p. 3)

> "Datasets with certificate length in the order of 1 second are termed short video tasks. Next, we name datasets with certificate length in the order of 10 seconds as, long-form video tasks. Finally, datasets with certificate length in the order of 100 seconds are termed as, very long-form video tasks." (§3, p. 3)

> "EgoSchema has temporal certificate length 5.7× longer than the second longest certificate length dataset, and 10× to 100× longer than all other video understanding datasets." (§4.1, p. 7)

> "Even the most advanced current video-language understanding systems consisting of billion of parameters achieve very low accuracy in long-from multiple-choice question-answering (< 33%) while humans achieve about 76% accuracy." (§1, p. 3)

> "Surprisingly, we observe that just with 1 fps humans can achieve an impressive 67.2%." (§4.2, p. 9)
