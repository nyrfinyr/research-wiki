---
title: Sigmoid Attention
type: concept
tags: [attention, softmax-alternative, attention-sink, transformer]
created: 2026-05-15
updated: 2026-05-15
---

# Sigmoid Attention

Sostituzione della softmax con la **funzione sigmoide elemento per elemento** nei pesi di attention: `Attention(Q,K,V) = σ(QKᵀ/√d) V` invece di `softmax(QKᵀ/√d) V`. La differenza cruciale è l'assenza di **normalizzazione row-wise**: i pesi non devono sommare a 1 per riga, quindi l'attention diventa **densa** (tutti i token possono contribuire significativamente) e non sviluppa l'effetto winner-take-all dell'esponenziale. È stata proposta in versione "pulita" da Gu et al. (2024) come **rimedio architetturale all'[[attention-sink]]** e adottata da SWAT (Fu 2025) come componente centrale del layer di sliding window training [source: raw/papers/gu-2024-attention-sink.pdf §7.3-7.4; raw/papers/fu-2025-sliding-window-attention.pdf §3.2].

## Claim chiave / Tecnica

- **Eliminazione del sink in pre-training** (Gu et al.): sostituendo softmax con **sigmoid senza normalizzazione**, `Sink^ε_1 ≈ 0.44%` vs 18.18% del default; valid loss 3.70 vs 3.73 softmax — **sink non emerge** fino a 1B parametri. Stesso effetto con `elu+1 senza normalizzazione` o kernel MLP. **Mantenendo la normalizzazione** (sigmoid normalizzata) il sink ricompare ⇒ la causa profonda è la **normalizzazione**, non la softmax in sé [source: raw/papers/gu-2024-attention-sink.pdf §7.4, Tab. 6].
- **Doppio benefit per SWA** (Fu et al.): in SWAT la sigmoid serve a (1) **prevenire l'attention sink** propagato dalla varianza del primo token tramite normalizzazione, (2) **mantenere dense attention weights** che evitano l'**information loss della softmax** (es. logits `[1.5, 5.0, 2.4, 0.5, 1.3]` → softmax `[0.03, 0.88, 0.07, 0.01, 0.02]`) [source: raw/papers/fu-2025-sliding-window-attention.pdf §1, §2.2, §3.2].
- **Limiti pratici (instabilità senza positional bias)**: sigmoid puro su Vanilla 128/128 fallisce in Fu et al. (PPL 14.26 vs 5.51 softmax); serve combinarla con [[rotary-position-embedding]] e/o balanced ALiBi per stabilità [source: raw/papers/fu-2025-sliding-window-attention.pdf §4.4, Tab. 3, No.2].
- **Adozione open question**: validata fino a 760M (SWAT) / 1B (Gu); il comportamento a 7B / 70B / 235B (scale dei modelli production attuali) **non è ancora dimostrato** — Mistral, LLaMA, Qwen non l'hanno adottata [source: raw/papers/gu-2024-attention-sink.pdf §domande aperte].

### Formula confronto

| Variante | Pesi | Sink^ε_1 | Note |
|---|---|---|---|
| Softmax (default) | `softmax(QKᵀ/√d)` | ~18-99% | sink emerge sempre |
| Sigmoid normalizzata | `σ(QKᵀ/√d) / Σσ` | sink ricompare | normalizzazione = causa |
| **Sigmoid no-norm** | `σ(QKᵀ/√d)` | **≈ 0.44%** | sink non emerge |
| MLP kernel no-norm | `φ(Q)φ(K)ᵀ` | ≈ 0% | sink non emerge |

[source: raw/papers/gu-2024-attention-sink.pdf §7.4, Tab. 6]

## Varianti / Estensioni

- **SWAT layer** (Fu 2025): `σ(QKᵀ/√d + s·(m−n)) · V` con `m−n < ω` (sliding window), RoPE su Q,K, balanced ALiBi su `s` [source: raw/papers/fu-2025-sliding-window-attention.pdf §3.2, Eq. 5].
- **Linear attention kernel** (Katharopoulos 2020 e successori): `φ(Q)φ(K)ᵀ V` — anche senza normalizzazione il sink scompare; conferma indirettamente la tesi di Gu.

## Concetti correlati

- [[attention-sink]] — fenomeno che sigmoid-attention elimina alla radice.
- [[scaled-dot-product-attention]] — variante "canonica" sostituita da sigmoid.
- [[sliding-window-attention]] — SWAT combina sigmoid con window per long-context efficiente.
- [[kv-cache]] — un modello senza sink potrebbe rendere obsoleto l'anchoring di Streaming-LLM.

## Sources

- [[gu-2024-attention-sink]] — propone sigmoid-no-norm come rimedio architetturale al sink.
- [[fu-2025-sliding-window-attention]] — adotta sigmoid in SWAT, conferma direzionalmente Gu a 760M.
