---
title: Long Context
type: concept
tags: [task, llm, scaling, attention]
created: 2026-05-16
updated: 2026-05-16
---

# Long Context

Per long context si intende la capacità di un LLM o MLLM di gestire sequenze di input molto lunghe (decine o centinaia di migliaia di token) mantenendo qualità predittiva. È il regime in cui emergono problemi di [[attention-sink]], degrado posizionale e costo quadratico dell'attenzione, e in cui diventano rilevanti varianti come [[sliding-window-attention]], [[ring-attention]] e [[alibi]].

Nel wiki è asse di valutazione centrale per i report Qwen3-VL e per i lavori su attention efficiente.

## Sources

- [[fu-2025-sliding-window-attention]] — citato come regime di interesse
- [[qwen3-vl-2025-tech-report]] — capacità target del modello
