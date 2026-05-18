---
title: Adaptive Keyframe Sampling (AKS)
type: concept
tags: [method, video-llm, keyframe-sampling, training-free, long-video]
created: 2026-05-15
updated: 2026-05-15
---

# Adaptive Keyframe Sampling (AKS)

**AKS** è un modulo plug-and-play **training-free** introdotto da Tang et al. (2025) che sostituisce l'uniform sampling pre-VLM nei video MLLM. Formalizza la selezione di $M$ keyframe come massimizzazione di due termini: (1) **relevance** $s(Q, F_t)$ tra prompt e frame (via BLIP/CLIP image-text matching) e (2) **coverage** $c(\mathcal{I})$ della distribuzione temporale (via Ripley's K-function su bin ricorsivi):

$$\arg\max \sum_t s(Q, F_t) + \lambda \cdot c(\mathcal{I})$$

## Architettura

Algoritmo **ADA** (Adaptive Sampling): a ogni nodo dell'albero, se $s_\text{top} - s_\text{all} > s_\text{thr}$ ritorna i top-$k$ frame del bin (TOP-mode); altrimenti splitta il bin in due e distribuisce equamente i keyframe (BIN-mode), ricorsivamente, fino a depth $L \le \lceil\log_2 M\rceil$. Plug-and-play: nessun parametro del VLM modificato; sostituisce solo l'algoritmo di sampling. Hyperparametri tipici: $s_\text{thr} \in [0.6, 0.8]$, $L \in [3, 5]$.

## Numeri di riferimento

Su LongVideoBench e Video-MME, integrato su Qwen2-VL, LLaVA-OV e LLaVA-Video-7B (con 32 o 64 frame al VLM):
- LLaVA-Video-7B 58.9 → **62.7** su LVBench (+3.8), 64.4 → **65.3** su V-MME (+0.9)
- Qwen2-VL-7B 55.5 → **60.5** LVBench (+5.0), 57.6 → **59.9** V-MME (+2.3)
- LLaVA-OV-7B 54.8 → **59.3** LVBench (+4.5)

LLaVA-Video-7B+AKS supera LLaVA-Video-72B e GPT-4V/Gemini-1.5-Flash a 256 frame, con solo 64 frame.

## Sources

- [[tang-2025-adaptive-keyframe-sampling]] — paper introduttivo
- [[zhang-2024-llovi]] — combinabile per ridurre numero di caption
- [[arnab-2025-temporal-chain-of-thought]] — competitor (VLM-as-selector)
- [[doorenbos-2026-video-panels]] — combinabile (paneling × AKS sembra ortogonale)

## Concetti correlati

- [[blip-2]], [[clip]] — scorer image-text alternativi
- [[ripleys-k-function]] — formalizzazione coverage
- [[uniform-sampling]] — baseline sostituita
- [[long-video-understanding]], [[training-free-methods]]
