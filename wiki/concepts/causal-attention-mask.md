---
title: Causal Attention Mask
type: concept
tags: [attention, decoder, autoregressive, transformer]
created: 2026-05-15
updated: 2026-05-15
---

# Causal Attention Mask

Maschera **triangolare inferiore** applicata ai logit di attention nei [[transformer]] decoder-only: per la query in posizione `i`, le posizioni `j > i` sono settate a `−∞` prima della softmax, in modo che il token corrente non possa attendere al "futuro". Definizione canonica: `M^c_{i,j} = 0` se `j ≤ i`, `−∞` altrimenti [source: raw/papers/pei-2025-causal-mask-attention.pdf §2.1]. Origine in Vaswani et al. (2017) come ingrediente del decoder del Transformer. È diventata l'oggetto di una piccola famiglia di interventi *training-free* nei VLM — la causal mask ereditata dagli LLM è sub-ottimale per i visual token, e modulazioni selettive di `M` migliorano grounding, OCR e hallucination ([[causal-mask-modulation]]).

## Claim chiave / Tecnica

- **Necessità autoregressiva**: la causal mask permette di addestrare in parallelo su `N` posizioni mantenendo la proprietà che `p(x_t | x_<t)` non veda `x_{t+1..T}`; senza di essa, il decoder collasserebbe al test time perché vedrebbe il token target [source: vaswani-2017].
- **Sub-ottimale sui visual token**: Pei et al. mostrano che i visual token non hanno un ordine sequenziale intrinseco; bloccare il futuro fra visual token impedisce di aggregare informazioni utili. Rompere il masking *fra* visual token può **migliorare** anche su modelli allenati causalmente (Fig. 1, ALFRED) [source: raw/papers/pei-2025-causal-mask-attention.pdf §1, Fig. 1].
- **Tre relax future-aware** (definizioni 3.1-3.3 di Pei):
  - `M^f` (Full): tutta la triangolare superiore visibile per query visive.
  - `M^{v2v}`: visual query attende a visual futuri ma NON a text futuri.
  - `M^{v2t}`: visual query attende a text futuri ma NON a visual futuri.
  Effetti task-dipendenti: temporal multi-image ↑ con `M^f / M^{v2v}`; text-rich VQA ↑ con `M^{v2t}`; text-dominanti **degradano** [source: raw/papers/pei-2025-causal-mask-attention.pdf §3.1-3.3].
- **Modulazione entropy-based** (Liu et al. 2026): si calcola un'entropia delle "token dynamics" `D_{v_i} = {d^l_{v_i}}_l` con `d^l_{v_i} = max_j a^l_{i,j}`. Token a entropia alta vengono **mascherati nell'interazione visual→text** (image-to-text attention bloccata), ma vision-to-vision aggregation è preservata. Costo: 1 extra decoding step [source: raw/papers/liu-2026-adaptive-information-flow.pdf §4.1-4.3].
- **Strumento per mechanistic interpretability** (Kim et al. 2025): la **Attention Knockout** è un'estensione mirata della causal mask: per disabilitare il flusso da `s` verso `t` al layer `l` si setta `M^l[s,t] = −∞`. Window `k=9` per evitare che residual connection bypassino l'intervento. Permette di tracciare *causalmente* il path dell'informazione nei Video LLM [source: raw/papers/kim-2025-map-the-flow.pdf §2.2].

## Varianti / Estensioni

- **Future-aware mask family** (Pei 2025): vedi `M^f`, `M^{v2v}`, `M^{v2t}`. La famiglia "Light" comprime via 1D max-pool dell'attention futura in un summary score, merge nei primi token (sink) durante il prefill ⇒ overhead trascurabile a decoding [source: raw/papers/pei-2025-causal-mask-attention.pdf §4, Eq. 11-14].
- **Adaptive Information Flow** (Liu 2026): modula la mask solo per i visual token con alta entropia delle token dynamics; AIF batte sia ViCrop training-free sia CCA training-based su V*/RealWorldQA/POPE [source: raw/papers/liu-2026-adaptive-information-flow.pdf §5.2].
- **Attention Knockout** (Geva 2023, applicata da Kim 2025): non rilascia la causal mask, la **rafforza** localmente per probing.

## Concetti correlati

- [[causal-mask-modulation]] — famiglia di interventi training-free su `M`.
- [[scaled-dot-product-attention]] — operazione su cui `M` agisce additivamente.
- [[attention-sink]] — Pei interpreta il sink come buffer per assorbire info future autorizzate dal relax.
- [[mechanistic-interpretability]] — Attention Knockout è una modulazione di `M` a scopo di probing.

## Sources

- [[pei-2025-causal-mask-attention]] — introduce le tre future-aware mask e la versione Light.
- [[liu-2026-adaptive-information-flow]] — propone AIF, modulazione entropy-based di `M`.
- [[kim-2025-map-the-flow]] — usa Attention Knockout (mask additiva mirata) per probing.
