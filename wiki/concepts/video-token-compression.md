---
title: Video Token Compression
type: concept
tags: [task, video, efficiency, token-reduction]
created: 2026-05-16
updated: 2026-05-16
---

# Video Token Compression

Video token compression is the family of techniques for reducing the number of visual tokens produced by a video before passing them to the LLM, so as to make long sequences tractable without blowing up the attention cost. It includes pruning, merging, temporal pooling, differential frame pruning and similar approaches.

In the wiki it is one of the central modules of [[videollama-3]] and relates to [[visual-token-pruning]] and [[keyframe-sampling]].

## Sources

- [[zhang-2025-videollama-3]] — architectural component of the model
