---
title: "Fu et al. (2025) — Video-MME: The First-Ever Comprehensive Evaluation Benchmark of Multi-modal LLMs in Video Analysis"
type: source
tags: [video-qa, benchmark, mllm, multimodal, long-video, subtitles, audio]
created: 2026-05-15
updated: 2026-05-15
source_path: raw/papers/fu-2025-video-mme.pdf
source_kind: paper
source_date: 2025-05-30
doi: 10.48550/arXiv.2405.21075
zotero_key: HUX79FUI
venue: arXiv preprint (CVPR 2025 community version)
authors: [Chaoyou Fu, Yuhan Dai, Yongdong Luo, Lei Li, Shuhuai Ren, Renrui Zhang, Zihan Wang, Chenyu Zhou, Yunhang Shen, Mengdan Zhang, Peixian Chen, Yanwei Li, Shaohui Lin, Sirui Zhao, Ke Li, Tong Xu, Xiawu Zheng, Enhong Chen, Caifeng Shan, Ran He, Xing Sun]
year: 2025
---

# Fu et al. (2025) — Video-MME: The First-Ever Comprehensive Evaluation Benchmark of Multi-modal LLMs in Video Analysis

## TL;DR

Video-MME è un benchmark di video question-answering "full-spectrum" pensato per i [[multimodal-large-language-model]]: 900 video curati manualmente da YouTube, 2.700 domande a scelta multipla (3 per video, 4 opzioni), distribuiti in modo bilanciato su tre fasce di durata — short (<2 min), medium (4–15 min), long (30–60 min). Le novità rispetto ai benchmark precedenti sono quattro: (1) diversità dei video (6 domini × 30 sottocategorie), (2) ampio range temporale (11 s – 1 h), (3) input multimodali (frame + sottotitoli + audio), (4) annotazione interamente manuale da parte di ricercatori con background vision-language. Su Video-MME, Gemini 1.5 Pro è il top closed-source (75.0 % frame-only, 81.3 % con sottotitoli), mentre il miglior open-source (VILA-1.5 34B) si ferma a 59.0 %; le performance calano monotonicamente con la durata e l'aggiunta di sottotitoli / audio aiuta di più sui video lunghi [source: raw/papers/fu-2025-video-mme.pdf §1, §4.2, Tab. 4–5].

## Contributo principale

- Primo benchmark video-MLLM "full-spectrum" che combina simultaneamente *diversità di dominio*, *range di durata 11 s – 1 h*, *modalità multiple* (visivo + sottotitoli + audio) e *annotazione totalmente manuale* — feature non presenti congiuntamente in MVBench, EgoSchema, Video-Bench, ActivityNet-QA, TempCompass ecc. (Tab. 1).
- Evidenza empirica che (i) le performance dei modelli decadono al crescere della durata del video, (ii) sottotitoli e audio aumentano l'accuracy in modo crescente con la durata, (iii) il bottleneck principale è il *long-context modeling*.
- Confronto fianco-a-fianco di 13 MLLM video, 3 MLLM immagine, 4 modelli closed-source (GPT-4V, GPT-4o, Gemini 1.5 Flash/Pro): mostra che gli MLLM immagine generalizzano in modo non banale al video (≈50 % accuracy multi-frame), validando il benchmark come "universale" per image+video MLLM (§4.2).

## Metodo

### Costruzione del dataset (§3.1)

Tre fasi:

1. **Video Collection**. Tassonomia top-down a 2 livelli: 6 domini primari — Knowledge, Film & Television, Sports Competition, Artistic Performance, Life Record, Multilingual — articolati in 30 sotto-categorie (es. *technology*, *documentary*, *news report*, *esports*, *magic show*, *fashion*). Per ogni sottocategoria si raccolgono video YouTube nelle 3 fasce: short < 2 min, medium 4–15 min, long 30–60 min. Si scaricano anche sottotitoli (quando disponibili) e tracce audio.
2. **QA Annotation**. Annotatori con background vision-language guardano l'intero video e creano 3 domande a scelta multipla per video, ciascuna con 4 opzioni → 2.700 QA pairs. Le domande coprono 12 task type, raggruppati in *perception*, *reasoning*, *information synthesis* (Fig. 2 in basso a destra).
3. **Quality Review**. Cross-review umano + filtro automatico: si passano le domande *text-only* a Gemini 1.5 Pro e si scartano quelle che risponde da solo. Statistica: Gemini 1.5 Pro raggiunge < 15 % accuracy nel setting text-only, segnale che il dataset richiede il video [source: raw/papers/fu-2025-video-mme.pdf §3.1, p. 4].

### Statistiche (§3.2)

- 900 video totali (300 short / 300 medium / 300 long), 744 con sottotitoli, **tutti** con audio.
- Durata media: short 80.7 s, medium 515.9 s, long 2466.7 s; complessivo 1017.9 s — circa **17 min** in media.
- Token medi per QA: 28.7 (short), 32.8 (medium), 45.6 (long); token medi sottotitoli: 198.6 / 1425.6 / 6515.6 (Tab. 1–2).
- Distribuzione delle opzioni A/B/C/D = 25.1 / 27.2 / 25.3 / 22.4 % — pressoché uniforme (§3.2).
- **Certificate length** (concetto preso da EgoSchema, [[egoschema]]): mediana 26 s / 164.7 s / 890.7 s per short/medium/long. Per le fasce medium e long la certificate length è considerevolmente più alta di quella di EgoSchema (Tab. 3, §3.2).

### Tassonomia delle domande (Fig. 2)

12 task types raggruppati in due famiglie:

- **Perception**: OCR, action recognition, attribute perception, object recognition, counting problems, spatial perception, temporal perception, action recognition.
- **Reasoning**: spatial reasoning, action reasoning, temporal reasoning, information synopsis.

Distribuzione dipendente dalla durata: nei video brevi prevalgono task di perception (object/action recognition), nei lunghi prevale il reasoning (§3.2, Fig. 2).

### Protocollo di valutazione (§4.1, §7)

Formato: `frame_video + sottotitoli/audio (opz.) + prompt_domanda`. Prompt standard:

> This video's subtitles are listed below: [Subtitles]. Select the best answer to the following multiple-choice question based on the video. Respond with only the letter (A, B, C, or D) of the correct option. [Question] The best answer is:

Accuracy = match diretto della lettera con la ground-truth via regex; **non** si usa ChatGPT come judge — scelta motivata per evitare bias di valutazione (§4.1, p. 7).

Frame sampling differenziato per modello: Gemini 1.5 Pro sample @ 1 fps (short/medium) e 0.5 fps (long); altri modelli usano la config ufficiale, p.es. GPT-4V 10 frame, GPT-4o 384 frame, Video-LLaVA 8, VideoChat2 16, ST-LLM 64, VILA-1.5 8, InternVL-Chat-V1.5 10 (§7).

Per la modalità "with subtitles" si selezionano solo i sottotitoli temporalmente allineati ai frame campionati (§7).

## Risultati chiave

### Performance globale (§4.2, Tab. 4)

| Model | Params | Short w/o subs | Medium w/o subs | Long w/o subs | Overall w/o subs | Overall w/ subs |
|---|---|---|---|---|---|---|
| Random | — | 25.0 | 25.0 | 25.0 | 25.0 | 25.0 |
| GPT-4V | — | 70.5 | 55.8 | 53.5 | 59.9 | 63.3 |
| GPT-4o | — | 80.0 | 70.3 | 65.3 | 71.9 | 77.2 |
| Gemini 1.5 Flash | — | 78.8 | 68.8 | 61.1 | 70.3 | 75.0 |
| **Gemini 1.5 Pro** | — | **81.7** | **74.3** | **67.4** | **75.0** | **81.3** |
| VILA-1.5 (best open-source) | 34B | 68.1 | 58.1 | 50.8 | 59.0 | 59.4 |
| VITA-1.5 | 7B | 67.0 | 54.2 | 47.1 | 56.1 | 58.7 |
| LLaVA-NeXT-Video | 34B | 61.7 | 50.1 | 44.3 | 52.0 | 54.9 |
| InternVL-Chat-V1.5 (image MLLM) | 20B | 60.2 | 46.4 | 45.6 | 50.7 | 52.4 |
| Qwen-VL-Max (image MLLM) | — | 55.8 | 49.2 | 48.9 | 51.3 | 51.2 |
| Video-LLaVA | 7B | 45.3 | 38.0 | 36.2 | 39.9 | 41.6 |

Tre osservazioni:

1. Tutti i modelli mostrano **monotono calo** dell'accuracy con la durata. Gemini 1.5 Pro perde ~14 % da short a long; VILA-1.5 perde ~17 %.
2. Gap closed-source ↔ open-source: ~16 punti tra Gemini 1.5 Pro e VILA-1.5; ~13 punti tra GPT-4o e VILA-1.5.
3. MLLM image (Qwen-VL-Max, InternVL-Chat-V1.5) raggiungono ~50 % multi-frame, vicini al video-MLLM LLaVA-NeXT-Video — segno che image-understanding è la base del video-understanding (§4.2).

### Impatto delle modalità ausiliarie (§4.3, Tab. 5)

Per Gemini 1.5 Pro:

| Modalità | Short | Medium | Long | Overall |
|---|---|---|---|---|
| Frames | 81.7 | 74.3 | 67.4 | 75.0 |
| Frames + Subs | 84.5 (+2.8) | 81.0 (+6.7) | 77.4 (+10.1) | 81.3 (+6.2) |
| Frames + Audio | 83.6 (+1.9) | 79.5 (+5.2) | 73.6 (+6.2) | 79.4 (+4.3) |

Findings:

- I sottotitoli aiutano sempre, l'audio quasi sempre.
- L'aiuto cresce con la durata: +2.8 su short → +10.1 su long per i sottotitoli.
- I sottotitoli > audio nella media (probabilmente perché i sottotitoli sono la trascrizione del parlato, mentre l'audio include rumori ambientali meno informativi).
- Nel sub-set Multilingual l'audio dà guadagni eccezionali (+11.5 overall, +12.5 long) probabilmente per qualità sottotitoli inferiore in lingue non-inglesi (§4.3).

### Cause del calo con durata (§4.3)

Tre cause concorrenti:

1. *Increased proportion of difficult tasks*: i video lunghi contengono in proporzione più domande di reasoning.
2. *Increased sparsity in frame sampling*: la maggior parte degli open-source usa N fisso di frame (es. 8 frame) → densità informativa cala al crescere della durata.
3. *Increased difficulty in long-context understanding*: anche Gemini 1.5 Pro, che scala il numero di frame con la durata, decade — il problema è intrinseco al long-context.

## Limitazioni dichiarate

- Solo formato multiple-choice (4 opzioni): non valuta open-ended generation.
- Video da YouTube → bias di dominio (sport, esports, news, ecc.) e dipendenza dal copyright YouTube.
- Audio fornito ma molti open-source non lo supportano → confronto audio è limitato ai closed-source (Gemini 1.5 Pro/Flash, GPT-4o).
- Annotazione manuale costosa e con potenziale bias annotatore.
- La filtraggio "Gemini-blind-test" usa **lo stesso modello** che poi è valutato come top performer: rischio di data leakage / overfitting impossibile da escludere completamente.

## Domande aperte / critiche

- Il filtro text-only usa Gemini 1.5 Pro, che è anche il modello valutato come top → giudice e parte. Sarebbe stato più robusto un ensemble di LLM diversi (cfr. [[lvbench]] che usa GLM-4 + GPT-4 con AND).
- Tab. 2 mostra che gli annotatori scrivono domande/opzioni più lunghe sui video lunghi: è un bias di confondimento con la difficoltà che il paper non discute.
- L'analisi del calo con la durata è correlazionale: non si distingue veramente tra (b) sparsità di sampling e (c) long-context modelling.
- Sub-categoria "Multilingual" è un solo gruppo (5 % del dataset?) ma riceve l'attenzione di una propria colonna in Tab. 5 — campione piccolissimo, varianza alta.
- Il dataset non è splittato in train/dev/test e l'accesso ai video è soggetto alle politiche YouTube: ripetibilità a lungo termine fragile (le clip possono sparire).
- Nessun *human baseline* riportato — non si sa quanto sia "il soffitto" del benchmark, a differenza di EgoSchema (76 %) e LVBench (94.4 %).

## Concetti citati

- [[multimodal-large-language-model]] — oggetto di valutazione del benchmark.
- [[video-question-answering]] — paradigma del task.
- [[multiple-choice-qa]] — formato delle domande.
- [[certificate-length]] — adottato da [[egoschema]] per misurare la difficoltà temporale intrinseca.
- [[long-context-modeling]] — bottleneck principale identificato.
- [[egoschema]] — confronto e benchmark precedente long-form.
- [[mvbench]] — benchmark precedente, citato in Tab. 1.
- [[lvbench]] — benchmark contemporaneo per long-video (citato in §2).
- [[gemini-1-5-pro]] — modello top-performer.
- [[gpt-4o]] — secondo modello closed-source.
- [[gpt-4v]] — predecessore di GPT-4o.
- [[vila]] — top open-source MLLM video.
- [[llava-next-video]] — open-source MLLM video valutato.
- [[videochat2]] — open-source MLLM video valutato.
- [[internvl-chat]] — image MLLM valutato.
- [[qwen-vl]] — image MLLM valutato.
- [[video-llava]] — open-source MLLM video valutato.
- [[clip]] — vision encoder citato come scelta standard.
- [[siglip]] — vision encoder citato.
- [[blip-2]] — predecessore Q-Former.
- [[q-former]] — modulo di compressione token visivi.
- [[ring-attention]] — citata come tecnica per long-context.
- [[flamingo]] — precursore con gated cross-attention.
- [[fuyu]] — architettura citata per pixel-to-embedding.
- [[ego4d]] — sorgente dei video di EgoSchema, citata indirettamente.

## Citazioni dirette

> "Video-MME, the first-ever full-spectrum, Multi-Modal Evaluation benchmark of MLLMs in Video analysis." (Abstract, p. 1)

> "Gemini 1.5 Pro is the highest-performing commercial model, achieving an average accuracy of 75%." (§1, p. 2)

> "Statistical analysis shows that Gemini 1.5 Pro achieves less than 15% accuracy in the text-only setup, underscoring the robustness of the video content-based requirement." (§3.1, p. 4)

> "We can also see that the effect of subtitles and audios is different in these six categories. These motivate future research to develop versatile models that can support a wider range of modality inputs." (§4.2, p. 7)

> "Understanding the long context of either single-modality (LLM) or multi-modality (MLLM) is always a great challenge." (§4.3, p. 8)
