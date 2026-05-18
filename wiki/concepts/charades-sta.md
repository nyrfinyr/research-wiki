---
title: Charades-STA
type: concept
tags: [benchmark, video, temporal-grounding, moment-retrieval]
created: 2026-05-15
updated: 2026-05-15
---

# Charades-STA

**Charades-STA** è un benchmark di **temporal grounding / moment retrieval**: dato un video e una descrizione testuale, localizzare il segmento temporale (start, end) corrispondente. Metrica principale: **mIoU** (mean Intersection-over-Union). È uno dei test standard per misurare la capacità di un MLLM di ragionare al secondo sulla timeline.

Nel wiki appare come sorgente del task "Action Localization" di [[mvbench]] [source: raw/papers/li-2024-mvbench.pdf §3.2] e come benchmark di valutazione nei tech report Qwen.

## Numeri di riferimento

Risultati di temporal grounding mIoU:

| Modello | Charades-STA mIoU | Fonte |
|---|---|---|
| GPT-4o | 35.7 | [[qwen2-5-vl-2025-tech-report]] |
| Qwen2.5-VL-3B | 38.8 | [[qwen2-5-vl-2025-tech-report]] |
| Qwen2.5-VL-7B | 43.6 | [[qwen2-5-vl-2025-tech-report]] |
| Qwen2.5-VL-72B | **50.9** | [[qwen2-5-vl-2025-tech-report]] (+15.2 vs GPT-4o) |
| VideoLLaMA 3-2B | 55.5 | [[zhang-2025-videollama-3]] |
| VideoLLaMA 3-7B | 60.7 | [[zhang-2025-videollama-3]] |
| Qwen3-VL-235B-A22B inst | 64.8 | [[qwen3-vl-2025-tech-report]] |

Qwen2.5-VL motiva la T-RoPE absolute-time aligned proprio dal salto su Charades-STA, dove temporal grounding al secondo è critico.

## Sources

- [[qwen2-5-vl-2025-tech-report]] — valuta e motiva T-RoPE.
- [[qwen3-vl-2025-tech-report]] — valuta Qwen3-VL.
- [[zhang-2025-videollama-3]] — valuta VideoLLaMA 3.
- [[li-2024-mvbench]] — sorgente di Action Localization.

## Concetti correlati

- [[temporal-grounding]] — task.
- [[mvbench]] — benchmark che lo usa come sorgente.
- [[video-llm]] — modelli valutati.
- [[mrope]] / T-RoPE — meccanismo che lo motiva.
