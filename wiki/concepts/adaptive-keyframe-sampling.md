---
title: Adaptive Keyframe Sampling (AKS)
type: concept
tags: [method, video-llm, keyframe-sampling, training-free, long-video]
created: 2026-05-15
updated: 2026-05-15
---

# Adaptive Keyframe Sampling (AKS)

**AKS** is a plug-and-play, **training-free** module introduced by Tang et al. (2025) that replaces pre-VLM uniform sampling in video MLLMs. It formalizes the selection of $M$ keyframes as the maximization of two terms: (1) **relevance** $s(Q, F_t)$ between prompt and frame (via BLIP/CLIP image-text matching), and (2) **coverage** $c(\mathcal{I})$ of the temporal distribution (via Ripley's K-function on recursive bins):

$$\arg\max \sum_t s(Q, F_t) + \lambda \cdot c(\mathcal{I})$$

## Architecture

**ADA** algorithm (Adaptive Sampling): at each tree node, if $s_\text{top} - s_\text{all} > s_\text{thr}$ it returns the top-$k$ frames of the bin (TOP-mode); otherwise it splits the bin in two and distributes the keyframes equally (BIN-mode), recursively, up to depth $L \le \lceil\log_2 M\rceil$. Plug-and-play: no VLM parameter is modified; only the sampling algorithm is replaced. Typical hyperparameters: $s_\text{thr} \in [0.6, 0.8]$, $L \in [3, 5]$.

## Reference numbers

On LongVideoBench and Video-MME, integrated on top of Qwen2-VL, LLaVA-OV and LLaVA-Video-7B (with 32 or 64 frames fed to the VLM):
- LLaVA-Video-7B 58.9 → **62.7** on LVBench (+3.8), 64.4 → **65.3** on V-MME (+0.9)
- Qwen2-VL-7B 55.5 → **60.5** LVBench (+5.0), 57.6 → **59.9** V-MME (+2.3)
- LLaVA-OV-7B 54.8 → **59.3** LVBench (+4.5)

LLaVA-Video-7B+AKS surpasses LLaVA-Video-72B and GPT-4V/Gemini-1.5-Flash at 256 frames, with only 64 frames.

## Sources

- [[tang-2025-adaptive-keyframe-sampling]] — introductory paper
- [[zhang-2024-llovi]] — composable to reduce the number of captions
- [[arnab-2025-temporal-chain-of-thought]] — competitor (VLM-as-selector)
- [[doorenbos-2026-video-panels]] — composable (paneling × AKS appears orthogonal)

## Related concepts

- [[blip-2]], [[clip]] — alternative image-text scorers
- [[ripleys-k-function]] — coverage formalization
- [[uniform-sampling]] — replaced baseline
- [[long-video-understanding]], [[training-free-methods]]
