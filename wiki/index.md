---
title: Research wiki
type: landing
updated: 2026-05-18
---

# Research wiki

LLM-managed personal wiki for scientific research, populated through the `llm-wiki` skill workflow (init / ingest / query / lint). Schema and conventions live in [`../CLAUDE.md`](../CLAUDE.md).

## How to find things

**The filesystem is the catalog.** There is no manually-maintained listing — earlier attempts (a hand-curated index of sources and concepts) drifted badly out of sync and were removed. To find pages, list the relevant directory directly:

- **Source summaries** — one page per ingested paper / article / transcript / report — in `wiki/sources/`. Filename convention: `<author-surname>-<year>-<short-title>.md`.
- **Concepts** — ideas, methods, frameworks, open problems, tools, datasets, benchmarks, organisations — in `wiki/concepts/`. Filename convention: kebab-case English slug.
- **Syntheses** — cross-cutting analyses, comparisons, reading theses, filed-back query answers — in `wiki/syntheses/`.

For full-text search across the wiki, prefer reading whole pages over keyword `grep` — page structure carries meaning. Obsidian backlinks and the graph view work as expected on this directory.

## Operational log

Chronological record of `init` / `ingest` / `query` / `lint` / `refactor` events: [[log]].

## Open questions

Open questions live on the source and concept pages that raise them, not here. Grep across the wiki with `grep -rn "^## Open questions" wiki/` to enumerate them.
