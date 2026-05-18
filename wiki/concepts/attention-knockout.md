---
title: Attention Knockout
type: concept
tags: [method, mechanistic-interpretability, intervention]
created: 2026-05-16
updated: 2026-05-16
---

# Attention Knockout

Attention knockout (Geva et al. 2023) is a mechanistic intervention technique in which a subset of attention edges is "switched off" (forcing to zero the scores from a set of source tokens to a target token at a given layer) to causally measure the contribution of those pathways on the output. It is a standard tool for isolating information pathways in a transformer.

In the wiki it is the method used by Map-the-Flow to identify the active pathways in video-LLMs.

## Sources

- [[kim-2025-map-the-flow]] — used to identify effective pathways
