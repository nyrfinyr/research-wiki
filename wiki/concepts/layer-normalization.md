---
title: Layer Normalization
type: concept
tags: [normalization, deep-learning]
created: 2026-05-15
updated: 2026-05-15
---

# Layer Normalization

Tecnica di normalizzazione introdotta da Ba, Kiros & Hinton (2016) [arXiv:1607.06450] che normalizza le attivazioni lungo la dimensione delle feature (non lungo il batch come BatchNorm), rendendola indipendente dalla dimensione del batch e adatta a modelli ricorrenti/sequenziali.

In [[transformer]] è usata in tutte le sub-layer come `LayerNorm(x + Sublayer(x))` — quindi **post-norm** nel paper originale ([[vaswani-2017-attention]] §3.1).

> Nota storica: nei lavori successivi (es. GPT-2, training di Transformer profondi) si è diffuso lo schema **pre-norm** `x + Sublayer(LayerNorm(x))` perché stabilizza il training senza warmup molto lungo. Questo non è nel paper originale.

## Sources

- [[vaswani-2017-attention]]
