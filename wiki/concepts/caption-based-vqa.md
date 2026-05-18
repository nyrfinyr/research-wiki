---
title: Caption-Based VQA
type: concept
tags: [paradigm, training-free, video-qa, captioning]
created: 2026-05-15
updated: 2026-05-15
---

# Caption-Based VQA

**Caption-based VQA** is a video question-answering paradigm in which the video is not processed directly by an end-to-end MLLM, but is first turned into **textual captions** (one per short clip, typically 0.5–8 s) by a specialized captioner; a text LLM then aggregates the captions and answers the question. It is strictly [[training-free-methods|training-free]].

The canonical example in the wiki is **[[zhang-2024-llovi|LLoVi]]** (Zhang et al., EMNLP 2024 Findings): short-term captioner (LaViLa / BLIP-2 / CogAgent) + LLM aggregator (GPT-3.5/4, Llama3) + **multi-round summarization prompt** `(C, Q) → S → (S, Q, A) → answer`. State of the art at the time on [[egoschema]] (Fullset 61.2 % with GPT-4), [[next-qa]] (+10.2), IntentQA (+6.2).

Advantages: no long-context VLM required, off-the-shelf captioner and LLM, scaling delegated to the LLM. Disadvantages: ceiling limited by captioner quality (oracle gap of 10.8 points on EgoSchema [source: raw/papers/zhang-2024-llovi.pdf Tab. 1]), loss of fine-grained visual info (OCR, small objects), LLM cost on long video.

Later surpassed by end-to-end VLM methods such as [[arnab-2025-temporal-chain-of-thought|TCoT]] on NExT-QA (81.0 vs LLoVi 73.8) and by native long-context video-LLMs such as [[qwen2-5-vl-2025-tech-report|Qwen2.5-VL]] and [[qwen3-vl-2025-tech-report|Qwen3-VL]].

## Sources

- [[zhang-2024-llovi]] — archetypal paradigm, LLoVi framework.
- [[arnab-2025-temporal-chain-of-thought]] — compares as baseline and surpasses.
- [[tang-2025-adaptive-keyframe-sampling]] — alternative paradigm (frame selection instead of captioning).

## Related concepts

- [[training-free-methods]] — broader paradigm.
- [[video-question-answering]] — task.
- [[long-video-understanding]] — typical application.
- [[multi-round-summarization]] — prompting technique.
- [[video-llm]] — end-to-end alternative.
