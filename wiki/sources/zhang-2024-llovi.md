---
title: "Zhang et al. (2024) — A Simple LLM Framework for Long-Range Video Question-Answering (LLoVi)"
type: source
tags: [video-llm, long-video-understanding, caption-based, training-free, llm-aggregation, multi-round-summarization, video-qa]
created: 2026-05-15
updated: 2026-05-15
source_path: raw/papers/zhang-2024-llovi.pdf
source_kind: paper
source_date: 2024-10-10
doi: 
zotero_key: GRJDYA8T
venue: EMNLP 2024 (Findings)
authors: [Ce Zhang, Taixi Lu, Md Mohaiminul Islam, Ziyang Wang, Shoubin Yu, Mohit Bansal, Gedas Bertasius]
year: 2024
---

# A Simple LLM Framework for Long-Range Video Question-Answering

## TL;DR

Zhang et al. presentano **LLoVi**, un framework *training-free* a due stadi per long-range Video QA: (1) un **short-term visual captioner** (LaViLa/BLIP-2/CogAgent/LLaVA) descrive in testo clip brevi di 0.5–8 s campionate densamente dal video; (2) un **LLM** (GPT-3.5/4, Llama3) aggrega le caption concatenate per rispondere alla domanda. Per gestire caption rumorose introducono un **multi-round summarization prompt**: (C, Q) → S (riassunto condizionato sulla domanda) → (S, Q, A) → answer. Niente moduli specializzati per long-range modeling (no memory queue, no state-space, no graph). Stato dell'arte su EgoSchema (full set 61.2% con GPT-4), NExT-QA (+10.2% sopra il SOTA precedente), IntentQA (+6.2%), NExT-GQA per grounded VideoQA [source: raw/papers/zhang-2024-llovi.pdf Abstract, §4.3].

## Contributo principale

- Framework "decomposto" in due stadi puramente training-free, che evita esplicitamente memory bank/state-space/graph: short-term captioner + LLM aggregator [source: raw/papers/zhang-2024-llovi.pdf §1, §3].
- **Multi-round summarization prompt** (C, Q) → S → (S, Q, A): la summary è condizionata sulla domanda, riducendo noise e ridondanza nelle caption. Variante (C) → S e (C, Q, A) → S performano peggio [source: raw/papers/zhang-2024-llovi.pdf §3.2, Tab.5].
- Studio empirico esteso su EgoSchema: visual captioner (LaViLa migliore), LLM choice (GPT-4 > Llama3-70B > GPT-3.5), clip length (1 s ottimale), sampling rate (efficienza 8× con drop 2%).
- Estensione a grounded Video-QA su NExT-GQA con temporal localization tramite LLM [source: raw/papers/zhang-2024-llovi.pdf §4.3].
- Codebase pubblico, baseline forte per la community LVQA.

## Metodo

**Stadio 1 — Short-term captioning (§3.1)**: video $V$ → $N_v$ clip $\{v_m\}$ non sovrapposte. Ogni clip $v_m \in \mathbb{R}^{T_v\times H\times W\times 3}$ è data al captioner $\phi$ che produce testo $c_m = \phi(v_m)$. Default: LaViLa su clip da 1 s su EgoSchema; CogAgent a 0.5 fps su NExT-QA/IntentQA/NExT-GQA.

**Stadio 2 — LLM aggregation (§3.2)**: concatenazione $C = [c_1,\dots,c_{N_v}]$. Standard prompt: "Please provide a single-letter answer (A,B,C,D,E) to … {Q}. You are given language descriptions: {C}. Choices: {A}".

**Multi-round summarization prompt (§3.2, Fig.3)**:
1. **Round 1**: prompt "You are given language descriptions of a video: {C}. Please give me a {N_w} word summary." dove al posto di $C$ può esserci $(C,Q)$ per condizionare la summary. Output: $S$.
2. **Round 2**: prompt che usa $S$ al posto di $C$ + question + answer candidates → letter answer.

Ablazione (Tab.5) della summary input:
- $(C)\to S$: 55.0
- $(C,Q)\to S$: **58.8** (+3.6 vs baseline)
- $(C,Q,A)\to S$: 54.8 (degrada — answer candidates lunghe distraggono)

**Aspetto training-free**: nessun parametro aggiornato; tutta la "long-range modeling" è delegata al LLM frozen. Captioner anch'essi off-the-shelf.

## Risultati chiave

**Captioner ablation (Tab.1)** — EgoSchema Subset, GPT-3.5 fisso:

| Captioner | Tipo | Pretraining Ego4D | Acc |
|---|---|---|---|
| EgoVLP | clip | yes | 46.6 |
| LLaVA | frame | no | 45.2 |
| BLIP-2 | frame | no | 50.6 |
| LaViLa | clip | yes | **55.2** |
| Oracle | clip | — | 66.0 |

**LLM ablation (Tab.2)** — LaViLa fisso:

| LLM | Size | Acc |
|---|---|---|
| Mistral | 7B | 50.8 |
| Llama3-8B | 8B | 52.2 |
| Llama3-70B | 70B | 56.8 |
| GPT-3.5 | 175B | 55.2 |
| GPT-4 | 1.8T | **61.2** |

**Clip length (Tab.3)**: 1 s = 55.2, 2 s = 54.8, 4 s = 53.4, 8 s = 53.4 ⇒ clip brevi ottimali.

**Sampling rate (Tab.4)**: 1 = 55.2, 1/2 = 55.2, 1/4 = 54.6, 1/8 = 53.2 ⇒ 8× efficienza con drop solo 2%.

**Prompt comparison (Tab.6)**:
- Standard: 55.2
- Plan-and-Solve: 55.2
- Chain-of-Thought: 57.8
- **Ours**: **58.8**

**SOTA (paper §4.3, non interamente riportato nello snippet)**:
- EgoSchema full set: **61.2%** (GPT-4 + LaViLa) — best reported all'epoca
- NExT-QA: +10.2% sopra precedente SOTA
- IntentQA: +6.2% sopra precedente SOTA
- NExT-GQA: outperforms all prior grounded VQA methods

## Limitazioni dichiarate

- Dipendenza forte dalla qualità del captioner: l'oracle gap LaViLa→ground truth è 10.8 punti (Tab.1) [source: raw/papers/zhang-2024-llovi.pdf §4.2.1].
- LaViLa è pre-trained su Ego4D ⇒ ottimo su EgoSchema, ma su domini diversi serve un captioner adatto (paper switcha a CogAgent per NExT-QA).
- LLM cost: GPT-4 elevato; usano GPT-3.5 come "best cost/perf" default.
- Caption-based ⇒ perdita di info visiva fine-grained (no OCR, no piccoli oggetti) non descritta nelle caption.
- Long token sequence: $>$1K word caption può confondere LLM più piccoli — motivazione del multi-round prompt.

## Domande aperte / critiche

- I metodi VLM-end-to-end successivi ([[arnab-2025-temporal-chain-of-thought]], [[tang-2025-adaptive-keyframe-sampling]]) hanno superato LLoVi (es. TCoT su NExT-QA 81.0 vs LLoVi 73.8), suggerendo che operare direttamente sui frame elimina il bottleneck del captioner. LLoVi rimane però rilevante quando non si dispone di un VLM long-context.
- L'ipotesi che caption "noisy" siano filtrate dalla summary è qualitativa: niente ablazione di robustezza con caption avversariamente rumorose.
- Possibile combinazione con [[adaptive-keyframe-sampling]] per ridurre il numero di caption (oggi una caption per clip = dense).
- Estensione a video con audio/speech non trattata.
- Cost analysis: una singola call GPT-4 su 3 min di video con caption LaViLa = ~$0.04; non scala bene a video da 1 h.

## Concetti citati

- [[video-llm]]
- [[long-video-understanding]] / [[long-range-video-qa]]
- [[training-free-methods]]
- [[caption-based-vqa]] / [[short-term-captioning]]
- [[multi-round-summarization]] — concetto centrale
- [[chain-of-thought]] — confronto come prompt
- [[plan-and-solve]] — confronto come prompt
- [[lavila]] — captioner primario su Ego4D
- [[blip-2]] — captioner image-level
- [[egovlp]] — captioner pre-trained su Ego4D
- [[cogagent]] — captioner usato su NExT-QA
- [[gpt-3-5]], [[gpt-4]], [[llama3]], [[mistral]] — LLM backend
- [[egoschema]] — benchmark, focus principale
- [[next-qa]] — benchmark
- [[intentqa]] — benchmark
- [[next-gqa]] — benchmark grounded VQA
- [[movieqa]] — citato come "benchmark con bias linguistico"
- [[activitynet-qa]] — citato come "richiede solo short clip"
- [[ego4d]] — dataset upstream del captioner
- [[memviti]], [[moviechat]] — competitor memory-based
- [[s4nd]], [[vis4mer]], [[s5]] — competitor state-space

## Citazioni dirette

> "Our method decomposes the short- and long-range modeling aspects of LVQA into two stages." [source: raw/papers/zhang-2024-llovi.pdf Abstract]

> "Our newly proposed multi-round summarization prompt leads to the most significant boost in performance (+3.6%) among the prompts we have tried." [source: raw/papers/zhang-2024-llovi.pdf §1]
