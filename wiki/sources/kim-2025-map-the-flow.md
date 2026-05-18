---
title: "Kim, Kim & Han (2025) — Map the Flow: Revealing Hidden Pathways of Information in VideoLLMs"
type: source
tags: [video-llm, mechanistic-interpretability, attention-knockout, logit-lens, temporal-reasoning, video-qa, information-flow, early-exit]
created: 2026-05-15
updated: 2026-05-15
source_path: raw/papers/kim-2025-map-the-flow.pdf
source_kind: paper
source_date: 2025-10-15
doi: 10.48550/arXiv.2510.13251
zotero_key: 8CKDZ2MF
venue: ICLR 2026
authors: [Minji Kim, Taekyung Kim, Bohyung Han]
year: 2025
---

# Kim, Kim & Han (2025) — Map the Flow: Revealing Hidden Pathways of Information in VideoLLMs

## TL;DR

**Mechanistic interpretability** study on Video LLMs (LLaVA-NeXT-7B/13B-Video-FT, Mini-InternVL-4B-Video-FT, VideoLLaMA3-7B): the authors use **Attention Knockout** (Geva et al. 2023) and **Logit Lens** (nostalgebraist 2020) to reconstruct *how* and *where* Video LLMs perform temporal reasoning during VideoQA. They identify a recurring 4-stage pipeline: (1) **cross-frame interactions** between video tokens in early-to-middle layers, (2) **video-language integration** on the prompt's *temporal keywords* in middle layers, (3) the probability of the correct answer rises abruptly in middle-to-late layers, (4) activating only the identified "effective pathways" preserves VideoQA performance while suppressing up to **58% of attention edges** (LLaVA-NeXT-7B-Video-FT). The work provides a blueprint for structured attention pruning, early-exit and regularisation of dominant pathways in Video LLMs, and shows that fine-tuning on VideoQA specifically induces cross-frame dependence in early-middle layers (absent in the pure ImageLLM predecessor).

## Main contribution

- First end-to-end characterisation of the *internal information flow* of Video LLMs on VideoQA: temporal reasoning structured in 4 phases consistent across 4 models and 5 TVBench tasks, also validated on TOMATO and LongVideoBench [source: raw/papers/kim-2025-map-the-flow.pdf §3, §A, Tab. 3, Tab. A].
- Evidence that video instruction tuning explicitly adds the **cross-frame attention** ability in layers 1-16, *absent* in the image-only model (LLaVA-NeXT-7B vs. LLaVA-NeXT-7B-Video-FT, Fig. 2) [source: raw/papers/kim-2025-map-the-flow.pdf §3.2, Tab. 2].
- Identification of **temporal keywords** (verbs, option tokens in the prompt) as **checkpoints** of video-language integration, and causal validation: keeping only the effective pathways preserves VideoQA accuracy with **42-58%** of the original edges (Tab. 3) [source: raw/papers/kim-2025-map-the-flow.pdf §3.3, §3.5].

## Method

### Setup (§3.1)

- **Tasks**: 5 tasks from [[tvbench]] (Cores et al. 2024), a VideoQA benchmark that minimises static-scene bias — Action Antonym, Action Sequence, Scene Transition, Moving Direction, Object Count (Tab. 1).
- **Filter**: only samples answered correctly by the model (to ensure valid causal tracing).
- **Primary backbone**: LLaVA-NeXT-7B (image-only) fine-tuned 3 epochs on VideoChat2-IT → **LLaVA-NeXT-7B-Video-FT**, 8 frames × 144 tokens. Additional backbones: LLaVA-NeXT-13B-Video-FT, Mini-InternVL-4B-Video-FT, VideoLLaMA3-7B (§E, §F).
- **Extended benchmarks**: TVBench, TOMATO, VCGBench (open-ended), LongVideoBench (long-form), Video-MME.

### Attention Knockout (§2.2)

To disable information flow from source token `s` to target token `t` at layer `l`, set `M^l[s,t] = −∞` in the scaled dot-product attention softmax (Eq. 1). The relative percentage change in the probability of answer `a` is measured: `(p_knockout − p_base)/p_base × 100`. The ablations use a *window* `k=9` layers centred on `l` (to prevent residual connections from bypassing the intervention; sensitivity in §G.6).

### Logit Lens (§3.3)

Project the hidden states of video tokens at every layer through the language-model head, and count the frequency of spatial and temporal *keywords* extracted from the prompt. Visualise the patch positions of tokens activating a given concept (Fig. 5, Fig. F).

### Discovered pipeline (Fig. 1, §3.2-3.4)

1. **Cross-frame interactions** (layers 1-16, early-to-middle): video tokens form spatiotemporal representations by interacting across frames. Blocking these interactions drops accuracy by 18-60.8 percentage points depending on the task (Tab. 2).
2. **Video-language integration on temporal keywords** (layers 6-20): video information is selectively propagated to the prompt's *correct-option* tokens (Fig. 7-8). The direct vs. indirect (via non-option question) pathway varies by task.
3. **Concept emergence** (Logit Lens, §3.3): **spatial** concepts already emerge in very early layers on foreground tokens; **temporal** concepts ("eat", "sit", "hold", "up", "down") only emerge in middle layers, and on *residual* patches rather than overwriting the stabilised spatial ones (Fig. 5).
4. **Answer generation** (layers 16-25, middle-to-late): the true-option probability at the last token *jumps* around layer 20, immediately after integration completes (Fig. 9). There is no gradual competition between options: the correct one dominates rapidly.
5. **Failure case analysis** (§4): in wrong samples the cross-modal integration pattern is similar to that of successes, but wrong samples have two primary failure modes — (Case 1) spurious cross-frame interactions in early layers that channel wrong signal, (Case 2) static bias, i.e. the model collapses onto static-scene evidence in the absence of effective cross-frame attention.

### Structured pruning of attention edges (§3.5)

Attention is enabled **only** inside the layer ranges identified as effective: cross-frame interaction L6-15, video→question L6-20, question→last L16-25; video→last, last→last globally and inflows into video/question in late layers are **disabled**. The result is compared to a *random blocking* baseline at the same budget.

## Key results

### Cross-frame ablation (Fig. 2, Tab. 2)

Blocking cross-frame attention in layers 1-16 causes accuracy drops on LLaVA-NeXT-7B-Video-FT:
- Action Antonym **−24.1%**
- Action Sequence **−20.2%**
- Scene Transition **−18.0%**
- Moving Direction **−44.8%**
- Object Count **−60.8%**

The model goes as far as generating *opposite* answers (e.g. "moves to the **left**" instead of "to the **right**"). For LLaVA-NeXT-7B (image-only) the layer-wise sensitivity is almost flat: video fine-tuning is responsible.

### Effective pathways vs. random blocking (Tab. 3)

| Model | Total edges | Effective pathways | TVBench | TOMATO |
|---|---|---|---|---|
| LLaVA-NeXT-7B-Video-FT | 25.7M (100%) | full causal 51.5 / effective 51.2 / random 40.1 | (42% edges) | 30.2 / 29.2 / 23.1 |
| LLaVA-NeXT-13B-Video-FT | 32.2M | 55.1 / 54.6 / 41.5 | (37%) | 27.2 / 27.4 / 23.8 |
| Mini-InternVL-4B-Video-FT | 74.6M | 56.0 / 56.0 / 41.0 | (40%) | 32.2 / 31.2 / 25.9 |
| VideoLLaMA3-7B | 19.9M | 55.2 / 57.2 / 22.2 | (58%) | 28.0 / 28.7 / 13.9 |

VideoLLaMA3-7B actually **improves** (TVBench 55.2 → 57.2, TOMATO 28.0 → 28.7) by suppressing 42% of the edges: non-effective pathways act as noise. Random blocking at the same budget crashes to 22.2 TVBench and 13.9 TOMATO — drops of 33+ points compared to the effective pathways.

### Long-form (Tab. A, Appendix G.1)

On LongVideoBench with LLaVA-NeXT-7B-Video-FT: full causal 46.1 → effective pathway (42% edges) 45.5 (−0.6 points). Effective pathways generalise to long video.

### Open-ended (Appendix B)

- Single-token: blocking cross-frame in layers 1-16 collapses the first-answer-token probability in all three analysed tasks (Action Antonym, Moving Direction, Object Count). Without explicit options, the **last token** itself acts as integration checkpoint (Fig. B).
- Multi-token (VCGBench Temporal QA): verbs generated in the response become *new dynamic checkpoints*. As more anchors are generated, the video → last flow progressively shifts towards video → response → last (Fig. D).

### Video-language alignment (Fig. 6)

When cross-frame is intact, the "begins" token in the query attends to the initial frames and "ends" to the final ones (semantic alignment). Blocking cross-frame, attention collapses onto positional proximity, not semantic. This is the signature of the fact that Video LLMs implicitly learn to **align** video representations with linguistic embeddings of temporal concepts.

### Logit Lens visualisation (Figs. 4, 5, F)

Spatial concepts (e.g. "floor", "paper", "person", "table") appear already in layers 1-5 on foreground patches; temporal concepts (e.g. "eat", "sit", "hold") start from layers 11-15 onwards and localise in *residual* patches — the model first stabilises the spatial pass and uses the remaining capacity for the temporal one.

## Stated limitations

- Analysis is restricted to **correctly answered samples** for the validity of causal tracing: the described patterns may be less crisp on borderline samples.
- All analysed Video LLMs are obtained by fine-tuning image-based MLLMs; behaviours may differ in models pre-trained from scratch on video (none exists at large scale yet).
- The framework uses 8 frames with 144/256 tokens per frame. Long-form (LongVideoBench) is tested only in the Appendix.
- Identification of *temporal keywords* in open-ended QA relies on POS-tagging (spaCy, verbs) — heuristic, not oracle.

## Open questions / critiques

- The "effective pathways" are identified empirically with fixed layer ranges (Tab. E in the appendix) per backbone: an automatic method to discover model-specific pathways without grid search is needed.
- Direct connection with visual token pruning: the fact that 58% of edges are useless suggests that **token pruning** (cf. Kim et al. 2026, [[stsp]]) and **edge pruning** are complementary. Can SToP-style sink-token suppression be combined with structured attention-edge pruning?
- Are the "static bias" failure modes (Case 2 in §4) the same phenomenon as [[attention-sink]] or "shortcut on language prior"? No mechanistic quantification is given.
- The authors hypothesise early-exit (Schuster 2022, Bae 2023) as an application: but the probability jump occurs around layer 20 of 32-40, so the theoretical FLOPs saving on the LLM is ~40%. They do not report latency benchmarks.
- Generalisation to **long videos with adaptive frame sampling** or to *streaming inference* is not explored.

## Cited concepts

- [[video-llm]]
- [[video-qa]]
- [[mechanistic-interpretability]]
- [[attention-knockout]]
- [[logit-lens]]
- [[causal-tracing]]
- [[cross-frame-attention]]
- [[video-language-integration]]
- [[temporal-reasoning]]
- [[temporal-keyword]]
- [[information-flow-pathway]]
- [[effective-pathways]]
- [[answer-generation-layer]]
- [[concept-emergence]]
- [[scaled-dot-product-attention]]
- [[causal-attention-mask]]
- [[multi-head-attention]]
- [[tvbench]]
- [[tomato-benchmark]]
- [[vcg-bench]]
- [[longvideobench]]
- [[video-mme]]
- [[llava-next]]
- [[llava-next-video-ft]]
- [[mini-internvl]]
- [[videollama-3]]
- [[videochat2-it]]
- [[mvbench]]
- [[early-exit]]
- [[pathway-regularization]]
- [[static-scene-bias]]
- [[fine-grained-video-understanding]]

## Direct quotes

> "temporal reasoning in VideoLLMs initiates with active cross-frame interactions in early-to-middle layers, … followed by progressive video-language integration in middle layers." (Abstract, p. 1)

> "VideoLLMs retain their VideoQA performance by selecting these effective information pathways while suppressing a substantial amount of attention edges, e.g., 58% in LLaVA-NeXT-7B-Video-FT." (Abstract, p. 1)

> "the model first grounds spatial concepts (e.g., salient entities or attributes) at foreground tokens in early layers, and later utilizes the remaining token positions to represent temporal dynamics, rather than overriding the already stabilized spatial representations." (§3.3, p. 6)

> "temporal keywords function as information integration checkpoints, with their specific pathways adapting to the underlying prompt structure." (§3.3, p. 8)

> "the prediction probability for the true option rises abruptly starting around the 20th layer, which coincides with the completion of the video-to-question information flow." (§3.4, p. 9)
