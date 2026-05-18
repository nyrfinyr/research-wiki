---
title: Fine-grained Video Understanding
type: concept
tags: [task, video, temporal, fine-grained]
created: 2026-05-16
updated: 2026-05-16
---

# Fine-grained Video Understanding

Il fine-grained video understanding è la capacità di rispondere su dettagli che cambiano frame a frame — direzione di movimento, ordine preciso di sub-azioni, conteggio di oggetti che entrano/escono — invece di limitarsi al "gist" della scena. È la dimensione su cui i video-LLM mostrano i deficit maggiori a causa di static-scene bias.

Nel wiki è la motivazione esplicita dei lavori di Kim su attention pathway e sink-token pruning.

## Sources

- [[kim-2025-map-the-flow]] — task target dell'analisi pathway
- [[kim-2026-sink-token-aware-pruning]] — capacità preservata dal pruning
