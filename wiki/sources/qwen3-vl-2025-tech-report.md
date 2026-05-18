---
title: "Qwen Team (2025) — Qwen3-VL Technical Report"
type: source
tags: [vision-language-model, video-llm, qwen, mixture-of-experts, long-context, mrope, deepstack, siglip, instruction-tuning, dpo, reinforcement-learning, multimodal]
created: 2026-05-15
updated: 2026-05-15
source_path: raw/papers/qwen3-vl-2025-tech-report.pdf
source_kind: paper
source_date: 2025-12-01
doi: 10.48550/arXiv.2511.21631
zotero_key: TWTBTSPP
venue: technical report (arXiv 2511.21631v2)
authors: [Qwen Team, Shuai Bai, Yuxuan Cai, Ruizhe Chen, Keqin Chen, Xionghui Chen, Zesen Cheng, Lianghao Deng, Wei Ding, Chang Gao, Chunjiang Ge, Wenbin Ge, Zhifang Guo, Qidong Huang, Jie Huang, Fei Huang, Binyuan Hui, Shutong Jiang, Zhaohai Li, Mingsheng Li, Mei Li, Kaixin Li, Zicheng Lin, Junyang Lin, Xuejing Liu, Jiawei Liu, Chenglong Liu, Yang Liu, Dayiheng Liu, Shixuan Liu, Dunjie Lu, Ruilin Luo, Chenxu Lv, Rui Men, Lingchen Meng, Xuancheng Ren, Xingzhang Ren, Sibo Song, Yuchong Sun, Jun Tang, Jianhong Tu, Jianqiang Wan, Peng Wang, Pengfei Wang, Qiuyue Wang, Yuxuan Wang, Tianbao Xie, Yiheng Xu, Haiyang Xu, Jin Xu, Zhibo Yang, Mingkun Yang, Jianxin Yang, An Yang, Bowen Yu, Fei Zhang, Hang Zhang, Xi Zhang, Bo Zheng, Humen Zhong, Jingren Zhou, Fan Zhou, Jing Zhou, Yuanzhi Zhu, Ke Zhu]
year: 2025
---

# Qwen Team (2025) — Qwen3-VL Technical Report

## TL;DR

Qwen3-VL è la versione 3 della famiglia di vision-language model di Alibaba: 4 varianti dense (**2B / 4B / 8B / 32B**) + 2 MoE (**30B-A3B** e **235B-A22B**), tutte con context window nativa di **256K token** che integra testo + immagine + video in maniera interleavata. Tre upgrade architetturali rispetto a [[qwen2-5-vl|Qwen2.5-VL]]: (1) **Interleaved MRoPE**, che ridistribuisce le dimensioni temporal/height/width su tutto lo spettro di frequenze per evitare lo *spectral bias* della MRoPE chunked; (2) **DeepStack**, che inietta feature da 3 layer intermedi del ViT in altrettanti layer dell'LLM via residual connection, senza allungare il context; (3) **textual timestamp tokens** (`<3.0 seconds>`) al posto del T-RoPE absolute-time-aligned di Qwen2.5-VL. Pre-training in 4 stage (alignment merger → multimodal pretrain 8K → long-context 32K → ultra-long 256K) per ~2.2T token totali; post-training in tre fasi (SFT su 1.2M campioni con phase 32K poi 256K → strong-to-weak distillation testuale → RL con SAPO) e versioni "instruct" e "thinking". Square-root re-weighting per bilanciare loss text vs multimodal. SOTA o competitivo vs Gemini 2.5 Pro / GPT-5 / Claude Opus 4.1 su STEM, OCR, document understanding, video understanding (specialmente long video), 2D/3D grounding, GUI agent [source: raw/papers/qwen3-vl-2025-tech-report.pdf §1, §2].

## Contributo principale

- **Interleaved MRoPE**: la MRoPE originale di [[qwen2-vl|Qwen2-VL]] partiziona le dimensioni dell'embedding in chunk temporal/height/width con frequenze distinte, creando uno *spectral imbalance* che degrada long-video understanding. Qwen3-VL distribuisce t,h,w *interleaved* su tutto lo spettro di frequenze (low + high) per ogni asse [source: raw/papers/qwen3-vl-2025-tech-report.pdf §2.1].
- **DeepStack** applicata al ViT: visual token da 3 layer intermedi del vision encoder vengono proiettati con merger dedicati e *sommati* agli hidden state dei primi 3 layer dell'LLM. Aumenta vision-language alignment e preserva feature low/high-level senza estendere il context [source: raw/papers/qwen3-vl-2025-tech-report.pdf §2.2].
- **Text-based timestamps**: invece di T-RoPE che lega gli ID temporali al tempo assoluto (con ID enormi e sparsi su long video), Qwen3-VL prefigge a ogni temporal patch un timestamp testuale formattato (in `seconds` o `HMS`). Risolve due limiti del Qwen2.5-VL: sparsità degli ID temporali e necessità di sampling uniforme su fps diversi [source: raw/papers/qwen3-vl-2025-tech-report.pdf §2.3].
- **Square-root reweighting**: per-token loss normalizzata da `sqrt` invece di per-sample, bilancia testo e multimodale durante training; senza perdita di capacità text-only [source: raw/papers/qwen3-vl-2025-tech-report.pdf abstract, §1].
- **Bifurcazione thinking / non-thinking**: due varianti post-trained, la thinking esplicita CoT esteso con context fino a 81 920 token su task come AIME-25 / HMMT-25 / LiveCodeBench [source: raw/papers/qwen3-vl-2025-tech-report.pdf §5.11].
- **Multilingual OCR**: da 10 lingue (Qwen2.5-VL) a **39 lingue** con >70% accuracy su 32/39 [source: raw/papers/qwen3-vl-2025-tech-report.pdf §5.4, Fig. 2].

## Metodo

### Architettura

Tre moduli (come Qwen2.5-VL) [source: raw/papers/qwen3-vl-2025-tech-report.pdf §2]:

1. **Vision encoder** = [[siglip|SigLIP-2]] (`SigLIP2-SO-400M` di default; `SigLIP2-Large 300M` per le varianti 2B/4B), inizializzato dai checkpoint ufficiali e fine-tuned con dynamic resolution. Usa 2D-RoPE con interpolation degli absolute position embedding (seguendo CoMP).
2. **MLP-based vision-language merger**: MLP a due layer che comprime feature `2×2` del ViT in un singolo visual token. Ci sono inoltre *merger dedicati* per il path DeepStack (uno per ciascuno dei 3 layer ViT campionati).
3. **LLM backbone** = [[qwen|Qwen3]] (Yang et al., 2025a). Le varianti:

| Variante | Tipo | Param totali | Attivati / token |
|---|---|---|---|
| Qwen3-VL-2B | dense | 2 B | 2 B |
| Qwen3-VL-4B | dense | 4 B | 4 B |
| Qwen3-VL-8B | dense | 8 B | 8 B |
| Qwen3-VL-32B | dense | 32 B | 32 B |
| Qwen3-VL-30B-A3B | MoE | 30 B | 3 B |
| Qwen3-VL-235B-A22B | MoE | 235 B | 22 B |

Tutte addestrate con context **256K**. Il flagship 235B-A22B "outperforms most VLMs across a broad set of multimodal tasks and surpasses its text-only counterpart on the majority of language benchmarks" [source: raw/papers/qwen3-vl-2025-tech-report.pdf §2, p. 2].

### Interleaved MRoPE

In MRoPE-chunked (Qwen2-VL/2.5-VL), le dimensioni dell'embedding venivano divise in tre blocchi (t, h, w) ciascuno con un range di frequenze rotary diverso → spectral bias: la dimensione "t" copre solo certe frequenze, degradando long-video [source: raw/papers/qwen3-vl-2025-tech-report.pdf §2.1]. Qwen3-VL ridistribuisce t/h/w *interleaved* lungo l'embedding, in modo che **ogni asse copra sia low che high frequencies** → mitiga lo spectral bias e migliora il positional modeling video.

### DeepStack

Adattamento del paper DeepStack (Meng et al., 2024) al ViT: si campionano feature da 3 layer del SigLIP-2; tre merger dedicati proiettano nello spazio dell'LLM; i visual token risultanti sono **sommati come residual ai primi 3 layer dell'LLM** [source: raw/papers/qwen3-vl-2025-tech-report.pdf §2.2]. Vantaggi: preserva info low-level (texture, edges) accanto a feature high-level; nessun aumento di context length.

### Video Timestamps

Limiti diagnosticati del T-RoPE (Qwen2.5-VL):
1. Position IDs temporali troppo grandi/sparsi per video lunghi → degradazione long temporal context.
2. Richiede sampling uniforme su tanti fps, costoso da costruire.

Soluzione Qwen3-VL: prima di ogni temporal patch, si inserisce un **token testuale di timestamp** formato `<3.0 seconds>`. Training su due formati (sec e `HH:MM:SS`) per imparare entrambe le rappresentazioni. Costo: leggero aumento di context [source: raw/papers/qwen3-vl-2025-tech-report.pdf §2.3].

### Pre-training (4 stage, ~2.2T token totali)

| Stage | Obiettivo | Trainable | Token budget | Sequence length |
|---|---|---|---|---|
| S0 | Vision-Language Alignment | solo merger | 67 B | 8 192 |
| S1 | Multimodal Pre-Training (full) | tutti | ~1 T | 8 192 |
| S2 | Long-Context Pre-Training | tutti | ~1 T | 32 768 |
| S3 | Ultra-Long-Context Adaptation | tutti | 100 B | 262 144 |

Curriculum dati (§3.2):
- **Image caption + interleaved**: re-caption con Qwen2.5-VL-32B fine-tuned per recaptioning; deduplicazione semantica; clustering per coverage. Interleaved book-scale fino a 256K token usando un parser Qwen2.5-VL-7B.
- **Knowledge**: long-tail entity sampling importance-weighted.
- **OCR e document parsing**: 30M sample OCR in-house + 29 lingue aggiuntive sintetizzate; 3M PDF da Common Crawl + 4M interni; formati `QwenVL-HTML` (con bbox element-level) e `QwenVL-Markdown` (con tabelle in LaTeX).
- **Grounding & counting**: coordinate normalizzate `[0, 1000]` (cambio rispetto a Qwen2.5-VL che usava coordinate native). Bounding box + point-based grounding.
- **Spatial / 3D**: 9-DoF bounding box in JSON, unificate via Omni3D in virtual camera coordinate system.
- **Code**: text-only Qwen3-Coder corpus + multimodal (UI→HTML/CSS, image→SVG, flowchart→code).
- **Video**: dense caption short-to-long, spatio-temporal video grounding, length-adaptive sampling (fps e max frame variabili per stage).
- **STEM**: 1M point-grounding + 2M perception VQA + 6M annotated diagram caption + 60M esercizi K-12/undergrad + 12M long-CoT multimodal sample.
- **Agent (GUI / function calling / search)**: tracce multi-step su desktop/mobile/web con CoT augmentation.

### Post-training (3 fasi)

1. **SFT** (§4.2.1): dataset di ~1.2M sample (1/3 text-only, 2/3 multimodal). Strategia a due fasi: 1 epoch a 32K seq → 1 epoch a 256K seq con curriculum interleavato 256K/32K. Long context include documenti tecnici di centinaia di pagine, libri, video fino a 2 ore. Query filtering + response filtering (rule-based + reward-model basato su Qwen2.5-VL series).
   - **Long-CoT cold start** (§4.2.2): ~1:1 VL/text, focus STEM e agentic. Filter "Multimodal Necessity": scarta sample che Qwen3-30B-nothink risolve senza l'immagine.
2. **Strong-to-Weak Distillation** (§4.3): off-policy (teacher → student response distillation) + on-policy (student response, KL alignment con teacher logits). Eseguita **solo con dati text-only**, ma migliora anche multimodal.
3. **Reinforcement Learning** (§4.4):
   - **Reasoning RL**: ~30K query verificabili (math, code, logic, visual grounding, visual puzzle), filter pass-rate>90%, algoritmo **SAPO** (Smooth and Adaptive Policy Optimization, Gao et al., 2025).
   - **General RL**: multi-task per istruzione following + preference alignment. Reward hybrid rule-based + Qwen2.5-VL-72B / Qwen3 come judge model.
   - **Thinking with Images** (§4.5): 2 stage di SFT + multi-turn tool-integrated RL su agent traces, tre reward signal (answer accuracy, multi-turn reasoning, tool-calling target dimensionato).

### Infrastructure

Train su Alibaba PAI-Lingjun via Megatron-LM con TP+PP+CP+EP+ZeRO-1 DP fino a 10 000 GPU. Inferenza con vLLM (PagedAttention) o SGLang [source: raw/papers/qwen3-vl-2025-tech-report.pdf §4.6].

## Risultati chiave

### Flagship: Qwen3-VL-235B-A22B vs frontier closed-source (§5, Tab. 2)

Tutti score "thinking" del Qwen3-VL-235B-A22B. `+` indica tool use.

| Benchmark | **Qwen3-VL 235B thinking** | Qwen3-VL 235B instruct | Gemini 2.5 Pro (thinking) | GPT-5 high | Claude Opus 4.1 (thinking) |
|---|---|---|---|---|---|
| MMMU | 80.6 | 78.7 | 81.7 | **84.2** | 78.4 |
| MMMU-Pro | 69.3 | 68.1 | 68.8 | **78.4** | 64.8 |
| MathVista mini | **85.8** | 84.9 | 82.7 | 81.3 | 75.5 |
| MathVision | **74.6** | 66.5 | 73.3 | 70.9 | 64.3 |
| MathVerse mini | **85.0** | 72.5 | 82.9 | 84.1 | 70.6 |
| ZeroBench | **4** | 2 | 3 | 2 | 3 |
| LogicVista | **72.2** | 65.8 | 72.0 | 71.8 | 67.3 |
| VisuLogic | **34.4** | 29.9 | 31.6 | 28.5 | 27.9 |
| MMBench-EN | 88.8 | 89.3 | **90.1** | 83.8 | 79.4 |
| RealWorldQA | **81.3** | 79.2 | 78.0 | 82.8 | 69.9 |
| MMStar | 78.7 | 78.4 | 77.5 | 76.4 | 72.1 |
| HallusionBench | **66.7** | 63.2 | 63.7 | 65.7 | 60.4 |
| MIA-Bench | **92.7** | 91.3 | 92.3 | 92.4 | 91.2 |
| DocVQA test | 96.5 | **97.1** | 92.6 | 91.5 | 92.5 |
| InfoVQA test | **89.5** | 89.2 | 84.2 | 79.0 | 69.4 |
| AI2D w. M. | 89.2 | 89.7 | 90.9 | 89.7 | 86.4 |
| ChartQA test | 90.3 | 90.3 | 83.3 | 59.7 | 86.2 |
| OCRBench | 875 | **920** | 866 | 810 | 764 |
| OCRBench_v2 en | 66.8 | **67.1** | 54.3 | 53.0 | 48.4 |
| OmniDocBench en (↓) | 0.155 | **0.143** | 0.347 | 0.356 | 0.194 |
| MMLongBenchDoc | 56.2 | **57.0** | 55.6 | 51.5 | 54.5 |
| RefCOCO avg | **92.1** | 91.9 | 74.6 | 66.8 | – |
| CountBench | **93.7** | 93.0 | 91.0 | 91.7 | 93.1 |
| ODinW-13 | 43.2 | **48.6** | 33.7 | – | – |
| BLINK | 67.1 | **70.7** | 70.6 | 71.0 | 64.1 |
| MuirBench | **80.1** | 73.0 | 77.2 | 77.5 | – |
| MVBench | 75.2 | 76.5 | 69.9 | 75.3 | 61.4 |
| Video-MME w/o sub | 79.0 | 79.2 | **85.1** | 84.7 | 75.6 |
| MLVU M-Avg | 83.8 | 84.3 | 85.6 | **86.2** | 73.5 |
| LVBench | 63.6 | 67.7 | **73.0** | – | – |
| Charades-STA mIoU | 63.5 | **64.8** | – | – | – |
| VideoMMMU | 80.0 | 74.7 | 83.6 | **84.6** | 76.2 |
| MMVU | 71.1 | 68.1 | **74.9** | 73.0 | 66.4 |
| VSI-Bench | 60.0 | **62.7** | – | – | – |
| ScreenSpot Pro | 61.8 | 62.0 | – | – | – |
| OSWorld | 38.1 | 31.6 | – | – | – |

Note salient (§5):
- **Long video**: Qwen3-VL-235B-A22B-Instruct su MLVU "attains or even surpasses Gemini-2.5-Pro" [§5.9].
- **Hallucination**: thinking variant supera Gemini-2.5-Pro/GPT-5/Claude Opus 4.1 di rispettivamente 3.0 / 1.0 / 6.3 punti su HallusionBench [§5.3].
- **MIA-Bench**: nelle subtask "math" e "textual" Qwen3-VL-Thinking batte GPT-5-high di +10.0 e +5.0 punti [§5.3].

### Medium models (§5, Tab. 3): Qwen3-VL-30B-A3B / 32B

Selezione (instruct numbers; "thinking" simile o leggermente superiore):

| Benchmark | Qwen3-VL-30B-A3B inst | Qwen3-VL-32B inst | Gemini 2.5 Flash | GPT-5 mini |
|---|---|---|---|---|
| MMMU | 74.2 | 76.0 | 76.3 | **79.0** |
| MathVista mini | 80.1 | 83.8 | 75.3 | 79.1 |
| MathVision | 60.2 | 63.4 | 60.7 | **71.9** |
| MMBench-EN | 86.1 | 87.6 | 86.6 | 86.6 |
| RealWorldQA | 73.7 | 79.0 | 75.7 | **79.0** |
| DocVQA test | 95.0 | 96.9 | 93.0 | 90.5 |
| OCRBench | 903 | **895** | 864 | 821 |
| OCRBench_v2 en | 63.2 | 67.4 | 50.6 | 52.6 |
| MMLongBenchDoc | 47.1 | **55.4** | 44.6 | 50.3 |
| RefCOCO avg | 89.7 | 91.9 | – | – |
| Video-MME w/o sub | 74.5 | 76.6 | 75.6 | **78.9** |
| LVBench | 62.5 | 63.8 | 62.2 | – |
| VideoMMMU | 68.7 | 71.9 | 65.2 | **82.5** |
| OSWorld | 30.3 | **32.6** | – | – |
| AndroidWorld | 54.3 | 57.3 | – | – |

Highlight: Qwen3-VL-32B Instruct supera (su molti benchmark) il **precedente** Qwen2.5-VL-72B → "the medium-sized Qwen3-VL model has already surpassed it on reasoning tasks" [§5.2].

### Small models (§5, Tab. 4): 2B / 4B / 8B

| Benchmark | Qwen3-VL-2B inst | Qwen3-VL-4B inst | Qwen3-VL-8B inst | GPT-5 nano high |
|---|---|---|---|---|
| MMMU | 53.4 | 67.4 | 69.6 | **75.8** |
| MathVista mini | 61.3 | 73.7 | 77.2 | 71.5 |
| MMBench-EN | 78.4 | 83.9 | **84.5** | 78.4 |
| MMStar | 58.3 | 69.8 | **70.9** | 68.6 |
| DocVQA test | 93.3 | 95.3 | **96.1** | 88.2 |
| OCRBench | 858 | 881 | **896** | 753 |
| Video-MME w/o sub | 61.9 | 69.3 | **71.4** | 66.2 |
| LVBench | 47.4 | 56.2 | **58.0** | – |
| VideoMMMU | 41.9 | 56.2 | **65.3** | 63.0 |

Lo 8B raggiunge la fascia di **Qwen2.5-VL-72B** su molti video benchmark grazie a interleaved MRoPE + textual timestamps + scaling delle dense caption [§5.9].

### Text-only (§5.11, Tab. 5)

Qwen3-VL-235B-A22B Instruct vs LLM puri:

| Benchmark | Qwen3-VL-235B-A22B Inst | Qwen3-235B-A22B-Inst-2507 | DeepSeek V3 0324 | Claude Opus 4 (no think) |
|---|---|---|---|---|
| MMLU-Pro | 81.8 | 83.0 | 81.2 | **86.6** |
| GPQA | 74.3 | **77.5** | 68.4 | 74.9 |
| AIME-25 | **74.7** | 70.3 | 46.6 | 33.9 |
| HMMT-25 | **57.4** | 55.4 | 27.5 | 15.9 |
| LiveCodeBench v6 | **54.3** | 51.8 | 45.2 | 44.6 |
| Arena-Hard V2 (winrate) | 77.4 | **79.2** | 45.6 | 51.5 |
| MultiIF | 76.3 | **77.5** | 66.5 | – |
| PolyMATH | 45.1 | **50.2** | 32.2 | 30.0 |

Implicazione: il modello vision-language è ora *complementare* al pure-LLM Qwen3, non un suo downgrade — risultato chiave del square-root reweighting.

### Cosa cambia rispetto a Qwen2.5-VL

- **Interleaved MRoPE** invece di chunked MRoPE → +long-video.
- **DeepStack injection** invece di un singolo merger → +alignment, info multi-livello.
- **Text-based timestamp tokens** invece di T-RoPE absolute-time → +temporal grounding.
- **Square-root reweighting** della loss → bilancia text/multimodal senza catastrophic forgetting.
- **256K context** vs Qwen2.5-VL's max ~32K → long-doc + long-video native.
- **MoE varianti** (30B-A3B, 235B-A22B) introdotte ex novo.
- **39 lingue OCR** vs 10 di Qwen2.5-VL.
- **3D grounding nativo** con 9-DoF bbox, mAP@0.15 su Omni3D (ARKitScenes, Hypersim, SUN RGB-D).
- **Bifurcazione thinking/non-thinking** con SFT distinto.

## Limitazioni dichiarate

Il report non ha una sezione "Limitations" esplicita. Implicate dal testo:

- Confronto fps/frame cap *non* completamente fair: API limitations su Gemini 2.5 Pro (512 frame), GPT-5 (256), Claude Opus 4.1 (100) vs Qwen3-VL fino a 2 048 frame; il vantaggio long-video è in parte un artefatto del numero di frame [§5.9].
- Per Charades-STA si campiona a 4 fps; per altri video benchmark 2 fps — la finestra effettiva è sempre limitata da `total tokens ≤ 224K` con `max tokens per frame 640-768`.
- Tool use ("Perception with Tool") aggiunge ~5 punti su V*/HRBench: "the absolute improvement by adding tools is consistently ~5 points" [§5.6], suggerendo che il sollevamento puro architetturale è stagnante senza tool.

## Domande aperte / critiche

- Quanto del salto vs Qwen2.5-VL viene da architettura (interleaved MRoPE + DeepStack + textual timestamp) e quanto dal backbone (Qwen3 vs Qwen2.5) + scale (256K vs 32K context) + ridge dati? Il report non offre ablation isolate (es. Qwen3 LLM + Qwen2.5-VL architecture).
- Square-root reweighting è descritto ma non quantificato: nessuna ablation con/senza, nessuna curva di trade-off testo↔multimodale.
- "Thinking with images" non riporta latency / token cost numerici per multi-turn tool calling RL: l'overhead pratico in inference è oscuro.
- Niente analisi di "spectral imbalance" empirica della MRoPE originale (frequency response plots): la giustificazione di interleaved MRoPE è basata su "subsequent studies" citate ma non riprodotte in-paper [§2.1].
- Open-weights: il GitHub esiste (`QwenLM/Qwen3-VL`) ma la licenza dei pesi non è dichiarata nel report.

## Concetti citati

- [[vision-language-model]], [[video-llm]], [[multimodal-large-language-model]]
- [[qwen]], [[qwen2-vl]], [[qwen2-5-vl]], [[qwen3]]
- [[mrope]], [[interleaved-mrope]], [[t-rope]], [[rotary-position-embedding]], [[positional-encoding]]
- [[deepstack]] (vision encoder multi-level fusion)
- [[siglip]] (SigLIP-2, encoder)
- [[mixture-of-experts]] (varianti 30B-A3B, 235B-A22B)
- [[long-context]], [[context-length]]
- [[instruction-tuning]], [[supervised-fine-tuning]], [[chain-of-thought]], [[strong-to-weak-distillation]]
- [[reinforcement-learning]], [[sapo]] (Smooth and Adaptive Policy Optimization)
- [[direct-preference-optimization]] (background)
- [[textual-timestamp-tokens]]
- [[gui-agent]], [[function-calling]], [[thinking-with-images]]
- [[grounding]], [[3d-grounding]], [[omni3d]], [[refcoco]], [[countbench]]
- [[ocrbench]], [[ocrbench-v2]], [[docvqa]], [[infovqa]], [[chartqa]], [[ai2d]], [[charxiv]], [[mmlongbenchdoc]], [[omnidocbench]], [[cc-ocr]]
- [[mmmu]], [[mmmu-pro]], [[mathvista]], [[mathvision]], [[mathverse]], [[we-math]], [[dynamath]], [[zerobench]], [[logicvista]], [[visulogic]], [[visualpuzzles]]
- [[video-mme]], [[mvbench]], [[mlvu]], [[lvbench]], [[charades-sta]], [[video-mmmu]], [[mmvu]]
- [[blink]], [[muirbench]]
- [[screenspot]], [[osworld]], [[androidworld]]
- [[v-star]], [[hrbench]]
- [[megatron-lm]], [[vllm]], [[sglang]]

## Citazioni dirette

> "We introduce Qwen3-VL, the most capable vision–language model in the Qwen series to date […] It natively supports interleaved contexts of up to 256K tokens, seamlessly integrating text, images, and video." (Abstract, p. 1)

> "Chunking the embedding dimensions into temporal (t), horizontal (h), and vertical (w) groups induces an imbalanced frequency spectrum and hampers long-video understanding. We therefore adopt an interleaved MRoPE that distributes t, h, and w uniformly across low- and high-frequency bands." (§1, p. 2)

> "By tying temporal position IDs directly to absolute time, [T-RoPE] produces excessively large and sparse temporal position ids for long videos, degrading the model's ability to understand long temporal contexts." (§2.3, p. 4)

> "We perform this distillation using text-only data to fine-tune the LLM backbone. This method proves highly effective, yielding significant improvements in reasoning abilities across both text-centric and multimodal tasks." (§4.1, p. 9)
