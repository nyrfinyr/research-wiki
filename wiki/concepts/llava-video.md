---
title: LLaVA-Video
type: concept
tags: [video-llm, model]
created: 2026-05-15
updated: 2026-05-15
---

# LLaVA-Video

Video-tuned variant of the LLaVA family (Zhang et al., 2024): SigLIP vision encoder + Qwen2 LLM with video instruction tuning dataset (LLaVA-Video-178K). Widely used backbone in work on token pruning, keyframe selection and prompt-based aggregation.

## Sources

- [[doorenbos-2026-video-panels]] — backbone for video paneling
- [[kim-2026-sink-token-aware-pruning]] — backbone for token pruning
- [[tang-2025-adaptive-keyframe-sampling]] — backbone, uses SigLIP as vision encoder

## Related concepts

- [[llava]] — family
- [[llava-onevision]] — peer/precursor
- [[siglip]] — vision encoder
- [[qwen]] — LLM backbone
