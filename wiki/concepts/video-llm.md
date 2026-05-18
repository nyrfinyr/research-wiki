---
title: Video LLM
type: concept
tags: [model-family, video, multimodal, vision-language, broad-concept]
created: 2026-05-15
updated: 2026-05-15
---

# Video LLM

A **Video LLM** is a [[multimodal-large-language-model|MLLM]] specialized (or extended) for video processing. In the wiki two operational families are distinguished:

1. **Image-MLLM applied frame-by-frame**: an image-based MLLM that receives a set of frames sampled from the video as multiple images and produces the answer on the concatenation. Examples: LLaVA, InternVL applied to video. Advantage: directly reuses the image-MLLM stack; disadvantage: no native notion of time, rigid uniform sampling, no temporal grounding.
2. **Native video-LLM**: an MLLM with native support for the temporal dimension (3D positional encoding, dynamic FPS sampling, video token compression). Typical examples in the wiki: [[qwen2-5-vl-2025-tech-report|Qwen2.5-VL]] (T-RoPE absolute-time aligned, dynamic FPS, max 768 frames), [[qwen3-vl-2025-tech-report|Qwen3-VL]] (interleaved MRoPE, textual timestamp tokens, 256K context), [[zhang-2025-videollama-3|VideoLLaMA 3]] (AVT 2D-RoPE + DiffFP), LLaVA-Video, LLaVA-OneVision, VideoChat2 (see [[li-2024-mvbench]]).

The source pages of the wiki use "video-LLM" to refer to both families in the context of evaluation on video benchmarks; when a distinction is needed, the disambiguation is explicit (e.g. [[wang-2025-lvbench]] taxonomizes into "native long-video models" vs "non-native long-video models").

## Typical challenges

- **Long-context modeling**: number of visual tokens grows linearly with #frames; e.g. 6,270 tokens for 32 frames on LLaVA-OneVision-7B [source: raw/papers/kim-2026-sink-token-aware-pruning.pdf §1].
- **Sampling**: uniform vs adaptive ([[keyframe-sampling]]) — see [[tang-2025-adaptive-keyframe-sampling]], [[arnab-2025-temporal-chain-of-thought]].
- **Temporal positional encoding**: chunked vs interleaved MRoPE, T-RoPE absolute-time, textual timestamp tokens — see [[qwen3-vl-2025-tech-report]] §2.1, §2.3.
- **Token compression**: video token pruning, frame pruning (DiffFP), Q-Former — see [[zhang-2025-videollama-3]], [[kim-2026-sink-token-aware-pruning]].
- **Audio**: most open-source video-LLMs do **not** support it natively, which is why [[lvbench]] and [[wang-2025-lvbench]] exclude it from the benchmark.

## Families in the wiki

- **Qwen2.5-VL** (3B/7B/72B) — see [[qwen2-5-vl-2025-tech-report]].
- **Qwen3-VL** (2B/4B/8B/32B + 30B-A3B/235B-A22B MoE) — see [[qwen3-vl-2025-tech-report]].
- **VideoLLaMA 3** (2B/7B, Qwen2.5 backbone, AVT + DiffFP) — see [[zhang-2025-videollama-3]].
- **VideoLLaMA 2** — predecessor with audio encoder.
- **LLaVA-Video / LLaVA-OneVision / LLaVA-NeXT-Video** — references as backbones in [[tang-2025-adaptive-keyframe-sampling]], [[doorenbos-2026-video-panels]].
- **VideoChat / VideoChat2** — see [[li-2024-mvbench]].
- **MovieChat, LWM, mPLUG-Owl3, Apollo, InternVL2.5-Video, GLM4V-Plus, Seed1.5-VL** — cited in comparison tables.
- **Closed-source**: GPT-4V/4o, Gemini 1.5/2.0/2.5, Claude 3.5/Opus 4.x.

## Sources

- [[qwen2-5-vl-2025-tech-report]] — native video-LLM with T-RoPE.
- [[qwen3-vl-2025-tech-report]] — native video-LLM with interleaved MRoPE + textual timestamps.
- [[zhang-2025-videollama-3]] — vision-centric paradigm, AVT + DiffFP.
- [[li-2024-mvbench]] — VideoChat2.
- [[arnab-2025-temporal-chain-of-thought]] — training-free inference-time on video-LLMs.
- [[tang-2025-adaptive-keyframe-sampling]] — plug-and-play keyframe selection.
- [[doorenbos-2026-video-panels]] — visual prompting on video-LLMs.
- [[zhang-2024-llovi]] — alternative caption + LLM pipeline.
- [[wang-2025-lvbench]] — taxonomizes native vs non-native long-video models.
- [[kim-2026-sink-token-aware-pruning]] — token pruning on video-LLMs.
- [[kim-2025-map-the-flow]] — interpretability on video-LLMs.
- [[liu-2026-adaptive-information-flow]] — adaptive information flow in video-LLMs.

## Related concepts

- [[multimodal-large-language-model]] — super-category.
- [[vision-language-model]] — adjacent category (image-only).
- [[long-video-understanding]] — target task.
- [[video-question-answering]] — paradigm.
- [[keyframe-sampling]] — input-handling strategy.
- [[video-token-compression]] — efficiency strategy.
- [[mrope]] / [[interleaved-mrope]] — 3D positional encoding.
- [[long-context]] — structural requirement.
