---
title: Streaming-LLM
type: concept
tags: [inference, long-context, kv-cache, attention-sink]
created: 2026-05-15
updated: 2026-05-15
---

# Streaming-LLM

Inference strategy (Xiao et al. 2023) for **potentially infinite generation** with fixed-context models: a **sliding-window** KV-cache (recent window) is maintained **plus a few initial tokens (sink tokens)** kept permanently in memory. Removing the first tokens, even if they carry low semantic content (e.g. BOS), causes a collapse in perplexity; keeping them as "sinks" saves the model and allows stable decoding for millions of tokens [source: raw/papers/gu-2024-attention-sink.pdf §1, §8]. It is the main **empirical use case** that motivated the study of the [[attention-sink]] by Gu et al. (2024), who provided its theoretical foundations post-hoc.

## Key claims / Technique

- **Sink-anchored sliding window**: the KV-cache consists of `S = {first k tokens} ∪ {last W tokens}`, with `k` small (typically 4) and `W` the recent window. The rest is evicted. Without the first `k` tokens perplexity explodes (Xiao 2023a cited in [source: raw/papers/gu-2024-attention-sink.pdf §1, §8]).
- **Mechanistic explanation**: the first token acts as a *key bias* along a direction that minimizes the angle with all queries; removing it leaves softmax without the "extra attention dump", forcing it to redistribute attention over tokens that should carry genuine information ⇒ degradation of weighted values [source: raw/papers/gu-2024-attention-sink.pdf §3.1, §7].
- **Mobile sink position**: subsequent work has shown that the sink can be moved (learnable key biases, learnable sink token, KV-biases) with `Sink^ε_* ~73%` on the biases and `Sink^ε_1 ~0%` on the first token at matched validation loss (Tab. 4 of Gu); this suggests Streaming-LLM is a *heuristic* solution to a deeper problem tied to the architecture — the architectural solution being [[sigmoid-attention]] without normalization [source: raw/papers/gu-2024-attention-sink.pdf §7.3-7.4].
- **Empirical limit**: Gu et al. do not reproduce the Streaming-LLM benchmarks with their architectural fix (sigmoid attention) ⇒ it remains open whether sink anchoring is still needed in models pre-trained without intrinsic sink [source: raw/papers/gu-2024-attention-sink.pdf §limits].

## Variants / Extensions

- **Sink-aware KV-cache eviction**: family that generalizes Streaming-LLM by keeping the most informative tokens (not just the first ones) + the sinks.
- **Sink-aware KV-cache quantization** (Xiao 2023b): aggressive quantization *except* for sinks, kept in high precision.
- **SWAT** (Fu 2025): solves the problem upstream by changing the architecture (sigmoid + sliding window), making Streaming-LLM-style superfluous when training with SWA.

## Related concepts

- [[attention-sink]] — empirical phenomenon that Streaming-LLM exploits.
- [[kv-cache]] — Streaming-LLM is an *eviction policy* on the KV-cache.
- [[sliding-window-attention]] — Streaming-LLM is SWA + anchoring of sink tokens.
- [[sigmoid-attention]] — alternative architectural fix that could make Streaming-LLM unnecessary.

## Sources

- [[gu-2024-attention-sink]] — provides the theoretical foundations of Streaming-LLM and proposes architectural fixes.
