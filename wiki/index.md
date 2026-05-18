---
title: Index
type: index
updated: 2026-05-15
---

# Index

Catalog of all wiki pages. The LLM updates it on every ingest. Read this first when answering a query.

## Sources

<!-- One line per source. Format: `- [[sources/<slug>]] — <one-line> · <YYYY-MM-DD>` -->

- [[sources/vaswani-2017-attention]] — Transformer: first sequence transduction architecture based entirely on attention; SOTA on WMT 2014 EN-DE/EN-FR · 2026-05-15

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

_(none yet)_

## Open questions

<!-- Open questions gathered from ingests and lints. -->

- **Self-attention on long sequences** — the O(n²·d) cost is the Transformer's main limitation; the authors propose restricted self-attention with neighborhood `r` as future work [[vaswani-2017-attention]] §4, §7. Open: which approximations preserve quality?
- **Less sequential generation** — autoregressive decoding limits parallelization at inference; future work declared in §7 of [[vaswani-2017-attention]].
- **Training stability without warmup** — the paper uses Adam + 4000-step warmup; the relationship among `d_model`, learning rate, and depth is not analyzed systematically.
- **Head interpretability** — qualitative hints in §4 ("syntactic and semantic structure"), no quantitative analysis.
- **Extension to non-textual modalities** — declared future work (images, audio, video).
