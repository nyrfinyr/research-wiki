---
title: Instruction Tuning
type: concept
tags: [post-training, sft, llm, alignment]
created: 2026-05-15
updated: 2026-05-15
---

# Instruction Tuning

Post-training stage in which a pre-trained language model is fine-tuned on a collection of **(instruction, response) pairs** generated in a curated way (FLAN, Self-Instruct, Alpaca, ShareGPT-style) or from real human-annotated data. It produces the difference between a "base model" (foundation) and a "chat/instruct" model capable of following instructions in dialog format. In the VLM world it is the backbone of post-training (together with DPO/RL): it is applied both in *text-only* version and, especially, in *multimodal* version with prompts that include images/videos and textual instructions [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.3; raw/papers/zhang-2025-videollama-3.pdf §3.3].

## Key claims / Technique

- **Data format**: typically JSONL `{instruction, input, output}` or ChatML template `<|im_start|>user ... <|im_end|><|im_start|>assistant ...`. Qwen2.5-VL uses ChatML as unified format for SFT [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.3].
- **Distinct from generic SFT**: technically instruction tuning **is** an instance of [[supervised-fine-tuning]], but with a dataset built explicitly to cover the distribution of user instructions (dialog, reasoning, refusal, multi-turn). When a report says "SFT" it almost always refers to instruction tuning in this configuration.
- **Qwen2.5-VL two-phase post-training**: frozen ViT; **SFT on ~2 M examples (50% text-only, 50% multimodal)**, followed by rejection sampling to improve [[chain-of-thought]] on reasoning tasks, then [[direct-preference-optimization]] [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.3].
- **Qwen3-VL tri-phase post-training**: SFT on 1.2M samples (32K phase then 256K) → strong-to-weak textual distillation → RL with SAPO. The "instruct" and "thinking" versions diverge in the mix of CoT data during SFT [source: raw/papers/qwen3-vl-2025-tech-report.pdf §3.3, §5.11].
- **VideoLLaMA-3 four-stage recipe**: after the three pre-training stages (vision encoder adaptation, vision-language alignment, multi-task fine-tuning) there is a final stage of **instruction tuning** dedicated to follow-instructions on video [source: raw/papers/zhang-2025-videollama-3.pdf §3.3].

## Variants / Extensions

- **Multimodal instruction tuning**: instruction + image(s) + response. Datasets like LLaVA-Instruct-150K, ShareGPT4V, VideoChat-IT.
- **CoT-augmented SFT**: CoT is pre-generated with a strong model (e.g. Qwen3) and filtered via rejection sampling for quality — see [[chain-of-thought]].
- **Distillation-driven SFT**: the target is the output distribution of a larger "teacher" model (Qwen3-VL strong-to-weak distillation).

## Related concepts

- [[supervised-fine-tuning]] — technical superset; instruction tuning is the most common instance.
- [[direct-preference-optimization]] — subsequent stage that learns from preferences on top of an already instruct-tuned model.
- [[chain-of-thought]] — output developed and refined during SFT with rejection sampling.

## Sources

- [[qwen2-5-vl-2025-tech-report]] — SFT on 2M examples, ChatML format, text/multimodal mix.
- [[qwen3-vl-2025-tech-report]] — tri-phase SFT with 32K/256K phase, distillation, RL.
- [[zhang-2025-videollama-3]] — fourth stage of the training framework dedicated to instruction tuning.
