---
title: "Kim et al. (2026) — Sink-Token-Aware Pruning for Fine-Grained Video Understanding in Efficient Video LLMs"
type: source
tags: [video-llm, token-pruning, attention-sink, efficient-inference, hallucination, fine-grained-video-understanding, training-free, visual-tokens]
created: 2026-05-15
updated: 2026-05-15
source_path: raw/papers/kim-2026-sink-token-aware-pruning.pdf
source_kind: paper
source_date: 2026-04-22
doi: 10.48550/arXiv.2604.20937
zotero_key: YJ7FS3CI
venue: preprint (arXiv 2604.20937)
authors: [Kibum Kim, Jiwan Kim, Kyle Min, Yueqi Wang, Jinyoung Moon, Julian McAuley, Chanyoung Park]
year: 2026
---

# Kim et al. (2026) — Sink-Token-Aware Pruning for Fine-Grained Video Understanding in Efficient Video LLMs

## TL;DR

I Video LLM pagano una latenza enorme perché il numero di token visivi cresce linearmente con il numero di frame (es. 6,270 token per 32 frame su LLaVA-OneVision-7B). I metodi di **visual token pruning** training-free riducono tale costo, ma quasi tutti sono validati su MCQA, dove gli short-cut linguistici nascondono i loro difetti. Gli autori mostrano che, su task **fine-grained** (in particolare valutazione di allucinazione su EventHallusion), questi metodi crollano violentemente al diminuire del retention ratio. La causa è identificata in un piccolo sottoinsieme di token visivi, detti **sink token**: token spazialmente persistenti con attenzione altissima ma semantica quasi nulla (tipicamente patch di sfondo). Quando sopravvivono al pruning, occupano il budget e distorcono l'evidenza visiva. Gli autori introducono **SToP** (Sink-Token-aware Pruning), un metodo plug-and-play che calcola uno **sink score** e lo inietta sia nel pruning spaziale (modulo **STSP**) sia in quello temporale (modulo **STTP**). Applicato a VisionZip, FastVid, Holitom e FlashVid su LLaVA-OneVision-7B, LLaVA-Video-7B e Qwen2.5-VL, SToP riduce il *performance drop rate* anche del 9-10 punti percentuali con il 10% di token retention, e migliora consistentemente anche su 5 benchmark MCQA (MVBench, VideoMME, NextQA, LongVideoBench, MLVU).

## Contributo principale

- Analisi sistematica che mostra come i metodi SOTA di visual token pruning collassino sui task fine-grained (hallucination, compositional reasoning, open-ended generation) molto più che su MCQA, e identificazione dei **sink token** nel video encoder come ostacolo principale [source: raw/papers/kim-2026-sink-token-aware-pruning.pdf §1, §3].
- **Sink score** `s_i` definito come somma temporale delle attenzioni nello stesso patch index, elevata a potenza `w` e min-max normalizzata, che quantifica la "persistenza spaziale" di un token e lo distingue dai token salienti veramente informativi [source: raw/papers/kim-2026-sink-token-aware-pruning.pdf §4.1, Eq. 4].
- **STSP** e **STTP**: due moduli plug-and-play che modificano rispettivamente lo score di attenzione e la similarità temporale per sopprimere i sink token. Migliorano in modo consistente VisionZip, FastVid, Holitom e FlashVid su 8 benchmark, sia fine-grained che MCQA, fino a retention del 10% [source: raw/papers/kim-2026-sink-token-aware-pruning.pdf §4.2, §5.2, Tab. 1-3, 6].

## Metodo

### Inefficienza target (§2.1)

Per `T=32` frame e `n_v=196` token/frame su LLaVA-OneVision-7B la sequenza ha `T·n_v=6,270` token visivi contro `n_q≈20` token di testo. I FLOPs totali per `L` layer LLM scalano come `L·(4nd² + 2n²d + 2ndm)`, con `n=T·n_v+n_q`: il termine quadratico `2n²d` domina, e ridurre `T·n_v` è la leva principale [source: raw/papers/kim-2026-sink-token-aware-pruning.pdf §2.1, Eq. 1]. SToP è una tecnica training-free che si applica sopra a metodi di pruning esistenti senza fine-tuning.

### Diagnosi del fenomeno (§3)

- Su **EventHallusion** (LLaVA-OneVision-7B, 32 frame), rimuovere la componente di pruning *temporale* da Holitom (a budget di token costante, aumentando lo spatial pruning per compensare) provoca un crollo di accuratezza, mentre lo stesso intervento ha effetto modesto su MVBench (Fig. 2a). Lo studio della distribuzione dei token selezionati (Fig. 2b) rivela che senza temporal pruning un piccolo gruppo di patch viene selezionato in modo sproporzionatamente frequente [source: raw/papers/kim-2026-sink-token-aware-pruning.pdf §3.1].
- La visualizzazione patch-wise (Fig. 3) mostra che questi token hanno **attenzione alta persistente in coordinate spaziali fisse** lungo l'asse temporale, tipicamente in regioni di sfondo (corner inferiore sinistro: patch 154/155). Per analogia con i sink in [[transformer]] LLM (BOS, SEP), gli autori li chiamano **sink token** del visual encoder [source: raw/papers/kim-2026-sink-token-aware-pruning.pdf §3.2].
- Esperimento causale (Fig. 4 e Appendix B): rimuovendo selettivamente i sink token (top 10% per frequenza) dal set selezionato di VisionZip e sostituendoli con i token a più alta attenzione successiva, il performance drop su EventHallusion cala drasticamente, mentre l'MCQA migliora — conferma che sono **direttamente dannosi** per il fine-grained understanding [source: raw/papers/kim-2026-sink-token-aware-pruning.pdf §3.3].
- Holitom (temporal+spatial) seleziona l'**83% in meno** di sink token rispetto alla variante senza temporal pruning (384→66): il temporal pruning agisce come *sink-suppressor implicito*, perché i sink in zone di sfondo hanno alta similarità cosine tra frame adiacenti e quindi vengono mergeati [source: raw/papers/kim-2026-sink-token-aware-pruning.pdf §3.3].

### Sink score (§4.1)

Per il token visivo `i` (su `T` frame):

`ŝ_i = Σ_t A^t_i`, dove `A^t_i` è lo score di attenzione (column-wise mean della matrice CLS-equivalent SoftMax(QKᵀ/√d), Eq. 2) del token `i` nel frame `t`. Poi `s_i = MinMax-Norm(ŝ_i^w)` con `w=1.1` (Eq. 4). L'iperparametro `w>1` rende la distribuzione di `s_i` più sharp così da concentrare il penalty sui veri sink (Appendix C, Fig. 9, 10b).

### STSP — Sink-Token-aware Spatial Pruning (§4.2)

Modifica l'attention score usato per la selezione spaziale:

`Ã^t_i = A^t_i − μ_s · s_i` (Eq. 5)

con `μ_s ∈ {0.2, 0.3}` (VisionZip/FastVid). Il termine sottrattivo abbassa la priorità dei token con sink score alto: anche se l'attenzione cruda li sceglierebbe, ora cedono il posto a token genuinamente salienti.

### STTP — Sink-Token-aware Temporal Pruning (§4.2)

Modifica il criterio di temporal merging (Eq. 3 originale, basato su `sim(H^{i,t}_v, H^{i,t+1}_v)>τ`) aggiungendo un termine pro-pruning:

`P_t = { i | sim(H^{i,t}_v, H^{i,t+1}_v) + μ_t · s_i > τ }` (Eq. 6)

con `μ_t≈0.07` (Holitom). Il termine `μ_t·s_i` spinge i sink sopra soglia e li forza nel set di pruning anche quando la similarity cosine non basterebbe.

### Setup sperimentale (§5.1)

- Backbone: **LLaVA-OneVision-7B** (principale), **LLaVA-Video-7B**, **Qwen2.5-VL** (Appendix F).
- 32 frame, `32×196` token visivi, retention ratio in {10%, 15%, 20%}.
- Baseline integrate: **VisionZip** (spatial-only), **FastVid** (spatial-only density+attention), **Holitom** (temporal+spatial), **FlashVid** (ICLR'26, tree-based, Appendix D.2), confrontate con **PruneVid** (SOTA, feature-based).
- Hardware: NVIDIA A6000 48GB.

## Risultati chiave

### Fine-grained tasks su LLaVA-OneVision-7B, retention 10% (Tab. 1)

Performance Drop Rate (PDR) macro-medio relativo al modello vanilla:

- VisionZip baseline: **16.79%** → +SToP: **6.87%** (↓9.92pp).
- FastVid: **15.69%** → +SToP: **6.32%** (↓9.37pp).
- Holitom: **6.22%** → +SToP: **4.80%** (↓1.42pp).
- PruneVid: 9.22% (concorrente, non integra SToP).

EventHallusion-Binary 10% retention: vanilla 63.33 → VisionZip 50.37 → +SToP 60.39. EventHallusion-Desc 10%: vanilla 38.74 → VisionZip 28.15 → +SToP 36.09. VideoComp-ActivityNet 10%: vanilla 70.06 → FastVid 57.37 → +SToP 68.38.

### MCQA su LLaVA-OneVision-7B (Tab. 2)

A retention 10%, PDR macro-medio:

- VisionZip 7.36% → +SToP 3.34% (↓4.02pp).
- FastVid 5.12% → +SToP 2.90% (↓2.22pp).
- Holitom 3.21% → +SToP 2.02% (↓1.20pp).

MVBench: vanilla 58.54, VisionZip 10% scende a 54.16, +SToP risale a 57.34. VideoMME-Short: vanilla 71.22 → VisionZip 10% 61.00 → +SToP 65.67.

### Cross-backbone (Tab. 3, LLaVA-Video-7B)

A retention 10%: VisionZip PDR 26.46% → +SToP 7.04%; FastVid 19.66% → 9.66%; Holitom 5.27% → 1.58%. Il guadagno scala con la severità del baseline.

### Qwen2.5-VL (Tab. 8)

A retention 10% su EventHallusion: VisionZip overall 45.29 → +SToP 46.94; FastVid 46.13 → 47.24. Guadagno minore perché Qwen2.5-VL fa già merging interno (sopprime sink implicitamente).

### Argus benchmark (Tab. 7, retention 10%)

Hallucination (lower is better) — VisionZip 56.19 → +SToP 52.42; Omission — VisionZip 80.57 → +SToP 77.29.

### Few-frame inference (Fig. 6)

VisionZip+SToP a **16 frame** supera VisionZip baseline a **64 frame** su EventHallusion: SToP migliora il trade-off accuratezza/compute al punto da rendere ridondante quadruplicare i frame.

### Ablation (Tab. 4, retention 10%)

VisionZip senza/con STSP: PDR 20.46% → 4.64%. Holitom: baseline 3.87% → solo STSP 1.94% → STSP+STTP **1.17%** (best). STTP è complementare e non sostituibile a STSP.

### Confronto con approcci naive (Fig. 7)

Su VisionZip / EventHallusion:
- **Hard Pruning** (scartare top-K% di token più attesi prima del pruning) batte VisionZip nudo, con picco a K=10% — conferma che i top-attended sono spesso sink.
- **Attention Redistribution** (à la Kang et al. 2025, redistribuire l'attenzione dai sink ai restanti) è peggio sia di Hard Pruning sia di SToP, indicando che il punto non è ridistribuire ma proprio escludere i sink dalla selezione.

### Sensitività iperparametri (Appendix D.4)

`μ_s` ottimale ≈0.03 su VisionZip (oltre questa soglia compare over-penalization). `w` ottimale 1.1, stabile in [1.0,1.15]. `μ_t` ottimale 0.07 su Holitom. SToP è più sensibile a `μ_s` che a `w`.

## Limitazioni dichiarate

- SToP è specifico per **attention-based pruning**: non si applica direttamente a metodi *feature-based* come PruneVid o DivPrune perché questi non usano attention scores. Tuttavia, gli autori sostengono che SToP applicato a metodi attention-based supera comunque PruneVid feature-based (Appendix E).
- I guadagni sono più piccoli quando il baseline già sopprime implicitamente i sink (FlashVid con tree-merging, Qwen2.5-VL con merging interno).
- Future work: estendere il principio sink-aware al pruning feature-based identificando token con **feature di norma alta** e alta similarità che giocano un ruolo analogo nello spazio dei feature.

## Domande aperte / critiche

- Il sink score è calcolato come somma di attenzioni nel vision encoder, *prima* del LLM. Non è chiaro come si comporti se il vision encoder è soggetto a vincoli di quantizzazione (cfr. Kim et al. 2025 "Activation quantization needs prefixing registers") o se i sink shiftano con dimensioni di patch diverse.
- Tutti gli esperimenti usano 32 frame: che cosa accade con video lungo (>2 min, LongVideoBench, MLVU) e migliaia di frame? La somma temporale per definire `s_i` potrebbe diventare meno discriminativa.
- L'iperparametro `μ_s` ottimale cambia per backbone (0.3 VisionZip, 0.2 FastVid, 0.02 FlashVid, 0.03 ottimale teorico) — manca un meccanismo per sceglierlo senza grid search.
- Connessione con i lavori su **registers** (Darcet et al. 2023, Jiang et al. 2025) per i ViT: i sink identificati qui sono gli stessi token che i registers ([[vit-registers]]) cercherebbero di "assorbire"? Se sì, SToP è una sostituzione training-free.
- Il paper attribuisce il fenomeno a "central fixation bias" (Tatler 2007), cioè i salienti stanno al centro mentre i sink popolano lo sfondo — ipotesi non quantificata se non visivamente.

## Concetti citati

- [[video-llm]]
- [[visual-token-pruning]]
- [[spatial-pruning]]
- [[temporal-pruning]]
- [[attention-sink]]
- [[sink-token]]
- [[sink-score]]
- [[stsp]] (Sink-Token-aware Spatial Pruning)
- [[sttp]] (Sink-Token-aware Temporal Pruning)
- [[hallucination-evaluation]]
- [[event-hallusion]]
- [[videocomp]]
- [[vcg-bench]]
- [[mvbench]]
- [[video-mme]]
- [[next-qa]]
- [[longvideobench]]
- [[mlvu]]
- [[argus-benchmark]]
- [[llava-onevision]]
- [[llava-video]]
- [[qwen2-5-vl]]
- [[siglip]]
- [[visionzip]]
- [[fastvid]]
- [[holitom]]
- [[prunevid]]
- [[flashvid]]
- [[dycoke]]
- [[cls-token]]
- [[kv-cache]]
- [[vit-registers]]
- [[logit-lens]]
- [[fine-grained-video-understanding]]
- [[mcqa]]

## Citazioni dirette

> "we identify sink tokens — semantically uninformative tokens that attract excessive attention — as a key obstacle to fine-grained video understanding." (Abstract, p. 1)

> "high attention scores persist at fixed spatial coordinates throughout the temporal sequence … we refer to these spatially persistent high-attention tokens as sink tokens." (§3.2, p. 6)

> "temporal pruning reduces sink tokens by 83% (384 → 66)." (§3.3, p. 7)

> "Sink tokens in LLMs must be preserved to maintain softmax stability, whereas sink tokens in vision encoders should be actively pruned, as retaining them crowds out salient tokens and hinders fine-grained understanding." (Appendix A, p. 19)
