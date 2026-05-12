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
