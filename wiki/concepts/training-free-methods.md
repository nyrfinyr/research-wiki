---
title: Training-Free Methods
type: concept
tags: [paradigm, inference-time, plug-and-play]
created: 2026-05-15
updated: 2026-05-15
---

# Training-Free Methods

I **training-free methods** sono tecniche che migliorano un modello (tipicamente un [[multimodal-large-language-model|MLLM]] o un [[video-llm|video-LLM]]) **senza aggiornarne i pesi**: agiscono solo a inference time tramite preprocessing dell'input, prompt engineering, selezione di token/frame, o riformulazione della pipeline di reasoning. Vantaggi: nessun costo di training, plug-and-play, model-agnostic; svantaggi: il ceiling è limitato dalle capacità del modello base.

Nel wiki, il paradigma è esemplificato da:

- **[[zhang-2024-llovi|LLoVi]]**: short-term captioner + LLM aggregator + multi-round summarization prompt. Niente fine-tuning; tutto fa leva su captioner e LLM off-the-shelf.
- **[[tang-2025-adaptive-keyframe-sampling|AKS]]**: keyframe selection via BLIP/CLIP relevance + Ripley's K coverage; sostituisce uniform sampling, plug-and-play sul VLM.
- **[[arnab-2025-temporal-chain-of-thought|TCoT]]**: stesso VLM usato sia come frame selector sia come question answerer (Single-Step / Dynamic-Segment); training-free, inference-time scaling.
- **[[doorenbos-2026-video-panels|Video Panels]]**: visual prompt engineering via paneling di frame in griglie 2×2 (training-free, parameter-free, model-agnostic).
- **[[morini-2026-look-twice|Look Twice]]**: two-pass MLLM con highlighting attention-based di evidence visiva/testuale.
- **[[kim-2026-sink-token-aware-pruning|SToP]]**: visual token pruning plug-and-play, training-free, applicato su VisionZip / FastVid / Holitom / FlashVid.

## Sources

- [[zhang-2024-llovi]]
- [[tang-2025-adaptive-keyframe-sampling]]
- [[arnab-2025-temporal-chain-of-thought]]
- [[doorenbos-2026-video-panels]]
- [[morini-2026-look-twice]]
- [[kim-2026-sink-token-aware-pruning]]
- [[liu-2025-selfelicit]] (categoria adiacente, training-free per LLM testuali)

## Concetti correlati

- [[inference-time-scaling]] — paradigma imparentato.
- [[chain-of-thought]] — spesso usato come training-free strategy.
- [[keyframe-sampling]] — sotto-categoria.
- [[caption-based-vqa]] — sotto-categoria.
- [[visual-prompting]] — sotto-categoria.
