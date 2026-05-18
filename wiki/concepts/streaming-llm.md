---
title: Streaming-LLM
type: concept
tags: [inference, long-context, kv-cache, attention-sink]
created: 2026-05-15
updated: 2026-05-15
---

# Streaming-LLM

Strategia di inference (Xiao et al. 2023) per **generazione potenzialmente infinita** con modelli a contesto fissato: si mantiene un KV-cache **a finestra scorrevole** (recent window) **più alcuni token iniziali (sink token)** mantenuti in memoria permanentemente. La rimozione dei primi token, anche se sono di basso contenuto semantico (es. il BOS), provoca un crollo della perplexity; trattenerli come "sink" salva il modello e permette decoding stabile per milioni di token [source: raw/papers/gu-2024-attention-sink.pdf §1, §8]. È il principale **caso d'uso empirico** che ha motivato lo studio dell'[[attention-sink]] da parte di Gu et al. (2024), che ne ha fornito le fondamenta teoriche post-hoc.

## Claim chiave / Tecnica

- **Sink-anchored sliding window**: il KV-cache è composto da `S = {primi k token} ∪ {ultimi W token}`, con `k` piccolo (tipicamente 4) e `W` la window recente. Il resto viene evictato. Senza i primi `k` token la perplexity esplode (Xiao 2023a citato da [source: raw/papers/gu-2024-attention-sink.pdf §1, §8]).
- **Spiegazione meccanicistica**: il primo token funge da *key bias* lungo una direzione che minimizza l'angolo con tutte le query; rimuoverlo lascia la softmax senza il "dump di attention extra", costringendola a ridistribuirla sui token che dovrebbero portare informazione genuina ⇒ degrado dei value pesati [source: raw/papers/gu-2024-attention-sink.pdf §3.1, §7].
- **Posizione mobile del sink**: lavori successivi hanno mostrato che il sink può essere spostato (key biases learnable, sink token apprendibile, KV-biases) con `Sink^ε_* ~73%` sui bias e `Sink^ε_1 ~0%` sul primo token a parità di validation loss (Tab. 4 di Gu); ciò suggerisce che Streaming-LLM è una soluzione *euristica* a un problema più profondo legato all'architettura — la soluzione architetturale è [[sigmoid-attention]] senza normalizzazione [source: raw/papers/gu-2024-attention-sink.pdf §7.3-7.4].
- **Limite empirico**: Gu et al. non riprodu cono i benchmark di Streaming-LLM con il loro fix architetturale (sigmoid attention) ⇒ resta aperta la domanda se il sink-anchoring sia ancora necessario in modelli pre-trainati senza sink intrinseco [source: raw/papers/gu-2024-attention-sink.pdf §limiti].

## Varianti / Estensioni

- **KV-cache eviction sink-aware**: famiglia che generalizza Streaming-LLM mantenendo i token più informativi (non solo i primi) + i sink.
- **KV-cache quantization sink-aware** (Xiao 2023b): si quantizza aggressivamente *eccetto* i sink, mantenuti in alta precisione.
- **SWAT** (Fu 2025): risolve il problema upstream cambiando l'architettura (sigmoid + sliding window), rendendo Streaming-LLM-style superfluo quando ci si addestra con SWA.

## Concetti correlati

- [[attention-sink]] — fenomeno empirico che Streaming-LLM sfrutta.
- [[kv-cache]] — Streaming-LLM è una *politica di eviction* sul KV-cache.
- [[sliding-window-attention]] — Streaming-LLM è SWA + ancoraggio dei sink token.
- [[sigmoid-attention]] — fix architetturale alternativo che potrebbe rendere Streaming-LLM non necessario.

## Sources

- [[gu-2024-attention-sink]] — fornisce le fondamenta teoriche di Streaming-LLM e propone fix architetturali.
