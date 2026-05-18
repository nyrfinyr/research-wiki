---
title: Supervised Fine-Tuning (SFT)
type: concept
tags: [post-training, training, llm, alignment]
created: 2026-05-15
updated: 2026-05-15
---

# Supervised Fine-Tuning (SFT)

Post-training stage in which a pre-trained model is trained with the **standard next-token loss** (cross-entropy) on a curated collection of `(input, target)` pairs, where the target typically includes CoT, structured formats (JSON, ChatML), and multimodal responses. It is the stage that turns a "foundation model" into a model aligned to an output protocol. Distinct from [[direct-preference-optimization]] (which learns from preference pairs) and from RL (which requires a reward signal), SFT is the first post-training stage in most modern VLM recipes [source: raw/papers/qwen3-vl-2025-tech-report.pdf §3.3; raw/papers/zhang-2025-videollama-3.pdf §3.3].

## Key claims / Technique

- **Loss**: standard next-token cross-entropy `L = − Σ_t log p(y_t | y_<t, x)`. No reward, no preference signal — just "imitation" of the target.
- **Qwen3-VL SFT**: 1.2M curated samples with two context-length phases — first 32K, then 256K to handle long-document and long-video. Bifurcation between an "instruct" version (moderate CoT) and a "thinking" version (extended CoT up to 81,920 tokens on tasks such as AIME-25, HMMT-25, LiveCodeBench) [source: raw/papers/qwen3-vl-2025-tech-report.pdf §3.3, §5.11].
- **VideoLLaMA-3 SFT as fourth stage**: after (i) vision encoder adaptation, (ii) vision-language alignment, (iii) multi-task fine-tuning, the fourth stage is dedicated to SFT on video instruction data for specialized instruction-following [source: raw/papers/zhang-2025-videollama-3.pdf §3.3].
- **Square-root reweighting** (Qwen3-VL): per-token loss normalized by `sqrt` instead of per-sample; balances text and multimodal without catastrophic forgetting [source: raw/papers/qwen3-vl-2025-tech-report.pdf abstract, §1]. Isolated ablations **not reported** in the paper.
- **Distinct from [[instruction-tuning]] only in scope**: instruction tuning is the specialization of SFT with *instruction-format* datasets; every instruction tuning is an SFT, not vice versa (SFT can be on domain adaptation, dialog completion, etc.).
- **Text strong-to-weak distillation** (Qwen3-VL): a form of SFT with targets from a larger teacher — the model learns the teacher's output distribution instead of hard labels [source: raw/papers/qwen3-vl-2025-tech-report.pdf §3.3].

## Variants / Extensions

- **CoT-augmented SFT**: targets enriched with reasoning chains, filtered via rejection sampling (Qwen2.5-VL).
- **Multi-stage SFT** (Qwen3-VL): SFT in two consecutive phases with increasing context length.
- **Multimodal SFT**: input contains images/video, target is text (caption, answer, JSON with bbox).
- **Distillation-based SFT**: target produced by a teacher model rather than human annotators.

## Related concepts

- [[instruction-tuning]] — specialization of SFT with instruction-format datasets.
- [[direct-preference-optimization]] — subsequent stage in the typical pipeline (SFT → DPO/RL).
- [[chain-of-thought]] — often an integral part of modern SFT targets.
- [[mixture-of-experts]] — SFT applied identically to dense and MoE variants in Qwen3-VL.

## Sources

- [[qwen3-vl-2025-tech-report]] — SFT as the first post-training stage, two context lengths, instruct/thinking bifurcation.
- [[zhang-2025-videollama-3]] — SFT as the final fourth stage of the pipeline.
