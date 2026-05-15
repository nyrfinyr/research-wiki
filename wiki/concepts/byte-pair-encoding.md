---
title: Byte-Pair Encoding (BPE)
type: concept
tags: [tokenization, nlp]
created: 2026-05-15
updated: 2026-05-15
---

# Byte-Pair Encoding (BPE)

Schema di tokenizzazione sub-word: parte dai caratteri e itera fondendo la coppia di simboli più frequente fino a raggiungere una dimensione di vocabolario target. Permette di rappresentare parole rare e morfologia ricca con un vocabolario fisso e di evitare gli OOV.

In [[vaswani-2017-attention]] è usato per WMT 2014 EN-DE con vocabolario sorgente-target condiviso di ~37k token (§5.1) [source: raw/papers/vaswani-2017-attention.pdf §5.1]. Per EN-FR si usa invece word-piece a 32k token.

## Sources

- [[vaswani-2017-attention]]
