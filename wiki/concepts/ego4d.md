---
title: Ego4D
type: concept
tags: [dataset, egocentric-video, large-scale, video-foundation-data]
created: 2026-05-15
updated: 2026-05-15
---

# Ego4D

Ego4D is the reference large-scale egocentric dataset for video research: **3,670 hours** of egocentric RGB video collected from hundreds of participants, with **3.85 M dense narrations** (1772 verbs, 4336 unique nouns) timestamped. It is at once a training corpus (for video encoders and MLLMs) and the direct basis of [[egoschema]] (3-min clips with ≥ 30 narrations → 5,063 QAs), as well as a source of instruction-tuning data ("EgoQA") in VideoChat2 and an evaluation domain in [[longvideobench]], [[lvbench]], etc.

## Role in the wiki

- **Source for EgoSchema**: Stage I of the [[mangalam-2023-egoschema]] pipeline filters non-overlapping 3-minute clips with ≥ 30 timestamped narrations, yielding ~250 h of filtered video [source: raw/papers/mangalam-2023-egoschema.pdf §3.1].
- **Training data for MLLMs**: used as EgoQA in instruction-tuning of [[li-2024-mvbench|VideoChat2]] and as part of the video corpus of [[zhang-2025-videollama-3|VideoLLaMA 3]].
- **Captioner pre-training**: LaViLa and EgoVLP, used in [[zhang-2024-llovi]], are pre-trained on Ego4D.

## Sources

- [[mangalam-2023-egoschema]] — uses Ego4D as the video pool for EgoSchema.
- [[li-2024-mvbench]] — uses Ego4D as the EgoQA source in VideoChat2 instruction tuning.
- [[zhang-2024-llovi]] — the LaViLa captioner is pre-trained on Ego4D.
- [[zhang-2025-videollama-3]] — Ego4D cited as part of the video corpus.
- [[wang-2025-lvbench]] — cited as a video-understanding domain.

## Related concepts

- [[egoschema]] — derived benchmark.
- [[long-video-understanding]] — supported task.
- [[video-llm]] — family of models that uses it in training.
- [[multimodal-large-language-model]] — downstream target.
