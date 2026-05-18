---
title: Multimodal Large Language Model (MLLM)
type: concept
tags: [model-family, multimodal, vision-language, broad-concept]
created: 2026-05-15
updated: 2026-05-15
---

# Multimodal Large Language Model (MLLM)

Un **Multimodal Large Language Model** (MLLM) è un modello generativo costruito attorno a un LLM testuale al quale viene "innestata" la capacità di processare modalità non testuali — tipicamente immagini, video, audio. Nel wiki la categoria è usata in senso ampio per indicare modelli vision-language come [[qwen2-5-vl-2025-tech-report|Qwen2.5-VL]], [[qwen3-vl-2025-tech-report|Qwen3-VL]], [[zhang-2025-videollama-3|VideoLLaMA 3]], LLaVA, InternVL, Gemini, GPT-4V/GPT-4o, Claude 3.x. È l'oggetto di valutazione di tutti i benchmark video del wiki ([[egoschema]], [[video-mme]], [[lvbench]], [[mvbench]], [[mlvu]], [[longvideobench]]) e degli studi di interpretabilità / efficienza (es. [[kim-2026-sink-token-aware-pruning]], [[kim-2025-map-the-flow]]).

## Architettura tipica

Tre moduli (riconoscibili in quasi tutti i source pages del wiki):

1. **Vision encoder** — un [[vision-transformer|ViT]] pre-trained (CLIP, [[siglip|SigLIP / SigLIP-2]], EVA-CLIP, UMT-L, DFN-CLIP). Produce token visivi a partire da patch d'immagine o frame video.
2. **Vision-language merger / projector / Q-Former** — un modulo che proietta i token visivi nello spazio dell'LLM. Tre design ricorrenti: MLP a 2 layer (Qwen2.5-VL, Qwen3-VL, VideoLLaMA 3), [[q-former|Q-Former]] (BLIP-2, VideoChat2), gated cross-attention (Flamingo).
3. **LLM backbone** — un LLM decoder-only (Qwen / Vicuna / Mistral / Llama / GPT). Spesso fine-tuned con LoRA + instruction tuning + DPO/RLHF.

Varianti recenti aggiungono: 2D-RoPE / [[mrope|MRoPE]] / interleaved-MRoPE per posizionamento multidimensionale; window attention nel ViT; DeepStack injection di feature multi-livello dal ViT all'LLM; dynamic resolution / dynamic FPS sampling.

## Famiglie rilevanti per il wiki

- **Qwen-VL**: [[qwen2-5-vl-2025-tech-report|Qwen2.5-VL]] (3B/7B/72B, T-RoPE absolute time, window attn ViT), [[qwen3-vl-2025-tech-report|Qwen3-VL]] (2B/4B/8B/32B dense + 30B-A3B/235B-A22B MoE, interleaved MRoPE, DeepStack, textual timestamp tokens, 256K context).
- **VideoLLaMA**: [[zhang-2025-videollama-3|VideoLLaMA 3]] (2B/7B, AVT + DiffFP, paradigm vision-centric).
- **LLaVA family**: LLaVA-Video, LLaVA-OneVision, LLaVA-NeXT-Video (citati come backbone in [[tang-2025-adaptive-keyframe-sampling]], [[doorenbos-2026-video-panels]], [[kim-2026-sink-token-aware-pruning]]).
- **VideoChat / VideoChat2**: introdotto in [[li-2024-mvbench]], training a 3 stadi su 2M instruction sample da 34 dataset.
- **Closed-source**: GPT-4V, GPT-4o, Gemini 1.5/2.0/2.5 (Flash/Pro), Claude 3.x (Sonnet/Opus), Seed1.5-VL — appaiono come baseline in tutti i benchmark.
- **Captioner-based pipelines**: BLIP-2, LaViLa, EgoVLP, CogAgent — usati in [[zhang-2024-llovi|LLoVi]] come captioner short-term che alimenta un LLM aggregator.

## Sources

- [[qwen2-5-vl-2025-tech-report]] — famiglia Qwen2.5-VL.
- [[qwen3-vl-2025-tech-report]] — famiglia Qwen3-VL.
- [[zhang-2025-videollama-3]] — VideoLLaMA 3.
- [[li-2024-mvbench]] — VideoChat2 + tassonomia MVBench.
- [[zhang-2024-llovi]] — paradigma caption-based (captioner + LLM).
- [[arnab-2025-temporal-chain-of-thought]] — strategie inference-time training-free.
- [[tang-2025-adaptive-keyframe-sampling]] — keyframe selection plug-and-play.
- [[doorenbos-2026-video-panels]] — visual prompting via paneling.
- [[mangalam-2023-egoschema]] — primo benchmark long-form per MLLM.
- [[fu-2025-video-mme]] — benchmark "full-spectrum" per MLLM video.
- [[wang-2025-lvbench]] — benchmark extreme long-video per MLLM.
- [[kim-2025-map-the-flow]] — analisi di information flow nei video MLLM.
- [[kim-2026-sink-token-aware-pruning]] — efficienza inference su video MLLM.
- [[morini-2026-look-twice]] — visual prompting training-free per MLLM image-based.
- [[liu-2026-adaptive-information-flow]] — analisi su MLLM video.
- [[pei-2025-causal-mask-attention]] — analisi causal mask in MLLM.

## Concetti correlati

- [[vision-language-model]] — sub-categoria (tipicamente image-only o image+video MLLM).
- [[video-llm]] — sub-categoria specializzata su video.
- [[vision-transformer]] — encoder dominante.
- [[siglip]] — vision encoder ricorrente.
- [[q-former]] — projector legacy.
- [[mrope]] — positional encoding multimodale.
- [[instruction-tuning]] — fase di training fondamentale.
- [[chain-of-thought]] — paradigma di reasoning.
- [[long-context]] — esigenza chiave per video.
