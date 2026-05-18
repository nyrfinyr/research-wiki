---
title: FlashAttention
type: concept
tags: [attention, gpu, io-aware, kernel-fusion, tiling]
created: 2026-05-15
updated: 2026-05-15
---

# FlashAttention

Algoritmo **IO-aware** ed **esatto** (non approssimato) per calcolare la self-attention dei [[transformer]] su GPU. La tesi centrale è che il collo di bottiglia della self-attention non sono i FLOPs ma i **letti/scritti tra HBM (GPU memory) e SRAM on-chip**: combinando tiling della softmax e recomputation in backward in un singolo kernel CUDA fuso, FlashAttention riduce gli accessi a HBM da `Θ(Nd + N²)` a `Θ(N²·d²/M)` (con `M` = dimensione SRAM), con memoria `O(N)` invece di `O(N²)` [source: raw/papers/dao-2022-flashattention.pdf §1, §3]. È diventato il *de facto* standard per il training di Transformer attuali e per i vision encoder dei VLM.

## Claim chiave / Tecnica

- **Principio IO-aware**: rendere esplicita la gerarchia di memoria GPU (HBM 40-80GB @ 1.5-2.0 TB/s vs SRAM ~192KB/SM @ 19 TB/s) e ottimizzare gli accessi, non i FLOPs. Le operazioni di attention (softmax, dropout, mask) sono memory-bound: arithmetic intensity bassa ⇒ il tempo è dominato dagli accessi a HBM [source: raw/papers/dao-2022-flashattention.pdf §2.1].
- **Tiling della softmax con statistiche online**: per due blocchi `x⁽¹⁾, x⁽²⁾` si mantengono `(m, ℓ)` (max e denominatore), aggiornati con `m(x) = max(m(x⁽¹⁾), m(x⁽²⁾))` e ri-scaling tramite `e^(m_old−m_new)`; ciò permette di calcolare softmax esatta senza materializzare `S = QKᵀ` né `P = softmax(S)` su HBM [source: raw/papers/dao-2022-flashattention.pdf §3.1].
- **Algoritmo forward**: outer loop su blocchi `B_c = ⌈M/(4d)⌉` di `K,V` caricati in SRAM, inner loop su blocchi `B_r = min(B_c, d)` di `Q, O, ℓ, m`; tutto in un **singolo kernel CUDA fuso**, mask e dropout inclusi [source: raw/papers/dao-2022-flashattention.pdf §3.1, Alg. 1].
- **Backward con recomputation**: si salvano solo `O, m, ℓ` (totale `O(N)`); `S, P` sono **ricomputate** in SRAM blocco per blocco. I FLOPs aumentano, ma il backward è comunque più veloce per via dei minori accessi HBM [source: raw/papers/dao-2022-flashattention.pdf §3.1].
- **Lower bound IO**: per `d ≤ M ≤ Nd`, FlashAttention richiede `Θ(N²d²/M)` accessi a HBM contro `Θ(Nd + N²)` di standard attention; **Prop. 3** dimostra che nessun algoritmo esatto può fare `o(N²d²/M)` accessi HBM ⇒ FlashAttention è asintoticamente ottimo [source: raw/papers/dao-2022-flashattention.pdf §3.2, Theorem 2, Prop. 3].
- **Block-sparse estensione**: data una maschera sparse `M̃` con frazione `s` di blocchi non-zero, IO complexity scala a `Θ(Nd + N²d²/M · s)` (2-4× più veloce del denso) [source: raw/papers/dao-2022-flashattention.pdf §3.3].

### Formula chiave: tiling softmax

```
m_new = max(m_i, rowmax(S_ij))
ℓ_new = e^(m_i−m_new)·ℓ_i + e^(rowmax(S_ij)−m_new)·rowsum(P̃_ij)
O_i ← diag(ℓ_new)⁻¹ · (diag(ℓ_i)·e^(m_i−m_new)·O_i + e^(rowmax−m_new)·P̃_ij·V_j)
```

## Risultati end-to-end

- BERT-large: 15% più veloce del record MLPerf 1.1; GPT-2 fino a 3.5× più veloce di HuggingFace, 2× di Megatron-LM; LRA 2.4×; primo Transformer a battere Path-X (seq 16K) e Path-256 (seq 64K, variante block-sparse) [source: raw/papers/dao-2022-flashattention.pdf §4].

## Limiti e tensioni

- **Materializzazione delle attention maps**: FlashAttention deliberatamente non scrive `P` su HBM. Metodi che richiedono ispezione delle attention (e.g. [[evidence-highlighting]] di Morini 2026, [[mechanistic-interpretability]] di Kim 2025, AIF di Liu 2026) sono **incompatibili** con FlashAttention out-of-the-box e introducono overhead memoria significativo [source: raw/papers/morini-2026-look-twice.pdf §sez. limiti].
- Il paper precede l'osservazione formale di [[attention-sink]]: l'interazione fra FlashAttention e quantization basata sul sink token non è discussa [source: raw/papers/gu-2024-attention-sink.pdf §1].

## Concetti correlati

- [[io-complexity]] — paradigma di analisi (Aggarwal-Vitter) usato da Dao per le bound.
- [[scaled-dot-product-attention]] — operazione di base che FlashAttention implementa esattamente.
- [[vision-transformer]] — beneficiario diretto: training su sequenze lunghe diventa pratico.
- [[sliding-window-attention]] — alternativa con costo lineare ma approssimato (non esatto).

## Sources

- [[dao-2022-flashattention]] — introduce l'algoritmo, il principio IO-aware e il lower bound.
- [[qwen2-5-vl-2025-tech-report]] — usa FlashAttention come baseline di confronto per window attention del ViT.
- [[li-2024-mvbench]] — usato per training efficiente di VideoChat2.
- [[pei-2025-causal-mask-attention]] — implementazione concreta delle future-aware mask (FlashAttention-2.6.3).
- [[morini-2026-look-twice]] — discute la tensione fra LoT e FlashAttention (attention maps non materializzate).
- [[gu-2024-attention-sink]] — segnala l'interazione non discussa fra sink e FlashAttention.
- [[dosovitskiy-2021-vit]] — predecessore architetturale, precede la techniche IO-aware.
