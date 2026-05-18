---
title: Evidence Highlighting
type: concept
tags: [training-free, inference-time, qa, multimodal, attention-as-relevance]
created: 2026-05-15
updated: 2026-05-15
---

# Evidence Highlighting

Pattern di intervento *training-free, inference-time*: il modello viene fatto guardare l'input **due volte** — un primo pass per identificare, tramite le sue stesse attention map, le porzioni di contesto rilevanti per la query, e un secondo pass in cui quelle porzioni vengono **marcate esplicitamente nel prompt** con marker speciali tipo `<start_important>...<end_important>`. L'obiettivo è dirigere l'attenzione del modello senza re-training. Introdotto nel testo da SelfElicit (Liu et al. 2025) per context-based QA / RAG, generalizzato al multimodale da Look Twice (Morini et al. 2026) per KB-VQA su MLLM [source: raw/papers/liu-2025-selfelicit.pdf §1; raw/papers/morini-2026-look-twice.pdf §1].

## Claim chiave / Tecnica

- **Osservazione di base** (SelfElicit): gli **strati profondi** del Transformer assegnano relative attention 4-8× più alta alle frasi di evidenza ground-truth, **indipendentemente** dal fatto che la risposta finale sia corretta (Fig. 2 di SelfElicit). Il modello "sa" già dove sta l'evidenza, ma non sempre la usa nella generazione [source: raw/papers/liu-2025-selfelicit.pdf §3.1].
- **Pipeline SelfElicit (text-only)**: (1) genera **un solo token**, (2) calcola attention dell'ultimo prompt token verso le frasi del contesto, (3) media su `L_ER` = layers nella **seconda metà** del decoder, (4) seleziona `S_SE = {s_i : e_i ≥ α · max(e)}` con `α=0.5`, (5) ri-prompt con `<start_important>...<end_important>` sulle frasi selezionate, (6) genera la risposta finale. Overhead ~3-5% del baseline. Risultati: **+5.0-11.7% EM/F1** medi su HotpotQA/NewsQA/TriviaQA/NQ × Llama-3.1/Mistral/Qwen2.5 [source: raw/papers/liu-2025-selfelicit.pdf §3.2, Tab. 1].
- **Pipeline LoT (Morini 2026, multimodale)**: aggiunge il visual side a SelfElicit. Estrae visual evidence via **object-to-visual submatrix** delle attention `A^(ℓ,k)[T_obj, V]`, aggrega su `L_vis` (intermediate layers) e tutte le K teste; applica **multi-layer attention sink filtering** sui token visivi (filtra le `D_sink` dimensioni del BOS) prima di calcolare un bounding box pesato. Marker `<START_IMPORTANT_TXT>` (testo) e `<START_IMPORTANT_IMG>` (bounding box) [source: raw/papers/morini-2026-look-twice.pdf §3.2, Eq. 1-6].
- **Risultati LoT**: +1.1 a +5.3 punti medi su E-VQA/InfoSeek/OVEN/ViQuAE × 10 MLLM (Qwen2-VL, Qwen2.5-VL, Qwen3-VL, InternVL3.5 da 2B a 38B). Visual e textual highlighting sono **complementari** (Tab. 2) [source: raw/papers/morini-2026-look-twice.pdf §4.3].
- **Layer choice è essenziale**: in SelfElicit, AUROC sui ground-truth evidence è 91.55 a 50-100% dei layer vs 70.38 a 0-50% — la seconda metà del decoder è "evidence-aware" [source: raw/papers/liu-2025-selfelicit.pdf §3.1, Tab. 4].
- **Compatibilità con [[chain-of-thought]]**: SelfElicit batte CoT di +5-11pp su HotpotQA con overhead 800-900% inferiore al **Prompt-Elicit** (variante generativa) [source: raw/papers/liu-2025-selfelicit.pdf §1, §4.2].

## Varianti / Estensioni

- **Text-only** (SelfElicit): markers attorno alle frasi nel contesto recuperato.
- **Multimodale** (LoT): marker testuali + bounding box visivo. Filtering del [[visual-attention-sink]] tramite `D_sink` channels.
- **Last-to-context vs object-to-visual**: SelfElicit usa l'**ultimo token** come query di attention; LoT usa i **target object tokens** (estratti via dependency parsing con spaCy) per la query visuale.

## Concetti correlati

- [[attention-sink]] — LoT filtra esplicitamente i sink token visivi prima dell'highlighting.
- [[visual-attention-sink]] — versione visiva del sink, necessaria per filtering robusto.
- [[mechanistic-interpretability]] — l'approccio "attention come segnale di relevance" è una primitiva mecc.
- [[chain-of-thought]] — alternativa che SelfElicit batte con overhead minore.
- [[causal-mask-modulation]] — diversa, modula la mask invece dei marker prompt.
- [[flash-attention]] — tensione: l'estrazione esplicita di `A^(ℓ,k)` non è compatibile con FlashAttention out-of-the-box.

## Sources

- [[liu-2025-selfelicit]] — introduce evidence highlighting in regime text-only / RAG.
- [[morini-2026-look-twice]] — generalizza al multimodale (LoT) con visual + text marker e sink filtering.
