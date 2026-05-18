---
title: Mechanistic Interpretability
type: concept
tags: [interpretability, probing, circuits, neural-networks]
created: 2026-05-15
updated: 2026-05-15
---

# Mechanistic Interpretability

Research program that aims to **reverse-engineer** neural models — not just predict input/output or produce saliency maps, but identify the **internal circuits** (heads, attention edges, neuron groups, cross-layer pathways) responsible for a specific computation. The cornerstone techniques are *Attention Knockout / causal tracing* (Geva 2023, Meng 2022), *Logit Lens* (nostalgebraist 2020), *probing*, *direct logit attribution*. In the VLM/Video LLM world it is applied by Kim, Kim & Han (2025) in "Map the Flow" to reconstruct the temporal reasoning pipeline [source: raw/papers/kim-2025-map-the-flow.pdf §1, §2.2].

## Key claims / Technique

- **Attention Knockout** (Geva 2023, applied by Kim 2025): to disable the information flow from source token `s` to target token `t` at layer `l`, set `M^l[s,t] = −∞` in the softmax of [[scaled-dot-product-attention]]. The relative percentage change in the answer probability `a` is measured: `(p_knockout − p_base)/p_base × 100`. Window `k=9` layers centered on `l` to avoid bypass via residual [source: raw/papers/kim-2025-map-the-flow.pdf §2.2, Eq. 1].
- **Logit Lens** (nostalgebraist 2020): projection of token hidden states through the **final language-model head** at each layer to visualize which concepts "emerge" and where. Kim 2025 uses it to show that (i) spatial concepts emerge in early layers on foreground tokens, (ii) temporal concepts ("eat", "sit", "hold", "up", "down") emerge only in middle layers, on *residual* patches — the Video LLM **does not overwrite** the spatial representation but expands it [source: raw/papers/kim-2025-map-the-flow.pdf §3.3, Fig. 5].
- **Pipeline found in Video LLMs** (Kim 2025): recurrent 4-stage pattern across 4 backbones (LLaVA-NeXT-7B/13B-Video-FT, Mini-InternVL-4B-Video-FT, VideoLLaMA3-7B):
  1. **Cross-frame interactions** (layers 1-16): video tokens form spatiotemporal representations.
  2. **Video-language integration** (layers 6-20): video info propagates selectively to **temporal keywords** of the prompt.
  3. **Concept emergence** (Logit Lens): spatial early, temporal middle.
  4. **Answer generation** (layers 16-25): the true-option probability *jumps* around layer 20.
- **Causal validation (effective pathway pruning)**: keeping only edges active in the identified ranges and disabling the others preserves accuracy with **42-58% of original edges** (Tab. 3 of Kim 2025); random blocking of the same budget crashes by 30+ points. VideoLLaMA3-7B even **improves** when suppressing 42% of the edges — non-effective pathways act as noise.
- **Effect of video fine-tuning**: **cross-frame attention in layers 1-16** is *caused* by fine-tuning on video — absent in image-only LLaVA-NeXT-7B, present in LLaVA-NeXT-7B-Video-FT after 3 epochs on VideoChat2-IT. Blocking it causes a drop of up to **−60.8%** on Object Count [source: raw/papers/kim-2025-map-the-flow.pdf §3.2, Tab. 2].
- **Failure mode interpretation**: incorrect samples show two primary failure modes — (Case 1) *spurious* cross-frame interactions in the early layers, (Case 2) **static bias**, i.e. collapse onto static scenic evidence in the absence of effective cross-frame interaction. The latter is plausibly linked to [[attention-sink]] (shortcut language prior) but not quantified [source: raw/papers/kim-2025-map-the-flow.pdf §4, §open questions].

## Variants / Extensions

- **Causal Tracing** (Meng 2022): more sophisticated variant that identifies the causal roles of individual neurons / tokens.
- **Activation Patching**: replaces intermediate activations with those of a reference input.
- **Logit attribution / Probing**: complementary techniques to quantify layer/head contributions.
- **Mech interp of VLM/MLLM**: emerging field — Kim 2025 is one of the first to bring it to Video LLMs systematically.

## Related concepts

- [[causal-attention-mask]] — Attention Knockout is a targeted modulation of the mask.
- [[attention-sink]] — candidate phenomenon for the "static bias" identified in Kim 2025.
- [[visual-token-pruning]] — Kim 2025 hypothesizes complementarity (token pruning + edge pruning).
- [[evidence-highlighting]] — uses "attention as relevance" — primitive related to mech interp.

## Sources

- [[kim-2025-map-the-flow]] — applies Attention Knockout and Logit Lens to Video LLMs, reconstructs a 4-stage temporal reasoning pipeline.
