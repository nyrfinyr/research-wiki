---
title: Vision-Language Model (VLM)
type: concept
tags: [model-family, vision-language, multimodal, broad-concept]
created: 2026-05-15
updated: 2026-05-15
---

# Vision-Language Model (VLM)

A **Vision-Language Model** (VLM) is a model that integrates visual encoding (typically of images) with natural language. In the wiki the term largely overlaps with [[multimodal-large-language-model]] but is used more narrowly to refer to **image-first** models (with or without a video extension): e.g. the [[qwen2-5-vl-2025-tech-report|Qwen2.5-VL]] family is explicitly described as a "vision-language model" by its own tech report, even though it supports video. [[qwen3-vl-2025-tech-report|Qwen3-VL]] continues this convention with dense and MoE variants.

Modern VLMs typically have: a vision encoder ([[vision-transformer|ViT]], often [[siglip|SigLIP-2]] or CLIP), an MLP projector / merger, and an LLM backbone. The distinction between "VLM" and "video-LLM" is blurred: an image-first VLM (e.g. Qwen2.5-VL) can be applied to video via frame sampling, while a [[video-llm|video-LLM]] is natively designed for the temporal dimension.

## Sources

- [[qwen2-5-vl-2025-tech-report]] — example of an image+video VLM with a "vision-language model" architecture.
- [[qwen3-vl-2025-tech-report]] — successor version with MoE and 256K context.
- [[zhang-2025-videollama-3]] — uses the VLM label for the category.
- [[doorenbos-2026-video-panels]] — tests the method on 8 "VLMs" including GPT-4o-mini/4.1.

## Related concepts

- [[multimodal-large-language-model]] — more general category.
- [[video-llm]] — video-native sub-family.
- [[vision-transformer]] — encoder.
- [[siglip]] — recurring vision encoder.
- [[long-video-understanding]] — downstream task.
