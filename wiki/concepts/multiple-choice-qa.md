---
title: Multiple-Choice QA
type: concept
tags: [task-formulation, evaluation, qa]
created: 2026-05-15
updated: 2026-05-15
---

# Multiple-Choice QA

**Multiple-choice question answering (MCQA)** is the QA task formulation in which the model picks one letter out of N options (typically 4 or 5). It is the dominant format in the video MLLM benchmarks of the wiki because it eliminates the variability of evaluating open-ended outputs and enables direct accuracy via regex match.

Conventions in the wiki:
- **4 options** (random baseline 25%): [[video-mme]], [[lvbench]], [[mvbench]], [[longvideobench]], [[next-qa]].
- **5 options** (random baseline 20%): [[egoschema]].
- **Extraction**: regex on the letter; LLM judge fallback only if regex fails; the "Best Option: (" prompt design introduced by [[li-2024-mvbench]] brings the extraction rate to 100%.

Acknowledged limitation: MCQA can hide model weaknesses (hallucinations, linguistic shortcuts, lack of fine-grained visual understanding) that surface only with open-ended or fine-grained setups. See [[kim-2026-sink-token-aware-pruning]], which shows that training-free token pruning methods perform well on MCQA but collapse on fine-grained tasks (hallucination on EventHallusion).

## Sources

- [[mangalam-2023-egoschema]] — 5-MCQ format.
- [[fu-2025-video-mme]] — 4-MCQ format.
- [[wang-2025-lvbench]] — 4-MCQ format.
- [[li-2024-mvbench]] — 4-MCQ format + prompt design.
- [[kim-2026-sink-token-aware-pruning]] — critique of MCQA as a hiding place for weaknesses.

## Related concepts

- [[video-question-answering]] — task.
- [[evaluation-metrics]] / accuracy — metric.
- [[egoschema]], [[video-mme]], [[lvbench]], [[mvbench]] — benchmarks that adopt it.
