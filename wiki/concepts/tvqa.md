---
title: TVQA
type: concept
tags: [benchmark, video, qa, tv-shows, episodic-reasoning]
created: 2026-05-15
updated: 2026-05-15
---

# TVQA

**TVQA** is a video-QA benchmark based on TV series episodes (Friends, How I Met Your Mother, etc.) with questions that require reasoning over episodes and characters. In the wiki it appears as the **source** of the "Episodic Reasoning" task of [[mvbench]] [source: raw/papers/li-2024-mvbench.pdf §3.2] and as a zero-shot evaluation benchmark.

## Reference numbers

| Model | TVQA (zero-shot, no subs) | Source |
|---|---|---|
| SeViLA (previous SOTA) | 38.2 | [[li-2024-mvbench]] |
| VideoChat2 | 40.6 | [[li-2024-mvbench]] |
| VideoChat2 + Mistral | 46.4 | [[li-2024-mvbench]] |

## Sources

- [[li-2024-mvbench]] — source of Episodic Reasoning + zero-shot evaluation.

## Related concepts

- [[video-question-answering]] — task.
- [[mvbench]] — benchmark that uses it as a source.
- [[long-video-understanding]] — adjacent task.
