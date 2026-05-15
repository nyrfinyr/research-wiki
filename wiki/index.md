---
title: Index
type: index
updated: 2026-05-15
---

# Index

Catalogo di tutte le pagine del wiki. L'LLM lo aggiorna a ogni ingest. Leggi questo per primo quando rispondi a una query.

## Sources

<!-- Una riga per fonte. Format: `- [[sources/<slug>]] — <one-line> · <YYYY-MM-DD>` -->

- [[sources/vaswani-2017-attention]] — Transformer: prima architettura di sequence transduction interamente basata su attention; SOTA su WMT 2014 EN-DE/EN-FR · 2026-05-15

## Entities

<!-- Autori, lab, istituzioni, tool, dataset, benchmark. -->

### Autori

- [[entities/ashish-vaswani]] — primo autore Transformer, Google Brain (2017)
- [[entities/noam-shazeer]] — ideatore di scaled dot-product e multi-head attention, Google Brain
- [[entities/niki-parmar]] — Google Research, contributo a tensor2tensor e model variants
- [[entities/jakob-uszkoreit]] — Google Research; propose per primo di sostituire RNN con self-attention
- [[entities/llion-jones]] — Google Research; codebase iniziale, efficient inference, visualizzazioni
- [[entities/aidan-gomez]] — University of Toronto / Google Brain; co-implementatore tensor2tensor
- [[entities/lukasz-kaiser]] — Google Brain; co-implementatore tensor2tensor
- [[entities/illia-polosukhin]] — co-progettista dei primi modelli Transformer (ex Google Research)

### Lab / organizzazioni

- [[entities/google-brain]]
- [[entities/google-research]]

### Tool

- [[entities/tensor2tensor]] — codebase TF per seq2seq, usata in Vaswani 2017

### Dataset / benchmark

- [[entities/wmt-2014]] — benchmark MT EN-DE / EN-FR
- [[entities/penn-treebank]] — benchmark constituency parsing inglese (WSJ)

## Concepts

<!-- Idee, metodi, framework, problemi. -->

- [[concepts/transformer]] — architettura encoder-decoder interamente basata su attention
- [[concepts/self-attention]] — intra-attention, base computazionale del Transformer
- [[concepts/scaled-dot-product-attention]] — `softmax(QKᵀ/√d_k)V`
- [[concepts/multi-head-attention]] — h teste in parallelo su sottospazi proiettati
- [[concepts/positional-encoding]] — encoding sinusoidale di posizione
- [[concepts/encoder-decoder-architecture]] — schema standard seq2seq
- [[concepts/sequence-transduction]] — classe di problemi sequence-to-sequence
- [[concepts/layer-normalization]] — normalizzazione per feature
- [[concepts/byte-pair-encoding]] — tokenizzazione sub-word
- [[concepts/label-smoothing]] — regolarizzazione del target
- [[concepts/bleu]] — metrica MT n-gram-based

## Syntheses

<!-- Confronti, rassegne, risposte filed-back. -->

_(none yet)_

## Open questions

<!-- Domande aperte raccolte dagli ingest e dai lint. -->

- **Self-attention su sequenze lunghe** — il costo O(n²·d) è il principale limite del Transformer; gli autori propongono restricted self-attention con neighborhood `r` come future work [[vaswani-2017-attention]] §4, §7. Aperto: quali approssimazioni mantengono la qualità?
- **Generazione meno sequenziale** — la decodifica auto-regressiva limita la parallelizzazione a inference; future work dichiarato in §7 di [[vaswani-2017-attention]].
- **Stabilità del training senza warmup** — il paper usa Adam + warmup 4000 step; relazione tra `d_model`, learning rate e profondità non analizzata sistematicamente.
- **Interpretabilità delle teste** — accenni qualitativi in §4 ("syntactic and semantic structure"), nessuna analisi quantitativa.
- **Estensione a modalità non testuali** — future work dichiarato (immagini, audio, video).
