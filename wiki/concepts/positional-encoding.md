---
title: Positional Encoding
type: concept
tags: [transformer, attention, sequence-modeling]
created: 2026-05-15
updated: 2026-05-15
---

# Positional Encoding

Tecnica per iniettare informazione di posizione in modelli che, come il [[transformer]], non hanno alcuna struttura ricorrente o convolutiva e quindi sarebbero permutation-invariant rispetto all'ordine dei token. In [[vaswani-2017-attention]] §3.5 si somma un encoding di posizione agli embedding di input ai piedi dello stack encoder e decoder; ha la stessa dimensione `d_model` degli embedding.

## Versione sinusoidale (Vaswani 2017)

```
PE(pos, 2i)   = sin( pos / 10000^(2i/d_model) )
PE(pos, 2i+1) = cos( pos / 10000^(2i/d_model) )
```

Ogni dimensione dell'encoding corrisponde a una sinusoide; le lunghezze d'onda formano una progressione geometrica da `2π` a `10000·2π` [source: raw/papers/vaswani-2017-attention.pdf §3.5].

### Motivazione

Per ogni offset fisso `k`, `PE(pos+k)` è una funzione lineare di `PE(pos)` — questo dovrebbe permettere al modello di apprendere facilmente ad attendere per posizioni relative. Inoltre la natura senza parametri lascia sperare in **estrapolazione a sequenze più lunghe** di quelle viste in training [source: raw/papers/vaswani-2017-attention.pdf §3.5].

## Alternative

- **Positional embedding apprese**: una matrice di embedding `[max_len × d_model]` appresa. In [[vaswani-2017-attention]] (Tab. 3 riga E) è sperimentalmente **equivalente** alla versione sinusoidale (BLEU 25.7 vs. 25.8, PPL 4.92 entrambe). Gli autori preferiscono la sinusoidale per la potenziale estrapolazione fuori dal range visto in training.

## Sources

- [[vaswani-2017-attention]]
