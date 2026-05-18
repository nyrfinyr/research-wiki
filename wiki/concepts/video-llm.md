---
title: Video LLM
type: concept
tags: [model-family, video, multimodal, vision-language, broad-concept]
created: 2026-05-15
updated: 2026-05-15
---

# Video LLM

Un **Video LLM** è un [[multimodal-large-language-model|MLLM]] specializzato (o esteso) per l'elaborazione di video. Nel wiki si distinguono due famiglie operative:

1. **Image-MLLM applicato frame-by-frame**: un MLLM image-based che riceve un set di frame campionati dal video come immagini multiple e produce la risposta sul concatenato. Esempi: LLaVA, InternVL applicati al video. Vantaggio: riusa direttamente lo stack image-MLLM; svantaggio: nessuna nozione di tempo nativa, sampling uniforme rigido, no temporal grounding.
2. **Native video-LLM**: un MLLM con supporto nativo per la dimensione temporale (positional encoding 3D, dynamic FPS sampling, video token compression). Esempi tipici nel wiki: [[qwen2-5-vl-2025-tech-report|Qwen2.5-VL]] (T-RoPE absolute-time aligned, dynamic FPS, max 768 frame), [[qwen3-vl-2025-tech-report|Qwen3-VL]] (interleaved MRoPE, textual timestamp tokens, 256K context), [[zhang-2025-videollama-3|VideoLLaMA 3]] (AVT 2D-RoPE + DiffFP), LLaVA-Video, LLaVA-OneVision, VideoChat2 (vedi [[li-2024-mvbench]]).

I source pages del wiki usano "video-LLM" per indicare entrambe le famiglie nel contesto della valutazione su benchmark video; quando serve distinguere, la disambiguazione è esplicita (es. [[wang-2025-lvbench]] tassonomizza in "native long-video models" vs "non-native long-video models").

## Sfide tipiche

- **Long-context modeling**: numero di token visivi cresce linearmente con #frame; es. 6.270 token per 32 frame su LLaVA-OneVision-7B [source: raw/papers/kim-2026-sink-token-aware-pruning.pdf §1].
- **Sampling**: uniform vs adaptive ([[keyframe-sampling]]) — vedi [[tang-2025-adaptive-keyframe-sampling]], [[arnab-2025-temporal-chain-of-thought]].
- **Temporal positional encoding**: MRoPE chunked vs interleaved, T-RoPE absolute-time, textual timestamp tokens — vedi [[qwen3-vl-2025-tech-report]] §2.1, §2.3.
- **Token compression**: video token pruning, frame pruning (DiffFP), Q-Former — vedi [[zhang-2025-videollama-3]], [[kim-2026-sink-token-aware-pruning]].
- **Audio**: la maggior parte degli open-source video-LLM **non** lo supporta nativamente, motivo per cui [[lvbench]] e [[wang-2025-lvbench]] lo escludono dal benchmark.

## Famiglie nel wiki

- **Qwen2.5-VL** (3B/7B/72B) — vedi [[qwen2-5-vl-2025-tech-report]].
- **Qwen3-VL** (2B/4B/8B/32B + 30B-A3B/235B-A22B MoE) — vedi [[qwen3-vl-2025-tech-report]].
- **VideoLLaMA 3** (2B/7B, Qwen2.5 backbone, AVT + DiffFP) — vedi [[zhang-2025-videollama-3]].
- **VideoLLaMA 2** — predecessore con audio encoder.
- **LLaVA-Video / LLaVA-OneVision / LLaVA-NeXT-Video** — riferimenti come backbone in [[tang-2025-adaptive-keyframe-sampling]], [[doorenbos-2026-video-panels]].
- **VideoChat / VideoChat2** — vedi [[li-2024-mvbench]].
- **MovieChat, LWM, mPLUG-Owl3, Apollo, InternVL2.5-Video, GLM4V-Plus, Seed1.5-VL** — citati in tabelle di confronto.
- **Closed-source**: GPT-4V/4o, Gemini 1.5/2.0/2.5, Claude 3.5/Opus 4.x.

## Sources

- [[qwen2-5-vl-2025-tech-report]] — native video-LLM con T-RoPE.
- [[qwen3-vl-2025-tech-report]] — native video-LLM con interleaved MRoPE + textual timestamps.
- [[zhang-2025-videollama-3]] — paradigma vision-centric, AVT + DiffFP.
- [[li-2024-mvbench]] — VideoChat2.
- [[arnab-2025-temporal-chain-of-thought]] — inference-time training-free su video-LLM.
- [[tang-2025-adaptive-keyframe-sampling]] — keyframe selection plug-and-play.
- [[doorenbos-2026-video-panels]] — visual prompting su video-LLM.
- [[zhang-2024-llovi]] — pipeline alternativa caption + LLM.
- [[wang-2025-lvbench]] — tassonomizza native vs non-native long-video models.
- [[kim-2026-sink-token-aware-pruning]] — token pruning su video-LLM.
- [[kim-2025-map-the-flow]] — interpretabilità su video-LLM.
- [[liu-2026-adaptive-information-flow]] — adaptive information flow nei video-LLM.

## Concetti correlati

- [[multimodal-large-language-model]] — super-categoria.
- [[vision-language-model]] — categoria adiacente (image-only).
- [[long-video-understanding]] — task target.
- [[video-question-answering]] — paradigma.
- [[keyframe-sampling]] — strategia di input handling.
- [[video-token-compression]] — strategia di efficienza.
- [[mrope]] / [[interleaved-mrope]] — positional encoding 3D.
- [[long-context]] — esigenza strutturale.
