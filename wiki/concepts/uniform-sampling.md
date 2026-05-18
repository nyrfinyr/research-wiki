---
title: Uniform Sampling
type: concept
tags: [video, frame-sampling, baseline]
created: 2026-05-16
updated: 2026-05-16
---

# Uniform Sampling

Lo uniform sampling è la strategia più semplice di selezione di frame in un video-LLM: dato un budget di N frame, si scelgono N indici equispaziati sull'asse temporale, indipendentemente dal contenuto o dalla query. È la baseline naturale contro cui si misurano metodi adattivi di [[keyframe-sampling]].

Nel wiki è la baseline esplicita di [[adaptive-keyframe-sampling]] e degli altri lavori di token reduction.

## Sources

- [[tang-2025-adaptive-keyframe-sampling]] — citato come baseline
