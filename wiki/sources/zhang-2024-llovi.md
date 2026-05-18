---
title: "Zhang et al. (2024) — A Simple LLM Framework for Long-Range Video Question-Answering (LLoVi)"
type: source
tags: [video-llm, long-video-understanding, caption-based, training-free, llm-aggregation, multi-round-summarization, video-qa]
created: 2026-05-15
updated: 2026-05-15
source_path: raw/papers/zhang-2024-llovi.pdf
source_kind: paper
source_date: 2024-10-10
doi: 
zotero_key: GRJDYA8T
venue: EMNLP 2024 (Findings)
authors: [Ce Zhang, Taixi Lu, Md Mohaiminul Islam, Ziyang Wang, Shoubin Yu, Mohit Bansal, Gedas Bertasius]
year: 2024
---

# A Simple LLM Framework for Long-Range Video Question-Answering

## TL;DR

Zhang et al. present **LLoVi**, a two-stage *training-free* framework for long-range Video QA: (1) a **short-term visual captioner** (LaViLa/BLIP-2/CogAgent/LLaVA) textually describes short 0.5–8 s clips densely sampled from the video; (2) an **LLM** (GPT-3.5/4, Llama3) aggregates the concatenated captions to answer the question. To handle noisy captions they introduce a **multi-round summarization prompt**: (C, Q) → S (question-conditioned summary) → (S, Q, A) → answer. No specialized modules for long-range modeling (no memory queue, no state-space, no graph). State of the art on EgoSchema (full set 61.2% with GPT-4), NExT-QA (+10.2% above the previous SOTA), IntentQA (+6.2%), NExT-GQA for grounded VideoQA [source: raw/papers/zhang-2024-llovi.pdf Abstract, §4.3].

## Main contribution

- "Decomposed" two-stage framework that is purely training-free and explicitly avoids memory bank/state-space/graph: short-term captioner + LLM aggregator [source: raw/papers/zhang-2024-llovi.pdf §1, §3].
- **Multi-round summarization prompt** (C, Q) → S → (S, Q, A): the summary is conditioned on the question, reducing noise and redundancy in the captions. The (C) → S and (C, Q, A) → S variants perform worse [source: raw/papers/zhang-2024-llovi.pdf §3.2, Tab.5].
- Broad empirical study on EgoSchema: visual captioner (LaViLa best), LLM choice (GPT-4 > Llama3-70B > GPT-3.5), clip length (1 s optimal), sampling rate (8× efficiency with 2% drop).
- Extension to grounded Video-QA on NExT-GQA with LLM-based temporal localization [source: raw/papers/zhang-2024-llovi.pdf §4.3].
- Public codebase, strong baseline for the LVQA community.

## Method

**Stage 1 — Short-term captioning (§3.1)**: video $V$ → $N_v$ non-overlapping clips $\{v_m\}$. Each clip $v_m \in \mathbb{R}^{T_v\times H\times W\times 3}$ is fed to the captioner $\phi$ which produces text $c_m = \phi(v_m)$. Default: LaViLa on 1 s clips for EgoSchema; CogAgent at 0.5 fps for NExT-QA/IntentQA/NExT-GQA.

**Stage 2 — LLM aggregation (§3.2)**: concatenation $C = [c_1,\dots,c_{N_v}]$. Standard prompt: "Please provide a single-letter answer (A,B,C,D,E) to … {Q}. You are given language descriptions: {C}. Choices: {A}".

**Multi-round summarization prompt (§3.2, Fig.3)**:
1. **Round 1**: prompt "You are given language descriptions of a video: {C}. Please give me a {N_w} word summary." where $(C,Q)$ can replace $C$ to condition the summary. Output: $S$.
2. **Round 2**: prompt that uses $S$ in place of $C$ + question + answer candidates → letter answer.

Ablation (Tab.5) of the summary input:
- $(C)\to S$: 55.0
- $(C,Q)\to S$: **58.8** (+3.6 vs baseline)
- $(C,Q,A)\to S$: 54.8 (degrades — long answer candidates distract)

**Training-free aspect**: no parameters updated; all "long-range modeling" is delegated to the frozen LLM. Captioners are also off-the-shelf.

## Key results

**Captioner ablation (Tab.1)** — EgoSchema Subset, GPT-3.5 fixed:

| Captioner | Type | Ego4D pretraining | Acc |
|---|---|---|---|
| EgoVLP | clip | yes | 46.6 |
| LLaVA | frame | no | 45.2 |
| BLIP-2 | frame | no | 50.6 |
| LaViLa | clip | yes | **55.2** |
| Oracle | clip | — | 66.0 |

**LLM ablation (Tab.2)** — LaViLa fixed:

| LLM | Size | Acc |
|---|---|---|
| Mistral | 7B | 50.8 |
| Llama3-8B | 8B | 52.2 |
| Llama3-70B | 70B | 56.8 |
| GPT-3.5 | 175B | 55.2 |
| GPT-4 | 1.8T | **61.2** |

**Clip length (Tab.3)**: 1 s = 55.2, 2 s = 54.8, 4 s = 53.4, 8 s = 53.4 ⇒ short clips are optimal.

**Sampling rate (Tab.4)**: 1 = 55.2, 1/2 = 55.2, 1/4 = 54.6, 1/8 = 53.2 ⇒ 8× efficiency with only a 2% drop.

**Prompt comparison (Tab.6)**:
- Standard: 55.2
- Plan-and-Solve: 55.2
- Chain-of-Thought: 57.8
- **Ours**: **58.8**

**SOTA (paper §4.3, not fully reported in the snippet)**:
- EgoSchema full set: **61.2%** (GPT-4 + LaViLa) — best reported at the time
- NExT-QA: +10.2% over previous SOTA
- IntentQA: +6.2% over previous SOTA
- NExT-GQA: outperforms all prior grounded VQA methods

## Stated limitations

- Strong dependence on captioner quality: the LaViLa→ground-truth oracle gap is 10.8 points (Tab.1) [source: raw/papers/zhang-2024-llovi.pdf §4.2.1].
- LaViLa is pre-trained on Ego4D ⇒ excellent on EgoSchema, but on different domains a suitable captioner is needed (the paper switches to CogAgent for NExT-QA).
- LLM cost: GPT-4 is expensive; they use GPT-3.5 as the "best cost/perf" default.
- Caption-based ⇒ loss of fine-grained visual info (no OCR, no small objects) not described in the captions.
- Long token sequence: $>$1K-word captions can confuse smaller LLMs — motivation for the multi-round prompt.

## Open questions / critiques

- Subsequent end-to-end VLM methods ([[arnab-2025-temporal-chain-of-thought]], [[tang-2025-adaptive-keyframe-sampling]]) have surpassed LLoVi (e.g. TCoT on NExT-QA 81.0 vs LLoVi 73.8), suggesting that operating directly on frames removes the captioner bottleneck. LLoVi remains relevant when a long-context VLM is unavailable.
- The hypothesis that "noisy" captions are filtered by the summary is qualitative: no robustness ablation with adversarially noisy captions.
- Possible combination with [[adaptive-keyframe-sampling]] to reduce the number of captions (currently one caption per clip = dense).
- Extension to videos with audio/speech not addressed.
- Cost analysis: a single GPT-4 call over 3 min of video with LaViLa captions = ~$0.04; does not scale well to 1-hour video.

## Cited concepts

- [[video-llm]]
- [[long-video-understanding]] / [[long-range-video-qa]]
- [[training-free-methods]]
- [[caption-based-vqa]] / [[short-term-captioning]]
- [[multi-round-summarization]] — central concept
- [[chain-of-thought]] — prompt comparison
- [[plan-and-solve]] — prompt comparison
- [[lavila]] — primary captioner on Ego4D
- [[blip-2]] — image-level captioner
- [[egovlp]] — captioner pre-trained on Ego4D
- [[cogagent]] — captioner used on NExT-QA
- [[gpt-3-5]], [[gpt-4]], [[llama3]], [[mistral]] — LLM backends
- [[egoschema]] — benchmark, primary focus
- [[next-qa]] — benchmark
- [[intentqa]] — benchmark
- [[next-gqa]] — grounded VQA benchmark
- [[movieqa]] — cited as "benchmark with linguistic bias"
- [[activitynet-qa]] — cited as "requires only short clips"
- [[ego4d]] — captioner's upstream dataset
- [[memviti]], [[moviechat]] — memory-based competitors
- [[s4nd]], [[vis4mer]], [[s5]] — state-space competitors

## Direct quotes

> "Our method decomposes the short- and long-range modeling aspects of LVQA into two stages." [source: raw/papers/zhang-2024-llovi.pdf Abstract]

> "Our newly proposed multi-round summarization prompt leads to the most significant boost in performance (+3.6%) among the prompts we have tried." [source: raw/papers/zhang-2024-llovi.pdf §1]
