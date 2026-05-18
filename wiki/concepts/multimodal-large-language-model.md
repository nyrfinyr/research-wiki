---
title: Multimodal Large Language Model (MLLM)
type: concept
tags: [model-family, multimodal, vision-language, broad-concept]
created: 2026-05-15
updated: 2026-05-15
---

# Multimodal Large Language Model (MLLM)

A **Multimodal Large Language Model** (MLLM) is a generative model built around a text LLM onto which the ability to process non-text modalities — typically images, video, audio — is grafted. In the wiki the category is used broadly to denote vision-language models such as [[qwen2-5-vl-2025-tech-report|Qwen2.5-VL]], [[qwen3-vl-2025-tech-report|Qwen3-VL]], [[zhang-2025-videollama-3|VideoLLaMA 3]], LLaVA, InternVL, Gemini, GPT-4V/GPT-4o, Claude 3.x. It is the object of evaluation of all the video benchmarks in the wiki ([[egoschema]], [[video-mme]], [[lvbench]], [[mvbench]], [[mlvu]], [[longvideobench]]) and of interpretability / efficiency studies (e.g., [[kim-2026-sink-token-aware-pruning]], [[kim-2025-map-the-flow]]).

## Typical architecture

Three modules (recognizable in almost all source pages of the wiki):

1. **Vision encoder** — a pre-trained [[vision-transformer|ViT]] (CLIP, [[siglip|SigLIP / SigLIP-2]], EVA-CLIP, UMT-L, DFN-CLIP). Produces visual tokens from image patches or video frames.
2. **Vision-language merger / projector / Q-Former** — a module that projects visual tokens into the LLM space. Three recurring designs: 2-layer MLP (Qwen2.5-VL, Qwen3-VL, VideoLLaMA 3), [[q-former|Q-Former]] (BLIP-2, VideoChat2), gated cross-attention (Flamingo).
3. **LLM backbone** — a decoder-only LLM (Qwen / Vicuna / Mistral / Llama / GPT). Often fine-tuned with LoRA + instruction tuning + DPO/RLHF.

Recent variants add: 2D-RoPE / [[mrope|MRoPE]] / interleaved-MRoPE for multidimensional positioning; window attention in the ViT; DeepStack injection of multi-level features from the ViT into the LLM; dynamic resolution / dynamic FPS sampling.

## Families relevant to the wiki

- **Qwen-VL**: [[qwen2-5-vl-2025-tech-report|Qwen2.5-VL]] (3B/7B/72B, T-RoPE absolute time, window attn ViT), [[qwen3-vl-2025-tech-report|Qwen3-VL]] (2B/4B/8B/32B dense + 30B-A3B/235B-A22B MoE, interleaved MRoPE, DeepStack, textual timestamp tokens, 256K context).
- **VideoLLaMA**: [[zhang-2025-videollama-3|VideoLLaMA 3]] (2B/7B, AVT + DiffFP, vision-centric paradigm).
- **LLaVA family**: LLaVA-Video, LLaVA-OneVision, LLaVA-NeXT-Video (cited as backbones in [[tang-2025-adaptive-keyframe-sampling]], [[doorenbos-2026-video-panels]], [[kim-2026-sink-token-aware-pruning]]).
- **VideoChat / VideoChat2**: introduced in [[li-2024-mvbench]], 3-stage training on 2M instruction samples from 34 datasets.
- **Closed-source**: GPT-4V, GPT-4o, Gemini 1.5/2.0/2.5 (Flash/Pro), Claude 3.x (Sonnet/Opus), Seed1.5-VL — appear as baselines in all benchmarks.
- **Captioner-based pipelines**: BLIP-2, LaViLa, EgoVLP, CogAgent — used in [[zhang-2024-llovi|LLoVi]] as short-term captioners feeding an LLM aggregator.

## Sources

- [[qwen2-5-vl-2025-tech-report]] — Qwen2.5-VL family.
- [[qwen3-vl-2025-tech-report]] — Qwen3-VL family.
- [[zhang-2025-videollama-3]] — VideoLLaMA 3.
- [[li-2024-mvbench]] — VideoChat2 + MVBench taxonomy.
- [[zhang-2024-llovi]] — caption-based paradigm (captioner + LLM).
- [[arnab-2025-temporal-chain-of-thought]] — training-free inference-time strategies.
- [[tang-2025-adaptive-keyframe-sampling]] — plug-and-play keyframe selection.
- [[doorenbos-2026-video-panels]] — visual prompting via paneling.
- [[mangalam-2023-egoschema]] — first long-form benchmark for MLLMs.
- [[fu-2025-video-mme]] — "full-spectrum" benchmark for video MLLMs.
- [[wang-2025-lvbench]] — extreme long-video benchmark for MLLMs.
- [[kim-2025-map-the-flow]] — analysis of information flow in video MLLMs.
- [[kim-2026-sink-token-aware-pruning]] — inference efficiency on video MLLMs.
- [[morini-2026-look-twice]] — training-free visual prompting for image-based MLLMs.
- [[liu-2026-adaptive-information-flow]] — analysis on video MLLMs.
- [[pei-2025-causal-mask-attention]] — causal mask analysis in MLLMs.

## Related concepts

- [[vision-language-model]] — sub-category (typically image-only or image+video MLLM).
- [[video-llm]] — sub-category specialized on video.
- [[vision-transformer]] — dominant encoder.
- [[siglip]] — recurring vision encoder.
- [[q-former]] — legacy projector.
- [[mrope]] — multimodal positional encoding.
- [[instruction-tuning]] — fundamental training phase.
- [[chain-of-thought]] — reasoning paradigm.
- [[long-context]] — key requirement for video.
