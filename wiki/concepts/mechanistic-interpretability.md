---
title: Mechanistic Interpretability
type: concept
tags: [interpretability, probing, circuits, neural-networks]
created: 2026-05-15
updated: 2026-05-15
---

# Mechanistic Interpretability

Programma di ricerca che mira a fare **reverse-engineering** dei modelli neurali — non solo predire input/output o produrre saliency map, ma identificare i **circuiti interni** (head, edge di attention, gruppi di neuroni, pathway cross-layer) responsabili di una specifica computazione. Le tecniche-cardine sono *Attention Knockout / causal tracing* (Geva 2023, Meng 2022), *Logit Lens* (nostalgebraist 2020), *probing*, *direct logit attribution*. Nel mondo VLM/Video LLM è applicata da Kim, Kim & Han (2025) in "Map the Flow" per ricostruire il pipeline di temporal reasoning [source: raw/papers/kim-2025-map-the-flow.pdf §1, §2.2].

## Claim chiave / Tecnica

- **Attention Knockout** (Geva 2023, applicato da Kim 2025): per disabilitare il flusso di informazione da token sorgente `s` a token target `t` al layer `l`, si setta `M^l[s,t] = −∞` nella softmax dello [[scaled-dot-product-attention]]. Si misura la variazione percentuale relativa di probabilità della risposta `a`: `(p_knockout − p_base)/p_base × 100`. Window `k=9` layer centrata su `l` per evitare bypass via residual [source: raw/papers/kim-2025-map-the-flow.pdf §2.2, Eq. 1].
- **Logit Lens** (nostalgebraist 2020): proiezione dei hidden state dei token attraverso il **language-model head finale** ad ogni layer per visualizzare quali concepts "emergono" e dove. Kim 2025 lo usa per mostrare che (i) concepts spaziali emergono nei layer early sui token foreground, (ii) concepts temporali ("eat", "sit", "hold", "up", "down") emergono solo nei layer middle, su patch *residue* — il Video LLM **non sovrascrive** la rappresentazione spaziale ma la espande [source: raw/papers/kim-2025-map-the-flow.pdf §3.3, Fig. 5].
- **Pipeline trovata in Video LLM** (Kim 2025): pattern ricorrente in 4 stadi su 4 backbone (LLaVA-NeXT-7B/13B-Video-FT, Mini-InternVL-4B-Video-FT, VideoLLaMA3-7B):
  1. **Cross-frame interactions** (layer 1-16): token video formano rappresentazioni spaziotemporali.
  2. **Video-language integration** (layer 6-20): l'info video propaga selettivamente sui **temporal keyword** del prompt.
  3. **Concept emergence** (Logit Lens): spaziali early, temporali middle.
  4. **Answer generation** (layer 16-25): la prob. della true option *salta* attorno al layer 20.
- **Validazione causale (effective pathway pruning)**: tenendo solo gli edge attivi nei range identificati e disabilitando gli altri si conserva l'accuracy con **42-58% degli edge originali** (Tab. 3 di Kim 2025); random blocking dello stesso budget crolla di 30+ punti. VideoLLaMA3-7B addirittura **migliora** sopprimendo il 42% degli edge — i pathway non-efficaci agiscono come noise.
- **Effetto del fine-tuning su video**: la **cross-frame attention nei layer 1-16** è *causata* dal fine-tuning su video — assente in LLaVA-NeXT-7B image-only, presente in LLaVA-NeXT-7B-Video-FT dopo 3 epoche su VideoChat2-IT. Bloccarla causa drop fino a **−60.8%** su Object Count [source: raw/papers/kim-2025-map-the-flow.pdf §3.2, Tab. 2].
- **Failure mode interpretation**: sample sbagliati hanno due failure mode primari — (Case 1) cross-frame interaction *spurie* nei layer early, (Case 2) **static bias**, cioè collasso su evidenza scenica statica in assenza di cross-frame efficace. Quest'ultimo è plausibilmente legato all'[[attention-sink]] (shortcut language prior) ma non quantificato [source: raw/papers/kim-2025-map-the-flow.pdf §4, §domande aperte].

## Varianti / Estensioni

- **Causal Tracing** (Meng 2022): variante più sofisticata che identifica i ruoli causali di singoli neuroni / token.
- **Activation Patching**: sostituisce attivazioni intermedie con quelle di un input di riferimento.
- **Logit attribution / Probing**: tecniche complementari per quantificare contributo di layer/head.
- **Mech interp di VLM/MLLM**: campo emergente — Kim 2025 è uno dei primi a portarlo sui Video LLM in modo sistematico.

## Concetti correlati

- [[causal-attention-mask]] — Attention Knockout è una modulazione mirata della mask.
- [[attention-sink]] — fenomeno candidato a essere "static bias" identificato in Kim 2025.
- [[visual-token-pruning]] — Kim 2025 ipotizza complementarità (token pruning + edge pruning).
- [[evidence-highlighting]] — usa "attention come relevance" — primitiva imparentata con mech interp.

## Sources

- [[kim-2025-map-the-flow]] — applica Attention Knockout e Logit Lens ai Video LLM, ricostruisce pipeline di temporal reasoning a 4 stadi.
