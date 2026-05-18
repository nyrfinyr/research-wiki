---
title: Causal Mask Modulation
type: concept
tags: [attention, training-free, mllm, vlm, mask-intervention]
created: 2026-05-15
updated: 2026-05-15
---

# Causal Mask Modulation

Famiglia di interventi **training-free** che modificano la [[causal-attention-mask]] di un MLLM/VLM pre-addestrato per cambiarne il comportamento a inference-time, *senza* aggiornare i pesi. L'osservazione comune è che la causal mask triangolare ereditata dagli LLM è sub-ottimale sui visual token (che non hanno ordine intrinseco) e che relax/restrict mirati della mask possono migliorare grounding, OCR, temporal reasoning e ridurre l'hallucination [source: raw/papers/pei-2025-causal-mask-attention.pdf §1; raw/papers/liu-2026-adaptive-information-flow.pdf §1]. I metodi si differenziano per (i) quale dimensione della mask modificare, (ii) se l'intervento è statico (task-dipendente) o dinamico (token-dipendente).

## Claim chiave / Tecnica

- **Three future-aware masks** (Pei 2025): tre relax che operano solo sulle righe `i ∈ V` (query visive) — `M^f` (Full, tutto il future visibile), `M^{v2v}` (visual-to-visual future), `M^{v2t}` (visual-to-text future). Effetti task-dipendenti: temporal multi-image ↑ con `M^f / M^{v2v}`; text-rich VQA ↑ con `M^{v2t}`; text-dominant tasks degradano [source: raw/papers/pei-2025-causal-mask-attention.pdf §3.1-3.3, Tab. 1-3].
- **Light Future-Aware Attention** (Pei 2025): per evitare overhead di decoding, l'attention futura viene **compressa via 1D max-pool** in un summary score e merge nei primi token (sink) durante il **prefill**. Decoding rimane standard-causal ⇒ KV-cache invariato, speedup 2-3× rispetto al merge full [source: raw/papers/pei-2025-causal-mask-attention.pdf §4, Tab. 6].
- **Adaptive Information Flow (AIF)** (Liu 2026): mask **token-dipendente** basata su un'entropia delle "token dynamics" `D_{v_i} = {max_j a^l_{i,j}}_l`. Token visivi a entropia alta (irregolari) vengono mascherati nell'interazione visual→text; vision-to-vision è preservata. Selezione adattiva della mask-ratio massimizzando lo shift della distribuzione `S_0` (Eq. 5). Costo: 1 extra decoding step [source: raw/papers/liu-2026-adaptive-information-flow.pdf §4.1-4.3].
- **AIF vs Future-Aware**: Liu et al. ablazione esplicita (Tab. 7-8) — la future-aware mask di Pei `M^{v2v}/M^{v2t}` ottiene 48.9/49.8 su RealWorldQA, mentre AIF arriva a 60.5 (LLaVA-1.5-7B). AIF è *task-agnostic* (sceglie automaticamente i token), Pei è *task-dipendente* (richiede selezione manuale della mask) [source: raw/papers/liu-2026-adaptive-information-flow.pdf §5.3, Tab. 7-8].
- **StableMask, CCA, Modality-Mutual-Attention**: lavori correlati citati da Pei — `StableMask` (Yin et al.) raffina la mask, `CCA = Concentric Causal Attention` (Xing et al.) è training-based, MMA (Wang et al.) è simile concettualmente ma training-based [source: raw/papers/pei-2025-causal-mask-attention.pdf §concetti citati].
- **Attention Knockout** (Geva 2023, usato da Kim 2025): non rilascia la mask, la **rafforza** localmente per probing — modulazione mirata `M^l[s,t] = −∞` per disabilitare il flusso da `s` a `t` al layer `l`. È mask modulation con finalità interpretativa, non di performance [source: raw/papers/kim-2025-map-the-flow.pdf §2.2].

## Varianti / Estensioni

- **Statiche task-level**: Pei (`M^f`, `M^{v2v}`, `M^{v2t}`) — sceglie la mask in base al tipo di task.
- **Adaptive token-level**: AIF — sceglie quali token mascherare in base alle loro statistiche di attention cross-layer.
- **Probing**: Attention Knockout — mask additiva mirata per causal tracing.
- **Training-based correlate** (per riferimento): CCA, StableMask, MMA — non training-free, fuori scope di questa famiglia.

## Concetti correlati

- [[causal-attention-mask]] — oggetto su cui le modulazioni agiscono.
- [[attention-sink]] — interpretazione di Pei: il sink token può assorbire info future senza violare l'autoregression.
- [[visual-token-pruning]] — alternativa che rimuove token invece di mascherarli — Liu 2026 mostra che AIF è strettamente migliore di ViCrop e CCA.
- [[mechanistic-interpretability]] — Attention Knockout è mask modulation in funzione probing.

## Sources

- [[pei-2025-causal-mask-attention]] — introduce le tre future-aware mask + versione Light.
- [[liu-2026-adaptive-information-flow]] — introduce AIF (entropy-based, token-adaptive).
- [[kim-2025-map-the-flow]] — usa Attention Knockout, variante "probing" di mask modulation.
