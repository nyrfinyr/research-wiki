---
title: Long Video Understanding
type: concept
tags: [task, video, long-form, broad-concept]
created: 2026-05-15
updated: 2026-05-15
---

# Long Video Understanding

**Long Video Understanding** è il task di rispondere a domande, sintetizzare o ragionare su video di durata "lunga" — variamente definita: da decine di secondi a multi-ora. La nozione operativa più chiara nel wiki è quella di [[mangalam-2023-egoschema]]: long-form video task = quelli con [[certificate-length]] dell'ordine di **10 s**; very long-form = ordine **100 s**. [[wang-2025-lvbench]] definisce esplicitamente "long video" come **≥ 30 min** con eventi multipli, transizioni di scena e contenuto visivamente ricco.

## Benchmark

- [[egoschema]] — very long-form egocentric (~100 s certificate, 3 min/video).
- [[video-mme]] — full-spectrum (11 s – 1 h) con sub-fasce short/medium/long.
- [[lvbench]] — extreme long-video (~68 min/video).
- [[mlvu]] — multi-task long-form.
- [[longvideobench]] — referring QA su long video.
- [[timescope]] — long-video con biggest gain in [[doorenbos-2026-video-panels]].
- [[vnbench]] — needle-in-haystack video.

## Metodi nel wiki

- **Native long-context video-LLM**: [[qwen2-5-vl-2025-tech-report|Qwen2.5-VL]] (768 frame, 24 576 token), [[qwen3-vl-2025-tech-report|Qwen3-VL]] (256K context, fino a 2 048 frame), MovieChat, LWM.
- **Training-free pipelines**: [[zhang-2024-llovi|LLoVi]] (caption + LLM), [[tang-2025-adaptive-keyframe-sampling|AKS]] (keyframe selection), [[arnab-2025-temporal-chain-of-thought|TCoT]] (selector-then-answerer), [[doorenbos-2026-video-panels|Video Panels]] (paneling).

## Sources

- [[mangalam-2023-egoschema]] — tassonomia temporale e benchmark very long-form.
- [[fu-2025-video-mme]] — full-spectrum benchmark.
- [[wang-2025-lvbench]] — definizione operativa "≥ 30 min".
- [[zhang-2024-llovi]] — pipeline caption-based.
- [[tang-2025-adaptive-keyframe-sampling]] — keyframe selection.
- [[arnab-2025-temporal-chain-of-thought]] — inference strategy training-free.
- [[doorenbos-2026-video-panels]] — visual prompt engineering.
- [[qwen2-5-vl-2025-tech-report]] — native long-video model.
- [[qwen3-vl-2025-tech-report]] — native long-video model con interleaved MRoPE.
- [[zhang-2025-videollama-3]] — video-LLM con DiffFP.

## Concetti correlati

- [[video-question-answering]] — task imparentato (short + long).
- [[certificate-length]] — metrica di difficoltà temporale.
- [[long-context]] — esigenza modellistica.
- [[keyframe-sampling]] — strategia di input.
- [[video-llm]] — modelli target.
