---
title: "Wang et al. (2025) — LVBench: An Extreme Long Video Understanding Benchmark"
type: source
tags: [video-qa, benchmark, mllm, long-video, multi-hour-video, temporal-reasoning]
created: 2026-05-15
updated: 2026-05-15
source_path: raw/papers/wang-2025-lvbench.pdf
source_kind: paper
source_date: 2025-08-09
doi: 10.48550/arXiv.2406.08035
zotero_key: 62E46AMN
venue: arXiv preprint (CC-BY-NC-SA-4.0)
authors: [Weihan Wang, Zehai He, Wenyi Hong, Yean Cheng, Xiaohan Zhang, Ji Qi, Xiaotao Gu, Shiyu Huang, Bin Xu, Yuxiao Dong, Ming Ding, Jie Tang]
year: 2025
---

# Wang et al. (2025) — LVBench: An Extreme Long Video Understanding Benchmark

## TL;DR

LVBench è un benchmark di video-QA pensato per stress-testare gli MLLM su video *estremamente lunghi*: 103 video YouTube totalmente di **117 ore**, durata media **4101 s ≈ 68 min** (≈ 4× più lungo dei benchmark precedenti come Video-MME, MovieChat-1K, MoVQA). Le 1.549 domande a 4 opzioni coprono 6 capacità core (Temporal Grounding, Summarization, Reasoning, Entity Recognition, Event Understanding, Key Information Retrieval) che possono essere combinate in 26 task type. Anche i top closed-source soffrono: Gemini 2.5 Pro 67.4 %, Seed1.5-VL-Thinking 64.6 %; gli open-source top (Qwen2.5-VL-72B, mPLUG-Owl3) restano sotto 45 %; gli umani fanno **94.4 %**, lasciando un gap di ~27 punti rispetto allo SOTA [source: raw/papers/wang-2025-lvbench.pdf §1, §4.2, Tab. 2–3].

## Contributo principale

- **Durata media 4×** più lunga rispetto al benchmark long-video più ambizioso precedente (Video-MME 1018 s → LVBench 4101 s); definizione esplicita di "long video" come ≥ 30 min con contenuto ricco e multipli eventi (§3.1).
- Tassonomia di **6 capacità core composizionali** (TG, Sum, Rea, ER, EU, KIR) → 26 sotto-categorie combinatoriali; le combinazioni assicurano che ogni domanda richieda più skill insieme.
- Annotazione completamente manuale + filtro dual-LLM (GLM-4 ∩ GPT-4 entrambi corretti ⇒ scarta) per garantire che ogni domanda richieda davvero il contenuto visivo.
- Evidenza empirica che (i) i modelli "native long-video" possono performare peggio dei non-native (LLaMA-VID, MovieChat, LWM crollano per scarsa instruction following), (ii) dense sampling (1 fps) è critico — il salto 50 frame → 1 fps è il più grande osservato.

## Metodo

### Definizione di "long video" e raccolta (§3.1)

Definizione operativa: video ≥ 30 min, con eventi multipli, transizioni di scena e contenuto visivamente ricco.

Pipeline:

1. Pool iniziale: 500 video YouTube via search/recommendation, parole chiave selezionate manualmente.
2. Filtro qualità su 5 criteri:
   - **Clear Protagonist Presence**: protagonista identificabile e ricorrente (umano o virtuale).
   - **Structural Coherence**: struttura narrativa coerente (inizio-sviluppo-conclusione, eventi causalmente connessi).
   - **Event Density**: ≥ 1 evento significativo ogni 5 minuti.
   - **Visual Clarity**: minimo 720p, camerawork stabile, no cut eccessivi.
   - **Modality Independence**: tutta l'informazione critica trasmessa visivamente — l'audio è scartato (vedi limitazioni).
3. Dopo filtro: **103 video, 117 ore di contenuto totale**, 6 categorie tematiche: Sports Competitions, Documentary Films, Event Records, Lifestyle and Daily Activities, TV Shows and Drama Series, Cartoon Videos.

### Tassonomia delle skill (§3.2)

| Skill | Cosa misura | Esempio |
|---|---|---|
| **Temporal Grounding (TG)** | Localizzare eventi nel tempo | "What happened at 29:30?" |
| **Summarization (Sum)** | Sintesi globale del contenuto | "Identify key developments" |
| **Reasoning (Rea)** | Cause, intenzioni, predizioni | "Why did the experiment fail?" |
| **Entity Recognition (ER)** | Identificare e tracciare entità | Tracking persone/oggetti |
| **Event Understanding (EU)** | Classificare eventi e transizioni | Classificare tipo di video |
| **Key Information Retrieval (KIR)** | Estrarre numeri / testo specifici | "What revenue growth did the firm report?" |

Le domande sono spesso ibridi (es. una domanda di Reasoning richiede ER + EU implicitamente). Distribuzione: ER e EU dominano per natura intrinseca dei video (Fig. 2). 26 combinazioni di skill totali (Fig. 5).

### Annotazione (§3.3)

Pipeline a 3 stadi, annotatori professionisti pagati ~30 USD per video:

1. **Video Analysis**: l'annotatore guarda il video intero, marca eventi salienti, transizioni, entità chiave, dipendenze temporali/causali.
2. **Question Generation**: ~24 domande/ora di video, distribuite lungo tutto il timeline; ogni video copre tutte e 6 le skill; domande costruite con principio di **specificità** (riferimenti unici e non ambigui).
3. **Answer Construction**: 4 opzioni per domanda (1 corretta + 3 distrattori plausibili e di lunghezza simile); l'annotatore marca anche la **clue duration** — il minimo intervallo temporale necessario per rispondere (analogo della certificate length di [[egoschema]]).

### Data Quality Control (§3.4)

Due interventi:

- **Riduzione domande "temporal grounding-friendly"**: gli annotatori tendevano a iniettare un range temporale in molte domande (es. "around 15:00…"). Questo rendeva le domande troppo facili e penalizzava modelli senza temporal sense → si è chiesto di minimizzare tali formulazioni.
- **Dual-LLM blind filter**: GLM-4 e GPT-4 rispondono testualmente senza video; se *entrambi* concordano con la ground truth → la domanda è risolvibile senza visione → scartata. Risultato finale: **1.549 QA pairs** dopo filtraggio.

### Protocollo di valutazione (§4.1)

Prompt minimale:

> Question (A) Option1 (B) Option2 (C) Option3 (D) Option4. Please select the best answer from the options above and directly provide the letter representing your choice without giving any explanation.

Estrazione risposta via regex; fallback LLM solo se regex fallisce. Frame sampling:

- **Native long-video models**: 1 fps; downsample solo se eccede la finestra di contesto.
- **Non-native long-video models**: numero fisso di frame (32 o 96 secondo training).

## Risultati chiave

### Performance per capacità core (Tab. 2)

Selezione dei principali risultati (overall %):

| Model | ER | EU | KIR | TG | Rea | Sum | **Overall** |
|---|---|---|---|---|---|---|---|
| Random ~25.0 | — | — | — | — | — | — | ~25.0 |
| **Native long-video** |  |  |  |  |  |  |  |
| MovieChat (Vicuna-7B) | 21.3 | 23.1 | 25.9 | 22.3 | 24.0 | 17.2 | 22.5 |
| LWM (LLaMA2-7B) | 24.7 | 24.8 | 26.5 | 28.6 | 30.5 | 22.4 | 25.5 |
| Gemini-1.5-Pro | 32.1 | 30.9 | 39.3 | 31.8 | 27.0 | 32.8 | 33.1 |
| Qwen2-VL-72B | 38.0 | 41.1 | 38.3 | 41.4 | 46.5 | 46.6 | 41.3 |
| Qwen2.5-VL-72B | 44.2 | 40.9 | 55.6 | 37.7 | 45.2 | 34.5 | 44.0 |
| Gemini-2.0-Flash | 47.4 | 48.5 | 56.8 | 39.3 | 44.4 | 41.4 | 48.6 |
| Gemini-2.5-Flash | 55.2 | 55.5 | 63.8 | 52.7 | 55.5 | 44.8 | 56.7 |
| MR.Video (Gemini-2.0 backbone) | 59.8 | 57.4 | 71.4 | 58.8 | 57.7 | 50.0 | 60.8 |
| Seed1.5-VL | 64.3 | 64.0 | 64.7 | 52.3 | 65.0 | 51.7 | 64.0 |
| Seed1.5-VL-Thinking | 65.4 | 63.4 | 68.0 | 53.6 | 63.7 | 46.6 | 64.6 |
| **Gemini-2.5-Pro** | **64.5** | **67.5** | **72.8** | **65.9** | **66.5** | **58.6** | **67.4** |
| **Non-native long-video** |  |  |  |  |  |  |  |
| TimeChat (LLaMA2-7B) | 21.9 | 21.7 | 25.9 | 22.7 | 25.0 | 24.1 | 22.3 |
| PLLaVA (Yi-34B) | 25.0 | 24.9 | 26.2 | 21.4 | 30.0 | 25.9 | 26.1 |
| LLaVA-OneVision (LLaMA3-70B) | 25.0 | 26.9 | 29.2 | 30.9 | 25.4 | 31.0 | 26.9 |
| InternVL2-40B | 37.4 | 39.7 | 43.4 | 31.4 | 42.5 | 41.4 | 39.6 |
| mPLUG-Owl3 (Qwen2-7B) | 46.0 | 41.6 | 42.4 | 41.1 | 47.5 | 40.4 | 43.5 |
| VideoLLaMA3-7B | 45.8 | 42.4 | 47.8 | 35.9 | 45.8 | 36.2 | 45.3 |
| GLM4V-Plus | 46.2 | 47.8 | 54.1 | 42.7 | 46.5 | 37.9 | 48.7 |
| GPT-4o-20241120 | 48.9 | 49.5 | 48.1 | 40.9 | 50.3 | 50.0 | 48.9 |
| GPT-4.1 | — | — | — | — | — | — | **60.1** |

Findings:

- Top performer: **Gemini-2.5-Pro 67.4 %** (best in 5/6 task: EU, KIR, TG, Rea, Sum).
- Gap proprietary ↔ open-source ~20 punti: il miglior open-source non-native è VideoLLaMA3-7B 45.3 %, il miglior open-source native è Qwen2.5-VL-72B 44.0 %.
- Alcuni modelli "native long-video" (MovieChat, LLaMA-VID, LWM, persino Gemini-1.5-Pro) sono sorprendentemente più deboli dei non-native — ipotesi: scarsità di dati instruction-tuning per long video.

### Failure modes (§4.3, Fig. 3)

- **Gemini-1.5-Pro** genera output fuori dalle 4 opzioni nel **20.9 %** dei casi (es. "I cannot answer this question") nonostante il prompt vincoli.
- **MovieChat** e **LWM** mostrano forte bias verso l'opzione A indipendentemente dalla domanda.
- L'ipotesi degli autori: assenza di instruction-tuning su long video → instruction-following compromesso.

### Performance per categoria di video (Tab. 3)

| Categoria | Human | Seed1.5-VL | Gemini-2.5-Pro |
|---|---|---|---|
| Sports | 96.3 | 63.3 | 71.3 |
| Documentary | 89.8 | 67.5 | 54.3 |
| Event Record | 87.4 | 60.3 | 72.1 |
| Lifestyle | 98.4 | 66.9 | 68.5 |
| TV Show | 97.2 | 60.4 | 69.2 |
| Cartoon | 95.8 | 65.0 | 66.1 |
| **Overall** | **94.4** | **64.0** | **67.4** |

Gemini-2.5-Pro è bravo su Event Record e Sports ma crolla su Documentary (54.3); Seed1.5-VL è più uniforme. **Gap umano-macchina ~27 punti.**

### Ablation frame density (§4.5, Fig. 4)

Su Seed1.5-VL, Gemini-2.5-Pro, Qwen2.5-VL-72B testati con 0, 1, 4, 8, 50 frame e 1 fps:

- "0 frames" → tutti vicini a random guess (validazione: il benchmark non è risolvibile da pure LLM).
- 1 → 8 frame: guadagno modesto.
- 50 → 1 fps: **salto grande**. Suggerisce che la dense sampling è necessaria per catturare segnali transitori critici.

## Limitazioni dichiarate

- **Niente audio**: gli autori escludono volutamente l'audio perché molti modelli non lo supportano (§5 *Limitations*). Decisione che limita il realismo del benchmark.
- Bias annotatore: alcuni QA possono comunque essere lievemente di bassa qualità anche dopo filtro.
- Dipendenza dai video YouTube → degrado nel tempo (link rotti, rimozioni).
- Nessuna divisione train/val/test: dataset interamente di valutazione.

## Domande aperte / critiche

- L'esclusione dell'audio rende LVBench *meno* multimodale di Video-MME (dove l'audio è una colonna chiave). Per molti video lunghi (es. documentari, TV show) l'audio è fortemente informativo: si valuta un setting artificiale.
- La filtro dual-LLM (GLM-4 ∩ GPT-4) è più robusto del filtro single-LLM di Video-MME, ma rimane biased verso ciò che GLM-4 e GPT-4 *non sanno*. Modelli non-LLM ben addestrati su Wikipedia potrebbero comunque rispondere senza video.
- Lo schema di valutazione mostra che 5 dei 6 task vengono dominati da Gemini-2.5-Pro, ma con metriche aggregate (one number per skill). Manca un breakdown di varianza / intervallo di confidenza.
- I confronti tra "native" e "non-native long-video" sono confusi dalla diversità del backbone LLM (Vicuna-7B vs Qwen2.5-72B vs Gemini): difficile attribuire le differenze al supporto nativo per il long-video.
- Le 1.549 domande sono molte ma su soli 103 video — alta correlazione tra QA dello stesso video, dimensione efficace minore di quanto sembri.
- "Modality Independence" come criterio di filtro è soggettivo: chi decide se un'informazione è davvero solo visuale? Probabili leak di informazione audio in domande Sport/TV.

## Concetti citati

- [[multimodal-large-language-model]] — oggetto di valutazione.
- [[long-video-understanding]] — task target del benchmark.
- [[temporal-grounding]] — una delle 6 skill core.
- [[video-summarization]] — skill Sum.
- [[video-reasoning]] — skill Rea.
- [[key-information-retrieval]] — skill KIR.
- [[entity-recognition]] — skill ER.
- [[event-understanding]] — skill EU.
- [[clue-duration]] — concetto analogo a certificate length, di [[egoschema]].
- [[certificate-length]] — non usato esplicitamente ma concettualmente vicino.
- [[multiple-choice-qa]] — formato.
- [[ring-attention]] — citato per LWM.
- [[q-former]] — usato da Video-LLaMA.
- [[3d-rope]] — introdotta da Qwen2-VL per long-video.
- [[ego4d]] — non usato direttamente ma menzionato come dominio di EgoSchema.
- [[video-mme]] — confronto in Tab. 1.
- [[mvbench]] — citato in Tab. 1.
- [[egoschema]] — citato in Tab. 1.
- [[movieqa]] — citato in Tab. 1.
- [[longvideobench]] — citato in Tab. 1.
- [[moviechat-benchmark]] — citato in Tab. 1.
- [[gemini-1-5-pro]] — modello valutato (sorprendentemente debole, 33.1 %).
- [[gemini-2-5-pro]] — top performer.
- [[gpt-4o]] — modello valutato.
- [[gpt-4-1]] — modello valutato.
- [[qwen2-vl]] — modello valutato.
- [[qwen2-5-vl]] — modello valutato.
- [[mplug-owl3]] — modello valutato.
- [[videollama-3]] — modello valutato.
- [[seed1-5-vl]] — secondo top performer.
- [[llava-onevision]] — modello valutato.
- [[internvl2]] — modello valutato.
- [[cogvlm2]] — modello valutato.
- [[mr-video]] — modello "MapReduce" per long video.
- [[adaretake]] — modello con adaptive redundancy reduction.
- [[mm-star]] — citato come motivazione per il dual-LLM blind filter.

## Citazioni dirette

> "We define long videos as those having a minimum duration of 30 minutes and containing rich, dynamic visual information with multiple events and scene transitions." (§3.1, p. 3)

> "We utilized two powerful large language models, GLM-4 and GPT-4, to independently generate answers for all the questions. In cases where the outputs from both models were identical and matched the ground truth answer, we removed that particular data sample from the dataset." (§3.4, p. 5)

> "A significant performance gap persists between proprietary and open-source models. The top-performing open-source models … scored 45.3 and 44.0, respectively, lagging behind Gemini-2.5-Pro by over 20%." (§4.2, p. 7)

> "Despite explicitly constraining the output in the prompt to be one of four provided answer choices, Gemini-1.5-Pro generated responses outside of the specified options 20.9% of the time." (§4.3, p. 7)

> "A limitation of our benchmark is the exclusion of audio data. While audio can provide valuable context, we did not include it because most current models lack effective audio processing capabilities." (§5 Limitations, p. 8)
