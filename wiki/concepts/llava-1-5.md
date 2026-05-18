---
title: LLaVA-1.5
type: concept
tags: [vlm, model]
created: 2026-05-15
updated: 2026-05-15
---

# LLaVA-1.5

Versione 1.5 di LLaVA (Liu et al., ottobre 2023): rispetto al primo LLaVA introduce un projector MLP a due layer, risoluzione più alta (336²) e dataset di instruction tuning ampliato. Backbone tipico Vicuna-7B/13B + CLIP ViT-L/14. Usata come backbone target in lavori di interpretazione/attenzione su MLLM.

## Sources

- [[pei-2025-causal-mask-attention]] — backbone su cui viene applicata l'analisi causal mask

## Concetti correlati

- [[llava]] — famiglia di appartenenza
- [[llava-1-6]] — successore
- [[vicuna]] — LLM backbone
