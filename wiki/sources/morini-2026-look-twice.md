---
title: "Morini et al. (2026) — Look Twice: Training-Free Evidence Highlighting in Multimodal Large Language Models"
type: source
tags: [look-twice, mllm, kb-vqa, evidence-highlighting, attention-sink, multimodal-attention, training-free, inference-time, visual-grounding, vqa]
created: 2026-05-15
updated: 2026-05-15
source_path: raw/papers/morini-2026-look-twice.pdf
source_kind: paper
source_date: 2026-04-01
doi: 10.48550/arXiv.2604.01280
zotero_key: C96IG22A
venue: arXiv preprint (2026)
authors: [Marco Morini, Sara Sarto, Marcella Cornia, Lorenzo Baraldi]
year: 2026
---

# Morini et al. (2026) — Look Twice: Training-Free Evidence Highlighting in Multimodal Large Language Models

## TL;DR

**Look Twice (LoT)** is a **training-free, inference-time** framework that improves how an MLLM uses multimodal evidence in the **Knowledge-Based VQA** setting. The idea: make the model look at the input **twice** — a first forward pass generates **a single token** and produces the attention maps; these are used to identify (a) the **relevant visual region** (filtering visual attention sinks via a score on the BOS's critical dimension-channels) and (b) the **relevant textual evidence sentences** in the retrieved context (RAG). The selected cues are **highlighted** in the prompt with markers `<START_IMPORTANT_TXT>` and with a bounding box `<START_IMPORTANT_IMG>` on the image. A second forward pass generates the final answer on the enriched input. No training, no modified parameters, overhead ≈ 1 token. On 4 KB-VQA benchmarks (E-VQA, InfoSeek, OVEN, ViQuAE) × 10 MLLMs (Qwen2-VL, Qwen2.5-VL, Qwen3-VL, InternVL3.5 from 2B to 38B), LoT improves by **+1.1 to +5.3** average points across all combinations; it also shows gains on vision-centric and hallucination benchmarks (RealWorldQA, V-Star, POPE, AMBER) using only the visual highlighting [source: raw/papers/morini-2026-look-twice.pdf §1, §4].

## Main contribution

- Training-free framework for **multimodal evidence highlighting** in MLLMs, which uses the model's dynamic attentions as an implicit relevance signal, without fine-tuning or architectural changes [source: raw/papers/morini-2026-look-twice.pdf §1].
- **Multi-layer attention sink filtering** for the visual modality: identifies the `D_sink` (subset of hidden dimensions where the BOS — prototypical sink — has massive activations) and suppresses visual tokens that activate these dimensions above threshold τ (§3.2, Eq. 3).
- **Two-pass inference**: the first pass costs a single token; the second pass uses the augmented prompt → **negligible** computational overhead (§3, contributions).
- Cross-architecture (Qwen, InternVL) and cross-scale (2B → 38B) validation; ablation shows that visual and textual highlighting are **complementary** (Tab. 2).

## Method

### KB-VQA setup (§3.1)

Multimodal input `X = [X_V; X_T; X_C]` of length `S = N_V + N_T + N_C` (visual tokens, question tokens, retrieved context tokens). Retrieval pipeline (§4.2): cross-modal EVA-CLIP image-to-text + FAISS, top-`n=3` Wikipedia entity → textual context.

Attention notation: `A^(ℓ,k) ∈ R^(S×S)` for layer `ℓ`, head `k`.

### Self-guided Visual Evidence Selection (§3.2)

1. **Object-to-visual submatrix** (Eq. 1):
   `A^(ℓ,k)_obj→vis = A^(ℓ,k)[T_obj, V] ∈ R^(|T_obj|×N_V)`,
   where `T_obj` are the indices of the **target object** tokens extracted from the question with spaCy dependency parsing (cap. B, "Target Object Identification").
2. **Cross-layer and cross-head aggregation** (Eq. 2): average over `T_obj`, `L_vis` (intermediate layers — where cross-modal grounding emerges), and all `K` heads ⇒ vector `a_vis ∈ R^(N_V)`.

### Multi-Layer Attention Sink Filtering (§3.2)

Citing [[gu-2024-attention-sink]] and Kang et al. 2026 (Visual Attention Sink in MLLM): some visual tokens massively activate the same `D_sink` dimensions as the BOS. Sink score:
`s_sink = (1/|L_sink|) Σ_{ℓ ∈ L_sink} max_{m ∈ D_sink} |H^ℓ_V[:,m]| / ‖H^ℓ_V‖_row` (Eq. 3),
with `L_sink = L_vis`. Tokens with `s_sink > τ` (default: 25th percentile of sink scores on visual tokens) ⇒ `a_vis[i] = 0`. Filtering is applied **only during the analysis pass** (first forward); final generation uses unfiltered attentions.

### Bounding Box Extraction (§3.2)

- Reshape `a_vis` → 2D map `M_vis ∈ R^(H×W)`.
- Weighted centroid `(c_x, c_y)` (Eq. 4); deviations `σ_x, σ_y` (Eq. 5).
- Bounding box `(c_x − βσ_x, c_y − βσ_y, c_x + βσ_x, c_y + βσ_y)` with `β=2` (Eq. 6).

Comparison of three methods (Tab. 4, supplementary): Min-Max, Morphological, Weighted Centroid. Weighted Centroid is best (IoU 0.487, center distance 0.071).

### Self-guided Textual Evidence Selection (§3.2)

**Last-to-context** extraction from the last generated token (Eq. 7): `A^(ℓ,k)_last→ctx = A^(ℓ,k)[t, C]`.
Aggregation over `L_txt` = **second half of the decoder** (deeper layers, consistent with [[liu-2025-selfelicit]]) and all `K` heads (Eq. 8). Aggregation over sentences; selection: sentence with maximum score (or score ≥ α).

### Multimodal Inference with Evidence Highlighting

Markers:
- Text: `<START_IMPORTANT_TXT>...<END_IMPORTANT_TXT>` on the selected sentences.
- Image: `<START_IMPORTANT_IMG>...<END_IMPORTANT_IMG>` on the bounding box.

System instructions updated to tell the model **not to reproduce the markers** in the output. Second forward pass over `[X*_V; X_T; X*_C]`.

## Key results

### Main KB-VQA (Tab. 1, §4.3)

Average of the 4 metrics (E-VQA, InfoSeek, OVEN, ViQuAE):

| Backbone | Base | + LoT | Δ |
|---|---|---|---|
| Qwen2-VL-2B | 10.2 | 11.9 | +1.7 |
| Qwen2.5-VL-3B | 21.2 | 25.5 | **+4.3** |
| Qwen3-VL-4B | 30.2 | 31.5 | +1.3 |
| InternVL3.5-4B | 25.6 | 29.8 | **+4.2** |
| Qwen2-VL-7B | 22.9 | 28.2 | **+5.3** |
| Qwen2.5-VL-7B | 28.0 | 29.1 | +1.1 |
| Qwen3-VL-8B | 31.5 | 35.0 | +3.5 |
| InternVL3.5-8B | 30.2 | 33.7 | +3.5 |
| Qwen2.5-VL-32B | 27.8 | 31.5 | +3.7 |
| InternVL3.5-38B | 34.1 | 37.5 | +3.1 |

Most pronounced gains on InfoSeek/ViQuAE (e.g. InternVL3.5-4B ViQuAE 36.4 → 45.6).

### Modality ablation (Tab. 2, §4.4)

Qwen2.5-VL-3B on E-VQA / InfoSeek:
- **Textual only**: 27.8→29.4 / 22.4→24.1.
- **Visual only**: 27.8→29.6 / 22.4→23.9.
- **Both (LoT)**: 30.4 / 25.2.

The two modalities are **complementary**.

### Number of retrieved passages (Fig. 4 left)

With `n` retrieved passages 1→3 the baseline gains little (saturation + noise); LoT maintains a consistent gain, suggesting that textual highlighting **absorbs the noise** of retrieval.

### Oracle evidence (Fig. 4 right)

Even with ground-truth-entity Wikipedia passages, LoT improves ⇒ textual highlighting helps focus even on clean evidence.

### Generalization to non-KB benchmarks (Tab. 3, §4.5)

Visual highlighting only (no textual context):

| Backbone | RealWorldQA Δ | V-Star Δ | TextVQA Δ | OCRBench Δ | POPE Δ | AMBER Δ |
|---|---|---|---|---|---|---|
| Qwen2.5-VL-3B | +2.6 | +2.1 | +3.9 | +3.6 | +0.8 | +23.3 |
| Qwen3-VL-4B | +4.9 | +11.0 | +1.8 | +1.4 | +0.1 | -0.7 |
| Qwen2.5-VL-32B | +1.5 | +9.9 | +1.6 | +0.3 | +0.2 | -0.4 |
| InternVL3.5-38B | +2.4 | +1.4 | -0.3 | -2.8 | +3.0 | +2.7 |

Gains mostly on V-Star (vision-centric / fine-grained) and on AMBER (hallucination). Some negative fluctuations (e.g. InternVL3.5-4B on POPE/AMBER) indicate the visual signal is less robust on some backbones.

## Limitations stated by the authors

- Sink-dimension filtering requires knowing `D_sink` for the specific backbone (one-time offline cost, but model-dependent) (§3.2).
- Textual selection picks only the maximum-score sentence (`α=max`); more sophisticated strategies (multi-evidence, graded scoring) not explored (§4.2).
- Validation on 10 MLLMs but all decoder-transformer-based with CLIP/SigLIP visual encoders: extension to models with non-attention architectures (e.g. Mamba-based VLMs) is untested.
- The target object is extracted from a single noun phrase (spaCy POS): questions with multiple referents or complex syntactic constructions can fail (§B).

## Open questions / critiques

- **Threshold τ = 25th percentile**: empirical choice for the tested models; no sensitivity study on backbones such as Qwen3-VL-32B or LLaMA-3.2-Vision where the sink-score distribution could differ.
- The bounding box is **axis-aligned rectangular** (centroid ± βσ): inadequate for very elongated or fragmented objects. More morphological strategies (Min-Max/Morphological) have documented trade-offs (Tab. 4) but are not dynamically integrated.
- On non-retrieval benchmarks (Tab. 3), for Qwen3-VL-4B on AMBER there is -0.7: visual highlighting can **harm** in scenarios where the base model is already well-aligned.
- The model must **comply** with the prompt instruction not to include the markers — a behavior never quantified (leakage rate?).
- The paper does not discuss the extra cost of the **attention analysis routine** (storing attention maps for `L_vis ∪ L_txt` across all layers and heads can be expensive for 38B, especially with ~256-1024 visual tokens).
- Connection with [[flash-attention]]: explicit extraction of `A^(ℓ,k)` requires **materializing** the attention maps, contrary to FlashAttention's practice of not writing them to HBM. This creates significant memory overhead (not discussed).

## Connections to other works in the wiki

- LoT is the **cross-modal generalization** of [[liu-2025-selfelicit]] (cited as ref. [26]): SelfElicit uses the same idea (deep-layer attention + sentence marker) but text-only. LoT adds (1) the visual side, (2) MLLM-specific sink filtering (Kang et al. 2026, "Visual Attention Sink").
- Attention-sink filtering inherits directly from [[gu-2024-attention-sink]] (ref. [13]).
- Consistent with the "deep layers know" line of work (see also [[map-the-flow]] Kim 2025).

## Cited concepts

[[look-twice]], [[evidence-highlighting]], [[kb-vqa]], [[multimodal-large-language-model]], [[visual-attention-sink]], [[attention-sink]], [[multimodal-attention]], [[bounding-box-extraction]], [[training-free-methods]], [[self-elicit]], [[rag]], [[encyclopedic-vqa]], [[infoseek]], [[oven]], [[viquae]], [[realworldqa]], [[v-star]], [[textvqa]], [[chartqa]], [[ocrbench]], [[pope]], [[amber]], [[qwen2-vl]], [[qwen2-5-vl]], [[qwen3-vl]], [[internvl3-5]], [[eva-clip]], [[faiss]], [[spacy]].

## Relevant direct quotes

> "We introduce Look Twice (LoT), a training-free inference-time framework that improves multimodal evidence selection in pretrained MLLMs by explicitly highlighting query-relevant cues in both retrieved text and input image." (§1, Contributions)

> "Attention mechanisms in large Transformer architectures can exhibit attention sinks, where a small subset of tokens consistently attracts disproportionate attention mass regardless of semantic relevance. Similar effects have been observed in vision-language models, where visually salient but uninformative patches can dominate attention." (§1)

> "Our look-twice strategy introduces only negligible computational overhead, as it requires generating just a single additional token at the beginning to analyze the model attention patterns." (§1, Contributions)

> "Prior work shows that deeper layers rely more heavily on textual cues when producing the final answer, whereas visual grounding signals tend to emerge in intermediate layers. Attention sinks, in contrast, appear throughout the network." (§4.2, Evidence Selection)
