# research-wiki

LLM-maintained wiki for scientific research. Integrated with Zotero.

- `raw/` — immutable sources (PDFs copied from Zotero, articles, transcripts).
- `wiki/` — pages generated and maintained by the LLM.
- `CLAUDE.md` — schema specific to this wiki.

General pattern: `~/.claude/skills/llm-wiki/SKILL.md`. Original idea: `~/llm-wiki.md`.

## Quick usage

- **Ingest Zotero paper**: "ingest paper DOI ..." → the agent resolves via `zotero --pdf`, copies into `raw/papers/`, writes `wiki/sources/<slug>.md`, updates entities/concepts, index, and log.
- **Query**: "what does the wiki say about X" → the agent reads `wiki/index.md` and drills into the relevant pages.
- **Lint**: "lint the wiki" → report of orphans/contradictions/gaps.

## Reading

Open this folder as an Obsidian vault. The graph view reveals hubs and orphans. `[[wikilinks]]` work natively.
