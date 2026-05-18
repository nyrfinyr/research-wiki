---
title: Multiple-Choice QA
type: concept
tags: [task-formulation, evaluation, qa]
created: 2026-05-15
updated: 2026-05-15
---

# Multiple-Choice QA

**Multiple-choice question answering (MCQA)** è la formulazione del task QA in cui il modello sceglie una lettera fra N opzioni (tipicamente 4 o 5). È il formato dominante nei benchmark MLLM video del wiki perché elimina la variabilità della valutazione di output open-ended e permette accuracy diretta via regex match.

Convenzioni nel wiki:
- **4 opzioni** (random baseline 25 %): [[video-mme]], [[lvbench]], [[mvbench]], [[longvideobench]], [[next-qa]].
- **5 opzioni** (random baseline 20 %): [[egoschema]].
- **Estrazione**: regex sulla lettera; fallback LLM judge solo se il regex fallisce; il prompt design "Best Option: (" introdotto da [[li-2024-mvbench]] porta l'extraction rate al 100 %.

Limite riconosciuto: MCQA può nascondere debolezze del modello (allucinazioni, shortcut linguistici, mancanza di comprensione visiva fine-grained) che emergono solo con setup open-ended o fine-grained. Vedi [[kim-2026-sink-token-aware-pruning]] che mostra come metodi training-free di token pruning si comportino bene su MCQA ma collassino su task fine-grained (hallucination su EventHallusion).

## Sources

- [[mangalam-2023-egoschema]] — 5-MCQ formato.
- [[fu-2025-video-mme]] — 4-MCQ formato.
- [[wang-2025-lvbench]] — 4-MCQ formato.
- [[li-2024-mvbench]] — 4-MCQ formato + prompt design.
- [[kim-2026-sink-token-aware-pruning]] — critica del MCQA come nascondino di debolezze.

## Concetti correlati

- [[video-question-answering]] — task.
- [[evaluation-metrics]] / accuracy — metrica.
- [[egoschema]], [[video-mme]], [[lvbench]], [[mvbench]] — benchmark che lo adottano.
