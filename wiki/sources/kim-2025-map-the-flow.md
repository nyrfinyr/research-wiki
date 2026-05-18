---
title: "Kim, Kim & Han (2025) — Map the Flow: Revealing Hidden Pathways of Information in VideoLLMs"
type: source
tags: [video-llm, mechanistic-interpretability, attention-knockout, logit-lens, temporal-reasoning, video-qa, information-flow, early-exit]
created: 2026-05-15
updated: 2026-05-15
source_path: raw/papers/kim-2025-map-the-flow.pdf
source_kind: paper
source_date: 2025-10-15
doi: 10.48550/arXiv.2510.13251
zotero_key: 8CKDZ2MF
venue: ICLR 2026
authors: [Minji Kim, Taekyung Kim, Bohyung Han]
year: 2025
---

# Kim, Kim & Han (2025) — Map the Flow: Revealing Hidden Pathways of Information in VideoLLMs

## TL;DR

Studio di **interpretabilità meccanicistica** sui Video LLM (LLaVA-NeXT-7B/13B-Video-FT, Mini-InternVL-4B-Video-FT, VideoLLaMA3-7B): gli autori usano **Attention Knockout** (Geva et al. 2023) e **Logit Lens** (nostalgebraist 2020) per ricostruire il *come* e il *dove* i Video LLM eseguono ragionamento temporale durante la VideoQA. Identificano un pipeline ricorrente in 4 stadi: (1) **cross-frame interactions** tra token video nei layer early-to-middle, (2) **video-language integration** sui *temporal keyword* del prompt nei layer middle, (3) la probabilità della risposta corretta sale bruscamente nei layer middle-to-late, (4) attivare solo i "pathway efficaci" individuati conserva la performance VideoQA sopprimendo fino al **58% degli edge di attenzione** (LLaVA-NeXT-7B-Video-FT). Il lavoro fornisce un blueprint per pruning di attenzione strutturato, early-exit e regolarizzazione dei pathway dominanti nei Video LLM, e mostra che il fine-tuning su VideoQA induce *specificamente* la dipendenza cross-frame nei layer early-middle (cosa assente nel solo ImageLLM precursore).

## Contributo principale

- Prima caratterizzazione end-to-end del *flusso interno* dell'informazione nei Video LLM su VideoQA: ragionamento temporale strutturato in 4 fasi consistenti su 4 modelli e 5 task TVBench, validata anche su TOMATO e LongVideoBench [source: raw/papers/kim-2025-map-the-flow.pdf §3, §A, Tab. 3, Tab. A].
- Evidenza che il video-instruction-tuning aggiunge esplicitamente l'abilità di **cross-frame attention** nei layer 1-16, *assente* nel modello solo immagine (LLaVA-NeXT-7B vs LLaVA-NeXT-7B-Video-FT, Fig. 2) [source: raw/papers/kim-2025-map-the-flow.pdf §3.2, Tab. 2].
- Identificazione dei **temporal keyword** (verbi, option token nel prompt) come **checkpoint** di integrazione video-language, e validazione causale: tenendo solo i pathway efficaci si conserva accuracy VideoQA con il **42-58%** degli edge originali (Tab. 3) [source: raw/papers/kim-2025-map-the-flow.pdf §3.3, §3.5].

## Metodo

### Setup (§3.1)

- **Task**: 5 task da [[tvbench]] (Cores et al. 2024), benchmark VideoQA che minimizza bias da scena statica — Action Antonym, Action Sequence, Scene Transition, Moving Direction, Object Count (Tab. 1).
- **Filtro**: solo sample dove il modello risponde correttamente (per garantire causal tracing valido).
- **Backbone primario**: LLaVA-NeXT-7B (image-only) fine-tunato 3 epoche su VideoChat2-IT → **LLaVA-NeXT-7B-Video-FT**, 8 frame × 144 token. Backbone aggiuntivi: LLaVA-NeXT-13B-Video-FT, Mini-InternVL-4B-Video-FT, VideoLLaMA3-7B (§E, §F).
- **Benchmark estesi**: TVBench, TOMATO, VCGBench (open-ended), LongVideoBench (long-form), Video-MME.

### Attention Knockout (§2.2)

Per disabilitare il flusso di informazione da token sorgente `s` verso token target `t` al layer `l`, si setta `M^l[s,t] = −∞` nella softmax dello scaled dot-product attention (Eq. 1). Si misura la variazione percentuale relativa di probabilità della risposta `a`: `(p_knockout − p_base)/p_base × 100`. Le ablation usano una *window* `k=9` layer centrata su `l` (per evitare che residual connection bypassino l'intervento; sensitività in §G.6).

### Logit Lens (§3.3)

Proiezione dei hidden state dei token video per ogni layer attraverso il language-model head, e conteggio della frequenza dei *keyword* spaziali e temporali estratti dal prompt. Visualizzazione delle posizioni patch dei token che attivano un dato concept (Fig. 5, Fig. F).

### Pipeline trovata (Fig. 1, §3.2-3.4)

1. **Cross-frame interactions** (layer 1-16, early-to-middle): i token video formano rappresentazioni spaziotemporali interagendo tra frame. Bloccare queste interazioni cala l'accuracy di 18-60.8 punti percentuali a seconda del task (Tab. 2).
2. **Video-language integration sui temporal keyword** (layer 6-20): l'informazione video viene propagata selettivamente verso i token delle *option corrette* del prompt (Fig. 7-8). Pathway diretto vs indiretto (via non-option question) varia per task.
3. **Concept emergence** (Logit Lens, §3.3): i concetti **spaziali** emergono già nei layer molto early sui token foreground; i concetti **temporali** ("eat", "sit", "hold", "up", "down") emergono solo nei layer middle, e su patch *residue* anziché sovrascrivere quelli spaziali stabilizzati (Fig. 5).
4. **Answer generation** (layer 16-25, middle-to-late): la probabilità del true option al last-token *salta* attorno al layer 20, immediatamente dopo il completamento dell'integrazione (Fig. 9). Non c'è competizione graduale fra le option: la corretta domina rapidamente.
5. **Failure case analysis** (§4): nei sample sbagliati il pattern di cross-modal integration è simile a quello dei successi, ma i sample sbagliati hanno due failure mode primari — (Case 1) cross-frame interaction spurie nei layer early che convogliano segnale errato, (Case 2) bias statico, cioè il modello collassa su evidenza static-scene in assenza di cross-frame attention efficace.

### Pruning strutturato di attention edge (§3.5)

Si attiva l'attention **solo** dentro layer-range identificati come efficaci: cross-frame interaction L6-15, video→question L6-20, question→last L16-25; si **disabilitano** invece video→last, last→last globalmente e i flussi entranti in video/question nei layer tardivi. Si confronta con un baseline a *random blocking* dello stesso budget.

## Risultati chiave

### Cross-frame ablation (Fig. 2, Tab. 2)

Bloccare cross-frame attention nei layer 1-16 causa accuracy drop su LLaVA-NeXT-7B-Video-FT:
- Action Antonym **−24.1%**
- Action Sequence **−20.2%**
- Scene Transition **−18.0%**
- Moving Direction **−44.8%**
- Object Count **−60.8%**

Il modello arriva a generare risposte *opposte* (es. "moves to the **left**" invece di "to the **right**"). Per LLaVA-NeXT-7B (image-only) la sensitività layer-wise è quasi piatta: il fine-tuning su video è il responsabile.

### Effective pathways vs random blocking (Tab. 3)

| Modello | Edge totali | Pathway efficaci | TVBench | TOMATO |
|---|---|---|---|---|
| LLaVA-NeXT-7B-Video-FT | 25.7M (100%) | full causal 51.5 / efficaci 51.2 / random 40.1 | (42% edge) | 30.2 / 29.2 / 23.1 |
| LLaVA-NeXT-13B-Video-FT | 32.2M | 55.1 / 54.6 / 41.5 | (37%) | 27.2 / 27.4 / 23.8 |
| Mini-InternVL-4B-Video-FT | 74.6M | 56.0 / 56.0 / 41.0 | (40%) | 32.2 / 31.2 / 25.9 |
| VideoLLaMA3-7B | 19.9M | 55.2 / 57.2 / 22.2 | (58%) | 28.0 / 28.7 / 13.9 |

VideoLLaMA3-7B addirittura **migliora** (TVBench 55.2 → 57.2, TOMATO 28.0 → 28.7) sopprimendo il 42% degli edge: i pathway non-efficaci agiscono come noise. Il random blocking dello stesso budget crolla a 22.2 TVBench e 13.9 TOMATO — drop di 33+ punti rispetto agli effective pathway.

### Long-form (Tab. A, Appendix G.1)

Su LongVideoBench con LLaVA-NeXT-7B-Video-FT: full causal 46.1 → effective pathway (42% edge) 45.5 (−0.6 punti). Le pathway efficaci generalizzano al video lungo.

### Open-ended (Appendix B)

- Single-token: bloccando cross-frame layer 1-16 la probabilità del primo token risposta crolla in tutti e tre i task analizzati (Action Antonym, Moving Direction, Object Count). Senza option esplicite, è il **last token** stesso a fungere da checkpoint di integrazione (Fig. B).
- Multi-token (VCGBench Temporal QA): i verbi generati nella risposta diventano *nuovi checkpoint* dinamici. All'aumentare degli anchor generati, il flusso video → last si sposta progressivamente verso video → response → last (Fig. D).

### Video-language alignment (Fig. 6)

Quando il cross-frame è intatto, il token "begins" della query attende sui frame iniziali e "ends" sui finali (alignment semantico). Bloccando il cross-frame, l'attenzione collassa su prossimità posizionale, non semantica. Questa è la firma del fatto che i Video LLM imparano implicitamente ad **allineare** le rappresentazioni video con embedding linguistici di concetti temporali.

### Logit Lens visualization (Fig. 4, 5, F)

I concetti spaziali (es. "floor", "paper", "person", "table") appaiono già nei layer 1-5 sui patch foreground; i concetti temporali (es. "eat", "sit", "hold") iniziano dai layer 11-15 in poi e si localizzano in patch *residui* — il modello stabilizza prima la spaziale e usa la capacità rimanente per la temporale.

## Limitazioni dichiarate

- L'analisi è ristretta a sample **correttamente risposti** per validità del causal tracing: i pattern descritti potrebbero essere meno netti su sample borderline.
- Tutti i Video LLM analizzati sono ottenuti da fine-tuning di MLLM image-based; comportamenti potrebbero differire in modelli pre-trained from scratch su video (non esistono ancora ad ampia scala).
- Il framework usa 8 frame con 144/256 token per frame. Long-form (LongVideoBench) testato solo in Appendix.
- Identificazione dei *temporal keyword* in open-ended si basa su POS-tagging (spaCy, verbi) — euristica, non oracolare.

## Domande aperte / critiche

- I "pathway efficaci" sono identificati empiricamente con layer-range fissi (Tab. E in appendice) per backbone: serve un metodo automatico per scoprire pathway model-specific senza grid search.
- Connessione diretta con visual token pruning: il fatto che il 58% degli edge sia inutile suggerisce che **token pruning** (cfr. Kim et al. 2026, [[stsp]]) e **edge pruning** siano complementari. Si può combinare SToP-style suppression di sink token con attention-edge pruning strutturato?
- Le failure mode "static bias" (Case 2 in §4) sono lo stesso fenomeno di [[attention-sink]] o "shortcut su language prior"? Non c'è quantificazione meccanicistica.
- L'autore ipotizza early-exit (Schuster 2022, Bae 2023) come applicazione: ma il salto di probabilità avviene attorno al layer 20 su 32-40, quindi il guadagno teorico è ~40% di FLOPs LLM. Non riportano benchmark di latency.
- Generalizzazione a **lunghi video con sampling adattivo di frame** o a *streaming inference* non esplorata.

## Concetti citati

- [[video-llm]]
- [[video-qa]]
- [[mechanistic-interpretability]]
- [[attention-knockout]]
- [[logit-lens]]
- [[causal-tracing]]
- [[cross-frame-attention]]
- [[video-language-integration]]
- [[temporal-reasoning]]
- [[temporal-keyword]]
- [[information-flow-pathway]]
- [[effective-pathways]]
- [[answer-generation-layer]]
- [[concept-emergence]]
- [[scaled-dot-product-attention]]
- [[causal-attention-mask]]
- [[multi-head-attention]]
- [[tvbench]]
- [[tomato-benchmark]]
- [[vcg-bench]]
- [[longvideobench]]
- [[video-mme]]
- [[llava-next]]
- [[llava-next-video-ft]]
- [[mini-internvl]]
- [[videollama-3]]
- [[videochat2-it]]
- [[mvbench]]
- [[early-exit]]
- [[pathway-regularization]]
- [[static-scene-bias]]
- [[fine-grained-video-understanding]]

## Citazioni dirette

> "temporal reasoning in VideoLLMs initiates with active cross-frame interactions in early-to-middle layers, … followed by progressive video-language integration in middle layers." (Abstract, p. 1)

> "VideoLLMs retain their VideoQA performance by selecting these effective information pathways while suppressing a substantial amount of attention edges, e.g., 58% in LLaVA-NeXT-7B-Video-FT." (Abstract, p. 1)

> "the model first grounds spatial concepts (e.g., salient entities or attributes) at foreground tokens in early layers, and later utilizes the remaining token positions to represent temporal dynamics, rather than overriding the already stabilized spatial representations." (§3.3, p. 6)

> "temporal keywords function as information integration checkpoints, with their specific pathways adapting to the underlying prompt structure." (§3.3, p. 8)

> "the prediction probability for the true option rises abruptly starting around the 20th layer, which coincides with the completion of the video-to-question information flow." (§3.4, p. 9)
