---
title: "Liu et al. (2026) — Aligning What Vision-Language Models See and Perceive with Adaptive Information Flow"
type: source
tags: [vision-language-model, training-free, causal-mask, attention-modulation, visual-grounding, hallucination, vqa, test-time-intervention]
created: 2026-05-15
updated: 2026-05-15
source_path: raw/papers/liu-2026-adaptive-information-flow.pdf
source_kind: paper
source_date: 2026-04-17
doi: 10.48550/arXiv.2604.15809
zotero_key: E3UCDUE6
venue: arXiv preprint
authors: [Chengxin Liu, Wonseok Choi, Chenshuang Zhang, Tae-Hyun Oh]
year: 2026
---

# Aligning What Vision-Language Models See and Perceive with Adaptive Information Flow

## TL;DR

Liu et al. mostrano che il "gap fra vedere e percepire" dei VLM (l'attenzione cade sulle regioni giuste ma la risposta è sbagliata) deriva da un **information flow** sub-ottimale: i token di testo distribuiscono attenzione su troppi visual token irrilevanti. Propongono **Adaptive Information Flow (AIF)**, una modulazione *test-time* della causal mask basata sulle "token dynamics" (statistiche di attenzione cross-layer). Per ogni visual token si calcola un'entropia basata sull'attivazione across layer; i token a entropia alta (irregolare, irrilevanti) vengono mascherati nell'interazione visual→text, mentre la vision-to-vision aggregation è preservata. Niente training, un solo extra decoding step. Su LLaVA-1.5-7B e Qwen2.5-VL-7B migliorano VQA, OCR, grounding (RefCOCO +2.3 medio), counting e hallucination (POPE) di 1–8 punti [source: raw/papers/liu-2026-adaptive-information-flow.pdf Abstract, §5.2].

## Contributo principale

- Osservazione/diagnosi: solo un sottoinsieme di visual token impatta significativamente l'output dell'LLM, e la modulazione manuale dell'information flow può portare a un'accuratezza "oracolo" notevolmente superiore (es. LLaVA-1.5 RealWorldQA 55.6→61.6, TextVQA 47.8→49.9, CountBench 47.0→50.3) [source: raw/papers/liu-2026-adaptive-information-flow.pdf §3.3, Tab.1].
- Metrica **token dynamics**: $D_{v_i}=\{d^l_{v_i}\}_{l=1}^L$ con $d^l_{v_i}=\max_j a^l_{i,j}$ (max image-to-text attention per layer). Token oggetto = attivazione concentrata in alcuni layer; token irrilevanti = randomness across layer [source: raw/papers/liu-2026-adaptive-information-flow.pdf §3.2].
- Misura di importanza: entropia $\text{Ent}_{v_i} = \sum_l -\frac{d^l_{v_i}}{L\mu_{v_i}}\log\frac{d^l_{v_i}}{L\mu_{v_i}}$. Alta entropia ⇒ token non importante [source: raw/papers/liu-2026-adaptive-information-flow.pdf §4.2, Eq.4].
- Selezione adattiva della *mask ratio* tramite ottimizzazione di soglia entropy-based che massimizza lo shift della distribuzione $S_0$ degli attention values [source: raw/papers/liu-2026-adaptive-information-flow.pdf §4.3, Eq.5].

## Metodo

**Pipeline (§4.1, Fig.6)** — *training-free*, agisce solo sulla causal mask in inferenza:

1. **One-step decoding di profiling**: input image+prompt → tokenizzazione standard → primo step di forward dell'LLM per raccogliere le attention matrices $a^l_{i,j}$ ad ogni layer $l$ e per ogni visual token $v_i$ [source: raw/papers/liu-2026-adaptive-information-flow.pdf §4.1].
2. **Token dynamics** (§3.2): per ogni visual token si calcola $D_{v_i}$ e $\mu_{v_i}=\frac{1}{L}\sum_l d^l_{v_i}$.
3. **Entropy map** (§4.2, Eq.4): $\text{Ent}_{v_i}$ misura la randomness across layers — bassa per token "concentrati" (oggetto rilevante), alta per token "rumorosi".
4. **Adaptive masking** (§4.3, Eq.5): si itera sulle mask-ratio in $\{0.1, 0.2, \dots, 0.9\}$, mascherando in ordine i token a entropia più alta; per ciascuna ratio si calcola $S_0=-\sum_i (\mu_{v_i}/\sum \mu)\log(\mu_{v_i}/\sum \mu)$. Si seleziona la ratio la cui distribuzione si discosta di più da $S_0$ originale.
5. **Modulated causal mask** (Fig.2b): i token mascherati vengono scollegati solo da text token; i visual↔visual e text→visual_masked rimangono attivi, così l'informazione visiva non è eliminata (a differenza del *visual token pruning* di [Chen 2024]).
6. **Final inference**: si rilancia il forward con la nuova mask. Costo addizionale ≈ "1 token generation" (un extra decoding step + generazione mask di pochi ms) [source: raw/papers/liu-2026-adaptive-information-flow.pdf §5.4].

**Backbone valutati**: LLaVA-1.5-7B (prompt setting di ViCrop) e Qwen2.5-VL-7B (default VLMEvalKit).

## Risultati chiave

**General VQA + OCR + Counting (Tab.2)**:

| Backbone | V* | RealWorldQA | MMStar | TextVQA | SeedBench2-Plus | CountBench |
|---|---|---|---|---|---|---|
| LLaVA-1.5-7B baseline | 42.4 | 55.6 | 33.1 | 47.8 | 41.3 | 47.0 |
| + AIF | 50.3 (+7.9) | 60.5 (+4.9) | 39.5 (+6.4) | 49.9 (+2.1) | 44.9 (+3.6) | 50.1 (+3.1) |
| Qwen2.5-VL-7B baseline | 78.5 | 68.5 | 63.9 | 84.9 | 70.4 | 87.1 |
| + AIF | 84.8 (+6.3) | 74.5 (+6.0) | 70.9 (+7.0) | 86.0 (+1.1) | 76.5 (+6.1) | 89.5 (+2.4) |

**Visual Grounding (Tab.3)** — Qwen2.5-VL-7B + AIF supera Grounding-DINO-L e InternVL-2.5-8B: media RefCOCO/+/g 86.6 → 88.9 (+2.3) [source: raw/papers/liu-2026-adaptive-information-flow.pdf §5.2].

**Hallucination POPE (Tab.4)**: LLaVA-1.5-7B 85.4→88.7; Qwen2.5-VL-7B 87.8→89.5.

**Vs. metodi competitor (Tab.5)** su LLaVA-1.5-7B: AIF (39.5/60.5/88.7) supera ViCrop training-free (35.2/56.7/87.2) e CCA training-based (33.2/51.8/86.9).

**Justification quantitativa dell'entropia (Tab.6)** su RefCOCO con Qwen2.5-VL-7B: nel top-20% di token, *high-attention* recupera 28.8/25.1/21.2% di token-oggetto (small/medium/large), *low-entropy (ours)* recupera 49.7/41.4/31.0%. L'entropia è proxy migliore della pura attention.

**Ablazioni (Tab.7-8)**: random masking (40.3) e low-entropy masking (38.7) sono peggiori di AIF (50.3) su V*. Future-aware mask di [[pei-2025-causal-mask-attention]] (vis2vis / vis2text) degrada (48.9/49.8 RealWorldQA) — AIF è specificamente migliore [source: raw/papers/liu-2026-adaptive-information-flow.pdf §5.3].

## Limitazioni dichiarate

- "May suffer from lengthy and indirect text prompt": prompt lunghi o vaghi rendono difficile identificare le regioni importanti [source: raw/papers/liu-2026-adaptive-information-flow.pdf §5.4].
- Solo per backbone con attenzione causale standard; non viene testata su VLM con maschere modificate (es. Qwen2-VL-MMRoPE).
- Tutti gli esperimenti su immagini (non video) e su backbone open-source 7B; commercial models (GPT-4o, Claude) non sono modificabili così.

## Domande aperte / critiche

- L'overhead "1 extra decoding step" su prompt molto lunghi diventa significativo? Non vi è benchmark su prompt > 1K token.
- Come scala con sequenze multi-immagine o video? La definizione di token dynamics presuppone attenzioni stabili nei layer, ma su video token le statistiche potrebbero essere diluite.
- Cosa cambia se la modulazione viene fatta per-head invece di per-token? Possibile estensione coerente con il filone "attention heads for grounding" (Kang et al., CVPR 2025).
- L'entropia è calcolata su massimo per-layer; sarebbe robusta una media weighted? Non ablato.

## Concetti citati

- [[vision-language-model]]
- [[causal-attention-mask]] / [[causal-mask-modulation]]
- [[training-free-methods]]
- [[information-flow]] — nuovo concetto-chiave
- [[token-dynamics]] — proxy di importanza
- [[entropy-based-importance]]
- [[attention-modulation]]
- [[visual-token-pruning]] — contrasto (FastV / image-is-worth-1/2-tokens)
- [[future-aware-causal-mask]] — confronto con [[pei-2025-causal-mask-attention]]
- [[visual-cropping]] — confronto con ViCrop
- [[concentric-causal-attention]] — confronto con CCA (training-based)
- [[refcoco]], [[refcoco-plus]], [[refcocog]] — benchmark grounding
- [[textvqa]], [[ocrvqa]] — benchmark OCR
- [[realworldqa]], [[mmstar]], [[v-star-bench]] — VQA
- [[countbench]] — counting
- [[seedbench2-plus]] — bench OCR + reasoning
- [[pope]] — hallucination
- [[llava-1.5]], [[qwen2.5-vl]] — backbone
- [[vlmevalkit]] — toolkit

## Citazioni dirette

> "Modulating information flow during inference can improve the perception capability of VLMs." [source: raw/papers/liu-2026-adaptive-information-flow.pdf §1]

> "Visual tokens corresponding to object regions are highly activated in certain layers, while irrelevant regions exhibit irregular activation patterns." [source: raw/papers/liu-2026-adaptive-information-flow.pdf §1, Fig.1]
