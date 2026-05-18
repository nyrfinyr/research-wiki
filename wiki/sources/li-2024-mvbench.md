---
title: "Li et al. (2024) — MVBench: A Comprehensive Multi-modal Video Understanding Benchmark"
type: source
tags: [video-qa, benchmark, mllm, temporal-understanding, instruction-tuning, videochat2]
created: 2026-05-15
updated: 2026-05-15
source_path: raw/papers/li-2024-mvbench.pdf
source_kind: paper
source_date: 2024-05-23
doi: 10.48550/arXiv.2311.17005
zotero_key: WWAUW28Q
venue: CVPR 2024
authors: [Kunchang Li, Yali Wang, Yinan He, Yizhuo Li, Yi Wang, Yi Liu, Zun Wang, Jilan Xu, Guo Chen, Ping Luo, Limin Wang, Yu Qiao]
year: 2024
---

# Li et al. (2024) — MVBench: A Comprehensive Multi-modal Video Understanding Benchmark

## TL;DR

MVBench è un benchmark per video-MLLM costruito con un metodo **static-to-dynamic**: per ognuno dei 9 task statici comuni nei benchmark immagine (Action, Object, Position, Scene, Count, Attribute, Pose, Character, Cognition) gli autori derivano 20 versioni dinamiche che richiedono comprensione temporale (es. Position → Moving Direction, Count → Action Count). Le 4.000 domande multiple-choice (200 per task) sono generate automaticamente da 11 dataset video pubblici esistenti tramite ChatGPT, mantenendo la ground-truth dei dataset originali. Gli autori introducono inoltre **VideoChat2**, una baseline MLLM video allenata con un mix di 2M campioni instruction-tuning da 34 dataset, che supera VideoChat di **+15.6 %** e GPT-4V di **+16.9 %** su MVBench. Findings principali: tutti gli MLLM precedenti sono vicino al chance level su molti task temporali, ma con instruction-tuning massiccio + buon visual encoder (UMT-L) il gap si chiude considerevolmente [source: raw/papers/li-2024-mvbench.pdf §1, §5.1, Tab. 2].

## Contributo principale

- **Static-to-dynamic taxonomy** (Fig. 1): metodo sistematico per derivare task video da task immagine — 9 task spatial → 20 task temporal che non possono essere risolti da un singolo frame.
- **Pipeline automatica di generazione QA** che riusa annotazioni esistenti (STAR, PAXION, MiT V1, FunQA, CLEVRER, Perception Test, Charades-STA, MoVQA, NTU RGB+D, VLN-CE, TVQA): 200 QA × 20 task = **4.000** multiple-choice QA pairs.
- **VideoChat2**: MLLM video con visual encoder UMT-L, Q-Former a 64+32 query, training a 3 stadi (alignment / connection / instruction-tuning) su 2M sample da 34 sorgenti. Supera VideoChat di +15.6 %, GPT-4V di +16.9 % su MVBench; raggiunge SOTA su NExT-QA, STAR, EgoSchema (Fullset 54.4 %), IntentQA, MSVD/MSRVTT/ActivityNet-QA zero-shot.
- **Prompt design** "Best Option: (" che porta l'option-extraction rate al **100 %** vs 64–87 % delle metodologie precedenti (Tab. 9).

## Metodo

### Static-to-dynamic task design (§3.1)

L'idea chiave: partire da 9 task statici dei benchmark immagine (MME, MMBench) e introdurre evoluzione temporale per generare task video. Esempi:

- Image Position ("Is the man on the stage?") → Video Moving Direction ("What direction is the man moving?")
- Image Action → Video Action Sequence / Prediction / Antonym / Fine-grained / Unexpected
- Image Count → Action Count / Moving Count
- Image Attribute → Moving Attribute / State Change

I 20 task finali coprono **6 famiglie spatial × dimensione temporal**:

| Famiglia | Task derivati |
|---|---|
| **Action** | (1) Action Sequence, (2) Action Prediction, (3) Action Antonym, (4) Fine-grained Action, (5) Unexpected Action |
| **Object** | (6) Object Existence, (7) Object Interaction, (8) Object Shuffle |
| **Position** | (9) Moving Direction, (10) Action Localization |
| **Scene** | (11) Scene Transition |
| **Count** | (12) Action Count, (13) Moving Count |
| **Attribute** | (14) Moving Attribute, (15) State Change |
| **Pose** | (16) Fine-grained Pose |
| **Character** | (17) Character Order |
| **Cognition** | (18) Egocentric Navigation, (19) Episodic Reasoning, (20) Counterfactual Inference |

### Pipeline automatica di generazione QA (§3.2, Fig. 2)

Tre passaggi:

1. **Data Filtration** su 11 dataset pubblici:
   - *Video Diversity*: prima/terza persona, indoor/outdoor.
   - *Temporal Sensitivity*: esclude clip troppo brevi (motion trascurabile) o troppo lunghi (contesto troppo complesso); range tipico **5–35 s**.
   - *Question Difficulty*: per STAR si shifta randomicamente start/end per aumentare difficoltà; per CLEVRER si scartano domande con > 10 condizioni descrittive (riduce difficoltà eccessiva).
2. **QA Generation**:
   - *Template-based*: per task come Action Antonym e Moving Direction le opzioni sono direttamente i candidati template (azione corretta, antonimo, "not sure"; direzioni up/down/left/right + stationary).
   - *LLM-based*: per Unexpected Action si usa ChatGPT per convertire open-ended QA originale in MCQ. Le 3–5 opzioni vengono shufflate e si forza similarità di lunghezza tra opzioni per evitare leak.
3. **Answer Option Processing**: shuffle + bilanciamento di lunghezza via LLM.

Risultato: 200 QA per ognuno dei 20 task = **4.000 QA totali**.

### Prompt design per la valutazione (§3.3)

Si definisce un **system prompt** che enfatizza la temporal evolution:

> Carefully watch the video and pay attention to the cause and sequence of events, the detail and movement of objects and the action and pose of persons. Based on your observations, select the best option that accurately addresses the question.

E un **answer prompt** che rende l'option extraction deterministica:

> Best Option: (

L'extraction-rate sale al **100 %** vs 78–96 % delle baseline (Tab. 9), permettendo accuracy come metrica affidabile senza usare LLM judge (a differenza di MMBench [49] e VideoChatGPT).

### VideoChat2 (§4)

**Architettura**:

- Visual encoder: [[umt-l]] (Unified Masked Transformer Large) — scelta motivata dalla forte capacità spatial-temporal vs EVA-CLIP-g (Tab. 6).
- Q-Former (BERT-base): 32 query in Stage 1, +64 query random-initialized in Stage 2/3 → 96 query totali.
- LLM: Vicuna-7B v0 di default; varianti con Vicuna-13B, Vicuna-7B v1.5, e infine **Mistral-7B** che dà i migliori risultati.
- LoRA r=16, α=32, dropout 0.1 sulla LLM in Stage 3.

**Training progressivo a 3 stadi (Fig. 4)**:

- **Stage 1 — Vision-Language Alignment**: freeze visual encoder, train Q-Former con loss VTC + VTM + VTG su 15M image caption (CC3M, CC12M) + 10M video caption (WebVid-10M); 4-frame, 10 epoch.
- **Stage 2 — Vision-Language Connection**: linear projection + connect to LLM (frozen); unfreeze visual encoder; aggiunge 2M image caption (COCO, Visual Genome, SBU) + 10M video caption (InternVid). 1 epoch.
- **Stage 3 — Instruction Tuning**: 2M campioni instruction-tuning da **34 dataset** in 6 categorie:
  1. *Conversation* (LLaVA, VideoChat, VideoChatGPT)
  2. *Simple Caption* (COCO Caption, WebVid, YouCook2)
  3. *Detailed Caption* (MiniGPT-4, LLaVA, VideoChat, Paragraph Captioning, TextCaps, TextVR)
  4. *VQA* (VQAv2, GQA, TGIF-QA, WebVidQA, OK-VQA, AOK-VQA, ViQuAE, OCR-VQA, TextVQA, ST-VQA, DocVQA, Ego4D EgoQA)
  5. *Reasoning* (LLaVA-reasoning, CLEVR, VisualMRC, NExT-QA, CLEVRER)
  6. *Classification* (ImageNet, COCO-ITM, Kinetics-710, SthSthV2)
  - 8-frame, 3 epoch, LoRA su LLM, instruction (non question) inserita anche nel Q-Former.

**Inferenza**: 16-frame, 224×224.

## Risultati chiave

### Benchmark MVBench (Tab. 2, accuracy media su 20 task)

| Model | LLM | Avg |
|---|---|---|
| Random | — | 27.3 |
| MiniGPT-4 | Vicuna-7B | 18.8 |
| VideoLLaMA | Vicuna-7B | 34.1 |
| LLaMA-Adapter | LLaMA-7B | 31.7 |
| BLIP-2 | FlanT5-XL | 31.4 |
| Otter-I | MPT-7B | 33.5 |
| InstructBLIP | Vicuna-7B | 32.5 |
| LLaVA | Vicuna-7B | 36.0 |
| Otter-V | LLaMA-7B | 26.8 |
| mPLUG-Owl-V | LLaMA-7B | 29.7 |
| VideoChatGPT | Vicuna-7B | 32.7 |
| VideoChat | Vicuna-7B | 35.5 |
| **VideoChat2text** (text-only) | Vicuna-7B | 34.7 |
| **VideoChat2** | Vicuna-7B | **51.1** |
| GPT-4V (16 frame, 512×512) | GPT-4 | 43.5 |
| **VideoChat2 + Mistral-7B** | Mistral-7B | **60.4** |

Findings:

- **Quasi tutti gli MLLM pre-VideoChat2 sono vicini a random** (27.3) su molti task; VideoChat e VideoChatGPT non superano significativamente VideoChat2text (text-only) → segno che molti MLLM non sfruttano davvero la temporal information.
- VideoChat2 supera VideoChat di **+15.6 punti** (51.1 vs 35.5).
- Con Mistral come backbone, supera GPT-4V di **+16.9 punti** (60.4 vs 43.5).
- VideoChat2 è forte su action, object, scene, attribute, pose; **debole su position, count, character** (peggio di VideoChat2text), attribuito alla mancanza di esposizione a questi task durante l'instruction tuning.

### Cross-benchmark (Tab. 4, 15–18)

- **MSVD-QA / MSRVTT-QA / ActivityNet-QA** (zero-shot acc): VideoChat2 70.0 / 54.1 / 49.1 vs precedente SOTA VideoChatGPT 64.9 / 49.3 / 35.2.
- **NExT-QA**: VideoChat2 zero-shot 61.7 % (Temp 57.4 / Caus 61.9 / Desc 69.9); in-domain Mistral version 78.6.
- **STAR** (zero-shot): VideoChat2 59.0 avg (Mistral: 63.8).
- **TVQA** (zero-shot, no subtitles): VideoChat2 40.6 (Mistral: 46.4) vs precedente SOTA SeViLA 38.2.
- **EgoSchema Fullset zero-shot**: VideoChat2-Mistral 54.4 % (16 frame) vs InternVideo 32.1 (90 frame), mPLUG-Owl 31.1 (5 frame).
- **IntentQA**: VideoChat2-Mistral 83.4 (testing) — supera tutti i baseline ma resta sotto l'umano (78.5).

### Ablation (Tab. 5–14)

- **Instruction data scaling** (Tab. 5): più dati → meglio; image+video > solo video > solo image; 2M campioni → 51.1.
- **Visual encoder** (Tab. 6): UMT-L > EVA-CLIP-g di +6.2 punti.
- **LLM size**: Vicuna-7B v0 vs 13B → solo +0.3 punti. *MVBench dipende più dall'encoder visivo che dalla LLM.*
- **LoRA**: +2.5–3.1 punti consistenti.
- **Training method** (Tab. 7): unfreezing progressivo di Q-Former poi visual encoder → +12.6 punti totali.
- **Frame count** (Tab. 12): 16-frame ≥ 32 ≥ 64 ≥ 8; aumentare risoluzione **danneggia** (384×384 < 224×224).
- **Question prompt** (Tab. 14): "Let's think step by step" è dannoso (-0.6).
- **Q-Former queries** (Tab. 11): 32+64 query ottimo; inserire instruction (no question) nel Q-Former è utile.

### Failure analysis sui task hard

- **Position (Moving Direction, Action Localization)**: ~23 % — vicino a chance — nessun modello risolve bene.
- **Count (Action Count, Moving Count)**: anche VideoChat2 < 45 %; bottleneck riconosciuto come comune (vedi anche Video-MME §4.2 dove counting è "joint bottleneck").
- **Character Order**: stesso scenario.

## Limitazioni dichiarate

- VideoChat2 è debole su position, counting, character order — attribuito a limitata esposizione a tali task nell'instruction-tuning.
- "Minimal source gap" tra instruction data e MVBench: CLEVRER e SthSthV2 sono sia in instruction tuning *sia* sorgenti delle domande Moving Attribute, Counterfactual Inference, Action Antonym → la valutazione non è strettamente *out-of-domain*. Quantificato in Tab. 13: rimuovere CLEVRER fa scendere accuracy di 1.8 punti.
- Generazione automatica via ChatGPT può introdurre bias (anche se l'option-shuffle e length-balancing mitigano).
- Il benchmark esclude video troppo brevi o troppo lunghi (5–35 s) → non valuta long-video understanding.

## Domande aperte / critiche

- **Range temporale ristretto (5–35 s)**: MVBench non è long-video. Per long-video understanding cfr. [[egoschema]] (3 min), [[video-mme]] (fino a 1 h), [[lvbench]] (fino a multi-ora). Il benchmark misura "temporal understanding" su clip brevi, non "long-form".
- L'**overlap tra training set di VideoChat2 e MVBench** (CLEVRER, SthSthV2) compromette in parte la fairness della baseline: VideoChat2 è ottimizzata praticamente per il proprio benchmark.
- I 20 task non sono ortogonali: Action Sequence richiede Action Recognition + Temporal Reasoning; Action Localization è in pratica anche Temporal Grounding. La tassonomia 9-spatial × dynamics è elegante ma alcune cellule si sovrappongono.
- Generazione automatica via ChatGPT: scarsa controllo sui distrattori plausibili — alcuni task (Counterfactual Inference su CLEVRER) potrebbero essere risolti con shortcut testuali.
- Solo 200 QA per task: stima dell'accuracy ha intervallo di confidenza ~±3.5 % su singolo task (a 50% baseline). I gap di < 3 punti tra modelli su singoli task non sono statisticamente significativi.
- L'option-extraction "Best Option: (" è ottimo per accuracy ma forza il modello in una modalità rigida — è opinabile se aiuti la valutazione di reasoning complesso.
- L'audio non è considerato — confronto interessante con [[video-mme]] che invece lo include.

## Concetti citati

- [[multimodal-large-language-model]] — oggetto di valutazione.
- [[video-question-answering]] — task.
- [[multiple-choice-qa]] — formato.
- [[temporal-understanding]] — competenza misurata.
- [[static-to-dynamic-taxonomy]] — metodologia introdotta.
- [[videochat2]] — baseline MLLM proposta.
- [[videochat]] — predecessore.
- [[videochatgpt]] — predecessore.
- [[video-llama]] — confronto.
- [[mplug-owl]] — confronto.
- [[llama-adapter]] — confronto.
- [[blip-2]] — confronto.
- [[otter]] — confronto.
- [[instructblip]] — confronto.
- [[minigpt-4]] — confronto.
- [[llava]] — confronto.
- [[gpt-4v]] — confronto.
- [[umt-l]] — visual encoder usato da VideoChat2.
- [[q-former]] — compressore token visivi.
- [[vicuna]] — LLM backbone.
- [[mistral]] — LLM backbone (variante migliore).
- [[lora]] — fine-tuning parameter-efficient.
- [[flash-attention]] — usata per training efficiente.
- [[clevrer]] — sorgente per Moving Attribute, Counterfactual Inference, Moving Count, Moving Direction, Object Existence.
- [[star-benchmark]] — sorgente per Action Sequence/Prediction, Object Interaction.
- [[perception-test]] — sorgente per Object Shuffle, Action Count, State Change, Character Order.
- [[charades-sta]] — sorgente per Action Localization.
- [[moments-in-time]] — sorgente per Fine-grained Action.
- [[ntu-rgbd]] — sorgente per Fine-grained Pose.
- [[funqa]] — sorgente per Unexpected Action.
- [[vln-ce]] — sorgente per Egocentric Navigation.
- [[tvqa]] — sorgente per Episodic Reasoning.
- [[movqa]] — sorgente per Scene Transition.
- [[paxion]] — sorgente per Action Antonym.
- [[ego4d]] — usato come sorgente di EgoQA in instruction-tuning.
- [[webvid]] — caption training data.
- [[internvid]] — caption training data Stage 2.
- [[kinetics-710]] — classification data.
- [[egoschema]] — citato come benchmark di confronto e zero-shot eval.
- [[next-qa]] — confronto zero-shot e in-domain.
- [[intentqa]] — confronto.
- [[seek-vila]] — SeViLA citato come precedente SOTA.
- [[chain-of-thought]] — testato nei prompt (peggiorativo, Tab. 14).
- [[mme]] — citato come reference image benchmark.
- [[mmbench]] — citato come benchmark di confronto.
- [[seed-bench]] — confronto.

## Citazioni dirette

> "We introduce a comprehensive Multi-modal Video understanding Benchmark, namely MVBench, which covers 20 challenging video tasks that cannot be effectively solved with a single frame." (Abstract, p. 1)

> "We propose a Multi-modal Video understanding Benchmark (MVBench), which aims at comprehensively evaluating the temporal perception capabilities of MLLMs in the open world." (§1, p. 2)

> "Our VideoChat2 markedly exceeds the leading model by over 15%, particularly excelling in categories like action, object, scene, attribute, and pose recognition. However, it struggles in position, count, and character tasks." (§5.1, p. 7)

> "Note that there is a minimal source gap between our instruction data and MVBench. Specifically, the CLEVRER in our instruction data has similar questions as Moving Attribute and Counterfactual Inference in MVBench, leading the evaluation is not strictly out-domain." (Appendix B, p. 9)

> "Large resolution is harmful, while more frames are better for MVBench." (Tab. 12 caption, p. 9)
