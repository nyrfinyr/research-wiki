---
title: LLaVA-Video
type: concept
tags: [video-llm, model]
created: 2026-05-15
updated: 2026-05-15
---

# LLaVA-Video

Variante video-tuned della famiglia LLaVA (Zhang et al., 2024): vision encoder SigLIP + LLM Qwen2 con dataset video instruction tuning (LLaVA-Video-178K). Backbone ampiamente usato in lavori su token pruning, keyframe selection e prompt-based aggregation.

## Sources

- [[doorenbos-2026-video-panels]] — backbone per video paneling
- [[kim-2026-sink-token-aware-pruning]] — backbone per token pruning
- [[tang-2025-adaptive-keyframe-sampling]] — backbone, usa SigLIP come vision encoder

## Concetti correlati

- [[llava]] — famiglia
- [[llava-onevision]] — pari/precursore
- [[siglip]] — vision encoder
- [[qwen]] — LLM backbone
