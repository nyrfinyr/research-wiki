---
title: "Gu et al. (2024) — When Attention Sink Emerges in Language Models: An Empirical View"
type: source
tags: [attention-sink, language-models, pretraining, softmax, sigmoid-attention, key-bias, kv-cache, streaming-llm, interpretability]
created: 2026-05-15
updated: 2026-05-15
source_path: raw/papers/gu-2024-attention-sink.pdf
source_kind: paper
source_date: 2025-03-02
doi: 10.48550/arXiv.2410.10781
zotero_key: CXGDZHDX
venue: ICLR 2025
authors: [Xiangming Gu, Tianyu Pang, Chao Du, Qian Liu, Fengzhuo Zhang, Cunxiao Du, Ye Wang, Min Lin]
year: 2024
---

# Gu et al. (2024) — When Attention Sink Emerges in Language Models: An Empirical View

## TL;DR

Gli autori conducono uno **studio empirico sistematico** dell'**attention sink** — il fenomeno per cui i language model auto-regressivi assegnano attenzione sproporzionata al primo token, indipendentemente dal suo contenuto semantico. Mostrano che (i) il sink è **universale**: emerge in modelli da 14M (Pythia) a 70B (LLaMA-3), anche con input casuali; (ii) emerge **durante il pre-training** dopo ~1-2k step di ottimizzazione efficace, e si rafforza con la scala dei dati e con weight decay; (iii) la sua **posizione** dipende da loss function e distribuzione dati (può essere shiftato su token diversi); (iv) il primo token funziona da **key bias**: assorbe attention extra senza contribuire al value. Cruciale: sostituendo softmax con **sigmoid attention senza normalizzazione**, l'attention sink **non emerge** in modelli fino a 1B. Questo fornisce le fondamenta teoriche per [[sliding-window-attention]], [[streaming-llm]], KV-cache eviction e quantization che già si appoggiavano empiricamente al sink token [source: raw/papers/gu-2024-attention-sink.pdf §1, §7-§8].

## Contributo principale

- **Decomposizione** del meccanismo: `q_t k_1ᵀ = ‖q_t‖·‖k_1‖·cos(q_t, k_1)`; il primo token ha `‖k_1‖` *piccola* ma `cos(q_t, k_1)` molto grande ⇒ è l'angolo (la posizione su una manifold separata) a generare il sink, non la norma della key (§3.1, Fig. 2).
- Metrica quantitativa `Sink^ε_k = (1/L)·Σ_l (1/H)·Σ_h I(α^(l,h)_k > ε)` con `ε = 0.3, T = 64` come default; permette di misurare empiricamente l'emergenza (§3.2).
- Studio variabile per variabile (optimization, dati, loss, architettura) — vedi sotto.
- Dimostrazione che **rimpiazzando softmax con sigmoid senza normalizzazione** (o introducendo key bias espliciti) il sink scompare a parità di validation loss (§7.3-7.4).

## Metodo

### Setup empirico (§3.2, §4)

- Misura su sequenze `T=64` (no BOS) su Pile-CC.
- Soglia `ε=0.3` (compromesso strict / robusto a `T`).
- Modelli osservati: GPT-2, LLaMA-2 (7B,13B Base/Chat), LLaMA-3-8B, Mistral-7B, Pythia (14M→12B), OPT.
- Pre-training controllato: LLaMA-style ~60M parametri, `d=768, L=10, H=8, FFN=1536`, 5B token da Pile, 20k step, AdamW lr=4e-4, weight decay 0.1, contesto 2048, batch 1M token.

### Manifestazione (§3.1, Fig. 2)

In LLaMA3-8B Base, da `l=2` in poi:
- `‖h^l_1‖` (hidden) ha **massive activations**, molto maggiori della media degli altri token.
- `‖k^l_1‖`, `‖v^l_1‖` sono **più piccole** della media degli altri token.
- `q_t k_1ᵀ ≫ q_t k_jᵀ` per `j≠1`, dovuto a `cos(q_t, k_1)` grande (e non a norma).

Conclusione: il primo token usa la sua key come **bias** lungo una direzione che minimizza l'angolo con tutte le query.

### Risultati per asse di analisi

#### Optimization (§4, Fig. 4)
- Sink emerge tra **1k-2k step** sotto setup default.
- **Learning rate più piccolo** ⇒ sink emerge più tardi e meno marcato; con LR troppo basso (training rotto) il sink non emerge.
- **Batch size** non ha effetto se isolato (Tab. 10).

#### Loss function (§6)
- **Weight decay**: `γ ∈ [0.001, 0.5]` aumenta `Sink^ε_1` (15→41% a γ=0.5). Per γ molto grandi (≥2) il training si rompe e il sink sparisce.
- **Prefix LM** (loss su token > p, con `p>1`): il sink si **distribuisce sui token di prefisso** invece che solo sul primo (Fig. 5 middle).
- **Shifted window attention** (Mistral-style): il sink resta sul **primo token assoluto** se `t ≤ w`; per `t > w` il "primo token relativo" non sviluppa sink. Window size piccola previene l'emergenza (Fig. 6).

#### Data distribution (§5)
- Con **meno dati** (≤500M tokens) il sink **non emerge** (Fig. 5 right).
- Re-sample del primo token uniforme da V → sink **aumenta** (27% vs 18%): conferma low-semantic-information del token sink.
- Fissando `x_fix` in posizione 2 o 3 → il sink **si sposta** lì (Tab. 10 right).

#### Model architecture (§7)
- **Positional embedding** (NoPE, absolute, learnable, relative, ALiBi, Rotary) non influisce sull'emergenza (Tab. 3): tutti hanno sink.
- **Pre-norm vs Post-norm**: in post-norm le massive activations sono prima del LN, non in `h^l_1`; il sink resta (`Sink^ε_1 = 13.5%`).
- **Key biases** (`k*^l,h` apprendibili) o **learnable sink token** o **KV-biases** ⇒ il sink si **sposta** dal primo token sui bias (`Sink^ε_* ~73%`, `Sink^ε_1 ~0%`), validation loss invariata (Tab. 4). **V-biases da soli** non bastano.
- Aumentando `‖v*‖` il sink torna sul primo token (Tab. 5).
- **Softmax → sigmoid senza normalizzazione**: `Sink^ε_1 ≈ 0.44%`, valid loss 3.70 (vs 3.73 softmax) — sink **non emerge** fino a 1B parametri (Tab. 6, §7.4). Stessa cosa con elu+1 senza normalizzazione, o kernel MLP. Mantenendo la normalizzazione (sigmoid normalizzata) il sink ricompare.

## Risultati chiave (sintesi numerica)

| Esperimento | `Sink^ε_1` | Note |
|---|---|---|
| Default 60M LLaMA, softmax, Rotary | 18.18% | baseline |
| Senza weight decay (γ=0) | 15.2% | emerge comunque |
| γ=0.5 | 41.08% | weight decay rafforza |
| LR×0.1 (stessi step) | molto inferiore | optimization debole |
| Data 50-200M | ~0% | training data insufficiente |
| Prefix LM (p=5) | sink su prefisso | non sul solo first |
| K-biases (k* apprendibile) | 0.04% (sul first) / 72.76% (sui bias) | sink shiftato |
| Sigmoid attention (no norm) | 0.44%* | sink non emerge |
| MLP-kernel attention | 0%* | sink non emerge |

LLaMA-3-8B Base raggiunge `Sink^ε_1 = 99.02%` sulle sequenze naturali ⇒ il fenomeno è massimamente espresso nei modelli production-scale (Tab. 1).

## Limitazioni dichiarate dagli autori

- Esperimenti controllati di pre-training limitati a ~60M parametri / 5B token; scaling delle conclusioni a 100B+ resta da verificare a costo controllato.
- Si studia il sink come fenomeno **emergente** del pre-training ma non si propone una nuova ricetta di training large-scale: la sigmoid attention non-normalizzata è validata fino a 1B (§7.4).
- L'analisi `cos(q,k)` è osservativa: non viene fornita una **teoria predittiva** di quando esattamente il sink emerge in funzione di lr × token-count.
- Il legame con [[streaming-llm]] e KV-cache è motivazionale ma non vengono ri-eseguiti quei benchmark con il loro fix.

## Domande aperte / critiche

- La sigmoid attention senza normalizzazione mantiene la qualità a 1B; **regge a 7B / 70B**? Mistral / LLaMA non l'hanno ancora adottata. Cfr. [[sliding-window-attention]] (Fu 2025) che usa sigmoid + sliding window con ottimi risultati a 760M, confermando direzionalmente.
- Effetti su **lunghi contesti** (>32K) e su **in-context learning** non quantificati.
- Il "key bias" interpretato come dump di attention extra: non c'è una metrica di **quanta informazione utile** quella attention contiene (forse non zero per certe heads).
- Il paper non discute l'interazione del sink con [[flash-attention]] o con quantization che esplicitamente usa il primo token come anchor (Xiao 2023b).
- I MLLM (es. LLaVA, Qwen-VL) hanno comportamenti analoghi sui token visivi: la generalizzazione cross-modale del meccanismo non è discussa qui (vedi Morini 2026 [[look-twice]] per evidenze in MLLM).

## Concetti citati

[[attention-sink]], [[self-attention]], [[scaled-dot-product-attention]], [[multi-head-attention]], [[transformer]], [[layer-normalization]], [[positional-encoding]], [[rotary-position-embedding]], [[alibi]], [[sigmoid-attention]], [[key-bias]], [[massive-activations]], [[kv-cache]], [[streaming-llm]], [[pre-norm-post-norm]], [[weight-decay]], [[sliding-window-attention]].

## Citazioni dirette rilevanti

> "Auto-regressive Language Models (LMs) assign significant attention to the first token, even if it is not semantically important, which is known as attention sink." (Abstract)

> "Most importantly, we find that attention sink acts more like key biases, storing extra attention scores, which could be non-informative and not contribute to the value computation." (Abstract)

> "After relaxing such dependence by replacing softmax attention with other attention operations, such as sigmoid attention without normalization, attention sinks do not emerge in LMs up to 1B parameters." (Abstract)

> "Attention sink emerges after LMs are trained effectively. Attention sink appears less obvious in LMs trained with small learning rates." (§4, Takeaways)

> "Although ‖q^l,h_t‖·‖k^l,h_1‖ is comparatively small, cos(q^l,h_t, k^l,h_1) is significantly large, leading to attention sink. This explains why attention sink exists despite the small ℓ2-norm of keys of the first token." (§3.1)
