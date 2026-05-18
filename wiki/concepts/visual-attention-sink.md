---
title: Visual Attention Sink
type: concept
tags: [attention-sink, mllm, video-llm, visual-tokens, interpretability]
created: 2026-05-15
updated: 2026-05-15
---

# Visual Attention Sink

Estensione del fenomeno [[attention-sink]] ai **token visivi** nei Multimodal LLM: un piccolo sottoinsieme di token visivi — tipicamente patch di **sfondo spazialmente persistenti** lungo l'asse temporale o costanti in posizione — riceve attenzione altissima ma trasporta semantica quasi nulla. Comportamento analogo al BOS/SEP token degli LLM testuali ma localizzato nel grid visivo. Documentato nel video encoder dei Video LLM da Kim et al. (2026) e nei multimodal token (text + image) dei MLLM da Morini et al. (2026), che cita Kang et al. 2026 ("Visual Attention Sink in MLLM") e [[gu-2024-attention-sink]] come fondamento [source: raw/papers/kim-2026-sink-token-aware-pruning.pdf §3.2; raw/papers/morini-2026-look-twice.pdf §3.2].

## Claim chiave / Tecnica

- **Persistenza spaziale** (Kim 2026): la visualizzazione patch-wise (Fig. 3) mostra che i sink token visivi hanno **attenzione alta persistente in coordinate spaziali fisse** lungo l'asse temporale, tipicamente in regioni di sfondo (es. corner inferiore sinistro: patch 154/155 su LLaVA-OneVision-7B). Per analogia con i sink in [[transformer]] LLM (BOS, SEP), Kim et al. li chiamano *sink token* del visual encoder [source: raw/papers/kim-2026-sink-token-aware-pruning.pdf §3.2].
- **Sink score** (Kim 2026): per il token visivo `i` su `T` frame: `ŝ_i = Σ_t A^t_i` (somma temporale delle attention column-wise mean), poi `s_i = MinMax-Norm(ŝ_i^w)` con `w=1.1` per sharpening. L'iperparametro `w>1` rende la distribuzione di `s_i` più sharp così da concentrare il penalty sui veri sink [source: raw/papers/kim-2026-sink-token-aware-pruning.pdf §4.1, Eq. 4].
- **Test causale** (Kim 2026): rimuovendo selettivamente i sink token (top 10% per frequenza) dal set selezionato di VisionZip e sostituendoli con i token a più alta attenzione successiva, il performance drop su EventHallusion cala drasticamente, mentre l'MCQA migliora — conferma che i sink sono **direttamente dannosi** per il fine-grained understanding [source: raw/papers/kim-2026-sink-token-aware-pruning.pdf §3.3].
- **Temporal pruning come sink-suppressor implicito**: Holitom (temporal+spatial pruning) seleziona l'**83% in meno** di sink token rispetto alla variante senza temporal pruning (384 → 66): i sink in zone di sfondo hanno alta similarity cosine fra frame adiacenti e quindi vengono *mergeati* dal temporal pruning [source: raw/papers/kim-2026-sink-token-aware-pruning.pdf §3.3].
- **Manifestazione MLLM (Morini 2026)**: in LoT, alcuni token visivi attivano massicciamente le stesse `D_sink` dimensioni dell'hidden state che il BOS attiva (prototipo sink testuale). Score di sink:
  ```
  s_sink = (1/|L_sink|) Σ_{ℓ ∈ L_sink} max_{m ∈ D_sink} |H^ℓ_V[:,m]| / ‖H^ℓ_V‖_row
  ```
  Token con `s_sink > τ` (default: 25° percentile) vengono **azzerati** nel pass di analysis attention. Il filtering è applicato *solo* al pass di analisi; la generazione finale usa le attention non filtrate [source: raw/papers/morini-2026-look-twice.pdf §3.2, Eq. 3].

## Varianti / Estensioni

- **STSP — Sink-Token-aware Spatial Pruning** (Kim 2026): modifica score `Ã^t_i = A^t_i − μ_s · s_i` con `μ_s ∈ {0.2, 0.3}` per VisionZip/FastVid.
- **STTP — Sink-Token-aware Temporal Pruning** (Kim 2026): aggiunge `μ_t·s_i ≈ 0.07` al criterio di temporal merging per forzare i sink nel set di pruning.
- **Multi-layer sink filtering** (Morini 2026): basato su `D_sink` dell'hidden state, non sui pesi di attention — definizione diversa da Kim 2026 ma stesso obiettivo.
- **Tipologia**: il sink visivo include patch di sfondo, padding patch dei VLM "vintage" con fixed-resolution, ed eventualmente i registers token (Darcet 2023, citati in Kim 2026).

## Concetti correlati

- [[attention-sink]] — fenomeno parent, originariamente osservato nei LLM puri.
- [[visual-token-pruning]] — famiglia target dell'intervento sink-aware.
- [[evidence-highlighting]] — Morini 2026 lo usa per **filtrare** i sink prima di calcolare la regione visiva rilevante.
- [[kv-cache]] — sink visivi sono un caso speciale di "token che vanno mantenuti o evictati con priorità diversa".

## Sources

- [[kim-2026-sink-token-aware-pruning]] — definisce sink token visivi, sink score, STSP/STTP.
- [[morini-2026-look-twice]] — usa multi-layer sink filtering basato su `D_sink` per evidence highlighting in MLLM.
