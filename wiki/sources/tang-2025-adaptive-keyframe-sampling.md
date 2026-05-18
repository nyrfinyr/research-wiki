---
title: "Tang et al. (2025) — Adaptive Keyframe Sampling for Long Video Understanding"
type: source
tags: [video-llm, long-video-understanding, keyframe-sampling, training-free, video-qa, prompt-conditioned-sampling]
created: 2026-05-15
updated: 2026-05-15
source_path: raw/papers/tang-2025-adaptive-keyframe-sampling.pdf
source_kind: paper
source_date: 2025-02-28
doi: 
zotero_key: U2PCIS2B
venue: arXiv preprint (CVPR 2025)
authors: [Xi Tang, Jihao Qiu, Lingxi Xie, Yunjie Tian, Jianbin Jiao, Qixiang Ye]
year: 2025
---

# Adaptive Keyframe Sampling for Long Video Understanding

## TL;DR

Tang et al. introduce **Adaptive Keyframe Sampling (AKS)**, a *training-free* plug-and-play module that replaces uniform pre-VLM sampling. AKS formalizes selecting $M$ keyframes as the optimization of two terms: (1) **relevance** $s(Q,F_t)$ between prompt $Q$ and each candidate frame $F_t$ (computed via BLIP/CLIP image-text matching) and (2) **coverage** $c(\mathcal{I})$ of the temporal distribution (via Ripley's K-function on recursive bins). The *ADA* algorithm (judge-and-split) alternates between top-score sampling and recursive binning. On LongVideoBench and Video-MME, integrated with Qwen2-VL, LLaVA-OV, and LLaVA-Video-7B, AKS delivers consistent gains: LLaVA-Video-7B 58.9→62.7 (LVB) and 64.4→65.3 (V-MME), even surpassing LLaVA-Video-72B and proprietary models like GPT-4V/Gemini-1.5-Flash with a 7B model [source: raw/papers/tang-2025-adaptive-keyframe-sampling.pdf Abstract, §4.2].

## Main contribution

- Explicit formulation of keyframe selection as the problem $\arg\max \sum_t s(Q,F_t) + \lambda \cdot c(\mathcal{I})$ with relevance + coverage (Eq.2) [source: raw/papers/tang-2025-adaptive-keyframe-sampling.pdf §3.2].
- Coverage approximation via discretized K-function: recursive partitioning of the time-axis into bins, penalizing imbalance ($|m_1 - m_2|$) — up to $L \le \lceil\log_2 M\rceil$ levels [source: raw/papers/tang-2025-adaptive-keyframe-sampling.pdf §3.2].
- **ADA** algorithm (Adaptive Sampling, §3.3): at each tree node, if $s_\text{top}-s_\text{all}>s_\text{thr}$ it directly returns the bin's top-M frames (TOP mode); otherwise it splits the bin in two and distributes keyframes evenly (BIN mode), recursively.
- Plug-and-play: no VLM parameter modified; only the sampling algorithm is replaced. Three baselines: TOP ($\lambda=0$), BIN ($\lambda\to\infty$), UNI (uniform = LLaVA-Video default).
- Systematic study of the role of visual pre-filtering, showing that the relevance oracle yields even larger gains (gap to be closed with better scorers).

## Method

**Setup (§3.1)**: video $V \in \mathbb{R}^{T\times W\times H\times C}$, prompt $Q$, MLLM $G(\{F_t\})$ with capacity $M$. Goal: keyframe set $\mathcal{I}\subseteq\{1,\dots,T\}$ with $|\mathcal{I}|=M$ that maximizes useful information [source: raw/papers/tang-2025-adaptive-keyframe-sampling.pdf §3.1].

**Pipeline (Fig.2)**:

1. Pre-sample candidate frames at 1 fps (or less for efficiency).
2. For each candidate $F_t$, compute $s(Q,F_t)$ via BLIP ITM (default), CLIP, or Sevila. No forward pass on the final VLM [source: raw/papers/tang-2025-adaptive-keyframe-sampling.pdf §3.2, §4.1].
3. Run **ADA** recursively:
   - State: temporal bin $[a,b)$ with $k$ keyframes to allocate.
   - Compute $s_\text{all}$ = mean of the scores in the bin, $s_\text{top}$ = mean of the top-k scores.
   - If $k=1$ or $s_\text{top}-s_\text{all}>s_\text{thr}$ ⇒ return the top-$k$ frames (TOP mode).
   - Otherwise split into $[a,(a+b)/2)$ and $[(a+b)/2,b)$, allocate $\lceil k/2\rceil$ and $\lfloor k/2\rfloor$, recurse.
   - Stop at maximum depth $L$ [source: raw/papers/tang-2025-adaptive-keyframe-sampling.pdf §3.3, Fig.3].
4. Extract visual tokens from the selected frames and pass them to the standard VLM.

**Hyperparameters**: $s_\text{thr}=0.6\div 0.8$, $L=3\div 5$ — typical. LongVideoBench prefers small $L$ (focused questions); Video-MME prefers larger $L$ (multi-moment questions) [source: raw/papers/tang-2025-adaptive-keyframe-sampling.pdf §4.4, Tab.5].

**Training-free aspect**: no VLM training, no BLIP/CLIP retriever fine-tuning; entirely plug-and-play.

## Key results

**Main (Tab.1)** — accuracy %, 32 or 64 frames into the VLM:

| Method | LVBench val | Video-MME |
|---|---|---|
| GPT-4V (256 frames) | 61.3 | 59.9 |
| GPT-4o (256 frames) | 66.7 | 71.9 |
| Gemini-1.5-Flash (256 frames) | 61.6 | 70.3 |
| Qwen2-VL 7B (32 frames) | 55.5 | 57.6 |
| **Qwen2-VL + AKS** | **60.5** (+5.0) | **59.9** (+2.3) |
| LLaVA-OV 7B (32 frames) | 54.8 | 56.5 |
| **LLaVA-OV + AKS** | **59.3** (+4.5) | **58.4** (+1.9) |
| LLaVA-Video 7B (64 frames) | 58.9 | 64.4 |
| **LLaVA-Video + AKS** | **62.7** (+3.8) | **65.3** (+0.9) |

LLaVA-Video-7B + AKS surpasses LLaVA-Video-72B (61.9 LVB) and GPT-4V/Gemini-1.5-Flash at 256 frames, using only 64 frames [source: raw/papers/tang-2025-adaptive-keyframe-sampling.pdf §4.2].

**Sampling strategy (Tab.2)** — LLaVA-Video-7B:

| Sampling | LVB | V-MME |
|---|---|---|
| UNI | 58.9 | 64.4 |
| TOP | 62.4 | 63.7 |
| BIN | 60.2 | 65.2 |
| **ADA** | **62.7** | **65.3** |

ADA combines the strengths: TOP is best for LVB (single-moment questions), BIN for V-MME (multi-moment questions).

**Candidate sampling frequency (Tab.3)**: even at 0.1 fps the results beat the uniform baseline; at 0.25 fps performance ≈ 1 fps on Video-MME, suggesting a large efficiency margin.

**VL scorer (Tab.4)**: BLIP best on LVB (object-level), CLIP best on V-MME (global perception). Sevila intermediate.

**$L \times s_\text{thr}$ (Tab.5)**: LVB best at $L\in\{3,4\}, s_\text{thr}\in\{0.2,0.4\}$; V-MME best at $L\in\{4,5\}, s_\text{thr}\in\{0.6,0.8\}$.

**Adaptivity (Fig.6)**: on the same video, AKS picks different keyframes for different questions → flexibility.

## Stated limitations

- The coverage metric approximated via bins is a heuristic; global optimum not guaranteed.
- Computational overhead of the BLIP/CLIP forward pass over many frames (reduced via low-fps sampling) [source: raw/papers/tang-2025-adaptive-keyframe-sampling.pdf §4.4].
- The scorer (BLIP/CLIP) performance bounds the ceiling: no learning of the scorer from VLM feedback.
- Not tested on MVBench, LongVideoBench-test, EgoSchema; analysis on 2 benchmarks.
- On Video-MME, where many questions require "high-level comprehension", the gain is more modest (+0.9 points for LLaVA-Video-7B).

## Open questions / critiques

- Direct comparison with [[arnab-2025-temporal-chain-of-thought]]: TCoT uses the VLM itself as the selector (no external scorer), AKS uses CLIP/BLIP — which is better as a function of compute budget?
- Combination with [[doorenbos-2026-video-panels]]: frames selected by AKS could be panel-ized to further multiply temporal coverage.
- Effective end-to-end latency (BLIP forward × $T_\text{cand}$) not reported in the tables.
- Extension to video subtitle / audio modalities (the paper explicitly avoids subtitles).
- Alignment between $s(Q,F_t)$ and the effective notion of "relevance" from the VLM: a supervised keyframe dataset exists → it could become a training signal.

## Cited concepts

- [[video-llm]]
- [[long-video-understanding]]
- [[keyframe-sampling]] — central concept
- [[training-free-methods]]
- [[image-text-matching]] — relevance score via BLIP ITM
- [[blip-2]] — scorer
- [[clip]] — alternative scorer
- [[sevila]] — alternative scorer
- [[ripleys-k-function]] — coverage formalization
- [[lvbench]] / [[longvideobench]] — benchmark
- [[video-mme]] — benchmark
- [[qwen2-vl]], [[llava-onevision]], [[llava-video]] — backbones
- [[lmms-eval]] — toolkit
- [[uniform-sampling]] — baseline
- [[siglip]] — cited as LLaVA-Video vision encoder
- [[moviechat]], [[ma-lmm]], [[videostreaming]], [[longvlm]], [[goldfish]] — competitors on token reduction

## Direct quotes

> "It inserts a plug-and-play module known as keyframe selection, which aims to maximize the useful information with a fixed number of video tokens." [source: raw/papers/tang-2025-adaptive-keyframe-sampling.pdf Abstract]

> "Our study reveals the importance of information pre-filtering in video-based MLLMs." [source: raw/papers/tang-2025-adaptive-keyframe-sampling.pdf Abstract]
