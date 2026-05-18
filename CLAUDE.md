# Research wiki — schema

> Schema for **this** wiki. Generic pattern: `~/.claude/skills/llm-wiki/SKILL.md`. When they disagree, this file wins.

## Domain

Personal wiki for **scientific research**. Collects papers (mainly via Zotero), popular articles, talks, technical reports. Over time it builds pages for concepts (ideas, methods, frameworks, open problems) and cross-cutting syntheses (comparisons, surveys, reading theses).

**No pages for authors or entities.** Authors live only in the `authors: [...]` frontmatter of source pages and in inline citations — never auto-create `entities/<author>.md` during ingest. If a page is needed for an organization, tool, or dataset, treat it as a concept under `concepts/`.

## Language

**The wiki is English-only.** Every page (sources, concepts, syntheses, the `index.md` landing page, `log.md`, this `CLAUDE.md`, and `README.md`) is written in English. Exceptions:

- Direct quotes from sources, inside `>` blockquotes, may stay in the source's original language.
- Proper names, paper titles, dataset names, and identifiers are not translated.

Even when the user discusses a source in Italian (or any other language), what lands on disk is English.

## Zotero integration

The user's Zotero library is the primary source. The `zotero` skill (`~/.claude/skills/zotero/SKILL.md`) handles access. When the user says "ingest paper X":

1. Resolve the paper via `zotero --pdf <DOI | itemKey>` to obtain the local PDF path.
2. **Copy** (don't move) the PDF into `raw/papers/` with a kebab-case slug based on `<author>-<year>-<short-title>.pdf`. If a copy already exists, reuse it.
3. Proceed with the standard ingest workflow below.
4. In the frontmatter of the `wiki/sources/<slug>.md` page include both `source_path: raw/papers/<slug>.pdf` and `zotero_key: <itemKey>` and `doi: <doi>` so the Zotero record can be traced back.

To add a *new* paper to the library before ingesting it, use `zotero --collection "<name>" <DOI>` (see the Zotero skill for details; always prefer DOI over title, normalize arXiv DOIs with capitalized `arXiv`).

## Directory layout

```
.
├── CLAUDE.md
├── README.md
├── raw/
│   ├── papers/        # PDFs copied from Zotero (see above)
│   ├── articles/      # web articles, blogs, non-paper reports
│   ├── transcripts/   # talks, podcasts, interviews
│   └── assets/        # images, figures
└── wiki/
    ├── index.md       # landing page only — NOT a catalog of pages (filesystem is the catalog)
    ├── log.md         # chronological event log
    ├── concepts/      # ideas, methods, problems, frameworks; tools/datasets treated as concepts
    ├── sources/       # one summary page per ingested source
    └── syntheses/     # comparisons, surveys, filed-back answers
```

**No hand-maintained index.** A previous version of this wiki kept a catalog of sources and concepts in `wiki/index.md`; it drifted badly out of sync with the filesystem and was replaced (2026-05-18) with a minimal landing page. The filesystem under `wiki/sources/`, `wiki/concepts/`, and `wiki/syntheses/` is the only authoritative listing.

## Page format

YAML frontmatter required on every page:

```yaml
---
title: <Human-readable English title>
type: concept | source | synthesis
tags: [...]
created: YYYY-MM-DD
updated: YYYY-MM-DD
# type=source only:
source_path: raw/papers/<slug>.pdf
source_kind: paper | article | transcript | report
source_date: <publication date>
doi: <doi if applicable>
zotero_key: <itemKey if from Zotero>
venue: <conference/journal>
authors: [<author1>, <author2>]
year: <YYYY>
---
```

Sections by type:

- **source (paper)**: TL;DR (1 paragraph) → Main contribution (1-3 bullets) → Method → Key results (with numbers and tables where relevant) → Limitations stated by the authors → Open questions / critiques → Concepts cited (links). Direct quotes include page/section number: `> "..." (§3.2, p. 7)`. Authors do not get a dedicated page: they remain only in the `authors:` frontmatter and inline citations.
- **concept**: 1 paragraph of definition → key claims with citations → related concepts → open questions → Sources.
- **synthesis**: question/thesis at the top → argument with citations → verdict/answer → sources used.

## Citation rules

- Internal links: `[[concept-slug]]` or `[[concepts/foo]]` for disambiguation.
- Inline source citations at the end of a claim: `… as shown in [source: raw/papers/vaswani-2017-attention.pdf]`. For papers with a DOI, optionally also add `[doi:10.xxxx/...]`.
- Contradictions: `> ⚠ Contradicts [[other-source]]: <one-line explanation>`.

## Operational conventions specific to this wiki

1. **One source at a time.** Discuss takeaways with the user before writing — no silent batches unless explicitly requested.
2. **No author pages.** Authors remain in the `authors:` frontmatter of source pages. Do not create `entities/<author>.md` or any other page for natural persons, unless explicitly requested by the user.
3. **Numbers and formulas**: preserve carefully. When a claim relies on a specific number (accuracy, FLOPs, parameters), cite the exact table or section.
4. **Open questions** live on the source or concept page that raises them. Do not maintain a separate open-questions list.
5. **Git**: every ingest produces a standalone commit with message `ingest: <Author> (<Year>) — <Short Title>`. Lint passes: `lint: <date> — <high-level summary>`. Init/structural refactors: free-form descriptive messages.

## Ingest workflow (this wiki)

1. Resolve PDF via Zotero if needed (`zotero --pdf <DOI | key>`), copy into `raw/papers/`.
2. Read the paper end-to-end (for PDFs >10 pages, read by page ranges).
3. Discuss 3-6 takeaways with the user before writing.
4. Write `wiki/sources/<slug>.md` (paper format above).
5. For each cited concept: update the existing page or create a stub. **Do not** create pages for authors (they stay only in the `authors:` frontmatter).
6. Append to `wiki/log.md`: `## [YYYY-MM-DD] ingest | <Author> (<Year>) — <Title>` + bullets for pages touched.
7. `git add -A && git commit -m "ingest: <Author> (<Year>) — <Short Title>"`.

`wiki/index.md` is a static landing page and is **not** updated on ingest.

## Query workflow

1. To find candidate pages, list the relevant directories: `ls wiki/sources/`, `ls wiki/concepts/`, `ls wiki/syntheses/`. The filesystem is the catalog. Skim `wiki/log.md` for recent ingests if temporal context matters.
2. Read candidate pages (and their neighbors).
3. Answer with `[[wikilink]]`s and inline citations.
4. Offer to archive substantial answers as `wiki/syntheses/<slug>.md`.

## Lint workflow

On request. Checks: orphans, stubs, broken links, contradictions, missing pages (concepts cited ≥3 times without their own page), index drift, data gaps. Output: a single report; wait for approval before applying.

## Conventions

- Dates: ISO 8601 (`2026-05-12`).
- Slugs: ASCII kebab-case; for papers: `<author-surname>-<year>-<short-title>` (e.g., `vaswani-2017-attention`).
- No emoji in wiki content.
- The user reads in Obsidian — Obsidian-compatible markdown, `[[...]]` wikilinks.
