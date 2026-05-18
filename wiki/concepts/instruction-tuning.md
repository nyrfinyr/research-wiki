---
title: Instruction Tuning
type: concept
tags: [post-training, sft, llm, alignment]
created: 2026-05-15
updated: 2026-05-15
---

# Instruction Tuning

Stage di post-training in cui un language model pre-addestrato viene fine-tunato su una collezione di **coppie (istruzione, risposta)** generata in modo curato (FLAN, Self-Instruct, Alpaca, ShareGPT-style) o reali (data umane annotate). Genera la differenza fra un "base model" (foundation) e un modello "chat/instruct" capace di seguire istruzioni in formato dialogico. Nel mondo VLM è la spina dorsale del post-training (insieme a DPO/RL): viene applicata sia in versione *text-only* sia, soprattutto, in versione *multimodale* con prompt che includono immagini/video e istruzioni testuali [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.3; raw/papers/zhang-2025-videollama-3.pdf §3.3].

## Claim chiave / Tecnica

- **Formato dei dati**: tipicamente JSONL `{instruction, input, output}` o template ChatML `<|im_start|>user ... <|im_end|><|im_start|>assistant ...`. Qwen2.5-VL usa ChatML come formato unificato per SFT [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.3].
- **Distinta da SFT generica**: tecnicamente l'instruction tuning **è** un'istanza di [[supervised-fine-tuning]], ma con dataset costruito esplicitamente per coprire la distribuzione delle istruzioni utente (dialog, ragionamento, refusal, multi-turn). Quando un report parla di "SFT" si riferisce quasi sempre a instruction tuning in questa configurazione.
- **Qwen2.5-VL post-training in due fasi**: ViT congelato; **SFT su ~2 M esempi (50% text-only, 50% multimodale)**, seguito da rejection sampling per migliorare il [[chain-of-thought]] su task di reasoning, poi [[direct-preference-optimization]] [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.3].
- **Qwen3-VL post-training tri-fase**: SFT su 1.2M campioni (phase 32K poi 256K) → strong-to-weak distillation testuale → RL con SAPO. Le versioni "instruct" e "thinking" divergono nel mix di CoT data durante SFT [source: raw/papers/qwen3-vl-2025-tech-report.pdf §3.3, §5.11].
- **VideoLLaMA-3 four-stage recipe**: dopo i tre stadi di pre-training (vision encoder adaptation, vision-language alignment, multi-task fine-tuning) c'è uno stage finale di **instruction tuning** dedicato al follow-instructions on video [source: raw/papers/zhang-2025-videollama-3.pdf §3.3].

## Varianti / Estensioni

- **Multimodal instruction tuning**: instruction + immagine(i) + risposta. Dataset come LLaVA-Instruct-150K, ShareGPT4V, VideoChat-IT.
- **CoT-augmented SFT**: si pre-genera CoT con un modello forte (es. Qwen3) e si filtra via rejection sampling per qualità — vedi [[chain-of-thought]].
- **Distillation-driven SFT**: il target è la distribuzione di output di un modello "teacher" più grande (strong-to-weak distillation di Qwen3-VL).

## Concetti correlati

- [[supervised-fine-tuning]] — superinsieme tecnico; instruction tuning è l'istanza più comune.
- [[direct-preference-optimization]] — stage successivo che impara da preferenze su top di un modello già instruct-tuned.
- [[chain-of-thought]] — output sviluppato e raffinato durante SFT con rejection sampling.

## Sources

- [[qwen2-5-vl-2025-tech-report]] — SFT su 2M esempi, formato ChatML, mix text/multimodale.
- [[qwen3-vl-2025-tech-report]] — SFT tri-fase con phase 32K/256K, distillation, RL.
- [[zhang-2025-videollama-3]] — quarto stage del training framework dedicato a instruction tuning.
