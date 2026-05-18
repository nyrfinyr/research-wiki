---
title: "Kim et al. (2026) — Sink-Token-Aware Pruning for Fine-Grained Video Understanding in Efficient Video LLMs"
type: source
tags: [video-llm, token-pruning, attention-sink, efficient-inference, hallucination, fine-grained-video-understanding, training-free, visual-tokens]
created: 2026-05-15
updated: 2026-05-15
source_path: raw/papers/kim-2026-sink-token-aware-pruning.pdf
source_kind: paper
source_date: 2026-04-22
doi: 10.48550/arXiv.2604.20937
zotero_key: YJ7FS3CI
venue: preprint (arXiv 2604.20937)
authors: [Kibum Kim, Jiwan Kim, Kyle Min, Yueqi Wang, Jinyoung Moon, Julian McAuley, Chanyoung Park]
year: 2026
---

# Kim et al. (2026) — Sink-Token-Aware Pruning for Fine-Grained Video Understanding in Efficient Video LLMs

## TL;DR

Video LLMs pay a huge latency cost because the number of visual tokens grows linearly with the number of frames (e.g. 6,270 tokens for 32 frames on LLaVA-OneVision-7B). Training-free **visual token pruning** methods reduce this cost, but almost all of them are validated on MCQA, where language shortcuts hide their flaws. The authors show that, on **fine-grained** tasks (in particular hallucination evaluation on EventHallusion), these methods collapse severely as the retention ratio decreases. The cause is identified in a small subset of visual tokens, called **sink tokens**: spatially persistent tokens with very high attention but almost no semantic content (typically background patches). When they survive pruning, they occupy the budget and distort the visual evidence. The authors introduce **SToP** (Sink-Token-aware Pruning), a plug-and-play method that computes a **sink score** and injects it both into spatial pruning (**STSP** module) and into temporal pruning (**STTP** module). Applied to VisionZip, FastVid, Holitom and FlashVid on LLaVA-OneVision-7B, LLaVA-Video-7B and Qwen2.5-VL, SToP reduces the *performance drop rate* by up to 9-10 percentage points at 10% token retention, and improves consistently on 5 MCQA benchmarks too (MVBench, VideoMME, NextQA, LongVideoBench, MLVU).

## Main contribution

- Systematic analysis showing that SOTA visual-token-pruning methods collapse on fine-grained tasks (hallucination, compositional reasoning, open-ended generation) far more than on MCQA, and identification of **sink tokens** in the video encoder as the main obstacle [source: raw/papers/kim-2026-sink-token-aware-pruning.pdf §1, §3].
- **Sink score** `s_i` defined as the temporal sum of attentions at the same patch index, raised to a power `w` and min-max normalised, quantifying the "spatial persistence" of a token and distinguishing it from truly informative salient tokens [source: raw/papers/kim-2026-sink-token-aware-pruning.pdf §4.1, Eq. 4].
- **STSP** and **STTP**: two plug-and-play modules that respectively modify the attention score and the temporal similarity to suppress sink tokens. They consistently improve VisionZip, FastVid, Holitom and FlashVid across 8 benchmarks, both fine-grained and MCQA, down to 10% retention [source: raw/papers/kim-2026-sink-token-aware-pruning.pdf §4.2, §5.2, Tabs. 1-3, 6].

## Method

### Target inefficiency (§2.1)

For `T=32` frames and `n_v=196` tokens/frame on LLaVA-OneVision-7B, the sequence has `T·n_v=6,270` visual tokens against `n_q≈20` text tokens. Total FLOPs for `L` LLM layers scale as `L·(4nd² + 2n²d + 2ndm)`, with `n=T·n_v+n_q`: the quadratic `2n²d` term dominates, and reducing `T·n_v` is the main lever [source: raw/papers/kim-2026-sink-token-aware-pruning.pdf §2.1, Eq. 1]. SToP is a training-free technique applied on top of existing pruning methods without fine-tuning.

### Diagnosis of the phenomenon (§3)

- On **EventHallusion** (LLaVA-OneVision-7B, 32 frames), removing the *temporal* pruning component from Holitom (at constant token budget, increasing spatial pruning to compensate) causes an accuracy collapse, while the same intervention has a modest effect on MVBench (Fig. 2a). The distribution of selected tokens (Fig. 2b) reveals that without temporal pruning a small group of patches is selected disproportionately often [source: raw/papers/kim-2026-sink-token-aware-pruning.pdf §3.1].
- Patch-wise visualisation (Fig. 3) shows these tokens have **persistently high attention at fixed spatial coordinates** along the temporal axis, typically in background regions (bottom-left corner: patches 154/155). By analogy with sink tokens in [[transformer]] LLMs (BOS, SEP), the authors call them the visual encoder's **sink tokens** [source: raw/papers/kim-2026-sink-token-aware-pruning.pdf §3.2].
- Causal experiment (Fig. 4 and Appendix B): selectively removing sink tokens (top 10% by frequency) from VisionZip's selected set and replacing them with the next-highest-attention tokens drastically reduces the performance drop on EventHallusion while MCQA improves — confirms they are **directly harmful** to fine-grained understanding [source: raw/papers/kim-2026-sink-token-aware-pruning.pdf §3.3].
- Holitom (temporal+spatial) selects **83% fewer** sink tokens than the no-temporal-pruning variant (384→66): temporal pruning acts as an *implicit sink suppressor*, because background sinks have high cosine similarity across adjacent frames and are therefore merged [source: raw/papers/kim-2026-sink-token-aware-pruning.pdf §3.3].

### Sink score (§4.1)

For visual token `i` (across `T` frames):

`ŝ_i = Σ_t A^t_i`, where `A^t_i` is the attention score (column-wise mean of the CLS-equivalent matrix SoftMax(QKᵀ/√d), Eq. 2) of token `i` in frame `t`. Then `s_i = MinMax-Norm(ŝ_i^w)` with `w=1.1` (Eq. 4). The hyperparameter `w>1` sharpens the distribution of `s_i` so as to concentrate the penalty on the true sinks (Appendix C, Figs. 9, 10b).

### STSP — Sink-Token-aware Spatial Pruning (§4.2)

Modifies the attention score used for spatial selection:

`Ã^t_i = A^t_i − μ_s · s_i` (Eq. 5)

with `μ_s ∈ {0.2, 0.3}` (VisionZip/FastVid). The subtractive term lowers the priority of tokens with high sink score: even if raw attention would pick them, they now yield to genuinely salient tokens.

### STTP — Sink-Token-aware Temporal Pruning (§4.2)

Modifies the temporal merging criterion (original Eq. 3, based on `sim(H^{i,t}_v, H^{i,t+1}_v)>τ`) adding a pro-pruning term:

`P_t = { i | sim(H^{i,t}_v, H^{i,t+1}_v) + μ_t · s_i > τ }` (Eq. 6)

with `μ_t≈0.07` (Holitom). The `μ_t·s_i` term pushes sinks above threshold and forces them into the pruning set even when cosine similarity alone would not.

### Experimental setup (§5.1)

- Backbones: **LLaVA-OneVision-7B** (primary), **LLaVA-Video-7B**, **Qwen2.5-VL** (Appendix F).
- 32 frames, `32×196` visual tokens, retention ratio in {10%, 15%, 20%}.
- Integrated baselines: **VisionZip** (spatial-only), **FastVid** (spatial-only density+attention), **Holitom** (temporal+spatial), **FlashVid** (ICLR'26, tree-based, Appendix D.2), compared against **PruneVid** (SOTA, feature-based).
- Hardware: NVIDIA A6000 48GB.

## Key results

### Fine-grained tasks on LLaVA-OneVision-7B, retention 10% (Tab. 1)

Performance Drop Rate (PDR), macro-average relative to the vanilla model:

- VisionZip baseline: **16.79%** → +SToP: **6.87%** (↓9.92pp).
- FastVid: **15.69%** → +SToP: **6.32%** (↓9.37pp).
- Holitom: **6.22%** → +SToP: **4.80%** (↓1.42pp).
- PruneVid: 9.22% (competitor, does not integrate SToP).

EventHallusion-Binary 10% retention: vanilla 63.33 → VisionZip 50.37 → +SToP 60.39. EventHallusion-Desc 10%: vanilla 38.74 → VisionZip 28.15 → +SToP 36.09. VideoComp-ActivityNet 10%: vanilla 70.06 → FastVid 57.37 → +SToP 68.38.

### MCQA on LLaVA-OneVision-7B (Tab. 2)

At 10% retention, macro-average PDR:

- VisionZip 7.36% → +SToP 3.34% (↓4.02pp).
- FastVid 5.12% → +SToP 2.90% (↓2.22pp).
- Holitom 3.21% → +SToP 2.02% (↓1.20pp).

MVBench: vanilla 58.54, VisionZip 10% drops to 54.16, +SToP climbs back to 57.34. VideoMME-Short: vanilla 71.22 → VisionZip 10% 61.00 → +SToP 65.67.

### Cross-backbone (Tab. 3, LLaVA-Video-7B)

At 10% retention: VisionZip PDR 26.46% → +SToP 7.04%; FastVid 19.66% → 9.66%; Holitom 5.27% → 1.58%. The gain scales with baseline severity.

### Qwen2.5-VL (Tab. 8)

At 10% retention on EventHallusion: VisionZip overall 45.29 → +SToP 46.94; FastVid 46.13 → 47.24. Smaller gain because Qwen2.5-VL already does internal merging (implicitly suppressing sinks).

### Argus benchmark (Tab. 7, retention 10%)

Hallucination (lower is better) — VisionZip 56.19 → +SToP 52.42; Omission — VisionZip 80.57 → +SToP 77.29.

### Few-frame inference (Fig. 6)

VisionZip+SToP at **16 frames** beats vanilla VisionZip at **64 frames** on EventHallusion: SToP improves the accuracy/compute trade-off to the point of making quadrupling frames redundant.

### Ablation (Tab. 4, retention 10%)

VisionZip without/with STSP: PDR 20.46% → 4.64%. Holitom: baseline 3.87% → STSP only 1.94% → STSP+STTP **1.17%** (best). STTP is complementary to and not a replacement for STSP.

### Comparison with naive approaches (Fig. 7)

On VisionZip / EventHallusion:
- **Hard Pruning** (discard top-K% of most attended tokens before pruning) beats vanilla VisionZip, peaking at K=10% — confirms top-attended tokens are often sinks.
- **Attention Redistribution** (à la Kang et al. 2025, redistributing attention from sinks to the rest) is worse than both Hard Pruning and SToP, indicating the point is not to redistribute but to exclude sinks from selection altogether.

### Hyperparameter sensitivity (Appendix D.4)

Optimal `μ_s` ≈0.03 on VisionZip (beyond this threshold over-penalisation appears). Optimal `w` 1.1, stable in [1.0,1.15]. Optimal `μ_t` 0.07 on Holitom. SToP is more sensitive to `μ_s` than to `w`.

## Stated limitations

- SToP is specific to **attention-based pruning**: it does not apply directly to *feature-based* methods like PruneVid or DivPrune because they do not use attention scores. Still, the authors argue that SToP applied to attention-based methods nonetheless beats feature-based PruneVid (Appendix E).
- Gains are smaller when the baseline already implicitly suppresses sinks (FlashVid with tree-merging, Qwen2.5-VL with internal merging).
- Future work: extend the sink-aware principle to feature-based pruning by identifying tokens with **high-norm features** and high similarity that play an analogous role in feature space.

## Open questions / critiques

- The sink score is computed as a sum of attentions in the vision encoder, *before* the LLM. It is unclear how it behaves if the vision encoder is subject to quantisation constraints (cf. Kim et al. 2025 "Activation quantization needs prefixing registers") or if sinks shift with different patch sizes.
- All experiments use 32 frames: what happens with long videos (>2 min, LongVideoBench, MLVU) and thousands of frames? The temporal sum defining `s_i` could become less discriminative.
- The optimal `μ_s` changes per backbone (0.3 VisionZip, 0.2 FastVid, 0.02 FlashVid, 0.03 theoretical optimum) — a mechanism to choose it without grid search is missing.
- Connection with work on **registers** (Darcet et al. 2023, Jiang et al. 2025) for ViTs: are the sinks identified here the same tokens that registers ([[vit-registers]]) try to "absorb"? If so, SToP is a training-free replacement.
- The paper attributes the phenomenon to "central fixation bias" (Tatler 2007), i.e. salient items sit in the centre while sinks populate the background — a hypothesis not quantified beyond visualisation.

## Cited concepts

- [[video-llm]]
- [[visual-token-pruning]]
- [[spatial-pruning]]
- [[temporal-pruning]]
- [[attention-sink]]
- [[sink-token]]
- [[sink-score]]
- [[stsp]] (Sink-Token-aware Spatial Pruning)
- [[sttp]] (Sink-Token-aware Temporal Pruning)
- [[hallucination-evaluation]]
- [[event-hallusion]]
- [[videocomp]]
- [[vcg-bench]]
- [[mvbench]]
- [[video-mme]]
- [[next-qa]]
- [[longvideobench]]
- [[mlvu]]
- [[argus-benchmark]]
- [[llava-onevision]]
- [[llava-video]]
- [[qwen2-5-vl]]
- [[siglip]]
- [[visionzip]]
- [[fastvid]]
- [[holitom]]
- [[prunevid]]
- [[flashvid]]
- [[dycoke]]
- [[cls-token]]
- [[kv-cache]]
- [[vit-registers]]
- [[logit-lens]]
- [[fine-grained-video-understanding]]
- [[mcqa]]

## Direct quotes

> "we identify sink tokens — semantically uninformative tokens that attract excessive attention — as a key obstacle to fine-grained video understanding." (Abstract, p. 1)

> "high attention scores persist at fixed spatial coordinates throughout the temporal sequence … we refer to these spatially persistent high-attention tokens as sink tokens." (§3.2, p. 6)

> "temporal pruning reduces sink tokens by 83% (384 → 66)." (§3.3, p. 7)

> "Sink tokens in LLMs must be preserved to maintain softmax stability, whereas sink tokens in vision encoders should be actively pruned, as retaining them crowds out salient tokens and hinders fine-grained understanding." (Appendix A, p. 19)
