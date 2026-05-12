# research-wiki

Wiki LLM-maintained di ricerca scientifica. Integrato con Zotero.

- `raw/` — fonti immutabili (PDF copiati da Zotero, articoli, transcript).
- `wiki/` — pagine generate e mantenute dall'LLM.
- `CLAUDE.md` — schema specifico di questo wiki.

Pattern generale: `~/.claude/skills/llm-wiki/SKILL.md`. Idea originale: `~/llm-wiki.md`.

## Uso rapido

- **Ingest paper Zotero**: "ingest paper DOI ..." → l'agente risolve via `zotero --pdf`, copia in `raw/papers/`, scrive `wiki/sources/<slug>.md`, aggiorna entità/concetti, indice e log.
- **Query**: "cosa dice il wiki su X" → l'agente legge `wiki/index.md` e drilla nelle pagine pertinenti.
- **Lint**: "lint del wiki" → report di orphan/contraddizioni/gap.

## Lettura

Apri questa cartella come vault Obsidian. La graph view rivela hub e orphan. I `[[wikilinks]]` funzionano nativamente.
