---
title: Log
type: log
---

# Log

Record cronologico append-only degli eventi del wiki. Ogni entry inizia con `## [YYYY-MM-DD] <op> | <title>` per essere grep-abile: `grep "^## \[" log.md | tail -10`.

Operazioni: `init`, `ingest`, `query` (solo se filed-back), `lint`, `refactor`.

---

## [2026-05-12] init | research-wiki

- Domain: ricerca scientifica, integrato con Zotero.
- Scaffold creato: `CLAUDE.md`, `README.md`, `raw/{papers,articles,transcripts,assets}`, `wiki/{entities,concepts,sources,syntheses,index.md,log.md}`.
- Schema definito in `CLAUDE.md` con workflow di ingest specifico per paper Zotero.
- Repo git inizializzato.

## [2026-05-15] ingest | Vaswani et al. (2017) — Attention Is All You Need

Prima fonte ingerita nel wiki. PDF risolto da Zotero (collection `Scalable`, itemKey `DRW67HKR`, DOI `10.48550/arXiv.1706.03762`) — l'HTTP server di Zotero non era raggiungibile da WSL2, fallback su lettura diretta di `zotero.sqlite` per individuare l'attachment in `storage/4PGT92VK/`. PDF copiato in `raw/papers/vaswani-2017-attention.pdf` (15 pagine, ~2.2 MB).

Pagine create:

- `wiki/sources/vaswani-2017-attention.md`
- `wiki/concepts/`: `transformer.md`, `self-attention.md`, `scaled-dot-product-attention.md`, `multi-head-attention.md`, `positional-encoding.md`, `encoder-decoder-architecture.md`, `sequence-transduction.md`, `layer-normalization.md`, `byte-pair-encoding.md`, `label-smoothing.md`, `bleu.md`
- `wiki/entities/`: `ashish-vaswani.md`, `noam-shazeer.md`, `niki-parmar.md`, `jakob-uszkoreit.md`, `llion-jones.md`, `aidan-gomez.md`, `lukasz-kaiser.md`, `illia-polosukhin.md`, `google-brain.md`, `google-research.md`, `tensor2tensor.md`, `wmt-2014.md`, `penn-treebank.md`

Pagine aggiornate: `wiki/index.md` (popolato sources/entities/concepts/open-questions).

Contraddizioni rilevate: nessuna (prima fonte). Open questions filed in `index.md`.
