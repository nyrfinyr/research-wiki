---
title: Caption-Based VQA
type: concept
tags: [paradigm, training-free, video-qa, captioning]
created: 2026-05-15
updated: 2026-05-15
---

# Caption-Based VQA

**Caption-based VQA** è un paradigma di video question-answering in cui il video non viene processato direttamente da un MLLM end-to-end, ma è prima trasformato in **caption testuali** (una per clip breve, tipicamente 0.5–8 s) da un captioner specializzato; un LLM testuale aggrega poi le caption e risponde alla domanda. È strettamente [[training-free-methods|training-free]].

L'esempio canonico nel wiki è **[[zhang-2024-llovi|LLoVi]]** (Zhang et al., EMNLP 2024 Findings): short-term captioner (LaViLa / BLIP-2 / CogAgent) + LLM aggregator (GPT-3.5/4, Llama3) + **multi-round summarization prompt** `(C, Q) → S → (S, Q, A) → answer`. Stato dell'arte all'epoca su [[egoschema]] (Fullset 61.2 % con GPT-4), [[next-qa]] (+10.2), IntentQA (+6.2).

Vantaggi: niente long-context VLM richiesto, captioner e LLM off-the-shelf, scaling delegato all'LLM. Svantaggi: ceiling limitato dalla qualità del captioner (oracle gap 10.8 punti su EgoSchema [source: raw/papers/zhang-2024-llovi.pdf Tab. 1]), perdita di info visuale fine-grained (OCR, piccoli oggetti), costo LLM su long video.

Successivamente superato da metodi VLM end-to-end come [[arnab-2025-temporal-chain-of-thought|TCoT]] su NExT-QA (81.0 vs LLoVi 73.8) e dai native video-LLM long-context come [[qwen2-5-vl-2025-tech-report|Qwen2.5-VL]] e [[qwen3-vl-2025-tech-report|Qwen3-VL]].

## Sources

- [[zhang-2024-llovi]] — paradigma archetipo, framework LLoVi.
- [[arnab-2025-temporal-chain-of-thought]] — confronta come baseline e supera.
- [[tang-2025-adaptive-keyframe-sampling]] — paradigma alternativo (frame selection invece di captioning).

## Concetti correlati

- [[training-free-methods]] — paradigma più ampio.
- [[video-question-answering]] — task.
- [[long-video-understanding]] — applicazione tipica.
- [[multi-round-summarization]] — tecnica di prompt.
- [[video-llm]] — alternativa end-to-end.
