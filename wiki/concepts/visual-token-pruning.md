---
title: Visual Token Pruning
type: concept
tags: [efficient-inference, mllm, video-llm, kv-cache]
created: 2026-05-15
updated: 2026-05-15
---

# Visual Token Pruning

Famiglia di metodi *training-free* che, durante l'inferenza di un MLLM o Video LLM, **selezionano un sottoinsieme dei visual token** prima di passarli all'LLM (o durante i primi layer dell'LLM), abbattendo il termine quadratico `O(n²d)` dell'attention sui visual token. La motivazione operativa è che il numero di visual token cresce linearmente con la risoluzione (e con il numero di frame, per i video LLM), e domina rapidamente sul budget testuale: es. 6,270 token visivi per 32 frame su LLaVA-OneVision-7B vs ~20 token testuali [source: raw/papers/kim-2026-sink-token-aware-pruning.pdf §2.1, Eq. 1]. Si distingue dalla compressione *architetturale* (Q-Former) perché agisce post-hoc senza re-training.

## Claim chiave / Tecnica

- **Macro-famiglia**: FastV, VisionZip, FastVid, HoliTom, PruneVid, FlashVid, DyCoke. Si differenziano per (i) granularità (spatial-only vs spatial+temporal), (ii) signal di importanza (raw attention, density+attention, feature similarity), (iii) granularità di applicazione (input-level vs layer-level).
- **Validation gap**: Kim et al. (2026) mostrano che quasi tutti questi metodi sono validati su **MCQA** (MVBench, VideoMME, NextQA, LongVideoBench, MLVU), dove gli short-cut linguistici nascondono i loro difetti. Su task **fine-grained** (in particolare hallucination su EventHallusion) crollano drasticamente al diminuire del retention ratio [source: raw/papers/kim-2026-sink-token-aware-pruning.pdf §1, §3].
- **Causa del crollo: sink token visivi**: un piccolo sottoinsieme di token (patch di sfondo spazialmente persistenti) ha attenzione alta ma semantica quasi nulla. Quando sopravvivono al pruning, occupano il budget e distorcono l'evidenza visiva. Holitom (temporal+spatial) seleziona l'83% in meno di sink token rispetto alla variante senza temporal pruning — il temporal pruning agisce da *sink-suppressor implicito* [source: raw/papers/kim-2026-sink-token-aware-pruning.pdf §3.2-3.3, Fig. 3-4].
- **SToP — Sink-Token-aware Pruning** (Kim 2026): plug-and-play, definisce `sink score` `s_i = MinMax-Norm((Σ_t A^t_i)^w)` con `w=1.1`. STSP modifica lo score di selezione spaziale `Ã^t_i = A^t_i − μ_s · s_i`; STTP aggiunge `μ_t·s_i` al criterio di temporal merging. Su LLaVA-OneVision-7B con retention 10%, riduce il *performance drop rate* di 9-10pp [source: raw/papers/kim-2026-sink-token-aware-pruning.pdf §4.1-4.2, Tab. 1].
- **Contrasto con [[causal-mask-modulation]]** (Liu 2026): AIF *non* fa pruning — i visual token mascherati restano nel context ma vengono **scollegati solo dall'interazione visual→text**. Vision-to-vision aggregation è preservata, così l'informazione visiva non è eliminata. Sui benchmark di confronto AIF batte ViCrop (training-free) e CCA (training-based) [source: raw/papers/liu-2026-adaptive-information-flow.pdf §4.3, Tab. 5].

## Varianti / Estensioni

- **Spatial-only**: FastV, VisionZip, FastVid (selezione di patch per-frame).
- **Spatial+Temporal**: Holitom, PruneVid (merging cross-frame di token simili).
- **Tree-based**: FlashVid (ICLR'26, Appendix D.2 di Kim 2026).
- **Sink-aware**: SToP (Kim 2026) si applica sopra a VisionZip, FastVid, Holitom, FlashVid migliorando *consistentemente* tutti.

## Concetti correlati

- [[attention-sink]] — fenomeno che spiega il fallimento di molti metodi di pruning.
- [[visual-attention-sink]] — versione visiva del sink, target diretto di SToP.
- [[kv-cache]] — il pruning visivo riduce direttamente la dimensione del KV-cache.
- [[causal-mask-modulation]] — alternativa che modula la mask invece di rimuovere token.
- [[q-former]] — alternativa *architetturale* (training-based) alla compressione visiva.

## Sources

- [[kim-2026-sink-token-aware-pruning]] — diagnosi del sink token visivo come causa del crollo fine-grained; introduce STSP/STTP.
- [[liu-2026-adaptive-information-flow]] — contrasto: AIF *non* fa pruning ma modula la mask preservando vision-to-vision.
