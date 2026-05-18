---
title: "Doorenbos et al. (2026) — Video Panels for Long Video Understanding"
type: source
tags: [video-llm, long-video-understanding, visual-prompting, training-free, paneling, video-qa]
created: 2026-05-15
updated: 2026-05-15
source_path: raw/papers/doorenbos-2026-video-panels.pdf
source_kind: paper
source_date: 2026-04-20
doi: 10.48550/arXiv.2509.23724
zotero_key: Q9RHHRAT
venue: arXiv preprint (CVPR-style)
authors: [Lars Doorenbos, Federico Spurio, Juergen Gall]
year: 2026
---

# Video Panels for Long Video Understanding

## TL;DR

Doorenbos, Spurio e Gall propongono un metodo *training-free*, *parameter-free* e *model-agnostic* di visual prompting per video lunghi: combinare $\alpha\beta$ frame consecutivi in un'unica immagine "a pannelli" (come una pagina di fumetto). Questo aumenta la risoluzione temporale a costo di un po' di risoluzione spaziale, all'interno dello stesso budget di token visivi del VLM. Su 5 benchmark (Video-MME, TimeScope, MLVU, MF2, VNBench) e 8 VLM (Video-LLaVA, VideoChat2-HD, LLaVA-OV, Qwen2-VL/2.5-VL, LLaVA-Video, VideoLLaMA 3, GPT-4o-mini/4.1) il metodo migliora quasi sempre l'accuratezza; sul TimeScope Long arriva a +7.6 punti (+19.4% relativo) su VideoLLaMA 3 7B [source: raw/papers/doorenbos-2026-video-panels.pdf §1, §4.2].

## Contributo principale

- Primo metodo di *visual prompt engineering* progettato esplicitamente per long-video understanding; non modifica i pesi né l'architettura del VLM [source: raw/papers/doorenbos-2026-video-panels.pdf §1].
- Strategia "Dynamic frame sampling + panel construction" che attiva il paneling solo quando $\gamma C < D$ (durata video supera capacità contesto), preservando la pipeline standard altrimenti [source: raw/papers/doorenbos-2026-video-panels.pdf §3.2].
- Dimostrazione empirica che il *paneling* di frame supera approcci alternativi di *token pooling* a parità di budget di token [source: raw/papers/doorenbos-2026-video-panels.pdf §4.4].
- Estensione al fine-tuning (Proj+LLM su LLaVA-OV 7B con LLaVA-Video-178K) che dimostra come i pannelli siano una rappresentazione efficace anche dopo training [source: raw/papers/doorenbos-2026-video-panels.pdf §4.3].

## Metodo

**Pipeline (§3.2)**: dato un video di durata $D$ frame e un VLM con context window $C$:

1. **Dynamic frame sampling**: $T = C$ se $\gamma C \ge D$, altrimenti $T = \alpha\beta C$. Cioè il paneling si attiva solo per video "abbastanza lunghi" (frame spaziati di almeno $\gamma$ frame). Default: $\gamma$ = FPS del video, $\alpha=\beta=2$ (griglia 2×2) [source: raw/papers/doorenbos-2026-video-panels.pdf §3.2, Eq.1].
2. **Panel construction**: gli $\alpha\beta C$ frame vengono prima downsampled spazialmente da $H\times W$ a $H/\alpha \times W/\beta$, poi raggruppati in pannelli $\alpha\times\beta$ in ordine left-to-right top-to-bottom. Il risultato è una sequenza di $C$ "panel images", ciascuna della shape originale $H\times W$ [source: raw/papers/doorenbos-2026-video-panels.pdf §3.2].
3. **Inferenza**: si passa la sequenza paneled al VLM con il prompt standard del benchmark; gli autori sconsigliano di descrivere esplicitamente la struttura nel prompt (non c'è un wording che generalizzi cross-model) [source: raw/papers/doorenbos-2026-video-panels.pdf §3.2].

**Fine-tuning opzionale (§3.3)**: si massimizza $-\log p_\theta(y|x,q)$ sui video di training riformattati come panel, su LLaVA-OV 7B (LLaVA-Video-178K, 1 epoch, batch=2, grad-acc=4).

**Aspetto training-free**: il blocco "panel construction" è puramente di pre-processing visivo; non aggiunge parametri né richiede gradient pass attraverso il VLM.

## Risultati chiave

**Zero-shot, 5 benchmark × 8 VLM (Tab.1)** — accuratezza media in punti percentuali:

- Video-LLaVA 7B (8 frame): 33.8 → 34.8 (+1.0)
- LLaVA-OV 7B (32 frame): 52.8 → 56.2 (+3.4)
- LLaVA-OV 72B (32 frame): 49.4 → 52.5 (+3.1)
- Qwen-2.5VL 7B (32 frame): 51.9 → 55.3 (+3.4)
- LLaVA-Video 7B (64 frame): 56.6 → 60.7 (+4.1)
- LLaVA-Video 72B (64 frame): 55.4 → 58.2 (+2.8)
- Qwen-2VL 7B (180 frame): 54.5 → 56.7 (+2.2)
- Qwen-2.5VL 7B (180 frame): 59.7 → 60.5 (+0.8)
- VideoLLaMA 3 7B (180 frame): 58.2 → 60.9 (+2.7)

**Highlight TimeScope Long (durata media 27 600 s, ≈7.7 h)**: VideoLLaMA 3 7B passa da 39.1 a 46.7 (+7.6 / +19.4% relativo) [source: raw/papers/doorenbos-2026-video-panels.pdf §1, §4.2].

**Commerciali**: GPT-4o-mini (8 frame) su Video-MME 50.0→53.0 (+3.0), GPT-4.1 (32 frame) 68.9→72.9 (+4.0) [source: raw/papers/doorenbos-2026-video-panels.pdf §4.2].

**Fine-tuning (Tab.2, LLaVA-OV 7B)**: il fine-tuning Proj+LLM con panel su Video-MME long 49.4 vs 48.2 senza panel; TimeScope Long 34.4 vs 30.9. I pannelli sono complementari al training [source: raw/papers/doorenbos-2026-video-panels.pdf §4.3].

**Panels vs. Pooling (§4.4)**: a parità di token (≈23k–25k), paneling supera average pooling dei token visivi (low-res) su LLaVA-OV 7B (TimeScope: panels 69.5 vs low-res 68.7 vs default 58.7) e LLaVA-Video 7B (79.2 vs 78.4 vs 64.8).

**Ablazioni**:
- $\gamma$: il paneling è benefico già a $\gamma=0.5\times$FPS; valori $\ge 1\times$FPS evitano paneling sui video troppo brevi e danno la performance media migliore (Tab.3) [source: raw/papers/doorenbos-2026-video-panels.pdf §4.5].
- $\alpha\times\beta$: 2×2 è ottimale; 3×3 aiuta TimeScope (76.5 vs 69.5) ma 4×4 degrada sui task con dettaglio fine; $\alpha\ne\beta$ peggiora (Tab.4) [source: raw/papers/doorenbos-2026-video-panels.pdf §4.5].
- Trade-off compute/accuracy (Fig.4): paneling ottiene la stessa accuratezza di LLaVA-OV 7B con metà dei frame (8 vs 16) e quindi metà dei token visivi.

## Limitazioni dichiarate

- L'approccio "non migliora le capacità di comprensione del VLM sottostante" ma alza la baseline (§5) [source: raw/papers/doorenbos-2026-video-panels.pdf §5].
- Su task come ordering (MLVU) i pannelli perdono leggermente (−1.2%) perché non codificano esplicitamente l'ordine temporale all'interno del pannello (§4.7) [source: raw/papers/doorenbos-2026-video-panels.pdf §4.7].
- Alcuni casi isolati di degrado (es. VideoLLaMA 3 7B su MF2 −0.6).
- Nessun textual prompt unico migliora i risultati su tutti i modelli; serve calibrazione per ogni VLM (§3.2).

## Domande aperte / critiche

- Come si combina paneling con metodi di selezione/aggregazione frame come [[adaptive-keyframe-sampling]] o [[temporal-chain-of-thought]]? Sembra ortogonale.
- Quale prompt testuale ottimale per descrivere il layout del pannello (l'appendice esplora NumPro-style indexing).
- Come scala con $\alpha\beta > 4$? Il paper si ferma a 4×4; la perdita di risoluzione spaziale potrebbe essere mitigata con vision encoder a maggiore risoluzione nativa.
- Effetto su task di OCR fine-grained dove la spatial resolution è critica.

## Concetti citati

- [[video-llm]] — backbone testato (Video-LLaVA, VideoChat2-HD, LLaVA-OV, Qwen-2VL/2.5-VL, LLaVA-Video, VideoLLaMA 3, GPT-4)
- [[long-video-understanding]] — task target
- [[visual-prompting]] / [[visual-prompt-engineering]] — categoria di metodo
- [[training-free-methods]] — proprietà chiave
- [[vision-language-model]]
- [[video-mme]] — benchmark
- [[timescope]] — benchmark, evidenzia il guadagno maggiore
- [[mlvu]] — benchmark
- [[mf2]] — benchmark
- [[vnbench]] — benchmark
- [[egoschema]] — citato come benchmark di riferimento
- [[lmms-eval]] — toolkit di valutazione
- [[llava-onevision]], [[qwen2-5-vl]], [[llava-video]], [[videollama-3]] — modelli backbone
- [[numpro]] — prompt visivo con tag numerici sui frame (baseline)
- [[token-pooling]] — alternativa a cui il metodo è confrontato
- [[needle-in-a-haystack]] — task category in cui il paneling brilla

## Citazioni dirette

> "Our approach is training-free, parameter-free, and model-agnostic, and can be seamlessly integrated into existing VLMs." [source: raw/papers/doorenbos-2026-video-panels.pdf Abstract]

> "By combining multiple frames as panels into one image, we effectively trade off spatial details for temporal resolution." [source: raw/papers/doorenbos-2026-video-panels.pdf Abstract]
