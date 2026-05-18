---
title: Training-Free Methods
type: concept
tags: [paradigm, inference-time, plug-and-play]
created: 2026-05-15
updated: 2026-05-15
---

# Training-Free Methods

**Training-free methods** are techniques that improve a model (typically an [[multimodal-large-language-model|MLLM]] or a [[video-llm|video-LLM]]) **without updating its weights**: they act only at inference time via input preprocessing, prompt engineering, token/frame selection, or reformulation of the reasoning pipeline. Advantages: no training cost, plug-and-play, model-agnostic; disadvantages: the ceiling is bounded by the base model's capabilities.

In the wiki, the paradigm is exemplified by:

- **[[zhang-2024-llovi|LLoVi]]**: short-term captioner + LLM aggregator + multi-round summarization prompt. No fine-tuning; everything leverages off-the-shelf captioner and LLM.
- **[[tang-2025-adaptive-keyframe-sampling|AKS]]**: keyframe selection via BLIP/CLIP relevance + Ripley's K coverage; replaces uniform sampling, plug-and-play on the VLM.
- **[[arnab-2025-temporal-chain-of-thought|TCoT]]**: same VLM used both as frame selector and as question answerer (Single-Step / Dynamic-Segment); training-free, inference-time scaling.
- **[[doorenbos-2026-video-panels|Video Panels]]**: visual prompt engineering via paneling frames into 2×2 grids (training-free, parameter-free, model-agnostic).
- **[[morini-2026-look-twice|Look Twice]]**: two-pass MLLM with attention-based highlighting of visual/textual evidence.
- **[[kim-2026-sink-token-aware-pruning|SToP]]**: plug-and-play visual token pruning, training-free, applied on VisionZip / FastVid / Holitom / FlashVid.

## Sources

- [[zhang-2024-llovi]]
- [[tang-2025-adaptive-keyframe-sampling]]
- [[arnab-2025-temporal-chain-of-thought]]
- [[doorenbos-2026-video-panels]]
- [[morini-2026-look-twice]]
- [[kim-2026-sink-token-aware-pruning]]
- [[liu-2025-selfelicit]] (adjacent category, training-free for textual LLMs)

## Related concepts

- [[inference-time-scaling]] — related paradigm.
- [[chain-of-thought]] — often used as a training-free strategy.
- [[keyframe-sampling]] — sub-category.
- [[caption-based-vqa]] — sub-category.
- [[visual-prompting]] — sub-category.
