---
title: Video Question Answering
type: concept
tags: [task, video, qa, broad-concept]
created: 2026-05-15
updated: 2026-05-15
---

# Video Question Answering

**Video Question Answering (Video-QA)** è il task di rispondere a una domanda in linguaggio naturale data come input un video. È il paradigma dominante per valutare i [[video-llm|video-LLM]] e i [[multimodal-large-language-model|MLLM]] video. Si distingue per:

- **Formato della risposta**: [[multiple-choice-qa|multiple-choice]] (più comune: 4 o 5 opzioni) vs open-ended.
- **Durata del video**: short-form (~10 s, es. [[next-qa]]), long-form (~10–60 s, classe LVU), very long-form (~3 min, [[egoschema]]), full-spectrum (11 s – 1 h, [[video-mme]]), extreme (~68 min, [[lvbench]]).
- **Tipo di reasoning**: perception (recognition, OCR, counting), causal/temporal reasoning, summarization, temporal grounding.
- **Modalità di input**: solo frame, frame + sottotitoli, frame + audio.

I benchmark nel wiki includono [[egoschema]], [[video-mme]], [[lvbench]], [[mvbench]], [[mlvu]], [[longvideobench]], [[next-qa]], [[activitynet-qa]], [[movieqa]], [[tvqa]], [[perception-test]], [[clevrer]], [[star-benchmark]], [[tempcompass]].

## Sources

Citato in praticamente tutti i source pages video del wiki, in particolare:

- [[mangalam-2023-egoschema]] — definisce il task come paradigma del long-form.
- [[fu-2025-video-mme]] — paradigma del benchmark.
- [[wang-2025-lvbench]] — paradigma del benchmark.
- [[li-2024-mvbench]] — paradigma del benchmark.
- [[zhang-2024-llovi]] — paradigma del framework caption-based.
- [[arnab-2025-temporal-chain-of-thought]] — paradigma di TCoT.
- [[tang-2025-adaptive-keyframe-sampling]] — paradigma dell'evaluazione di AKS.

## Concetti correlati

- [[multimodal-large-language-model]] — modelli che lo risolvono.
- [[video-llm]] — sub-famiglia.
- [[multiple-choice-qa]] — formato dominante.
- [[long-video-understanding]] — task specialization.
- [[caption-based-vqa]] — pipeline alternativa.
- [[certificate-length]] — metrica di difficoltà.
