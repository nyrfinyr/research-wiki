---
title: Supervised Fine-Tuning (SFT)
type: concept
tags: [post-training, training, llm, alignment]
created: 2026-05-15
updated: 2026-05-15
---

# Supervised Fine-Tuning (SFT)

Stage di post-training in cui un modello pre-addestrato viene addestrato sul **next-token loss standard** (cross-entropy) su una collezione di coppie `(input, target)` curate, con il target che tipicamente include CoT, formati strutturati (JSON, ChatML), risposte multimodali. È lo stage che trasforma un "foundation model" in un modello allineato a un protocollo di output. Distinto da [[direct-preference-optimization]] (che apprende da preference pair) e da RL (che richiede reward signal), SFT è il primo stage di post-training nella maggioranza delle ricette VLM moderne [source: raw/papers/qwen3-vl-2025-tech-report.pdf §3.3; raw/papers/zhang-2025-videollama-3.pdf §3.3].

## Claim chiave / Tecnica

- **Loss**: standard next-token cross-entropy `L = − Σ_t log p(y_t | y_<t, x)`. Nessun reward, nessun preference signal — solo "imitazione" del target.
- **Qwen3-VL SFT**: 1.2M campioni curati con due fasi di context length — prima 32K, poi 256K per gestire long-document e long-video. Bifurcazione fra versione "instruct" (CoT moderato) e "thinking" (CoT esteso fino a 81 920 token su task come AIME-25, HMMT-25, LiveCodeBench) [source: raw/papers/qwen3-vl-2025-tech-report.pdf §3.3, §5.11].
- **VideoLLaMA-3 SFT come quarto stage**: dopo (i) vision encoder adaptation, (ii) vision-language alignment, (iii) multi-task fine-tuning, il quarto stage è dedicato a SFT su video instruction data per follow-instructions specializzate [source: raw/papers/zhang-2025-videollama-3.pdf §3.3].
- **Square-root reweighting** (Qwen3-VL): per-token loss normalizzata da `sqrt` invece di per-sample; bilancia testo e multimodale senza catastrophic forgetting [source: raw/papers/qwen3-vl-2025-tech-report.pdf abstract, §1]. Ablation isolate **non riportate** nel paper.
- **Distinta da [[instruction-tuning]] solo per perimetro**: l'instruction tuning è la specializzazione di SFT con dataset *formato istruzione*; ogni instruction tuning è un SFT, non viceversa (SFT può essere su domain adaptation, dialog completion, ecc.).
- **Strong-to-weak distillation testuale** (Qwen3-VL): forma di SFT con target da un teacher più grande — il modello apprende la distribuzione di output del teacher invece dei label hard [source: raw/papers/qwen3-vl-2025-tech-report.pdf §3.3].

## Varianti / Estensioni

- **CoT-augmented SFT**: target arricchiti con catene di reasoning, filtrati via rejection sampling (Qwen2.5-VL).
- **Multi-stage SFT** (Qwen3-VL): SFT in due fasi consecutive a context length crescente.
- **Multimodal SFT**: input contiene immagini/video, target è testo (caption, answer, JSON con bbox).
- **Distillation-based SFT**: target prodotto da modello teacher invece che da annotatori umani.

## Concetti correlati

- [[instruction-tuning]] — specializzazione di SFT con dataset formato istruzione.
- [[direct-preference-optimization]] — stage successivo nel pipeline tipico (SFT → DPO/RL).
- [[chain-of-thought]] — spesso parte integrante del target di SFT moderno.
- [[mixture-of-experts]] — SFT applicata identicamente a varianti dense e MoE in Qwen3-VL.

## Sources

- [[qwen3-vl-2025-tech-report]] — SFT come primo stage del post-training, due context length, bifurcazione instruct/thinking.
- [[zhang-2025-videollama-3]] — SFT come quarto stage finale della pipeline.
