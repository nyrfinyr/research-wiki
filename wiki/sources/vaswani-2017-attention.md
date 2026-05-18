---
title: "Vaswani et al. (2017) — Attention Is All You Need"
type: source
tags: [transformer, attention, self-attention, neural-machine-translation, seq2seq, deep-learning]
created: 2026-05-15
updated: 2026-05-15
source_path: raw/papers/vaswani-2017-attention.pdf
source_kind: paper
source_date: 2017-06-12
doi: 10.48550/arXiv.1706.03762
zotero_key: DRW67HKR
venue: NeurIPS 2017
authors: [Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Łukasz Kaiser, Illia Polosukhin]
year: 2017
---

# Vaswani et al. (2017) — Attention Is All You Need

## TL;DR

The authors propose the **Transformer**, a new encoder-decoder architecture for sequence transduction based entirely on attention mechanisms, fully eliminating recurrence and convolutions. The model beats the state of the art on WMT 2014 EN-DE (28.4 BLEU) and EN-FR (41.8 BLEU) while requiring a fraction of the compute of recurrent/convolutional baselines (3.5 days on 8 P100 GPUs for the "big" model). It generalizes to English constituency parsing. It is the foundational paper of the entire [[transformer]] family (BERT, GPT, T5, etc.).

## Main contribution

- First sequence-transduction architecture relying **exclusively** on attention, abandoning RNNs and CNNs [source: raw/papers/vaswani-2017-attention.pdf §1].
- Introduction of **Scaled Dot-Product Attention** and **Multi-Head Attention** as primitive computational blocks (see [[scaled-dot-product-attention]], [[multi-head-attention]]).
- Constant O(1) path length between any pair of positions, vs O(n) for an RNN — enables massively parallel training and easier learning of long-range dependencies (Table 1, §4).

## Method

### Architecture ([[transformer]])

Encoder stack + decoder stack, both with **N=6** identical layers.

- **Encoder layer**: two sub-layers — (1) multi-head self-attention, (2) position-wise feed-forward. Each sub-layer is wrapped in `LayerNorm(x + Sublayer(x))` (residual + [[layer-normalization]]).
- **Decoder layer**: three sub-layers — (1) masked multi-head self-attention (the mask sets future positions to −∞ to preserve autoregressivity), (2) multi-head encoder-decoder attention (queries from the decoder, keys/values from the encoder output), (3) feed-forward.
- All sub-layers and embeddings produce vectors of dimension `d_model = 512` to ease the residual connections (§3.1).

### Scaled Dot-Product Attention

`Attention(Q, K, V) = softmax(Q Kᵀ / √d_k) V` (Eq. 1).

The scaling factor `1/√d_k` prevents, for large `d_k`, the dot products from saturating the softmax into regions of near-zero gradient (§3.2.1, footnote 4: assuming i.i.d. components with variance 1, `q·k` has variance `d_k`).

### Multi-Head Attention

`h = 8` parallel heads, each with `d_k = d_v = d_model / h = 64`. Output: concatenation of the heads followed by a linear projection `W^O`. Allows joint attention to different representational subspaces at different positions (§3.2.2).

Used in three ways in the model:
- **encoder-decoder attention** (queries from the decoder, K/V from the encoder),
- **encoder self-attention** (Q/K/V from the same source),
- **masked decoder self-attention** (autoregressive).

### Position-wise FFN

`FFN(x) = max(0, xW_1 + b_1) W_2 + b_2` (Eq. 2). Applied independently at each position; `d_ff = 2048` (§3.3).

### Positional Encoding

No recurrence ⇒ a position signal is needed. A sinusoidal encoding is **added** to the embedding:

- `PE(pos, 2i) = sin(pos / 10000^(2i/d_model))`
- `PE(pos, 2i+1) = cos(pos / 10000^(2i/d_model))`

Wavelengths form a geometric progression from `2π` to `10000·2π`. The sinusoidal choice is motivated by the hope of allowing generalization to sequences longer than those seen during training; experimentally equivalent to learned positional embeddings (Tab. 3 row E) (§3.5). See [[positional-encoding]].

### Training

- Dataset: WMT 2014 EN-DE (~4.5M pairs, shared BPE vocab ~37k tokens) and EN-FR (36M sentences, 32k word-piece) (§5.1). See [[wmt-2014]], [[byte-pair-encoding]].
- Hardware: 1 machine × 8 NVIDIA P100. Base: 100k steps (~12h). Big: 300k steps (~3.5 days) (§5.2).
- Optimizer: Adam with `β1=0.9, β2=0.98, ε=1e-9`. Linear learning-rate warmup for the first 4000 steps then decay as `step^-0.5`: `lrate = d_model^-0.5 · min(step^-0.5, step · warmup^-1.5)` (Eq. 3, §5.3).
- Regularization: residual dropout `P_drop=0.1`, label smoothing `ε_ls=0.1` (§5.4). See [[label-smoothing]].

## Key results

### Translation (Tab. 2)

| Model | EN-DE BLEU | EN-FR BLEU | Train FLOPs |
|---|---|---|---|
| GNMT + RL [38] | 24.6 | 39.92 | 2.3·10¹⁹ / 1.4·10²⁰ |
| ConvS2S [9] | 25.16 | 40.46 | 9.6·10¹⁸ / 1.5·10²⁰ |
| MoE [32] | 26.03 | 40.56 | 2.0·10¹⁹ / 1.2·10²⁰ |
| GNMT+RL Ensemble | 26.30 | 41.16 | 1.8·10²⁰ / 1.1·10²¹ |
| ConvS2S Ensemble | 26.36 | 41.29 | 7.7·10¹⁹ / 1.2·10²¹ |
| **Transformer (base)** | **27.3** | **38.1** | **3.3·10¹⁸** |
| **Transformer (big)** | **28.4** | **41.8** | **2.3·10¹⁹** |

The "big" model beats all prior systems, ensembles included, on EN-DE by over **2 BLEU**, at a fraction of the training cost (§6.1).

### Constituency parsing (Tab. 4)

4-layer Transformer (`d_model=1024`) on Penn Treebank WSJ:
- WSJ-only: **91.3 F1** (vs. 91.7 from Dyer 2016 RNNG).
- Semi-supervised (~17M sentences): **92.7 F1** (beats all baselines except generative RNNG at 93.3) (§6.3). See [[penn-treebank]].

### Ablation (Tab. 3, §6.2)

- (A) **Number of heads**: 1 head is 0.9 BLEU worse than the best setup; too many heads (32) slightly worsens it.
- (B) Reducing `d_k` worsens quality → the compatibility function is non-trivial.
- (C) Larger models are better; dropout is crucial.
- (E) Learned positional embeddings ≈ sinusoids (4.92 vs. 4.92 PPL, 25.8 vs. 25.7 BLEU dev).

### Complexity (Tab. 1, §4)

| Layer | Complexity / layer | Sequential ops | Max path length |
|---|---|---|---|
| Self-Attention | O(n²·d) | O(1) | O(1) |
| Recurrent | O(n·d²) | O(n) | O(n) |
| Convolutional | O(k·n·d²) | O(1) | O(log_k n) |
| Self-Attention (restricted, r) | O(r·n·d) | O(1) | O(n/r) |

Self-attention is faster than an RNN when `n < d`, a condition typical of subword representations (§4).

## Limitations stated by the authors

- **O(n²·d)** per-layer complexity of self-attention ⇒ problematic for very long sequences; the authors propose, as future work, **restricted self-attention** over a neighborhood of size `r` (§4, §7).
- Generation remains sequential; making generation less sequential is a stated goal (§7).
- Experiments limited to a textual domain; extension to images/audio/video is stated as future work (§7).

## Open questions / critiques

- The paper does not discuss **training stability** as a function of `d_model`, learning-rate schedule, or warmup beyond the anecdote on Adam.
- A systematic analysis of behavior on long sequences (lengths > a few hundred tokens) is missing.
- Interpretability of attention heads is suggested ("many appear to exhibit behavior related to syntactic and semantic structure", §4) but not quantified.
- No comparison with non-NMT baselines (e.g. pure language models) — this would come in subsequent follow-up literature.

## Affiliations and infrastructure

- Authors: see `authors:` frontmatter. Affiliations stated in the paper: Google Brain (Vaswani, Shazeer, Polosukhin), Google Research (Parmar, Uszkoreit, Jones, Kaiser), University of Toronto (Gomez).
- Hardware: NVIDIA P100 (8× for training).

## Cited concepts

[[transformer]], [[self-attention]], [[scaled-dot-product-attention]], [[multi-head-attention]], [[positional-encoding]], [[encoder-decoder-architecture]], [[sequence-transduction]], [[layer-normalization]], [[byte-pair-encoding]], [[label-smoothing]], [[bleu]], [[tensor2tensor]], [[wmt-2014]], [[penn-treebank]].

## Relevant direct quotes

> "We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely." (Abstract)

> "In this work we propose the Transformer, a model architecture eschewing recurrence and instead relying entirely on an attention mechanism to draw global dependencies between input and output." (§1)

> "We suspect that for large values of `d_k`, the dot products grow large in magnitude, pushing the softmax function into regions where it has extremely small gradients. To counteract this effect, we scale the dot products by 1/√d_k." (§3.2.1)
