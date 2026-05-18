---
title: KV-Cache
type: concept
tags: [inference, autoregressive, transformer, memory, decoding]
created: 2026-05-15
updated: 2026-05-15
---

# KV-Cache

Inference strategy for autoregressive decoder-only [[transformer]] models: during generation, the **Key and Value projections** of all already-processed tokens are **stored in memory** instead of being recomputed at every step. This allows moving from `O(N²)` cost per token (recomputing the full attention) to `O(N)` per decoding step, offloading the price to **GPU memory** (size: `2 · n_layer · n_head · d_head · N · 2 bytes` in fp16) [source: raw/papers/gu-2024-attention-sink.pdf §1, §8]. The KV-cache is the main point of contact between the empirical observation of [[attention-sink]] and the practical applications of [[streaming-llm]], eviction, quantization and [[visual-token-pruning]].

## Key claims / Technique

- **Downstream motivation of the sink**: Gu et al. explicitly cite "[[kv-cache]] eviction and quantization" as applications that already empirically relied on the sink token; their study provides the theoretical foundations for those methods [source: raw/papers/gu-2024-attention-sink.pdf §1, §7-§8].
- **Sink token as mandatory anchor**: in [[streaming-llm]] (Xiao 2023) the first `k` tokens (sink) are kept in cache even after the eviction of the others, because their removal causes a perplexity collapse. Operational confirmation that the first token acts as a *key bias* of the softmax — it cannot be evicted without degrading the model [source: raw/papers/gu-2024-attention-sink.pdf §1, §8].
- **Future-aware with sink-merge**: Pei et al. note that the KV-cache combines naturally with their Light Future-Aware Attention: the merging of future attention into the first tokens (sink) happens **only during prefill**; decoding remains standard-causal, so the KV-cache structure **does not change** and the overhead is practically zero at inference time [source: raw/papers/pei-2025-causal-mask-attention.pdf §4, note].
- **Bottleneck for Video LLMs**: the number of KV-cache entries grows **linearly with the number of frames**: 6,270 visual tokens for 32 frames on LLaVA-OneVision-7B (vs ~20 text tokens). [[visual-token-pruning]] methods (FastV, VisionZip, FastVid, Holitom, FlashVid, SToP) attack the size of the visual KV-cache directly to obtain inference speedups [source: raw/papers/kim-2026-sink-token-aware-pruning.pdf §2.1, Eq. 1].

## Variants / Extensions

- **Eviction (sink-anchored)**: the first `k` sink tokens are kept + a recent window, evicting the rest.
- **Quantization (sink-aware)**: the KV-cache is quantized aggressively *except* for the sinks, which are kept in high precision (cf. Xiao 2023b cited by Gu).
- **Cross-frame merging** (Holitom, FastVid): temporal redundancy of visual tokens is eliminated before writing into the KV-cache.
- **Sink-Token-aware Pruning (SToP)**: introduces a *sink score* for visual tokens that modifies pruning decisions before writing into the cache [source: raw/papers/kim-2026-sink-token-aware-pruning.pdf §4.1-4.2].

## Related concepts

- [[attention-sink]] — phenomenon that constrains KV-cache eviction strategies.
- [[streaming-llm]] — canonical application of sink-anchored KV-cache.
- [[visual-token-pruning]] — attack on the visual KV-cache of VLMs/Video LLMs.
- [[sliding-window-attention]] — architectural alternative that limits KV-cache size.
- [[causal-mask-modulation]] — interacts with the cache only during prefill (causal decoding).

## Sources

- [[gu-2024-attention-sink]] — discusses sink applications to the KV-cache as motivation.
- [[pei-2025-causal-mask-attention]] — uses the sink as buffer and keeps the standard cache.
- [[kim-2026-sink-token-aware-pruning]] — reduces visual cache size via sink-aware pruning.
