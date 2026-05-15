---
title: Transformer
type: concept
tags: [architecture, attention, deep-learning, sequence-modeling]
created: 2026-05-15
updated: 2026-05-15
---

# Transformer

Architettura encoder-decoder per sequence transduction introdotta in [[vaswani-2017-attention]]. Sostituisce completamente ricorrenza e convoluzione con [[self-attention]] e feed-forward position-wise, ottenendo path length O(1) tra posizioni arbitrarie e training massicciamente parallelo.

## Composizione

- **Encoder**: stack di N=6 layer identici. Ogni layer ha due sub-layer — multi-head self-attention + FFN position-wise — entrambi avvolti da residual connection e [[layer-normalization]] `LayerNorm(x + Sublayer(x))` [source: raw/papers/vaswani-2017-attention.pdf §3.1].
- **Decoder**: stack di N=6 layer; ogni layer aggiunge un terzo sub-layer di **encoder-decoder attention**. La self-attention del decoder è **mascherata** (le posizioni `> i` sono settate a −∞ prima della softmax) per preservare l'auto-regressività [source: raw/papers/vaswani-2017-attention.pdf §3.1].
- Tutti i sub-layer e gli embedding producono vettori di dimensione `d_model = 512`.
- Embedding di input/output e proiezione pre-softmax **condividono** la matrice dei pesi; nei layer di embedding i pesi sono moltiplicati per `√d_model` [source: raw/papers/vaswani-2017-attention.pdf §3.4].

## Iperparametri del modello base

| Iperparametro | Valore |
|---|---|
| N (depth encoder/decoder) | 6 |
| d_model | 512 |
| d_ff | 2048 |
| h (teste) | 8 |
| d_k = d_v | 64 |
| P_drop | 0.1 |
| ε_ls (label smoothing) | 0.1 |
| Parametri | ~65M |

Modello "big": `d_model=1024`, `d_ff=4096`, `h=16`, `P_drop=0.3`, 213M parametri [source: raw/papers/vaswani-2017-attention.pdf Tab. 3].

## Vantaggi rispetto a RNN/CNN

Da Tab. 1 di [[vaswani-2017-attention]]:

- Path length **O(1)** vs. O(n) di un RNN ⇒ dipendenze a lungo raggio più facili da apprendere.
- Operazioni sequenziali **O(1)** vs. O(n) di un RNN ⇒ parallelizzazione completa lungo la sequenza.
- Più veloce di un RNN quando `n < d` (caso tipico per BPE/word-piece).

## Componenti

- [[self-attention]]
- [[scaled-dot-product-attention]]
- [[multi-head-attention]]
- [[positional-encoding]]
- [[layer-normalization]]
- [[encoder-decoder-architecture]]

## Domande aperte

- Costo **O(n²·d)** della self-attention ⇒ inefficiente per sequenze molto lunghe (gli autori propongono self-attention ristretta come future work).
- Generazione ancora sequenziale (auto-regressiva) — limita la parallelizzazione a inference.
- Estensione a modalità non testuali (immagini, audio, video) è citata come future work.

## Sources

- [[vaswani-2017-attention]]
