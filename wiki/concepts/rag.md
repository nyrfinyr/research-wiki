---
title: Retrieval-Augmented Generation
type: concept
tags: [method, retrieval, llm, kb]
created: 2026-05-16
updated: 2026-05-16
---

# Retrieval-Augmented Generation

RAG (Retrieval-Augmented Generation) is the paradigm in which a generative model receives, before producing its answer, a set of passages retrieved from an external knowledge base via a retriever (dense or sparse). It reduces hallucinations and allows knowledge to be updated without retraining the model.

In the wiki it is the background framework for work on evidence-highlighting and KB-VQA, where the attention of the LLM itself is used to identify relevant context.

## Sources

- [[morini-2026-look-twice]] — background framework for KB-VQA
- [[liu-2025-selfelicit]] — background framework for context-based QA
