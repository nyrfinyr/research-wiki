---
title: Byte-Pair Encoding (BPE)
type: concept
tags: [tokenization, nlp]
created: 2026-05-15
updated: 2026-05-15
---

# Byte-Pair Encoding (BPE)

Sub-word tokenization scheme: starts from characters and iterates by merging the most frequent symbol pair until a target vocabulary size is reached. It allows representing rare words and rich morphology with a fixed vocabulary and avoids OOVs.

In [[vaswani-2017-attention]] it is used for WMT 2014 EN-DE with a shared source-target vocabulary of ~37k tokens (§5.1) [source: raw/papers/vaswani-2017-attention.pdf §5.1]. For EN-FR a 32k-token word-piece is used instead.

## Sources

- [[vaswani-2017-attention]]
