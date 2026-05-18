---
title: Log
type: log
---

# Log

Append-only chronological record of wiki events. Each entry begins with `## [YYYY-MM-DD] <op> | <title>` to be greppable: `grep "^## \[" log.md | tail -10`.

Operations: `init`, `ingest`, `query` (only if filed-back), `lint`, `refactor`.

---

## [2026-05-12] init | research-wiki

- Domain: scientific research, integrated with Zotero.
- Scaffold created: `CLAUDE.md`, `README.md`, `raw/{papers,articles,transcripts,assets}`, `wiki/{entities,concepts,sources,syntheses,index.md,log.md}`.
- Schema defined in `CLAUDE.md` with an ingest workflow specific to Zotero papers.
- Git repo initialized.

## [2026-05-15] ingest | Vaswani et al. (2017) — Attention Is All You Need

First source ingested into the wiki. PDF resolved from Zotero (collection `Scalable`, itemKey `DRW67HKR`, DOI `10.48550/arXiv.1706.03762`) — Zotero's HTTP server was not reachable from WSL2, fallback to direct read of `zotero.sqlite` to locate the attachment in `storage/4PGT92VK/`. PDF copied to `raw/papers/vaswani-2017-attention.pdf` (15 pages, ~2.2 MB).

Pages created:

- `wiki/sources/vaswani-2017-attention.md`
- `wiki/concepts/`: `transformer.md`, `self-attention.md`, `scaled-dot-product-attention.md`, `multi-head-attention.md`, `positional-encoding.md`, `encoder-decoder-architecture.md`, `sequence-transduction.md`, `layer-normalization.md`, `byte-pair-encoding.md`, `label-smoothing.md`, `bleu.md`
- `wiki/entities/`: `ashish-vaswani.md`, `noam-shazeer.md`, `niki-parmar.md`, `jakob-uszkoreit.md`, `llion-jones.md`, `aidan-gomez.md`, `lukasz-kaiser.md`, `illia-polosukhin.md`, `google-brain.md`, `google-research.md`, `tensor2tensor.md`, `wmt-2014.md`, `penn-treebank.md`

Pages updated: `wiki/index.md` (populated sources/entities/concepts/open-questions).

Contradictions detected: none (first source). Open questions filed in `index.md`.

## [2026-05-18] query | extending Look Twice to Video-VQA (synthesis filed-back)

Discussion of a research direction: applying the LoT method ([[sources/morini-2026-look-twice]]) to Video-VQA, taking into account Map the Flow, SToP, SelfElicit, and Qwen2.5/3-VL. None of these sources is ingested yet; the synthesis was written from direct reads of the PDFs in `raw/papers/`.

Pages created:

- `wiki/syntheses/extending-look-twice-to-video-vqa.md`

Pages updated:

- `wiki/index.md` (added entry under Syntheses, bumped `updated`).

Dangling wikilinks intentionally left: `sources/morini-2026-look-twice`, `sources/kim-2026-map-the-flow`, `sources/kim-2026-sink-token-aware-pruning`, `sources/liu-2025-selfelicit`, `concepts/qwen2-5-vl`, `concepts/qwen3-vl` — to be resolved when the corresponding sources are ingested.

## [2026-05-18] refactor | resync after discovering index drift

While preparing to re-ingest the six papers cited in `syntheses/extending-look-twice-to-video-vqa.md`, found that **all six source pages already exist** in `wiki/sources/` (morini-2026-look-twice, kim-2025-map-the-flow, kim-2026-sink-token-aware-pruning, liu-2025-selfelicit, qwen2-5-vl-2025-tech-report, qwen3-vl-2025-tech-report), and most of the related concept pages exist too (look-twice, map-the-flow, stsp, self-elicit, qwen2-5-vl, evidence-highlighting, attention-sink, visual-token-pruning, mechanistic-interpretability, attention-knockout, logit-lens, video-llm, ...). The previous log entry was wrong on this point. The actual `wiki/sources/` directory holds 22 sources and `wiki/concepts/` holds ~150 concepts vs. the handful listed in `index.md` — the index is severely out of sync (created during the Vaswani ingest and not maintained since).

Pages created:

- `wiki/concepts/qwen3-vl.md` (was the only genuinely missing page among the synthesis's wikilinks).

Pages updated:

- `wiki/syntheses/extending-look-twice-to-video-vqa.md` — fixed `kim-2026-map-the-flow` → `kim-2025-map-the-flow`; replaced the (incorrect) "none of these is ingested" disclaimer with proper links to the existing source pages; added `revised:` frontmatter field.
- `wiki/index.md` — added the six cited source entries under "Sources"; added a note flagging the broader index drift (full resync requires a lint pass).

No new ingest performed. A `lint` pass is recommended to (a) fully repopulate `index.md` Sources / Concepts / Open questions sections from the filesystem, (b) check orphans / dangling links across the now-larger wiki, (c) reconcile the legacy `entities/` directory (pre-dating the no-entity-pages rule) with the current schema.
