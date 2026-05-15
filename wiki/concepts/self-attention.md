---
title: Self-Attention
type: concept
tags: [attention, sequence-modeling]
created: 2026-05-15
updated: 2026-05-15
---

# Self-Attention

Detta anche **intra-attention**. Meccanismo di attention in cui query, key e value provengono tutte dalla stessa sequenza: relaziona ogni posizione della sequenza con tutte le altre per calcolare una rappresentazione contestuale [source: raw/papers/vaswani-2017-attention.pdf §2].

Prima del [[transformer]] era stata già usata per reading comprehension, abstractive summarization, textual entailment e sentence embedding (§2 in [[vaswani-2017-attention]]). Il contributo di [[vaswani-2017-attention]] è essere la **prima architettura di sequence transduction interamente basata su self-attention**, senza RNN né convoluzioni.

## Perché self-attention vs. RNN/CNN

Tre desiderata sono valutati in §4 di [[vaswani-2017-attention]]:

1. **Complessità computazionale per layer** — self-attention: O(n²·d); RNN: O(n·d²); CNN: O(k·n·d²).
2. **Operazioni sequenziali** — self-attention: O(1); RNN: O(n); CNN: O(1).
3. **Path length massimo** tra due posizioni — self-attention: O(1); RNN: O(n); CNN dilatata: O(log_k n).

Self-attention è più veloce di un RNN quando `n < d`, condizione tipica per rappresentazioni sub-word (BPE/word-piece).

## Restricted self-attention

Per ridurre il costo O(n²) si può limitare l'attention a un intorno di dimensione `r` attorno alla posizione di output, portando il path length a O(n/r). Citato come future work in [[vaswani-2017-attention]] §4.

## Realizzazione nel Transformer

Tre usi distinti in [[transformer]]:

- Self-attention nell'encoder: Q, K, V dall'output del layer precedente.
- Self-attention **mascherata** nel decoder: stessa cosa ma con maschera triangolare che impedisce di attendere a posizioni future.
- Encoder-decoder attention (non è self-attention): Q dal decoder, K/V dall'encoder.

Implementata via [[scaled-dot-product-attention]] proiettata in [[multi-head-attention]].

## Sources

- [[vaswani-2017-attention]]
