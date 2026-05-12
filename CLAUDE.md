# Research wiki — schema

> Schema for **this** wiki. Generic pattern: `~/.claude/skills/llm-wiki/SKILL.md`. When they disagree, this file wins.

## Domain

Wiki personale di **ricerca scientifica**. Raccoglie paper (principalmente via Zotero), articoli divulgativi, talk, report tecnici. Costruisce nel tempo pagine per entità (autori, lab, istituzioni, tool/dataset/benchmark) e concetti (idee, metodi, framework, problemi aperti), più sintesi cross-cutting (confronti, rassegne, tesi di lettura).

Lingua del wiki: **italiano** per le sintesi e i commenti dell'utente; **inglese** quando si citano direttamente passaggi originali dei paper. I titoli delle pagine seguono la lingua più naturale per l'entità/concetto (es. nomi propri non si traducono).

## Integrazione Zotero

La libreria Zotero dell'utente è la fonte primaria. Lo skill `zotero` (`~/.claude/skills/zotero/SKILL.md`) gestisce l'accesso. Quando l'utente dice "ingest paper X":

1. Risolvi il paper via `zotero --pdf <DOI | itemKey>` per ottenere il path locale del PDF.
2. **Copia** (non spostare) il PDF dentro `raw/papers/` con uno slug kebab-case basato su `<autore>-<anno>-<titolo-corto>.pdf`. Se la copia è già presente, riusa.
3. Procedi con il workflow standard di ingest sotto.
4. Nella frontmatter della pagina `wiki/sources/<slug>.md` includi sia `source_path: raw/papers/<slug>.pdf` sia `zotero_key: <itemKey>` e `doi: <doi>` per poter risalire al record Zotero.

Per aggiungere un paper *nuovo* alla libreria prima di ingestirlo, usa `zotero --collection "<nome>" <DOI>` (vedi skill Zotero per dettagli; preferisci sempre il DOI al titolo, normalizza DOI arXiv con `arXiv` maiuscolo).

## Directory layout

```
.
├── CLAUDE.md
├── README.md
├── raw/
│   ├── papers/        # PDF copiati da Zotero (vedi sopra)
│   ├── articles/      # web articles, blog, report non-paper
│   ├── transcripts/   # talk, podcast, interviste
│   └── assets/        # immagini, figure
└── wiki/
    ├── index.md
    ├── log.md
    ├── entities/      # autori, lab, istituzioni, tool, dataset, benchmark
    ├── concepts/      # idee, metodi, problemi, framework
    ├── sources/       # una pagina riassunto per ogni fonte ingerita
    └── syntheses/     # confronti, rassegne, risposte filed-back
```

## Page format

Frontmatter YAML obbligatoria su ogni pagina:

```yaml
---
title: <Titolo leggibile>
type: entity | concept | source | synthesis
tags: [...]
created: YYYY-MM-DD
updated: YYYY-MM-DD
# solo type=source:
source_path: raw/papers/<slug>.pdf
source_kind: paper | article | transcript | report
source_date: <data pubblicazione>
doi: <doi se applicabile>
zotero_key: <itemKey se da Zotero>
venue: <conference/journal>
authors: [<author1>, <author2>]
year: <YYYY>
---
```

Sezioni per tipo:

- **source (paper)**: TL;DR (1 paragrafo) → Contributo principale (1-3 bullet) → Metodo → Risultati chiave (con numeri e tabelle quando rilevanti) → Limitazioni dichiarate dagli autori → Domande aperte / critiche → Entità citate (link) → Concetti citati (link). Le quote dirette includono numero di pagina/sezione: `> "..." (§3.2, p. 7)`.
- **entity**: 1 paragrafo di definizione → Cosa sappiamo (bullet, ciascuno con `[source: raw/papers/...]`) → Relazioni (`[[link]]` ad altre entità/concetti) → Contraddizioni (se presenti) → Sources (backlinks auto-raccolti).
- **concept**: 1 paragrafo di definizione → Claim chiave con citazioni → Concetti/entità collegate → Domande aperte → Sources.
- **synthesis**: domanda/tesi in cima → argomentazione con citazioni → verdetto/risposta → fonti utilizzate.

## Citation rules

- Link interni: `[[entity-slug]]` o `[[concepts/foo]]` per disambiguazione.
- Citazioni di fonte inline a fine claim: `… come mostrato in [source: raw/papers/vaswani-2017-attention.pdf]`. Per paper con DOI, opzionalmente aggiungi anche `[doi:10.xxxx/...]`.
- Contraddizioni: `> ⚠ Contradicts [[other-source]]: <spiegazione in una riga>`.

## Convenzioni operative specifiche di questo wiki

1. **Una fonte alla volta.** Discutere takeaways con l'utente prima di scrivere — niente batch silenziosi salvo richiesta esplicita.
2. **Pagine entità autore**: includere affiliazione corrente, principali lab/coautori, link a Google Scholar/Semantic Scholar quando noto. Non inventare dati biografici non presenti nelle fonti.
3. **Numeri e formule**: preservare con cura. Quando una claim si appoggia a un numero specifico (accuracy, FLOPs, parametri), citare la tabella o sezione esatta.
4. **Open questions** vivono sia nella pagina della fonte sia nell'indice (sezione "Open questions").
5. **Git**: ogni ingest produce un commit a sé con messaggio `ingest: <Author> (<Year>) — <Short Title>`. Lint passes: `lint: <date> — <high-level summary>`. Init/refactor strutturali: messaggi descrittivi liberi.

## Workflow di ingest (questo wiki)

1. Risolvi PDF via Zotero se serve (`zotero --pdf <DOI | key>`), copia in `raw/papers/`.
2. Leggi il paper end-to-end (per PDF >10 pagine, leggi a range di pagine).
3. Discuti 3-6 takeaway con l'utente prima di scrivere.
4. Scrivi `wiki/sources/<slug>.md` (formato paper sopra).
5. Per ogni entità/concetto citato: aggiorna pagina esistente o crea stub.
6. Aggiorna `wiki/index.md`.
7. Appendi a `wiki/log.md`: `## [YYYY-MM-DD] ingest | <Author> (<Year>) — <Title>` + bullet pagine toccate.
8. `git add -A && git commit -m "ingest: <Author> (<Year>) — <Short Title>"`.

## Workflow di query

1. Leggi prima `wiki/index.md`.
2. Leggi le pagine candidate (e le loro vicine).
3. Rispondi con `[[wikilink]]` e citazioni inline.
4. Proponi di archiviare risposte sostanziose come `wiki/syntheses/<slug>.md`.

## Workflow di lint

Su richiesta. Check: orphan, stub, link rotti, contraddizioni, pagine mancanti (entità/concetti citati ≥3 volte senza pagina propria), drift dell'indice, gap di dati. Output: un report unico; attendere approvazione prima di applicare.

## Conventions

- Date: ISO 8601 (`2026-05-12`).
- Slugs: kebab-case ASCII; per paper: `<autore-cognome>-<anno>-<titolo-corto>` (es. `vaswani-2017-attention`).
- Niente emoji nel contenuto del wiki.
- L'utente legge in Obsidian — markdown Obsidian-compatible, wikilink `[[...]]`.
