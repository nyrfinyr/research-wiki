---
title: Scaled Dot-Product Attention
type: concept
tags: [attention, deep-learning]
created: 2026-05-15
updated: 2026-05-15
---

# Scaled Dot-Product Attention

Funzione di attention introdotta in [[vaswani-2017-attention]] §3.2.1:

```
Attention(Q, K, V) = softmax( Q Kᵀ / √d_k ) V
```

Date matrici di query `Q`, key `K` (entrambe con dimensione `d_k`) e value `V` (dimensione `d_v`), si computano i prodotti scalari Q·Kᵀ, si dividono per `√d_k`, si applica softmax e si pesa V con i pesi risultanti.

## Perché lo scaling 1/√d_k

> "We suspect that for large values of d_k, the dot products grow large in magnitude, pushing the softmax function into regions where it has extremely small gradients. To counteract this effect, we scale the dot products by 1/√d_k." [source: raw/papers/vaswani-2017-attention.pdf §3.2.1]

Argomento intuitivo (footnote 4): se le componenti di `q` e `k` sono i.i.d. con media 0 e varianza 1, il loro prodotto scalare ha media 0 e varianza `d_k`. Lo scaling normalizza la varianza a 1, mantenendo la softmax in regimi con gradienti non degenerati.

## Confronto con altre attention

- **Additive attention** (Bahdanau et al.): calcola la compatibilità con una feed-forward a un layer.
- **Dot-product attention** (senza scaling): identica a Scaled Dot-Product ma senza il fattore `1/√d_k`. Più veloce ma peggio per `d_k` grandi.
- Per `d_k` piccoli, additive e dot-product senza scaling sono comparabili; per `d_k` grandi, additive batte dot-product senza scaling [source: raw/papers/vaswani-2017-attention.pdf §3.2.1].

## Uso

È il blocco primitivo dentro [[multi-head-attention]] del [[transformer]]. Nel decoder, la self-attention applica una maschera additiva (−∞ sui logit illegali) prima della softmax per mantenere l'auto-regressività.

## Sources

- [[vaswani-2017-attention]]
