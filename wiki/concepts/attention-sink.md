---
title: Attention Sink
type: concept
tags: [attention, transformer, interpretability, softmax, kv-cache]
created: 2026-05-15
updated: 2026-05-15
---

# Attention Sink

Fenomeno empirico per cui i language model auto-regressivi assegnano una porzione **sproporzionatamente grande** dei pesi di attenzione al **primo token** della sequenza, indipendentemente dal suo contenuto semantico. Il primo token funziona come "key bias" globale che assorbe attenzione che il modello altrimenti dovrebbe distribuire altrove [source: raw/papers/gu-2024-attention-sink.pdf §1, §3]. Definito formalmente e studiato sistematicamente da [[gu-2024-attention-sink]], il sink è poi diventato un'osservazione di riferimento per spiegare il fallimento dello [[sliding-window-attention]] a inference-only, la modulazione della [[causal-attention-mask]] e i metodi di [[visual-token-pruning]] nei MLLM.

## Claim chiave / Tecnica

- **Definizione formale** (metrica di emergenza): `Sink^ε_k = (1/L)·Σ_l (1/H)·Σ_h I(α^(l,h)_k > ε)` con `ε = 0.3, T = 64` come default; misura la frazione di (layer, head) in cui il token in posizione `k` riceve attenzione `> ε` [source: raw/papers/gu-2024-attention-sink.pdf §3.2].
- **Decomposizione causale**: `q_t k_1ᵀ = ‖q_t‖·‖k_1‖·cos(q_t, k_1)`. Il primo token ha `‖k_1‖` *piccola* ma `cos(q_t, k_1)` molto grande — è l'**angolo** (cioè la posizione su una manifold separata) a generare il sink, non la norma della key [source: raw/papers/gu-2024-attention-sink.pdf §3.1, Fig. 2].
- **Universale e su scala**: emerge in modelli da 14M (Pythia) a 70B (LLaMA-3) — LLaMA-3-8B Base raggiunge `Sink^ε_1 = 99.02%` su sequenze naturali [source: raw/papers/gu-2024-attention-sink.pdf Tab. 1].
- **Emerge durante il pre-training** dopo 1k-2k step di ottimizzazione efficace; weight decay e quantità di dati lo rafforzano (γ=0.5 → `Sink^ε_1 ≈ 41%`); learning rate troppo basso o data <500M token lo sopprimono [source: raw/papers/gu-2024-attention-sink.pdf §4, §5].
- **La posizione è mobile**: con prefix-LM (loss su token > p>1) il sink si distribuisce sui token di prefisso; fissando un token `x_fix` in posizione 2-3 il sink **si sposta** lì; con shifted window attention resta sul primo token assoluto se `t ≤ w` [source: raw/papers/gu-2024-attention-sink.pdf §5, §6].
- **Indipendente dalla positional encoding**: NoPE, absolute, learnable, relative, ALiBi e Rotary mostrano tutti il sink (Tab. 3) — non è un artefatto di RoPE [source: raw/papers/gu-2024-attention-sink.pdf §7].
- **Eliminabile con [[sigmoid-attention]] senza normalizzazione**: `Sink^ε_1 ≈ 0.44%` a parità di validation loss fino a 1B parametri; mantenere la normalizzazione (sigmoid normalizzata) lo fa ricomparire [source: raw/papers/gu-2024-attention-sink.pdf §7.3-7.4, Tab. 6].
- **Massive activations**: in pre-norm, da `l=2` in poi `‖h^l_1‖` è molto maggiore della media degli altri token mentre `‖k^l_1‖` e `‖v^l_1‖` sono **più piccole** — il primo token funge da *dump* di attention extra [source: raw/papers/gu-2024-attention-sink.pdf §3.1].

## Varianti / Estensioni

- **Sink come meccanismo "future-aware"** nei VLM: Pei et al. interpretano il sink come token che può **assorbire informazione futura** senza violare l'autoregression, basandoci una famiglia di compressioni 1D pool delle attention future merge nel sink durante il prefill [source: raw/papers/pei-2025-causal-mask-attention.pdf §4].
- **Sink token visivi** nei MLLM ([[visual-attention-sink]]): patch di sfondo spazialmente persistenti con attenzione alta e semantica quasi nulla — Kim et al. mostrano che dominano il budget dei metodi di [[visual-token-pruning]] e degradano la fine-grained understanding [source: raw/papers/kim-2026-sink-token-aware-pruning.pdf §3.2-3.3]. Morini et al. usano un "multi-layer attention sink filtering" sui token visivi prima dell'evidence highlighting (filtraggio sulle `D_sink` dimensioni del BOS) [source: raw/papers/morini-2026-look-twice.pdf §3.2].
- **SWA failure mode**: Fu et al. mostrano che l'attention sink propagato dalla varianza del primo token tramite la normalizzazione softmax è la causa principale del crollo di perplexity dello [[sliding-window-attention]] applicato solo a inference-time [source: raw/papers/fu-2025-sliding-window-attention.pdf §2.2, Fig. 3].
- **Applicazioni downstream**: il sink è anchor di [[streaming-llm]] (Xiao 2023) e di metodi di [[kv-cache]] eviction/quantization che già lo usavano empiricamente prima della formalizzazione di Gu [source: raw/papers/gu-2024-attention-sink.pdf §1, §8].

## Concetti correlati

- [[sigmoid-attention]] — rimedio architetturale che impedisce l'emergenza del sink.
- [[sliding-window-attention]] — il sink è la causa del training-inference gap di SWA.
- [[streaming-llm]] — sfrutta il sink come anchor per generazione infinita.
- [[kv-cache]] — il sink token è anchor obbligatorio per eviction/quantization.
- [[causal-mask-modulation]] — Pei et al. usano il sink come buffer per assorbire info future.
- [[visual-attention-sink]] — estensione del fenomeno ai token visivi nei MLLM.
- [[mechanistic-interpretability]] — il sink è uno dei "circuit primitives" più studiati.

## Sources

- [[gu-2024-attention-sink]] — definisce il fenomeno, fornisce la metrica `Sink^ε_k`, dimostra l'emergenza durante il pre-training e propone sigmoid-attention come fix.
- [[fu-2025-sliding-window-attention]] — usa l'analisi del sink per giustificare SWAT (sigmoid + balanced ALiBi).
- [[pei-2025-causal-mask-attention]] — reinterpreta il sink come buffer per assorbire informazione futura in regime training-free.
- [[kim-2026-sink-token-aware-pruning]] — estende il concetto ai token visivi (sink-token nel video encoder) e introduce STSP/STTP.
- [[morini-2026-look-twice]] — applica filtering del sink nelle attention map dei MLLM per identificare visual evidence.
- [[kim-2025-map-the-flow]] — discute il "static bias" come possibile manifestazione mecc. del sink nei Video LLM.
- [[dosovitskiy-2021-vit]] — predecessore del fenomeno: il `[class]` token funge da analogo embrionale.
