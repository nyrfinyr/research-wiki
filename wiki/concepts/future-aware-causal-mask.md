---
title: Future-Aware Causal Mask
type: concept
tags: [method, attention, causal-mask, mllm]
created: 2026-05-16
updated: 2026-05-16
---

# Future-Aware Causal Mask

La future-aware causal mask (Pei 2025) è una modifica training-free della causal mask in un MLLM che permette ai token visivi di vedere "in avanti" su una finestra limitata, in modo che l'informazione visiva non resti intrappolata in [[attention-sink]] alla testa della sequenza ma fluisca verso i token di query. Pensata per la fase di prefill, separata dal decoding.

Nel wiki è il concetto centrale del paper Pei 2025 e termine di confronto per il lavoro Liu 2026 su adaptive information flow.

## Sources

- [[pei-2025-causal-mask-attention]] — concetto centrale del paper
- [[liu-2026-adaptive-information-flow]] — confronto diretto come baseline
