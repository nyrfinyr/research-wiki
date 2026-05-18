---
title: "Tang et al. (2025) — Adaptive Keyframe Sampling for Long Video Understanding"
type: source
tags: [video-llm, long-video-understanding, keyframe-sampling, training-free, video-qa, prompt-conditioned-sampling]
created: 2026-05-15
updated: 2026-05-15
source_path: raw/papers/tang-2025-adaptive-keyframe-sampling.pdf
source_kind: paper
source_date: 2025-02-28
doi: 
zotero_key: U2PCIS2B
venue: arXiv preprint (CVPR 2025)
authors: [Xi Tang, Jihao Qiu, Lingxi Xie, Yunjie Tian, Jianbin Jiao, Qixiang Ye]
year: 2025
---

# Adaptive Keyframe Sampling for Long Video Understanding

## TL;DR

Tang et al. introducono **Adaptive Keyframe Sampling (AKS)**, un modulo plug-and-play *training-free* che sostituisce l'uniform sampling pre-VLM. AKS formalizza la selezione di $M$ keyframe come ottimizzazione di due termini: (1) **relevance** $s(Q,F_t)$ fra prompt $Q$ e ogni frame candidato $F_t$ (calcolata via BLIP/CLIP image-text matching) e (2) **coverage** $c(\mathcal{I})$ della distribuzione temporale (via Ripley's K-function su bin ricorsivi). L'algoritmo *ADA* (judge-and-split) alterna fra top-score sampling e binning ricorsivo. Su LongVideoBench e Video-MME, integrato su Qwen2-VL, LLaVA-OV e LLaVA-Video-7B, AKS porta gain consistenti: LLaVA-Video-7B 58.9→62.7 (LVB) e 64.4→65.3 (V-MME), superando perfino LLaVA-Video-72B e modelli proprietari come GPT-4V/Gemini-1.5-Flash con un 7B [source: raw/papers/tang-2025-adaptive-keyframe-sampling.pdf Abstract, §4.2].

## Contributo principale

- Formulazione esplicita della keyframe selection come problema $\arg\max \sum_t s(Q,F_t) + \lambda \cdot c(\mathcal{I})$ con relevance + coverage (Eq.2) [source: raw/papers/tang-2025-adaptive-keyframe-sampling.pdf §3.2].
- Approssimazione di coverage tramite K-function discretizzata: partizionamento ricorsivo del time-axis in bin, penalizzando squilibri ($|m_1 - m_2|$) — fino a $L \le \lceil\log_2 M\rceil$ livelli [source: raw/papers/tang-2025-adaptive-keyframe-sampling.pdf §3.2].
- Algoritmo **ADA** (Adaptive Sampling, §3.3): a ogni nodo dell'albero, se $s_\text{top}-s_\text{all}>s_\text{thr}$ ritorna direttamente i top-M frame del bin (TOP-mode); altrimenti splitta il bin in due e distribuisce equamente i keyframe (BIN-mode), ricorsivamente.
- Plug-and-play: nessun parametro del VLM modificato; sostituisce solo l'algoritmo di sampling. Tre baseline: TOP ($\lambda=0$), BIN ($\lambda\to\infty$), UNI (uniform = default LLaVA-Video).
- Studio sistematico sul ruolo della pre-filtering visivo, mostrando che l'oracolo di relevance dà gain ancora maggiori (gap da chiudere con scorer migliori).

## Metodo

**Setup (§3.1)**: video $V \in \mathbb{R}^{T\times W\times H\times C}$, prompt $Q$, MLLM $G(\{F_t\})$ con capacità $M$. Goal: keyframe set $\mathcal{I}\subseteq\{1,\dots,T\}$ con $|\mathcal{I}|=M$ che massimizza information utile [source: raw/papers/tang-2025-adaptive-keyframe-sampling.pdf §3.1].

**Pipeline (Fig.2)**:

1. Pre-sample candidate frames a 1 fps (o meno per efficienza).
2. Per ogni candidato $F_t$, computa $s(Q,F_t)$ via BLIP ITM (default), CLIP o Sevila. Niente forward sul VLM finale [source: raw/papers/tang-2025-adaptive-keyframe-sampling.pdf §3.2, §4.1].
3. Lancia **ADA** ricorsivamente:
   - Stato: bin temporale $[a,b)$ con $k$ keyframe da allocare.
   - Calcola $s_\text{all}$ = media dei score nel bin, $s_\text{top}$ = media dei top-k score.
   - Se $k=1$ o $s_\text{top}-s_\text{all}>s_\text{thr}$ ⇒ ritorna i top-$k$ frame (modalità TOP).
   - Altrimenti splitta in $[a,(a+b)/2)$ e $[(a+b)/2,b)$, alloca $\lceil k/2\rceil$ e $\lfloor k/2\rfloor$, ricorri.
   - Stop a depth massima $L$ [source: raw/papers/tang-2025-adaptive-keyframe-sampling.pdf §3.3, Fig.3].
4. Estrai i visual token dai frame selezionati e passali al VLM standard.

**Hyperparametri**: $s_\text{thr}=0.6\div 0.8$, $L=3\div 5$ — tipici. LongVideoBench preferisce $L$ piccolo (questioni concentrate); Video-MME preferisce $L$ più grande (questioni multi-momento) [source: raw/papers/tang-2025-adaptive-keyframe-sampling.pdf §4.4, Tab.5].

**Aspetto training-free**: nessun training del VLM, nessun fine-tuning del retriever BLIP/CLIP; tutto plug-and-play.

## Risultati chiave

**Main (Tab.1)** — accuracy %, 32 o 64 frame al VLM:

| Method | LVBench val | Video-MME |
|---|---|---|
| GPT-4V (256 frame) | 61.3 | 59.9 |
| GPT-4o (256 frame) | 66.7 | 71.9 |
| Gemini-1.5-Flash (256 frame) | 61.6 | 70.3 |
| Qwen2-VL 7B (32 frame) | 55.5 | 57.6 |
| **Qwen2-VL + AKS** | **60.5** (+5.0) | **59.9** (+2.3) |
| LLaVA-OV 7B (32 frame) | 54.8 | 56.5 |
| **LLaVA-OV + AKS** | **59.3** (+4.5) | **58.4** (+1.9) |
| LLaVA-Video 7B (64 frame) | 58.9 | 64.4 |
| **LLaVA-Video + AKS** | **62.7** (+3.8) | **65.3** (+0.9) |

LLaVA-Video-7B + AKS supera LLaVA-Video-72B (61.9 LVB) e GPT-4V/Gemini-1.5-Flash a 256 frame, con solo 64 frame [source: raw/papers/tang-2025-adaptive-keyframe-sampling.pdf §4.2].

**Sampling strategy (Tab.2)** — LLaVA-Video-7B:

| Sampling | LVB | V-MME |
|---|---|---|
| UNI | 58.9 | 64.4 |
| TOP | 62.4 | 63.7 |
| BIN | 60.2 | 65.2 |
| **ADA** | **62.7** | **65.3** |

ADA combina i pregi: TOP è ottimo per LVB (questioni mono-momento), BIN per V-MME (questioni multi-momento).

**Frequenza sampling candidati (Tab.3)**: anche a 0.1 fps i risultati superano la baseline uniforme; a 0.25 fps performance ≈ 1 fps su Video-MME, suggerendo grosso margine per efficienza.

**VL scorer (Tab.4)**: BLIP migliore su LVB (object-level), CLIP migliore su V-MME (global perception). Sevila intermedio.

**$L \times s_\text{thr}$ (Tab.5)**: LVB best a $L\in\{3,4\}, s_\text{thr}\in\{0.2,0.4\}$; V-MME best a $L\in\{4,5\}, s_\text{thr}\in\{0.6,0.8\}$.

**Adattività (Fig.6)**: sullo stesso video, AKS sceglie keyframe diversi per domande diverse → flessibilità.

## Limitazioni dichiarate

- La metric coverage approssimata via bin è euristica; ottimo globale non garantito.
- Overhead computazionale del BLIP/CLIP forward su molti frame (ridotto via sampling a basso fps) [source: raw/papers/tang-2025-adaptive-keyframe-sampling.pdf §4.4].
- Performance del scorer (BLIP/CLIP) limita il ceiling: non c'è learning del scorer da feedback del VLM.
- Non testato su MVBench, LongVideoBench-test, EgoSchema; analisi su 2 benchmark.
- Su Video-MME, dove molte domande richiedono "high-level comprehension", il gain è più contenuto (+0.9 punti per LLaVA-Video-7B).

## Domande aperte / critiche

- Confronto diretto con [[arnab-2025-temporal-chain-of-thought]]: TCoT usa il VLM stesso come selector (no external scorer), AKS usa CLIP/BLIP — quale è meglio in funzione del budget di compute?
- Combinazione con [[doorenbos-2026-video-panels]]: i frame selezionati da AKS potrebbero essere panel-zzati per moltiplicare ulteriormente il temporal coverage.
- Effettiva latency end-to-end (BLIP forward × $T_\text{cand}$) non riportata in tabelle.
- Estensione a video subtitle / audio modalities (il paper esplicitamente evita subtitles).
- Allineamento fra $s(Q,F_t)$ e la nozione di "rilevanza" effettiva dal VLM: c'è dataset di supervised keyframe → potrebbe diventare un train signal.

## Concetti citati

- [[video-llm]]
- [[long-video-understanding]]
- [[keyframe-sampling]] — concetto centrale
- [[training-free-methods]]
- [[image-text-matching]] — relevance score via BLIP ITM
- [[blip-2]] — scorer
- [[clip]] — scorer alternativo
- [[sevila]] — scorer alternativo
- [[ripleys-k-function]] — formalizzazione coverage
- [[lvbench]] / [[longvideobench]] — benchmark
- [[video-mme]] — benchmark
- [[qwen2-vl]], [[llava-onevision]], [[llava-video]] — backbone
- [[lmms-eval]] — toolkit
- [[uniform-sampling]] — baseline
- [[siglip]] — citato come vision encoder LLaVA-Video
- [[moviechat]], [[ma-lmm]], [[videostreaming]], [[longvlm]], [[goldfish]] — competitor su token reduction

## Citazioni dirette

> "It inserts a plug-and-play module known as keyframe selection, which aims to maximize the useful information with a fixed number of video tokens." [source: raw/papers/tang-2025-adaptive-keyframe-sampling.pdf Abstract]

> "Our study reveals the importance of information pre-filtering in video-based MLLMs." [source: raw/papers/tang-2025-adaptive-keyframe-sampling.pdf Abstract]
