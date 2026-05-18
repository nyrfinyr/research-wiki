---
title: Rotary Position Embedding (RoPE)
type: concept
tags: [positional-encoding, transformer, relative-position]
created: 2026-05-15
updated: 2026-05-15
---

# Rotary Position Embedding (RoPE)

Schema di positional encoding (Su et al. 2021) in cui ad ogni coppia di feature dell'embedding viene applicata una **rotazione 2D** la cui frequenza dipende dalla posizione del token. Il prodotto scalare `q_mᵀ k_n` dopo le rotazioni diventa funzione **solo della differenza `m − n`** ⇒ self-attention diventa intrinsecamente *relative-position-aware*, ma calcolata come operazione locale per-token (compatibile con la formulazione di [[scaled-dot-product-attention]]). RoPE è oggi il default per LLM moderni (LLaMA, Mistral, Qwen) ed è la base architetturale per le sue estensioni multimodali (cfr. [[mrope]]) [source: raw/papers/fu-2025-sliding-window-attention.pdf §3.2; raw/papers/zhang-2025-videollama-3.pdf §3.1].

## Claim chiave / Tecnica

- **Rotazione per coppie di feature**: dato `q ∈ R^d` con `d` pari, si raggruppano le componenti in coppie `(q^(2i), q^(2i+1))` e si applica la matrice di rotazione `R^d_{Θ,m}`:
  ```
  R^d_{Θ,m} = blkdiag(R(mθ_0), R(mθ_1), …, R(mθ_{d/2-1}))
  ```
  con frequenze `θ_i = 10000^(-2i/d)`. La stessa rotazione si applica a `k_n`.
- **Relative encoding via inner product**: `(R_{Θ,m} q_m)ᵀ (R_{Θ,n} k_n) = q_mᵀ R^d_{Θ,n−m} k_n` ⇒ il prodotto scalare dipende solo da `n − m` e dalla "frequenza" `θ_i`. Si ottiene il benefit dell'encoding relativo (Shaw 2018) senza modificare il calcolo dell'attention.
- **Universale rispetto al sink**: Gu et al. mostrano che la position embedding (NoPE, absolute, learnable, relative, ALiBi, **Rotary**) non influisce sull'emergenza dell'[[attention-sink]] — tutti hanno sink (Tab. 3) [source: raw/papers/gu-2024-attention-sink.pdf §7].
- **Compatibile con SWA**: SWAT integra RoPE per dare segnale posizionale esplicito agli hidden state e stabilizzare il training; senza RoPE, sigmoid + balanced ALiBi è instabile (Fig. 5) [source: raw/papers/fu-2025-sliding-window-attention.pdf §3.2].
- **2D-RoPE per ViT**: VideoLLaMA-3 e Qwen2.5-VL usano una "2D-RoPE" che ruota separatamente lungo gli assi *height* e *width* — è una specializzazione di [[mrope]] applicata alle sole dimensioni spaziali [source: raw/papers/zhang-2025-videollama-3.pdf §3.1; raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.1.3].

## Varianti / Estensioni

- **MRoPE chunked** (Qwen2-VL): partiziona le dimensioni dell'embedding in chunk *t/h/w* ciascuno con frequenze rotary distinte ⇒ estende RoPE a video [source: raw/papers/qwen3-vl-2025-tech-report.pdf §2.1].
- **T-RoPE** (Qwen2.5-VL): lega l'ID temporale al tempo assoluto invece che all'indice frame ⇒ temporal grounding al secondo [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.1.3].
- **Interleaved MRoPE** (Qwen3-VL): ridistribuisce t/h/w sulle frequenze in modo *interleaved* per evitare lo spectral bias del chunked MRoPE su long video [source: raw/papers/qwen3-vl-2025-tech-report.pdf §2.1].

## Concetti correlati

- [[mrope]] — generalizzazione di RoPE per dimensioni temporal+spatial nei VLM.
- [[positional-encoding]] — superfamiglia di cui RoPE è il rappresentante dominante.
- [[sliding-window-attention]] — usa RoPE come positional signal interno alla window.
- [[attention-sink]] — non causato né eliminato da RoPE; ortogonale.

## Sources

- [[fu-2025-sliding-window-attention]] — RoPE come segnale posizionale interno a SWAT.
- [[gu-2024-attention-sink]] — mostra che RoPE non influisce sull'emergenza del sink.
- [[zhang-2025-videollama-3]] — usa 2D-RoPE per il ViT image-first.
- [[qwen3-vl-2025-tech-report]] — sviluppa interleaved MRoPE sopra RoPE.
