---
title: NExT-QA
type: concept
tags: [benchmark, video-qa, causal-reasoning, temporal-reasoning, short-video]
created: 2026-05-15
updated: 2026-05-15
---

# NExT-QA

NExT-QA è un benchmark di Video-QA focalizzato su **causal e temporal reasoning** su clip brevi. Si distingue per domande che richiedono ragionamento sul "perché" e "in che ordine", non solo su "cosa": le tre famiglie sono Causal, Temporal, Descriptive. È citato come dataset di confronto per la **certificate length** (~5 s mediana) ed è valutato in molti tech report MLLM e paper di metodi training-free.

## Composizione / Protocollo

- Video brevi (~10-30 s tipici).
- Domande organizzate in 3 famiglie: **Causal** (perché), **Temporal** (ordine, dopo, prima), **Descriptive** (descrittive di contenuto).
- Formato: multiple-choice (zero-shot) e open-ended.
- Mediana certificate length ~5 s — categorizzato come *long-form* task secondo la tassonomia di [[mangalam-2023-egoschema]] (certificate ~10 s) [source: raw/papers/mangalam-2023-egoschema.pdf §3].

## Numeri di riferimento

Risultati dai source pages:

| Modello | NExT-QA | Note | Fonte |
|---|---|---|---|
| VideoChat2 (Vicuna-7B) | 61.7 | zero-shot avg | [[li-2024-mvbench]] |
| VideoChat2 + Mistral-7B | 78.6 | in-domain | [[li-2024-mvbench]] |
| LLoVi (GPT-4 + CogAgent) | — | +10.2 vs precedente SOTA | [[zhang-2024-llovi]] |
| VideoLLaMA 3-2B | 81.1 | | [[zhang-2025-videollama-3]] |
| VideoLLaMA 3-7B | — | | [[zhang-2025-videollama-3]] |
| Qwen2-VL-2B | 77.2 | | [[zhang-2025-videollama-3]] |
| InternVL2.5-2B | 75.6 | | [[zhang-2025-videollama-3]] |
| TCoT (Gemini Flash) | 81.0 | baseline 80.0 | [[arnab-2025-temporal-chain-of-thought]] |

## Sources

- [[li-2024-mvbench]] — confronto zero-shot e in-domain.
- [[zhang-2024-llovi]] — SOTA caption-based (+10.2 vs precedente).
- [[arnab-2025-temporal-chain-of-thought]] — valuta TCoT (81.0 vs 80.0).
- [[mangalam-2023-egoschema]] — confronto certificate length (NExT-QA ~5 s vs EgoSchema ~100 s).
- [[zhang-2025-videollama-3]] — valuta VideoLLaMA 3.
- [[kim-2026-sink-token-aware-pruning]] — valuta SToP su NextQA.

## Concetti correlati

- [[video-question-answering]] — paradigma.
- [[multiple-choice-qa]] — formato.
- [[long-video-understanding]] — task adiacente (qui short-form).
- [[mvbench]] — predecessore temporal multi-task.
- [[egoschema]] — long-form variant.
- [[intentqa]] — benchmark imparentato (citato in LLoVi).
- [[certificate-length]] — usato per confronto.
