---
title: "Liu et al. (2025) — SelfElicit: Your Language Model Secretly Knows Where is the Relevant Evidence"
type: source
tags: [self-elicit, evidence-highlighting, context-augmentation, attention-as-relevance, training-free, qa, rag, inference-time, prompt-augmentation]
created: 2026-05-15
updated: 2026-05-15
source_path: raw/papers/liu-2025-selfelicit.pdf
source_kind: paper
source_date: 2025-05-26
doi: 10.48550/arXiv.2502.08767
zotero_key: BUH3YXJR
venue: ACL 2025
authors: [Zhining Liu, Rana Ali Amjad, Ravinarayana Adkathimar, Tianxin Wei, Hanghang Tong]
year: 2025
---

# Liu et al. (2025) — SelfElicit: Your Language Model Secretly Knows Where is the Relevant Evidence

## TL;DR

SelfElicit è un metodo **training-free, inference-time** per migliorare le risposte di un LM in setting context-based QA (RAG-style). L'idea: usare i punteggi di **attention degli strati profondi** come segnale implicito per identificare le **frasi di evidenza** rilevanti nel contesto fornito, e ri-iniettarle nel prompt avvolte da marker `<start_important> ... <end_important>`. Genera **un solo token aggiuntivo** all'inferenza per ottenere le attention map (overhead ~3-5%), eppure ottiene **+5.0%-11.7%** di EM/F1 medio su HotpotQA, NewsQA, TriviaQA, NaturalQuestions e su 6 LM (Llama-3.1 8B/70B, Mistral 7B/12B, Qwen2.5 7B/32B), battendo CoT, Full-Elicit e Prompt-Elicit (che usa il LM per estrarre evidenza generativamente — 800-900% più costoso) [source: raw/papers/liu-2025-selfelicit.pdf §1, §4.2, Tab. 1].

## Contributo principale

- **Osservazione empirica**: gli strati profondi del Transformer assegnano relative attention 4-8× più alta alle frasi di evidenza ground-truth nel contesto, **indipendentemente** dal fatto che la risposta finale sia corretta (Fig. 2). Il modello "sa" già dove sta l'evidenza, ma non sempre la usa nella generazione (§3.1).
- Metodo: pesa l'attention dell'**ultimo token di prompt** verso le frasi del contesto, ne calcola lo `e_i` aggregato sugli evidence-reading layers `L_ER` (di default la **seconda metà** dei layer), seleziona `S_SE = {s_i : e_i ≥ α · max(e)}` con `α=0.5`, e wrappa quelle frasi con marker speciali nel prompt finale (§3.2, Alg. 1).
- Validazione: alta AUROC (~80-95) sul match con evidenze ground-truth; robustezza al rumore (distractor variant di HotpotQA, contesto 1443% più lungo); analisi dell'effetto di `L_ER` e `α`.

## Metodo

### Notazione (§2)

Decoder-only Transformer; per ogni layer `ℓ` definisce
`a^(ℓ) = (1/H) Σ_h a^(ℓ,h)`,
attention probability dal token corrente verso tutti gli `n` precedenti.

### Sentence-level attention (§3.1)

Date `m` frasi nel contesto e i range token `(t^start_si, t^end_si)`:
`ā^(ℓ)_i = (1/|t^end_si − t^start_si + 1|) · Σ_{j ∈ frase i} a^(ℓ)_j`.

### Evidence-reading layers (§3.1, RQ4)

Subset `L_ER` di layer; `e_i = (1/|L_ER|) Σ_{ℓ ∈ L_ER} ā^(ℓ)_i`. Confronto in Tab. 4 (Llama-3.1-8B HotpotQA):

| Layer span | Elicit AUROC | EM |
|---|---|---|
| 0-100% | 89.02 | 62.57 |
| 0-50% | 70.38 | 62.14 |
| **50-100%** | **91.55** | **64.86** |
| 0-25% | 59.01 | 61.86 |
| 25-50% | 74.82 | 62.57 |
| 50-75% | 91.66 | 63.57 |
| 75-100% | 91.02 | 63.43 |

Default robusto: **last 50%**.

### Thresholding (§3.1, RQ5)

`S_SE = {s_i : e_i ≥ α · max(e)}`. Default `α = 0.5`:
- Precision-recall trade-off; per task multi-hop il valore ottimo è vicino a 0.5 (HotpotQA, TQA); per task single-hop con poche evidenze (NQ) `α=1` può essere ottimo.
- SelfElicit è **robusto** ad `α ∈ [0.5, 1]` (Fig. 4).

### Highlighting prompt (§3.2)

Le frasi selezionate vengono wrappate con `<start_important>...<end_important>` e il template viene esteso con istruzioni esplicite (non includere i marker nell'output). La risposta è generata sulla versione highlighted del contesto.

### Algoritmo 1
1. `Φ(τ_QA(c,q))` genera **un solo token** per ottenere le attention map.
2. Calcola `ā^(ℓ)` per `ℓ ∈ L_ER` (Eq. 2).
3. Calcola `e` (Eq. 3).
4. Seleziona `S_SE` (Eq. 4).
5. Compone `c*` con marker.
6. `Φ(τ_SEQA(c*, q))` genera la risposta finale.

Overhead: 1 token + recomputation della forward = ~3-5% del baseline (vs 800-900% per Prompt-Elicit, vedi Tab. 1).

## Risultati chiave

### Main results (Tab. 1, §4.2)

Llama-3.1-8B (EM / F1 in ×10⁻²; gain rispetto al baseline):

| Method | HotpotQA EM | NewsQA EM | TQA EM | NQ EM | Avg ranking |
|---|---|---|---|---|---|
| Base | 58.9 | 64.3 | 72.8 | 59.7 | 4.38 |
| CoT | 60.4 | 64.9 | 74.4 | 59.6 | 3.75 |
| FullElicit | 60.7 | 65.9 | 72.8 | 61.1 | 3.12 |
| PromptElicit | 66.3 | 62.8 | 76.0 | 61.8 | 2.75 |
| **SelfElicit** | **68.5** | **66.9** | **79.4** | **64.0** | **1.00** |

Risultati simili su Llama-70B, Mistral 7B/12B, Qwen2.5 7B/32B; SelfElicit batte PromptElicit in **40/48** coppie model-task-metric a frazione del costo.

### Sentence-level retrieval di evidenze (Tab. 3, §4.2 RQ2)

AUROC dell'evidence eliciting:

| Dataset | Llama-3.1 | Mistral | Qwen-2.5 |
|---|---|---|---|
| HotpotQA | 91.24 | 85.35 | 88.21 |
| NewsQA | 92.68 | 88.68 | 91.54 |
| TQA | 73.27 | 68.89 | 70.59 |
| NQ | 90.87 | 85.51 | 87.43 |

NDCG: simili (66-92). TQA basso perché ha più risposte candidate equivalenti.

### Robustezza al rumore (Fig. 3, §4.3 RQ3)

HotpotQA distractor (contesto +1443% di rumore):
- Base: EM 58.9 → 54.3 (–4.6), F1 57.7 → 53.0.
- +SelfElicit: EM 68.5 → 62.7 (–5.8), F1 69.5 → 63.5.

Vantaggio assoluto **preservato** in presenza di rumore. SelfElicit naturalmente seleziona una percentuale **minore** di contesto in distractor mode (<10% vs ~50% in gold) anche con `α` fisso ⇒ adattività implicita (Fig. 3b).

### Layer span e α (RQ4, RQ5)

- Layer profondi sono **necessari**: span 0-25% peggio del baseline su elicit accuracy (59% AUROC).
- `α` troppo basso = come FullElicit; `α` troppo alto perde recall su task multi-hop.

## Limitazioni dichiarate dagli autori

- Non applicabile a **proprietary LM** che non espongono le attention score (GPT-4, Claude API).
- Soglia `α` statica; un controllo dinamico per input (in base a noise/coverage) potrebbe migliorare i risultati (§Limitations, Appx C.1).
- Validato solo su context-based QA: estensione a summarization, dialogue grounding o tool-use non testata.

## Domande aperte / critiche

- Quanto del vantaggio dipende dalla **calibrazione del template prompt**? I marker `<start_important>` sono token rari: l'effetto potrebbe sfumare con tokenizer che li frammentano in modo diverso.
- L'esperimento usa frasi (segmentate con spaCy). Token-level highlighting è discusso ma scartato (Appx B.4) per ragioni di leggibilità ⇒ resta da capire se costruzioni linguisticamente diverse (codice, chat logs) cambierebbero la scelta.
- L'evidenza che "deep layers know where evidence is" è coerente con [[map-the-flow]] (Kim 2025) sul flusso di informazione layer-wise nei MLLM; un'analisi quantitativa cross-architecture sarebbe interessante.
- Confronto con **decoding-time** methods (DoLa, Context-Aware Decoding di Shi et al. 2024) presente in related work ma non in Tab. 1: si potrebbe **comporre** SelfElicit con CAD.
- L'AUROC su TQA (~70) suggerisce che il segnale attention degrada quando l'evidenza è ambigua; nessuna mitigazione proposta.
- Costo inferenziale dichiarato come "additional one token": ma l'aumento medio inference-time è del 17-30% per i modelli più piccoli (Tab. 1 colonna "Inference Time") perché la prompt è due volte più lunga (con marker) — il paper minimizza un po' questo aspetto.

## Connessioni con altri lavori del wiki

- Stessa filosofia di [[look-twice]] (Morini 2026) ma su LM testuale puro; LoT esplicitamente cita SelfElicit come reference per il textual side e lo estende al visual (con attention sink filtering aggiuntivo) nei MLLM.
- Coerente con il principio che **attention ≈ relevance** già evidenziato in BERT-attention analyses (Clark 2019) e con [[map-the-flow]] sul "vision function layer" nei modelli profondi.

## Concetti citati

[[evidence-highlighting]], [[self-elicit]], [[context-based-qa]], [[rag]], [[attention-as-relevance]], [[in-context-learning]], [[chain-of-thought]], [[prompt-augmentation]], [[hotpotqa]], [[newsqa]], [[triviaqa]], [[natural-questions]], [[llama]], [[mistral]], [[qwen]], [[deep-layers-evidence]], [[layer-normalization]], [[transformer]].

## Citazioni dirette rilevanti

> "By analyzing the attention scores during response generation, we demonstrate that the LMs have an inherent ability to identify the relevant evidence in the context, regardless of whether they respond correctly or not." (§1, Contributions)

> "Regardless of whether the model responds correctly or not, the deeper layers of the LM pay significantly higher attention to the relevant evidence in the context. This observation holds across models families and datasets." (§3.1)

> "SelfElicit significantly and consistently improves the performance across all datasets and models of different sizes (5.0%-11.7% gain over baseline). Even when compared to computationally expensive (average inference time increase of 878%/939% for Llama3.1-8B/70B) iterative prompting approach PromptElicit, SelfElicit outperforms for 40 out of 48 model-task metric pairs." (§4.2 RQ1)

> "Even with a static α, SelfElicit naturally exhibits adaptiveness by selecting a lower evidence ratio in noisy contexts, focusing only on the relevant evidence without distraction from noise." (§4.3 RQ3)
