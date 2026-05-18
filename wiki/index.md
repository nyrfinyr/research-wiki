---
title: Index
type: index
updated: 2026-05-18
---

# Index

Catalog of all wiki pages. The LLM updates it on every ingest. Read this first when answering a query.

## Sources

<!-- One line per source. Format: `- [[sources/<slug>]] — <one-line> · <YYYY-MM-DD>` -->

> Partial listing. The index is out of sync with `wiki/sources/` and `wiki/concepts/` (filesystem has ~22 sources and ~150 concepts vs. the entries listed here). A lint pass is needed to fully resync.

- [[sources/vaswani-2017-attention]] — Transformer: first sequence transduction architecture based entirely on attention; SOTA on WMT 2014 EN-DE/EN-FR · 2026-05-15
- [[sources/morini-2026-look-twice]] — Look Twice (LoT): training-free two-pass evidence highlighting for MLLMs on KB-VQA · 2026-05-15
- [[sources/kim-2025-map-the-flow]] — mechanistic interpretability of VideoLLMs; 4-stage temporal-reasoning pipeline, effective attention pathways · 2026-05-15
- [[sources/kim-2026-sink-token-aware-pruning]] — SToP: sink-token-aware visual token pruning for fine-grained video understanding · 2026-05-15
- [[sources/liu-2025-selfelicit]] — SelfElicit: deep-layer attention identifies evidence sentences; prompt-marker highlighting for context-based QA · 2026-05-15
- [[sources/qwen2-5-vl-2025-tech-report]] — Qwen2.5-VL: dynamic-resolution ViT, window attention, absolute-time T-RoPE, 3B/7B/72B · 2026-05-15
- [[sources/qwen3-vl-2025-tech-report]] — Qwen3-VL: interleaved MRoPE, DeepStack, textual timestamps, 256K context, dense + MoE variants · 2026-05-15

## Concepts

<!-- Ideas, methods, frameworks, problems. Tools / datasets / benchmarks go here (not in entities). -->

### Architectures and methods

- [[concepts/transformer]] — encoder-decoder architecture based entirely on attention
- [[concepts/self-attention]] — intra-attention, computational basis of the Transformer
- [[concepts/scaled-dot-product-attention]] — `softmax(QKᵀ/√d_k)V`
- [[concepts/multi-head-attention]] — h heads in parallel over projected subspaces
- [[concepts/positional-encoding]] — sinusoidal positional encoding
- [[concepts/encoder-decoder-architecture]] — standard seq2seq schema
- [[concepts/sequence-transduction]] — class of sequence-to-sequence problems
- [[concepts/layer-normalization]] — per-feature normalization
- [[concepts/byte-pair-encoding]] — sub-word tokenization
- [[concepts/label-smoothing]] — target regularization

### Tools, datasets, benchmarks

- [[concepts/tensor2tensor]] — TF codebase for seq2seq, used in Vaswani 2017
- [[concepts/wmt-2014]] — MT benchmark EN-DE / EN-FR
- [[concepts/penn-treebank]] — English constituency parsing benchmark (WSJ)
- [[concepts/bleu]] — n-gram-based MT metric

## Syntheses

<!-- Comparisons, surveys, filed-back answers. -->

- [[syntheses/extending-look-twice-to-video-vqa]] — design memo for transferring LoT from image KB-VQA to Video-VQA, integrating Map the Flow, SToP, SelfElicit on a Qwen3-VL backbone · 2026-05-18

## Open questions

<!-- Open questions gathered from ingests and lints. -->

- **Self-attention on long sequences** — the O(n²·d) cost is the Transformer's main limitation; the authors propose restricted self-attention with neighborhood `r` as future work [[vaswani-2017-attention]] §4, §7. Open: which approximations preserve quality?
- **Less sequential generation** — autoregressive decoding limits parallelization at inference; future work declared in §7 of [[vaswani-2017-attention]].
- **Training stability without warmup** — the paper uses Adam + 4000-step warmup; the relationship among `d_model`, learning rate, and depth is not analyzed systematically.
- **Head interpretability** — qualitative hints in §4 ("syntactic and semantic structure"), no quantitative analysis.
- **Extension to non-textual modalities** — declared future work (images, audio, video).
