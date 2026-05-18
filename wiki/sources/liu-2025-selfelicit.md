---
title: "Liu et al. (2025) — SelfElicit: Your Language Model Secretly Knows Where is the Relevant Evidence"
type: source
tags: [self-elicit, evidence-highlighting, context-augmentation, attention-as-relevance, training-free, qa, rag, inference-time, prompt-augmentation]
created: 2026-05-15
updated: 2026-05-15
source_path: raw/papers/liu-2025-selfelicit.pdf
source_kind: paper
source_date: 2025-05-26
doi: 10.48550/arXiv.2502.08767
zotero_key: BUH3YXJR
venue: ACL 2025
authors: [Zhining Liu, Rana Ali Amjad, Ravinarayana Adkathimar, Tianxin Wei, Hanghang Tong]
year: 2025
---

# Liu et al. (2025) — SelfElicit: Your Language Model Secretly Knows Where is the Relevant Evidence

## TL;DR

SelfElicit is a **training-free, inference-time** method to improve LM answers in context-based QA (RAG-style) settings. The idea: use **deep-layer attention** scores as an implicit signal to identify the **evidence sentences** relevant in the provided context, and re-inject them into the prompt wrapped by `<start_important> ... <end_important>` markers. It generates **a single extra token** at inference to obtain the attention maps (overhead ~3-5%), yet achieves **+5.0%-11.7%** mean EM/F1 on HotpotQA, NewsQA, TriviaQA, NaturalQuestions and across 6 LMs (Llama-3.1 8B/70B, Mistral 7B/12B, Qwen2.5 7B/32B), beating CoT, Full-Elicit and Prompt-Elicit (which generatively uses the LM to extract evidence — 800-900% more expensive) [source: raw/papers/liu-2025-selfelicit.pdf §1, §4.2, Tab. 1].

## Main contribution

- **Empirical observation**: deep Transformer layers assign 4-8× higher relative attention to ground-truth evidence sentences in the context, **regardless** of whether the final answer is correct (Fig. 2). The model already "knows" where the evidence is, but does not always use it when generating (§3.1).
- Method: weight the **last prompt token**'s attention towards the context sentences, compute the aggregated `e_i` over the evidence-reading layers `L_ER` (by default the **second half** of the layers), select `S_SE = {s_i : e_i ≥ α · max(e)}` with `α=0.5`, and wrap those sentences with special markers in the final prompt (§3.2, Alg. 1).
- Validation: high AUROC (~80-95) for matching ground-truth evidence; robustness to noise (HotpotQA distractor variant, context 1443% longer); analysis of the effect of `L_ER` and `α`.

## Method

### Notation (§2)

Decoder-only Transformer; for each layer `ℓ` it defines
`a^(ℓ) = (1/H) Σ_h a^(ℓ,h)`,
the attention probability from the current token to all `n` previous ones.

### Sentence-level attention (§3.1)

Given `m` sentences in the context and the token ranges `(t^start_si, t^end_si)`:
`ā^(ℓ)_i = (1/|t^end_si − t^start_si + 1|) · Σ_{j ∈ sentence i} a^(ℓ)_j`.

### Evidence-reading layers (§3.1, RQ4)

Subset `L_ER` of layers; `e_i = (1/|L_ER|) Σ_{ℓ ∈ L_ER} ā^(ℓ)_i`. Comparison in Tab. 4 (Llama-3.1-8B HotpotQA):

| Layer span | Elicit AUROC | EM |
|---|---|---|
| 0-100% | 89.02 | 62.57 |
| 0-50% | 70.38 | 62.14 |
| **50-100%** | **91.55** | **64.86** |
| 0-25% | 59.01 | 61.86 |
| 25-50% | 74.82 | 62.57 |
| 50-75% | 91.66 | 63.57 |
| 75-100% | 91.02 | 63.43 |

Robust default: **last 50%**.

### Thresholding (§3.1, RQ5)

`S_SE = {s_i : e_i ≥ α · max(e)}`. Default `α = 0.5`:
- Precision-recall trade-off; for multi-hop tasks the optimum is near 0.5 (HotpotQA, TQA); for single-hop tasks with few evidences (NQ) `α=1` can be optimal.
- SelfElicit is **robust** to `α ∈ [0.5, 1]` (Fig. 4).

### Highlighting prompt (§3.2)

The selected sentences are wrapped with `<start_important>...<end_important>` and the template is extended with explicit instructions (do not include the markers in the output). The answer is generated over the highlighted version of the context.

### Algorithm 1
1. `Φ(τ_QA(c,q))` generates **a single token** to obtain the attention maps.
2. Compute `ā^(ℓ)` for `ℓ ∈ L_ER` (Eq. 2).
3. Compute `e` (Eq. 3).
4. Select `S_SE` (Eq. 4).
5. Build `c*` with markers.
6. `Φ(τ_SEQA(c*, q))` generates the final answer.

Overhead: 1 token + a forward recomputation = ~3-5% of the baseline (vs. 800-900% for Prompt-Elicit, see Tab. 1).

## Key results

### Main results (Tab. 1, §4.2)

Llama-3.1-8B (EM / F1 in ×10⁻²; gain over baseline):

| Method | HotpotQA EM | NewsQA EM | TQA EM | NQ EM | Avg ranking |
|---|---|---|---|---|---|
| Base | 58.9 | 64.3 | 72.8 | 59.7 | 4.38 |
| CoT | 60.4 | 64.9 | 74.4 | 59.6 | 3.75 |
| FullElicit | 60.7 | 65.9 | 72.8 | 61.1 | 3.12 |
| PromptElicit | 66.3 | 62.8 | 76.0 | 61.8 | 2.75 |
| **SelfElicit** | **68.5** | **66.9** | **79.4** | **64.0** | **1.00** |

Similar results on Llama-70B, Mistral 7B/12B, Qwen2.5 7B/32B; SelfElicit beats PromptElicit in **40/48** model-task-metric pairs at a fraction of the cost.

### Sentence-level evidence retrieval (Tab. 3, §4.2 RQ2)

Evidence-eliciting AUROC:

| Dataset | Llama-3.1 | Mistral | Qwen-2.5 |
|---|---|---|---|
| HotpotQA | 91.24 | 85.35 | 88.21 |
| NewsQA | 92.68 | 88.68 | 91.54 |
| TQA | 73.27 | 68.89 | 70.59 |
| NQ | 90.87 | 85.51 | 87.43 |

NDCG: similar (66-92). TQA is lower because it has more equivalent candidate answers.

### Robustness to noise (Fig. 3, §4.3 RQ3)

HotpotQA distractor (context +1443% noise):
- Base: EM 58.9 → 54.3 (–4.6), F1 57.7 → 53.0.
- +SelfElicit: EM 68.5 → 62.7 (–5.8), F1 69.5 → 63.5.

Absolute advantage **preserved** under noise. SelfElicit naturally selects a **smaller** percentage of context in distractor mode (<10% vs. ~50% in gold) even with fixed `α` ⇒ implicit adaptivity (Fig. 3b).

### Layer span and α (RQ4, RQ5)

- Deep layers are **necessary**: span 0-25% is worse than baseline on elicit accuracy (59% AUROC).
- Too-low `α` = like FullElicit; too-high `α` loses recall on multi-hop tasks.

## Stated limitations

- Not applicable to **proprietary LMs** that do not expose attention scores (GPT-4, Claude API).
- Static `α` threshold; dynamic per-input control (based on noise/coverage) could improve results (§Limitations, Appx. C.1).
- Validated only on context-based QA: extension to summarisation, dialogue grounding or tool-use not tested.

## Open questions / critiques

- How much of the gain depends on **prompt-template calibration**? The `<start_important>` markers are rare tokens: the effect could fade with tokenisers that fragment them differently.
- The experiment uses sentences (segmented with spaCy). Token-level highlighting is discussed but discarded (Appx. B.4) for readability reasons ⇒ it remains unclear whether linguistically different constructions (code, chat logs) would change the choice.
- The evidence that "deep layers know where evidence is" aligns with [[map-the-flow]] (Kim 2025) on layer-wise information flow in MLLMs; a cross-architecture quantitative analysis would be interesting.
- Comparison with **decoding-time** methods (DoLa, Context-Aware Decoding by Shi et al. 2024) appears in related work but not in Tab. 1: SelfElicit could be **composed** with CAD.
- AUROC on TQA (~70) suggests the attention signal degrades when evidence is ambiguous; no mitigation is proposed.
- Inference cost reported as "additional one token": but the average inference-time increase is 17-30% for the smaller models (Tab. 1 "Inference Time" column) because the prompt is twice as long (with markers) — the paper somewhat downplays this aspect.

## Connections with other wiki entries

- Same philosophy as [[look-twice]] (Morini 2026) but on a pure textual LM; LoT explicitly cites SelfElicit as the textual-side reference and extends it to the visual one (with additional attention-sink filtering) in MLLMs.
- Consistent with the principle that **attention ≈ relevance** already highlighted in BERT-attention analyses (Clark 2019) and with [[map-the-flow]] on the "vision function layer" in deep models.

## Cited concepts

[[evidence-highlighting]], [[self-elicit]], [[context-based-qa]], [[rag]], [[attention-as-relevance]], [[in-context-learning]], [[chain-of-thought]], [[prompt-augmentation]], [[hotpotqa]], [[newsqa]], [[triviaqa]], [[natural-questions]], [[llama]], [[mistral]], [[qwen]], [[deep-layers-evidence]], [[layer-normalization]], [[transformer]].

## Relevant direct quotes

> "By analyzing the attention scores during response generation, we demonstrate that the LMs have an inherent ability to identify the relevant evidence in the context, regardless of whether they respond correctly or not." (§1, Contributions)

> "Regardless of whether the model responds correctly or not, the deeper layers of the LM pay significantly higher attention to the relevant evidence in the context. This observation holds across models families and datasets." (§3.1)

> "SelfElicit significantly and consistently improves the performance across all datasets and models of different sizes (5.0%-11.7% gain over baseline). Even when compared to computationally expensive (average inference time increase of 878%/939% for Llama3.1-8B/70B) iterative prompting approach PromptElicit, SelfElicit outperforms for 40 out of 48 model-task metric pairs." (§4.2 RQ1)

> "Even with a static α, SelfElicit naturally exhibits adaptiveness by selecting a lower evidence ratio in noisy contexts, focusing only on the relevant evidence without distraction from noise." (§4.3 RQ3)
