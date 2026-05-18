---
title: Keyframe Sampling
type: concept
tags: [task, inference, video, frame-selection]
created: 2026-05-15
updated: 2026-05-15
---

# Keyframe Sampling

**Keyframe sampling** is the problem of choosing a subset of $M$ frames from a video of $T$ frames to feed a [[video-llm|video-LLM]] with a limited context. It is a central bottleneck for [[long-video-understanding]] because it determines how much useful information reaches the model.

Two main paradigms in the wiki:

- **Uniform sampling**: $M$ equispaced frames. Default in most video-LLMs (LLaVA-Video, Qwen2.5-VL). Robust but content-blind.
- **Adaptive / prompt-conditioned sampling**: frames are chosen as a function of the question. Three realizations in the wiki:
  - **[[tang-2025-adaptive-keyframe-sampling|AKS]]**: relevance via BLIP/CLIP ITM + coverage via Ripley's K, judge-and-split ADA algorithm.
  - **[[arnab-2025-temporal-chain-of-thought|TCoT]]**: the **same VLM** selects the relevant frames via JSON prompt, then answers — Dynamic-Segment TCoT segments long videos into $l$ blocks.
  - **[[doorenbos-2026-video-panels|Video Panels]]**: alternative that keeps $T$ high by grouping $\alpha\beta$ frames into a single "panel" image, increasing temporal resolution at the cost of spatial resolution.

The selection oracle (annotated time-references) gives +5.7 points on LVBench over TCoT (67.4 vs 61.7) [source: raw/papers/arnab-2025-temporal-chain-of-thought.pdf Tab. 2], indicating that selection remains an open ceiling.

## Sources

- [[tang-2025-adaptive-keyframe-sampling]] — AKS, formalization of relevance + coverage.
- [[arnab-2025-temporal-chain-of-thought]] — TCoT, selector = VLM itself.
- [[doorenbos-2026-video-panels]] — paneling as alternative.
- [[zhang-2024-llovi]] — sampling rate ablation (1/8 optimal for efficiency).
- [[qwen2-5-vl-2025-tech-report]] — dynamic FPS sampling (training-time).

## Related concepts

- [[long-video-understanding]] — target task.
- [[training-free-methods]] — paradigm.
- [[video-llm]] — downstream model.
- [[uniform-sampling]] — baseline.
- [[caption-based-vqa]] — alternative paradigm (does not choose frames but captions).
- [[certificate-length]] — metric that motivates selection ("certifying" frames).
