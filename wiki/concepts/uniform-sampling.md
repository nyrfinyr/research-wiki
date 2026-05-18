---
title: Uniform Sampling
type: concept
tags: [video, frame-sampling, baseline]
created: 2026-05-16
updated: 2026-05-16
---

# Uniform Sampling

Uniform sampling is the simplest frame-selection strategy in a video-LLM: given a budget of N frames, N equispaced indices are chosen along the temporal axis, regardless of content or query. It is the natural baseline against which adaptive [[keyframe-sampling]] methods are measured.

In the wiki it is the explicit baseline of [[adaptive-keyframe-sampling]] and of other token-reduction works.

## Sources

- [[tang-2025-adaptive-keyframe-sampling]] — cited as baseline
