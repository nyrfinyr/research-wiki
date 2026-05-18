---
title: Interleaved MRoPE
type: concept
tags: [method, positional-encoding, rope, mllm]
created: 2026-05-16
updated: 2026-05-16
---

# Interleaved MRoPE

Interleaved MRoPE è una variante di [[mrope]] introdotta in Qwen3-VL in cui le dimensioni dell'embedding rotatorio dedicate ad asse temporale, height e width vengono interlacciate lungo i canali invece di essere assegnate a blocchi contigui. L'interleaving stabilizza l'estrapolazione a contesti video lunghi e migliora il comportamento posizionale rispetto a M-RoPE base.

Nel wiki è uno dei componenti architetturali distintivi del rapporto tecnico Qwen3-VL.

## Sources

- [[qwen3-vl-2025-tech-report]] — variante introdotta dal modello
