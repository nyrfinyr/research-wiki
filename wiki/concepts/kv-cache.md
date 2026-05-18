---
title: KV-Cache
type: concept
tags: [inference, autoregressive, transformer, memory, decoding]
created: 2026-05-15
updated: 2026-05-15
---

# KV-Cache

Strategia di inference per [[transformer]] decoder-only auto-regressivi: durante la generazione, le **proiezioni Key e Value** di tutti i token già processati vengono **memorizzate in memoria** invece di essere ricomputate ad ogni step. Permette di passare da costo `O(N²)` per token (ricalcolando tutta l'attention) a `O(N)` per step di decoding, scaricando il prezzo sulla **memoria GPU** (dimensione: `2 · n_layer · n_head · d_head · N · 2 byte` in fp16) [source: raw/papers/gu-2024-attention-sink.pdf §1, §8]. Il KV-cache è il punto di contatto principale fra l'osservazione empirica di [[attention-sink]] e le applicazioni pratiche di [[streaming-llm]], eviction, quantization e [[visual-token-pruning]].

## Claim chiave / Tecnica

- **Motivazione downstream del sink**: Gu et al. citano esplicitamente "[[kv-cache]] eviction e quantization" come applicazioni che già si appoggiavano empiricamente al sink token; il loro studio fornisce le fondamenta teoriche per quei metodi [source: raw/papers/gu-2024-attention-sink.pdf §1, §7-§8].
- **Sink token come anchor obbligatorio**: in [[streaming-llm]] (Xiao 2023) si mantengono in cache i primi `k` token (sink) anche dopo l'eviction degli altri, perché la loro rimozione causa crollo di perplexity. Conferma operativa che il primo token funge da *key bias* della softmax — non si può evictare senza degradare il modello [source: raw/papers/gu-2024-attention-sink.pdf §1, §8].
- **Future-aware con sink-merge**: Pei et al. notano che il KV-cache si combina naturalmente con la loro Light Future-Aware Attention: il merge dell'attention futura nei primi token (sink) avviene **solo durante il prefill**; il decoding rimane standard-causal, quindi la struttura del KV-cache **non cambia** e l'overhead è praticamente nullo a inference time [source: raw/papers/pei-2025-causal-mask-attention.pdf §4, nota].
- **Bottleneck per Video LLM**: il numero di KV-cache entries cresce **linearmente con il numero di frame**: 6,270 token visivi per 32 frame su LLaVA-OneVision-7B (vs ~20 token testuali). I metodi di [[visual-token-pruning]] (FastV, VisionZip, FastVid, Holitom, FlashVid, SToP) attaccano direttamente la dimensione del KV-cache visivo per ottenere speedup di inference [source: raw/papers/kim-2026-sink-token-aware-pruning.pdf §2.1, Eq. 1].

## Varianti / Estensioni

- **Eviction (sink-anchored)**: si mantengono i primi `k` sink token + una finestra recente, evictando il resto.
- **Quantization (sink-aware)**: si quantizza il KV-cache aggressivamente *eccetto* i sink, che vengono mantenuti in alta precisione (cfr. Xiao 2023b citato da Gu).
- **Cross-frame merging** (Holitom, FastVid): si elimina ridondanza temporale dei token visivi prima di scrivere nel KV-cache.
- **Sink-Token-aware Pruning (SToP)**: introduce uno *sink score* per i token visivi che modifica le decision di pruning prima della scrittura in cache [source: raw/papers/kim-2026-sink-token-aware-pruning.pdf §4.1-4.2].

## Concetti correlati

- [[attention-sink]] — fenomeno che vincola le strategie di KV-cache eviction.
- [[streaming-llm]] — applicazione canonica del sink-anchored KV-cache.
- [[visual-token-pruning]] — attacco al KV-cache visivo dei VLM/Video LLM.
- [[sliding-window-attention]] — alternativa architetturale che limita la dimensione del KV-cache.
- [[causal-mask-modulation]] — interagisce col cache solo durante prefill (decoding causale).

## Sources

- [[gu-2024-attention-sink]] — discute le applicazioni del sink al KV-cache come motivazione.
- [[pei-2025-causal-mask-attention]] — usa il sink come buffer e mantiene il cache standard.
- [[kim-2026-sink-token-aware-pruning]] — riduce la dimensione del cache visivo via sink-aware pruning.
