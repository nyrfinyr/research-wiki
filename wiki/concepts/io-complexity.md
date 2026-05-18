---
title: IO Complexity
type: concept
tags: [hardware, gpu, memory-hierarchy, complexity-analysis]
created: 2026-05-15
updated: 2026-05-15
---

# IO Complexity

Paradigma di analisi algoritmica (Aggarwal-Vitter 1988) che conta i **memory transfers** fra due livelli della gerarchia di memoria — tipicamente *fast small* (cache/SRAM) e *slow large* (DRAM/HBM) — invece di contare i FLOPs. Per la self-attention dei [[transformer]] su GPU, Dao et al. (2022) hanno mostrato che il bottleneck non sono i FLOPs ma gli accessi a HBM, e hanno usato l'analisi IO per dimostrare che [[flash-attention]] è asintoticamente ottimo: nessun algoritmo esatto può fare `o(N²d²/M)` accessi HBM per `M ∈ [d, Nd]` [source: raw/papers/dao-2022-flashattention.pdf §3.2, Theorem 2, Prop. 3].

## Claim chiave / Tecnica

- **Setup**: si modella una gerarchia con SRAM rapida ma piccola (`M` parole) e HBM grande ma lenta. Il costo dell'algoritmo è il numero di word-transfer fra i due livelli; FLOPs eseguiti in SRAM sono "free" per il conteggio IO.
- **Esempio GPU A100** (Fig. 1 di Dao): HBM 40-80 GB a 1.5-2.0 TB/s; SRAM on-chip ~192 KB per SM (108 SM) a ~19 TB/s ⇒ SRAM è ~10× più veloce e ~10⁵× più piccola. Le operazioni di attention (softmax, dropout, mask) sono **memory-bound**: arithmetic intensity bassa ⇒ il tempo è dominato dagli accessi a HBM [source: raw/papers/dao-2022-flashattention.pdf §2.1].
- **Standard attention IO**: tre passi che ciascuno scrive/legge `O(N²)` su HBM (scrivi `S = QKᵀ`, leggi `S`/scrivi `P = softmax(S)`, leggi `P`/calcola `O = PV`). Totale `Θ(Nd + N²)` HBM accesses. GPT-2 con `N=1024, d=64`: 40.3 GB HBM R/W per 66.6 GFLOPs ⇒ memory-bound [source: raw/papers/dao-2022-flashattention.pdf §2.2].
- **FlashAttention IO** (Theorem 2): per `d ≤ M ≤ Nd`, FlashAttention richiede `Θ(N²d²/M)` accessi HBM. Per `d ∈ {64, 128}` e `M ≈ 100 KB`, `d²/M ≪ 1` ⇒ fino a **9× meno** HBM accesses [source: raw/papers/dao-2022-flashattention.pdf §3.2, Fig. 2].
- **Lower bound** (Prop. 3): nessun algoritmo esatto di attention può fare `o(N²d²/M)` accessi HBM per tutti gli `M` nell'intervallo ⇒ FlashAttention è ottimo a meno di costanti.
- **Block-sparse**: data sparsity `s`, IO scende a `Θ(Nd + N²d²/M · s)`. Per pattern butterfly `s = O(1/√N)` ⇒ `Θ(N√N)` [source: raw/papers/dao-2022-flashattention.pdf §3.3, Prop. 4].

### Confronto IO complexity

| Algoritmo | HBM accesses | Memoria extra |
|---|---|---|
| Standard attention | `Θ(Nd + N²)` | `O(N²)` |
| **FlashAttention** | **`Θ(N²d²/M)`** | **`O(N)`** |
| Block-sparse FA (sparsity `s`) | `Θ(Nd + N²d²·s/M)` | `O(N)` |
| Lower bound (qualunque esatto) | `Ω(N²d²/M)` | — |

[source: raw/papers/dao-2022-flashattention.pdf §3.2-3.3]

## Concetti correlati

- [[flash-attention]] — implementazione che raggiunge il lower bound IO.
- [[scaled-dot-product-attention]] — operazione su cui si applica l'analisi IO.
- [[sliding-window-attention]] — alternativa ad approccio IO-aware (riduce `N` invece di `M`).

## Sources

- [[dao-2022-flashattention]] — applica IO complexity all'attention; dimostra lower bound `Ω(N²d²/M)`.
