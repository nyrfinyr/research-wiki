---
title: Extending Look Twice to Video-VQA — design memo
type: synthesis
tags: [video-vqa, mllm, attention, training-free, evidence-highlighting, attention-sinks, video-llm, keyframe-sampling, future-aware-causal-mask]
created: 2026-05-18
updated: 2026-05-18
revised: 2026-05-18 (rev 2 — adds AKS and Future-Aware Causal Mask)
---

# Extending Look Twice to Video-VQA — design memo

## Thesis (revision 2)

The training-free two-pass inference of [[sources/morini-2026-look-twice]] (LoT) can be transferred from image KB-VQA to Video-VQA. The two engineering risks I flagged in revision 1 — *visual highlighting on video* and *two-pass cost* — largely dissolve once **adaptive keyframe selection** ([[sources/tang-2025-adaptive-keyframe-sampling]], AKS) and **future-aware causal-mask intervention** ([[sources/pei-2025-causal-mask-attention]]) are folded into the pipeline. The proposed Video-LoT becomes a four-step inference-time pipeline whose dominant cost is essentially the cost of a single ordinary generation pass on a keyframe-reduced input. The remaining risks shift away from "how do I mark a region across 32 frames" and toward "how do these inference-time interventions interact on the specific backbone ([[concepts/qwen3-vl|Qwen3-VL]]) used for evaluation".

## What each work contributes

### [[sources/morini-2026-look-twice]] — the method to transfer

Three reusable ingredients [source: raw/papers/morini-2026-look-twice.pdf §3]:

1. **Object-to-visual attention** aggregated over heads, a set of intermediate layers `L_vis`, and the spaCy-extracted object tokens `T_obj` (§3.2, Eq. 1-2).
2. **Multi-layer attention sink filtering** via the `D_sink` hidden dimensions that the BOS saturates (§3.2, Eq. 3); tokens with sink score above the 25-th percentile are zeroed in the visual relevance map.
3. **Two-pass inference with prompt-level markers**: first pass generates one token to expose the attention maps; second pass conditions on `<START_IMPORTANT_TXT>...<END_IMPORTANT_TXT>` / `<START_IMPORTANT_IMG>...<END_IMPORTANT_IMG>` markers (§3.2-3.3).

Already validated on Qwen2/2.5/3-VL and InternVL3.5 (2B-38B) on four KB-VQA benchmarks with +1.1 to +5.3 average points [source: raw/papers/morini-2026-look-twice.pdf Tab. 1]. On vision-centric / hallucination benchmarks the visual-only variant alone improves several backbones (e.g. Qwen3-VL-4B on V-Star +11.0) [source: raw/papers/morini-2026-look-twice.pdf Tab. 3]. The image-side margin is already largely closed; the open space is video.

### [[sources/kim-2025-map-the-flow]] — VideoLLM information flow

Mechanistic interpretability study using [[concepts/attention-knockout|Attention Knockout]] and Logit Lens on four VideoLLMs (LLaVA-NeXT-7B/13B-Video-FT, Mini-InternVL-4B-Video-FT, VideoLLaMA3-7B). Identifies a recurring 4-stage pipeline [source: raw/papers/kim-2025-map-the-flow.pdf §3.2-3.4]:

1. **Cross-frame interactions** between video tokens, layers 1-16 (early-to-middle). Blocking them costs 18.0-60.8 accuracy points across TVBench tasks (Tab. 2).
2. **Video-language integration on temporal keywords**, layers 6-20 (middle). The "true option" tokens act as integration checkpoints (Fig. 7-8).
3. **Concept emergence**: spatial concepts surface in very early layers on foreground patches; *temporal* concepts ("eat", "sit", "hold", "begins", "ends") only from middle layers onward, on residual patches (Fig. 5).
4. **Answer generation**, middle-to-late layers (Fig. 9): the true-option probability at the last token jumps abruptly around layer 20.

Causal validation: keeping only effective pathways preserves performance while suppressing 42-58 % of attention edges [source: raw/papers/kim-2025-map-the-flow.pdf §3.5, Tab. 3]; VideoLLaMA3-7B actually *improves* (TVBench 55.2 → 57.2) when 42 % of the edges are masked, because they were acting as noise.

Three direct design consequences for Video-LoT:

- `L_vis` should split into an early-to-middle band (where object/keyword → video attention forms) and a middle band (where the routing into temporal keywords completes).
- The "target token set" should extend `T_obj` to include `T_temporal_keyword` (verbs, temporal adverbs) and, for MCQA, the true-option tokens.
- Attention Knockout is the natural ablation tool to fix the layer ranges on a new backbone (e.g. Qwen3-VL) before instantiating LoT.

### [[sources/kim-2026-sink-token-aware-pruning]] (SToP) — the video-side sink definition

Defines a **temporal sink score** based on spatial persistence of attention across frames: `ŝ_i = Σ_t A^t_i`, normalised [source: raw/papers/kim-2026-sink-token-aware-pruning.pdf Eq. 4]. Tokens whose attention stays elevated at the same patch coordinate across all frames are sinks — orthogonal to LoT's BOS-hidden-dimension definition (which catches "image-style" sinks even when transient).

Two uses for Video-LoT:

1. **Hybrid sink score** `s_sink = α · s_BOS_dim + β · s_persistence`, combining both perspectives. The BOS-dim term catches per-frame sinks (LoT's strength); the persistence term catches background tokens that survive across the whole video (SToP's strength).
2. **As a pruning gate**, SToP retains performance at 10 % token budget on hallucination evaluation (§5), which can offset the second-pass cost if applied as a pre-step.

Both LoT (BOS-dim) and SToP (temporal persistence) are training-free and additively combinable.

### [[sources/liu-2025-selfelicit]] — the textual-side template

The direct ancestor of LoT's textual branch [source: raw/papers/liu-2025-selfelicit.pdf §3]: deep-half-layer attention aggregation, sentence-level scoring, `<start_important>` markers, threshold `α = 0.5`, default reading layers = last 50 % of the decoder. Useful for Video-VQA only when retrieved context, subtitles, or ASR transcripts are part of the prompt (Video-KB-VQA, TVQA-style benchmarks). Under vision-only Video-VQA the textual branch is inert, but SelfElicit remains useful as a "textual-only" baseline in the ablation table.

### [[sources/tang-2025-adaptive-keyframe-sampling]] (AKS) — keyframe gate

Reframes keyframe selection as a constrained optimisation [source: raw/papers/tang-2025-adaptive-keyframe-sampling.pdf §3.2, Eq. 2]: `argmax_𝓘 Σ_t∈𝓘 s(Q, F_t) + λ · c(𝓘)`, where `s(Q, F_t)` is prompt-conditioned image-text matching (BLIP-ITM by default, also CLIP, Sevila) and `c(𝓘)` is temporal coverage approximated via Ripley's K-function on recursive bins. The **ADA** algorithm (Adaptive Sampling, §3.3) is a judge-and-split tree: at each node, if `s_top − s_all > s_thr` return the top-M (TOP mode), else split the bin in two and distribute keyframes evenly (BIN mode), recursively up to depth `L`.

Reference numbers (Tab. 1) [source: raw/papers/tang-2025-adaptive-keyframe-sampling.pdf §4.2]:

| Backbone | Base | + AKS | Δ |
|---|---|---|---|
| Qwen2-VL-7B (32 frames) — LVBench | 55.5 | **60.5** | +5.0 |
| LLaVA-OV-7B (32 frames) — LVBench | 54.8 | **59.3** | +4.5 |
| LLaVA-Video-7B (64 frames) — LVBench | 58.9 | **62.7** | +3.8 |
| LLaVA-Video-7B (64 frames) — Video-MME | 64.4 | **65.3** | +0.9 |

LLaVA-Video-7B + AKS surpasses LLaVA-Video-72B (61.9 on LVBench) and GPT-4V / Gemini-1.5-Flash at 256 frames, using only 64 frames [source: raw/papers/tang-2025-adaptive-keyframe-sampling.pdf §4.2]. Scorer choice matters: BLIP wins on LVBench (object-level), CLIP wins on Video-MME (global) (Tab. 4). Even at 0.1 fps candidate sampling, AKS already beats the uniform baseline (Tab. 3).

Two specific contributions to Video-LoT:

1. **Direct front-loading**: AKS as a pre-VLM step reduces the second-pass cost of LoT by collapsing 32-64 frames into M = 8-16.
2. **Self-guided AKS variant** (not in the paper but a natural extension): the LoT first-pass already produces per-token attention from the VLM; aggregating `s(F_t) = Σ_{token ∈ F_t} a_vis[token]` yields a frame-level relevance score from the same forward, removing the need for an external BLIP/CLIP scorer. Whether this beats BLIP on Qwen3-VL is an empirical question (BLIP/CLIP are aligned with image-level relevance; VLM attention is aligned with downstream answer relevance — plausibly stronger but noisier).

### [[sources/pei-2025-causal-mask-attention]] — future-aware mask intervention

Empirical demonstration that the causal mask inherited from the LLM is **suboptimal for visual tokens**: visual queries have no intrinsic causal order, and blocking the future *for visual queries* is an artefact of the backbone's training, not a semantic constraint [source: raw/papers/pei-2025-causal-mask-attention.pdf §1, Fig. 1]. Three training-free masks acting only on rows `i ∈ 𝒱` (visual queries) [source: raw/papers/pei-2025-causal-mask-attention.pdf §3]:

- `M^f` (Def. 3.1) — visual queries see the entire upper triangle. Wins on temporal multi-image tasks (ActionPrediction, Visual Navigation, State Change) (Tab. 1).
- `M^{v2v}` (Def. 3.2) — visual queries see only future *visual* tokens. Wins on Visual Change Captioning, Visual Relation Expression (Tab. 2).
- `M^{v2t}` (Def. 3.3) — visual queries see only future *text* tokens. Wins on text-rich VQA (OCR-VQA 22.5 → 23.0, TextVQA 32.0 → 38.5) (Tab. 3).

**Light Future-Aware Attention** [source: raw/papers/pei-2025-causal-mask-attention.pdf §4, Eq. 11-14]: compresses the admitted future attention via 1D max-pool with kernel `k` and **sums it into the first token (the sink)** during prefill; decoding is then standard-causal. Tab. 6 reports 2-3 × speedup with merge while preserving accuracy (Fig. 7): from 83.18 ms/token to 26.54 ms/token for `M^f`+merge on LLaVA-7B at 4096 context.

Three direct uses for Video-LoT:

1. **Cross-frame coverage during extraction**. Applying `M^{v2v}` during LoT's first (attention-reading) pass lets visual queries attend to the entire video instead of only the past frames, enriching the `object → video` and `temporal-keyword → video` signals — the exact signal Map-the-Flow shows is critical in early-to-middle layers but which the causal mask artificially restricts to the past.
2. **Mask-bias highlighting in the second pass.** Replace LoT's prompt-level markers with a direct attention-mask intervention: `M[i, j] ← M[i, j] + δ` for `j` in the selected visual tokens, `M[i, j] ← −∞` for `j` in identified sink tokens. The "highlight" becomes a mask modulation, not a prompt annotation — sidestepping the per-frame-bbox problem entirely.
3. **Sink merge is compatible with sink filtering.** Pei's sink (the first text-prefix token, which absorbs future information) and LoT's sinks (visual tokens flagged by `D_sink` activation) are *different* objects living at different sequence positions, so there is no direct conflict.

Important limitation Pei explicitly states: experiments are restricted to LLaVA-1.5 / 1.6; Qwen2-VL and successors (M-RoPE, interleaved MRoPE) are *not* evaluated [source: raw/papers/pei-2025-causal-mask-attention.pdf §"Stated limitations"]. [[sources/liu-2026-adaptive-information-flow]] (AIF) also reports that indiscriminate `M^{v2v}` / `M^{v2t}` is dominated by entropy-driven selective relaxation on RealWorldQA and CountBench (AIF Tab. 8), suggesting that a uniform mask change is a coarse intervention.

### [[concepts/qwen2-5-vl]] / [[concepts/qwen3-vl]] — backbone candidates

Qwen3-VL-8B is the strongest "small-medium" backbone in LoT's Tab. 1 (+3.5 average on KB-VQA with LoT) [source: raw/papers/morini-2026-look-twice.pdf Tab. 1] and was **not** covered by Map the Flow (which uses LLaVA-NeXT-Video-FT, Mini-InternVL, VideoLLaMA3) [source: raw/papers/kim-2025-map-the-flow.pdf §3.1]. Replicating Map-the-Flow's Attention Knockout protocol on Qwen3-VL is therefore both (a) a prerequisite to fixing the layer ranges of Video-LoT and (b) a standalone contribution.

Note: Qwen3-VL uses **interleaved MRoPE**, **DeepStack** ViT-fusion into early LLM layers, and **textual timestamp tokens** for video [source: raw/papers/qwen3-vl-2025-tech-report.pdf §2.1-2.3]. None of the cited primitives (LoT sink filtering, SToP persistence, Pei's `M^{v2v}`) was designed with these specific upgrades in mind — see Risks below.

## Proposed pipeline (revision 2)

Four-step training-free pipeline. All steps run at inference time on a single backbone (no external scorer required if Step 1 uses the self-guided variant).

### Step 1 — Keyframe gate

Sample candidates at low fps (0.25-1 fps; AKS shows 0.1-0.25 fps is enough on V-MME — Tab. 3 of [[sources/tang-2025-adaptive-keyframe-sampling]]). Two implementation options:

- **(A) BLIP-AKS**: AKS as published — BLIP-ITM scorer + ADA tree, returning M = 8-16 keyframes. Closest to the published method; uses an external model.
- **(B) Self-guided AKS**: prompt-only forward through Qwen3-VL; aggregate `a_vis[token]` per frame to get `s(F_t)`; apply the same ADA tree. No external scorer, but a single VLM forward (still ≪ a full generation pass).

For both, ADA threshold `s_thr = 0.6-0.8` and depth `L = 3-5` per AKS Tab. 5; LongVideoBench-like (focused) prefers smaller `L`, Video-MME-like (multi-moment) prefers larger.

### Step 2 — Attention extraction pass

Prompt-only forward through Qwen3-VL on the M-keyframe input, with two modifications:

- **Apply `M^{v2v}`** (Pei Def. 3.2) so that visual queries can attend bidirectionally across the temporal axis — this is what Map-the-Flow's cross-frame interaction stage needs, made explicit. `M^{v2t}` left causal because temporal grounding of textual tokens still matters.
- **Materialise attention only on `L_extract = L_vis ∪ L_txt`** (the layer ranges fixed by a Map-the-Flow-style Attention Knockout calibration on Qwen3-VL, see §"Open design questions"). Avoid storing the full attention tensor across all 36-40 layers.

Extract three signals at the end of this pass:

1. `a_vis ∈ R^(M · N_v)` — object/temporal-keyword → visual attention, aggregated over `T_obj ∪ T_temporal_keyword`, the early-to-middle layers, and heads (LoT Eq. 2 generalised to keywords).
2. `s_sink ∈ R^(M · N_v)` — hybrid sink score `α · s_BOS_dim + β · s_persistence`, combining LoT's BOS-dim definition (Eq. 3 of [[sources/morini-2026-look-twice]]) and SToP's temporal persistence (Eq. 4 of [[sources/kim-2026-sink-token-aware-pruning]]).
3. `a_txt ∈ R^(N_c)` — last-to-context attention on retrieved evidence, deep-half layers, for the textual branch (only if textual context exists; otherwise skipped). LoT Eq. 7-8 / SelfElicit Eq. 3.

### Step 3 — Evidence selection

- **Visual**: tokens with `a_vis[j] > τ_vis` AND `s_sink[j] < τ_sink` form the relevant set `R_vis`. No bounding box extracted — the relevant set is the highlight unit, not a spatial rectangle. This *eliminates* LoT's centroid-and-spread bbox step (the paper itself flags it as inadequate for elongated/fragmented objects).
- **Textual** (if applicable): sentences whose `a_txt`-aggregated score is maximal (or above `α`) form `R_txt`, per SelfElicit.

### Step 4 — Highlighted answer pass (attention-mask intervention)

A standard generation pass through Qwen3-VL on the same M-keyframe input, with:

- **Causal mask modulation** (the replacement for LoT prompt markers):
  - `M[i, j] ← M[i, j] + δ_relevant` for `j ∈ R_vis` (additive logit bias, all queries).
  - `M[i, j] ← −∞` for `j ∈ sink_filtered` (hard suppression of the visual sinks not already removed in Step 3).
  - Keep `M^{v2v}` from Step 2 (visual queries still bidirectional), with **light merge into the first sink token** (Pei §4) to keep decoding standard-causal-fast.
- **Textual highlights** (if applicable): wrap `R_txt` with `<START_IMPORTANT_TXT>` markers (LoT-as-published; the textual branch keeps the prompt-level mechanism since text *does* have causal structure).

Generate the answer autoregressively. No prompt modification on the visual side, no marker tokens in the output stream.

### Cost summary

| Stage | Cost on Qwen3-VL-8B, M = 16 frames @ ~200 tok/frame |
|---|---|
| Step 1 (self-guided AKS, prompt-only forward at low fps) | ~0.3 × generation pass |
| Step 2 (prompt-only forward, `M^{v2v}`+merge, attention stored on L_extract only) | ~0.4 × generation pass |
| Step 3 (CPU-only scoring) | negligible |
| Step 4 (generation, `M^{v2v}`+merge → decoding-time causal) | 1.0 × generation pass |
| **Total** | **≈ 1.7 × a single ordinary generation pass** on the reduced keyframe set |

Compared to vanilla Qwen3-VL on 32-64 uniformly-sampled frames (~2-4 × the FLOPs of the reduced input), Video-LoT is in practice *not slower than the baseline at full frame count* — the AKS reduction more than offsets the extraction pass.

## How each problem from revision 1 is now addressed

| Problem (rev 1) | Resolution in rev 2 |
|---|---|
| 1. Visual highlighting on video has no natural extension of LoT's bbox-and-markers | **Solved** by Step 4: the highlight is an attention-mask additive bias, not a prompt marker. No per-frame bbox, no crop, no `<START_IMPORTANT_IMG>` tokens injected into the input. The model's visual structure is untouched. |
| 2. Two-pass cost is prohibitive on 32+ frames | **Solved** by Step 1: the AKS gate (and especially the self-guided variant, which costs nothing on top of LoT's already-needed first pass) reduces the second-pass input to M = 8-16 frames. Net total: ~1.7 × a vanilla generation pass on the reduced input, lower than vanilla-at-full-frames. |
| 3. First-token attention may not be saturated in video | **Mitigated** by Step 2's `M^{v2v}`: the cross-frame coverage problem that Map-the-Flow flags is addressed at the source — visual queries can attend bidirectionally during extraction, making the early-to-middle attention signal much richer even from a single prompt-only forward pass. Whether the extracted signal saturates *enough* on Qwen3-VL specifically is an empirical question (see Risks). |
| 4. Sink filtering definition for video | **Addressed** by the hybrid sink score in Step 2: `α · s_BOS_dim + β · s_persistence`. The two terms capture complementary failure modes. |
| 5. Where to read the signal (layer choice) | **Addressed** as a prerequisite: a Map-the-Flow-style Attention Knockout calibration on Qwen3-VL fixes `L_vis`, `L_sink`, `L_txt`. This is itself a publishable contribution since Qwen3-VL is not in Map the Flow's evaluation. |

## Updated risks (revision 2)

The dominant risks shift from engineering to behavioural / generalisation:

1. **Distribution shift of the attention-bias intervention (Step 4).** Adding `+δ` to a row of pre-softmax attention logits is a hard modification, different from prompt markers which the model can interpret with its language-modelling competence. The model has never been trained to handle a structurally-biased mask. `δ` likely has to be small and grid-searched per backbone; too large degrades the language head, too small does nothing. This is the principal *new* risk introduced by the design.

2. **`M^{v2v}` on Qwen3-VL is unvalidated.** Pei tests only LLaVA-1.5 / 1.6 [source: raw/papers/pei-2025-causal-mask-attention.pdf §"Stated limitations"]. Qwen3-VL uses interleaved MRoPE + DeepStack + textual timestamp tokens [source: raw/papers/qwen3-vl-2025-tech-report.pdf §2]. Interleaved MRoPE in particular distributes t/h/w across the full frequency spectrum and is meant to handle long-video structure under the causal mask — relaxing the mask could either reinforce or conflict with this design. Validation as a vanilla intervention (no LoT) on Qwen3-VL before integrating is mandatory.

3. **Self-guided AKS may be noisier than BLIP-AKS.** AKS deliberately uses an external scorer to *avoid* running the VLM at scoring time and to benefit from CLIP/BLIP's image-level alignment training. The VLM's first-pass attention is answer-aligned but possibly noisier at frame granularity, especially before the cross-frame integration completes (Map-the-Flow's middle layers). A back-to-back comparison (BLIP-AKS vs self-guided AKS on the same M, same backbone, same benchmark) is required.

4. **AIF dominates indiscriminate mask relaxation.** [[sources/liu-2026-adaptive-information-flow]] (Tab. 8) shows that entropy-driven selective relaxation beats uniform `M^{v2v}` / `M^{v2t}` on RealWorldQA and CountBench, suggesting the proposed pipeline may want to incorporate AIF's selectivity rather than apply `M^{v2v}` everywhere. This is a strict generalisation: AIF-conditional mask relaxation is at most as expensive and at least as accurate as the uniform variant.

5. **Hybrid sink score weights `α`, `β` are unknown.** LoT and SToP each set their respective thresholds in isolation. The hybrid combination has not been studied; the two terms can saturate against each other (high BOS-dim activation in a transiently moving region may also have low persistence, or vice versa). At minimum, a 2D sweep on a small dev set is needed.

6. **Compatibility with Qwen3-VL's textual timestamp tokens.** Qwen3-VL prefixes each temporal patch with `<3.0 seconds>` text tokens [source: raw/papers/qwen3-vl-2025-tech-report.pdf §2.3]. These become extra "textual" tokens in the sequence — the textual branch of LoT and the `M^{v2v}` definition both need to be aware that what looks like "visual context" actually includes interleaved text. Definition of `𝒱` (the visual-query set) must be updated to *exclude* timestamp tokens, otherwise mask relaxation leaks into structured text positions.

## Open design questions (for the supervisor discussion)

1. **AKS coupling.** Keep AKS as a separate pre-step (Step 1 = BLIP-AKS, clean ablation control) or fuse it into the extraction pass (Step 1 + Step 2 = single forward, more efficient but ablation-coupled)?
2. **Mask-bias amplitude.** Additive `+δ` (gradated, hyper-parameter) vs hard mask retention (binary: keep only `R_vis`, mask `−∞` everything else)? Pei uses binary; LoT-with-markers is effectively gradated (the model decides how much to weight). I lean additive — it is a closer translation of LoT's prompt-marker semantics — but it introduces `δ`.
3. **`M^{v2v}` in extraction-only or in both passes?** Step 2 needs it for the bidirectional signal. Step 4 has both reasons (better video reasoning) and counter-reasons (more distribution shift on top of mask-bias). A 2×2 design study.
4. **Target benchmark.** Hallucination (EventHallusion, AMBER-Video) vs MCQA (MVBench, VideoMME) vs Video-KB-VQA (does a serious one exist, or should we adapt TVQA + Wikipedia)?
5. **Sanity-check phase ordering.** Before building the pipeline, validate the two riskiest individual primitives standalone on Qwen3-VL-8B:
   - Run `M^{v2v}` vanilla on MVBench / Video-MME and check it does not regress.
   - Run self-guided AKS vs BLIP-AKS on LongVideoBench at matched M.
   If either fails, the pipeline pivots accordingly *before* code is written.
6. **Should we hybridise with [[sources/liu-2026-adaptive-information-flow]] (AIF)?** Replace uniform `M^{v2v}` with AIF's entropy-driven selective mask relaxation. This buys the AIF gains essentially for free; cost is one more dependency.

## Verdict

The direction is significantly more defensible after AKS and Pei than it was in revision 1. The publishable slot is now: *Video-LoT on Qwen3-VL — a four-step training-free pipeline integrating self-guided keyframe selection, future-aware bidirectional attention extraction, hybrid (BOS-dim × temporal-persistence) sink filtering, and mask-bias evidence highlighting, evaluated on a hallucination benchmark plus one MCQA Video-VQA benchmark*. The two engineering risks of revision 1 are dissolved; the remaining risks are about *interaction effects on the specific Qwen3-VL backbone* and are addressable by the sanity-check phase outlined above. The required prerequisite — Attention Knockout calibration on Qwen3-VL à la Map-the-Flow — doubles as an independent contribution worth a paper section on its own.

Concrete next single step: **run the two sanity checks of question 5 on Qwen3-VL-8B**. They take a small fraction of the final pipeline's engineering, and if either fails the design pivots before code is written.

## Sources used

Primary methods:

- [[sources/morini-2026-look-twice]] — Look Twice (LoT), the method to transfer.
- [[sources/kim-2025-map-the-flow]] — mechanistic interpretability of VideoLLMs; fixes which layers to read.
- [[sources/kim-2026-sink-token-aware-pruning]] — SToP, the temporal-persistence sink definition.
- [[sources/liu-2025-selfelicit]] — textual-branch template, sentence-level evidence highlighting.
- [[sources/tang-2025-adaptive-keyframe-sampling]] — AKS, the keyframe gate (Step 1).
- [[sources/pei-2025-causal-mask-attention]] — future-aware causal masks (Step 2 and Step 4).

Backbones:

- [[sources/qwen3-vl-2025-tech-report]] / [[concepts/qwen3-vl]] — primary backbone candidate.
- [[sources/qwen2-5-vl-2025-tech-report]] / [[concepts/qwen2-5-vl]] — secondary backbone for cross-version comparison.

Comparison and adjacent work cited inline:

- [[sources/liu-2026-adaptive-information-flow]] — entropy-driven selective mask relaxation; potential hybridisation point (Risk 4, Open question 6).
