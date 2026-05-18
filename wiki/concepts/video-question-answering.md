---
title: Video Question Answering
type: concept
tags: [task, video, qa, broad-concept]
created: 2026-05-15
updated: 2026-05-15
---

# Video Question Answering

**Video Question Answering (Video-QA)** is the task of answering a natural-language question given a video as input. It is the dominant paradigm for evaluating [[video-llm|video-LLMs]] and video [[multimodal-large-language-model|MLLMs]]. It is characterized by:

- **Answer format**: [[multiple-choice-qa|multiple-choice]] (most common: 4 or 5 options) vs open-ended.
- **Video duration**: short-form (~10 s, e.g. [[next-qa]]), long-form (~10–60 s, LVU class), very long-form (~3 min, [[egoschema]]), full-spectrum (11 s – 1 h, [[video-mme]]), extreme (~68 min, [[lvbench]]).
- **Reasoning type**: perception (recognition, OCR, counting), causal/temporal reasoning, summarization, temporal grounding.
- **Input modalities**: frames only, frames + subtitles, frames + audio.

The benchmarks in the wiki include [[egoschema]], [[video-mme]], [[lvbench]], [[mvbench]], [[mlvu]], [[longvideobench]], [[next-qa]], [[activitynet-qa]], [[movieqa]], [[tvqa]], [[perception-test]], [[clevrer]], [[star-benchmark]], [[tempcompass]].

## Sources

Cited in essentially every video source page in the wiki, in particular:

- [[mangalam-2023-egoschema]] — defines the task as the long-form paradigm.
- [[fu-2025-video-mme]] — benchmark paradigm.
- [[wang-2025-lvbench]] — benchmark paradigm.
- [[li-2024-mvbench]] — benchmark paradigm.
- [[zhang-2024-llovi]] — caption-based framework paradigm.
- [[arnab-2025-temporal-chain-of-thought]] — TCoT paradigm.
- [[tang-2025-adaptive-keyframe-sampling]] — AKS evaluation paradigm.

## Related concepts

- [[multimodal-large-language-model]] — models that solve it.
- [[video-llm]] — sub-family.
- [[multiple-choice-qa]] — dominant format.
- [[long-video-understanding]] — task specialization.
- [[caption-based-vqa]] — alternative pipeline.
- [[certificate-length]] — difficulty metric.
