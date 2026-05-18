---
title: Visual Token Pruning
type: concept
tags: [efficient-inference, mllm, video-llm, kv-cache]
created: 2026-05-15
updated: 2026-05-15
---

# Visual Token Pruning

Family of *training-free* methods that, during inference of an MLLM or Video LLM, **select a subset of the visual tokens** before passing them to the LLM (or during the first layers of the LLM), cutting the quadratic `O(n²d)` term of attention over visual tokens. The operational motivation is that the number of visual tokens grows linearly with resolution (and with the number of frames, for video LLMs), and quickly dominates the text budget: e.g. 6,270 visual tokens for 32 frames on LLaVA-OneVision-7B vs ~20 textual tokens [source: raw/papers/kim-2026-sink-token-aware-pruning.pdf §2.1, Eq. 1]. It is distinct from *architectural* compression (Q-Former) because it acts post-hoc without re-training.

## Key claim / Technique

- **Macro-family**: FastV, VisionZip, FastVid, HoliTom, PruneVid, FlashVid, DyCoke. They differ in (i) granularity (spatial-only vs spatial+temporal), (ii) importance signal (raw attention, density+attention, feature similarity), (iii) application granularity (input-level vs layer-level).
- **Validation gap**: Kim et al. (2026) show that nearly all these methods are validated on **MCQA** (MVBench, VideoMME, NextQA, LongVideoBench, MLVU), where linguistic shortcuts hide their flaws. On **fine-grained** tasks (in particular hallucination on EventHallusion) they collapse dramatically as the retention ratio decreases [source: raw/papers/kim-2026-sink-token-aware-pruning.pdf §1, §3].
- **Cause of the collapse: visual sink tokens**: a small subset of tokens (spatially persistent background patches) has high attention but almost no semantics. When they survive pruning, they occupy the budget and distort the visual evidence. Holitom (temporal+spatial) selects 83% fewer sink tokens than the variant without temporal pruning — temporal pruning acts as an *implicit sink-suppressor* [source: raw/papers/kim-2026-sink-token-aware-pruning.pdf §3.2-3.3, Fig. 3-4].
- **SToP — Sink-Token-aware Pruning** (Kim 2026): plug-and-play, defines `sink score` `s_i = MinMax-Norm((Σ_t A^t_i)^w)` with `w=1.1`. STSP modifies the spatial selection score `Ã^t_i = A^t_i − μ_s · s_i`; STTP adds `μ_t·s_i` to the temporal merging criterion. On LLaVA-OneVision-7B with 10% retention, it reduces the *performance drop rate* by 9-10pp [source: raw/papers/kim-2026-sink-token-aware-pruning.pdf §4.1-4.2, Tab. 1].
- **Contrast with [[causal-mask-modulation]]** (Liu 2026): AIF does *not* prune — masked visual tokens remain in the context but are **disconnected only from the visual→text interaction**. Vision-to-vision aggregation is preserved, so visual information is not eliminated. On the comparison benchmarks AIF beats ViCrop (training-free) and CCA (training-based) [source: raw/papers/liu-2026-adaptive-information-flow.pdf §4.3, Tab. 5].

## Variants / Extensions

- **Spatial-only**: FastV, VisionZip, FastVid (per-frame patch selection).
- **Spatial+Temporal**: Holitom, PruneVid (cross-frame merging of similar tokens).
- **Tree-based**: FlashVid (ICLR'26, Appendix D.2 of Kim 2026).
- **Sink-aware**: SToP (Kim 2026) is applied on top of VisionZip, FastVid, Holitom, FlashVid, improving all of them *consistently*.

## Related concepts

- [[attention-sink]] — phenomenon that explains the failure of many pruning methods.
- [[visual-attention-sink]] — visual version of the sink, direct target of SToP.
- [[kv-cache]] — visual pruning directly reduces the KV-cache size.
- [[causal-mask-modulation]] — alternative that modulates the mask instead of removing tokens.
- [[q-former]] — *architectural* alternative (training-based) for visual compression.

## Sources

- [[kim-2026-sink-token-aware-pruning]] — diagnosis of the visual sink token as the cause of the fine-grained collapse; introduces STSP/STTP.
- [[liu-2026-adaptive-information-flow]] — contrast: AIF does *not* prune but modulates the mask preserving vision-to-vision.
