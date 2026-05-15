---
title: "Vaswani et al. (2017) — Attention Is All You Need"
type: source
tags: [transformer, attention, self-attention, neural-machine-translation, seq2seq, deep-learning]
created: 2026-05-15
updated: 2026-05-15
source_path: raw/papers/vaswani-2017-attention.pdf
source_kind: paper
source_date: 2017-06-12
doi: 10.48550/arXiv.1706.03762
zotero_key: DRW67HKR
venue: NeurIPS 2017
authors: [Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Łukasz Kaiser, Illia Polosukhin]
year: 2017
---

# Vaswani et al. (2017) — Attention Is All You Need

## TL;DR

Gli autori propongono il **Transformer**, una nuova architettura encoder-decoder per sequence transduction interamente basata su meccanismi di attention, eliminando completamente ricorrenza e convoluzioni. Il modello batte lo stato dell'arte su WMT 2014 EN-DE (28.4 BLEU) e EN-FR (41.8 BLEU) richiedendo una frazione del compute delle baseline ricorrenti/convolutive (3.5 giorni su 8 GPU P100 per il modello "big"). Generalizza al constituency parsing inglese. È il paper fondativo di tutta la famiglia di modelli [[transformer]] (BERT, GPT, T5, ecc.).

## Contributo principale

- Prima architettura di sequence transduction che si basa **esclusivamente** su attention, abbandonando RNN e CNN [source: raw/papers/vaswani-2017-attention.pdf §1].
- Introduzione di **Scaled Dot-Product Attention** e **Multi-Head Attention** come blocchi computazionali primitivi (vedi [[scaled-dot-product-attention]], [[multi-head-attention]]).
- Path length costante O(1) tra qualsiasi coppia di posizioni, contro O(n) di un RNN — abilita training massicciamente parallelo e dipendenze a lungo raggio più facili da apprendere (Tabella 1, §4).

## Metodo

### Architettura ([[transformer]])

Stack encoder + stack decoder, entrambi con **N=6** layer identici.

- **Encoder layer**: due sub-layer — (1) multi-head self-attention, (2) feed-forward position-wise. Ogni sub-layer è avvolto da `LayerNorm(x + Sublayer(x))` (residual + [[layer-normalization]]).
- **Decoder layer**: tre sub-layer — (1) masked multi-head self-attention (la maschera azzera con −∞ le posizioni future per preservare l'auto-regressività), (2) multi-head encoder-decoder attention (le query vengono dal decoder, key/value dall'output dell'encoder), (3) feed-forward.
- Tutti i sub-layer e gli embedding producono vettori di dimensione `d_model = 512` per facilitare le residual connection (§3.1).

### Scaled Dot-Product Attention

`Attention(Q, K, V) = softmax(Q Kᵀ / √d_k) V` (Eq. 1).

Il fattore di scala `1/√d_k` evita che, per `d_k` grandi, i prodotti scalari saturino la softmax in regioni con gradiente quasi nullo (§3.2.1, footnote 4: assumendo componenti i.i.d. con varianza 1, `q·k` ha varianza `d_k`).

### Multi-Head Attention

`h = 8` teste in parallelo, ognuna con `d_k = d_v = d_model / h = 64`. Output: concatenazione delle teste seguita da una proiezione lineare `W^O`. Permette di attendere congiuntamente a sottospazi rappresentazionali diversi in posizioni diverse (§3.2.2).

Usata in tre modi nel modello:
- **encoder-decoder attention** (query dal decoder, K/V dall'encoder),
- **self-attention nell'encoder** (Q/K/V dalla stessa sorgente),
- **masked self-attention nel decoder** (auto-regressiva).

### Position-wise FFN

`FFN(x) = max(0, xW_1 + b_1) W_2 + b_2` (Eq. 2). Applicata indipendentemente a ogni posizione; `d_ff = 2048` (§3.3).

### Positional Encoding

Niente ricorrenza ⇒ serve segnale di posizione. Si **somma** all'embedding un encoding sinusoidale:

- `PE(pos, 2i) = sin(pos / 10000^(2i/d_model))`
- `PE(pos, 2i+1) = cos(pos / 10000^(2i/d_model))`

Lunghezze d'onda in progressione geometrica da `2π` a `10000·2π`. La scelta sinusoidale è giustificata dalla speranza di permettere generalizzazione a sequenze più lunghe di quelle viste in training; sperimentalmente equivalente a positional embedding apprese (Tab. 3 riga E) (§3.5). Vedi [[positional-encoding]].

### Training

- Dataset: WMT 2014 EN-DE (~4.5M coppie, vocab BPE condiviso ~37k token) e EN-FR (36M frasi, word-piece 32k) (§5.1). Vedi [[wmt-2014]], [[byte-pair-encoding]].
- Hardware: 1 macchina × 8 NVIDIA P100. Base: 100k step (~12h). Big: 300k step (~3.5 giorni) (§5.2).
- Ottimizzatore: Adam con `β1=0.9, β2=0.98, ε=1e-9`. Learning rate warmup lineare per i primi 4000 step poi decay come `step^-0.5`: `lrate = d_model^-0.5 · min(step^-0.5, step · warmup^-1.5)` (Eq. 3, §5.3).
- Regolarizzazione: residual dropout `P_drop=0.1`, label smoothing `ε_ls=0.1` (§5.4). Vedi [[label-smoothing]].

## Risultati chiave

### Traduzione (Tab. 2)

| Modello | EN-DE BLEU | EN-FR BLEU | Train FLOPs |
|---|---|---|---|
| GNMT + RL [38] | 24.6 | 39.92 | 2.3·10¹⁹ / 1.4·10²⁰ |
| ConvS2S [9] | 25.16 | 40.46 | 9.6·10¹⁸ / 1.5·10²⁰ |
| MoE [32] | 26.03 | 40.56 | 2.0·10¹⁹ / 1.2·10²⁰ |
| GNMT+RL Ensemble | 26.30 | 41.16 | 1.8·10²⁰ / 1.1·10²¹ |
| ConvS2S Ensemble | 26.36 | 41.29 | 7.7·10¹⁹ / 1.2·10²¹ |
| **Transformer (base)** | **27.3** | **38.1** | **3.3·10¹⁸** |
| **Transformer (big)** | **28.4** | **41.8** | **2.3·10¹⁹** |

Il modello "big" supera tutti i precedenti, ensemble inclusi, su EN-DE di oltre **2 BLEU**, a una frazione del costo di training (§6.1).

### Constituency parsing (Tab. 4)

Transformer 4-layer (`d_model=1024`) sul Penn Treebank WSJ:
- WSJ-only: **91.3 F1** (vs. 91.7 di Dyer 2016 RNNG).
- Semi-supervisionato (~17M frasi): **92.7 F1** (batte tutte le baseline tranne RNNG generativo a 93.3) (§6.3). Vedi [[penn-treebank]].

### Ablation (Tab. 3, §6.2)

- (A) **Numero di teste**: 1 testa è 0.9 BLEU peggio del setup migliore; troppe teste (32) peggiorano leggermente.
- (B) Ridurre `d_k` peggiora la qualità → la funzione di compatibilità non è banale.
- (C) Modelli più grandi sono migliori; il dropout è cruciale.
- (E) Positional embedding apprese ≈ sinusoidi (4.92 vs. 4.92 PPL, 25.8 vs. 25.7 BLEU dev).

### Complessità (Tab. 1, §4)

| Layer | Complexity / layer | Sequential ops | Max path length |
|---|---|---|---|
| Self-Attention | O(n²·d) | O(1) | O(1) |
| Recurrent | O(n·d²) | O(n) | O(n) |
| Convolutional | O(k·n·d²) | O(1) | O(log_k n) |
| Self-Attention (restricted, r) | O(r·n·d) | O(1) | O(n/r) |

Self-attention è più veloce di un RNN quando `n < d`, condizione tipica per rappresentazioni a sottoparola (§4).

## Limitazioni dichiarate dagli autori

- Complessità **O(n²·d)** della self-attention per layer ⇒ problematica per sequenze molto lunghe; gli autori propongono come future work una **self-attention ristretta** a un intorno di dimensione `r` (§4, §7).
- La generazione resta sequenziale; rendere meno sequenziale la generazione è un obiettivo dichiarato (§7).
- Esperimenti limitati a un dominio testuale; estensione a immagini/audio/video è dichiarata come future work (§7).

## Domande aperte / critiche

- Il paper non discute la **stabilità del training** in funzione di `d_model`, learning-rate schedule o warmup oltre l'aneddoto su Adam.
- Manca un'analisi sistematica del comportamento per sequenze lunghe (lunghezze > qualche centinaio di token).
- L'interpretabilità delle teste di attention è suggerita ("many appear to exhibit behavior related to syntactic and semantic structure", §4) ma non quantificata.
- Non viene confrontato con baseline non-NMT (es. modelli linguistici puri) — questo arriverà nei follow-up della letteratura.

## Affiliazioni e infrastruttura

- Autori: vedi frontmatter `authors:`. Affiliazioni dichiarate nel paper: Google Brain (Vaswani, Shazeer, Polosukhin), Google Research (Parmar, Uszkoreit, Jones, Kaiser), University of Toronto (Gomez).
- Hardware: NVIDIA P100 (8× per training).

## Concetti citati

[[transformer]], [[self-attention]], [[scaled-dot-product-attention]], [[multi-head-attention]], [[positional-encoding]], [[encoder-decoder-architecture]], [[sequence-transduction]], [[layer-normalization]], [[byte-pair-encoding]], [[label-smoothing]], [[bleu]], [[tensor2tensor]], [[wmt-2014]], [[penn-treebank]].

## Citazioni dirette rilevanti

> "We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely." (Abstract)

> "In this work we propose the Transformer, a model architecture eschewing recurrence and instead relying entirely on an attention mechanism to draw global dependencies between input and output." (§1)

> "We suspect that for large values of `d_k`, the dot products grow large in magnitude, pushing the softmax function into regions where it has extremely small gradients. To counteract this effect, we scale the dot products by 1/√d_k." (§3.2.1)
