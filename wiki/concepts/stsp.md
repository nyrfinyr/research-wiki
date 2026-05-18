---
title: STSP
type: concept
tags: [method, pruning, video-llm, sink-token]
created: 2026-05-16
updated: 2026-05-16
---

# STSP

STSP (Sink-Token-aware Spatial Pruning, Kim 2026) is the spatial pruning module for visual tokens in video-LLMs that uses a "sink-score" to identify tokens behaving as attention sinks — typically in the scene background — and removes them, preserving salient tokens. It is paired with STTP, its temporal counterpart.

In the wiki it is the specific name of the module introduced by the Kim 2026 paper and cited in Map-the-Flow as a complementary direction to edge pruning.

## Sources

- [[kim-2026-sink-token-aware-pruning]] — module introduced by the paper
- [[kim-2025-map-the-flow]] — cited as a complementary direction
