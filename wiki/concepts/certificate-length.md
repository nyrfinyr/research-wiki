---
title: Certificate Length
type: concept
tags: [metric, video, benchmark-design, temporal]
created: 2026-05-15
updated: 2026-05-15
---

# Certificate Length

**Temporal certificate length** is a metric introduced by [[mangalam-2023-egoschema]] (§3.2) to measure the **intrinsic temporal difficulty** of a video task, *decoupled* from clip duration. Definition: given a (video, label) and a task, the **certificate set** is the minimal subset of sub-clips *necessary and sufficient* to convince a human verifier of the label's correctness without watching the rest of the video; the **certificate length** = sum of the temporal lengths of the sub-clips in the set.

Conventions: minimum 0.1 s per certificate; two non-contiguous certificates are merged if their nearest endpoints are < 5 s apart.

Derived temporal taxonomy [source: raw/papers/mangalam-2023-egoschema.pdf §3]:
- *short video task*: certificate ~1 s (Kinetics, UCF101, AVA).
- *long-form video task*: ~10 s (AGQA, NextQA, MSRVTT).
- *very long-form video task*: ~100 s (EgoSchema, isolated in Fig. 3).

Explicitly adopted by:
- **[[fu-2025-video-mme]]**: median 26 / 165 / 891 s for short/medium/long; EgoSchema (~100 s) sits between Video-MME's short and medium.
- **[[wang-2025-lvbench]]**: analogous concept "clue duration", manually annotated for each QA.

## Sources

- [[mangalam-2023-egoschema]] — introduces the metric.
- [[fu-2025-video-mme]] — adopts it as a comparative difficulty measure.
- [[wang-2025-lvbench]] — annotates clue duration with an analogous concept.

## Related concepts

- [[egoschema]] — benchmark in which it is defined.
- [[long-video-understanding]] — target task.
- [[keyframe-sampling]] — practice that tries to approximate the certificate set.
- [[video-question-answering]] — application paradigm.
