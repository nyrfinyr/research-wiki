---
title: "Liu et al. (2026) — Aligning What Vision-Language Models See and Perceive with Adaptive Information Flow"
type: source
tags: [vision-language-model, training-free, causal-mask, attention-modulation, visual-grounding, hallucination, vqa, test-time-intervention]
created: 2026-05-15
updated: 2026-05-15
source_path: raw/papers/liu-2026-adaptive-information-flow.pdf
source_kind: paper
source_date: 2026-04-17
doi: 10.48550/arXiv.2604.15809
zotero_key: E3UCDUE6
venue: arXiv preprint
authors: [Chengxin Liu, Wonseok Choi, Chenshuang Zhang, Tae-Hyun Oh]
year: 2026
---

# Aligning What Vision-Language Models See and Perceive with Adaptive Information Flow

## TL;DR

Liu et al. show that the "see vs. perceive gap" in VLMs (attention falls on the right regions but the answer is wrong) stems from a suboptimal **information flow**: text tokens distribute attention over too many irrelevant visual tokens. They propose **Adaptive Information Flow (AIF)**, a *test-time* modulation of the causal mask based on "token dynamics" (cross-layer attention statistics). For each visual token an entropy is computed from its activation across layers; high-entropy tokens (irregular, irrelevant) are masked out of the visual→text interaction, while vision-to-vision aggregation is preserved. No training, a single extra decoding step. On LLaVA-1.5-7B and Qwen2.5-VL-7B it improves VQA, OCR, grounding (RefCOCO +2.3 average), counting, and hallucination (POPE) by 1–8 points [source: raw/papers/liu-2026-adaptive-information-flow.pdf Abstract, §5.2].

## Main contribution

- Observation/diagnosis: only a subset of visual tokens significantly impacts the LLM output, and manual modulation of the information flow can lead to a notably higher "oracle" accuracy (e.g. LLaVA-1.5 RealWorldQA 55.6→61.6, TextVQA 47.8→49.9, CountBench 47.0→50.3) [source: raw/papers/liu-2026-adaptive-information-flow.pdf §3.3, Tab.1].
- **Token dynamics** metric: $D_{v_i}=\{d^l_{v_i}\}_{l=1}^L$ with $d^l_{v_i}=\max_j a^l_{i,j}$ (max image-to-text attention per layer). Object tokens = activation concentrated in a few layers; irrelevant tokens = randomness across layers [source: raw/papers/liu-2026-adaptive-information-flow.pdf §3.2].
- Importance measure: entropy $\text{Ent}_{v_i} = \sum_l -\frac{d^l_{v_i}}{L\mu_{v_i}}\log\frac{d^l_{v_i}}{L\mu_{v_i}}$. High entropy ⇒ unimportant token [source: raw/papers/liu-2026-adaptive-information-flow.pdf §4.2, Eq.4].
- Adaptive selection of the *mask ratio* via entropy-based threshold optimization that maximizes the shift of the attention-value distribution $S_0$ [source: raw/papers/liu-2026-adaptive-information-flow.pdf §4.3, Eq.5].

## Method

**Pipeline (§4.1, Fig.6)** — *training-free*, acts only on the causal mask at inference time:

1. **One-step profiling decoding**: input image+prompt → standard tokenization → first LLM forward step to collect the attention matrices $a^l_{i,j}$ at each layer $l$ and for each visual token $v_i$ [source: raw/papers/liu-2026-adaptive-information-flow.pdf §4.1].
2. **Token dynamics** (§3.2): for each visual token compute $D_{v_i}$ and $\mu_{v_i}=\frac{1}{L}\sum_l d^l_{v_i}$.
3. **Entropy map** (§4.2, Eq.4): $\text{Ent}_{v_i}$ measures the randomness across layers — low for "concentrated" tokens (relevant object), high for "noisy" tokens.
4. **Adaptive masking** (§4.3, Eq.5): iterate over mask ratios in $\{0.1, 0.2, \dots, 0.9\}$, masking in order the highest-entropy tokens; for each ratio compute $S_0=-\sum_i (\mu_{v_i}/\sum \mu)\log(\mu_{v_i}/\sum \mu)$. Select the ratio whose distribution deviates most from the original $S_0$.
5. **Modulated causal mask** (Fig.2b): masked tokens are disconnected only from text tokens; visual↔visual and text→visual_masked remain active, so visual information is not eliminated (unlike the *visual token pruning* in [Chen 2024]).
6. **Final inference**: rerun the forward pass with the new mask. Additional cost ≈ "1 token generation" (one extra decoding step + mask generation of a few ms) [source: raw/papers/liu-2026-adaptive-information-flow.pdf §5.4].

**Backbones evaluated**: LLaVA-1.5-7B (ViCrop prompt setting) and Qwen2.5-VL-7B (default VLMEvalKit).

## Key results

**General VQA + OCR + Counting (Tab.2)**:

| Backbone | V* | RealWorldQA | MMStar | TextVQA | SeedBench2-Plus | CountBench |
|---|---|---|---|---|---|---|
| LLaVA-1.5-7B baseline | 42.4 | 55.6 | 33.1 | 47.8 | 41.3 | 47.0 |
| + AIF | 50.3 (+7.9) | 60.5 (+4.9) | 39.5 (+6.4) | 49.9 (+2.1) | 44.9 (+3.6) | 50.1 (+3.1) |
| Qwen2.5-VL-7B baseline | 78.5 | 68.5 | 63.9 | 84.9 | 70.4 | 87.1 |
| + AIF | 84.8 (+6.3) | 74.5 (+6.0) | 70.9 (+7.0) | 86.0 (+1.1) | 76.5 (+6.1) | 89.5 (+2.4) |

**Visual Grounding (Tab.3)** — Qwen2.5-VL-7B + AIF surpasses Grounding-DINO-L and InternVL-2.5-8B: RefCOCO/+/g average 86.6 → 88.9 (+2.3) [source: raw/papers/liu-2026-adaptive-information-flow.pdf §5.2].

**POPE Hallucination (Tab.4)**: LLaVA-1.5-7B 85.4→88.7; Qwen2.5-VL-7B 87.8→89.5.

**Vs. competitor methods (Tab.5)** on LLaVA-1.5-7B: AIF (39.5/60.5/88.7) beats training-free ViCrop (35.2/56.7/87.2) and training-based CCA (33.2/51.8/86.9).

**Quantitative justification of entropy (Tab.6)** on RefCOCO with Qwen2.5-VL-7B: in the top-20% of tokens, *high-attention* recovers 28.8/25.1/21.2% of object tokens (small/medium/large), *low-entropy (ours)* recovers 49.7/41.4/31.0%. Entropy is a better proxy than pure attention.

**Ablations (Tab.7-8)**: random masking (40.3) and low-entropy masking (38.7) are worse than AIF (50.3) on V*. The future-aware mask from [[pei-2025-causal-mask-attention]] (vis2vis / vis2text) degrades performance (48.9/49.8 RealWorldQA) — AIF is specifically better [source: raw/papers/liu-2026-adaptive-information-flow.pdf §5.3].

## Stated limitations

- "May suffer from lengthy and indirect text prompt": long or vague prompts make it hard to identify the important regions [source: raw/papers/liu-2026-adaptive-information-flow.pdf §5.4].
- Only for backbones with standard causal attention; not tested on VLMs with modified masks (e.g. Qwen2-VL-MMRoPE).
- All experiments on images (not video) and on 7B open-source backbones; commercial models (GPT-4o, Claude) cannot be modified this way.

## Open questions / critiques

- Does the "1 extra decoding step" overhead become significant on very long prompts? No benchmark on prompts > 1K tokens.
- How does it scale to multi-image or video sequences? The definition of token dynamics presupposes stable attentions across layers, but on video tokens the statistics may be diluted.
- What changes if the modulation is done per-head instead of per-token? A plausible extension consistent with the "attention heads for grounding" line of work (Kang et al., CVPR 2025).
- Entropy is computed over per-layer max; would a weighted average be robust? Not ablated.

## Cited concepts

- [[vision-language-model]]
- [[causal-attention-mask]] / [[causal-mask-modulation]]
- [[training-free-methods]]
- [[information-flow]] — new key concept
- [[token-dynamics]] — importance proxy
- [[entropy-based-importance]]
- [[attention-modulation]]
- [[visual-token-pruning]] — contrast (FastV / image-is-worth-1/2-tokens)
- [[future-aware-causal-mask]] — comparison with [[pei-2025-causal-mask-attention]]
- [[visual-cropping]] — comparison with ViCrop
- [[concentric-causal-attention]] — comparison with CCA (training-based)
- [[refcoco]], [[refcoco-plus]], [[refcocog]] — grounding benchmarks
- [[textvqa]], [[ocrvqa]] — OCR benchmarks
- [[realworldqa]], [[mmstar]], [[v-star-bench]] — VQA
- [[countbench]] — counting
- [[seedbench2-plus]] — OCR + reasoning bench
- [[pope]] — hallucination
- [[llava-1.5]], [[qwen2.5-vl]] — backbones
- [[vlmevalkit]] — toolkit

## Direct quotes

> "Modulating information flow during inference can improve the perception capability of VLMs." [source: raw/papers/liu-2026-adaptive-information-flow.pdf §1]

> "Visual tokens corresponding to object regions are highly activated in certain layers, while irrelevant regions exhibit irregular activation patterns." [source: raw/papers/liu-2026-adaptive-information-flow.pdf §1, Fig.1]
