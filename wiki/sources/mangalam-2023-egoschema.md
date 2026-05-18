---
title: "Mangalam, Akshulakov, Malik (2023) — EgoSchema: A Diagnostic Benchmark for Very Long-form Video Language Understanding"
type: source
tags: [video-qa, benchmark, long-form-video, egocentric, ego4d, certificate-length, zero-shot]
created: 2026-05-15
updated: 2026-05-15
source_path: raw/papers/mangalam-2023-egoschema.pdf
source_kind: paper
source_date: 2023-08-17
doi: 10.48550/arXiv.2308.09126
zotero_key: ENPEDZNI
venue: NeurIPS 2023 (Datasets and Benchmarks track)
authors: [Karttikeya Mangalam, Raiymbek Akshulakov, Jitendra Malik]
year: 2023
---

# Mangalam, Akshulakov, Malik (2023) — EgoSchema: A Diagnostic Benchmark for Very Long-form Video Language Understanding

## TL;DR

EgoSchema è un dataset diagnostico per il *very long-form* video question-answering: > 5.000 QA a scelta multipla (5 opzioni), ognuna basata su una clip egocentrica di **3 minuti** estratta da [[ego4d]], per un totale di **>250 ore** di video. Il contributo concettuale chiave è la nozione di **temporal certificate set** — il sottoinsieme minimo di subclip che un verificatore umano deve guardare per essere convinto della correttezza della risposta. Su 15 dataset di video understanding, EgoSchema ha una median certificate length di ~100 s, **5.7× più lunga del secondo dataset** (LVU) e **25–100× più lunga** di tutti gli altri. Risultato sperimentale: i migliori MLLM zero-shot del 2023 (FrozenBiLM, mPLUG-Owl, InternVideo, VIOLET) restano sotto il **33 %** di accuracy (random = 20 %), mentre gli umani raggiungono **76 %** [source: raw/papers/mangalam-2023-egoschema.pdf §1, §4.1, §4.2, Tab. 6–7].

## Contributo principale

- **Temporal certificate length**: nuova metrica che misura la difficoltà temporale *intrinseca* di un task video, disaccoppiata dalla durata della clip. Applicabile a action classification, detection, localization, QA, captioning. Mostra che la lunghezza della clip è solo *debolmente correlata* con la difficoltà temporale reale (Fig. 3).
- **Dataset EgoSchema**: 5.063 QA su clip da 3 minuti, ognuna con 5 opzioni, **median certificate length ~100 s** — il primo dataset "very long-form" secondo la tassonomia degli autori (short ~1 s, long-form ~10 s, very long-form ~100 s).
- **Pipeline di costruzione a 4 stadi** con LLM-in-the-loop: filtering narrazioni → generazione LLM (Q(AW)-shot) → filtraggio LLM (blind baseline) → curazione manuale a 2 round. Genera dati di alta qualità minimizzando costo umano.
- **Benchmark zero-shot** dei principali MLLM video del 2023: tutti < 33 % accuracy; umani 76 %; first-of-its-kind gap quantification che ha motivato gran parte della successiva ricerca su long-video MLLM.

## Metodo

### Nozione di temporal certificate (§3.2)

Definizione: dato un (video, label) e un task, il **certificate set** è il sottoinsieme minimo di sub-clip *necessario e sufficiente* a convincere un verificatore umano della correttezza della label, senza guardare il resto del video. La **certificate length** = somma delle lunghezze temporali delle subclip del set.

Tassonomia temporale derivata:
- *short video task*: certificate length ~1 s (es. action classification su Kinetics).
- *long-form video task*: ~10 s (es. AGQA, NextQA).
- *very long-form video task*: ~100 s (solo EgoSchema in Fig. 3).

**Meta-rules**: convenzioni implicite del dataset che il verificatore può usare (es. mutua esclusività delle 400 classi Kinetics). Riducono significativamente la certificate length.

**Certificate conventions**: minimo 0.1 s per certificate; due certificati non contigui si fondono se i loro estremi più vicini sono < 5 s.

### Pipeline di costruzione del dataset (§3.1, Fig. 4)

**Stage I — Raw Data Filtering**.

Ego4D fornisce 3670 h di RGB con 3.85M narrazioni dense (1772 verbi, 4336 nomi unici). Si filtrano **clip non-overlapping di 3 minuti** con **≥ 30 narrazioni** ciascuna (timestamp + frase) per garantire densità narrativa sufficiente.

**Stage II — Question-Answer Generation**.

Le narrazioni vengono passate a un LLM per generare *N = 3* triplette (Q, A, W) per clip, ognuna con **M = 4 distrattori** + 1 risposta corretta (5 opzioni totali). Schemi di prompting testati:

| Schema | Inference calls | Pro | Contro |
|---|---|---|---|
| One-shot | 1 | Più economico | Bassa qualità, alto FP/FN |
| N-shot | N | Migliora FP/FN | Domande simili tra loro |
| QAW-shot | 3 chained | Q distinte, A distinte | Cascading failure |
| **Q(AW)-shot** (chosen) | **2 chained** | Q distinte; A jointly with W; 30% più economico | — |

LLM scelti per qualità: GPT-4, Bard, Claude. GPT-3 e ChatGPT scartati per qualità insufficiente. Iterazione manuale ~85 prompt seed prima di convergere su PQ + PAW finali.

**Stage III — Generated QAW Filtering**.

- *Rule-based*: scarta output con parole-chiave del prompt (`long-term`, `narrations`, `timestamp`) che leakano in QAW.
- *LLM blind filter*: si dà solo la domanda + opzioni (senza narrazioni) a un LLM; se indovina, la domanda è risolvibile senza video → scartata. Ottimizza precision su recall.
- *No-Q baseline* (testato ma non usato): dare narrazioni senza domanda → accuracy ~20 % (random), segno che le opzioni W sono già plausibili.

**Stage IV — Manual QAW Curation**.

Due round di annotatori umani; ogni QAW deve passare 3 condizioni:

1. Q ben formata e A è davvero la risposta corretta;
2. tutti i 4 distrattori W sono davvero errati;
3. la **temporal certificate length** è **≥ 30 s**.

Il primo round riduce 4–5× il numero di QAW. Il secondo round conferma > 97 % delle domande del primo.

### Statistiche finali di EgoSchema

- **5.063 QA pairs** su **~250 h** di video Ego4D filtrato.
- Clip di **3 min** ognuna; **5 opzioni** per QA (random baseline = 20 %).
- **Median certificate length ~100 s**; certificate length **5.7×** più lunga di LVU [50] (secondo posto), **25–100×** più lunga di NextQA, AGQA, IVQA, MSRVTT, ActivityNet-QA, AVA, Kinetics, UCF101, HVU, Youtube-8M, Something-Something (Fig. 3).
- Esiste un **subset di 500 QA** (Subset) con ground-truth pubblica e un **fullset di ~5000** con eval server-side.

### Protocollo di valutazione (§4.2)

Zero-shot setting per ogni modello. Due configurazioni per ogni MLLM:

1. Stesso #frame del training.
2. Numero massimo di frame eseguibili su una A100-80G senza OOM.

Frame campionati uniformemente dalla clip di 3 min. Accuracy = QA accuracy multiple-choice. Per modelli che non supportano nativamente MCQ:

- **mPLUG-Owl**: prompt "Given question Q, is answer X correct?" → si sceglie l'opzione col più alto softmax di "Yes".
- **InternVideo** (MSRVTT-finetuned): "Question: Q? Is it X?" → opzione con miglior score.

### Human baseline (§4.2, Tab. 7)

Cinque setting:

| Setting | QA Accuracy |
|---|---|
| 180 frames (1 fps) | 67.2 % |
| In < 1 min | 67.0 % |
| In < 3 min | 68.0 % |
| No constraint | 75.0 % |
| Video → Text (no re-watch) | **76.2 %** |

Sorprese:
- 1 fps è quasi-equivalente a guardare il video intero (67.2 vs 75.0).
- 1 min di tempo umano è quasi-equivalente a 3 min (67.0 vs 68.0).
- "Video → Text" (guardare il video senza testo, poi rispondere senza re-watch) **batte** il setting "no constraint" (76.2 vs 75.0): l'attenzione non divisa aiuta.

## Risultati chiave

### Certificate length su 15 dataset (Fig. 3)

EgoSchema è isolato in alto-destra:

- EgoSchema: ~100 s mediana, clip 180 s.
- LVU: ~17 s, clip 1–3 min.
- NextQA / AGQA: ~5 s.
- MSRVTT / ActivityNet-QA / IVQA / HOW2QA: ~1–3 s.
- Action class. (Kinetics, UCF101, HVU-Action): < 1 s.
- Detection (AVA): < 1 s.
- Concept class. (HVU-Concept), Youtube-8M, Something-Something: tutti ~0.5–2 s.

### Benchmark MLLM zero-shot (Tab. 6, sul fullset)

| Model | Release | Params | #frame | QA Acc |
|---|---|---|---|---|
| Random | — | — | — | 20.0 % |
| **FrozenBiLM** [57] | Oct 2022 | 1.2B | 10 | 26.4 % |
|  |  |  | 90 | 26.9 % |
| **VIOLET** [14] | Sept 2022 | 198M | 5 | 19.9 % |
|  |  |  | 75 | 19.6 % |
| **mPLUG-Owl** [59] | May 2023 | 7.2B | 1 | 27.0 % |
|  |  |  | **5** | **31.1 %** |
|  |  |  | 10 | 29.6 % |
|  |  |  | 15 | 28.7 % |
|  |  |  | 30 | 20.0 % |
| **InternVideo** [48] | Dec 2022 | 478M | 10 | 31.4 % |
|  |  |  | 30 | 31.8 % |
|  |  |  | 90 | **32.1 %** |
| **Human** | — | — | — | **76.0 %** |

Findings:

- Nessun modello supera il 33 %; gap umano-macchina **>40 punti**.
- InternVideo scala monotonicamente con #frame ma satura intorno a 30 frame.
- mPLUG-Owl è non-monotonico: 5 frame è il sweet spot, 30 frame degrada a random (20 %).
- VIOLET (198M params) resta a chance level — i parametri da soli non bastano.
- FrozenBiLM, pre-2023 SOTA su 8 QA dataset, qui appena sopra random.

### Confronto con benchmark seguenti

- [[mvbench]] (2024) usa pipeline diversa (LLM-generated da 11 dataset, no certificate length, clip 5–35 s) e raggiunge accuracy > 60 % con VideoChat2-Mistral; ma su EgoSchema fullset VideoChat2-Mistral arriva a 54.4 % (con 16 frame) — ancora ben sotto l'umano.
- [[video-mme]] (2025) adotta il concetto di certificate length per le sue fasce short/medium/long (26/164/890 s mediana) — EgoSchema (~100 s) si colloca tra short e medium di Video-MME.
- [[lvbench]] (2025) usa un concetto analogo ("clue duration") ma su clip multi-ora.

## Limitazioni dichiarate

- Bias egocentrico ereditato da [[ego4d]] (sport, household tasks, cooking, ecc.); non rappresenta video web in third-person.
- Bias linguistico ereditato dagli LLM usati in generazione (GPT-4, Bard, Claude); possibili artefatti.
- Curazione manuale non perfetta: pur con 2 round, alcuni QA possono restare ill-formed.
- Errata board pianificata ma non ancora attiva al momento del release.

## Domande aperte / critiche

- La certificate length è stimata su **100 QA totali** (5 h di video) per EgoSchema, e su solo ~2 h di sforzo umano per ognuno dei 14 altri dataset. Errore di stima alto; il fattore 5.7× rispetto a LVU è basato su pochi campioni.
- Il blind LLM filter assume che l'LLM rifletta il prior testuale "tipico" → false negatives (domande effettivamente difficili ma indovinabili per fortuna) potrebbero essere eliminate ingiustamente. Gli autori riconoscono che ottimizzano precision su recall.
- I distrattori sono generati dal medesimo LLM che genera la risposta corretta → possibile bias stilistico che un MLLM ben tarato (es. che riconosce lo stile GPT-4) potrebbe sfruttare.
- Il numero di clip distinte è limitato dalle clip di 3 min con ≥ 30 narrazioni da Ego4D; copre solo una porzione dei domini Ego4D (cooking, household, ecc.).
- Human baseline su solo 5–9 h di video (~100–180 QA) → CI ampio (~±5 %).
- Il claim "10× to 100× longer" è basato sulla *median* certificate length, ma la distribuzione (Fig. 2) ha mass anche su valori < 50 s — il dataset stesso ha QA "facili".
- Pipeline LLM-heavy: replicabilità minata se i modelli GPT-4/Bard/Claude del 2023 non sono più accessibili.
- Le 5 opzioni (vs 4 di Video-MME/MVBench/LVBench) abbassano il random baseline (20 % vs 25 %) ma rendono le domande più ambigue per modelli che faticano a discriminare tra distrattori simili.

## Concetti citati

- [[temporal-certificate-length]] — nozione introdotta nel paper, centrale.
- [[very-long-form-video-understanding]] — categoria temporale definita dagli autori (~100 s certificate).
- [[long-form-video-understanding]] — categoria temporale (~10 s certificate).
- [[short-video-task]] — categoria temporale (~1 s certificate).
- [[ego4d]] — sorgente del video data.
- [[egocentric-video]] — natura dei video.
- [[video-question-answering]] — task.
- [[multiple-choice-qa]] — formato (5 opzioni).
- [[multimodal-large-language-model]] — oggetto di valutazione.
- [[frozenbilm]] — modello valutato.
- [[violet]] — modello valutato.
- [[mplug-owl]] — modello valutato (best non-Internvideo, 31.1 %).
- [[internvideo]] — modello valutato (best zero-shot, 32.1 %).
- [[gpt-4]] — LLM usato per generazione QAW.
- [[bard]] — LLM usato per generazione QAW.
- [[claude]] — LLM usato per generazione QAW.
- [[chatgpt]] — testato ma scartato per qualità.
- [[gpt-3]] — testato ma scartato per qualità.
- [[bleu]] — citato come metrica con shortcomings.
- [[rouge]] — citato come metrica con shortcomings.
- [[mvbench]] — benchmark successivo che lo cita.
- [[video-mme]] — benchmark successivo che adotta certificate length.
- [[lvbench]] — benchmark successivo che adotta clue duration.
- [[next-qa]] — confronto certificate length.
- [[agqa]] — confronto certificate length.
- [[lvu]] — secondo dataset più lungo nella mappa certificate length.
- [[kinetics]] — confronto certificate length.
- [[ucf101]] — confronto certificate length.
- [[something-something]] — confronto certificate length.
- [[hvu]] — confronto certificate length.
- [[ava-dataset]] — confronto certificate length.
- [[howto100m]] — citato come pre-training dataset.
- [[howto100m-vqa]] / [[how2vqa69m]] — citato come pre-training dataset.
- [[ivqa]] — confronto.
- [[msrvtt]] — confronto.
- [[activitynet-qa]] — confronto.
- [[movieqa]] — citato come dataset open-ended con bias text-only.
- [[mad-dataset]] — citato come grounding long-video dataset.
- [[youtube-8m]] — confronto.
- [[datasheets-for-datasets]] — pratica citata per documentazione del dataset.

## Citazioni dirette

> "EgoSchema, with its long intrinsic temporal structures and diverse complexity, would serve as a valuable evaluation probe for developing effective long-term video understanding systems in the future." (Abstract, p. 1)

> "We introduce the notion of temporal certificate length, a tool to measure the intrinsic temporal length of a benchmark." (§3, p. 3)

> "Datasets with certificate length in the order of 1 second are termed short video tasks. Next, we name datasets with certificate length in the order of 10 seconds as, long-form video tasks. Finally, datasets with certificate length in the order of 100 seconds are termed as, very long-form video tasks." (§3, p. 3)

> "EgoSchema has temporal certificate length 5.7× longer than the second longest certificate length dataset, and 10× to 100× longer than all other video understanding datasets." (§4.1, p. 7)

> "Even the most advanced current video-language understanding systems consisting of billion of parameters achieve very low accuracy in long-from multiple-choice question-answering (< 33%) while humans achieve about 76% accuracy." (§1, p. 3)

> "Surprisingly, we observe that just with 1 fps humans can achieve an impressive 67.2%." (§4.2, p. 9)
