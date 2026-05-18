---
title: Chain-of-Thought (CoT)
type: concept
tags: [prompting, reasoning, llm, inference-time]
created: 2026-05-15
updated: 2026-05-15
---

# Chain-of-Thought (CoT)

Tecnica di prompting (Wei et al. 2022) in cui il modello viene istruito a generare **passaggi intermedi di ragionamento esplicito** prima della risposta finale. Sposta capacità di reasoning dal pre-training all'**inferenza** ed è il prototipo della famiglia [[inference-time-scaling]]. È diventata uno *strumento standard* sia come baseline di confronto sia come ingrediente di pipeline di post-training (rejection sampling di traiettorie CoT, SFT su CoT data, RL su preferenze CoT) [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.3].

## Claim chiave / Tecnica

- **Prototipo dell'inference-time scaling**: dare al modello "spazio per pensare" sotto forma di token intermedi è il template della famiglia che include self-consistency, search-based decoding e [[arnab-2025-temporal-chain-of-thought|TCoT]] [source: raw/papers/arnab-2025-temporal-chain-of-thought.pdf §1, §3].
- **Effetto non monotono nei VLM**: nel benchmark MVBench (Li et al. 2024), CoT è stato testato come prompt strategy ed è risultato **peggiorativo** (Tab. 14): il modello produce ragionamento testuale ma perde grounding sui frame video [source: raw/papers/li-2024-mvbench.md §risultati Tab. 14]. Anche LLoVi (Zhang 2024) usa CoT come baseline di confronto rispetto al suo multi-round summarization [source: raw/papers/zhang-2024-llovi.md §confronti].
- **Baseline per evidence-highlighting**: SelfElicit (Liu 2025) batte CoT di **+5.0%-11.7% EM/F1** su HotpotQA/NewsQA/TriviaQA/NQ usando solo 1 extra token al posto di una catena di reasoning verbale [source: raw/papers/liu-2025-selfelicit.pdf §1, §4.2, Tab. 1].
- **Componente di post-training per Qwen-VL**: Qwen2.5-VL usa **rejection sampling** sui CoT generati durante l'SFT per migliorare il reasoning visivo; Qwen3-VL bifurca le versioni "instruct" e "thinking", quest'ultima con CoT esteso fino a 81 920 token (AIME-25, HMMT-25, LiveCodeBench) [source: raw/papers/qwen2-5-vl-2025-tech-report.pdf §2.3; raw/papers/qwen3-vl-2025-tech-report.pdf §5.11].
- **Generalizzazione spaziale → temporale**: TCoT applica l'idea CoT a video QA, dove i "visual thoughts" sono frame ID selezionati e una justification testuale ⇒ il modello "pensa per frame" prima di rispondere [source: raw/papers/arnab-2025-temporal-chain-of-thought.pdf §3.2, Fig. 3].

## Varianti / Estensioni

- **Self-consistency**: si sample-no più catene e si vota la risposta più frequente. TCoT mostra che self-consistency CoT è **inefficace** su LVBench (≈51 vs Dynamic-Segment TCoT 61.7) [source: raw/papers/arnab-2025-temporal-chain-of-thought.pdf §4.2].
- **Plan-and-solve**: scompone in piano + esecuzione; usato come baseline da LLoVi.
- **Multi-round summarization**: variante non-CoT che decompone il problema con sintesi iterative (LLoVi) [source: raw/papers/zhang-2024-llovi.md].
- **TCoT (Temporal CoT)**: la versione video — context aggregation `G(x,q)` + answering `H(G(x,q), q)` con lo stesso VLM [source: raw/papers/arnab-2025-temporal-chain-of-thought.pdf §3.2].

## Concetti correlati

- [[inference-time-scaling]] — paradigma di cui CoT è il prototipo storico.
- [[evidence-highlighting]] — alternativa attention-based che batte CoT con overhead minore.
- [[supervised-fine-tuning]] — CoT data sono spesso il target dell'SFT.
- [[direct-preference-optimization]] — DPO può apprendere preferenze fra traiettorie CoT.

## Sources

- [[arnab-2025-temporal-chain-of-thought]] — estende CoT al dominio video con frame selection.
- [[li-2024-mvbench]] — riporta che CoT peggiora sui task MVBench (Tab. 14).
- [[liu-2025-selfelicit]] — usa CoT come baseline; SelfElicit la batte di +5-11pp.
- [[zhang-2024-llovi]] — confronta multi-round summarization con CoT.
- [[qwen2-5-vl-2025-tech-report]] — CoT come asse del post-training (rejection sampling).
- [[qwen3-vl-2025-tech-report]] — CoT esteso per la variante "thinking".
