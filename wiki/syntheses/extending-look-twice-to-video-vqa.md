---
title: Extending Look Twice to Video-VQA — design memo
type: synthesis
tags: [video-vqa, mllm, attention, training-free, evidence-highlighting, attention-sinks, video-llm]
created: 2026-05-18
updated: 2026-05-18
revised: 2026-05-18
---

# Extending Look Twice to Video-VQA — design memo

## Thesis

The training-free two-pass inference of [[sources/morini-2026-look-twice]] (LoT) can be transferred from image KB-VQA to general Video-VQA, provided three of its components are rethought for the temporal dimension: layer selection for attention reading, the definition of "sink token", and the visual highlighting mechanism. The supporting primitives already exist across [[sources/kim-2025-map-the-flow]], [[sources/kim-2026-sink-token-aware-pruning]] and [[sources/liu-2025-selfelicit]]; what is missing is the integration on a modern VideoLLM backbone (Qwen3-VL).

## What each work contributes

**[[sources/morini-2026-look-twice]] — the method to transfer.** Three reusable ingredients: (i) `object-token → visual-token` attention aggregated over layers where multimodal grounding emerges; (ii) sink filtering based on hidden-state dimensions that the BOS token saturates; (iii) two-pass inference with `<START_IMPORTANT_*> / <END_IMPORTANT_*>` prompt markers. Evaluated on Qwen2/2.5/3-VL and InternVL3.5 over KB-VQA and on vision-centric / hallucination benchmarks — the image-side margin is already largely closed [source: raw/papers/morini-2026-look-twice.pdf, Tab. 1, Tab. 3].

**[[sources/kim-2025-map-the-flow]] — the most useful piece for the transfer.** Mechanistic interpretability on VideoLLMs identifies a layer-wise pipeline distinct from image MLLMs: cross-frame interactions emerge in early-to-middle layers; video–language integration consolidates in middle layers over *temporal-keyword* question tokens; the answer becomes ready in middle-to-late layers [source: raw/papers/kim-2025-map-the-flow.pdf, §3.2–3.4]. Two design consequences for Video-LoT: (a) `L_vis` should split into an early-to-middle band for `object/keyword → video` attention and a middle band for the routing into temporal keywords; (b) the "target tokens" set should extend `T_obj` to include `T_temporal_keyword` (e.g. *begins, ends, first, then*) and, for MCQA, the true-option tokens, which Map the Flow identifies as the information checkpoint feeding the final position [source: raw/papers/kim-2025-map-the-flow.pdf, §3.3]. The Attention Knockout protocol from the same paper is the natural scalpel for ablating each branch of the proposed pipeline.

**[[sources/kim-2026-sink-token-aware-pruning]] (SToP) — the video-side sink definition.** SToP defines sink tokens as those with *spatially persistent high attention across frames*, `ŝ_i = Σ_t A^t_i`, normalized [source: raw/papers/kim-2026-sink-token-aware-pruning.pdf, Eq. 4]. This is orthogonal to LoT's BOS-hidden-dim sink score and arguably more informative on video: an image-style sink token that vanishes after one frame is rarely harmful; a spatially persistent one is. A hybrid sink score `s_sink = α · s_BOS_dim + β · s_persistence` is the natural fusion. SToP also offers a second integration angle: as a pruning step before LoT's first pass, it can offset the cost of the two-pass inference (SToP retains performance at 10% token budget on hallucination benchmarks) [source: raw/papers/kim-2026-sink-token-aware-pruning.pdf, §5].

**[[sources/liu-2025-selfelicit]] — the textual-side template.** Sentence-level evidence scoring via deep-half-layer attention aggregation with explicit `<start_important>` markers — the direct ancestor of LoT's textual branch and already cited as such in LoT [source: raw/papers/liu-2025-selfelicit.pdf, §3]. Useful for Video-VQA only when retrieved context or transcripts/subtitles are part of the prompt (Video-KB-VQA or subtitle-grounded benchmarks); under vision-only Video-VQA the textual branch is inert and the contribution to the proposed method is purely as a baseline / ablation.

**[[concepts/qwen2-5-vl]] and [[concepts/qwen3-vl]] — backbone candidates.** Both support native dynamic resolution and video; Qwen3-VL is the strongest backbone in LoT's image experiments (Qwen3-VL-8B + LoT: +3.5 avg on KB-VQA) [source: raw/papers/morini-2026-look-twice.pdf, Tab. 1] and was *not* covered by Map the Flow (which uses LLaVA-NeXT-Video-FT, VideoLLaMA3, Mini-InternVL). Replicating Map the Flow's analysis on Qwen3-VL is a useful prerequisite that doubles as an independent contribution.

## Risks and overlaps

1. **Visual highlighting on video has no off-the-shelf solution.** LoT injects a bounding box on a single image. For video, plausible options are per-frame bbox annotation, soft attention-mask injection at the visual-token level, or crop-with-padding — each breaks something (visual continuity, encoder windowing assumptions, resolution). This is the central engineering problem and is not solved by any of the cited works.
2. **Computational cost.** Two-pass inference over ~32 frames × ~200 tokens/frame on a 7–8B VideoLLM is expensive. Without SToP-style pruning in the loop, LoT's "negligible overhead" claim does not carry over.
3. **First-token attention may not be saturated in video.** LoT extracts attention from the first generated token. Map the Flow shows that on VideoLLMs the video↔language routing matures in middle layers *before* answer readiness; whether the very first generated token is the right probe point on video is an empirical question. A prompt-only forward pass that ends in a sentinel ("<relevance>") is a plausible alternative.
4. **Adjacent work already covers parts of the space.** LoT image-side already reports POPE/AMBER (hallucination) gains. SToP covers hallucination on video via pruning. The open slot is exactly *training-free evidence highlighting + sink filtering on Video-VQA*, not pruning-only and not image-only.

## Open design questions

- **Target benchmark.** Open-ended / MCQA Video-VQA (VideoMME, MVBench, LongVideoBench) vs. hallucination (EventHallusion) vs. Video-KB-VQA (TVQA + external KB).
- **Vision-only vs. text+vision.** Skipping the textual branch simplifies the pipeline at the cost of removing the SelfElicit-style ablation.
- **Where to read the signal.** Replicate Map the Flow's Attention Knockout on Qwen3-VL first; use the resulting layer ranges to instantiate `L_vis`, `L_sink`, `L_txt` for Video-LoT on the same backbone used for the metrics.
- **Ordering with SToP.** Pruning *before* the first pass (loses signal) vs. *between* the two passes (safer, but the second pass already sees the highlight).

## Verdict

The direction is worth pursuing. The defensible slot is: *Video-LoT on Qwen3-VL, with a hybrid sink score (BOS-hidden-dim + temporal persistence), layer ranges chosen via Attention Knockout on the same backbone, evaluated on a hallucination benchmark plus one MCQA Video-VQA benchmark*. The dominant risk is not novelty but the engineering of the visual highlighting mechanism on video — prototyping two or three marking strategies (per-frame bbox, crop-with-padding, attention-mask injection as prompt-level signal) before committing is the right first step.

## Sources used

- [[sources/morini-2026-look-twice]] — paper introducing LoT
- [[sources/kim-2025-map-the-flow]] — VideoLLM information-flow analysis
- [[sources/kim-2026-sink-token-aware-pruning]] — SToP, video-side sink definition
- [[sources/liu-2025-selfelicit]] — text-only ancestor of LoT's textual branch
- [[sources/qwen2-5-vl-2025-tech-report]] / [[concepts/qwen2-5-vl]] — backbone candidate
- [[sources/qwen3-vl-2025-tech-report]] / [[concepts/qwen3-vl]] — primary backbone candidate
