---
title: Sliding Window Attention (SWA)
type: concept
tags: [attention, efficient-llm, long-context, linear-complexity]
created: 2026-05-15
updated: 2026-05-15
---

# Sliding Window Attention (SWA)

Variante di self-attention in cui **ogni token attende solo ai `ω` token precedenti** (e/o successivi nei modelli encoder), riducendo la complessità da `O(N²)` a `O(N·ω)`. Introdotta da Longformer (Beltagy 2020) per encoder e adottata da Mistral come componente decoder, è una delle famiglie principali di **efficient attention** per long-context [source: raw/papers/fu-2025-sliding-window-attention.pdf §2.1]. Fu et al. (2025) hanno dimostrato che applicare SWA **solo a inference time** su un modello addestrato con full attention genera un drastico training-inference gap, e che la causa profonda è l'[[attention-sink]] propagato dalla varianza del primo token attraverso la normalizzazione softmax.

## Claim chiave / Tecnica

- **Definizione**: ogni token `m` attende a `n ∈ [m−ω+1, m]` ⇒ costo `O(N·ω)` invece di `O(N²)`. I token "evicted" si classificano in **active** (dentro la window corrente), **residual** (fuori window all'embedding ma con informazione propagata via layer superiori), **past** (informazione persa). Range informativo di un token al layer `l`: `1 + (ω−1)·l`. Massimo: `1 + (ω−1)·L` [source: raw/papers/fu-2025-sliding-window-attention.pdf §2.1].
- **Fail-mode at inference**: su LLaMA-2-7B, LLaMA-3.1-8B, Qwen2-7B, Mistral-7B con PG-19, applicare SWA solo in eval fa esplodere la perplexity quando `eval-length > training-length` anche a window fissa (Fig. 2). La heatmap (Fig. 3) mostra che varianza del primo token e attention sink **co-variano fortemente**; il sink è propagato dalla normalizzazione softmax anche in presenza di RoPE [source: raw/papers/fu-2025-sliding-window-attention.pdf §2.2].
- **Information loss della softmax**: l'esponenziale concentra massa sul max e schiaccia gli altri token (es. logits `[1.5, 5.0, 2.4, 0.5, 1.3]` → softmax `[0.03, 0.88, 0.07, 0.01, 0.02]`); SWA aggrava il problema perché la window vede ancora meno token [source: raw/papers/fu-2025-sliding-window-attention.pdf §2.2].
- **SWAT (fix di Fu et al. 2025)**: sostituisce softmax con [[sigmoid-attention]], aggiunge **balanced ALiBi** (metà teste con slope positivo backward-looking, metà negativo forward-looking) e mantiene RoPE per stabilizzare il training [source: raw/papers/fu-2025-sliding-window-attention.pdf §3.2].
- **Massimo di attention distance**: `1 + (ω−1)·L`. Per retrieval esatto di token molto lontani, SWA da sola non basta — servono ibridi o memoria esplicita [source: raw/papers/fu-2025-sliding-window-attention.pdf §7].

### Formula SWAT

```
Attention(Q,K,V)_m = Σ_{n=m−ω+1}^{m} σ((R_{Θ,m} q_m)ᵀ (R_{Θ,n} k_n) / √d_k + s·(m−n)) · v_n
```
con `m−n < ω`, `R` rotazione RoPE e `s = ±2⁻ᵏ` bias ALiBi balanced [source: raw/papers/fu-2025-sliding-window-attention.pdf §3.2, Eq. 5].

## Varianti / Estensioni

- **Window attention nel ViT** (Qwen2.5-VL): 28 layer su 32 usano window 112×112 (8×8 patch da 14×14), full attention solo nei layer {7,15,23,31}; regioni più piccole del window processate senza padding ⇒ supporta [[dynamic-resolution]] mantenendo costo lineare [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.1.1].
- **Shifted window** (Mistral-style): permette di propagare informazione attraverso le finestre tramite shift periodico — Gu et al. mostrano che il sink resta sul primo token assoluto se `t ≤ w`, fuori window non si sviluppa [source: raw/papers/gu-2024-attention-sink.pdf §6].
- **Streaming-LLM** (Xiao 2023): SWA + ancoraggio esplicito dei primi `k` token (sink) per generazione infinita [source: raw/papers/gu-2024-attention-sink.pdf §1, §8].

## Concetti correlati

- [[attention-sink]] — causa del fallimento di SWA-at-inference; ancora di Streaming-LLM.
- [[sigmoid-attention]] — sostituzione di softmax che elimina il sink in SWAT.
- [[streaming-llm]] — applicazione downstream di SWA basata sull'anchoring del sink.
- [[rotary-position-embedding]] — usata insieme a SWA per dare segnale posizionale.
- [[io-complexity]] — SWA è linear in N ma compete con FlashAttention su HBM bandwidth.

## Sources

- [[fu-2025-sliding-window-attention]] — diagnosi del training-inference gap; introduce SWAT.
- [[gu-2024-attention-sink]] — mostra come l'attention sink interagisce con shifted/sliding window.
- [[qwen2-5-vl-2025-tech-report]] — window attention come efficiency primitive nel ViT (non LLM).
