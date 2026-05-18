---
title: "Fu et al. (2025) — SWAT: Sliding Window Attention Training for Efficient Large Language Models"
type: source
tags: [sliding-window-attention, sigmoid-attention, alibi, rope, attention-sink, long-context, linear-complexity, efficient-llms, swat, training-inference-gap]
created: 2026-05-15
updated: 2026-05-15
source_path: raw/papers/fu-2025-sliding-window-attention.pdf
source_kind: paper
source_date: 2025-06-04
doi: 10.48550/arXiv.2502.18845
zotero_key: SKQEGEC2
venue: arXiv preprint (v2 2025)
authors: [Zichuan Fu, Wentao Song, Yejing Wang, Xian Wu, Yefeng Zheng, Yingying Zhang, Derong Xu, Xuetao Wei, Tong Xu, Xiangyu Zhao]
year: 2025
---

# Fu et al. (2025) — SWAT: Sliding Window Attention Training for Efficient Large Language Models

## TL;DR

SWAT propone un layer di attention progettato esplicitamente per essere **addestrato** con sliding window (non solo applicato come fix al momento dell'inferenza). La ricetta sostituisce softmax con **sigmoid** (per prevenire l'attention sink causato dalla varianza della normalizzazione softmax e per evitare la sparsificazione aggressiva che cancella informazione storica), aggiunge una **balanced ALiBi** bidirezionale per dare bias posizionali dentro la finestra, e integra **RoPE** per stabilità di training. Il risultato è un modello con complessità inferenziale lineare `O(N·ω)` che batte sia Transformer++ sia tutte le architetture ricorrenti moderne (RetNet, Mamba/Mamba-2, GLA, DeltaNet, TTT, Gated DeltaNet, Titans) sulla media di 8 benchmark di common-sense reasoning, a 340M e 760M parametri [source: raw/papers/fu-2025-sliding-window-attention.pdf §1, §4.2, Tab. 1].

## Contributo principale

- Analisi empirica del **training-inference gap** dello sliding window attention: applicare SWA solo a inference time degrada (Fig. 2: perplexity esplode quando eval-length > training-length anche se la window è fissata) [source: raw/papers/fu-2025-sliding-window-attention.pdf §2.2].
- Diagnosi: due cause principali — (1) **attention sink** (Gu et al. 2024, [[attention-sink]]) propagato dalla varianza del primo token tramite normalizzazione softmax (Fig. 3); (2) **information loss** della softmax: l'esponenziale concentra massa sul max e schiaccia gli altri token (esempio: logits `[1.5, 5.0, 2.4, 0.5, 1.3]` → softmax `[0.03, 0.88, 0.07, 0.01, 0.02]`) [source: raw/papers/fu-2025-sliding-window-attention.pdf §2.2].
- Architettura **SWAT** = `sigmoid(QKᵀ/√d + s·(m−n)) · V` con `m−n < ω`, integrata con RoPE; "balanced ALiBi" assegna metà delle teste slope positivo (backward-looking, conserva storia) e metà negativo (forward-looking, recente) [source: raw/papers/fu-2025-sliding-window-attention.pdf §3.2].

## Metodo

### Sliding Window Attention (§2.1)

Ogni token attende solo i `ω` precedenti ⇒ costo `O(N·ω)` (vs `O(N²)`). Tokens "evicted" sono classificati in (Fig. 1):
- **active** (dentro la window corrente),
- **residual** (fuori window all'embedding ma con informazione propagata attraverso layer superiori),
- **past** (informazione persa).

Range informativo di un token al layer `l`: `1 + (ω−1)·l`. Massimo: `1 + (ω−1)·L`.

### Perché SWA-at-inference fallisce (§2.2)

- Su LLaMA-2-7B, LLaMA-3.1-8B, Qwen2-7B, Mistral-7B con PG-19 (Fig. 2): perplexity ottimale solo quando `eval-length = train-length`; quando l'eval supera il train, PPL cresce anche con window costante.
- Heatmap (Fig. 3): la **varianza del primo token** (sopra) e l'**attention sink** (sotto) co-variano fortemente. Anche con RoPE, l'informazione di posizione assoluta viene riassorbita attraverso la varianza del normalizer softmax (Chi et al. 2023).
- Conclusione: bisogna **trainare** con SWA per chiudere il gap.

### SWAT layer (§3.2)

1. Sostituire softmax con **sigmoid**:
   `Attention(Q,K,V) = σ(QKᵀ/√d) V`.
   Vantaggi: attention dense (token non si sopprimono a vicenda), niente normalizzazione ⇒ niente attention sink propagato via softmax-variance.
2. **Balanced ALiBi**: bias `s·(m−n)` aggiunto ai logit; per le `h/2` teste "forward" `s_k = −2⁻ᵏ`, per le altre `h/2` "backward" `s_k = 2⁻ᵏ`. Il segno positivo permette di privilegiare token *più lontani* nella finestra ⇒ conservare storia (Eq. 4). 
3. **RoPE** mantenuto per dare segnale posizionale esplicito agli hidden states e stabilizzare il training (sigmoid + balanced ALiBi soli sono instabili — Fig. 5).

Formula finale (Eq. 5):
```
Attention(Q,K,V)_m = Σ_{n=m−ω+1}^{m} σ((R^d_{Θ,m} q_m)ᵀ (R^d_{Θ,n} k_n) / √d_k + s·(m−n)) · v_n
```

### Inferenza (§3.3)

Costo `O(N·ω·(1+δ_ALiBi))` con `δ_ALiBi ≪ 1`. Comparabile per token al Transformer denso, ma globalmente lineare in `N`.

### Training (§4.1)

- Dataset: FineWeb-Edu 100BT (high-quality educational).
- Modelli: 340M (15B token), 760M (30B token).
- Vocab Llama-2, seq 4096, batch 0.5M token.

## Risultati chiave

### Common-sense reasoning (Tab. 1, §4.2)

Media di 8 task (Wiki/LMB ppl, PIQA, Hellaswag, Wino, ARC-e/c, SIQA, BoolQ acc):

**340M / 15B tokens** (top-3):
| Modello | Avg |
|---|---|
| **SWAT (-)** (forward-looking) | **46.88** |
| SWAT (-+) (balanced) | 45.85 |
| Titans | 46.17 |
| Gated DeltaNet | 45.42 |
| Transformer++ | 42.92 |

**760M / 30B tokens**:
| Modello | Avg |
|---|---|
| **SWAT (-)** | **51.85** |
| Titans | 51.56 |
| Gated DeltaNet | 49.69 |
| Transformer++ | 48.69 |
| Mamba | 47.22 |

SWAT (-+) bilanciato eccelle su **BoolQ** (62.11%, miglior risultato): conferma che le teste backward-looking sono cruciali quando il contesto storico è discriminante.

### SWA training vs vanilla (Tab. 2, §4.3)

Llama2-style su OpenWebText, PG-19, OpenOrca, sequenze di eval fino a 16,384:
- **Vanilla 128/128** crolla a 4.84 PPL su OpenWebText a 16K eval.
- **Sliding-Window 128 (train=1024)** raggiunge 3.00 a 16K — **stabile** al crescere dell'eval-length.
- Vanilla 1024 con eval > training-length aumenta in PPL (3.06 → 3.55 a 16K se eval-window > train-window).

Takeaway: il training con SWA forza la rete a **comprimere informazione storica** nei residual token; il Vanilla, che vede tutto, non sviluppa questa capacità e si rompe fuori distribuzione.

### Ablation (Tab. 3, §4.4)

11 configurazioni testate su seq di eval. Sintesi:
- Sigmoid puro su Vanilla 128/128 fallisce (PPL 14.26 vs 5.51 softmax): senza positional bias l'informazione si sovrappone (No.2).
- Sigmoid + balanced ALiBi (No.6, 6:6) recupera ma è instabile a lungo (Fig. 5).
- Sigmoid + **AliRope-6:6** (No.8) ottiene loss medio più basso (2.51) e training **stabile** (Fig. 5).
- Estendere training length 1024→2048 a parità di window non aiuta (No.7).
- Aumentare il training window a 1024 (No.9) mantiene il vantaggio.

## Limitazioni dichiarate dagli autori

- **Sensibilità agli iperparametri**: window size, depth, distribuzione delle slope ALiBi richiedono ricerca dedicata (§7).
- A modelli grandi (oltre il loro 760M) potrebbero esserci **diminishing returns**: con più parametri il modello memorizza più dati di training ⇒ meno bisogno di "informazione trasmessa" via residual token ⇒ il meccanismo SWA può degradare. Lasciato a future work con caching tra step (§7).
- **Maximum attention distance** intrinsecamente limitata a `1 + (ω−1)·L`: per task che richiedono retrieval esatto di token molto lontani, SWAT non basta — servono ibridi o memoria esplicita (§7).

## Domande aperte / critiche

- Confronto **a parità di compute** con FlashAttention-style training non riportato (lo speedup wall-clock di SWAT vs Transformer++ con FlashAttention2 sul medesimo hardware è desiderabile).
- Nessun test su lunghi contesti `>16K` né su retrieval (needle-in-a-haystack): l'affermazione "compress arbitrarily long texts" è motivazionale, non quantificata oltre 16K.
- Scaling oltre 760M: la stessa architettura regge a 7B? Mistral usa SWA solo a inference, non in training.
- L'effetto della **balanced ALiBi** è plausibile ma è una euristica: manca una giustificazione formale di perché slope positivo conservi *meglio* di slope negativo.
- Generalizzazione a **multimodal / non-causal**: SWAT è progettato per decoder-only; encoder o cross-attention non discussi.
- Connessione con `Sink^ε` di [[gu-2024-attention-sink]]: non viene misurata direttamente per SWAT, ma è coerente con la previsione (sigmoid + no normalizzazione → niente sink).

## Concetti citati

[[sliding-window-attention]], [[sigmoid-attention]], [[alibi]], [[rotary-position-embedding]], [[attention-sink]], [[long-context]], [[linear-complexity]], [[transformer]], [[self-attention]], [[scaled-dot-product-attention]], [[longformer]], [[mamba]], [[state-space-models]], [[retnet]], [[gated-linear-attention]], [[deltanet]], [[titans]], [[fineweb-edu]], [[pg-19]], [[piqa]], [[hellaswag]], [[boolq]].

## Citazioni dirette rilevanti

> "Current researches on SWA predominantly focus on solving the attention sink problem within the inference phase ... However, they leave the training process unchanged, thereby creating a gap between inference and training." (§1)

> "Removing normalization from the attention mechanism can effectively eliminate the attention sink effect ... we analyze the attention patterns and hidden state statistics of Qwen2-7B ... Our results reveal a strong correlation between token variance and attention sink magnitude." (§2.2)

> "SWAT replaces the softmax operation with the sigmoid function, which not only prevents the attention sink problem but also maintains dense attention weights for higher information capacity per token." (§1)

> "SWAT's maximum attention distance is constrained by the product of window size and model depth ... information loss remains inevitable when processing ultra-long sequences." (§7)
