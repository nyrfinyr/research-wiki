---
title: Evidence Highlighting
type: concept
tags: [training-free, inference-time, qa, multimodal, attention-as-relevance]
created: 2026-05-15
updated: 2026-05-15
---

# Evidence Highlighting

*Training-free, inference-time* intervention pattern: the model is made to look at the input **twice** — a first pass to identify, via its own attention maps, the context portions relevant to the query, and a second pass in which those portions are **explicitly marked in the prompt** with special markers like `<start_important>...<end_important>`. The goal is to direct the model's attention without re-training. Introduced in the text setting by SelfElicit (Liu et al. 2025) for context-based QA / RAG, and generalized to the multimodal setting by Look Twice (Morini et al. 2026) for KB-VQA on MLLMs [source: raw/papers/liu-2025-selfelicit.pdf §1; raw/papers/morini-2026-look-twice.pdf §1].

## Key claims / Technique

- **Base observation** (SelfElicit): the **deep layers** of the Transformer assign 4-8× higher relative attention to ground-truth evidence sentences, **regardless** of whether the final answer is correct (Fig. 2 of SelfElicit). The model already "knows" where the evidence is, but does not always use it in generation [source: raw/papers/liu-2025-selfelicit.pdf §3.1].
- **SelfElicit pipeline (text-only)**: (1) generate **a single token**, (2) compute attention of the last prompt token toward the sentences in the context, (3) average over `L_ER` = layers in the **second half** of the decoder, (4) select `S_SE = {s_i : e_i ≥ α · max(e)}` with `α=0.5`, (5) re-prompt with `<start_important>...<end_important>` around the selected sentences, (6) generate the final answer. Overhead ~3-5% of baseline. Results: **+5.0-11.7% EM/F1** average on HotpotQA/NewsQA/TriviaQA/NQ × Llama-3.1/Mistral/Qwen2.5 [source: raw/papers/liu-2025-selfelicit.pdf §3.2, Tab. 1].
- **LoT pipeline (Morini 2026, multimodal)**: adds the visual side to SelfElicit. Extracts visual evidence via an **object-to-visual submatrix** of the attentions `A^(ℓ,k)[T_obj, V]`, aggregates over `L_vis` (intermediate layers) and all K heads; applies a **multi-layer attention sink filtering** on the visual tokens (filters the `D_sink` dimensions of the BOS) before computing a weighted bounding box. Markers `<START_IMPORTANT_TXT>` (text) and `<START_IMPORTANT_IMG>` (bounding box) [source: raw/papers/morini-2026-look-twice.pdf §3.2, Eq. 1-6].
- **LoT results**: +1.1 to +5.3 average points on E-VQA/InfoSeek/OVEN/ViQuAE × 10 MLLMs (Qwen2-VL, Qwen2.5-VL, Qwen3-VL, InternVL3.5 from 2B to 38B). Visual and textual highlighting are **complementary** (Tab. 2) [source: raw/papers/morini-2026-look-twice.pdf §4.3].
- **Layer choice is essential**: in SelfElicit, AUROC on ground-truth evidence is 91.55 at 50-100% of the layers vs 70.38 at 0-50% — the second half of the decoder is "evidence-aware" [source: raw/papers/liu-2025-selfelicit.pdf §3.1, Tab. 4].
- **Compatibility with [[chain-of-thought]]**: SelfElicit beats CoT by +5-11pp on HotpotQA with 800-900% lower overhead than **Prompt-Elicit** (the generative variant) [source: raw/papers/liu-2025-selfelicit.pdf §1, §4.2].

## Variants / Extensions

- **Text-only** (SelfElicit): markers around the sentences in the retrieved context.
- **Multimodal** (LoT): text markers + visual bounding box. [[visual-attention-sink]] filtering via `D_sink` channels.
- **Last-to-context vs object-to-visual**: SelfElicit uses the **last token** as attention query; LoT uses **target object tokens** (extracted via spaCy dependency parsing) for the visual query.

## Related concepts

- [[attention-sink]] — LoT explicitly filters visual sink tokens before highlighting.
- [[visual-attention-sink]] — visual version of the sink, required for robust filtering.
- [[mechanistic-interpretability]] — the "attention as relevance signal" approach is a mechanistic primitive.
- [[chain-of-thought]] — alternative that SelfElicit beats with lower overhead.
- [[causal-mask-modulation]] — different: modulates the mask instead of using prompt markers.
- [[flash-attention]] — tension: explicit extraction of `A^(ℓ,k)` is not compatible with FlashAttention out-of-the-box.

## Sources

- [[liu-2025-selfelicit]] — introduces evidence highlighting in a text-only / RAG regime.
- [[morini-2026-look-twice]] — generalizes to multimodal (LoT) with visual + text markers and sink filtering.
