---
title: Perception Test
type: concept
tags: [benchmark, video, multi-task, perception]
created: 2026-05-15
updated: 2026-05-15
---

# Perception Test

**Perception Test** è un benchmark multi-task di video understanding sviluppato da Google DeepMind, focalizzato sulla valutazione di capacità percettive di base (memoria, abstraction, reasoning fisico, semantica). Nel wiki appare in due ruoli: (1) come **sorgente dati** per [[mvbench]] (task Object Shuffle, Action Count, State Change, Character Order — vedi [[li-2024-mvbench]] §3.2) e (2) come **benchmark di valutazione** per i moderni video-LLM nei tech report.

## Numeri di riferimento

Risultati selezionati (test split):

| Modello | PerceptionTest | Fonte |
|---|---|---|
| Qwen2.5-VL-3B | 66.9 | [[qwen2-5-vl-2025-tech-report]] |
| Qwen2.5-VL-7B | 70.5 | [[qwen2-5-vl-2025-tech-report]] |
| Qwen2.5-VL-72B | 73.2 | [[qwen2-5-vl-2025-tech-report]] |
| VideoLLaMA 3-2B | 68.0 | [[zhang-2025-videollama-3]] |
| VideoLLaMA 3-7B | 72.8 | [[zhang-2025-videollama-3]] |
| Qwen2-VL-7B | 62.3 | [[zhang-2025-videollama-3]] |
| InternVL2.5-8B | 68.9 | [[zhang-2025-videollama-3]] |
| Apollo-2B | 61.0 | [[zhang-2025-videollama-3]] |

## Sources

- [[li-2024-mvbench]] — sorgente di 4 task derivati per MVBench.
- [[qwen2-5-vl-2025-tech-report]] — valuta Qwen2.5-VL.
- [[zhang-2025-videollama-3]] — valuta VideoLLaMA 3.

## Concetti correlati

- [[video-question-answering]] — task.
- [[mvbench]] — benchmark che lo usa come sorgente.
- [[video-llm]] — modelli valutati.
