---
title: Multi-Head Attention
type: concept
tags: [attention, deep-learning]
created: 2026-05-15
updated: 2026-05-15
---

# Multi-Head Attention

Generalizzazione della [[scaled-dot-product-attention]] in cui Q, K, V vengono proiettate linearmente `h` volte con matrici apprese diverse, l'attention è applicata in parallelo a ciascuna proiezione, e gli output sono concatenati e proiettati di nuovo (§3.2.2 di [[vaswani-2017-attention]]):

```
MultiHead(Q, K, V) = Concat(head_1, …, head_h) · W^O
head_i = Attention(Q W_i^Q, K W_i^K, V W_i^V)
```

con `W_i^Q ∈ R^{d_model × d_k}`, `W_i^K ∈ R^{d_model × d_k}`, `W_i^V ∈ R^{d_model × d_v}`, `W^O ∈ R^{h·d_v × d_model}`.

## Iperparametri

Nel [[transformer]] base: `h = 8`, `d_k = d_v = d_model / h = 64`. La dimensione ridotta per testa fa sì che il costo totale sia ~uguale a una singola attention a piena dimensionalità [source: raw/papers/vaswani-2017-attention.pdf §3.2.2].

## Motivazione

> "Multi-head attention allows the model to jointly attend to information from different representation subspaces at different positions. With a single attention head, averaging inhibits this." [source: raw/papers/vaswani-2017-attention.pdf §3.2.2]

Diverse teste possono specializzarsi su pattern sintattici/semantici diversi (§4 di [[vaswani-2017-attention]] suggerisce qualitativamente questa interpretabilità).

## Evidenza empirica (Tab. 3 riga A)

Variando `h` mantenendo costante il compute:
- `h=1`: 24.9 BLEU dev (0.9 sotto la baseline).
- `h=4`: 25.5.
- `h=8`: 25.8 (baseline).
- `h=16`: 25.8.
- `h=32`: 25.4 (degrada con troppe teste).

⇒ La qualità degrada sia con troppe poche sia con troppe teste [source: raw/papers/vaswani-2017-attention.pdf Tab. 3 (A)].

## Uso nel Transformer

- Encoder self-attention (Q=K=V dall'output del layer precedente).
- Decoder self-attention mascherata (auto-regressiva).
- Encoder-decoder attention (Q dal decoder, K/V dall'output dell'encoder).

## Sources

- [[vaswani-2017-attention]]
