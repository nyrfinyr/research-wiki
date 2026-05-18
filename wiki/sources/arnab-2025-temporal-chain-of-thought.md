---
title: "Arnab et al. (2025) — Temporal Chain of Thought: Long-Video Understanding by Thinking in Frames"
type: source
tags: [video-llm, long-video-understanding, chain-of-thought, frame-selection, training-free, inference-time-scaling, video-qa]
created: 2026-05-15
updated: 2026-05-15
source_path: raw/papers/arnab-2025-temporal-chain-of-thought.pdf
source_kind: paper
source_date: 2025-07-01
doi: 10.48550/arXiv.2507.02001
zotero_key: 87JLN9KU
venue: arXiv preprint (Google DeepMind)
authors: [Anurag Arnab, Ahmet Iscen, Mathilde Caron, Alireza Fathi, Cordelia Schmid]
year: 2025
---

# Temporal Chain of Thought: Long-Video Understanding by Thinking in Frames

## TL;DR

Arnab et al. propose **Temporal Chain of Thought (TCoT)**: an inference strategy for video QA in which *the same VLM* is used first to select the relevant frames (with a textual justification) and then to answer the question. No external captioners and no tools: a single VLM, two calls. The final variant **Dynamic-Segment TCoT** partitions the video into $l$ segments, runs a *Single-Step* over each with $s$ sampled frames per segment, concatenates the selected indices, and aggregates them for the final answer. On LVBench (avg. 68 min/video) it gains +11.4 points with a 32K context vs. the 32K baseline; with 700K total tokens (iterative at 32K), it beats the non-iterative 700K baseline by +2.8 points. SOTA on EgoSchema, LVBench, OpenEQA, NExT-QA with Gemini 1.5 Flash; the gain generalises to Qwen-2.5-VL-7B and GPT-4o-mini [source: raw/papers/arnab-2025-temporal-chain-of-thought.pdf Abstract, §4.3].

## Main contribution

- A new training-free *inference strategy* for video QA that decomposes $a = H(G(x,q), q)$ with $G$ = context aggregation and $H$ = answering, both delegated to the same VLM [source: raw/papers/arnab-2025-temporal-chain-of-thought.pdf §3.2, Eq.2-3].
- *Single-Step TCoT*: the VLM produces in JSON the list of relevant frame IDs plus a textual *justification* (Fig.3), CoT-inspired: the selected frames are "visual thoughts".
- *Dynamic-Segment TCoT*: handles videos longer than the context window by splitting them into $l$ non-overlapping segments of $m=N/l$ frames, sampling $s$ frames per segment for selection, then refining the union $\hat x$ uniformly up to $k - u$ frames, where $u$ extra uniform frames ($u \ll N$) guarantee minimum coverage [source: raw/papers/arnab-2025-temporal-chain-of-thought.pdf §3.2, Eq.5].
- Inference-time scaling study: as $l$ grows the total token count grows and accuracy improves smoothly, while the long baseline saturates around 1000 frames.
- Adaptivity analysis: the fraction of selected frames varies by question type (temporal grounding ~7%, summarization ~25%), aligned with human time-reference annotations (Fig.6).

## Method

**Notation (§3.1)**: input video $x \in \mathbb{R}^{T\times H\times W\times C}$, question $q$ → answer $a$. Context limit $k$ in tokens; Gemini 1.5 Flash uses 258 tokens/frame, $k=32K$ ⇒ ~120 frames [source: raw/papers/arnab-2025-temporal-chain-of-thought.pdf §4.1].

**Single-Step TCoT (§3.2)**: the VLM receives up to $N$ indexed frames and the prompt in Fig.3, returns JSON `{frame_ids:[...], justification: "..."}`. The selected frames $\hat x = \{x_i\}_{i\in S}$ are augmented with $u$ uniformly sampled frames ($u \ll N$, default $u=20$) for contextual disambiguation. Final context $c = \hat x \cup x[u]$ [source: raw/papers/arnab-2025-temporal-chain-of-thought.pdf §3.2, Fig.3].

**Dynamic-Segment TCoT (§3.2)**: video → $l$ segments of $m=N/l$ frames; each segment $x_i$ is downsampled to $s$ frames ($s=64$ default), then $S(x_i[s], q)$ produces the indices. Concatenation $\hat x = [S(x_1[s],q), \dots, S(x_l[s],q)]$. If $|\hat x| > k - u$, uniformly sub-sample to $k-u$ frames; add the global uniform $x[u]$. Total cost = $l\cdot s$ frames, independent of $N$ [source: raw/papers/arnab-2025-temporal-chain-of-thought.pdf §3.2, Eq.5].

**Training-free aspect**: everything leverages the VLM's instruction-tuning; no fine-tuning, no separate captioner (unlike LangRepo/VideoAgent/LLoVi), no retriever, no tool calling.

**Backbones tested**: Gemini-1.5-flash-002 (primary), Qwen-2.5-VL-7B, GPT-4o-mini.

## Key results

**Context aggregation ablation (Tab.1)** — 120 input frames, Gemini Flash 32K:

| Method | EgoSchema | LVBench |
|---|---|---|
| Baseline inference | 72.6 | 50.3 |
| Single-step | 74.8 | 48.3 |
| Hierarchical | 74.0 | 53.3 |
| Dynamic-segment (ours, $l=12$, $s=64$) | **75.2** | **61.7** |

**Computation vs. accuracy (Fig.4)** on LVBench: TCoT grows smoothly from $l=2$ to $l=32$ (31K → 697K total tokens), 50.3 → 61.7. Baseline at 700K (2700 native frames) only reaches 58.9. Self-consistency CoT (sampling+voting) ineffective (≈51) [source: raw/papers/arnab-2025-temporal-chain-of-thought.pdf §4.2].

**Alternative aggregation (Tab.2)** — all use the same segmentation, fixed 120 frames:

| Selection | EgoSchema | LVBench |
|---|---|---|
| Uniform | 72.6 | 50.3 |
| Feature-sim (Q→captions SigLIP) | 73.8 | 52.1 |
| Feature-sim (Q→frames SigLIP) | 73.4 | 54.4 |
| VLM concise captions | 74.0 | 58.3 |
| VLM long captions | 72.8 | 60.4 |
| VLM direct (ours) | **75.2** | **61.7** |
| Oracle annotated time-refs | — | 67.4 |

**SOTA (Tab.3)** — LVBench: TCoT(Gemini Flash, 32K context, 672K total) = **61.7** vs. previous best Gemini 1.5 Flash 58.9 at 700K (single shot). TCoT(GPT-4o-mini, 22K) = 53.5 vs. baseline 48.0 (+5.5). TCoT(Qwen2.5-VL-7B, 128K) = 49.1 vs. 46.1. — EgoSchema full: TCoT(Gemini) = 69.1 vs. baseline 67.8. — NExT-QA: 81.0 vs. 80.0. — OpenEQA: 69.2 vs. 68.0.

**Adaptivity (Fig.6)**: % of selected frames varies 6–25% across question types; aligned with LVBench "time references" annotations.

## Stated limitations

- Requires a VLM with strong *instruction following* for the zero-shot selection function; less aligned models would require ad-hoc RL/fine-tuning (§5).
- Failure mode (Fig.5): the selection may miss critical frames (e.g. "drop of water as a mirror") and no downstream correction is possible.
- Oracle headroom on LVBench = 67.4 vs. 61.7 ⇒ the selector is not perfect.
- The whole analysis runs on proprietary VLMs or a 7B open-source model; not tested on small local models.

## Open questions / critiques

- Combination with [[adaptive-keyframe-sampling]] (CLIP/BLIP scoring) to pre-filter frames before handing them to the VLM-selector → further compute reduction?
- Can a model be trained with RL to improve the selection function, as the limitations suggest? (Future direction.)
- How does it react to videos with very frequent scene cuts? The ablation does not address it.
- The JSON-strict prompt is brittle: what happens with small VLMs that do not respect the format? The paper handles it with a fallback `S=[1..N]`.
- The end-to-end wall-clock latency overhead vs. the 32K baseline is not reported (only token count).

## Cited concepts

- [[video-llm]]
- [[long-video-understanding]]
- [[chain-of-thought]] — source of the intuition
- [[inference-time-scaling]] — paradigm
- [[training-free-methods]]
- [[keyframe-sampling]] / [[frame-selection]]
- [[gemini-1-5-flash]] — primary backbone
- [[qwen2-5-vl]] — secondary backbone
- [[gpt-4o-mini]] — secondary backbone
- [[egoschema]] — benchmark
- [[lvbench]] — benchmark, largest gain
- [[openeqa]] — embodied benchmark
- [[next-qa]] — benchmark
- [[llovi]] — LLM-based captioning baseline
- [[videoagent]] — tool-using baseline
- [[videotree]] — clustering baseline
- [[language-repository]] — summarization baseline
- [[lost-in-the-middle]] — motivating phenomenon (Liu et al. 2024)
- [[ruler]] — long-context benchmark cited
- [[self-consistency-cot]] — alternative inference-scaling baseline
- [[siglip]] — used as feature retriever in baseline
- [[bolt]], [[longvu]], [[lvnet]] — video-QA competitors

## Direct quotes

> "We use the VLM itself to iteratively identify and extract the most relevant frames from the video, which are then used for answering." [source: raw/papers/arnab-2025-temporal-chain-of-thought.pdf Abstract]

> "On longer videos of more than 1 hour on LVBench, our approach using a context window of 32K outperforms the same VLM using standard inference with a 700K context window by 2.8 points." [source: raw/papers/arnab-2025-temporal-chain-of-thought.pdf Abstract]
