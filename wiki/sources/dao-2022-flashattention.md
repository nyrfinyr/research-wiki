---
title: "Dao et al. (2022) — FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness"
type: source
tags: [flash-attention, attention, gpu, io-aware, transformer, kernel-fusion, tiling, memory-efficiency, hbm, sram]
created: 2026-05-15
updated: 2026-05-15
source_path: raw/papers/dao-2022-flashattention.pdf
source_kind: paper
source_date: 2022-06-24
doi: 10.48550/arXiv.2205.14135
zotero_key: ABDL6XM2
venue: NeurIPS 2022
authors: [Tri Dao, Daniel Y. Fu, Stefano Ermon, Atri Rudra, Christopher Ré]
year: 2022
---

# Dao et al. (2022) — FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness

## TL;DR

FlashAttention è un algoritmo **IO-aware** ed **esatto** (non approssimato) per calcolare la self-attention dei [[transformer]] su GPU. La tesi centrale: il collo di bottiglia non sono i FLOPs ma i **letti/scritti tra HBM (GPU memory) e SRAM on-chip**. Combinando tiling della softmax e recomputation in backward in un singolo kernel CUDA fuso, FlashAttention riduce gli accessi a HBM da `Θ(Nd + N²)` a `Θ(N²·d²/M)` (dove `M` è la dimensione di SRAM), con memoria `O(N)` invece di `O(N²)`. Risultati end-to-end: BERT-large 15% più veloce del record MLPerf 1.1, GPT-2 fino a 3× più veloce di Megatron/HuggingFace, LRA 2.4×, e il **primo Transformer** a battere il caso a riferimento su Path-X (seq 16K) e — in variante block-sparse — su Path-256 (seq 64K) [source: raw/papers/dao-2022-flashattention.pdf §1, §4].

## Contributo principale

- **Principio IO-aware**: rendere esplicita la gerarchia di memoria GPU (HBM lenta/grande vs SRAM veloce/piccola) e ottimizzare gli accessi, non i FLOPs (§1, §2.1).
- Algoritmo **esatto** che calcola la softmax di blocchi mantenendo statistiche (max `m`, denominatore `ℓ`) per ricostruire il risultato globale ⇒ niente materializzazione della matrice `S = QKᵀ` né di `P = softmax(S)` su HBM (§3.1).
- **Lower bound IO**: `Ω(N²·d²/M⁻¹)` per qualunque algoritmo di attention esatta nell'intervallo `M ∈ [d, Nd]` ⇒ FlashAttention è ottimo a meno di costanti (§3.2, Prop. 3).
- Estensione **block-sparse FlashAttention** che applica lo stesso schema solo ai blocchi non-zero di una maschera ⇒ IO complexity scalata di un fattore `s` (sparsity), 2-4× più veloce di FlashAttention denso (§3.3).

## Metodo

### Gerarchia di memoria GPU (§2.1)

Esempio A100 (Fig. 1): HBM 40-80 GB a 1.5-2.0 TB/s; SRAM on-chip ~192 KB per SM (108 SM) a ~19 TB/s. SRAM è ~10× più veloce e ~10⁵× più piccola. Le operazioni di attention (softmax, dropout, mask) sono **memory-bound**: arithmetic intensity bassa ⇒ il tempo è dominato dagli accessi a HBM.

### Attention standard (Alg. 0, §2.2)

Tre passi che ciascuno scrive/legge `O(N²)` su HBM:
1. `S = QKᵀ` (write `S`).
2. `P = softmax(S)` (read `S`, write `P`).
3. `O = PV` (read `P`).

Su GPT-2 con `N=1024, d=64`: 40.3 GB di HBM R/W per attention vs 66.6 GFLOPs ⇒ il run è dominato dalla memoria.

### Tiling della softmax (§3.1)

La softmax accoppia colonne (richiede il max e la somma su tutta la riga). Si usa la **decomposizione algebrica**: per due blocchi `x⁽¹⁾, x⁽²⁾`,
- `m(x) = max(m(x⁽¹⁾), m(x⁽²⁾))`,
- `f(x⁽ⁱ⁾) = e^(m(x⁽ⁱ⁾) − m(x)) · f(x⁽ⁱ⁾)`,
- `ℓ(x) = e^(m(x⁽¹⁾)−m(x))·ℓ(x⁽¹⁾) + e^(m(x⁽²⁾)−m(x))·ℓ(x⁽²⁾)`.

Mantenendo `(m_i, ℓ_i)` per ogni blocco di righe, si **aggregano i contributi** dei blocchi colonna mano a mano, ricalibrando l'output con `diag(ℓ_new)⁻¹`. Questa aggregazione è chiamata "algebraic aggregation" (§3.1, footnote 2).

### Algoritmo 1 (forward) (§3.1)

- Block sizes `B_c = ⌈M/(4d)⌉`, `B_r = min(B_c, d)`.
- Outer loop su `j = 1..T_c` (blocchi di `K, V` caricati in SRAM).
- Inner loop su `i = 1..T_r` (blocchi di `Q, O, ℓ, m` caricati in SRAM).
- On-chip: `S_ij = Q_i K_jᵀ`, `m̃_ij = rowmax(S_ij)`, `P̃_ij = exp(S_ij − m̃_ij)`, `ℓ̃_ij = rowsum(P̃_ij)`.
- Aggiornamento: `m_new = max(m_i, m̃_ij)`, `ℓ_new = e^(m_i−m_new)·ℓ_i + e^(m̃_ij−m_new)·ℓ̃_ij`.
- Write back `O_i = diag(ℓ_new)⁻¹ (diag(ℓ_i)·e^(m_i−m_new)·O_i + e^(m̃_ij−m_new)·P̃_ij·V_j)`.

Tutto è eseguito in **un singolo kernel CUDA fuso** (kernel fusion), inclusi mask e dropout (Appendix B).

### Backward con recomputation (§3.1)

Invece di salvare `S, P ∈ R^(N×N)` su HBM per il backward, si salvano solo `O` e le statistiche `(m, ℓ)` (totale `O(N)`). Nel backward `S, P` sono **ricomputate** in SRAM blocco per blocco. Questo è una forma di gradient checkpointing selettivo. I FLOPs aumentano, ma il backward è comunque più veloce per via dei minori accessi HBM (§3.1, Fig. 2 left).

### Teorema 1 e 2 — IO complexity (§3.2)

- **Theorem 1**: l'algoritmo restituisce `O = softmax(QKᵀ)V` con `O(N²d)` FLOPs e `O(N)` memoria extra (oltre input/output).
- **Theorem 2**: per `d ≤ M ≤ Nd`, FlashAttention richiede `Θ(N²d²/M)` accessi a HBM contro `Θ(Nd + N²)` di standard attention.

Per `d ∈ {64, 128}` e `M ≈ 100 KB`, `d²/M ≪ 1` ⇒ fino a **9× meno** HBM accessi (Fig. 2). 

- **Proposition 3 (lower bound)**: nessun algoritmo esatto può fare `o(N²d²/M)` accessi HBM per tutti gli `M ∈ [d, Nd]` ⇒ FlashAttention è ottimo asintoticamente.

### Block-sparse FlashAttention (§3.3)

Data una maschera block-sparse `M̃ ∈ {0,1}^(N/B_r × N/B_c)` con frazione `s` di blocchi non-zero, si salta il calcolo dei blocchi zero ⇒ IO complexity `Θ(Nd + N²d²/M · s)` (Prop. 4). Per pattern butterfly `s = O(1/√N)` o `s = O(log N / N)` ⇒ `Θ(N√N)` o `Θ(N log N)`.

## Risultati chiave

### BERT-large (Tab. 1, §4.1)

Training a target 72.0% MLM accuracy su Wikipedia, 8×A100:
- Nvidia MLPerf 1.1: 20.0 ± 1.5 min.
- FlashAttention: **17.4 ± 1.4 min** (15% più veloce).

### GPT-2 su OpenWebText (Tab. 2, §4.1)

8×A100, perplexity identica (no quality regression):

| Modello | Implementazione | Tempo (giorni) | Speedup |
|---|---|---|---|
| GPT-2 small | HuggingFace | 9.5 | 1.0× |
| GPT-2 small | Megatron-LM | 4.7 | 2.0× |
| GPT-2 small | FlashAttention | **2.7** | **3.5×** |
| GPT-2 medium | HuggingFace | 21.0 | 1.0× |
| GPT-2 medium | Megatron-LM | 11.5 | 1.8× |
| GPT-2 medium | FlashAttention | **6.9** | **3.0×** |

### Long-Range Arena (Tab. 3, §4.1)

Speedup 2.4× rispetto allo standard Transformer, mantenendo o migliorando l'accuracy media (59.8 vs 59.3). Block-sparse FlashAttention 2.8× speedup, batte tutte le baseline approssimate (Linformer, Performer, Reformer, Linear Attention, Local, Smyrf).

### Contesti lunghi (Tab. 4-6, §4.2)

- **GPT-2 small a 4K** con FlashAttention è ancora **30% più veloce** di Megatron a 1K, con **0.7 ppl** migliore (17.5 vs 18.2).
- **Long-doc classification** (MIMIC-III, ECtHR): seq 16K vs 512 → +4.3 punti F1 su MIMIC, +8.5 su ECtHR (Tab. 5).
- **Path-X (seq 16K)**: primo Transformer a superare il caso casuale (61.4% accuracy). **Path-256 (seq 64K)**: solo block-sparse FlashAttention ci riesce (63.1%) — Tab. 6.

### Benchmark runtime/memoria (Fig. 3, §4.3)

- Runtime: fino a **3×** più veloce dell'attention PyTorch su seq 128-2K, **fino a 20×** più memory-efficient.
- Memoria: lineare in `N` (vs `N²`). Crossover con approximate attention (Linformer) intorno a `N=512-1024`; block-sparse FlashAttention è più veloce di **qualunque** attention sparsa o approssimata testata, su tutte le lunghezze.

### Effetto block size (Fig. 2 middle)

Crescere `B_c` da 64 a 256 riduce HBM accesses e runtime; oltre 256 il guadagno satura (compute-bound) e il blocco non entra più in SRAM.

## Limitazioni dichiarate dagli autori

- **CUDA hand-written**: ogni nuova variante (mask, dropout, ALiBi, RoPE, ecc.) richiede un nuovo kernel; codice low-level e non sempre portabile tra architetture GPU (§5).
- Implementazione **single-GPU**: l'analisi non copre la comunicazione inter-GPU su multi-node (§5).
- Il bound IO è ottimale **asintotico**, non parametrizzato finemente in `M` ⇒ migliorabile (§3.2, future work).

## Domande aperte / critiche

- Generalizzazione del principio IO-aware ad **altri moduli** (FFN, LayerNorm, conv) è solo accennata (Appendix D, §5).
- Il paper precede FlashAttention-2 (Dao 2023) e FlashAttention-3 (Shah et al. 2024); molte ottimizzazioni rimaste implicite (warp-level scheduling, FP8, async copy) sono lì.
- Comparazione con strategie **multi-query / GQA** assente — il vantaggio relativo dipende dal rapporto `d_kv / d_model`.
- Il design assume softmax classica; non discute interazione con **sigmoid attention** o varianti senza normalizzazione (cfr. [[attention-sink]]).
- Recomputation aumenta i FLOPs ma il paper dichiara solo `O(N²d)` totale; non viene fornito un breakdown FLOPs forward vs backward specifico.

## Concetti citati

[[flash-attention]], [[scaled-dot-product-attention]], [[self-attention]], [[transformer]], [[kernel-fusion]], [[tiling-softmax]], [[gradient-checkpointing]], [[hbm-sram-memory-hierarchy]], [[io-complexity]], [[block-sparse-attention]], [[long-range-arena]], [[path-x-path-256]], [[multi-head-attention]], [[layer-normalization]].

## Citazioni dirette rilevanti

> "We argue that a missing principle is making attention algorithms IO-aware—accounting for reads and writes between levels of GPU memory." (Abstract)

> "Our main goal is to avoid reading and writing the attention matrix to and from HBM. This requires (i) computing the softmax reduction without access to the whole input (ii) not storing the large intermediate attention matrix for the backward pass." (§1)

> "For typical values of d (64-128) and M (around 100KB), d² is many times smaller than M, and thus FlashAttention requires many times fewer HBM accesses than standard implementation." (§3.2)

> "There does not exist an algorithm to compute exact attention with o(N²d²M⁻¹) HBM accesses for all M in the range [d, Nd]." (Proposition 3, §3.2)
