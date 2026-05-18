---
title: ALiBi
type: concept
tags: [method, positional-encoding, attention, long-context]
created: 2026-05-16
updated: 2026-05-16
---

# ALiBi

ALiBi (Attention with Linear Biases) è uno schema di positional encoding che, invece di aggiungere embedding posizionali, somma direttamente al punteggio di attenzione un bias lineare proporzionale alla distanza fra query e key. Favorisce l'estrapolazione a sequenze più lunghe di quelle viste in training ed è quindi una baseline standard per il [[long-context]].

Nel wiki appare come termine di confronto nei lavori su [[attention-sink]] e [[sliding-window-attention]] insieme a [[rotary-position-embedding]].

## Sources

- [[gu-2024-attention-sink]] — citata fra le varianti di positional encoding
- [[fu-2025-sliding-window-attention]] — citata fra le varianti di positional encoding
