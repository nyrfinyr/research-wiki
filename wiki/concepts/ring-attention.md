---
title: Ring Attention
type: concept
tags: [method, attention, long-context, parallelism]
created: 2026-05-16
updated: 2026-05-16
---

# Ring Attention

Ring Attention is a technique for parallelizing attention over very long sequences in which each device holds a chunk of the K/V tokens and "circulates" them among devices so that each Q sees all the Ks, without ever materializing the full attention matrix on a single node. It allows [[long-context]] to scale linearly in the number of devices.

In the wiki it is cited as the long-context technique behind Large World Model in work on video benchmarks.

## Sources

- [[fu-2025-video-mme]] — cited as a long-context technique
- [[wang-2025-lvbench]] — cited for LWM
