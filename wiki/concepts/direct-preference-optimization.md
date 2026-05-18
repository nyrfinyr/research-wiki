---
title: Direct Preference Optimization (DPO)
type: concept
tags: [post-training, alignment, rlhf, preference-learning]
created: 2026-05-15
updated: 2026-05-15
---

# Direct Preference Optimization (DPO)

Alignment algorithm introduced by Rafailov et al. (2023) that learns from **preference pairs** `(x, y_w, y_l)` (for each prompt `x`, a preferred response `y_w` and a rejected one `y_l`) **without** having to train an explicit reward model or run PPO. The optimal policy is obtained in closed form with respect to an implicit reward based on the log-probability ratio of the current policy and a reference, and is optimized with a binary classifier on the preference pairs. For the VLM sub-world, DPO is today the *standard alignment stage* after SFT / instruction tuning [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.3; raw/papers/qwen3-vl-2025-tech-report.pdf §post-training].

## Key claims / Technique

- **DPO loss**:
  ```
  L_DPO(π_θ; π_ref) = − E_(x,y_w,y_l) [ log σ( β log π_θ(y_w|x)/π_ref(y_w|x) − β log π_θ(y_l|x)/π_ref(y_l|x) ) ]
  ```
  with `β` the reference temperature. No explicit reward model; no on-policy RL.
- **Final stage of Qwen2.5-VL**: post-training in **two phases** with ViT frozen — first SFT (~2M examples, 50% text-only, 50% multimodal), then **DPO** to align style with human preferences [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.3].
- **Background for Qwen3-VL**: DPO is cited as "background" because Qwen3-VL evolves toward **SAPO (Smooth and Adaptive Policy Optimization)** + strong-to-weak text distillation, but DPO remains the conceptual starting point for preference-based alignment [source: raw/papers/qwen3-vl-2025-tech-report.pdf §cited concepts].
- **Practical advantages (vs. PPO/RLHF)**: stable training (loss similar to cross-entropy), no on-policy sampling required, no reward model required — much cheaper implementation, well-suited to 7B-235B model sizes.

## Variants / Extensions

- **IPO** (Identity Preference Optimization), **KTO** (Kahneman-Tversky Optimization), **SimPO** — recent variants that modify the DPO loss to avoid reward hacking or to handle non-binary preferences.
- **SAPO** (Qwen3-VL): RL-based, *not* DPO; uses smooth-and-adaptive policy optimization for Qwen3-VL "thinking" [source: raw/papers/qwen3-vl-2025-tech-report.pdf §cited concepts].
- **Multimodal DPO**: preference pair `(image, prompt, y_w, y_l)`; the multimodal policy learns preferences over visually-grounded responses.

## Related concepts

- [[supervised-fine-tuning]] — preceding stage; DPO assumes an already instruction-tuned policy.
- [[instruction-tuning]] — stage typically between pre-training and DPO.
- [[chain-of-thought]] — DPO can learn preferences between correct vs. wrong CoT trajectories.

## Sources

- [[qwen2-5-vl-2025-tech-report]] — DPO as the final post-training stage.
- [[qwen3-vl-2025-tech-report]] — DPO cited as background; Qwen3-VL evolves toward SAPO.
