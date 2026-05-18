---
title: TVQA
type: concept
tags: [benchmark, video, qa, tv-shows, episodic-reasoning]
created: 2026-05-15
updated: 2026-05-15
---

# TVQA

**TVQA** è un benchmark di video-QA basato su episodi di serie TV (Friends, How I Met Your Mother, ecc.) con domande che richiedono di ragionare su episodi e personaggi. Nel wiki appare come **sorgente** del task "Episodic Reasoning" di [[mvbench]] [source: raw/papers/li-2024-mvbench.pdf §3.2] e come benchmark di valutazione zero-shot.

## Numeri di riferimento

| Modello | TVQA (zero-shot, no subs) | Fonte |
|---|---|---|
| SeViLA (precedente SOTA) | 38.2 | [[li-2024-mvbench]] |
| VideoChat2 | 40.6 | [[li-2024-mvbench]] |
| VideoChat2 + Mistral | 46.4 | [[li-2024-mvbench]] |

## Sources

- [[li-2024-mvbench]] — sorgente di Episodic Reasoning + valutazione zero-shot.

## Concetti correlati

- [[video-question-answering]] — task.
- [[mvbench]] — benchmark che lo usa come sorgente.
- [[long-video-understanding]] — task adiacente.
