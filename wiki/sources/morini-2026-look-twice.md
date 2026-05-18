---
title: "Morini et al. (2026) — Look Twice: Training-Free Evidence Highlighting in Multimodal Large Language Models"
type: source
tags: [look-twice, mllm, kb-vqa, evidence-highlighting, attention-sink, multimodal-attention, training-free, inference-time, visual-grounding, vqa]
created: 2026-05-15
updated: 2026-05-15
source_path: raw/papers/morini-2026-look-twice.pdf
source_kind: paper
source_date: 2026-04-01
doi: 10.48550/arXiv.2604.01280
zotero_key: C96IG22A
venue: arXiv preprint (2026)
authors: [Marco Morini, Sara Sarto, Marcella Cornia, Lorenzo Baraldi]
year: 2026
---

# Morini et al. (2026) — Look Twice: Training-Free Evidence Highlighting in Multimodal Large Language Models

## TL;DR

**Look Twice (LoT)** è un framework **training-free, inference-time** che migliora come un MLLM utilizza evidenza multimodale nel setting **Knowledge-Based VQA**. L'idea: far guardare al modello l'input **due volte** — un primo forward pass genera **un solo token** e produce le attention map; queste vengono usate per identificare (a) la **regione visiva rilevante** (filtrando attention sink visivi con uno score sui dimension-channels critici della BOS) e (b) le **frasi di evidenza testuale** rilevanti nel contesto recuperato (RAG). I cue selezionati vengono **highlighted** nel prompt con marker `<START_IMPORTANT_TXT>` e con un bounding box `<START_IMPORTANT_IMG>` nell'immagine. Un secondo forward pass genera la risposta finale sull'input arricchito. Niente training, niente parametri modificati, overhead ≈ 1 token. Su 4 benchmark KB-VQA (E-VQA, InfoSeek, OVEN, ViQuAE) × 10 MLLM (Qwen2-VL, Qwen2.5-VL, Qwen3-VL, InternVL3.5 da 2B a 38B), LoT migliora di **+1.1 a +5.3** punti medi su tutte le combinazioni; mostra anche guadagni su benchmark vision-centric e di hallucination (RealWorldQA, V-Star, POPE, AMBER) usando solo il visual highlighting [source: raw/papers/morini-2026-look-twice.pdf §1, §4].

## Contributo principale

- Framework training-free per **evidence highlighting multimodale** in MLLM, che usa le attention dinamiche del modello come segnale implicito di rilevanza, senza fine-tuning né cambi architetturali [source: raw/papers/morini-2026-look-twice.pdf §1].
- **Multi-layer attention sink filtering** per la modalità visiva: identifica i `D_sink` (sottoinsieme di dimensioni hidden in cui il BOS — sink prototipico — ha attivazioni massicce) e suppressore di token visivi che attivano queste dimensioni oltre soglia τ (§3.2, Eq. 3).
- **Two-pass inference**: il primo pass costa un solo token; il second pass usa il prompt augmentato → overhead computazionale **trascurabile** (§3, contributions).
- Validazione cross-architecture (Qwen, InternVL) e cross-scale (2B → 38B); ablation dimostra che visual e textual highlighting sono **complementari** (Tab. 2).

## Metodo

### Setup KB-VQA (§3.1)

Input multimodale `X = [X_V; X_T; X_C]` di lunghezza `S = N_V + N_T + N_C` (visual tokens, question tokens, retrieved context tokens). Retrieval pipeline (§4.2): EVA-CLIP cross-modale image-to-text + FAISS, top-`n=3` entity Wikipedia → contesto testuale.

Attention notation: `A^(ℓ,k) ∈ R^(S×S)` per layer `ℓ`, head `k`.

### Self-guided Visual Evidence Selection (§3.2)

1. **Object-to-visual submatrix** (Eq. 1):
   `A^(ℓ,k)_obj→vis = A^(ℓ,k)[T_obj, V] ∈ R^(|T_obj|×N_V)`,
   dove `T_obj` sono gli indici dei token del **target object** estratto dalla domanda con dependency parsing spaCy (cap. B, "Target Object Identification").
2. **Aggregazione cross-layer e cross-head** (Eq. 2): media su `T_obj`, `L_vis` (intermediate layers — dove emerge il grounding cross-modal), e tutte le `K` teste ⇒ vettore `a_vis ∈ R^(N_V)`.

### Multi-Layer Attention Sink Filtering (§3.2)

Citando [[gu-2024-attention-sink]] e Kang et al. 2026 (Visual Attention Sink in MLLM): alcuni token visivi attivano massicciamente le stesse `D_sink` dimensioni del BOS. Score di sink:
`s_sink = (1/|L_sink|) Σ_{ℓ ∈ L_sink} max_{m ∈ D_sink} |H^ℓ_V[:,m]| / ‖H^ℓ_V‖_row` (Eq. 3),
con `L_sink = L_vis`. Token con `s_sink > τ` (default: 25° percentile dei sink score sui token visivi) ⇒ `a_vis[i] = 0`. Il filtering è applicato **solo al passaggio di analisi** (primo forward); la generazione finale usa le attention non filtrate.

### Bounding Box Extraction (§3.2)

- Reshape `a_vis` → mappa 2D `M_vis ∈ R^(H×W)`.
- Centroide pesato `(c_x, c_y)` (Eq. 4); deviazioni `σ_x, σ_y` (Eq. 5).
- Bounding box `(c_x − βσ_x, c_y − βσ_y, c_x + βσ_x, c_y + βσ_y)` con `β=2` (Eq. 6).

Confronto di tre metodi (Tab. 4, supplementary): Min-Max, Morphological, Weighted Centroid. Weighted Centroid è il best (IoU 0.487, distanza centro 0.071).

### Self-guided Textual Evidence Selection (§3.2)

Estrazione **last-to-context** dall'ultimo token generato (Eq. 7): `A^(ℓ,k)_last→ctx = A^(ℓ,k)[t, C]`.
Aggregazione su `L_txt` = **seconda metà del decoder** (deeper layers, coerente con [[liu-2025-selfelicit]]) e tutte le `K` teste (Eq. 8). Aggregazione su frasi; selezione: frase con score massimo (oppure score ≥ α).

### Multimodal Inference with Evidence Highlighting

Marker:
- Testo: `<START_IMPORTANT_TXT>...<END_IMPORTANT_TXT>` sulle frasi selezionate.
- Immagine: `<START_IMPORTANT_IMG>...<END_IMPORTANT_IMG>` sul bounding box.

Istruzioni di sistema aggiornate per dire al modello di **non riprodurre i marker** nell'output. Secondo forward pass su `[X*_V; X_T; X*_C]`.

## Risultati chiave

### Main KB-VQA (Tab. 1, §4.3)

Avg delle 4 metriche (E-VQA, InfoSeek, OVEN, ViQuAE):

| Backbone | Base | + LoT | Δ |
|---|---|---|---|
| Qwen2-VL-2B | 10.2 | 11.9 | +1.7 |
| Qwen2.5-VL-3B | 21.2 | 25.5 | **+4.3** |
| Qwen3-VL-4B | 30.2 | 31.5 | +1.3 |
| InternVL3.5-4B | 25.6 | 29.8 | **+4.2** |
| Qwen2-VL-7B | 22.9 | 28.2 | **+5.3** |
| Qwen2.5-VL-7B | 28.0 | 29.1 | +1.1 |
| Qwen3-VL-8B | 31.5 | 35.0 | +3.5 |
| InternVL3.5-8B | 30.2 | 33.7 | +3.5 |
| Qwen2.5-VL-32B | 27.8 | 31.5 | +3.7 |
| InternVL3.5-38B | 34.1 | 37.5 | +3.1 |

Guadagni più marcati su InfoSeek/ViQuAE (es. InternVL3.5-4B ViQuAE 36.4 → 45.6).

### Ablation modalità (Tab. 2, §4.4)

Qwen2.5-VL-3B su E-VQA / InfoSeek:
- **Solo textual**: 27.8→29.4 / 22.4→24.1.
- **Solo visual**: 27.8→29.6 / 22.4→23.9.
- **Entrambe (LoT)**: 30.4 / 25.2.

Le due modalità sono **complementari**.

### Numero di passaggi recuperati (Fig. 4 left)

Con `n` retrieved passages 1→3 il baseline guadagna poco (saturazione + rumore); LoT mantiene un guadagno consistente, suggerendo che il textual highlighting **assorbe il rumore** del retrieval.

### Oracle evidence (Fig. 4 right)

Anche con passaggi Wikipedia dell'entità ground-truth, LoT migliora ⇒ il textual highlighting aiuta a focalizzare anche su evidenza pulita.

### Generalizzazione a benchmark non-KB (Tab. 3, §4.5)

Solo visual highlighting (niente contesto testuale):

| Backbone | RealWorldQA Δ | V-Star Δ | TextVQA Δ | OCRBench Δ | POPE Δ | AMBER Δ |
|---|---|---|---|---|---|---|
| Qwen2.5-VL-3B | +2.6 | +2.1 | +3.9 | +3.6 | +0.8 | +23.3 |
| Qwen3-VL-4B | +4.9 | +11.0 | +1.8 | +1.4 | +0.1 | -0.7 |
| Qwen2.5-VL-32B | +1.5 | +9.9 | +1.6 | +0.3 | +0.2 | -0.4 |
| InternVL3.5-38B | +2.4 | +1.4 | -0.3 | -2.8 | +3.0 | +2.7 |

Guadagni soprattutto su V-Star (vision-centric / fine-grained) e su AMBER (hallucination). Alcune fluttuazioni negative (es. InternVL3.5-4B su POPE/AMBER) indicano che il segnale visual è meno robusto su alcuni backbone.

## Limitazioni dichiarate dagli autori

- Il filtering dei sink dimensions richiede di conoscere `D_sink` per il backbone specifico (costo offline una tantum, ma model-dependent) (§3.2).
- Il textual selection sceglie solo la frase con score massimo (`α=max`); strategie più sofisticate (multi-evidence, scoring graduale) non esplorate (§4.2).
- Validazione su 10 MLLM ma tutti basati su decoder transformer con visual encoder CLIP/SigLIP: estensione a modelli con architetture non-attention (es. Mamba-based VLM) non testata.
- Il target object si estrae da una sola noun phrase (spaCy POS): domande con riferimenti multipli o costruzioni sintattiche complesse possono fallire (§B).

## Domande aperte / critiche

- **Soglia τ = 25th percentile**: scelta empirica per i modelli testati; non c'è uno studio di sensibilità su backbone come Qwen3-VL-32B o LLaMA-3.2-Vision dove la distribuzione dei sink score potrebbe differire.
- Il bounding box è **rettangolare assissimmetrico** (centroide ± βσ): per oggetti molto allungati o frammentati questo è inadeguato. Strategie più morfologiche (Min-Max/Morphological) hanno trade-off documentati (Tab. 4) ma non integrate dinamicamente.
- Su benchmark senza retrieval (Tab. 3), per Qwen3-VL-4B su AMBER c'è -0.7: il visual highlighting può **danneggiare** in scenari dove il modello base è già ben-allineato.
- Il modello deve **rispettare** il prompt instruction di non includere i marker — comportamento mai quantificato (rate di leakage?).
- Il paper non discute il costo aggiuntivo della **routine di analisi attention** (memorizzare attention maps per `L_vis ∪ L_txt` su tutti i layer e head può essere caro per 38B, soprattutto con visual token ~256-1024).
- Connessione con [[flash-attention]]: l'estrazione esplicita di `A^(ℓ,k)` richiede di **materializzare** le attention maps, contro la pratica di FlashAttention che non le scrive su HBM. Questo crea overhead memoria significativo (non commentato).

## Connessioni con altri lavori del wiki

- LoT è la **generalizzazione cross-modale** di [[liu-2025-selfelicit]] (citato come ref. [26]): SelfElicit usa la stessa idea (attention deeper layers + sentence marker) ma solo testuale. LoT aggiunge (1) visual side, (2) sink filtering specifico per MLLM (Kang et al. 2026, "Visual Attention Sink").
- L'attention sink filtering eredita direttamente da [[gu-2024-attention-sink]] (ref. [13]).
- Coerente con la letteratura "deep layers know" (vedi anche [[map-the-flow]] Kim 2025).

## Concetti citati

[[look-twice]], [[evidence-highlighting]], [[kb-vqa]], [[multimodal-large-language-model]], [[visual-attention-sink]], [[attention-sink]], [[multimodal-attention]], [[bounding-box-extraction]], [[training-free-methods]], [[self-elicit]], [[rag]], [[encyclopedic-vqa]], [[infoseek]], [[oven]], [[viquae]], [[realworldqa]], [[v-star]], [[textvqa]], [[chartqa]], [[ocrbench]], [[pope]], [[amber]], [[qwen2-vl]], [[qwen2-5-vl]], [[qwen3-vl]], [[internvl3-5]], [[eva-clip]], [[faiss]], [[spacy]].

## Citazioni dirette rilevanti

> "We introduce Look Twice (LoT), a training-free inference-time framework that improves multimodal evidence selection in pretrained MLLMs by explicitly highlighting query-relevant cues in both retrieved text and input image." (§1, Contributions)

> "Attention mechanisms in large Transformer architectures can exhibit attention sinks, where a small subset of tokens consistently attracts disproportionate attention mass regardless of semantic relevance. Similar effects have been observed in vision-language models, where visually salient but uninformative patches can dominate attention." (§1)

> "Our look-twice strategy introduces only negligible computational overhead, as it requires generating just a single additional token at the beginning to analyze the model attention patterns." (§1, Contributions)

> "Prior work shows that deeper layers rely more heavily on textual cues when producing the final answer, whereas visual grounding signals tend to emerge in intermediate layers. Attention sinks, in contrast, appear throughout the network." (§4.2, Evidence Selection)
