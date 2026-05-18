---
title: BLIP-2
type: concept
tags: [vlm, model]
created: 2026-05-15
updated: 2026-05-15
---

# BLIP-2

MLLM paradigmatico (Salesforce, 2023) che congela un vision encoder e un LLM e li collega tramite il **Q-Former**, addestrato in due stage (image-text matching/contrastive + generative). Capostipite della famiglia di modelli con bottleneck di query learnable; usato come baseline e come scorer image-text in pipeline di keyframe selection.

## Sources

- [[zhang-2024-llovi]] — image-level captioner
- [[fu-2025-video-mme]] — citato come predecessore con Q-Former
- [[li-2024-mvbench]] — confronto baseline
- [[tang-2025-adaptive-keyframe-sampling]] — scorer per Image-Text Matching nella keyframe selection

## Concetti correlati

- [[q-former]] — modulo introdotto
- [[instructblip]] — versione instruction-tuned
- [[clip]] — encoder visivo nelle prime versioni
