---
title: Map the Flow
type: concept
tags: [method, video-llm, mechanistic-interpretability, attention-knockout, logit-lens]
created: 2026-05-15
updated: 2026-05-15
---

# Map the Flow

**Map the Flow** is the **mechanistic interpretability** framework introduced by Kim, Kim & Han (2025) to study *how* and *where* Video LLMs perform temporal reasoning during VideoQA. It combines **Attention Knockout** (Geva et al. 2023, disabling the `s→t` flow at layer `l` by setting `M^l[s,t] = −∞`) and **Logit Lens** (nostalgebraist 2020, projection of hidden states through the LM head) on 4 Video LLMs (LLaVA-NeXT-7B/13B-Video-FT, Mini-InternVL-4B-Video-FT, VideoLLaMA3-7B).

## Architecture

Identifies a **recurrent 4-stage pipeline**:

1. **Cross-frame interactions** (layers 1-16, early-to-middle): video tokens form spatiotemporal representations by interacting across frames. Blocking them drops accuracy by 18-60.8 points (TVBench).
2. **Video-language integration on temporal keywords** (layers 6-20): video information selectively propagated toward the tokens of the correct options in the prompt.
3. **Concept emergence**: spatial concepts emerge in early layers on foreground patches; temporal concepts ("eat", "sit", "hold") only in middle layers, on residual patches.
4. **Answer generation** (layers 16-25): the probability of the true option jumps at the last-token around layer 20.

Fine-tuning on VideoQA **specifically** induces the cross-frame dependency in the early-middle layers, absent in the image-only LLM precursor.

## Reference numbers

Keeping only the effective pathways preserves performance while suppressing up to **58% of the attention edges** (LLaVA-NeXT-7B-Video-FT). VideoLLaMA3-7B even **improves** (TVBench 55.2 → 57.2) eliminating 42% of the edges: non-effective pathways act as noise. Random blocking of the same budget crashes by 33+ points. Also validated on TOMATO, LongVideoBench, VCGBench.

## Sources

- [[kim-2025-map-the-flow]] — introductory paper
- [[morini-2026-look-twice]] — consistency with "deep layers know"
- [[liu-2025-selfelicit]] — layer-wise analogy on information flow

## Related concepts

- [[video-llm]], [[mechanistic-interpretability]]
- [[attention-knockout]], [[logit-lens]]
- [[early-exit]], [[temporal-reasoning]]
- [[llava-next]], [[videollama-3]] — analyzed backbones
