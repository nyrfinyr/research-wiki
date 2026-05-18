---
title: Fine-grained Video Understanding
type: concept
tags: [task, video, temporal, fine-grained]
created: 2026-05-16
updated: 2026-05-16
---

# Fine-grained Video Understanding

Fine-grained video understanding is the ability to answer questions about details that change frame by frame — direction of motion, precise ordering of sub-actions, counting of objects entering/leaving — rather than being limited to the "gist" of the scene. It is the dimension on which video-LLMs show the largest deficits due to static-scene bias.

In the wiki it is the explicit motivation behind Kim's work on attention pathway and sink-token pruning.

## Sources

- [[kim-2025-map-the-flow]] — target task of the pathway analysis
- [[kim-2026-sink-token-aware-pruning]] — capability preserved by pruning
