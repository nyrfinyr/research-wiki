---
title: Concentric Causal Attention
type: concept
tags: [method, attention, causal-mask, mllm, training-based]
created: 2026-05-16
updated: 2026-05-16
---

# Concentric Causal Attention

Concentric Causal Attention (Xing et al.) è una variante training-based della causal mask in MLLM in cui i token visivi sono organizzati in "anelli concentrici" attorno alla regione di interesse e l'attenzione è ridefinita per rispettare questa struttura spaziale, riducendo bias posizionali introdotti dalla causal mask standard.

Nel wiki è citata come competitor training-based dei metodi training-free di modifica della causal mask di Pei 2025 e Liu 2026.

## Sources

- [[pei-2025-causal-mask-attention]] — competitor training-based
- [[liu-2026-adaptive-information-flow]] — confronto con CCA
